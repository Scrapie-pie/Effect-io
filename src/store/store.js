import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/user'
import operators from '@/store/operators'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,
        operators
    },
    state: {


    },
    mutations: {


    },
    actions: {

    }
})
