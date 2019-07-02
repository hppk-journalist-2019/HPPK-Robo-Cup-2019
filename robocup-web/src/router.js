import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/home/Home.vue'
import News from './components/news/News.vue'
import Teams from './components/teams/Teams.vue'
import Matches from './components/matches/Matches.vue'
import Login from './components/login/Login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/news',
      name: 'news',
      component: News
    },
    {
      path: '/teams',
      name: 'teams',
      component: Teams
    },
    {
      path: '/matches',
      name: 'matches',
      component: Matches
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
