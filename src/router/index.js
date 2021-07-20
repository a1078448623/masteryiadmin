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
import {post} from "@/utils/Network";

const routes = [
  {
    path:'/',
    name:'login',
    meta:{
      title:'登录'
    },
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
      meta:{
        title:'首页'
      },
      component:Home
    },{
      path:'user',
      name:'user',
      meta:{
        title:'用户管理'
      },
      component:User
    },{
      path:'goods',
      name:'goods',
      meta:{
        title:'商品管理'
      },
      component:Goods
    },
      {
        path: 'goodDetail/:id',
        name:'goodDetail',
        meta:{
          title:'商品详情'
        },
        component: GoodDetail
      },
      {
      path:'promotion',
      name:'promotion',
        meta:{
          title:'活动管理'
        },
      component:Promotion
    },{
      path:'order',
      name:'order',
        meta:{
          title:'订单管理'
        },
      component:Order
    },
      { path:'classify',
      name:'classify',
        meta:{
          title:'分类管理'
        },
      component:Classify},
    ]

  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
router.beforeEach((to,from,next)=>{
  if(to.meta.title){
    document.title=to.meta.title
  }
  if(to.path!=='/'){
    if(window.localStorage.getItem("token")===null||window.localStorage.getItem("token")===undefined){
      document.title="登录"
      next({
        path:'/'
      })
    }
    else{
      post("/login/token").then(res=>{
        console.log(res.data);
        if(res.data===true) next()
        else {
          document.title="登录"
          next({
            path: '/',
            component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
          })
        }
      })
    }
  }
  else next()
  // if(to.path==='/main/home'&&from.path==='/'){
  //
  //
  //   next()
  //
  // }
  // else next()
})

export default router
