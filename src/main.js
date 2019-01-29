console.clear();

import Vue from 'vue'
import App from './App.vue'
import '@/validation'
import router from '@/routes/router'
import store from './store/index'

import axios from '@/modules/axios'

window.axios=axios;

import VuePerfectScrollbar from 'vue-perfect-scrollbar'






import BaseIcon from "@/components/BaseIcon";
import BaseField from "@/components/BaseField";
import BaseBtn from "@/components/BaseBtn";
import BaseRadioCheck from "@/components/BaseRadioCheck";
import BaseAvatar from "@/components/BaseAvatar";
import BasePeople from "@/components/BasePeople";

import BoxControls from "@/components/BoxControls";
import BaseNoFound from "@/components/BaseNoFound";


Vue.component('scroll-bar', VuePerfectScrollbar)
Vue.component('scroll-bar', VuePerfectScrollbar)

Vue.component('base-icon', BaseIcon)
Vue.component('base-field', BaseField)
Vue.component('base-field', BaseField)
Vue.component('base-btn', BaseBtn)
Vue.component('base-radio-check', BaseRadioCheck)
Vue.component('base-avatar', BaseAvatar)
Vue.component('base-people', BasePeople)

Vue.component('box-controls', BoxControls)
Vue.component('base-no-found', BaseNoFound)


/*let requireComponent = require.context('@/src/components/', true, /^Base[A-Z]/) //todo не работает(
console.log(requireComponent.keys());
requireComponent.keys().forEach(function (fileName) {
    console.log(fileName);
    let baseComponentConfig = requireComponent(fileName)
    baseComponentConfig = baseComponentConfig.default || baseComponentConfig
    let baseComponentName = baseComponentConfig.name || (
        fileName
            .replace(/^.+\//, '')
            .replace(/\.\w+$/, '')
    )
    console.log(baseComponentName);
    Vue.component(baseComponentName, baseComponentConfig)
})*/


/*window.axios = require('axios');
window.axios.defaults.baseURL = 'http://rbcall-rbcall-3212.cloud4.newrobocall.ru/app/app.php?'

window.axios.interceptors.response.use(null, function (error) {

    if (store.state.flashErrorOn && error.response.status == 500) alert('Неизвестная ошибка')
})*/

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')

/*const jwt = localStorage.getItem('jwt')
if (jwt) {

    axios.defaults.data = {};
    axios.defaults.headers.common[ 'jwt' ] = jwt;


    axios.post('app.php?login', {jwt}, {//todo доделать если время токена кончилось
        headers: { 'content-type': 'application/json' }
    }).then(({ data }) => {

        console.log('user', data.user)
        store.dispatch('user/login', data.user)

    }).catch((error) => {
        alert(error.response)
    })

}*/
axios.interceptors.response.use(null, function (error) {
    console.log(error.response);
    if (error.response.status == 500) alert('Неизвестная ошибка')
})




