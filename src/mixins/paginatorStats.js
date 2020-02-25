import lodash_debounce from 'lodash/debounce'

import { scrollbar } from '@/mixins/mixins'

export default {
    mixins:[scrollbar],
    props:{
        search:{
            type:String,
            default:''
        }
    },
    data() {
        return {


            getItemListStart: true,
            isNoFinishData:true,
            limit: 20,
            pageN: 1,
            bodyListCount: 0,
            apiMethod:'statistic/get-by-params'


        }
    },
    computed: {
        showItemLength() {
            return this.bodyList.length
        },
        pageNLast() {
            return this.bodyListCount / this.limit
        },
        getOffset() {
            return this.limit * (this.pageN - 1)
        },
        params_paginator() {
            return {
                search:this.search,
                offset: this.getOffset,
                limit: this.limit
            }
        },
        paramsComp(){
            return {}
        },

        requestData() {
            let params = Object.assign(this.params_paginator, this.params,this.paramsComp)
            //console.log('requestData',params);
            return { params }
        }
    },

    watch: {
        search: 'debounceSearch',
        params(val) {
            this.resetSearch()
            this.getItemList()
        },

        paramsComp(val) {
            this.resetSearch()
            this.getItemList()
        }
    },
    created(){
        this.$root.$on('statsScrollDown',this.scrollLoad)
        this.getItemList()
    },
    beforeDestroy(){
        this.$root.$off('statsScrollDown')
    },
    methods: {
        debounceSearch: lodash_debounce(function(val, oldVal) {
            this.debounceSearchMethods(val, oldVal)
        }, 500),
        debounceSearchMethods(val, oldVal) {
            //console.log('debounceSearchMethods');
            this.resetSearch()
            this.getItemList()
        },
        scrollLoad(e) {

            //console.log('scrollLoad',e);
            if (this.scrollLoadAllow(e)) this.getItemList()
        },
        resetSearch() {
            console.log('resetSearch');
            this.isNoFinishData=true
            this.pageN = 1
            this.bodyListCount = 0
            this.bodyList = []
            this.getItemListStart = true
        },
        get() {//чистим метод из stats.js

        },
        getItemList() {

            if (this.last_days || (this.date_from && this.date_to)) {


                if (!this.getItemListStart) return
                this.getItemListStart = false
                console.log(this.isNoFinishData);
                if (this.isNoFinishData) {
                    console.log(this.isNoFinishData);
                    this.$http.get(this.apiMethod, this.requestData).then(({ data }) => {

                        this.getItemListStart = true

                        console.log(data);



                        //if (data.data.count) {
                            this.bodyList.push(...data.data.list)
                            //this.bodyListCount = data.data.count

                            this.pageN += 1

                        //}

                        if(data.data.list.length===0 ||data.data.list.length < this.limit)  this.isNoFinishData=false
                        //console.log(this.isNoFinishData);
                    })
                }
            }



        },

    }
}
