import lodash_union from 'lodash/union'

import { captureException, configureScope, withScope } from '@sentry/browser'

const getDefaultState = () => {
    return {
        profile: false,
        settings: false,
        branchListAll: [],
        siteCompanyList: []
    }
}
// initial state
const state = getDefaultState()

export default {
    namespaced: true,
    state,
    mutations: {
        resetState(state) {
            Object.assign(state, getDefaultState())
        },
        logout(state, event) {},
        profileUpdate(
            state,
            {
                spelling,
                code,
                avatar,
                first_name,
                last_name,
                phones,
                mail,
                photo,
                active,
                online,
                branches_ids,
                is_common_chat,
                role_id,
                use_chat,
                use_calls,
                auto_attach_enabled
            }
        ) {
            let obj = {}

            if (spelling !== undefined) obj.spelling = spelling
            if (code !== undefined) obj.code = code
            if (avatar !== undefined) obj.avatar = avatar
            if (first_name !== undefined) obj.first_name = first_name
            if (last_name !== undefined) obj.last_name = last_name
            if (phones !== undefined) obj.phones = phones
            if (mail !== undefined) obj.mail = mail
            if (photo !== undefined) obj.photo = photo
            if (online !== undefined) obj.online = online
            if (active !== undefined) obj.active = active
            if (branches_ids !== undefined) obj.branches_ids = branches_ids
            if (is_common_chat !== undefined) obj.is_common_chat = is_common_chat
            if (role_id !== undefined) obj.role_id = role_id
            if (use_chat !== undefined) obj.use_chat = use_chat
            if (use_calls !== undefined) obj.use_calls = use_calls
            if (auto_attach_enabled !== undefined) obj.auto_attach_enabled = auto_attach_enabled

            state.profile = Object.assign(state.profile, obj)
        },
        profile(state, val) {
            state.profile = val
        },
        unreadUpdate(state, val) {
            if (state.profile.unread !== undefined) {
                //иначе при logout была ошибка

                if (val[1] === 'clear') return (state.profile.unread[val[0]] = 0)
                if (state.profile.unread[val[0]] === 0 && val[1] === -1) return
                state.profile.unread[val[0]] += val[1]
            }
        },
        unreadUpdateUnprocessed(state, number) {
            state.profile.unread.unprocessed = number
        },
        unreadUpdateGuest(state, number) {
            state.profile.unread.guest = number
        },
        socketUnreadUpdate(state, [type, ids]) {
            let findIndex = state.socketUnread[type].findIndex(
                item => item.guest_uuid + item.site_id === ids.guest_uuid + item.site_id
            )
            if (findIndex === -1) {
                state.socketUnread[type].push(ids)
            }
        },
        settings(state, val) {
            val.languages = { ru: 'Русский' }
            val.settings.language = 'ru'
            state.settings = val
        },
        settingsUpdateFields(state, obj) {
            state.settings.settings = Object.assign(state.settings.settings, obj)
        },
        settingsUpdate(state, val) {
            state.settings.settings = val
        },

        branchListAll(state, val) {
            state.branchListAll = val
        },
        siteCompanyList(state, val) {
            state.siteCompanyList = val
        }
    },
    actions: {
        getLogin({ commit, dispatch }, user) {
            return new Promise((resolve, reject) => {
                if (!user) {
                    withScope(function(scope) {
                        scope.setTag('getLogin', 'empty')
                        throw captureException({ frontMessage: 'пустой ответ', backResponse: user })
                    })
                }
                if (!user.jwt) {
                    withScope(function(scope) {
                        scope.setTag('getLogin', 'jwt')
                        throw captureException({ frontMessage: 'Нет jwt', backResponse: user })
                    })
                }

                localStorage.setItem('jwt', user.jwt)
                //this._vm.$http.defaults.headers.common['jwt'] = user.jwt
                this._vm.$http.defaults.headers['content-type'] = 'application/json'

                commit('profile', user)

                configureScope(function(scope) {
                    //scope.setTag("my-tag", "my value");
                    scope.setUser({
                        uuid: user.uuid,
                        id: user.id,
                        email: user.mail,
                        name: user.mail
                    })
                })

                dispatch('getSettings')
                dispatch('getBranchListAll')
                dispatch('getSiteCompanyList')
                dispatch('operators/getAll', null, { root: true })

                resolve()
            })
        },
        logout({ commit }, event) {
            localStorage.removeItem('jwt')

            delete this._vm.$http.defaults.headers.common['jwt']
            delete this._vm.$http.defaults.headers['content-type']

            commit('resetState')
            commit('resetState', null, { root: true })

            commit('roomActive/resetState', null, { root: true })
            commit('operators/resetState', null, { root: true })
            commit('visitors/resetState', null, { root: true })
            commit('phrases/resetState', null, { root: true })
            commit('tags/resetState', null, { root: true })
            commit('mobile/resetState', null, { root: true })
        },
        getSettings({ commit }) {
            this._vm.$http.get('user/get-settings').then(({ data }) => {
                commit('settings', data.data)
            })
        },
        getBranchListAll({ commit }) {
            this._vm.$http.get('branch/list').then(({ data }) => {
                commit('branchListAll', data.data)
            })
        },
        getSiteCompanyList({ commit }) {
            this._vm.$http
                .get('site/company-list', { params: { withIntegrations: 1 } })
                .then(({ data }) => {
                    commit('siteCompanyList', data.data)
                })
        }
    },
    getters: {
        siteCompanyListToId: (state, getters) => id => {
            return state.siteCompanyList.find(item => item.id === id)
        },
        roles: state => {
            // в JavaScript, когда `false && myString` возвратит `false`, а `true && myString` возвратит `myString`.
            let { id, owner_id, role_id } = state.profile
            if (!id && !owner_id && !role_id) return []
            return [
                id === owner_id && 'owner',
                role_id === 13 && 'admin',
                role_id === 14 && 'operatorSenior'
            ]
        },
        isRole: (state, getters) => list => {
            // в JavaScript, когда `false && myString` возвратит `false`, а `true && myString` возвратит `myString`.
            return list.some(item => getters.roles.includes(item))
        },
        branchListAll: state => {
            return state.branchListAll.map(item => {
                let siteName = state.siteCompanyList.find(site => site.id === item.site_id)?.url
                item.titleAndSite = item.title + ' (' + siteName + ')'
                return item
            })
        },
        settings: state => {
            return state.settings
        },
        profile: state => {
            return state.profile
        },
        authenticated: state => {
            return !!state.profile.id
        }
    }
}
