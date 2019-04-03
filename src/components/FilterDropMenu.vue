<template lang="pug">
    form.filter-drop-menu(v-click-outside="val=>show=false" @submit.prevent="")
        fieldset.filter-drop-menu__fieldset
            legend.filter-drop-menu__title(@click="show=!show")
                |{{title}}
                span.filter-drop-menu__arrow(:class="{'filter-drop-menu__arrow_open':show}")

            .filter-drop-menu__box(:class="{'filter-drop-menu__box_open':show}")
                template( v-if="name==='calendar'")
                    app-calendar(@get="val=>model=val")

                template(v-else)
                    ul.filter-drop-menu__list
                        li.filter-drop-menu__item(v-for="(item, index) in itemList" :key="index")
                            label.filter-drop-menu__label(@click="hideParent(item)")
                                input.filter-drop-menu__input(type="radio", :name="name", :value="item", v-model.number="model")
                                span.filter-drop-menu__text {{item.name}}


</template>

<script>
    import AppCalendar from '@/components/AppCalendar'
    import ClickOutside from 'vue-click-outside'
export default {
    components:{
        AppCalendar,

    },
    directives: {
        ClickOutside
    },
    props:{
        name:String,
    },

    data() {
        return {
            show: false,
            model:null,

            periodList:[
                {value:'1',name:"За сутки"},
                {value:'7',name:"За 7 дней"},
                {value:'30',name:"За 30 дней"},
                {value:'-1',name:"Выбрать интервал"},
            ]
        }
    },
    computed:{
        title(){
            if (this.name==='period') {

                if(this.model) return this.model.name

            }
            if (this.name==='calendar') {
                let strDate =''
                if(this.model) {
                    strDate = `${this.model.date_from} - ${this.model.date_to}`
                } else strDate = 'Интервал не выбран'

                return strDate
            }
        },
        itemList(){
            if (this.name==='period') return this.periodList
        }
    },
    watch:{
        model:{
            handler(val){
                if(this.name==='period') {
                    if (!val) {
                       return this.model =  this.itemList[0]
                    }
                    this.$emit('get',val.value)
                }


                if(this.name==='calendar') {
                    console.log(val);
                    if(val && val.date_from && val.date_to)  this.$emit('get',val)

                    this.show=false
                }
            },
            immediate: true


        }
    },
    mounted() {
        //this.popupItem = this.$refs.list
        this.popupItem = this.$el
        //document.addEventListener('click', this.close);
    },
    methods:{
        hideParent(item){
            if(this.name==='period') {this.show=false}
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
            padding:calc-em(13) 0;
            opacity:0;
            visibility:hidden;

            transition:$transition;

            &_open{
                opacity:1;
                visibility:visible;
                transform:translateY(0);
            }
        }

        &__input{
            @extend %visuallyhidden;


        }
        &__text{
            position:relative;
            display:flex;
            width:100%;
            align-items:center;
            padding:calc-em(5) calc-em(15);
            text-align:left;
            white-space:nowrap;
            background:none;
            border:0;
            transition:$transition;



            #{$el}__input:checked ~ &,&:hover{background-color:$color_hover}




        }
    }
</style>