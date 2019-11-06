<style>

</style>
<template>
  <div>
    <div v-if="upType === 'image'">
      <div class="demo-upload-list" v-for="item in files" :key="item.url">
        <template v-if="item.status === 'finished'">
          <img :src="baseUrl + '/' + item.url" />
          <div class="demo-upload-list-cover">
            <Icon
              type="ios-trash-outline"
              @click.native="handleRemove(item)"
            ></Icon>
          </div>
        </template>
        <template v-else>
          <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
        </template>
      </div>
      <Upload
        multiple
        ref="uploader"
        type="drag"
        name="filename"
        :accept="accept"
        :format="format"
        :on-format-error="handleFormatError"
        :max-size="maxSize"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccessUpload"
        :action="baseUrl + uploadUrl"
        style="display: inline-block;width:58px;"
        :show-upload-list="false"
      >
        <div style="width:58px;height:58px;line-height:58px;">
          <Icon type="ios-camera" size="20"></Icon>
        </div>
      </Upload>
    </div>
    <div v-else>
      <Upload
        multiple
        ref="uploader"
        type="drag"
        name="filename"
        :accept="accept"
        :format="format"
        :on-format-error="handleFormatError"
        :max-size="maxSize"
        :on-exceeded-size="handleMaxSize"
        :before-upload="handleBeforeUpload"
        :on-success="handleSuccessUpload"
        :action="baseUrl + uploadUrl"
        :on-remove="handleRemove"
      >
        <div style="padding: 5px 0;">
          <Icon type="ios-cloud-upload" size="30" style="color: #3399ff;"></Icon>
          <p>点击或将文件拖拽到这里上传</p>
        </div>
      </Upload>
    </div>
  </div>
</template>
<script>
import util from '../libs/util'
import axios from 'axios'
export default {
  name: 'uploader',
  props: {
    upType: {
      type: String,
      default: 'image'
    },
    value: {
      required: true,
      type: Array
    },
    format: {
      type: Array,
      default: function() {
        return []
      }
    },
    uploadUrl: {
      required: true
    },
    accept: {
      type: String,
      default: ''
    },
    deleteUrl: {
      type: String,
      default: ''
    },
    baseUrl: {
      type: String,
      defalut: ''
    },
    onSuccess: {
      type: Function,
      default: function() {
        return null
      }
    },
    maxSize: {
      type: Number,
      default: 20480000
    },
    overMaxSizeMessage: {
      type: String,
      default: '文件不能超过2000M'
    },
    num: {
      type: Number,
      default: 100
    },
    overNumMessage: {
      type: String,
      default: '文件只能上传100个'
    },
    // 这个是更具体的业务逻辑需要
    // 现在服务端订下的有五种文件类型：
    // 1图片，2音频，3视频，4头像，5文件
    fileType: {
      type: Number,
      default: 5
    },
    // 这个是在上传成功的回调里面去掉表单验证的红色提示文字用的
    // 就是表单的ref的那个key
    formRefName: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      // 这里分开两个的目的是，防止用户上传的太快导致在整理信息之后，后一个就覆盖了前一个的数据
      curFile: {},
      // 这个与formValidate里面的存放图片的字段分开的原因是
      // 这里需要与ref里面的fileList联起来，但是fileList里面的数据与服务器需要的数据格式不一样
      // 用了fileList里面的数据，在上传的时候，页面上才能显示上传进度
      files: []
    }
  },
  created() {
  },
  mounted() {
    this.files = this.$refs.uploader.fileList
  },
  computed: {
  },
  methods: {
    handleBeforeUpload(sCurMediaType) {
      this.curFile.kind = sCurMediaType.name.split('.')[1]
      this.curFile.name = sCurMediaType.name
      // 其实这里也不用这个参数，图片一般都是1，直接写死也可以
      this.curFile.type = this.fileType
      const checkNum = this.$refs.uploader.fileList.length < this.num
      if (!checkNum) {
        this.$Message.error(this.overNumMessage)
        return checkNum
      }
    },
    handleSuccessUpload(url = '', file = {}, fileList = []) {
      if (this.onSuccess) {
        this.onSuccess(url)
      }
      //图片的路径在pathId，视频的路径在path
      let curData = {}
      curData.url = file.response
      // 这一句的目的是为了上传之后可以显示图片，不直接用response的原因是后台返回的图片的路径不在response这个字段里面，所以为了通用，这里就添加一个url
      file.url = file.response
      curData.kind = this.curFile.kind
      curData.name = this.curFile.name
      curData.type = this.curFile.type
      //为使图片的验证提示与表单验证提示风格一致，手动改写formValidate
      //在编辑的时候，查到的的数据直接放到了formValidate中，而服务器返回的formValidate中的pic可能会是null，这是去push就会报错了。
      this.$emit('input', this.value.concat(curData))
      // 用于消除表单中上传部分的已经出现的红色的错误提示
      // 如果已经出现了验证失败的红字，则消除，没有则不操作
      // 如果红字没有出现的话，说明现在是正常的上传的状态，不需要去做表单验证
      // 如果出现了红字的话，说明表单验证失败过，而这个提示用表单的reset方法无法除去，所以这里自己处理一下
      // 注意这个钩子，是再每次上传成功之后
      if (Object.keys(document.getElementsByClassName("ivu-form-item-error-tip")).length !== 0) {
        let parent = this.$parent
        // 这个组件一般都是放在Modal组件里面的表单组件里面的
        // 所以只要找到了Modal组件，在向上找一次就找到目标了
        while (parent && parent.$options._componentTag !== 'Modal') {
          parent = parent.$parent
        }
        parent.$parent.$refs[this.formRefName].validate(valid => {})
      }
    },
    handleRemove(file) {
      // 从 upload 实例删除数据
      // 如果file的length属性等于0，说明是从封面或视频的Upload组件进来的，这时的sCurMode其实就是file，而第二个参数啥也不是，
      // 封面和视频绑定的方法是v-bind，而不是事件的@，仅仅就是把整个函数体传到了Upload组件中，无法带参数，返回的第一个参数是默认的。
      if (file.length === 0) {
        //这里就是视频了
        let curIndex = this.value.findIndex(ele => ele.url == sCurMode.url)
        if (!('id' in sCurMode)) this.deleteFile(sCurMode.url)
        let value = this.value.slice()
        value.splice(curIndex, 1)
        this.$emit('input', value)
      } else {
        // 这个是详情图片。
        let fileList = this.$refs.uploader.fileList
        this.$refs.uploader.fileList.splice(fileList.indexOf(file), 1)

        let value = this.value.slice()
        value.splice(value.indexOf(file), 1)
        this.$emit('input', value)
        //由于服务器返回的图片详情的数据格式与本地上传的数据格式不一样，所以删除操作需要判断，新建时的file中有response属性
        if ("response" in file) {
          this.deleteFile(file.response.pathId)
        }
      }
    },
    // 正常情况下这个东西不应该封装进来，因为依赖了axios和util，有耦合
    // 但是由于使用的很多，还是捏着鼻子拿进来了
    deleteFile(id) {
      axios.delete(this.deleteUrl, {
          data: {fileId: id}
        })
        .then(res => util.fnHandleSuccess.call(this, res)())
        .catch(util.fnHandleError.bind(this)) 
    },
    handleFormatError(file) {
      this.$Message.error("上传文件格式不正确") 
    },
    handleMaxSize(file) {
      this.$Message.error(this.overMaxSizeMessage)
    },
    // 这个是父级点击详情的时候调用的，需要使用this.$refs.uploadFile.setFiletoRef()调用
    // 否则组件里面无法识别父级是点击的新增还是详情
    setFiletoRef() {
      // 这个push方法不能用Array.prototy里面的，因为没有响应式更新特性，vue里面的push都是被重写的
      this.$refs.uploader.fileList.push.apply(this.$refs.uploader.fileList, this.value)
    },
    clear(isRequest) {
      if (isRequest) {
        // 如果是从接口查回来的图片是有id的，这个时候Modal取消了也不需要删除
        // 如果是刚刚上传的图片，由于还没有与表单数据结合，所以还没有id
        // 这个时候点击取消就需要删除这个图片
        this.$refs.uploader.fileList.forEach(ele => ele && !ele.id && this.deleteFile(ele.url))
      }
      this.$refs.uploader.fileList.splice(0)
    }
  }
}
</script>