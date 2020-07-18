<template>
  <div class="order">
    <div class="top">
      <span>售后详情</span>
    </div>
    <div class="step" v-if="salesDetail.newestStatus!==71 || salesDetail.newestStatus!==72||salesDetail.newestStatus!==73 ||salesDetail.newestStatus!==74||salesDetail.newestStatus!==75">
      <ul class="steps">
        <li
          v-for="(item,index) in statusList"
          :key="item+index"
          :class="{'active': item.isLight==0}"
        >{{item.statusDesc}},{{item.time}}</li>
      </ul>
    </div>

    <div class="detail">
      <div class="code">
        <span>订单编号：{{salesDetail.afterSaleNumber}}</span>
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
            v-if="salesDetail.dealNote==''"
          >售后备忘</el-button>
        </el-popover>
        <div class="remark" v-if="salesDetail.dealNote!==''">
          <p>{{salesDetail.dealNote}}</p>
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

      <div class="ID">
        <span v-if="salesDetail.type==1">售后类型：退款退货</span>
        <span v-else>售后类型：退款</span>
      </div>
      <div class="ID">
    
        <span v-if="salesDetail.newestStatus==1">售后状态：门店待处理</span>
        <span v-else-if="salesDetail.newestStatus==201">售后状态：已处理</span>
        <span v-else-if="salesDetail.newestStatus==202">售后状态：已处理</span>
        <span v-else-if="salesDetail.newestStatus==203">售后状态：已处理</span>
        <span v-else-if="salesDetail.newestStatus==211">售后状态：已处理</span>
        <span v-else-if="salesDetail.newestStatus==301">售后状态：等待派工</span>
        <span v-else-if="salesDetail.newestStatus==311">售后状态：等待派工</span>
        <span v-else-if="salesDetail.newestStatus==401">售后状态：退款中</span>
        <span v-else-if="salesDetail.newestStatus==402">售后状态：退款中</span>
        <span v-else-if="salesDetail.newestStatus==403">售后状态：退款中</span>
        <span v-else-if="salesDetail.newestStatus==411">售后状态：退款中</span>
        <span v-else-if="salesDetail.newestStatus==51">售后状态：平台介入</span>
        <span v-else-if="salesDetail.newestStatus==52">售后状态：平台介入</span>
        <span v-else-if="salesDetail.newestStatus==601">售后状态：售后完成</span>
        <span v-else-if="salesDetail.newestStatus==602">售后状态：售后完成</span>
        <span v-else-if="salesDetail.newestStatus==603">售后状态：售后完成</span>
        <span v-else-if="salesDetail.newestStatus==604">售后状态：售后完成</span>
        <span v-else-if="salesDetail.newestStatus==605">售后状态：售后完成</span>
        <span v-else-if="salesDetail.newestStatus==611">售后状态：售后完成</span>
        <span v-else-if="salesDetail.newestStatus==612">售后状态：售后完成</span>
        <span v-else-if="salesDetail.newestStatus==613">售后状态：售后完成</span>
        <span v-else-if="salesDetail.newestStatus==614">售后状态：售后完成</span>
        <span v-else-if="salesDetail.newestStatus==615">售后状态：售后完成</span>
        <span v-else-if="salesDetail.newestStatus==71">售后状态：已取消</span>
        <span v-else-if="salesDetail.newestStatus==72">售后状态：已取消</span>
        <span v-else-if="salesDetail.newestStatus==73">售后状态：已取消</span>
        <span v-else-if="salesDetail.newestStatus==74">售后状态：已取消</span>
        <span v-else-if="salesDetail.newestStatus==75">售后状态：已取消</span>
      </div>
      <div class="ID">
        <span>买家ID：{{salesDetail.createUser}}</span>
      </div>
      <div class="ID">
        <span>买家手机号：{{salesDetail.mobilephone}}</span>
      </div>
    </div>

    <div class="detail1">
      <span>问题描述：</span>
      <div class="form">
        <span>{{salesDetail.applyReason}}</span>
        <img :src="item" v-for="(item,index) in voucher" :key="index" />
      </div>
    </div>

    <div class="detail1" v-if="salesDetail.newestStatus==1||salesDetail.newestStatus==2||salesDetail.newestStatus==201 || salesDetail.newestStatus==202 ||salesDetail.newestStatus==203||salesDetail.newestStatus==301 ||salesDetail.newestStatus==311 ||salesDetail.newestStatus==402||salesDetail.newestStatus==602||salesDetail.newestStatus==603">
      <span>门店处理：</span>

      <div class="form" v-if="salesDetail.newestStatus==1">
        <el-form ref="form" :model="form" class="formIn">
          <div class="left" v-if="salesDetail.type==1">
            <el-form-item>
              <el-button
                v-for="item in btnList"
                :key="item.name"
                :class="{active1 : active1 == item.name}"
                @click="selected(item.name)"
              >{{item.name}}</el-button>
            </el-form-item>
            <el-form-item v-if="active1=='同意退货'">
              <el-checkbox-group v-model="form.type">
                <el-checkbox label="无需买家发货，直接退款" name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item>
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-upload
                class="avatar-uploader"
                action="#"
                :on-change="imgPreview"
                :auto-upload="false"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                accept="image/png, image/jpeg, image/jpg"
                list-type="picture-card"
              >
                <!-- <img v-if="imgUrl" :src="imgUrl" class="avatar" /> -->
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>

              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt />
              </el-dialog>
            </el-form-item>
          </div>

          <div class="right" v-if="(salesDetail.type==2 || form.type==true)&&active1=='同意退货'">
            <span></span>
            <div class="show">
              <el-form-item>
                <el-button
                  v-for="item in btnList1"
                  :key="item.name"
                  :class="{active1 : active2 == item.name}"
                  @click="selected2(item.name)"
                >{{item.name}}</el-button>
             
              </el-form-item>
              <el-form-item>
                <el-input placeholder="请输入退款金额/元" v-model="form.money" v-if="active2=='同意退款'"  onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <el-button type="primary" style="margin-top:10px" @click="sub" v-if="salesDetail.type==1">提交</el-button>
        <el-button
          type="primary"
          style="margin-top:10px"
          @click="subMon"
          v-if="salesDetail.type==2"
        >提交</el-button>
      </div>

      <div class="content">
        <div
          class="form"
          v-if="salesDetail.newestStatus==201 || salesDetail.newestStatus==202 ||salesDetail.newestStatus==203||salesDetail.newestStatus==301 ||salesDetail.newestStatus==311 ||salesDetail.newestStatus==402||salesDetail.newestStatus==602||salesDetail.newestStatus==603"
        >
          <div class="form1">
            <span v-if="salesDetail.storeDealStatus==201">同意退货退款</span>
            <span v-if="salesDetail.storeDealStatus==202">拒绝退货退款</span>
            <span v-if="salesDetail.storeDealStatus==203">拒绝退款</span>
            <span v-if="salesDetail.storeDealStatus==301">门店待收货</span>

            <span v-if="salesDetail.storeDealStatus==402">退款中</span>
            <span v-if="salesDetail.storeDealStatus==403">退款中</span>
            <span v-if="salesDetail.storeDealStatus==602">售后完成</span>
              <span v-if="salesDetail.storeDealStatus==603">售后完成</span>
            <span>{{salesDetail.storeDealRemark}}</span>
            <img :src="item" v-for="(item,index) in vaotor" :key="index" />
          </div>
        </div>

        <div class="confim" v-if="salesDetail.newestStatus==301  ">
          <div class="form1">
            <span>请在{{salesDetail.serviceDate}}期间安排人员上门取货</span>

            <span>确认收货</span>

            <el-input placeholder="请输入退款金额/元" v-model="form.money"   onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
            <el-button type="primary" style="margin-top:10px" @click="submit">提交</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="goods">
      <span>商品信息</span>

      <div class="info1">
        <span>订单编号： {{detail.orderNumber}}</span>
        <span>联系人： {{detail.contactName}}</span>
        <span>联系地址： {{detail.orderAddress}}</span>
        <span>手机号码： {{detail.contactNumber}}</span>
        <div class="shop">
          <img :src="good.goodsImg" alt />
          <span class="name">商品名称：{{good.goodsName}}</span>
          <div class="spec">
            规格： <span v-for="(itemt,indexs) in good.goodsSpec" :key="indexs">{{itemt.specValueName}},</span>
          </div>
          <div class="price">
            <span style="color:red">￥{{good.goodsPrice}}</span>
            <span style="margin-left:100px">X{{good.goodsNumber}}</span>
          </div>
        </div>
        <span class="pay" style="color:red">实付款： ￥{{salesDetail.goodsPriceCount}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import {
  salesDetail,
  addsalesRemark,
  delsalesRemark,
  agreeRefound,
  rejectRefound,
  agreeRefoundOnly
} from "../../../api/afterSales/index";
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      active2: "",
      active1: "",
      btnList: [
        {
          name: "同意退货",
          id: 1
        },
        {
          name: "拒绝退货",
          id: 0
        }
      ],
      btnList1: [
        {
          name: "同意退款",
          id: 1
        },
        {
          name: "拒绝退款",
          id: 0
        }
      ],
      form: {
        desc: "",
        type: false,
        money: ""
      },
      imgUrl: "",
      imgUrl1: "",
      formData: new FormData(),
      prop: "",
      hidden: false,
      visibal: false,
      visibal1: false,

      id: undefined,
      status: undefined,
      gridData: [],
      salesDetail: "",
      remark: "",
      statusList: [],
      arr: [],
      vaotor: [],
      voucher: [],
      detail: "",
      good: ""
    };
  },
  created() {
    this.active1 = "同意退货";
    this.active2 = "同意退款";
    this.id = this.$route.query.id;
    this.status = this.$route.query.status;
      this.getDetail1();

  
    console.log(this.status);
  },
  methods: {
    selected(name) {
      this.active1 = name;
      console.log(name);
    },
    selected2(name) {
      this.active2 = name;
      console.log(name);
    },
    handleAvatarSuccess(res, file) {},
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5;

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 5MB!");
      }
      return isLt2M;
    },
    imgPreview(file, fileList) {
      let fileName = file.name;
      console.log(file, "file123");
      let regex = /(.jpg|.jpeg|.gif|.png|.bmp)$/;
      if (regex.test(fileName.toLowerCase())) {
        this.imgUrl = URL.createObjectURL(file.raw);
        this.formData.append("files", file.raw);
        this.arr.push(this.formData);
      } else {
        this.$message.error("请选择图片文件");
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      for (const i in this.arr) {
        if (this.arr[i] === file.raw) {
          this.arr.splice(i, 1);
        }
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    sub() {
      console.log(this.arr);

      console.log(this.form.type);
      if (this.salesDetail.type == 1) {
        if (this.active1 == "同意退货") {
          if (this.form.type == false) {
            agreeRefound(
              this.salesDetail.id,
              1,
              this.form.desc,
              1,
              this.formData
            ).then(res => {
              console.log(res);
              if (res.code == 200) {
                this.getDetail1();
              }
            });
          } else {
            agreeRefoundOnly(
              this.salesDetail.id,
              1,
              this.form.desc,
              1,
              this.form.money,
              this.formData
            ).then(res => {
              console.log(res);
              if (res.code == 200) {
                this.getDetail1();
              }
            });
          }
        } else if (this.active1 == "拒绝退货") {
          rejectRefound(
            this.salesDetail.id,
            1,
            this.form.desc,
            1,
            this.formData
          ).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.getDetail1();
            }
          });
        }
      }
    },

    subMon() {
      console.log(this.arr);

      if (this.salesDetail.type == 2) {
        if (this.active2 == "同意退款") {
          agreeRefoundOnly(
            this.salesDetail.id,
            2,
            this.form.desc,
            1,
            this.form.money,
            this.formData
          ).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.getDetail1();
            }
          });
        } else if (this.active2 == "拒绝退款") {
          rejectRefound(
            this.salesDetail.id,
            2,
            this.form.desc,
            1,
            this.formData
          ).then(res => {
            console.log(res);
            if (res.code == 200) {
              this.getDetail1();
            }
          });
        }
      }
    },
    submit() {
      agreeRefoundOnly(
        this.salesDetail.id,
        2,
        this.form.desc,
        1,
        this.form.money,
        this.formData
      ).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.getDetail1();
        }
      });
    },
    del() {
      const that = this;
      this.$confirm("是否删除备忘?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return delsalesRemark({ id: that.id }).then(res => {
            if (res.code === 200) {
              that.getDetail1();
              that.msgSuccess("删除成功");
            } else {
              that.msgError(res.message);
            }
          });
        })
        .catch(function(err) {
          that.$message("已取消");
          console.log(err);
        });
    },
    edit() {
      const that = this;
      this.visibal1 = true;
      this.remark = this.salesDetail.storeRemark;
    },
    getDetail1() {
      salesDetail({ id: this.id }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.salesDetail = res.data;
          this.form.money= res.data.goodsPriceCount
          this.statusList = res.data.processList;
          this.detail = res.data.afterSaleOrderVo;
          this.good = res.data.afterSaleGoodInfoVo;

          if (res.data.afterSaleGoodInfoVo.goodsSpec) {
            res.data.afterSaleGoodInfoVo.goodsSpec = JSON.parse(
              res.data.afterSaleGoodInfoVo.goodsSpec
            );
          } else {
            res.data.afterSaleGoodInfoVo.goodsSpec = [];
          }
          if (res.data.storeDealVoucher !== null) {
            this.vaotor = res.data.storeDealVoucher.split(",");
          } else {
            this.vaotor = [];
          }

            if (res.data.voucher !== "") {
            this.voucher = res.data.voucher.split(",");
          } else {
            this.voucher = [];
          }
          console.log(this.voucher);
        }
      });
    },
    submitRemark(row) {
      const that = this;
      this.visibal = true;
      addsalesRemark({ id: this.id, dealNote: this.remark }).then(res => {
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
.active1 {
  background: #409eff;
  border: 1px solid #409eff;
  color: #fff;
}
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
.detail1>.form {

  position: relative;
  float: left;
}
.content {

  position: relative;
  float: left;
  padding: 0;
}
.form > span {
  display: block;
}
.form1 > span {
  display: block;
}
.form img {
  display: inline-block;
  width: 50px;
  height: 50px;
}
.formIn {
  display: flex;
  justify-content: flex-start;
}
.form .right {
  display: flex;
  justify-content: flex-start;
}
.detail1 {
  border-bottom: 1px solid rgb(117, 117, 117);
  padding: 30px 0;
  height: auto;
  overflow: hidden;
  text-align: left;
}
.detail1> span {
  font-size: 14px;

  float: left;
}
.shop {
  position: relative;
  height: auto;
  // overflow: hidden;

  margin-top: 10px;
}
.shop > img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  right: 0;
}
.shop > .name {
  position: absolute;
  left: 115px;
  top: 0;
}
.shop > .spec {
  position: absolute;
  left: 115px;
  top: 30px;
}
.shop > .price {
  position: absolute;
  left: 115px;
  top: 65px;
}
.pay {
  margin-top: 110px;
  display: block;
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
.info1 > span {
  display: block;
}
.goods {
  height: auto;
  overflow: hidden;
  text-align: left;

  padding: 30px 0;
}
.goods >span{
  font-weight: bold;
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
  counter-reset: step; 
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
.steps li ~ li:after {
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
  background-color: #3baffd !important;
}

/*将当前/完成步骤之后的数字及连接线变灰*/
.steps li.active ~ li:before,
.steps li.active ~ li:after {
  background-color: #777;
}
</style>