import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import App from "@/App";
import Classify from "@/views/Classify";
import Goods from "@/views/Goods";
import Order from "@/views/Order";
import Promotion from "@/views/Promotion";
import User from "@/views/User";
import MainPage from "@/views/MainPage";
import GoodDetail from "@/components/GoodDetail";
import Login from "@/views/Login";
const routes = [
  {
    path:'/',
    name:'login',
    component: Login
  },
  {

    path: '/main',
    name: 'MainPage',
    component: MainPage,
    redirect:to=>{
      return{
        path:'/home'
      }
    },
    children:[{
      path:'home',
      name:'home',
      component:Home
    },{
      path:'user',
      name:'user',
      component:User
    },{
      path:'goods',
      name:'goods',
      component:Goods
    },
      {
        path: 'goodDetail/:id',
        name:'goodDetail',
        component: GoodDetail
      },
      {
      path:'promotion',
      name:'promotion',
      component:Promotion
    },{
      path:'order',
      name:'order',
      component:Order
    },
      { path:'classify',
      name:'classify',
      component:Classify},
    ]

  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to,from,next)=>{
  console.log(to);
  console.log(from);
  if(to.path==='/main/home'&&from.path==='/'){


    next()

  }
  else next()
})

export default router
