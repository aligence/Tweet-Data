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
		var matchCount;
		$("#searchText").text(textVal);

		if (textVal){
			//now we count how many times the input val is in the text
			matchCount = tweet_array.filter(function(tweet){
				return tweet.text.includes(textVal);
			});
		}
		else{
			matchCount = tweet_array;
		}
		

		amountOfTweets.textContent = matchCount.length;


		//fixes the values in the table
		table.innerHTML = "";
		matchCount.forEach(function(tweet, index){
			//supposed to make links clickable
			function formatLinks(){
				const Rexp = /((http|https|ftp):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
				var formatted = tweet.text.replace(Rexp, "<a href ='$1' target='_blank'>$1</a>")
				return formatted;	
			} 
			//console.log(tweet.activityType);
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
			var formattedText = formatLinks();
			tweetTextCell.innerHTML = formattedText;

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