<template lang="pug">
    article.page-phrases

        the-phrases-ready

</template>

<script>
import ThePhrasesReady from '@/components/ThePhrasesReady'
import TheLayoutTable from '@/components/TheLayoutTable'
import FilterDropMenu from '@/components/FilterDropMenu'
export default {
    name: 'PagePhrases',
    components: {
        FilterDropMenu,
        TheLayoutTable,
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
