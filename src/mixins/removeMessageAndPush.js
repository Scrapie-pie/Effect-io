
export default {

    methods:{
        removeMessageAndPush(){
            this.$root.$emit('globBoxControlClose');
            this.$store.dispatch('setMessageRead', {
                    uuid:this.httpParams.params.uuid,
                    site_id:this.httpParams.params.site_id,
                    type:'visitors'
                }
            );
            this.$store.commit('visitors/selfMessageRemoveItem',this.httpParams.params);
            this.$router.push({name:'messageAll'})
        },
    },
}

