// const { MongoClient } = require("mongodb");
var Product = require('../models/product')
 var mongoose = require('mongoose')
// Replace the following with your Atlas connection string                                                                                                                                        
// const url = "mongodb+srv://sunitasingh:sunita123@cluster0-5c3j9.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(url);
const db = require('../config/keys').MongoURI;
     
         
mongoose.connect(db, { useNewUrlParser : true})
.then(()=> {
   console.log('connected');
   addproduct()
})
.catch(err => console.log(err))

    var products = [
        new Product({
            imagePath : 'http://video.png',
            description: 'this is the best grocery product',
            price : 13,
            title: 'grocery 1'
        }),
        new Product({
            imagePath : 'http://video.png',
            description: 'this is the best grocery product',
            price : 13,
            title: 'grocery 1'
        })
    ];

function addproduct(){
    console.log(products[0])
    var done=0;
    for(var i=0;i<products.length;i++){
        console.log(products[i])
        products[i].save(function(err,result){
            done++;
            if(err){
                console.log(err);
                return;
            }
            if(done === products.length){
                console.log(products.length)
                exit()
            }
        })
    }
}
    


  function exit(){

      mongoose.disconnect()
  }

   // The database to use
//  const dbName = "test";
                      
//  async function run() {
//     try {
//          await client.connect();
//          console.log("Connected correctly to server");
//          const db = client.db(dbName);

//          // Use the collection "people"
//          const col = db.collection("people");

         // Construct a document     
    
         

         // Insert a single document, wait for promise so we can read it back
         
//          const p = await col.insertMany(products);
//          // Find one document
       

//         } catch (err) {
//          console.log(err.stack);
//      }
 
// }

   
// var done =0
// for(var i=0;i<products.length;i++){
//     products[i].save(function(err,result){
//        done++;
//        console.log("sucessfull")
//        if(done === products.length){
         
//            exit();
//        }
//     })
// }


// run().catch(console.dir);