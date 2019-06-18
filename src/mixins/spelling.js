


export default {


    data() {
        return {
            spellingShow:false,
            spellingCheck:0,
            spellingList:1,
            spellingIgnoredWords:[],
            spellingMessage:''
        }
    },


    created(){
        this.spellingCheck = this.$store.state.user.profile.spelling
    },

    methods:{
        spellingShowBox(list){
            if(list.length) {
                this.spellingList = list
                this.spellingShow=true;

            }
        }

    },
    watch:{
        spellingCheck(val){
            this.$http.post('spelling/spelling/settings',
                {
                    enabled:this.spellingCheck
                })
                .then(()=>{


            });

        }
    }
}

