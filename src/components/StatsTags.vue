<template lang="pug">
    base-table.stats-tags
        thead
            tr
                th
                th
                th
                    |Всего диалогов
                    btn-sort(
                        :toggle="sortFieldsComp['chats']",
                        @result="val=>sortFieldsSetSortField(val,'chats')"
                    )
                th
                    |% от общего
                    btn-sort(
                        :toggle="sortFieldsComp['percents']",
                        @result="val=>sortFieldsSetSortField(val,'percents')"
                    )
        tbody
            tr(v-for="(item, index) in itemList", :key="item.id")
                td
                    | {{item.name}}
                td
                    base-btn.base-table__show-hover(@click="link(item)"


                    ) Перейти в журнал
                td
                    | {{item.chats}}
                td
                    |{{item.percents}} %




</template>

<script>
import BtnSort from '@/components/BtnSort'

import { stats, sortFields } from '@/mixins/mixins'

export default {
    components: {
        BtnSort
    },
    mixins: [stats, sortFields],
    data() {
        return {}
    },
    computed: {
        bodyListFormat() {
            return this.sortFieldsListGet
        },
        sortFieldsListSet() {
            return this.bodyList
        }
    },
    methods: {
        link(item){

            this.$store.commit('setFilter', { pageAllDialoguesTags: [item.id] })
            this.$router.push({name:'all'})
        }
    }
}
</script>

<style lang="scss">
.stats-tags {
    width: auto;
    height: 100%;
}
</style>
