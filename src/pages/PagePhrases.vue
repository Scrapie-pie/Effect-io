<template lang="pug">
    section.page-phrases
        the-phrases-ready
</template>

<script>
import ThePhrasesReady from '@/components/ThePhrasesReady'
export default {
	name: 'PagePhrases',
	components: {
		ThePhrasesReady
	},
	data() {
		return {}
	}
}
</script>

<style lang="scss">
.page-phrases {
	.phrases-ready__scrollbar {
		max-height: calc(100vh - 135px);
	}
}
</style>
