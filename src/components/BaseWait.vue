<template lang="pug">
    .base-wait(:class="className" v-if="$wait.waiting(name)")
        i.base-wait__text {{name}} loading...
        .base-wait__lds-roller


</template>

<script>

export default {

    props:{
        name:null,
        position:null,
        size:'',
    },
    data() {
        return {}
    },
    computed:{
        wait(){
            return this.$wait.waiting(this.name)
        },
        className(){
            let pos='',size='';
            if(this.position==='r') pos = ' base-wait_relative'
            if(this.size) size = ' base-wait_'+this.size

            return 'base-wait_'+this.name+pos+size
        }

    },
    watch:{
        wait:{
            handler(val){
                this.toggleParentClass(val)
            },
            immediate: false


        }
    },
    updated(){
        this.toggleParentClass(this.wait)
    },
    methods:{
        toggleParentClass(wait){
            if(this.position!=='r') return
            if(!wait) {
                this.$el.parentNode.classList.add('base-wait-hidden')
            } else {
                this.$el.parentNode.classList.remove('base-wait-hidden')
            }
        }
    }
}
</script>

<style lang="scss">
    .base-wait-hidden {
        display:none!important;
    }
    .base-wait{

        @extend %full-abs;
        z-index:9999;
        display:flex;
        align-items:center;
        justify-content:center;

        background: rgba(255, 255, 255, 0.6);





        &_relative {
            position:relative;
            background:none;
        }
        &_lg &__lds-roller{
            $sz:calc-em(70);
            width:$sz;
            height:$sz;
        }

        &_md &__lds-roller{
            $sz:calc-em(36);
            width:$sz;
            height:$sz;

            &::after {
                border-width:($sz / 2.5);
            }
        }
        $sz:calc-em(64);
        &__lds-roller {
            display: inline-block;
            position: relative;
            width:$sz;
            height:$sz;
        }
        &__lds-roller:after {
            content: " ";
            display: block;
            border-radius: 50%;
            width: 0;
            height: 0;
            margin: 6px;
            box-sizing: border-box;
            border: 26px solid glob-color('info');
            border-color: glob-color('info') transparent glob-color('error') transparent;
            animation: lds-roller 1.2s infinite;
            @extend %full-abs;
        }
        @keyframes lds-roller {
            0% {
                transform: rotate(0);
                animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
            }
            50% {
                transform: rotate(900deg);
                animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
            }
            100% {
                transform: rotate(1800deg);
            }
        }






        &__text {
            @extend %visuallyhidden
        }
    }
</style>