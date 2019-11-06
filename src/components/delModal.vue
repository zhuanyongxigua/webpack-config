<!-- /*删除确认对话框
* 使用方法：1.常规vue组件引入，在引入的组件中用vue的ref属性改变此组件data中的bDel为true，以使组件显示
*          例如：在template标签中：<del-modal :o-del-info="oDelModalInfo" s-url="userAccount/removeUser" :fn-callback="fnDelCB" ref="delModal"></del-modal>
*               在触发的事件中：this.$refs.delModal.bDel = true，以使对话框出现;
*          2.接受三个参数：1，请求所需的数据，如id；2，接口url；3，回调函数。
*          3.此组件依赖axios、自定义的util文件和iview。
* */ -->
<style scoped>

</style>

<template>
  <div>
    <Modal v-model="bDel" width="360" class-name="vertical-center-modal">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="information-circled"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
          <p>删除之后无法恢复</p>
          <p>是否继续删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" class="ripple_box" size="large" long :loading="modal_loading" @click="fnDel">删除</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import util from '../libs/util'
import axios from 'axios'
export default {
  data(){
    return{
      modal_loading: false,
      bDel: false
    }
  },
  props: ['oDelInfo', 'sUrl', 'fnCallback'],
  created() {
  },
  methods: {
    //删除用户
    fnDel () {
      this.modal_loading = true;
      axios.delete(this.sUrl, {data: this.oDelInfo})
        .then(res => util.fnHandleSuccess.call(this, res)())
        .then(res => util.fnCloseAndLoading.call(this, 'bDel').call(this, 'modal_loading'))
        .then(this.fnCallback)
        .catch(err => {
            util.fnHandleError.call(this, err)().call(this, 'modal_loading');
        })
    },
  }
}
</script>
