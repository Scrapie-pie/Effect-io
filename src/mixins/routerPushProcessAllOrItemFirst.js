
export default {
    methods:{
        routerPushProcessAllOrItemFirst(){
            let itemList = this.$store.state.visitors.process;
            if(!itemList.length) this.$router.push({name:'processAll'}); //Todo проверить доделать этот варивант
            else {
                console.log(!itemList.length,itemList,itemList.length,itemList[0]);
                let {uuid,site_id} = itemList[0];
                this.$router.push({name:'process',params: { uuid,site_id}});
            }
        }
    },
}
