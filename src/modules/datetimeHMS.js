function datetimeHMS(val) {
	if (Object.prototype.toString.call(val) !== '[object Date]') val = new Date(val * 1000)

	let today = val
	let h = String(today.getHours()).padStart(2, '0')
	let m = String(today.getMinutes()).padStart(2, '0') //January is 0!
	let s = String(today.getSeconds()).padStart(2, '0') //January is 0!

	return h + ':' + m + ':' + s
}

export default datetimeHMS
