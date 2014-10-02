function ImageSlideShow(_data, _touchsound) {
    this.mainContainer = Ti.UI.createView({
        width: 345,
        height: 258,
        right: 55,
        bottom: 33
    });
    this.slideData = _data;
    this.timeCounter = 0;
    this.slidePosition = 0;
    this.touchEnabled = false;
}

ImageSlideShow.prototype.timerObject;

ImageSlideShow.prototype.timeCounter;

ImageSlideShow.prototype.slidePosition;

ImageSlideShow.prototype.method_name = function() {};

ImageSlideShow.prototype.createContainer = function() {
    var properties = {
        image: Titanium.Filesystem.applicationCacheDirectory + "bookshelfData/" + this.slideData[0],
        width: Ti.UI.FILL,
        height: Ti.UI.FILL,
        touchEnabled: false
    };
    {
        Ti.UI.createImageView(properties);
    }
    this.mainContainer.add(this.createImage(0));
};

ImageSlideShow.prototype.getContainer = function() {
    return this.mainContainer;
};

ImageSlideShow.prototype.start = function() {
    if (2 > this.slideData.length) return false;
    this.timerObject && this.stop();
    var _this = this;
    this.timerObject = setInterval(function() {
        5 == this.timeCounter && _this.stop();
        _this.slidePosition < _this.slideData.length - 1 ? _this.slidePosition++ : _this.slidePosition = 0;
        _this.mainContainer.add(_this.createImage(_this.slidePosition));
        _this.mainContainer.children.length > 2 && _this.mainContainer.remove(_this.mainContainer.children[0]);
    }, 5e3);
};

ImageSlideShow.prototype.stop = function() {
    if (this.timerObject) {
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
        opacity: 0
    };
    var singleImage = Ti.UI.createImageView(properties);
    var animationBase = Ti.UI.createAnimation({
        opacity: 1,
        duration: 1500
    });
    singleImage.animate(animationBase);
    return singleImage;
};

module.exports = ImageSlideShow;