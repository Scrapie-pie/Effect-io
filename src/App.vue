<template lang="pug">
    #app.page__app
        scroll-bar.page__scrollbar
            transition(name="fade" mode="out-in")
                router-view


</template>

<script>
    import '@/scss/base.scss'

    export default {

        components: {
            /*  AppHeader, AppPopup, AppNotice, AppFooter*/
        },
        mixins: [],
        created() {

        },
        mounted() {
            document.querySelector('body').classList.add('page')
            document.querySelector('body').classList.add('tablet')
        }
    }
</script>

<style lang="scss">


    .page{
        background-color:glob-color('light');
        color:glob-color('main');
        font-size:$font-size_main;
        line-height:1.2;
        font-weight:400;
        font-family:$font-family_main;

        &__app{
            height:100%;
            display:flex;
            flex-flow:column;
        /*    overflow-x:hidden;
            overflow-y:scroll;*/
        }
        &_main_center &__main{
            align-items:center;
        }
        &__main{
            display:flex;
            //align-items:center;
            flex:1 0 auto;
        }

        &__scrollbar {
            height:100%;
        }
    }

</style>
