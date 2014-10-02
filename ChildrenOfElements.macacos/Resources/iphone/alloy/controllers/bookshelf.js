function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function winEvent(e) {
        if (buttonActiveFlag) {
            "blur" == e.type && stopLoopAudio();
            "focus" == e.type && verifyAudio();
            buttonActiveFlag = false;
            globalDelay = setTimeout(function() {
                buttonActiveFlag = true;
            }, 200);
        }
    }
    function init() {
        function thumbsLoaded(_date) {
            _menu.populateTable();
            $.bookshelf.removeEventListener("open", init);
            bookDetails = new BookDetails(_menu.getDefaultMesage(), touchSound);
            $.aboutText.text = _menu.getAboutMessage();
            $.bookshelf.add(bookDetails.getContainer());
            if (_date) {
                var serverDate = new Date(_date);
                var updatedDate = new Date(serverDate.getTime() + 6e4);
                Ti.App.Properties.setString("lastUpdate", updatedDate);
                currentDate = Ti.App.Properties.getString("lastUpdate");
            }
        }
        if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE && "March 13, 2014 11:36" == Ti.App.Properties.getString("lastUpdate")) {
            currentDate = Ti.App.Properties.getString("lastUpdate");
            var alertDialog = Titanium.UI.createAlertDialog({
                title: "Internet Connection not found",
                message: "Please try again later.",
                buttonNames: [ "OK" ]
            });
            alertDialog.show();
            return;
        }
        player.url = "/audio/bookshelf-opt.mp3";
        player.looping = true;
        verifyAudio();
        "es" == Alloy.Globals.userLanguage && ($.toolbar_button_suscribe.image = "/bookshelf/bookshelf_navigator_suscribe_es.png");
        $.bookshelf_play.visible = false;
        $.thumbnailPre.visible = false;
        var _aboutText = $.aboutText;
        _menu = new BookMenu(args.currentItem.id, _aboutText, touchSound);
        $.bookshelf.add(_menu.loadingScreen);
        _menu.loadThumbnails(thumbsLoaded);
        $.bookshelf.add(_menu.getTable());
    }
    function showDetails(e) {
        bookDetails.setData(e.bookData);
        if (bookDetails.isPreview()) {
            $.bookshelf_play.visible = false;
            $.thumbnailPre.visible = false;
        } else {
            $.bookshelf_play.visible = true;
            $.thumbnailPre.visible = true;
        }
        $.thumbnail.visible = true;
        _storyData = e.bookData.storyID;
        bookDetails.showDetails();
        Flurry.logEvent("StoryDetailsClick", {
            storyID: _storyData
        });
    }
    function loadStory() {
        function openBack() {
            verifyAudio();
            $.bookshelf.removeEventListener("focus", openBack);
        }
        if (Titanium.Network.networkType == Titanium.Network.NETWORK_NONE && !Ti.App.Properties.getString("bookID_" + _storyData)) {
            var alertDialog = Titanium.UI.createAlertDialog({
                title: "Internet Connection not found",
                message: "Please try again later.",
                buttonNames: [ "OK" ]
            });
            alertDialog.show();
            return;
        }
        if (_storyData) {
            Flurry.logEvent("StoryOpenClick", {
                storyID: _storyData
            });
            var storyViewer = Alloy.createController("storyViewer", {
                storyID: _storyData
            }).getView();
            storyViewer.open({
                fullscreen: true,
                navBarHidden: true,
                exitOnClose: true
            });
            storyViewer = null;
            delete storyViewer;
            stopLoopAudio();
            $.bookshelf.addEventListener("focus", openBack);
        }
    }
    function verifyAudio() {
        Ti.App.Properties.getString("bookshelfAudioStatus") || Ti.App.Properties.setString("bookshelfAudioStatus", "enabled");
        if ("disabled" == Ti.App.Properties.getString("bookshelfAudioStatus")) {
            player.stop();
            $.toolbar_button_mute.image = "/bookshelf/bookshelf_navigator_sound_off.png";
        } else {
            player.play();
            $.toolbar_button_mute.image = "/bookshelf/bookshelf_navigator_sound.png";
        }
    }
    function stopLoopAudio() {
        player.stop();
    }
    function toggleAudio() {
        if (buttonActiveFlag) {
            if (player.playing) {
                player.stop();
                $.toolbar_button_mute.image = "/bookshelf/bookshelf_navigator_sound_off.png";
                Ti.App.Properties.setString("bookshelfAudioStatus", "disabled");
            } else {
                player.play();
                $.toolbar_button_mute.image = "/bookshelf/bookshelf_navigator_sound.png";
                Ti.App.Properties.setString("bookshelfAudioStatus", "enabled");
            }
            var playerFX = Ti.Media.createSound({
                url: "/audio/fx/click1_topmenu.mp3"
            });
            playerFX.play();
            playerFX = null;
            buttonActiveFlag = false;
            globalDelay = setTimeout(function() {
                buttonActiveFlag = true;
            }, 1e3);
        }
    }
    function openFaceBook() {
        if ("es" == Alloy.Globals.userLanguage) var dialog = Ti.UI.createAlertDialog({
            confirm: 0,
            message: "Sua avaliação nos estimula a criar!",
            title: "Gostou do que viu?"
        }); else var dialog = Ti.UI.createAlertDialog({
            confirm: 0,
            message: "Sua avaliação nos estimula a criar!",
            title: "Gostou do que viu?"
        });
        dialog.show();
        var player = Ti.Media.createSound({
            url: "/audio/fx/click1_topmenu.mp3"
        });
        player.play();
        player = null;
    }
    function suscribe() {
        Flurry.logEvent("SuscribeClick", {
            click: "true"
        });
        var animation = Titanium.UI.createAnimation({
            opacity: 1,
            duration: 600
        });
        $.aboutImage.touchEnabled = true;
        $.aboutImage.zIndex = 100;
        $.aboutImage.width = "100%";
        $.aboutImage.height = "100%";
        $.aboutImage.animate(animation);
        $.aboutImage.addEventListener("click", function() {
            var animationx = Titanium.UI.createAnimation({
                opacity: 0,
                duration: 600
            });
            $.aboutImage.animate(animationx);
            $.aboutImage.touchEnabled = false;
            $.aboutImage.width = "0%";
            $.aboutImage.height = "0%";
        });
        var player = Ti.Media.createSound({
            url: "/audio/fx/click1_topmenu.mp3"
        });
        player.play();
        player = null;
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "bookshelf";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.bookshelf = Ti.UI.createWindow({
        backgroundImage: "/bookshelf/bookshelf_background.png",
        id: "bookshelf"
    });
    $.__views.bookshelf && $.addTopLevelView($.__views.bookshelf);
    $.__views.contentSelect = Ti.UI.createView({
        id: "contentSelect"
    });
    $.__views.bookshelf.add($.__views.contentSelect);
    $.__views.bookshelf_toolBar = Ti.UI.createView({
        height: 102,
        width: 380,
        top: 0,
        right: 25,
        id: "bookshelf_toolBar"
    });
    $.__views.bookshelf.add($.__views.bookshelf_toolBar);
    $.__views.toolbar_button_mute = Ti.UI.createImageView({
        width: 98,
        height: 97,
        left: 110,
        top: 0,
        id: "toolbar_button_mute",
        image: "/bookshelf/bookshelf_navigator_sound.png"
    });
    $.__views.bookshelf_toolBar.add($.__views.toolbar_button_mute);
    toggleAudio ? $.__views.toolbar_button_mute.addEventListener("click", toggleAudio) : __defers["$.__views.toolbar_button_mute!click!toggleAudio"] = true;
    $.__views.toolbar_button_suscribe = Ti.UI.createImageView({
        width: 101,
        height: 91,
        left: 220,
        top: 0,
        id: "toolbar_button_suscribe",
        image: "/bookshelf/bookshelf_navigator_suscribe.png"
    });
    $.__views.bookshelf_toolBar.add($.__views.toolbar_button_suscribe);
    suscribe ? $.__views.toolbar_button_suscribe.addEventListener("click", suscribe) : __defers["$.__views.toolbar_button_suscribe!click!suscribe"] = true;
    $.__views.toolbar_button_home = Ti.UI.createImageView({
        width: 93,
        height: 93,
        left: 0,
        top: 0,
        id: "toolbar_button_home",
        image: "/bookshelf/bookshelf_navigator_home.png"
    });
    $.__views.bookshelf_toolBar.add($.__views.toolbar_button_home);
    openFaceBook ? $.__views.toolbar_button_home.addEventListener("click", openFaceBook) : __defers["$.__views.toolbar_button_home!click!openFaceBook"] = true;
    $.__views.bookshelf_play = Ti.UI.createImageView({
        bottom: 330,
        right: 50,
        width: 92,
        zIndex: 10,
        height: 89,
        visible: 0,
        image: "/bookshelf/bookshelf_buton_play_bw.png",
        id: "bookshelf_play"
    });
    $.__views.bookshelf.add($.__views.bookshelf_play);
    $.__views.thumbnail = Ti.UI.createImageView({
        right: 40,
        bottom: 12,
        width: 363,
        height: 334,
        visible: 0,
        id: "thumbnail"
    });
    $.__views.bookshelf.add($.__views.thumbnail);
    $.__views.thumbnailPre = Ti.UI.createImageView({
        bottom: 33,
        right: 55,
        width: 345,
        height: 258,
        backgroundColor: "transparent",
        touchEnabled: true,
        zIndex: 100,
        id: "thumbnailPre"
    });
    $.__views.bookshelf.add($.__views.thumbnailPre);
    $.__views.aboutImage = Ti.UI.createView({
        top: 0,
        left: 0,
        width: "0%",
        height: "0%",
        opacity: "0",
        id: "aboutImage",
        backgroundColor: "#55FFFFFF"
    });
    $.__views.bookshelf.add($.__views.aboutImage);
    $.__views.__alloyId0 = Ti.UI.createView({
        backgroundImage: "/about/aboutScreen_window.png",
        width: "814",
        height: "569",
        id: "__alloyId0"
    });
    $.__views.aboutImage.add($.__views.__alloyId0);
    $.__views.aboutText = Ti.UI.createLabel({
        width: "80%",
        top: 80,
        color: "#000000",
        touchEnabled: false,
        font: {
            fontSize: 20,
            fontFamily: Alloy.Globals._font_oldenburg
        },
        id: "aboutText"
    });
    $.__views.__alloyId0.add($.__views.aboutText);
    exports.destroy = function() {};
    _.extend($, $.__views);
    var touchSound;
    var Flurry = require("com.onecowstanding.flurry");
    Flurry.debugLogEnabled = true;
    Flurry.eventLoggingEnabled = true;
    Flurry.sessionReportsOnCloseEnabled = true;
    Flurry.sessionReportsOnPauseEnabled = true;
    Flurry.sessionReportsOnActivityChangeEnabled = true;
    Flurry.secureTransportEnabled = false;
    Flurry.logPageView();
    var BookMenu = require("/common/BookMenu");
    var BookDetails = require("/common/BookDetails");
    var args = arguments[0] || {};
    args.currentItem;
    var _menu;
    var bookDetails;
    var _storyData;
    var player = Ti.Media.createSound();
    var globalDelay;
    var buttonActiveFlag = true;
    $.bookshelf.addEventListener("open", init);
    $.bookshelf.addEventListener("showBookDetails", showDetails);
    $.bookshelf_play.addEventListener("click", loadStory);
    $.bookshelf_play.addEventListener("touchstart", function(e) {
        e.source.image = "/bookshelf/bookshelf_buton_play.png";
        var player = Ti.Media.createSound({
            url: "/audio/fx/click2-bookselection.mp3"
        });
        player.play();
        player = null;
    });
    $.bookshelf_play.addEventListener("touchend", function(e) {
        e.source.image = "/bookshelf/bookshelf_buton_play_bw.png";
    });
    $.thumbnailPre.addEventListener("click", loadStory);
    $.bookshelf.addEventListener("android:back", function(e) {
        e.cancelBubble = true;
    });
    $.bookshelf.addEventListener("blur", winEvent);
    $.bookshelf.addEventListener("close", winEvent);
    $.bookshelf.addEventListener("focus", winEvent);
    $.bookshelf.addEventListener("open", winEvent);
    __defers["$.__views.toolbar_button_mute!click!toggleAudio"] && $.__views.toolbar_button_mute.addEventListener("click", toggleAudio);
    __defers["$.__views.toolbar_button_suscribe!click!suscribe"] && $.__views.toolbar_button_suscribe.addEventListener("click", suscribe);
    __defers["$.__views.toolbar_button_home!click!openFaceBook"] && $.__views.toolbar_button_home.addEventListener("click", openFaceBook);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;