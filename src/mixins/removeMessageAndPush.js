
export default {

    methods:{
        removeMessageAndPush(){
            this.$root.$emit('globBoxControlClose');
            this.$store.commit('visitors/selfMessageRemoveItem',this.httpParams.params);
            this.$store.commit('user/unreadUpdate',['guest',1]);
            this.$router.push({name:'messageAll'})
        },
    },
}

