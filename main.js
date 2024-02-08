import App from './App'
// #ifndef VUE3
import Vue from 'vue'
//引入socket
import io from './components/socket/weapp.socket.io.js'
import store from 'commons/js/store.js'
Vue.config.productionTip = false
// Vue.prototype.serverUrl='http://127.0.0.1:3000'
Vue.prototype.serverUrl='http://8.130.109.186:3000'
// Vue.prototype.serverUrl='https://3246df5d.r12.cpolar.top'

// Vue.prototype.socket=io('http://127.0.0.1:8082')

Vue.prototype.socket=io('http://8.130.109.186:3030')
// Vue.prototype.socket=io('http://478cbd40.r19.cpolar.top')
App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif