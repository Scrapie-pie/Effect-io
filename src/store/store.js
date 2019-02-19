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
        isConnected: false,
        loading:false

    },
    mutations: {
        loading(state, val) {
            state.loading = val
        },
        socket_CONNECT(state, status) {
            console.log(state);
            state.isConnected = true;
        },

    },
    actions: {

    }
})
