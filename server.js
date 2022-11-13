/*************************************************************************
* WEB322– Assignment 4 
* I declare that this assignment is my own work in accordance with Seneca Academic 
Policy. No part of this assignment has been copied manually or electronically from any 
other source.
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Gunjan Paul Kaur Student ID:  Date: 13/11/2022
* 
* Your app’s URL (from Cyclic Heroku) that I can click to see your application: 
* https://floating-chamber-26879.herokuapp.com/ 
* https://git.heroku.com/floating-chamber-26879.git
* 
*************************************************************************/ 

var express = require("express");
var app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;
var data = require("./data-service");
const exphbs = require('express-handlebars');

app.use(function (req, res, next) {
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + ((isNaN(route.split("/")[1])) ?
        route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));
    app.locals.viewingCategory = req.query.category;
    next();
});

app.set('view engine', '.hbs'
);

app.engine('.hbs', exphbs.engine({
    extname: '.hbs',
    helpers: {
        navLink: function (url, options) {
            return '<li' +
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },

        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },

        safeHTML: function (context) {
            return stripJs(context);
        }

    }

}));

//file handling
var multer = require("multer");
var fs = require("fs");
const storage = multer.diskStorage({
    destination: "./public/images/uploaded",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// call this function after the http server starts listening for requests
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
app.use(express.static('public'));
// setup a 'route' to listen on the default url path (http://localhost)
app.get("/", function (req, res) {
    res.render(path.join(__dirname, "/views/home"));
});

app.get("/home", function (req, res) {
    res.redirect("/");
})
// setup another route to listen on /about
app.get("/about", function (req, res) {
    res.render(path.join(__dirname, "/views/about"));

});

app.get("/employees", function (req, res) {
    if (req.query.status) {
        data.getEmployeeByStatus(req.query.status).then(function (data) {
            res.render("employees", {employees: data}); 
        }).catch((err) => {
            res.render({message: "no results"});
        })
    }
    else if (req.query.department) {
        data.getEmployeesByDepartment(req.query.department).then(function (data) {
            res.render("employees", {employees: data});
        }).catch(function (err) {
            res.render({message: "no results"});
        })
    }
    else if (req.query.manager) {
        data.getEmployeesByManager(req.query.manager).then(function (data) {
            res.render("managers", {managers: data});
        }).catch(function (err) {
            res.json({ message: err });
        })
    }
    else {
        data.getAllEmployees().then(function (data) {
            res.render("employees", {employees: data});
        }).catch(function (err) {
            res.render({message: "no results"});
        });
    }
});

app.get("/employee/:value", function (req, res) {
    data.getEmployeeByNum(req.params.value).then((data) => {
        console.log("got employee");
        res.render("employee", {employee: data[0]});
    }).catch((err) => {
        res.render({message: "no results"});
    })
});




app.get("/departments", function (req, res) {
    data.getDepartments().then(function (data) {
        res.render("departments", {departments: data}) 
    }).catch(function (err) {
        es.render({message: "no results"});
    });
});


app.get('/employees/add', function (req, res) {
    res.render(path.join(__dirname + "/views/addEmployee"));
});

app.get('/images/add', function (req, res) {
    res.render(path.join(__dirname + "/views/addImage"));
});



app.post("/images/add", upload.single("imageFile"), function (req, res) {
    res.redirect("/images");
});
app.post('/employees/add', function (req, res) {
    data.addEmployee(req.body).then(() => {
        res.redirect("/employees");
    })
});


app.get("/images", function (req, res) {
    fs.readdir("./public/images/uploaded", function (err, items) {
        var send = '{"images":['
        for (i in items) {
            if (i < items.length - 1)
                send += '"' + items[i] + '",'
            else
                send += '"' + items[i] + '"'
        }
        send += "]}"
        console.log(send);
        res.render("images",{data:items});
    })
});

app.post("/employee/update", (req, res) => {
    //  console.log(req.body);
      data.updateEmployee(req.body).then(function () {
          res.redirect("/employees");
      })
  });


app.get('*', function (req, res) {
    res.send('Page Not Found', 404);
});


data.initialize().then(function () {
    // setup http server to listen on HTTP_PORT
    app.listen(HTTP_PORT, onHttpStart);
}).catch(function (data) {
    console.log(data);
});

