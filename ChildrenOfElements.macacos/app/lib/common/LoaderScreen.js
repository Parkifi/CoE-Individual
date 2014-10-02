function LoaderScreen(){
}

LoaderScreen.prototype.getLoader = function(){

	/// create the container
			var loadingScreen = Ti.UI.createView({
				zIndex:100,
				backgroundColor:"#77ffffff",
				width:"100%",
				height:"100%", 
				top:0,
				visible:false,
				left:0
			});

			/// create the progress
			var imageIcon = Ti.UI.createImageView({
				width: 140,
				height:140,
				image: "/loadingScreen/circle.png",
			});

			var iconContainer = Ti.UI.createView({
				width: 140,
				height:140,
				//top: 303,
				top: 503,
				left: 0,
				zIndex:10
			});

			iconContainer.add(imageIcon);

			var loadBar = Ti.UI.createImageView({
				width:925,
				height:700,
				//height:132,
				top:50,
				//top:406,
				//left:13,
				image: "/loadingScreen/loadbar.png"
			});

			var bothContainer = Ti.UI.createView({
				width:938,
				
			});



			var matrix = Ti.UI.create2DMatrix();
			
			if(Ti.Platform.osname == "android"){
				matrix = matrix.rotate(359);
			}else{
				matrix = matrix.rotate(180);

			}


			var animation = Titanium.UI.createAnimation({
				transform:matrix,
				repeat: 1000,
				curve: Ti.UI.ANIMATION_CURVE_EASE_IN_OUT,
				duration: 4000
			});

			if(Ti.Platform.osname == "ipad"){
				animation.autoreverse =  true;
			}


			imageIcon.animate( animation );

			



			//loadingScreen.add(loadBar);
			//loadingScreen.add(imageIcon);
			bothContainer.add(loadBar);
			bothContainer.add(iconContainer); //imageIcon);

			loadingScreen.add(bothContainer);

			imageIcon.animate( animation );
			

			return loadingScreen;


};



module.exports = LoaderScreen;