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
        routerNextNo(){
            console.log(this.httpParams.params);
            this.$store.commit('visitors/processRemoveItem',this.httpParams.params);
            this.$store.commit('user/unreadUpdate',['unprocessed',-1])
            let itemList = this.$store.state.visitors.process;
            if(!itemList.length) this.$router.push({name:'processAll'}); //Todo проверить доделать этот варивант
            else {
                console.log(!itemList.length,itemList,itemList.length,itemList[0]);
                let {uuid,site_id} = itemList[0];
                this.$router.push({name:'process',params: { uuid,site_id}});
            }





        },
        routerNextYes(){
            let {uuid,site_id} = this.httpParams.params;
            this.$router.push({name:'chatId',params: { uuid,site_id}});
        },
        processActionNo(){
            if(this.status) this[this.status+'No']()

        },
        processActionYes(){
            if(this.status) this[this.status]()

        },
        recipient(){

            this.$http.put('guest-transfer-acceptance',this.httpParams.params).then(()=>{
                this.routerNextYes()
            });
        },
        recipientNo(){


            this.$http.put('guest-transfer-decline',this.httpParams.params).then(()=>{
                this.routerNextNo()

            });
        },
        unprocessedNo(){



            this.$http.post('chat-room-user-decline-guest', this.httpParams.params)
                .then(({ data }) => {
                    this.routerNextNo()

                })
        },
        unprocessed(){
            this.$http.put('guest-take', this.httpParams.params)
                .then(({ data }) => {
                    this.routerNextYes()
                })
        },

        invited(){
            this.$http.post('chat-room-user-accept-invitation', {
                room_id:this.roomId

            }).then(({ data }) => {
                let {uuid,site_id} = this.httpParams.params;
                this.$router.push({name:'chatId',params: { uuid,site_id}});
            });
        },
        invitedNo(){
            this.$http.post('chat-room-user-decline-invitation', {
                room_id:this.roomId

            }).then(()=>{
                this.routerNextNo()
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