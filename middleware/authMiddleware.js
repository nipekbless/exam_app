const localStrategy = require("passport-local").Strategy
const UserModel = require("../models/userModel")
const passport = require("passport")
const mongoose = require("mongoose")
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;



module.exports = function(passport){ 

    passport.use(

        new JWTstrategy({
               
               secretOrKey: process.env.JWT_SECRET,
               
                 // jwtFromRequest: ExtractJWT.fromUrlQueryParameter('secret_token')

               jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken() 
            },
              
            async (token, done) => {
                
                try {
                    
                    return done(null, token.user);

                } catch (error) {
                    
                    done(error);
                }
            }
        )
    );

   
    passport.use( 'signup',
    
        new localStrategy(
        
            {passReqToCallback: true, usernameField: 'email', passwordField: 'password'},
        
            async ( req, email, password, done) => {
                   
                try {
                       
                    const first_name = req.body.first_name
                    const last_name = req.body.last_name
                    const user_type = req.body.user_type
                    const user = await UserModel.create({ first_name, last_name, user_type,  email, password });
                    return done(null, user);
                
                } catch (error) {
                          
                    console.log(error)
                    done(error);
            }
        }
    )
   );


    passport.use( "login", 

        new localStrategy(
           
            {usernameField: "email", passwordField: "password"},
            
              async (email, password, done) => {

              console.log(email, password)
                try{  
                     const user = await UserModel.findOne({ "email":email}) ;
                        console.log(user)
                    
                     if(!user) {
                        return done (null, false , {message : "user not found"});
                        
                      }

                     const validate = await user.isValidPassword(password);

                     if(!validate){
                        return done(null, false, {message : "wrong password"});

                     }

                        return done (null, user, { message : "Logged in succesfully"})
                 
                }catch(error) {
                     
                        return done (error)

                       }

            }



        )   

    )


}


    
    



