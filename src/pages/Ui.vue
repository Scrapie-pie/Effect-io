<template lang="pug">
    the-layout(:header-padding-no="true").settings-page
        template(slot="title") Guide
        //template(slot="nav")
            nav-main(:item-list="menuList")
        template(slot="main")
            router-view




</template>

<script>

    import TheLayout from '@/components/TheLayout'
    import NavMain from '@/components/NavMain'
    export default {
        components: {NavMain,TheLayout},
        data() {
            return {
                menuList: [
                    {text: 'Настройки приложения', link: {name: 'settingsApp'}},
                    {text: 'Настройки профиля', link: {name: 'settingsProfile'}},
                    {text: 'Форма авторизации', link: {name: 'auth'}},
                    {text: 'Chat', link: {name: 'chat'}},



                ]
            }
        }
    }
</script>


<style lang="scss">


    .settings-page{

        &__header{
            text-align:center;
            box-shadow:0 0 14px 1px rgba(0, 1, 0, .11);
            padding:calc-em(14) 0;
            margin-bottom:calc-em(70);
        }
        &__title{margin-bottom:0}

        &__grid{
            max-width:900px;
            margin:0 auto;
            padding:0 15px;
        }

        &__inner{
            display:flex;
        }

        &__nav{
        }

        &__main{
        }
    }
    .settings-list{

        &__name{
            $color:glob-color('main');
            font-weight:600;
            opacity:.8;
            font-size:inherit;
        }

        &__name,
        &__text-info{
            padding-left:calc-em(15);
        }

        &__item{
            margin-bottom:calc-em(45);
        }
        &__text-info{
            margin-top:calc-em(20);

            &_sub{
                margin-bottom:calc-em(35);
            }
        }

        &__select{
            width:168px;
        }

        &__name-wrap{
            display:flex;
            justify-content:space-between;
        }
        &__field{
            max-width:276px;
            width:100%;
        }

        &__sub{
        }
        &__sub-item{
            margin-bottom:calc-em(20);
        }

        &__row{
            display:flex;
            align-items:center;
            margin:0 (calc-em(10) * -1);
        }
        &__col{
            padding-left:calc-em(10);
            padding-right:calc-em(10);
        }
    }
</style>
