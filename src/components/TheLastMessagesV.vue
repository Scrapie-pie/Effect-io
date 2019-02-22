<template lang="pug">
    form.last-messages
        .last-messages__search
            base-field(type="search" name="search" v-model="search" theme="soft")
        scroll-bar.last-messages__scrollbar(@ps-y-reach-end="loadDate")
            ul.last-messages__list
                li.last-messages__item(
                    v-for="(item, index) in itemList",
                    :key="item.uuid+item.site_id",

                )

                    router-link.last-messages__btn(
                        :to="{name:'chatId',params: { uuid: item.uuid,site_id:item.site_id}}"
                         v-text="`${item.fullName}:${item.last_message}`"
                        active-class="last-messages__btn_active"
                        )

                    base-people.last-messages__people(
                        :avatar-url="item.photo"
                        :name="item.name",
                        :text="item.last_message",
                        :bg-text-no-fill="true",
                        :channel-name="$store.getters.channelName(item.channel_type)",
                        :count="item.unread.length"
                        hidden
                    )


</template>

<script>
    import _ from 'underscore'
    import { viewModeChat } from '@/mixins/mixins'
    export default {
        mixins:[viewModeChat],

        data() {
            return {
                warning:true,

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
            '$route'(to,from){
                if (this.viewModeChat==="process") this.type='unprocessed';
                if (this.viewModeChat==="visitors") this.type='self';
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
                    this.$http.get('guest-list',this.requestData).then(({data})=>{
                        this.getItemListStart=true;
                        if (data.data.count) {
                            this.itemList.push(...data.data.list);
                            this.itemListCount = data.data.count;
                            this.pageN += 1;
                        }

                    })

                /*    this.$store.dispatch('visitors/getItems', this.requestData).then(({data})=>{
                        this.getItemListStart=true;
                        if (data.data.count) {
                            this.itemList.push(...data.data.list);
                            this.itemListCount = data.data.count;
                            this.pageN += 1;
                        }
                    })*/
                }

            },

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

            &:hover,
            &_active{
                //background-color:$color_bg-hover;
            }

            &_warning {
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
            &:hover,&_active {
                background-color:$color_bg-hover;
            }
        }
    }
</style>