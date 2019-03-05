<template lang="pug">
    article.chat-main
        the-chat-main-header.chat-main__header
        scroll-bar.chat-main__body(ref="scrollbar", @ps-scroll-up="scrollLoad")
            ul.chat-main__list
                //li.chat-main__item.chat-main__item_history_more
                    base-btn(theme="link", @click="historyMessageLoad") Загрузить более раннюю история общения с посетителем


                li.chat-main__item(v-for="(days, daysIndex) in messageGroupDaysReverse",:key="days.index")
                    time.chat-main__date {{days[0]}}
                    ul.chat-main__messages
                        li.chat-main__messages-item(
                            v-for="(item, index) in days[1]",
                            :key="item.id" ,
                            :class="{'chat-main__messages-item_right':item.from_user_info.id == $store.state.user.profile.employee_id}"
                        )
                            base-people(
                                v-if="item.from_role_id!=9"
                                avatar-width="md",
                                :avatar-url="item.from_user_info.photo",
                                :name="item.from_user_info.name",
                                :text="item.body | messageBreakLine",
                                :time="item.time",
                                :right="item.from_user_info.id == $store.state.user.profile.employee_id",
                                :img="item.img"
                            )
                            p(v-else v-text="item.body" :style="{textAlign:'center'}")
                        template(v-if="(roomActiveUsersInvited.length || roomActiveUsersRecipient.length) && roomActiveIsAdmin")
                            li.chat-main__messages-item(
                                v-for="(item, index) in roomActiveUsersInvited",
                                :key="item.id",
                                :style="{textAlign:'center'}"
                                )
                                    |Ожидаем подтверждение от: {{item.first_name}}&nbsp;
                                    base-btn(theme="link" v-text="'Отменить приглашение'" @click="invitedCancel(item.id)")
                            li.chat-main__messages-item(
                                v-for="(item, index) in roomActiveUsersRecipient",
                                :key="item.id",
                                :style="{textAlign:'center'}"
                            )
                                |Ожидаем подтверждение от: {{item.first_name}}&nbsp;
                                base-btn(theme="link" v-text="'Отменить передачу'" @click="transferCancel(item.id)")

        footer.chat-main__footer
            the-chat-main-footer

</template>

<script>
    import { mapState } from 'vuex';
    import TheChatSystemMessages from '@/components/TheChatSystemMessages'
    import TheChatMainHeader from '@/components/TheChatMainHeader'
    import TheChatMainFooter from '@/components/TheChatMainFooter'

    import { viewModeChat,httpParams } from '@/mixins/mixins'


    import lodash_groupBy from 'lodash/groupBy'
    import moment from 'moment'
    export default {
        components:{
            TheChatSystemMessages,
            TheChatMainHeader,
            TheChatMainFooter
        },
        mixins:[viewModeChat,httpParams],
        filters: {
            messageBreakLine: function (value) {
                return   value.replace(/(\r\n|\n)/g, "<br>")
            }
        },
        data() {
            return {
                historyMessageLoadStart:true, //При прокрутке страницы, функция historyMessageLoad выполнялась раньше чем приходил ответ, из за этого лишние индификаторы были
                messageRun:true, //Если история закончилась, что бы больше не отправлял запросы
                messageList:[],
                limit:20,
                systemMessages:[]
            }
        },
        watch:{
            '$route'(){
                this.getRoomUserAll()
                this.historyMessageLoadStart=true;
                this.messageRun=true;
                this.messageList=[];
                this.historyMessageLoad().then(()=>{
                    this.scrollerPushDown(this.$refs.scrollbar)
                });
            },
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
            ...mapState(['roomActiveUsersInvited','roomActiveUsersRecipient','roomActiveIsAdmin']),

            messageGroupDaysReverse(){

                let list = Object.entries(this.messageGroupDays).reverse() //['14.15.2018',[messages]]
                list.forEach(item=>{
                    item[1] = item[1].reverse()
                })
                return list
            },
            messageGroupDays(){
                return lodash_groupBy(this.messageList, (item)=>{
                    return moment(item.time*1000).format('DD.MM.YYYY')
                    //moment(item.time*1000).format('HH:mm')
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
            this.getRoomUserAll()
            this.$root.$on('chatSystemMessages',(val)=>this.systemMessages.push(val))

            this.historyMessageLoad().then(()=>{
                this.scrollerPushDown(this.$refs.scrollbar)
            });

            this.$root.$on('messageAdd',(val)=>{
                this.messageList.unshift(val);
                setTimeout(()=>{
                    this.scrollerPushDown(this.$refs.scrollbar)
                },50)
            })

        },
        methods: {
            transferCancel(to_id){
                let data = this.httpParams.params
                data.to_id = to_id
                this.$http.put('guest-transfer-cancel',data)
            },
            invitedCancel(user_id){
                this.$http.post('chat-room-user-cancel-invitation',{
                    room_id:this.$store.state.roomActiveId,
                    user_id
                })
            },

            getRoomUserAll(){
                if (this.viewModeChat=='operators') return
                this.$http.get('chat-room-user-all',this.httpParams).then(({data})=>{

                    this.$store.commit('roomActive',data.data)

                })
            },
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
                console.log('historyMessageLoad');
                if(!this.messageRun) return
                if(!this.historyMessageLoadStart) return
                let params = {
                        last_msg_id:this.messageLastId,
                        limit: this.limit
                    },
                    guest_uuid,
                    site_id,
                    users_ids = []

                if (this.viewModeChat=='visitors' || this.viewModeChat=='process') {
                    let {guest_uuid,site_id } =  this.httpParams.params;
                         params.guest_uuid = guest_uuid,
                         params.site_id = site_id;

                }
                else {
                    params.users_ids = [this.$route.params.id,this.$store.state.user.profile.id];
                }


                this.historyMessageLoadStart=false;
                this.messageRun=false;

                return this.$http.get('message-history', {params}).then(({data})=>{
                    this.historyMessageLoadStart=true;
                    let {count,messages,users} = data.data;
                    if (!count) return

                    this.messageRun=count;
                    this.messageList.push(...messages);
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