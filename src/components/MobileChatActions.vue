<template lang="pug">
    .mobile-chat-actions
        .mobile-chat-actions__close-wrap(@click="$emit('close')")
        base-btn(
            :icon="{name:'close'}",
            @click="$emit('close')"
            title="Закрыть"
        ).mobile-chat-actions__close
        scroll-bar.mobile-chat-actions__scroll-bar
            .mobile-chat-actions__list
                    client-info-actions(is-mobile @close="$emit('close')")
                    base-btn(
                    v-if="roomActiveUserActive"
                    color="error"
                    padding="xs",
                    @click.prevent="chatCompletion",
                    v-wait:disabled='"chatMain"'
                    ) Завершить диалог
                    base-btn(
                    @click="blockClient"
                    color="error"
                    padding="xs",
                    ) Заблокировать

                    base-btn(:icon="{name:'exit',top:true}", @click="exitRoomConfirm" v-if="showExit") Выйти из диалога

</template>

<script>
import { httpParams,removeMessageAndPush } from '@/mixins/mixins'

export default {
    components: {ClientInfoActions:()=>import("@/components/ClientInfoActions")},
    name: "mobile-chat-actions",
    directives: {

    },

    data() {
        return {
            showBlockClient: false,
            showExitRoomConfirm: false
        }
    },
    mixins: [httpParams,removeMessageAndPush ],
    methods: {
        exitRoomConfirm() {
            if (this.showConfirmExit) this.showExitRoomConfirm = true
            else this.exitRoom()
        },
        blockClient() {
            this.$http.post('guest/blocking', this.httpParams.params).then(() => {
                this.removeMessageAndPush()
            })
        },
        outside(){
            this.$emit('close')
        },
        chatCompletion() {
            let data = this.httpParams.params
            data.intent = 'farewell'

            this.$http.post('message/send-from-operator', data).finally(()=>{
                this.$emit('close')
            })
        },
    },
    computed:{
        showExit() {
            console.log(
                'showConfirmExit',
                this.$store.state.roomActive.usersActive,
                this.$store.state.roomActive.usersActive.length > 1
            )
            return this.$store.state.roomActive.usersActive.length > 1
        },
        showConfirmExit() {
            return this.$store.state.roomActive.usersActive.length < 1
        },
        roomActiveUserActive() {
            let id = this.$store.state.user.profile.id,
                ids = this.$store.state.roomActive.usersActive
            return ids.includes(id)
        },
    },
    mounted() {
        this.popupItem = this.$el
        //document.addEventListener('click', this.close);
    },
}
</script>

<style lang="scss">
    .mobile-chat-actions{
        @extend %full-abs;
        z-index:9999;

        &__list {
            padding:3em 2em;
        }

        .btn {
            margin:1em 0;

        }
        &__scroll-bar {
            height:100%;
            background:glob-color(light);
            margin-left:3.5em;
        }

        &__close-wrap {
            @extend %full-abs;
            background-color: rgba(0, 0, 0, 0.5);
        }
        & &__close {
            position:absolute;
            top:0;
            left:0;
            padding:1em;
            fill:glob-color(light);
        }

    }
</style>
