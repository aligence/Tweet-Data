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

	
	


	//adds all vals to the seperate 3 arrays
	tweet_array.forEach(function(tweet){
		var day = tweet.day;
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
	
	//combines data from all 3 arrays
	let perDayDistances = {
		'Mon': {
			'Biking': perDayDistBiking['Mon'],
			'Running': perDayDistRunning['Mon'],
			'Swimming': perDayDistSwimming['Mon']
		},
		'Tue': {
			'Biking': perDayDistBiking['Tue'],
			'Running': perDayDistRunning['Tue'],
			'Swimming': perDayDistSwimming['Tue']
		},
		'Wed': {
			'Biking': perDayDistBiking['Wed'],
			'Running': perDayDistRunning['Wed'],
			'Swimming': perDayDistSwimming['Wed']
		},
		'Thu': {
			'Biking': perDayDistBiking['Thu'],
			'Running': perDayDistRunning['Thu'],
			'Swimming': perDayDistSwimming['Thu']
		},
		'Fri': {
			'Biking': perDayDistBiking['Fri'],
			'Running': perDayDistRunning['Fri'],
			'Swimming': perDayDistSwimming['Fri']
		},
		'Sat': {
			'Biking': perDayDistBiking['Sat'],
			'Running': perDayDistRunning['Sat'],
			'Swimming': perDayDistSwimming['Sat']
		},
		'Sun': {
			'Biking': perDayDistBiking['Sun'],
			'Running': perDayDistRunning['Sun'],
			'Swimming': perDayDistSwimming['Sun']
		}
	};

	var distByDayArr = [];
	for (let day in perDayDistances){
		for(let activity in perDayDistances[day]){
			distByDayArr.push({
				'Day': day,
				'Activity': activity,
				'Distance': perDayDistances[day][activity]
			});
		}
	}
	

	// Create an object to store individual data points for each activity type
	let individualActivityData = {
		"biking": {
			'Mon': perDayDistBiking['Mon'],
			'Tue': perDayDistBiking['Tue'],
			'Wed': perDayDistBiking['Wed'],
			'Thu': perDayDistBiking['Thu'],
			'Fri': perDayDistBiking['Fri'],
			'Sat': perDayDistBiking['Sat'],
			'Sun': perDayDistBiking['Sun'],	
		},

		"swimming": {
			'Mon': perDayDistSwimming['Mon'],
			'Tue': perDayDistSwimming['Tue'],
			'Wed': perDayDistSwimming['Wed'],
			'Thu': perDayDistSwimming['Thu'],
			'Fri': perDayDistSwimming['Fri'],
			'Sat': perDayDistSwimming['Sat'],
			'Sun': perDayDistSwimming['Sun'],	
		},
		"running": {
			'Mon': perDayDistRunning['Mon'],
			'Tue': perDayDistRunning['Tue'],
			'Wed': perDayDistRunning['Wed'],
			'Thu': perDayDistRunning['Thu'],
			'Fri': perDayDistRunning['Fri'],
			'Sat': perDayDistRunning['Sat'],
			'Sun': perDayDistRunning['Sun'],	
		}
	};
	
		distOfThreeActs = {
			"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
			"description": "A graph of the distance per day of the three most popular activities.",
			"data": {"values": distByDayArr},
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
				"scale": {"domain": [0, 40]}
			},
			"color": {"field": "Activity", 
						"type": "nominal", "scale": {"scheme": "category10"}},
			}
		};
	  	vegaEmbed('#distanceVis', distOfThreeActs, {actions:false});
		$("#distanceVis").hide()
		
		



	// average graph
	  distOf3Aggre = {
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "A graph of the distance per day of the three most popular activities.",
		"data": {"values": individualActivityData},
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

	  //onclick to go between graphs
	  $("#aggregate").on("click", function() {
		// Toggle graph visibility and update button text
		if ($('#distanceVis').is(":visible")) {
			// Hide the graph
			$('#distanceVis').hide();
			
			$(this).text("Show means");
		} else {
			// Show the graph
			$('#distanceVis').show();
			$('#distanceVisAggregated').hide()
			$(this).text("Show all activities");
		}
	});
}


//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});