---
title: 在构建blog中遇见的问题!
date: 2024-06-28
updated: 2024-06-28
categories: Valaxy 笔记
tags:
  - valaxy
  - 笔记
top: 2
---


#### 搭建博客的选择

>https://segmentfault.com/a/1190000011661576#item-2-2

上面链接的博主给出了较为详细的说明


#### 关于每台电脑配置ssh的问题

>https://www.cnblogs.com/yessn/p/16295806.html


#### 关于git与远程库操作的网络问题
- 将代理的端口添加至git中

#### 关于短代码的问题
类似于之前的问题，`tweet-single` 短代码模板没有找到。你需要为 `tweet-single` 创建一个短代码模板。

以下是解决方法的步骤：

##### 1. 创建短代码模板

在你的 Hugo 项目目录下，导航到 `layouts/shortcodes` 目录。如果这个目录不存在，请创建它。接着，在这个目录中创建一个名为 `tweet-single.html` 的文件。

sh

Copy

```
mkdir -p layouts/shortcodes
touch layouts/shortcodes/tweet-single.html
```

##### 2. 定义短代码内容

在 `layouts/shortcodes/tweet-single.html` 文件中，添加你想要的嵌入推文的 HTML 代码。例如，你可以使用 Twitter 提供的嵌入代码：

html

Copy

```
<div class="tweet-single">
  {{ with .Get "id" }}
    <blockquote class="twitter-tweet">
      <a href="https://twitter.com/user/status/{{ . }}"></a>
    </blockquote>
    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  {{ end }}
</div>
```

上面的代码假设你在使用短代码时会传递一个 `id` 参数。比如：

markdown

Copy

```
{{< tweet-single id="1234567890" >}}
```

##### 3. 确认短代码引用

确保你的内容文件（如 `content/post.md` 或其他文件）中正确引用短代码，并传递适当的参数：

markdown

Copy

```
---
title: 'Example Post'
---

Here is an embedded tweet:

{{< tweet-single id="1234567890" >}}
```

##### 4. 重新生成内容并运行

保存所有更改后，重新生成内容并运行 Hugo 服务器：

sh

Copy

```
hugo server
```

现在，当你访问包含 `tweet-single` 短代码的页面时，嵌入的推文应该会正确显示。

##### 总结

错误是因为 Hugo 找不到 `tweet-single` 短代码的模板文件。通过在 `layouts/shortcodes` 目录中创建并定义 `tweet-single.html` 文件来解决这个问题。


