import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/user'
import operators from '@/store/operators'
import visitors from '@/store/visitors'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        operators,
        visitors
    },
    state: {
        loading:false,
        roomActiveId:false,
        roomActiveUsers:false,

    },
    mutations: {

        loading(state, val) {
            state.loading = val
        },
        roomActive(state, {id,users}) {


            state.roomActiveId=id;
            state.roomActiveUsers=[...users]

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
                console.log('setMessageRead',type,findIndex);
                commit(type+'/messageRead',findIndex);
                commit('user/unreadUpdate',[unreadType,-unread.length],{root:true})
            }
            console.log(userId,type)



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
                    text = '1';
                    break;
                case 2:
                    text = 'vk';
                    break;
                case 3:
                    text = 'FB';
                    break;
                case 4:
                    text = 'SLACK';
                    break;
                case 5:
                    text = 'TG';
                    break;
                case 6:
                    text = 'VIBER';
                    break;
                case 7:
                    text = 'SITE2';
                    break;
                case 8:
                    text = 'SLACKIO';
                    break;
                case 9:
                    text = 'ZENDESK';
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
                    text = 'whatsapp';
                    break;

                default:
                    text = '-';

                    break;
            }
            return text
        }
    }
})
