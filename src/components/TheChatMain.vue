<template lang="pug">
    article.chat-main
        the-chat-main-header.chat-main__header(v-if!="!['search','visor','common'].includes(viewModeChat)")
        .chat-main__header(v-if="['search','visor'].includes(viewModeChat)")
            h1.chat-main__header-title Просмотр диалога: {{chat_id}}

        scroll-bar.chat-main__body(ref="scrollbar", @ps-scroll-up="scrollLoad", :class="{'chat-main__body_simple':['search','visor'].includes(viewModeChat)}")
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
                            template(v-if="!['search','visor'].includes(viewModeChat)")
                                template(v-if="item.from_role_id!=9")
                                    base-people(v-bind="item.basePeopleOptions")



                                input-emoji.chat-main__messages-sys(tag="p" v-else type="text", :text="item.body | wrapTextUrls")
                            template(v-else)
                                message-item(v-bind="item.basePeopleOptions")

                        li.chat-main__messages-item.chat-main__messages-item_right(
                            v-if="messageGroupDaysReverse.length-1===daysIndex && showVisitorTypingLive"
                        )

                            base-people(
                                :key="'visitorTypingLive'"
                                avatar-width="md",
                                :time="(new Date).getTime() / 1000",
                                :avatar-url="visitorInfo.photo",
                                :avatar-stub="visitorInfo.photo_stub",
                                :name="visitorInfo.name",
                                :text="visitorTypingLive | messageBreakLine",
                                :right="true",
                            )

                        template(v-if="(roomActiveUsersInvited.length || roomActiveUsersRecipient.length) && roomActiveIsAdmin")
                            li.chat-main__messages-item.chat-main__messages-sys(
                                v-for="(item, index) in roomActiveUsersInvited",
                                :key="item.id",

                                )
                                    |Ожидаем подтверждение от: {{item.first_name}}&nbsp;
                                    base-btn(theme="link" v-text="'Отменить приглашение'", @click="invitedCancel(item.id)")
                            li.chat-main__messages-item.chat-main__messages-sys(
                                v-for="(item, index) in roomActiveUsersRecipient",
                                :key="item.id",

                            )
                                |Ожидаем подтверждение от: {{item.first_name}}&nbsp;
                                base-btn(theme="link" v-text="'Отменить передачу'", @click="transferCancel(item.id)")

        footer.chat-main__footer(v-if="!['search','visor'].includes(viewModeChat)")
            the-chat-main-footer

</template>

<script>
    import { mapState } from 'vuex';
    import TheChatSystemMessages from '@/components/TheChatSystemMessages'
    import TheChatMainHeader from '@/components/TheChatMainHeader'
    import TheChatMainFooter from '@/components/TheChatMainFooter'
    import MessageItem from '@/components/MessageItem'
    import {wrapTextUrls} from '@/modules/modules'
    import {datetimeDMY} from '@/modules/datetime'
    import inputEmoji from '@/components/inputEmoji';



    import { viewModeChat,httpParams,scrollbar } from '@/mixins/mixins'


    import lodash_groupBy from 'lodash/groupBy'
    import lodash_find from 'lodash/find'

    export default {
        components:{
            inputEmoji,
            TheChatSystemMessages,
            TheChatMainHeader,
            TheChatMainFooter,
            MessageItem,
        },
        mixins:[viewModeChat,httpParams,scrollbar],
        filters: {
            wrapTextUrls,

            messageBreakLine: function (value) {
                return   value.replace(/(\r\n|\n|&lt;br&gt;)/g, "<br>") // из виджета &lt;br&gt;
            },
            deliveredText(numb) {
                if(numb==0) return 'Доставляется'
                if(numb==1) return 'Доставлено'
                if(numb==2) return 'Не доставлено'
                return
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
                chat_id:null
            }
        },
        watch:{

            '$route'(to,from){



                console.log('$route TheChatMain.vue');
                this.getRoomUserAll()
                this.historyMessageLoadStart=true;
                this.messageRun=true;
                this.messageList=[] //Todo баг не сбрасывается до []


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
            ...mapState(['roomActiveUsersInvited','roomActiveUsersRecipient','roomActiveIsAdmin','roomActive','roomActiveId']),
            showVisitorTypingLive(){


                if(['visitors','visor','search'].includes(this.viewModeChat)) {

                    let {guest_uuid,site_id}  = this.roomActive.visitor,
                        {params} = this.httpParams
                    //console.log('showVisitorTypingLive',guest_uuid+site_id , params.guest_uuid+ params.site_id,this.visitorTypingLive.length);

                    return (guest_uuid + site_id === params.guest_uuid + params.site_id) && this.visitorTypingLive.length
                }

            },
            compVisitorTypingLive(){
                let {typingLive} = this.roomActive.visitor;
                if(typingLive) typingLive +='...<br><small>(гость печатает сообщение)</small>';
                return typingLive
            },

            messageGroupDaysReverse(){

                let list = Object.entries(this.messageGroupDays).reverse() //['14.15.2018',[messages]]
                list.forEach(itemParent=>{
                    itemParent[1] = itemParent[1].map(item=>{

                        item.basePeopleOptions = {
                            roleId:item.from_role_id, //message-item component
                            avatarWidth:"md",
                            avatarUrl:item.from_user_info.photo,
                            avatarStub:item.from_user_info.photo_stub,
                            name:this.name(item,this.visitorInfo),
                            text:this.$options.filters.wrapTextUrls(this.$options.filters.messageBreakLine(item.body)) ,
                            time:item.time,
                            loaderMessage:item.delivery_status,
                            right:item.from_user_info.id !== this.$store.state.user.profile.employee_id,
                            files:item.files || []
                        }



                        return item
                    })
                    itemParent[1] = itemParent[1].reverse()
                })

                return list
            },
            messageGroupDays(){
                return lodash_groupBy(this.messageList, (item)=>{
                    return datetimeDMY(item.time)
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
            console.log('created $on messageAd');



            this.getRoomUserAll()
            this.$root.$on('chatSystemMessages',(val)=>this.systemMessages.push(val))

            this.historyMessageLoad().then(()=>{
                this.scrollbarScrollerPush(this.$refs.scrollbar)
            });

            this.$root.$on('messageAdd',this.emitMessageAdd)
            this.$root.$on('messageDelivered',this.emitMessageDelivered)

            this.$root.$on('messageVisitorUpdateName',({name,uuid,site_id})=>{
                lodash_find(this.messageList,{site_id,from_user_info:{uuid}})
                this.messageList.forEach(item=>{
                    if(item.site_id+item.from_user_info.uuid===site_id+uuid) item.from_user_info.name=name
                })
            })

        },
        beforeDestroy(){
            this.$root.$off('messageAdd',this.emitMessageAdd)
            this.$root.$off('messageDelivered',this.emitMessageDelivered)
        },

        methods: {

            name(item,visitorInfo){
                if(item.from_user_info.uuid) return visitorInfo.name
                else return item.from_user_info.name
            },
            emitMessageDelivered(val){
                let findIndex = this.messageList.findIndex(item=>item.id===val.message_id)
                console.log('emitMessageDelivered',findIndex,val);
                if(findIndex !==-1) {
                    console.log(this.messageList[findIndex]);
                    this.$set(this.messageList[findIndex],'delivery_status',val.delivery_status)
                } else {
                    setTimeout(() => {
                        this.emitMessageDelivered(val);
                    }, 1000);
                }
            },
            emitMessageAdd(val){
                //console.log('this.$root.$on(\'messageAdd\'');
                if(val.socket){//Todo Временное решение, на проверку дубликатов, пока Симон не исправит
                    let findIndex = this.messageList.findIndex(item=>item.id===val.id)

                    if(findIndex ===-1) {
                        console.log('дубликат',findIndex,val.id,this.messageList);

                        this.messageListUnshift(val)
                    }
                }  else {

                    this.messageListUnshift(val)
                }
            },
            messageListUnshift(val){
                this.messageList.unshift(val);
                setTimeout(()=>{
                    this.scrollbarScrollerPush(this.$refs.scrollbar)
                },50)
            },
            transferCancel(to_id){
                let data = this.httpParams.params
                data.to_id = to_id
                this.$http.put('chat-room-user/transfer-cancel',data)
            },
            invitedCancel(user_id){
                this.$http.post('chat-room-user/cancel-invitation',{
                    room_id:this.roomActiveId,
                    user_id
                })
            },

            getRoomUserAll(){
                if (this.viewModeChat==='operators') return
                if (this.viewModeChat==='common') {
                    this.$store.commit('roomActive',[{room_id:this.$store.state.user.profile.common_room_id}])
                    return
                }

                if (this.httpParams) {
                    this.$http.get('chat-room-user/all', this.httpParams).then(({data}) => {
                        data.data.visitor = this.httpParams.params;
                        //console.log(this.httpParams);
                        this.$store.commit('roomActive', data.data)

                    })
                }
            },
            scrollLoad(e){

                if(this.scrollLoadAllow(e,'up')) this.historyMessageLoad()

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

                if (this.viewModeChat==='visitors' || this.viewModeChat==='process') {

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
                else if(['search','visor'].includes(this.viewModeChat)) {
                    let {guest_uuid,site_id,chat_id } =  this.httpParams.params;
                         params.guest_uuid = guest_uuid,
                        params.site_id = site_id;
                        params.chat_id = chat_id;
                }


                this.historyMessageLoadStart=false;
                this.messageRun=false;
                console.log('this.messageList',this.messageList);
                return this.$http.get('message/history', {params}).then(({data})=>{

                    this.historyMessageLoadStart=true;
                    let {count,messages,users} = data.data;
                    if (!count) return

                    this.chat_id = messages[0].chat_id;

                    this.messageRun=count;
                    //console.log('historyMessageLoad');

                    //console.log('messages',messages);
                    this.messageList.push(...messages);
                    //console.log('this.messageList.push',this.messageList);
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

        &__header-title {
            @extend %h4;
            margin-bottom:0;
        }

        &__item {
            padding-top:calc-em(25);

            &_history_more {text-align:center}

            .base-people__text {
                white-space:normal;
            }


        }


        &__body:not(&__body_simple){
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
        &__messages-sys {
            text-align:center;
        }


    }
</style>