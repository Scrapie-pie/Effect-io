const PageChannels = () => import('@/pages/PageChannels')

import scenario from '@/routes/scenario'

import store from '@/store/store'

export default [
    {
        name: 'channels',
        path: '/channels',
        component: {
            render(h) {
                return h('router-view')
            },
            created() {
                return store.dispatch('scenario/getAll')
            }
        },

        children: [
            {
                name: 'channelList',
                path: '',
                component: PageChannels
            },
            ...scenario
        ]
    }
]
