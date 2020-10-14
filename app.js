const express = require('express');
const app = express();
const port  = 6800;
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
//const mongourl = "mongodb://localhost:27017"
const mongourl = "mongodb+srv://dbRest:dbRest123@cluster0.g4wzh.mongodb.net/rest?retryWrites=true&w=majority";
const cors = require('cors');
const bodyParser = require('body-parser');
let db;
app.use(cors());

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
//routes
app.get('/',(req,res) => {
    res.send("<div><a href='http://localhost:6800/location' target='_blank'>Location</a><br/><a href='http://localhost:6800/mealtype' target='_blank'>MealType</a><br/><a href='http://localhost:6800/cuisine' target='_blank'>Cuisine or Widgtes</a><br/><a href='http://localhost:6800/restaurant' target='_blank'>Restaurant</a><br/> <br/><a href='http://localhost:6800/orders' target='_blank'>Orders</a></div>")
})



//locations
app.get('/location',(req,res)=>{
    db.collection('city').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

//mealtype
app.get('/mealtype',(req,res)=>{
    db.collection('mealtype').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

//cuisine
app.get('/cuisine',(req,res)=>{
    db.collection('cuisine').find({}).toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

//restaurants
app.get('/restaurant',(req,res)=>{
    var query = {};
    if (req.query.city && req.query.mealtype){
        query = {city:req.query.city,"type.mealtype":req.query.mealtype}
    }
    else if(req.query.city){
        query = {city:req.query.city}
    }
    else if(req.query.mealtype){
        query = {"type.mealtype":req.query.mealtype}
    }
    db.collection('restaurant').find(query).toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

//orders
app.get('/orders',(req,res)=>{
    db.collection('orders').find().toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

//placeorders
app.post('/placeorder',(req,res)=>{
    db.collection('orders').insertOne(req.body,(err,result) =>{
        if(err){
            throw err
        }else{
            res.send('Data Added')
        }
    })
})


MongoClient.connect(mongourl,(err,client)=>{
    if(err) console.log(err);
    db = client.db('rest');
    app.listen(port,(err)=>{
        if(err) throw err
        console.log(`Server is running on port ${port}`);
    })
})