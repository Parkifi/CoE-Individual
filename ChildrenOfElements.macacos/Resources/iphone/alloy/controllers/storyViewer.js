function __processArg(obj, key) {
    var arg = null;
    if (obj) {
        arg = obj[key] || null;
        delete obj[key];
    }
    return arg;
}

function Controller() {
    function pageBack(e) {
        e.cancelBubble = true;
    }
    function winEvent(e) {
        "blur" == e.type && _story && _story.stopAudio();
        "focus" == e.type && _story && _story.playAudio();
    }
    function init() {
        function contentLoaded() {
            _navigator = new Navigator(_story);
            _navigator.setButtons(_back, _next);
            $.storyStage.add(_navigator.init());
            $.storyViewer.removeEventListener("android:back", pageBack);
        }
        setAudioGlobals();
        _story = new Story(currentStoryID, touchSound);
        $.storyViewer.add(_story.loadingScreen);
        _story.loadContent(contentLoaded);
        var _speech = $.speech;
        var _audio = $.audio;
        var _hints = $.hints;
        var _back = $.back;
        var _next = $.next;
        _story.setButtons(_speech, _audio, _hints);
        $.anchor.active = false;
    }
    function next() {
        hideMenu(1);
        _story.cleanAudio();
        _navigator.next();
    }
    function back() {
        hideMenu(1);
        _story.cleanAudio();
        _navigator.back();
    }
    function toggleAudio() {
        if (buttonActiveFlag) {
            if ($.audio.active) {
                _story.playAudio();
                $.audio.active = false;
                $.audio.backgroundImage = "/menu/button_sound.png";
                Ti.App.Properties.setString("storyAudioStatus", "enabled");
            } else {
                _story.stopAudio();
                $.audio.active = true;
                $.audio.backgroundImage = "/menu/button_sound_off.png";
                Ti.App.Properties.setString("storyAudioStatus", "disabled");
            }
            var player = Ti.Media.createSound({
                url: "/audio/fx/click1_topmenu.mp3"
            });
            player.play();
            player = null;
            makeDelay();
        }
    }
    function toggleSpeech() {
        if (buttonActiveFlag) {
            if ($.speech.active) {
                _story.playSpeech();
                $.speech.active = false;
                $.speech.backgroundImage = "/menu/button_speech.png";
                Ti.App.Properties.setString("speechAudioStatus", "enabled");
            } else {
                _story.pauseSpeech();
                $.speech.active = true;
                $.speech.backgroundImage = "/menu/button_speech_off.png";
                Ti.App.Properties.setString("speechAudioStatus", "disabled");
            }
            var player = Ti.Media.createSound({
                url: "/audio/fx/click1_topmenu.mp3"
            });
            player.play();
            player = null;
            makeDelay();
        }
    }
    function toggleHints() {
        if (buttonActiveFlag) {
            if ($.hints.active) {
                _story.hideHint();
                $.hints.active = false;
            } else {
                _story.showHint();
                $.hints.active = true;
            }
            var player = Ti.Media.createSound({
                url: "/audio/fx/click1_topmenu.mp3"
            });
            player.play();
            player = null;
            makeDelay();
        }
    }
    function toggleMenu() {
        if (buttonActiveFlag) {
            $.anchor.active ? hideMenu() : showMenu();
            var player = Ti.Media.createSound({
                url: "/audio/fx/click1_topmenu.mp3"
            });
            player.play();
            player = null;
            makeDelay();
        }
    }
    function showMenu() {
        var menuAnimation = Ti.UI.createAnimation({
            top: 0,
            curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
            duration: 600
        });
        $.menuElements.animate(menuAnimation);
        $.anchor.active = true;
        $.navBar.touchEnabled = true;
        "number" == typeof autoHide && clearTimeout(autoHide);
        autoHide = setTimeout(function() {
            hideMenu();
        }, 1e4);
    }
    function hideMenu(_time) {
        var menuAnimation = Ti.UI.createAnimation({
            top: -200,
            curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
            duration: 500
        });
        _time && (menuAnimation.duration = 1);
        $.menuElements.animate(menuAnimation);
        $.anchor.active = false;
        $.hints.active = false;
        $.navBar.touchEnabled = false;
        "number" == typeof autoHide && clearTimeout(autoHide);
    }
    function makeDelay() {
        buttonActiveFlag = false;
        globalDelay = setTimeout(function() {
            buttonActiveFlag = true;
            clearTimeout(globalDelay);
        }, 1e3);
    }
    function setAudioGlobals() {
        Ti.App.Properties.getString("storyAudioStatus") || Ti.App.Properties.setString("storyAudioStatus", "enabled");
        Ti.App.Properties.getString("speechAudioStatus") || Ti.App.Properties.setString("speechAudioStatus", "enabled");
        if ("disabled" == Ti.App.Properties.getString("storyAudioStatus")) {
            $.audio.active = false;
            $.audio.backgroundImage = "/menu/button_sound_off.png";
        }
        if ("disabled" == Ti.App.Properties.getString("speechAudioStatus")) {
            $.speech.active = false;
            $.speech.backgroundImage = "/menu/button_speech_offpng";
        }
    }
    function exitStory() {
        var player = Ti.Media.createSound({
            url: "/audio/fx/click1_topmenu.mp3"
        });
        player.play();
        player = null;
        Ti.App.Properties.setString("storyAudioStatus", "enabled");
        Ti.App.Properties.setString("speechAudioStatus", "enabled");
        $.storyStage.removeAllChildren();
        $.storyViewer.removeEventListener("open", init);
        _story.cleanAudio();
        _story.clean();
        _navigator.clean();
        _story = null;
        _navigator = null;
        $.storyViewer.close();
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "storyViewer";
    if (arguments[0]) {
        __processArg(arguments[0], "__parentSymbol");
        __processArg(arguments[0], "$model");
        __processArg(arguments[0], "__itemTemplate");
    }
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.storyViewer = Ti.UI.createWindow({
        backgroundColor: "#ffffff",
        id: "storyViewer"
    });
    $.__views.storyViewer && $.addTopLevelView($.__views.storyViewer);
    $.__views.storyStage = Ti.UI.createView({
        id: "storyStage"
    });
    $.__views.storyViewer.add($.__views.storyStage);
    $.__views.navBar = Ti.UI.createView({
        height: 110,
        top: 0,
        id: "navBar"
    });
    $.__views.storyViewer.add($.__views.navBar);
    $.__views.menuElements = Ti.UI.createView({
        height: 110,
        top: -160,
        width: 530,
        id: "menuElements"
    });
    $.__views.navBar.add($.__views.menuElements);
    $.__views.speech = Ti.UI.createView({
        left: 7,
        top: 0,
        width: 108,
        height: 95,
        backgroundImage: "/menu/button_speech.png",
        id: "speech"
    });
    $.__views.menuElements.add($.__views.speech);
    toggleSpeech ? $.__views.speech.addEventListener("click", toggleSpeech) : __defers["$.__views.speech!click!toggleSpeech"] = true;
    $.__views.audio = Ti.UI.createView({
        left: 115,
        top: 0,
        width: 98,
        height: 97,
        backgroundImage: "/menu/button_sound.png",
        id: "audio"
    });
    $.__views.menuElements.add($.__views.audio);
    toggleAudio ? $.__views.audio.addEventListener("click", toggleAudio) : __defers["$.__views.audio!click!toggleAudio"] = true;
    $.__views.hints = Ti.UI.createView({
        top: 0,
        left: 318,
        width: 110,
        height: 99,
        backgroundImage: "/menu/button_hints.png",
        id: "hints"
    });
    $.__views.menuElements.add($.__views.hints);
    toggleHints ? $.__views.hints.addEventListener("click", toggleHints) : __defers["$.__views.hints!click!toggleHints"] = true;
    $.__views.home = Ti.UI.createView({
        top: 0,
        left: 419,
        width: 98,
        height: 93,
        backgroundImage: "/menu/bookshelf_navigator_home.png",
        id: "home"
    });
    $.__views.menuElements.add($.__views.home);
    exitStory ? $.__views.home.addEventListener("click", exitStory) : __defers["$.__views.home!click!exitStory"] = true;
    $.__views.back = Ti.UI.createView({
        left: 0,
        top: -200,
        width: 107,
        height: 99,
        backgroundImage: "/menu/button_prev.png",
        id: "back",
        zIndex: "100"
    });
    $.__views.storyViewer.add($.__views.back);
    back ? $.__views.back.addEventListener("click", back) : __defers["$.__views.back!click!back"] = true;
    $.__views.next = Ti.UI.createView({
        right: 0,
        top: 0,
        width: 110,
        height: 100,
        backgroundImage: "/menu/button_next.png",
        id: "next",
        zIndex: "100"
    });
    $.__views.storyViewer.add($.__views.next);
    next ? $.__views.next.addEventListener("click", next) : __defers["$.__views.next!click!next"] = true;
    $.__views.anchor = Ti.UI.createView({
        top: 0,
        width: 109,
        height: 98,
        backgroundImage: "/menu/button_anchor.png",
        id: "anchor",
        zIndex: "100"
    });
    $.__views.storyViewer.add($.__views.anchor);
    toggleMenu ? $.__views.anchor.addEventListener("click", toggleMenu) : __defers["$.__views.anchor!click!toggleMenu"] = true;
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
    _flurryAudioCounter = 0;
    _flurrySpeechCounter = 0;
    _flurryNextCounter = 0;
    _flurryPreviousCounter = 0;
    _flurryNextCounter = 0;
    var args = arguments[0] || {};
    var currentStoryID = args.storyID;
    var Story = require("/common/StoryBuilder");
    var Navigator = require("/common/StoryNavigator");
    var _story;
    var _navigator;
    var buttonActiveFlag = true;
    var globalDelay;
    $.storyViewer.addEventListener("android:back", pageBack);
    $.storyViewer.addEventListener("open", init);
    $.storyViewer.addEventListener("blur", winEvent);
    $.storyViewer.addEventListener("close", winEvent);
    $.storyViewer.addEventListener("focus", winEvent);
    $.storyViewer.addEventListener("open", winEvent);
    var autoHide;
    __defers["$.__views.speech!click!toggleSpeech"] && $.__views.speech.addEventListener("click", toggleSpeech);
    __defers["$.__views.audio!click!toggleAudio"] && $.__views.audio.addEventListener("click", toggleAudio);
    __defers["$.__views.hints!click!toggleHints"] && $.__views.hints.addEventListener("click", toggleHints);
    __defers["$.__views.home!click!exitStory"] && $.__views.home.addEventListener("click", exitStory);
    __defers["$.__views.back!click!back"] && $.__views.back.addEventListener("click", back);
    __defers["$.__views.next!click!next"] && $.__views.next.addEventListener("click", next);
    __defers["$.__views.anchor!click!toggleMenu"] && $.__views.anchor.addEventListener("click", toggleMenu);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;