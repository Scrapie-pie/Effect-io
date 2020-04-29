<template lang="pug">
    #app.page__app(:class="{'is-page-mobile-show-chat':$store.state.mobile.showChat}" v-resize="onResize")
        the-header-mobile(v-if="isAuth")
        the-header.page__header.page__padding(v-if="isAuth")
        main.page__main
            base-wait(name="pageMain")
            transition(name="fade" mode="out-in")
                router-view.page__view.page__padding
        the-popup


</template>

<script>
import '@/scss/base.scss'

import TheHeader from '@/components/TheHeader'
import TheHeaderMobile from '@/components/TheHeaderMobile'
import ThePopup from '@/components/ThePopup'

import { captureException } from '@sentry/browser'

import {
    webSockets,
    routerPushProcessAllOrItemFirst,
    pollingSockets,
    actionAnotherTab,
    dialogActions
} from '@/mixins/mixins'
import AppSpinner from './components/BaseWait'

export default {
    components: {
        TheHeaderMobile,
        AppSpinner,
        TheHeader,
        ThePopup
    },
    mixins: [
        webSockets,
        routerPushProcessAllOrItemFirst,
        pollingSockets,
        actionAnotherTab,
        dialogActions
    ],
    computed: {
        isAuth() {
            return this.$store.getters['user/authenticated']
        }
    },
    watch: {
        isAuth(val) {
            if (val) {
                this.pollingSockets()

                /* if (process.env.NODE_ENV === 'development') return
                window.onbeforeunload = function() {
                    return 'Данные не сохранены. Точно перейти?'
                }*/
            } else {
                this.pollingSocketsDestroy()
                //window.onbeforeunload = false
            }
        }
    },
    created() {
        /*  setTimeout(()=>{
            this.$root.$emit('emitEmployeeOnline',{online:0,user_id:this.$store.state.user.profile.id})
        },1000)*/

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
                otrsSend: ['regru/regru/send-ticket-to-crm'],
                accountAuth: ['auth/login-oi'],
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
                    this.startEndLoader(resp.config.url, 'end')
                    this.startEndLoader(resp.config.url.split(resp.config.baseURL)[1], 'end')
                    this.startEndLoader(resp.config.url.split('?')[1], 'end')
                    return resp
                },
                err => {
                    this.startEndLoader(err.config.url, 'end')
                    this.startEndLoader(err.config.url.split(err.config.baseURL)[1], 'end')
                    this.startEndLoader(err.config.url.split('?')[1], 'end')

                    if (
                        (err.request.responseURL.includes('regru/regru/get-login-by-uuid'),
                        err.request.responseURL.includes('regru/regru/send-ticket-to-crm'))
                    ) {
                        return Promise.reject(err)
                    }

                    if (err.response?.data?.error === -67) {
                        //ошибка выставления тега
                        this.$root.$emit('showTagsEmit', 'actionAfterChatCompletion')
                        return Promise.reject(err)
                    }

                    if (err?.response?.data?.message && this.$route.name !== 'auth') {
                        this.$root.$emit('globBoxControlClose')
                        this.$root.$emit('popup-notice', err.response.data.message)
                    }

                    captureException({
                        frontMessage: 'Отправляю все ошибки',
                        backResponse: {
                            config: err.config,
                            response: err.response,
                            message: err.message
                        }
                    })

                    if (err?.response?.status === 401) {
                        captureException({ frontMessage: 'user/logout', backResponse: err })

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
        },
        onResize({ width, height }){
            console.log(width, height);
            this.$store.commit('resize/setWindowSize',{width, height})
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
    //min-width: 685px;



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

        @include media($width_xs) {
            padding-left: 0;
            padding-right: 0;
        }
    }

    &__padding {
        padding-top: calc-em(30);
        padding-bottom: calc-em(30);
    }


    @include media($width_xs) {
        &__app {
            flex-direction:column;
        }
        &__view {
            min-height:auto;
        }
        &__header {
            width:100%;
            order:1;
            display:flex;
            flex-direction: row;
            align-items:center;
            padding-top:0;
            padding-bottom:0;

            transition:$glob-trans;

            .is-page-mobile-show-chat & {
                margin-bottom:-50px;
            }
        }

        &__main {
            height:80vh;
        }
    }
}
</style>
