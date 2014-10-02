function ItemTransition(_data, _id) {
    this.slideData = _data;
    this.timeCounter = 0;
    this.slidePosition = 0;
    this.touchEnabled = false;
    this.storyID = _id;
    this.mainContainer = Ti.UI.createView(this.slideData.properties);
    this.mainContainer.touchEnabled = false;
    if (this.slideData.transitionTime) if (this.slideData.images) {
        var rawTime = this.slideData.transitionTime / this.slideData.images.length;
        var testedTime;
        testedTime = 1e3 > rawTime ? 1e3 : rawTime;
        this.singleTransitionTime = testedTime;
    } else {
        var testedTime;
        testedTime = 1e3 > this.slideData.transitionTime ? 1e3 : this.slideData.transitionTime;
        this.singleTransitionTime = testedTime;
    } else this.singleTransitionTime = 2e3;
}

ItemTransition.prototype.timerObject;

ItemTransition.prototype.timeCounter;

ItemTransition.prototype.slidePosition;

ItemTransition.prototype.getContainer = function() {
    this.mainContainer.add(this.createImage(0));
    return this.mainContainer;
};

ItemTransition.prototype.start = function() {
    function transitionMovement() {
        function animationDone() {
            _this.mainContainer.remove(_this.mainContainer.children[0]);
        }
        if (_this.timeCounter > 0) {
            _this.stop();
            _this.timeCounter = 0;
            return false;
        }
        _this.slidePosition == _this.slideData.images.length - 2 && _this.timeCounter++;
        _this.slidePosition < _this.slideData.images.length - 1 ? _this.slidePosition++ : _this.slidePosition = 0;
        var animationBase = Ti.UI.createAnimation({
            opacity: 0,
            duration: 900
        });
        _this.mainContainer.add(_this.createImage(_this.slidePosition));
        if (_this.mainContainer.children.length > 1) {
            var animationBase = Ti.UI.createAnimation({
                opacity: 0,
                duration: 500
            });
            _this.mainContainer.children[0].animate(animationBase);
            animationBase.addEventListener("complete", animationDone);
        }
    }
    if (2 > this.slideData.images.length) return false;
    this.timerObject && this.stop();
    var _this = this;
    this.timerObject = setInterval(transitionMovement, this.singleTransitionTime);
    transitionMovement("x");
};

ItemTransition.prototype.stop = function() {
    if (this.timerObject) {
        clearInterval(this.timerObject);
        this.timerObject = null;
    }
};

ItemTransition.prototype.createImage = function(_id) {
    var properties = {
        image: Titanium.Filesystem.applicationCacheDirectory + this.storyID + "/" + this.slideData.images[_id],
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        bottom: 0,
        right: 0,
        zIndex: 1,
        touchEnabled: false,
        opacity: 0
    };
    var singleImage = Ti.UI.createImageView(properties);
    var animationBase = Ti.UI.createAnimation({
        opacity: 1,
        duration: 1e3
    });
    singleImage.animate(animationBase);
    return singleImage;
};

ItemTransition.prototype.clean = function() {
    this.stop();
    this.timerObject = null;
    this.timeCounter = null;
    this.slidePosition = null;
};

ItemTransition.prototype.getClickDelayTime = function() {
    var minTime = 1e3 * this.slideData.images.length;
    return this.slideData.transitionTime > minTime ? this.slideData.transitionTime : minTime;
};

ItemTransition.prototype.createContainer = function() {};

module.exports = ItemTransition;