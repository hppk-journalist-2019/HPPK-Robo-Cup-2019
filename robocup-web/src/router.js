import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/home/Home.vue'
import News from './components/news/News.vue'
import Article from './components/news/article/Article.vue'
import NewsAdd from './components/news/add/NewsAdd.vue'
import NewsEdit from './components/news/edit/NewsEdit.vue'
import Teams from './components/teams/Teams.vue'
import TeamsAdd from './components/teams/add/TeamsAdd.vue'
import TeamEdit from './components/teams/edit/TeamEdit.vue'
import Team from './components/teams/team/Team.vue'
import Matches from './components/matches/Matches.vue'
import Login from './components/login/Login.vue'
import NotFound from './components/NotFound.vue'

Vue.use(Router)

const onlySignInUser = (to, from, next) => {
  if (isSignInUser()) {
    next()
  } else {
    next("/")
  }
}

function isSignInUser() {
  return localStorage.getItem("firebaseui::rememberedAccounts") != null
}

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
      path: '/news/add',
      name: 'add news',
      component: NewsAdd,
      beforeEnter: onlySignInUser
    },
    {
      path: '/news/:newsId/edit',
      name: 'edit news',
      component: NewsEdit,
      beforeEnter: onlySignInUser
    },
    {
      path: '/news/:newsId',
      name: 'article',
      component: Article
    },
    {
      path: '/teams',
      name: 'teams',
      component: Teams
    },
    {
      path: '/teams/add',
      name: 'add teams',
      component: TeamsAdd,
      beforeEnter: onlySignInUser
    },
    {
      path: '/teams/:teamId/edit',
      name: 'edit team',
      component: TeamEdit,
      beforeEnter: onlySignInUser
    },
    {
      path: '/teams/:teamId',
      name: 'team',
      component: Team
    },
    // {
    //   path: '/matches',
    //   name: 'matches',
    //   component: Matches
    // },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/404',
      component: NotFound
    },
    {
      path: '*',
      redirect: '/404'
    },
  ]
})
