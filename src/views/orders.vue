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
          <Option value="15">共修法本</Option>
          <Option value="16">经文诵读</Option>
          <Option value="17">智慧文库</Option>
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
                      <Option value="15">共修法本</Option>
                      <Option value="16">经文诵读</Option>
                      <Option value="17">智慧文库</Option>
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
import DelModal from '../components/delModal'
export default {
  name: 'orders',
  inject: ["app"],
  components: {
    DelModal
  },
  data() {
    return {
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
                sCurType = '共修法本'
                break;
              case '16':
                sCurType = '经文诵读'
                break;
              case '17':
                sCurType = '智慧文库'
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
        description: ''
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
        }}]
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
        this.isNew = true
      } else {
        this.isNew = false
      }
      this.bUserDetails = true
    },
    resetFields() {
      this.$refs.formValidate.resetFields()
      // 上面那个无法清除比如id这种没有在formValidate里面声明的属性，所以需要自己清除
      this.formValidate = {
        name: '',
        type: 'flType',
        pcode: '',
        sort: null,
        description: ''
      }
    },
    fnShowDelModal(params) {
      this.$refs.delModal.bDel = true
      this.oDelModalInfo.id = params.row.id
    },
  }
};
</script>