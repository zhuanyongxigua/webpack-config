<style>
.text_input {
  width: 200px;
  margin-right: 0px;
  border-radius: 4px 0px 0px 4px;
}
.item_box .table_top {
  text-align: left;
}
.ivu-modal-body::after {
  content: '';
  clear: both;
  display: block;
  height: 0;
  visibility: hidden;
}
</style>
<template>
  <div class="item_box">
    <div class="table_top">
      <div style="width: 200px;float: left;">
        <Select v-model="oQueryInfo.pcode" @on-change="fnGetUserInfoList">
          <Option value="">全部</Option>
          <Option value="15">讲经</Option>
          <Option value="16">文章</Option>
        </Select>
      </div>
      <span
        class="green_btn_s table_top_item ripple_box"
        style="float: right;margin-right:0px;"
        @click="fnShowProductDtlModal(false)"
      >
        <Icon type="plus-round"></Icon>新增
      </span>
    </div>

    <Table
      style="margin-top: 80px;"
      border
      :columns="columns"
      :data="data"
    ></Table>

    <div class="pages">
      <Page :current="iCurrentPage" :page-size="10" :total="iTotal" @on-change="fnPagination"></Page>
    </div>
    <Modal
      v-model="bUserDetails"
      @on-cancel="resetFields"
      title="内容编辑"
      width="800"
    >
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
        <div style="width: 100%;">
          <div class="item_box" style="margin-top: 0px;">
            <div class="phone_item_box">
              
              <div class="flex_row form_row">
                <div class="form_label">名称</div>
                <div class="flex1 form_item">
                  <FormItem prop="name">
                    <Input
                      style="width: 100%;"
                      v-model="formValidate.name"
                      placeholder="请输入名称"
                      class="text_input"
                    />
                  </FormItem>
                </div>
              </div>

              <div class="flex_row form_row">
                <div class="form_label">板块</div>
                <div class="flex1 form_item">
                  <FormItem prop="pcode">
                    <Select v-model="formValidate.pcode">
                      <Option value="15">讲经</Option>
                      <Option value="16">文章</Option>
                    </Select>
                  </FormItem>
                </div>
              </div>

              <div class="flex_row form_row" v-show="isNew">
                <div class="form_label">序号</div>
                <div class="flex1 form_item">
                  <FormItem prop="sort">
                    <Input
                      style="width: 100%;"
                      v-model="formValidate.sort"
                      placeholder="请输入序号"
                      class="text_input"
                      type="number"
                    />
                  </FormItem>
                </div>
              </div>

              <div class="flex_row form_row">
                <div class="form_label">封面</div>
                <div class="flex1 form_item">
                  <FormItem prop="pic">
                    <uploader
                      v-model="formValidate.pic"
                      upload-url="/backstageBaseDateC/uploadFile"
                      :base-url="baseUrl"
                      :format="['jpg', 'jpeg', 'png']"
                      :on-success="handleSuccessUpload"
                      :max-size="204800"
                      over-max-size-message="封面图片不能超过20M"
                      :num="1"
                      over-num-message="封面只能上传一个"
                      :fileType="1"
                      form-ref-name="formValidate"
                      ref="multiImage"
                      delete-url="backstageBaseDateC/removeFile"
                    ></uploader>
                  </FormItem>
                </div>
              </div>

              <div class="flex_row form_row">
                <div class="form_label">描述</div>
                <div class="flex1 form_item">
                  <FormItem prop="description">
                    <Input
                      style="width: 100%;"
                      v-model="formValidate.description"
                      placeholder="请输入描述"
                      class="text_input"
                      type="textarea"
                    />
                  </FormItem>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Form>
      <div slot="footer">
        <Button
          class="blue_btn ripple_box"
          long
          :loading="modal_loading"
          @click="save"
        >保存</Button>
      </div>
    </Modal>
    <del-modal
      :o-del-info="oDelModalInfo"
      s-url="backstageBaseDateC/removeDic"
      :fn-callback="fnGetUserInfoList"
      ref="delModal"
    ></del-modal>
  </div>
</template>

<script>
import axios from "axios";
import util from "../libs/util";
import { BASEURL } from "../libs/util"
import DelModal from '../components/delModal'
import Uploader from '../components/uploader'
export default {
  name: 'manage',
  inject: ["app"],
  components: {
    DelModal,
    Uploader
  },
  data() {
    return {
      baseUrl: BASEURL,
      modal_loading: false,
      iCurrentPage: 1,
      iTotal: 0,
      oQueryInfo: {
        type: 'flType', // columnType板块，flType栏目下的小分类
        status: true, // true和false
        pcode: '', // true和false
      },
      oUserDtlInfo: {},
      bUserDetails: false,
      columns: [
        {
          title: "名称",
          key: "name",
        },
        {
          title: "所属板块",
          key: "pcode",
          render: (h, p) => {
            let sCurType = ''
            switch (p.row.pcode) {
              case '15':
                sCurType = '讲经'
                break;
              case '16':
                sCurType = '文章'
                break;
            }
            return h('p', sCurType)
          }
        },
        {
          title: '删除',
          align: 'center',
          key: '',
          render: (h, p) => {
            return h('Button', {
              props: {
                type: 'error',
                size: 'small',
                // disabled: p.row.status
              },
              on: {
                click: () =>{
                  this.fnShowDelModal(p)
                }
              }
            }, '删除')
          }
        },
        {
          title: "详情",
          align: 'center',
          key: "",
          render: (h, p) => {
            return h(
              "span",
              {
                attrs: {
                  class: "blue_btn_table ripple_box"
                },
                on: {
                  click: () => {
                    this.fnShowProductDtlModal(p);
                  }
                }
              },
              "详情"
            );
          }
        }
      ],
      data: [],
      formValidate: {
        name: '',
        type: 'flType',
        pcode: '',
        sort: null,
        description: '',
        pic: []
      },
      ruleValidate: {
        name: [{ required: true, message: "请填写标题", trigger: "blur" }],
        pcode: [{ required: true, message: "请选择类型", trigger: "change" }],
        sort: [{validator: (rule, value, callback) => {
          if (this.isNew && !value) {
            callback(new Error('请输入序号'))
          } else {
            callback()
          }
        }}],
        pic: [{ validator: (rule, value, callback) => {
          if (this.formValidate.pcode === '15' && value.length === 0) {
            callback(new Error('请上传封面'))
          } else {
            callback()
          }
        }, trigger: "change" }],
      },
      oDelModalInfo: {
        id: ""
      },
      isNew: false
    };
  },
  created() {
    this.fnGetUserInfoList();
  },
  methods: {
    fnGetUserInfoList() {
      axios
        .post("backstageBaseDateC/searchDicForPage", {
          currentpage: this.iCurrentPage,
          pageSize: 10,
          param: {
            DictionaryVo: this.oQueryInfo
          }
        })
        .then(res => {
          this.data = JSON.parse(JSON.stringify(res.data.rows));
          this.iTotal = res.data.total;
        })
        .catch(console.log);
    },
    save() {
      util.fnValidateInfo.call(this, 'modal_loading').call(this, 'formValidate')
        .then(res => {
          let formValidate = Object.assign({}, this.formValidate)
          // 如果id是空数组，就说明是新建的，如果不是，就是修改的
          return axios.put(formValidate.id ? 'backstageBaseDateC/modifyDic': 'backstageBaseDateC/newDic', formValidate)
        })
        .then(res => util.fnHandleSuccess.call(this, res)('iCurrentPage'))
        .then(res => {
          this.resetFields()
        })
        .then(res => util.fnCloseAndLoading.call(this, 'bUserDetails').call(this, 'modal_loading'))
        .then(res => {
          this.fnGetUserInfoList()
        })
        .catch(err => {
          util.fnHandleError.call(this, err)().call(this,'modal_loading')
        })
    },
    fnGetListByTime(time) {
      this.oQueryInfo.regDateQ = time[0];
      this.oQueryInfo.regDateZ = time[1];
      this.fnGetUserInfoList();
    },
    //分页
    fnPagination(page) {
      this.iCurrentPage = page;
      this.fnGetUserInfoList();
    },
    fnShowProductDtlModal(params) {
      if (params) {
        this.formValidate = Object.assign({}, params.row)
        if (this.formValidate.picUrl !== null) {
          this.formValidate.pic = [{
            status: 'finished',
            url: params.row.picUrl,
            // 这个地方与其他的页面不一样，其他的页面是有一个查询详情的接口，这里没有
            // 可在Uploader组件里面的clear删除中需要用id这个字段来判断这个图片是刚刚上传的，还是从后台查回来的
            id: true
          }]
        } else {
          this.formValidate.pic = []
        }
        this.isNew = true
      } else {
        this.isNew = false
      }
      this.bUserDetails = true
      this.$nextTick(() => {
        this.$refs.multiImage.setFiletoRef()
      })
    },
    resetFields() {
      // 在这里reset而不是在fnShowProductDtlModal里面做的原因，是因为在fnShowProductModal里面做的话
      this.$refs.formValidate.resetFields()
      // 如果没有点击保存就直接取消了，但是图片已经上传了，就需要调接口清理图片，有id的就说明已经与表单关联了，需要删除的是没有id的
      // 下面的判断是为了排除点击保存的时候也去删除刚刚上传的图片
      // 因为当前的Modal的逻辑，点击保存也会触发取消事件来隐藏对话框的，所以这个情况需要排除
      // 通过modal_loading可以分辨出是点击的保存还是取消
      if (!this.modal_loading) {
        this.$refs.multiImage.clear(true)
      }
      // 清空已上传详情图片，clearFiles方法会造成无法继续上传图片
      // 不能用length = 0的方式清空，没有响应式特性，虽然数据清空了，但是页面上显示的东西没有变化
      this.$refs.multiImage.clear()
      this.formValidate = util.clear(this.formValidate)
    },
    fnShowDelModal(params) {
      this.$refs.delModal.bDel = true
      this.oDelModalInfo.id = params.row.id
    },
    handleSuccessUpload(url) {
      // 由于这个上传图片的地方没有通过axios，是iview组件自己的
      // 所以axios的拦截器也没有用了，所以需要在这里单独加一个跳转的
      if (typeof url === 'string' && url.indexOf('loginTimeOut') !== -1) {
        this.$router.push('login')
      }
    }
  }
};
</script>