<template lang="pug">

        .phrases-select
            filter-search(
            v-show="0"
            :item-list="snippets"
            fieldName="text" ,
            @result="(val)=>filterSearchResult=val",
            :external-search="filterSearch",
            :startAll="false"
            )
            scroll-bar.phrases-ready__scrollbar
                action-list.phrases-ready__list(
                :item-list="filterSearchResult"
                name="snippets"
                name-field-text="text"
                name-field-value="text"
                v-model="text"
                )

</template>

<script>
    import FilterSearch from '@/components/FilterSearch'
    import ActionList from '@/components/ActionList'

    export default {
        components:{
            FilterSearch,
            ActionList
        },
        props:{
            filterSearch:{
                type:String,
                default:null
            },
        },
        data() {
            return {
                filterSearchResult:[],
                text:''



            }
        },
        computed:{
            snippets(){
                return this.$store.state.phrases.snippets
            },
        },
        watch:{
            text(val){
                if(val) this.$emit('resultText',val)
                else this.$root.$emit('globBoxControlClose')




            },
        }

    }
</script>

<style lang="scss">
    .phrases-select {

    }




</style>