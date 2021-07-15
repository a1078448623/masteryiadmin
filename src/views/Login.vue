<template>
<div id="bk" style="height: 100vh;width: 100%;position:absolute;top: 0;background-size:100vw">

  <div style="width: 24%;margin-left: 38%;margin-top:8%;height: 60%;background-color: white;border-radius: 45px 45px 25px 25px;">
    <div style="height: 35%;width: 100%;background-color: RGB(83,168,255);border-radius: 45px 45px 0 0;">
      <img src="../assets/logoadmin.png" style="height: 120px;width: 90px;margin-top: 5%;margin-left: 2%">
      <div style="float: right ;font-size: 36px;color: white;margin-right: 6%;margin-top: 15%"><b>后台管理系统</b></div>
    </div>
    <el-form ref="form"  label-width="80px" style="margin-top: 10%">
    <el-form-item style="color:black;" label="用户名">
      <el-input v-model="username" prefix-icon="el-icon-user" style="width: 80%"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="password" type="password" prefix-icon="el-icon-lock" style="width: 80%"></el-input>
    </el-form-item>
  </el-form>
    <div style="width: 34%;text-align: center;margin-left: 33%;margin-top: 10%">
      <el-button type="primary" style="width: 100%" round @click="login">立即登录</el-button>
      <div style="margin-top: 10%"><el-link type="primary" :underline="false" href="javascript:void(0)" @click="visitor">游客模式</el-link></div>
    </div>

  </div>

</div>
</template>

<script>
export default {
  name: "Login",
  data(){
    return{
      username:'',
      password:''
    }
  },
  methods:{
    login(){
      this.$router.push("/main/home")
    },
    visitor(){
      this.$router.push("/main/home")
    }
  }
}
</script>

<style scoped>
#bk{
  background-image: url("../assets/bk2.jpg")
}
</style>