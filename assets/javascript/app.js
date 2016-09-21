$(document).ready(function(){
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBLw6ftPn541RzpgLFZMfvi0HXAq5QrCZw",
    authDomain: "train-schedule-ed1ea.firebaseapp.com",
    databaseURL: "https://train-schedule-ed1ea.firebaseio.com",
    storageBucket: "",
    messagingSenderId: "44826566717"
  };
firebase.initializeApp(config);

var database = firebase.database();

// variables 

var tName = "";
var tDestination = "";
var tTime = "";
var tFrequency = 0;
var arrival = "";
var minutes = 0;

//adding trains to list
$("#addTrain").on("click", function() {
    //data stored in variables
    tName = $('#traininput').val().trim();
    tDestination = $('#destinationinput').val().trim();
    tTime = $('#timeinput').val().trim();
    tFrequency = parseInt($('#frequencyinput').val().trim());
    console.log("This is tTime: " + tTime);

    //no blank entries
    if ((!tName) || (!tDestination) || (!tTime) || (!tFrequency)) {
        alert("Please enter in all of the train parameters");
        return false;
    } else {

    // Code for the push
    database.ref().push({
        tName: tName,
        tDestination: tDestination,
        tTime: tTime,
        tFrequency: tFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    })

    //clear out entries
    tName = $('#traininput').val("");
    tDestination = $('#destinationinput').val("");
    tTime = $('#timeinput').val("");
    tFrequency = $('#frequencyinput').val("");

    return false;
}
});

//watches for child added to database
//placing in values of variables
database.ref().on("child_added", function(childSnapshot) {
    tName = childSnapshot.val().tName;
    tDestination = childSnapshot.val().tDestination;
    tTime = childSnapshot.val().tTime;
    tFrequency = childSnapshot.val().tFrequency;
    
    //math to determine arrival time and minutes that the train will arrive
    // present
    var current = moment();
    
    // read that you need to subtract 1 year to make sure it comes before current time
    var trainTime = moment(tTime,"HH:mm").subtract(1, "years");

    // time difference between present and train time in minutes
    var difference = moment().diff(moment(trainTime), "minutes");

    // divide the time difference by the frequency, this number is important in determining when the next train is coming
    var difference2 = difference % tFrequency;

    // minutes for the train to arrive
    var minutes = tFrequency - difference2;

    // time the train arrives
    var arrival = moment().add(minutes, "minutes")

    //checking values
    console.log("current: " + moment(current).format("HH:mm"));
    console.log("trainTime: " + trainTime);
    console.log("difference: " + difference);
    console.log("difference2: " + difference2);
    console.log("minutes: " + minutes);
    console.log("arrival: " + moment(arrival).format("HH:mm A"));

    // appending information to train table
    $('#trainData >tbody').append("<tr><td>" + childSnapshot.val().tName + "</td><td>" + childSnapshot.val().tDestination + "</td><td>" + childSnapshot.val().tFrequency + "</td><td>" + moment(arrival).format("hh:mm A") + "</td><td>" + minutes + "</td>");

    //appending button to erase from the table
    // var close = $("<button>");
    // close.addClass("cancel");
    // close.append("Cancel");
    // $('tr').prepend(close);

// error code
}, function(errorObject){
    console.log("There was an error: " + errorObject.code);
});
// $(document).on('click', '.cancel', function(){
//     $(this).empty();
// });

});