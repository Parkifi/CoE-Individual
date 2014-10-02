function AudioSlide(_type, _id) {
    this.looping = false;
    this.player = Ti.Media.createSound();
    this.typeSlide = _type;
    this.storyID = _id;
}

AudioSlide.prototype.audioFile;

AudioSlide.prototype.player;

AudioSlide.prototype.looping;

AudioSlide.prototype.storyID;

AudioSlide.prototype._audioPlayer;

AudioSlide.prototype.playAudio = function() {
    if (this.player) {
        this.player.url = Titanium.Filesystem.applicationCacheDirectory + this.storyID + "/" + this.audioFile;
        this.player.looping = this.looping;
        this.player.play();
    }
};

AudioSlide.prototype.stopAudio = function() {
    this.player && this.player.stop();
};

AudioSlide.prototype.pauseAudio = function() {
    this.player && this.player.pause();
};

AudioSlide.prototype.cleanAudio = function() {
    if (this.player) {
        this.player.stop();
        this.player.release();
    }
};

AudioSlide.prototype.playFX = function(_filePath) {
    if (this.player) {
        this.player.stop();
        this.player.release();
        this.player.url = Titanium.Filesystem.applicationCacheDirectory + this.storyID + "/" + _filePath;
        this.player.looping = false;
        this.player.play();
        this.player.play();
    }
};

AudioSlide.prototype.setAudio = function(_targetInfo, _storyID) {
    this.storyID = _storyID;
    this.audioFile = "es" == Alloy.Globals.userLanguage ? _targetInfo.properties.audio_es : _targetInfo.properties.audio_en;
    this.looping = void 0 != _targetInfo.properties.looped ? _targetInfo.properties.looped : false;
};

AudioSlide.prototype.setFX = function() {};

AudioSlide.prototype.clean = function() {
    this.stopAudio();
    this.player = null;
    this.audioFile = null;
    this.looping = null;
    this.storyID = null;
};

module.exports = AudioSlide;