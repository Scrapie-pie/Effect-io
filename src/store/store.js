import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/user'
import operators from '@/store/operators'
import visitors from '@/store/visitors'


Vue.use(Vuex)

const getDefaultState = () => {
    return {
        loading:false,
        roomActiveId:false,
        roomActive:{
            visitor:{
                guest_uuid:'',
                site_id:'',
                typingLive:''
            },

        },
        roomActiveUsers:[],
        roomActiveUsersActive:[],
        roomActiveUsersInvited:[],
        roomActiveUsersRecipient:[],
        roomActiveIsAdmin:false,

    }
}
// initial state
const state = getDefaultState()

export default new Vuex.Store({
    modules: {
        user,
        operators,
        visitors
    },
    state,
    mutations: {
        resetState (state) {
            Object.assign(state, getDefaultState())
        },

        loading(state, val) {
            state.loading = val
        },
        roomActiveTypingLive(state,{message,guest_uuid,site_id}){

            let visitor = state.roomActive.visitor;
            if(visitor.guest_uuid+visitor.site_id === guest_uuid+site_id)  state.roomActive.visitor.typingLive=message;

        },
        roomActive(state, val) {
            
            function getIds(status) {
                let users = val.filter((item)=>item.status === status);
                return users.map((item)=>item.user_id)
            }

            console.log('roomActiveUsers',val);
            //console.log('roomActiveUsersActive',getIds('active'));
           // console.log('roomActiveUsersInvited',getIds('invited'));

            state.roomActive.visitor.guest_uuid=val.visitor.guest_uuid
            state.roomActive.visitor.site_id=val.visitor.site_id

            state.roomActiveIsAdmin = val.filter((item)=>item.isAdmin && item.user_id === state.user.profile.id).length;
            state.roomActiveId=val[0].room_id;
            state.roomActiveUsers=val;
            state.roomActiveUsersActive=getIds('active');
            state.roomActiveUsersRecipient=getIds('recipient')
            state.roomActiveUsersInvited=getIds('invited')
        },


    },
    actions: {
        setMessageRead({state, commit, dispatch },{userId,type}) {
            let itemList = [],
                unreadType, // private,guest
                idOrUuid; //Todo гениальное решение нужно при получения посетителей добавить item.id = uuid
            if(type==='operators') {
                itemList = state.operators.all;
                unreadType = 'private';
                idOrUuid = 'id'
            }
            if(type==='visitors') {
                itemList = state.visitors.self;
                unreadType = 'guest'
                idOrUuid = 'uuid'
            }
            let findIndex = itemList.findIndex((item)=>{
                return item[idOrUuid] === userId
            });
            if(findIndex !== -1) {
                let unread = itemList[findIndex].unread;

                commit(type+'/messageRead',findIndex);
                commit('user/unreadUpdate',[unreadType,-unread.length],{root:true})
            }


        },
        'SOCKET_NEW-MESSAGE'({ commit, dispatch }, message){
            console.log(message);
        },
        'socket_new-message'({ commit, dispatch }, message){
            console.log(message);
        },
        'socket_new-Message'({ commit, dispatch }, message){
            console.log(message);
        },
        'socket_newMessage'({ commit, dispatch }, message){
            console.log(message);
        },
        socket_newMessage({ commit, dispatch }, message){
            console.log(message);
        },
    },
    getters: {
        channelName: state => number => {
            let text='';
            switch (number) {

                case 1:
                    text = 'виджет';
                    break;
                case 2:
                    text = 'VK';
                    break;
                case 3:
                    text = 'Facebook';
                    break;
                case 4:
                    text = 'Slack';
                    break;
                case 5:
                    text = 'Telegram';
                    break;
                case 6:
                    text = 'Viber';
                    break;
                case 7:
                    text = 'виджет';
                    break;
                case 8:
                    text = 'SLACKIO';
                    break;
                case 9:
                    text = 'Zendesk';
                    break;
                case 10:
                    text = 'AMO';
                    break;
                case 11:
                    text = 'SALESFORCE';
                    break;
                case 12:
                    text = 'OPENAPI';
                    break;
                case 13:
                    text = 'WhatsApp';
                    break;

                default:
                    text = '-';

                    break;
            }
            return text
        }
    }
})
