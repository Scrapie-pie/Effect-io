import lodash_once from 'lodash/once'
import lodash_debounce from 'lodash/debounce'
import {viewModeChat} from '@/mixins/mixins'
export default {
    mixins:[viewModeChat],
    data() {
        return {
            containerFullFillItemListClassName:{
                scrollBar:'',
                item:''
            },
            filterSearchResult:[],
            getItemListStart:true,
            search: '',
            limit:11,
            pageN:1,
            itemListCount: 0,
            itemList:[],
            apiMethod:'guest-list'
        }
    },
    computed:{
        showItemLength(){
            return this.itemList.length
        },
        pageNLast(){
            return this.itemListCount / this.limit
        },
        getOffset(){
            return this.limit * (this.pageN - 1)
        },
        params() {
            return {
                search:this.search,
                offset:this.getOffset,
                limit:this.limit,
            }
        },
        paramsComp(){
            return {}
        },
        requestData(){
            let params = Object.assign(this.params, this.paramsComp)
            console.log('requestData',params);
            return {params}
        }

    },
    watch:{
        search:'debounceSearch',
    },
    methods:{
        debounceSearch:lodash_debounce(function(val,oldVal)
        {
            this.debounceSearchMethods(val,oldVal)
        }, 500),
        debounceSearchMethods(val,oldVal){
            console.log('debounceSearchMethods');
            this.resetSearch();
            this.getItemList();
        },
        scrollLoad(e){
            //console.log('scrollLoad',e);
            if(this.scrollLoadAllow(e)) this.getItemList()
        },
        resetSearch(){
            console.log('resetSearch');
            this.pageN=1;
            this.itemListCount= 0;
            this.itemList=[];
            this.getItemListStart=true;
        },
        getItemList(){
            console.log('getItemList');
            if(!this.getItemListStart) return;
            this.getItemListStart=false;

            if((this.showItemLength < this.itemListCount) || this.itemListCount===0) {

                this.$http.get(this.apiMethod,this.requestData).then(({data})=>{
                    this.getItemListStart=true;
                    if (data.data.count) {

                        this.itemList.push(...data.data.list);
                        this.itemListCount = data.data.count;
                        this.getItemListUnique();
                        this.pageN += 1;
                        this.containerFullFillItemList()
                    }
                })
            }
        },
        getItemListUnique(){
            console.log('getItemListUnique');
            let itemListStore = this.itemListStore.slice();

            let itemListNew= []
            let itemListOld= []
            console.log(itemListStore,this.itemList);
            this.itemList.filter((item)=>{
                let findIndex = this.itemListStore.findIndex((itemStore)=>itemStore.uuid+itemStore.site_id === item.uuid+item.site_id);
                if (findIndex !== -1) {
                    itemListStore[findIndex] = item;
                    let {uuid,site_id} =  item
                    itemListOld.push({uuid,site_id})
                } // обновляем в базе элемент если такой пришел из поиска
                else {
                    itemListStore.push(item) // если в базе нет, добавляем в базу
                    let {uuid,site_id} =  item
                    itemListNew.push({uuid,site_id}) // если в базе нет, добавляем в базу
                }
            })



            if (this.viewModeChat==="process") this.$store.commit('visitors/process',{list:itemListStore})
            if (this.viewModeChat==="visitors")    this.$store.commit('visitors/self',{list:itemListStore})


            if (this.viewModeChat==="all")    {
                this.$store.commit('visitors/newList',{field:this.viewModeChat,val:{list:itemListStore}})
            }

        },

        containerFullFillItemList:lodash_once(function(){
            if(!this.containerFullFillItemListClassName.item) return
            //Заполняем свободную область элементами
            setTimeout(()=>{
                let itemHeight = document.querySelector('.'+this.containerFullFillItemListClassName.item).clientHeight,
                    containerHeight =  document.querySelector('.'+this.containerFullFillItemListClassName.scrollBar).clientHeight;
                console.log(this.showItemLength * itemHeight , containerHeight);
                if(this.showItemLength*itemHeight < containerHeight) this.getItemList()
            },50)
        })
    }

}

