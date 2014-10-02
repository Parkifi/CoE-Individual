function StoryBuilder(_storyID, _touchSound) {
    this.touchSound = _touchSound;
    this.storyID = _storyID;
    this.createLoadingScreen();
    this.audioManager = new AudioSlide("audio", _storyID);
    this.speechManager = new AudioSlide("speech", _storyID);
    this.fxManager = new AudioSlide("fx", _storyID);
}

var Slide = require("/common/StorySlide");

var FileDownloader = require("/common/FileDownloader");

var AudioSlide = require("/common/AudioSlide");

var LoaderScreen = require("/common/LoaderScreen");

StoryBuilder.prototype._slides;

StoryBuilder.prototype.slide;

StoryBuilder.prototype._slideData;

StoryBuilder.prototype.loadingScreen;

StoryBuilder.prototype.audioMenuButton;

StoryBuilder.prototype.speechMenuButton;

StoryBuilder.prototype.hintMenuButton;

StoryBuilder.prototype.loadContent = function(_callbackThumbsLoaded) {
    function loadedData(e) {
        function parseDate(_date) {
            var arr = _date.split(/[- :T]/), date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], 0);
            return date;
        }
        function descargar() {
            var downloader = new FileDownloader();
            downloader.setLoaderScreen(_loadingScreen);
            var list = downloader.makeQueue(thumbnailsList, storyID);
            downloader.downloadMultiFile(list, function() {}, function() {
                dateOnFile && Ti.App.Properties.setString("bookID_" + storyID, dateOnFile);
                _callbackThumbsLoaded();
            });
            downloader = null;
            thumbnailsList = null;
            list = null;
            lang_sufix = null;
            builder = null;
        }
        this._slideData = e;
        var thumbnailsList = [];
        for (var i = 0; this._slideData.length > i; i++) for (var a = 0; this._slideData[i].stageElements.length > a; a++) switch (this._slideData[i].stageElements[a].type) {
          case "image":
            thumbnailsList.push(storyID + "/" + this._slideData[i].stageElements[a].properties.image);
            this._slideData[i].stageElements[a].properties.soundFx && thumbnailsList.push(storyID + "/" + this._slideData[i].stageElements[a].properties.soundFx);
            break;

          case "transition":
            if (this._slideData[i].stageElements[a].images) {
                var nodeItem = this._slideData[i].stageElements[a].images;
                for (var innerImage = 0; nodeItem.length > innerImage; innerImage++) thumbnailsList.push(storyID + "/" + nodeItem[innerImage]);
                this._slideData[i].stageElements[a].properties.soundFx && thumbnailsList.push(storyID + "/" + this._slideData[i].stageElements[a].properties.soundFx);
            }
            break;

          case "hint":
            thumbnailsList.push(storyID + "/" + this._slideData[i].stageElements[a].properties.image);
            break;

          case "audio":
            var selectedFile;
            selectedFile = "es" == Alloy.Globals.userLanguage ? this._slideData[i].stageElements[a].properties.audio_es : this._slideData[i].stageElements[a].properties.audio_en;
            thumbnailsList.push(storyID + "/" + selectedFile);
            break;

          case "speech":
            var selectedFile;
            selectedFile = "es" == Alloy.Globals.userLanguage ? this._slideData[i].stageElements[a].properties.audio_es : this._slideData[i].stageElements[a].properties.audio_en;
            thumbnailsList.push(storyID + "/" + selectedFile);
        }
        if (this._slideData[0].lastUpdate) if (Ti.App.Properties.getString("bookID_" + storyID)) {
            var serverDate = parseDate(this._slideData[0].lastUpdate);
            var localDate = parseDate(Ti.App.Properties.getString("bookID_" + storyID));
            if (!(serverDate.getTime() > localDate.getTime())) {
                _callbackThumbsLoaded();
                return;
            }
            descargar();
        } else descargar(); else descargar();
        var dateOnFile = this._slideData[0].lastUpdate;
    }
    this.parseJSON(this.storyID, loadedData);
    var storyID = this.storyID;
    var _loadingScreen = this.loadingScreen;
};

StoryBuilder.prototype.buildSlideJIT = function(i) {
    this.slide = new Slide(StoryBuilder.prototype._slideData[i], this.storyID, this.audioManager, this.speechManager, this.fxManager, this.touchSound);
    true == this.slide.hasAudio() ? this.hideMenuElement(this.audioMenuButton, true, 1200) : this.hideMenuElement(this.audioMenuButton, false, 1200);
    true == this.slide.hasSpeech() ? this.hideMenuElement(this.speechMenuButton, true, 1200) : this.hideMenuElement(this.speechMenuButton, false, 1200);
    true == this.slide.hasHints() ? this.hideMenuElement(this.hintMenuButton, true, 1200) : this.hideMenuElement(this.hintMenuButton, false, 1200);
    return this.slide;
};

StoryBuilder.prototype.hideMenuElement = function(_element, _status, _time) {
    function action() {
        _element.visible = _status;
    }
    setTimeout(action, _time);
};

StoryBuilder.prototype.createLoadingScreen = function() {
    var _loadingScreen = new LoaderScreen();
    this.loadingScreen = _loadingScreen.getLoader();
};

StoryBuilder.prototype.parseJSON = function(_URL, _callbackJsonData) {
    function callBack_DownloadOneFileFinished() {
        var file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationCacheDirectory, _storyID + "/" + _storyID + ".json");
        var data = file.read().text;
        var json = JSON.parse(data);
        StoryBuilder.prototype._slideData = json;
        _callbackJsonData(json);
        file = null;
        data = null;
        json = null;
    }
    var imageDir = Ti.Filesystem.getFile(Titanium.Filesystem.applicationCacheDirectory, this.storyID);
    imageDir.exists() || imageDir.createDirectory();
    var downloader = new FileDownloader();
    downloader.downloadOneFile(Alloy.Globals.remoteServerRoot + this.storyID + "/" + this.storyID + ".json", Titanium.Filesystem.applicationCacheDirectory + this.storyID + "/" + this.storyID + ".json", callBack_DownloadOneFileFinished);
    var _storyID = this.storyID;
    downloader = null;
    imageDir = null;
};

StoryBuilder.prototype.clean = function() {
    this.slide.clean();
    this.slide = null;
    this._slides = null;
    this._slideData = null;
    this.audioManager.clean();
    this.speechManager.clean();
    this.fxManager.clean();
    this.audioManager = null;
    this.speechManager = null;
    this.fxManager = null;
    StoryBuilder.prototype._slides = null;
    StoryBuilder.prototype.slide = null;
    StoryBuilder.prototype._slideData = null;
    StoryBuilder.prototype.audioManager = null;
    StoryBuilder.prototype.speechManager = null;
    StoryBuilder.prototype.fxManager = null;
};

StoryBuilder.prototype.setButtons = function(_speech, _audio, _hints) {
    this.audioMenuButton = _audio;
    this.speechMenuButton = _speech;
    this.hintMenuButton = _hints;
};

StoryBuilder.prototype.stopAudio = function() {
    this.audioManager && this.audioManager.stopAudio();
};

StoryBuilder.prototype.playAudio = function() {
    this.audioManager && this.audioManager.playAudio();
};

StoryBuilder.prototype.stopSpeech = function() {
    this.speechManager && this.speechManager.stopAudio();
};

StoryBuilder.prototype.pauseSpeech = function() {
    this.speechManager && this.speechManager.pauseAudio();
};

StoryBuilder.prototype.playSpeech = function() {
    this.speechManager && this.speechManager.playAudio();
};

StoryBuilder.prototype.cleanAudio = function() {
    this.audioManager.cleanAudio();
    this.speechManager.cleanAudio();
    this.fxManager.cleanAudio();
};

StoryBuilder.prototype.showHint = function() {
    this.slide.showHint();
};

StoryBuilder.prototype.hideHint = function() {
    this.slide.hideHint();
};

module.exports = StoryBuilder;