import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home'
import Auth from '@/pages/Auth'
import Recover from '@/pages/Recover'
import UiText from '@/pages/UiText'
import Settings from '@/pages/Settings'
import SettingsApp from '@/pages/SettingsApp'


export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            name: 'UiText',
            path: '/ui',
            component: UiText,
            meta: {
                breadcrumb: ''
            }
            // beforeEnter: hookNoUserFundsCase
        },
        {
            name: 'auth',
            path: '/',
            component: Auth,
        },
        {
            name: 'recover',
            path: '/recover',
            component: Recover,
        },
        {
            name: 'settings',
            path: '/settings',
            component: Settings,
            children: [
                {
                    name: 'settingsApp',
                    path: 'app',
                    component: SettingsApp
                },
            ]
        },
    ]

})


Vue.use(Router)
