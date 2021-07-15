<template>
<div>
  <el-tag type="success">订单项详情</el-tag>
  <el-table
      :data="tableData"
      style="width: 100%;font-size: 14px ">
    <el-table-column
        label="商品名称"
        prop="goodsName"
        width="180">
    </el-table-column>
    <el-table-column
        label="规格"
        prop="description"
        width="250">
      <template #default="scope">
        <span >{{ getSpec(scope.row.description) }}</span>
      </template>
    </el-table-column>
    <el-table-column
        label="图片"
        width="250">
      <template #default="scope">
        <img src="../assets/huawei.jpg" alt="" style="height: 50px;width: 50px;">
      </template>
    </el-table-column>
    <el-table-column
        label="单价(/元)"
        prop="singlePrice"
        width="150">
    </el-table-column>

    <el-table-column
        label="数量"
        prop="goodsNum"
        width="150">
    </el-table-column>

  </el-table>
</div>
</template>

<script>
import {post} from "@/utils/Network";
import QS from "qs";

export default {
  name: "OrderItem",
  data(){
    return{
      tableData:[]
    }
  },
  props:{
    orderId:{
      type:Number
    }
  },
  methods:{
    getSpec(val){
      let res=''
      for(let i in Object.keys(val)){
        if(i!==Object.keys(val).length-1+'')
          res= res+val[Object.keys(val)[i]]+"，"
        else res= res+val[Object.keys(val)[i]]
      }
      return res
    }
  },
  mounted() {
    if(this.orderId!==undefined)
    {
      post("/order/getorderitem", QS.stringify({orderId: this.orderId})).then(res => {
        this.tableData = res.data.data
      })
    }
  }
}
</script>

<style scoped>

</style>