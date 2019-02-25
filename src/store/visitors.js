import _ from 'underscore'
export default {
    namespaced: true,
    state: {
        all:[],
        allCount:false,
        process:[],
        processCount:false,
        self:[],
        selfCount:false,
        itemOpen:false,
        itemOpenHistoryActions:false
    },
    mutations: {
        all(state, val) { //Todo походу не нужен
            state.all=val.list;
            state.allCount=val.count;
        },
        process(state, val) {
            state.process=val.list;
            if (val.count) state.selfCount=val.count;
        },
        self(state, val) {
            state.self=val.list;
            if (val.count) state.selfCount=val.count;

        },
        selfPush(state,val) {
            console.log(val);
            state.self.push(...val.list);
            state.selfCount=val.count;
        },
        selfMessageLastUpdate(state, val) {

            let findIndex = state.self.findIndex((item)=>{
                if(val.selfUuid) return item.uuid === val.selfUuid; //selfId значит мое сообщение
                else return item.uuid === val.from_user_info.uuid
            })
            console.log(findIndex);
            if(findIndex !== -1) {
                state.self[findIndex].last_message = val.body;
                state.self[findIndex].last_message_author = val.from_user_info.first_name;

                if(!val.selfUuid) state.self[findIndex].unread.push(val.id);

            }
        },
        messageRead(state,userIndex) {
            state.self[userIndex].unread=[];
        },
        itemOpen(state, val) {
            state.itemOpen=val;
        },
        itemOpenHistoryActions(state, val) {
            state.itemOpenHistoryActions=val;
        },

    },
    actions: {
        getItems({ commit, dispatch },data) {
            this._vm.$http.get('guest-list',data).then(({data})=>{
                if(!_.isEmpty(data.params.type) && data.params.type === "self") commit('self',data.data)
                if(!_.isEmpty(data.params.type) && data.params.type === "unprocessed") commit('process',data.data)
                else { commit('all',data.data) }

            })
        },
        getAll({ commit, dispatch }) {
            this._vm.$http.get('guest-list',{}).then(({data})=>{

                commit('all',data.data)
            })
        },
        getProcess({ commit, dispatch },params) {
            params = _.extend({type: 'unprocessed', limit: 1}, params);
            this._vm.$http.get('guest-list',{params}).then(({data})=>{
                commit('process',data.data)
            })
        },
        getSelf({ commit, dispatch },params) {
            params = _.extend({type: 'self', limit: 1}, params);
            this._vm.$http.get('guest-list',{params}).then(({data})=>{
                commit('self',data.data)
            })
        },
        getItemOpen({ commit, dispatch },params) {

      /*      this._vm.$http.all([
                this._vm.$http.get('guest-info', {params}),
                this._vm.$http.get('read-history', {params}),
            ]).then(
                this._vm.$http.spread((itemOpen, itemOpenHistoryActions) => {
                    commit('itemOpen',itemOpen.data)
                    commit('itemOpenHistoryActions',itemOpenHistoryActions.data)

                })
            )
*/

           // return new Promise((resolve) => {

            return this._vm.$http.get('guest-info', params).then(({data})=>{
                commit('itemOpen',data.data)

            })



           // });
        },
    },
    getters: {
        all: (state) => {


            return state.all
        },
        itemOpenIds: (state) => {
            return {
                guest_uuid:state.itemOpen.uuid,
                site_id:state.itemOpen.site_id,
            }
        }
    }
}
