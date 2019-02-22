<template lang="pug">
    scroll-bar.client-history
        ul.client-history__list
            li.client-history__item(v-for="(item, index) in itemList" :key="item.id" v-text="item.data_text")


</template>

<script>
    import {httpParams} from '@/mixins/mixins'
    export default {
        mixins:[httpParams],
        data(){
            return {
                itemList:[]
            }
        },
        watch:{
            '$route':'getItemList'
        },
        created(){
            this.getItemList()
        },
        methods:{
            getItemList(){

                if(!this.httpParams) return

                this.$http.get('read-history', this.httpParams).then(({data})=>{
                    this.itemList=data.data
                })

            }
        }
    }
</script>

<style lang="scss">
    .client-history {
        max-height: 8.5em;
        &__item {
            &+& {
                margin-top:calc-em(15);
            }
        }
    }


</style>