var express = require("express");
var app = express();
var cors = require('cors');
require('dotenv').config(({path:__dirname+'/process.env'}));
var path = require("path");
const TripDB = require("./modules/tripDB.js"); 
const db = new TripDB(); 


let MONGODB_CONN_STRING = "mongodb+srv://" + process.env.USER_NAME + ":" + process.env.PASSWORD + "@cluster0.tumpz.mongodb.net/" + process.env.DATABASE_NAME + "?retryWrites=true&w=majority"
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

function onHttpStart() {
    console.log("Application is running and conected to port: " + HTTP_PORT);
}

app.get("/", function(req,res){
    var mockData = {
        message: "Karl Merhis' API is Listening"
    };
    res.json(mockData);
});

app.get("/about", function(req,res){
    res.send("Hello World!")
});

app.post("/api/trips", function(req, res){
    db.addNewTrip(req.body).then((msg)=>{
        res.json({message: msg});
    }).catch((err)=>{
        res.json({message: `an error occurred: ${err}`});
    });
});
app.get("/api/trips", function(req, res){
    const page = req.query.page;
    const perPage = req.query.perPage;
    
    if (page && perPage){ //To ensure query params ares provided
    db.getAllTrips(page,perPage).then((msg)=>{
        res.json({message: msg});
    }).catch((err)=>{
        res.json({message: `an error occurred: ${err}`});
    });
}else{
    res.status(400).send("Query parameters page and perPage must be present within the query string");
}
});

app.get("/api/trips/:id", function(req, res){
    db.getTripById(req.params.id).then((msg)=>{
        res.json({message: msg});
    }).catch((err)=>{
        res.json({message: `an error occurred: ${err}`});
    });
});
app.put("/api/trips/:id", function(req, res){
    db.updateTripById(req.params.id).then((msg)=>{
        res.send(msg);
    }).catch((err)=>{
        res.json({message: `an error occurred: ${err}`});
    });
});
app.delete("/api/trips/:id", function(req, res){
    db.deleteTripById(req.params.id).then((msg)=>{
        res.json({message: msg});
    }).catch((err)=>{
        res.json({message: `an error occurred: ${err}`});
    });
});

db.initialize(MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    }); 
}).catch((err)=>{     
    console.log(err); 
}); 


