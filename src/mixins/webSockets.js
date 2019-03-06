import config from "@/config/index";

import browserNotification from '@/modules/browserNotification'
import {browserNotificationMessage} from '@/modules/browserNotification'
import {httpParams,viewModeChat} from '@/mixins/mixins'
import settings from "@/routes/settings";
export default {
    mixins:[httpParams,viewModeChat],
    computed:{
        userId(){
            return this.$store.state.user.profile.id
        }
    },
    watch:{
        userId(val){
            if(val) this.webSocketInit()
        }
    },
    methods: {
        playSoundFile(nameFile) {
            let{settings,sounds} = this.$store.state.user.settings
                let index =  settings[nameFile];
                let audio = new Audio(config.api_server.split('/app')[0] + sounds[index].file);
                audio.volume = .5;
                audio.play();
        },
        webSocketInit() {
            this.$socket.disconnect();
            this.$socket.query = `uuid=${this.userId}`;
            this.$socket.io.opts.query = `uuid=${this.userId}`;
            this.$socket.open();
            return

            try {

                let socket = io(config.api_websocket, {
                    query: {
                        uuid:  this.userId
                    }
                });

                socket.on("connect", () => {
                    console.log("connected");
                });

                socket.on("connect_error", () => {
                    console.log("connect_error");
                });

                socket.on("connect_timeout", () => {
                    console.log("connect_timeout");
                });

                socket.on("update-branches", function (payload) {
                    console.log("update-branches", payload);
                });

                socket.on("update-employees", function (payload) {
                    console.log("update-employees", payload);
                });

                socket.on("new-message", function (payload) {
                    console.log("new-message", payload);
                });


            } catch (err) {

                browserNotification('Сбой на сервере сокетов')

            }
        },
    },
    sockets: {
        "hot-guest"(val){
            console.log('hot-guest',val);
            this.$store.commit('visitors/messageHot',{val,set:true})
        },
        "typing-live"(val){
            console.log('typing-live',val);

            this.$store.commit('roomActiveTypingLive',val)
        },
        "new-message"(val) { //переместил сюда, что бы список на странице team обновлялся
            console.log('sockets new-message',val);





            if (val.from_user_info && val.from_user_info.id) {
                if(this.$store.state.user.profile.employee_id === val.from_user_info.id) return; //Принимаем только чужие сообщения
            }
            //else val.from_user_info = {id:null} // для совместимости, что бы шаблон не ломался в сообщениях, когда приходят системные сообщения




            if (val.site_id && val.room_id === this.$store.state.roomActiveId) { // если есть val.site_id значит общение в диалогах
                this.$root.$emit('messageAdd',val) // Нужно, что бы чужое сообщение оказалось каждое в своем чате
            }

            if(
                this.viewModeChat==='operators' && //иначе на других страницах this.httpParams.params.id вылетала ошибка
                !val.site_id && (val.from_user_info.user_id == this.httpParams.params.id)) {this.$root.$emit('messageAdd',val)}

            /*   if(val.from_role_id === 9 && val.site_id) {
                   this.$store.commit('visitors/selfMessageLastUpdate',val)
                   this.$store.commit('user/unreadUpdate',['guest',1])
                   return
               }*/

            if(val.status === "unprocessed") {
                return  this.$store.commit('visitors/processMessageLastUpdate',val)
            }



            if(val.site_id) {
                let {guest_uuid,site_id} = this.httpParams.params
                if(val.from_user_info.uuid+val.site_id === guest_uuid+site_id) { //Если это сообщение посетителя в чате то нужно очистить TypingLive
                    this.$store.commit('roomActiveTypingLive',{message:'',guest_uuid,site_id})
                    this.playSoundFile('sound_new_guest_message')

                }


                this.$store.commit('visitors/selfMessageLastUpdate',val)
                this.$store.commit('user/unreadUpdate',['guest',1]);



                browserNotificationMessage(val).then(click=>{
                    if(click==='toLink') {
                        let {uuid,site_id} =  val
                        this.$router.push({name:'chatId',params: { uuid,site_id}})
                    }

                })
            } else {
                this.$store.commit('operators/messageLastUpdate',val)
                this.$store.commit('user/unreadUpdate',['private',1])


                this.playSoundFile('sound_new_operator_message')
                browserNotificationMessage(val).then(click=>{
                    if(click==='toLink') {
                        let find = this.$store.state.operators.all.find((item)=>item.employee_id === val.from_user_info.id)
                        this.$router.push({name:'teamChat',params:{id:find.id}})
                    }
                })
            }

        },

        connect() {
            console.log('socket connected')

        },
        disconnect() {
            console.log('socket disconnect')

        },

        "update-branches"(val) {
            console.log('update-branches',val);
            this.$store.commit('user/branchListAll',val)
        },
        "room-users"(val){
            console.log('room-users',val)
            this.$store.commit('roomActive',val)
        },
        "unprocessed"(val){
            console.log('unprocessed',val);

            this.$store.commit('visitors/processMessageLastUpdate',val)
            this.$store.commit('user/unreadUpdate',['unprocessed',1])
            this.playSoundFile('sound_new_guest')
            browserNotificationMessage(val).then(click=>{
                let {uuid,site_id} =  val
                this.$router.push({name:'process',params: { uuid,site_id}})
            })
        },
        "unprocessed-remove"(val){
            console.log('unprocessed-remove',val)
            this.$store.commit('visitors/processRemoveItem',val);

            let itemList = this.$store.state.visitors.process;
            if(!itemList.length) this.$router.push({name:'processAll'}); //Todo проверить доделать этот варивант
            else {
                console.log(!itemList.length,itemList,itemList.length,itemList[0]);
                let {uuid,site_id} = itemList[0];
                this.$router.push({name:'process',params: { uuid,site_id}});
            }

            this.$store.commit('user/unreadUpdate',['unprocessed',-1])
        },
        "update-employees"(val) {
            console.log('update-employees user/profile update')

        }

    },
}


