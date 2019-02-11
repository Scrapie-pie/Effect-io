<template lang="pug">
    scroll-bar.client-history
        ul.client-history__list
            li.client-history__item(v-for="(item, index) in itemList" :key="item.id" v-text="item.data_text")


</template>

<script>
    export default {
        computed:{
            itemList(){
                return this.$store.state.visitors.itemOpenHistoryActions
            }
        }
    }
</script>

<style lang="scss">
    .client-history {
        max-height: 8.5em;
        &__item {
            &+& {
                margin-top:calc-em(15);
            }
        }
    }


</style>