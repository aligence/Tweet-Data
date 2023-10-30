function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table

	//fixes the span in the html so that the input is shown
	var textbox = document.getElementById("textFilter");
	var amountOfTweets = document.getElementById("searchCount");
	var table = document.getElementById("tweetTable");

	textbox.addEventListener("input", function(){
		var textVal = textbox.value;
		$("#searchText").text(textVal);

		//now we count how many times the input val is in the text
		var matchCount = tweet_array.filter(function(tweet){
			return tweet.text.includes(textVal);
		}).length;

		amountOfTweets.textContent = matchCount;


		//fixes the values in the table
		table.innerHTML = "";
		tweet_array.forEach(function(tweet, index){
			var row = document.createElement("tr");

			//num col
			var numCell = document.createElement("td");
			numCell.textContent = index +1;
			row.appendChild(numCell);
	
			// Activity Type column (assuming tweet has an activityType property)
			var activityTypeCell = document.createElement("td");
			activityTypeCell.textContent = tweet.activityType;
			row.appendChild(activityTypeCell);
	
			// Tweet Text column
			var tweetTextCell = document.createElement("td");
			tweetTextCell.textContent = tweet.text;
			row.appendChild(tweetTextCell);
	
			table.appendChild(row);
		});
	});
}



//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});