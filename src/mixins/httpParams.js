
export default {
    data(){
        return {
            httpParams:null
        }
    },

    watch:{
        '$route':'getHttpParams'
    },
    created(){
        this.getHttpParams()
    },
    methods:{
        getHttpParams(){

            let id=this.$route.params.id,
                uuid=this.$route.params.uuid,
                guest_uuid=this.$route.params.uuid,
                site_id = + this.$route.params.site_id,
                chat_id = this.$route.params.chat_id;
            if(chat_id) chat_id=Number(chat_id)
            if(id) id=Number(id)

            if((uuid && site_id) || id) {
                this.httpParams = {
                    params:{
                        id,
                        uuid,
                        guest_uuid,
                        site_id,
                        chat_id
                    }
                }
            }



        }
    },
    computed:{

    }
}


