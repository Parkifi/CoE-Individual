
/// disabling default sounds	
if(Ti.Platform.name == "android"){
	var touchSound = require('com.gstreetmedia.androidtouchsound');
}



var Flurry = require("com.onecowstanding.flurry");

	//DEBUG_IOS Flurry.appVersion = Ti.App.version;
	//DEBUG_IOS Flurry.startSession('9QN2KZPGD9C36VC252FW');

	Flurry.debugLogEnabled = true;
	Flurry.eventLoggingEnabled = true;
	Flurry.sessionReportsOnCloseEnabled = true;
	Flurry.sessionReportsOnPauseEnabled = true;
	Flurry.sessionReportsOnActivityChangeEnabled = true;
	Flurry.secureTransportEnabled = false;


	Flurry.logPageView();


//var SlideShow = require('/common/SlideShow');


// setup vars
	var BookMenu = require('/common/BookMenu');
	var BookDetails = require('/common/BookDetails');
	var args = arguments[0] || {};
	var currentItem = args.currentItem;
	var _menu;
	var bookDetails;
	var _storyData;
	var player = Ti.Media.createSound();
	var globalDelay;
	var buttonActiveFlag = true;

/// event listeners

	$.bookshelf.addEventListener('open', init);
	
	$.bookshelf.addEventListener('showBookDetails', showDetails);
	
	$.bookshelf_play.addEventListener('click', loadStory);
	
	$.bookshelf_play.addEventListener('touchstart', function(e){
		e.source.image = "/bookshelf/bookshelf_buton_play.png";
	
		var player = Ti.Media.createSound({url:"/audio/fx/click2-bookselection.mp3"});
			player.play();
	
			player = null;
	
	});
	
	$.bookshelf_play.addEventListener('touchend', function(e){
		e.source.image = "/bookshelf/bookshelf_buton_play_bw.png";
	});
	
	$.thumbnailPre.addEventListener('click', loadStory);
	
	///prevent back button on Android
	
	$.bookshelf.addEventListener('android:back', function(e) {
	    e.cancelBubble = true;
	});
	
	$.bookshelf.addEventListener('blur', winEvent);
	
	$.bookshelf.addEventListener('close', winEvent);
	
	$.bookshelf.addEventListener('focus', winEvent);
	
	$.bookshelf.addEventListener('open', winEvent);

function winEvent(e) {
    //alert('window event> evt:' + e.type + ' window:' + e.source.name);

    /* @TODO  prevent this event to happens twice */
    if(buttonActiveFlag){

		if(e.type == "blur"){

			stopLoopAudio();

		}
		if(e.type == "focus"){

			//playLoopAudio();
			verifyAudio();
		}

		buttonActiveFlag = false;
			//flag became true in one second
		globalDelay = setTimeout(function(){
			buttonActiveFlag = true;
			
		}, 200);

	}
}

// start the slide
function init(){
	
	
	if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ){
		
		if(Ti.App.Properties.getString('lastUpdate') ==  "March 13, 2014 11:36" ){			
			/// this app has never been updated
			 currentDate=Ti.App.Properties.getString('lastUpdate');
			 var alertDialog = Titanium.UI.createAlertDialog({
		              title: 'Internet Connection not found',
		              message: 'Please try again later.',
		              buttonNames: ['OK']
		            });
		            alertDialog.show();
			return			
		}
		//Ti.App.Properties.setString('lastUpdate', "March 13, 2014 11:36");
			
	}

	player.url = "/audio/bookshelf-opt.mp3";
	player.looping = true; 



	verifyAudio();

	/// block sounds only on android
	if(Ti.Platform.name == "android"){
		removeDefaultSounds();
	}

	



	//alert("system language" + Titanium.Locale.currentLanguage + "  app lang" + Alloy.Globals.userLanguage)

	 ///set about icon according to language
	 if(Alloy.Globals.userLanguage == "es"){

	 	$.toolbar_button_suscribe.image = "/bookshelf/bookshelf_navigator_suscribe_es.png";
	 	
	 }



	$.bookshelf_play.visible = false;
	$.thumbnailPre.visible = false;

	var _aboutText =  $.aboutText;
	

	_menu = new BookMenu( args.currentItem.id , _aboutText , touchSound);


	$.bookshelf.add( _menu.loadingScreen );

	_menu.loadThumbnails( thumbsLoaded);


	$.bookshelf.add( _menu.getTable() );

	function thumbsLoaded (_date){

		
			_menu.populateTable();

			$.bookshelf.removeEventListener('open', init);


			bookDetails = new BookDetails( _menu.getDefaultMesage() , touchSound );

			$.aboutText.text =  _menu.getAboutMessage();
			
			//$.bookshelf.remove(loader)

			$.bookshelf.add( bookDetails.getContainer() );

			if(_date){

				
		       
				/// set new time plus one minute to prevent download
				var serverDate = new Date( _date   );

				var updatedDate = new Date(serverDate.getTime() + 1*60000);
				//alert(serverDate);
				//alert(updatedDate);
				///
				Ti.App.Properties.setString('lastUpdate', updatedDate );
				currentDate=Ti.App.Properties.getString('lastUpdate');

				//alert(   Ti.App.Properties.getString('lastUpdate')  )
			}
		
	}
}

/// close the window and release memory
function closeBookshelf(){

		// clear Screen

		$.bookshelf.removeEventListener('open', init);
		$.bookshelf.removeEventListener('showBookDetails', showDetails);
		$.bookshelf_play.removeEventListener('click', loadStory);
		$.thumbnailPre.removeEventListener('click', loadStory);

		$.bookshelf.removeAllChildren();

		_menu.clear();
		_menu = null;
		bookDetails = null;
		_storyData = null;

		BookMenu = null;
		BookDetails = null;

		//delete BookMenu;
		//delete BookDetails;

		//delete _menu;
		//delete bookDetails;
		//delete _storyData;

		// send info to planetScreen
		var net = Ti.App.fireEvent('backPlanet');
		net = null;


		/// close this window
		$.bookshelf.close();
}

/// show book details
function showDetails(e){
	//alert(e.bookData)
	//var bookDetails = new BookDetails(e.bookData);
	

	/// send details to classes
	bookDetails.setData(e.bookData);


	///Define if this is a preview version (no previews)

	if( bookDetails.isPreview() ){
		/// previews do not have buttons

		$.bookshelf_play.visible = false;
		$.thumbnailPre.visible = false;

	}else{
		/// this is not a preview, show buttons
		$.bookshelf_play.visible = true;
		$.thumbnailPre.visible = true;
	}

	
	/// thumbnails are always visible
	$.thumbnail.visible = true;
	
	



	_storyData = e.bookData.storyID;
	
	bookDetails.showDetails();

	Flurry.logEvent('StoryDetailsClick', { storyID: _storyData });
}

function loadStory(e){
	
	
	if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ){
		
			
			
			if ( ! Ti.App.Properties.getString('bookID_' + _storyData) ){
				 
				 var alertDialog = Titanium.UI.createAlertDialog({
		              title: 'Internet Connection not found',
		              message: 'Please try again later.',
		              buttonNames: ['OK']
		            });
		            alertDialog.show();
				return	
			}
					
		
			//Ti.App.Properties.setString('lastUpdate', "March 13, 2014 11:36");
			
	}

	if(_storyData){


		Flurry.logEvent('StoryOpenClick', { storyID: _storyData });


		//alert(_storyData)
		var storyViewer = Alloy.createController('storyViewer', {storyID:_storyData}).getView();

		if(Ti.Platform.name == "android"){
			storyViewer.open({
				fullscreen:true,
				navBarHidden : true,
			});
		}else{

			storyViewer.open({
				fullscreen:true,
				navBarHidden : true,
				exitOnClose:true
			});
		}

		storyViewer = null;
		delete storyViewer;

		stopLoopAudio();

		$.bookshelf.addEventListener('focus', openBack );

		function openBack(){

			//playLoopAudio();
			verifyAudio();
			$.bookshelf.removeEventListener('focus', openBack );
		}
	}
}


/// set audio player according to user settings
function verifyAudio(){

	
	/// define bookshelf audio value if not set
	if(!Ti.App.Properties.getString('bookshelfAudioStatus')){

		// default value
		Ti.App.Properties.setString('bookshelfAudioStatus', "enabled");
	}

	if(Ti.App.Properties.getString('bookshelfAudioStatus') == "disabled"){

		player.stop();
		$.toolbar_button_mute.image="/bookshelf/bookshelf_navigator_sound_off.png";

		/// if audio is set to off, pause audio and update image;

	}else{

		player.play();
		$.toolbar_button_mute.image="/bookshelf/bookshelf_navigator_sound.png";
		
		/// if audio is set to on start audio and update image

	}
}



/// Navigator buttons

	/// play sound on load
	function playLoopAudio(){

		player.stop();

		player.url = "/audio/bookshelf-opt.mp3";
		player.looping = true; 
		player.play();

	}

	/// play background audio
	function stopLoopAudio(){
		//Ti.App.fireEvent('stopSlideShow');
		player.stop();
	}

	function toggleAudio(){


		if(buttonActiveFlag){

			if( player.playing){
				player.stop();
				$.toolbar_button_mute.image="/bookshelf/bookshelf_navigator_sound_off.png";
				Ti.App.Properties.setString('bookshelfAudioStatus', "disabled");
				
			}else{

				player.play();
				$.toolbar_button_mute.image = "/bookshelf/bookshelf_navigator_sound.png";
				Ti.App.Properties.setString('bookshelfAudioStatus', "enabled");
				
			}

			
			var playerFX = Ti.Media.createSound({url:"/audio/fx/click1_topmenu.mp3"});
			playerFX.play();

			playerFX = null;

			// prevent multiple clicks
			buttonActiveFlag = false;
			//flag became true in one second
			globalDelay = setTimeout(function(){
				buttonActiveFlag = true;
				
			}, 1000);

		}
	}

		function openFaceBook(){

		if(Alloy.Globals.userLanguage == "es"){
			var dialog = Ti.UI.createAlertDialog({
				confirm: 0,
				//buttonNames: ['Rate us','Later'],
				message: 'Sua avaliação nos estimula a criar!',
				title: 'Gostou do que viu?'
			});
		}else{

			var dialog = Ti.UI.createAlertDialog({
				confirm: 0,
				//buttonNames: ['Rate us','Later'],
				message: 'Sua avaliação nos estimula a criar!',
				title: 'Gostou do que viu?'
			});

		}


		// dialog.addEventListener('click', function(e){
		  //  if (e.index === e.source.confirm){
		   //Titanium.Platform.openURL("http://itunes.apple.com/WebObjects/MZStore.woa/wa/viewContentsUserReviews?id=916958931&pageNumber=0&sortOrdering=2&type=Purple+Software&mt=8");
		    //  Titanium.Platform.openURL("https://www.facebook.com/ChildrenOfTheElements");
		    //}
  		//});

		dialog.show();

		var player = Ti.Media.createSound({url:"/audio/fx/click1_topmenu.mp3"});
		player.play();

		player = null;
		//Titanium.Platform.openURL("https://www.facebook.com/ChildrenOfTheElements");
	}
	/// show subscribe 
	function suscribe(){

		Flurry.logEvent('SuscribeClick', { click: "true" });

		var animation = Titanium.UI.createAnimation({ opacity:1, duration: 600 });

		$.aboutImage.touchEnabled = true;
		$.aboutImage.zIndex = 100;
		$.aboutImage.width = "100%";
		$.aboutImage.height = "100%";
		$.aboutImage.animate(animation);
		$.aboutImage.addEventListener('click', function(){
			var animationx = Titanium.UI.createAnimation({ opacity:0, duration: 600 });
			$.aboutImage.animate(animationx );
			$.aboutImage.touchEnabled = false;
			$.aboutImage.width = "0%";
			$.aboutImage.height = "0%";
		});

		var player = Ti.Media.createSound({url:"/audio/fx/click1_topmenu.mp3"});
		player.play();

		player = null;

	}

	function removeDefaultSounds(){

		/*
		var _thumbnailPre = $.thumbnailPre
		var _bookshelf_play = $.bookshelf_play

		touchSound.disable( _thumbnailPre)
		touchSound.disable( _bookshelf_play )
		*/

		var _contentSelect			= $.contentSelect;
		var _bookshelf_toolBar		= $.bookshelf_toolBar;
		var _toolbar_button_mute		= $.toolbar_button_mute;
		var _toolbar_button_suscribe	= $.toolbar_button_suscribe;
		var _toolbar_button_home		= $.toolbar_button_home;
		var _thumbnail 				= $.thumbnail;
		var _thumbnailPre 			= $.thumbnailPre;
		var _aboutImage				= $.aboutImage;
		var _aboutText 				= $.aboutText;


		var elements = [ _contentSelect , _bookshelf_toolBar	, _toolbar_button_mute, _toolbar_button_suscribe, _toolbar_button_home, _thumbnail , _thumbnailPre , _aboutImage, _aboutText ];

		for (var i = 0; i < elements.length; i++) {
			touchSound.disable( elements[i] );
		};
	}


