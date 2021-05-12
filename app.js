const express= require("express");
const bodyParser = require("body-parser");
const path = require("path")
require("./src/db/comm");
const exhbs = require("express-handlebars");
const hbs =require("hbs");
const ejs = require("ejs");
const {registerPartial}= require("hbs");
const User = require("./src/models/usermessage");
const Update  =require("./src/models/userupdate");
const Donate = require("./src/models/donate");



const app = express();
let updates =[];
let donates=[];

const staticpath = path.join(__dirname, "/public");
const templatepath = path.join(__dirname, "/templates/views");
const partialpath = path.join(__dirname, "/templates/partials");

app.set("view engine","ejs");
// app.engine("handlebars","exhbs");
app.set("view engine","hbs");
app.set("views",templatepath);
hbs.registerPartials(partialpath);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.urlencoded({extended:false}))
app.use(express.static(staticpath));
app.use('/css', express.static(path.join(__dirname,'../node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname,'../node_modules/bootstrap/dist/js')));
app.use('/jq', express.static(path.join(__dirname,'../node_modules/jq/dist')));



app.get("/",function(req,res)
{
    res.sendFile('templates/views/index.html',{root:__dirname});
});

app.get("/guide",function(req,res)
{
    res.render("index.hbs");
});

app.get("/services",function(req,res)
{
    res.render("services.hbs");
});

app.get("/info",function(req,res)
{
    res.render("info.hbs");
});

app.get("/review",function(req,res)
{
    res.render("review.hbs");
} );


app.get("/feed",function(req,res)
{
    res.render("feed.ejs");
});

app.post("/feed",async(req,res)=>
{
    try{
        const userUp=new Update({
             mail: req.body.mail,
             details: req.body.details,
             problem: req.body.problem,
             update: req.body.update,
             feeds: req.body.feeds
         });
          
     
             await userUp.save();
             updates.push(userUp);
             res.status(201).redirect("/reviews");
          } catch(error){
              res.status(500).send(error);
          }
     
});

app.get("/reviews",function(req,res){
    res.render("reviews.ejs",{updates:updates});
    // console.log(updates);
});

app.get("/contact",function(req,res)
{
    res.render("contact.hbs");
});

app.post("/contact", async(req,res)=>{
    try{
     const userData = new User(req.body);
     await userData.save();
     res.status(201).redirect("/guide");
    }catch (error){
        res.status(500).send(error);
    }
});

app.get("/donate",function(req,res){
    res.render("donate.hbs");
});

app.post("/donate",async(req,res)=>
{
    try {
        const don = new Donate({
        email: req.body.email,
        firstName:req.body.firstName,
        address:req.body.address,
        address2: req.body.address2,
        lastName:req.body.lastName,
        username:req.body.username,
        zip:req.body.zip,
        paymentMethod:req.body.paymentMethod,
        rate:req.body.rate
    });
            await don.save();
             donates.push(don);
             res.status(201).redirect("/list");
        
    } catch (error) {
        res.status(500).send(error);
    }
});
// app.get("/thankYou",function(req,res){
//     res.render("thankYou.ejs",{donates:donates});
// });

app.get("/list",function(req,res)
{
    res.render("list.ejs",{donates:donates});
});

app.listen(3000, function()
{
    console.log("Server started on port 3000");
});

