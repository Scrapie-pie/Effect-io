import Vue from 'vue'
import App from './App.vue'
import '@/validation'
import router from '@/routes/router'
import store from './store/store'
import axios from '@/modules/axios'

import VueWait from 'vue-wait'

Vue.use(VueWait)

import clicky from 'vue-clicky'
clicky({
	shift: true, //default: false - clicky won't trigger unless shift is pressed
	ctrl: true, //default: false - clicky won't trigger unless ctrl is pressed
	stop: true, //default: false - stops regular context menu from appearing when clicky is triggered (should only be used together with shift:true or ctrl:true)
	left: true //default: false - trigger on left click instead of right click
})

if (process.env.NODE_ENV !== 'development') {
	const sentry = () => import('@/modules/sentry')
	sentry()
}

//Vue.prototype.$http = axios;

Object.defineProperty(Vue.prototype, '$http', { value: axios })

import VuePerfectScrollbar from 'vue-perfect-scrollbar'

import VueSocketio from 'vue-socket.io-extended'
import io from 'socket.io-client'

import config from '@/config/index'

Vue.use(
	VueSocketio,
	io(config.api_websocket, {
		autoConnect: false,
		reconnection: true, // (Boolean) whether to reconnect automatically (false)
		reconnectionAttempts: 30, // (Number) number of reconnection attempts before giving up (Infinity),
		reconnectionDelay: 3000,
		transports: ['websocket'],
		upgrade: false,
		secure: true,
		query: {
			user: 'employee'
		}
	}),
	{
		store,
		actionPrefix: 'socket'
	}
)

import BaseIcon from '@/components/BaseIcon'
import BaseField from '@/components/BaseField'
import BaseBtn from '@/components/BaseBtn'
import BaseRadioCheck from '@/components/BaseRadioCheck'
import BaseAvatar from '@/components/BaseAvatar'
import BasePeople from '@/components/BasePeople'
import BoxControls from '@/components/BoxControls'
import BaseNoFound from '@/components/BaseNoFound'
import BaseTable from '@/components/BaseTable'

import BaseFilterSearch from '@/components/FilterSearch'
import BaseWait from '@/components/BaseWait'

Vue.component('vnode', {
	functional: true,
	render(h, context) {
		if (context.data && context.data.staticClass) {
			if (context.props.node.data) {
				if (context.props.node.data.staticClass)
					context.props.node.data.staticClass += ' ' + context.data.staticClass
				else context.props.node.data.staticClass = context.data.staticClass
			}
		}
		return context.props.node
	}
})
Vue.component('scroll-bar', VuePerfectScrollbar)
Vue.component('base-icon', BaseIcon)
Vue.component('base-field', BaseField)

Vue.component('base-btn', BaseBtn)
Vue.component('base-radio-check', BaseRadioCheck)
Vue.component('base-avatar', BaseAvatar)
Vue.component('base-people', BasePeople)
Vue.component('box-controls', BoxControls)
Vue.component('base-no-found', BaseNoFound)

Vue.component('base-filter-search', BaseFilterSearch)
Vue.component('base-table', BaseTable)
Vue.component('base-wait', BaseWait)

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

Vue.config.productionTip = false

window.showError = function(error) {
	if (error.response) {
		// The request was made and the server responded with a status code
		// that falls out of the range of 2xx
		return console.log(error.response)
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
	wait: new VueWait({
		useVuex: true, // You must pass this option `true` to use Vuex
		vuexModuleName: 'wait', // Vuex module name

		registerComponent: true, // Registers `v-wait` component
		componentName: 'v-wait', // <v-wait> component name, you can set `my-loader` etc.

		registerDirective: true, // Registers `v-wait` directive
		directiveName: 'wait' // <span v-wait /> directive name, you can set `my-loader` etc.
	}),
	router,
	store,
	render: h => h(App)
}).$mount('#app')
