var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongodb = require('mongodb');

var db = require('./db');
var c = require('./config.json');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

db.connect(c.dbConnectionString, function(err) {
	if(err) {
		console.log(err);
		process.exit(1);
	} else {
		app.listen(c.PORT, function () {
			var host = this.address().address;
			var port = this.address().port;
			console.log('app listening at http://'+host+':'+port);
		});
	}
});

var Events = function() {
	return db.get().collection('events');
}

app.get('/api/events', function(req, res) {
	Events().find().toArray(function(err, docs) {
		return res.json(docs);
	});
});

app.post('/api/events', function(req, res) {
	if(!req.body.title)
		return res.status(500).end('Title is required!');
	var newEvent = {
		startDate: new Date(req.body.startDate || new Date()),
		title: req.body.title
	};
	if(req.body.endDate) {
		newEvent.endDate = new Date(req.body.endDate);
	}
	
	var events = Events();
	events.insert(newEvent, function() {
		events.find().toArray(function(err, docs) {
			return res.json(docs);
		});
	});
});

app.delete('/api/events/:event_id', function(req, res) {
	Events().remove({_id: new mongodb.ObjectID(req.params.event_id)}, function() {
		Events().find().toArray(function(err, docs) {
			return res.json(docs);
		});
	});
});

app.get('*', function(req, res) {
	res.sendfile('./public/index.html');
});

/*
var events = [{
	"media": {
	  "url": "{{ static_url }}/img/examples/houston/family.jpg",
	  "caption": "Houston's mother and Gospel singer, Cissy Houston (left) and cousin Dionne Warwick.",
	  "credit": "Cissy Houston photo:<a href='http://www.flickr.com/photos/11447043@N00/418180903/'>Tom Marcello</a><br/><a href='http://commons.wikimedia.org/wiki/File%3ADionne_Warwick_television_special_1969.JPG'>Dionne Warwick: CBS Television via Wikimedia Commons</a>"
	},
	"start_date": {
	  "month": "8",
	  "day": "9",
	  "year": "1963"
	},
	"text": {
	  "headline": "A Musical Heritage1",
	  "text": "<p>Born in New Jersey on August 9th, 1963, Houston grew up surrounded by the music business. Her mother is gospel singer Cissy Houston and her cousins are Dee Dee and Dionne Warwick.</p>"
	}
  },{
	"media": {
	  "url": "https://en.wikipedia.org/wiki/The_Beatles",
	  "caption": "",
	  //"credit": "<a href=\"http://unidiscmusic.com\">Unidisc Music</a>"
	},
	"start_date": {
	  "year": "1978"
	},
	"text": {
	  "headline": "First Recording",
	  "text": "At the age of 15 Houston was featured on Michael Zager's song, Life's a Party."
	}
  },{
	"start_date": {
	  "month": "5",
	  "day": "9",
	  "year": "1963"
	},
	"end_date": {
	  "month": "12",
	  "day": "9",
	  "year": "1963"
	},
	"text": {
	  "headline": "Tatatat",
	  //"text": "<p>Born in New Jersey on August 9th, 1963, Houston grew up surrounded by the music business. Her mother is gospel singer Cissy Houston and her cousins are Dee Dee and Dionne Warwick.</p>"
	}
  }];*/