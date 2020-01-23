import lodash_debounce from 'lodash/debounce'

import { scrollbar } from '@/mixins/mixins'

export default {
    mixins:[scrollbar],
    data() {
        return {


            getItemListStart: true,
            search: '',
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
                search: this.search,
                offset: this.getOffset,
                limit: this.limit
            }
        },

        requestData() {
            let params = Object.assign(this.params_paginator, this.params)
            //console.log('requestData',params);
            return { params }
        }
    },
    watch: {
        search: 'debounceSearch',
        requestData(val) {
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
            this.pageN = 1
            this.bodyListCount = 0
            this.bodyList = []
            this.getItemListStart = true
        },
        get() {//чистим метод из stats.js

        },
        getItemList() {
            console.log('getItemList');
            if (this.last_days || (this.date_from && this.date_to)) {


                if (!this.getItemListStart) return
                this.getItemListStart = false

                if (this.showItemLength < this.bodyListCount || this.bodyListCount === 0) {
                    this.$http.get(this.apiMethod, this.requestData).then(({ data }) => {
                        this.getItemListStart = true
                        if (data.data.count) {
                            this.bodyList.push(...data.data.list)
                            this.bodyListCount = data.data.count

                            this.pageN += 1

                        }
                    })
                }
            }



        },

    }
}
