import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'
import axios from "@/modules/axios";

const AccountAuth  = () => import('@/components/AccountAuth')

const PageTeam = () => import('@/pages/PageTeam')
//import PageTestScreen from '@/pages/PageTestScreen'
const PageTestScreen = ()=> import('@/pages/PageTestScreen')
const PageVisitor = () => import('@/pages/PageVisitor')
const PageChat = () => import('@/pages/PageChat')
const PageLogDialogues = () => import('@/pages/PageLogDialogues')




import settings from '@/routes/settings'
import stats from '@/routes/stats'

import Ui from '@/routes/ui'




let helpers = process.env.NODE_ENV !== 'production' ? [...Ui,  {
    name: 'testScreen',
    path: '/testScreen',
    component: PageTestScreen,
}] : [];


const BaseNoFound  = () => import('@/components/BaseNoFound')

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
            component: PageTeam,
        },
        {
            name: 'teamChat', // Вынес в children, иначе при переходе срабатывала функция hideHeader
            path: '/team/:id',
            component: PageChat,
        },
        {
            name: 'visitors',
            path: '/visitors',
            component: PageVisitor
        },
        {
            name: 'visitorsChat',
            path: '/visitors/:id',
            component: PageChat,

        },

        {
            name: 'chatId',
            path: '/messages/:uuid/:site_id',
            component: PageChat,
        },
        {
            name: 'messageAll',
            path: '/messages',
            component: PageChat,
        },
        {
            name: 'visitors-no-messages',
            path: '/messages-no',
            component: BaseNoFound,
        },

        {
            name: 'process',
            path: '/process/:uuid/:site_id',
            component: PageChat,
        },
        {
            name: 'processAll',
            path: '/process',
            component: PageChat,
        },
        {
            name: 'process-no-messages',
            path: '/process-no-messages',
            component: BaseNoFound,
        },

        {
            name: 'common',
            path: '/common',
            component: PageChat
        },
        {
            name: 'logDialogList',
            path: '/log',
            component: PageLogDialogues
        },
        {
            name: 'logDialogItem',
            path: '/log/:uuid/:site_id',
            component: PageChat,
        },
        ...settings,
        ...stats,
        ...helpers,
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
            return next({name:'processAll'})
        }
        else {
            jwt(
                {name:'processAll'}, // Был ранее авторизирован, но попытался перейти по гостевым маршрутом с обновлением страницы, уводим его с этих страниц
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
