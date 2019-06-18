<template lang="pug">
    form.select-tags
        fieldset.select-tags__box
            legend.select-tags__title Выберите тэг
            .select-tags__controls
                base-filter-search.select-tags__controls-search(
                    :item-list="itemList",
                    @result="(val)=>filterSearchResult=val",
                    field-name="tag"
                )
                scroll-bar.select-tags__controls-scrollbar
                    ul.select-tags__controls

                        li.select-tags__controls-item(
                            v-for="(item, index) in filterSearchResult" :key="item.id",
                        )
                            base-radio-check(
                                name="tag"
                                type="radio"
                                v-model="model"
                                :value="item"
                            ) {{item.tag}}
</template>

<script>
    import {httpParams} from '@/mixins/mixins'
    import { mapGetters,mapActions } from 'vuex';
export default {
    mixins:[httpParams],
    name: "select-tags", 
    data() {
        return {
            model:'',
            filterSearchResult:[]
        }
    },
    computed:{
        ...mapGetters('tags',[
            'itemList'
        ]),



    },
    watch:{
        model(val){
            if(val) {

                let data = this.httpParams.params
                data.tag_id = val.id
                this.setTagChat(data)
            }
        }
    },
    methods:{
        ...mapActions('tags',[
            'setTagChat'
        ])}
}
</script>

<style lang="scss">
    .select-tags{
        $el:'.select-tags';
        $color_hover:glob-color('info-lighten');
        $transition:$glob-trans;

        width:415px;


        &__title {
            text-align:left;
            margin-bottom:2em;
        }

            .base-radio-check{

                &__input:checked + .base-radio-check__text-wrap{
                    background-color:$color_hover
                }
                &__text-wrap{
                    padding:calc-em(5) calc-em(15);
                    white-space:nowrap;
                    transition:$transition;
                    &:before {display:none}
                }
                &__check {display:none}
                &__text {margin-left:0}
            }
            #{$el}__box{padding-left:0;padding-right:0}

        &__controls{

            &-scrollbar {
                margin-right:-1*calc-em(15);
                padding-right:calc-em(15);
                max-height:85vh;
            }
            &-search {
                margin-bottom:calc-em(15);
                max-width:244px;
            }

            &-item {
                #{$el}_checkbox &:not(&_main) {
                    margin-left:calc-em(25);
                }

                &+& {
                    margin-top:calc-em(5);
                }
                white-space:nowrap;
            }
        }

    }


</style>