/** Stripe services **/

//const config = require('config').get('stripe')
//const stripe = require("stripe")("sk_test_QE4jFyyXCixuwR6q7jYZplRb")
const stripe = require("stripe")("sk_test_aEGZD6pzMRDdJHv07JlKUPIl00Wdt4f84W")
const stripeCurrency = "gbp" //config.stripeCurrency //gbp for UK
const webServer = require('config').get('webServer')
const path = require('path')
//const model=require('../../subscription/model/plans')






const createPlans = async (params) => {

    try {
        let info = await stripe.plans.create({

            amount: params.amount,
            interval: params.interval,
            interval_count: params.intervalCount,
            trial_period_days: params.trialPeriodDays,
            currency: "gbp",
            product: {
                name: params.productName,
                //nickname:params.nickname
            }
        })
        info1 = await stripe.products.update(info.product, {

            metadata: {
                planName: params.planName,
                amount: params.amount,
                interval: params.interval,
                interval_count: params.intervalCount,
                trial_period_days: params.trialPeriodDays,
                currency: "gbp",

            }


        })


        const obj = {
            //$set:{
            id: params.planName,
            planId: info.id,
            active: info.active,
            currency: "gbp",
            amount: info.amount,
            interval: info.interval,
            intervalCount: info.interval_count,
            productName: info.productName,
            planCreatedAt: params.planCreatedAt,
            planName: params.planName,
            planBenefits: params.planBenefits,
            totalCredits: params.planBenefits,
            isDeleted: false,
            freeMsgCount: params.freeMsgCount,
            freePvaCount: params.freePvaCount
            //nickname:info.nickname
            //  }
        }
        const data = await db.plans.findOneAndUpdate({ planId: info.id },
            obj, { upsert: true }
        )
        const data1 = await db.plans.findOne({ planId: info.id })
    } catch (err) {
        console.log("catch errrr, failure in creating the plans")
        throw err
    }


}




const createProduct = async (params) => {
    try {
        const products = await stripe.products.create({ name: params.productName, id: params.productName, type: "service" })

        return products
    } catch (err) {
        console.log("error in creating the plans")
        throw err
    }
}



const createSubscription = async (params) => {
    plan = await db.plans.findOne({ isEmployer : false});
    try {
        let plan;
        //create customer 
        const customer = await stripe.customers.create({
        email:params.userInfo.email,
        description: 'Customer for Shela',
        source: params.cardToken
        });
        //create charges
        if(customer){
            params.customer = customer;
            if( params.userInfo.userRole == "employee"){
                console.log('inside the if condition');
                plan = await db.plans.findOne({ isEmployer : false});
                params.plan = plan;
            }
            else{
                plan = await db.plans.findOne({ _id: params.planId })    
                params.plan = plan;
            }            
            const charge = await createCharge(params);
                charge.credits = plan.totalCredits;
                return charge;
        } 
    } catch (err) {
        throw err
    }

}

const createCharge = async (params) => {
    try {
        const data = await stripe.charges.create({
            amount: Math.round(params.plan.amount * 100),
            currency: stripeCurrency,
            customer: params.customer.id,
        })
        return data;
    } catch (err) {
        throw new Error(err.raw ? err.raw.message : "Something went wrong while making the payment ! Please try again later.")
    }
}



//update subscription


// delete subscription

//update payment source

const createCustomer = async (params) => {
    const data = await stripe.customers.create({ description: 'Customer for Shela', email: params.email })
    const info = await db.users.findOneAndUpdate({ _id: params._id }, { stripeCustomerId: data.id }, { new: true })

    return info;
}
const isPaid = async (params) => {
    let obj = {}
    try {
        const userInvoice = await db.invoices.find({ userId: params.userInfo._id }).sort({createdAt:-1});
        if(!userInvoice){
            return false;
        }
        const latestInvoiced = userInvoice[0].createdAt;
        const startDate = moment.unix(latestInvoiced).format('YYYY-MM-DD hh:mm:ss a');
        const latestDate = moment(startDate).add(24, 'hours').format('YYYY-MM-DD hh:mm:ss a');
        var endDate = moment(latestDate).unix();
        const currentDate = moment().unix();
        if(currentDate >= latestInvoiced  &&  currentDate <= endDate){
            obj = {isPaid: true}
        }else{
            obj = {isPaid: false}
        } 
        const updatedUser = await db.users.findOneAndUpdate({ _id: params.userInfo._id },obj,{new:true})
        return updatedUser.isPaid;
    } catch (err) {
        console.log("the get plans failed");
        throw err;
    }
}

const addCard = async (params) => {
    console.log('card token',params.cardToken);
    let newData = []
    try {
        if (params.userInfo.stripeCustomerId) { //If user already registered with stripe enter card
            var cardDetails = await stripe.customers.createSource(params.userInfo.stripeCustomerId, { source: params.cardToken })
        } else { //First create user with stripe and then store card details
            const data = await createCustomer(params.userInfo)

            params.userInfo.stripeCustomerId = data.stripeCustomerId
            var cardDetails = await stripe.customers.createSource(data.stripeCustomerId, { source: params.cardToken })
        }
        await db.users.findOneAndUpdate({ _id: params.userInfo._id }, { isCardDetailsAdded: true })
        logger.start("Set this card as default card of the user.")

        await stripe.customers.update(params.userInfo.stripeCustomerId, { default_source: cardDetails.id })

        //Fetch all cards of this user
        let allCards = await stripe.customers.retrieve(params.userInfo.stripeCustomerId)

        if (allCards.sources.data.length > 0) {

            allCards.sources.data.forEach(function(obj) { //To send the image of each card's brand & reducing the data object
                let objToSave = {
                    "id": obj.id,
                    "brand": obj.brand,
                    "object": obj.object,
                    "last4": obj.last4,
                    "fingerprint": obj.fingerprint,
                    "image": path.join(__dirname, '../../../assets/staticImages/')
                }
                objToSave.image = obj.brand == "Visa" ? objToSave.image + "visa.jpg" : obj.brand == "MasterCard" ? objToSave.image + "mastercard.jpg" : obj.brand == "American Express" ? objToSave.image + "amex.png" : "";
                newData.push(objToSave);
            });

            allCards.sources.data = newData;
            allCards.sources.total_count = newData.length;
            return allCards;
        } else return allCards

    } catch (err) {
        throw new Error(err.raw ? err.raw.message : "Something went wrong while saving the card ! Please try again later.")
    }
}

// amount:  Math.round(plan.amount * 100),
//                 currency: stripeCurrency,
//                 source: params.cardToken,


const createSource = async (params) => {
    try {
        if (!params.userInfo.stripeCustomerId) {
            const data = await createCustomer(params.userInfo)
            params.userInfo.stripeCustomerId = data.stripeCustomerId
        }

        const cardDetails = await stripe.customers.createSource(params.userInfo.stripeCustomerId, { source: params.cardToken })
        return cardDetails;

    } catch (err) {
        throw new Error(err.raw ? err.raw.message : "Something went wrong while saving the card ! Please try again later.")
    }
}






const webhooks = async (params) => {
    return "webhooks working"
}



const retreiveWebhook = async (params) => {
    return "retreive Webhook working"
}


const planCreated = async (params) => {
    return "plan Created Webhook working"
}




const fetchPlans = async (params) => {
    try {
        const plansDetails = await stripe.plans.list({ limit: 5 })
        let stripeReturnObject = []
        stripeReturnObject = plansDetails.data
        let obj = {}
        let res = []

        for (let i = 0; i < stripeReturnObject.length; i++) {
            obj = await db.plans.findOne({ planId: stripeReturnObject[i].id, isDeleted: false }, { planName: 1, amount: 1, interval: 1, intervalCount: 1, planBenefits: 1, planId: 1 })
            res[i] = obj

        }






       
        return res //plansDetails.data
    } catch (err) {
        console.log("error in fetching plans Details")
        throw err
    }
}



const editPlans = async (params) => {
    try {
        const editPlans = await stripe.plans.update(params.planId, {
            metadata: {
                planName: params.planName,
                amount: params.totalAmount,
                interval: params.interval,
                interval_count: params.intervalCount,
                trial_period_days: params.trialPeriodDays,
                currency: "gbp",


            }
        })



        return "working" //res //plansDetails.data
    } catch (err) {
        console.log("error in editing plans Details")
        throw err
    }
}











exports.webhooks = webhooks
exports.planCreated = planCreated

exports.retreiveWebhook = retreiveWebhook

exports.createCustomer = createCustomer
exports.addCard = addCard
exports.createCharge = createCharge
exports.createSource = createSource


// exports.refundPartialCharge = refundPartialCharge
// exports.refundFullCharge = refundFullCharge
// exports.addBankAccount = addBankAccount
// exports.listAllCards = listAllCards








exports.createProduct = createProduct
// exports.createPlans=createPlans
exports.createSubscription = createSubscription

exports.createPlans = createPlans
exports.fetchPlans = fetchPlans
exports.editPlans = editPlans 
exports.isPaid = isPaid 