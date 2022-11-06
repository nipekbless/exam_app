const express = require ("express")
const app = express()
require("dotenv").config()
const mongoose = require("mongoose")
const AuthRoute = require("./router/AuthRoute")
const passport = require("passport")
const BlogRoute = require("./router/BlogRoute")

const PORT = process.env.PORT_NUM || 8000


app.use(express.json())
app.use(passport.initialize())
require("./middleware/authMiddleware")(passport)
app.use("/Api" , AuthRoute)
app.use("/Api", BlogRoute)


mongoose.connect(process.env.DATABASE_URL)

mongoose.connection.on("connected", () => {
	console.log("Connected to MongoDB Successfully");
});

mongoose.connection.on("error", (err) => {
	console.log("An error occurred while connecting to MongoDB");
	console.log(err);
});

app.listen( PORT, ()=>{
    console.log(`Server running successfully`)
})
