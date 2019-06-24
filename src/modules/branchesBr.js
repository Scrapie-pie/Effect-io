function branchesBr(value) {
	let str = ''

	value.forEach((item, index) => {
		let separator = index === value.length - 1 ? '' : '<br>'
		str = str + item + separator
	})
	return str
}

export default branchesBr
