<style scoped>
.text_input {
  width: 200px;
  margin-right: 0px;
  border-radius: 4px 0px 0px 4px;
}
.item_box .table_top {
  text-align: left;
}
.top-text {
  text-align: right;
}
</style>
<template>
  <div class="item_box">
    <div class="top-text" v-html="'总用户数量：' + total + '&nbsp;&nbsp;&nbsp;&nbsp;' + '今日签到：' + curTotalSigns"></div>
    <Table
      style="margin-top: 10px;"
      border
      :columns="columns"
      :data="users"
      @on-sort-change="fnSort"
    ></Table>

    <div class="pages">
      <Page :current="iCurrentPage" :page-size="10" :total="iTotal" @on-change="fnPagination"></Page>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import util from "../libs/util";
export default {
  name: 'usersInfo',
  inject: ["app"],
  data() {
    return {
      iCurrentPage: 1,
      iTotal: 0,
      oQueryInfo: {
        username: "",
        regDateQ: "",
        regDateZ: "",
        orderByColum: "sign_num",
        orderMode: "desc"
      },
      columns: [
        {
          title: "昵称",
          key: "username"
        },
        {
          title: "头像",
          key: "iconUrl",
          align: 'center',
          render(h, params) {
            return h('img', {
              attrs: {
                src: params.row.iconUrl
              },
              style: {
                width: '40px',
                height: '40px'
              }
            })
          }
        },
        {
          title: "ID",
          key: "loginId"
        },
        {
          title: "签到",
          key: "signNum",
          sortable: "custom",
          sortType: 'desc'
        },
        {
          title: "积分",
          key: "credit",
        },
        {
          title: "等级",
          key: "gradeName",
        },
        {
          title: "省份",
          key: "province",
        },
        {
          title: "城市",
          key: "city",
        },
        {
          title: "关注来源",
          key: "subscribeSceneStr",
        },
      ],
      curTotalSigns: 0,
      total: 0,
      users: []
    };
  },
  created() {
    this.fnGetUserInfoList();
  },
  methods: {
    fnGetUserInfoList() {
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('div', {
              domProps: {
                innerText: '加载中...'
              },
              style: {
                fontSize: '25px'
              }
            })
          ])
        }
      });
      axios
        .post("backstageC/searchUsers", {
          currentpage: this.iCurrentPage,
          pageSize: 10,
          param: {
            UserVo: this.oQueryInfo
          }
        })
        .then(res => {
          if (res.data.param) {
            this.users = JSON.parse(JSON.stringify(res.data.rows));
            this.curTotalSigns = res.data.param.signNum
            this.total = res.data.total
            this.iTotal = res.data.total;
          }
          this.$Spin.hide();
        })
        .catch(console.log);
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
    //排序
    fnSort(e) {
      // this.oQueryInfo.sortStr = e.column.key2 + (e.order === "desc" ? " desc" : "");
      this.oQueryInfo.orderMode = e.order === "desc" ? " DESC" : "ASC"
      this.fnGetUserInfoList();
    }
  }
};
</script>