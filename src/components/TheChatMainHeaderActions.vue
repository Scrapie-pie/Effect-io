<template lang="pug">
    form.chat-actions
        transition(name="fade" mode="out-in")
            fieldset(v-if="!showBlockClient && !showExitRoomConfirm" key="keyHideBlockClient")
                legend.chat-actions__text-only-scr Выберите одно из действий
                ul.chat-actions__list
                    template(v-if="viewModeChat!='process'")
                        li.chat-actions__more-item()
                            base-btn(
                            :icon="{name:'transfer',top:true}"
                                @click.prevent="showBranch()"
                            ) Передать в отдел
                        li.chat-actions__more-item()
                            base-btn(
                                :icon="{name:'transfer',top:true}"
                                @click.prevent="showTransfer()"
                            ) Передать диалог

                        li.chat-actions__more-item(v-if="showExit")
                            base-btn(:icon="{name:'exit',top:true}", @click="exitRoomConfirm") Выйти из диалога
                    li.chat-actions__more-item
                        base-btn(:icon="{name:'bl',top:true}", @click="showBlockClient=true") Блокировать клиента
            fieldset(v-if="showBlockClient" key="keyShowBlockClient")
                legend.chat-actions__title Вы уверены, что хотите заблокировать данного клиента?
                ul.chat-actions__buttons
                    li.chat-actions__buttons-item
                        base-btn(@click="blockClient") Заблокировать
                    li.chat-actions__buttons-item
                        base-btn(color="error" @click="showBlockClient=false") Отмена
            fieldset(v-if="showExitRoomConfirm" key="keyShowExitRoomConfirm")
                legend.chat-actions__title Вы единственный сотрудник на данный момент,#[br] вы точно хотите покинуть диалог?
                ul.chat-actions__buttons
                    li.chat-actions__buttons-item
                        base-btn(@click="exitRoom") Выйти
                    li.chat-actions__buttons-item
                        base-btn(color="error" @click="showExitRoomConfirm=false") Отмена

</template>

<script>
    import {httpParams,viewModeChat} from '@/mixins/mixins'
    export default {
        components: {},
        mixins:[viewModeChat,httpParams],
        data() {
            return {
                showBlockClient:false,
                showExitRoomConfirm:false
            }
        },
        computed:{
            showExit(){
                console.log('showConfirmExit',this.$store.state.roomActiveUsersActive,this.$store.state.roomActiveUsersActive.length > 1);
                return this.$store.state.roomActiveUsersActive.length > 1
            },
            showConfirmExit(){

                return this.$store.state.roomActiveUsersActive.length < 1
            }
        },
        created(){

        },
        methods:{
            exitRoom(){
                this.$http.post('chat-room-user-exit', {room_id:this.$store.state.roomActiveId})
                    .then(()=> {
                        this.$store.commit('visitors/selfMessageRemoveItem',this.httpParams.params)
                        this.$root.$emit('globBoxControlClose')


                        this.$router.push({name:'messageAll'})
                    })
            },
            exitRoomConfirm(){
                if (this.showConfirmExit) this.showExitRoomConfirm=true;
                else  this.exitRoom()

            },
            showBranch(){
                this.$root.$emit('showBranch')
            },
            showTransfer(){
                this.$root.$emit('showTransfer')
            },
            blockClient(){

                this.$http.post('guest-blocking', this.httpParams.params)
                    .then(() => {
                        this.$root.$emit('globBoxControlClose')
                    })
            }
        }

    }
</script>

<style lang="scss">
    .chat-actions {
        $color_info-dark:glob-color('info-dark');

        &__list {
            display:flex;
        }

        &__buttons {
            @extend %row-flex;


        }

        &__title {
            margin-bottom:calc-em(20);
            font-weight:700;
        }

        &__text-only-scr {
            @extend %visuallyhidden;
        }



        &__more-btn {
            .icon {
                fill:$color_info-dark;
                width:27px;
                height:17px;
            }
        }
        &__more-list {

        }
        &__more-item {
            padding-left:calc-em(25);
            padding-right:calc-em(25);
            white-space:nowrap;
        }

    }

</style>