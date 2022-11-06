const express = require("express")
const authRouter = express.Router()
const passport = require("passport")
require("../middleware/authMiddleware")
const userModel = require("../models/userModel")
const jwt = require("jsonwebtoken")


authRouter.post("/signup",passport.authenticate("signup", { session: false }), async (req, res) => {

    const users = await userModel.findOne({email: req.user.email})

       console.log(users)
    

        res.status(200).json({
        message: 'Signup successful',
        user: req.user
    })
})

// authRouter.post("/login" , passport.authenticate("login", { session: false }), async (req, res) =>{
     
//     const user = req.user 

//         req.login(user, { session: false},
           
//             async (error) => {

//                 if (error) return res.status(400).json(error)
                
//                    const body = { _id: user._id, email : user.email}
            
//                    const token = jwt.sign({ user: body}, process.env.JWT_SECRET || wkdnjgsjgfkhjstihfghiotghsjo )

//                    return res.status(200).json({ token })


            
//             }       
                  
//         )
    




// })

authRouter.post('/login', async (req, res, next) => {
    
        passport.authenticate('login', async (err, user, info) => {
            try {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    const error = new Error('Username or password is incorrect');
                    return next(error);
                }

                req.login(user, { session: false },
                    async (error) => {
                        if (error) return next(error);

                        const body = { _id: user._id, email: user.email };
                        //You store the id and email in the payload of the JWT. 
                        // You then sign the token with a secret or key (JWT_SECRET), and send back the token to the user.
                        // DO NOT STORE PASSWORDS IN THE JWT!
                        const token = jwt.sign({ user: body },process.env.JWT_SECRET,{expiresin: '1h'} );

                        return res.json({ token });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
        )(req, res, next);
    }
);






module.exports = authRouter