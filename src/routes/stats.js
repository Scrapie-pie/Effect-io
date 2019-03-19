/*import PageSettings from '@/pages/PageSettings'
import PageSettingsApp from '@/pages/PageSettingsApp'
import PageSettingsProfile from '@/pages/PageSettingsProfile'*/


const  PageStats = ()=> import('@/pages/PageStats')
const  PageStatsService  = ()=> import('@/pages/PageStatsService')
const  PageStatsPages  = ()=> import('@/pages/PageStatsPages')






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
            component: PageStatsService
        },
        {
            name: 'statsPages',
            path: 'pages',
            meta:{
                title:'Статистика по страницам'
            },
            component: PageStatsPages
        },


    ]
}]



