<template lang="pug">

        .phrases-select(
            v-show="!!filterSearchResult.length"
        )
            box-controls(
                :show="true",
                @boxControlClose="filterSearchResult=[]",
                :overlay="false"
            )

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
                    key="action-list"
                    v-if="!!filterSearchResult.length"
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
                console.log(val);
                if(val) {
                    this.$emit('resultText',val)
                    setTimeout(()=>{
                        this.filterSearchResult=[];
                        this.text=''
                    },50)

                }
                else this.$root.$emit('globBoxControlClose')




            },
        }

    }
</script>

<style lang="scss">
    .phrases-select {

    }




</style>