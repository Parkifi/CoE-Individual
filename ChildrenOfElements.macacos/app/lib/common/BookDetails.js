var ImageSlideShow = require('/common/ImageSlideShow');

function BookDetails( _defaultMSG , _touchSound ) {

	if(Ti.Platform.name == "android"){
		this.touchSound = _touchSound;
	}

	this.mainContainer = Ti.UI.createView({
		right:0,
		bottom:0,
		width:447,
		height:642,
		touchEnabled:false,
		//borderWidth:1,
		//borderColor:"red"	
	});

	var title1 = Ti.UI.createLabel({
			text: _defaultMSG,
			right:20,
			top:100,
			width:380,
			touchEnabled:false,
			color:"#000000",
			font:{
				fontSize:30,
				fontFamily: Alloy.Globals._font_oldenburg
			}
		});

	this.mainContainer.add( title1 );

	if(Ti.Platform.name == "android"){
		this.touchSound.disable(this.mainContainer);
		this.touchSound.disable(title1);
	}
}

BookDetails.prototype.slideshow;
BookDetails.prototype.touchSound;


BookDetails.prototype.setData= function(_data) {
	
	this.bookData = _data;
};


BookDetails.prototype.getContainer = function() {
	
	return this.mainContainer;
};


BookDetails.prototype.showDetails = function() {

	if(this.slideshow){
		this.slideshow.stop();
	}

	this.clearContainer();
	this.renderData();
};

BookDetails.prototype.clearContainer = function() {

	if(this.mainContainer.children.length > 0){
		this.mainContainer.removeAllChildren();
	}
};

BookDetails.prototype.renderData = function() {
	
 

	// add main title

		/// Define Text based on user language
		var mainTitleText;

		if(Alloy.Globals.userLanguage == "es" ){
			mainTitleText =  this.bookData.storyTitle_es.toString();
		} else{
			mainTitleText =  this.bookData.storyTitle_en.toString();
		}

		var title1 = Ti.UI.createLabel({
			text: mainTitleText, //"The Story of the Sea\nPart 1",
			left:20,
			top:15,
			width: 400,
			//borderWidth:1,
			//borderColor:"#ff0000",
			touchEnabled:false,
			color:"#000000",
			font:{
				fontSize:"28sp",
				fontFamily: Alloy.Globals._font_oldenburg
			}
		});
		

		this.mainContainer.add( title1 );

	// add book text description

		var descriptionText;

		if(Alloy.Globals.userLanguage == "es" ){
			descriptionText =  this.bookData.intro_es.toString();
		} else{
			descriptionText =  this.bookData.intro_en.toString();
		}

		var bookDescription = Ti.UI.createLabel({
			text: descriptionText ,
			//top:112,
			top: 55,
			left:20,
			width: 400,
			//borderWidth:1,
			//borderColor:"#ff0000",
			touchEnabled:false,
			color:"#000000",

			font:{
				fontSize:"18sp",
				fontFamily: Alloy.Globals._font_oldenburg
			}
		});

		this.mainContainer.add( bookDescription );




	// add slideshow

		if(this.bookData.slideshow){

			var _slideShow = this.createSlideShow();

			this.mainContainer.add( _slideShow );
		}

		///disabling sounds
			if(Ti.Platform.name == "android"){
				this.touchSound.disable( _slideShow );
				this.touchSound.disable(bookDescription);
				this.touchSound.disable(this.mainContainer);
				this.touchSound.disable(title1);
			}


};

BookDetails.prototype.createSlideShow = function() {
	
	/// get data from array

	this.slideshow = new ImageSlideShow ( this.bookData.slideshow  , this.touchSound );
	this.slideshow.createContainer();
	this.slideshow.start();


	/* 
		var container = Ti.UI.createView()

		if(this.bookData.slideshow.length > 1){

			for (var i = 0; i < this.bookData.slideshow.length; i++) {
				alert(this.bookData.slideshow[i])
			};


		}
		var _slideshowA = Ti.UI.createImageView({
			image: Titanium.Filesystem.applicationCacheDirectory + "bookshelfData/" + this.bookData.slideshow[0],
			bottom: 22,
			right: 24,
			width: 400,
			height: 300 
		})

		/// add image to container

		/// create interval
			/// display new image
			/// remove old image */

	return this.slideshow.getContainer();
};


BookDetails.prototype.isPreview = function() {
	
	if(this.bookData){
		
		if( this.bookData.previewMode){
			/// this story is a just preview
			return true;
		}else{
			/// this story have contents
			return false;
		}

	}else{
		/// no info available
		return false;
	}


};


module.exports = BookDetails;


