<template>
<div >

  <div v-if="detailNotShow">

  <div style="margin-bottom: 10px;padding-bottom:20px;color:#606266;width: 100%;border-bottom: #E4E7ED 1px solid">
    筛选不同分类下的商品：
    <el-select v-model="value_parent" placeholder="一级分类选择" @change="change">
      <el-option
          v-for="item in options_parent"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>

    <el-select
        v-model="value_child"
        style="margin-left: 20px;"
        placeholder="二级分类选择(可选)">
      <el-option
          v-for="item in options_child"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
    <el-button type="primary" style="margin-left: 30px" @click="selectGoods">筛选</el-button>
    <el-button type="info" @click="reset">重置</el-button>

    <el-button icon="el-icon-circle-plus-outline"  type="primary"
             style="position:absolute;right: 0;margin-right: 50px" @click="addNewGood" plain>添加商品</el-button>
  </div >
  <SingleGood v-for="item in goods" :info="item" @getMsg="getMsg" :key="new Date().getTime()" @flush="flush"></SingleGood>
  </div>
  <div v-else>
      <GoodDetail :good="detail" @closeDetail="closeDetail"></GoodDetail>
  </div>
  <el-dialog title="添加新商品" v-model="newGoodVisible" width="500px">
    <el-form>

      <el-form-item label="商品名字" :label-width="formLabelWidth">
        <el-input v-model="goodName" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="商品描述" :label-width="formLabelWidth">
        <el-input v-model="goodInformation" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" :label-width="formLabelWidth">
        <el-select v-model="categoryId" placeholder="请选择" @change="getSpecs" style="width: 200px">

          <el-option-group
              v-for="group in options"
              :key="group.label"
              :label="group.label">
            <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格" :label-width="formLabelWidth">
        <el-select v-model="specses" placeholder="请先选择分类" multiple style="width: 200px">
          <el-option
              v-for="item in specsoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="初始价格" :label-width="formLabelWidth">
        <el-input v-model="primaryPrice" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="newGoodVisible = false">取 消</el-button>
      <el-button type="primary" @click="newGoodConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>


</div>

</template>

<script>
import {get,post} from "@/utils/Network";
import QS from "qs"
import SingleGood from "@/components/SingleGood";
import GoodDetail from "@/components/GoodDetail";
export default {
  name: "Goods",
  components: {GoodDetail, SingleGood},
  computed:{
    time(){
      return new Date().getTime()
    }
  },
  data(){
    return{
      info:'',
      goods:'',
      allGoods2:'',
      allGoods:'',
      options_parent:[],
      value_parent:'',
      value_child:'',
      options_child:[],
      detailNotShow:true,
      detail:'',
      ts:true,
      formLabelWidth:'120px',
      goodName:'',
      goodInformation:'',
      categoryId:'',
      options:[],
      newGoodVisible:false,
      specses:'',
      specsoptions:[],
      primaryPrice:''
    }
  },
  methods:{
    change(){
      this.value_child=''
      this.options_child=[]
      for(let item in this.allGoods[this.value_parent.split(",")[1]]){
        this.options_child.push({value:this.allGoods[this.value_parent.split(",")[1]][item].categoryId,
          label:this.allGoods[this.value_parent.split(",")[1]][item].categoryName})
      }
    },
    reset(){
      this.goods=this.allGoods2
      console.log(this.allGoods2);
      this.value_parent=''
      this.value_child=''
    },
    selectGoods(){
      if(this.value_child===''){
        post("/goods/getparentcategorygoods",QS.stringify({parentId:this.value_parent.split(",")[0]}))
        .then(res=>{
          this.goods=res.data.data
        })
      }
      else{
        post("/goods/getchildcategorygoods",QS.stringify({childId:this.value_child}))
        .then(res=>{
          this.goods=res.data.data
        })
      }
    },
    getMsg(val){
      this.detailNotShow=val.boolean
      this.detail=val.good
    },
    closeDetail(val){
      this.detailNotShow=val
    },
    addNewGood(){
      post("/category/getallcategory").then(res=>{
        let cats=res.data.data
        let temp=[]
        for(let i in cats){
          // console.log(cats[i].length);
          for(let j=0;j<cats[i].length;j++){

            temp.push({value:cats[i][j].categoryId,label:cats[i][j].categoryName})
          }
          this.options.push({label: i, options:temp})
          temp=[]
        }
        this.newGoodVisible=true
      })
    },
    newGoodConfirm(){
      console.log(this.categoryId);
      console.log(this.goodName);
      console.log(this.goodInformation);
      let keys=[]
      for(let i in this.specses){
        keys.push(this.specses[i])
      }
      console.log(this.specses);
      console.log(keys);
      post("/goods/addgood",QS.stringify({goodsName:this.goodName,goodsInformation:this.goodInformation,goodsCategoryId:this.categoryId,
        goodsCoverUrl:'null',collectNum:0,sellNum:0,specs:keys,primaryPrice:this.primaryPrice},{indices:false})).then(res=>{
        post("/goods/getallgoods").then(res=>{
          this.goods=res.data.data;
          this.allGoods2=res.data.data
          this.goodName=''
          this.goodInformation=''
          this.categoryId=''
          this.primaryPrice=''
          this.specses=''
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
          this.newGoodVisible=false
        })
      })
    },
    getSpecs(){
      post("/category/getallattr",QS.stringify({categoryId:this.categoryId})).then(res=>{
        let sp=res.data.data
        this.specsoptions=[]
        for(let i in sp){
          this.specsoptions.push({value:sp[i][0].keyId,label:i})
        }
      })
    },
    flush(val){
      post("/goods/getallgoods").then(res=>{
        this.goods=res.data.data;
        this.allGoods2=res.data.data
      })
    }
  },

  mounted() {
    post("/goods/getallgoods").then(res=>{
      this.goods=res.data.data;
      this.allGoods2=res.data.data
    })
    post("/category/getallcategory").then(res=>{
      this.info=res.data.data
      this.allGoods=res.data.data
      let data=res.data.data
      for(let item in data){
        this.options_parent.push({value:data[item][0].parentCategoryId+','+item,label:item})
      }

    })

  }
}
</script>

<style scoped>

</style>