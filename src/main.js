import Vue from 'vue'
import App from './App.vue'
import '@/validation'
import router from '@/routes/index'
import store from './store/index'


window.events = new Vue()

window.flash = (messages, type = '') => window.events.$emit('flash', [messages, type])

import BaseIcon from "@/components/BaseIcon";
import BaseField from "@/components/BaseField";
import BaseBtn from "@/components/BaseBtn";
import BaseRadioCheck from "@/components/BaseRadioCheck";


Vue.component('base-icon', BaseIcon)
Vue.component('base-field', BaseField)
Vue.component('base-field', BaseField)
Vue.component('base-btn', BaseBtn)
Vue.component('base-radio-check', BaseRadioCheck)

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

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
