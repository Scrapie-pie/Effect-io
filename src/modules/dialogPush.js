

function dialogPush(vm,dialogName,item){
    console.log(item);
    let {uuid, site_id} = item;
    let list = vm.$store.state.visitors[dialogName].slice()
    let findIndex = list.findIndex(item=>uuid+site_id===item.uuid+item.site_id)
    if(findIndex===-1) {

        let unread =(item.unread)?item.unread:[];
        vm.$set(item,'unread',unread)

        let last_message_time =(item.last_message_time)?item.last_message_time:new Date().getTime()/1000;
        vm.$set(item,'last_message_time',last_message_time)

        list.push(item)
        vm.$store.commit('visitors/newList',{field:dialogName,val:{list:list}})
    }


}







export default dialogPush