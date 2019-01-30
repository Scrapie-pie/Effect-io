import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index'



import AccountAuth from '@/components/AccountAuth'
import Chat from '@/routes/chat'
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

        ...Chat,
        ...Settings,
        ...helpers,
        //...Ui,
        {
            name: '/*',
            path:'*',
            redirect: '/',

        },
    ]

})

export default router

router.beforeEach((to, from, next) => {





    const not_auth_routes = ['/', '/recover'],
    authenticated = store.getters['user/authenticated'];


    if(not_auth_routes.indexOf(to.path) >= 0) { // пропускаем на гостевые маршруты

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
                `/auth?return=${to.fullPath}` // Если пользователь не был авторизирован, сохраняем его ссылку, отправляем на форму авторизации, после успешной авторизации снова отправляем на его ссылку
            )

        }
    }

    function jwt(pathTarget,pathElseNoJwt) {

        const jwt = localStorage.getItem('jwt');
        console.log('jwt',jwt);
        if (jwt) {
            axios.post('login', {jwt}, {//todo доделать если время токена кончилось
                headers: { 'content-type': 'application/json' }
            }).then(({ data }) => {

                store.dispatch('user/login', data.user).then(()=>{
                    if (to.query.return) return next(to.query.return) // отправляем по ранее сохраненному маршруту
                    else {
                        if (pathTarget) return next(pathTarget)
                        else return next()
                    }
                })

            }).catch((error) => {
                showError(error);
                store.dispatch('user/logout').then(()=>{
                    return next({name:'auth'})
                })
            })
        } else {
            if (pathElseNoJwt) return next(pathElseNoJwt)
            else return next()
        }
    }



});

axios.interceptors.response.use(undefined,  (err)=> { //Обработка просроченных токенов 401 Unauthorized
    return new Promise((resolve, reject)=> {

        if (err.status === 401 && err.config && !err.config.__isRetryRequest) { //Todo ждем Api
            this.$store.dispatch('user/logout')
                .then(() => {
                    this.$router.push({name:'auth'})
                    // document.querySelector('.site').classList.remove('site_overlay')
                })
            this._vm.$root.$emit('popup-notice','Попробуйте авторизоваться снова')


        }
        throw err;
    });
});

Vue.use(Router)
