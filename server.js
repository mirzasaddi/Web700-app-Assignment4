var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
require("pg"); // Explicitly require the "pg" module for Vercel

var collegeData = require("./modules/collegeData.js");

// Middleware to parse form data from POST requests
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "views")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Route to get students
app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then((students) => res.json(students))
            .catch(() => res.json({ message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then((students) => res.json(students))
            .catch(() => res.json({ message: "no results" }));
    }
});

// Route to get TAs
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then((tas) => res.json(tas))
        .catch(() => res.json({ message: "no results" }));
});

// Route to get courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((course) => res.json(course))
        .catch(() => res.json({ message: "no results" }));
});

// Route to get individual student data
app.get("/student/:studentNum", (req, res) => {
    const studentNum = req.params.studentNum;

    collegeData.getStudentByNum(studentNum)
        .then((student) => res.json(student))
        .catch(() => res.json({ message: "no results" }));
});

// Route for GET /about
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Route for GET /htmlDemo
app.get("/htmlDemo", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "htmlDemo.html"));
});

// Route to show "Add Student" form
app.get("/students/add", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "addStudent.html"));
});

// Route to handle "Add Student" form submission
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(() => res.json({ message: "Unable to add student" }));
});

// Catch-all route for handling unmatched routes
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Setup HTTP server to listen on HTTP_PORT
const server = require("http").createServer(app);
server.listen(HTTP_PORT, () => {
    console.log("Server listening on port: " + HTTP_PORT);
    collegeData.initialize();
});

// Export app for Vercel compatibility
module.exports = app;