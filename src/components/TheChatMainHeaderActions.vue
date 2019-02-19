<template lang="pug">
    form.chat-actions
        transition(name="fade" mode="out-in")
            fieldset(v-if="!showBlockClient" key="keyHideBlockClient")
                legend.chat-actions__text-only-scr Выберите одно из действий
                ul.chat-actions__list
                    li.chat-actions__more-item
                        base-btn(
                            :icon="{name:'transfer',top:true}"
                            @click.prevent="showTransfer()"
                        ) Передать диалог

                    li.chat-actions__more-item
                        base-btn(:icon="{name:'exit',top:true}") Выйти из диалога
                    li.chat-actions__more-item
                        base-btn(:icon="{name:'bl',top:true}", @click="showBlockClient=true") Блокировать клиента
            fieldset(v-else key="keyShowBlockClient")
                legend.chat-actions__title Вы уверены, что хотите заблокировать данного клиента?
                ul.chat-actions__buttons
                    li.chat-actions__buttons-item
                        base-btn(@click="blockClient") Заблокировать
                    li.chat-actions__buttons-item
                        base-btn(color="error" @click="showBlockClient=false") Отмена


</template>

<script>
    export default {
        components: {},

        data() {
            return {
                showBlockClient:false,
            }
        },
        created(){

        },
        methods:{
            showTransfer(){
                this.$root.$emit('showTransfer')
            },
            blockClient(){
                let data =  this.$store.getters['visitors/itemOpenIds'];
                this.$http.post('guest-blocking', data)
                    .then(({data}) => {
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