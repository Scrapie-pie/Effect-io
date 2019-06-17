<template lang="pug">
    article.page-stats
        nav.page-stats__nav(v-if="$store.getters['user/isRole'](['admin','owner','operatorSenior'])")
            ul.page-stats__list
                li.page-stats__item
                    router-link.page-stats__link(
                    :to='{name:"processAll"}'
                    ) Вернуться в кабинет оператора
                li.page-stats__item
                    router-link.page-stats__link(

                        :to='{name:"statsService"}'
                    ) Качество обслуживания
                li.page-stats__item
                    router-link.page-stats__link(

                    :to='{name:"statsAll"}'
                    ) Общая статистика
                //li.page-stats__item
                    router-link.page-stats__link(

                        :to='{name:"statsBranches"}'
                    ) Статистика по отделам
                //li.page-stats__item
                    router-link.page-stats__link(
                        :to='{name:"statsOperators"}'
                    ) Статистика по сотрудникам

                li.page-stats__item
                    router-link.page-stats__link(
                        :to='{name:"statsPages"}'
                    ) Статистика по страницам
                li.page-stats__item
                    router-link.page-stats__link(
                            :to='{name:"statsOnceChat"}'
                        ) Одноразовые чаты
                li.page-stats__item
                    router-link.page-stats__link(
                    :to='{name:"statsTags"}'
                    ) Статистика по тегам
        section.page-stats__main
            base-wait(name="pageStats")
            h1.page-stats__title(v-text="title")
            router-view
</template>

<script>
    import NavAside from '@/components/NavAside';
    import { hideHeader } from '@/mixins/mixins'


    export default {
    mixins: [hideHeader],
    components: {
        NavAside,
    },
    data() {
        return {}
    },
    beforeRouteEnter (to, from, next) {
        next(vm=>{
            if(vm.$store.getters['user/isRole'](['admin','owner','operatorSenior'])) {
                if(vm.$route.name==="stats") vm.$router.push({name:'statsService'})

            }
            else {
                vm.$router.push( {
                    name: 'statsEmployeesDetail',
                    params:{id:vm.$store.state.user.profile.id}
                },)
            }
        })
    },
    computed:{
        title(){

            let titleHead = this.$route.meta.title

            if(this.routerName==='statsBranchesDetail' || this.routerName==='statsAllBranch') {

                let branch = this.branchListAll.find(item=>item.id===+this.$route.params.id);


                if (branch) return titleHead+': '+branch.title
            }
            if(this.routerName==='statsOperatorsDetail'  || this.routerName==='statsAllOperator') {
                let operator = this.$store.getters['operators/all'].find(item=>item.id===+this.$route.params.id);

                if(operator) return titleHead+': '+operator.fullName
            }

            return titleHead
        },
        routerName(){
            return this.$route.name
        },
        branchListAll(){
            return this.$store.state.user.branchListAll
        }
    },

}
</script>

<style lang="scss">
    .page-stats{


        &__list {
            display:flex;
            margin-bottom:calc-em(50);
        }
        &__item {
            margin-left:calc-em(15);
            margin-right:calc-em(15);
            margin-bottom:calc-em(10);
        }
        &__link {
            font-size:$glob-font-size_h4;
            font-weight:bold;
        }




    /*    transition:$glob-trans;


        transform:translateX(-275px);
        &.active{
            transform:translateX(0);
        }*/

        &__title {
            @extend %h4;
            margin-bottom:calc-em(40);
        }

        &__main {
            flex:1;
            padding-left:calc-em(15);
            position:relative;
            height:100%;

        }
    }
</style>