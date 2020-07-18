<template>
  <div class="order">
    <el-form :model="queryParam" ref="queryForm" :inline="true" label-width="80px" class="ele-form">
      <div class="clearFix formContain">
        <div class="rowFlex">
          <div class="formItem">
            <el-form-item label="售后编号:" prop="number">
              <el-input
                v-model="queryParam.afterSaleNumber"
                placeholder="请输入"
                clearable
                size="small"
              />
            </el-form-item>
          </div>

          <div class="formItem">
            <el-form-item label="售后类型:">
              <el-select v-model="queryParam.type" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="dict in specValueList"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
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
              <el-input v-model="queryParam.memberId" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品名称:" prop="articleNo">
              <el-input v-model="queryParam.goodsName" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="买家手机:" prop="articleNo">
              <el-input v-model="queryParam.memberPhone" placeholder="请输入" clearable size="small" />
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
          <el-table :data="goodsList" v-loading="loading" :max-height="clieHeight">
            <el-table-column label="商品信息" align="center" :show-overflow-tooltip="true" width="230px">
              <template slot-scope="scope">
                <div class="list" :key="index" style="margin-top:20px">
                  <el-popover placement="right" title trigger="hover">
                    <img :src="scope.row.afterSaleGoodInfoVo.goodsImg" alt class="mainImg1" />
                    <img
                      slot="reference"
                      :src="scope.row.afterSaleGoodInfoVo.goodsImg"
                      style="width: 50px"
                    />
                  </el-popover>
                  <!-- <img :src="item.goodsImg" alt class="mainImg" /> -->
                  <div class="good">
                    <span>商品名称：{{scope.row.afterSaleGoodInfoVo.goodsName}}</span>
                    <div>
                      规格：
                      <span
                        v-for="(itemt,indexs) in scope.row.afterSaleGoodInfoVo.goodsSpec"
                        :key="indexs"
                      >{{itemt.specValueName}},</span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              label="售后编号"
              align="center"
              prop="afterSaleNumber"
              :show-overflow-tooltip="true"
              width="200px"
            />
            <el-table-column
              label="订单编号"
              align="center"
              prop="afterSaleOrderVo.orderNumber"
              :show-overflow-tooltip="true"
              width="250px"
            />

            <el-table-column
              label="数量"
              align="center"
              prop="applyNum"
              :show-overflow-tooltip="true"
              width="50px"
            />
            <el-table-column
              label="买家ID"
              align="center"
              prop="createUser"
              :show-overflow-tooltip="true"
              width="50px"
            />
            <el-table-column
              label="买家手机号"
              align="center"
              prop="mobilephone"
              :show-overflow-tooltip="true"
              width="150px"
            />

            <el-table-column
              label="问题描述"
              align="center"
              prop="articleNo"
              :show-overflow-tooltip="true"
                width="300px"
            >
              <template slot-scope="scope">
                <span style="display:block">{{scope.row.applyReason}}</span>
                <img
                  :src="item"
                  alt
                  v-for="(item,index) in scope.row.voucher.split(',') "
                  :key="index"
                  style="width:50px"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="实际退款金额"
              align="center"
              prop="goodsPriceCount"
              :show-overflow-tooltip="true"
              width="50px"
            />
            <el-table-column label="售后类型" align="center" :show-overflow-tooltip="true"  width="100px">
              <template slot-scope="scope">
                <span v-if="scope.row.type=1">退款退货</span>
                <span v-else>退款</span>
              </template>
            </el-table-column>

            <el-table-column
              label="状态"
              align="center"
              prop="price"
              :show-overflow-tooltip="true"
         
                width="150px"
            >
              <template slot-scope="scope">
                <div class="good">
                  <span>{{scope.row.newestStatusDesc}}</span>

                  <span style="color:#409EFF;cursor:pointer" @click="detail(scope.row)">订单详情</span>
                </div>
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
import { getSales } from "../../../api/afterSales/index";
import moment from "moment";
export default {
  data() {
    return {
      specValueList: [
        {
          name: "退款退货",
          id: 1
        },
        {
          name: "退款",
          id: 2
        }
      ],
      queryParam: {
        moduleType: 1,
        afterSaleNumber: undefined,
        type: undefined,
        goodsName: undefined,
        date: undefined,
        memberId: undefined,
        memberPhone: undefined,
        orderNumber: undefined,
        statusGroup: undefined,
        pageNum: 1,
        pageSize: 20,
        endTime: undefined,
        startTime: undefined,
        storeId: Number(localStorage.getItem("storeId"))
      },
      tree: [
        {
          name: "全部",
          id: "0"
        },
        {
          name: "门店待处理",
          id: "1"
        },
        {
          name: "门店已处理",
          id: "2"
        },
        {
          name: "平台待处理",
          id: "3"
        },
        {
          name: "平台已处理",
          id: "4"
        },

        {
          name: "门店待收货",
          id: "5"
        },
        {
          name: "退款中",
          id: "6"
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
      hidden: true,
      goodDetail: ""
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
      this.queryParam.endTime = moment(this.queryParam.date[1]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      this.queryParam.startTime = moment(this.queryParam.date[0]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
    },
    handleClick(tab, event) {
      console.log(tab.name, event);
      this.queryParam.statusGroup = Number(tab.name);
      this.getGoodsList();
    },
    getGoodsList() {
      getSales(this.queryParam).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.goodsList = res.data.list;

          var arr = [];
          for (let i in this.goodsList) {
            this.goodsList[i].afterSaleGoodInfoVo.goodsSpec = JSON.parse(
              this.goodsList[i].afterSaleGoodInfoVo.goodsSpec
            );
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
        moduleType: 1,
        afterSaleNumber: undefined,
        type: undefined,
        goodsName: undefined,
        date: undefined,
        memberId: undefined,
        memberPhone: undefined,
        orderNumber: undefined,
        statusGroup: undefined,
        pageNum: 1,
        pageSize: 20,
        endTime: undefined,
        startTime: undefined,
        storeId: Number(localStorage.getItem("storeId"))
      };
    },
    handleQuery() {
      this.getGoodsList();
    },

    detail(e) {
      console.log(e);
      this.$router.push(
        "../afterSales/salesDetail?id=" + e.id + "&status=" + e.newestStatusDesc
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.el-range-editor.el-input__inner{
  padding: 0 15px !important;
}
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
</style>