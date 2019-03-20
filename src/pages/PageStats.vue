<template lang="pug">
    article.page-stats
        nav-aside
            router-link(
                slot="item"
                :to='{name:"statsService"}'
            ) Качество обслуживания
            router-link(
                slot="item"
                :to='{name:"statsEmployees"}'
            ) Статистика по сотрудникам
            router-link(
                slot="item"
                :to='{name:"statsBranches"}'
            ) Статистика по отделам
            router-link(
                slot="item"
                :to='{name:"statsPages"}'
            ) Статистика по страницам
        section.page-stats__main
            h1.page-stats__title(v-text="title")
            router-view
</template>

<script>
    import NavAside from '@/components/NavAside';

export default {
    components: {
        NavAside,
    },
    data() {
        return {}
    },
    computed:{
        title(){
            return this.$route.meta.title
        }
    }
}
</script>

<style lang="scss">
    .page-stats{
        flex-direction: row;

        &__title {
            @extend %h4;
            margin-bottom:calc-em(40);
        }

        &__main {
            flex:1;
            padding-left:calc-em(15);
            padding-right:calc-em(15);
            height:100%;
        }
    }
</style>