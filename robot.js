//-----------------------------------------------------------------------------
//(C) Radical Electronic Systems, info@radicalsystems.co.za
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
//General HTML DOM Functions
//-----------------------------------------------------------------------------
var uuid = "loading...";
var lib_version = "1.3";
var wifi_busy = false;
var serial_websocket;

window.onload = function() {
	uuid = uuidv4();
	layer = '';
	document.getElementById("guiversion").innerHTML += "(lib:" + lib_version + ")";
	//var nVer = navigator.appVersion;
	//var nAgt = navigator.userAgent;
	//var browserName  = navigator.appName;
	//console.log("Browser: " + browserName);
	//console.log("Agent: " + nAgt);
	//console.log("Version: " + nVer);
	hideLayers();
	loadHome();
	setInterval(function(){  
		if(!wifi_busy && layer == "layerNetwork") {
			wifi_busy = true;
			jx.load('getwifidata.sh', 'json', 'get', 'timer', uuid, "").then((data) =>{
				this.updateWifiStatus(data);
				wifi_busy = false;
			});
		}
	}, 1000)
}

//General error handler
//l : level
//0 = alert box
//1 = info log
//2 = warning
//3 = error
//m : message
function log(l,m) {
	if(l == 0) {
		console.log(m);
		alert(m);
	}
	else if(l == 1) {
		console.info(m); //Blue color text with icon
	}
	else if(l == 2) {
		console.log(m); //Black color text with no icon
	}
	else if(l == 3) {
		console.debug(m); //Pure black color text
	}
	else if(l == 4) {
		console.warn(m); //Yellow color text with icon
	}
	else if(l == 5) {
		console.error(m); //Red Color text with icon
	}
}

//Fetch a value of a HTML Element, find by DOM ID
function ov(id) {
	let o = document.getElementById(id);
	if(o) {
		if(o.type == "checkbox") {
			//return (obj.checked) ? obj.value : 0;
			return (o.checked) ? "TRUE" : "FALSE";
		}
		else if(o.type == "radio") {
			return ovrb (id);
		}
		else {
			return document.getElementById(id).value;
		}
	}
	else {
		log(4,"Element undefined: " + id);
		return "undefined";
	}
}

// Fetch HTML Radio Buttons Group check buttons value
function ovrb(nm) {
	let o = document.getElementsByName(nm);
	for(var x = 0; x < o.length; x ++) {
		if(o[x].checked == true) {
			return o[x].value;
		}
	}
}

// Check a HTML Radio Button from a group by name with a specific value
function srb(id, value) {
	let o = document.getElementsByName(id);
	if(o) {
		for(var x = 0; x < o.length; x ++) {
			if(o[x].value==value) {
				o[x].checked = true;
			}
		}
	}
	else {
		log(4,"Element undefined: " + id);
	}
}

// Set a check box, find by HTML DOM ID
function scb(id, value) {
	let e = document.getElementById(id);
	if(e) {
		if(e.type=="checkbox") {
			if(typeof value == 'string') {
				if(value == "TRUE" || value == "true") {
					e.checked = true;
				}
				else {
					e.checked = false;
				}
			}
			else if(typeof value == 'boolean') {
				if(value) {
					e.checked = true;
				}
				else {
					e.checked = false;
				}
			}
			else if(typeof value == 'number') {
				if(value > 0) {
					e.checked = true;
				}
				else {
					e.checked = false;
				}
			}
			else {
				e.checked = false;
			}
		}
		else {
			log(4,"sb type error: : " + id);
		}
	}
	else {
		log(4,"sb undefined error: " + id);
	}
}

// Set value of select input, find by HTML DOM ID
function ssi(id, value) {
	let s = document.getElementById(id);
	if(s) {
	  for(var i = 0; i < s.options.length; i++) {
	      if(s.options[i].value == value) {
	          s.options[i].selected = true;
	          break;
	      }
	  }
	}
	else {
		log(4,"Select undefined: " + id);
	}
}

// Set a value of a HTML element with a specific ID
function sv(id, vl) {
	let o = document.getElementById(id);
	if(o) {
		if(o.type == "checkbox") {
			scb(id, vl);
		}
		else if(o.type == "radio") {
			 srb(id, vl);
		}
		else if(o.type == "select") {
			 ssi(id, vk);
		}
		else {
			o.value = vl;
		}
	}
	else {
		log(4,"sv error: undefined element: " + id);
	}
}

function getLibVersion() {
	return lib_version;
}

//-----------------------------------------------------------------------------
//HTML Layer Control
//-----------------------------------------------------------------------------
function hideLayer(ln) {
	document.getElementById(ln).style.display = 'none';
	let l = document.getElementsByClassName("menuitem");
	for(var i = 0; i < l.length; i++) {
		l[i].className = l[i].className.replace(" active", "");
	}
}

function hideLayers() {
	hideLayer('layerHome');
	hideLayer('layerApplication');
	hideLayer('layerNetwork');
	hideLayer('layerAdmin');
	hideLayer('layerTestWS');
}

function showLayer(ln) {
	hideLayers();
	document.getElementById(ln).style.display = 'block';
	
	if(layer == "layerHome") {
		document.getElementById('homebtn').className += " active";
	}
	else if(layer == "layerApplication") {
		document.getElementById('appbtn').className += " active";
	}
	else if(layer == "layerNetwork") {
		document.getElementById('netbtn').className += " active";
	}
	else if(layer == "layerAdmin") {
		document.getElementById('adminbtn').className += " active";
	}
}

function loadActiveLayer() {
	if(layer == "layerHome") {
		loadHome();
	}
	else if(layer == "layerNetwork") {
		loadNetwork();
	}
	else if(layer == "layerApp") {
		loadApp();
	}
	else if(layer == "layerConfig") {
		loadConfig();
	}
}

function showLayerByID(ln) {
	document.getElementById(ln).style.display = 'block';
}

function hideLayerByID(ln) {
	document.getElementById(ln).style.display = 'none';
}

//-----------------------------------------------------------------------------
//Network TAB/Layer Functions
//-----------------------------------------------------------------------------
function loadNetworkConfig() {
	layer = 'layerNetwork';
	jx.load('getnwk.sh', 'json', 'get', {}, uuid, "").then((data) =>{
		if("status" in data) {			
			if(data.status == "OK") {
				this.loadNetworkCb(data);
			}
			else if(data.status == "NOTAUTH") {
				loadAuth('layerNetwork');
			}				
		}
	});
}

function setNetState (i,s) {

	if(i == 'wired') {
		formNetwork.wired_ipa.disabled = s;
		formNetwork.wired_nm.disabled = s;
		formNetwork.wired_gw.disabled = s;
	}
	else if(i == 'wifi') {
		formNetwork.wifi_ipa.disabled = s;
		formNetwork.wifi_nm.disabled = s;
		formNetwork.wifi_gw.disabled = s;
	}
}

function setNetwork(label, cfg) {
	
	scb(label + '_dhcp', cfg.dhcp);
	setNetState(label, cfg.dhcp == "true");
	sv(label + '_mac', cfg.macAddress);
	if(cfg.status == "ENABLED") {	
		sv(label + '_ipa', cfg.ipAddress);
		sv(label + '_nm', cfg.netmask);
		sv(label + '_gw', cfg.gateway);
	}
	else {
		sv(label + '_ipa', "");
		sv(label + '_nm', "");
		sv(label + '_gw', "");
	}
	sv('net_' + label + '_name', cfg.name);
	document.getElementById('net_' + label + '_name').innerHTML = "Interface: " + cfg.name;
}

function loadNetworkCb(o) {
	showLayer(layer);

	if("wired" in o) {
		let c = o["wired"];			
		setNetwork("wired", c);
	}

	if("wifi" in o) {
		let c = o["wifi"]; 				
		setNetwork("wifi", c);
		if(c.status == "ENABLED") {	
			sv('wifi_enable', "TRUE");
		}
		else {
			sv('wifi_enable', "FALSE");
		}
	}

	if("wifiap" in o) {
		let c = o["wifiap"]; 				
		sv('wifi_ssid', c.SSID);
		sv('wifi_passkey', c.passkey);
	}

	if("ntpip" in o) {
		sv('network_ntp', o.ntpip);
	}
	else {
		sv('network_ntp', "");
	}

	if("dnsip" in o) {
		sv('network_dns', o.dnsip);
	}
	else {
		sv('network_dns', "");
	}
}

function getNetworkSettings(type) {
	let ncfg = type + '_ipaddr=' + ov(type + '_ipa');
	ncfg += '&' + type + '_gateway=' + ov(type + '_gw'); 
	ncfg += '&' + type + '_dhcp=' + ov(type + '_dhcp'); 
	ncfg += '&' + type + '_netmask=' + ov(type + '_nm'); 
	return ncfg;
}

function saveNWKConfig() {
	let cfg = getNetworkSettings("wired");
	cfg += '&' + getNetworkSettings("wifi");	
	cfg += '&wifi_enable=' + ov('wifi_enable');
	cfg += '&wifi_ssid=' + ov('wifi_ssid'); 
	cfg += '&wifi_passkey=' + ov('wifi_passkey'); 
	cfg += '&dnsip=' + ov('network_dns');
	cfg += '&ntpip=' + ov('network_ntp');

	jx.load('setnwk.sh', 'json', 'post', null, uuid, cfg).then((data) => {
		this.saveNetworkStatus(data);
	});
	return false;
}

function saveNetworkStatus(data) {
	if (data.status=='OK') {
		alert('Success: Saved Network Configuration!\nRestart for settings to take effect.');
	} else {
		alert('Error: Saving Network Configuration!\nResult:' + data.status);
	}
}

function resetNWKConfig() {
	jx.load('resetnwk.sh', 'json', 'post', null, uuid, {}).then((data) => {
		if (data.status=='OK') {
			alert('Success: Network set to default configuration!\nRestart for settings to take effect.');
		} else {
			alert('Error: Failed to reset network settings to default!\nResult:' + data.status);
		}
	});
	return false;
}

function restartNWK() {
	jx.load('restartnwk.sh', 'json', 'post', null, uuid, {}).then((data) => {
		if (data.status=='OK') {
			alert('Success: Network restart successful!');
		} else {
			alert('Error: Failed to restart the network!\nResult:' + data.status);
		}
	});
	return false;
}

function restartNWKWifi() {
	jx.load('restartnwkwifi.sh', 'json', 'post', null, uuid, {}).then((data) => {
		if (data.status=='OK') {
			alert('Success: Wifi Network restart successful!');
		} else {
			alert('Error: Failed to restart the Wifi network!\nResult:' + data.status);
		}
	});
	return false;
}

function saveNetworkStatus(data) {
	if (data.status=='OK') {
		alert('Success: Saved Network Configuration!\nRestart for settings to take effect.');
	} else {
		alert('Error: Saving Network Configuration!\nResult:' + data.status);
	}
}

function updateWifiStatus(data) {
	if(data.status=='OK') {
		sv('wifi_apcon', data.ESSID);
		sv('wifi_apmac', data.APMAC);
		sv('wifi_apfreq', data.frequency);
		sv('wifi_aplq', data.linkquality);
		sv('wifi_apsl', data.signallevel);
	}
}

//-----------------------------------------------------------------------------
//Home Page TAB/Layer Functions
//-----------------------------------------------------------------------------
function loadHome () {
	layer = 'layerHome';
	jx.load('getinfo.sh' , 'json', 'get', null, uuid, "").then((data) => {
		if("status" in data) {
				if(data.status == "NOTAUTH") {
					loadAuth();
				}
		}
		else {
			this.setFormHomeCB(data)}
		}
	);
	
}

//Update UI with fetched data
function setFormHomeCB(data) {
	showLayer(layer);
	sv ('operatingsystem', data.operatingsystem);
	sv ('macaddress', data.macaddress);
	sv ('kernel', data.kernel);
	sv ('distro', data.distro);
}

// ********************************************************************************
// -- Application Page --
// appsvrurl
// ********************************************************************************
function loadApplication() {
	layer = 'layerApplication'
	jx.load('getapp.sh', 'json', 'get', null, uuid, "").then((data) => {
		
		if("status" in data) {
			if(data.status == "OK") {
				this.setFormAppCB(data);
			}	
			else if(data.status == "NOTAUTH") {
				loadAuth();
			}
		}
		else {
			log(0, "Response invalid\n" + JSON.stringify(data));
		}
		
	});
}

function setFormAppCB(data) {
	showLayer(layer);
	sv('appsvrurl', data.appsvrurl);

	if("serialws" in data) {
		let ws = data["serialws"];
		sv('appwsen', ws.enabled);
		sv('appwsport_sel', ws.serialport);
		sv('appwsbaud_sel', ws.baudrate);
		sv('appwsport_net', ws.socketport);
		sv('appwsforeign', ws.allowforeign);
	}
}

function saveAppConfig() {
	let cfg = {
		appsvrurl : ov('appsvrurl'),
		appswsen : ov('appwsen'),
		appswsports : ov('appwsport_sel'),
		appswsbaud : ov('appwsbaud_sel'),
		appswsportn : ov('appwsport_net'),
		appswsforeign : ov('appwsforeign')
	};

	jx.load('setapp.sh' , 'json', 'post', {}, uuid, cfg).then((data) => {
		this.saveAppConfigStatus(data);
	});

	return false;
}


function saveAppConfigStatus(data) {
	if (data.status=='OK') {
		alert('Success: Saved Application Configuration!');
	} else {
		alert('Error: Saving Application Configuration!\nResult:' + data.status);
	}
}

function addWsMessage(message) {
	let ta = document.getElementById('logWs');
	let v = ta.value;
	ta.value = message + '\r\n' + v;
}

function onConnectedWs() {
	this.addWsMessage("Connected");
}

function onDisConnectedWs() {
	this.addWsMessage("Disconnected");
	let e = document.getElementById('layerTestWS');
	let be = document.getElementById('btnWebsock');
	e.style.display = 'none';
	be.value = "Test Websocket";
}

function onMessageWs(message) {
	this.addWsMessage(message);
}

function onErrorWs() {

}

function startWebsocket() {
	var nAgt = navigator.userAgent;
  	var bl = nAgt.indexOf("RobotBrowser");
	let ta = document.getElementById('logWs');
	ta.value ='';
	this.addWsMessage("Started");
	let url = 'ws://127.0.0.1:' + ov('appwsport_net') + '/';
	if(bl < 0) {
		url = 'ws://' + ov('wired_ipa') + ':' + ov('appwsport_net') + '/';
	}
	serial_websocket = new WebSocket(url);
	serial_websocket.onopen = function() {
		onConnectedWs();
	};
	serial_websocket.onclose = function() {
		onDisConnectedWs();
	};
	serial_websocket.onmessage = function(event) {
		onMessageWs(event.data);
	};
}

function stopWebsocket() {
	this.addWsMessage("Stopping");
	if(serial_websocket) {
		serial_websocket.close();
	}
}

function testWebsocket() {
	let e = document.getElementById('layerTestWS');
	let be = document.getElementById('btnWebsock');

	if(e.style.display == 'block') {
		stopWebsocket();
	}
	else {
		startWebsocket();
		e.style.display = 'block';
		be.value = "Stop Websocket";
	}
}

// ********************************************************************************
// * Reboot Robot
// ********************************************************************************
function deviceRestart () {
	jx.load('reboot.sh', 'json', 'post', {}, uuid, {}).then((data) => {
		this.restartStatus(data);
	});

	return false;
}

function restartStatus (data) {
	if (data.status=='OK') {
		alert('Success: Device will reboot!');
	} else {
		alert('Error:  Failed ot initiate reboot!\nResult:' + data.status);
	}
}

//-----------------------------------------------------------------------------
// Authentification Page TAB/Layer Functions
//-----------------------------------------------------------------------------
function loadAuth() {
	showLayer('layerLogin');
	document.getElementById('loginPW').value = "";
}


function appLogin() {
	let url = 'auth.sh';
	let pw = '{\"password\":\"' + ov('loginPW') +   '\"}';
	jx.load(url, 'json', 'post', {}, uuid, pw).then((data) => {
		if(data.status == "AUTH") {
			loadActiveLayer();
		}
		else {
			loadAuth();
		}
	});

	return false;
}

// ********************************************************************************
// * Update Password
// ********************************************************************************
function loadAdmin() {
	layer = 'layerAdmin';
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
	if (data.status=='OK') {
		alert('Success: Password Updated!!');
	} else {
		alert('Error: Saving Password!\nResult:' + data.status);
	}
}

//hasher
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  )
}
