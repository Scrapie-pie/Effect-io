import lodash_debounce from 'lodash/debounce'
import { viewModeChat } from '@/mixins/mixins'
export default {
    mixins: [viewModeChat],
    data() {
        return {
            containerFullFillItemListClassName: {
                scrollBar: '',
                item: ''
            },
            filterSearchResult: [],
            getItemListStart: true,
            search: '',
            limit: 20,
            pageN: 1,
            itemListCount: 0,
            itemList: [],
            apiMethod: 'guest/list'
        }
    },
    computed: {
        showItemLength() {
            return this.itemList.length
        },
        pageNLast() {
            return this.itemListCount / this.limit
        },
        getOffset() {
            return this.limit * (this.pageN - 1)
        },
        params() {
            return {
                search: this.search,
                offset: this.getOffset,
                limit: this.limit
            }
        },
        paramsComp() {
            return {}
        },
        requestData() {
            let params = Object.assign(this.params, this.paramsComp)
            //console.log('requestData',params);
            return { params }
        }
    },
    watch: {
        search: 'debounceSearch'
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
            this.itemListCount = 0
            this.itemList = []
            this.getItemListStart = true
        },
        getItemList() {
            if (!this.getItemListStart) return
            this.getItemListStart = false

            if (this.showItemLength < this.itemListCount || this.itemListCount === 0) {
                this.$http.get(this.apiMethod, this.requestData).then(({ data }) => {
                    this.getItemListStart = true
                    if (data.data.count) {
                        this.itemList.push(...data.data.list)
                        this.itemListCount = data.data.count
                        this.getItemListUnique()
                        this.pageN += 1
                        this.containerFullFillItemList()
                    }
                })
            }
        },
        getItemListUnique() {},

        containerFullFillItemList() {
            if (!this.containerFullFillItemListClassName.item) return
            //Заполняем свободную область элементами
            setTimeout(() => {
                if (
                    typeof document.querySelector(
                        '.' + this.containerFullFillItemListClassName.item
                    ) === 'undefined' ||
                    typeof document.querySelector(
                        '.' + this.containerFullFillItemListClassName.scrollBar
                    )
                ) {
                    return
                }
                let itemHeight = document.querySelector(
                        '.' + this.containerFullFillItemListClassName.item
                    ).clientHeight,
                    containerHeight = document.querySelector(
                        '.' + this.containerFullFillItemListClassName.scrollBar
                    ).clientHeight

                if (this.showItemLength * itemHeight < containerHeight) this.getItemList()
            }, 50)
        }
    }
}
