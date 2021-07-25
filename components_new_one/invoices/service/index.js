


const fetchInvoices = async (params) => {

   const data =  await db.invoices.find({userId : params.userInfo._id},{metaData:0},{sort : {createdAt : -1},skip:params.skip,limit : params.limit})

   const totalRecords = await db.invoices.count({userId : params.userInfo._id})


    return {data : data,totalRecords:totalRecords}
}


exports.fetchInvoices = fetchInvoices