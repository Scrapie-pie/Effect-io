<template lang="pug">
    form.last-messages
        .last-messages__search()
            filter-search(
                :item-list="itemListSort",
                @result="(val)=>filterSearchResult=val",
                @text="(val)=>search=val"
            )
        scroll-bar.last-messages__scrollbar(@ps-scroll-down="scrollDown" ref="scrollbar")
            ul.last-messages__list
                li.last-messages__item(
                    v-for="(item, index) in filterSearchResult",
                    :key="item.uuid+item.site_id",
                    :class="{'last-messages__item_active':item.open,'last-messages__item_hot':item.hot,'last-messages__item_very-hot':item.very_hot}"
                )
                    router-link.last-messages__btn(
                        :to="item.link"
                        v-text="item.last_message"
                    )
                    base-people.last-messages__people(
                        :avatar-url="item.photo",
                        :avatar-stub="item.photo_stub",
                        :avatar-name="item.avatarName",
                        :name="item | name(visitorInfo)",
                        :text="item.last_authorAndMessage | wrapTextUrls",
                        :bg-text-no-fill="true",
                        :channel-name="$store.getters.channelName(item.channel_type)",
                        :count="item.unread.length"
                        hidden
                    )


</template>

<script>
    import lodash_sortBy from 'lodash/sortBy'
    import lodash_debounce from 'lodash/debounce'
    import lodash_once from 'lodash/once'
    import filterSearch from '@/components/FilterSearch'
    import { viewModeChat,httpParams,scrollbar } from '@/mixins/mixins'
    import wrapTextUrls from '@/modules/wrapTextUrls'

    export default {
        mixins:[viewModeChat,httpParams ,scrollbar],
        components:{filterSearch},
        filters: {
            name(item,visitorInfo){
                if(item.very_hot) return item.name
                if(item.uuid+item.site_id === visitorInfo.uuid+visitorInfo.site_id) return visitorInfo.name
                else return item.name
            },
            wrapTextUrls
        },
        data() {
            return {
                classNameScrollBar:'last-messages',
                filterSearchResult:[],
                getItemListStart:true,

                search:'',
                limit:20,
                pageN:1,
                pageNBeforeSearch:null,
                type:'',
                itemListCount: 0,
                itemList:[],
            }
        },
        computed:{
            visitorInfo(){
                return this.$store.state.visitors.itemOpen
            },
            itemListSort(){
                return lodash_sortBy(
                    this.itemListStore,
                    [
                        (item)=>item.very_hot,
                        (item,index)=>index,
                        (item)=>-item.unread.length
                    ]
                );
            },
            itemListSortActiveFirst() {
                let itemActive,
                    list = this.itemListSort.filter((item,index)=>{

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
            pageN(val){
                if(!this.search) {
                    if (this.viewModeChat==="process")  this.$store.commit('visitors/setProcessLastPageN',val);
                    if (this.viewModeChat==="visitors")  this.$store.commit('visitors/setSelfLastPageN',val);

                }
            },
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

                if(to.name !== from.name) {
                    this.setLastPageN()
                    if(this.itemListStore.length) return
                    this.resetSearch();


                    this.getItemList();
                }
        },
            search:'debounceSearch',
        },
        created(){
            console.log('create')

            if (this.viewModeChat==="process") this.type='unprocessed';
            if (this.viewModeChat==="visitors") this.type='self';
            this.setLastPageN();
            if(!this.itemListStore.length) {

                this.getItemList()
            }
        },
        methods:{
            setLastPageN(){
                if (this.viewModeChat==="process" && this.$store.state.visitors.processLastPageN) this.pageN = this.$store.state.visitors.processLastPageN;
                if (this.viewModeChat==="visitors" && this.$store.state.visitors.selfLastPageN) this.pageN = this.$store.state.visitors.selfLastPageN;
                console.log('pageN',this.pageN);
            },
            itemFormat(item){
                if(item.very_hot) { ///такое только в не обработанном
                    item.avatarName='warning';
                    item.name = 'Диалог необходимо <br> принять <br> в приоритетном порядке!'
                    item.last_authorAndMessage = 'Передача диалога...'
                } else {
                    item.last_authorAndMessage = this.authorAndMessage(item);
                }
                if(this.httpParams) {
                    let {uuid,site_id} = this.httpParams.params;
                    item.open = (item.uuid+item.site_id === uuid+site_id)
                }
                return item
            },
            authorAndMessage({last_message_author,last_message,files}){
                let author = '';
                if(!last_message && files && files.length) last_message = 'Прикреплены файлы'
                if(last_message_author) author = last_message_author +': '
                last_message = author + last_message;
                return last_message
            },
            debounceSearch:lodash_debounce(function(val,oldVal) {

                if(!oldVal) this.pageNBeforeSearch = this.pageN; //запоминаем загруженную страницу

                this.resetSearch();

                if(!val) { // что бы после поиска начать загружать дальше, а не завного
                    this.pageN  = this.pageNBeforeSearch;
                    return
                }




                this.getItemList();
                this.scrollbarScrollerPush(this.$refs.scrollbar,0)
                }, 500
            ),
            resetSearch(){
                this.pageN=1;
                this.itemListCount= 0;
                this.itemList=[];
                this.getItemListStart=true;
            },
            scrollDown(e){
                if(this.scrollLoadAllow(e)) this.getItemList()
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


                            this.containerFullFillItemList()
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

            },
            containerFullFillItemList:lodash_once(function(){

                //Заполняем свободную область элементами
                setTimeout(()=>{
                    let itemHeight = document.querySelector('.'+this.classNameScrollBar+'__item').clientHeight,
                        containerHeight =  document.querySelector('.'+this.classNameScrollBar+'__scrollbar').clientHeight;
                    console.log(this.showItemLength * itemHeight , containerHeight);
                    if(this.showItemLength*itemHeight < containerHeight) this.getItemList()
                },50)


            })
        }
    }
</script>

<style lang="scss">

    .last-messages{
        $color_bg-hover:glob-color('border');
        $color_bg-error:glob-color('error');
        $color_bg-info:glob-color('info');
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

            &_hot,&_very-hot {
                &::before {
                    content:'';
                    @extend %full-abs;
                    background-color:$color_bg-error;
                    opacity:.5;
                    z-index:0;
                }
            }
            &_very-hot {
                &::before {
                    background-color:$color_bg-info;
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