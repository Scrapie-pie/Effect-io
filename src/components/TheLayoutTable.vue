<template lang="pug">
    section.layout-table
        .layout-table__controls
            div(class="layout-table__control" v-for="(item,index) in $slots.control", :key="'control'+index")
                vnode(:node="item")
        .layout-table__head
            slot(name="head")
        scroll-bar.layout-table__content
            slot


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

        },
        mounted(){


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
    }
}


</style>
