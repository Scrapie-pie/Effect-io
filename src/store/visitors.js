import _ from 'underscore'

const getDefaultState = () => {
    return {
        all:[],
        allCount:false,
        process:[],
        processCount:false,
        processLastPageN:1,
        self:[],
        selfCount:false,
        selfLastPageN:null,
        itemOpen:false,
        itemOpenHistoryActions:false,

    }
}
// initial state
const state = getDefaultState();




export default {
    namespaced: true,
    state,
    mutations: {
        resetState (state) {
            Object.assign(state, getDefaultState())
        },


        all(state, val) { //Todo походу не нужен
            state.all=val.list;
            state.allCount=val.count;
        },

        messageHot(state, {val:{guest_uuid:uuid,site_id},set}){
            let findIndex = state.process.findIndex((item)=>{

                return item.uuid+item.site_id === uuid+site_id
            })

            if(findIndex !== -1) {
                this._vm.$set(state.process[findIndex],'hot',set)

            }
             findIndex = state.self.findIndex((item)=>{
                return item.uuid+item.site_id === uuid+site_id
            })

            if(findIndex !== -1) {
                this._vm.$set(state.self[findIndex],'hot',set)

            }
        },
        process(state, val) {
            state.process=val.list;
            if (val.count) state.processCount=val.count;
        },
        setProcessLastPageN(state,val){
            state.processLastPageN=val;
        },
        processMessageLastUpdate(state, val) {

            let findIndex = state.process.findIndex((item)=>{
               return item.uuid+item.site_id === val.uuid+val.site_id
            })

            if(findIndex !== -1) {
                    state.process[findIndex].last_message = val.body;
                    state.process[findIndex].last_message_author = val.last_message_author
            }
            else {
                val.last_message = val.body;
                console.log('state.process.push unprocessed');
                state.process.push(val);
                state.processCount += 1;
            }
        },
        processRemoveItem(state, {uuid,site_id}) {
            let findIndex = state.process.findIndex(item=>item.uuid+item.site_id === uuid+site_id)
            if(findIndex !== -1) state.process.splice(findIndex, 1);
        },
        processRemoveItemAll(state) {
             state.process=[]
             state.processCount=0

        },
        self(state, val) {
            state.self=val.list;
            if (val.count) state.selfCount=val.count;

        },
        setSelfLastPageN(state,val){
            state.selfLastPageN=val;
        },

        selfMessageLastUpdate(state, val) {
            console.log('selfMessageLastUpdate',val);
            let findIndex = state.self.findIndex((item)=>{
                if(val.selfUuid) return item.uuid === val.selfUuid; //selfId значит мое сообщение
                else return item.uuid+item.site_id === val.uuid+val.site_id
            })

            if(findIndex !== -1) {
                this._vm.$set(state.self[findIndex],'last_message',val.body)
                this._vm.$set(state.self[findIndex],'last_message_author',val.last_message_author)
                if(!val.selfUuid) {
                    let unread =  state.self[findIndex].unread
                    unread.push(val.id)
                    this._vm.$set(state.self[findIndex],'unread',unread)


                }
            }
        },
        selfMessageRemoveItem(state, {uuid,site_id}) {
            let findIndex = state.self.findIndex(item=>item.uuid+item.site_id === uuid+site_id)
            if(findIndex !== -1) state.self.splice(findIndex, 1);

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
