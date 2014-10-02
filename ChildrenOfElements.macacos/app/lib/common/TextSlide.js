/*
	DEPRECATED
*/


function TextSlide(_slideInfo) {

	this.slideInfo = _slideInfo;

	this.mainContainer = this.createTextSlide();

	this.speechAudio = Ti.Media.createSound({url:"storyAssets/story1/audio/"+this.slideInfo.audio_EN, looping:false});
	this.speechAudio.looping = false;

	//return  //this.createSlide();
}

TextSlide.prototype.mainContainer;
TextSlide.prototype.transitionInfo;
TextSlide.prototype.vierContainer;
TextSlide.prototype.speechAudio;



TextSlide.prototype._slideContainer;
TextSlide.prototype._slideInterval;

TextSlide.prototype.getContainer = function() {

	return this.mainContainer;
};


TextSlide.prototype.createTextSlide = function() {

	//parse

	 

	

	/// add image container
	this._slideContainer =  Titanium.UI.createView({
		backgroundImage:"/text/textslide_background.png",
		width:"100%",
		height:"100%"
	});

	var slideText;

	if(Alloy.Globals.userLanguage == "es" ){
		slideText =  this.slideInfo.text_ES;
	} else{
		slideText =  this.slideInfo.text_EN;
	}

	/// add text
	textItem = Ti.UI.createLabel({
		text: slideText ,
		width: "80%",
		height: "80%",
		font:{
			fontSize:28,
			fontFamily: Alloy.Globals._font_oldenburg
		}
	});

	this._slideContainer.add(textItem);


	this._slideContainer.touchEnabled = true;

	/// add text

	/// add audio
	//	this.startSpeech()

	// how to stop narration?

	return this._slideContainer;
};


TextSlide.prototype.createClickableSlide = function() {

	var slideArray = this.parseImageArray(this.transitionInfo.images);
	slideArray[0].opacity = 1;

	this._slideContainer =  Titanium.UI.createView(this.transitionInfo.properties);
	this._slideContainer.touchEnabled = true;


	this._slideContainer.add(slideArray[1]);
	this._slideContainer.add(slideArray[0]);


	this._slideContainer.addEventListener("click", function(e){

		var fadeIn = Titanium.UI.createAnimation({
				opacity:1,
				duration: 6000
			});
		
		var fadeOUT = Titanium.UI.createAnimation({
				opacity:0,
				duration: 4000
		});

	
		e.source.children[0].animate(fadeIn);
		e.source.children[1].animate(fadeOUT);

		e.source.removeEventListener('click', function(){});

	});

		//alert(slideArray[0].image)

	return this._slideContainer;
};

TextSlide.prototype.startSpeech = function() {

	
	this.speechAudio.play();
	//alert(this.speechAudio)
};

TextSlide.prototype.stopSpeech = function() {
	//alert(this.speechAudio)
	this.speechAudio.stop();
	//this.speechAudio = null;
};

 TextSlide.prototype.clean = function() {
 	for (i = this._slideContainer.children.length; i > 0; i--){
        this._slideContainer.remove( this._slideContainer.children[i-1] ) ;
    };
    this._slideContainer = null;
 };

 
TextSlide.prototype.parseTextArray = function(textSlides){

	/*
		var slideViews=[];

		for (var i = 0; i < imageSlides.length; i++) {
			

			var imagePath = '/storyAssets/story1/'+ imageSlides[i];

			var imageItem = Ti.UI.createImageView({image: imagePath });
				imageItem.width =  Ti.UI.FILL //431
				imageItem.height = Ti.UI.FILL //426
				imageItem.bottom = 0
				imageItem.right = 0
				imageItem.zIndex = 1
				imageItem.opacity = 0
				imageItem.touchEnabled = false;

				imageItem.id = "elemento"+ [i] 

			///store slides in array
			slideViews.push(imageItem);
		};
	*/	
	return slideViews;

};

module.exports = TextSlide;


