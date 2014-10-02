function StoryNavigator(_storySlideObject) {
    this.storyView = Ti.UI.createView();
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
    this.contentCount = 0;
    this.loadSlideJIT(this.contentCount);
    StoryNavigator.prototype.activityFlag = "ready";
    return this.storyView;
};

StoryNavigator.prototype.setButtons = function(_back, _next) {
    this.backButton = _back;
    this.nextButton = _next;
};

StoryNavigator.prototype.buttonDisplayCheck = function() {
    if (this.backButton) {
        this.backButton.top = 0 == this.contentCount ? -200 : 0;
        this.nextButton.top = this.contentCount == this.storySlideObject._slideData.length - 1 ? -200 : 0;
    }
};

StoryNavigator.prototype.next = function() {
    function navDelay() {
        StoryNavigator.prototype.activityFlag = "ready";
    }
    if ("ready" == StoryNavigator.prototype.activityFlag) {
        if (this.contentCount + 1 < this.storySlideObject._slideData.length) {
            this.contentCount++;
            this.loadSlideJIT(this.contentCount);
        }
        StoryNavigator.prototype.activityFlag = "block";
        setTimeout(navDelay, 1e3);
        var player = Ti.Media.createSound({
            url: "/audio/fx/click3-page-flip.mp3"
        });
        player.play();
        player = null;
    }
};

StoryNavigator.prototype.back = function() {
    function navDelay() {
        StoryNavigator.prototype.activityFlag = "ready";
    }
    if ("ready" == StoryNavigator.prototype.activityFlag) {
        if (this.contentCount - 1 >= 0) {
            this.contentCount--;
            this.loadSlideJIT(this.contentCount);
        }
        StoryNavigator.prototype.activityFlag = "block";
        setTimeout(navDelay, 1e3);
        var player = Ti.Media.createSound({
            url: "/audio/fx/click3-page-flip.mp3"
        });
        player.play();
        player = null;
    }
};

StoryNavigator.prototype.loadSlideJIT = function(_slideID) {
    var buildSlide = this.storySlideObject.buildSlideJIT(_slideID);
    var currentSlide = buildSlide.getSlide();
    currentSlide.backgroundColor = "#ffffff";
    currentSlide.parentView = this.storyView;
    currentSlide.opacity = 0;
    this.storyView.add(currentSlide);
    buildSlide.slideLoaded();
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
};

StoryNavigator.prototype.errorManager = function() {};

module.exports = StoryNavigator;