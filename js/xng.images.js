/** 
** XNG Images 
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

XNG.Images = (function(){	

	var _t = function(){
		var w = 640;
		var h = 360;
		var files = [];
		var frames = [];
		var mode = 1; // 1- make thump, 0- crop images
		var self = this;
		var count = 0;	
		var index = 1;	
		
		this.getFiles = function() { return files;}
		this.putFiles = function(fileList) { files = fileList; count = files.length; mode =1; index =1; }
		this.setDimension = function(w,h){ w = w; h = h;}
		this.getDimension = function() { return ({'w': w, 'h':h}); }
		this.setMode = function(m){ mode = m; if(m == 0){ frames = [];}}
		this.getMode = function() { return mode;}
		this.addframe = function(dataURI){ 
			frames.push(dataURI); 
			var p = parseInt((100/count) * frames.length);
			UI.showProgress();
			UI.setProgress(p);
			UI.showMessage('Cropping Images ...');
			if(p>=100) { UI.hideMessage(); UI.hideProgressBar();}
			if(count >= frames.length){ UI.startAnim();} 
		}
		this.clearframes = function(){ frames = []; }
		this.getFrames = function() { return frames; }	
		this.reset = function(){ files=[]; frames = []; mode = 1; count = 0; this.clearThumps(); }	
		this.makeIndex = function(){ 
			index++; 
			var p = parseInt((100/count) * index);
			UI.showProgress();
			UI.setProgress(p);
			UI.showMessage('Loading ...');
			if(count<= index){ UI.makeAnim();} }
		this.getIndex = function(){ return index; }		
	};

	_t.prototype = {		
		addFiles : function(files) { this.reset(); this.putFiles(files); this.process(); }
		,reset : function(){ this.reset();  }
		,resetDimension : function(w,h) { this.setDimension(w,h); }
		,changeCropMode : function(){ this.setMode(0); }
		,changeThumpMode : function() { this.setMode(1); }
		,croppedImages : function() { return this.getFrames(); }
		,process : function(){
			var files = this.getFiles();
			var output = [];
			var self = this;
			//UI.showMessage();
			for (var i = 0, f; f = files[i]; i++) {
		      
			    if (!f.type.match('image.*')) { continue; }

			    var reader = new FileReader();

			    reader.onload = (function(theFile) {
			        return function(e) {
			        	var uri = e.target.result;
			        	if(self.getMode() == 1){ self.makeThump(uri,theFile.name); } else { self.cropImages(uri); }			        	
			        }        	        
			    })(f);
			      
			    reader.readAsDataURL(f);
			}
		}
		,makeThump : function(uri,filename){
			var index = this.getIndex();
			var troll = document.getElementById('thumb-roller');
			troll.style.width = (index * 110) + 'px';
			var span = document.createElement('span');
	        span.style.backgroundImage = "url('" + uri + "')";
	        span.setAttribute('title', escape(filename));
	        span.innerHTML ='<b class="thumb-inx">'+index+'</b>"';	          
	        document.getElementById('thumb-roller').appendChild(span);
	        this.makeIndex();	        
		}
		,clearThumps : function(){
			document.getElementById('thumb-roller').innerHTML = '';
		}
		,cropImages : function(uri){
			var canvas = document.createElement('canvas'); 
			var context = canvas.getContext("2d");
  			canvas.width = 640;
  			canvas.height = 360;  			
		    var imageObj = new Image();
		    var self = this;
		    imageObj.onload = function () {
		    	var sourceX = 0;
		        var sourceY = 0;
		        var sourceWidth = imageObj.width;//400; // crop size width
		        var sourceHeight = imageObj.height;//200; // crop size height
		        var destWidth = sourceWidth;
		        var destHeight = sourceHeight;
		        var destX = canvas.width / 2 - destWidth / 2;
		        var destY = canvas.height / 2 - destHeight / 2;

		        //context.drawImage(imageObj, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
		        context.drawImage(imageObj,destX,destY);	               
		        dataURI = canvas.toDataURL();	
		        self.addframe(dataURI);		        
		    };
		    imageObj.crossOrigin = "anonymous";
		    imageObj.src = uri;
		}
	}


	return _t;
})();
	