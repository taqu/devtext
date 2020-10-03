import Vue from 'vue'
import Vuex from 'vuex'
import VueAce from '@aminoeditor/vue-ace'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(VueAce)

const store = new Vuex.Store({
  state: {
    settings: {
      keybindings: 'vim',
      editmode: 'markdown',
      theme: 'ambiance'
    },
    windowSize: { width: 0, height: 0 },
    code: ''
  }, // state
  mutations: {
    updateKeybindings (state, keybindings) {
      state.settings.keybindings = keybindings
      this.dispatch('doSave')
    },
    updateEditmode (state, editmode) {
      state.settings.editmode = editmode
      this.dispatch('doSave')
    },
    updateTheme (state, theme) {
      state.settings.theme = theme
      this.dispatch('doSave')
    },
    setWindowSize (state, barHeight) {
      state.windowSize.width = window.innerWidth
      state.windowSize.height = window.innerHeight - barHeight - 2
    },
    updateCode (state, code) {
      state.code = code
    },
    save (state) {
      const json = JSON.stringify(this.state.settings)
      localStorage.setItem('settings', json)
    },
    load (state) {
      const item = localStorage.getItem('settings')
      if (item != null) {
        const settings = JSON.parse(item)
        this.commit('updateKeybindings', settings.keybindings)
        this.commit('updateEditmode', settings.editmode)
        this.commit('updateTheme', settings.theme)
      }
    }
  }, // mounted
  actions: {
    doSave ({ commit }) {
      commit('save')
    },
    doLoad ({ commit }) {
      commit('load')
    }
  } // actions
})

new Vue({
  vuetify,
  store,
  render: h => h(App),
  beforeCreate () {
    this.$store.dispatch('doLoad')
  }
}).$mount('#app')
