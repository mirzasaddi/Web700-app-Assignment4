
var HTTP_PORT=process.env.PORT||8080;
var express=require("express");
var app=express();
var path = require("path");
require("pg"); // Explicitly require the "pg" module for Vercel

var collegeData = require("./modules/collegeData.js");

// Middleware to parse form data from POST requests
app.use(express.urlencoded({ extended: true }));

//setup a 'route' to listen on the default url path
/*
collegeData.initialize()
    .then(() => {
        console.log("Data initialization successful");
    });

*/
    // Serve static files from the 'views' directory
 app.use(express.static(path.join(__dirname, '/public')));   
 app.use(express.static(path.join(__dirname, '/views')));


app.get("/",(req,res)=>{
   // res.send("Hello World!");
   res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// this section is for getting student 
app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then((students) => res.json(students))
            .catch(() => res.json({message: "no results"}));
    } else {
        collegeData.getAllStudents()
            .then((students) => res.json(students))
            .catch(() => res.json({message: "no results"}));
    }
});

// this section used for getting TA's
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then((tas) => res.json(tas))
        .catch(() => res.json({message: "no results"}));
});

// this Section used for getting courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((course) => res.json(course))
        .catch(() => res.json({message: "no results"}));
});

//this section is for getting data for induvidual student
app.get("/student/*", (req, res) => {
    const studentNum = req.path.split("/")[2]; // Extract the student number from the path

    if (!studentNum) {
        return res.json({ message: "No student number provided" });
    }

    collegeData.getStudentByNum(studentNum)
        .then((student) => res.json(student))
        .catch(() => res.json({ message: "no results" }));
});



// Route for GET /about
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route for GET /htmlDemo
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
});

// New Route: Show "Add Student" Form
app.get("/students/add", (req, res) => { 
    res.sendFile(path.join(__dirname, 'views', 'addStudent.html'));
});

//  New Route: Handle "Add Student" Form Submission
app.post("/students/add", (req, res) => { 
    collegeData.addStudent(req.body) // Calls addStudent function in collegeData.js
        .then(() => res.redirect("/students")) //  Redirect to students list after adding
        .catch(() => res.json({ message: "Unable to add student" }));
});

// Catch-all route for handling unmatched routes
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT,()=>{
    console.log("server listening on port: "+HTTP_PORT);
    collegeData.initialize();
});
