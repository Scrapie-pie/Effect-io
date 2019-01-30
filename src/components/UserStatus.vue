<template lang="pug">
    form.user-status(@click="logout")
        .user-status__avatar-wrap
            base-avatar.user-status__avatar
            .user-status__indicator(:class="`user-status__indicator_${statusCurrent.name}`")
            ul.user-status__list(:class="{'user-status__list_open':show}")
                li.user-status__item
                    label.user-status__text.user-status__text_online
                        input.user-status__input(type="radio" name="status" value="3" v-model="status")
                        | В сети (онлайн)
                li.user-status__item
                    label.user-status__text.user-status__text_offline
                        input.user-status__input(type="radio" name="status" value="0" v-model="status")
                        | Не в сети (оффлайн)
                li.user-status__item
                    label.user-status__text.user-status__text_break
                        input.user-status__input(type="radio" name="status" value="2" v-model="status")
                        | Перерыв
                li.user-status__item
                    label.user-status__text.user-status__text_lunch
                        input.user-status__input(type="radio" name="status" value="1" v-model="status")
                        | Обед
        form.user-status__status
            button(type="button").user-status__current-status(@click.prevent="toggle")
                | {{statusCurrent.textShort}}
                span.user-status__arrow(:class="{'user-status__arrow_open':show}")


</template>

<script>
    export default {
        /*  props:{
            status:{
                type:Number,
                default:0,
                validator: function (value) {
                    return [0, 1].indexOf(value) !== -1
                }
            }
          },*/
        data() {
            return {
                show: false,
                status: '4'
            }
        },
        mounted() {
            document.addEventListener('click', this.close);
        },
        updated() {
            document.addEventListener('click', this.close);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.close);
        },
        methods: {
            logout(){
                this.$store.dispatch('user/logout')
                    .then(() => {
                        this.$router.push({name:'auth'})
                        // document.querySelector('.site').classList.remove('site_overlay')
                    })
            },
            close(e) {
                if (!e.target.matches('.user-status__status, .user-status__status *')) {
                    this.show = false;
                    document.removeEventListener('click', this.close);
                }
            },
            toggle() {
                this.show = !this.show;
            }
        },
        computed: {
            statusCurrent() {
                let text, textShort, name;

                switch (this.status) {
                    case '3':
                        text = 'В сети (онлайн)';
                        textShort = 'В сети';
                        name = 'online';
                        break;
                    case '2':
                        text = 'Перерыв';
                        textShort = 'Перерыв';

                        name = 'break';
                        break;
                    case '1':
                        text = 'Обед';
                        textShort = 'Обед';
                        name = 'lunch';
                        break;

                    default:
                        text = 'Не в сети (оффлайн)';
                        textShort = 'Не в сети';
                        name = 'offline';
                        break;
                }

                return {text, textShort, name}
            }
        }
    }
</script>

<style lang="scss">
    .user-status{
        $color_hover:glob-color('info-light');
        $color_online:glob-color('success');
        $color_break:#d7c502;
        $color_lunch:glob-color('error');
        $color_offline:glob-color('secondary');
        $color_border:glob-color('border');
        $border-radius:$glob-border-radius;
        $transition:$glob-trans;
        text-align:center;

        &__status-wrap{
            display:inline-block;
        }

        &__avatar-wrap{
            position:relative;
            display:inline-block;
            margin-bottom:15px;
        }

        &__indicator{
            position:absolute;
            bottom:0;
            right:0;
            width:14px;
            height:14px;
            border-radius:50%;
            background-color:$color_offline;

            &_online{ background-color:$color_online; }
            &_break{ background-color:$color_break; }
            &_lunch{ background-color:$color_lunch; }
        }
        &__current-status{
            position:relative;
            padding:2px 3px;
            padding-right:20px;
            border-radius:$border-radius;
            border:1px solid $color_border;
            background:none;

            @include media($width_lg){
                font-size:.9em;
                padding-right:15px;
            }
        }
        &__arrow{
            @extend %g-icon-down;
            position:absolute;
            right:0;
            top:0;
            width:19px;
            min-width:19px;
            height:19px;

            line-height:19px;

            &:after, &:before{
                width:6px;
            }

            &_open{
                @extend %g-icon-down_open
            }

            @include media($width_lg){
                right:-2px;
            }

        }

        &__list{
            @include box-decor();
            position:absolute;
            left:50%;
            top:100%;
            z-index:1;
            padding:calc-em(13) 0;
            opacity:0;
            visibility:hidden;
            transform:translate(-50%,3em);
            transition:$transition;

            &_open{
                opacity:1;
                visibility:visible;
                transform:translate(-50%,0);
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
            padding:calc-em(5) calc-em(7);
            text-align:left;
            white-space:nowrap;
            background:none;
            border:0;
            transition:$transition;

            &:hover{background-color:$color_hover}

            &::before{
                display:block;
                flex:0 0 auto;
                width:11px;
                height:11px;
                margin-right:5px;
                content:'';
                border-radius:50%;
            }

            &_online::before{ background-color:$color_online }
            &_break::before{ background-color:$color_break }
            &_lunch::before{ background-color:$color_lunch }
            &_offline::before{ background-color:$color_offline }
        }

    }
</style>