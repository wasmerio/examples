# Working agreement

先读 docs/SPEC.md（唯一产品契约），再读 CONTEXT.md 与 docs/ARCHITECTURE.md。

- 项目定位是极简静态博客；不要加入 SPEC 的非目标。原生平台能力优先。
- 文档与代码在同一改动中同步。SPEC 决定行为；ARCHITECTURE 只描述当前有效机制。
- 每条业务规则只有一个 authority。页面调用它，不重新实现 draft、日期或排序。
- 使用系统字体、原生 HTML/CSS 和少量渐进增强。不增加单次使用抽象、框架、构建插件或不必要依赖。
- 测试覆盖发布规则和真实构建 HTML。不能用源代码字符串匹配代替行为测试。
- 完成前运行仓库定义的 check、format、test 和 build。不把未执行的检查报告为通过。
