function ItemTransition(_data , _id){

	
	this.slideData =  _data;
	this.timeCounter = 0;
	this.slidePosition = 0;
	this.touchEnabled = false;
	this.storyID = _id;
	this.mainContainer = Ti.UI.createView( this.slideData.properties);
	this.mainContainer.touchEnabled = false;
	
	
	/// define the standard transition time
	if(!this.slideData.transitionTime){
		this.singleTransitionTime = 2000;
	}else{
		if(this.slideData.images){
			var rawTime =  (this.slideData.transitionTime / this.slideData.images.length );
			// define a time value higher than  a seccond
			var testedTime;
			
			if( rawTime < 1000){
				testedTime = 1000;
			}else{
				testedTime = rawTime;
			}
			
			this.singleTransitionTime = testedTime;
			
			//alert(this.slideData.transitionTime + " ---- " + this.singleTransitionTime );
		}else{
			var testedTime;
			
			if( this.slideData.transitionTime < 1000){
				testedTime = 1000;
			}else{
				testedTime = this.slideData.transitionTime;
			}
			
			this.singleTransitionTime = testedTime;//this.slideData.transitionTime
		}
		
	}
	
	
	
	//Ti.API.info(this.slideData.animation.duration)


	//@TODO uncomment this
	//this.mainContainer.addEventListener("click", _start);

	/// start proxy
	var _this = this;
	var buttonActiveFlag = true;
	var globalDelay;
	//var blockClicks = ( this.slideData.animation.duration )

	function _start(){


		if(buttonActiveFlag){

			_this.start();
			makeDelay();
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
				
		}, 4000);

	};
	 

	//this.mainContainer.borderWidth = 4;
	//this.mainContainer.borderColor = "#ff0000";

}



ItemTransition.prototype.timerObject;
ItemTransition.prototype.timeCounter;
ItemTransition.prototype.slidePosition;



ItemTransition.prototype.getContainer = function(){

	this.mainContainer.add( this.createImage(0) );

	return this.mainContainer;
};

ItemTransition.prototype.start = function(e) {

 
	if(this.slideData.images.length < 2){
		 
		return false;

	}
	/// prevent timer overlap
	if(this.timerObject){
		this.stop();
	}

	var _this = this;
	this.timerObject = setInterval( transitionMovement, this.singleTransitionTime);

	function transitionMovement (e){

		

			if(_this.timeCounter >0){
				_this.stop();
				_this.timeCounter = 0;
				return false;
			} 


			if(_this.slidePosition == (_this.slideData.images.length-2) ){

				_this.timeCounter ++;
			}

			if(_this.slidePosition < (_this.slideData.images.length-1) ){
				_this.slidePosition++;
			}else{
				_this.slidePosition = 0;
			}

			
			/**@TODO **/

			/// start crossfade
			var animationBase = Ti.UI.createAnimation({
					opacity:0,
					duration:900
			});

			//_this.mainContainer.children[0].animate(animationBase);



			_this.mainContainer.add( _this.createImage(_this.slidePosition) );

			


			if(_this.mainContainer.children.length > 1 ) {


				var animationBase = Ti.UI.createAnimation({
						opacity:0,
						duration:500
				});
				_this.mainContainer.children[0].animate(animationBase);

				animationBase.addEventListener('complete', animationDone);

				function animationDone(e){

					_this.mainContainer.remove(_this.mainContainer.children[0]);

				}


				

			}


	}


	/// firts time
	transitionMovement("x");

 
};

ItemTransition.prototype.stop = function() {
	if(this.timerObject){

		clearInterval(this.timerObject);
		this.timerObject = null;

	}
	
};

ItemTransition.prototype.createImage = function(_id) {
	
	var properties = {
			image: Titanium.Filesystem.applicationCacheDirectory + this.storyID +"/" + this.slideData.images[_id],
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			bottom: 0,
			right: 0,		
			zIndex: 1,
			touchEnabled:false,
			opacity:0
	};



	var singleImage = Ti.UI.createImageView(properties);


	 
		var animationBase = Ti.UI.createAnimation({
			opacity:1,
			duration:1000
		});

		singleImage.animate(animationBase);
	 

	
	

	return singleImage;
};


ItemTransition.prototype.clean = function(){

	this.stop();
	this.timerObject = null;
	this.timeCounter = null;
	this.slidePosition = null;

};


ItemTransition.prototype.getClickDelayTime = function(){

	var minTime = 1000 * this.slideData.images.length 


	if(  this.slideData.transitionTime  > minTime){

		return this.slideData.transitionTime;

	}else{

		return minTime;
	}
	


}
/// create containter

/// add single element

/// control de eventos


//// DELETE
	ItemTransition.prototype.createContainer = function() {
		
		/*
			for (var i = 0; i < this.slideData.length; i++) {

				var properties = {
					image: Titanium.Filesystem.applicationCacheDirectory + "bookshelfData/" + this.slideData[0],
					bottom: 22,
					right: 24,
					width: 400,
					height: 300,
					touchEnabled:false
				};

				var singleImage = Ti.UI.createImageView(properties);

				this.mainContainer.add( this.createImage(0) );
				 
				
			//};
		*/
	};




module.exports = ItemTransition;