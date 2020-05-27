/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    // 已经被加载的不会再次加载
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters 附加参数
    // arguments是Vue.use方法的参数
    // 将arguments转换成数组,准备作为apply方法的第二个参数
    // 同时把this传到args数组第一位,就是install(Vue)的vue
    // 根据源码,vue.use()是不限制你传参数的,你可以传多个参数,在这步都会传给你插件方法或者插件install方法中 例如你可以Vue.use(izk-ui,{xxx:xxxx})
    // 为什么toArray方法的第二个参数是1,是因为plugin.install参数里面没有必要传plugin本身了 arguments其实是:[plugin,xxx,xxx],args应该是[Vue,xxx,xxx]
    const args = toArray(arguments, 1)
    args.unshift(this)
    // 插件可以是Object或者是function,所以如果是Object,并且存在install方法
    if (typeof plugin.install === 'function') {
      // 这里执行我们组件库的install方法,全局的就执行全局index.js定义的install,如果我们是单独引入的,就执行我们组件文件夹里面的index.js里面的install,这就是为什么我们再每个组件文件夹里面单独写了一个index.js,里面就一个install方法的原因
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      // 如果插件本身是一个方法的话
      // function (Vue){}
      plugin.apply(null, args)
    }
    // 把插件记下来,防止重复引入
    // object引用只改变索引
    installedPlugins.push(plugin)
    return this
  }
}
