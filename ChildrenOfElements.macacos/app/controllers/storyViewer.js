/// disabling default sounds
if(Ti.Platform.name == "android"){	
	var touchSound = require('com.gstreetmedia.androidtouchsound');
}


/// Enable Flurry Stats
	var Flurry = require("com.onecowstanding.flurry");

	//IOS DEBUG Flurry.appVersion = Ti.App.version;
	//IOS DEBUG Flurry.startSession('9QN2KZPGD9C36VC252FW');

	Flurry.debugLogEnabled = true;
	Flurry.eventLoggingEnabled = true;
	Flurry.sessionReportsOnCloseEnabled = true;
	Flurry.sessionReportsOnPauseEnabled = true;
	Flurry.sessionReportsOnActivityChangeEnabled = true;
	Flurry.secureTransportEnabled = false;
	Flurry.logPageView();

	_flurryAudioCounter = 0;
	_flurrySpeechCounter = 0;
	_flurryNextCounter = 0;
	_flurryPreviousCounter = 0;
	_flurryNextCounter = 0;




var args = arguments[0] || {};
var currentStoryID = args.storyID;

var Story = require('/common/StoryBuilder');
var Navigator = require('/common/StoryNavigator');

var	_story;
var _navigator;

var buttonActiveFlag = true;
var globalDelay;


/// importar clase creadora
/// importar manejo de sonidos?
/// importar manejo de slides? 
///prevent back button on Android

function pageBack(e){

    e.cancelBubble = true;

}
$.storyViewer.addEventListener('android:back', pageBack);

$.storyViewer.addEventListener('open', init );


$.storyViewer.addEventListener('blur', winEvent);
$.storyViewer.addEventListener('close', winEvent);
$.storyViewer.addEventListener('focus', winEvent);
$.storyViewer.addEventListener('open', winEvent);

function winEvent(e) {
    //alert('window event> evt:' + e.type + ' window:' + e.source.name);
    if(e.type == "blur"){

    	if(_story){
    		_story.stopAudio();
    	}
    	
    }
    if(e.type == "focus"){
    	
    	if(_story){
    		_story.playAudio();
    	}

    }
}


function init(){

	/** @TODO funcion de carga */
	//Ti.App.imageCount = 0

	setAudioGlobals();

	if(Ti.Platform.name == "android"){
		disableMuteSounds();
	}
	
	_story = new Story(currentStoryID , touchSound);

	$.storyViewer.add(_story.loadingScreen);
	
	_story.loadContent(contentLoaded);

	var _speech = $.speech;
	var _audio = $.audio;
	var _hints = $.hints;
	var _back =  $.back;
	var _next =  $.next;
	
	_story.setButtons( _speech, _audio, _hints );

	

	/// actions when content is loaded
	function contentLoaded (){
		//_story.buildSlides()
		/// send story to be managed by navigator

		_navigator = new Navigator( _story );
		_navigator.setButtons(_back, _next);
		
		$.storyStage.add(_navigator.init() );
		
		$.storyViewer.removeEventListener('android:back', pageBack);


	}
	
	///set a default for menu
	$.anchor.active = false;


	/** @TODO agregar controles de navegacion **/
}

/// Navigation buttons 
	function next(){

		hideMenu(1);

		_story.cleanAudio();

		_navigator.next();

		//Flurry.logEvent('clicNext', "true");
	}

	function back(){
		hideMenu(1);

		_story.cleanAudio();

		_navigator.back();
		
		// Flurry.logEvent('clicBack', "true");

	}

	function stopSpeech(){
		//alert("stopSpeech")
		//_story.stopSpeech();
		//Flurry.logEvent('clicSpeech', "true");
	}

	function toggleAudio(){

		if(buttonActiveFlag){

			if(!$.audio.active){

				_story.stopAudio();
				$.audio.active = true;
				$.audio.backgroundImage = "/menu/button_sound_off.png";
				Ti.App.Properties.setString('storyAudioStatus', "disabled");

				//Flurry.logEvent('clicAudio', "mute");
			}else{

				_story.playAudio();
				$.audio.active = false;
				$.audio.backgroundImage = "/menu/button_sound.png";
				Ti.App.Properties.setString('storyAudioStatus', "enabled");
				
				//Flurry.logEvent('clicAudio', "play");
			}


			var player = Ti.Media.createSound({url:"/audio/fx/click1_topmenu.mp3"});
			player.play();

			player = null;

			makeDelay();
		}
	}

	function toggleSpeech(){

		if(buttonActiveFlag){

			if(!$.speech.active ){

				_story.pauseSpeech();
				$.speech.active = true;
				$.speech.backgroundImage = "/menu/button_speech_off.png";
				Ti.App.Properties.setString('speechAudioStatus', "disabled");
				
				//Flurry.logEvent('clicSpeech', "mute");

			}else{

				_story.playSpeech();
				$.speech.active = false;
				$.speech.backgroundImage = "/menu/button_speech.png";
				Ti.App.Properties.setString('speechAudioStatus', "enabled");
				
				//Flurry.logEvent('clicSpeech', "play");
			}

			var player = Ti.Media.createSound({url:"/audio/fx/click1_topmenu.mp3"});
			player.play();

			player = null;

			makeDelay();
		}
	}

	function toggleHints(){

		if(buttonActiveFlag){

			if(!$.hints.active ){

				_story.showHint();
				$.hints.active = true;
				//Flurry.logEvent('clickHint', "show");

			}else{

				_story.hideHint();
				$.hints.active = false;
				//Flurry.logEvent('clickHint', "hide");
			}

			var player = Ti.Media.createSound({url:"/audio/fx/click1_topmenu.mp3"});
				player.play();

				player = null;

			makeDelay();
		}

	}


	function toggleMenu(){

		if(buttonActiveFlag){

			if(!$.anchor.active){

				showMenu();

			}else{

				hideMenu();
			}

			var player = Ti.Media.createSound({url:"/audio/fx/click1_topmenu.mp3"});
				player.play();

				player = null;

			makeDelay();
		}

	}


/////// tools

var autoHide

	function showMenu(){

		var menuAnimation = Ti.UI.createAnimation({
				top:0,
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
				duration:600
			});

			$.menuElements.animate(menuAnimation);

			$.anchor.active = true;
			
			// enable clicks on bar
			$.navBar.touchEnabled = true;
			
			/// prevent multiple autohide
			if(typeof autoHide == "number" ){
				clearTimeout(autoHide);
			}
			
			
			autoHide = setTimeout(function(){
				
					hideMenu();
				
			}, 10000 );
	}

	function hideMenu(_time){
			var menuAnimation = Ti.UI.createAnimation({
				top:-200,
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
				duration:500
			});
			if(_time){
				menuAnimation.duration = 1;
			}

			$.menuElements.animate(menuAnimation);

			$.anchor.active = false;
			$.hints.active = false;
			
			// disable clicks on bar
			$.navBar.touchEnabled = false;
			
			/// prevent multiple autohide
			if(typeof autoHide == "number" ){
				clearTimeout(autoHide);
			}
			
	}

	function makeDelay(){

		// prevent multiple clicks
		buttonActiveFlag = false;
			//flag became true in one second
		globalDelay = setTimeout(function(){
				buttonActiveFlag = true;

				//prevent any other timeOut running
				clearTimeout(globalDelay);
				
		}, 1000);

	}

	function disableMuteSounds(){

		

		var _storyStage = $.storyStage;
 		var _navBar = $.navBar;
		var _menuElements = $.menuElements;
 		var _speech = $.speech;
		var _audio = $.audio;	
		var _hints = $.hints;
		var _home = $.home;
		var _back = $.back;
 		var _next = $.next;
		var _anchor = $.anchor;

		var elements = [_storyStage, _navBar, _menuElements ,  _speech ,  _audio ,  _hints , _home ,  _back , _next, _anchor ];

		for (var i = 0; i < elements.length; i++) {
			touchSound.disable( elements[i] );
		};
	}

	function setAudioGlobals(){

		///define audio global settings if not enabled

		/// define story audio value if not set
		if(!Ti.App.Properties.getString('storyAudioStatus')){
			// default value
			Ti.App.Properties.setString('storyAudioStatus', "enabled");
		}

		/// define speech audio value if not set
		if(!Ti.App.Properties.getString('speechAudioStatus')){
			// default value
			Ti.App.Properties.setString('speechAudioStatus', "enabled");
		}


		//// arrange assets according to settings

		if(Ti.App.Properties.getString('storyAudioStatus') == "disabled" ){
			//_story.stopSpeech();
			$.audio.active = false;
			$.audio.backgroundImage = "/menu/button_sound_off.png";
		}else{

			//$.audio.active = true;
			//$.audio.backgroundImage = "/menu/button_sound.png"
		}


		if(Ti.App.Properties.getString('speechAudioStatus') == "disabled" ){
			//_story.stopSpeech();
			$.speech.active = false;
			$.speech.backgroundImage = "/menu/button_speech_offpng";
		}

	}



function exitStory(){

	var player = Ti.Media.createSound({url:"/audio/fx/click1_topmenu.mp3"});
	player.play();

	player = null;


	///reset audio settings to prevent other stories get mute
	Ti.App.Properties.setString('storyAudioStatus', "enabled");
	Ti.App.Properties.setString('speechAudioStatus', "enabled");

	$.storyStage.removeAllChildren();

	$.storyViewer.removeEventListener('open', init);

	_story.cleanAudio();
	_story.clean();
	_navigator.clean();

	_story = null;
	_navigator = null;
	
	//delete _story;
	//delete _navigator;
	

	$.storyViewer.close();

}