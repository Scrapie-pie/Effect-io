<template lang="pug">
    form.filter-drop-menu(v-click-outside="val=>show=false")
        fieldset.filter-drop-menu__fieldset
            legend.filter-drop-menu__title(@click="show=!show")
                |{{title}}
                span.filter-drop-menu__arrow(:class="{'filter-drop-menu__arrow_open':show}")
            ul.filter-drop-menu__list(:class="{'filter-drop-menu__list_open':show}"  ref="list")
                li.filter-drop-menu__item
                    label.filter-drop-menu__text
                        input.filter-drop-menu__input(type="radio" name="period" value="1" v-model.number="period")
                        | За сутки
                li.filter-drop-menu__item
                    label.filter-drop-menu__text
                        input.filter-drop-menu__input(type="radio" name="period" value="7" v-model.number="period")
                        | За 7 дней
                li.filter-drop-menu__item
                    label.filter-drop-menu__text
                        input.filter-drop-menu__input(type="radio" name="period" value="30" v-model.number="period")
                        | За 30 дней
                li.filter-drop-menu__item
                    label.filter-drop-menu__text
                        input.filter-drop-menu__input(type="radio" name="period" value="-1" v-model.number="period")
                        | Выбрать интервал
</template>

<script>
    import ClickOutside from 'vue-click-outside'
export default {
    directives: {
        ClickOutside
    },
    props:{
        name:String,
    },

    data() {
        return {
            show: true,
            period:null,
        }
    },
    computed:{
        title(){
            if (this.name==='period') return 'За сутки'
        }
    },
    mounted() {
        //this.popupItem = this.$refs.list
        this.popupItem = this.$el
        //document.addEventListener('click', this.close);
    },
}
</script>

<style lang="scss">
    .filter-drop-menu{
        $color_hover:glob-color('info-light');
        $transition:$glob-trans;

        position:relative;

        &__title {
            @extend %h4;
            display:inline-block;
            position:relative;
            width:auto;
            padding-right:40px;
            cursor:pointer;
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
        &__list{
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

            }
        }

        &__input{
            @extend %visuallyhidden
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

            &:hover{background-color:$color_hover}




        }
    }
</style>