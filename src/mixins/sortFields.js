import lodash_empty from 'lodash/isEmpty'
import lodash_sortBy from 'lodash/sortBy'
export default {
    data() {
        return {
            sortFieldsDefault: {},
            sortFieldsSort: {},
            sortFieldsCurrentSort: {
                field: '',
                val: ''
            }
        }
    },
    watch: {
        sortFieldsList: 'sortFieldsSetName'
    },
    computed: {
        sortFieldsComp() {
            return this.sortFieldsSort
        },
        sortFieldsListGet() {
            return lodash_sortBy(this.sortFieldsListSet, [
                item => {
                    if (this.sortFieldsCurrentSort.field === 'name') {
                        return (
                            item[this.sortFieldsCurrentSort.field].length *
                            (this.sortFieldsCurrentSort.val ? -1 : 1)
                        )
                    } else {
                        if (item[this.sortFieldsCurrentSort.field] === 0) return 0
                        return (
                            item[this.sortFieldsCurrentSort.field] *
                            (this.sortFieldsCurrentSort.val ? -1 : 1)
                        )
                    }
                }
            ])
        }
    },
    methods: {
        sortFieldsToggleName(index) {
            console.log(this.sortFieldsComp)
            return this.sortFieldsComp[Object.keys(this.sortFieldsComp)[index]]
        },
        sortFieldsSetName(sortFieldsList) {
            // once
            if (lodash_empty(sortFieldsList)) return
            if (!lodash_empty(this.sortFieldsDefault)) return
            if (Array.isArray(sortFieldsList)) {
                for (let key in sortFieldsList[0]) {
                    this.$set(this.sortFieldsDefault, key, false)
                }

                this.sortFieldsSort = this.sortFieldsDefault
                this.sortFieldsCurrentSort.field = Object.keys(sortFieldsList[0])[0]
                this.sortFieldsCurrentSort.val = true
                console.log(this.sortFieldsCurrentSort)
            }
        },
        sortFieldsSetSortField(val, index) {
            console.log(val, index)

            this.sortFieldsSort = Object.assign({}, this.sortFieldsDefault)
            this.$set(this.sortFieldsSort, index, val)
            this.sortFieldsCurrentSort.field = index
            this.sortFieldsCurrentSort.val = val
        }
    }
}
