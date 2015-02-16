/** 
** XNG Video Trimmer Control
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

XNG.Trimmer = (function(){	

	var _t = function(el,opts){
		var element = this._i(el);
		var options = opts;
		var mouseDown = false;	
		var target  = 'track';	
		var position = 0;
		var duration = 0;
		var ev = new Event('positioned');
		var container = document.createElement("div");
		container.className += 'video-trimmer';
		container.innerHTML = this.objectString();
		element.appendChild(container);
		this.getName = function(classname){ return this._c(classname);}
		this._c = function(classname){ return container.getElementsByClassName(classname)[0]; } 
		this.setMouseDown = function(t) {mouseDown = t;}
		this.isMouseDown = function() { return mouseDown; }
		this.setTarget = function(t) { target = t;}
		this.getTarget = function() { return target; }
		this.setPosition = function(p) { position = p; }
		this.getPosition = function() { return position; }
		this.setDuration = function(d) { duration = d; }
		this.getDuration = function() { return duration; }
		this.elmLeft = function(){ return element.parentElement.offsetLeft;}
		this.refresh = function() { position:0; }		
		this.init();
	};

	_t.prototype = {
		_i  : function(id){ return document.getElementById(id); }		
		,objectString : function(){
			var str = '<span class="trim-min noselect">--:--</span>';
			str += '<span class="trim-track">';
			str += '<span class="play-area"></span></span>';
			str += '<span class="trim-left"></span><span class="trim-right"></span>';
			str += '<span class="trim-max noselect">--:--</span>';
			return str;     
		}
		,setMinTime : function(time){ this._c('trim-min').innerHTML= time;}
		,setMaxTime : function(time){ this._c('trim-max').innerHTML= time;}
		,init : function(){
			var tl =  this._c('trim-left');
			var tr =  this._c('trim-right');
			var tk =  this._c('play-area');
			
			var self = this;
			tl.onmousedown = function(e){				
				self.setTarget(e.srcElement.className);
				self.setMouseDown(true);
			}
			tr.onmousedown = function(e){
				self.setTarget(e.srcElement.className);
				self.setMouseDown(true);
			}
			tk.onmousedown = function(e){
				var mouseX = e.pageX				
				self.setPosition(mouseX);
				self.setMouseDown(true);
			}
			document.onmouseup = function(e){
				self.setMouseDown(false);						
			}
    		document.onmousemove = function(e){
    			var target = self.getTarget();
    			var mouseX = event.pageX - self.elmLeft();      						
				if(self.isMouseDown()) { self.fixPosition(target,mouseX);}
    		}
		}
		,fixPosition : function(name,x){
			var obj = this._c(name);							
			var cleft = (x-8); 						
			var rightmax = this.getTrimPosition().right-15;
			var leftmax = this.getTrimPosition().left+15;
			var rmax =	this.trackMax();				
			this.setMinTime(obj.offsetLeft);			
			switch(name){
				case 'trim-left' : if(cleft >= 50 && cleft <= rightmax){obj.style.left = cleft+'px';}break;
				case 'trim-right': if(cleft >= leftmax && cleft <= rmax){obj.style.left = cleft+'px';}break;
			}
			this.fixPlayTrack();
			this.fixTimeInfo();
			UI.videoPositionChange(this.videoPositions());
		}
		,reset : function(){
			var rightmax = this.getTrimPosition().right-15;		
			this._c('trim-left').style.left = 50 + 'px';
			this._c('trim-right').style.left = 575 + 'px';
			this.fixPlayTrack();
		}
		,fixPlayTrack : function(){
			var l = this._c('trim-left').offsetLeft-50;
			var r = this._c('trim-right').offsetLeft-65;
			var w = r-l;			
			var t = this._c('play-area');
			t.style.left = l+'px';
			t.style.width = w+'px';
		}
		,trackMax : function(){
			var track = this._c('trim-track');
			return track.offsetWidth+65;
		}
		,getObjPosition : function(obj){ 
			var track = this._c(obj);
			return track.offsetLeft;
		}
		,getTrimPosition : function(){
			var l = this.getObjPosition('trim-left');
			var r = this.getObjPosition('trim-right');
			return ({'left': l,'right':r});
		}
		,seekPosition : function(){

		}
		,fixTimeInfo : function(){
			var t = this.videoPositions();
			this.setMaxTime(this.timeString(this.secondsToTime(t.endof)));
			this.setMinTime(this.timeString(this.secondsToTime(t.start)));
		}
		,timeString : function(t){ return t.h+':'+t.m+":"+t.s; }
		,fixTime : function(secs){
			var m = this.secondsToTime(secs);
			this.setDuration(secs);
			this.setMaxTime(m.h+':'+m.m+":"+m.s);
		}
		,videoPositions : function(){
			var d = this.getDuration();
			var p = this.getTrimPosition();
			var size = 525;
			var b = (p.left - 50);
			var e = (p.right - 50);			
			var bper = parseInt((100/size) * b);
			var eper = parseInt((100/size) * e);
			var start = parseInt((d/100) * bper);
			var end = parseInt((d/100) * eper);
			return ({"start" : start,"endof":end});
		}
		,secondsToTime : function(secs){
		    var hours = Math.floor(secs / (60 * 60));
		   
		    var divisor_for_minutes = secs % (60 * 60);
		    var minutes = Math.floor(divisor_for_minutes / 60);
		 
		    var divisor_for_seconds = divisor_for_minutes % 60;
		    var seconds = Math.ceil(divisor_for_seconds);
		   
		    var obj = {"h": hours, "m": minutes, "s": seconds  };
		    return obj;
		}

	}


	return _t;
})();
