<template lang="pug">
    fieldset.process-actions
        ul.process-actions__list
            li.process-actions__item

                base-btn(
                    color="success-dark"
                    size="lg" ,
                    @click="processActionYes"
                    v-text="btnTextYes"
                )
            li.process-actions__item
                base-btn(color="info-dark" size="lg" @click="processActionNo") Отклонить
</template>

<script>
 import {httpParams } from '@/mixins/mixins'
    import lodash_find from 'lodash/find'
export default {

    mixins:[httpParams],
  /*  watch:{ //Todo какой то косяк если раскоментирую
        systemMessage(val){
            console.log(val);
            //if (val) this.$root.$emit('chatSystemMessages',this.systemMessages)
        }
    },*/
    data() {
        return {}
    },
    computed:{
        btnTextYes(){
            let text
            if(this.status === 'recipient') text = 'Принять';
            if(this.status === 'invited') text = 'Присоединиться';
            if(this.status === 'unprocessed') text = 'Ответить';
            return text
        },
        process(){
            console.log(this.httpParams);
            let {uuid,site_id} = this.httpParams.params;
            return lodash_find(this.$store.state.visitors.process, {uuid, site_id}) || {}
        },
        status(){
            return this.process.status
        },
        comment(){
            return this.process.last_message
        },
        author(){
            return this.process.last_message_author
        },
        systemMessage(){
            return {
                position:'footer',
                type:this.status,
                name:this.author,
                text:this.comment
            }
        }

    },

    methods:{
        processActionNo(){
            if(this.status) this[this.status+'No']()

        },
        processActionYes(){
            if(this.status) this[this.status]()

        },
        recipient(){

            this.$http.post('guest-transfer-acceptance',this.httpParams.params);
        },
        unprocessed(){
            this.$http.put('guest-take', this.httpParams.params)
                .then(({ data }) => {
                    let {uuid,site_id} = this.httpParams.params;
                    this.$router.push({name:'chatId',params: { uuid,site_id}});
                })
        },

        invited(){
            this.$http.post('chat-room-user-accept-invitation', {
                room_id:141

            });
        },
        invitedNo(){
            this.$http.post('chat-room-user-decline-invitation', {
                room_id:141

            });
        },
    }
}
</script>

<style lang="scss">
    .process-actions{
        &__list {
            @extend %row-flex;
        }
    }
</style>