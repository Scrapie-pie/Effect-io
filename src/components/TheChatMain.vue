<template lang="pug">
    article.chat-main
        the-chat-main-header.chat-main__header(v-if!="viewModeChat!='common'")
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
                            :class="{'chat-main__messages-item_right':item.from_user_info.id != $store.state.user.profile.employee_id}"
                        )
                            base-people(
                                v-if="item.from_role_id!=9"
                                avatar-width="md",
                                :avatar-url="item.from_user_info.photo",
                                :avatar-stub="item.from_user_info.photo_stub",
                                :name="item | name(visitorInfo)",
                                :text="item.body | messageBreakLine | wrapTextUrls",
                                :time="item.time",

                                :right="item.from_user_info.id != $store.state.user.profile.employee_id",
                                :img="item.img",
                                :files="item.files || []"
                            )
                            p(v-else v-text="item.body" :style="{textAlign:'center'}")
                        li.chat-main__messages-item.chat-main__messages-item_right(v-if="showVisitorTypingLive")
                            base-people(
                                :key="'visitorTypingLive'"
                                avatar-width="md",
                                :time="(new Date).getTime() / 1000"
                                :avatar-url="visitorInfo.photo",
                                :avatar-stub="visitorInfo.photo_stub"
                                :name="visitorInfo.name",
                                :text="visitorTypingLive | messageBreakLine",
                                :right="true",
                            )

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
    import wrapTextUrls from '@/modules/wrapTextUrls'



    import { viewModeChat,httpParams,scrollbar } from '@/mixins/mixins'


    import lodash_groupBy from 'lodash/groupBy'
    import lodash_find from 'lodash/find'
    import moment from 'moment'
    export default {
        components:{
            TheChatSystemMessages,
            TheChatMainHeader,
            TheChatMainFooter
        },
        mixins:[viewModeChat,httpParams,scrollbar],
        filters: {
            messageBreakLine: function (value) {
                return   value.replace(/(\r\n|\n|&lt;br&gt;)/g, "<br>") // из виджета &lt;br&gt;
            },
            name(item,visitorInfo){
                if(item.from_user_info.uuid) return visitorInfo.name
                else return item.from_user_info.name
            },
            wrapTextUrls(text){
                return wrapTextUrls(text)
            }
        },
        data() {
            return {
                historyMessageLoadStart:true, //При прокрутке страницы, функция historyMessageLoad выполнялась раньше чем приходил ответ, из за этого лишние индификаторы были
                messageRun:true, //Если история закончилась, что бы больше не отправлял запросы
                messageList:[],
                limit:20,
                systemMessages:[],
                visitorTypingLive:'',
            }
        },
        watch:{
            '$route'(){
                this.getRoomUserAll()
                this.historyMessageLoadStart=true;
                this.messageRun=true;
                this.messageList=[];
                this.clearTimerVisitorTypingLive=null,
                this.historyMessageLoad().then(()=>{
                    this.scrollbarScrollerPush(this.$refs.scrollbar)
                });
            },
            messageDays(val){
                return val
            },
            compVisitorTypingLive(val,oldVal){
                this.visitorTypingLive=val;
                clearTimeout(this.clearTimerVisitorTypingLive);
                this.clearTimerVisitorTypingLive = setTimeout(()=>{
                    this.visitorTypingLive=''
                },1000 * 20) //секунд

                if(!val.length===!oldVal.length) {


                } else {
                    console.log('visitorTypingLive',!val.length===!oldVal.length);
                    setTimeout(()=>{
                        this.scrollbarScrollerPush(this.$refs.scrollbar)
                    },50)


                }

            },


        },
        computed:{
            ...mapState(['roomActiveUsersInvited','roomActiveUsersRecipient','roomActiveIsAdmin','roomActive']),
            showVisitorTypingLive(){
                if(this.viewModeChat!=='visitors') return false
             let {guest_uuid,site_id}  = this.roomActive.visitor,
                 {params} = this.httpParams
                //console.log('showVisitorTypingLive',guest_uuid+site_id , params.guest_uuid+ params.site_id,this.visitorTypingLive.length);
                 console.log(guest_uuid + site_id === params.guest_uuid + params.site_id)
                return (guest_uuid + site_id === params.guest_uuid + params.site_id) && this.visitorTypingLive.length
            },
            compVisitorTypingLive(){
                let {typingLive} = this.roomActive.visitor;
                if(typingLive) typingLive +='...<br><small>(гость печатает сообщение)</small>';
                return typingLive
            },

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
            messageListWrapTextUrls(){

            },
            messageListReverse(){
                let list = this.messageList.slice();
                return list.reverse()
            },
            visitorInfo(){
                return this.$store.state.visitors.itemOpen
            },
        },
        created() {
            this.getRoomUserAll()
            this.$root.$on('chatSystemMessages',(val)=>this.systemMessages.push(val))

            this.historyMessageLoad().then(()=>{
                this.scrollbarScrollerPush(this.$refs.scrollbar)
            });

            this.$root.$on('messageAdd',(val)=>{
                if(val.socket){//Todo Временное решение, на проверку дубликатов, пока Симон не исправит
                    let findIndex = this.messageList.findIndex(item=>item.id===val.id)
                    console.log('дубликат',findIndex);
                    if(findIndex ===-1) {
                        this.messageListUnshift(val)
                    }
                }  else {
                    this.messageListUnshift(val)
                }



            })

            this.$root.$on('messageVisitorUpdateName',({name,uuid,site_id})=>{
                lodash_find(this.messageList,{site_id,from_user_info:{uuid}})
                this.messageList.forEach(item=>{
                    if(item.site_id+item.from_user_info.uuid===site_id+uuid) item.from_user_info.name=name
                })
            })

        },
        methods: {
            messageListUnshift(val){
                console.log('messageListUnshift',val);
                this.messageList.unshift(val);
                setTimeout(()=>{
                    this.scrollbarScrollerPush(this.$refs.scrollbar)
                },50)
            },
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
                if (this.viewModeChat==='operators' || this.viewModeChat==='common') return
                this.$http.get('chat-room-user-all',this.httpParams).then(({data})=>{
                    data.data.visitor =  this.httpParams.params;
                    //console.log(this.httpParams);
                    this.$store.commit('roomActive',data.data)

                })
            },
            scrollLoad(e){

                if(this.scrollLoadAllow(e,'up')) this.historyMessageLoad()

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

                if (this.viewModeChat==='visitors' || this.viewModeChat==='process') {
                    console.log(this.$route);
                    let {guest_uuid,site_id } =  this.httpParams.params;
                         params.guest_uuid = guest_uuid,
                         params.site_id = site_id;

                }
                else if(this.viewModeChat==='operators') {
                    params.users_ids = [this.$route.params.id,this.$store.state.user.profile.id];
                }
                else if(this.viewModeChat==='common') {
                    params.room_id = this.$store.state.user.profile.common_room_id
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
        $color_bg_message:glob-color('info-lighten');

        display:flex;
        flex-flow:column;
        height:100%;
        min-width:0;//для шаблонов, чтобы работало text-overflow: ellipsis;

        &__item {
            padding-top:calc-em(25);

            &_history_more {text-align:center}

            .base-people__text {
                white-space:normal;
            }


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
            .base-people {
                margin-right:14%;
            }
            &_right {
                text-align:right;
                .base-people {
                    margin-left:14%;
                    margin-right:auto;

                    text-align:left;
                    display:inline-flex;
                    &__inner {
                        background-color:$color_bg_message;
                    }
                    &__name {
                        margin-left:auto;
                    }
                }
            }

        }



    }
</style>