<template>
<div id="bk" style="height: 100vh;width: 100%;position:absolute;top: 0;background-size:100vw">

  <div style="width: 28%;margin-left: 36%;margin-top:8%;height: 60%;background-color: white;border-radius: 35px 35px 20px 20px;">
    <div style="height: 35%;width: 100%;background-color: RGB(83,168,255);border-radius: 35px 35px 0 0;">
      <img src="../assets/logoadmin.png" style="height: 120px;width: 90px;margin-top: 5%;margin-left: 2%">
      <div style="float: right ;font-size: 40px;color: white;margin-right: 6%;margin-top: 15%"><b>后台管理系统</b></div>
    </div>
    <el-form ref="form"  label-width="80px" style="margin-top: 10%">
    <el-form-item label="用户名">
      <el-input v-model="username" prefix-icon="el-icon-user" style="width: 80%"></el-input>
    </el-form-item>
    <el-form-item label="密码">
      <el-input v-model="password" type="password" prefix-icon="el-icon-lock" style="width: 80%"></el-input>
    </el-form-item>
  </el-form>
    <div style="width: 30%;text-align: center;margin-left: 35%;margin-top: 10%"><el-button type="primary" round @click="login">立即登录</el-button></div>

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
    }
  }
}
</script>

<style scoped>
#bk{
  background-image: url("../assets/bk2.jpg")
}
</style>