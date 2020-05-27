/* @flow */
/**
 * ASSET_TYPES:['component', 'directive', 'filter' ]
 */
import { ASSET_TYPES } from "shared/constants";
import { isPlainObject, validateComponentName } from "../util/index";

export function initAssetRegisters(Vue: GlobalAPI) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach((type) => {
    Vue[type] = function (
      id: string,
      definition: Function | Object
    ): Function | Object | void {
      // 如果没有传,检查是否当前组件内声明了子类
      if (!definition) {
        return this.options[type + "s"][id];
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== "production" && type === "component") {
          // 检查组件名
          validateComponentName(id);
        }
        if (type === "component" && isPlainObject(definition)) {
          // 如果组件内部定义了name就使用组件内部定义的,否则使用 传入的那个名称
          definition.name = definition.name || id;
          // this.options._base.extend(definition) 等同于 Vue.extend(definition)
          // Vue.extend 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。
          // definition是一个Vue子类
          definition = this.options._base.extend(definition);
        }
        if (type === "directive" && typeof definition === "function") {
          definition = { bind: definition, update: definition };
        }
        // 举个例子,如果是我们的button按钮,走到这一步的时候,在Vue.options上是:
        // {
        //   components:{
        //     myButton:Button;
        //   }
        // }
        // 这个是在Vue原型链上,所以我们在所有地方都能直接使用我们的<myButton></myButton>
        // definition是个class
        this.options[type + "s"][id] = definition;
        // 返回的是组件类
        return definition;
      }
    };
  });
}
