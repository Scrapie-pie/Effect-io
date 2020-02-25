import { datetimeStoHMS } from '@/modules/datetime'

export default {
    filters: {
        format(value, type) {
            if (value === 0 && type === 'percent') {
                value = 0
            } else if (!value) {
                return '-'
            }
            if (type === 'percent') value += ' %'
            if (type === 'time') {
                value = datetimeStoHMS(value)
            }
            return value
        }
    },
    props: {
        filterListOn: {
            type: Boolean,
            default: false
        },
        filterList: {
            type: Array,
            default: function() {
                return []
            }
        },
        caption: {
            type: String,
            default: null
        },

        type: {
            type: String,
            default: null
        },
   /*     limit: {
            type: Number,
            default: null
        },*/
        order: {
            type: String,
            default: null
        },
        date_from: {
            type: String,
            default: ''
        },
        date_to: {
            type: String,
            default: ''
        },
        time_from: {
            type: String,
            default: ''
        },
        time_to: {
            type: String,
            default: ''
        },
        last_days: {
            type: String,
            default: ''
        },
        branch_id: {
            type: Number,
            default: null
        },
        user_id: {
            type: Number,
            default: null
        },
        users_ids: {
            type: Array,
            default: ()=>[]
        },

        btnDetailHide: {
            type: Boolean,
            default: false
        },
        setBodyList: {
            type: [Array, Object],
            default: null
        },
        is_one_time_chat: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            csv: 0,
            bodyList: [],
            by_dates: 0,

        }
    },
    watch: {
        setBodyList(val) {
            if (val) {
                this.bodyList = val
            }
        },
        bodyListFormat(val) {
            if (val) {
                this.$emit('itemList', val)
            }
        },
        params(val) {

            this.get()
        }
    },
    computed: {
        itemList() {
            if (this.filterListOn) return this.filterList
            else return this.bodyListFormat
        },
        bodyListFormat() {
            return this.bodyList
        },
        requestData() {
            return { params: this.params }
        },
        params() {

            let by_dates = this.by_dates;
            let type = this.type;

           /* if (this.$route.name === 'statsAllBranch' && this.by_dates) {
                type = 'branch'
            }*/


            return {
                last_days: this.last_days,
                date_from: this.date_from,
                date_to: this.date_to,
                time_from: this.time_from,
                time_to: this.time_to,

                //limit: this.limit,
                order: this.order,
                user_id: this.user_id,
                users_ids: this.users_ids,
                branch_id: this.branch_id,

                is_one_time_chat: this.is_one_time_chat,

                type,
                csv: this.csv,
                by_dates
            }
        }
    },
    created() {
        this.get()
    },

    methods: {

        get() {


            if (this.last_days || (this.date_from && this.date_to)) {

                this.bodyList = []

                if(this.$route.name==='statsAllOperator' && this.by_dates===0) {

                    let isWaitFinish = false

                    this.$http.get('statistic/get-by-params', this.requestData).then(response =>{

                        this.$set(this.bodyList, 0, response.data.data[0])

                            if(!isWaitFinish) this.$wait.start('pageStats')

                    })


                    this.$http.get('statistic/get-by-params?',{
                        params:Object.assign({}, this.params, { by_dates:1 })
                    }).then((response)=>{
                        this.bodyList.splice(1,0,...response.data.data)

                        isWaitFinish = true
                        this.$wait.end('pageStats')
                    })

                    return
                }

                if(this.$route.name==='statsAllBranch' && this.by_dates===0) {

                    let isWaitFinish = false

                    this.$http.get('statistic/get-by-params', this.requestData).then(response =>{
                        this.$set(this.bodyList, 0, response.data.data[0]);
                        if(!isWaitFinish) this.$wait.start('pageStats')
                    })


                    this.$http.get('statistic/get-by-params',{
                        params:Object.assign({}, this.params, { type: 'employees',by_dates:1 })
                    }).then((response)=>{

                        this.bodyList.splice(1,0,...response.data.data)

                        isWaitFinish = true
                        this.$wait.end('pageStats')
                    })

                    return
                }


                this.$http.get('statistic/get-by-params', this.requestData).then(response =>this.bodyList = response.data.data)


            }
        }
    }
}
