/* @flow */
// 全局配置
import config from "../config";
// Vue.use()方法入口
import { initUse } from "./use";
// Vue.mixin 入口
import { initMixin } from "./mixin";
// Vue.extend 入口
import { initExtend } from "./extend";
// Vue.component()
// Vue.directive()
// Vue.filter()三个方法入口
import { initAssetRegisters } from "./assets";
// Vue.set,Vue.delete入口
import { set, del } from "../observer/index";

import { ASSET_TYPES } from "../../shared/constants";
// keep-alive
import builtInComponents from "../components/index";
// Vue.observable( object ) 入口
import { observe } from "../../core/observer/index";

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive,
} from "../util/index";

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {};
  configDef.get = () => config;
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      );
    };
  }
  Object.defineProperty(Vue, "config", configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  // 泛型T
  Vue.observable = <T>(obj: T): T => {
    observe(obj);
    return obj;
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach((type) => {
    Vue.options[type + "s"] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  // 定义_base构造器用来创建一个“子类”
  Vue.options._base = Vue;
  // 合并对象,全局组件keep-alive
  extend(Vue.options.components, builtInComponents);
  // 绑定use
  initUse(Vue);
  // 绑定mixin
  initMixin(Vue);
  // 绑定extend
  initExtend(Vue);
  //绑定'component', 'directive', 'filter'
  initAssetRegisters(Vue);
}
