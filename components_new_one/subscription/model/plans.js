// plan model for storing plan details in local database

// changes to be made in the user model to accomodate the plan details

const plans = new mongoose.Schema({
planId:{type: String},
stripePlanId:{type:String},
planBenefit:{type: Number},
amount:{type:Number},
interval:{type: String},
intervalCount:{type: Number},
planName:{type: String},
currency:{type:String, default:"gbp"},
planStatus:{type:Number},
startTime:{type: Number},
endTime:{type: Number},
nickname:{type: String},
productId:{type: String},
planCreatedAt:{type: Number},
productName:{type: String},
planBenefits:{type:Number}, // or total Credits
isDeleted:{type: Boolean, default:false},
freeMsgCount:{type: Number},
freePvaCount:{type:Number},
totalCredits:{type: Number}








})


module.exports=plans