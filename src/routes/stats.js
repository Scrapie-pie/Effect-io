/*import PageSettings from '@/pages/PageSettings'
import PageSettingsApp from '@/pages/PageSettingsApp'
import PageSettingsProfile from '@/pages/PageSettingsProfile'*/


const  PageStats = ()=> import('@/pages/PageStats')
const  PageStatsService  = ()=> import('@/pages/PageStatsService')
const  PageStatsPages  = ()=> import('@/pages/PageStatsPages')
const  PageStatsEmployees  = ()=> import('@/pages/PageStatsPages')
const  PageStatsBranches  = ()=> import('@/pages/PageStatsBranches')
const  PageStatsBranchesDetails  = ()=> import('@/pages/PageStatsBranchesDetails')
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



