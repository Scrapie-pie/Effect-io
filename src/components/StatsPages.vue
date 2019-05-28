<template lang="pug">
    base-table.stats-pages
        thead
            tr
                th URL
                th
                th Получено диалогов
                th
                    |Процент от общего количества обращений (%) #[btn-sort(:toggle="sortPercentLarger", @result="val=>sortPercentLarger=val")]

        tbody
            tr(v-for="(item, index) in itemList" :key="item.url")
                td.stats-pages__url(:title="item.url"): a(:href="item.url" v-text="item.url" target="_blank")
                td
                    base-btn.base-table__show-hover(
                        @click="nextLink(item)"
                    ) Открыть журнал
                td
                    | {{item.dialogues_requests | format}}
                td
                    |{{item.dialogues_percents}} %


</template>

<script>
    import BtnSort  from '@/components/BtnSort'
    import lodash_sortBy from 'lodash/sortBy'
import {stats} from '@/mixins/mixins'

export default {
    components:{
        BtnSort
    },
    mixins:[stats],
    data() {
        return {
            sortPercentLarger:true,
        }
    },
    computed:{
        itemListSort(){
            return lodash_sortBy(
                this.bodyList.map(item=>{
                    item.name=item.url; //base-filter-search сейчас ищет по name

                    return item
                }),
                [
                    (item)=>item.dialogues_percents*(this.sortPercentLarger?1:-1),
                ]
            );
        },
        bodyListFormat(){
            return this.itemListSort
        },
    },
    methods:{
        nextLink(item){
            this.$store.commit('setFilter',{url:[item.url]})
            this.$router.push({
                name:'all'
            })
        },
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

