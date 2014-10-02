
var LoaderScreen = require('/common/LoaderScreen');

/// disabling default sounds	
//var touchSound = require('com.gstreetmedia.androidtouchsound');


function BookMenu(_planetID,  _aboutTextContainer , _touchSound){
	
	//this.screenTitle = _titleTarget;
	//this.screenText = _textTarget;co
	this.aboutTextContainer = _aboutTextContainer;
	
	if(Ti.Platform.name == "android"){
		this.touchSound = _touchSound;
	}
	

	this.menuContainer = Ti.UI.createScrollView({
		top:13,
		left: 100,
		width:450,
		height: "98%",
		contentWidth: 450,
		contentHeight: 'auto',
		showVerticalScrollIndicator: false,
		showHorizontalScrollIndicator: false,
	});

	this.parseJsonDoc(_planetID);

	this.menuContainer.addEventListener('selectedBook', this.selectedBookHandler);

	this.createLoadingScreen();
}

var FileDownloader = require('/common/FileDownloader');

BookMenu.prototype.menuContainer;
BookMenu.prototype.loadingScreen;
BookMenu.prototype.aboutTextContainer;

/// inner methods

	BookMenu.prototype.loadThumbnails = function(_callbackThumbsLoaded) {
		
		var localDate =  this.parseDate( Ti.App.Properties.getString('lastUpdate') );
		
		//var north = "north_menu.json";
		//var north_path =   Ti.Filesystem.applicationCacheDirectory+ 'bookshelfData' + Ti.Filesystem.separator;
		//var north_source = Titanium.Filesystem.getFile(north_path, north);
		//this.jsonData = north_source.read();
 		var serverDate = this.parseDate( this.jsonData.lastUpdate.toString() );
		//alert('bookmenu 48');
		//new Date( this.jsonData.lastUpdate.toString() );
		//alert(serverDate.getTime() + " --- " +   localDate.getTime() )


	/// set callback values, true if update needed false if not

		if(  serverDate.getTime() >= localDate.getTime()  ){

				var thumbnailsList = [];
				//alert(serverDate.getTime());
				//alert(localDate.getTime());

				for (var i = 0; i < this.jsonData.data.length; i++) {

					/// select the thumbnail according to the language
					var lang_sufix = (Alloy.Globals.userLanguage=="en")? this.jsonData.data[i].thumb_en : this.jsonData.data[i].thumb_es;

						 
						if(this.jsonData.data[i].slideshow){

							for (var ib = 0; ib < this.jsonData.data[i].slideshow.length; ib++) {
								thumbnailsList.push ( "bookshelfData/" +  this.jsonData.data[i].slideshow[ib] );
							};

						}
						 


					thumbnailsList.push ( "bookshelfData/" + lang_sufix );

				};


				var downloader = new FileDownloader();
				downloader.setLoaderScreen( this.loadingScreen );

				var list = downloader.makeQueue( thumbnailsList , "bookshelfData");

				/// start downloads	
					downloader.downloadMultiFile(list ,function(e,_percentage){

						//_loadingScreen.children[0].width = ( _percentage * 6 )

					}, function(){
						 
						_callbackThumbsLoaded(serverDate);
						//_loadingScreen.visible = false;

					});
				
				downloader = null;
				thumbnailsList = null;
				list = null;
				lang_sufix = null;

		}else{

			_callbackThumbsLoaded();
		}
	};


	/**

		return the menu container
	**/
	BookMenu.prototype.getTable = function() {

		return this.menuContainer;
	};




	/**
		Check the menu map file for this planet exists
		if is available return menu data
		otherwise return false
	**/
	BookMenu.prototype.parseJsonDoc = function(_ID) {

		// retrieve and read the file
			//TODO USING JUST THE NORTH JSON
			///var _URL = "bookshelfData/" + _ID + "_menu.json";
			var _URL = "bookshelfData/north_menu.json";
			var file = Titanium.Filesystem.getFile( Titanium.Filesystem.applicationCacheDirectory , _URL);
			var data = file.read();

		/// parse data if available

			if(data.text==""){
				Ti.API.info("error reading JSON file for menu");
				this.jsonData = false;
			}else{
				Ti.API.info("here now error reading JSON file for menu");
				this.jsonData = JSON.parse(data.text);
				if(this.jsonData.popUpMessage){
					this.aboutTextContainer.text  = this.jsonData.popUpMessage;
				}
				
			}




		/// now that have data from file, render the menu			
	};


	/**

		populate the menu using data from json file
	**/
	BookMenu.prototype.populateTable = function() {



		var tableData = [];
		var topPos = 75;
		//var topPos = 0;
		var rowCount;


		for (var i = 0; i < this.jsonData.data.length; i++) {

			var imageFile = (Alloy.Globals.userLanguage=="en")? Titanium.Filesystem.applicationCacheDirectory + "bookshelfData/" + this.jsonData.data[i].thumb_en : Titanium.Filesystem.applicationCacheDirectory + "bookshelfData/" + this.jsonData.data[i].thumb_es;
			var row = Ti.UI.createImageView({
				//width:225,
				//height:297,
				width:451,
				height:597,
				top: topPos,
				image: imageFile,
				
			});
			//alert(Titanium.Filesystem.applicationCacheDirectory + "bookshelfData/" + this.jsonData.data[i].thumb_en);
			/// set rows position
				if ((i%2) == 0 ){
					row.left = 0;
				}else{
					row.left = 226;
					topPos = topPos + 298;
				}

			row.bookData = this.jsonData.data[i];
			/// attach Events

			
			if(Ti.Platform.name == "android"){
				this.touchSound.disable(row);
			}

			row.addEventListener('click', function(e){

				/// send item data to parent
				
				var evtData = {
					bookData:e.source.bookData
				};
				
				var evento = e.source.getParent().fireEvent("selectedBook", evtData);

				var player = Ti.Media.createSound({url:"/audio/fx/click2-bookselection.mp3"});
				player.play();

				//player = null

			});

			this.menuContainer.add(row);
		};
	};

	/**
		event handler
		Send Book data to bookshelf screen when icon is clicked 
	**/
	BookMenu.prototype.selectedBookHandler = function(e) {

		/// looks like a repeated function, but it is used to improve performance DO NOT REMOVE IT!
		var evtData = {
			bookData:e.bookData
		};
		
		e.source.getParent().fireEvent("showBookDetails",evtData);
	};
	


	BookMenu.prototype.createLoadingScreen = function() {

		/*
			/// create the container
			var loadingScreen = Ti.UI.createView({
				zIndex:100,
				backgroundColor:"#77ffffff",
				width:"100%",
				height:"100%", 
				top:0,
				visible:false,
				left:0
			});

			/// create the progress
			var imageIcon = Ti.UI.createImageView({
				width: 140,
				height:140,
				top: 303,
				left: 0,
				image: "/loadingScreen/circle.png",
				zIndex:10
			});

			var loadBar = Ti.UI.createImageView({
				width:925,
				height:46,
				top:406,
				//left:13,
				image: "/loadingScreen/loadbar.png"
			});

			var bothContainer = Ti.UI.createView({
				width:925,
				
			});





			var matrix = Ti.UI.create2DMatrix();
			
			if(Ti.Platform.osname == "android"){
				matrix = matrix.rotate(359);
			}else{
				matrix = matrix.rotate(180);

			}


			var animation = Titanium.UI.createAnimation({
				transform:matrix,
				repeat: 1000,
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
				duration: 4000
			});

			if(Ti.Platform.osname == "ipad"){
				animation.autoreverse =  true
			}


			imageIcon.animate( animation );

			



			//loadingScreen.add(loadBar);
			//loadingScreen.add(imageIcon);
			bothContainer.add(loadBar);
			bothContainer.add(imageIcon);

			loadingScreen.add(bothContainer);

			imageIcon.animate( animation );
		*/

		var _loadingScreen = new LoaderScreen();
		this.loadingScreen = _loadingScreen.getLoader(); 
		 //loadingScreen;
			
	};


	BookMenu.prototype.getDefaultMesage = function() {

		var results = "";
		if(Alloy.Globals.userLanguage == "es"){
			results = this.jsonData.defaultMessage_es;
		}else{
			results = this.jsonData.defaultMessage_en;
		}

		return results;
		
	};

	BookMenu.prototype.getAboutMessage = function() {

		var results = "";
		if(Alloy.Globals.userLanguage == "es"){
			results = this.jsonData.popUpMessage_es;
		}else{
			results = this.jsonData.popUpMessage_en;
		}

		return results;
	};
 
	/**
	
	BookMenu.prototype.getPreloader = function(first_argument) {
		
	};
	*/

	/**

		remove remainig traces of the app
	**/
	BookMenu.prototype.clear = function() {
		
		//this.removeEventListener('jsonReady', this.populateTable );
		this.menuContainer.removeEventListener('selectedBook', this.selectedBookHandler);

		this.menuContainer.removeAllChildren();

		this.loadingScreen = null;
		this.menuContainer = null;

		//delete 	BookMenu.prototype.menuContainer;
		//delete  BookMenu.prototype.loadingScreen;
	};
	
	///format date to fit all OS
	BookMenu.prototype.parseDate = function(_date){


		var preDate = new Date(_date);

		if(preDate.getTime()){
			return preDate;
		}
		
		var arr = _date.split(/[- :T]/), // from your example var date = "2012-11-14T06:57:36+0000";
    	date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], 00);
    	//Ti.API.info(arr);
    
    	return date;
	};

module.exports = BookMenu;