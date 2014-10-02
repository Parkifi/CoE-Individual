function AboutScreen(){

	this.localScreen = Ti.UI.createWindow();
	var imagenlocal = Ti.UI.createImageView({image:"/about/aboutScreen.png", width:"100%", height:"100%", opacity:1});
		

		this.localScreen.add( imagenlocal );



	return this.localScreen;

}

AboutScreen.prototype.localScreen;

AboutScreen.prototype.displayAbout = function() {
	
	

/*
		imagenlocal._targetClip = this.localScreen

		
		imagenlocal.animate( { opacity: 1, delay:500}, 1000);

		imagenlocal.addEventListener('click',function(e){

		})
*/
};


module.exports = AboutScreen;