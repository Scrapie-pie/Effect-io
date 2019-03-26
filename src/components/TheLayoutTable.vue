<template lang="pug">
    section.layout-table
        .layout-table__controls
            .layout-table__control(v-for="item in $slots.control"): vnode(:node="item")
        .layout-table__head(v-for="item in $slots.head"): vnode(:node="item")
            slot(name="head").
        scroll-bar.layout-table__content(v-if="$slots.default"): vnode(v-for="item in $slots.default", :node="item")
            slot
        slot(name="empty")


</template>

<script>




    export default {

        props: {

        },
        data() {
            return {

            }
        },
        created(){
            console.log(this);
        },
        mounted(){


        },
        methods:{

        }

    }
</script>


<style lang="scss">
.layout-table{
    display:flex;
    flex-direction:column;
    height:100%;


    &__controls{
        display:flex;
        align-items:center;
        margin-bottom:calc-em(50);
    }
    &__control{
        margin-right:calc-em(40);
    }

    &__content {
        height:100%;
        margin-right:-1* calc-em(15);
        padding-right:calc-em(15);
    }
}


</style>
