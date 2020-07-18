<template>
  <div class="order">
    <div class="top">
      <span>订单详情</span>
    </div>
    <div
      class="step"
      v-if="status==1 || status==2||status==3 || status==4||status==5 || status==6||status==7"
    >
  
    <ul class="steps">
      <li
        v-for="(item,index) in statusList1"
        :key="item+index"
        :class="{'active': item.isLight==0}"
      >{{item.statusDesc}},{{item.time}}</li>
    </ul>

    </div>

    <div class="detail">
      <div class="code">
        <span>订单编号：{{orderDetail.orderNumber}}</span>
        <el-popover placement="right" width="300" trigger="click" v-model="visibal">
          <el-form ref="numberValidateForm" class="demo-ruleForm">
            <el-form-item
              :rules="[
                      { required: true, message: '备注不能为空', trigger: 'blur'},
                    ]"
            >
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入备注"
                v-model="remark"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitRemark">确定</el-button>
              <el-button @click="calcel">取消</el-button>
            </el-form-item>
          </el-form>
          <el-button
            size="mini"
            type="text"
            slot="reference"
            @click="visibal = true"
            v-if="orderDetail.storeRemark==''"
          >订单备忘</el-button>
        </el-popover>
        <div class="remark" v-if="orderDetail.storeRemark!==''">
          <p>{{orderDetail.storeRemark}}</p>
          <div class="btn">
            <el-button size="mini" type="text" @click="del">删除备忘</el-button>

            <el-popover placement="right" width="300" trigger="click" v-model="visibal1">
              <el-form ref="numberValidateForm" class="demo-ruleForm">
                <el-form-item
                  :rules="[
                      { required: true, message: '备注不能为空', trigger: 'blur'},
                    ]"
                >
                  <el-input
                    type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入备注"
                    v-model="remark"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitRemark">确定</el-button>
                  <el-button @click="calcel">取消</el-button>
                </el-form-item>
              </el-form>
            </el-popover>

            <el-button size="mini" type="text" @click="edit">编辑备忘</el-button>
          </div>
        </div>
      </div>

      <div class="status">
        <span v-if="orderDetail.status==1" style="color:red">订单状态：待付款</span>
        <span v-if="orderDetail.status==2" style="color:red">订单状态：待确认</span>
        <span v-if="orderDetail.status==3" style="color:red">订单状态：已确认</span>
        <span v-if="orderDetail.status==4" style="color:red">订单状态：已派工</span>
        <span v-if="orderDetail.status==6" style="color:red">订单状态：已服务</span>

        <span v-if="orderDetail.status==5" style="color:red">订单状态：进行中</span>
        <span v-if="orderDetail.status==7" style="color:red">订单状态：已完成</span>
        <span v-if="orderDetail.status==8" style="color:red">订单状态：已取消</span>
        <span v-if="orderDetail.status==801" style="color:red">订单状态：退款申请中</span>
        <span v-if="orderDetail.status==802" style="color:red">订单状态：退款中</span>
        <span v-if="orderDetail.status==803" style="color:red">订单状态：已退款</span>
        <div class="btn">
          <el-button size="mini" type="text" @click="srue" v-if="orderDetail.status==2">确认订单</el-button>
          <el-button
            size="mini"
            type="text"
            @click="cancel"
            v-if="orderDetail.status==2 || orderDetail.status==3"
          >取消订单</el-button>
        </div>
      </div>

      <div class="inside" v-if="status==801||status==802||status==803">
        <div class="ID">
          <span v-if="status==801">退款状态：退款申请中</span>
          <span v-if="status==802">退款状态：退款中</span>
          <span v-if="status==801">退款状态：退款成功</span>
          <el-button size="mini" type="text" @click="agree" v-if="status==801">同意退款</el-button>
        </div>
        <div class="ID">
          <span>退款金额：¥{{orderDetail.orderPrice}}</span>
        </div>
        <div class="ID">
          <span>退款流程：</span>
          <div class="refound">
            <!-- 流程 -->
            <div v-for="(item,index) in statusList" :key="index" class="status1">
              <span v-if="item.refundUserType==1">用户发起</span>
              <span v-if="item.refundUserType==2">门店发起</span>
              <span v-if="item.refundUserType==3">平台发起</span>

              <span>{{item.servicePrice}}</span>

              <span v-if="item.status==1">取消申请</span>
              <span v-if="item.status==2">门店同意退款</span>
              <span v-if="item.status==3">支付平台受理退款</span>
              <span v-if="item.status==4">支付账户退款入账</span>

              <span>{{item.createTime}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="ID">
        <span>买家ID：{{orderDetail.createUserId}}</span>
      </div>
      <div class="ID">
        <span>买家手机号：{{orderDetail.createUserPhone}}</span>
      </div>
    </div>

    <div class="detail">
      <h2>服务时间</h2>
      <span>{{orderDetail.serviceTimeStart}}-{{orderDetail.serviceTimeEnd}}</span>
    </div>

    <div class="info">
      <div class="left">
        <h2>服务地址</h2>
        <p>联系人： {{orderDetail.contactName}}</p>
        <p>联系地址：{{orderDetail.address}}</p>
        <p>手机号码：{{orderDetail.contactNumber}}</p>
      </div>
      <div class="right">
        <h2>付款信息</h2>

        <p v-if="orderDetail.payMode==2">付款方式：支付宝</p>
        <p v-if="orderDetail.payMode==1">付款方式：钱包</p>
        <p v-if="orderDetail.payMode==3">付款方式：微信</p>
        <p v-else>暂无</p>
      </div>
    </div>

    <div class="goods">
      <h2>商品信息</h2>

      <el-table :data="gridData">
        <el-table-column label="名称" width="150" property="goodsName"></el-table-column>

        <el-table-column label="规格" width="150" property="goodsSpec">
          <template slot-scope="scope">
            <div>
              <span v-for="(itemt,indexs) in scope.row.spc" :key="indexs">{{itemt.specValueName}},</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="goodsPrice" label="价格"></el-table-column>

        <el-table-column label="数量" width="150" property="goodsNumber"></el-table-column>

        <el-table-column label="总价" width="150">
          <template slot-scope="scope">
            <span>{{(scope.row.goodsPrice)*(scope.row.goodsNumber)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="serve">
        <span>服务费</span>
        <span>￥{{orderDetail.servicePrice}}</span>
      </div>
      <div class="all">
        <div class="left">
          <span>留言：{{orderDetail.consumerMessage}}</span>
        </div>
        <div class="right">
          <span>订单总价： ¥{{orderDetail.orderPrice}}</span>
          <span>实付款： ¥{{orderDetail.orderPrice}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getDetail, addRemark, delRemark } from "../../../api/homeMarkOrder/index";
export default {
  data() {
    return {
      prop: "",
      hidden: false,
      visibal: false,
      visibal1: false,
   
      id: undefined,
      status: undefined,
      gridData: [],
      orderDetail: "",
      remark: "",
      statusList: [],
      statusList1:[]
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.status = Number(this.$route.query.status);

   

    this.getDetail1();
    console.log(this.status);
  },
  methods: {
    del() {
      const that = this;
      this.$confirm("是否删除备忘?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delRemark({ orderId: that.id }).then(res => {
            if (res.code === 200) {
              that.getDetail1();
              that.msgSuccess("删除成功");
            } else {
              that.msgError(res.message);
            }
          });
        })
        .catch(function(err) {
          console.log(err)
          that.$message("已取消");
        });
    },
    edit() {
      const that = this;
      this.visibal1 = true;
      this.remark = this.orderDetail.storeRemark;
    },
    getDetail1() {
      getDetail({ orderId: this.id }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.orderDetail = res.data;
          this.gridData = res.data.marketOrderGoodsList;
          this.statusList = res.data.orderRefundRecordList;
 this.statusList1 = res.data.orderRecordList;
          for (let i in res.data.marketOrderGoodsList) {
            res.data.marketOrderGoodsList[i].spc = JSON.parse(
              res.data.marketOrderGoodsList[i].goodsSpec
            );
          }
        }
      });
    },
    submitRemark(row) {
      const that = this;
      this.visibal = true;
      addRemark({ orderId: this.id, remark: this.remark }).then(res => {
        console.log(res);
        if (res.code == "200") {
          this.visibal = false;
          this.visibal1 = false;
          this.getDetail1();
        }
      });
    },
    calcel() {
      this.visibal = false;
      this.visibal1 = false;
    },
    srue() {},
    cancel() {},
    agree() {}
  }
};
</script>
<style lang="scss" scoped>
.serve,
.all {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.order {
  width: 100%;
  background-color: #fff;
  padding: 10px 20px 0px 20px;
  height: auto;
  overflow: hidden;
  box-sizing: border-box;
}
.detail {
  border-bottom: 1px solid rgb(117, 117, 117);
  padding: 30px 0;
  height: auto;
  overflow: hidden;
  text-align: left;
}
.detail span {
  font-size: 14px;
}
h2 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
}
.top > span {
  font-size: 20px;
  font-weight: bold;
}
.step {
  width: 80%;

  background: #fff;
  // text-align: center;
  display: block;
  margin: 0 auto;
}
.el-step__main {
  text-align: center;
  margin: 0 auto;
}
.info {
  width: 60%;
  display: flex;
  justify-content: space-between;
  height: auto;
  overflow: hidden;
  text-align: left;

  padding: 30px 0;
}
.goods {
  height: auto;
  overflow: hidden;
  text-align: left;

  padding: 30px 0;
}
button {
  text-align: left;
}
.btn {
  display: inline-block;
}
.top {
  text-align: left;
  margin-bottom: 15px;
}
.status1 {
  background: rgb(238, 238, 238);
  padding: 10px;
  height: auto;
  overflow: hidden;
  margin-top: 10px;
}
.status1 > span {
  display: block;
}

.steps {
  height: auto;
  overflow: hidden;
  position: relative;
  margin-bottom: 30px;
  counter-reset: step; /*创建步骤数字计数器*/
    z-index: 0;/*创建步骤数字计数器*/
}
/*步骤描述*/
.steps li {
  list-style-type: none;
  font-size: 12px;
  text-align: center;
  width: 15%;
  position: relative;
  float: left;
  position: relative;
}

/*步骤数字*/
.steps li:before {
  display: block;
  content: counter(step); /*设定计数器内容*/
  counter-increment: step; /*计数器值递增*/
  width: 32px;
  height: 32px;
  background-color: #3baffd;
  line-height: 32px;
  border-radius: 32px;
  font-size: 16px;
  color: #fff;
  text-align: center;
  font-weight: 700;
  margin: 0 auto 8px auto;

  position: relative;
}

/*连接线*/
.steps li~li:after {
  content: "";
  width: 100%;
  height: 2px;
  background-color: #3baffd;
  position: absolute;
  left: -50%;
  top: 15px;
  z-index: -1; /*放置在数字后面*/
}

/*将当前/完成步骤之前的数字及连接线变绿*/
.steps li.active:before,
.steps li.active:after {
  background-color: #3baffd;
}

/*将当前/完成步骤之后的数字及连接线变灰*/
.steps li.active ~ li:before,
.steps li.active ~ li:after {
  background-color: #777;
}
</style>