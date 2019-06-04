import lodash_empty from 'lodash/isEmpty'

export default {
    data() {
        return {

            sortFieldsDefault: {},
            sortFieldsSort:{},
            sortFieldsCurrentSort:{
                field:'',
                val:''
            },
        }
    },
    watch:{
        sortFieldsList:'sortFieldsSetName'
    },
    computed:{
        sortFieldsComp(){
            return this.sortFieldsSort
        },
    },
    methods:{
        sortFieldsSetName(sortFieldsList){ // once
            if(lodash_empty(sortFieldsList)) return
            if(!lodash_empty(this.sortFieldsDefault)) return
            if(Array.isArray(sortFieldsList)) {

                for (let key in sortFieldsList[0]) {
                    this.$set(this.sortFieldsDefault,key,false)
                }

                this.sortFieldsSort = this.sortFieldsDefault
                this.sortFieldsCurrentSort.field = Object.keys(sortFieldsList[0])[0]
                this.sortFieldsCurrentSort.val = true;
                console.log(this.sortFieldsCurrentSort);


            }

        },
        sortFieldsSetSortField(val,index){
            console.log(val, index);

            this.sortFieldsSort =  Object.assign({},this.sortFieldsDefault);;
            this.$set(this.sortFieldsSort,index,val);
            this.sortFieldsCurrentSort.field = index
            this.sortFieldsCurrentSort.val = val
        },

    },


}

