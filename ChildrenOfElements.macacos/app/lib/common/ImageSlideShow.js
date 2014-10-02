function ImageSlideShow(_data , _touchsound){

	if(Ti.Platform.name == "android"){
		this.touchsound = _touchsound;
	}

	this.mainContainer = Ti.UI.createView({
		width: 345,
		height: 258,
		right:55,
		bottom: 33,
		//borderWidth:1,
		//borderColor:"#ff0000"
	});
	this.slideData =  _data;
	this.timeCounter = 0;
	this.slidePosition = 0;
	this.touchEnabled = false;
}

ImageSlideShow.prototype.timerObject;
ImageSlideShow.prototype.timeCounter;
ImageSlideShow.prototype.slidePosition;

ImageSlideShow.prototype.method_name = function(first_argument) {
	// body...
};

ImageSlideShow.prototype.createContainer = function() {
	
	//for (var i = 0; i < this.slideData.length; i++) {

		var properties = {
			image: Titanium.Filesystem.applicationCacheDirectory + "bookshelfData/" + this.slideData[0],
			width: Ti.UI.FILL,
 			height: Ti.UI.FILL,
			touchEnabled:false
		};

		var singleImage = Ti.UI.createImageView(properties);
		this.mainContainer.add( this.createImage(0) );
		
		if(Ti.Platform.name == "android"){
			this.touchsound.disable( singleImage );
		}

		
		 
		
	//};
};

ImageSlideShow.prototype.getContainer = function(){
	return this.mainContainer;
};

ImageSlideShow.prototype.start = function() {
	
	if(this.slideData.length < 2){
		 
		return false;

	}
	/// prevent timer overlap
	if(this.timerObject){
		this.stop();
	}

	var _this = this;
	this.timerObject = setInterval(function(){

		if(this.timeCounter == 5){
			_this.stop();
		}

		if(_this.slidePosition < (_this.slideData.length-1) ){
			_this.slidePosition++;
		}else{
			_this.slidePosition = 0;
		}

		
	/**@TODO **/

	_this.mainContainer.add( _this.createImage(_this.slidePosition) );

	if(_this.mainContainer.children.length > 2 ) {

		_this.mainContainer.remove(_this.mainContainer.children[0]);

	}


	},5000);

};

ImageSlideShow.prototype.stop = function() {
	if(this.timerObject){

		clearInterval(this.timerObject);
		this.timerObject = null;

	}
	
};

ImageSlideShow.prototype.createImage = function(_id) {
	var properties = {
			image: Titanium.Filesystem.applicationCacheDirectory + "bookshelfData/" + this.slideData[_id],
			width: Ti.UI.FILL,
 			height: Ti.UI.FILL,
			zIndex: 10,
			touchEnabled: false,
			opacity:0
	};


	var singleImage = Ti.UI.createImageView(properties);

	if(Ti.Platform.name == "android"){
		this.touchsound.disable( singleImage );
	}

	 
	var animationBase = Ti.UI.createAnimation({
		opacity:1,
		duration:1500
	});

	singleImage.animate(animationBase);
	

	return singleImage;
};

/// create containter

/// add single element

/// control de eventos


module.exports = ImageSlideShow;