<template>

  <el-card class="box-card">
    <template #header>
      <div class="card-header">

        <el-upload
            class="avatar-uploader"
            :action="getUrl+'/image/upload/'+good.goodsId"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            style="position:relative;"
        >
          <img v-if="showDefault" :src="defaultUrl" alt="" style="height: 180px;width: 100%">
          <img v-else :src="goodUrl" alt="" style="height: 180px;width: 100%">
<!--          <i class="el-icon-plus avatar-uploader-icon" style="position:absolute;right: 0;font-size: 19px"></i>-->
        </el-upload>
      </div>
    </template>
    <div class=" item " style="font-size: 22px">{{ good.goodsName }}</div>
    <div  class="text item" style="font-size:20px;float: right;margin-right: 15px"><span class="iconfont icon-newbimoney"></span>
      {{good.lowPrice}}
    </div>
    <div  class="text item" style="width: 100%;margin-top: 20px">
      <div >销量：{{good.sellNum}}</div>
    </div>
    <div class="text item" style="">收藏：{{good.collectNum}}</div>


    <div style="margin-top: 30px;text-align: right">
    <el-link type="danger" icon="el-icon-delete" href="javascript:void(0)" style="float: left;font-size: 25px;margin-top: 10px" @click="delGood"></el-link>
    <el-button type="primary" @click="sendMsg">查看详情<i class="el-icon-arrow-right el-icon--right"></i></el-button>
    </div>

  </el-card>
</template>

<script>

import {post} from "@/utils/Network";
import QS from "qs";
const {getBaseUrl} = require('@/utils/Network');
export default {
  name: "SingleGood",
  data(){
    return{
      good: {},
      baseUrl:"http://localhost:8081",
      defaultUrl:'http://qw7r9ly4i.hb-bkt.clouddn.com/huawei.jpg',
      showDefault:true,
      goodUrl:''

    }
  },
  computed:{
    getUrl(){
      return getBaseUrl()
    }
  },
  methods:{
    handleAvatarSuccess(res, file) {
      this.goodUrl=res.data
      this.showDefault=false
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    sendMsg(){

     this.$emit('getMsg',{good:this.good,bollean:false})
    },
    delGood(){
      this.$confirm('确定要删除该商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true})
          .then(() => {
            post("/goods/deleteGoods", QS.stringify({goodsId: this.good.goodsId} ))
                .then(res => {
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                  this.$emit('flush','flush')
                })
          }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  props:{
    info:{
      type:Object
    }
  },
  mounted() {
    let i ;
    for(i in this.info){
      this.good[i]=this.info[i]
    }
    if(this.good.goodsCoverUrl===null||this.good.goodsCoverUrl==="null"){
      this.showDefault=true
    }
    else {
      this.goodUrl=this.good.goodsCoverUrl
      this.showDefault=false
    }

  }
}
</script>

<style scoped>
.box-card{
  width: 20%;
  float: left;
  margin: 10px 35px 40px 15px;
}
.item{
  margin: 10px;
}
</style>