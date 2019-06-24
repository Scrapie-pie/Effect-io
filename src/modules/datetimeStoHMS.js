function datetimeStoHMS(valSec) {
	let sec = Number(valSec)
	if (!sec) return '-'
	let h = (sec / 3600) ^ 0
	let m = ((sec - h * 3600) / 60) ^ 0
	let s = sec - h * 3600 - m * 60

	return (h ? h + ' ч. ' : '') + (m ? m + ' мин. ' : '') + (s ? s + ' сек.' : '')
}

export default datetimeStoHMS
