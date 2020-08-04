<template lang="pug">

        base-btn.scroll-down-button(
        :data-count="count"
        color="info",
        @click="$emit('click')",
        :icon="{box:true,name:'chevronDown',textHidden:'Прокрутить вниз'}"
        )
</template>

<script>
export default {
    name: "scroll-down-button",
    props:{
        count:{
            type: Number,
            default: 0,

        }
    },
    data() {
        return {}
    },
}
</script>

<style lang="scss">

        .scroll-down-button.btn{
            position:relative;
            fill: currentColor;
            border-radius: 50%;
            padding: 5px;
            &::before {
                content:attr(data-count);
                position:absolute;
                bottom:calc( 100% - .75em );
                left:50%;
                transform:translateX(-50%);
                background-color:glob-color(error);
                border-radius:50%;
                text-align:center;
                font-size:$glob-font-size_small;
                width:1.5em;
                height:1.5em;
                display:flex;
                align-items:center;
                justify-content:center;

            }
        }


</style>
