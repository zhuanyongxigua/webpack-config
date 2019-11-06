<style scoped>
.grayness_text {
  vertical-align: middle;
}
.ivu-form-inline .ivu-form-item {
  margin-left: 90px;
}
.blue_btn {
  width: 70px;
  line-height: 0;
}
.ivu-btn:hover {
  background-color: #4eb7cd;
  color: white;
  border-color: #dddee1;
}
.ivu-btn-error:hover {
  color: #fff;
  background-color: #f16543;
  border-color: #f16543;
}
</style>
<template>
  <div>
    <div class="flex_row">
      <div class="menuBox">
        <div class="logo_box">
          <img
            src="../assets/logo_m.png"
            style="margin-top:50px; margin-left: 60px; width:110px;"
          />
          <!--<img src="../static/img/logo.png" style="margin-top:40px; margin-left: 45px;">-->
        </div>
        <div class="main_btns">
          <span
            class="ripple_box main_btn"
            @click="menuChose(1, 'usersInfo')"
            :class="{ selected: menuSelected == 1 }"
            v-if="oPermission[1]"
          >
            用户管理
            <Icon type="chevron-right" class="right_chevron"></Icon>
          </span>
          <span
            class="ripple_box main_btn"
            @click="menuChose(2, 'teach')"
            :class="{ selected: menuSelected == 2 }"
            v-if="oPermission[2]"
          >
            讲经
            <Icon type="chevron-right" class="right_chevron"></Icon>
          </span>
          <span
            class="ripple_box main_btn"
            @click="menuChose(3, 'articles')"
            :class="{ selected: menuSelected == 3 }"
            v-if="oPermission[3]"
          >
            文章
            <Icon type="chevron-right" class="right_chevron"></Icon>
          </span>
          <span
            class="ripple_box main_btn"
            @click="menuChose(4, 'mall')"
            :class="{ selected: menuSelected == 4 }"
            v-if="oPermission[4]"
          >
            商城
            <Icon type="chevron-right" class="right_chevron"></Icon>
          </span>
          <span
            class="ripple_box main_btn"
            @click="menuChose(5, 'orders')"
            :class="{ selected: menuSelected == 5 }"
            v-if="oPermission[5]"
          >
            订单管理
            <Icon type="chevron-right" class="right_chevron"></Icon>
          </span>
          <span
            class="ripple_box main_btn"
            @click="menuChose(6, 'afterSale')"
            :class="{ selected: menuSelected == 6 }"
            v-if="oPermission[6]"
          >
            售后管理
            <Icon type="chevron-right" class="right_chevron"></Icon>
          </span>
          <span
            class="ripple_box main_btn"
            @click="menuChose(7, 'manage')"
            :class="{ selected: menuSelected == 7 }"
            v-if="oPermission[7]"
          >
            分类管理
            <Icon type="chevron-right" class="right_chevron"></Icon>
          </span>
        </div>
      </div>
      <div class="flex1 HolyGrail">
        <div class="top_box flex_row">
          <div class="second_menu" v-if="menuSelected == 1">
            <span class="second_menu_btn2 selected">用户管理</span>
          </div>
          <div class="second_menu" v-if="menuSelected == 2">
            <span class="second_menu_btn2 selected">讲经</span>
          </div>
          <div class="second_menu" v-if="menuSelected == 3">
            <span class="second_menu_btn2 selected">文章</span>
          </div>
          <div class="second_menu" v-if="menuSelected == 4">
            <span class="second_menu_btn2 selected">商城</span>
          </div>
          <div class="second_menu" v-if="menuSelected == 5">
            <span class="second_menu_btn2 selected">订单管理</span>
          </div>
          <div class="second_menu" v-if="menuSelected == 6">
            <span class="second_menu_btn2 selected">售后管理</span>
          </div>
          <div class="second_menu" v-if="menuSelected == 7">
            <span class="second_menu_btn2 selected">分类管理</span>
          </div>

          <div class="flex1"></div>
          <div class="header_right">
            <div
              class="header_right_item"
              style="cursor: pointer;"
              @click="modal1 = true"
            >
              <Icon type="ios-contact" style="font-size: 18px;" class="grayness_text"></Icon>
              <span class="grayness_text">修改密码</span>
            </div>
            <div
              class="header_right_item"
              style="cursor: pointer;"
              @click="logout"
            >
              <Icon type="ios-power" style="font-size: 20px;" class="grayness_text"></Icon>
              <span class="grayness_text">退出系统</span>
            </div>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
    <Modal
      v-model="modal1"
      title="修改密码"
      @on-ok="ok"
      @on-cancel="cancel">
        <Form ref="formInline" :model="formInline" :rules="ruleInline" inline>
          <FormItem prop="password">
            <Input v-model="formInline.password" type="password" placeholder="原始密码" style="width: 300px" />
          </FormItem>
          <FormItem prop="newPassword">
            <Input v-model="formInline.newPassword" type="password" placeholder="新密码" style="width: 300px" />
          </FormItem>
          <FormItem prop="confirmPassword">
            <Input v-model="formInline.confirmPassword" type="password" placeholder="确认密码" style="width: 300px" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button class="blue_btn ripple_box" long :loading="modal_loading" @click="ok('formInline')">确认</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
import axios from 'axios'
import * as util from '../libs/util'
export default {
  name: "index",
  provide() {
    return {
      app: this
    }
  },
  data() {
    return {
      //初始开关状态
      value1: [1, 2],
      //按钮状态
      modal1: false,
      modal_loading: false,
      formInline: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      ruleInline: {
        password: [
          { required: true, message: '原密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
        ]
      },
      oPermission: {
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
        7: false,
        8: false,
        9: false,
      },
      //二级按钮状态
      //时间范围
      options2: {
        shortcuts: [
          {
            text: "近7天",
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: "近2周",
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
              return [start, end]
            }
          },
          {
            text: "近1月",
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            }
          },
          {
            text: "近3月",
            value() {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ]
      }
    }
  },
  //加载组件时发出请求
  created() {
    this.checkPermission()
  },
  computed: {
    //按钮状态
    menuSelected: {
      get() {
        return this.$route.meta.index
      },
      set() {}
    }
  },
  methods: {
    checkPermission() {
      axios.post('backstageC/searchCurrentPersissions', {})
        .then(res => {
          res.data.success ? this.fnJudgeShow(res.data.result.Persissions) : this.$router.push('login')
        })
        .catch(err => {
          console.log(err)
        })
    },
      //左菜单点击
    menuChose(index, name) {
      this.$router.push(name);
    },
    logout() {
      axios.post('backstageC/logout', {})
        .then(res => {
          if (res.data.success) {
            this.$router.push('login')
          }
        })
        .catch(err => {
          console.log()
        })
    },
    ok() {
      util.fnValidateInfo.call(this, 'modal_loading').call(this, 'formInline')
        .then(res => {
          return axios.put('backstageC/modifyManagerPassword', this.formInline)
        })
        .then(res => util.fnHandleSuccess.call(this, res)())
        .then(res => {
          this.$refs.formInline.resetFields()
        })
        .then(res => setTimeout(() => this.modal1 = false, 1000))
        .then(res => util.fnCloseAndLoading.call(this, 'modal1').call(this,'modal_loading'))
        .catch(err => {
          util.fnHandleError.call(this, err)().call(this, 'modal_loading')
        })
    },
    cancel () {
      // this.$Message.info('Clicked cancel');
      this.$refs.formInline.resetFields()
    },
    fnJudgeShow(aPermission){
      aPermission.forEach(ele => this.oPermission[ele.code] = true)
      // Object.keys(this.oPermission).forEach(ele => {
      //   this.oPermission[ele] = true
      // })
    },
  }
}
</script>