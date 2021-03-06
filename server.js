


// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var logger = require ("morgan");


// Initialize Express
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));



// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});


// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.send(index.html);
});

//Route for getting all scraped data
app.get("/all", function(req, res){ 

	db.scrapedData.find({}, function (err, found) {
		if (err) {
			console.log(err);
		}

		else{
			res.json(found);
		}

	});
});

//route for scraping data

app.get("/scrape", function(req, res) {

 request ("https://news.ycombinator.com/", function (error, response, html) {
 	var $ = cheerio.load(html);

 	$(".title").each(function(i, element) {
 		var title = $(this).children("a").text();
 		var link = $(this).children("a").attr("href");

 		if (title && link) {
 			db.scrapedData.save({
 				title: title,
 				link: link
 			},
 			function(error, saved) {
 				if (error) {
 					console.log(error);
 				}

 				else {
 					console.log(saved);
 				}
 			});
 		}
 	});

 	res.send("Scrape complete!");
 });
	

	
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
