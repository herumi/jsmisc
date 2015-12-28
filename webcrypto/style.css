var g_key = ''
var g_iv = ''

function get(id) {
	return document.getElementById(id)
}

function getStr(id) {
	return get(id).innerHTML
}

function setStr(id, s) {
	get(id).innerHTML = s
}

function generateKey() {
	generateAESkey(function (key) {
		g_key = key
		exportAESkey(key, function (keyStr) {
			get('key').innerHTML = keyStr
			g_iv = HexToU8Array(getStr('iv'))
		})
	})
}

function enc() {
	var msg = document.getElementsByName('msg')[0].value
	encAES('encMsg', setStr, g_key, g_iv, msg)
}

function dec() {
	var setter = function(obj, decMsg) {
		obj.innerHTML = decMsg
	}
	decAES('decMsg', setStr, g_key, g_iv, getStr('encMsg'))
}
