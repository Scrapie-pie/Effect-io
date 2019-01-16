import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'


Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        user,

    },
    state: {
        buffering: false,
        flashErrorOn: true,
        mainClass: '',
        showBreadcrumbs: true,
        moreBreadcrumbds: [],

        navPageOpen: false

    },
    mutations: {
        buffering(state, val) {
            state.buffering = val
        },
        flashErrorOn(state, val) {
            state.flashErrorOn = val
        },

        mainClass(state, value) {
            state.mainClass = value
        },

        toggleNavPage(state) {
            state.navPageOpen = !state.navPageOpen
        },
        toggleCrumbs(state, value) {
            state.showBreadcrumbs = value
        },
        updateCrumbs(state, crumbs) {
            state.moreBreadcrumbds = crumbs
        }

    },
    actions: {
        confirm(context, payload) {
            return new Promise((resolve) => {
                const onClose = () => {
                    window.events.$off('confirm-exit')
                    window.events.$off('close_popup', onClose)

                    resolve(false)
                }

                window.events.$emit('show_popup', ['exit', {...payload}])

                window.events.$on('confirm-exit', (answer) => {
                    window.events.$off('confirm-exit')
                    window.events.$off('close_popup', onClose)
                    resolve(answer)
                })

                window.events.$on('popup_closed', onClose)
            })
        }
    }
})
