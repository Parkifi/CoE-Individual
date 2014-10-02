function FileDownloader() {}

FileDownloader.prototype.mainLoader;

FileDownloader.prototype.downloadOneFile = function(_url, localFilepath, callBack_DownloadOneFileFinished) {
    var url = _url + "?nocache=" + Math.floor(1300 * Math.random());
    var c = Titanium.Network.createHTTPClient();
    if (null != callBack_DownloadOneFileFinished) {
        c.onerror = function(e) {
            Ti.API.info("MyApp: Download failed: url= " + url + " Error=" + e.error);
            callBack_DownloadOneFileFinished({
                status: e.error,
                path: ""
            });
        };
        c.onload = function() {
            callBack_DownloadOneFileFinished({
                status: c.status,
                path: localFilepath
            });
            c = null;
        };
    }
    c.open("GET", url);
    if (null != localFilepath && true) {
        Ti.API.info("MyApp:  (iOS) Downloaded this file from server:." + localFilepath);
        c.file = Titanium.Filesystem.getFile(localFilepath);
    }
    c.send();
};

FileDownloader.prototype.downloadMultiFile = function(_downloadQueue, callBack_DownloadOneFileFinished, callBack_DownloadMultipleFileFinished) {
    var downloadQueue = this.filterDuplicates(_downloadQueue);
    Ti.API.info(downloadQueue[0]);
    var queueIndex = 0;
    if (this.mainLoader) var _mainLoader = this.mainLoader;
    var processQueue = function(download_result) {
        if ("undefined" != typeof download_result) {
            var percent = 100 / downloadQueue.length;
            var factor = 8.14;
            var indent = 0;
            if (_mainLoader) {
                var _leftMove = queueIndex * percent * factor + indent;
                if (_leftMove > 1 && 100 > percent) {
                    var _animation = Ti.UI.createAnimation({
                        left: _leftMove,
                        duration: 100
                    });
                    _mainLoader.children[0].children[1].animate(_animation);
                }
            }
            callBack_DownloadOneFileFinished(download_result, percent);
        }
        if (downloadQueue.length > queueIndex) {
            FileDownloader.prototype.downloadOneFile(downloadQueue[queueIndex].url, downloadQueue[queueIndex].filepath, processQueue);
            queueIndex++;
        } else {
            if (_mainLoader) {
                _mainLoader.visible = false;
                _mainLoader = null;
            }
            callBack_DownloadMultipleFileFinished();
        }
    };
    processQueue();
};

FileDownloader.prototype.checkUpdate = function(_callback) {
    var url = Alloy.Globals.remoteServerRoot + "lastUpdate.json?nocache=" + Math.floor(1300 * Math.random());
    var json;
    var xhr = Ti.Network.createHTTPClient({
        onload: function() {
            json = JSON.parse(this.responseText);
            var serverDate = new Date(json.lastUpdate.toString());
            var localDate = new Date(Ti.App.Properties.getString("lastUpdate"));
            if (serverDate.getTime() > localDate.getTime()) {
                Ti.App.Properties.setString("lastUpdate", serverDate);
                _callback(true);
            } else _callback(false);
        },
        onerror: function(e) {
            Ti.API.debug("error reading last update " + e.error);
        }
    });
    xhr.open("GET", url);
    xhr.send();
};

FileDownloader.prototype.checkUpdateMenu = function(_data, _callback) {
    var serverDate = new Date(_data.toString());
    var localDate = new Date(Ti.App.Properties.getString("lastUpdate"));
    serverDate.getTime() >= localDate.getTime() ? _callback(true) : _callback(false);
};

FileDownloader.prototype.makeQueue = function(array) {
    var result = [];
    var _array = this.filterDuplicates(array);
    if (_array instanceof Array) for (var i = 0; _array.length > i; i++) result.push({
        filepath: Titanium.Filesystem.applicationCacheDirectory + _array[i],
        url: Alloy.Globals.remoteServerRoot + _array[i]
    }); else Ti.API.info("ERROR: parameter is not a valid array");
    return result;
};

FileDownloader.prototype.setLoaderScreen = function(_loadingScreen) {
    this.mainLoader = _loadingScreen;
    this.mainLoader.visible = true;
};

FileDownloader.prototype.calculatePercent = function(_length, _current) {
    var factor = 100 / _length;
    this.mainLoader && (this.mainLoader.children[0].width = 6 * _current * factor);
    return _current * factor;
};

FileDownloader.prototype.startloader = function() {};

FileDownloader.prototype.forceFile = function() {
    var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, "emptyfile.txt");
    f.write("The file is no longer empty! 50  >> 50");
    f.exists ? Ti.API.info("[saveFile] Saved: YES! (" + f.nativePath + ")") : Ti.API.info("[saveFile] Saved: NO!");
    var xe = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory, "emptyfile.txt");
    xe.read();
};

FileDownloader.prototype.filterDuplicates = function(duplicatesArray) {
    var uniqueArray = duplicatesArray.filter(function(elem, pos) {
        return duplicatesArray.indexOf(elem) == pos;
    });
    return uniqueArray;
};

module.exports = FileDownloader;