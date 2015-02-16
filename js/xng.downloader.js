/** 
** XNG Downloader
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

XNG.Downloader = (function(){

	const MIME_TYPE = 'text/xml';

	var _t = function(){
		var filename = 'newfile.svg';
		var filedata;

		this.setFileName = function(name){ filename = name;	}
		this.getFileName = function(){ return filename; }
		this.putData = function(data){ filedata = data; }
		this.getData = function(){ return filedata; }
		this.download = function(){ this.processLink(); }	
	};
	_t.prototype = {
		processLink : function(){
			var dataToWrite 	= this.getData();
			var dataFileAsBlob 	= new Blob([dataToWrite], {type:MIME_TYPE});
			var fileNameToSave  = this.getFileName();

			var downloadLink = document.createElement("a");
			downloadLink.download = fileNameToSave;
			downloadLink.innerHTML = "Download File";
			if (window.webkitURL != null){				
				downloadLink.href = window.webkitURL.createObjectURL(dataFileAsBlob);
			}
			else
			{				
				downloadLink.href = window.URL.createObjectURL(dataFileAsBlob);
				downloadLink.onclick = this.destroyLink;
				downloadLink.style.display = "none";
				document.body.appendChild(downloadLink);
			}

			downloadLink.click();
		}
		,destroyLink : function(event){
			document.body.removeChild(event.target);
		}

	};


 	return _t;
})();