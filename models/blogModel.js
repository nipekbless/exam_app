const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const User = require("./userModel")


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const blogSchema = new Schema(
    {
        id: ObjectId,

        title: 
        {type: String, required: true, unique: true },

        description : 
        {type: String},

        author: 
         {type: Schema.Types.ObjectId, ref: "Users"},
        
        read_count :  
         {type: Number, default: 0},

        reading_time :  
         {type: String},
         
        tags :  
            {type: [String]},

        body:
        {type: String, required: true},

        state: 
         { type : String, enum:['draft','published'], default: 'draft'},

        date : 
         { type :Date, default: Date.now}

    }, { timestamps: true }
)


module.exports = mongoose.model("Blogs", blogSchema);