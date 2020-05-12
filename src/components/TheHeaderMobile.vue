<template lang="pug">
    section.the-header-mobile(hidden :class="{boxActionsMenuOpen:boxActionsMenuToggle}")
        .the-header-mobile__wrap
            transition(name="the-header-mobile-transition-left")
                .the-header-mobile__main(v-if="!showChat")

                    user-status(is-mobile v-if="$store.getters['resize/xs']")
                    //.the-header-mobile__main-status В сети
                    .the-header-mobile__main-name-section(v-text="nameSection")
            transition(name="the-header-mobile-transition")
                div(v-if="showChat").the-header-mobile__chat-control
                    div.the-header-mobile__chat-control-arrow-wrap
                        base-btn(:icon="{name:'arrowLeft',box:false}", @click="$store.commit('mobile/setShowChat',false)")
                        count-all
                    base-people(
                        :name="info.name" ,
                        :regRuLogin="info.regRuLogin",
                        :bg-text-no-fill="true",
                        :avatar-url="info.photo",
                        :avatar-stub="info.photo_stub"
                    )
                    base-btn(:icon="{name:'burgerMenu',box:false}", @click="boxActionsMenuToggle=true")
        transition(name="the-header-mobile-transition")
            mobile-chat-actions(v-if="boxActionsMenuToggle", @close="boxActionsMenuToggle=false")


</template>

<script>
import { viewModeChat } from '@/mixins/mixins'
import UserStatus from '@/components/UserStatus'

export default {
    name: 'TheHeaderMobile',
    components: {
        UserStatus,
        BaseCount: () => import('@/components/BaseCount'),
        CountAll: () => import('@/components/CountAll'),
        MobileChatActions: () => import('@/components/MobileChatActions')
    },
    mixins: [viewModeChat],
    data() {
        return {
            boxActionsMenuToggle: false,
            showChatControls: false
        }
    },
    computed: {
        showChat() {
            return this.$store.getters['mobile/showChat']
        },
        nameSection() {
            return (
                (this.viewModeChat == 'process' && 'Не обработано') ||
                (this.viewModeChat === 'visitors' && 'Мои диалоги') || ''
            )
        },

        info() {
            return this.$store.state.visitors.itemOpen
        }
    },

    methods: {}
}
</script>

<style lang="scss">
.the-header-mobile {
    .is-opened-box-controls &__wrap {
        z-index: 0;
    }

    &__wrap {
        position: relative;
        border-bottom: 1px solid glob-color(border);
        padding: 0.5em;
        height: 65px;
        z-index: 400;
    }

    .user-status {
        &__avatar-wrap {
            display: block;
            margin-bottom: 0;
        }
    }

    &__main {
        display: flex;
        align-items: center;
        height: 100%;
        justify-content: space-between;
        &-name-section {
            @extend %h2;
            margin-bottom: 0;
        }
    }

    @include media($width_xs) {
        display: block;
    }

    &__chat-control {
        display: grid;
        grid-template-columns: 50px 1fr 50px;
        grid-gap: 10px;

        &-arrow-wrap {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            .count-all {
            }
        }
    }

    .the-header-mobile-transition-left-enter-active,
    .the-header-mobile-transition-left-leave-active,
    .the-header-mobile-transition-enter-active,
    .the-header-mobile-transition-leave-active {
        transition: $glob-trans;
    }
    .the-header-mobile-transition-left-enter,
    .the-header-mobile-transition-left-leave-to,
    .the-header-mobile-transition-enter,
    .the-header-mobile-transition-leave-to {
        position: absolute;
        @extend %full-abs;
        opacity: 0;
    }

    .the-header-mobile-transition-enter,
    .the-header-mobile-transition-leave-to {
        transform: translateX(100%);
        //transform:scale(0);
        //filter:blur(10px);
    }
    .the-header-mobile-transition-left-enter,
    .the-header-mobile-transition-left-leave-to {
        transform: translateX(-100%);
    }
}
</style>
