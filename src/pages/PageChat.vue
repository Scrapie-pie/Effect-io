<template lang="pug">

    article.page-chat(
        v-if="isAuth"
        )
        template(v-if="viewModeChat === 'common'")
            section.page__view.page-chat
                section.page-chat__main
                    the-chat-main

        template(v-if="viewModeChat === 'operators'")
            section.page__view.page-chat
                the-last-messages()
                section.page-chat__main
                    the-chat-main


        template(v-if="viewModeChat === 'visitors'")
            base-no-found(v-show="messageNo" :name="$route.name")
            section(v-show="!messageNo" v-if="selfOnlineHide").page__view.page-chat
                transition(name="the-header-mobile-transition")
                    the-last-messages-v(v-show="!$route.query.forMobileShowChat")
                section(v-if="!show").page__view.page-chat
                    section.page-chat__main
                            the-chat-main
                    aside.page-chat__info
                        the-client-info

        template(v-if="viewModeChat === 'process'")
            base-no-found(v-show="processNo" :name="$route.name")
            section(v-show="!processNo" v-if="processOnlineHide").page__view.page-chat

                transition(name="the-header-mobile-transition")
                    the-last-messages-v(v-show="!$route.query.forMobileShowChat")

                section(v-if="!show").page__view.page-chat

                    section.page-chat__main
                        the-chat-main
                    aside.page-chat__info
                        the-client-info

        template(v-if="['search','visor'].includes(viewModeChat)")
            section.page__view.page-chat
                section.page-chat__main
                    the-chat-main
                aside.page-chat__info(v-show="0")
                    the-client-info



</template>

<script>
import TheLastMessages from '@/components/TheLastMessages'
import TheLastMessagesV from '@/components/TheLastMessagesV'
import TheClientInfo from '@/components/TheClientInfo'
import TheChatMain from '@/components/TheChatMain'

import { viewModeChat } from '@/mixins/mixins'

export default {
    components: {
        TheChatMain,
        TheLastMessages,
        TheLastMessagesV,
        TheClientInfo
    },
    mixins: [viewModeChat],

    computed: {
        isAuth() {
            return this.$store.getters['user/authenticated'] //что бы не было запроа при logout
        },
        processOnlineHide() {
            return !(
                this.$store.state.user.profile.online === 0 ||
                this.$store.state.user.profile.online === 2 ||
                this.$store.state.user.profile.online === 3
            )
        },
        selfOnlineHide() {
            return !(
                this.$store.state.user.profile.online === 0 ||
                this.$store.state.user.profile.online === 2
            )
        },
        show() {
            return this.$route.name === 'processAll' || this.$route.name === 'messageAll'
        },

        processNo() {
            return this.$route.name === 'processAll' && !this.$store.state.visitors.process.length
        },
        messageNo() {
            return this.$route.name === 'messageAll' && !this.$store.state.visitors.self.length
        }
    },
    watch: {
        $route(to, from) {
            this.messageSubscribeSocket(to, from)
        }
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.messageSubscribeSocket(to)
            if (to.name === 'common') {
                if (vm.$store.state.user.profile.is_common_chat) vm.$router.push({ name: 'common' })
                else vm.$router.push({ name: 'processAll' })
            }
        })
    },
    beforeRouteLeave(to, from, next) {
        this.messageSubscribeSocket(null, from)
        this.$store.commit('roomActive/resetState')

        return next()
    },

    methods: {
        messageSubscribeSocket(to, from) {
            if (
                this.viewModeChat === 'visor' &&
                !this.$store.getters['user/isRole'](['admin', 'owner', 'operatorSenior'])
            )
                return this.$router.push({ name: 'processAll' })

            if (['search', 'visor'].includes(this.viewModeChat)) {
                window.onbeforeunload = false

                //return //времено отключил

                if (to) {
                    this.$http.post('chat-room-user/supervisor-enter', {
                        site_id: to.params.site_id,
                        guest_uuid: to.params.guest_uuid
                    })
                }

                if (from) {
                    this.$http.post('chat-room-user/supervisor-exit', {
                        site_id: from.params.site_id,
                        guest_uuid: from.params.guest_uuid
                    })
                }
            }
        }
    }
}
</script>

<style lang="scss">
.header-hide .the-header {
    display: none;
}

@include media($width_xs) {
    //&__main {display:none}

    .is-page-mobile-show-chat .page-chat__main {
        display: block;
    }
    .is-router-name-visor .page-chat__main {
        display: block;
    }
    /* .is-page-mobile-show-chat .nav-aside {
        display:none;
    }*/
}
.page-chat {
    $color_bg-app: glob-color('light');
    $box-shadow: $glob-box-shadow;
    $transition: $glob-trans;

    flex-direction: row;
    position: relative;

    @include media($width_xs) {
        padding-top: 0;
        padding-bottom: 0;
    }

    &__main {
        flex: 1;
        $pd: calc-em(15);
        padding-left: $pd;
        padding-right: $pd;
        height: 100%;
        z-index: 2;
        min-width: 0; //для шаблонов, чтобы работало text-overflow: ellipsis;

        @include media($width_md) {
            padding-right: 0;
            margin-right: -#{$pd};
        }
        @include media($width_xs) {
            padding-left: $pd;
            padding-right: $pd;
            margin-right: 0;

            display: none;
            padding-bottom: 1em;
        }
    }

    &__info {
        flex: 0 1 16.32%;
        max-width: 280px;
        min-width: 182px;
        margin-left: auto;
        background-color: $color_bg-app;

        @include media($width_md) {
            position: fixed;
            top: 0;
            bottom: 0;
            right: 0;
            padding: calc-em(25) calc-em(10);
            width: 202px;
            z-index: 2;
            box-shadow: $box-shadow;
            transition: $transition;
            transform: translateX(110%);

            .is-opened-client-info & {
                transform: translateX(0);
            }
        }

        .client-info {
            margin-top: -1em;
        }
    }

    @include media($width_xs) {
        .the-header-mobile-transition-enter-active,
        .the-header-mobile-transition-leave-active {
            transition: $glob-trans;
        }

        .the-header-mobile-transition-enter,
        .the-header-mobile-transition-leave-to {
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            opacity: 0;
        }

        .the-header-mobile-transition-enter,
        .the-header-mobile-transition-leave-to {
            transform: translateX(-100%);
            //transform:scale(0);
            //filter:blur(10px);
        }
    }

    .the-last-messages {
        @include media($width_xs, 1) {
            display: block !important; //Игнориуруем если было выключено на мобиле
        }
    }
}
</style>
