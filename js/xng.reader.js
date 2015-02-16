/** 
** XNG Reader 
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

XNG.Reader = (function(){	

	var _t = function(){	
		var count = 0;
		var w, h = 0;
		var photos = [];		
		var callback,file = null;
		var _w = 0;
		var _h = 0;		
		var framerate = 33;

		this.init 			= function(params) { 
			photos = [];	
			count = 0;	
			file = params.file;	
			callback = params.callback; 
			this.readFile(file); 
		}
		this.getCount 		= function() { return count;}
		this.addPhoto 		= function(photo) { photos[count] = photo;	count++; }
		this.getPhotos 		= function() { return photos; }		
		this.fireCallBack 	= function() { callback(); }
		this.setWidth 		= function(w){ _w = w; }
		this.setHeight		= function(h){ _h = h; }
		this.getWidth 		= function() { return _w; }
		this.getHeight 		= function() { return _h; }
		this.setFrameRate 	= function(rate) { framerate = parseInt(rate.slice(0,-2));}
		this.getFrameRate 	= function() { return framerate; }		
	}	

	_t.prototype = {  
		open : function(params){
			this.init(params);
		}
		,frameRate : function() { return this.getFrameRate(); }
		,photos : function() { return this.getPhotos(); }
		,readFile : function(file)
		{
			var r = new FileReader();
	  		var f = file;
	  		var o = this;	  		
	  		r.onload = (function(f) {
	  			return function(e) {
	  				var contents = e.target.result;
	  				var parser=new DOMParser();
	  				var xmlDoc=parser.parseFromString(contents,"text/xml");    				
	  				o.pickImages(xmlDoc);  				
	  			};	
	  		})(f);
	  		r.readAsText(f,"UTF-8");
		}		 			  	 	
	  	,pickImages : function(xml)
	  	{  		
	  		var svg = xml.getElementsByTagName("svg")[0];  	
	  		var _w = svg.getAttribute("width"); 
	  		var _h = svg.getAttribute("height"); 
	  		var setpicked = false;
	  		this.setWidth(_w);this.setHeight(_h);
	  		
	  		var length = svg.childNodes.length;
	  		var name = null;  		
	  		for(var i=0; i<length ; i++){
	  			name = svg.childNodes[i].nodeName; 	  				
	  			if(name == 'image'){	  				
	  				this.addPhoto(svg.childNodes[i].getAttribute("A:href"));  
	  			}
	  			else if(name == 'set' && setpicked == false){
	  				var rate = svg.childNodes[i].getAttribute("dur")
	  				this.setFrameRate(rate);
	  				setpicked = true;
	  				this.fireCallBack();return;
	  			}	  			  			
	  		}	  		  		
  		}
  	}; 	

  	
  	return _t;
})();