<template lang="pug">
    article.page-stats
        nav-aside(v-if="$store.getters['user/isRole'](['admin','owner','operatorSenior'])")
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
    beforeRouteEnter (to, from, next) {
        console.log('beforeRouteEnter',to);
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

            if(this.routerName==='statsBranchesDetail') {

                let branch = this.branchListAll.find(item=>item.id===+this.$route.params.id);
                if (branch) return titleHead+': '+branch.title
            }
            if(this.routerName==='statsEmployeesDetail') {
                let operator = this.$store.state.operators.all.find(item=>item.id===+this.$route.params.id)
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
    methods:{

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
            margin-right:-1*calc-em(15);
            height:100%;

        }
    }
</style>