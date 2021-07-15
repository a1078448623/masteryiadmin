<template>
<div style="padding-left: 15px">
  <div style="padding-left: 10px;padding-bottom:15px;font-size: 20px;color: #606266;border-bottom: #EBEEF5 2px solid">
    <el-tag style="font-size: 20px"><i class="el-icon-price-tag" style="margin-right: 10px">

    </i>规格管理</el-tag><span style="font-size: 34px;margin-left: 90px">{{name}}</span>
    <el-link href="javascript:void(0)" icon="el-icon-plus" type="primary"
             style="position:absolute; right: 0;font-size: 40px;margin-right: 25px;margin-top: 10px" @click="newKeyNameVisible=true"></el-link>
  </div>
  <OneSpecs v-for="(item,iii) in tempSpecs" :specs="item" :name="iii" :key="new Date().getTime()" @flushData="flushData"></OneSpecs>

  <el-dialog title="新建属性" v-model="newKeyNameVisible" width="400px">
    <el-form>
      <el-form-item label="" :label-width="formLabelWidth">
        为 {{name}} 新增属性
      </el-form-item>
      <el-form-item label="新建属性名字" :label-width="formLabelWidth">
        <el-input v-model="newKeyName" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="newKeyNameVisible = false">取 消</el-button>
      <el-button type="primary" @click="newKeyNameConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>
</div>
</template>

<script>
import OneSpecs from "@/components/OneSpecs";
import {post} from "@/utils/Network";
import QS from "qs";
export default {
  name: "SpecsManage",
  components: {OneSpecs},
  data(){
    return{
      tempSpecs:'',
      formLabelWidth:'120px',
      newKeyNameVisible:false,
      newKeyName:''
    }
  },
  props:{
    specses:{
      type:Object
    },
    name:{
      type:String
    },
    cateId:{
      type:Number
    }
  },
  methods:{
    getMsg(){

    },
    flushData(val){
      post("/category/getallattr",QS.stringify({categoryId:val})).then(res=>{
        console.log(val);
        this.tempSpecs=res.data.data
      })
    },
    newKeyNameConfirm(){
      if(this.newKeyName===''){
        this.$message({
          type: 'danger',
          message: '不能为空!'
        });
      }
      else{
        post("/category/addattrkey",QS.stringify({categoryId:this.cateId,attrKeyName:this.newKeyName})).then(res=>{
          if(res.data.code===200){
            post("/category/getallattr",QS.stringify({categoryId:this.cateId})).then(res=>{
              this.tempSpecs=res.data.data
              this.$message({
                type: 'success',
                message: '添加成功!'

              });
              this.newKeyName=''
              this.newKeyNameVisible=false
            })

          }
        })
      }
    }
  },
  mounted() {
    this.tempSpecs=this.specses
  }

}
</script>

<style scoped>

</style>