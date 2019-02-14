
export default {
    computed:{
        viewModeChat(){
            if(this.$route.name !== "teamChat") return 'visitors';
            else return 'operators';
        },
    }

}

