var express = require('express');
var csrf = require('csurf');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var passport = require('passport');
var flash = require('connect-flash');
const { check, validationResult } = require('express-validator');
const User = require('../models/user');
var Cart = require('../config/cart');
var Product = require('../models/product')
var csrfProtection = csrf()
router.use(csrfProtection)


// Connection URL
const url = 'mongodb+srv://shivamsingh:shivam123@cluster0-jvljc.mongodb.net/test?retryWrites=true&w=majority';

// Use connect method to connect to the Server
// MongoClient.connect(url, function(err, client) {
//   assert.equal(null, err);
//  const db = client.db("test");
//   router.get('/', function(req, res, next) {
//     var products = db.collection('people').find({}).toArray(function(err,result){
//       res.render('shop/index', { title: 'Express', products:result });
//     });
//   });
// });

router.get('/',function(req,res,next){

var products=  Product.find(function(err,docs){
  var productChunk = [];
  var chunkSize = 3;

  if(err){
    console.log("err"+err)
  }
  const context = {
     products: docs.map(document => {
      return {
        _id : document._id,
        title: document.title,
        price: document.price,
        description: document.description
      }
    })
  }
  res.render('shop/index',{title: 'shopping ' ,products:context.products}) 
});
})
router.get('/user/profile',isLoggedin,function(req,res){
  res.render('user/profile');
})

router.get('/user/logout',(req,res)=>{
  req.logout();
  res.redirect('/')
})
router.use('/',(req,res,next) =>{
  if(!req.isAuthenticated()){
    next()
 }
  else{
  res.redirect('/')
  } 
})


router.get('/user/signup',function(req,res,next){
     var msg = req.flash('error');
   res.render('user/signup',{ csrfToken: req.csrfToken(),msg:msg, hasError: msg.length>0 })
})

router.post('/user/signup',
[
  check('email','email invalid').isEmail(),
  check('password','invalid password').isLength({ min: 5 })
],
function(req,res){
  const errors = validationResult(req);
  const { email, password} = req.body;
  var messages  = []
  if (!errors.isEmpty()) {
    errors.array().forEach((error)=>{
       console.log( error.msg)
       messages.push(error.msg)
    })
      req.flash('error',messages)
     res.redirect('/user/signup')
      }else{
        //validation
        var error = []
        User.findOne({email:email}) 
        .then(user => {
            if(user){
               req.flash('error','user already exists')
                res.redirect('/user/signup');
            
            }else{
              var newUser = new User();
              newUser.email = email;
              newUser.password = newUser.encryptPassword(password);
              newUser.save(function(err,result){
                  if(err){ res.render('user/signup'),{msg:'something went wrong'}}
                   else{res.redirect('/user/signin')}
              })
            }
        });
       
       }
    }
)



router.get('/user/signin',(req,res,next) => {
      var msg = req.flash('error')
    res.render('user/signin',{ csrfToken: req.csrfToken(),msg:msg,hasError: msg.length>0})
})

router.post('/user/signin',passport.authenticate('local.signin',{
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash:true
}))
/* GET home page. */

router.get('/add-to-cart/:id',(req,res,next)=>{
   var productId = req.params.id;
   var cart = new Cart(req.session.cart ? req.session.cart : {})
   Product.findById(productId,function(err,product){
     if(err){
       return res.redirect('/')
     }
     cart.add(product,productId)
     req.session.cart = cart;
     console.log(req.session.cart)
     res.redirect('/')

   })
})

router.get('/user/shopping-cart',(req,res,next)=>{
  if(!req.session.cart){
     return  res.render('shop/shoppingcart',{product:null})
  }
  var cart = new Cart(req.session.cart)
   console.log(cart.generateArray())
  res.render('shop/shoppingcart',{product:cart.generateArray(), totalPrice: cart.totalprice})
})


router.get('/user/checkout',(req,res,next)=>{
  if(!req.session.cart){
   return res.redirect('/user/shopping-cart')
  }
var cart = new Cart(req.session.cart)
res.render('shop/checkout',{total:cart.totalprice})

})
module.exports = router;


function isLoggedin(req,res,next){
  if(req.isAuthenticated()){
     next()
  }
   else{
    res.redirect('/')
   } 
}



