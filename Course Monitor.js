// ==UserScript==
// @name     uwo course availability checker
// @version  1.21
// @author   Lucky Ducky
// @match	   https://studentservices.uwo.ca/*
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at   document-end
// ==/UserScript==


// ---------------------- USER SETTINGS ------------------------------

// Specify the course that you would like to monitor here!

courseSubject = "HISTORY"

courseNumber = "1201E"


// ----------------------------///------------------------------------

// Asks for permission to play a notification
function grantNotifPerm() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
}
grantNotifPerm();

// set course subject
document.getElementById("inputSubject").value = courseSubject;

// set course number (and term if applicable) (eg. 2250, 1021A, 2155F, 2601A)
document.getElementById("inputCatalognbr").value = courseNumber;

// prevents window from showing resubmit form dialogue
if (window.history.replaceState) {
  window.history.replaceState(null, null, window.location.href);
}

// automatically clicks submit button to refresh the page
setTimeout(function() {
  $(".btn.btn-info.span2").trigger("click");
}, 10000);

// initialize variables for course status checking
var TEXT = "Not Full"
var COLOR = "red"
var courseAlert = false;

// highlights and parses text
var allText = document.evaluate("//text()[contains(., '" + TEXT + "' )]", document,
  null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < allText.snapshotLength; i++) {
  var cur = allText.snapshotItem(i);
  var par = cur.parentNode;
  var textInd;
  var curName = cur.nodeName;

  do {
    var curText = cur.nodeValue;
    textInd = curText.indexOf(TEXT);

    if (textInd != -1) {
      var before = document.createTextNode(curText.substring(0, textInd));
      var highlight = document.createElement("span");
      highlight.class = "highlight";
      highlight.textContent = TEXT;
      highlight.style.color = COLOR;
      var after = document.createTextNode(curText.substring(textInd + TEXT.length));

      par.insertBefore(before, cur);
      par.insertBefore(highlight, cur);
      par.insertBefore(after, cur);
      par.removeChild(cur);
      cur = after;
      // sets courseAlert to true to trigger a notification
      courseAlert = true;
    }
  } while (textInd != -1)
}

// Creates the notification to be shown when a course is not full.
function notifyMe() {
  var notification = new Notification(courseSubject + " " + courseNumber + " is now avaliable!");
}

// Notification sound audio
function play() {
  var audio = new Audio("https://raw.githubusercontent.com/MarshesDuck/Course-Monitor/master/insight.mp3");
  audio.play();
}

// Sends out the notification when a course is avaliable
if (courseAlert == true) {
  notifyMe();
  play();
}
