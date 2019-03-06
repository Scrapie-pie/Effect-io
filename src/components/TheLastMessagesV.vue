<template lang="pug">
    form.last-messages
        .last-messages__search()
            filter-search(
                :item-list="itemListSortUnread",
                @result="(val)=>filterSearchResult=val",
                @text="(val)=>search=val"
            )
        scroll-bar.last-messages__scrollbar(@ps-y-reach-end="loadDate")
            ul.last-messages__list
                li.last-messages__item(
                    v-for="(item, index) in filterSearchResult",
                    :key="item.uuid+item.site_id",
                    :class="{'last-messages__item_active':item.open,'last-messages__item_hot':item.hot}"
                )
                    router-link.last-messages__btn(
                        :to="item.link"
                        v-text="item.last_message"
                    )
                    base-people.last-messages__people(
                        :avatar-url="item.photo",
                        :avatar-stub="item.photo_stub",
                        :name="item.name",
                        :text="item.last_authorAndMessage",
                        :bg-text-no-fill="true",
                        :channel-name="$store.getters.channelName(item.channel_type)",
                        :count="item.unread.length"
                        hidden
                    )


</template>

<script>
    import _ from 'underscore'
    import filterSearch from '@/components/FilterSearch'
    import { viewModeChat,httpParams } from '@/mixins/mixins'
    export default {
        mixins:[viewModeChat,httpParams ],
        components:{filterSearch},
        data() {
            return {
                filterSearchResult:[],
                getItemListStart:true,
                search:'',
                limit:20,
                pageN:1,
                type:'',
                itemListCount: 0,
                itemList:[],
            }
        },
        computed:{
            itemListSortUnread(){
                return _.sortBy(this.itemListStore,(item)=>-item.unread.length);
            },
            itemListSortActiveFirst() {
                let itemActive,
                    list = this.itemListSortUnread.filter((item,index)=>{

                        if(item.uuid === this.httpParams.params.uuid){ //Todo у оператора id
                            itemActive = item;
                            return false
                        }
                        else return true
                    });
                if (list.length)  list.unshift(itemActive);

                return list
            },

            itemListStore(){
                let itemList = [];

                if (this.viewModeChat==="process")   {
                    itemList=this.$store.state.visitors.process.map(item=>{
                        let {uuid,site_id} = item;
                        item.link = {name:'process',params: { uuid,site_id}}
                        item.unread = [];



                        return this.itemFormat(item)
                    });

                }

                if (this.viewModeChat==="visitors")  {
                    itemList=this.$store.state.visitors.self.map(item=>{
                        let {uuid,site_id} = item;
                        item.link = {name:'chatId',params: { uuid,site_id}}

                        return this.itemFormat(item)
                    });
                }

                return itemList

            },
            showItemLength(){
                return this.itemList.length
            },
            pageNLast(){
                return this.itemListCount / this.limit
            },
            getOffset(){
                return this.limit * (this.pageN - 1)
            },
            requestData(){
                return {
                    params:{
                        search:this.search,
                        offset:this.getOffset,
                        limit:this.limit,
                        type:this.type
                    }
                }
            }
        },
        watch:{
            filterSearchResult(val){
                if (val.length && (this.$route.name=="processAll" || this.$route.name=="messageAll")) {
                    if (val[0].link)  {
                        this.$router.push(val[0].link)
                    }

                }

            },
            '$route'(to,from){
                if (this.viewModeChat==="process") this.type='unprocessed';
                if (this.viewModeChat==="visitors") this.type='self';

                if(to.name === from.name) return
                this.resetSearch();
                this.getItemList();
        },
            search:'debounceSearch',
        },
        created(){
            if (this.viewModeChat==="process") this.type='unprocessed';
            if (this.viewModeChat==="visitors") this.type='self';
        },
        methods:{
            itemFormat(item){
                item.last_authorAndMessage = this.authorAndMessage(item);

                if(this.httpParams) {
                    let {uuid,site_id} = this.httpParams.params;
                    item.open = (item.uuid+item.site_id === uuid+site_id)
                }
                return item
            },
            authorAndMessage({last_message_author,last_message}){
                let author = '';
                if(last_message_author) author = last_message_author +': '
                last_message = author + last_message;
                return last_message
            },
            debounceSearch:_.debounce(function()
            {
                this.resetSearch();
                this.getItemList();
            }, 500),
            resetSearch(){
                this.pageN=1;
                this.itemListCount= 0;
                this.itemList=[];
                this.getItemListStart=true;
            },
            loadDate(event){
                this.getItemList()
            },
            getItemList(){
                if(!this.getItemListStart) return;

                this.getItemListStart=false;

                if((this.showItemLength < this.itemListCount) || this.itemListCount===0) {
                    console.log('getItemList');
                    this.$http.get('guest-list',this.requestData).then(({data})=>{
                        this.getItemListStart=true;
                        if (data.data.count) {

                            this.itemList.push(...data.data.list);
                            this.itemListCount = data.data.count;
                            this.getItemListUnique();
                            this.pageN += 1;
                        }
                    })
                }
            },
            getItemListUnique(){
                let itemListStore = this.itemListStore;
                let itemListNew= []
                let itemListOld= []
                this.itemList.filter((item)=>{
                    let findIndex = this.itemListStore.findIndex((itemStore)=>itemStore.uuid+itemStore.site_id === item.uuid+item.site_id);
                    if (findIndex !== -1) {
                        itemListStore[findIndex] == item;
                        let {uuid,site_id} =  item
                        itemListOld.push({uuid,site_id})
                    } // обновляем в базе элемент если такой пришел из поиска
                    else {
                        itemListStore.push(item) // если в базе нет, добавляем в базу
                        let {uuid,site_id} =  item
                        itemListNew.push({uuid,site_id}) // если в базе нет, добавляем в базу
                    }



                })
              /*  console.log('itemListNew');
                console.table(itemListNew);
                console.log('itemListOld');
                console.table(itemListOld);*/
                //console.log('***********',itemListStore.length);


                if (this.viewModeChat==="process") this.$store.commit('visitors/process',{list:itemListStore})
                if (this.viewModeChat==="visitors")    this.$store.commit('visitors/self',{list:itemListStore})

            }
        }
    }
</script>

<style lang="scss">

    .last-messages{
        $color_bg-hover:glob-color('border');
        $color_bg-error:glob-color('error');
        $transition:$glob-trans;

        .ps__scrollbar-y-rail {
            z-index:2;
        }

        &__search{
            padding-left:calc-em(10);
            padding-right:calc-em(10);
        }

        &__scrollbar {
            height:100%;
        }

        &__list{
            padding-top:calc-em(10);
        }

        &__item{
            position:relative;
            transition:$transition;
            padding-left:calc-em(10);
            padding-top:calc-em(10);
            padding-bottom:calc-em(10);

            &:hover,&_active {
                background-color:$color_bg-hover;
            }

            &_hot {
                &::before {
                    content:'';
                    @extend %full-abs;
                    background-color:$color_bg-error;
                    opacity:.5;
                    z-index:0;
                }
            }
        }

        &__people{
            z-index:2;
            position:relative;
            pointer-events:none;

            .base-people__inner{
                flex:1 0 60%;
                width:60%;
                min-width:0;
            }
        }

        &__btn{
            @extend %full-abs;
            z-index:2;
            width:100%;
            height:100%;
            border-color:transparent;
            font-size:0;

        }
    }
</style>