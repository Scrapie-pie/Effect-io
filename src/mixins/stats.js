
export default {
    filters:{
        format(value,type){
            console.log(value, type);
            if(!value) return '-';
            if(type==='percent') value+=' %'
            if(type==='time') value+=' сек.'
            return value
        }
    },
    props:{
        filterListOn:{
            type:Boolean,
            default:false,
        },
        filterList:{
            type:Array,
            default:function () {
                return []
            },
        },
        caption:{
            type:String,
            default:null,
        },

        type:{
            type:String,
            default:null,
        },
        order:{
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
        },

        btnDetailHide:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            csv:0,
            bodyList:[],
        }
    },
    watch:{
        bodyListFormat(val){
            if(val){
                this.$emit('itemList',val)
            }
        },
        params(val){
            this.get()
        }
    },
    computed:{
        itemList(){
            if(this.filterListOn) return this.filterList
            else return this.bodyListFormat
        },
        bodyListFormat(){
            return this.bodyList
        },
        requestData(){
            return {params:this.params}
        },
        params(){
            return {
                user_id:this.user_id,
                branch_id:this.branch_id,
                period:this.period,
                type:this.type,
                csv:this.csv,
            }
        },
    },
    created(){
        this.get();
    },

    methods:{
        get(){
            this.$http.get('statistic-get-by-params',this.requestData).then((response)=>{
                this.bodyList = response.data.data
            })
        }
    },
}

