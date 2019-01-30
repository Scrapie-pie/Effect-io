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







window.showError = function showError(error) {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
    }
    console.log(error.config)
    alert(error.response)

}




