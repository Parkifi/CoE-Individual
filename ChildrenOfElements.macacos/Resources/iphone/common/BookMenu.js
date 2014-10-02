function BookMenu(_planetID, _aboutTextContainer, _touchSound) {
    this.aboutTextContainer = _aboutTextContainer;
    this.menuContainer = Ti.UI.createScrollView({
        top: 13,
        left: 100,
        width: 450,
        height: "98%",
        contentWidth: 450,
        contentHeight: "auto",
        showVerticalScrollIndicator: false,
        showHorizontalScrollIndicator: false
    });
    this.parseJsonDoc(_planetID);
    this.menuContainer.addEventListener("selectedBook", this.selectedBookHandler);
    this.createLoadingScreen();
}

var LoaderScreen = require("/common/LoaderScreen");

var FileDownloader = require("/common/FileDownloader");

BookMenu.prototype.menuContainer;

BookMenu.prototype.loadingScreen;

BookMenu.prototype.aboutTextContainer;

BookMenu.prototype.loadThumbnails = function(_callbackThumbsLoaded) {
    var localDate = this.parseDate(Ti.App.Properties.getString("lastUpdate"));
    var serverDate = this.parseDate(this.jsonData.lastUpdate.toString());
    if (serverDate.getTime() >= localDate.getTime()) {
        var thumbnailsList = [];
        for (var i = 0; this.jsonData.data.length > i; i++) {
            var lang_sufix = "en" == Alloy.Globals.userLanguage ? this.jsonData.data[i].thumb_en : this.jsonData.data[i].thumb_es;
            if (this.jsonData.data[i].slideshow) for (var ib = 0; this.jsonData.data[i].slideshow.length > ib; ib++) thumbnailsList.push("bookshelfData/" + this.jsonData.data[i].slideshow[ib]);
            thumbnailsList.push("bookshelfData/" + lang_sufix);
        }
        var downloader = new FileDownloader();
        downloader.setLoaderScreen(this.loadingScreen);
        var list = downloader.makeQueue(thumbnailsList, "bookshelfData");
        downloader.downloadMultiFile(list, function() {}, function() {
            _callbackThumbsLoaded(serverDate);
        });
        downloader = null;
        thumbnailsList = null;
        list = null;
        lang_sufix = null;
    } else _callbackThumbsLoaded();
};

BookMenu.prototype.getTable = function() {
    return this.menuContainer;
};

BookMenu.prototype.parseJsonDoc = function() {
    var _URL = "bookshelfData/north_menu.json";
    var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationCacheDirectory, _URL);
    var data = file.read();
    if ("" == data.text) {
        Ti.API.info("error reading JSON file for menu");
        this.jsonData = false;
    } else {
        Ti.API.info("here now error reading JSON file for menu");
        this.jsonData = JSON.parse(data.text);
        this.jsonData.popUpMessage && (this.aboutTextContainer.text = this.jsonData.popUpMessage);
    }
};

BookMenu.prototype.populateTable = function() {
    var topPos = 75;
    for (var i = 0; this.jsonData.data.length > i; i++) {
        var imageFile = "en" == Alloy.Globals.userLanguage ? Titanium.Filesystem.applicationCacheDirectory + "bookshelfData/" + this.jsonData.data[i].thumb_en : Titanium.Filesystem.applicationCacheDirectory + "bookshelfData/" + this.jsonData.data[i].thumb_es;
        var row = Ti.UI.createImageView({
            width: 451,
            height: 597,
            top: topPos,
            image: imageFile
        });
        if (0 == i % 2) row.left = 0; else {
            row.left = 226;
            topPos += 298;
        }
        row.bookData = this.jsonData.data[i];
        row.addEventListener("click", function(e) {
            var evtData = {
                bookData: e.source.bookData
            };
            e.source.getParent().fireEvent("selectedBook", evtData);
            var player = Ti.Media.createSound({
                url: "/audio/fx/click2-bookselection.mp3"
            });
            player.play();
        });
        this.menuContainer.add(row);
    }
};

BookMenu.prototype.selectedBookHandler = function(e) {
    var evtData = {
        bookData: e.bookData
    };
    e.source.getParent().fireEvent("showBookDetails", evtData);
};

BookMenu.prototype.createLoadingScreen = function() {
    var _loadingScreen = new LoaderScreen();
    this.loadingScreen = _loadingScreen.getLoader();
};

BookMenu.prototype.getDefaultMesage = function() {
    var results = "";
    results = "es" == Alloy.Globals.userLanguage ? this.jsonData.defaultMessage_es : this.jsonData.defaultMessage_en;
    return results;
};

BookMenu.prototype.getAboutMessage = function() {
    var results = "";
    results = "es" == Alloy.Globals.userLanguage ? this.jsonData.popUpMessage_es : this.jsonData.popUpMessage_en;
    return results;
};

BookMenu.prototype.clear = function() {
    this.menuContainer.removeEventListener("selectedBook", this.selectedBookHandler);
    this.menuContainer.removeAllChildren();
    this.loadingScreen = null;
    this.menuContainer = null;
};

BookMenu.prototype.parseDate = function(_date) {
    var preDate = new Date(_date);
    if (preDate.getTime()) return preDate;
    var arr = _date.split(/[- :T]/), date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], 0);
    return date;
};

module.exports = BookMenu;