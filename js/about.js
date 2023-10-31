function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	var dates = tweet_array.map(function(tweet){
		return tweet.time;
	});

	var earliestDate = new Date(Math.min.apply(null, dates));
    var latestDate = new Date(Math.max.apply(null, dates));

    // Update first and last date spans
    document.getElementById("firstDate").innerText = earliestDate.toLocaleDateString('en-us', {month: "long", day: "numeric", year: "numeric"});
    document.getElementById("lastDate").innerText = latestDate.toLocaleDateString('en-us', {month: "long", day: "numeric", year: "numeric"});


	//events-----------------------------------------------------------------------------------------
	var categories = {
		'completed_event' : 0,
		'live_event' : 0,
		'achievement' : 0,
		'miscellaneous' : 0
	};

	//for each tweet, find the source output in categories and increase by 1
	tweet_array.forEach(function (tweet) {
        categories[tweet.source]++;
    });

	var allTweets = tweet_array.length;
	var completedPercent = (categories['completed_event'] / allTweets) *100;
	var livePercent = (categories['live_event'] / allTweets) *100;
	var achievePercent = (categories['achievement'] / allTweets) *100;
	var miscPercent = (categories['miscellaneous'] / allTweets) *100;
    
	//whole vals
	$(".completedEvents").text(math.format((completedPercent /100)*allTweets), {notation: 'fixed', precision: 0});
	$(".liveEvents").text(math.format((livePercent /100)*allTweets), {notation: 'fixed', precision: 0});
	$(".achievements").text(math.format((achievePercent /100)*allTweets), {notation: 'fixed', precision: 0});	
	$(".miscellaneous").text(math.format((miscPercent /100)*allTweets), {notation: 'fixed', precision: 0});
	//percent
	$('.completedEventsPct').text(math.format(completedPercent, {notation: 'fixed', precision: 2}) + '%');
	$('.liveEventsPct').text(math.format(livePercent, {notation: 'fixed', precision: 2}) + '%');
    $('.achievementsPct').text(math.format(achievePercent, {notation: 'fixed', precision: 2}) + '%');
    $('.miscellaneousPct').text(math.format(miscPercent, {notation: 'fixed', precision: 2}) + '%');


	//Completed Events Written By Human----------------------------------------------------------

	//calc amount of written
	var allCompletedEvents = ((completedPercent /100) * allTweets);
	var checker = 0;
	tweet_array.forEach(function(tweet){
		if (tweet.written === true ){
			checker++;
		}
		else{
			
		}
	});
	
	var trueWritten = checker;
	var writtenPct = ((trueWritten / allCompletedEvents) * 100);

	$(".written").text(trueWritten);
	$(".writtenPct").text(math.format(writtenPct, {notation: "fixed", precision: 2}) + "%");
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});

