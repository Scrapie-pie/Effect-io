<template lang="pug">
    article.settings-page
        .settings-page__header
            .settings-page__grid
                h1.settings-page__title Настройки

        .settings-page__grid
            .settings-page__inner
                .settings-page__nav
                    nav.nav-main
                        ul.nav-main__list
                            li.nav-main: router-link(:to='{name:"settingsApp"}') Настройки приложения
                            li.nav-main: router-link(:to='{name:"settingsApp"}') Настройки приложения
                .settings-page__main
                    router-view


</template>

<script>


    export default {

        components: {}
    }
</script>


<style lang="scss">


    .settings-page{

        &__header{
            text-align:center;
        }

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

        &__name,
        &__text-info{
            padding-left:calc-em(15);
        }

        &__item{
            margin-bottom:calc-em(45);
        }
        &__text-info{
            margin-top:calc-em(20);
        }

        &__select{
            width:168px;
        }
    }
</style>
