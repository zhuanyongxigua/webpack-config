import * as myself from './util'

export default Object.assign(isOBJByType, myself)

// export const BASEURL = process.env.NODE_ENV === 'development' ? 'http://11wdkj.com/ylfx' : '../'
export const BASEURL = process.env.NODE_ENV === 'development' ? 'http://114.116.10.56:8080/ylfx' : '../'
// export const BASEURL = env === 'development' ? 'http://192.168.1.68/ylfx' : '../'

export function isOBJByType(o, type) {
  return Object.prototype.toString.call(o) === "[object " + (type || "Object") + "]"
}
// 
export function title(title) {
  title = title ? title + ' - Home' : 'iView project'
  window.document.title = title
};

/*iview表单验证，柯里化（闭包），先使iview的modal的loading效果加载（用于自定义modal footer的情况），返回一个会返回Promise对象的函数
* 调用方法：1.如果iview的modal的footer是自定义，
*         则util.fnValidateInfo.call(this, 'modal_loading').call(this, name)，
*         最后的一个参数那么是使用iview表单时自定义的formValidate对象的key，是一个字符串，如’formValidate‘；
*         2.如果iview的modal的footer未自定义，
*         则util.fnValidateInfo().call(this, name)
* */
export function fnValidateInfo(_modal_loading) {
  if (_modal_loading) {
    this[_modal_loading] = true
  }
  return function(name) {
    return new Promise((resolve, reject) => {
      this.$refs[name].validate(valid => valid ? resolve(true) : reject('noHint'))
    });
  }
}

export function fnHandleSuccess(res) {
  if (res.data.success) {
    this.$Message.success('操作成功')
    return iCurPageNum => this[iCurPageNum] = 1
  }
  return () => Promise.reject(res.data.message)
}

export function fnHandleError(err) {
  if (err !== 'noHint') {
    err ? this.$Message.error(err) : this.$Message.error('操作失败')
  }
  function a(param) {
    this[param] = !this[param];
    setTimeout(() => this[param] = !this[param], 0)
    function cancelLoading(_modal_loading) {
      this[_modal_loading] = false
    }
    return cancelLoading
  }
  return a.bind(this)
}

export function fnCloseAndLoading(_bModal) {
  setTimeout(() => this[_bModal] = false, 1000)
  function cancelLoading(_modal_loading) {
    setTimeout(() => this[_modal_loading] = false, 1000)
  }
  return cancelLoading
}

//涟漪
export function addRippleEffect(e) {
  var target = e.target
  if(target.className.indexOf("ripple_box") !== -1) {} else return false
  var rect = target.getBoundingClientRect()
  var ripple = target.querySelector('.ripple')
  if(!ripple) {
    ripple = document.createElement('span')
    ripple.className = 'ripple'
    ripple.style.height = ripple.style.width = Math.max(rect.width, rect.height) + 'px'
    target.appendChild(ripple)
  }
  ripple.classList.remove('show')
  var top = e.pageY - rect.top - ripple.offsetHeight / 2 - document.body.scrollTop
  var left = e.pageX - rect.left - ripple.offsetWidth / 2 - document.body.scrollLeft
  ripple.style.top = top + 'px'
  ripple.style.left = left + 'px'
  ripple.classList.add('show')
  return false
}

export function formatDate(date) {
  date = new Date(date)
  return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
}


export function clear(obj) {
  let temp = Object.assign({}, obj)
  Object.keys(temp).forEach(key => {
    if (isOBJByType(temp[key], 'Array')) {
      temp[key] = []
    } else if (isOBJByType(temp[key], 'Object')) {
      temp[key] = {}
    } else {
      temp[key] = ''
    }
  })
  return temp
}