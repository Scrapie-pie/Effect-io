
export default {
    computed:{
        viewModeChat(){

            if(this.$route.name == "teamChat") return 'operators';
            if(this.$route.name == "chatId" || this.$route.name == "chat") return 'visitors';
            else return false

        },
    }

}

