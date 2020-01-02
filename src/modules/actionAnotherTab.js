import { dialogPush } from '@/modules/modules'

const methodRoot = 'actionAnotherTab'

const mixins = {
    watch: {
        '$store.state.actionAnotherTab':{
            handler({type,method,payload}){
                console.log(type,method,payload);

                if(type==='mutation') {
                    console.log('actionAnotherTab.mutation start',method, payload);
                    this.$store.commit(method, payload)
                    console.log('actionAnotherTab.mutation end',method);
                    this.$store.commit('actionAnotherTab/resetState')
                }

                if(type==='method') {
                    console.log('actionAnotherTab.method start',method);
                    this[methodRoot+method](payload)
                    console.log('actionAnotherTab.method end',method);
                    this.$store.commit('actionAnotherTab/resetState')
                }


            },
            deep:true
        },

    },
    created() {
        this.$root.$on('actionAnotherTab',this.actionAnotherTab)
    },
    beforeDestroy(){
        this.$root.$off('actionAnotherTab',this.actionAnotherTab)
    },
    methods: {

        [methodRoot+'dialogPush'](payload){
            dialogPush(this,...payload)
        },
        [methodRoot]([type,method,payload]){
            this.$store.commit('actionAnotherTab/setState',{type,method,payload})
        },

    },
}



const storeInit =()=>{

    const getDefaultState = () => {
        return Object.assign(
            {
                type:'',
                method:'',
                payload:{},

            },

        )
    }

    const state = getDefaultState()


    return  {
        namespaced: true,
        state,
        mutations: {
            resetState(state) {
                Object.assign(state, getDefaultState())
            },
            setState(state,{type,method,payload}){

                state.type = type
                state.method = method
                state.payload = payload

            },
        },

    }

}
const store = storeInit()
export { mixins, store }