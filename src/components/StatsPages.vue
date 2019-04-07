<template lang="pug">
    base-table.stats-pages
        thead
            tr
                th URL
                th Получено диалогов
                th
                    |Процент от общего количества обращений (%)

        tbody
            tr(v-for="(item, index) in itemList" :key="index")
                td.stats-pages__url(:title="item.url"): a(:href="item.url" v-text="item.url" target="_blank")
                td
                    | {{item.dialogues_requests | format}}
                td
                    |{{item.dialogues_percents | format}} %


</template>

<script>

import {stats} from '@/mixins/mixins'

export default {
    mixins:[stats],

    data() {
        return {

        }
    },
    computed:{

        bodyListFormat(){
            return this.bodyList.map(item=>{
                item.name=item.url; //base-filter-search сейчас ищет по name

                return item
            })
        },
    },
}
</script>

<style lang="scss">
    .stats-pages{
        width:auto;
        &__url {
            @extend %text-overflow
        }
    }
</style>

