console.clear();

import Vue from 'vue'
import App from './App.vue'
import '@/validation'
import router from '@/routes/router'
import store from './store/store'
import axios from '@/modules/axios'

Vue.prototype.$http = axios;

import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import BaseIcon from "@/components/BaseIcon";
import BaseField from "@/components/BaseField";
import BaseBtn from "@/components/BaseBtn";
import BaseRadioCheck from "@/components/BaseRadioCheck";
import BaseAvatar from "@/components/BaseAvatar";
import BasePeople from "@/components/BasePeople";
import BoxControls from "@/components/BoxControls";
import BaseNoFound from "@/components/BaseNoFound";

Vue.component('scroll-bar', VuePerfectScrollbar);
Vue.component('base-icon', BaseIcon);
Vue.component('base-field', BaseField);
Vue.component('base-field', BaseField);
Vue.component('base-btn', BaseBtn);
Vue.component('base-radio-check', BaseRadioCheck);
Vue.component('base-avatar', BaseAvatar);
Vue.component('base-people', BasePeople);
Vue.component('box-controls', BoxControls);
Vue.component('base-no-found', BaseNoFound);


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

Vue.config.productionTip = false;

window.showError = function (error) {

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
    return    console.log(error.response);
/*        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)*/
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
    } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error message', error.message)
        console.log('Error {}', error)
    }
    console.log(error.config)


}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')












