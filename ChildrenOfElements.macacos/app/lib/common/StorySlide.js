/***
Contiene y administra un slide
return: a self contained slide
*/

var Transition = require('/common/ItemTransition');
//var AudioSlide = require('/common/AudioSlide')


function StorySlide(_slideData, _storyID , _mediaManager , _speechManager , _fxManager , _touchSound){
	
	this.touchSound = _touchSound;
	// start animated array
	this.animatedItems = [];

	this.storyID = _storyID;
	this.mediaManager = _mediaManager;
	this.speechManager = _speechManager;
	this.fxManager = _fxManager;

	/// create main container
	this.mainView = Ti.UI.createView({opacity:0});

	if(Ti.Platform.name == "android"){
		this.touchSound.disable ( this.mainView );
	}

	// include slide data inside the class
	this.slideData = _slideData;
 


	///add elements to slide
	this.buildElements();

	this.mainView.anima = this.animatedItems;

	this.mainView.remover = this.clean;
 
	this.mainView.imageCount= 0;
	this._hasAudioFX =  false;


	//this.mainView.addEventListener('story_slideImage_loaded', this.slideLoaded)
	//this.mainView.addEventListener('animarSlide', this.animateSlide);

	//return this.mainView;
}


StorySlide.prototype.storyID;
StorySlide.prototype.mainView;
StorySlide.prototype.animatedItems;
StorySlide.prototype.mediaManager;
StorySlide.prototype.speechManager;
StorySlide.prototype.fxManager;
StorySlide.prototype._hasAudio;
StorySlide.prototype._hasSpeech;
StorySlide.prototype._hasAudioFX;
StorySlide.prototype._hintScreen;
StorySlide.prototype.transition;


StorySlide.prototype.getSlide = function(){

	return this.mainView;
};

 
////// main builders

	/// parse the elements lists and add all elements to main View
	StorySlide.prototype.buildElements = function() {
		
		/// test values
		if(!this.slideData.stageElements){
			this.errorDetect("stage elements not found");
		}
		
		_itemsLength = this.slideData.stageElements.length ;

		for (var i = 0; i < _itemsLength ; i++) {
		 
			var element = this.createSingleElement( this.slideData.stageElements[i] , _itemsLength);
				element.zIndex = i;
				this.mainView.add(element);
				
		};

		if(this._hasAudioFX){

			this.fxManager.setFX( this.storyID );

		}


	};


	/// create a single element based on map document Info
	StorySlide.prototype.createSingleElement = function(_targetElement, _totalCount) {

		/// test values
		if(!_targetElement.type){
			this.errorDetect("target type not found");
		}

		var currentElement;

		///set rotationAxis android
			if(_targetElement.animation){

				if(_targetElement.animation.rotateAxis){

					var axis = this.setAxis(_targetElement.animation.rotateAxis);
					_targetElement.properties.anchorPoint = axis;
					_targetElement.animation.anchorPoint = axis;

				}
				
			}

		//// create elements by type
		switch(_targetElement.type){

			case "image":

				currentElement = this.createSlideImage( _targetElement );

				if(_targetElement.properties.soundFx){
					currentElement.audioFx =  _targetElement.properties.soundFx;
					currentElement.fxManager =  this.fxManager;
					this._hasAudioFX = true;
				}
				break;
			
			case "transition":

				currentElement = this.createTransition( _targetElement );

				if(_targetElement.properties.soundFx){
					currentElement.audioFx =  _targetElement.properties.soundFx;
					currentElement.fxManager =  this.fxManager;
					this._hasAudioFX = true;
				}
				
				break;

			case "text":

				currentElement = this.createTextField( _targetElement );

				if(_targetElement.properties.soundFx){
					currentElement.audioFx =  _targetElement.properties.soundFx; 
					currentElement.fxManager =  this.fxManager;
					this._hasAudioFX = true;
				}

				break;
		
			case "audio":
				this._hasAudio = "yes";
				currentElement = this.createSlideAudio( _targetElement );
				break;

			case "speech":
				this._hasSpeech = "yes";
				currentElement = this.createSlideSpeech( _targetElement );
				break;

			case "hint":
				this._hasHints= "yes";
				currentElement = this.createSlideHint( _targetElement );
				currentElement.visible = false;
				break;
				

			default:
				Ti.API.info("create single element, type not found");
		}


		///Attach common vars

			currentElement.itemCount = _totalCount;

		///Attach Animations
			if(_targetElement.animation){
				
				var itemAnimation = this.animations(_targetElement.animation);

				currentElement._innerAnimation = itemAnimation;

				/// add this element to animation queue
					this.animatedItems.push(currentElement);

			}

		///Attach Touch Events
			switch(_targetElement.interaction){

				///https://gist.github.com/mattheworiordan/1073811

				case "drag":

					////
					/*	
						currentElement.offset= { top: currentElement.top, left: currentElement.left};
						currentElement.xxx = 0;
						currentElement.yyy = 0;
						currentElement.prevXXX = 0;
						currentElement.prevXXX = 0;

						currentElement.addEventListener('touchstart', function(e) {
							 
							//e.source.xxx = e.x;
							//e.source.yyy = e.y;
							//e.source.borderColor = "#ff0000";
							//e.source.borderWidth = "3";
						});
						 
						currentElement.addEventListener('touchmove', function(e) {

								
							/*
							var p = { x:e.x, y:e.y};
						    var convertPoint = e.source.convertPointToView(p, Ti.UI.currentWindow);
						    e.source.center = convertPoint;
							* / 
						
							function difference(a, b) { return Math.abs(a - b); };

							var factor = difference(e.source.prevXXX, e.x) ;

							Ti.API.info("source y:" + String(e.source.yyy) );
							Ti.API.info("event y:" + String(e.y) );

							Ti.API.info("source x:" + String( e.source.xxx) );
							Ti.API.info("event x:" + String(e.x ) );

							Ti.API.info("compound y:" + String(e.y - e.source.yyy) );
							Ti.API.info("coumpound x:" + String(e.x - e.source.xxx) );

							Ti.API.info("dovakin:  " + difference(e.source.prevXXX, e.x) );

							Ti.API.info("====================== \n");



							/// prefent too big jumps


								e.source.offset.top += e.y - e.source.yyy;
								e.source.offset.left += e.x - e.source.xxx;

								e.source.top = e.source.offset.top - ( e.source.height /2 );
								e.source.left = e.source.offset.left - ( e.source.width /2 );

								e.bubbles = false;


								/*

								e.source.animate({
								    top: e.source.offset.top, 
								    left: e.source.offset.left,
								    duration: 1,
								    //center: {x:e.source.offset.left, y:e.source.offset.top}
								});

								e.source.prevXXX = e.x;
								e.source.prevYYY = e.y;
							* /
						});


						currentElement.addEventListener('touchend', function(e) {
						    e.source.xxx = 0;
						    e.source.yyy = 0;
						});
						

						currentElement.touchEnabled = true;
						 

						////
					*/

					break;

				case "click":
						currentElement.clickableItem = "enable";
						currentElement.activeFlag = true;
						currentElement.touchEnabled = true;

						


						currentElement.addEventListener('click',function(e){
							
							
							
							
							
							/// prevent click overload
							if(e.source.activeFlag){
								
								
				
								/// play animation if available
								if(e.source._innerAnimation && !e.source.transitionPlayer){

									e.source.activeFlag = false;
									 
									//Ti.API.info(e.source._innerAnimation.getTop() )
									//e.source.left = ( Math.random() * 100 )

									var clipAnimation = Titanium.UI.createAnimation(e.source._innerAnimation);//e.source._innerAnimation
										//clipAnimation.top = 300; // Math.random() * 100;
										//clipAnimation.autoreverse = "true";
									clipAnimation._parent = e.source;
									
									e.source.animate( clipAnimation );
									
									clipAnimation.addEventListener("complete", function(e){

										//alert("  --> " +e.source._parent.activeFlag);

										e.source._parent.activeFlag = true;
										
									});
								
								}
								else if(e.source.transitionPlayer)
								{
								//// handle interaction for transitions

									//// if animation is set, enable it
										if(e.source._innerAnimation){
											
											////WARNING
											/// animation of width or height is buggy on IOS.. 
											/// will be removed and replaced with scale
											/// this will disable it even if defined
											
											
											
											

											var clipAnimation = Titanium.UI.createAnimation(e.source._innerAnimation);//e.source._innerAnimation
											//clipAnimation.top = 300; // Math.random() * 100;
											//clipAnimation.autoreverse = "true";
											//clipAnimation._parent = e.source;
										
											e.source.animate( clipAnimation );
										}

									/// define delay time
										var delay = e.source.transitionPlayer.getClickDelayTime();
										
										
										if(e.source._innerAnimation){
											
											var delayInteraction ;

											if(e.source._innerAnimation.repeat){
												delayInteraction = e.source._innerAnimation.duration * e.source._innerAnimation.repeat;
												
												if(e.source._innerAnimation.autoreverse){
													delayInteraction = delayInteraction*2.1;
												}

											}
											
											//// now test wich take longes
											Ti.API.info( delayInteraction + "<inter === delay> " + delay);
											
											if(delayInteraction > delay){
												delay = delayInteraction;
											}
										}

										var waitForIt = setTimeout(enableButton, delay);

										function enableButton(event){
											e.source.activeFlag = true;
											clearTimeout(waitForIt);
										}	


								}
								else{
									/// if no animation active, set a delay for this object
									var waitForIt = setTimeout(enableButton, 1500 );

									function enableButton(event){
										e.source.activeFlag = true;
										clearTimeout(waitForIt);
									}		
								}


								///play transition if available
								if(e.source.transitionPlayer){
									//alert(e.source.transitionPlayer.getClickDelayTime() )
									e.source.transitionPlayer.start();
								}


								/// play sound if available
								if(e.source.soundFx){
									//alert(e.source.soundFx)
									e.source.fxManager.playFX(e.source.soundFx);
								}

								/// disable click on this item
									e.source.activeFlag = false;


									
									/*

										 
										var waitLength = e.source._innerAnimation.duration
										if(e.source._innerAnimation.repeat){
											waitLength = e.source._innerAnimation.duration * e.source._innerAnimation.repeat
										}
										
										var waitForIt = setTimeout(enableButton, ( e.source._innerAnimation.duration - 30));

										function enableButton(event){

											 

											e.source.activeFlag = true;

									}
									*/
							}



						});

					break;

				default:

					break;

			}


		//// remove default sound for android

			



		return currentElement;
	};


///// create data types

	/// create a transition type element
	StorySlide.prototype.createTransition = function(_targetInfo) {
		
		this.transition = new Transition(_targetInfo,  this.storyID);

		var result = this.transition.getContainer();
			result.transitionPlayer = this.transition;

		if(Ti.Platform.name == "android"){
			this.touchSound.disable( result );
		}

		return result;
	};


	/// create a single text field
	StorySlide.prototype.createTextField = function(_targetInfo) {

		/// Define Text based on user language
			if(Alloy.Globals.userLanguage == "es" ){
				slideText =  _targetInfo.properties.text_es;
			} else{
				slideText =   _targetInfo.properties.text_en;
			}
			
			_targetInfo.properties.text = slideText;


			var textFont = this.fontTranslator( _targetInfo.properties.fontFamily );

			

		 
			 
		 	var labelfont = { 
		 		fontSize: _targetInfo.properties.fontSize+"sp",
				fontFamily: textFont
			};
		
			_targetInfo.properties.font = labelfont;



		/// add text
		var textItem = Ti.UI.createLabel( _targetInfo.properties );
			textItem.touchEnabled = false;
			
		if(Ti.Platform.name == "android"){
			this.touchSound.disable( textItem );
		}
		
		return textItem;	 
	};

	// create audio element
	StorySlide.prototype.createSlideAudio = function(_targetInfo) {

 
		
		this.mediaManager.setAudio(_targetInfo , this.storyID );
		this.mainView.slideAudio = this.mediaManager;

		

		var viewPlaceHolder = Ti.UI.createView({
			width:1,
			height:1,
			top: -10,
			left: 0,
			visible:0,
			touchEnabled: false
		});

		return viewPlaceHolder;	 
	};

	/// create speech element
	StorySlide.prototype.createSlideSpeech = function(_targetInfo) {
		
		this.speechManager.setAudio(_targetInfo , this.storyID );
		this.mainView.slideSpeech = this.speechManager;

		

		var viewPlaceHolder = Ti.UI.createView({
			width:1,
			height:1,
			top: -10,
			left: 0,
			visible:0,
			touchEnabled: false
		});

		return viewPlaceHolder;	 
	};

	/// create image Element
	StorySlide.prototype.createSlideImage = function(_targetInfo) {
		
		var imageResult = Ti.UI.createImageView( _targetInfo.properties );
			imageResult.image =  Titanium.Filesystem.applicationCacheDirectory +this.storyID +'/'+ _targetInfo.properties.image;
			imageResult.touchEnabled = false;
			
			if(Ti.Platform.name == "android"){
				this.touchSound.disable( imageResult );
			}
			
		return imageResult;	 
	};

	/// create slide hint
	StorySlide.prototype.createSlideHint = function(_targetInfo) {

		var imageResult = Ti.UI.createImageView({
				width:"100%",
				height:"100%",
				top:0
		});
		
		imageResult.image =  Titanium.Filesystem.applicationCacheDirectory +this.storyID +'/'+ _targetInfo.properties.image;
		imageResult.touchEnabled = false;

		this._hintScreen = imageResult;
			
		return imageResult;
	};


/// animations and effects 

	/// asign animations based on map
	StorySlide.prototype.animations = function(_animData) {
		
		/// valida si existe rotation

			var matrix = Ti.UI.create2DMatrix();

		///set rotationAxis Animation
			if(_animData.rotateAxis){
				_animData.anchorPoint = this.setAxis(_animData.rotateAxis);
			}

		/// rotations
			if(_animData.rotate){
				//alert("rotation" + _animData.rotate)
				matrix = matrix.rotate(_animData.rotate);
				

			}
			
			if(_animData.scale){
				
			
				matrix = matrix.scale(_animData.scale.x,_animData.scale.y);
				 
				
			}
			
			//if(matrix){
				_animData.transform = matrix;
			//}

		_animData.rotateAxis;	
		//_animData.rotate = null;
		//_animData.scale = null;
		
		var _animation = Ti.UI.createAnimation(_animData);
			
		return _animData; //_animation;
	};


	/// start animation on slide
	StorySlide.prototype.animateSlide = function(){

		// Loop animation queue

			if(this.mainView.anima){

				for (var i = 0; i < this.mainView.anima.length; i++) {
					
					var element = this.mainView.anima[i];


					/// only non clickable elements animate on start
					if(!element.clickableItem){
							 
							
							var depe = {
							 autoreverse : true,
							 duration : 1000,
							 top : 100,
							};
							
							
							var elementAnimation = Ti.UI.createAnimation(element._innerAnimation); //_innerAnimation
							element.animate( elementAnimation );
							elementAnimation = null;
							
					} 
				};

			}
		
	};


	///counts every loaded image
	StorySlide.prototype.slideLoaded = function(e) {


		//var element = this.mainView;
		var animation = Titanium.UI.createAnimation({opacity:1, duration:600});

			this.mainView.animate(animation);


		animation.parentView = this.mainView.parentView;



		animation.addEventListener('complete', animationComplete);


		function animationComplete(e){
			
			if(e.source.parentView.children.length > 1){
				//stop sound

					var oldSlide = e.source.parentView.children[0];
					if(oldSlide.speech){
						oldSlide.speech.stopSpeech();
					}

					if(oldSlide.slideAudio){
						oldSlide.slideAudio.stopAudio();
						//oldSlide.slideAudio.clean()
						oldSlide.slideAudio = null;
					}

					if(oldSlide.slideSpeech){
						oldSlide.slideSpeech.stopAudio();
						//oldSlide.slideAudio.clean()
						oldSlide.slideSpeech = null;
					}

				//alert("removed Slide")//e.source.parentView.children.length )
				
				oldSlide.remover();

				e.source.parentView.remove( e.source.parentView.children[0] );			
			}

			//// start audio
				//// start speech
				if( e.source.parentView.children[0].slideSpeech  ){

					/// start audio only if enabled
					if(Ti.App.Properties.getString('speechAudioStatus') == "enabled" ){
						e.source.parentView.children[0].slideSpeech.playAudio();
					}
				}

				/// start ambient audio
				if( e.source.parentView.children[0].slideAudio ){
					if(Ti.App.Properties.getString('storyAudioStatus') == "enabled" ){
						e.source.parentView.children[0].slideAudio.playAudio();
					}
				}

			e.source.removeEventListener('complete', animationComplete);
			e.source.parentView = null;
		}

		var waitForIt = setTimeout(animar, 800);
		
		var _this = this;
		function animar(){
			_this.animateSlide();
		}
		

		/*
			if(Ti.Platform.name == "android"){
					element.onStage = false
			}

			if(!element.onStage){
					element.fireEvent('animarSlide')
			}
		*/
	};


///////////////////// TOOLS /////////

	StorySlide.prototype.setAxis = function(_axis) {

		var point;

		/*

		top left : anchorPoint:{x:0,y:0} 
		top right : anchorPoint:{x:1,y:0}
		center : anchorPoint:{x:0.5,y:0.5}
		bottom left : anchorPoint:{x:0,y:1} 
		bottom right : anchorPoint:{x:1,y:1}
		*/
		switch(_axis){
			case "topCenter":
				point = {x:0.5, y:0};
				break;
			case "topLeft":
				point = {x:0, y:0};
				break;
			case "topRight":
				point = {x:1,y:0};
				break;
			case "center":
				point = {x:0.5,y:0.5};
				break;
			case "bottomLeft":
				point = {x:0,y:1};
				break;
			case "bottomRight":
				point = {x:1,y:1};
				break;
			case "bottomCenter":
				point = {x:0.5,y:1};
				break;
			default:
				this.errorDetect("no valid axis value");
		}


		return point;
	};
	 
	/// verifies values
	StorySlide.prototype.errorDetect = function(_alertMessage) {

		//alert(_alertMessage);
	};

	StorySlide.prototype.stopSpeech = function() {
		if(this.mainView.speech){
			this.mainView.speech.pauseSpeech();
		}
	};

	StorySlide.prototype.pauseSpeech = function() {
		if(this.mainView.speech){
			this.mainView.speech.pauseSpeech();
		}
	};

	StorySlide.prototype.hasAudio = function() {
		if(this._hasAudio == "yes"){
			return true;
		}else{
			return false;
		}
	};

	StorySlide.prototype.hasSpeech = function() {
		if(this._hasSpeech == "yes"){
			return true;
		}else{
			return false;
		}
	};

	StorySlide.prototype.hasHints = function() {
		if(this._hasHints == "yes"){
			return true;
		}else{
			return false;
		}
	};

	StorySlide.prototype.showHint = function() {
		
		this._hintScreen.visible = true;
		this._hintScreen.zIndex = 100;

	};

	StorySlide.prototype.hideHint = function() {
	
		this._hintScreen.visible = false;
	};

	//memory delloc
	StorySlide.prototype.clean = function() {

		
		if(this.mainView){
			this.mainView.removeAllChildren();

			if(this.mainView.slideAudio){
				this.mainView.slideAudio.stopAudio();
			}

			if(this.mainView.slideSpeech){
				this.mainView.slideSpeech.stopAudio();
			}
		}
		
		if(this.transition){
			this.transition.clean();
		}
		
		this.storyID  = null;
		this.mainView  = null;
		this.animatedItems  = null;
		this.transition = null;
		
		//delete this.storyID;
		//delete this.mainView;
		//delete this.animatedItems;
	};

	/// font translator
	StorySlide.prototype.fontTranslator = function(_font) {

			var resultFont;
			switch(_font){

				case 'oldenburg':
					resultFont = Alloy.Globals._font_oldenburg;
					break;

				case "snowburst":
					resultFont = Alloy.Globals._font_snowburst;
					break;

				case "serapionpro":
					resultFont = Alloy.Globals._font_serapionPro;
					break;

				case "serapionosf":
					resultFont = Alloy.Globals._font_serapion_bold;
					break;

				case "sacramento":
					resultFont = Alloy.Globals._font_sacramento ;
					break;

				case "raleway":
					resultFont = Alloy.Globals._font_ralewayDots ;
					break;

				case "quando":
					resultFont = Alloy.Globals._font_quando;
					break;

				case "mclaren":
					resultFont = Alloy.Globals._font_mclaren;
					break;

				case "inika":
					resultFont = Alloy.Globals._font_inika;
					break;

				case "glassantiqua":
					resultFont = Alloy.Globals._font_glassAntiqua ;
					break;

				case "exo2":
					resultFont = Alloy.Globals._font_exo2;
					break;

				case "didactgothic":
					resultFont = Alloy.Globals._font_didactGothic;
					break;

				case "alegreyasanssc":
					resultFont = Alloy.Globals._font_alegreyaSansSC;
					break;

				case "alegreyasans":
					resultFont = Alloy.Globals._font_alegreyaSans;	
					break;

				default:
					resultFont = Alloy.Globals._font_oldenburg;
					break;
			}

			return resultFont;

	};



module.exports = StorySlide;

