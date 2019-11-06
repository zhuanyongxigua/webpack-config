<style>
.search-input {
  width: 200px;
  margin-right: 0px;
  border-radius: 4px 0px 0px 4px;
}

.search-button {
  float: left;
  line-height: 25px;
}
.ck-editor__editable_inline { 
  height:400px;
}
.item_box {
  overflow: visible;
}
.ivu-modal-body::after {
  content: '';
  clear: both;
  display: block;
  height: 0;
  visibility: hidden;
}
.ivu-upload-list-remove {
  display: inline-block!important;
  margin-top: 5px;
}
.ivu-modal {
  top: 0;
}
</style>

<template>
  <div>
    <div class="item_box">
      <div class="table_top">
        <Input v-model="oQueryInfo.title" class="text_input table_top_item search-input" placeholder="" />
        <Button type="warning" class="search-button blue_btn_s table_top_item ripple_box" @click="fnGetProductList">搜索</Button>
        <span class="table_top_label">发布时间：</span>
        <DatePicker
          class="table_top_item"
          type="daterange"
          :options="app.options2"
          placement="bottom-end"
          placeholder="选择日期"
          style="width: 200px;"
          @on-change="fnGetListByTime"
        ></DatePicker>
        <div style="width: 200px;float: left;">
          <Select v-model="oQueryInfo.typeCode" @on-change="fnGetProductList">
            <Option value="">全部</Option>
            <Option v-for="item in aProductTypeList" :value="item.code.toString()" :key="item.code">
              {{item.name}}
            </Option>
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
      <Table border :columns="columns" :data="aProductListData"></Table>

      <div class="pages">
        <Page :current="iCurrentPage" :page-size="10" :total="iTotal" @on-change="fnPagination"></Page>
      </div>
    </div>
    <Modal
      v-model="bProductDtlModal"
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
                  <FormItem prop="title">
                    <Input
                      style="width: 100%;"
                      v-model="formValidate.title"
                      placeholder="请输入名称"
                      class="text_input"
                    />
                  </FormItem>
                </div>
              </div>

              <div class="flex_row form_row">
                <div class="form_label">类型</div>
                <div class="flex1 form_item">
                  <FormItem prop="typeCode">
                    <Select v-model="formValidate.typeCode">
                      <Option v-for="item in aProductTypeList" :value="item.code.toString()" :key="item.code">
                        {{item.name}}
                      </Option>
                    </Select>
                  </FormItem>
                </div>
              </div>

              <div class="flex_row form_row">
                <div class="form_label">文章链接</div>
                <div class="flex1 form_item">
                  <FormItem prop="linkUrl">
                    <Input
                      style="width: 100%;"
                      v-model="formValidate.linkUrl"
                      placeholder="请输入链接"
                      class="text_input"
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
                <div class="form_label">简介</div>
                <div class="flex1 form_item">
                  <FormItem prop="content">
                    <Input
                      style="width: 100%;"
                      v-model="formValidate.content"
                      placeholder="请输入简介"
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
          @click="fnSaveProduct"
        >保存</Button>
      </div>
    </Modal>
    <del-modal
      :o-del-info="oDelModalInfo"
      s-url="backstageC/removeArticle"
      :fn-callback="fnGetProductList"
      ref="delModal"
    ></del-modal>
  </div>
</template>

<script>
import util from '../libs/util'
import { BASEURL } from '../libs/util'
import axios from 'axios'
import DelModal from '../components/delModal'
import Uploader from '../components/uploader'
export default {
  name: 'teach',
  inject: ['app'],
  components: {
    DelModal,
    Uploader,
  },
  data() {
    return {
      baseUrl: BASEURL,
      modal_loading: false,
      oQueryInfo: {
        title: '',
        createDateQ: '',
        createDateZ: '',
        columnId: 1,
      },
      iCurrentPage: 1,
      iTotal: 0,
      aProductListData: [],
      aProductTypeList: [],
      columns: [
        {
          title: "名称",
          key: "title"
        },
        {
          title: "分类",
          key: "typeCode",
          render: (h, p) => {
            let curStr = ''
            if (this.aProductTypeList.length !== 0) {
              curStr = this.aProductTypeList.find(ele => {
                return ele.code === p.row.typeCode
              }).name
            }
            return h(
              'p',
              {},
              curStr)
          }
        },
        {
          title: "发布时间",
          key: "createDate"
        },
        {
          title: "删除",
          key: "delete",
          render: (h, p) => {
            return h(
              "Button",
              {
                props: {
                  type: 'error',
                  size: 'small',
                },
                on: {
                  click: () => {
                    this.fnShowDelModal(p) 
                  }
                }
              },
              "删除"
            ) 
          }
        },
        {
          title: "详情",
          key: "detail",
          render: (h, p) => {
            return h(
              "span",
              {
                attrs: {
                  class: "blue_btn_table ripple_box"
                },
                on: {
                  click: () => {
                    this.fnShowProductDtlModal(p) 
                  }
                }
              },
              "详情"
            ) 
          }
        }
      ],
      bProductDtlModal: false,
      oDelModalInfo: {
        id: ""
      },
      formValidate: {
        columnId: 1,
        title: '',
        linkUrl: '',
        content: '',
        typeCode: '',
        pic: [],
      },
      ruleValidate: {
        title: [{ required: true, message: "请填写标题", trigger: "blur" }],
        typeCode: [{ required: true, message: "请选择类型", trigger: "change" }],
        linkUrl: [{ validator: function(rule, value, callback) {
          if (!value) {
            callback(new Error('请输入文章链接'))
          } else if(!/^https?:\/\/.*/.test(value)) {
            callback(new Error('必须以http://或https://开头'))
          } else {
            callback()
          }
        }, trigger: "blur" }],
        content: [{ required: true, message: "请填写简介", trigger: "blur" }],
        pic: [{ required: true, type: "array", message: "请上传封面", trigger: "change" }],
      },
    } 
  },
  //加载组件时发出请求
  created: function() {
    this.fnGetProductList()
    this.fnGetProductTypeList()
  },
  methods: {
    fnGetProductList() {
      return axios
        .post("backstageC/searchArticles", {
          currentpage: this.iCurrentPage,
          pageSize: 10,
          param: {
            ArticleVo: this.oQueryInfo
          }
        })
        .then(res => {
          this.aProductListData = [...res.data.rows] 
          this.iTotal = res.data.total 
        })
        .catch(console.log) 
    },
    fnSaveProduct(name) {
      util.fnValidateInfo.call(this, 'modal_loading').call(this, 'formValidate')
        .then(res => {
          this.formValidate.columnId = '1'
          // 如果id是空数组，就说明是新建的，如果不是，就是修改的
          return axios.put(this.formValidate.id ? 'backstageC/modifyArticle': 'backstageC/newArticle', this.formValidate)
        })
        .then(res => util.fnHandleSuccess.call(this, res)('iCurrentPage'))
        .then(res => {
          this.resetFields()
        })
        .then(res => util.fnCloseAndLoading.call(this, 'bProductDtlModal').call(this, 'modal_loading'))
        .then(res => {
          this.fnGetProductList()
        })
        .catch(err => {
          util.fnHandleError.call(this, err)().call(this, 'modal_loading')
        })
    },
    fnGetProductDtl(params) {
      axios.post("backstageC/searchArticleDetail", { id: params.row.id })
        .then(res => {
          //由于服务器返回的图片详情的数据格式与本地上传的数据格式不一样，所以需要处理
          this.formValidate = Object.assign({}, res.data)
          this.formValidate.pic && this.formValidate.pic.forEach(ele => {
            ele.status = 'finished'
          })
          this.$nextTick(() => {
            this.$refs.multiImage.setFiletoRef()
          })
        })
        .catch(err => {
          console.log('fuck')
        })
    },
    fnGetProductTypeList() {
      axios.post("backstageBaseDateC/searchDic", {
        type: 'flType',
        pcode: '15',
        status: true
      })
        .then(res => {
          this.aProductTypeList = res.data
        })
        .catch(err => {
          console.log('fuck')
        })

    },
    resetFields() {
      // 在这里reset而不是在fnShowProductDtlModal里面做的原因，是因为在fnShowProductModal里面做的话
      this.$refs.formValidate.resetFields()
      // 如果没有点击保存就直接取消了，但是图片已经上传了，就需要调接口清理图片，有id的就说明已经与表单关联了，需要删除的是没有id的
      // 下面的判断是为了排除点击保存的时候也去删除刚刚上传的图片
      // 因为当前的Modal的逻辑，点击保存也会触发取消事件来隐藏对话框的，所以这个情况需要排除
      if (!this.modal_loading) {
        this.$refs.multiImage.clear(true)
      }
      //清空已上传详情图片，clearFiles方法会造成无法继续上传图片
      // 不能用length = 0的方式清空，没有响应式特性，虽然数据清空了，但是页面上显示的东西没有变化
      this.$refs.multiImage.clear()
      this.formValidate = util.clear(this.formValidate)
    },
    fnShowDelModal(params) {
      this.$refs.delModal.bDel = true
      this.oCurDelProduct = Object.assign({}, params)
      this.oDelModalInfo.id = params.row.id
    },
    fnShowProductDtlModal(params) {
      if (params) {
        this.fnGetProductDtl(params)
      }
      this.bProductDtlModal = true
    },
    fnGetListByTime(time) {
      this.oQueryInfo.createDateQ = time[0]
      this.oQueryInfo.createDateZ = time[1]
      this.fnGetProductList()
    },
    //分页
    fnPagination(page) {
      this.iCurrentPage = page
      this.fnGetProductList()
    },
    fnGetFormDate(time) {
      this.formValidate.createDate = time
    },
    handleSuccessUpload(url) {
      // 由于这个上传图片的地方没有通过axios，是iview组件自己的
      // 所以axios的拦截器也没有用了，所以需要在这里单独加一个跳转的
      if (typeof url === 'string' && url.indexOf('loginTimeOut') !== -1) {
        this.$router.push('login')
      }
    }
  }
} 
</script>