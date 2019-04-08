<template lang="pug">
    base-table.stats-pages
        thead
            tr
                th URL
                th Получено диалогов
                th
                    |Процент от общего количества обращений (%) #[base-btn(:class="sortClass"  :icon="{box:true,textHidden:'Cортировка'}" padding="xs" color="success" @click="sortToggle") &#11015;]
        tbody
            tr(v-for="(item, index) in itemList" :key="item.url")
                td.stats-pages__url(:title="item.url"): a(:href="item.url" v-text="item.url" target="_blank")
                td
                    | {{item.dialogues_requests | format}}
                td
                    |{{item.dialogues_percents | format}} %


</template>

<script>
    import lodash_sortBy from 'lodash/sortBy'
import {stats} from '@/mixins/mixins'

export default {
    mixins:[stats],

    data() {
        return {
            sortPercentLarger:1,
        }
    },
    computed:{
        sortClass(){
            return (this.sortPercentLarger===-1)?'stats-pages__btn-rotate':''
        },
        itemListSort(){
            return lodash_sortBy(
                this.bodyList.map(item=>{
                    item.name=item.url; //base-filter-search сейчас ищет по name

                    return item
                }),
                [
                    (item)=>item.dialogues_requests*this.sortPercentLarger,
                ]
            );
        },
        bodyListFormat(){
            return this.itemListSort
        },
    },
    methods:{
        sortToggle(){
            this.sortPercentLarger = -1*this.sortPercentLarger
        }
    }
}
</script>

<style lang="scss">
    .stats-pages{
        width:auto;

        &__btn-rotate{
            transform:rotate(180deg);
        }

        &__url {
            @extend %text-overflow
        }
    }
</style>

