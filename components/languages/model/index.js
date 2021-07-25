'use strict'


const languages = new mongoose.Schema({

    addedAt: { type: Number },
   
    name: { type: String },
    type: { type: String}
})

module.exports=languages