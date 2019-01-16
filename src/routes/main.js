import Statistics from '@/pages/Statistics'
import ClientList from '@/pages/ClientList'
import ClientItem from '@/pages/ClientItem'
import ClientAdd from '@/pages/ClientAdd'
import ClientInfo from '@/pages/ClientInfo'

// import { hookNoUserFundsCase } from '../guards';

export default [

    {
        path: '/statistics',
        name: 'operStat',
        component: Statistics,
        meta: {
            breadcrumb: 'Статистика'
        }
    },
    {
        path: '/clients',
        name: 'сlientList',
        component: ClientList,
        meta: {
            breadcrumb: 'Клиенты'
        }
    },
    {
        path: '/client/:id',
        component: ClientItem,
        children: [
            {
                // при совпадении пути с шаблоном /user/:id/profile
                // в <router-view> компонента User будет показан UserProfile
                name: 'clientInfo',
                path: 'info',
                component: ClientInfo
            }

        ],
        meta: {
            auth: true
        }
    },
    {
        path: '/clients/add',
        name: 'сlientAdd',
        component: ClientAdd,
        meta: {
            breadcrumb: 'Добавить клиента'
        }
    }
]
