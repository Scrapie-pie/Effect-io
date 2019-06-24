function dialogPush(vm, dialogName, item, findField) {
	console.log(item)
	let list = vm.$store.state.visitors[dialogName].slice()
	let findIndex
	if (!findField) {
		let { uuid, site_id } = item
		findIndex = list.findIndex(item => uuid + site_id === item.uuid + item.site_id)
	} else {
		let findFieldVal = item[findField]
		findIndex = list.findIndex(item => findFieldVal === item[findField])
	}
	if (findIndex === -1) {
		let unread = item.unread ? item.unread : []
		vm.$set(item, 'unread', unread)

		let last_message_time = item.last_message_time
			? item.last_message_time
			: new Date().getTime() / 1000
		vm.$set(item, 'last_message_time', last_message_time)

		list.push(item)
		vm.$store.commit('visitors/newList', { field: dialogName, val: { list: list } })
	}
}

export default dialogPush
