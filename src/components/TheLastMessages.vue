<template lang="pug">
    form.last-messages
        .last-messages__search
            base-field(type="search" name="search" v-model="search" theme="soft")
        scroll-bar.last-messages__scrollbar
            ul.last-messages__list(v-if="viewModeChat=='operators'")
                li.last-messages__item(
                v-for="(item, index) in operatorListSortUnread",
                :key="item.id",
                :class="{'last-messages__item_warning':item.warning}"
                )

                    router-link.last-messages__btn(
                    :to="{name:'teamChat',params:{id:item.id}}"
                    v-text="`${item.fullName}:${item.last_message}`"
                    active-class="last-messages__btn_active"
                    )
                    base-people.last-messages__people(
                        :status="item.online",
                        :avatar-url="item.photo",
                        :name="item.fullName",
                        :text="item.last_message | lastMessage(item)",
                        :bg-text-no-fill="true",
                        :count="item.unread.length"
                        hidden
                    )
</template>

<script>
    import _ from 'underscore'
    import { viewModeChat } from '@/mixins/mixins'
    export default {
        mixins:[viewModeChat],
        filters: {
            lastMessage: function (value,item) {
                if(!value) return '';
                if(item.first_name !== item.last_message_author) return 'Вы: '+value
                return value
            }
        },
        data() {
            return {
                search:'',
                warning:true,

            }
        },
        computed:{
            operatorList(){

                return this.$store.getters['operators/all']
            },
            operatorListSearch(){
                let list = this.operatorList;

                list = list.filter(item => {
                    var regexp = new RegExp(this.search, 'ig')

                    if (item.fullName.match(regexp) == null) return 0
                    return true
                })

                // console.log(list);
                return list
            },
            operatorListSortUnread(){
                return _.sortBy(this.operatorListSearch,(item)=>{
                    console.log(item.unread.length);
                    return !item.unread.length
                });



            },
        },
        created(){

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
            &:hover,&_active {
                background-color:$color_bg-hover;
            }
        }
    }
</style>