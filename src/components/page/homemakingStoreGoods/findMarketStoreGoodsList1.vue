<template>
  <div class="order">
    <el-form :model="queryParam" ref="queryForm" :inline="true" label-width="80px" class="ele-form">
      <div class="clearFix formContain">
        <div class="rowFlex">
          <div class="formItem">
            <el-form-item label="订单编号:" prop="number">
              <el-input v-model="queryParam.orderNumber" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>

          <div class="formItem">
            <el-form-item label="起止时间:">
              <el-date-picker
                v-model="queryParam.date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="changeDate"
              ></el-date-picker>
            </el-form-item>
          </div>
        </div>
        <div class="rowFlex">
          <div class="formItem">
            <el-form-item label="买家ID:" prop="articleNo">
              <el-input v-model="queryParam.createUserId" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>

          <div class="formItem">
            <el-form-item label="买家手机:" prop="articleNo">
              <el-input
                v-model="queryParam.createUserPhone"
                placeholder="请输入"
                clearable
                size="small"
              />
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>

    <div class="ele-table">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="item.name" :name="item.id" v-for="(item,index) in tree" :key="index">
          <el-table
            :data="goodsList"
            v-loading="loading"
            :max-height="clieHeight"
            style="width: 100%"
          >

            <el-table-column
              label="商品信息"
              align="center"
              :show-overflow-tooltip="true"
        
              width="280px"
            >
              <template slot-scope="scope">
                <div
                  class="list"
                  v-for="(item,index) in scope.row.orderListGoodsList"
                  :key="index"
                  style="margin-top:20px"
                >
                  <el-popover placement="right" title trigger="hover">
                    <img :src="item.goodsImg" alt class="mainImg1" />
                    <img
                      slot="reference"
                      :src="item.goodsImg"
                      :alt="scope.row.picture"
                      style="width: 50px"
                    />
                  </el-popover>
                  <!-- <img :src="item.goodsImg" alt class="mainImg" /> -->
                  <div class="good">
                    <span>商品名称：{{item.goodsName}}</span>
                    <div>
                      规格：
                      <span
                        v-for="(itemt,indexs) in item.spc"
                        :key="indexs"
                      >{{itemt.specValueName}},</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
  <el-table-column
              label="订单编号"
              align="center"
              prop="orderNumber"
              :show-overflow-tooltip="true"
              width="250px"
            />
            
            <el-table-column
              label="数量"
              align="center"
              prop="goodsNumber"
              :show-overflow-tooltip="true"
              width="100px"
            />
            <el-table-column
              label="总金额"
              align="center"
              prop="articleNo"
              :show-overflow-tooltip="true"
              width="200px"
            >
            

              <template slot-scope="scope">
                <div class="good">
                  <span>{{scope.row.orderPrice}}元</span>

                  <span>（包含服务费：{{scope.row.servicePrice}}元)</span>
                </div>
              </template>
            </el-table-column>
              <el-table-column
              label="买家ID"
              align="center"
              prop="createUserId"
              :show-overflow-tooltip="true"
              width="80px"
            />
               <el-table-column
              label="买家手机号"
              align="center"
              prop="createUserPhone"
              :show-overflow-tooltip="true"
              width="150px"
            />
            <el-table-column
              label="服务地址"
              align="center"
              prop="address"
              :show-overflow-tooltip="true"
              width="480px"
            >
              <template slot-scope="scope">
                <div class="good">
                  <span>联系人：{{scope.row.contactName}}</span>

                  <span>手机号：{{scope.row.createUserPhone}}</span>
                  <span>地址：{{scope.row.address }}</span>
                  <span>服务时间：{{scope.row.serviceTimeStart }}-{{scope.row.serviceTimeEnd }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="状态" align="center" prop="price" :show-overflow-tooltip="true" >>
              <template slot-scope="scope">
                <div class="good">
                  <span v-if="scope.row.status==1">待付款</span>
                  <span v-if="scope.row.status==2">待确认</span>
                  <span v-if="scope.row.status==3">已确认</span>
                  <span v-if="scope.row.status==4">已派工</span>
                  <span v-if="scope.row.status==6">已服务</span>

                  <span v-if="scope.row.status==5">进行中</span>
                  <span v-if="scope.row.status==7">已完成</span>
                  <span v-if="scope.row.status==8">已取消</span>
                  <span v-if="scope.row.status==801">退款申请中</span>
                  <span v-if="scope.row.status==802">退款中</span>
                  <span v-if="scope.row.status==803">已退款</span>
                  <span style="color:#409EFF;cursor:pointer" @click="detail(scope.row)">订单详情</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="操作" align="center" :show-overflow-tooltip="true" width="160px"   >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.status==2"
                  @click="srue(scope.row)"
                >确认订单</el-button>

                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.status==2 || scope.row.status==3"
                  slot="reference"
                  @click="cancel(scope.row)"
                >取消订单</el-button>
                <el-button
                  size="mini"
                  type="text"
                  v-if="scope.row.status==801"
                  slot="reference"
                  @click="agree(scope.row)"
                >同意退款</el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParam.pageNum"
            :limit.sync="queryParam.pageSize"
            @pagination="getGoodsList"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  getOrder,
  srueOrder,
  cancelOrder,
  agreeBack
} from "../../../api/homeMarkOrder/index";
import moment from "moment";
export default {
  data() {
    return {
      queryParam: {
           moduleType: 2,
        date: undefined,
        createUserId: undefined,
        createUserPhone: undefined,
        orderNumber: undefined,
        orderStatus: undefined,
        pageNum: 1,
        pageSize: 20,
        submitTimeEnd: undefined,
        submitTimeStart: undefined,
        storeId: Number(localStorage.getItem("storeId"))
      },
      tree: [
        {
          name: "全部",
          id: undefined
        },
        {
          name: "待付款",
          id: "1"
        },
        {
          name: "进行中",
          id: "5"
        },
        {
          name: "已完成",
          id: "7"
        },
        {
          name: "已取消",
          id: "8"
        }
      ],
      goodsList: [],
      total: 0,
      activeName: "0",
      loading: false,
      clieHeight: null,
      hidden: true
    };
  },
  created() {
    //   this.queryParam.orderStatus=Number(this.activeName)
    this.getGoodsList();
  },

  watch: {
    "$store.state.storeValue": function() {
      //监听vuex中userName变化而改变header里面的值
      this.value = this.$store.state.storeValue;
      this.queryParam.storeId = this.value;
      this.getGoodsList();
      console.log(this.value);
    }
  },

  mounted() {
    this.clieHeight = window.innerHeight - 370;
  },
  methods: {
    changeDate() {
      this.queryParam.submitTimeEnd = moment(this.queryParam.date[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.queryParam.submitTimeStart = moment(this.queryParam.date[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    handleClick(tab, event) {
      console.log(tab.name, event);
      this.queryParam.orderStatus = Number(tab.name);
      this.getGoodsList();
    },
    getGoodsList() {
      getOrder(this.queryParam).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.goodsList = res.data.list;

          var arr = [];
          for (let i in this.goodsList) {
            for (let j in this.goodsList[i].orderListGoodsList) {
              this.goodsList[i].orderListGoodsList[j].spc = JSON.parse(
                this.goodsList[i].orderListGoodsList[j].goodsSpec
              );
            }
          }
          console.log(this.goodsList);
          this.total = res.data.total;
        } else {
          this.goodsList = [];
        }
      });
    },
    resetQuery() {
      this.queryParam = {
            moduleType: 2,
        date: undefined,
        createUserId: undefined,
        createUserPhone: undefined,
        orderNumber: undefined,
        orderStatus: undefined,
        pageNum: 1,
        pageSize: 20,
        submitTimeEnd: undefined,
        submitTimeStart: undefined,
        storeId: Number(localStorage.getItem("storeId"))
      };
    },
    handleQuery() {
      this.getGoodsList();
    },
    srue(e) {
      console.log(e);
      srueOrder({ orderId: e.orderId }).then(res => {
        console.log(res);
        if (res.code == "200") {
          this.$message("确认成功");
          this.getGoodsList();
        } else {
          this.msgError(res.message);
        }
      });
    },
    cancel(e) {
      const that = this;
      this.$confirm("是否确认取消订单吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return cancelOrder({ orderId: e.orderId }).then(res => {
            if (res.code === 200) {
              that.getGoodsList();
              that.msgSuccess("取消成功");
            } else {
              that.msgError(res.message);
            }
          });
        })
        .catch(function() {
          that.$message("已取消删除");
        });
    },
    agree(e) {
      const that = this;
      this.$confirm("是否确认同意退款吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return agreeBack({ orderId: e.orderId }).then(res => {
            if (res.code === 200) {
              that.getGoodsList();
              that.msgSuccess("退款成功");
            } else {
              that.msgError(res.message);
            }
          });
        })
        .catch(function() {
          that.$message("已取消");
        });
    },
    detail(e) {
      console.log(e);
      this.$router.push(
        "../order/homeMarkOrderDetail?id=" + e.orderId + "&status=" + Number(e.status)
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.el-dialog {
  width: 800px !important;
}
.ele-form {
  background-color: #fff;
  padding: 10px 20px 0px 20px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;
  .el-form-item {
    margin-bottom: 15px;
  }
  .bt-item {
    // position: absolute;
    text-align: right;
    // right: 10px;
  }
}
.mainImg {
  width: 50px;
}
.ele-table {
  background-color: #fff;
  min-height: 380px;
  padding-left: 15px;
  padding-right: 15px;
  .addShop {
    text-align: left;
    padding-top: 20px;
    margin-bottom: 20px;
  }
}
.tipImg {
  padding-right: 10px;
  position: absolute;
  left: 20px;
  top: 20px;
}
.rowFlex {
  position: relative;
  clear: both;
  min-width: 1100px;
  .formItem {
    float: left;
    // display: inline-block;
  }
}
.formContain {
  overflow-x: auto;
}
.clearFix::after {
  content: "";
  display: block;
  height: 0px;
  clear: both;
  visibility: hidden;
}
.good {
  display: inline-block;
}
.good > span {
  display: block;
}
.mainImg1 {
  width: 130px;
}
span {
  text-align: left;
}
</style>