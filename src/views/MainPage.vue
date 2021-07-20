<template>
  <div id="top">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect"
             background-color="#303133" text-color="#fff" active-text-color="#ffd04b" style="height: 9vh">
<!--      <img src="../assets/title2.png" alt="" style="height: 100%;width: 195px;float:left;margin-left: 15px">-->
      <div style="float: left;height: 100%;margin-left: 5px;width: 20vw;line-height: 9vh;">
        <img src="../assets/logoyi.png" alt="" style="height: 95%;">
        <img src="../assets/after.png" alt="" style="height: 65%;">
<!--        <div style="color: white;float: right;font-size: 32px;" id="aa">后台管理系统</div>-->
      </div>
      <el-submenu index="2" style="float:right;height: 9vh">
        <template #title >
          <i class="el-icon-user-solid" style="line-height: 9vh"></i></template>
        <el-menu-item index="2-1" @click="logoff">退出登录</el-menu-item>
      </el-submenu>
      <el-menu-item index="3" style="float: right;height: 9vh" @click="flush"><i class="el-icon-refresh-left" style="line-height: 9vh"></i></el-menu-item>
    </el-menu>
  </div>
  <div id="side">
    <el-menu
        :uniqueOpened="true"
        :default-active="toPath"
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b" style="height: 100%;width: 100%;">
      <router-link :to="'/main/home'" >
      <el-menu-item index="/main/home">

        <template #title>

            <i class="el-icon-s-home"></i>
            <span>首页</span>

        </template>

      </el-menu-item>
      </router-link>
      <router-link :to="'/main/user'" >
      <el-menu-item index="/main/user" style="width: 100%;">
        <template #title>

          <i class="el-icon-user"></i>
          <span>用户管理</span>

        </template>
      </el-menu-item>
      </router-link>
      <router-link :to="'/main/goods'" >
      <el-menu-item index="/main/goods">
        <template #title>

          <i class="el-icon-goods"></i>
          <span>商品管理</span>

        </template>
<!--        <el-menu-item index="3-1" >选项1</el-menu-item>-->
<!--        <el-menu-item index="3-2">选项2</el-menu-item>-->
<!--        <el-menu-item index="3-3">选项3</el-menu-item>-->
      </el-menu-item>
      </router-link>
      <router-link :to="'/main/classify'" >
      <el-menu-item index="/main/classify">
        <template #title>
          <i class="el-icon-menu"></i>
        <span>分类管理</span>
        </template>

      </el-menu-item>
      </router-link>
      <router-link :to="'/main/order'" >
      <el-menu-item index="/main/order">

        <i class="el-icon-document"></i>

        <template #title>订单管理</template>

      </el-menu-item>
      </router-link>
      <router-link :to="'/main/promotion'" >
      <el-menu-item index="/main/promotion">
        <template #title>

          <i class="el-icon-date"></i>
          <span>活动管理</span>

        </template>
      </el-menu-item>
      </router-link>
    </el-menu>
  </div>
  <div id="body" v-infinite-scroll="load" style="overflow:auto">
    <router-view></router-view>
  </div>
</template>
<script>
import {post} from "@/utils/Network";

export default {
  name:'MainPage',
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      toPath:'/main/home',
      count: 0
    };
  },
  methods: {
    logoff(){
      post("/login/logoff").then(res=>{
        window.localStorage.setItem('token',"")
        this.$router.push({path:'/'})
      })
    },
    flush(){
      window.location.reload()
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    load () {
      this.count += 2
    }

  },
  mounted() {
    this.toPath=this.$route.fullPath

  },


}
</script>
<style>
body{
  margin: 0;
  padding: 0;
  background-color: #E4E7ED;
}
#top{
  height: 9vh;
  width: 100vw;
}
#side{
  height: 91vh;
  width: 10vw;
  float: left;
}
#body{
  position: fixed;
  top: 10vh;
  left: 10vw;
  /*float: left;*/
  width:86vw;
  height: 83vh;
  padding: 1vw;
  margin: 1vh 0 1vw 1vw;
  background-color: white;
}
.el-submenu .el-menu-item{
  width: 10vw!important;
  min-width: 0!important;
}
a{
  text-decoration: none;
}
.router-link-active {
  text-decoration: none;
}
.el-submenu__title{
  height: 9vh!important;
}
#aa{
  font-family:Helvetica,sans-serif;

}
</style>
