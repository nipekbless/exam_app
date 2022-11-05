const express = require("express")
const passport = require("passport")
require("../middleware/authMiddleware")
const BlogModel = require("../models/blogModel") 
const jwt = require("jsonwebtoken")
const userModel = require("../models/userModel")
const jwt_decode = require("jwt-decode")
const blogModel = require("../models/blogModel")
const { query } = require("express")


const BlogRoute = express.Router()

BlogRoute.post("/submit" ,passport.authenticate('jwt', { session: false }),  (req, res)=>{

    const word_count = req.body.body.split(" ").length

    const wpm = 220

    const read_time = `${Math.ceil(word_count/wpm)} minute(s)`
     

    userModel.findOne( req.user, ( err, user) => {
      if (err) throw new Error(err)


       const newBlog ={ title: req.body.title, description: req.body.description, tags: req.body.tags, 

         body: req.body.body, author: user, reading_time: read_time}

      BlogModel.create(newBlog)
        .then(blog => {
            res.status(201).send(blog)
        }).catch(err => {
            console.log(err)
            res.status(500).send(err)
        })

    })
   
})

BlogRoute.get("/blogs" , async (req, res) => {

    const {title, author, tags, read_count, reading_time, timestamps  } = req.query

    let query = {}

    if (title){

        query.title = title
    }
   
    if (author){

        query.author = author
    }

    if (tags){

        query.tags = tags
    }


    sort_query = {}

    const ASCENDING = 1
    
    const DESCENDING = -1

    if (read_count){

        sort_query.read_count = read_count
    }

    if (reading_time){

        sort_query.reading_time = reading_time
    }
    
    if (timestamps){

        sort_query.timestamps = timestamps
    }
  
   console.log(sort_query)
   console.log(query)
    const Blogs = await BlogModel.find({state: "published"}, query)
    .populate("author", "-password -__v -user_type")
    .limit(20)
    .skip(0)
    .sort(sort_query)
    

        .then(Blogs => {

            res.status(200).json(Blogs)
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    
        
 
})

BlogRoute.get("/blog/:id" , async (req, res) => {

    const id = req.params.id
    const blog = await BlogModel.findById(id).populate("author", "-password -__v -user_type")

    
        .then(Blog => {
            Blog.read_count++

               Blog.save()

            res.status(200).send(Blog)


        }).catch(err => {
            console.log(err)
            res.status(404).send(err)
        })

    
})


BlogRoute.put("/blog/update/:id", passport.authenticate('jwt', { session: false }), async (req, res) => {

    const blogId = req.params.id

    console.log(blogId)
    
    const userId = req.user._id

    console.log(userId)

    const foundBlog = await BlogModel.findById(blogId)

    if(foundBlog && foundBlog.author==userId){

        const blog = req.body

        console.log(blog)

        blog.lastUpdateAt = new Date() // set the lastUpdateAt to the current date

        await BlogModel.findByIdAndUpdate(blogId, blog, { new: true })
            
        .then(newBlog => {

            res.status(200).send({"message":"Blog updated successfully", newBlog})
            
        }).catch(err => {
                
            console.log(err)
                
            res.status(500).send(err)
        
        })
    
    }

    else if (foundBlog.author != userId){ res.status(404).json("you cannot update someone else's article")}

    
   

} )

BlogRoute.delete("/blog/delete/:id" , passport.authenticate('jwt', { session: false }), async (req, res) => {

    const blogId = req.params.id
    
    const userId = req.user._id

    const foundBlog = await BlogModel.findById(blogId)

    if(foundBlog && foundBlog.author==userId){

     BlogModel.findByIdAndRemove(blogId)

        .then(

            res.status(200).json("You have successfully deleted your blog!")

        ).catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
    
    
    }

    else if (foundBlog.author != userId){ res.status(404).json("you cannot delete someone else's article")}


})

BlogRoute.put("/blog/edit/:id" , passport.authenticate('jwt', { session: false }), async (req, res) => {

    const blogId = req.params.id
    
    const userId = req.user._id

    const foundBlog = await BlogModel.findById(blogId)
    
    if(!foundBlog) { res.status(400).json("You have no blog available to edit")}

    if(foundBlog.author==userId){

        const blog = req.body

        blog.lastUpdateAt = new Date() // set the lastUpdateAt to the current date

        BlogModel.findByIdAndUpdate(blogId, blog, { new: true })

        .then(editedBlog => {
            
            
            res.status(200).json({"message":"you have successfully edited your blog", editedBlog})} 

            

        ).catch(err => {
            console.log(err)
            res.status(500).send(err)
        })
    
    
    }




})

BlogRoute.get( "/myblog" , passport.authenticate('jwt', { session: false }), async (req, res) => {

    const authorId = req.user._id

     let query = ""

    if(req.query.state){

        query = req.query.state
    }

    const Blog = BlogModel.find({author: authorId, state: query}).populate("author", "-password -__v -user_type")
    .limit(20)
    

    
        .then(Blog => {
            res.status(200).send(Blog)
        }).catch(err => {
            console.log(err)
            res.status(404).send(err)
        })
})





module.exports = BlogRoute