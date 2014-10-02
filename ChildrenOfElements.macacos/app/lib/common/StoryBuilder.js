/**
parsea el json y genera los slides

return all slides of  a story
**/
var Slide = require('/common/StorySlide');
var FileDownloader = require('/common/FileDownloader');
var AudioSlide = require('/common/AudioSlide');
var LoaderScreen = require('/common/LoaderScreen');


function StoryBuilder(_storyID , _touchSound){

	this.touchSound = _touchSound;

	this.storyID = _storyID;
	this.createLoadingScreen();
	this.audioManager =  new AudioSlide("audio",_storyID);
	this.speechManager =  new AudioSlide("speech", _storyID);
	this.fxManager =  new AudioSlide("fx" , _storyID);
}

StoryBuilder.prototype._slides;
StoryBuilder.prototype.slide;
StoryBuilder.prototype._slideData;
StoryBuilder.prototype.loadingScreen;

StoryBuilder.prototype.audioMenuButton;
StoryBuilder.prototype.speechMenuButton;
StoryBuilder.prototype.hintMenuButton;



/// load every item in story document, then return a callback
StoryBuilder.prototype.loadContent = function(_callbackThumbsLoaded) {

	this.parseJSON( this.storyID , loadedData);

	var storyID = this.storyID;
	var _loadingScreen = this.loadingScreen;
	var _this = this;
	///runs when json data is available
	function loadedData(e){


		this._slideData = e;
		//_loadingScreen.visible = 1;

		var thumbnailsList = [];

		///extract all files needed for story
		for (var i = 0; i < this._slideData.length; i++) {


			for (var a = 0; a < this._slideData[i].stageElements.length; a++) {

				switch(this._slideData[i].stageElements[a].type ){

					case "image":

						thumbnailsList.push ( storyID+"/" + this._slideData[i].stageElements[a].properties.image );


						if(this._slideData[i].stageElements[a].properties.soundFx){
							
							thumbnailsList.push ( storyID+"/" + this._slideData[i].stageElements[a].properties.soundFx );
						}

						break;

					case "transition":

						if(this._slideData[i].stageElements[a].images){

							var nodeItem = this._slideData[i].stageElements[a].images;

							for (var innerImage = 0; innerImage < nodeItem.length; innerImage++) {

								thumbnailsList.push ( storyID+"/" + nodeItem[innerImage] );
								
							};

							if(this._slideData[i].stageElements[a].properties.soundFx){
							
								thumbnailsList.push ( storyID+"/" + this._slideData[i].stageElements[a].properties.soundFx );
							}

						}

						break;

					case "hint":

						thumbnailsList.push ( storyID+"/" + this._slideData[i].stageElements[a].properties.image );
						break;

					case "audio":
					
						var selectedFile;

						if(Alloy.Globals.userLanguage == "es" ){
							selectedFile =  this._slideData[i].stageElements[a].properties.audio_es;
						} else{
							selectedFile =  this._slideData[i].stageElements[a].properties.audio_en;
						}

						thumbnailsList.push ( storyID+"/" + selectedFile );
						break;
					case "speech":
						var selectedFile;

						if(Alloy.Globals.userLanguage == "es" ){
							selectedFile =  this._slideData[i].stageElements[a].properties.audio_es;
						} else{
							selectedFile =  this._slideData[i].stageElements[a].properties.audio_en;
						}

						thumbnailsList.push ( storyID+"/" + selectedFile );
						
						break;

				}

			}
		};
		//alert(storyID)
		//alert(thumbnailsList[0])
		/// start
		//Ti.App.Properties.setString('lastUpdate', updatedDate )
		//Ti.App.Properties.setString('bookID_' + storyID , this._slideData[0].lastUpdate)

		if(this._slideData[0].lastUpdate){
			
			if(  Ti.App.Properties.getString('bookID_' + storyID)  ){

				///comparacion
				
				//Ti.API.info("verify data cache")

				var serverDate = parseDate(this._slideData[0].lastUpdate); // new Date( this._slideData[0].lastUpdate  );
				//alert(serverDate);

		        var localDate = parseDate(Ti.App.Properties.getString('bookID_' + storyID)); //new Date(  Ti.App.Properties.getString('bookID_' + storyID)  );
		        //alert(localDate);
		        function parseDate(_date){
						
						var arr = _date.split(/[- :T]/), // from your example var date = "2012-11-14T06:57:36+0000";
				    	date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], 00);
				    	//Ti.API.info(arr);
				    
				    	return date;
				    	
				};

		        

		        if(  serverDate.getTime() > localDate.getTime()  ){
		        	/// update is needed
		        	descargar();

		        }else{
		        	// no update needed, start callback
		        	_callbackThumbsLoaded();
		        	return;
		        }

				//Ti.App.Properties.setString('bookID_' + storyID , this._slideData[0].lastUpdate)


			}else{

				/// the JSON value is defined, but not present on system
				descargar();

				//Ti.App.Properties.setString('bookID_' + storyID , this._slideData[0].lastUpdate)

			}
		}else{

			/// no value on JSON is defined, this story will always be updated
			descargar();
		}



		var dateOnFile = this._slideData[0].lastUpdate;

		

		function descargar(){
			

			var downloader = new FileDownloader();
			downloader.setLoaderScreen( _loadingScreen );

			var list = downloader.makeQueue( thumbnailsList , storyID);
		

			///start downloads
				downloader.downloadMultiFile(list ,function(e,o){
					//_loadingScreen.children[0].width = o+"%"
				}, function(){

					if(dateOnFile ){

						Ti.App.Properties.setString('bookID_' + storyID , dateOnFile );
						//alert( Ti.App.Properties.getString('bookID_' + storyID ) )
					}


					_callbackThumbsLoaded();
					
					//_loadingScreen.visible = 0;
				});
			

			/// purge elements
			downloader = null;
			thumbnailsList = null;
			list = null;
			lang_sufix = null;
			builder = null;

		}

	}


};


/// create a SINGLE slide when needed
StoryBuilder.prototype.buildSlideJIT = function(i) {
	 
	this.slide = new Slide( StoryBuilder.prototype._slideData[i] , this.storyID , this.audioManager , this.speechManager , this.fxManager , this.touchSound);


	/// check buttons available

		/// verify audio
			if ( this.slide.hasAudio()  == true){
				//this.audioMenuButton.visible = true

				this.hideMenuElement(this.audioMenuButton, true , 1200);

			}else{
				//this.audioMenuButton.visible = false
				this.hideMenuElement(this.audioMenuButton, false , 1200);
			}

		/// verify audio
			if ( this.slide.hasSpeech()  == true){
				
				//this.speechMenuButton.visible = true
				this.hideMenuElement(this.speechMenuButton, true , 1200);
			}else{
				//this.speechMenuButton.visible = false;
				this.hideMenuElement(this.speechMenuButton, false , 1200);
			}


		/// verify audio
			if ( this.slide.hasHints()  == true){
				//this.hintMenuButton.visible = true
				this.hideMenuElement(this.hintMenuButton, true , 1200);
			}else{
				//this.hintMenuButton.visible = false
				this.hideMenuElement(this.hintMenuButton, false , 1200);
			}
	 
	return this.slide;
};

StoryBuilder.prototype.hideMenuElement = function(_element, _status , _time) {
	

	var waitElement = setTimeout( action,  _time);

	function action(){

		_element.visible = _status;

	}


};


StoryBuilder.prototype.createLoadingScreen = function() {
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
		 //loadingScreen;this.loadingScreen = loadingScreen;
			
};



//handle the story JSON map
StoryBuilder.prototype.parseJSON = function(_URL, _callbackJsonData) {

	/// Create the folder for this story if not exists
	var imageDir = Ti.Filesystem.getFile(Titanium.Filesystem.applicationCacheDirectory , this.storyID);
		if (! imageDir.exists()) {
		    imageDir.createDirectory();
		}

	/// download the Json File
		var downloader = new FileDownloader();
		downloader.downloadOneFile(Alloy.Globals.remoteServerRoot+this.storyID+"/"+this.storyID+".json", Titanium.Filesystem.applicationCacheDirectory+this.storyID+"/"+this.storyID+".json", callBack_DownloadOneFileFinished); 

		// this is needed to break the context and make var available inside callBack_DownloadOneFileFinished()
		var _storyID = this.storyID;

	/// once the file is loaded, read it and store data inside the class

		function callBack_DownloadOneFileFinished(){
			 
			var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationCacheDirectory , _storyID+"/"+_storyID+".json");
			var data = file.read().text;
			var json = JSON.parse(data);

			StoryBuilder.prototype._slideData = json;
		 	_callbackJsonData(json);

		 	file =  null;
		 	data = null;
		 	json = null;
		}
	
		downloader = null;
		imageDir = null;

	//return json;
};



StoryBuilder.prototype.clean = function() {

	

	this.slide.clean();


	this.slide = null;
	this._slides  = null;
	this._slideData = null;

	this.audioManager.clean();
	this.speechManager.clean();
	this.fxManager.clean();


	this.audioManager = null;
	this.speechManager = null;
	this.fxManager = null;

	StoryBuilder.prototype._slides = null;
	StoryBuilder.prototype.slide = null;
	StoryBuilder.prototype._slideData = null;
	StoryBuilder.prototype.audioManager = null;
	StoryBuilder.prototype.speechManager = null;
	StoryBuilder.prototype.fxManager = null;

	//delete this.slide ;
	//delete this._slides ;
	//delete this._slideData;
	//delete this.audioManager;
	
	//delete StoryBuilder.prototype._slides  ;
	//delete StoryBuilder.prototype.slide ; 
	//delete StoryBuilder.prototype._slideData;  
};


/// link menu buttons
StoryBuilder.prototype.setButtons = function(_speech, _audio, _hints) {

	this.audioMenuButton   = _audio;
	this.speechMenuButton  = _speech;
	this.hintMenuButton    = _hints;
	
};


StoryBuilder.prototype.stopAudio = function() {

		if(this.audioManager){
			this.audioManager.stopAudio();
		};
};

StoryBuilder.prototype.playAudio = function() {
		
		 
		if(this.audioManager){
			this.audioManager.playAudio();
		};
		 
};

StoryBuilder.prototype.stopSpeech = function() {

		if(this.speechManager){
			this.speechManager.stopAudio();
		};
};

StoryBuilder.prototype.pauseSpeech = function() {

		if(this.speechManager){
			this.speechManager.pauseAudio();
		};
};

StoryBuilder.prototype.playSpeech = function() {
		
		 
		if(this.speechManager){
			this.speechManager.playAudio();
		};
		 
};

StoryBuilder.prototype.cleanAudio = function() {
	

	this.audioManager.cleanAudio();
	this.speechManager.cleanAudio();
	this.fxManager.cleanAudio();


};



StoryBuilder.prototype.showHint = function() {
		
		this.slide.showHint();
};

StoryBuilder.prototype.hideHint = function() {
		
		this.slide.hideHint();

};





module.exports = StoryBuilder;