<template>
  <div>
    <el-table
        :data="tableData"
        style="width: 100%;font-size: 16px " :show-header="false">
      <el-table-column
          label="图片"
          width="80">
        <template #default="scope">
          <img src="../assets/huawei.jpg" alt="" style="height: 50px;width: 50px;">
        </template>
      </el-table-column>
      <el-table-column
          label="规格"
          prop="specDetail"
          width="150">
        <template #default="scope">

          <span >{{ getSpec(scope.row.specDetail) }}</span>
        </template>
      </el-table-column>

      <el-table-column
          label="库存"
          prop="stock"
          width="80">
      </el-table-column>

      <el-table-column
          label="价格"
          prop="price"
          width="80">
      </el-table-column>

      <el-table-column
          align="right"
      >
        <template #default="scope">

          <el-button
              size="mini"
              type="primary"
              @click="handleAdd(scope.$index, scope.row)">添加</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加秒杀商品" v-model="addVisible" width="500px">
      <el-form >
        <el-form-item label="选择秒杀数量" :label-width="formLabelWidth">
          <el-input v-model="addItem.stockNum" autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="秒杀价格" :label-width="formLabelWidth">
          <el-input v-model="addItem.price" autocomplete="off" style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
    <span class="dialog-footer">
      <el-button @click="addVisible = false">取 消</el-button>
      <el-button type="primary" @click="addGood">确 定</el-button>
    </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {post} from "@/utils/Network";
import QS from "qs";

export default {
  name: "SecGood",
  data(){
    return{
      tableData:[],
      specs:[],
      addVisible:false,
      addItem:{
        stockNum:'',
        price:'',
        specid:'',
        goodId:'',
      },

      formLabelWidth:'120px'
    }
  },
  props:{
    secinfo:{
      type:Object
    }
  },
  methods:{
    handleAdd(index, row){
      this.addItem.goodId=row.goodId
      this.addItem.specid=row.id
      this.addVisible=true
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
    addGood(){
      this.$emit('addGood',this.addItem)
      this.$message({
        type: 'success',
        message: '添加成功!'
      });
      this.addVisible=false
    }
  },
  mounted() {
    if(this.secinfo!==undefined)
    this.tableData=this.secinfo

  }
}
</script>

<style scoped>

</style>