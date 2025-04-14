import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';
import Register from '@/views/Register.vue';
import { auth} from '../firebase/firebase.js';


const routes = [
  { path: '/', component: HomeView, name: 'Home' },
  { path: '/Login', component: Login, name: 'Login' },
  { path: '/Profile', component: Profile, name: 'Profile' },
  { path: '/Register', component: Register, name: 'Register'},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' }); // Redirect to login if not authenticated
  } else {
    next();
  }
});

export default router
