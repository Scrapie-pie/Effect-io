export default {

    created() {
        this.$root.$on('processRemoveItem',this.unprocessedRemove)
    },
    beforeDestroy(){
        this.$root.$off('processRemoveItem',this.unprocessedRemove)
    },
    methods: {
        unprocessedRemove(item){
            console.log(item);
            let {guest_uuid,site_id} = item
            let findIndex = this.$store.state.visitors.process.findIndex(
                processItem=>{
                    console.log(processItem.site_id + processItem.guest_uuid,guest_uuid,site_id);
                    return processItem.guest_uuid+processItem.site_id===guest_uuid+site_id}
            )


            console.log('В удаление отказано',findIndex,guest_uuid,site_id);


            if(findIndex!=-1) {
                this.$store.commit('visitors/processRemoveItem', findIndex)
                this.$store.commit('user/unreadUpdate', ['unprocessed', -1])
                console.log('Удаляем обработанное',guest_uuid,site_id);
            }
        },

    },
    computed: {}
}
