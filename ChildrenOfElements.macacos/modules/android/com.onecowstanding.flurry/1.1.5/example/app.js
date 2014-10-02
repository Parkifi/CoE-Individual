var window = Ti.UI.createWindow({
    layout: 'vertical',
    backgroundColor: '#fff'
});

// configure Flurry module
var Flurry = require('com.onecowstanding.flurry');
Flurry.appVersion = Ti.App.version;
Flurry.debugLogEnabled = true;
Flurry.eventLoggingEnabled = true;
Flurry.sessionReportsOnCloseEnabled = true;
Flurry.sessionReportsOnPauseEnabled = true;
Flurry.sessionReportsOnActivityChangeEnabled = true;
Flurry.secureTransportEnabled = false;

// start the Flurry session
Flurry.startSession('00000000000000000000' /* <-- PUT YOUR API KEY HERE */);

// automatically log transitions on iOS
Flurry.logAllPageViews();

// manually log a transition
Flurry.logPageView();

// here is an example of using an application property (defined in tiapp.xml) to hold different a apiKey for each platform
//if (Ti.Android) {
//    Flurry.startSession(Ti.App.Properties.getString('flurry.android.apiKey'));
//} else {
//    Flurry.startSession(Ti.App.Properties.getString('flurry.iphone.apiKey'));
//}

// set some information about the user
Flurry.setAge(34);
Flurry.setUserId('John Doe');
Flurry.setGender('m');

var logEventButton = Ti.UI.createButton({
    title: 'Log Event',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    width: Ti.UI.FILL,
    height: 40
});
var clickCount = 0;
logEventButton.addEventListener('click', function() {
    // log an event with a single parameter called 'clickCount'
    Flurry.logEvent('click', { clickCount: ++clickCount });
});
window.add(logEventButton);

var startTimedEventButton = Ti.UI.createButton({
    title: 'Start Timed Event',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    width: Ti.UI.FILL,
    height: 40
});
startTimedEventButton.addEventListener('click', function() {
    // start a timed event called 'timedClick' (with no parameters)
    Flurry.logTimedEvent('timedClick');
});
window.add(startTimedEventButton);

var endTimedEventButton = Ti.UI.createButton({
    title: 'End Timed Event',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    width: Ti.UI.FILL,
    height: 40
});
endTimedEventButton.addEventListener('click', function() {
    // end a timed event called 'timedClick' (with no parameters)
    Flurry.endTimedEvent('timedClick');
});
window.add(endTimedEventButton);

var errorButton = Ti.UI.createButton({
    title: 'Simulate Error',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    width: Ti.UI.FILL,
    height: 40
});
errorButton.addEventListener('click', function() {
    // log an error
    Flurry.logError('simulatedError', 'Whoops, we manufactured an error!');
});
window.add(errorButton);

var locationButton = Ti.UI.createButton({
    title: 'Log Location',
    top: 8,
    left: 8,
    right: 8,
    bottom: 8,
    width: Ti.UI.FILL,
    height: 40
});
locationButton.addEventListener('click', function() {
    if (Ti.Geolocation.locationServicesEnabled) {
        Ti.Geolocation.purpose = 'Testing';
        Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_HIGH;
        Ti.Geolocation.getCurrentPosition(function(e) {
            if (e.coords) {
                // explicitly log location (for iOS-only)
                Flurry.recordLocation({
                    latitude: e.coords.latitude,
                    longitude: e.coords.longitude,
                    horizontalAccuracy: e.coords.accuracy,
                    verticalAccuracy: e.coords.altitudeAccuracy
                });
            }
        });
    }
});
window.add(locationButton);

window.open();
