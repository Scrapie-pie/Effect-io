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
            },
            beforeRouteEnter(to, from, next) {
                // вызывается до подтверждения пути, соответствующего этому компоненту.
                // НЕ ИМЕЕТ доступа к контексту экземпляра компонента `this`,
                // так как к моменту вызова экземпляр ещё не создан!
                if (store.getters['user/isRole'](['admin', 'owner', 'operatorSenior'])) {
                    return next()
                } else return next({ name: 'processAll' })
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
