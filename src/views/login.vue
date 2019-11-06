<style scoped>
::-webkit-input-placeholder {
/* WebKit browsers */
  /* color: #fff!important; */
}

:-moz-placeholder {
/* Mozilla Firefox 4 to 18 */
  /* color: #dcdee2!important; */
}

::-moz-placeholder {
/* Mozilla Firefox 19+ */
  /* color: #dcdee2!important; */
}

:-ms-input-placeholder {
/* Internet Explorer 10+ */
  /* color: #dcdee2!important; */
}
</style>

<template>
  <div class="login_big_box">
    <div class="flex1"></div>
    <div class="login_content">
      <div class="mlogin_box">
        <h2 class="login_title">世嘉印良 - 管理系統</h2>
          <input class="login_input" v-model="loginId" placeholder="用户名" v-focus-hide-placeholder/>
          <input class="login_input" type="password" v-model="password" placeholder="密码"/>
          <span
            class="btn_login ripple_box"
            type="primary"
            @click="login"
          >登录</span>
      </div>
    </div>
    <div class="flex1"></div>
  </div>
</template>

<script>
import axios from 'axios'
import util from '../libs/util'
export default({
  name: "login",
  data() {
    return {
      loginId: '',
      password: ''
    }
  },
  directives: {
    focusHidePlaceholder: {
      bind: function(el, binding) {

      }
    }
  },
  //加载组件时发出请求
  created: function() {
    //this.getServiceList();
    window.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        if (this.$route.path === '/login') {
          this.login();
        }
      }
    });
  },
  methods: {
    login() {
      let regExp = /^[A-Za-z][A-Za-z0-9]{3,14}$/;
      if (!this.loginId) {
          this.$Message.error('用户名不能为空');
          return;
      }
      // if (!regExp.test(this.loginId)) {
      //     this.$Message.error('用户名由4到15个英文字母和数字组成，且以字母开头');
      //     return;
      // }
      if (!this.password) {
          this.$Message.error('密码不能为空');
          return;
      }
      axios.post('backstageC/login', {
        loginId: this.loginId,
        password: this.password
      })
        .then(res => {
          return util.fnHandleSuccess.call(this, res)()
        })
        .then(res => setTimeout(() => this.$router.push("index"),100))
        .catch(util.fnHandleError.bind(this));
      // axios.post('backstageC/login', {
      //   loginId: this.loginId,
      //   password: this.password
      // })
      //   .then(res => {
      //     if (res.data.success) {
      //       this.$router.push('index')
      //     }
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    }
  }
})
</script>