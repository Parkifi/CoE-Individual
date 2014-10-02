function TextSlide(_slideInfo) {
    this.slideInfo = _slideInfo;
    this.mainContainer = this.createTextSlide();
    this.speechAudio = Ti.Media.createSound({
        url: "storyAssets/story1/audio/" + this.slideInfo.audio_EN,
        looping: false
    });
    this.speechAudio.looping = false;
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
    this._slideContainer = Titanium.UI.createView({
        backgroundImage: "/text/textslide_background.png",
        width: "100%",
        height: "100%"
    });
    var slideText;
    slideText = "es" == Alloy.Globals.userLanguage ? this.slideInfo.text_ES : this.slideInfo.text_EN;
    textItem = Ti.UI.createLabel({
        text: slideText,
        width: "80%",
        height: "80%",
        font: {
            fontSize: 28,
            fontFamily: Alloy.Globals._font_oldenburg
        }
    });
    this._slideContainer.add(textItem);
    this._slideContainer.touchEnabled = true;
    return this._slideContainer;
};

TextSlide.prototype.createClickableSlide = function() {
    var slideArray = this.parseImageArray(this.transitionInfo.images);
    slideArray[0].opacity = 1;
    this._slideContainer = Titanium.UI.createView(this.transitionInfo.properties);
    this._slideContainer.touchEnabled = true;
    this._slideContainer.add(slideArray[1]);
    this._slideContainer.add(slideArray[0]);
    this._slideContainer.addEventListener("click", function(e) {
        var fadeIn = Titanium.UI.createAnimation({
            opacity: 1,
            duration: 6e3
        });
        var fadeOUT = Titanium.UI.createAnimation({
            opacity: 0,
            duration: 4e3
        });
        e.source.children[0].animate(fadeIn);
        e.source.children[1].animate(fadeOUT);
        e.source.removeEventListener("click", function() {});
    });
    return this._slideContainer;
};

TextSlide.prototype.startSpeech = function() {
    this.speechAudio.play();
};

TextSlide.prototype.stopSpeech = function() {
    this.speechAudio.stop();
};

TextSlide.prototype.clean = function() {
    for (i = this._slideContainer.children.length; i > 0; i--) this._slideContainer.remove(this._slideContainer.children[i - 1]);
    this._slideContainer = null;
};

TextSlide.prototype.parseTextArray = function() {
    return slideViews;
};

module.exports = TextSlide;