import Vue from 'vue'
import App from './App'
import common from 'common/common.js'
import qs from 'qs'
import VConsole from 'vconsole'

// 引入全局uView
import uView from 'uview-ui'
Vue.use(uView)
let myConsole = new VConsole();
console.log('Hello world');


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
Vue.prototype.$common = common
Vue.prototype.$qs = qs
app.$mount()
