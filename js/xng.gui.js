/** 
** XNG GUI
The MIT License (MIT)
Copyright (c) 2014-2015 - Pirthous Jakkiria <mdfirthous@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
**/

var GUI = function(){

	UI = this;

	UI.imager 		= new XNG.Images();		
	UI.videoPlayer 	= new XNG.Previewer('video-part');
	UI.trimmer 		= new XNG.Trimmer('play-tool');		
	UI.composer 	= new XNG.Composer();
    UI.reader 		= new XNG.Reader();
    UI.player 		= new Player();	
	UI.download 	= new XNG.Downloader();

	UI.mode 	= 0;
	UI.files 	= [];
    UI.added 	= false; 
    UI.isPlaying = false;
    UI.videoFile;
    UI.xngFiile;
    UI.playButton;
    UI.composing = false;
    UI.videoAdded = false;

    UI.capturedPhotos = [];
    

    this._c = function(name) { return document.getElementsByClassName(name)[0]; }
	this._i = function(id) { return document.getElementById(id); }
	this.init = function(){		
			
		var self = this;
		var stage = this._i('stage');
		stage.addEventListener ("mouseover", function(){ self.showPlay();},false);
		stage.addEventListener ("mouseout", function(){ self.hidePlay(); },false);			
		stage.addEventListener ('dragover', function(e){
			e.stopPropagation();	e.preventDefault();	e.dataTransfer.dropEffect = 'copy';
			UI.modePause();
		}, false);
		stage.addEventListener ('drop', function(e){
			e.stopPropagation(); e.preventDefault();    		
    		switch(UI.mode){
    			case 1 : UI.files = e.dataTransfer.files; UI.imager.addFiles(UI.files);break;
    			case 0 : UI.videoFile = e.dataTransfer.files[0]; UI.openVideo();  break; 
    			case 2 : UI.xngFile = e.dataTransfer.files[0]; UI.openXNG(); break;
    		}  
		}, false);
		UI.playButton = this._i('play-btn');
		UI.playButton.addEventListener('click', UI.playControl, false); 

		UI.makeButton = this._c('setting-ico');
		UI.makeButton.addEventListener('click', UI.exportXNG, false); 

		UI.downloadButton = this._c('download-btn');
		UI.downloadButton.addEventListener('click', UI.downloadFile, false); 

		UI.poper = this._c('pop-blocker');
		UI.poper.addEventListener('click', UI.closePoper, false); 

		this._i('radio1').onclick = function(){ UI.mode = 0; UI.changeMode();}
		this._i('radio2').onclick = function(){ UI.mode = 1; UI.changeMode();}
		this._i('radio3').onclick = function(){ UI.mode = 2; UI.changeMode();} 			

		//this.hideMessage();
	}
	this.init();

	UI.showVideo();
};
GUI.prototype = {
	changeMode : function(){		
		UI.files = [];
		UI.stageReset();		
		switch(UI.mode){
			case 0 : UI.showVideo(); break;
			case 1 : UI.showImager(); break;
			case 2 : UI.showImager(); break;
		}
	}
	,exportXNG : function(){
		UI.composing = true;
		UI._c('download-btn').style.display = 'none';
		switch(UI.mode){
			case 0: UI.convertVideo(); break;
			case 1: UI.convertImages(); break;		
		}
		
	}
	,convertVideo : function(){
		UI.showMessage('Capturing Images...');		
		UI.videoPlayer.capture();
	}
	,doneCapture : function(){		
		UI.capturedPhotos = UI.videoPlayer.getImages();
		UI.showMessage("Composing XNG File...");
		UI.composer.init();
		for(var i=0; i<UI.capturedPhotos.length ; i++){
			UI.composer.addImage(UI.capturedPhotos[i]);
		}	
		UI.showMessage("Your File Ready For Download!");
		UI._c('download-btn').style.display = 'block';
		UI.composing = false;
	}
	,downloadFile : function(){ 
		UI.download.putData(UI.composer.getFileData());
		UI.download.download();
		UI._c('download-btn').style.display = 'none';
		UI.hideMessage();
	}
	,convertImages : function(){
		UI.capturedPhotos = UI.imager.croppedImages();
		UI.showMessage("Composing XNG File...");
		UI.composer.init();
		for(var i=0; i<UI.capturedPhotos.length ; i++){
			UI.composer.addImage(UI.capturedPhotos[i]);
		}	
		UI.showMessage("Your File Ready For Download!");
		UI._c('download-btn').style.display = 'block';
		UI.composing = false;
	}	
	,makeAnim : function(){
		UI.imager.changeCropMode();
		UI.imager.process();		
	}
	,startAnim : function(){
		UI.player.setFrameRate(100);		
		UI.player.setPhotos(UI.imager.croppedImages() );	
		UI._c('setting-ico').style.display = 'block';	
	}
	,openXNG : function(){
		UI.reader.open({'file': UI.xngFile,'callback': UI.playXNG});
	}
	,playXNG: function(){
		UI.player.setPhotos(UI.reader.photos());	
		UI.player.setFrameRate(UI.reader.frameRate());		
	}
	,playControl : function(){
		if(UI.isPlaying) {
			UI.modePause();
			UI.isPlaying = false;
			UI.playButton.setAttribute('class','play-icon');
		} 
		else 
		{
			UI.modePlay();
			UI.isPlaying = true;		
			UI.playButton.setAttribute('class','pause-icon');
		}
	}
	,modePlay : function(){
		switch(UI.mode){
			case 0 : UI.videoPlayer.play(); break;
			case 1 : UI.startAnim();UI.player.play();break;
			case 2 : UI.playXNG(); UI.player.play();break;
		}
	}
	,modePause : function(){
		switch(UI.mode){
			case 0 : UI.videoPlayer.pause(); break;
			case 1 : UI.player.stop();break;	
			case 2 : UI.player.stop();break;		
		}
		UI.playButton.setAttribute('class','play-icon');
	}
	,openVideo : function(){
		var fileURL = URL.createObjectURL(UI.videoFile); 
		UI.videoPlayer.open(fileURL);
	}
	,onVideoLoaded : function(){ 
		UI.trimmer.fixTime(UI.videoPlayer.duration); 
		UI.setPlayerMessage(''); 
		UI.isPlaying =true;
		UI.trimmer.reset();
		UI._c('setting-ico').style.display = 'block';
		UI.videoAdded = true; 
	}	
	,onVideoEnd : function() { UI.playButton.setAttribute('class','replay-icon'); UI.isPlaying =false;}
	,videoPositionChange : function(o){ UI.videoPlayer.crop(o.start,o.endof);} 
	,play : function() {}
	,showVideo : function(){		
		this._i('video-part').style.display = 'block';
		this._c('video-trimmer').style.display = 'block';
		this._c('xng-shadow-txt').innerHTML = 'Drop Your Video Here';	
		if(UI.videoAdded == true) { UI._c('setting-ico').style.display = 'block'; }
		this.hideImager();
		UI.imager.reset();
	}
	,hideVideo : function(){
		this._i('video-part').style.display = 'none';
		this._c('video-trimmer').style.display = 'none';			
	}
	,showImager : function(){		
		var name = 'Images';
		this._i('previewer').style.display = 'block';
		this._c('thumb-roll').style.display = 'block';
		if(UI.mode == 2){ name = 'XNG File'; this._c('thumb-roll').style.display = 'none';}
		this._c('xng-shadow-txt').innerHTML = 'Drop Your '+ name +' Here';
		UI._c('setting-ico').style.display = 'none';
		this.hideVideo();
	}
	,setPlayerMessage : function(message){ this._c('xng-shadow-txt').innerHTML = message;}
	,hideImager : function(){
		this._i('previewer').style.display = 'none';
		this._c('thumb-roll').style.display = 'none';
	}
	,showMessage : function(message){
		this._c('pop-blocker').style.display = 'block';
		this._c('msg-box').style.display = 'block';
		this._c('msg-text').innerHTML = message;
	}
	,hideMessage : function(){ this._c('pop-blocker').style.display = 'none';this._c('msg-box').style.display = 'none';	}
	,showPlay : function(){ UI.playButton.style.display = 'block';}
	,hidePlay : function(){ UI.playButton.style.display = 'none';}
	,stageReset : function() { 
		var stage = this._i('stage');
		stage.style.width = 640+'px';
		stage.style.height = 360+'px';
	}
	,hideProgressBar : function(){ this._c('progressor').style.display = 'none'; }
	,showProgress : function() { this._c('progressor').style.display = 'block'; }
	,setProgress : function(value) { this._c('progressor').style.width = value +'%';}
	,closePoper : function(){ if(UI.composing == false) {UI.hideMessage();} }
}