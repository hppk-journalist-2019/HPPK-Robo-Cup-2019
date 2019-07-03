import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {
    signOut({ commit }) {
      firebase.auth().signOut().then(function () {
        console.log("Sign Out!!!")
      }).catch(function (error) {
        console.log("Sign Out failed!!!")
      });

      localStorage.removeItem("firebaseui::rememberedAccounts")
      // commit("signOut")
      router.push("/")
    }
  }
})
