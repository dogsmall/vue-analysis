/* @flow */

import { parse } from './parser/index'
import { optimize } from './optimizer'
import { generate } from './codegen/index'
import { createCompilerCreator } from './create-compiler'

// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.

//`createCompilerCreator`允许创建使用替代方法的编译器
//解析器/优化器/代码生成，例如SSR优化编译器。
//这里，我们只是使用默认部分导出默认编译器。

// 函数柯里化-把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 编译器的编译原理大多分为三个阶段: 解析、转换以及代码生成
  // 解析 生成抽象语法树(AST)
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    // 静态
    optimize(ast, options)
  }
  // 代码生成
  // 生成 render
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
