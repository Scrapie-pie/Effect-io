
const  PageStats = ()=> import('@/pages/PageStats')
const  PageStatsInner  = ()=> import('@/pages/PageStatsInner')

export default [{
    name: 'stats',
    path: '/statistics',
    component: PageStats,
    children: [
        {
            name: 'statsService',
            path: 'service',
            meta:{
                title:'Качество обслуживания'
            },
            component: PageStatsInner
        },
        {
            name: 'statsEmployees',
            path: 'employees',
            meta:{
                title:'Статистика по сотрудникам'
            },
            component: PageStatsInner,
            children: [
                {
                    name: 'statsEmployeesDetail',
                    path: ':id',
                    component: PageStatsInner,
                    meta:{
                        title:'Статистика по сотруднику'
                    },
                },
            ]
        },
        {
            name: 'statsBranches',
            path: 'branches',
            meta:{
                title:'Статистика по отделам'
            },
            component: PageStatsInner,
            children: [
                {
                    name: 'statsBranchesDetail',
                    path: ':id',
                    component: PageStatsInner,
                    meta:{
                        title:'Статистика по отделу'
                    },
                },
            ]
        },
        {
            name: 'statsPages',
            path: 'pages',
            meta:{
                title:'Статистика по страницам'
            },
            component: PageStatsInner
        },


    ]
}]



