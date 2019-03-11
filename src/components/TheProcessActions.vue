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
 import {httpParams,routerPushProcessAllOrItemFirst } from '@/mixins/mixins'
    import lodash_find from 'lodash/find'
export default {

    mixins:[httpParams,routerPushProcessAllOrItemFirst],
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
        roomId(){
            return this.process.room_id
        },
        btnTextYes(){
            let text
            if(this.status === 'recipient') text = 'Принять';
            if(this.status === 'invited') text = 'Присоединиться';
            if(this.status === 'unprocessed') text = 'Ответить';
            return text
        },
        process(){
            let {params:{uuid,site_id}} = this.httpParams;

            if (uuid && site_id) return lodash_find(this.$store.state.visitors.process, {uuid, site_id}) || {}
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
        routerNext(status){
            let {uuid,site_id} = this.httpParams.params;

            this.$store.commit('visitors/processRemoveItem',{ uuid,site_id});
            this.$store.commit('user/unreadUpdate',['unprocessed',-1])

            if(status==="no"){
                this.routerPushProcessAllOrItemFirst()
            }

            if(status==="yes"){
                this.$router.push({name:'chatId',params: { uuid,site_id}});
            }


        },

        processActionNo(){
            if(this.status) this[this.status+'No']().then(() => this.routerNext('no'));
        },
        processActionYes(){
            if(this.status) this[this.status]().then(() => this.routerNext('yes'));
        },
        recipient(){
            return this.$http.put('guest-transfer-acceptance',this.httpParams.params)
        },
        recipientNo(){
            return this.$http.put('guest-transfer-decline',this.httpParams.params)
        },
        unprocessed(){
            return this.$http.put('guest-take', this.httpParams.params)
        },
        unprocessedNo(){
           return this.$http.post('chat-room-user-decline-guest', this.httpParams.params)
        },
        invited(){
           return this.$http.post('chat-room-user-accept-invitation', {room_id:this.roomId})
        },
        invitedNo(){
            return this.$http.post('chat-room-user-decline-invitation', {room_id:this.roomId})
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