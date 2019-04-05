import config from "@/config/index";

import browserNotification from '@/modules/browserNotification'
import {browserNotificationMessage} from '@/modules/browserNotification'


import settings from "@/routes/settings";

import lodash_once from 'lodash/once'
import {httpParams,viewModeChat} from '@/mixins/mixins'

export default {
    mixins:[httpParams,viewModeChat], //routerPushProcessAllOrItemFirst подключи будет баг

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
  /*      routerPushProcessAllOrItemFirst(){
            console.log('routerPushProcess');
            let itemList = this.$store.state.visitors.process;
            if(!itemList.length) this.$router.push({name:'processAll'}); //Todo проверить доделать этот варивант
            else {
                console.log(!itemList.length,itemList,itemList.length,itemList[0]);
                let {uuid,site_id} = itemList[0];
                this.$router.push({name:'process',params: { uuid,site_id}});
            }
        },*/
        playSoundFile(nameFile) {

            let{settings,sounds} = this.$store.state.user.settings;

                let index =  settings[nameFile];
          /*  console.log(sounds[index].file);
            console.log(nameFile,config.api_server.split('/app')[0] + sounds[index].file);
            console.log(config.api_server);
            console.log(index,sounds[index].file);*/
                if(!sounds[index].file) return
                let audio = new Audio(config.api_server.split('/app')[0] + sounds[index].file);
                audio.volume = .5;
                audio.play();

        },
        webSocketInit() {
            //this.$socket.disconnect();
            this.$socket.query = `uuid=${this.userId}`;
            this.$socket.io.opts.query = `uuid=${this.userId}`;
            this.$socket.open()

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
        connect() {
            console.log('socket connected...');
        },
        disconnect() {
            console.log('socket disconnected...');
        },
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
            val.socket=true; //Todo Временное решение, на проверку дубликатов, пока Симон не исправит

            if (val.from_user_info && val.from_user_info.id) {
                if(this.$store.state.user.profile.employee_id === val.from_user_info.id) return; //Принимаем только чужие сообщения
            }

            if (val.site_id && (val.room_id === this.$store.state.roomActiveId)) { // если есть val.site_id значит общение в диалогах
                console.log('// Нужно, что бы чужое сообщение оказалось каждое в своем чате');
                this.$root.$emit('messageAdd',val) // Нужно, что бы чужое сообщение оказалось каждое в своем чате

            }

            if(
                this.viewModeChat==='operators' && //иначе на других страницах this.httpParams.params.id вылетала ошибка
                !val.site_id && (val.from_user_info.user_id == this.httpParams.params.id)) {
                console.log('//иначе на других страницах this.httpParams.params.id вылетала ошибка');
                this.$root.$emit('messageAdd',val)

            }


            if(val.status === "unprocessed") {
                return  this.$store.commit('visitors/processMessageLastUpdate',val)
            }

            if(val.status === "supervisor") {
                return
            }


            if(val.site_id) {


                if(this.httpParams) {
                    let {guest_uuid,site_id} = this.httpParams.params;
                    if(val.from_user_info.uuid+val.site_id === guest_uuid+site_id) { //Если это сообщение посетителя в чате то нужно очистить TypingLive
                        this.$store.commit('roomActiveTypingLive',{message:'',guest_uuid,site_id})
                    }
                }


                this.playSoundFile('sound_new_guest_message')

                this.$store.commit('visitors/selfMessageLastUpdate',val)
                this.$store.commit('user/unreadUpdate',['guest',1]);



                browserNotificationMessage(val).then(click=>{
                    if(click==='toLink') {
                        let {uuid,site_id} =  val
                        this.$router.push({name:'chatId',params: { uuid,site_id}})
                    }

                })
            } else {

                if(val.room_id===this.$store.state.user.profile.common_room_id){
                    this.$store.commit('user/unreadUpdate',['common',1])
                    this.playSoundFile('sound_new_common_message')
                    this.$root.$emit('messageAdd',val)
                    return

                }

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
        "guest-new-session"(val) {
            //console.log('guest-new-session',val);
            this.playSoundFile('sound_new_guest')
            this.$root.$emit('guestNewSession',val)
        },
        'update-guest-employee'(val){
            console.log('update-guest-employee',val);
            this.$root.$emit('guestUpdate',val)
        },
        "guest-update"(val) {
            //Todo 'guest-update'
            //console.log('guest-update',val);

            //this.$root.$emit('guestUpdate',val)

            if(!this.httpParams) return
            let {site_id,uuid} = this.httpParams.params;

            if(val.uuid+val.site_id===uuid+site_id){
                this.$store.commit('visitors/itemOpen',val)  //{name,uuid,site_id} = val

            }

        },
        "update-branches"(val) {
            console.log('update-branches',val);
            this.$store.commit('user/branchListAll',val)
        },
        "room-users"(val){
            console.log('room-users',val);
            val.socket=true; // для того что бы room_id не обновлять
            this.$store.commit('roomActive',val)
        },
        "unprocessed"(val){
            console.log('unprocessed',val);

            this.$store.commit('visitors/processMessageLastUpdate',val)
            this.$store.commit('user/unreadUpdate',['unprocessed',1])
            this.playSoundFile('sound_new_guest')
            browserNotificationMessage(val).then(click=>{
                if(click==='toLink') {
                    let {uuid,site_id} =  val
                    this.$router.push({name:'process',params: { uuid,site_id}})
                }

            })
        },
        "self-remove"(val){
            console.log('self-remove',val,val.room_id , this.$store.state.roomActiveId)
            //if(val.room_id === this.$store.state.roomActiveId) return


            this.$store.dispatch('setMessageRead', {
                    uuid:val.uuid,
                    site_id:val.site_id,
                    type:'visitors'
                }
            );
            this.$store.commit('visitors/selfMessageRemoveItem',val);

            if(this.viewModeChat==='visitors') this.$router.push({name:'messageAll'})

        },
        "unprocessed-remove"(val){

            console.log('unprocessed-remove',val,val.room_id , this.$store.state.roomActiveId)
            //if(val.room_id === this.$store.state.roomActiveId) return

            this.$store.commit('visitors/processRemoveItem',val);
            this.$store.commit('user/unreadUpdate',['unprocessed',-1])

            if(this.viewModeChat==='process') this.routerPushProcessAllOrItemFirst()

        },
        "update-employees"(val) {

            let find = val.find((item)=>item.id===this.$store.state.user.profile.id)
            if(find) {
                if(!find.is_common_chat && this.viewModeChat==='common') this.$router.push({name:'processAll'})

                this.$store.commit('user/profileUpdate',find)
                if(!this.$store.getters['user/isRole'](['admin','owner','operatorSenior']) && this.$route.path.includes('service')){
                    this.$router.push({name:'processAll'})
                }
            }





        },


    },
}


