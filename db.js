const { MongoClient} =require("mongodb")
let dbConnection
module.exports={
   connectToDb:(cb)=>{
    //cb is the callback function
    //dont use localhost here
    //use 0.0.0.0  instead------------__--
     MongoClient.connect('mongodb+srv://umang:test123@cluster0.zifeprd.mongodb.net/?retryWrites=true&w=majority')
     .then((client)=>{
       dbConnection=client.db();

       return cb();
     }).catch((err)=>{

        console.log(err);
        return cb(err);
     })
   },
   getDb:()=>dbConnection

}