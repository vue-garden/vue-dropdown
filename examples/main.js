import Vue from 'vue'
import App from './App'
import Dropdown from 'main'

Vue.use(Dropdown)

new Vue({
  el: '#app',
  render: h => h(App)
})
