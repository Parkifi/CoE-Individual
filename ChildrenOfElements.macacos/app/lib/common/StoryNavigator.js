/// handle wich slide be shown on screen
function StoryNavigator( _storySlideObject){

	/// create a view container for the slide
	this.storyView = Ti.UI.createView();

	/// store an instance of the slide object
	this.storySlideObject = _storySlideObject;
}


StoryNavigator.prototype.storySlides;
StoryNavigator.prototype.storyView;
StoryNavigator.prototype.contentCount;
StoryNavigator.prototype.currentSlide;
StoryNavigator.prototype.activityFlag;
StoryNavigator.prototype.backButton;
StoryNavigator.prototype.nextButton;


StoryNavigator.prototype.init = function() {

	/// define the base count and place the first slide
	this.contentCount = 0;
	this.loadSlideJIT(this.contentCount);
	StoryNavigator.prototype.activityFlag = "ready";
		
	return this.storyView;
};


/// import control buttons to display properly
StoryNavigator.prototype.setButtons = function(_back, _next) {
	this.backButton = _back;
	this.nextButton = _next;
};


StoryNavigator.prototype.buttonDisplayCheck = function() {

	 
	if(this.backButton){
		

		
		/// back button only show when count is higher than 1
		if(this.contentCount == 0){

			this.backButton.top = -200;
		}else{
			this.backButton.top = 0;
		}

		/// next button only show when count is lower than total
		if(this.contentCount == (this.storySlideObject._slideData.length-1) ){
			this.nextButton.top = -200;
		}else{
			this.nextButton.top = 0;
		}
	}

	 

};


/// Navigation

	StoryNavigator.prototype.next = function() {

		
		if(StoryNavigator.prototype.activityFlag == "ready"){

			if((this.contentCount + 1) < this.storySlideObject._slideData.length){		
				this.contentCount++;
				this.loadSlideJIT(this.contentCount);
			}
			
			StoryNavigator.prototype.activityFlag = "block";
			 

			var setFlag = setTimeout( navDelay, 1000);
			
			function navDelay(){	
				StoryNavigator.prototype.activityFlag = "ready";
				 
			}

			var player = Ti.Media.createSound({url:"/audio/fx/click3-page-flip.mp3"});
			player.play();

			player = null;

		}
	};


	StoryNavigator.prototype.back = function() {
		
		if(StoryNavigator.prototype.activityFlag == "ready"){

			if((this.contentCount -1) >= 0){
				this.contentCount--;
				this.loadSlideJIT(this.contentCount);
			}

			StoryNavigator.prototype.activityFlag = "block";
			 

			var setFlag = setTimeout( navDelay, 1000);
			
			function navDelay(){	
				StoryNavigator.prototype.activityFlag = "ready";
				 
			}

			var player = Ti.Media.createSound({url:"/audio/fx/click3-page-flip.mp3"});
			player.play();

			player = null;

		}
	};

	


/// create a new slide when needed
	StoryNavigator.prototype.loadSlideJIT = function(_slideID) {

		// create the slide object just in time
		var buildSlide =  this.storySlideObject.buildSlideJIT(_slideID);


		/// retrieve the actual slide
		var currentSlide = buildSlide.getSlide();
	

		/// config the slide to start transition
			currentSlide.backgroundColor = "#ffffff";
			currentSlide.parentView = this.storyView;
			currentSlide.opacity = 0;

		/// add slide to container
			this.storyView.add( currentSlide );

		/// start transition
			buildSlide.slideLoaded();

		/// update navigation buttons
		this.buttonDisplayCheck();

	};


StoryNavigator.prototype.clean = function() {

	
	
	this.storyView.removeAllChildren();


	StoryNavigator.prototype.storySlides = null;
	StoryNavigator.prototype.storyView = null;
	StoryNavigator.prototype.contentCount = null;


	this.storySlideObject = null;
	this.storySlides = null;
	this.storyView = null;
	this.contentCount = null;

	//delete StoryNavigator.prototype.storySlides ;
	//delete StoryNavigator.prototype.storyView ;
	//delete StoryNavigator.prototype.contentCount ;


	//delete this.storySlideObject ;
	//delete this.storySlides ;
	//delete this.storyView ;
	//delete this.contentCount ;

};

StoryNavigator.prototype.errorManager = function(_message) {

	//alert(_message)
};


module.exports = StoryNavigator;


/*
StoryNavigator.prototype.loadSlide = function(_slideID) {
	var currentSlide =  this.storySlides[_slideID].getSlide()
	
	currentSlide.backgroundColor = "#ffffff";
	currentSlide.parentView = this.storyView;
	currentSlide.opacity = 0

	this.storyView.add(currentSlide)
	
	// check if this slide already appeared
	if(Ti.Platform.name == "iPhone OS"){
	
		currentSlide.fireEvent('story_slideImage_loaded')
	
	}else if(Ti.Platform.name == "android"){
	
		if ( currentSlide.onStage  ){
			currentSlide.fireEvent('story_slideImage_loaded')
		}
	}
};
*/