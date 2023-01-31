---
title: react踩坑
category: 分享
tags:
  - react
date: 2019-10-07
vssue-title: react踩坑
---

### 语法

当`prop`的类型不是字符串类型时，在 jsx 中必须用花括号`{}`把`prop`包住。

### JSX 回调函数中的 this

在 JavaScript 中，class 的方法默认不会绑定 this。如果你忘记绑定 this.handleClick 并把它传入了 onClick，当你调用这个函数的时候 this 的值为 undefined。  
解决方法：

1. 构造函数中绑定 this:

```js
constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
}
```

2.  public class fields 语法,`Create React App` 默认启用此语法。

```js
class LoggingButton extends React.Component {
  // 注意: 这是 *实验性* 语法。
  handleClick = () => {
    console.log("this is:", this);
  };
  render() {
    return <button onClick={this.handleClick}>Click me</button>;
  }
}
```

3. 在回调中使用箭头函数

```js
class LoggingButton extends React.Component {
  handleClick() {
    console.log("this is:", this);
  }

  render() {
    // 此语法确保 `handleClick` 内的 `this` 已被绑定。
    return <button onClick={e => this.handleClick(e)}>Click me</button>;
  }
}
```

此语法问题在于每次渲染 LoggingButton 时都会创建不同的回调函数。在大多数情况下，这没什么问题，但如果该回调函数作为 prop 传入子组件时，这些组件可能会进行额外的重新渲染。我们通常建议在构造器中绑定或使用 class fields 语法来避免这类性能问题。

### 阻止组件渲染

在极少数情况下，你可能希望能隐藏组件，即使它已经被其他组件渲染。若要完成此操作，你可以让 render 方法直接返回 null，而不进行任何渲染。  
在组件的 render 方法中返回 null 并不会影响组件的生命周期。componentDidUpdate 等事件依然会被调用。

```js
function WarningBanner(props) {
  if (!props.warn) {
    return null;
  }

  return <div className="warning">Warning!</div>;
}
```

### jsx 语法 css 样式编写

jsx 中编写 css 不能直接写成`html`或者`vue`那样的内联样式,例如：

```html
<div style="color:blue">test</div>
```

必须为对象格式：

```
<div style={{color:'blue'}}>test</div>
```

### 组件命名规范

组件名称必须以大写字母开头。
React 会将以小写字母开头的组件视为原生 DOM 标签。

## 高级指引

### Fragments

由于 React 限制，jsx 写法中必须最外层只能有一个根元素，Fragments 用来解决这个问题，创建的元素没有最外层的包裹层。

```js
render(){
  return (
    <React.Fragment>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </React.Fragment>
  )
}
```

还有一种简写方法(简写方法不支持元素属性):

```js
render(){
  return (
    <>
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </>
  )
}
```
### Portals
Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。
```js
ReactDOM.createPortal(child, container)
```
第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 fragment。第二个参数（container）是一个 DOM 元素。  
用法：
```js
render() {
  // React 并*没有*创建一个新的 div。它只是把子元素渲染到 `domNode` 中。
  // `domNode` 是一个可以在任何位置的有效 DOM 节点。
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```
一个 portal 的典型用例是当父组件有 overflow: hidden 或 z-index 样式时，但你需要子组件能够在视觉上“跳出”其容器。例如，对话框、悬浮卡以及提示框.  

尽管 portal 可以被放置在 DOM 树中的任何地方，但在任何其他方面，其行为和普通的 React 子节点行为一致。 portal 仍存在于 React 树， 且与 DOM 树 中的位置无关，这包含事件冒泡。
### 声明默认属性
无论是函数组件还是 class 组件，都拥有 defaultProps 属性：
```
const Greeting=(props)=> {
  // ...
}

Greeting.defaultProps = {
  name: 'Mary'
};

```
## HOOK
hook的本质是闭包，例如：
```
let state = null;

export const useState = (value: number) => {
  // 第一次调用时没有初始值，因此使用传入的初始值赋值
  state = state || value;

  function dispatch(newValue) {
    state = newValue;
    // 假设此方法能触发页面渲染
    render();
  }

  return [state, dispatch];
}
```
根据闭包的特性，state模块中的state变量，会持久存在。因此当Demo函数再次执行时，我们也能获取到上一次Demo函数执行结束时state的值。

这就是React Hooks能够让函数组件拥有内部状态的基本原理。


### useState
根据闭包的原理，useState返回值引用是不变的，除非setState新值。  
React 会确保 setState 函数的标识是稳定的，并且不会在组件重新渲染时发生变化。这就是为什么可以安全地从 useEffect 或 useCallback 的依赖列表中省略 setState。
### useEffect
1. useEffect可以通过返回一个函数来清除上一次useEffect中的副作用，也就是说每一次渲染都会执行（取决于是否提供第二个参数）
1. useEffect或其他依赖第二个参数的hook，如果在内部引用了没有被依赖的变量，那么取到的值是不变的。
1. 在useEffect中优雅的使用fetch
```js
  // 注意 async 的位置
  // 这种写法，虽然可以运行，但是会发出警告
  // 每个带有 async 修饰的函数都返回一个隐含的 promise
  // 但是 useEffect 函数有要求：要么返回清除副作用函数，要么就不返回任何内容
  useEffect(async () => {
    const result = await axios(
      'https://hn.algolia.com/api/v1/search?query=redux',
    );
    setData(result.data);
  }, []);
```
更优雅的写法
```js
 useEffect(() => {
    // 更优雅的方式
    const fetchData = async () => {
      const result = await axios(
        'https://hn.algolia.com/api/v1/search?query=redux',
      );
      setData(result.data);
    };
    fetchData();
  }, []);
```
### useLayoutEffect
与useEffect基本一致，但是layout为同步执行，执行时机比useEffect早。一般用作操作dom，会导致延迟渲染。  
使用场景：合并渲染。  
### useMemo
缓存值，依据传入的依赖数组判断是否需要更新

不要过度依赖 `useMemo`
`useMemo` 本身也有开销。`useMemo` 会「记住」一些值，同时在后续 `render` 时，将依赖数组中的值取出来和上一次记录的值进行比较，如果不相等才会重新执行回调函数，否则直接返回「记住」的值。这个过程本身就会消耗一定的内存和计算资源。因此，过度使用 useMemo 可能会影响程序的性能。  
在使用 useMemo 前，应该先思考三个问题：
- 传递给 useMemo 的函数开销大不大？ 
- 返回的值是原始值吗？如果计算出来的是基本类型的值（string、 boolean 、null、undefined 、number、symbol），那么每次比较都是相等的，下游组件就不会重新渲染；如果计算出来的是复杂类型的值（object、array），哪怕值不变，但是地址会发生变化，导致下游组件重新渲染。所以我们也需要「记住」这个值。
- 在编写自定义 Hook 时，返回值一定要保持引用的一致性。 因为你无法确定外部要如何使用它的返回值。如果返回值被用做其他 Hook 的依赖，并且每次 re-render 时引用不一致（当值相等的情况），就可能会产生 bug。所以如果自定义 Hook 中暴露出来的值是 object、array、函数等，都应该使用 useMemo 。以确保当值相同时，引用不发生变化。

### useCallback
相比于useMemo，useCallback应当作为最佳实践广泛使用。当然useCallback也是有性能损耗的，对于轻量级的组件可以不使用。 
useCallback中的函数由于闭包的原因，引用的一直是创建时候的外部上下文，所以props和state等需要放进第二个参数中。
#### 使用场景
1. 防止组件重新渲染
1. removeEventListener
### useMemo和useCallback区别
- 相同点：useMemo和useCallback接收的参数都是一样，都是在其依赖项发生变化后才执行，都是返回缓存的值，保持引用不变，即使传递给子组件也会保持引用不变。
- 不同点：区别在于useMemo返回的是函数运行的结果，useCallback返回的是函数。
```js
useCallback(fn, deps) === useMemo(() => fn, deps)
```
### react hook踩坑大全
1. 不要在setState中直接用`Object.assign(obj,{name:1})`这种来赋值，应该返回一个新对象
1. 不要在`useCallback和useMemo`中做逻辑相关操作，因为`useCallback和useMemo`的缓存操作是不稳定的，有可能失效
### 参考
1. [useMemo & useCallback 指北](https://cloud.tencent.com/developer/article/1496713)
1. [精读《React Hooks 最佳实践》](https://github.com/dt-fe/weekly/blob/v2/120.%E7%B2%BE%E8%AF%BB%E3%80%8AReact%20Hooks%20%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E3%80%8B.md)
1. [超性感的React Hooks（二）再谈闭包
](https://juejin.im/post/6844904006079217672)
## 类型检查

安装`PropTypes`:`npm install prop-types`  
引入：`import PropTypes from 'prop-types';`  
使用：

```html
const Button = ({ onClick, className = "", children }) => (
<button onClick="{onClick}" className="{className}" type="button">
  {children}
</button>
); Button.propTypes={ onClick:PropTypes.func, className:PropTypes.string,
children:PropTypes.node }
```

基础的基本类型核复杂对象`PropTypes`有：

- PropTypes.array
- PropTypes.bool
- PropTypes.func
- PropTypes.number
- PropTypes.object
- PropTypes.string

此外，有另外两个 PropTypes 用来定义一个可渲染的片段（节点）。比如一段字符串，或者
一个 React 元素。

- PropTypes.node
- PropTypes.element

定义一个必传的属性：

```html
Button.propTypes={ onClick:PropTypes.func.isRequired, }
```

对数组更详细的定义：

```js
Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
};
```

设置默认值：

```js
Button.defaultProps = {
  className: ""
};
```

> 引用：[使用 PropTypes 进行类型检查](https://zh-hans.reactjs.org/docs/typechecking-with-proptypes.html)

## 事件

1. React 传递给事件处理函数的参数是合成事件（SyntheticEvent），如果想要使用浏览器底层的事件，可以使用原生事件`nativeEvent`
1. React 事件是天生的事件代理，看起来事件散落在元素上，其实 React 仅仅在根元素绑定事
   件，所有事件通过事件代理响应。

### 向事件处理程序传递参数

在循环中，通常我们会为事件处理函数传递额外的参数。例如，若 id 是你要删除那一行的 ID，以下两种方式都可以向事件处理函数传递参数：

```html
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

上述两种方式是等价的，分别通过`箭头函数`和 `Function.prototype.bind` 来实现。  
在这两种情况下，React 的事件对象 e 会被作为第二个参数传递。如果通过箭头函数的方式，事件对象必须显式的进行传递，而通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递。

## 性能优化&最佳实践

1. `propTypes`类型检查在生产环境是没有必要的，会造成额外的性能消耗，在生产环境中应该移除。可以通过使用`babel-react-optimize`插件来完成
1. 组件渲染之前，通过`shouldComponentUpdate`事件判断是否需要渲染，节省性能开销。
1. `React.PureComponent`，始终在`shouldComponentUpdate()`事件中进行对象的`浅比较`，仅在你的 `props` 和 `state` 较为简单时，才使用 `React.PureComponent`
1. 函数组件可以使用`React.memo`防止组件`re-render`,需要注意被缓存组件prop中不要有对象,这样会导致每次都`re-render`，如果为对象可以使用`useMemo和useCallback`来保存住对象，使每次比较都相等。
1. 无状态组件的前提下，函数式组件性能比 class 组件好
1. 不涉及到更新 UI 的数据都不需要放到`state`中
1. 不要在render中的组件上绑定箭头函数，会在每次组件渲染时创建一个新函数，会破坏基于恒等比较的性能优化(导致每次组件渲染时子组件都要重新渲染，哪怕该子组件没有实质上的变化)
### React Hook
1. 将函数式组件中的匿名函数提取出来，在函数式组件前部声明。将一些直接赋给子组件的magic number提取出来，在前部声明为常量。
1. 检查组件前部声明的值和函数，对于不依赖组件内部数据的，直接提取到组件外部。
1. 依赖组件内部数据的值和函数，使用useMemo和useCallback进行封装。
1. 安装`eslint-plugin-react-hooks`插件,并配置
- "react-hooks/rules-of-hooks": "error", // 检查 Hook 的规则
- "react-hooks/exhaustive-deps": "warn" // 检查 effect 的依赖
## 调试

1. 始终在应用最外层嵌套`React.StrictMode`严格模式（待确定）
2. 安装该包提示你为什么组件重新渲染：https://github.com/welldone-software/why-did-you-render

## react-router

基本示例：

```
import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/topics">Topics</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);
```

自动重定向：

```diff
 return (
      <div>
        <ul>
          <li>
            <Link to="/home">首页</Link>
          </li>
          <li>
            <Link to="/article">文章</Link>
          </li>
          <li>
            <Link to="/users">用户</Link>
          </li>
        </ul>
        <Route component={Home} path="/home" />
        <Route component={Article} path="/article" />
        <Route component={Users} path="/users" />
+       <Redirect to="/home"></Redirect>
      </div>
    );
```

### Route

在 Router 中组件的传入可以通过`component`:

```
 <Route component={Home} path="/home" />
```

也可以通过`render`:

```
<Route render={(routerProps)=>{
  return <Home x="1"{...routerProps}/>
}} path="/home" />
```

### 路由传参

1. query 方式：`<Link to="/article/1?from=article">文章1</Link>`
1. 动态路由`/path/:param => params`
1. 使用state隐式传参：

```
  <Link
    to={{
      pathname: "/article/1",
      state: {
        id: 2
      }
    }}
  >
    文章1
  </Link>
```
1. 如果组件是在Route的后代组件，获取不到路由的方法，那么可以使用`withRouter`来获取路由方法
### 编程式导航
通过`this.props`获取路由方法，然后跳转页面：
```
this.props.history.push('/home')
```
也可以使用对象形式：
```
this.props.history.push({
  pathname:'/home',
  state:{
    id:this.props.match.params.id
  }
})
```


## 工程
### 懒加载
安装插件`react-loadable`,例子：
```js
import Loadable from 'react-loadable';
import Loading from './my-loading-component';
 
const LoadableComponent = Loadable({
  loader: () => import('./my-component'),
  loading: Loading,
});
 
export default class App extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}
```

## 问题
### 如何模拟React的生命周期
- constructor：函数组件不需要构造函数。你可以通过调用 useState 来初始化 state。
- componentDidMount：通过 useEffect 传入第二个参数为[]实现。
- componentDidUpdate：通过 useEffect 传入第二个参数为空或者为值变动的数组。
- componentWillUnmount：主要用来清除副作用。通过 useEffect 函数 return 一个函数来模拟。
- shouldComponentUpdate：你可以用 React.memo 包裹一个组件来对它的 props 进行浅比较。来模拟是否更新组件。
- componentDidCatch and getDerivedStateFromError：目前还没有这些方法的 Hook 等价写法，但很快会加上。
- UNSAFE_componentWillReceiveProps:每次props变更时触发，可以使用`useEffect`处理,第二个参数为要监听的props。

### Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
组件中有异步请求后`setState`操作时，如果组件已经销毁，那么无法`setState`，会导致内存泄漏。  
解决办法：  
先通过`this.updater.isMounted(this)`判断组件是否存在，再进行`setState`操作。

### 生产模式下禁止 React Developer Tools、Redux DevTools 的使用?

[https://github.com/wall-wxk/blog/issues/17](https://github.com/wall-wxk/blog/issues/17)

### 更新数据后，获取的到 state 不是最新的数据？

这是因为为了提升性能， `React` 会把多次 `setState` 操作合并成一次，所以`setState` 执行的过
程是异步。也就是说 `setState` 执行后并没有立刻更新 `state` 中的数据。最简单的做法就是把计算结果存储下来。

```js
class Clock extends Component {
  state : { time : 1},
  componentDidMount () {
    const newTime = this.state.time + 1;
    this.setState({time : newTime});
    console.log (newTime) / ／期待是2，实际是2
  }
}
```

其实 `React` 为我们提供了另外一个方法 一 `setState` 还有第二个参数,它是一个函数，这个
函数会在 `state` 更新后被调用。

```js
class Clock extends Component {
  state : { time: 1}
  componentDidMount () {
    this.setState({time: this.state.time+ 1} , () => {
      console.log(this.state.time) ／／期待是2 ，实际是2
    });
  }
}
```
### react动态组件
不能通过以往的js变量直接赋值为组件：
```js
function Story(props) {
  // 错误！JSX 类型不能是一个表达式。
  return <components[props.storyType] story={props.story} />;
}
```
而应该是把动态组件赋值为一个大写的变量，再写成组件形式
```js
function Story(props) {
  // 正确！JSX 类型可以是大写字母开头的变量。
  const SpecificStory = components[props.storyType];
  return <SpecificStory story={props.story} />;
}
```
### 组件render的几种原因？

父组件更新、自身状态变化、自身强制更新

### yarn 创建 react 项目时出现错误?

```
error Incorrect integrity when fetching from the cache
info Visit https://yarnpkg.com/en/docs/cli/add for documentation about this command.
```

或者

```
error Incorrect integrity when fetching from the cache
info Visit https://yarnpkg.com/en/docs/cli/add for documentation about this command.

Aborting installation.
  yarnpkg add --exact react react-dom react-scripts --cwd
```

使用`yarn cache clean`清除缓存即可

### 为什么代码中没出现 React 还要引用

```
import React,{ Component }  from 'react';
class ClickCounter extends Component {
    constructor(props){
        super(props);
        this.onClickButton=this.onClickButton.bind(this);
        this.state={count:0}
    }
    onClickButton(){
        this.setState({count:this.state.count+1})
    }
    render(){
        return (
            <div>
                <button onClick={this.onClickButton}>Click Me</button>
                <div>Click Count:{this.state.count}</div>
            </div>
        )
    }
}
export default ClickCounter;
```

在上面的代码中并没有引用 React，在尝试去掉 React 后，系统会报错
![20200104120307.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/20200104120307.png)
这个错误信息的含义是："在使用 JSX 的范围内必须要有 React"，也就是说在使用 JSX 的代码文件中，即使代码中并没有直接使用 React,也一定要导入这个 React，这是因为 Babel 会把 JSX 转译成一个名为 React.createElement() 的函数调用。

### 怎么重写 create-react-app 配置？

除了使用`eject`,还可以安装`react-app-rewired`插件对 react 项目配置轻度重写，需要在根目录下创建`config-overrides.js`文件，并且把`package.json`里的`react-scripts`替换成`react-app-rewired`。  
但是配置的写法还是很麻烦，这个时候可以再安装另外一个插件`customize-cra`，对应用进行简化配置。

```js
// config-overrides.js
const { override, addDecoratorsLegacy } = require("customize-cra");

module.export = override(
  addDecoratorsLegacy() // 添加装饰器支持
);
```
### Leading decorators must be attached to a class declaration
普通函数组件使用`connect`装饰器时报错，原因是装饰器只能用做`class`上，应该在函数组件后使用
```
function StateButtonGroup(props) {
  const { loaddingButtonId } = props;

  return (
    <ButtonGroup>
    </ButtonGroup>
  );
}
connect(({ order ,loading})=> ({
  loaddingButtonId: order.loaddingButtonId,
}),StateButtonGroup)
```
### 怎么在函数组件内定义被memo的子组件?
定义在useState中的初始化函数中，这样只会触发一次，并返回了被memo的子组件
![react踩坑_2020-05-28-14-14-10](https://blog-pic.oss-cn-beijing.aliyuncs.com/react踩坑_2020-05-28-14-14-10.png)