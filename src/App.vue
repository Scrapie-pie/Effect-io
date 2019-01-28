<template lang="pug">
    #app.page__app
        scroll-bar.page__scrollbar
            the-header.page__header.page__padding
            main.page__main
                transition(name="fade" mode="out-in")
                    router-view.page__view.page__padding
            the-popup

</template>

<script>
    import '@/scss/base.scss'

    import TheHeader from '@/components/TheHeader'
    import ThePopup from "@/components/ThePopup";

    export default {

        components: {
            TheHeader,
            ThePopup
        },

        created() {

            document.body.classList.add('page');
            this.watchForHover();
        },
        methods: {
            watchForHover(){ // Отключаем hover на touch устройствах

                let      hasHoverClass = false,
                         container = document.body,
                         lastTouchTime = 0;

                    function enableHover() {
                        // filter emulated events coming from touch events
                        if (new Date() - lastTouchTime < 500) return;
                        if (hasHoverClass) return;

                        container.className += ' page_hasHover';
                        hasHoverClass = true;
                    }

                    function disableHover() {
                        if (!hasHoverClass) return;

                        container.className = container.className.replace(' page_hasHover', '');
                        hasHoverClass = false;
                    }

                    function updateLastTouchTime() {
                        lastTouchTime = new Date();
                    }

                    document.addEventListener('touchstart', updateLastTouchTime, true);
                    document.addEventListener('touchstart', disableHover, true);
                    document.addEventListener('mousemove', enableHover, true);

                    enableHover();

            }
        }
    }
</script>

<style lang="scss">
    .page{
        $transition:$glob-trans;
        $indent-main:$glob-indent-main-lr;
        background-color:glob-color('light');
        color:glob-color('main');
        font-size:$glob-font-size_main;
        line-height:1.2;
        font-weight:400;
        font-family:$font-family_main;


        min-width:685px;


        &__app{
            height:100%;
            display:flex;
            transition:$transition;

            .is-hided-header & {
                margin-left:-165px;

            }

        /*    overflow-x:hidden;
            overflow-y:scroll;*/
        }
        &_main_center &__main{
            align-items:center;
        }
        &__main{
            display:flex;

            flex:1 0 auto;
        }

        &__scrollbar {
            height:100%;
            display:flex;
            flex:1;


        }





        &__view {
            display: flex;
            height: 100%;
            flex-direction: column;
            flex: 1;
            min-height:475px;
        }

        &__main{
            flex:1;
            padding-left:$indent-main;
            padding-right:$indent-main;
            height:100%;
        }




        &__padding{
            padding-top:calc-em(30);
            padding-bottom:calc-em(30);
        }
    }

</style>
