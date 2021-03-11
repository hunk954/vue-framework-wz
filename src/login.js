import router, {asyncRouterMap} from './router'
import store from './store'
import vue from 'vue'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式

// permissiom judge
function hasPermission(roles, permissionRoles) {
  if (roles.indexOf('admin') >= 0) return true // admin权限 直接通过
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

// register global progress.
const whiteList = ['/login', '/authredirect', '/register']// 免登录白名单

router.beforeEach((to, from, next) => {
  NProgress.start() // 开启Progress，进度条刷新
  // 判断是否为登录态
  // 如果不是，则只能进入白名单网站
  // 如果是， 对于login或者register就会直接进入 / 页
  // 其他的要先找到对应的路由
  if (store.getters.token) { // 判断是否有token
    if (to.path === '/login' || to.path === '/register') {
      next({ path: '/' })
      NProgress.done()
    } else {
      console.log("store.getters.roles.length: ", store.getters.roles.length);
      console.log("store.getters.role: ", store.getters.roles);
      console.log("to.path: ", to.path);
      console.log("store.getters: ", store.getters);
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          // 这个res就是一堆数据
          console.log("getinfo res: ", res);
          const roles = res.data.role

          store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to }) // hack方法 确保addRoutes已完成
          })
        }).catch(err => {
          console.log("fed err: ", err);
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/login' })
          })
        })
      } else {
        store.dispatch('getNowRoutes', to);
        if (hasPermission(store.getters.roles, to.meta.role)) {
          next()//
          console.log("has userinfo")
        } else {
          next({ path: '/', query: { noGoBack: true }})
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done() // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
