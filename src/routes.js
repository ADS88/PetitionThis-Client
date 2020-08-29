import VueRouter from 'vue-router'
import Login from './components/Login'
import Register from './components/Register'
import Homepage from "./components/Homepage";
import FullPetition from "./components/FullPetition";
import CreatePetition from "./components/CreatePetition";
import Profile from "./components/Profile";
import EditPetition from "./components/EditPetition";
import store from "./index"

const routes = [
  {path: "/", name: "homepage", component: Homepage},
  {path: "/Login", name: "login", component: Login,  meta: {requiresNoAuth: true}},
  {path: "/Register", name: "register", component: Register,  meta: {requiresNoAuth: true}},
  {path: "/Petition/:id", name: "fullpetition", component: FullPetition},
  {path: "/CreatePetition", name: "createpetition", component: CreatePetition, meta: {requiresAuth: true}},
  {path: "/Profile", name: "profile", component: Profile, meta: {requiresAuth: true}},
  {path: "/EditPetition/:id", component: EditPetition, props: true, meta: {requiresAuth: true}},

];

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (store.getters.getAuthenticationStatus) {
      next();
    } else {
      next({ path: '/' });
    }
  }
  next();
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.requiresNoAuth)) {
    if (!store.getters.getAuthenticationStatus) {
      next();
    } else {
      next({ path: '/' });
    }
  }
  next();
});

export default router;
