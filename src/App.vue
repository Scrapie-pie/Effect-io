<template lang="pug">
    #app.page__app
        //div(:class="{'spinner spinner_main-page':$store.state.loading}")
        the-header.page__header.page__padding
        main.page__main
            transition(name="fade" mode="out-in")
                router-view.page__view.page__padding
        the-popup


</template>

<script>
    import '@/scss/base.scss'


    import browserNotification from '@/modules/browserNotification'
    import TheHeader from '@/components/TheHeader'
    import ThePopup from "@/components/ThePopup";

    export default {
        components: {
            TheHeader,
            ThePopup
        },
        computed:{
            userId(){
                return this.$store.state.user.profile.id
            }
        },
        watch:{
            userId(val){
                if(val) this.webSocketInit()
            }
        },
        created() {
            //this.webSocketInit()
            document.body.classList.add('page');

            this.watchForHover();

            window.addEventListener('unhandledrejection', this.promiseErrorHandler);

            this.httpErrors();
        },
        beforeDestroy() {
            window.removeEventListener('unhandledrejection', this.promiseErrorHandler);
        },
        methods: {
            webSocketInit() {
                console.log(this.userId);
                let socket = io("http://newrobocall.ru:3000", {
                    query: {
                        uuid:  this.userId
                    }
                });

                socket.on("connect", () => {
                    console.log("connected");
                });

                socket.on("connect_error", () => {
                    console.log("connect_error");
                });

                socket.on("connect_timeout", () => {
                    console.log("connect_timeout");
                });

                socket.on("update-branches", function (payload) {
                    console.log("update-branches", payload);
                });

                try {


                } catch (err) {

                    browserNotification('Сбой на сервере сокетов')

                }
            },
            httpErrors(){

                this.$http.interceptors.request.use( (config)=> {

                    this.$store.commit('loading',true) //Todo баг скрола на странице настройки
                    return config;
                }, function (error) {
                    // Do something with request error
                    return Promise.reject(error);
                });


                this.$http.interceptors.response.use((resp)=>{
                    this.$store.commit('loading',false)
                    return resp
                },(err)=> {
                    this.$store.commit('loading',false)
                    console.log(err);
                    console.log(err.response);

                    if(err.response && err.response.data && err.response.data.message && this.$route.name!=='auth') {
                        this.$root.$emit('popup-notice',err.response.data.message);
                        console.log('error №',err.response.status)
                    }

                    if (err.response.status === 401) {
                        console.log(this.$route.fullPath,err.response.status);
                        this.$store.dispatch('user/logout').then(() => {
                            this.$router.push({name:'auth',query:{return:this.$route.fullPath}})

                        });
                    }
                    return Promise.reject(err);

                })
            },
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

            },
            promiseErrorHandler(event) {
                console.error('Unhandled rejection (promise: ', event.promise, ', reason: ', event.reason, ')');
            },
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
            flex:1;
            overflow:hidden;

            .is-hided-header & {
                margin-left:-165px;

            }
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

            &-inner {
                overflow:hidden;
            }
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
