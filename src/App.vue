<template lang="pug">
    #app.page__app
        the-header.page__header.page__padding
        main.page__main
            base-wait(name="pageMain")
            transition(name="fade" mode="out-in")
                router-view.page__view.page__padding
        the-popup


</template>

<script>
import '@/scss/base.scss'

import TheHeader from '@/components/TheHeader'
import ThePopup from '@/components/ThePopup'

import { webSockets, routerPushProcessAllOrItemFirst } from '@/mixins/mixins'
import AppSpinner from './components/BaseWait'

export default {
    components: {
        AppSpinner,
        TheHeader,
        ThePopup
    },
    mixins: [webSockets, routerPushProcessAllOrItemFirst],
    computed: {
        isAuth() {
            return this.$store.getters['user/authenticated']
        }
    },
    watch: {
        isAuth(val) {
            if (val) {
                window.onbeforeunload = function() {
                    return 'Данные не сохранены. Точно перейти?'
                }
            } else {
                window.onbeforeunload = false
            }
        }
    },
    created() {
        document.body.classList.add('page')

        this.watchForHover()

        window.addEventListener('unhandledrejection', this.promiseErrorHandler)

        this.httpErrors()

        this.$store.commit('setFilterlocalStorage')

    },
    beforeDestroy() {
        window.removeEventListener('unhandledrejection', this.promiseErrorHandler)
    },
    methods: {
        startEndLoader(url, action) {
            let mapLoaders = {
                accountAuth: ['user/login-oi'],
                pageMain: ['chat/get-all'],
                chatMainBody: ['message/history'],
                lastMessages: ['guest/list', 'employee/company-list'],
                clientInfo: ['guest/info', 'guest/update-by-operator'],
                pageVisitors: ['guest/list', 'chat-room-user/take'],
                pageTeam: ['employee/company-list', 'user/update-profile'],
                pageStats: ['statistic/get-by-params'],
                phrasesReady: [
                    'snippet/read-snippet',
                    'snippet/update-snippet',
                    'snippet/delete-snippet'
                ],
                uploadAvatar: ['upload/upload/avatar'],
                pageSettingsApp: ['company/get-settings'],
                pageSettingsProfile: ['user/password-update', 'user/update-profile'],
                pageTags: ['tag/tag/set-settings', 'tag/tag/list'],
                uploadFileList: ['upload/upload/message-file'],
                btnGuestRedirect: ['guest/redirect'],
                guestRedirect: ['guest/redirect'],
                chatMain: [
                    'message/send-from-operator',
                    'guest/contacts-request',
                    'co-browsing/request',
                    'guest/blocking',
                    'chat-room-user/transfer-request'
                ],
                userStatus: ['employee/online-update'],
                header: ['one-time-chat/generate-code']
            }

            for (let key in mapLoaders) {
                if (
                    mapLoaders[key].some(item => {
                        if (item === url) {
                            //console.log(url,key,action);
                        }

                        return item === url
                    })
                ) {
                    this.$wait[action](key)
                }
            }
        },

        httpErrors() {
            this.$http.interceptors.request.use(
                config => {
                    this.startEndLoader(config.url, 'start')

                    return config
                },
                function(error) {
                    // Do something with request error
                    return Promise.reject(error)
                }
            )

            this.$http.interceptors.response.use(
                resp => {
                    /*console.log(resp.config.baseURL);
                    console.log(resp.config.url);
                    console.log(resp.config.url.split(resp.config.baseURL)[1]);*/

                    this.startEndLoader(resp.config.url.split(resp.config.baseURL)[1], 'end')
                    this.startEndLoader(resp.config.url.split('?')[1], 'end')
                    return resp
                },
                err => {
                    console.table(err)

                    this.startEndLoader(err.config.url.split(err.config.baseURL)[1], 'end')
                    this.startEndLoader(err.config.url.split('?')[1], 'end')
                    //this.$wait.end(err.config.url.split('?')[0]);
                    //this.$store.commit('loading',false)
                    /*    console.table(err);
                    console.log(err.config);
                    console.log(err.response);

                    console.log(err.request)*/

                    if (
                        (err.request.responseURL.includes('regru/regru/get-login-by-uuid'),
                        err.request.responseURL.includes('regru/regru/send-ticket-to-crm'))
                    ) {
                        return Promise.reject(err)
                    }

                   /* if (err.response.data.error === -67) { //Todo RBCALL-3733
                        //ошибка выставления тега
                        this.$root.$emit('showTagsEmit')
                        return Promise.reject(err)
                    }*/

                    if (
                        err.response &&
                        err.response.data &&
                        err.response.data.message &&
                        this.$route.name !== 'auth'
                    ) {
                        this.$root.$emit('globBoxControlClose')
                        this.$root.$emit('popup-notice', err.response.data.message)
                        console.log('error №', err.response.status)
                    }

                    if (err.response.status === 401 || err.response.status === 429) {
                        console.log(this.$route.fullPath, err.response)
                        this.$store.dispatch('user/logout').then(() => {
                            this.$router.push({
                                name: 'auth',
                                query: {
                                    return: this.$route.fullPath
                                }
                            })
                        })
                    }
                    return Promise.reject(err)
                }
            )
        },
        watchForHover() {
            // Отключаем hover на touch устройствах

            let hasHoverClass = false,
                container = document.body,
                lastTouchTime = 0

            function enableHover() {
                // filter emulated events coming from touch events
                if (new Date() - lastTouchTime < 500) return
                if (hasHoverClass) return

                container.className += ' page_hasHover'
                hasHoverClass = true
            }

            function disableHover() {
                if (!hasHoverClass) return

                container.className = container.className.replace(' page_hasHover', '')
                hasHoverClass = false
            }

            function updateLastTouchTime() {
                lastTouchTime = new Date()
            }

            document.addEventListener('touchstart', updateLastTouchTime, true)
            document.addEventListener('touchstart', disableHover, true)
            document.addEventListener('mousemove', enableHover, true)

            enableHover()
        },
        promiseErrorHandler(event) {
            console.error(
                'Unhandled rejection (promise: ',
                event.promise,
                ', reason: ',
                event.reason,
                ')'
            )
        }
    }
}
</script>

<style lang="scss">
.page {
    $transition: $glob-trans;
    $indent-main: $glob-indent-main-lr;

    background-color: glob-color('light');
    color: glob-color('main');
    font-size: $glob-font-size_main;
    line-height: 1.2;
    font-weight: 400;
    font-family: $font-family_main;
    min-width: 685px;

    &__app {
        height: 100%;
        display: flex;
        transition: $transition;
        flex: 1;
        overflow: hidden;

        .is-hided-header & {
            margin-left: -165px;

            @include media($width_lg) {
                margin-left: -75px;
            }
        }
    }

    &_main_center &__main {
        align-items: center;
    }

    &__main {
        display: flex;
        flex: 1 0 auto;
        min-width: 0; //для шаблонов, чтобы работало text-overflow: ellipsis;
        position: relative;
    }

    &__scrollbar {
        height: 100%;
        display: flex;
        flex: 1;

        &-inner {
            overflow: hidden;
        }
    }

    &__view {
        display: flex;
        height: 100%;
        flex-direction: column;
        flex: 1;
        min-height: 475px;
        min-width: 0; //для шаблонов, чтобы работало text-overflow: ellipsis;
    }

    &__main {
        flex: 1;
        padding-left: $indent-main;
        padding-right: $indent-main;
        height: 100%;
    }

    &__padding {
        padding-top: calc-em(30);
        padding-bottom: calc-em(30);
    }
}
</style>
