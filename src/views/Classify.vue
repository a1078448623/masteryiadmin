<template>
<div >
  <div style="width: 40%;height: 85vh;float:left;border-right: #E4E7ED 5px solid;padding-right: 20px;font-size: 18px!important;overflow: auto;">
    <div style="margin-bottom: 10px;width: 100%;">
    <el-button @click="expandAll" icon="el-icon-s-operation" type="primary" round>展开全部</el-button>
      <el-button @click="collespAll" icon="el-icon-d-caret" type="primary" round>全部收起</el-button>
      <el-button @click="newCate" icon="el-icon-circle-plus-outline" type="success" round>添加分类</el-button>
    </div>
  <div class="custom-tree-container" >
    <el-tree default-expand-all :data="treeData" node-key="id" ref="theTable">
      <template #default="{node, data}">
          <span class="custom-tree-node"  style="width:100%;height: 100%;line-height: 45px" @mouseenter="mouseenter(data)" @mouseleave="mouseleave(data)">
            <span>{{ data.label }}</span>
              <span v-if="data.plus">
                <el-link href="javascript:void(0)" v-show="data.show" size="mini" style="margin-left: 25px;font-size: 20px" type="primary" icon="el-icon-plus" @click="append(data)"></el-link>
              </span>
                <el-link href="javascript:void(0)" v-show="data.show" size="mini" style="margin-left: 25px;font-size: 20px" type="primary" icon="el-icon-delete" @click="remove(node,data) "></el-link>
                <el-link href="javascript:void(0)" v-show="data.show" size="mini" style="margin-left: 25px;font-size: 20px" type="primary" icon="el-icon-edit" @click="changeName(node,data)"></el-link>
              <span v-if="data.specs">
                <el-link href="javascript:void(0)" v-show="data.show" size="mini" style="margin-left: 25px;font-size: 20px" type="primary" icon="el-icon-s-unfold" @click="specsChange(node,data)">修改规格</el-link>
              </span>
            </span>
      </template>
    </el-tree>
  </div>
  </div>
  <div id="body_side" style="height: 85vh;width: 55%;float:left;">
    <SpecsManage v-if="showSpecs" :specses="specses" :name="categoryName" :key="new Date().getTime()" :cate-id="cateId"></SpecsManage>
    <SpecsManage v-else :specses="tempspecs" :name="categoryName" :key="new Date().getTime()" :cate-id="cateId"></SpecsManage>
  </div>

  <el-dialog title="修改分类名称" v-model="changeNameVisible" width="400px">
    <el-form>
      <el-form-item label="修改名字" :label-width="formLabelWidth">
        <el-input v-model="currName" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="changeNameVisible = false">取 消</el-button>
      <el-button type="primary" @click="changeNameConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>
  <el-dialog title="添加新分类" v-model="addCategoryVisible" width="400px">
    <el-form>
      <el-form-item label="当前一级分类" :label-width="formLabelWidth">
        {{currparentName}}
      </el-form-item>
      <el-form-item label="新分类名字" :label-width="formLabelWidth">
        <el-input v-model="newCategoryName" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="addCategoryVisible = false">取 消</el-button>
      <el-button type="primary" @click="addCategoryConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>
</div>
</template>

<script>
import {get,post} from "@/utils/Network";
import SpecsManage from "@/components/SpecsManage";
import QS from "qs"
export default {
  name: "Classify",
  components:{SpecsManage},
  data(){
    return{
      treeData:[],
      formLabelWidth:'120px',
      changeNameVisible:false,
      currName:'',
      currCategoryId:'',
      currparentName:'',
      newCategoryName:'',
      addCategoryVisible:false,
      showSpecs:false,
      specses:'',
      categoryName:'',
      tempspecs:'',
      cateId:''
    }
  },
  methods:{
    collespAll(){
      for(let i=0;i<this.$refs.theTable.store._getAllNodes().length;i++){
        this.$refs.theTable.store._getAllNodes()[i].expanded = false;
      }

    },
    expandAll(){
      for(let i=0;i<this.$refs.theTable.store._getAllNodes().length;i++){
        this.$refs.theTable.store._getAllNodes()[i].expanded = true;
      }
    },
    append(data) {
      this.newCategoryName=''
      this.currparentName=data.label
      this.currCategoryId=data.id
      this.addCategoryVisible=true
      console.log(data);
    },
    addCategoryConfirm(){
      if(this.newCategoryName===''){
        this.$message({
          type: 'warning',
          message: '请输入名称'
        });
      }
      else{
        post("/category/addcategory", QS.stringify({
          parentId: this.currCategoryId,
          categoryName: this.newCategoryName
        })).then(res => {
          post("/category/getallcategory").then(res => {
            let cate = res.data.data
            this.formateData(cate)
            this.$message({
              type: 'success',
              message: '添加成功!'
            });
            this.addCategoryVisible = false
          })
        })
      }
    },

    remove(node, data) {
      this.$confirm('确定要删除分类  '+data.label+' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        post("/category/deletecategory",QS.stringify({categoryId:data.id})).then(res=>{
          post("/category/getallcategory").then(res=>{
            let cate=res.data.data
            this.formateData(cate)
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },

    changeName(node,data){
      this.currName=data.label
      this.currCategoryId=data.id
      this.changeNameVisible=true

    },
    changeNameConfirm(){
      post("/category/changecategoryname",QS.stringify({categoryId:this.currCategoryId,newName:this.currName})).then(res=>{
        post("/category/getallcategory").then(res=>{
          let cate=res.data.data
          this.formateData(cate)
          this.$message({
            type: 'success',
            message: '修改成功!'
          });
          this.changeNameVisible=false
        })
      })
    },
    specsChange(node,data){
      post("/category/getallattr",QS.stringify({categoryId:data.id})).then(res=>{
        this.specses=res.data.data
        this.categoryName=data.label
        this.showSpecs=true
        this.cateId=data.id
      })
    },
    mouseenter(data) {
      // this.$set(data, 'show', true)
      data.show=true
    },

    mouseleave(data) {
      data.show=false

    },
    formateData(cate){
      this.treeData=[]
      let temp=[]
      for(let i in cate){
        if(cate[i][0].categoryId===0){
          this.treeData.push({id:cate[i][0].parentCategoryId,label:i,show:false,plus:true,specs:false,children:temp})
        }
        else {
          for(let j in cate[i]){
            temp.push({id:cate[i][j].categoryId,label:cate[i][j].categoryName,show:false,plus:false,specs:true})
          }
          this.treeData.push({id:cate[i][0].parentCategoryId,label:i,show:false,plus:true,specs:false,children:temp})

        }
        temp=[]
      }
    },
    newCate(){
      this.$prompt('请输入分类名字', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',

      }).then(({ value }) => {
        if(value!==null){
          post("/category/addparent",QS.stringify({cateName:value})).then(res=>{
            if(res.data.code===200){
              post("/category/getallcategory").then(res=>{
                let cate=res.data.data
                this.formateData(cate)
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                });
              })
            }
          })
        }
        else {
          this.$message({
            type: 'warning',
            message: '输入不能为空'
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消添加'
        });
      });
    }
  },
  mounted() {
    post("/category/getallcategory").then(res=>{
      let cate=res.data.data
      let id=0,name=''
      this.formateData(cate)
      for(let i in this.treeData){
        if(this.treeData[i].children.length!==0){
          id=this.treeData[i].children[0].id
          name=this.treeData[i].children[0].label
          break
        }
      }
      if(id!==0){
        post("/category/getallattr",QS.stringify({categoryId:id})).then(res=>{
          this.tempspecs=res.data.data
          this.categoryName=name
          this.cateId=id
          // this.showSpecs=true
        })
      }
    })
  },
}
</script>

<style >
.el-tree-node__content{
  font-size: 20px;
  height: 45px!important;
}
.el-tree-node__label{
  font-size: 18px!important;
}
.el-tree-node__expand-icon{
  font-size: 18px !important;
}
.el-checkbox__inner{
  width: 16px!important;
  height: 16px!important;
}
</style>