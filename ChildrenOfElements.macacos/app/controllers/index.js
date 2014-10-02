var Flurry = require("com.onecowstanding.flurry");
var FontDictionary = require('/common/CreateFontDictionary');


Flurry.appVersion = Ti.App.version;

//assign flurry key by OS
	if(Ti.Platform.osname == "android"){
		/// flury for android
		Flurry.startSession('9QN2KZPGD9C36VC252FW');
		
	}else{
		/// flury for iOS
		Flurry.startSession('SNF2V3NZ6TRXKY8ZCVZ2');
	}

	Flurry.debugLogEnabled = true;
	Flurry.eventLoggingEnabled = true;
	Flurry.sessionReportsOnCloseEnabled = true;
	Flurry.sessionReportsOnPauseEnabled = true;
	Flurry.sessionReportsOnActivityChangeEnabled = true;
	Flurry.secureTransportEnabled = false;



Flurry.logPageView();

var FileDownloader = require('/common/FileDownloader');


var player;
var _flagPlanetIsMoving = false;
var controlActivePlanet;



//// OPEN THE VIEW

	/*
		$.index.open({
			fullscreen:true,
			navBarHidden : true,
			exitOnClose : false
		});
	*/
	
	/// listen of window open
	//$.index.addEventListener('open', init);
init();

//Ti.App.addEventListener("restartAll", init);


/// initialize the whole app
function init(){

	

	/// Define a base last update if there's none.
	/// This line only runs once in the app's lifetime
	currentDate=Ti.App.Properties.getString('lastUpdate');
	decision= ( ! Ti.App.Properties.getString('lastUpdate') );
	if ( ! Ti.App.Properties.getString('lastUpdate') ){
		Ti.App.Properties.setString('lastUpdate', "March 13, 2014 11:36");
		currentDate=Ti.App.Properties.getString('lastUpdate');
	}
	
	verifyLanguage();

	///define the sistem fonts
	defineSystemFonts();


	///system folder creation
	///-----
	/// set up base folders
	/// this line only runs once in the apps's lifetime
		var imageDir = Ti.Filesystem.getFile(Titanium.Filesystem.applicationCacheDirectory , 'bookshelfData');
		if (! imageDir.exists()) {
		    imageDir.createDirectory();
		    /*
		    ///after creating the directory, move everything from the resources
			var oF = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(),  'bookshelfData');
			
			var children = oF.getDirectoryListing();
			for ( var iChild = 0, IChild = children.length;  iChild < IChild;  iChild++ )
			{
			   var path = children[iChild];
			   var sourcepath = Ti.Filesystem.getResourcesDirectory() + 'bookshelfData' + Ti.Filesystem.separator;
			   var source = Titanium.Filesystem.getFile(sourcepath, path);
			   var destpath= Ti.Filesystem.applicationCacheDirectory+ 'bookshelfData' + Ti.Filesystem.separator;
			   var dest =  Titanium.Filesystem.getFile(destpath, path);
			   if (source.exists() && (!dest.exists()) ) {
    				dest.createFile();
    				dest.write(source.read() );
					}
				source = null;
				dest = null;
			 }        
		//alert('ended moving all the bookshelf resources to the caches');*/
		}	

		    ///end here moving the resources
		///start moving the story resources
		
		/*var storyDir = Ti.Filesystem.getFile(Titanium.Filesystem.applicationCacheDirectory , 'hamm');
		if (! storyDir.exists()) {
		    storyDir.createDirectory();
		    ///after creating the directory, move everything from the resources
			var oF = Ti.Filesystem.getFile(Ti.Filesystem.getResourcesDirectory(),  'hamm');
			
			var children = oF.getDirectoryListing();
			for ( var iChild = 0, IChild = children.length;  iChild < IChild;  iChild++ )
			{
			   var path = children[iChild];
			   var sourcepath = Ti.Filesystem.getResourcesDirectory() + 'hamm' + Ti.Filesystem.separator;
			   var source = Titanium.Filesystem.getFile(sourcepath, path);
			   var destpath= Ti.Filesystem.applicationCacheDirectory+ 'hamm' + Ti.Filesystem.separator;
			   var dest =  Titanium.Filesystem.getFile(destpath, path);
			   if (source.exists() && (!dest.exists()) ) {
    				dest.write(source.read() );
					}
				source = null;
				dest = null;
			 }        
		///alert('ended moving all the story resources to the caches');
		}
		
		///end moving the story resources*/
		
		var downloader = new FileDownloader();



	////// update bookshelf menu if needed
	
		if(Titanium.Network.networkType == Titanium.Network.NETWORK_NONE ){
			
			
			
			filesDone();
			
		}else{
			
			/// download update file and read it
			downloader.checkUpdate(updateMenu);
		}


		

		function updateMenu(updateNeeded){

			
			if(updateNeeded == true ){
					var menuFiles = ["bookshelfData/north_menu.json"];
					var list = downloader.makeQueue(menuFiles , "bookshelfData");
					downloader.downloadMultiFile(list ,filesReady, filesDone);
			}else{
				 
				filesDone();
			}
		}
		function filesReady(){}
		function filesDone(){
			//menu files are ready
			var fakePlanet = {id:"north"};

			openBookshelf(fakePlanet);
		}
}
 

/// open the next screen
function  openBookshelf(_target){
	
 	// reset elements
 	currentID = _target.id.toString();
 	var seleccionado  = _target;

	var bookshelfx = Alloy.createController('bookshelf', {currentItem: _target, prev:$.index}).getView();
				
	

	///
		//// Open the next page
		//ovagia comment all below
		bookshelfx.open({
			fullscreen:true,
			navBarHidden : true,
			exitOnClose: false
		});

				

 }


//// define all sistem fonts, this function only runs once on the app lifetime
function defineSystemFonts(){

		var _systemFonts = new FontDictionary();
		_systemFonts.init();
}


/// validation elements
function verifyLanguage(){
	// check user language
	 

			/// currently just supports spanish
				if (Titanium.Locale.currentLanguage == "es") {
					// define spanish as current language
					//alert("la app esta en espanol")
					Alloy.Globals.userLanguage  = "es";

				}else{
					//alert("la app no esta en ingles, pero vale madres")
					/// any other language will be defined as "english"
					Alloy.Globals.userLanguage  = "en";
				}



				if( Ti.App.Properties.getString('sysLang') ){
					/// verify whats the last language

					if( Ti.App.Properties.getString('sysLang') != Alloy.Globals.userLanguage ){
						/// if language change. reset cache
						Ti.App.Properties.setString('lastUpdate', "March 13, 2014 11:36");
						currentDate=Ti.App.Properties.getString('lastUpdate');
					}

				}

				Ti.App.Properties.setString('sysLang', Alloy.Globals.userLanguage ); 
}


/// clean the mess
function cleanUp(_action){

	var clipsVisible = (_action=="show")? 1:0;
	 
	var animation = Titanium.UI.createAnimation({
						opacity: clipsVisible,
						curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
						duration: 400
					});
	// hide/show other planets
	if ($.index.children) {

		// loop across screen elements 
		for (var c = 0; c < $.index.children.length ; c++) {

			// object cache
			var currentItem = $.index.children[c];

				//currentItem.activePlanet = false;
				 
				if(currentItem.activePlanet != true){

					
					currentItem.animate(animation);

				}
				 

		}

	}

	//send main planets
	if(_action == "show"){

		positionMainPlanet(controlActivePlanet);

	}
}




