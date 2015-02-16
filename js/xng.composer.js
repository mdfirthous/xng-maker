/** 
** XNG Composer ** 
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

XNG.Composer = (function(){

	var _t = function(){
		var fileString = '';
		var setTags = '';
		var count = 0;
		var frameRate = 100;
		this.addImage = function(data){ 
			var inx = count + 1;
			fileString += this.makeImageTag(inx,data); 
			if(count > 0) {setTags += this.makeSetTag(inx,frameRate);}			
			count++;
		}
		this.getCount = function() {return count;}		
		this.getFarmeRate = function() { return frameRate;}
		this.getFileData = function(){ 
			var str = this.compose(fileString,setTags,count);
			return str; 
		}
		this.init = function(){fileString = ''; count = 0; setTags = '';}

	};

	_t.prototype = {
		makeImageTag : function(inx, data){			
			var id = this.pad(inx);
			var str = "<image id ='"+id+"' height='100%' ";
			str += "A:href = '"+data+"' />";
			return str;
		}
		,getTopTag : function(w,h){
			var _h = h;
			var _w = w;
			var str = "<svg xmlns='http://www.w3.org/2000/svg' ";
			str += "xmlns:A='http://www.w3.org/1999/xlink' width='"+_w +"' height='"+_h+"'>";
			return str;			
		}
		,makeSetTag : function(id,dur){
			var ref = "#"+this.pad(id);
			var sid = "A"+this.pad(id);
			var bgn = "A"+this.pad(id-1);
			return "<set A:href='"+ref+"' id='"+sid+"' attributeName='width' to='100%' dur='"+dur+"ms' begin='"+bgn+".end'/>";
		}
		,compose : function(filetags,settags,count){
			var dur = this.getFarmeRate();
			var str = this.getTopTag(640,360);
			var fid = "A"+this.pad(count);
			str += filetags;
			str += "<set A:href='#000001' id='A000001' attributeName='width' to='100%' dur='"+dur+"ms' begin='"+fid+".end; 0s'/>";
			str += settags;
			str += "</svg>";
			return str;
		}

		,pad : function(str){ var str = str.toString(); return str.length < 6 ? this.pad("0" + str, 5) : str;}		
	}


    return _t;
})();