function dialogPush(vm, dialogName, item, findField) {
    console.log(item)
    let list = vm.$store.state.visitors[dialogName].slice()
    let findIndex
    if (!findField) {
        console.log('findField', findField)
        let { guest_uuid, site_id } = item
        findIndex = list.findIndex(item => guest_uuid + site_id === item.guest_uuid + item.site_id)
    } else {
        let findFieldVal = item[findField]
        findIndex = list.findIndex(item => findFieldVal === item[findField])
    }

    console.log('findIndex', findIndex)

    if (findIndex === -1) {
        console.log('findIndex -1')
        let unread = item.unread ? item.unread : []
        vm.$set(item, 'unread', unread)

        let last_message_time = item.last_message_time
            ? item.last_message_time
            : new Date().getTime() / 1000
        vm.$set(item, 'last_message_time', last_message_time)

        list.push(item)
        vm.$store.commit('visitors/newList', { field: dialogName, val: { list: list } })
    } else {
        list[findIndex] = item
        console.log('обновляем')
        vm.$store.commit('visitors/newList', { field: dialogName, val: { list: list } })
    }
}

export default dialogPush
