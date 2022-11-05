const express = require("express")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const moment = require("moment");
const { isDate } = require("moment");
const blogModel = require("./blogModel") 



const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema(
    {
        id: ObjectId,

        created_at: Date,

        first_name : 
        {type: String, required:true, },

        last_name : 
        {type:String, required:true, },

        email: 
         {type:String, required:true, unique:true},
        
        password :  
         {type: String, required:true},

        user_type: 
         { type : String, enum:['owner','reader'], default: 'reader'},
         
        posts: {type: Schema.Types.ObjectId, ref: "Blogs"}

      
    }
)

userSchema.pre('save', async function (next) {
      const hash = await bcrypt.hash(this.password, 10);
      this.password = hash;
      next()
        
    })


userSchema.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }

module.exports = mongoose.model("Users", userSchema);



