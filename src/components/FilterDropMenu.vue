<template lang="pug">
    form.filter-drop-menu(v-click-outside="val=>show=false", @submit.prevent="", :class="`filter-drop-menu_${type}`")
        fieldset.filter-drop-menu__fieldset
            legend.filter-drop-menu__title(@click="show=!show")
                |{{title}}
                span.filter-drop-menu__arrow(:class="{'filter-drop-menu__arrow_open':show}")

            .filter-drop-menu__box(:class="{'filter-drop-menu__box_open':show}")
                template(v-if="name==='calendar'")
                    app-calendar(@get="val=>modelradio=val")

                template(v-else)
                    .filter-drop-menu__controls
                        base-filter-search.filter-drop-menu__controls-search(
                            :item-list="itemList",
                            @result="(val)=>filterSearchResult=val",
                            v-show="name==='operator' || name==='channel'"
                        )
                        scroll-bar.filter-drop-menu__controls-scrollbar
                            ul.filter-drop-menu__controls-list(:class="`filter-drop-menu__controls-list_${type}`")
                                li.filter-drop-menu__controls-item.filter-drop-menu__controls-item_main(v-if="type!=='radio'")
                                    base-radio-check(name="allChecked", v-model="allChecked" @click="allCheckedToggle") Все {{titleName[name]}}
                                li.filter-drop-menu__controls-item(
                                v-for="(item, index) in filterSearchResult" :key="item.id",
                                @click="hideParent(item)"
                                )
                                    base-radio-check(
                                        v-bind="controlOpetions(item)"
                                        v-model="$data['model'+type]"
                                    )



</template>

<script>
    import AppCalendar from '@/components/AppCalendar'
    import ClickOutside from 'vue-click-outside'
    import branchesBr from '@/modules/branchesBr'
export default {
    components:{
        AppCalendar,

    },
    directives: {
        ClickOutside
    },
    filters: {
        branchesBr
    },
    props:{
        name:String,
        type:{
            type:String,
            default:'checkbox'
        }
    },

    data() {
        return {
            filterSearchResult:[],
            show: false,
            modelradio:null,
            modelcheckbox:[],
            allChecked:1,
            periodList:[
                {id:'1',name:"За сутки"},
                {id:'7',name:"За 7 дней"},
                {id:'30',name:"За 30 дней"},
                {id:'-1',name:"Выбрать интервал"},
            ],
            ballList:[
                {id:0,name:"Без оценки"},
                {id:1,name:'С оценкой "плохо"'},
                {id:2,name:'С оценкой "средне"'},
                {id:3,name:'С оценкой "хорошо"'},
            ],
            statusList:[
                {id:'active',name:"Текущие (онлайн)"},
                {id:'auto_finished',name:'Завершенные автоматически'},
                {id:'manually_finished',name:'Завершенные вручную'},
                {id:'missed',name:'Пропущенные'},
                {id:'overdue',name:'Просроченные (более 30 сек.)'},
            ],
            titleName:{
                operator:'сотрудники',
                ball:'оценки',
                status:'статусы',
                siteCompany:'каналы',
            }
        }
    },
    computed:{

        title(){
            if (this.name==='period') {
                if(this.modelradio) return this.modelradio.name
            }
            if (this.name==='calendar') {
                let strDate =''
                if(this.modelradio) {
                    strDate = `${this.modelradio.date_from} - ${this.modelradio.date_to}`
                } else strDate = 'Интервал не выбран'

                return strDate
            }


            let preffix ='Все '
            let title =this.titleName[this.name]
            if(this.allChecked) return preffix+title
            else return title+' (' + this.modelcheckbox.length +')'

        },
        itemList(){
            return this[this.name+'List']
        },
        calendarList(){
            return []
        },
        operatorList(){
            return this.$store.getters['operators/all'].map(item=>{
                item.name = item.fullName +' ('+ this.$options.filters.branchesBr(item.branches_names)+')'
                return item
            })
        },
        siteCompanyList(){
            return this.$store.state.user.siteCompanyList.map(item=>{
                let chanalName=''
                //if (item.channel_type!=7) chanalName = ' ('+this.$store.getters.channelName(item.channel_type)+')'
                item.name=item.url + chanalName;
                return item
            })
        },

    },
    watch:{
        show(val){
            if(val===false){
                if(this.type==='checkbox' && this.name!=='calendar') {
                    this.$emit('get',this.modelcheckbox.map(item=>item.id))
                }
            }
        },
        itemList:{
            handler(val,oldval)
            {

                if (this.allChecked) {

                    this.modelcheckbox = val
                }
            },
            immediate: true
        },
        modelradio:{
            handler(val){
                console.log('modelradio');
                if(this.name==='period') {

                    if (!val) {

                        return this.modelradio =  this.itemList[0]
                    }
                    this.$emit('get',val.id)
                }
                if(this.name==='calendar') {
                    if(val && val.date_from && val.date_to)  this.$emit('get',val)

                    this.show=false
                }
            },
            immediate: true
        },
        modelcheckbox:{
            handler(val){
                if (val.length!==this.itemList.length) this.allChecked=false;

                //this.$emit('get',val.map(item=>item.id))
            },
            immediate: true
        }
    },
    mounted() {

        this.popupItem = this.$el

    },
    methods:{
        controlOpetions(item){
            let obj =  {
                type:this.type,
                name:this.name,
                value:item,
                text:item.name
            }
            return obj
        },
        allCheckedToggle(){
            this.allChecked=!this.allChecked;
            if(this.allChecked) {this.modelcheckbox=this.itemList}
            else this.modelcheckbox=[]

        },
        hideParent(item){
            if(this.type==='radio') {this.show=false}
        }
    }
}
</script>

<style lang="scss">

    .filter-drop-menu{
        $el:'.filter-drop-menu';
        $color_hover:glob-color('info-lighten');
        $transition:$glob-trans;

        position:relative;

        &__title {
            @extend %h4;
            display:inline-block;
            position:relative;
            width:auto;
            padding-right:40px;
            cursor:pointer;
            margin-bottom:0;
            &:first-letter{
                text-transform:uppercase;
            }
        }
        &__arrow {
            @extend %g-icon-down;
            position:absolute;
            right:0;
            top:50%;
            transform:translateY(-50%);
            &_open{
                @extend %g-icon-down_open
            }
        }
        &__box{

            margin-top:calc-em(10);
            transform:translateY(25%);
            @include box-decor();
            position:absolute;
            left:0;
            top:100%;
            z-index:1;
            padding:calc-em(15) calc-em(15);
            opacity:0;
            visibility:hidden;

            transition:$transition;

            &_open{
                opacity:1;
                visibility:visible;
                transform:translateY(0);
            }
        }




        &__text{

        }


        &_radio {
            .base-radio-check{

                &__input:checked + .base-radio-check__text-wrap{
                    background-color:$color_hover
                }
                &__text-wrap{
                    padding:calc-em(5) calc-em(15);
                    white-space:nowrap;
                    transition:$transition;
                    &:before {display:none}
                }
                &__check {display:none}
                &__text {margin-left:0}
            }
            #{$el}__box{padding-left:0;padding-right:0}
        }
        &__controls{

            &-scrollbar {
                margin-right:-1*calc-em(15);
                padding-right:calc-em(15);
                max-height:85vh;
            }
            &-search {
                margin-bottom:calc-em(15);
            }

            &-item {
                #{$el}_checkbox &:not(&_main) {
                    margin-left:calc-em(25);
                }

                &+& {
                    margin-top:calc-em(5);
                }
                white-space:nowrap;
            }
        }
    }
</style>