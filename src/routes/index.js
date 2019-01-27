import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home'

import AccountAuth from '@/components/AccountAuth'

import Chat from '@/routes/chat'
import Settings from '@/routes/settings'
import Ui from '@/routes/ui'

let helpers = process.env.NODE_ENV !== 'production' ? [...Ui] : [];



export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [

        {
            name: 'auth',
            path: '/',
            component: AccountAuth,
        },
        {
            name: 'recover',
            path: '/recover',
            component: AccountAuth,
        },
        ...Chat,
        ...Settings,
        ...helpers,
        //...Ui
    ]

})


Vue.use(Router)
