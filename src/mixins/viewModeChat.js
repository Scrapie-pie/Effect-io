export default {
	computed: {
		viewModeChat() {
			if (this.$route.name == 'teamChat') return 'operators'
			if (this.$route.name == 'process' || this.$route.name == 'processAll') return 'process'
			if (this.$route.name == 'chatId' || this.$route.name == 'messageAll') return 'visitors'
			if (this.$route.name == 'common') return 'common'
			if (this.$route.name == 'all') return 'all'
			if (this.$route.name == 'visor') return 'visor'
			if (this.$route.name == 'search') return 'search'
		}
	}
}
