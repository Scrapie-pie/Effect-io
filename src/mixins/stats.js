
export default {
    props:{
        caption:{
            type:String,
            default:null,
        },

        type:{
            type:String,
            default:null,
        },
        period:{
            type:String,
            default:null,
        },
        branch_id:{
            type:Number,
            default:null
        },
        user_id:{
            type:Number,
            default:null
        }
    },
    data() {
        return {
            headList:[],
            bodyList:[],
        }
    },
    computed:{
        bodyListFormat(){
            return this.bodyList
        },
        requestData(){
            return {params:this.params}
        },
        params(){
            return {
                user_id:this.user_id,
                branches_id:this.branches_id,
                period:this.period,
                type:this.type
            }
        },
    },
    created(){
        this.get()
    },

    methods:{
        get(){
            this.$http.get('statistic-get-by-params',this.requestData).then(({data})=>this.bodyList = data.data)
        }
    },
}

