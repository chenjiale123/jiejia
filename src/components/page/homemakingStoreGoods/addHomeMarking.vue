<template>
  <div>
    <el-form :model="queryParam" ref="queryForm" :inline="true" label-width="80px" class="ele-form">
      <div class="clearFix formContain">
        <div class="rowFlex">
          <div class="formItem">
            <el-form-item label="商品信息:" prop="number">
              <el-input v-model="queryParam.marketGoodsInfo" placeholder="请输入" clearable size="small" />
            </el-form-item>
          </div>
        
     
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
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>

    <div class="ele-table">
     
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
            <img :src="scope.row.mainImg" alt class="mainImg" />
          </template>
        </el-table-column>
             <el-table-column label="商品名称" align="center" prop="name" :show-overflow-tooltip="true" />
        <el-table-column label="商品编号" align="center" prop="number" :show-overflow-tooltip="true" />
     
        <el-table-column label="商品货号" align="center" prop="articleNo" :show-overflow-tooltip="true" />
        <el-table-column
          label="规格最低价(元)"
          align="center"
          prop="number"
          :show-overflow-tooltip="true"
        />

  
        <el-table-column label="商品状态(系统)" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.goodsStatus==1">上架中</span>
            <span v-if="scope.row.goodsStatus==2">未上架</span>
            <span v-if="scope.row.goodsStatus==3">已下架</span>
          </template>
        </el-table-column>
        <el-table-column label="门店是否添加" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.storeId!==null">是</span>
            <span v-if="scope.row.storeId==null">否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" :show-overflow-tooltip="true" width="160px">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="toDetail(scope.row)">详情</el-button>
            <el-button
              size="mini"
              type="text"
             v-if="scope.row.storeId==null"
              @click="add(scope.row)"
            >添加</el-button>
        
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

    <el-dialog title="编辑商品规格" :visible.sync="able">
      <el-table :data="gridData">
        <el-table-column label="名称" width="150">
          <template >
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
            <el-input v-model="scope.row.stock"  :disabled="scope.row.status==1"  onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"></el-input>
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
  <el-button @click="able==false">取消 </el-button>
    <el-button type="primary" @click="remain">确 定</el-button>
  </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getGoodsSpec,
  getGoodsInfoList,

  updateGoodsStatus,

getClassifyTreeHome,
  editStockMain,
  findGoodsInfoDetails,
  updState,
  getAllgood,
  addSpecGood
} from "../../../api/homeGoods/index";
export default {
  data() {
    return {
      tableHead: [],
      gridData: [],
      able: false,
      queryParam: {
        pageNum: 1,
        pageSize: 10,
        storeId:localStorage.getItem('storeId'),
    
        marketGoodsInfo: undefined,
        goodsStatus: undefined,

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
          id: 1,
          name: "启用"
        },
        {
          id: 2,
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
    getClassifyTreeHome().then(res => {
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
  
      remain() {
          var arr=[]
         for(let i in this.gridData ){
             arr.push({
        goodsInfoId: this.gridData[i].goodsInfoId,
        stock: Number(this.gridData[i].stock),
        storeId: Number(localStorage.getItem("storeId")),
        goodsDetailId:Number(this.gridData[i].detailId),
        goodsStatus:Number(this.gridData[i].status)

      })
         }

      addSpecGood(arr).then(res => {
        console.log(res);
        if (res.code === 200) {
            this.able = false;
          this.msgSuccess("添加成功");
          this.getGoodsList()
        }else{
            this.$message(res.message);
        }
      });
      

    },
    add(e) {
      this.able = true;
      var that = this;
      this.name=e.name
      console.log(e.name)
      console.log(e)
      findGoodsInfoDetails({
        goodInfoId: e.id
    
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
      getAllgood(this.queryParam).then(res => {
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

        storeId:localStorage.getItem('storeId'),
        marketGoodsInfo: undefined,
        goodsStatus: undefined,
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
      this.$router.push({ path: "/business/addShopHome" });
      this.$store.commit("changState", 0);
    },
    toDetail(e) {
      console.log(e, "======");
      this.$router.push({
        path: "/business/addShopHome",
        query: { goodsInfoId: e.id,classId:e.classId,storeId:e.storeId,status:1 }
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
    toShelf(row) {
      console.log(row);
      const that = this;
      if (row.goodsStatus == 1) {
        const status = 2;
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
        const status = 1;
            this.$confirm("确认更改该商品状态吗?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
         .then(res => {
            console.log(res);
        
      return  updateGoodsStatus({
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
</style>
