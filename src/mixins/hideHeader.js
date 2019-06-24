export default {
	watch: {
		$route(to, from) {
			this.hideHeader(to.name)
		}
	},
	created() {
		this.hideHeader(this.$route.name)
	},
	beforeDestroy() {
		document.body.classList.remove('is-hided-header')
	},
	beforeRouteLeave(to, from, next) {
		document.body.classList.remove('is-hided-header')
		setTimeout(() => {
			return next()
		}, 300)
	},
	methods: {
		hideHeader(name) {
			document.body.classList.add('is-hided-header')
		}
	}
}
