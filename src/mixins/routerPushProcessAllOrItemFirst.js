/*eslint-disable */
export default {
	methods: {
		routerPushProcessAllOrItemFirst() {
			this.$router.push({ name: 'processAll' })

			return
			let itemList = this.$store.state.visitors.process
			if (!itemList.length) this.$router.push({ name: 'processAll' })
			//Todo проверить доделать этот варивант
			else {

				let { guest_uuid, site_id } = itemList[0]
				this.$router.push({ name: 'process', params: { guest_uuid, site_id } })
			}
		}
	},
	computed: {}
}
