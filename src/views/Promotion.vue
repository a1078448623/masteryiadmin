<template>
<div >
  <div>
    <span style="margin-right:25px;color:#606266;font-size: 16px">秒杀时间选择</span>
    <el-date-picker
        v-model="valueTime"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="x">
    </el-date-picker>
    <el-button type="success" @click="confirmChoose" icon="el-icon-present" style="position:absolute;right: 20px">发布活动</el-button>
  </div>
  <div id="toChoose" style="width: 45%;height: 550px;float:left;overflow: auto;margin-top: 20px">
    <div id="tableHeader" style="color:#303133;">
      <b style="width: 100px;text-align: center">图片</b>
      <b style="margin-left: 55px">规格</b>
      <b style="margin-left: 110px">总库存</b>
      <b style="margin-left: 35px">原价(/元)</b>
      <el-input style="width: 120px;margin-left: 20px" v-model="search" placeholder="商品名检索"></el-input>
    </div>
    <div v-for="(item,index) in calc()" style="margin-top: 10px">
      <el-tag type="success">{{ item.goodsName }}</el-tag>
      <SecGood  :secinfo="specinfo[index]" :key="new Date().getTime()" @addGood="addGood"></SecGood>
    </div>

  </div>
  <div id="chosed" style="width: 54%;height: 500px;float:left;">
   <div style="font-size: 18px;margin-top: 20px;margin-left: 10px">
     <b >秒杀商品</b>
     <el-table
         :data="showAddData"
         style="width: 100%;font-size: 16px " :show-header="showHeader">
       <el-table-column
           label="图片"
           width="90">
         <template #default="scope">
           <img src="../assets/huawei.jpg" alt="" style="height: 50px;width: 50px;">
         </template>
       </el-table-column>
       <el-table-column
           label="商品名称"
           prop="goodsName"
           width="150">
       </el-table-column>
       <el-table-column
           label="规格"
           prop="description"
           width="140">
         <template #default="scope">

           <span >{{ getSpec(scope.row.description) }}</span>
         </template>
       </el-table-column>

       <el-table-column
           label="秒杀数量"
           prop="goodsNum"
           width="130">
       </el-table-column>

       <el-table-column
           label="秒杀价格(/元)"
           prop="singlePrice"
           width="130">
       </el-table-column>


     </el-table>
   </div>
  </div>
</div>
</template>

<script>
import {get,post} from "@/utils/Network";
import QS from "qs"
import SecGood from "@/components/SecGood";
import Moment from "moment"
export default {
  name: "Promotion",
  components: {SecGood},
  data(){
    return{
      valueTime:'',
      goods:'',
      allGoods2:'',
      search:'',
      specinfo:'',
      specsId:[],
      secPrice:[],
      secStock:[],
      showAddData:[],
      showHeader:false
    }
  },
  methods:{
    confirmChoose(){
      console.log(this.valueTime[0])
      console.log(this.valueTime[1])
      console.log(this.specsId)
      console.log(this.secPrice)
      console.log(this.secStock)

      post("/seckill/addSkGoods",QS.stringify({prodId:this.specsId,stock:this.secStock,price:this.secPrice,bDate:this.valueTime[0]/1000,eDate:this.valueTime[1]/1000},{indices:false})).then(res=>{
        this.$message({
          type:'success',
          message:'发布活动成功!'
        })
      })
      // post("/seckill/testdate",QS.stringify({
      //    begin:this.valueTime[0],end:this.valueTime[1],
      //    goodsId:this.specsId,price:this.secPrice,
      //    stock:this.secStock},{indices:false})).then(res=>{
      //
      //  })

    },
    getSpec(val){
      let res=''
      for(let i in Object.keys(val)){
        if(i!==Object.keys(val).length-1+'')
          res= res+val[Object.keys(val)[i]]+"，"
        else res= res+val[Object.keys(val)[i]]
      }
      return res
    },
    addGood(val){
      this.showHeader=true
      this.specsId.push(val.specid)
      this.secPrice.push(val.price)
      this.secStock.push(val.stockNum)
      post("/goods/getgoodbysid",QS.stringify({id:val.specid})).then(res=>{
        let temp=res.data.data
        temp.goodsNum=parseInt(val.stockNum)
        temp.singlePrice=parseFloat(val.price)
        this.showAddData.push(temp)
      })
      console.log(this.specsId);
    },
    calc(){
      if(this.goods!=='')
      return this.goods.filter(data => !this.search || data.goodsName.toLowerCase().includes(this.search.toLowerCase()))
    }
  },
  mounted() {
    post("/goods/getallgoods").then(res=>{
      this.goods=res.data.data;
      this.allGoods2=res.data.data
      let ids=[]
      for(let i in this.goods){
        ids.push(this.goods[i].goodsId)
      }

      post("/goods/getallgoodspecs",QS.stringify({goods_id:ids},{indices:false})).then(res=>{

        this.specinfo=res.data.data

      })
    })
  }
}
</script>

<style scoped>

</style>