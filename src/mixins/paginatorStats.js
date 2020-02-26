import lodash_debounce from 'lodash/debounce'
import lodash_isEqual from 'lodash/isEqual'
import lodash_cloneDeep from 'lodash/cloneDeep'

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

            requestDataPrev:{},
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

            }
        },
        paramsComp(){
            return {}
        },

        requestData() {
            let params = Object.assign(
                this.params_paginator,
                {
                    offset: this.getOffset,
                    limit: this.limit
                },
                this.params,
                this.paramsComp
            )
            //console.log('requestData',params);
            return { params }
        }
    },

    watch: {
        $route(){
            console.log('$route');
        },
        search: 'debounceSearch',
        params(val) {
            console.log('params',val);
            this.resetSearch()
            this.getItemList()
        },

        paramsComp(val) {
            console.log('paramsComp');
            this.resetSearch()
            this.getItemList()
        }
    },
    created(){
        this.$root.$on('statsScrollDown',this.scrollLoad)
        this.getItemList()
        console.log('created getItemList');
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
            console.log('scrollLoad');
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


                //if(lodash_isEqual(this.requestData,this.requestDataPrev)) return //created>this.getItemList() следом срабатывал watch>params
                console.log(this.requestData, this.requestDataPrev);

                if (this.isNoFinishData) {



                    console.log('start');
                    this.requestDataPrev=lodash_cloneDeep(this.requestData)
                    this.$http.get(this.apiMethod, this.requestData).then(({ data }) => {
                        console.log('finish');
                        this.getItemListStart = true





                        //if (data.data.count) {
                            this.bodyList.push(...data.data.list)
                            //this.bodyListCount = data.data.count


                        console.log(this.requestDataPrev);



                        //}

                        if(data.data.list.length===0 || data.data.list.length < this.limit)  {
                                this.isNoFinishData=false;
                        } else {
                            this.pageN += 1
                        }

                    })
                }
            }



        },

    }
}
