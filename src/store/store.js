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

    },
    mutations: {
        loading(state, val) {
            state.loading = val
        },


    },
    actions: {

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
