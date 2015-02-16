/** 
** XNG Previewer
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

XNG.Previewer = (function(){

	var _t = function(el,onloaded){
		var photos = [];		
		var count = 0;			
		this.width = 640;
		this.height = 360;		
		this.jump = false;
		this.timeend = 0;
		this.timebegin = 0;
		this.duration = 0;
		this.replay = 0;
		this.skipmax = 2;
		this.skip = 0
		this.jump = false;
		this.capturing = 0;

		this.element = document.getElementById(el);
		this.init = function(){
			this.video = document.createElement("video");
			this.canvas =  document.createElement("canvas");
			this.ctx = this.canvas.getContext("2d");			
			this.video.style.width = this.width +'px';
			this.element.appendChild(this.video);

			var self = this;
			this.video.addEventListener("loadedmetadata", function() {				
				self.element.style.height = self.video.offsetHeight +'px';		        		        
		        self.duration = self.video.duration;	
		        self.timebegin = 0;
		        self.timeend = self.video.duration;
		        self.width = self.video.videoWidth/2;
		        self.height = self.video.videoHeight/2;

		        self.video.play(); 
		        UI.onVideoLoaded();       
		    }, false);

		    this.video.addEventListener("timeupdate", function() {			      
		      	if (self.video.currentTime >= self.timeend || self.video.ended) {
		        	self.video.pause();
		        	if(self.capturing == 1){
		        		UI.doneCapture();
		        	}else{
		        		self.replay = 1;
		        		UI.onVideoEnd();
		        	}		        	
		      	}
		      	if(self.capturing){ self.compute();}
		    }, false);

		    this.video.addEventListener("play", function() {
		    	if(self.capturing){self.loop();}
		    });				    
		}
		this.loop = function(){		   
		    var self = this;		    
		    this.compute();
		    setTimeout(function () { self.loop();  }, 0);
		}
		this.openFile = function(filename) { this.video.setAttribute("src", filename); this.capturing=0; }
		this.startPlay = function(){ if(this.replay == 1){ this.video.currentTime = this.timebegin; this.replay =0; } this.video.play(); }
		this.doPause = function(){ if (this.video.paused == false) {this.video.pause();} }
		this.setPosition = function(time){ this.video.currentTime = time;}
		this.setBeginEnd = function(t1,t2) { this.timeend = t2; if(this.timebegin != t1) {this.timebegin = t1;this.resetFrame();}}		
		this.resetFrame = function(){this.video.currentTime = parseInt(this.timebegin); photos = []; }
		this.getDuration = function(){ return this.duration;}		
		this.compute = function(){
			//if(this.skip>this.skipmax){this.jump = !this.jump; this.skip=1;}
			//if(this.jump){ this.ctx.drawImage(this.video,0,0,this.width,this.height); }
			//is.skip++;
			this.ctx.drawImage(this.video,0,0,this.width, this.height);
    		photos.push(this.canvas.toDataURL());    		
		}
		this.doCapture = function(){
			this.capturing = 1;
			this.replay = 1;
			this.startPlay();
		}
		this.getImages = function(){ return photos;}

		this.init();		
	};
	_t.prototype = {
		play 	: function(){	this.startPlay();	}
		,pause 	: function(){ this.doPause();}
		,open 	: function(filename){ this.openFile(filename);}
		,seek 	: function(time){ this.setPosition(time);}
		,crop 	: function(t1,t2) { this.setBeginEnd(t1,t2);}
		,time 	: function(){ return this.getDuration();}		
		,capture: function(){ this.doCapture();}
		,images : function() { return this.getImages();}
	};
  	
  	return _t;
})();