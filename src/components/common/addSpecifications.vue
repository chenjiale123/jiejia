<template>
  <div class="specifi">
    <div v-if="active==1">
      <div class="selectTitle">选择商品分类</div>
      <div @click="selectClassifi" class="shopClassifi">
        <span class="classifiTitle">商品分类：</span>
        <div class="inputDiv">
          <el-input
            v-model="treeText"
            placeholder="请选择"
            clearable
            size="small"
            class="classiInput"
          />
        </div>
        <el-button
          @click="selectClassifi('edit')"
          v-if="treeText!==''"
          type="text"
          class="upclass"
        >更换商品分类</el-button>
      </div>
      <div>
        <div class="selectTitle">选择业务规格</div>
        <el-button class="selectBtn" type="primary" @click="selectSpecif">选择规格</el-button>
      </div>
      <div class="checkBoxContain">
        <div v-for="(item,index) in multipleSelection" :key="item.id">
          <div>
            <span class="selectTitle">{{item.name}}</span>
            <!-- <el-button type="text">管理规格值</el-button> -->
            <el-button type="text" @click="handleDel(item,index)">删除</el-button>
            <el-button
              type="text"
              @click="handleMange(item,index)"
              v-if="item.deleteStatus!==1"
            >管理规格</el-button>
          </div>
          <div class="checkBox">
            <el-checkbox-group v-model="services[index]">
              <!-- {{services[index]}} -->
              <el-checkbox
                v-for="(itemTwo,indexTwo) in item.marketSpecValues"
                :label="itemTwo.id+':'+itemTwo.value"
                :key="indexTwo.id"
                @change="handleCheckedChange($event)"
              >{{itemTwo.value}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div>
        <el-table :data="tableDatas" v-if="tableDatas.length>0">
          <el-table-column label="商品名称" align="center" prop="name" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span>{{scope.row.name?scope.row.name:''}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="item.specName"
            align="center"
            v-for="(item,index) in tableHeads"
            :key="item.specId"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span>{{scope.row.specValues[index]?scope.row.specValues[index].specValueName:''}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="销售价格(元)"
            align="center"
            prop="price"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <!-- <span v-if="id">{{scope.row.price}}</span> -->
              <el-input
                placeholder="请输入"
                @change="changePrice(scope.$index,scope.row.price)"
                v-model="scope.row.price"
                clearable
                size="small"
                :disabled="scope.row.status==1?true:false"
              />
            </template>
          </el-table-column>
          <el-table-column label="规格图片" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-upload
                class="avatar-uploader"
                :action="uploadImageUrl"
                accept="image/png, image/jpeg, image/jpg"
                :headers="heard"
                name="files"
                :data="type"
                :show-file-list="false"
                :on-change="uploadImg"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :disabled="scope.row.status==1?true:false"
              >
                <img v-if="scope.row.specImg" :src="scope.row.specImg" class="avatar" width="50px" />
                <el-button
                  size="small"
                  type="primary"
                  v-else
                  @click="currentIndex=scope.$index"
                >点击上传</el-button>
              </el-upload>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span v-if="scope.row.status==0">启用</span>
              <span v-if="scope.row.status==1">停用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <el-button type="text" v-if="scope.row.status==0" @click="stopStatus(scope.$index)">停用</el-button>
              <el-button
                type="text"
                v-if="scope.row.status==1"
                @click="enableStatus(scope.$index)"
              >启用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <p>设置业务规格</p> -->
      <el-dialog
        :title="title"
        :visible.sync="open"
        width="800px"
        append-to-body
        :close-on-click-modal="false"
        :show-close="false"
      >
        <div class="dialogBody">
          <div>
            <el-form label-width="110px" class="ele-forms">
              <el-form-item label="规格信息:" prop="name">
                <el-input v-model="queryParam.name" placeholder="规格名称" clearable size="small" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div style="padding-bottom:45px">
            <el-table
              :data="specifiList"
              ref="multipleTable"
              @select="handleSelectionChange"
              @select-all="handleSelectionChange"
              v-loading="loading"
              :selectRow="selectRow"
              id="tables"
            >
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column
                label="规格名称"
                align="center"
                prop="name"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="规格备注"
                align="center"
                prop="remark"
                :show-overflow-tooltip="true"
              />
              <el-table-column label="规格值" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <span v-for="item in scope.row.marketSpecValues" :key="item.id">{{item.value}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="footBtn">
            <div style="margin-top:20px">
              <el-button type="primary" size="mini" @click="handleSubmite">确定</el-button>
              <el-button size="mini" @click="handleCacle">取消</el-button>
            </div>

            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParam.pageNum"
              :limit.sync="queryParam.pageSize"
              @pagination="getGoodsSpecList"
            />
          </div>
        </div>
      </el-dialog>
      <!-- 选择分类 -->
      <el-dialog :title="title2" :visible.sync="openTwo" width="400px" append-to-body>
        <div class="head-tree">
          <treeselect
            v-model="classId"
            :options="classOptions"
            :normalizer="normalizer"
            :disable-branch-nodes="true"
            :multiple="false"
            placeholder="选择分类"
            @select="handleNodeClick"
            noResultsText="暂无结果"
          />
        </div>
        <div class="treeTexts">
          已选择:
          <span class="isTexts">{{treeText}}</span>
        </div>
        <div class="treeBtn">
          <el-button type="primary" size="mini" @click="submiteTree">确定</el-button>
          <el-button size="mini" @click="cacleTree">取消</el-button>
        </div>
      </el-dialog>
      <!-- 第三个规格 -->
      <el-dialog :title="title3" :visible.sync="openThree" width="600px" append-to-body>
        <el-form ref="form" :model="form" label-width="80px">
          <el-row>
            <el-col :span="18">
              <el-form-item label="规格名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入规格名称" />
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="规格备注" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入规格备注" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="商品分类" prop="classId">
                <el-cascader
                  v-model="form.classId"
                  :options="classOptions"
                  :props="SetKesDept"
                  @change="handleChange"
                  :disabled="id?true:false"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-button
                type="text"
                class="addText"
                icon="el-icon-plus"
                size="small"
                @click="addSpeci"
              >添加规格值</el-button>
              <div v-for="(item, index) in form.dynamicItem" :key="index">
                <el-form-item
                  label="规格值"
                  :prop="'dynamicItem.' + index + '.value'"
                  :rules="{
                      required: true, message: '规格值不能为空', trigger: 'blur'
                   }"
                >
                  <el-input v-model="item.value" width="330px"></el-input>
                  <i
                    class="el-icon-delete deleteBtn"
                    @click="deleteItem(item,index)"
                    v-if="!item.id"
                  ></i>
                </el-form-item>
              </div>
              <!-- <el-form-item
                  v-for="(item, index) in form.dynamicItem"
                  label="规格值"
                  :key="index"
                  :prop="'dynamicItem.' + index + '.value'"
                  :rules="{
                        required: true, message: '规格值不能为空', trigger: 'blur'
                       }"
                >
                  <el-input v-model="item.value" style="width:300px"></el-input>
                  <el-button @click.prevent="removeDomain(domain)">删除</el-button>
              </el-form-item>-->
            </el-col>
            <el-col :span="18">
              <el-form-item label="规格排序" prop="sort">
                <el-input v-model="form.sort" :disabled="id?true:false" placeholder="请输入规格排序" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <div>
        <div class="specifiBtn">
          <el-button type="primary" size="mini" @click="submiteStep">
            <span v-if="id">保存</span>
            <span v-else>保存并下一步</span>
          </el-button>
          <el-button size="mini" @click="callBack">
            <span v-if="id">返回</span>
            <span v-else>返回上一步</span>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getGoodsSpec, getClassifyTree, findGoodsInfoDetails, updateGoodsDetail } from '../../api/business/index';
import { updMarket, getMarketDetail } from '../../api/marketSpec/index';
import Cookies from 'js-cookie';
import Bus from '../../utils/bus';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';

export default {
  data() {
    return {
      services: [],
      open: false,
      specifiList: [],
      total: 0,
      queryParam: {
        pageNum: 1,
        pageSize: 10
      },
      multipleSelection: [],
      title: '选择规格',
      loading: true,
      specifiValue: [],
      isValue: '',
      isChecked: false,
      tableDatas: [],
      valueAry: '',
      tableHeads: [],
      marketGoodsDetails: [],
      isOpen: false,
      classId: '',
      openTwo: false,
      title2: '选择分类',
      filterText: '',
      classOptions: [],
      defaultProps: {
        children: 'subclass',
        label: 'name'
      },
      treeText: '',
      defaultKey: [],
      price: '',
      skuList: [],
      imageUrl: '',
      uploadImageUrl: '',
      heard: {},
      type: {
        type: 2
      },
      specImg: '',
      shopName: '',
      title3: '修改规格',
      openThree: false,
      form: {
        name: undefined,
        remark: undefined,
        classId: undefined,
        dynamicItem: [],
        sort: undefined,
        values: [],
        del: [],
        upd: []
      },
      SetKesDept: {
        value: 'id',
        label: 'name',
        children: 'subclass'
      },
      isHaveTrue: false,
      currentSpeciIndex: 0,
      currentIndex: 0,
      delData: []

    };
  },
  components: {
    Treeselect
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed: {
    active: {
      get: function () {
        return this.$store.state.active;
      },
      set: function () {
      }

    }

  },
  created() {
    const that = this;
    this.uploadImageUrl = this.digitalUploadUrl;
    this.heard = { 'Authentication': Cookies.get('storeToken') };
    this.id = this.$route.query.id;
    this.classId = this.$route.query.classId;
    this.getGoodsSpecList();
    getClassifyTree({ status: 0 }).then((res) => {
      if (res.code === 200) {
        this.classOptions = res.data;
        this.classOptions.map((item) => {
          if (item.subclass) {
            item.subclass.map((itemTwo) => {
              if (itemTwo.level == '2') {
                itemTwo.disableCheckbox = true;
              }
            });
          }
        });
        console.log(this.classOptions, '898989898');
      }
    });

    if (this.id) {
      this.getGoodsList();
    } else {
      Bus.$on('listenBaseInfo', (e) => {
        if (e) {
          console.log(e, '9999999999');
          that.shopName = e.name;
          that.createTable();
        }
      });
    }
  },
  methods: {
    // 初始化加载
    createTable() {
      this.tableDatas = [{
        price: 0,
        status: 0,
        specImg: '',
        name: this.shopName
      }];
    },
    // 选择规格
    selectSpecif() {
      // this.queryParam = {
      //   pageNum: 1,
      //   pageSize: 10
      // };
      this.open = true;
      const that = this;
      if (this.multipleSelection.length > 0) {
        // debugger;
        this.specifiList.forEach((item, index) => {
          this.multipleSelection.forEach((itemTwo, indexTwo) => {
            if (item.deleteStatus !== 1 && item.id === itemTwo.id) {
              that.$nextTick(function () {
                console.log(that.$refs.multipleTable);
                that.$refs.multipleTable.toggleRowSelection(this.specifiList[index], true);
              });
            }
          });
        });
      } else {
        this.$nextTick(function () {
          that.$refs.multipleTable.clearSelection();
        });
      }
    },
    // 初始化加载规格列表
    getGoodsSpecList(param) {
      console.log(param, '参数');
      this.specifiList = [];
      if (this.id) {
        // this.queryParam = {
        //   pageNum: 1,
        //   pageSize: 15,
        //   classId: this.classId
        // };
        this.queryParam.classId = this.classId;
      }
      getGoodsSpec(this.queryParam).then((res) => {
        if (res.code === 200) {
          this.specifiList = res.data.list;
          if (param) {
            const that = this;
            if (this.multipleSelection.length > 0) {
              // debugger;
              this.specifiList.forEach((item, index) => {
                this.multipleSelection.forEach((itemTwo, indexTwo) => {
                  if (item.deleteStatus !== 1 && item.id === itemTwo.id) {
                    that.$nextTick(function () {
                      console.log(that.$refs.multipleTable);
                      that.$refs.multipleTable.toggleRowSelection(this.specifiList[index], true);
                    });
                  }
                });
              });
            } else {
              this.$nextTick(function () {
                that.$refs.multipleTable.clearSelection();
              });
            }
          }
          this.total = res.data.total;
          this.loading = false;
        }
      });
    },
    // 编辑时获取信息
    getGoodsList() {
      const that = this;
      findGoodsInfoDetails({ id: this.id, classId: this.classId }).then(res => {
        if (res.code === 200) {
          this.treeText = res.data.classResult.className;
          if (this.delData.length > 0) {
            res.data.specDetails.forEach((item, index) => {
              that.delData.forEach((itemTwo, indexIndex) => {
                if (item.id === itemTwo.id) {
                  res.data.specDetails.splice(index, 1);
                }
              });
            });
            this.multipleSelection = res.data.specDetails;
            this.addShopList();
          } else {
            this.multipleSelection = res.data.specDetails;
            this.tableDatas = res.data.marketGoodsDetails;
            console.log('66', this.tableDatas);
            if (that.tableDatas.length > 0) {
              that.tableDatas.forEach(ele => {
                that.tableHeads = ele.specValues;
              });
            }
            this.shopName = that.tableDatas[0].name;
          }
          this.multipleSelection.sort((a, b) => {
            return a.sort - b.sort;
          });
          for (let key in this.multipleSelection) {
            this.$set(this.services, key, []);
          }
          this.isSelect(res.data.specDetails);
        }
      });
    },
    // 重新加载已勾选的数据
    isSelect(datas) {
      const that = this;
      if (datas.length > 0) {
        for (let i = 0; i < datas.length; i++) {
          this.$set(this.services, i, []);
          datas[i].marketSpecValues.forEach((itemTwo, indexTwo) => {
            // debugger
            if (Number(itemTwo.isSelect) === 1) {
              that.services[i].push(itemTwo.id + ':' + itemTwo.value);
            }
          });
        }
      }
    },
    handleSelectionChange(val) {
      // let vs;
      console.log(val);
      // const that = this;
      let newSelectItem = [];
      let multipleData = [];
      let someSelection = [];
      // val.filter;

      if (this.multipleSelection.length > 0) {
        // debugger

        // 获取相同的规格
        val.forEach((item, index) => {
          var isExist = false;
          this.multipleSelection.forEach((itemTwo, indexTwo) => {
            if (item.id === itemTwo.id) {
              isExist = true;
              someSelection.push(itemTwo);
            }
          });
          if (!isExist) {
            newSelectItem.push(item);
          }
        });
        multipleData = ([...someSelection, ...newSelectItem]);
        console.log(multipleData);

        this.multipleSelection = multipleData;

        this.isSelect(this.multipleSelection);
      } else {
        this.multipleSelection = val;
        for (let key in this.multipleSelection) {
          this.$set(this.services, key, []);
        }
      }
      this.addShopList();
      this.multipleSelection.sort((a, b) => {
        return a.sort - b.sort;
      });
      if (!this.id) {
        this.shopName = this.$store.state.baseInfo ? this.$store.state.baseInfo.name : '';
      }
    },
    // 重新选择规格池对商品重新计算
    addShopList() {
      let arr = this.services;

      console.log(arr, '909090');
      // debugger
      this.checkEquipArr = [];
      this.tableHeads = [];
      this.tableDatas = [];
      this.checkList = [];
      //  this.values=[];
      let obj = {};
      var res;

      for (let i = 0; i < arr.length; i++) {
        let equipment = arr[i];
        if (equipment.length > 0) {
          this.tableHeads.push({
            specName: this.multipleSelection[i].name,
            specId: String(this.multipleSelection[i].id)
          });
          obj = {
            id: this.multipleSelection[i].id,
            equips: []
          };
          for (let j = 0; j < equipment.length; j++) {
            obj.equips.push(equipment[j]);
          }
          this.checkEquipArr.push(obj);
        }
      }
      // return
      console.log(this.checkEquipArr); // 拿到所有选中的值
      // 将选中的规格组合成一个大数组，数据不会重复
      if (this.checkEquipArr.length > 0) {
        this.checkEquipArr.forEach(ele => {
          // eslint-disable-next-line no-unused-expressions
          ele.equips.length > 0 ? this.checkList.push(ele.equips) : '';
        });
        if (this.checkList.length > 0) {
          res = this.getSkuData(this.checkList);
        }

        var newData = [];
        var newObjs = {};
        if (res.length > 1) {
          res.forEach((item, index) => {
            console.log(item.length);
            newObjs = {
              price: 0,
              status: 0,
              specValues: [],
              specImg: '',
              name: this.shopName
            };
            this.tableHeads.forEach((items, indexs) => {
              newObjs.specValues.push({ specId: items.specId, specName: items.specName, specValueId: item[indexs].id, specValueName: item[indexs].value });
            });
            newData.push(newObjs);
          });
        } else {
          console.log(this.tableHeads);
          res.forEach((item, index) => {
            console.log(item.length);
            newObjs = {
              price: 0,
              status: 0,
              specValues: [],
              specImg: '',
              name: this.shopName
            };
            this.tableHeads.forEach((items, indexs) => {
              newObjs.specValues.push({ specId: items.specId, specName: items.specName, specValueId: item[indexs].id, specValueName: item[indexs].value });
            });
            newData.push(newObjs);
          });
        }
        this.tableDatas = newData;
        console.log(newData);
      } else {
        this.tableDatas = [{
          price: 0,
          status: 0,
          specImg: '',
          name: this.shopName
        }];
      }
      if (this.multipleSelection.length < 1) {
        this.tableDatas = [{
          price: 0,
          status: 0,
          specImg: '',
          name: this.shopName
        }];
      }
    },

    handleCheckedChange(e) {
      this.addShopList();
    },
    getSkuData(source) {
      const result = [];
      const _result = [];
      const convert = (arr, index) => {
        for (let i = 0; i < source[arr[index]].length; i++) {
          // debugger;
          if (source[arr[index]][i]) {
            var a = source[arr[index]][i].split(':');
            _result[arr[index]] = { id: a[0], value: a[1] };
            if (index === arr.length - 1) {
              console.log(_result);
              result.push(JSON.parse(JSON.stringify(_result)));
            } else {
              convert(arr, index + 1);
            }
          }
        }
      };
      convert(Object.keys(source), 0);
      console.log(result, '---------');
      // this.tableDatas = result;
      return result;
    },
    flatten(arr) {
      return [].concat(...arr.map(x => Array.isArray(x) ? this.flatten(x) : x));
    },
    handleSubmite() {
      this.open = false;
    },
    handleCacle() {
      // this.multipleSelection = [];
      this.open = false;
    },
    handleQuery() {
      this.getGoodsSpecList(1);
      // this.specifiList
    },
    resetQuery() {
      this.queryParam = {
        pageNum: 1,
        pageSize: 10,
        name: undefined
      };
      this.getGoodsSpecList(1);
    },
    // 删除规格
    handleDel(item, index) {
      // const r = this.multipleSelection.indexOf(id);
      // console.log(r);
      // const that = this;
      this.multipleSelection.splice(index, 1);
      this.services.splice(index, 1);
      this.delData.push(item);
      //  删除数据，table也删除选中状态
      // debugger;
      this.addShopList();
    },
    selectRow(row) {
      console.log(row);
    },
    // 点击管理规格
    handleMange(item, index) {
      console.log(item, '9090');
      this.openThree = true;
      this.form.name = item.name;
      this.form.remark = item.remark;
      this.form.classId = item.classId;
      this.form.id = item.id;
      this.form.sort = item.sort;
      this.form.dynamicItem = item.marketSpecValues;
      // this.newSeveci = this.services[index];
      // this.newmultiple=this.multipleSelection[index]
      // console.log(this.services[index]);
    },

    selectClassifi(v) {
      this.openTwo = true;
      if (v === 'edit') {
        this.defaultKey.push(this.classId);
      } else {
        this.defaultKey = [];
      }
    },
    clearInput() { },
    normalizer(node) {
      console.log(node, '00000');
      if (node.subclass && !node.subclass.length) {
        delete node.subclass;
      }
      return {
        id: node.id,
        label: node.name,
        children: node.subclass
      };
    },
    // 选择分类
    handleNodeClick(node) {
      this.classId = node.id;
      let parentName = '';
      this.classOptions.forEach((item) => {
        if (item.subclass) {
          item.subclass.map((itemTwo) => {
            if (itemTwo.id === node.parentId) {
              parentName = itemTwo.name;
            }
          });
        }
      });
      this.treeText = this.classOptions[0].name + ' ' + parentName + ' ' + node.name;
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    submiteTree() {
      this.openTwo = false;
      this.multipleSelection = [];

      // for (let key in this.multipleSelection) {
      //   this.$set(this.services, key, []);
      // }
      this.services = [];
      this.addShopList();
    },
    cacleTree() {
      this.openTwo = false;
    },
    callBack() {
      if (this.id) {
        this.$emit('update:isShowBaseInfo', false);
        this.$store.commit('changState', 0);
      } else {
        this.$store.commit('changState', 0);
        this.$nextTick(function () { // 解决第一次监听不到数据
          // Bus.$emit('listenBaseInfo', this.formParam);
        });
      }
    },
    submiteStep() {
      if (this.id) {
        const datas = {
          classId: this.classId,
          marketGoodsDetails: this.tableDatas,
          id: this.id
        };
        updateGoodsDetail(datas).then(res => {
          if (res.code === 200) {
            this.$message('修改成功');
            this.$emit('update:isShowBaseInfo', false);
            // this.$store.commit('GoodsDetails', datas);
          }
        });
      } else {
        if (this.treeText === '') {
          this.$message('商品分类不能为空');
          return;
        }
        const datas = {
          classId: this.classId,
          marketGoodsDetails: this.tableDatas
        };
        this.$store.commit('GoodsDetails', datas);
        this.$store.commit('changState', 2);
      }
    },
    handleAvatarSuccess(file) {
      console.log(file);
      // this.specImg = file.data;
      // debugger;
      console.log(this.currentIndex, 'index');
      if (file.code === '200') {
        this.tableDatas[this.currentIndex].specImg = file.data;
        // this.specImg = file.data;
      }
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M;
    },
    uploadImg() {
      console.log(this.currentIndex, '90909');
      // console.log(file);
      // if (file.status === 'success') {
      //   // this.files.push(file);
      //   const code = file.response.code;
      //   if (code === '200') {
      //     if (file.response.data) {
      //       this.specImg = file.response.data;
      //     }
      //   }
      // }
    },
    changePrice(index, value) {
      console.log(index, value);
      this.tableDatas[index].price = value;
    },
    stopStatus(index) {
      this.tableDatas[index].status = 1;
    },
    enableStatus(index) {
      this.tableDatas[index].status = 0;
    },
    submitForm() {
      console.log(this.form.dynamicItem);
      const that = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.dynamicItem.forEach((item, index) => {
            if (item.id) {
              that.form.upd.push({ id: item.id, value: item.value });
            } else {
              that.form.values.push(item.value);
            }
          });
          if (this.id) {
            that.updMarkets();
          } else {
            console.log(this.id);
          }
        }
      });
    },
    cancel() {
      this.openThree = false;
    },
    updMarkets() {
      const that = this;
      console.log(this.form.values);
      updMarket({
        id: this.form.id,
        name: this.form.name,
        remark: this.form.remark,
        sort: this.form.sort,
        classId: this.form.classId,
        upd: this.form.upd,
        del: this.form.del.join(','),
        values: this.form.values.join(',')
      }).then(response => {
        if (response.code === '200') {
          this.msgSuccess('修改成功');
          this.openThree = false;
          this.getGoodsSpecList();
          if (this.id) {
            this.getGoodsList();
          } else {
            getMarketDetail({ id: this.form.id }).then(res => {
              if (res.code === 200) {
                that.multipleSelection[this.currentSpeciIndex] = res.data;
              }
            });
          };
        } else {
          this.msgError(response.message);
        }
      });
    },
    handleChange() {

    },
    // 添加规格
    addSpeci() {
      this.form.dynamicItem.push({ value: '' });
      console.log(this.form.dynamicItem, '当前天添加的规格');
    },
    // 删除规格
    deleteItem(item, index) {
      this.form.dynamicItem.splice(index, 1);
      const that = this;
      if (item.id) {
        console.log(this.services[this.currentSpeciIndex]);
        if (this.services[this.currentSpeciIndex].length > 0) {
          this.services[this.currentSpeciIndex].forEach((itemTwo, index) => {
            var a = itemTwo.split(':');
            if (Number(a[0]) === Number(item.id)) {
              that.isHaveTrue = true;
            }
          });
        }
        this.form.del.push(item.id);
      }
    }

  }
};
</script>
<style lang="scss" scoped>
.specifi {
  text-align: left;
  padding: 15px;
}
.dialogBody {
  max-height: 500px;
  overflow: auto;
  padding-bottom: 30px;
}
.shopClassifi {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  justify-items: center;
  margin-top: 15px;
  margin-bottom: 20px;
  .classifiTitle {
    display: inline-block;
    width: 90px;
    text-align: right;
  }
  .inputDiv {
    position: relative;
    z-index: 1;
  }
  .classiInput {
    position: relative;
    z-index: -1;
    width: 400px;
  }
  .upclass {
    margin-left: 20px;
  }
}
/deep/ .head-tree {
  // max-height: 350px;
  // overflow: auto;
  padding-bottom: 20px;
}
/deep/ .el-dialog__body {
  padding-bottom: 30px;
}
.treeTexts {
  margin-bottom: 15px;
}
.treeBtn {
  text-align: right;
}
.selectBtn {
  margin: 15px 0;
}
.selectTitle {
  font-size: 14px;
  font-weight: bold;
  padding-right: 8px;
  // margin-bottom: 10px;
}
.checkBoxContain {
  padding-left: 20px;
  .checkBox {
    padding-left: 20px;
    margin-bottom: 10px;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 10px;
  }
}
.specifiBtn {
  margin-top: 15px;
  padding-bottom: 20px;
}
.addText {
  margin-bottom: 10px;
}
.deleteBtn {
  display: inline-block;
  margin-left: 10px;
  position: absolute;
  top: 10px;
  cursor: pointer;
}
.footBtn {
  position: absolute;
  display: flex;
  justify-content: space-between;
  bottom: 15px;
  /* text-align: right; */
  /* left: 40%; */
  background-color: #fff;
  width: 93%;
  /* padding-right: 31px; */
  // margin-right: 30px;
  z-index: 1;
  // border-top: 1px solid #e5e5e5;
  // padding-top: 15px;
}
.dyForm {
  max-height: 350px;
}
.isTexts {
  color: red;
}
</style>
