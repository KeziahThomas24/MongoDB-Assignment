var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
var exphbs = require('express-handlebars');
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

app.engine('.hbs', exphbs.engine({ extname: '.hbs',}));
app.set('view engine', '.hbs');

mongoose.connect(database.url1);

var Sales = require('./models/sales');
 
 
//get all sales data from db
app.get('/api/sales', function(req, res) {
	// use mongoose to get all todos in the database
	Sales.find(function(err, sales) {
		// if there is an error retrieving, send the error otherwise send data
		if (err)
			res.send(err)
		// res.json(sales); // return all sales in JSON format
		console.log(sales);
		res.render('allData', {
			data: sales,
			layout: false
		});
	});
});

// get a sale with Invoice ID of 106-35-6779
app.get('/api/sales/:invoice_id', function(req, res) {
	let id = req.params.invoice_id;
	Sales.find({"Invoice ID" : id}, function(err, sale) {
		if (err)
			res.send(err)
 
		res.json(sale);
	});
 
});

app.get('/api/sales/add', function(req,res){
	res.render("addData", {
		layout: false
	});
})

// create sale and send back all sales after creation
app.post('/api/sales', function(req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

	Sales.create({
		"Invoice ID" : req.body['Invoice ID'],
        Branch : req.body.Branch,
        City : req.body.City,
        "Customer type" : req.body['Customer type'],
        "Product line" : req.body['Product line'],
        name : req.body.name,
        image : req.body.image,
        "Unit price" : req.body['Unit price'],
        Quantity : req.body.Quantity,
        "Tax 5%" : req.body['Tax 5%'],
        Total : req.body.Total,
        Date : req.body.Date,
        Time : req.body.Time,
        Payment : req.body.Payment,
        cogs : req.body.cogs,
        "gross income" : req.body['gross income'],
        Rating : req.body.Rating
	}, function(err, sale) {
		if (err)
			res.send(err);
		else {
		// get and return all the sales after newly created sale record
			Sales.find(function(err, sales) {
				if (err)
					res.send(err)
				// res.json(sales);
				else{
					res.render('allData', {
						data: sales,
						layout: false
					});
				}
			});
		}
		
	});
 
});


// update sale and send back all sales after creation
app.put('/api/sales/:invoice_id', function(req, res) {
	// create mongose method to update an existing record into collection
    console.log(req.body);

	let id = req.params.invoice_id;
	var data = {
		"Invoice ID" : req.body['Invoice ID'],
        Branch : req.body.Branch,
        City : req.body.City,
        "Customer type" : req.body['Customer type'],
        "Product line" : req.body['Product line'],
        name : req.body.name,
        image : req.body.image,
        "Unit price" : req.body['Unit price'],
        Quantity : req.body.Quantity,
        "Tax 5%" : req.body['Tax 5%'],
        Total : req.body.Total,
        Date : req.body.Date,
        Time : req.body.Time,
        Payment : req.body.Payment,
        cogs : req.body.cogs,
        "gross income" : req.body['gross income'],
        Rating : req.body.Rating
	}

	// save the sale
	Sales.findOneAndUpdate({"Invoice ID" : id}, data, function(err, sale) {
	if (err) throw err;

	res.send('Successfully! Sale updated - ' + sale.name);
	});
});

// delete a sale by id
app.delete('/api/sales/:invoice_id', function(req, res) {
	console.log(req.params.invoice_id);
	let id = req.params.invoice_id;
	Sales.remove({
		"Invoice ID" : id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Sale has been Deleted.');	
	});
});

// Sort sales data based on a specific parameter (e.g., Date)
app.get('/api/sales/sort/:sortParam', function(req, res) {
    const sortParam = req.params.sortParam;
    let sortQuery = {};

    // Set up sorting criteria based on the provided parameter
    if (sortParam === 'date') {
        sortQuery = { Date: 1 }; // Sort by Date in ascending order
    } else if (sortParam === 'total') {
        sortQuery = { Total: -1 }; // Sort by Total in descending order
    }

    // Fetch sales data based on the sorting criteria
    Sales.find().sort(sortQuery).exec(function(err, sortedSales) {
        if (err) {
            res.send(err);
        } else {
            // res.json(sortedSales);
			res.render('allData', {
				data: sortedSales,
				layout: false
			});
		}
    });
});




app.listen(port);
console.log("App listening on port : " + port);
