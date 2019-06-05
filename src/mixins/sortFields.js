import lodash_empty from 'lodash/isEmpty'
import lodash_sortBy from 'lodash/sortBy'
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
        sortFieldsDefault(val){
            console.log('sortFieldsDefault',val);
        },
        sortFieldsSort(val){
            console.log('sortFieldsSort',val);
        },
        sortFieldsList:'sortFieldsSetName'
    },
    computed:{
        sortFieldsComp(){
            return this.sortFieldsSort
        },
        sortFieldsListGet(){
            return lodash_sortBy(
                this.sortFieldsListSet.map(item=>{



                    return item
                }),
                [
                    (item)=>{
                        if(this.sortFieldsCurrentSort.field==='name') {
                            console.log(item[this.sortFieldsCurrentSort.field].length * (this.sortFieldsCurrentSort.val ? -1 : 1));
                            return item[this.sortFieldsCurrentSort.field].length*(this.sortFieldsCurrentSort.val?-1:1);
                        }
                        else  {
                            if(this.sortFieldsCurrentSort.field==='first_answers_in_20_40_seconds') {
                                console.log(this.sortFieldsCurrentSort.field,item);
                            }
                            if (item[this.sortFieldsCurrentSort.field] === 0) return 0
                            return item[this.sortFieldsCurrentSort.field]*(this.sortFieldsCurrentSort.val?-1:1)
                        }
                    }
                ]
            );
        }
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

