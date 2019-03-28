
export default {
    filters:{
        format(value,type){
            if(!value) return '-';
            if(type==='percent') value+=' %'
            if(type==='time') {
                let sec = Number(value);
                if(!sec) return '-'
                let h = sec/3600 ^ 0 ;
                let m = (sec-h*3600)/60 ^ 0 ;
                let s = sec-h*3600-m*60 ;

                value = (h?h+" ч. ":'')+(m?m+" мин. ":'')+(s?s+" сек.":'')
            }
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
        limit:{
            type:Number,
            default:null,
        },
        order:{
            type:String,
            default:null,
        },
        date_from:{
            type:String,
            default:null,
        },
        date_to:{
            type:String,
            default:null,
        },
        last_days:{
            type:Number,
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
                limit:this.limit,
                order:this.order,
                user_id:this.user_id,
                branch_id:this.branch_id,
                last_days:this.last_days,
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

