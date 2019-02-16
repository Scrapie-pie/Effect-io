<template lang="pug">
    form.last-messages
        .last-messages__search
            base-field(type="search" name="search" v-model="search" theme="soft")
        scroll-bar.last-messages__scrollbar
            ul.last-messages__list(v-if="viewModeChat=='visitors'")
                li.last-messages__item(
                    v-for="(item, index) in visitorsList",
                    :key="item.uuid+item.site_id",
                    :class="{'last-messages__item_warning':item.warning}"
                )

                    router-link.last-messages__btn(
                        :to="{name:'chatId',params: { id: item.uuid,site_id:item.site_id}}"
                        v-text="`${item.name}:${item.text}`")
                    base-people.last-messages__people(
                        :avatar-url="item.photo"
                        :name="item.name",
                        :text="item.last_message",
                        :bg-text-no-fill="true",
                        :channel-name="item.channel",
                        :count="item.count"
                        hidden
                    )

            ul.last-messages__list(v-else)
                li.last-messages__item(
                v-for="(item, index) in operatorListSearch",
                :key="item.id",
                :class="{'last-messages__item_warning':item.warning}"
                )

                    router-link.last-messages__btn(
                    :to="{name:'chat',params: { id: item.uuid},query:{site:item.site_id}}"
                    v-text="`${item.name}:${item.text}`")
                    base-people.last-messages__people(
                    :avatar-url="item.photo"
                        :name="item.fullName",
                    :text="'В API нет последнего сообщения'",
                    :bg-text-no-fill="true",
                    :count="item.count"
                    hidden
                    )
</template>

<script>
    import { viewModeChat } from '@/mixins/mixins'
    export default {
        mixins:[viewModeChat],

        data() {
            return {
                search:'',
                warning:true,

            }
        },
        computed:{
            styleClass(){

            },
            itemList(){
                if(this.$route.name === "teamChat") return this.operatorList
                else return this.visitorsList()
            },
            visitorsList(){

                return this.$store.getters['visitors/all']
            },
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
            }
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

            &:hover,
            &_active{
                background-color:$color_bg-hover;
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
            z-index:1;
            position:relative;

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
            background-color:transparent;
            border-color:transparent;
            font-size:0;
        }
    }
</style>