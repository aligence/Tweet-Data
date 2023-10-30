function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

//update the most popular activities
	var activities = {
		'skiing': 0,
		'biking': 0,
		'running': 0,
		'swimming': 0,
		'workout': 0
	};

	var totalDistances = {
		'running': 0,
		'biking': 0,
		'swimming': 0,
		'skiing': 0,
	};

	tweet_array.forEach(function(tweet) {
		if (tweet.activityType == "skiing"){
			activities['skiing']++;
		}
		else if (tweet.activityType == "biking"){
			activities['biking']++;
		}
		else if (tweet.activityType == "running"){
			activities['running']++;
		}
		else if (tweet.activityType == "swimming"){
			activities['swimming']++;
		}
	});

	//finds the most popular 
	let max = 0;
	let maxAct = "";
	for (let acts in activities){
		if(activities[acts] > max){
			max = activities[acts];
			maxAct = acts;
		}
	}
	
	
	// Get the top 3 activities
	var first = maxAct;
	var second = 'biking';
	var third = 'workout';

	$("#numberActivities").text("5");
	$("#firstMost").text(first);
	$("#secondMost").text(second);
	$("#thirdMost").text(third);


	// adds all of the distance per exercise
	tweet_array.forEach(function(tweet){
		if(tweet.activityType == 'skiing'){
			totalDistances['skiing'] += tweet.distance;
		}
		if(tweet.activityType == 'biking'){
			totalDistances['biking'] += tweet.distance;
		}

		if(tweet.activityType == 'running'){
			totalDistances['running'] += tweet.distance;
		}

		if(tweet.activityType == 'swimming'){
			totalDistances['swimming'] += tweet.distance;
		}
	});

	// now add the acts with longest distances
	  // finds the max distance act
	var maxDist = 0;
	var maxDistKey = "";
	for (acts in totalDistances){
		if(totalDistances[acts] > maxDist){
			maxDist = totalDistances[acts];
			maxDistKey = acts;
		}
	}
		// finds lowest distance act
	var minDist = maxDist;
	var minDistKey = "";

	for (acts in totalDistances){
		if(totalDistances[acts] < minDist){
			minDist = totalDistances[acts];
			minDistKey = acts;
		}
	}

	$("#longestActivityType").text(maxDistKey.replace("ing", ""));
	$("#shortestActivityType").text(minDistKey.replace("ing", ""));


	//find out if most work is done on weekdays or weekends
	var wkndCount = 0;
	var wkDayCount = 0;
	
	tweet_array.forEach(function(tweet){
		const date= new Date(tweet.time);
		if (date.getDay >= 1 && date.getDay < 6){
			wkDayCount++;
			
		}
		else if(tweet.day != "Sun"){
			console.log("an");
		}
		else{
			wkndCount++
		}
	});

	if (wkDayCount > wkndCount){
		$("#weekdayOrWeekendLonger").text("weekdays");
	}
	else{
		$("#weekdayOrWeekendLonger").text("weekends");	
	}



	//graph of the number of tweets containing each type of activity.
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
		"values": [ {"Activities Done": 'biking', "Number of Tweets" : activities['biking']},
					{"Activities Done":'skiing', "Number of Tweets": activities['skiing']}, 
					{"Activities Done": 'running', "Number of Tweets": activities["running"]}, 
					{"Activities Done": 'workout', "Number of Tweets": activities["workout"]}, 
					{"Activities Done": 'swimming',"Number of Tweets": activities['swimming']}
				]
	  },
	  "mark": "point",
	  "encoding": {
		"x": {
			"field": "Activities Done",
			"type": "nominal",
			"scale": {"zero": false}
		},
		"y": {
			"field": "Number of Tweets",
			"type": "quantitative",
			"scale": {"zero": false}
		},
		"color": {"field": "Activities Done", "type": "nominal"},
  	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//object to get the distance perDay
	let perDayDistBiking = {
		'Mon' : 0,
		'Tue' : 0,
		'Wed' : 0,
		'Thu' : 0,
		'Fri' : 0,
		'Sat' : 0,
		'Sun' : 0
	};

	let perDayDistRunning = {
		'Mon' : 0,
		'Tue' : 0,
		'Wed' : 0,
		'Thu' : 0,
		'Fri' : 0,
		'Sat' : 0,
		'Sun' : 0
	};

	let perDayDistSwimming = {
		'Mon' : 0,
		'Tue' : 0,
		'Wed' : 0,
		'Thu' : 0,
		'Fri' : 0,
		'Sat' : 0,
		'Sun' : 0
	};

	tweet_array.forEach(function(tweet){
		var day = tweet.day;
		var date = new Date(tweet.time);
		if (tweet.activityType == "biking"){
			perDayDistBiking[day] = tweet.distance;
		}
		if (tweet.activityType == "running"){
			perDayDistRunning[day] = tweet.distance;
		}
		if (tweet.activityType == "swimming"){
			perDayDistSwimming[day] = tweet.distance;
		}
		
	});

	//array that will hold the distances per day
	var helperDistArr = [];
	var distByDayArr = [];
	distByDayArr.forEach(function(tweet){
		var act = tweet.activityType;
		var day = tweet.day;
		var key = act + day;
		if(!helperDistArr.includes(key)){
			helperDistArr.push(key);
			helperDistArr.push({
				k: key,
				a: act,
				d: day,
				distances: [tweet.distance]
			});
		}
		else{
			for(var i = 0; i < helperDistArr.length; i++){
				if(helperDistArr[i]["k"] == key){
					helperDistArr[i]["distances"].push(tweet.distance);
					break;
				}
			}
		}
	});

	//array to hold avg dist per day
	/*var avgDistByDayArr = [];
	helpAvgArr.forEach(function(tweet){
		var total = 0.0;
		for ( var i = 0; i < tweet[""])
	});*/


	distOfThreeActs = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the distance per day of the three most popular activities.",
		"data": {"values": [distByDayArr]},
		"mark": "point",
		"encoding": {
		  "x": {
			  "field": "Day",
			  "type": "nominal",
			  "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		  },
		  "y": {
			  "field": "Distance",
			  "type": "quantitative",
			  "scale": {"domain": [0, 1000]}
		  },
		  "color": {"field": "Activities Done", 
		  			"type": "nominal"},
		  }
	  };
	  vegaEmbed('#distanceVis', distOfThreeActs, {actions:false});
	  //$('#distanceVis').hide();




	  distOf3Aggre = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the distance per day of the three most popular activities.",
		"data": {"values": avgDistByDayArr},
		"mark": "point",
		"encoding": {
		  "x": {
			  "field": "Day",
			  "type": "ordinal",
			  "sort": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
		  },
		  "y": {
			  "field": "Average Distance",
			  "type": "quantitative",
			  "scale": {"zero": false}
		  },
		  "color": {"field": "Activities Done", "type": "nominal"},
		  }
	  };
	  vegaEmbed('#distanceVisAggregated', distOf3Aggre, {actions:false});
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});