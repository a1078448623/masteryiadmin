<template>
<div style="margin-top: 30px;margin-left: 10px;margin-bottom:15px;color: #606266">

  <span style="font-size: 18px;margin-right: 15px;height: 40px!important;" @click="changeKeyName">
    <el-link href="javascript:void(0)" type="primary" icon="el-icon-edit" style="margin-right: 8px;font-size: 18px"></el-link>{{keyName}}</span>
  <el-select v-model="choose_val" placeholder="规格选择" @change="change" style="width: 150px">
    <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
    </el-option>
  </el-select>
  <el-button type="success" size="medium" style="margin-left: 30px" @click="newValue">新建</el-button>
  <el-button type="danger" size="medium" :disabled="enable" style="margin-left: 20px" @click="delValue">删除</el-button>
  <el-button type="info" size="medium" :disabled="enable" @click="changeValueName" style="margin-left: 20px">编辑</el-button>
  <el-link icon="el-icon-delete" type="danger" href="javascript:void(0)" style="font-size: 24px;
  position:absolute;margin-top: 10px;margin-right:30px;right: 0;line-height: 40px" @click="delKey"></el-link>
  <el-dialog title="修改规格属性名称" v-model="changeValueNameVisible" width="400px">
    <el-form>
      <el-form-item label="修改名字" :label-width="formLabelWidth">
        <el-input v-model="currName" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="changeValueNameVisible = false">取 消</el-button>
      <el-button type="primary" @click="changeValueNameConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>
  <el-dialog title="新建规格属性" v-model="newValueVisible" width="400px">
    <el-form>
      <el-form-item label="新建属性" :label-width="formLabelWidth">
        <el-input v-model="newName" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="newValueVisible = false">取 消</el-button>
      <el-button type="primary" @click="newValueConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>

  <el-dialog title="修改规格属性值" v-model="changeKeyNameVisible" width="400px">
    <el-form>
      <el-form-item label="修改名字" :label-width="formLabelWidth">
        <el-input v-model="newKeyName" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="changeKeyNameVisible = false">取 消</el-button>
      <el-button type="primary" @click="changeKeyNameConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>
</div>
</template>

<script>
import {get,post} from "@/utils/Network";
import QS from "qs"
export default {
  name: "OneSpecs",
  data(){
    return{
      rawData:'',
      keyName:'',
      options:[],
      choose_val:'',
      currKeyId:'',
      currValId:'',
      enable:true,
      formLabelWidth:'120px',
      changeValueNameVisible:false,
      currName:'',
      newName:'',
      newValueVisible:false,
      changeKeyNameVisible:false,
      newKeyName:''
    }
  },
  props:{
    specs:{
      type:Object
    },
    name:{
      type:String
    }
  },
  methods:{
    change(){
      this.enable = this.choose_val === '';
    },
    changeKeyName(){
      this.currKeyId=this.rawData[0].keyId
      this.newKeyName=this.rawData[0].keyName
      this.changeKeyNameVisible=true
    },
    changeKeyNameConfirm(){
      if(this.newKeyName===''){
        this.$message({
          type: 'danger',
          message: '不能为空!'
        });
      }
      else{
        post("/category/changeattrkey",QS.stringify({attrKeyId:this.currKeyId,newKeyName:this.newKeyName})).then(res=>{
          if(res.data.code===200){
            post("/category/getValuesByKey",QS.stringify({key_id:this.currKeyId})).then(res=>{
              this.rawData=res.data.data
              this.initOptions()
              this.choose_val=''
              this.enable=true
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.changeKeyNameVisible=false
            })
          }
        })
      }
    },
    newValue(){
      this.currKeyId=this.rawData[0].keyId
      this.newValueVisible=true
    },
    newValueConfirm(){
      post("/category/addattrvalue",QS.stringify({attrKeyId:this.currKeyId,attrValueName:this.newName})).then(res=>{
        if(res.data.code===200){
          post("/category/getValuesByKey",QS.stringify({key_id:this.currKeyId})).then(res=>{
            this.rawData=res.data.data
            this.initOptions()
            this.choose_val=''
            this.newName=''
            this.enable=true
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.newValueVisible=false
          })
        }
      })
    },
    delValue(){
      this.currKeyId=this.rawData[0].keyId
      this.currValId=this.choose_val.split("@")[0]
      this.currName=this.choose_val.split("@")[1]
      this.$confirm('确定要删除规格  '+this.currName+' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        post("/category/deleteattrvalue",QS.stringify({attrValueId:this.currValId})).then(res=>{
          if(res.data.code===200){
            post("/category/getValuesByKey",QS.stringify({key_id:this.currKeyId})).then(res=>{
              this.rawData=res.data.data
              this.initOptions()
              this.choose_val=''
              this.enable=true
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    changeValueName(){
      this.currKeyId=this.rawData[0].keyId
      this.currValId=this.choose_val.split("@")[0]
      this.currName=this.choose_val.split("@")[1]
      this.changeValueNameVisible=true;
    },
    changeValueNameConfirm(){
      post("/category/changeattrvalue",QS.stringify({attrValueId:this.currValId,newValueName:this.currName})).then(res=>{
          if(res.data.code===200){
            for(let i in this.rawData){
              if(this.rawData[i].valueId===this.currValId){
                this.rawData[i].valueName=this.currName
              }
            }
            this.initOptions()
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
            this.choose_val=''
            this.changeValueNameVisible=false
            this.enable=true
          }
      })
    },
    initOptions(){
      this.options=[]
      for(let i in this.rawData){
        this.keyName = this.rawData[i].keyName
        if(this.rawData[i].valueId!=='0') {
          this.keyName = this.rawData[i].keyName
          this.options.push({
            value: this.rawData[i].valueId + "@" + this.rawData[i].valueName,
            label: this.rawData[i].valueName
          })
        }
      }
    },
    delKey(){
      this.currKeyId=this.rawData[0].keyId
      this.$confirm('确定要删除属性  '+this.rawData[0].keyName+' ?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        post("/category/deleteattrkey",QS.stringify({attrKeyId:this.rawData[0].keyId,categoryId:this.rawData[0].categoryId})).then(res=>{
          if(res.data.code===200){
            post("/category/getValuesByKey",QS.stringify({key_id:this.currKeyId})).then(res=>{

              this.$emit('flushData',this.rawData[0].categoryId)
              this.rawData=res.data.data
              this.initOptions()
              this.choose_val=''
              this.enable=true
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  },
  mounted() {
    this.rawData=this.specs
    this.initOptions()
  }
}
</script>

<style scoped>

</style>