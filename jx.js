//V3.01.A - http://www.openjs.com/scripts/jx/
//Adapted by Radical Electronic Systems to support embedded systems
//01/03/2018 - V3.01.B, First Release
jx = {
	//Create a xmlHttpRequest object - this is the constructor.
	getHTTPObject : function() {
		var http = false;
		//Use IE's ActiveX items to load the file.
		if(typeof ActiveXObject != 'undefined') {
			try {http = new ActiveXObject("Msxml2.XMLHTTP");}
			catch (e) {
				try {http = new ActiveXObject("Microsoft.XMLHTTP");}
				catch (E) {http = false;}
			}
		//If ActiveX is not available, use the XMLHttpRequest of Firefox/Mozilla etc. to load the document.
		} else if (window.XMLHttpRequest) {
			try {
				http = new XMLHttpRequest();
				if(http.withCredentials === undefined) {
					console.log("IE8/9 XDomainRequest");
					http = new XDomainRequest();
				}
			}
			catch (e) {
				http = false;
			}
		}
		return http;
	},
	// This function is called from the user's script.
	//Arguments -
	//	url	- The url of the serverside script that is to be called. Append all the arguments to
	//			this url - eg. 'get_data.php?id=5&car=benz'
	//	callback - Function that must be called once the data is ready.
	//	format - The return type for this function. Could be 'xml','json' or 'text'. If it is json,
	//			the string will be 'eval'ed before returning it. Default:'text'
	load : function (url,format,method,opt,uuid,data) {
		return new Promise(function(resolve, reject) {
				var http = this.init(); //The XMLHttpRequest object is recreated at every call - to defeat Cache problem in IE
				var _this = this;
				if(!http||!url) reject("AJAX object or url invalid!");
				if(!format) format = "text";//Default return type is 'text'
				if(!opt) opt = {};
				if(!data) data = "";
				if(!method) method = "GET";
				let payload = "";
				
				http.withCredentials = true; // needed for CORS
				format = format.toLowerCase();
				method = method.toUpperCase();

				if(typeof data == "object") {
					payload = Object.keys(data).map(key => {
						return (key + '=' + data[key]);
					}).join('&');					
				}
				else if(typeof data == "string") {
					payload = data;
				}
			
				let now = 'tm=' + new Date().getTime();
				url += '\?uid=' + uuid + '&' + now;
			
				this.waitC(opt);
				http.open(method, url, true);

				http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
				http.setRequestHeader('x-mac', 'AA:BB:CC:00:11:22');

				/*0: UNSENT, 1: OPEN, 2:HEADERS_RECEIVED, 3: LOADING, 4: DONE*/
				http.onreadystatechange = function () {//Call a function when the state changes.
					if (http.readyState == 4) {//Ready State will be 4 when the document is loaded.
						if(http.status == 200) {

							var ct = http.getResponseHeader("content-type") || "";
							var res = "";

							if(ct.indexOf('html') > -1) {
								console.warn("JX: got html data??");
							}
							else if(ct.indexOf('json') > -1) {
								  //console.debug("JX::RESP: " + http.responseText);
									res = JSON.parse(http.responseText);
							}
							else {
								_this.completeC(opt);
								reject("Content type not supported: " + ct);
							}
							_this.completeC(opt);
							resolve(res);
						}
						else { //An error occured
							_this.completeC(opt);
							reject("HTTP error: " + http.status);
						}
					}
				};

				if(payload.length > 0) {
					http.send(payload);
				}
				else {
					http.send(null);
				}
			}.bind(this));
	},
	waitC : function(opt) {
		if(opt != "timer") {
			document.body.style.cursor = "wait";
		}
	},
	completeC : function(opt) {
		document.body.style.cursor = 'default';
	},
	init : function() {
		return this.getHTTPObject();
	}
}
