//V3.01.A - http://www.openjs.com/scripts/jx/
//
jx = {
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
			try {http = new XMLHttpRequest();}
			catch (e) {http = false;}
		}
		return http;
	},

	//	url	- The url of the serverside script that is to be called
	//	callback - Function that must be called once the data is ready.
	//	format - The return type for this function. Could be 'xml','json' or 'text'. If it is json,
	//			the string will be 'eval'ed before returning it. Default:'text'
	//  method - GET or POST
	// 	paramsArray -	array
	load : function (url, callback, format, method, paramsArray) {
		var http = this.init(); //The XMLHttpRequest object is recreated at every call - to defeat Cache problem in IE
		if(!http||!url) return;
		if (http.overrideMimeType) http.overrideMimeType('text/xml');

		if(!format) var format = "text";//Default return type is 'text'
		format = format.toLowerCase();

		// Check Params
		var params = "";
		if (paramsArray){
			for(key in paramsArray)	{
				params+= key + "=" + paramsArray[key] + "&";
			}
		}

		//Kill the Cache problem in IE.
		var now = "uid=" + new Date().getTime();
		params+= now;

		if (method=='get') {
			url += (url.indexOf("?")+1) ? "&" : "?";
			url += params;

			http.open("GET", url, true);
		} else {
			http.open("POST", url, true);
			//Send the proper header information along with the request
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			// **************************************************************************** //
			// * Not needed
			// **************************************************************************** //
			//http.setRequestHeader("Content-length", params.length);
			//http.setRequestHeader("Connection", "close");
		}

		http.onreadystatechange = function () {//Call a function when the state changes.
			if (http.readyState == 4) {//Ready State will be 4 when the document is loaded.
				if(http.status == 200) {
					var result = "";
					if(http.responseText) result = http.responseText;

					//If the return is in JSON format, eval the result before returning it.
					if(format.charAt(0) == "j") {
						//\n's in JSON string, when evaluated will create errors in IE
						//result = result.replace(/[\n\r\l]/g,"");
						result = result.replace(/(?:\\[rn]|[\r\n]+)+/g,"");
						result = eval('('+result+')');
					}

					//Give the data to the callback function.
					if(callback) callback(result);
				} else { //An error occured
					if(error) error(http.status);
				}
			}
		}

		if (method=='get') {
			http.send(null);
		} else {
			http.send(params);
		}
	},

	urlencode : function (str) {
		str = (str+'').toString();
		return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
                                       replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
	},

	init : function() {return this.getHTTPObject();}
}

// ********************************************************************************
// * Get Value of Form Input
// ********************************************************************************
function ov (id){
	obj = document.getElementById(id);
	if (obj.type=="checkbox"){
		return (obj.checked) ? obj.value : 0;
	} else if (obj.type=="radio"){
		return ovRadioButtons (id);
	} else {
		return document.getElementById(id).value;
	}
}

// ********************************************************************************
// * Get Value of Radio Buttons
// ********************************************************************************
function ovRadioButtons (id) {
	var objRadioButtons = document.getElementsByName(id);
	for (var x = 0; x < objRadioButtons.length; x ++) {
		if (objRadioButtons[x].checked == true) return objRadioButtons[x].value;
	}
}

// ********************************************************************************
// * Set Value of Form Input
// ********************************************************************************
function sv (id, value){
	obj = document.getElementById(id);
	if (obj.type=="checkbox"){
		sb (id, value);
	} else if (obj.type=="radio"){
		 sr (id, value);
	} else if (obj.type=="select"){
		 sd (id, value);
	} else {
		obj.value = value;
	}
}
// ********************************************************************************
// * Set Value of Radio Button
// ********************************************************************************
function sr (id, value){
	var objRadioButtons = document.getElementsByName(id);
	for (var x = 0; x < objRadioButtons.length; x ++) {
		if (objRadioButtons[x].value==value) objRadioButtons[x].checked = true;
	}
}

// ********************************************************************************
// * Set Value of Checkbox
// ********************************************************************************
function sb (id, value){
	if (value==1){
		document.getElementById(id).checked  = true;
	} else {
		document.getElementById(id).checked  = false;
	};
}

// ********************************************************************************
// * Set Value of Select Input
// ********************************************************************************
function sd(id, value) {
	s = document.getElementById(id);

    for ( var i = 0; i < s.options.length; i++ ) {
        if ( s.options[i].value == value ) {
            s.options[i].selected = true;
            return;
        }
    }
}

// ********************************************************************************
// * Layer/DIV Functions
// ********************************************************************************
function showLayer ( layerName ){
	hideLayers();
	document.getElementById(layerName).style.display = 'block';
}

function hideLayer ( layerName ){
	document.getElementById(layerName).style.display = 'none';
}

function hideLayers (){
	hideLayer ('layerHome');
	hideLayer ('layerApplication');
	hideLayer ('layerNetwork');
	hideLayer ('layerAdmin');
}

// ********************************************************************************
// * Network Configuration Section
// ********************************************************************************
function loadNetworkConfig() {
	showLayer('layerNetwork');
	jx.load('getnwkcfg.sh', setFormNetworkConfig, 'json', 'post', false);
}

function setFormNetworkConfig(data) {
	sv ('dhcp', data.dhcp);
	if (data.dhcp=='1') {
		setNetworkSettingsState (1);
	}

	sv ('ipaddress', data.ipaddress);
	sv ('subnet', data.subnet);
	sv ('gateway', data.gateway);
	sv ('dns', data.dns);

}

function saveNetworkConfig() {
	url = 'setnwkcfg.sh';
	var data = new Array ();
	data['ipaddress'] = ov ('ipaddress');
	data['dhcp'] 	  = ov ('dhcp');
	data['subnet'] 	  = ov ('subnet');
	data['gateway']   = ov ('gateway');
	data['dns'] = ov ('dns');

	jx.load(url, saveNetworkStatus, 'json', 'post', data);
	return false;
}

function saveNetworkStatus(data) {
	if (data.status=='ok') {
		alert('Success: Saved Network Configuration!');
	} else {
		alert('Error: Saving Network Configuration!\nResult:' + data.status);
	}
}

function toggleNetworkSettings() {
	$current = ov('dhcp');
	setNetworkSettingsState ($current);
}

function setNetworkSettingsState ($enable) {
	formConfig.ipaddress.disabled = $enable;
	formConfig.subnet.disabled = $enable;
	formConfig.gateway.disabled = $enable;
	formConfig.dns.disabled = $enable;
}
// ********************************************************************************
// * SOLAS Configuration Section & Control
// ********************************************************************************
function loadSOLAS() {
	showLayer('layerSOLAS');
	jx.load('getsolascfg.sh' , setFormSOLAS, 'json', 'post', false);
}

function setFormSOLAS(data) {
	sv ('appstatus', data.appstatus);
	sv ('appversion', data.appversion);
	sv ('javaversion', data.javaversion);
	sv ('location', data.location);
	sv ('modname', data.modname);
	sv ('businessurl', data.businessurl);
	sv ('transtype', data.transtype);
	sv ('rs232config0', data.rs232config0);
	sv ('rs232config1', data.rs232config1);
}

function saveSOLASConfig() {
	url = 'setsolascfg.sh';

	var data = new Array ();
	data['rs232config0'] 	= ov ('rs232config0');
	data['rs232config1'] 	= ov ('rs232config1');
	data['businessurl'] 	= ov ('businessurl');
	data['location'] 	= ov ('location');
	data['modname'] 	= ov ('modname');
	data['transtype'] 	= ov ('transtype');

	jx.load(url, saveSOLASConfigStatus, 'json', 'post', data);
	return false;
}


function saveSOLASConfigStatus(data) {
	if (data.status=='ok') {
		alert('Success: Saved SOLAS Configuration!');
	} else {
		alert('Error: Saving SOLAS Configuration!\nResult:' + data.status);
	}
}

function appStop () {
	url = 'appcontrol.sh';
	var data = new Array ();
	data['command'] = 'stop';
	jx.load(url , appStopCallBack, 'json', 'post', data);
}

function appStopCallBack (data) {
	if (data.status=='ok') {
		alert('Success: SOLAS Application Stopped!');
	} else {
		alert('Error:  Failed to stop SOLAS Application!\nResult:' + data.status);
	}
}

function appStart () {
	url = 'appcontrol.sh';
	var data = new Array ();
	data['command'] = 'start';
	jx.load(url , appStartCallBack, 'json', 'post', data);
}

function appStartCallBack (data) {
	if (data.status=='ok') {
		alert('Success: SOLAS Application Started!');
	} else {
		alert('Error:  Failed to start SOLAS Application!\nResult:' + data.status);
	}
}


// ********************************************************************************
// * Home Page
// ********************************************************************************

function loadHome() {
	showLayer('layerHome');
	refreshHome ();
}

function refreshHome () {
	jx.load('getinfo.sh' , setFormHome, 'json', 'post', false);
}

function setFormHome(data) {
	sv ('operatingsystem', data.operatingsystem);
	sv ('macaddress', data.macaddress);
	sv ('kernel', data.kernel);
	sv ('distro', data.distro);
}

// ********************************************************************************
// * Application Page
// ********************************************************************************

function loadApplication() {
	showLayer('layerApplication');
	refreshApplication ();
}

function refreshApplication () {
	jx.load('getapplication.sh' , setFormApplication, 'json', 'post', false);
}

function setFormApplication(data) {
	sv ('appdeskmode', data.appdeskmode);
	sv ('appstart', data.appstart);
	sv ('appparam', data.appparam);
}

function toggleAppSettings() {
	$current = ov('appdeskmode');
	setAppSettingsState ($current);
}

function setAppSettingsState ($enable) {
	formApplication.startapp.disabled = $enable;
	formApplication.appparam.disabled = $enable;
}

function saveAppConfig() {
	url = 'setapplication.sh';

	var data = new Array ();
	data['appdeskmode'] 	= ov ('appdeskmode');
	data['appstart'] 	= ov ('appstart');
	data['appparam'] 	= ov ('appparam');

	jx.load(url, saveAppConfigStatus, 'json', 'post', data);
	return false;
}


function saveAppConfigStatus(data) {
	if (data.status=='ok') {
		alert('Success: Saved SOLAS Configuration!');
	} else {
		alert('Error: Saving SOLAS Configuration!\nResult:' + data.status);
	}
}


// ********************************************************************************
// * Network set to default
// ********************************************************************************
function setNWKReset () {
	jx.load('setnwkreset.sh' , setNWKResetCallBack, 'json', 'post', false);
}

function setNWKResetCallBack (data) {
	if (data.status=='ok') {
		alert('Success: Network parameters set to default!');
	} else {
		alert('Error:  Failed to reset network parameters!\nResult:' + data.status);
	}
}

// ********************************************************************************
// * Reboot Robot
// ********************************************************************************
function deviceRestart () {
	jx.load('reboot.sh' , rebootCallBack, 'json', 'post', false);
}

function rebootCallBack (data) {
	if (data.status=='ok') {
		alert('Success: Device will reboot!');
	} else {
		alert('Error:  Failed ot initiate reboot!\nResult:' + data.status);
	}
}

// ********************************************************************************
// * Update Password
// ********************************************************************************
function loadAdmin() {
	showLayer('layerAdmin');
}

function saveAdmin() {
	url = 'json_cmd_set_passwd.php';

	var data = new Array ();
	data['passwordOld'] = ov ('passwordOld');
	data['passwordNew'] = ov ('passwordNew');

	jx.load(url, saveAdminStatus, 'json', 'post', data);
	return false;
}

function saveAdminStatus(data) {
	if (data.status=='1') {
		alert('Success: Password Updated!!');
	} else {
		alert('Error: Saving Password!\nResult:' + data.status);
	}
}
