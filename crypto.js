var crypto = window.crypto || window.msCrypto

function U8ArrayToHex(ua) {
	var s = ""
	for (var i = 0; i < ua.length; i++) {
		var t = ua[i].toString(16)
		if (t.length < 2) {
			s += '0'
		}
		s += t
	}
	return s
}

function getRandom(len) {
	return crypto.getRandomValues(new Uint8Array(len))
}

function HexToInt(c) {
	var i = "0123456789abcdef".indexOf(c)
	if (i < 0) {
		console.log('HexToInt err' + c)
	}
	return i
}

function HexToU8Array(s) {
	var n = s.length / 2
	var ua = new Uint8Array(n)
	for (var i = 0; i < n; i++) {
		var H = HexToInt(s[i * 2 + 0])
		var L = HexToInt(s[i * 2 + 1])
		ua[i] = H * 16 + L
	}
	return ua
}

function StrToU8Array(s) {
	var ua = new Uint8Array(s.length)
	for (var i = 0; i < s.length; i++) {
		ua[i] = s.charCodeAt(i)
	}
	return ua
}

function U8ArrayToStr(ua) {
	var str = ""
	for (var i = 0; i < ua.byteLength; i++) {
		str += String.fromCharCode(ua[i])
	}
	return str
}

/*
	key = generateKey(); callback(key)
*/
function generateAESkey(callback) {
	return crypto.subtle.generateKey({name: "AES-CBC", length: 128}, true, ["encrypt", "decrypt"]).then(
		function(key) {
			callback(key)
		}
	)
}

/*
	keyStr = export(key); callback(keyStr)
*/
function exportAESkey(key, callback) {
	return crypto.subtle.exportKey("jwk", key).then(
		function(keyJson) {
			var keyStr = JSON.stringify(keyJson)
			callback(keyStr)
		},
		function(e) {
			console.log('export err:' + e.message)
		}
	)
}

/*
	key = import(keyStr); callback(key)
*/
function importAESkey(keyStr, callback) {
	return crypto.subtle.importKey("jwk", JSON.parse(keyStr), {name: "AES-CBC"}, true, ["encrypt", "decrypt"]).then(
		function(key) {
			callback(key)
		}
	)
}

/*
	setter(obj, Enc_{key, iv}(msg))
*/
function encAES(obj, setter, key, iv, msg) {
	return crypto.subtle.encrypt({name: "AES-CBC", iv: iv}, key, StrToU8Array(msg)).then(
		function(e) {
			var encMsg = new Uint8Array(e)
			var encHex = U8ArrayToHex(encMsg)
			setter(obj, encHex)
		}
	)
}
/*
	setter(obj, Dec_{key, iv}(encHex))
*/
function decAES(obj, setter, key, iv, encHex) {
	var encMsg = HexToU8Array(encHex)
	return crypto.subtle.decrypt({name: "AES-CBC", iv: iv}, key, encMsg).then(
		function(e) {
			var decBin = new Uint8Array(e)
			var decMsg = U8ArrayToStr(decBin)
			setter(obj, decMsg)
		},
		function(key) {
			console.log('decAES', key.message)
		}
	)
}

function addScript(func) {
	var script = document.createElement('script')
	script.appendChild(document.createTextNode(func.toString()))
	document.body.appendChild(script)
}
