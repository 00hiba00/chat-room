import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/HomeView.vue';
import Login from '@/views/Login.vue';
import Profile from '@/views/Profile.vue';
import Register from '@/views/Register.vue';
import UserList from '@/components/UserList.vue';
import { auth} from '@/firebase/firebase.js';
import SearchUser from '@/views/SearchUser.vue';
import ProfileCard from '@/components/ProfileCard.vue';
import Principale from '@/views/Principale.vue';
import ChatRoom from '@/views/Chatroom.vue';

const routes = [
  { path: '/', component: Home},
  {path: '/userlist', 
    component: UserList  },
  { path: '/Login', component: Login},
  { path: '/Profile', component: Profile, meta: { requiresAuth: true }},
  { path: '/Register', component: Register}, 
  { path: '/SearchUser', component: SearchUser, meta: { requiresAuth: true } },  
  {
    path: '/profile/:userId',
    name: 'profile',  
    component: ProfileCard,
    props: true,  
    meta: { requiresAuth: true }
  },
  { path: '/Principale', component:Principale, meta: { requiresAuth: true }},
  
  {
    path: '/chat/:id',
    component: ChatRoom,
    meta: { requiresAuth: true }
  },{
    path: '/chatroom/:id',
    name: 'chatroom',
    component: () => import('@/views/ChatRoomView.vue'),
    props: true
  }
  
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const user = auth.currentUser;
  if (to.meta.requiresAuth && !user) {
    next({ name: 'Login' }); 
  } else {
    next();
  }
});

export default router