function BookDetails(_defaultMSG, _touchSound) {
    this.mainContainer = Ti.UI.createView({
        right: 0,
        bottom: 0,
        width: 447,
        height: 642,
        touchEnabled: false
    });
    var title1 = Ti.UI.createLabel({
        text: _defaultMSG,
        right: 20,
        top: 100,
        width: 380,
        touchEnabled: false,
        color: "#000000",
        font: {
            fontSize: 30,
            fontFamily: Alloy.Globals._font_oldenburg
        }
    });
    this.mainContainer.add(title1);
}

var ImageSlideShow = require("/common/ImageSlideShow");

BookDetails.prototype.slideshow;

BookDetails.prototype.touchSound;

BookDetails.prototype.setData = function(_data) {
    this.bookData = _data;
};

BookDetails.prototype.getContainer = function() {
    return this.mainContainer;
};

BookDetails.prototype.showDetails = function() {
    this.slideshow && this.slideshow.stop();
    this.clearContainer();
    this.renderData();
};

BookDetails.prototype.clearContainer = function() {
    this.mainContainer.children.length > 0 && this.mainContainer.removeAllChildren();
};

BookDetails.prototype.renderData = function() {
    var mainTitleText;
    mainTitleText = "es" == Alloy.Globals.userLanguage ? this.bookData.storyTitle_es.toString() : this.bookData.storyTitle_en.toString();
    var title1 = Ti.UI.createLabel({
        text: mainTitleText,
        left: 20,
        top: 15,
        width: 400,
        touchEnabled: false,
        color: "#000000",
        font: {
            fontSize: "28sp",
            fontFamily: Alloy.Globals._font_oldenburg
        }
    });
    this.mainContainer.add(title1);
    var descriptionText;
    descriptionText = "es" == Alloy.Globals.userLanguage ? this.bookData.intro_es.toString() : this.bookData.intro_en.toString();
    var bookDescription = Ti.UI.createLabel({
        text: descriptionText,
        top: 55,
        left: 20,
        width: 400,
        touchEnabled: false,
        color: "#000000",
        font: {
            fontSize: "18sp",
            fontFamily: Alloy.Globals._font_oldenburg
        }
    });
    this.mainContainer.add(bookDescription);
    if (this.bookData.slideshow) {
        var _slideShow = this.createSlideShow();
        this.mainContainer.add(_slideShow);
    }
};

BookDetails.prototype.createSlideShow = function() {
    this.slideshow = new ImageSlideShow(this.bookData.slideshow, this.touchSound);
    this.slideshow.createContainer();
    this.slideshow.start();
    return this.slideshow.getContainer();
};

BookDetails.prototype.isPreview = function() {
    return this.bookData ? this.bookData.previewMode ? true : false : false;
};

module.exports = BookDetails;