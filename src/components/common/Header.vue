<template>
  <el-header class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <!-- <div class="logo">洁佳城市社区服务系统</div> -->
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <!-- <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>-->
        <!-- 消息中心 -->
        <!-- <div class="btn-bell">
          <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
            <router-link to="/tabs">
              <i class="el-icon-bell"></i>
            </router-link>
          </el-tooltip>
          <span class="btn-bell-badge" v-if="message"></span>
        </div>-->
        <!-- 用户头像 -->
        <!-- <div class="user-avator">
                    <img :src="avater" />
        </div>-->
        <!-- 用户名下拉菜单 -->
            <div class="select">
            <el-select v-model="value" placeholder="请选择" @change="change">
              <el-option
                v-for="item in orderList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
      

          <span class="el-dropdown-link">
            Hi~ {{username}}
            <img class="headImg" src="../../assets/img/touImage.jpg" />
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="myCenter">个人中心</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </el-header>
</template>
<script>
import bus from "../common/bus";
import Cookies from "js-cookie";

import { getStoreList } from "../../api/store/index";
export default {
  data() {
    return {
      collapse: false,
      fullscreen: false,
      name: "你好",
      message: 2,
     
      orderList: [],
      value: ''
    };
  },
  created() {
     this.getList()
     console.log(this.orderList )

   
  },
  computed: {
    username() {
      let username = JSON.parse(localStorage.getItem("username")).username;
      return username || this.name;
    }
  },
  methods: {
    change(value) {
  
      localStorage.setItem("storeId", value);
          this.$store.commit('changeStore', value);
    },
    getList() {
      getStoreList().then(res => {
 
        if (res.code === 200) {
          this.orderList = res.data
        }
      
       if(localStorage.getItem('storeId')==null){
          console.log(this.orderList)
           this.value=this.orderList[0].id
    localStorage.setItem("storeId", this.orderList[0].id);
       }else{
         this.value=Number(localStorage.getItem('storeId')) 
       }
          
      });
    },
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command === "loginout") {
        localStorage.removeItem("menuStore");
        localStorage.removeItem("username");
            localStorage.removeItem("storeId");
        Cookies.remove("storeToken");
        this.$router.replace("/login");
      }
      if (command === "myCenter") {
        this.$router.push("/userCenter");
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse;
      this.$store.commit("getCollapse", this.collapse);
      // bus.$emit('collapse', this.collapse);
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }
      }
      this.fullscreen = !this.fullscreen;
    }
  },
  mounted() {
    // if (document.body.clientWidth < 1500) {
    //   this.collapseChage();
    // }
  }
};
</script>
<style scoped>
.header {
  /* position: fixed;
  top: 0;
  box-sizing: border-box;
  width: 100%; */
  height: 60px !important;
  line-height: 60px;
  font-size: 22px;
  color: #fff;
  padding-left: 0px;
  /* z-index: 100; */
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  padding-left: 0px;
  cursor: pointer;
  line-height: 60px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 60px;
  margin-left: 20px;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 60px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.el-dropdown-menu__item {
  text-align: center;
}
.el-popper {
  top: 50px !important;
}
.headImg {
  width: 40px;
  border-radius: 50%;
  vertical-align: middle;
}
</style>
