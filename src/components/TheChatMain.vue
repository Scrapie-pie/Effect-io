<template lang="pug">
    article.chat-main
        the-chat-main-header.chat-main__header
        scroll-bar.chat-main__body(ref="scrollbar", @ps-scroll-up="scrollLoad")
            ul.chat-main__list
                //li.chat-main__item.chat-main__item_history_more
                    base-btn(theme="link", @click="historyMessageLoad") Загрузить более раннюю история общения с посетителем


                li.chat-main__item(v-for="(days, daysIndex) in messageGroupDays",:key="days.index")
                    time.chat-main__date {{daysIndex}}
                    ul.chat-main__messages
                        li.chat-main__messages-item(
                            v-for="(item, index) in days",
                            :key="item.id" ,
                            :class="{'chat-main__messages-item_right':item.from_user_info.id == $store.state.user.profile.employee_id}"
                        )
                            base-people(
                                avatar-width="md",
                                :avatar-url="item.from_user_info.photo"
                                :name="item.from_user_info.name",
                                :text="item.body",
                                :time="item.time",
                                :right="item.from_user_info.id == $store.state.user.profile.employee_id",
                                :img="item.img"
                            )

            //ul.chat-main__list
                li.chat-main__item.chat-main__item_history_more
                    base-btn(theme="link" @click="historyMessageLoad") Загрузить более раннюю история общения с посетителем
                li.chat-main__item
                    time.chat-main__date 29 ноября 2017

                    ul.chat-main__messages
                        li.chat-main__messages-item(v-for="(item, index) in messageListReverse",:key="item.id" :class="{'chat-main__messages-item_right':item.right}")
                            base-people(
                                avatar-width="md",
                                :name="item.from_user_info.name",
                                :text="item.body",
                                :time="item.time",
                                :right="item.right",
                                :img="item.img"
                            )
                    the-chat-system-messages
        footer.chat-main__footer
            the-chat-main-footer

</template>

<script>
    import TheChatSystemMessages from '@/components/TheChatSystemMessages'
    import TheChatMainHeader from '@/components/TheChatMainHeader'
    import TheChatMainFooter from '@/components/TheChatMainFooter'

    import { viewModeChat } from '@/mixins/mixins'

    import _ from 'underscore'
    import moment from 'moment'
    export default {
        components:{
            TheChatSystemMessages,
            TheChatMainHeader,
            TheChatMainFooter
        },
        mixins:[viewModeChat],

        data() {
            return {
                historyMessageLoadStart:true, //При прокрутке страницы, функция historyMessageLoad выполнялась раньше чем приходил ответ, из за этого лишние индификаторы были
                messageRun:true, //Если история закончилась, что бы больше не отправлял запросы
                messageList:[],
                rooms_id:null,
                tempList:[

                ],
                limit:20
            }
        },
        watch:{
            messageDays(val){
                return val
            }
          /*  messageList(val){
                if (val) {
                    let mas = val.slice();
                    this.messageListReverse = mas.reverse();


                }
            }*/
        },
        computed:{
            messageGroupDays(){
                return _.groupBy(this.messageListReverse, (item)=>{
                    return moment(item.time*1000).format('DD.MM.YYYY')
                })
            },
            messageLastId(){
                return (this.messageListReverse[0]) ? this.messageListReverse[0].id : null;
            },
            messageListReverse(){
                let list = this.messageList.slice();

                return list.reverse()
            },
            member(){
                return {
                    [this.visitorInfo.uuid]: this.visitorInfo.name
                }
            },
            visitorInfo(){
                return this.$store.state.visitors.itemOpen
            },
        },
        created() {
            this.historyMessageLoad();
        },
        mounted() {
            setTimeout(()=>{
                this.scrollerPushDown(this.$refs.scrollbar)
            },500)
        },
        methods: {

            scrollerPushDown(scrollbar){
                let scrollerEl = scrollbar.$el,
                    valPx = this.scrollerPxToPercent(scrollerEl, 100);
                scrollerEl.scrollTop = valPx;
                scrollbar.update()
            },
            scrollerPxToPercent(scroller,scrollTop){
                let height = scroller.clientHeight,
                    scrollHeight = scroller.scrollHeight - height,
                    percent = Math.floor(scrollTop * scrollHeight /100);
                return percent
            },
            scrollLoad(e){
                const scroller = e.target
                let height = scroller.clientHeight,
                scrollHeight = scroller.scrollHeight - height,
                scrollTop = scroller.scrollTop,
                percent = Math.floor(scrollTop / scrollHeight * 100);

                if ( percent < 25 ) this.historyMessageLoad()
            },
            historyMessageLoad(){
                if(!this.messageRun) return
                if(!this.historyMessageLoadStart) return
                let params = {
                        last_msg_id:this.messageLastId,
                        limit: this.limit
                    },
                    guest_uuid,
                    site_id,
                    users_ids = []

                if (this.viewModeChat=='visitors') {
                         params.guest_uuid = this.$store.state.visitors.itemOpen.uuid,
                         params.site_id = this.$store.state.visitors.itemOpen.site_id;

                }
                else {
                    params.users_ids = [this.$route.params.id,this.$store.state.user.profile.id];
                }




                this.historyMessageLoadStart=false;
                this.messageRun=false;

                this.$http.get('message-history', {params}).then(({data})=>{
                    this.historyMessageLoadStart=true;
                    if (!data.data.count) return
                    this.messageRun=data.data.count;
                    this.messageList.push(...data.data.messages);

                    this.$store.commit('user/roomIdOpen',data.data.messages[0].room_id)
                    console.log(_.isEmpty(data.data.messages));
                })
            }
        },


    }
</script>

<style lang="scss">
    .chat-main{
        $color_border:glob-color('border');
        $color_bg_date:glob-color('light');

        display:flex;
        flex-flow:column;
        height:100%;

        &__item {
            padding-top:calc-em(25);

            &_history_more {text-align:center}
        }


        &__body{
            margin-top:auto;
            height:auto;

        }
        &__list,&__header {
            padding-right:calc-em(15);

        }

        &__date{
            position:relative;
            display:block;
            text-align:center;
            margin:0 0 1.5em;

            &::before{
                content:'';
                border-top:1px solid $color_border;
                position:absolute;
                left:0;
                right:0;
                top:50%;
                z-index:-1;
            }
            &::after{
                content:'';
                display:block;
                @extend %full-abs;
                z-index:-1;
                margin:0 auto;
                width:98px;
                background:$color_bg_date;
            }
        }

        &__list{
            margin-bottom:calc-em(25);
        }
        &__messages-item{
            & + &{
                margin-top:calc-em(15);
            }

            .base-people {

                align-items:flex-start;
            }

            &_right {
                text-align:right;
                .base-people {
                    display:inline-flex;

                }
            }

        }



    }
</style>