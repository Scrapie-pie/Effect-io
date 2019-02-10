import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'

import AccountAuth from '@/components/AccountAuth'

import PageTeam from '@/pages/PageTeam'
import PageVisitor from '@/pages/PageVisitor'
import ChatDialog from '@/pages/ChatDialog'

import Settings from '@/routes/settings'

import Ui from '@/routes/ui'

import axios from "@/modules/axios";

let helpers = process.env.NODE_ENV !== 'production' ? [...Ui] : [];



const router =  new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [

        {
            name: 'auth',
            path: '/',
            component: AccountAuth,
            children:[{
                name: 'recover', // Вынес в children, иначе при переходе срабатывала функция hideHeader
                path: 'recover',
                component: AccountAuth,
            }]
        },

        {
            name: 'team',
            path: '/team',
            component: PageTeam
        },
        {
            name: 'visitors',
            path: '/visitors',
            component: PageVisitor
        },
        {
            name: 'process',
            path: '/process',
            component: ChatDialog,
        },
        {
            name: 'dialog',
            path: '/dialog',
            component: ChatDialog
        },
        {
            name: 'common',
            path: '/common',
            component: ChatDialog
        },
        ...Settings,
        ...helpers,
        //...Ui,
        {
            name: 'exit',
            path:'/exit',
        },
        {
            name: '/*',
            path:'*',
            redirect: '/',

        },
    ]

})

export default router

router.beforeEach((to, from, next) => {

    const not_auth_routes = ['auth', 'recover','exit'],
    authenticated = store.getters['user/authenticated'];


    if(not_auth_routes.indexOf(to.name) >= 0) { // пропускаем на гостевые маршруты

        if(to.name==='exit')  {
            console.log('store.dispatch(\'user/logout\')');
            store.dispatch('user/logout').then(()=>{return next({name:'auth'})})
        }

        if(authenticated){
            return next({name:'process'})
        }
        else {
            jwt(
                {name:'process'}, // Был ранее авторизирован, но попытался перейти по гостевым маршрутом с обновлением страницы, уводим его с этих страниц
                '' // Был разлогинен, токена нет, оставляем на гостевых страницах
            )
        }

    } else {
        if(authenticated) {
            return next()
        } else {
            jwt(
                '', // пользователь был авторизирован, обновил браузер, авторизируем из ссесии оставляем на тякущей странице

                {name:'auth',query:{return:to.fullPath}} // Если пользователь не был авторизирован, сохраняем его ссылку, отправляем на форму авторизации, после успешной авторизации снова отправляем на его ссылку
            )

        }
    }

    function jwt(pathTarget,pathElseNoJwt) {

        const jwt = localStorage.getItem('jwt');
        console.log('jwt',jwt);
        if (jwt) {
            axios.post('login', {jwt}, {
                headers: { 'content-type': 'application/json' }
            }).then(({ data }) => {

                store.dispatch('user/getLogin', data.user).then(()=>{
                    if (to.query.return) return next(to.query.return) // отправляем по ранее сохраненному маршруту
                    else {
                        if (pathTarget) return next(pathTarget)
                        else return next()
                    }
                })

            }).catch((error) => {
                console.log(error.response)
                console.log('user/logout');
                store.dispatch('user/logout').then(()=>{
                    return next({name:'auth',query:{return:to.fullPath}})
                })
            })
        } else {
            if (pathElseNoJwt) return next(pathElseNoJwt)
            else return next()
        }
    }



});



Vue.use(Router)
