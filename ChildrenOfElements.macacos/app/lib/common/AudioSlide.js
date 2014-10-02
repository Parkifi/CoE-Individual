function AudioSlide(_type , _id){

	this.looping = false;
	this.player = Ti.Media.createSound();
	this.typeSlide = _type;
	this.storyID = _id;
	/*
		//// choose audio according to language
			if(Alloy.Globals.userLanguage == "es" ){
				this.audioFile =  _targetInfo.properties.audio_es
			} else{
				this.audioFile =  _targetInfo.properties.audio_en
			}

		//// set if audio is loopable

			if(_targetInfo.properties.looping){
				this.looping =  _targetInfo.properties.looping
			}else{
				this.looping = false
			}

		this.storyID = _storyID;

		this.player = Ti.Media.createSound()
	*/
	
}

AudioSlide.prototype.audioFile;
AudioSlide.prototype.player;
AudioSlide.prototype.looping;
AudioSlide.prototype.storyID;
AudioSlide.prototype._audioPlayer;




//// start playing
AudioSlide.prototype.playAudio = function() {
	
 
 
	if(this.player){

		//this.stopAudio();

		//this.player = null

		//this.player = Ti.Media.createSound({looping:this.looping});
		//AudioSlide.prototype._audioPlayer.url = Titanium.Filesystem.applicationCacheDirectory + this.storyID + "/"+ this.audioFile;
		//AudioSlide.prototype._audioPlayer.looping = this.looping;
		//AudioSlide.prototype._audioPlayer.play()
		
		this.player.url = Titanium.Filesystem.applicationCacheDirectory + this.storyID + "/"+ this.audioFile;
		this.player.looping = this.looping;

		this.player.play();

	}
	 

};


//// stop playing
AudioSlide.prototype.stopAudio = function() {

	if(this.player){

		this.player.stop();
		///AudioSlide.prototype._audioPlayer.stop()

	    /*
		if(this.player.isPlaying() ){
			this.player.stop();
		}else{
			Ti.API.info("sound element is not playing")
			Ti.API.info(this.player)
		}
		*/
		 
	}
	
};

AudioSlide.prototype.pauseAudio = function() {

	if(this.player){

		this.player.pause();
		///AudioSlide.prototype._audioPlayer.stop()

	    /*
		if(this.player.isPlaying() ){
			this.player.stop();
		}else{
			Ti.API.info("sound element is not playing")
			Ti.API.info(this.player)
		}
		*/
		 
	}
	
};

AudioSlide.prototype.cleanAudio = function() {
	

	if(this.player){
		this.player.stop();
		this.player.release();
		//this.player = null;
	}
};


AudioSlide.prototype.playFX = function(_filePath) {
	if(this.player){

		 

		this.player.stop();
		this.player.release();



		this.player.url = Titanium.Filesystem.applicationCacheDirectory + this.storyID  +"/"+ _filePath;
		this.player.looping = false;
		this.player.play();
 
		//this.player.looping = false; //this.looping;
		
		this.player.play();

	}
};

AudioSlide.prototype.setAudio = function( _targetInfo , _storyID) {

	this.storyID = _storyID;

	//// choose audio according to language
		if(Alloy.Globals.userLanguage == "es" ){
			this.audioFile =  _targetInfo.properties.audio_es;
		} else{
			this.audioFile =  _targetInfo.properties.audio_en;
		}


	/// define if clip is looped
		if(_targetInfo.properties.looped != undefined){
			this.looping = _targetInfo.properties.looped;
		}else{
			this.looping = false;
		}
		
};

AudioSlide.prototype.setFX = function( _storyID) {

/*
		this.storyID = _storyID;


		//// choose audio according to language

		this.audioFile =  _filePath;


		//// set if audio is loopable

			 this.looping =  false
			 


		if(!this.player){
			this.player = Ti.Media.createSound();
	 	}

*/
};




//// clear this object
AudioSlide.prototype.clean = function() {

	this.stopAudio();

	this.player = null;
	this.audioFile = null;
	this.looping = null;
	this.storyID = null;


	//delete this.player ;
	//delete this.audioFile ;
	//delete this.looping ;
	//delete this.storyID ;
 
};


module.exports = AudioSlide;