<template>
<div >
  <div style="width: 100%;">
    <el-tag style="margin-right: 15px">订单号检索</el-tag>
    <el-input v-model="search" placeholder="请输入订单号" style="width: 250px;margin-right: 55px"></el-input>
    <el-tag style="margin-right: 15px">用户名检索</el-tag>

    <el-input v-model="searchUser" placeholder="请输入用户账号" style="width: 250px;margin-right: 15px"></el-input>
    <el-button type="info" icon="el-icon-refresh-right" @click="reset">重置</el-button>
    <el-button type="primary" icon="el-icon-document-copy"
               style="margin-right: 10px;position: absolute;right: 15px" @click="preRefund">退款请求处理</el-button>

  </div>
  <el-table
      :data="tableData.filter(data => !search || data.orderNo.toLowerCase().includes(search.toLowerCase()))
      .filter(data => !searchStatu || data.statu.toLowerCase().includes(searchStatu.toLowerCase()))
      .filter(data => !searchUser || data.userName.toLowerCase().includes(searchUser.toLowerCase()))
      .slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100% ;font-size: 14px;margin-top: 10px;" @expand-change="echange">
    <el-table-column type="expand" >
      <template #default="props" >
        <el-form label-position="left" inline class="demo-table-expand">
          <el-tag type="warning" style="margin-right: 10px">订单扩展信息</el-tag>
          <i class="el-icon-location-information" ></i>
          <el-form-item label="收货人地址:" style="margin-right: 200px; ">
            <span>{{props.row.address}}</span>
          </el-form-item>
          <i class="el-icon-mobile-phone" ></i>
          <el-form-item label="手机号:">
            <span>{{props.row.phoneNum}}</span>
          </el-form-item>

        </el-form>
        <OrderItem :order-id="props.row.orderId"></OrderItem>
      </template>
    </el-table-column>
    <el-table-column
        label="订单号"
        prop="orderNo"
        width="350">
    </el-table-column>

    <el-table-column
        label="创建者账号"
        prop="userName"
        width="180">
      <template #default="scope">
        <div style="height: 40px;line-height: 40px">
          <i class="el-icon-user"></i>
          <span style="margin-left: 10px;height: 50px" >{{ scope.row.userName }}</span>
        </div>
      </template>
    </el-table-column>


    <el-table-column
        label="创建时间"
        prop="formate_time"
        width="220" sortable>
    </el-table-column>
    <el-table-column
        label="订单小计(/元)"
        prop="orderTotalPrice"
        width="150">
    </el-table-column>
    <el-table-column
        label="订单状态"
        prop="statu"
        width="150"
        :filters="[{text: '尚未支付', value: '尚未支付'}, {text: '运输中', value: '运输中'},
        {text: '已完成', value: '已完成'}, {text: '请求退款', value: '请求退款'},
        {text:'失效订单',value:'失效订单'},{text:'已退款',value:'已退款'}]"
        :filter-method="filterHandler">
    </el-table-column>
    <el-table-column
        align="right"
    >

      <template #default="scope">
        <el-button
            v-if="refundVisible"
            icon="el-icon-check"
            size="mini"
            type="success"
            @click="handleRefund(scope.$index, scope.row)">允许退款</el-button>
        <el-button
            icon="el-icon-delete"
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="block" style="margin-top:20px;">
    <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[5,7,10,15,20,50]"
                   :page-size="pageSize"
                   layout=" sizes, prev,pager, next, jumper"
                   :total="tableData.length">
    </el-pagination>
  </div>
</div>
</template>

<script>
import {get,post} from "@/utils/Network";
import QS from "qs"
import OrderItem from "@/components/OrderItem";

export default {
  name: "Order",
  components: {OrderItem},
  data(){
    return{
      tableData:[],
      currentPage: 1, // 当前页码
      total: '', // 总条数
      pageSize: 7, // 每页的数据条数,
      search:'',
      searchUser:'',
      searchStatu:'',
      refundVisible:false
    }
  },
  methods:{
    handleRefund(index, row){
      this.$confirm('同意退款?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true})
          .then(() => {
            post("/order/dealrefund", QS.stringify({orderId: row.orderId,agree:true} ))
                .then(res => {
                  post("/order/getallorder").then(res=>{
                    this.tableData=res.data.data
                    this.total=this.tableData.length
                    this.$message({
                      type: 'success',
                      message: '退款成功!'
                    });
                  })
                })
          }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退款'
        });
      });
    },
    handleDelete(index, row){
      this.$confirm('确定要删除该订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true})
          .then(() => {
            post("/order/delorder", QS.stringify({orderId: row.orderId} ))
                .then(res => {
                  post("/order/getallorder").then(res=>{
                    this.tableData=res.data.data
                    this.total=this.tableData.length
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
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.currentPage = 1;
      this.pageSize = val;
    },
    //当前页改变时触发 跳转其他页
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
    },
    echange(row,expandRow){
      post("/order/getorderitem",QS.stringify({orderId:row.orderId})).then(res=>{
        console.log(res.data.data);
      })
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    reset(){
      this.search='';
      this.searchUser=''
      this.refundVisible=false
      this.searchStatu=''
    },
    preRefund(){
      this.refundVisible=true
      this.searchStatu='请求退款'
    }
  },
  mounted() {
    post("/order/getallorder").then(res=>{
      this.tableData=res.data.data
      this.total=this.tableData.length
    })
  }
}
</script>

<style scoped>

</style>