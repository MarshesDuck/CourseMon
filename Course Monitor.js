// ==UserScript==
// @name     uwo course availability checker
// @version  1.2
// @author Lucky Ducky
// @match	https://studentservices.uwo.ca/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @run-at       document-end
// ==/UserScript==


// ---------------------- USER SETTINGS ------------------------------

// Specify the course that you would like to monitor here!

courseSubject = "HISTORY"

courseNumber = "1201E"


// ----------------------------///------------------------------------

//Asks for permission to play a notification
function grantNotifPerm() {
  if (Notification.permission !== "granted"){
    Notification.requestPermission();
  }
  else{
  }
}

//set course subject
document.getElementById("inputSubject").value = courseSubject;
grantNotifPerm();


//set course number (and term if applicable) (eg. 2250, 1021A, 2155F, 2601A)
document.getElementById("inputCatalognbr").value = courseNumber;


// prevents window from showing resubmit form dialogue
if ( window.history.replaceState ) {
  window.history.replaceState( null, null, window.location.href );
}


//automatically clicks submit button (change the number to modify how frequently the course is checked, right now the setting is on 10 seconds)
setTimeout(function() {
    $(".btn.btn-info.span2").trigger('click');  
}, 10000);


//checks if status of course becomes "Not Full" 
var TEXT = "Not Full";
//var TEXT = "Full";
var COLOR = "red";

var courseAlert = false;


// Highlights courses that are not full in red for your viewing convenience
var allText = document.evaluate( "//text()[contains(., '" + TEXT + "' )]", document, null, XPathResult. ORDERED_NODE_SNAPSHOT_TYPE , null);

for(var i = 0; i < allText.snapshotLength; i++)
{
	var cur = allText.snapshotItem(i);
	var par = cur.parentNode;
	var textInd;
	var curName = cur.nodeName;
	
  do
	{
		var curText = cur.nodeValue;
		textInd = curText.indexOf(TEXT);
		
    if(textInd != -1)
		{
			var before = document.createTextNode( curText.substring(0, textInd ) );
			var highlight = document. createElement("span");
			highlight.class = "highlight";
			highlight.textContent = TEXT;
			highlight.style.color = COLOR;
			var after = document.createTextNode( curText.substring(textInd + TEXT.length) );
			par.insertBefore(before, cur);
			par.insertBefore(highlight, cur);
			par.insertBefore(after, cur);
			par.removeChild(cur);
			cur = after;
      // sets courseAlert to true so that this script will play a desktop notification
      courseAlert = true;
		}
	} while(textInd != -1)
}

// Creates the notification to be shown when a course is not full.
function notifyMe() {
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  else if (Notification.permission === "granted") {
    var notification = new Notification(courseSubject + " " + courseNumber + " is now avaliable!");
  }

  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function (permission) {
      if (permission === "granted") {
        var notification = new Notification(courseSubject + " " + courseNumber + " is now avaliable!");
      }
    });
  }

}

// Creates notification audio
function play() {
  var audio = new Audio('https://raw.githubusercontent.com/MarshesDuck/Course-Monitor/master/insight.mp3');
  audio.play();
}
  
// sends out a notification if any courses are not full
if (courseAlert == true){
  play();
  notifyMe();
}
