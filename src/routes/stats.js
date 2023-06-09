const PageStats = () => import('@/pages/PageStats')
const PageStatsInner = () => import('@/pages/PageStatsInner')

import store from '@/store/store'

export default [
    {
        name: 'stats',
        path: '/statistics',
        component: PageStats,
        redirect: to => {
            if (store.getters['user/isRole'](['admin', 'owner', 'operatorSenior'])) {
                return { name: 'statsService' }
            } else {
                return {
                    name: 'statsEmployeesDetail',
                    params: { id: store.state.user.profile.id }
                }
            }
        },
        children: [
            {
                name: 'statsAllByHours',
                path: 'allByHours',
                meta: {
                    title: 'Общая статистика. Раскладка по часам'
                },
                component: PageStatsInner,
                children: [
                    {
                        name: 'statsAllBranchByHours',
                        path: ':id',
                        component: PageStatsInner,
                        meta: {
                            title: 'Статистика по отделу'
                        }
                    }
                ]
            },
            {
                name: 'statsAll',
                path: 'all',
                meta: {
                    title: 'Общая статистика'
                },
                component: PageStatsInner,
                children: [
                    {
                        name: 'statsAllBranch',
                        path: ':id',
                        component: PageStatsInner,
                        meta: {
                            title: 'Статистика по отделу'
                        }
                    }
                ]
            },
            {
                name: 'statsAllOperator',
                path: 'employees/:id/:branch_id',
                meta: {
                    title: 'Статистика по сотруднику'
                },
                component: PageStatsInner
            },

            {
                name: 'statsService',
                path: 'service',
                meta: {
                    title: 'Качество обслуживания'
                },
                component: PageStatsInner
            },
            {
                name: 'statsOperators',
                path: 'employees',
                meta: {
                    title: 'Статистика по сотрудникам'
                },
                component: PageStatsInner,
                children: [
                    {
                        name: 'statsOperatorsDetail',
                        path: ':id',
                        component: PageStatsInner,
                        meta: {
                            title: 'Статистика по сотруднику'
                        }
                    }
                ]
            },
            {
                name: 'statsBranches',
                path: 'branches',
                meta: {
                    title: 'Статистика по отделам'
                },
                component: PageStatsInner,
                children: [
                    {
                        name: 'statsBranchesDetail',
                        path: ':id',
                        component: PageStatsInner,
                        meta: {
                            title: 'Статистика по отделу'
                        }
                    }
                ]
            },
            {
                name: 'statsPages',
                path: 'pages',
                meta: {
                    title: 'Статистика по страницам'
                },
                component: PageStatsInner
            },
            {
                name: 'statsLogStatusOperatorList',
                path: 'statuses',
                meta: {
                    title: 'Лог статусов'
                },
                component: PageStatsInner
            },
            {
                name: 'statsLogStatusOperatorDetail',
                path: 'statuses/:id/',
                meta: {
                    title: 'Лог статусов'
                },
                component: PageStatsInner
            },
            {
                name: 'statsOnceChat',
                path: 'onceChat',
                meta: {
                    title: 'Одноразовые чаты'
                },
                component: PageStatsInner
            },
            {
                name: 'statsTags',
                path: 'tags',
                meta: {
                    title: 'Статистика по тегам'
                },
                component: PageStatsInner
            }
        ]
    }
]
