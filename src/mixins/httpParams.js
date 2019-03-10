
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
                site_id = + this.$route.params.site_id;
            if(id) id=Number(id)

            if((uuid && site_id) || id) {
                this.httpParams = {
                    params:{
                        id,
                        uuid,
                        guest_uuid,
                        site_id
                    }
                }
            }



        }
    },
    computed:{

    }
}


