function CreateFontDictionary(){
}

CreateFontDictionary.prototype.init = function() {
	
		if(Ti.Platform.osname=='android') {
			// ANDROID FONT LIST
			// on Android, use the "base name" of the file (name without extension)
			Alloy.Globals._font_oldenburg =  'Oldenburg-Regular';
			Alloy.Globals._font_snowburst = "SnowburstOne-Regular";
			Alloy.Globals._font_serapion_bold = "serapionosfbold";
			Alloy.Globals._font_serapionPro = "SerapionPro";
			Alloy.Globals._font_sacramento  = "Sacramento-Regular";
			Alloy.Globals._font_ralewayDots  =  "RalewayDots-Regular";
			Alloy.Globals._font_quando  = "Quando-Regular";
			Alloy.Globals._font_mclaren  = "McLaren-Regular";
			Alloy.Globals._font_inika  = "Inika-Regular";
			Alloy.Globals._font_glassAntiqua  = "GlassAntiqua-Regular";
			Alloy.Globals._font_exo2  = "Exo2-Regular";		
			Alloy.Globals._font_didactGothic  = "DidactGothic";
			Alloy.Globals._font_alegreyaSansSC  = "AlegreyaSansSC-Regular";
			Alloy.Globals._font_alegreyaSans  = "AlegreyaSans-Regular";		

		}else{
			/// IOS FONT LISTS
			// on iOS use the font friendly-name
			Alloy.Globals._font_oldenburg = 'Oldenburg';
			Alloy.Globals._font_snowburst = "Snowburst One";
			Alloy.Globals._font_serapion_bold = "SerapionOsf";
			Alloy.Globals._font_serapionPro = "Serapion Pro";
			Alloy.Globals._font_sacramento  = "Sacramento";
			Alloy.Globals._font_ralewayDots  =  "Raleway Dots";
			Alloy.Globals._font_quando  = "Quando";
			Alloy.Globals._font_mclaren  = "McLaren";
			Alloy.Globals._font_inika  = "Inika";
			Alloy.Globals._font_glassAntiqua  = "Glass Antiqua";
			Alloy.Globals._font_exo2  = "Exo 2";
			Alloy.Globals._font_didactGothic  = "Didact Gothic";
			Alloy.Globals._font_alegreyaSansSC  = "Alegreya Sans SC";
			Alloy.Globals._font_alegreyaSans  = "Alegreya Sans";	

		}


};



module.exports = CreateFontDictionary;