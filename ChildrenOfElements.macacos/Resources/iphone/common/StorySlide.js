function StorySlide(_slideData, _storyID, _mediaManager, _speechManager, _fxManager, _touchSound) {
    this.touchSound = _touchSound;
    this.animatedItems = [];
    this.storyID = _storyID;
    this.mediaManager = _mediaManager;
    this.speechManager = _speechManager;
    this.fxManager = _fxManager;
    this.mainView = Ti.UI.createView({
        opacity: 0
    });
    this.slideData = _slideData;
    this.buildElements();
    this.mainView.anima = this.animatedItems;
    this.mainView.remover = this.clean;
    this.mainView.imageCount = 0;
    this._hasAudioFX = false;
}

var Transition = require("/common/ItemTransition");

StorySlide.prototype.storyID;

StorySlide.prototype.mainView;

StorySlide.prototype.animatedItems;

StorySlide.prototype.mediaManager;

StorySlide.prototype.speechManager;

StorySlide.prototype.fxManager;

StorySlide.prototype._hasAudio;

StorySlide.prototype._hasSpeech;

StorySlide.prototype._hasAudioFX;

StorySlide.prototype._hintScreen;

StorySlide.prototype.transition;

StorySlide.prototype.getSlide = function() {
    return this.mainView;
};

StorySlide.prototype.buildElements = function() {
    this.slideData.stageElements || this.errorDetect("stage elements not found");
    _itemsLength = this.slideData.stageElements.length;
    for (var i = 0; _itemsLength > i; i++) {
        var element = this.createSingleElement(this.slideData.stageElements[i], _itemsLength);
        element.zIndex = i;
        this.mainView.add(element);
    }
    this._hasAudioFX && this.fxManager.setFX(this.storyID);
};

StorySlide.prototype.createSingleElement = function(_targetElement, _totalCount) {
    _targetElement.type || this.errorDetect("target type not found");
    var currentElement;
    if (_targetElement.animation && _targetElement.animation.rotateAxis) {
        var axis = this.setAxis(_targetElement.animation.rotateAxis);
        _targetElement.properties.anchorPoint = axis;
        _targetElement.animation.anchorPoint = axis;
    }
    switch (_targetElement.type) {
      case "image":
        currentElement = this.createSlideImage(_targetElement);
        if (_targetElement.properties.soundFx) {
            currentElement.audioFx = _targetElement.properties.soundFx;
            currentElement.fxManager = this.fxManager;
            this._hasAudioFX = true;
        }
        break;

      case "transition":
        currentElement = this.createTransition(_targetElement);
        if (_targetElement.properties.soundFx) {
            currentElement.audioFx = _targetElement.properties.soundFx;
            currentElement.fxManager = this.fxManager;
            this._hasAudioFX = true;
        }
        break;

      case "text":
        currentElement = this.createTextField(_targetElement);
        if (_targetElement.properties.soundFx) {
            currentElement.audioFx = _targetElement.properties.soundFx;
            currentElement.fxManager = this.fxManager;
            this._hasAudioFX = true;
        }
        break;

      case "audio":
        this._hasAudio = "yes";
        currentElement = this.createSlideAudio(_targetElement);
        break;

      case "speech":
        this._hasSpeech = "yes";
        currentElement = this.createSlideSpeech(_targetElement);
        break;

      case "hint":
        this._hasHints = "yes";
        currentElement = this.createSlideHint(_targetElement);
        currentElement.visible = false;
        break;

      default:
        Ti.API.info("create single element, type not found");
    }
    currentElement.itemCount = _totalCount;
    if (_targetElement.animation) {
        var itemAnimation = this.animations(_targetElement.animation);
        currentElement._innerAnimation = itemAnimation;
        this.animatedItems.push(currentElement);
    }
    switch (_targetElement.interaction) {
      case "drag":
        break;

      case "click":
        currentElement.clickableItem = "enable";
        currentElement.activeFlag = true;
        currentElement.touchEnabled = true;
        currentElement.addEventListener("click", function(e) {
            function enableButton() {
                e.source.activeFlag = true;
                clearTimeout(waitForIt);
            }
            function enableButton() {
                e.source.activeFlag = true;
                clearTimeout(waitForIt);
            }
            if (e.source.activeFlag) {
                if (e.source._innerAnimation && !e.source.transitionPlayer) {
                    e.source.activeFlag = false;
                    var clipAnimation = Titanium.UI.createAnimation(e.source._innerAnimation);
                    clipAnimation._parent = e.source;
                    e.source.animate(clipAnimation);
                    clipAnimation.addEventListener("complete", function(e) {
                        e.source._parent.activeFlag = true;
                    });
                } else if (e.source.transitionPlayer) {
                    if (e.source._innerAnimation) {
                        var clipAnimation = Titanium.UI.createAnimation(e.source._innerAnimation);
                        e.source.animate(clipAnimation);
                    }
                    var delay = e.source.transitionPlayer.getClickDelayTime();
                    if (e.source._innerAnimation) {
                        var delayInteraction;
                        if (e.source._innerAnimation.repeat) {
                            delayInteraction = e.source._innerAnimation.duration * e.source._innerAnimation.repeat;
                            e.source._innerAnimation.autoreverse && (delayInteraction = 2.1 * delayInteraction);
                        }
                        Ti.API.info(delayInteraction + "<inter === delay> " + delay);
                        delayInteraction > delay && (delay = delayInteraction);
                    }
                    var waitForIt = setTimeout(enableButton, delay);
                } else var waitForIt = setTimeout(enableButton, 1500);
                e.source.transitionPlayer && e.source.transitionPlayer.start();
                e.source.soundFx && e.source.fxManager.playFX(e.source.soundFx);
                e.source.activeFlag = false;
            }
        });
        break;

      default:    }
    return currentElement;
};

StorySlide.prototype.createTransition = function(_targetInfo) {
    this.transition = new Transition(_targetInfo, this.storyID);
    var result = this.transition.getContainer();
    result.transitionPlayer = this.transition;
    return result;
};

StorySlide.prototype.createTextField = function(_targetInfo) {
    slideText = "es" == Alloy.Globals.userLanguage ? _targetInfo.properties.text_es : _targetInfo.properties.text_en;
    _targetInfo.properties.text = slideText;
    var textFont = this.fontTranslator(_targetInfo.properties.fontFamily);
    var labelfont = {
        fontSize: _targetInfo.properties.fontSize + "sp",
        fontFamily: textFont
    };
    _targetInfo.properties.font = labelfont;
    var textItem = Ti.UI.createLabel(_targetInfo.properties);
    textItem.touchEnabled = false;
    return textItem;
};

StorySlide.prototype.createSlideAudio = function(_targetInfo) {
    this.mediaManager.setAudio(_targetInfo, this.storyID);
    this.mainView.slideAudio = this.mediaManager;
    var viewPlaceHolder = Ti.UI.createView({
        width: 1,
        height: 1,
        top: -10,
        left: 0,
        visible: 0,
        touchEnabled: false
    });
    return viewPlaceHolder;
};

StorySlide.prototype.createSlideSpeech = function(_targetInfo) {
    this.speechManager.setAudio(_targetInfo, this.storyID);
    this.mainView.slideSpeech = this.speechManager;
    var viewPlaceHolder = Ti.UI.createView({
        width: 1,
        height: 1,
        top: -10,
        left: 0,
        visible: 0,
        touchEnabled: false
    });
    return viewPlaceHolder;
};

StorySlide.prototype.createSlideImage = function(_targetInfo) {
    var imageResult = Ti.UI.createImageView(_targetInfo.properties);
    imageResult.image = Titanium.Filesystem.applicationCacheDirectory + this.storyID + "/" + _targetInfo.properties.image;
    imageResult.touchEnabled = false;
    return imageResult;
};

StorySlide.prototype.createSlideHint = function(_targetInfo) {
    var imageResult = Ti.UI.createImageView({
        width: "100%",
        height: "100%",
        top: 0
    });
    imageResult.image = Titanium.Filesystem.applicationCacheDirectory + this.storyID + "/" + _targetInfo.properties.image;
    imageResult.touchEnabled = false;
    this._hintScreen = imageResult;
    return imageResult;
};

StorySlide.prototype.animations = function(_animData) {
    var matrix = Ti.UI.create2DMatrix();
    _animData.rotateAxis && (_animData.anchorPoint = this.setAxis(_animData.rotateAxis));
    _animData.rotate && (matrix = matrix.rotate(_animData.rotate));
    _animData.scale && (matrix = matrix.scale(_animData.scale.x, _animData.scale.y));
    _animData.transform = matrix;
    _animData.rotateAxis;
    Ti.UI.createAnimation(_animData);
    return _animData;
};

StorySlide.prototype.animateSlide = function() {
    if (this.mainView.anima) for (var i = 0; this.mainView.anima.length > i; i++) {
        var element = this.mainView.anima[i];
        if (!element.clickableItem) {
            var elementAnimation = Ti.UI.createAnimation(element._innerAnimation);
            element.animate(elementAnimation);
            elementAnimation = null;
        }
    }
};

StorySlide.prototype.slideLoaded = function() {
    function animationComplete(e) {
        if (e.source.parentView.children.length > 1) {
            var oldSlide = e.source.parentView.children[0];
            oldSlide.speech && oldSlide.speech.stopSpeech();
            if (oldSlide.slideAudio) {
                oldSlide.slideAudio.stopAudio();
                oldSlide.slideAudio = null;
            }
            if (oldSlide.slideSpeech) {
                oldSlide.slideSpeech.stopAudio();
                oldSlide.slideSpeech = null;
            }
            oldSlide.remover();
            e.source.parentView.remove(e.source.parentView.children[0]);
        }
        e.source.parentView.children[0].slideSpeech && "enabled" == Ti.App.Properties.getString("speechAudioStatus") && e.source.parentView.children[0].slideSpeech.playAudio();
        e.source.parentView.children[0].slideAudio && "enabled" == Ti.App.Properties.getString("storyAudioStatus") && e.source.parentView.children[0].slideAudio.playAudio();
        e.source.removeEventListener("complete", animationComplete);
        e.source.parentView = null;
    }
    function animar() {
        _this.animateSlide();
    }
    var animation = Titanium.UI.createAnimation({
        opacity: 1,
        duration: 600
    });
    this.mainView.animate(animation);
    animation.parentView = this.mainView.parentView;
    animation.addEventListener("complete", animationComplete);
    setTimeout(animar, 800);
    var _this = this;
};

StorySlide.prototype.setAxis = function(_axis) {
    var point;
    switch (_axis) {
      case "topCenter":
        point = {
            x: .5,
            y: 0
        };
        break;

      case "topLeft":
        point = {
            x: 0,
            y: 0
        };
        break;

      case "topRight":
        point = {
            x: 1,
            y: 0
        };
        break;

      case "center":
        point = {
            x: .5,
            y: .5
        };
        break;

      case "bottomLeft":
        point = {
            x: 0,
            y: 1
        };
        break;

      case "bottomRight":
        point = {
            x: 1,
            y: 1
        };
        break;

      case "bottomCenter":
        point = {
            x: .5,
            y: 1
        };
        break;

      default:
        this.errorDetect("no valid axis value");
    }
    return point;
};

StorySlide.prototype.errorDetect = function() {};

StorySlide.prototype.stopSpeech = function() {
    this.mainView.speech && this.mainView.speech.pauseSpeech();
};

StorySlide.prototype.pauseSpeech = function() {
    this.mainView.speech && this.mainView.speech.pauseSpeech();
};

StorySlide.prototype.hasAudio = function() {
    return "yes" == this._hasAudio ? true : false;
};

StorySlide.prototype.hasSpeech = function() {
    return "yes" == this._hasSpeech ? true : false;
};

StorySlide.prototype.hasHints = function() {
    return "yes" == this._hasHints ? true : false;
};

StorySlide.prototype.showHint = function() {
    this._hintScreen.visible = true;
    this._hintScreen.zIndex = 100;
};

StorySlide.prototype.hideHint = function() {
    this._hintScreen.visible = false;
};

StorySlide.prototype.clean = function() {
    if (this.mainView) {
        this.mainView.removeAllChildren();
        this.mainView.slideAudio && this.mainView.slideAudio.stopAudio();
        this.mainView.slideSpeech && this.mainView.slideSpeech.stopAudio();
    }
    this.transition && this.transition.clean();
    this.storyID = null;
    this.mainView = null;
    this.animatedItems = null;
    this.transition = null;
};

StorySlide.prototype.fontTranslator = function(_font) {
    var resultFont;
    switch (_font) {
      case "oldenburg":
        resultFont = Alloy.Globals._font_oldenburg;
        break;

      case "snowburst":
        resultFont = Alloy.Globals._font_snowburst;
        break;

      case "serapionpro":
        resultFont = Alloy.Globals._font_serapionPro;
        break;

      case "serapionosf":
        resultFont = Alloy.Globals._font_serapion_bold;
        break;

      case "sacramento":
        resultFont = Alloy.Globals._font_sacramento;
        break;

      case "raleway":
        resultFont = Alloy.Globals._font_ralewayDots;
        break;

      case "quando":
        resultFont = Alloy.Globals._font_quando;
        break;

      case "mclaren":
        resultFont = Alloy.Globals._font_mclaren;
        break;

      case "inika":
        resultFont = Alloy.Globals._font_inika;
        break;

      case "glassantiqua":
        resultFont = Alloy.Globals._font_glassAntiqua;
        break;

      case "exo2":
        resultFont = Alloy.Globals._font_exo2;
        break;

      case "didactgothic":
        resultFont = Alloy.Globals._font_didactGothic;
        break;

      case "alegreyasanssc":
        resultFont = Alloy.Globals._font_alegreyaSansSC;
        break;

      case "alegreyasans":
        resultFont = Alloy.Globals._font_alegreyaSans;
        break;

      default:
        resultFont = Alloy.Globals._font_oldenburg;
    }
    return resultFont;
};

module.exports = StorySlide;