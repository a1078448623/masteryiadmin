<template>
<div>
  <el-button type="danger" size="mini" style=" height: 30px" @click="delPatch" >批量删除</el-button>
  <el-button size="mini" style=" height: 30px" @click="dialogFormVisible=true">新建用户</el-button>
  <el-table
      :data="tableData.filter(data => !search || data.userName.toLowerCase().includes(search.toLowerCase())).slice((currentPage-1)*pageSize,currentPage*pageSize)"
      style="width: 100% ;font-size: 14px" @selection-change="handleSelectionChange">
    <el-table-column
        ref="multipleTable"
        type="selection"
        width="80"
        >

    </el-table-column>
    <el-table-column
        label="头像"
        width="100">
      <template #default="scope">

        <el-upload
            class="avatar-uploader"
            :action="getUrl+'/image/upuserload/'+scope.row.userId"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
        >
          <el-avatar v-if="scope.row.userImgUrl===null||scope.row.userImgUrl==='null'||scope.row.userImgUrl===''" :src="defaultUrl" alt="" style="height: 42px;width: 42px;"></el-avatar>

          <el-avatar v-else :src="scope.row.userImgUrl" alt="" style="height: 42px;width: 42px;"></el-avatar>
        </el-upload>
      </template>
    </el-table-column>
    <el-table-column
        label="账号"
        prop="userName"
        width="220">
      <template #default="scope">
        <div style="height: 40px;line-height: 40px">
        <i class="el-icon-user"></i>
        <span style="margin-left: 10px;height: 50px" >{{ scope.row.userName }}</span>
        </div>
      </template>
    </el-table-column>

    <el-table-column
        label="密码"
        prop="userPwd"
        width="220">
      <template #default="scope">
        <i class="el-icon-lock"></i>
        <span style="margin-left: 10px">{{ scope.row.userPwd }}</span>
      </template>
    </el-table-column>

    <el-table-column
        label="手机号"
        prop="phoneNum"
        width="210">
      <template #default="scope">
        <i class="el-icon-mobile-phone"></i>

        <span style="margin-left: 10px">{{ scope.row.phoneNum }}</span>
      </template>
    </el-table-column>
    <el-table-column
        label="地址"
        prop="address"
        width="210">
      <template #default="scope">
        <i class="el-icon-map-location"></i>
        <span style="margin-left: 10px">{{ scope.row.address }}</span>
      </template>
    </el-table-column>
    <el-table-column
        align="right"
        >
      <template #header>
        <el-input
            v-model="search"
            size="mini"
            placeholder="输入用户名进行搜索"/>
      </template>

      <template #default="scope">
        <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)" style="margin-right: 10px">编辑</el-button>
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
                   :page-sizes="[5,7,10,15,20,50]"
                   :page-size="pageSize"
                   layout=" total,sizes, prev,pager, next, jumper"
                   :total="tableData.length">
    </el-pagination>
  </div>
  <el-dialog title="新增用户" v-model="dialogFormVisible" width="500px">
    <el-form :model="newUsr">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="newUsr.userName" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="newUsr.userPwd" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" :label-width="formLabelWidth">
        <el-input v-model="newUsr.phoneNum" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="地址" :label-width="formLabelWidth">
        <el-input v-model="newUsr.address" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
    </template>
  </el-dialog>
  <el-dialog title="修改用户信息" v-model="changeVisible" width="500px">
    <el-form :model="changeUsr">
      <el-form-item label="用户名" :label-width="formLabelWidth">
        <el-input v-model="changeUsr.userName" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth">
        <el-input v-model="changeUsr.userPwd" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="电话号码" :label-width="formLabelWidth">
        <el-input v-model="changeUsr.phoneNum" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
      <el-form-item label="地址" :label-width="formLabelWidth">
        <el-input v-model="changeUsr.address" autocomplete="off" style="width: 200px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
    <span class="dialog-footer">
      <el-button @click="changeVisible = false">取 消</el-button>
      <el-button type="primary" @click="changeUser">确 定</el-button>
    </span>
    </template>
  </el-dialog>
</div>
</template>

<script>
import {get,post} from "@/utils/Network";
import QS from "qs"
const {getBaseUrl} = require('@/utils/Network');
export default {
  name: "User",
  data() {
    return {
      // tableData: [{userId:1,userName:"1111",userPwd:":1111",phoneNum:123,address:"assa"}]
      tableData:[],
      search:'',
      currentPage: 1, // 当前页码
      total: '', // 总条数
      pageSize: 6, // 每页的数据条数,
      multipleSelection: [],
      len:0,
      dialogFormVisible:false,
      changeVisible:false,
      newUsr:{
        userName:'',
        userPwd:'',
        phoneNum:'',
        address:'',
      },
      changeUsr:{
        userId:'',
        userName:'',
        userPwd:'',
        phoneNum:'',
        address:'',
      },
      formLabelWidth: '120px',
      defaultUrl:'http://qw7r9ly4i.hb-bkt.clouddn.com/defaultImg.jpg'
    }
  },
  computed:{
    getUrl(){
      return getBaseUrl()
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      post("/user/getalluser","a").then(res=>{

        this.total=res.data.data.length
        this.tableData=res.data.data
      })
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    handleEdit(index, row) {
      this.changeUsr.userId=row.userId
      this.changeUsr.userName=row.userName
      this.changeUsr.phoneNum=row.phoneNum
      this.changeUsr.address=row.address
      this.changeUsr.userPwd=row.userPwd
      this.changeVisible=true
    },
    handleDelete(index, row) {
      this.$confirm('确定要删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true})
          .then(() => {
            post("/user/deleteuser", QS.stringify({userIds: row.userId}, {indices: false}))
                .then(res => {
                  post("/user/getalluser", "a").then(res => {
                    this.total = res.data.data.length
                    this.tableData = res.data.data
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
    delPatch(){
      if(this.multipleSelection.length===0){
        this.$message({
          type: 'info',
          message: '未选择用户'
        });
      }
      else
      {
        this.$confirm('此操作将永久删除这些用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          let userIds = []
          for (let i in this.multipleSelection) {
            userIds.push(this.multipleSelection[i].userId)
          }
          post("/user/deleteuser", QS.stringify({userIds: userIds}, {indices: false}))
              .then(res => {
                post("/user/getalluser", "a").then(res => {

                  this.total = res.data.data.length
                  this.tableData = res.data.data
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                })
                console.log(res);
              })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      // this.len=val.length`
    },
    addUser(){

      post("/user/adduser",QS.stringify(
          {userName:this.newUsr.userName,userPwd:this.newUsr.userPwd,userImgUrl:''
            ,address:this.newUsr.address,phoneNum:this.newUsr.phoneNum}))
      .then(res=>{
        post("/user/getalluser", "a").then(res => {
          this.total = res.data.data.length
          this.tableData = res.data.data
          this.$message({
            type: 'success',
            message: '添加成功!'
          });
        })
      }).catch(r=>{
        this.$message({
          type: 'error',
          message: '添加失败!'
        });
      })
      this.dialogFormVisible = false
    },
    changeUser(){
      post("/user/changeuser",QS.stringify(
          {userId:this.changeUsr.userId,userName:this.changeUsr.userName,userPwd:this.changeUsr.userPwd,userImgUrl:''
            ,address:this.changeUsr.address,phoneNum:this.changeUsr.phoneNum,lowPrice:12}))
          .then(res=>{
            post("/user/getalluser", "a").then(res => {
              this.total = res.data.data.length
              this.tableData = res.data.data
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
            })
          }).catch(r=>{
        this.$message({
          type: 'error',
          message: '修改失败!'
        });
      })
      this.changeVisible = false
    }
  },
  mounted() {

    post("/user/getalluser","a").then(res=>{

      this.total=res.data.data.length
       this.tableData=res.data.data
    })
  }
}
</script>

<style scoped>
.el-input__inner{
  height: 33px !important;
}
</style>