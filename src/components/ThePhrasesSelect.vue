<template lang="pug">

        .phrases-select(
            v-show="!!filterSearchResult.length"
        )


            base-filter-search(
                v-show="0"
                :item-list="snippets"
                fieldName="text" ,
                @result="(val)=>filterSearchResult=val",
                :external-search="filterSearch",
                :startAll="false"
            )
            scroll-bar.phrases-select__scroll-bar
                action-list(
                    :title="true"
                    text-line="2"
                    key="action-list"
                    v-if="!!filterSearchResult.length",
                    :item-list="filterSearchResult"
                    name="snippets"
                    name-field-text="text"
                    name-field-value="text"
                    v-model="text"
                )

</template>

<script>

    import ActionList from '@/components/ActionList'

    export default {
        components:{

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
        },


    }
</script>

<style lang="scss">
    .phrases-select {
        $color_bg:glob-color('info-light');
        $trans:$glob-trans;
        padding-right:calc-em(10);




        .action-list {
            &__item {
               /* white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;*/

            }
            &__text {
                padding:calc-em(2) 0;
                color:glob-color('placeholder');
                font-style:italic;
                border:0;

                white-space: normal;


                & {
                    max-height: 2.6em; /* exactly three lines */
                }
                position: relative;

                &:before {
                    @extend %full-abs;
                    z-index:-1;
                    border-radius:$glob-border-radius;
                    content:'';

                    transition:$trans;
                    display:block;
                }


              /*  &:hover:before {
                    background:$color_bg;
                }
                &:hover:after {display:none}*/
               @extend %text-truncate
            }
            &__button{width:100%}
            &__input {
                display:none;
            }
        }

        &__scroll-bar {
            max-height:12em;
        }
        .ps__scrollbar-y-rail {
            z-index:1;
        }
    }




</style>