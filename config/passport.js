const LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
const mongosee = require('mongoose');
const bcrypt = require('bcrypt');
var passport = require('passport');
const { check, validationResult } = require('express-validator');



 passport.serializeUser((user,done) =>{
    done(null, user.id);
});
passport.deserializeUser((id,done) =>{
    User.findById(id, (err,user) =>{
        done(err, user);
    })
})

passport.use('local.signin',
    new LocalStrategy({usernameField: 'email',passwordField:'password',passReqToCallback:true}, ( req,email,password,done) =>{
      
      User.findOne({ 'email': email},function(err,user){
          if(err){
              return done(err);
            }
          if(!user){return done(null, false,{message:'no user found'});}
          if(!user.validPassword(password)){ return done(null,false,{message:'password incorrect'})}
          return done(null,user)
      })

      
    })
     );