import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/store'
import axios from '@/modules/axios'

const AccountAuth = () => import('@/components/AccountAuth')

const PageTeam = () => import('@/pages/PageTeam')

//import PageTestScreen from '@/pages/PageTestScreen'

const PageVisitor = () => import('@/pages/PageVisitor')
const PageMonitoring = () => import('@/pages/PageMonitoring')
const PageChat = () => import('@/pages/PageChat')
const PageAllDialogues = () => import('@/pages/PageAllDialogues')
const PageSearchDialogues = () => import('@/pages/PageSearchDialogues')
const PagePhrases = () => import('@/pages/PagePhrases')
const PageTags = () => import('@/pages/PageTags')
const StatsTags = () => import('@/components/StatsTags')

import settings from '@/routes/settings'
import stats from '@/routes/stats'
import channels from '@/routes/channels'

//import Ui from '@/routes/ui'

import { captureException, withScope } from '@sentry/browser'

//let helpers = process.env.NODE_ENV !== 'production' ? [...Ui] : []

const BaseNoFound = () => import('@/components/BaseNoFound')

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

{
    // https://stackoverflow.com/questions/57837758/navigationduplicated-navigating-to-current-location-search-is-not-allowed
    const originalPush = Router.prototype.push;
    Router.prototype.push = function push(location) {
        return originalPush.call(this, location).catch(err => err)
    };
}


const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            name: 'auth',
            path: '/',
            component: AccountAuth,
            children: [
                {
                    name: 'recover', // Вынес в children, иначе при переходе срабатывала функция hideHeader
                    path: 'recover',
                    component: AccountAuth
                }
            ]
        },

        {
            name: 'monitoring',
            path: '/monitoring',
            component: PageMonitoring
        },
        {
            name: 'team',
            path: '/team',
            component: PageTeam
        },

        {
            name: 'teamChat',
            path: '/team/:id',
            component: PageChat
        },
        {
            name: 'visitors',
            path: '/visitors',
            component: PageVisitor
        },
        {
            name: 'visitorsChat',
            path: '/visitors/:id',
            component: PageChat
        },

        {
            name: 'chatId',
            path: '/messages/:guest_uuid/:site_id',
            component: PageChat
        },
        {
            name: 'messageAll',
            path: '/messages',
            component: PageChat
        },
        {
            name: 'visitors-no-messages',
            path: '/messages-no',
            component: BaseNoFound
        },

        {
            name: 'process',
            path: '/process/:guest_uuid/:site_id',
            component: PageChat
        },
        {
            name: 'processAll',
            path: '/process',
            component: PageChat
        },
        {
            name: 'process-no-messages',
            path: '/process-no-messages',
            component: BaseNoFound
        },

        {
            name: 'common',
            path: '/common',
            component: PageChat
        },
        {
            name: 'all',
            path: '/all',
            component: PageAllDialogues
        },
        {
            name: 'searchList',
            path: '/search',
            component: PageSearchDialogues
        },
        {
            name: 'search',
            path: '/search/:guest_uuid/:site_id/:chat_id',
            component: PageChat
        },
        {
            name: 'visor',
            path: '/all/:guest_uuid/:site_id/:chat_id',
            component: PageChat
        },
        {
            name: 'phrases',
            path: '/phrases',
            component: PagePhrases
        },
        {
            name: 'tags',
            path: '/tags',
            component: PageTags
        },
        ...channels,
        ...settings,
        ...stats,
        //...helpers,
        {
            name: 'exit',
            path: '/exit'
        },
        {
            name: '/*',
            path: '*',
            redirect: '/'
        }
    ]
    /* scrollBehavior (to, from, savedPosition) {
        console.log('scrollBehavior',to);
        console.log(to.name.includes('scenarioSettings'));
        if(to.name.includes('scenarioSettings')) return {x:0,y:0}
        // return desired position
    }*/
})

export default router

router.beforeEach(async (to, from, next) => {
    await timeout(300) //https://github.com/aws-amplify/amplify-js/issues/3985
    const not_auth_routes = ['auth', 'recover', 'exit'],
        authenticated = store.getters['user/authenticated']

    if (not_auth_routes.indexOf(to.name) >= 0) {
        // пропускаем на гостевые маршруты

        if (to.name === 'exit') {
            axios.put('auth/logout').finally(() => {
                store.dispatch('user/logout').then(() => {
                    return next({ name: 'auth' })
                })
            })
        }

        if (authenticated) {
            return next({ name: 'processAll' })
        } else {
            jwt(
                { name: 'processAll' }, // Был ранее авторизирован, но попытался перейти по гостевым маршрутом с обновлением страницы, уводим его с этих страниц
                '' // Был разлогинен, токена нет, оставляем на гостевых страницах
            )
        }
    } else {
        if (authenticated) {
            return next()
        } else {
            jwt(
                '', // пользователь был авторизирован, обновил браузер, авторизируем из ссесии оставляем на тякущей странице

                { name: 'auth', query: { return: to.fullPath } } // Если пользователь не был авторизирован, сохраняем его ссылку, отправляем на форму авторизации, после успешной авторизации снова отправляем на его ссылку
            )
        }
    }

    function jwt(pathTarget, pathElseNoJwt) {
        const jwt = localStorage.getItem('jwt')
        if (jwt) {
            axios
                .post(
                    'auth/login-oi',
                    {
                        jwt
                    },
                    {
                        skipAuthRefresh: true,
                        headers: { 'content-type': 'application/json' }
                    }
                )
                .then(({ data }) => {
                    return store.dispatch('user/getLogin', data.data.user).then(() => {
                        if (to.query.return) return next(to.query.return)
                        // отправляем по ранее сохраненному маршруту
                        else {
                            if (pathTarget) return next(pathTarget)
                            else return next()
                        }
                    })
                })
                .catch(error => {
                    /*     console.log(jwt);
                    axios.defaults.headers.common['jwt'] = jwt  //Не получили из метода, вставляем старый
                    axios.defaults.headers['content-type'] = 'application/json'*/
                    captureException({ frontMessage: 'router before', backResponse: error })
                    console.log(error)
                    console.log(error.response)

                    store.dispatch('user/logout').then(() => {
                        return next({
                            name: 'auth',
                            query: { return: to.fullPath }
                        })
                    })
                })
        } else {
            if (pathElseNoJwt) return next(pathElseNoJwt)
            else return next()
        }
    }
})

Vue.use(Router)
