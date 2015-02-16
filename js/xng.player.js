/** 
** XNG Photo Player
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
var Player = function(){
  P = this;
  P.isPlaying = false;
  P.MAX = 0;
  P.photos = [];
  P.frame = 0;
  P.frameRate = 100;
  P.control = 0;  
  P.previewer = document.getElementById('previewer');
};

Player.prototype = {
  setPhotos : function(photos){ P.photos = []; P.photos = photos; P.MAX = photos.length; }
  ,setFrameRate : function(rate){ P.frameRate = rate; }  
  ,stop  : function(){ clearInterval(P.control);P.isPlaying=false; }
  ,loadImage : function(inx){ P.previewer.src =  P.photos[inx]; }
  ,toggler : function(){ if(P.isPlaying ){ P.stop(); } else { P.play();}  }
  ,play  : function(){
       P.control = setInterval(function(){
         if(P.frame >= P.MAX) {P.frame = 0;}
         P.loadImage(P.frame);
         P.frame++;
       }, P.frameRate);
       P.isPlaying = true;
  }  
};