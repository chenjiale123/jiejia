<template>
  <div>
    <el-form :model="queryParam" ref="queryForm" :inline="true" label-width="80px" class="ele-form">
      <div class="clearFix formContain">
        <div class="rowFlex">
          <div class="formItem">
            <el-form-item label="商品编号:" prop="number">
              <el-input v-model="queryParam.number" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品货号:" prop="articleNo">
              <el-input v-model="queryParam.articleNo" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品名称:" prop="name">
              <el-input v-model="queryParam.name" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>
        </div>
        <div class="rowFlex">
          <div class="formItem">
            <el-form-item label="商品状态:" prop="goodsStatus">
              <el-select v-model="queryParam.goodsStatus" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="dict in shopState"
                  :key="dict.id"
                  :label="dict.value"
                  :value="dict.id"
                />
              </el-select>
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="商品分类:" prop="classId">
              <el-cascader
                v-model="queryParam.classId"
                :options="classOptions"
                :props="defaultProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </div>
          <div class="formItem">
            <el-form-item label="门店商品状态:" prop="status">
              <el-select v-model="queryParam.status" placeholder="请选择" clearable size="small">
                <el-option
                  v-for="dict in specValueList"
                  :key="dict.id"
                  :label="dict.name"
                  :value="dict.id"
                />
              </el-select>
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
      <div class="addShop">
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </div>
      <el-table :data="goodsList" v-loading="loading" :max-height="clieHeight">
        <el-table-column label="商品图片" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="商品信息异常"
              placement="top-start"
              v-if="scope.row.classStatus==1"
            >
         
              <span class="tipImg">
                <img src="../../../assets/img/tip.png" width="20px" />
              </span>
            </el-tooltip>
               <el-popover
    placement="right"
    title=""
    trigger="hover">
    <img :src="scope.row.mainImg.split(',')[0]" alt class="mainImg1"/>
    <img slot="reference" :src="scope.row.mainImg.split(',')[0]" :alt="scope.row.picture" style="width: 100px">
   </el-popover>
            <!-- <img :src="scope.row.mainImg" alt class="mainImg" /> -->
          </template>
        </el-table-column>
        <el-table-column label="商品编号" align="center" prop="number" :show-overflow-tooltip="true" />
        <el-table-column
          label="商品货号"
          align="center"
          prop="articleNo"
          :show-overflow-tooltip="true"
        />
        <el-table-column label="商品名称" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column
          label="规格最低价(元)"
          align="center"
          prop="price"
          :show-overflow-tooltip="true"
        />

        <el-table-column label="商品库存" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <!-- <el-input v-model="scope.row.stock" :disabled="able" @blur="sure(scope.row)" style="width:100px"></el-input> -->
            <span>{{scope.row.stock}}</span>
            <span @click="editStock(scope.row)" style="color:#409EFF;cursor:pointer">修改</span>
          </template>
        </el-table-column>
        <el-table-column label="商品状态(系统)" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.goodsStatus==1">上架中</span>
            <span v-if="scope.row.goodsStatus==2">未上架</span>
            <span v-if="scope.row.goodsStatus==3">已下架</span>
          </template>
        </el-table-column>
        <el-table-column label="商品状态（商品）" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.storeGoodsStatus==0">上架中</span>
            <span v-if="scope.row.storeGoodsStatus==1">已下架</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" :show-overflow-tooltip="true" width="160px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="toDetail(scope.row.goodsInfoId,scope.row.classId,scope.row.name)"
            >详情</el-button>
            <el-popover
              placement="right"
              width="300"
              trigger="click"
              :ref="`popover-${scope.row.goodsInfoId}`"
            >
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
                  <el-button type="primary" @click="submitRemark(scope.row)">确定</el-button>
                  <el-button @click="calcel(scope.row)">取消</el-button>
                </el-form-item>
              </el-form>
              <el-button
                v-if="scope.row.storeGoodsStatus==0"
                size="mini"
                type="text"
                slot="reference"
                @click="visible = true"
              >下架</el-button>
            </el-popover>
            <el-button
              size="mini"
              type="text"
              v-if="scope.row.storeGoodsStatus== 1"
              @click="toShelf(scope.row)"
            >上架</el-button>
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
    </div>

    <el-dialog title="编辑商品库存" :visible.sync="able">
      <el-table :data="gridData">
        <el-table-column label="名称" width="150">
          <template>
            <span>{{name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="item.specName"
          align="center"
          v-for="(item,index) in tableHead"
          :key="item.specId"
          :show-overflow-tooltip="true"
        >
          <template slot-scope="scope">
            <span>{{scope.row.specValues[index].specValueName}}</span>
          </template>
        </el-table-column>
        <el-table-column property="price" label="价格"></el-table-column>
        <el-table-column property="stock" label="库存">
          <template slot-scope="scope">
            <el-input
              v-model="scope.row.stock"
              @blur="sure(scope.row)"
              :disabled="scope.row.status==1"
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="规格图片" width="150">
          <template slot-scope="scope">
            <img :src="scope.row.specImg" alt class="mainImg" />
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.status==0">启用</span>
            <span v-if="scope.row.status==1">停用</span>
          </template>
        </el-table-column>
      </el-table>

      <div slot="footer" class="dialog-footer">
       
        <el-button type="primary" @click="remain">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getGoodsSpec,
  getGoodsInfoList,
  deleteGoodsInfo,
  updateGoodsStatus,
  getClassifyTree,
  getClassifyDetail,
  editStockMain,
  findGoodsInfoDetails,
  updState
} from "../../../api/business/index";
export default {
  data() {
    return {
      remark: "",
      visible: false,
      tableHead: [],
      gridData: [],
      able: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,

        number: undefined,
        articleNo: undefined,
        goodsStatus: undefined,

        classId: undefined,
        status: undefined,
        storeId: localStorage.getItem("storeId")
      },
      shopState: [
        // eslint-disable-next-line no-multi-spaces
        { id: 1, value: "上架中" },
        {
          id: 2,
          value: "未上架"
        },
        {
          id: 3,
          value: "已下架"
        }
      ],
      specValueList: [
        {
          id: "1",
          name: "启用"
        },
        {
          id: "2",
          name: "禁用"
        }
      ],
      goodsList: [],
      loading: true,
      total: 0,
      title2: "选择分类",
      openTwo: false,
      classId: null,
      treeText: "",
      defaultKey: [],
      filterText: "",
      defaultProps: {
        value: "id",
        label: "name",
        children: "subclass"
      },
      classOptions: [],
      clieHeight: null,
      value: "",
      name:''
    };
  },
  created() {
    if (this.$route.query.id) {
      this.classId = this.$route.query.id;
      this.queryParam.classId = this.$route.query.id;
      this.getClassifyDetail();
    }

    this.getGoodsList();
    getClassifyTree().then(res => {
      if (res.code === 200) {
        this.classOptions = res.data;
      }
    });
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
  
    sure(scope) {
      var that = this;
      console.log(scope);
      scope.storeId = this.value;
      editStockMain([
        {
          goodsInfoId: scope.goodsInfoId,
          stock: Number(scope.stock),
          storeId: Number(localStorage.getItem("storeId")),
          goodsDetailId: Number(scope.detailId),
          goodsStatus: Number(scope.status)
        }
      ]).then(res => {
        console.log(res);
        if (res.code === 200) {
          that.msgSuccess("修改库存成功");
        }
      });
    },
    remain() {
      this.able = false;
      this.getGoodsList();
    },
    editStock(e) {
      this.able = true;
      var that = this;
      this.name = e.name;
      console.log(e);
      findGoodsInfoDetails({
        goodInfoId: e.goodsInfoId,
        storeId: localStorage.getItem("storeId")
      }).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.gridData = res.data.marketGoodsDetailList;
          this.gridData.forEach(ele => {
            that.tableHead = ele.specValues;
          });
        }
      });
    },
    getClassifyDetail() {
      getClassifyDetail({ id: this.classId }).then(res => {
        if (res.code === 200) {
          this.treeText = res.data.name;
        }
      });
    },
    // 获取基础商品列表
    getGoodsList() {
      getGoodsInfoList(this.queryParam).then(res => {
        console.log(res);
        if (res.code === 200) {
          this.loading = false;
          this.goodsList = res.data.list;
          this.total = res.data.total;
        }
      });
    },
    // 条件搜索
    handleQuery() {
      this.getGoodsList();
    },
    // 重置
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        specValue: undefined,
        number: undefined,
        articleNo: undefined,
        goodsStatus: undefined,
        name: undefined,
        classId: this.classId
      };
      this.$route.query.id
        ? (this.classId = this.$route.query.id)
        : (this.classId = null);
      this.treeText = "";
      this.defaultKey = [];
      this.getGoodsList();
    },
    // 添加
    handleAdd() {
      this.$router.push({ path: "/storeGoods/addGoods" });
      this.$store.commit("changState", 0);
    },
    toDetail(id, classId,name) {
      console.log(id, "======");
      this.$router.push({
        path: "/business/addShop",
        query: { goodsInfoId: id, classId: classId,name:name,storeId:localStorage.getItem('storeId') ,status:2}
      });
    },
    handleDel(id) {
      const that = this;
      this.$confirm("是否确认删除该数据吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(function() {
          return deleteGoodsInfo({ id: id }).then(res => {
            if (res.code === 200) {
              that.getGoodsList();
              that.msgSuccess("删除成功");
            } else {
              that.msgError(res.message);
            }
          });
        })
        .catch(function() {
          that.$message("已取消删除");
        });
    },
    submitRemark(row) {
      const that = this;
      let status = 1;
      console.log(row);

      this.$confirm("确认更改该商品状态吗?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        return updateGoodsStatus({
          goodsInfoId: row.goodsInfoId,
          goodsStatus: status,
          storeId: localStorage.getItem("storeId"),
          remark: that.remark
        }).then(res => {
          console.log(res);
          if (res.code === 200) {
            that.getGoodsList();
            that.$message("修改成功");
            that.$refs[`popover-${row.goodsInfoId}`].doClose();
          } else {
            that.msgInfo(res.message);
          }
        });
      })
        .catch(function() {
             that.$refs[`popover-${row.goodsInfoId}`].doClose();
          });
    },
calcel(row){
    this.$refs[`popover-${row.goodsInfoId}`].doClose();
},
    toShelf(row) {
      console.log(row);
      const that = this;
      if (row.goodsStatus == 0) {
        const status = 1;
        this.$confirm("确认更改该商品状态吗?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(res => {
            console.log(res);
            return updateGoodsStatus({
              goodsInfoId: row.goodsInfoId,
              goodsStatus: status,
              storeId: localStorage.getItem("storeId")
            }).then(res => {
              if (res.code === 200) {
                that.getGoodsList();
                that.msgSuccess("修改成功");
              } else {
                that.msgError(res.message);
              }
            });
          })
          .catch(function() {
            that.$message("已取消");
          });
      } else {
        const status = 0;
        this.$confirm("确认更改该商品状态吗?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(res => {
          console.log(res);

          return updateGoodsStatus({
            goodsInfoId: row.goodsInfoId,
            goodsStatus: status,
            storeId: localStorage.getItem("storeId")
          }).then(res => {
            if (res.code === 200) {
              that.getGoodsList();
              that.msgSuccess("修改成功");
            } else {
              that.msgError(res.message);
            }
          });
        });
      }
    },

    clearInput() {},

    handleChange(value) {
      console.log(value, "00000000");
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
.mainImg1{
  width: 130px;
}
</style>
