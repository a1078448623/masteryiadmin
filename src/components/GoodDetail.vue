<template>
<div>
  <div style="border-bottom: #E4E7ED solid 1px;padding-bottom: 10px">
  <el-button type="primary" icon="el-icon-arrow-left" @click="senMsg">返回</el-button>
    <el-button type="success" icon="el-icon-plus" style="margin-left: 50px" @click="addSpecs">添加新规格</el-button>
    <span style="color: #606266;margin-left: 50px;font-size: 28px;float: right;margin-right: 100px">{{good.goodsName}}</span>
  </div>
  <el-table
      :data="tableData.filter(data => !search || getSpec(data.specDetail).includes(search)).slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100%;font-size: 16px " @selection-change="handleSelectionChange">

    <el-table-column
        label="ID"
        prop="id"
        width="80">
    </el-table-column>
    <el-table-column
        label="规格"
        prop="specDetail"
        width="250">
      <template #default="scope">

        <span >{{ getSpec(scope.row.specDetail) }}</span>
      </template>
    </el-table-column>

    <el-table-column
        label="库存"
        prop="stock"
        width="250">
      <template #default="scope">
        <div  style="height: 50px;line-height: 50px" @click="changeStock(scope.row)">
          {{scope.row.stock}} <i class="el-icon-edit" style="margin-left: 10px"></i>
        </div>
      </template>
    </el-table-column>

    <el-table-column
        label="价格"
        prop="price"
        width="250">
      <template #default="scope" >
        <div style="height: 50px;line-height: 50px" @click="changePrice(scope.row)">
          {{scope.row.price}} <i class="el-icon-edit" style="margin-left: 10px"></i>
        </div>
      </template>
    </el-table-column>
    <el-table-column
        label="图片"
        width="250">
      <template #default="scope">
        <img v-if="scope.row.specImg===null||scope.row.specImg==='null'" :src="defaultUrl" alt="" style="height: 50px;width: 50px;">
        <img v-else :src="scope.row.specImg" alt="" style="height: 50px;width: 50px;">
        <el-upload
            class="avatar-uploader"
            :action="baseUrl+'/image/upspecload/'+scope.row.id"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            style="float:right;margin-right: 150px;margin-top: 20px"
        >
          <i class="el-icon-plus avatar-uploader-icon" style="float:right;font-size: 19px"></i>
        </el-upload>
      </template>
    </el-table-column>
    <el-table-column
        align="right"
    >
      <template #header>
        <el-input
            v-model="search"
            size="mini"
            placeholder="输入规格进行搜索"/>
      </template>

      <template #default="scope">

        <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="block" style="margin-top:15px;position:fixed;bottom: 7vh;right: 40vw">
    <el-pagination align='center' @size-change="handleSizeChange" @current-change="handleCurrentChange"
                   :current-page="currentPage"
                   :page-sizes="[5,8,10,15,20,50]"
                   :page-size="pageSize"
                   layout=" sizes, prev,pager, next, jumper"
                   :total="tableData.length">
    </el-pagination>
  </div>
  <el-dialog title="修改价格" v-model="priceVisible" width="400px">
    <el-form>
      <el-form-item label="修改价格" :label-width="formLabelWidth">
        <el-input v-model="currPrice" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="priceVisible = false">取 消</el-button>
      <el-button type="primary" @click="changePriceConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>
  <el-dialog title="修改库存" v-model="stockVisible" width="400px">
    <el-form>
      <el-form-item label="修改库存" :label-width="formLabelWidth">
        <el-input v-model="currStock" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="stockVisible = false">取 消</el-button>
      <el-button type="primary" @click="changeStockConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>

  <el-dialog title="增加规格" v-model="specsVisible" width="400px">
    <el-form>
      <el-form-item label="选择规格" :label-width="formLabelWidth">
        <el-select v-model="specses" placeholder="请选择" multiple :multiple-limit="limitLen">
          <el-option-group
              v-for="group in options"
              :key="group.label"
              :label="group.label" multiple-limit="1">
            <el-option
                v-for="item in group.options"
                :key="item.value"
                :label="item.label"
                :value="item.value" >
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="库存量" :label-width="formLabelWidth">
        <el-input v-model="newStock" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="价格" :label-width="formLabelWidth">
        <el-input v-model="newPrice" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="specsVisible = false">取 消</el-button>
      <el-button type="primary" @click="addSpecsConfirm">确 定</el-button>
    </span>
    </template>
  </el-dialog>

</div>
</template>

<script>
import {get,post} from "@/utils/Network";
import QS from "qs"
export default {
  name: "GoodDetail",
  data(){
    return{
      specs:'',
      tableData:[],
      currentPage: 1, // 当前页码
      total: '', // 总条数
      pageSize: 8, // 每页的数据条数,
      multipleSelection: [],
      priceVisible:false,
      currPrice:'',
      stockVisible:false,
      currStock:'',
      currId:'',
      search:'',
      specsVisible:false,
      attr_keys:'',
      attr_values:'',
      options:[],
      options_value:'',
      newStock:'',
      newPrice:'',
      specses:'',
      formLabelWidth:'120px',
      limitLen:'',
      baseUrl:"http://localhost:8081",
      defaultUrl:'http://qw7r9ly4i.hb-bkt.clouddn.com/huawei.jpg',
      showDefault:true,
      goodUrl:''
    }
  },
  props:{
    good:{
      type:Object
    }
  },
  computed:{

  },
  methods:{
    handleAvatarSuccess(res, file) {
      let ids=[]
      ids.push(this.good.goodsId)
      if(ids.length>0){
        post("/goods/getallgoodspecs",QS.stringify({goods_id:ids},{indices:false}))
            .then(res=>{
              this.specs=res.data.data[0]
              this.tableData=this.specs
              this.total=this.specs.length
            })
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
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
    senMsg(){
      this.$emit('closeDetail','true')
    },
    handleDelete(index, row){
      this.$confirm('确定要删除该规格的商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true}).then(()=>{
        post("/goods/deletespecs",QS.stringify({goodSpecsId:row.id})).then(res=>{
          let ids=[]
          ids.push(this.good.goodsId)
          if(ids.length>0){
            post("/goods/getallgoodspecs",QS.stringify({goods_id:ids},{indices:false}))
                .then(res=>{
                  this.specs=res.data.data[0]
                  this.tableData=this.specs
                  this.total=this.specs.length
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                })
          }
        })
      }).catch(()=>{
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      })

    },
    changePrice(row){
      this.currPrice=row.price
      this.priceVisible=true
      this.currId=row.id
    },
    changeStock(row){
      this.currStock=row.stock
      this.currId=row.id
      this.stockVisible=true
    },
    changePriceConfirm(){
      post("/goods/changeprice",QS.stringify({newPrice:this.currPrice,goodSpecsId:this.currId}))
      .then(res=>{
        let ids=[]
        ids.push(this.good.goodsId)
        if(ids.length>0){
          post("/goods/getallgoodspecs",QS.stringify({goods_id:ids},{indices:false}))
              .then(res=>{
                this.specs=res.data.data[0]
                this.tableData=this.specs
                this.total=this.specs.length
                this.$message({
                  type: 'success',
                  message: '修改成功!'
                });
                this.priceVisible=false
              })
        }

      })
    },
    changeStockConfirm(){
      post("/goods/changstock",QS.stringify({newStock:this.currStock,goodSpecsId:this.currId}))
          .then(res=>{
            let ids=[]
            ids.push(this.good.goodsId)
            if(ids.length>0){
              post("/goods/getallgoodspecs",QS.stringify({goods_id:ids},{indices:false}))
                  .then(res=>{
                    this.specs=res.data.data[0]
                    this.tableData=this.specs
                    this.total=this.specs.length
                    this.$message({
                      type: 'success',
                      message: '修改成功!'
                    });
                    this.stockVisible=false
                  })
            }
          })
    },
    handleSelectionChange(){
      console.log("a");
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
    addSpecs(){

        post("/goods/goodTest",QS.stringify({good_id:this.good.goodsId}))
            .then(res=>{
              this.options=[]
              let data=res.data.data
              let keys=[]
              let temp=[]

              for(let i in data){
                keys.push(data[i][0].attrKeyId)
              }
              post("/goods/valuesByKey",QS.stringify({key_id:keys},{indices:false})).then(res=>{

                let values=res.data.data
                console.log(values);
                for(let j in values){
                  for(let k in values[j]){
                    temp.push({value:values[j][k].attrKeyId+":"+values[j][k].id,label:values[j][k].valueName})
                  }
                  this.options.push({label:values[j][0].keyName,options:temp})
                  temp=[]
                  // temp.push({value:values[j].attrKeyId+":"+values[j].id,label:values[j].valueName})
                }
              })
                // console.log(data[i][0].attrKeyId);
              this.limitLen=keys.length
              // console.log(this.options);
              console.log(this.limitLen)
              this.specsVisible=true
              //console.log(this.good);
            })


    },
    addSpecsConfirm(){
      let keys=[],values=[]
      if(this.newPrice===''||this.newStock===''||this.specses.length===0){
        this.$message({
          type: 'warning',
          message: '请填写完整'
        });
        return
      }
      if(this.limitLen>this.specses.length){
        this.$message({
          type: 'warning',
          message: '请选择完整的规格'
        });
        return
      }
      for(let i in this.specses){
        if(keys.indexOf(this.specses[i].split(":")[0])!==-1){
          this.$message({
            type: 'warning',
            message: '所选规格重复'
          });
          return;
        }
        else {
          keys.push(this.specses[i].split(":")[0])
          values.push(this.specses[i].split(":")[1])
        }

      }
      if(values.length>0){
        post("/goods/addspec",QS.stringify(
            {goodsId:this.good.goodsId,specs:values,
              stock:this.newStock,price:this.newPrice},{indices:false}))
        .then(res=>{
          if(res.data.code===100){
            this.$message({
              type: 'warning',
              message: '该规格商品已存在'
            });
          }
          else {
            let ids=[]
            ids.push(this.good.goodsId)
            if(ids.length>0){
              post("/goods/getallgoodspecs",QS.stringify({goods_id:ids},{indices:false}))
                  .then(res=>{
                    this.specs=res.data.data[0]
                    this.tableData=this.specs
                    this.total=this.specs.length
                    this.$message({
                      type: 'success',
                      message: '添加成功!'
                    });
                    this.specsVisible=false
                  })
            }

          }
        })
      }
    }
  },
  mounted() {
    let ids=[]
    ids.push(this.good.goodsId)
    if(ids.length>0){
      post("/goods/getallgoodspecs",QS.stringify({goods_id:ids},{indices:false}))
          .then(res=>{
            this.specs=res.data.data[0]
            this.tableData=this.specs
            this.total=this.specs.length
          })
    }

  }
}
</script>

<style scoped>

</style>