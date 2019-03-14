<template lang="pug">
    form.last-messages
        .last-messages__search
            filter-search(
                :item-list="itemListSortUnread"
                fieldName="fullName" ,
                @result="(val)=>filterSearchResult=val",
                @text="(val)=>search=val"
            )
        scroll-bar.last-messages__scrollbar
            ul.last-messages__list
                li.last-messages__item(
                    v-for="(item, index) in filterSearchResult",
                    :key="item.id",
                    :class="classObject(item)"
                )
                    router-link.last-messages__btn(
                        :to="{name:'teamChat',params:{id:item.id}}"
                        v-text="`${item.fullName}:${item.last_message}`"
                    )
                    base-people.last-messages__people(
                        :status="item.online",
                        :avatar-url="item.photo",
                        :name="item.fullName",
                        :text="item.last_message | lastMessage(item) | wrapTextUrls",
                        :bg-text-no-fill="true",
                        :count="item.unread.length"
                        hidden
                    )
</template>

<script>
    import _ from 'underscore'
    import filterSearch from '@/components/FilterSearch'
    import { viewModeChat,httpParams } from '@/mixins/mixins'
    import wrapTextUrls from '@/modules/wrapTextUrls'
    export default {
        components:{filterSearch},
        mixins:[viewModeChat,httpParams],
        filters: {
            lastMessage: function (value,item) {
                if(!value) return '';
                if(item.first_name !== item.last_message_author) return 'Вы: '+value
                return value
            },
            wrapTextUrls
        },
        data() {
            return {
                search:'',
                filterSearchResult:[],
            }
        },
        computed:{
            itemList(){
                return this.$store.getters['operators/all']
            },
            itemListSortUnread(){
                return _.sortBy(this.itemList,(item)=>{
                    return -item.unread.length
                });
            },
            itemListSortActiveFirst() {
                let itemActive,
                list = this.itemListSortUnread.filter((item,index)=>{
                    if(item.id === this.httpParams.params.id){
                        itemActive = item;
                        return false
                    }
                    else return true
                });
                if (list.length)  list.unshift(itemActive);
                return list
            }
        },
        created(){

        },
        methods:{
            classObject(item){
                return {
                    'last-messages__item_active':item.id === this.httpParams.params.id,
                    'last-messages__item_warning':item.warning
                }
            }
        }

    }
</script>

<style lang="scss">

    .last-messages{
        $color_bg-hover:glob-color('border');
        $color_bg-error:glob-color('error');
        $transition:$glob-trans;

        .ps__scrollbar-y-rail {
            z-index:2;
        }

        &__search{
            padding-left:calc-em(10);
            padding-right:calc-em(10);
        }

        &__scrollbar {
            height:100%;
        }

        &__list{
            padding-top:calc-em(10);
        }

        &__item{
            position:relative;
            transition:$transition;
            padding-left:calc-em(10);
            padding-top:calc-em(10);
            padding-bottom:calc-em(10);

            &:hover,&_active {
                background-color:$color_bg-hover;
            }

            &:hover,
            &_active{
                //background-color:$color_bg-hover;
            }

            &_warning {
                &::before {
                    content:'';
                    @extend %full-abs;
                    background-color:$color_bg-error;
                    opacity:.5;
                    z-index:0;
                }
            }
        }

        &__people{
            z-index:2;
            position:relative;
            pointer-events:none;

            .base-people__inner{
                flex:1 0 60%;
                width:60%;
                min-width:0;
            }
        }

        &__btn{
            @extend %full-abs;
            z-index:2;
            width:100%;
            height:100%;
            border-color:transparent;
            font-size:0;

        }
    }
</style>