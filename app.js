const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { post } = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//post request for home route
app.post("/", function (req, res) {
  const firstName = req.body.fname;
  const secondName = req.body.sname;
  const emailAdd = req.body.email;

  //data object
  const data = {
    members: [
      {
        email_address: emailAdd,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: secondName,
        },
      },
    ],
  };

  //converting to json
  const jsonData = JSON.stringify(data);

  //making post req to external server

  const url = "https://us7.api.mailchimp.com/3.0/lists/b1f006d797";

  const options = {
    method: "POST",
    auth: "chimp2:273d989dd264d882e6952a27e1438aa4-us7",
  };
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

//post request for success route
app.post("/success", function (req, res) {
  res.redirect("/");
});

//post request for failure route
app.post("/failure", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("server is running");
});
// b1f006d797.
// 273d989dd264d882e6952a27e1438aa4-us7
