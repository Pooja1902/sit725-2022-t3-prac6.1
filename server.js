var express = require("express")
var app = express()
var cors = require('cors')
let projectCollection;

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())


app.get('/addTwoNumbers/:firstNumber/:secondNumber', function(req,res,next){
  var firstNumber = parseInt(req.params.firstNumber) 
  var secondNumber = parseInt(req.params.secondNumber)
  var result = firstNumber + secondNumber || null
  if(result == null) {
    res.json({result: result, statusCode: 400}).status(400)
  }
  else { res.json({result: result, statusCode: 200}).status(200) } 
})

//Mongo connection...
const MongoClient = require('mongodb').MongoClient;
const uri ='mongodb+srv://Poojaguguloth:pooja@cluster0.gfav03i.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri, {useNewUrlParser: true})


const createColllection = (collectionName) => {
        client.connect((err,db) => {
            projectCollection = client.db().collection(collectionName);
            if(!err) {
                console.log('MongoDB Connected')
            }
            else {
                console.log("DB Error: ", err);
                process.exit(1);
            }
        })
    }

//insert project
  const insertProjects = (project,callback) => {
        projectCollection.insert(project,callback);
    }
    
    //post api
    app.post('/api/projects',(req,res) => {
            console.log("New Project added", req.body)
            var newProject = req.body;
            insertProjects(newProject,(err,result) => {
                if(err) {
                    res.json({statusCode: 400, message: err})
                }
                else {
                    res.json({statusCode: 200, message:"Project Successfully added", data: result})
                }
            })
        })  

//const cardList = [
 //   {
   //     title: "Kitten 2",
   //     image: "images/puppy.jpg",
   //     link: "About Kitten 2",
     //   desciption: "Demo desciption about kitten 2"
   // },
    //{
      //  title: "Kitten 3",
        //image: "images/puppy2.jpg",
        //link: "About Kitten 3",
        //desciption: "Demo desciption about kitten 3"
    //}
//]

// get project...
const getProjects = (callback) => {
        projectCollection.find({}).toArray(callback);
    }
    app.get('/api/projects',(req,res) => {
        getProjects((err,result) => {
            if(err) {
                res.json({statusCode: 400, message: err})
            }
            else {
                res.json({statusCode: 200, message:"Success", data: result})
            }
        })
    }) 

var port = process.env.port || 8080;
app.listen(port,()=>{
    console.log("App listening to http://localhost:"+port)
    createColllection('pets')
})