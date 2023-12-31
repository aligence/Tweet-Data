"use strict";
class Tweet {
    constructor(tweet_text, tweet_time) {
        this.text = tweet_text;
        this.time = new Date(tweet_time); //, "ddd MMM D HH:mm:ss Z YYYY"
    }
    //returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source() {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if ((this.text.includes("completed") || this.text.includes("Just posted a")) && (!this.text.includes("PB") || !this.text.includes("record"))) {
            return "completed_event";
        }
        else if (this.text.includes("Watch") || this.text.includes("#RKLive")) {
            return "live_event";
        }
        else if (this.text.includes("Achieved") || this.text.includes("new personal record") || this.text.includes("PB")) {
            return "achievement";
        }
        else {
            return "miscellaneous";
        }
    }
    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written() {
        this.text.replace(/#RunKeeper/g, '').replace(/https:\/\/t\.co\/[a-zA-Z0-9]+/g, '');
        var hasUserText = true;
        if (this.text.includes("Check it out!")) {
            hasUserText = false;
        }
        return hasUserText;
    }
    get writtenText() {
        if (!this.written) {
            return "";
        }
        else {
            let fixed = this.text.replace(/#RunKeeper/g, '').replace(/https:\/\/t\.co\/[a-zA-Z0-9]+/g, '');
            let splitText = [];
            if (fixed.indexOf('-')) {
                splitText = fixed.split("- ");
            }
            let result = splitText[1];
            return result;
        }
    }
    get activityType() {
        /*
        if (this.source != 'completed_event') {
            return "unknown";  //might be killing my program
        }
        */
        if (this.text.match("ski run")) {
            return "skiing";
        }
        else if (this.text.match("bike")) {
            return "biking";
        }
        else if (this.text.match("run")) {
            return "running";
        }
        else if (this.text.match("swim")) {
            return "swimming";
        }
        else if (this.text.match("workout")) {
            return "workout";
        }
        else {
            return "undefined";
        }
    }
    get distance() {
        if (this.source != 'completed_event') {
            return 0;
        }
        if (this.text.match("mi")) {
            let parts = this.text.split("mi");
            let half = parts[0].trim(); // gets the part before mi
            let goodHalf = half.split("a "); // splits between a and the number
            let justNum = goodHalf[1]; // just the number
            let dist = parseFloat(justNum);
            return dist;
        }
        else if (this.text.match("km")) {
            let parts = this.text.split("km");
            let half = parts[0].trim(); // gets the part before mi
            let goodHalf = half.split("a "); // splits between a and the number
            let justNum = goodHalf[1]; // just the number
            let dist = parseFloat(justNum);
            dist = dist * 0.621371;
            return dist;
        }
        return 0;
    }
    get day() {
        const date = this.time;
        if (date.getDay() == 0) {
            return "Sun";
        }
        else if (date.getDay() == 1) {
            return "Mon";
        }
        else if (date.getDay() == 2) {
            return "Tue";
        }
        else if (date.getDay() == 3) {
            return "Wed";
        }
        else if (date.getDay() == 4) {
            return "Thu";
        }
        else if (date.getDay() == 5) {
            return "Fri";
        }
        else {
            return "Sat";
        }
    }
    getHTMLTableRow(rowNumber) {
    }
}
