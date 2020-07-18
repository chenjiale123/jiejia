<template>
  <div>
    <el-form
      :model="formParam"
      ref="queryForm"
      label-width="110px"
      class="ele-form"
      v-if="homeActive==0"
      :rules="rules"
    >
      <el-form-item label="商品名称:" prop="name">
        <el-input v-model="formParam.name" placeholder="请输入商品名称" clearable size="small" />
      </el-form-item>
      <el-form-item label="商品副标题:" prop="title">
        <el-input v-model="formParam.title" placeholder="请输入商品副标题" clearable size="small" />
      </el-form-item>
      <el-form-item label="商品状态:" prop="goodsStatus">
        <el-select v-model="formParam.goodsStatus" placeholder="请选择" clearable size="small">
          <el-option v-for="dict in shopState" :key="dict.id" :label="dict.value" :value="dict.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="商品货号:" prop="articleNo">
        <el-input v-model="formParam.articleNo" placeholder="请输入商品货号" clearable size="small" />
      </el-form-item>
      <el-form-item label="商品主图:" prop="mainImg">
        <el-upload
          :action="uploadImageUrl"
          :headers="heard"
          accept="image/png, image/jpeg, image/jpg"
          name="files"
          list-type="picture-card"
          :data="type"
          :on-change="uploadImg"
          :file-list="files"
          :before-upload="beforeUpload"
        >
          <i slot="default" class="el-icon-plus"></i>
          <div slot="file" slot-scope="{file}">
            <img
              class="el-upload-list__item-thumbnail"
              v-for="(item,index)  in formParam.mainImg"
              :key="index"
              :src="item"
              alt
            />
            <span class="el-upload-list__item-actions">
              <span
                v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)"
              >
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="服务方式:" prop="services">
        <el-checkbox-group v-model="formParam.services" @change="handleCheckedChange">
          <el-checkbox
            v-for="item in servicesList"
            :label="item.services"
            :key="item.services"
          >{{item.value}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item prop>
        <div v-if="id">
          <el-button type="primary" @click="saveTwo">保存</el-button>
          <el-button @click="toBack">返回</el-button>
        </div>
        <el-button v-else type="primary" @click="save">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import api from '../../axios/http';
import Cookies from 'js-cookie';
import { updateInfoDetails } from '../../../api/homeMarket/shop';
import Bus from '../../../utils/bus';
export default {
  data() {
    return {
      fileList: [],
      servicesList: [{
        services: '1',
        value: '送货上门'
      }, {
        services: '2',
        value: '快递'
      },
      {
        services: '3',
        value: '门店自提'
      }
      ],
      shopState: [
        // eslint-disable-next-line no-multi-spaces
        {          id: 1,
          value: '上架中'
        },
        {
          id: 2,
          value: '未上架'
        }, {
          id: 3,
          value: '已下架'
        }
      ],
      formParam: {
        name: undefined,
        title: undefined,
        goodsStatus: undefined,
        articleNo: undefined,
        services: [],
        mainImg: []
      },
      disabled: false,
      id: '',
      heard: {},
      uploadImageUrl: '',
      type: {
        type: 1
      },
      files: [],
      baseInfos: {},
      rules: {
        name: [
          { required: true, message: '商品名称不能为空', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '商品副标题不能为空', trigger: 'blur' }
        ],

        goodsStatus: [
          { required: true, message: '商品状态不能为空', trigger: 'blur' }
        ],
        articleNo: [
          { required: true, message: '商品货号不能为空', trigger: 'blur' }
        ],
        mainImg: [
          { required: true, message: '商品主图不能为空', trigger: 'blur' }
        ],
        services: [
          { required: true, message: '服务方式不能为空', trigger: 'blur' }
        ]

      }

    };
  },
  props: ['isShowEdit'],
  computed: {
    homeActive: {
      get: function () {
        return this.$store.state.homeActive;
      },
      set: function () {
      }

    }

  },

  created() {
    this.uploadImageUrl = this.digitalUploadUrl;
    this.heard = { 'Authentication': Cookies.get('storeToken') };
    this.id = this.$route.query.id;
    this.baseInfos = this.$store.state.homeBaseInfo;
    console.log(this.baseInfos, '9090909');
    Bus.$on('listenHomeBaseInfo', (e) => {
      if (e) {
        this.formParam.services = e.services.split(',');
        this.formParam.mainImg = e.mainImg.split(',');
        console.log(e, '9-------------');
      }
    });
    if (this.id) {
      this.formParam.name = this.baseInfos.name;
      this.formParam.articleNo = this.baseInfos.articleNo;
      this.formParam.title = this.baseInfos.className;
      this.formParam.goodsStatus = this.baseInfos.goodsStatus;
      this.formParam.services = this.baseInfos.services.split(',');
      this.formParam.mainImg = this.baseInfos.mainImg.split(',');
      this.formParam.mainImg.forEach(item => {
        this.files.push({ url: item });
      });
    }
  },
  methods: {
    handleCheckedChange(value) {
      // console.log(value);
      // this.formParam.services.push();
    },
    handleRemove(file) {
      this.formParam.mainImg = [];
      console.log(file);
      const uid = file.uid ? file.uid : file;
      if (uid) {
        this.files = this.files.filter((item) => {
          return item.uid !== uid;
        });
        this.files.forEach((files) => {
          this.formParam.mainImg.push(files.response.data);
        });
      } else {
        this.files.splice(uid, 1);
        this.formParam.mainImg.splice(uid, 1);
      }
    },
    uploadImg(file) {
      console.log(file);
      if (file.status === 'success') {
        this.files.push(file);
        const code = file.response.code;
        if (code === '200') {
          if (file.response.data) {
            this.formParam.mainImg.push(file.response.data);
          }
        }
      }
    },
    beforeUpload(file) {
      console.log(file);
    },
    // 添加时保存
    save() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.formParam.services = this.formParam.services.toString();
          this.formParam.mainImg = this.formParam.mainImg.toString();
          console.log(this.formParam);
          this.$nextTick(function () { // 解决第一次监听不到数据
            Bus.$emit('listenHomeBaseInfo', this.formParam);
          });
          this.$store.commit('getHomeBaseInfo', this.formParam);
          this.homeActive = 1;
          this.$store.commit('changActive', 1);
        }
      });
    },
    // 编辑时保存
    saveTwo() {
      this.$refs['queryForm'].validate(valid => {
        if (valid) {
          this.formParam.services = this.formParam.services.toString();
          this.formParam.mainImg = this.formParam.mainImg.toString();
          this.formParam.id = this.id;
          updateInfoDetails(this.formParam).then(res => {
            if (res.code === 200) {
              this.$message('修改成功');
              this.$emit('update:isShowEdit', false);
              this.$store.commit('getHomeBaseInfo', this.formParam);
            }
          });
        }
      });
    },
    toBack() {
      this.$emit('update:isShowEdit', false);
    }
  }
};
</script>
<style lang="scss" scoped>
.ele-form {
  width: 700px;
  text-align: left;
  padding-top: 15px;
  padding-bottom: 30px;
}
</style>
