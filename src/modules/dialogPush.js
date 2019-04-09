

function dialogPush(vm,dialogName,item){
    console.log(item);
    let {uuid, site_id} = item;
    let list = vm.$store.state.visitors[dialogName].slice()
    let findIndex = list.findIndex(item=>uuid+site_id===item.uuid+item.site_id)
    if(findIndex===-1) {
        let unread =(item.unread)?item.unread:[];
        vm.$set(item,'unread',unread)
        list.push(item)
        vm.$store.commit('visitors/newList',{field:dialogName,val:{list:list}})
    }


}







export default dialogPush