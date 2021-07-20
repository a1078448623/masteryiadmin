<template>
  <div style="overflow: auto">
    <div style="width: 33vw;position:relative;margin-top: 15px">
    <el-card class="box-card" style="width: 15vw;height: 130px">
      <div style="color: #606266">注册用户</div>
      <div style="color:#303133;font-size: 28px;margin-top: 10px;width: 100%;text-align: center">{{basicData.users}}</div>
    </el-card>
    <el-card class="box-card" style="width: 15vw;position: absolute;top: 0;right: 10px;height: 130px">
      <div style="color: #606266">成交金额</div>
      <div style="color:#303133;font-size: 28px;margin-top: 10px;width: 100%;text-align: center"><span class="iconfont icon-newbimoney" style="font-size: 28px"></span>{{basicData.money}}</div>
    </el-card>
    </div>
    <div style="width: 33vw;position:relative;margin-top: 25px">
    <el-card class="box-card" style="width: 15vw;height: 130px">
      <div style="color: #606266">订单量</div>
      <div style="color:#303133;font-size: 28px;margin-top: 10px;width: 100%;text-align: center">{{basicData.orders}}</div>
    </el-card>
    <el-card class="box-card" style="width: 15vw;position: absolute;top: 0;right: 10px;height: 130px">
      <div style="color: #606266">销售量</div>
      <div style="color:#303133;font-size: 28px;margin-top: 10px;width: 100%;text-align: center">{{basicData.sales}}</div>
    </el-card>
    </div>
    <el-card class="box-card" style="width: 51vw;position:absolute;top: 30px;right: 15px;height: 285px">

      <div style="color:#303133;font-size: 28px;margin-top: 10px;width: 100%;text-align: center;height: 275px" ref="order_chart"></div>
    </el-card>
    <div style="width: 100%;height: 400px">
    <el-card class="box-card" style="width: 60vw;height: 350px;margin-top: 25px;float:left;">

      <div style="color:#303133;font-size: 28px;margin-top: 10px;width: 100%;text-align: center;height: 340px" ref="month_chart"></div>
    </el-card>
    <el-card class="box-card" style="width: 23vw;height: 350px;margin-top: 25px;float: right">

      <div style="color:#303133;font-size: 28px;margin-top: 10px;width: 100%;text-align: center;" >
        <div style="color:#303133;font-size: 18px;text-align: left;margin-bottom: 15px" ><b>商品销量TOP10</b></div>
        <el-carousel trigger="click" height="320px" ref="carous" v-if="show_img" indicator-position="none">
          <el-carousel-item v-for="(item,index) in topGood" :key="item" >
            <img v-if="item.goodsCoverUrl==='null'||item.goodsCoverUrl===null" src="../assets/huawei.jpg" alt="" style="height: 150px;width: 70%">
            <img v-else :src="item.goodsCoverUrl" alt="" style="height: 150px;width: 70%">
            <div style="margin-top: 10px"><b>{{ item.goodsName }}</b></div>
            <div style="font-size: 20px;margin-top: 15px;text-align: right">
              总销量:{{item.sellNum}}
              <svg class="icon" aria-hidden="true" >
              <use :xlink:href="getIcon(index)"></use>
            </svg></div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-card>
    </div>
    <div style="width: 100%;height: 350px">
      <el-card class="box-card" style="width: 26vw;height: 350px;float: left;">
        <div style="color:#303133;margin-top: 10px;width: 100%;text-align: center;height: 330px">
          <el-calendar v-model="value" style="height: 300px;width: 100%;font-size: 15px;">
        </el-calendar></div>
      </el-card>
      <el-card class="box-card" style="width: 28vw;height: 350px;float:left;margin-left: 1.75vw">
        <div style="color:#303133;font-size: 28px;margin-top: 10px;width: 100%;text-align: center;height: 340px" ref="user_chart">

        </div>
      </el-card>
      <el-card class="box-card" style="width: 27vw;height: 350px;float:right;">
        <div style="color:#303133;font-size: 28px;margin-top: 10px;width: 100%;text-align: center;height: 320px" ref="cate_chart"></div>
      </el-card>
    </div>
<!--    <div ref="chart" style="width: 400px;height: 500px"></div>-->
  </div>
</template>

<script>
import * as echarts from 'echarts'
import {get} from "@/utils/Network";

export default {
  name: 'Home',
  data(){
    return{
      basicData:{
        users:'',
        visitors:'',
        orders:'',
        sales:'',
        money:'',

      },
      topGood:'',
      show_img:false,
      value:new Date()
    }
  },
  methods:{
    initBasicData(users,visitors,orders,sales,money){
        this.basicData.users=users;this.basicData.visitors=visitors;this.basicData.orders=orders;
        this.basicData.sales=sales;this.basicData.money=money
    },
    getIcon(index){
      switch (index) {
        case 0:return "#icon-No"
        case 1:return "#icon-NO_"
        case 2:return "#icon-NO3"
        case 3:return "#icon-icon_No4"
        case 4:return "#icon-icon_No5"
        case 5:return "#icon-icon_No6"
        case 6:return "#icon-icon_No7"
        case 7:return "#icon-icon_No8"
        case 8:return "#icon-icon_No9"
        case 9:return "#icon-icon_No10"

      }
    }
  },
  created() {
    get("/showdata/basicdata").then(res=>{
      let r=res.data.data,flag=0
      this.initBasicData(r.users,r.visitors,r.orders,r.sales,r.earnings)
      flag=1
      if(flag===1){
        get("/showdata/ordercount").then(res1=>{
          let data=res1.data.data,flag=0
          let xdata=[],ydata1=[],ydata2=[]
          for(let i in data){
            xdata.push(data[i].f_date)
            ydata1.push(data[i].count)
            ydata2.push(data[i].totalMoney)
          }
          let mychart=echarts.init(this.$refs.order_chart)
          mychart.setOption({
            title: {
              text: '近7日订单统计',
              top:0
            },
            legend:{
              show:'true',
              right:80
            },
            tooltip: {},
            xAxis: {
              data: xdata
            },
            yAxis: [
              {
                name:'数量',
                type:'value'
              },
              {name:'成交金额',
                type:'value'}

            ],
            series: [{
              name: '数量',
              type: 'bar',
              lineStyle:{
                width:4
              },

              symbolSize:9,
              color:'#5470c6',
              data: ydata1,
              seriesLayoutBy: 'row',
              emphasis: {focus: 'series'},
              yAxisIndex: 0,
              smooth:true
            },
              {
                name: '金额',
                type: 'bar',
                lineStyle:{
                  width:4
                },
                symbolSize:9,
                color: "#91cc75",
                data: ydata2,
                yAxisIndex: 1,
                seriesLayoutBy: 'row',
                emphasis: {focus: 'series'},

              }]})
          flag=1;
          if(flag===1){
            get("/showdata/monthdata").then(res=>{
              let dataMonth=res.data.data,mxdata=[],mydata1=[],mydata2=[],flag2=0

              for(let i in dataMonth){

                mxdata.push(dataMonth[i].createMonth)
                mydata1.push(dataMonth[i].count)
                mydata2.push(dataMonth[i].sales)
              }
              mxdata.reverse()
              mydata1.reverse()
              mydata2.reverse()
              let mychart2=echarts.init(this.$refs.month_chart)
              mychart2.setOption({
                title: {
                  text: '近一年销量与订单',
                  top:0
                },
                legend:{
                  show:'true',
                  right:80
                },
                tooltip: {},
                xAxis: {
                  data: mxdata
                },
                yAxis: [
                  {
                    name:'订单数量',
                    type:'value'
                  },
                  {name:'销售量',
                    type:'value'}

                ],
                series: [{
                  name: '数量',
                  type: 'line',
                  lineStyle:{
                    width:4
                  },

                  symbolSize:9,
                  color:'RGB(164,224,247)',
                  data: mydata1,
                  seriesLayoutBy: 'row',
                  emphasis: {focus: 'series'},
                  yAxisIndex: 0,
                  areaStyle: {},
                  smooth:true
                },
                  {
                    name: '销量',
                    type: 'line',
                    lineStyle:{
                      width:4
                    },
                    symbolSize:9,
                    color: "RGB(255,230,143)",
                    data: mydata2,
                    yAxisIndex: 1,
                    seriesLayoutBy: 'row',
                    emphasis: {focus: 'series'},
                    smooth:true,
                    areaStyle: {}
                  }]
              })
              flag2=1;
              if(flag2===1){
                get("/showdata/topgoods").then(res=>{
                  let flag3=0
                  this.topGood=res.data.data
                  this.show_img=true
                  flag3=1
                  if(flag3===1){
                    get("/showdata/userdata").then(res=>{
                      let data3=res.data.data,uxdata=[],uydata=[],flag4=0
                      for(let i in data3){
                        uxdata.push(data3[i].f_time)
                        uydata.push(data3[i].count)
                      }
                      let mychart3=echarts.init(this.$refs.user_chart)
                      mychart3.setOption({
                        title: {
                          text: '近7天新增用户',
                          top:0
                        },
                        legend:{
                          show:'true',
                          right:80
                        },
                        tooltip: {},
                        xAxis: {
                          data: uxdata
                        },
                        yAxis: [
                          {
                            name:'新增用户数',
                            type:'value'
                          }

                        ],
                        series: [{
                          name: '人数',
                          type: 'line',
                          lineStyle:{
                            width:4
                          },

                          symbolSize:9,
                          color:'#FF6666',
                          data: uydata,
                          seriesLayoutBy: 'row',
                          emphasis: {focus: 'series'},
                          yAxisIndex: 0,

                          smooth:true
                        }]
                      })
                      flag4=1
                      if(flag4===1){
                        get("/showdata/catedata").then(res=>{
                          let data4=res.data.data,catdata=[],saledata=[],flag5=0
                          for(let i in data4){
                            catdata.push(data4[i].categoryName)
                            saledata.push(data4[i].sales)
                          }
                          let mychart4=echarts.init(this.$refs.cate_chart)
                          mychart4.setOption({
                            title: {
                              text: '分类销量(前5)',
                            },
                            tooltip: {
                              trigger: 'axis',
                              axisPointer: {
                                type: 'shadow'
                              }
                            },
                            legend: {
                              data: ['销量']
                            },
                            grid: {
                              left: '3%',
                              right: '4%',
                              bottom: '3%',
                              containLabel: true
                            },
                            xAxis: {
                              type: 'value',
                              boundaryGap: [0, 0.01]
                            },
                            yAxis: {
                              type: 'category',
                              data:catdata
                            },
                            series: [
                              {
                                name: '销量',
                                type: 'bar',
                                data: saledata
                              }

                            ]
                          })
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })



  }
}
</script>
<style>
.icon {
  width: 1.2em;
  height: 1.2em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  font-size: 20px;
}
.el-calendar-table .el-calendar-day {
  height: 30px!important;
}
.el-calendar__header{
  padding: 6px 2px !important;
}
</style>
