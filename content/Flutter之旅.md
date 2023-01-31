---
title: Flutter之旅
category: 分享
tags:
- Flutter
date: 2020-01-30
vssue-title: Flutter之旅
---
## 界面渲染过程
页面中的各界面元素（Widget）以树的形式组织，即控件树。Flutter 通过控件树中的每个控件创建不同类型的渲染对象，组成渲染对象树。而渲染对象树在 Flutter 的展示过程分为四个阶段：布局、绘制、合成和渲染。
### 布局
Flutter 采用深度优先机制遍历渲染对象树，决定渲染对象树中各渲染对象在屏幕上的位置和尺寸。在布局过程中，渲染对象树中的每个渲染对象都会接收父对象的布局约束参数，决定自己的大小，然后父对象按照控件逻辑决定各个子对象的位置，完成布局过程。
![Flutter之旅_2020-2-23-13-38-25.jpeg](https://blog-pic.oss-cn-beijing.aliyuncs.com/Flutter之旅_2020-2-23-13-38-25.jpeg)
为了防止因子节点发生变化而导致整个控件树重新布局，Flutter 加入了一个机制——布局边界（Relayout Boundary），可以在某些节点自动或手动地设置布局边界，当边界内的任何对象发生重新布局时，不会影响边界外的对象，反之亦然。

![Flutter之旅_2020-2-23-13-41-59.jpeg](https://blog-pic.oss-cn-beijing.aliyuncs.com/Flutter之旅_2020-2-23-13-41-59.jpeg)
### 绘制
布局完成后，渲染对象树中的每个节点都有了明确的尺寸和位置。Flutter 会把所有的渲染对象绘制到不同的图层上。与布局过程一样，绘制过程也是深度优先遍历，而且总是先绘制自身，再绘制子节点。以下图为例：节点 1 在绘制完自身后，会再绘制节点 2，然后绘制它的子节点 3、4 和 5，最后绘制节点 6。
![Flutter之旅_2020-2-23-13-44-49.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/Flutter之旅_2020-2-23-13-44-49.png)
可以看到，由于一些其他原因（比如，视图手动合并）导致 2 的子节点 5 与它的兄弟节点 6 处于了同一层，这样会导致当节点 2 需要重绘的时候，与其无关的节点 6 也会被重绘，带来性能损耗。  
为了解决这一问题，Flutter 提出了与布局边界对应的机制——重绘边界（Repaint Boundary）。在重绘边界内，Flutter 会强制切换新的图层，这样就可以避免边界内外的互相影响，避免无关内容置于同一图层引起不必要的重绘。
![Flutter之旅_2020-2-23-13-47-12.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/Flutter之旅_2020-2-23-13-47-12.png)
重绘边界的一个典型场景是 Scrollview。ScrollView 滚动的时候需要刷新视图内容，从而触发内容重绘。而当滚动内容重绘时，一般情况下其他内容是不需要重绘的，这时候重绘边界就派上用场了。
### 合成和渲染
终端设备的页面越来越复杂，因此 Flutter 的渲染树层级通常很多，直接交付给渲染引擎进行多图层渲染，可能会出现大量渲染内容的重复绘制，所以还需要先进行一次图层合成，即将所有的图层根据大小、层级、透明度等规则计算出最终的显示效果，将相同的图层归类合并，简化渲染树，提高渲染效率。

合并完成后，Flutter 会将几何图层数据交由 Skia 引擎加工成二维图像数据，最终交由 GPU 进行渲染，完成界面的展示。  


## packages
1. [兼容Flutter的包](https://pub.dev/flutter/packages)
2. 安装依赖包`flutter packages get`
### 怎么跳转到其他App?
跳转到其他App，你需要一个特定的URL Scheme。对系统级别的App来说，这个scheme取决与App。为了在Flutter中实现这个功能，使用现有的plugin,例如url_launcher。
### http (进行网络请求)
包导入  
```
import 'package:http/http.dart' as http;
```
例子：
```
loadData() async {
    String dataURL = "https://jsonplaceholder.typicode.com/posts";
    http.Response response = await http.get(dataURL);
    setState(() {
      widgets = json.decode(response.body);
    });
  }
```
### path_provider(用于查找常用的全局路径)
### transparent_image(图片占位符)
### cached_network_image(网络缓存图片)
获取一次网络图片之后，自动缓存到本地，下次自动加载本地文件
## 资源管理
### 图片使用
1. 可以通过`AssetImage("images/xxx.jpeg");`来获取图片
2. 或者通过组件使用图片
```
@override
Widget build(BuildContext context){
 return Image.assets("images/xxx.jpeg");
}
```
### 字体设置
首先在`pubspec.yaml`中定义字体文件位置
```
fonts:
  - family:MyCustomFont
    fonts:
      - asset:fonts/MyCustomFont.tff
      - style:italic
```
使用例子：
```
child:Text(
  'this is a custom font text',
  style:TextStyle(fontFamily:'MyCustomFont')
)
```
### 设置APP图标
Android： 前往目录`.../android/app/src/main/res`,按照Android开发人员指南中的说明， 将其替换为所需的资源，并遵守每种屏幕密度（dpi）的建议图标大小标准。
> 注意: 如果您重命名.png文件，则还必须在您AndroidManifest.xml的<application>标签的android:icon属性中更新名称。
IOS: 前往目录`.../ios/Runner`,该目录中Assets.xcassets/AppIcon.appiconset已经包含占位符图片（见图2-9）， 只需将它们替换为适当大小的图片，保留原始文件名称。
### 更新启动页
Android:请导航至`.../android/app/src/main`。在`res/drawable/launch_background.xml`，通过自定义drawable来实现自定义启动界面
```
<?xml version="1.0" encoding="utf-8"?>
<!-- Modify this file to customize your launch splash screen -->
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@android:color/white" />

    <!-- You can insert your own image assets here -->
    <!-- <item>
        <bitmap
            android:gravity="center"
            android:src="@mipmap/launch_image" />
    </item> -->
</layer-list>

```
iOS:要将图片添加到启动屏幕（splash screen）的中心，请导航至.../ios/Runner。在Assets.xcassets/LaunchImage.imageset， 拖入图片，并命名为images LaunchImage.png、LaunchImage@2x.png、LaunchImage@3x.png。 如果您使用不同的文件名，那您还必须更新同一目录中的Contents.json文件。
## Widget
### 生命周期
![20200203204027.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/20200203204027.png)  
### SafeArea(异形屏安全区域)
针对异形屏会提供一些必要的缩进来使应用程序的大小与屏幕匹配，防止内容的显示缺失。
```
SafeArea(
  child:ListView(
    children:List.generate(
      100,
      (i)=>Text('this is some text')
    )
  )
)
```
还可以指定特定的显示区域：
```diff
SafeArea(
  child:ListView(),
  top:true,
  bottom:true,
+ left:false,
  right:true,
)
```
### Stateful Widget
和Stateless Widget一样,Stateful Widget也是继承Widget类,并重写了createElement()方法,不同的是返回的Element对象并不相同;另外
Stateful Widget类中添加了一个新的接口createState()，Stateful Widget 一般用于动态组件，一个Stateful Widget类会对应一个State类,State表示与其对应的Stateful Widget要维护的状态。  
State属性：
- widget，它表示与该State实例关联的widget实例，由Flutter framework动态设置。注意，这种关联并非永久的，因为在应用声明周期中，UI树上的某一个节点的widget实例在重新构建时可能会变化，但State实例只会在第一次插入到树中时被创建，当在重新构建时，如果widget被修改了，Flutter framework会动态设置State.widget为新的widget实例
- context，它是BuildContext类的一个实例，表示构建widget的上下文，它是操作widget在树中位置的一个句柄，它包含了一些查找、遍历当前Widget树的一些方法。每一个widget都有一个自己的context对象。

### Color
实现透明颜色：color.fromRGBO(255,255,255,0.5)  
Colors类写法中加入透明：Colors.black.withOpacity(0.05)
### InkWell(水波纹)
Material触摸水波效果,只有在设置了onTap之后才会有波纹效果。
```
// InWell组件包裹了我们自定义的button组件
new InkWell(
  onTap: () {
    Scaffold.of(context).showSnackBar(new SnackBar(
      content: new Text('Tap'),
    ));
  },
  child: new Container(
    padding: new EdgeInsets.all(12.0),
    child: new Text('Flat Button'),
  ),
);
```
### Container(布局容器)
![Flutter之旅_2020-2-23-14-19-35.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/Flutter之旅_2020-2-23-14-19-35.png)  
 Container也是一个widget，允许您自定义其子widget。如果要添加填充，边距，边框或背景色，请使用Container来设置（只有容器有这些属性），
还可以将其他装饰添加到widget.
```
Container({
  this.alignment,
  this.padding, //容器内补白，属于decoration的装饰范围
  Color color, // 背景色
  Decoration decoration, // 背景装饰
  Decoration foregroundDecoration, //前景装饰
  double width,//容器的宽度
  double height, //容器的高度
  BoxConstraints constraints, //容器大小的限制条件
  this.margin,//容器外补白，不属于decoration的装饰范围
  this.transform, //变换
  this.child,
})
```
属性介绍
- 容器的大小可以通过width、height属性来指定，也可以通过constraints来指定；如果它们同时存在时，width、height优先。实际上Container内部会根据width、height来生成一个constraints。
- color和decoration是互斥的，如果同时设置它们则会报错！实际上，当指定color时，Container内会自动创建一个decoration。
- 如果未设定容器大小，则根据子组件自动调整
### Stack(层叠布局)
```
Stack({
  this.alignment = AlignmentDirectional.topStart,
  this.textDirection,
  this.fit = StackFit.loose,
  this.overflow = Overflow.clip,
  List<Widget> children = const <Widget>[],
})
```
- `alignment`：此参数决定如何去对齐没有定位（没有使用Positioned）或部分定位的子组件。所谓部分定位，在这里特指没有在某一个轴上定位：left、right为横轴，top、bottom为纵轴，只要包含某个轴上的一个定位属性就算在该轴上有定位。  
- `textDirection`：和Row、Wrap的textDirection功能一样，都用于确定alignment对齐的参考系，即：textDirection的值为TextDirection.ltr，则alignment的start代表左，end代表右，即从左往右的顺序；textDirection的值为TextDirection.rtl，则alignment的start代表右，end代表左，即从右往左的顺序。  
- `fit`：此参数用于确定没有定位的子组件如何去适应Stack的大小。StackFit.loose表示使用子组件的大小，StackFit.expand表示扩伸到Stack的大小。
- `overflow`：此属性决定如何显示超出Stack显示空间的子组件；值为Overflow.clip时，超出部分会被剪裁（隐藏），值为Overflow.visible 时则不会。
### Positioned(根据Stack定位)
```
const Positioned({
  Key key,
  this.left, 
  this.top,
  this.right,
  this.bottom,
  this.width,
  this.height,
  @required Widget child,
})
```
作为`Stack`子组件使用。left、top 、right、 bottom分别代表离Stack左、上、右、底四边的距离。width和height用于指定需要定位元素的宽度和高度。注意，Positioned的width、height 和其它地方的意义稍微有点区别，此处用于配合left、top 、right、 bottom来定位组件，举个例子，在水平方向时，你只能指定left、right、width三个属性中的两个，如指定left和width后，right会自动算出(left+width)，如果同时指定三个属性则会报错，垂直方向同理。  
示例：
```
//通过ConstrainedBox来确保Stack占满屏幕
ConstrainedBox(
  constraints: BoxConstraints.expand(),
  child: Stack(
    alignment:Alignment.center , //指定未定位或部分定位widget的对齐方式
    children: <Widget>[
      Container(child: Text("Hello world",style: TextStyle(color: Colors.white)),
        color: Colors.red,
      ),
      Positioned(
        left: 18.0,
        child: Text("I am Jack"),
      ),
      Positioned(
        top: 18.0,
        child: Text("Your friend"),
      )        
    ],
  ),
);
```
### SizedBox
![Flutter之旅_2020-2-23-11-32-30.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/Flutter之旅_2020-2-23-11-32-30.png)  
一个特定大小的盒子。这个widget强制它的孩子有一个特定的宽度和高度。如果宽度或高度为NULL，则此widget将调整自身大小以匹配该维度中的孩子的大小。  
如果你设定SizedBox在一个方向上无限长,它并不会变成无限长，它只会扩展其父级允许的范围
```diff
SizedBox{
+ width:double.infinity,
  height:100,
  child:MyButton()
}
```
如果在两个唯独设置无限大，则子集将填充可用空间
```diff
SizedBox{
+ width:double.infinity,
+ height:double.infinity,
  child:MyButton()
}
```
这有一个快捷写法可以替代上边写法：
```diff
+ SizedBox.expand{
  child:MyButton()
}
```
你可以在没有子级的情况下使用SizedBox,用来填充空间：
```diff
Column(
  children:[
    MyButton(),
+   SizedBox(height:200),
    OtherButton()
  ],
)
```
### Flex(弹性布局)
弹性布局允许子组件按照一定比例来分配父容器空间。  
Flex组件可以沿着水平或垂直方向排列子组件，如果你知道主轴方向，使用Row或Column会方便一些，因为Row和Column都继承自Flex，参数基本相同，所以能使用Flex的地方基本上都可以使用Row或Column。
### Flexible
Expanded和Flexible的区别就是FlexFit.tight和FlexFit.loose的区别：
```
Flexible(
	fit: FlexFit.tight,
	...
)
```
建议：如果想填满剩余空间直接使用Expanded更方便。 

这里总结下Expanded和Flexible的区别：  
- Expanded：强制填满剩余空间
- Flexible：不强制填满剩余空间，是否填满剩余空间取决于子控件是否需要填满父控件。
### PageView(页面滚动控制)
首先必须使用`PageController`,它会管理滑动侦测，并提供动画,使用`initialPage`属性来设定开始的页面：
```
final controller=PageController(
  initialPage:1
)
```
然后就可以使用`PageView`来创建页面了：
```
Final pageView=PageView(
  controller:controller,
  scrollDirection:Axis.vertical,
  children:[
    MyPage1Widget(),
    MyPage2Widget(),
    MyPage3Widget(),
  ],
);
```
属性：  
|属性名| 值类型 | 详情 |
| - | - | - |
| controller| PageController | 一个对象，可用于控制此页面视图的滚动位置。 |
| scrollDirection | Axis | 页面滚动方向 |
| physics  | ScrollPhysics | 页面如何响应用户操作 |
| onPageChanged  | `ValueChanged<int>` | 每当视口中心的页面更改时调用。 |
### Image
Image支持如下几种类型的构造函数:  
- new Image - 用于从ImageProvider获取图像
- new Image.asset - 使用key从AssetBundle获得的图像  
- new Image.network - 从网络URL中获取图片
- new Image.file - 从本地文件中获取图片
- new Image.memory  - 用于从Uint8List获取图片
> 在加载项目中的图片资源时，为了让Image能够根据像素密度自动适配不同分辨率的图片，请使用`AssetImage`指定图像，并确保在widget树中的Image widget上方存在`MaterialApp`、`WidgetsApp`、`MediaQuery`窗口widget。  
Image支持的图片格式：JPEG、 PNG、GIF、Animated GIF、WebP、Animated WebP、BMP、WBMP。    

Androiid不同像素密度的图片和Flutter的像素比率的对应关系：
```
ldpi    0.75x
mdpi    1.0x
hdpi    1.5x
xhdpi   2.0x
xxhdpi  3.0x
xxxhdpi 4.0x
```
### Widget build的参数Context
`build`方法有一个`context`参数，它是`BuildContext`类的一个实例，表示当前widget在widget树中的上下文，每一个widget都会对应一个context对象（因为每一个widget都是widget树上的一个节点）。实际上，`context`是当前widget在widget树中位置中执行”相关操作“的一个句柄，比如它提供了从当前widget开始向上遍历widget树以及按照widget类型查找父级widget的方法。下面是在子树中获取父级widget的一个示例：
### Semantics(语义化)
面向屏幕阅读器和搜索引擎和其他语义化分析工具，可以通过Semantics包装每个小部件来提供该信息，Semantics包含50多个属性，用于为UI提供额外的含义
```
Semantics(
  child:FaceImage(),
  label:'An image of name', // 文本描述
  enabled:true, // 启用关闭小部件
  readOnly:true // 输入还是仅限读取的字段
)
```
### SingleChildScrollView(单子件可滚动组件)
有一个子widget的可滚动的widget，子内容超过父容器时可以滚动。  
属性：
|参数| 说明 | 类型 | 可选值 | 默认值 |
| - | - | - | - | - |
|||||
下面是一个将大写字母A-Z沿垂直方向显示的例子，由于垂直方向空间会超过屏幕视口高度，所以我们使用SingleChildScrollView：
```
class SingleChildScrollViewTestRoute extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Scrollbar( // 显示进度条
      child: SingleChildScrollView(
        padding: EdgeInsets.all(16.0),
        child: Center(
          child: Column( 
            //动态创建一个List<Widget>  
            children: str.split("") 
                //每一个字母都用一个Text显示,字体为原来的两倍
                .map((c) => Text(c, textScaleFactor: 2.0,)) 
                .toList(),
          ),
        ),
      ),
    );
  }
}
```
> [Flutter实战 - 6.2 SingleChildScrollView](https://book.flutterchina.club/chapter6/single_child_scrollview.html)
### ListView(可滚动列表)
使用builder创建列表时，itemCount属性表示遍历次数，itemBuilder为生成器。例子：
```js
Widget _buildSuggestions(){
    return ListView.builder(
      padding:const EdgeInsets.all(16.0),
      itemCount: 10,
      itemBuilder: (context,i){
        if(i.isOdd) return Divider();
        final index=i~/2;
        if(index>=_suggestions.length){
          _suggestions.addAll(generateWordPairs().take(10));
        }
        return _buildRow(_suggestions[index]);
      },
    );
  }
```

|  属性 | 介绍  | 默认值 |
|---|---|---|
| itemCount  | 遍历次数，不填写时为无限列表  | - |
| itemBuilder  | 生成器函数，接收context参数和index参数  | - |
### ListTile(列表组件)
![Flutter之旅_2020-3-8-11-47-58.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/Flutter之旅_2020-3-8-11-47-58.png)  
一个固定高度的行，通常包含一些文本，以及一个行前或行尾图标。  
```
ListTile(
  leading:icon, // 头部图标
  title:"Widget of the week", // 文本
  subtitle:'#54', // 副文本
  isThreeLine:true, // 允许第三行
  dense:true, // 紧密布局
  onTap:()=>{}, // 点击事件
  onLongPress:()=>{}, // 长按事件
  enabled:false, // 禁用
  selected:false, //选中
  trailing:icon // 尾部图标
)
```
### PageStorageKey(PageStorageKey)
PageStorage是一个用于保存页面(路由)相关数据的组件，它并不会影响子树的UI外观，其实，PageStorage是一个功能型组件，它拥有一个存储桶（bucket），子树中的Widget可以通过指定不同的PageStorageKey来存储各自的数据或状态。
当一个路由中包含多个可滚动组件时，如果你发现在进行一些跳转或切换操作后，滚动位置不能正确恢复，这时你可以通过显式指定PageStorageKey来分别跟踪不同的可滚动组件的位置，如：
```
ListView(key: PageStorageKey(1), ... );
...
ListView(key: PageStorageKey(2), ... );
```
不同的PageStorageKey，需要不同的值，这样才可以为不同可滚动组件保存其滚动位置。  
>注意：一个路由中包含多个可滚动组件时，如果要分别跟踪它们的滚动位置，并非一定就得给他们分别提供PageStorageKey。这是因为Scrollable本身是一个StatefulWidget，它的状态中也会保存当前滚动位置，所以，只要可滚动组件本身没有被从树上detach掉，那么其State就不会销毁(dispose)，滚动位置就不会丢失。只有当Widget发生结构变化，导致可滚动组件的State销毁或重新构建时才会丢失状态，这种情况就需要显式指定PageStorageKey，通过PageStorage来存储滚动位置，一个典型的场景是在使用TabBarView时，在Tab发生切换时，Tab页中的可滚动组件的State就会销毁，这时如果想恢复滚动位置就需要指定PageStorageKey。  

[Flutter实战 - 6.6 滚动监听及控制](https://book.flutterchina.club/chapter6/scroll_controller.html)

### ExpansionPanel(扩展面板)
![Flutter之旅_2020-3-8-13-4-48.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/Flutter之旅_2020-3-8-13-4-48.png)  
扩展面板一般作为ExpansionPanelList的children。它具有标题和主体，可以扩展或折叠。面板的主体只有在展开时才可见。  

### GestureDetector(手势检测)
如果组件本身不支持点击事件，可以在外层包裹GestureDetector，并添加一个onTap函数
```
child:GestureDetector(
        child:Text("test"),
        onTap:(){
          print(i);
        }
      )
```
使用GestureDetecotr可以检测多种手势，例如：  
- 点击
  - onTapDown
  - onTapUp
  - onTap
  - onTapCancel
- 双击
  - onDoubleTap
- 长按
  - onLongPress
- 垂直拖动
  - onVerticalDragStart
  - onVerticalDragUpdate
  - onVerticalDragEnd
- 水平拖动
  - onHorizontalDragStart
  - onHorizontalDragUpdate
  - onHorizontalDragEnd
### AppBar(应用程序栏)
![Flutter之旅_2020-3-8-15-46-46.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/Flutter之旅_2020-3-8-15-46-46.png)  
一个Material Design应用程序栏，由工具栏和其他可能的widget（如TabBar和FlexibleSpaceBar）组成。  
```
appBar: AppBar(
  iconTheme: IconThemeData(color:Colors.grey), // icon样式设置
  backgroundColor: Colors.white, // 背景色
  elevation: 0.0, // 阴影
  title: Text(
    widget.title,
    style: TextStyle(color: Colors.black),
  ),
  centerTitle: false, // 居中显示title
),
```
### TabBar(Tab菜单)
```
class _ScaffoldRouteState extends State<ScaffoldRoute>
    with SingleTickerProviderStateMixin {
      
  TabController _tabController; //需要定义一个Controller
  List tabs = ["新闻", "历史", "图片"];

  @override
  void initState() {
    super.initState();
    // 创建Controller  
    _tabController = TabController(length: tabs.length, vsync: this);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        ... //省略无关代码
        bottom: TabBar(   //生成Tab菜单
          controller: _tabController,
          tabs: tabs.map((e) => Tab(text: e)).toList()
        ),
      ),
      ... //省略无关代码

  }
```
`SingleTickerProviderStateMixin`搭配`TabController`提供Tab的动画控制  
TabBar需要一个`TabController`,它是用于控制/监听Tab菜单切换的,不提供时可以使用`DefaultTabController`
属性  
使用`DefaultTabController`时，可以通过`initialIndex`控制默认选中tab

### BottomNavigationBar(底部tabbar)
底部导航栏由多个`item`组成，这些`item`提供文本标签，图标或两者皆有的形式。它提供了在应用程序顶级视图之间的快速导航。对于较大的屏幕，侧面导航可能更合适。  
底部导航栏通常与Scaffold结合使用。  
底部导航栏的`type`属性更改了其`items`的显示方式。如果未指定，则当`item`少于四个时，它将自动设置为BottomNavigationBarType.fixed，否则设置为BottomNavigationBarType.shifting  

属性
| 属性名 | 值类型 | 详情 |
| - | - | - |
| currentIndex | int | 当前活动的BottomNavigationBarItem的项目索引 |
| items | `List<BottomNavigationBarItem>`| 定义排列在底部导航栏中的按钮项目的外观 |
| selectedItemColor | Color |选定的BottomNavigationBarItem.icon和BottomNavigationBarItem.label的颜色 |

方法
| 方法名 | 接收参数 | 详情 |
| - | - | - | 
| onTap | `ValueChanged<int>` | 当item被点击时触发 |
### BottomNavigationBarItem
material主题的BottomNavigationBar或iOS主题的CupertinoTabBar中的带有图标和标题的交互式按钮。  
此类很少被单独使用。它通常嵌入在上面的底部导航小部件之一中。  

属性
| 属性名 | 值类型 | 详情 |
| - | - | - |
| icon | Widget | item的图标 |
| title | Widget| item的title，如果不提供则只显示图标 |
### RepaintBoundary
> 重绘边界组件，独立绘制是通过在不同的layer（层）上绘制的。所以，很明显，正确使用可以提高绘制效率，避免不必要的重绘。  
在Flutter SDK中有部分Widget做了这个处理，比如TextField、SingleChildScrollView、AndroidView、UiKitView等。最常用的ListView在item上默认也使用了RepaintBoundary
### RawMaterialButton(基础按钮)
Material 组件库中提供了多种按钮组件如RaisedButton、FlatButton、OutlineButton等，它们都是直接或间接对RawMaterialButton组件的包装定制，所以他们大多数属性都和RawMaterialButton一样。
属性
| 属性名 | 值类型 | 详情 |
| - | - | - |
| padding | EdgeInsetsGeometry | 内边距 |
| hoverColor | Color| 指针悬停颜色 |
| splashColor | Color | 点击时，水波动画中水波的颜色 |
| highlightColor | Color | 00 |
| child | Widget | 子部件 |
方法
| 方法名 | 详情 |
| - | - |
| onPressed | 点击事件 |
### Offstage
一个布局widget，可以控制其子widget的显示和隐藏。  
当offstage为true，控件隐藏； 当offstage为false，显示；
当Offstage不可见的时候，如果child有动画等，需要手动停掉，Offstage并不会停掉动画等操作。  
```
body: Stack(
   children: [
   Offstage(
    offstage: currentIndex != 0,
    child: bodyList[0],
   ),
   Offstage(
    offstage: currentIndex != 1,
    child: bodyList[1],
   ),
   Offstage(
    offstage: currentIndex != 2,
    child: bodyList[2],
   ),
   ],
  )
```
### IndexedStack
一个部件堆栈，一次只显示一个子部件，但是可以保留所有子部件状态.,可以通过index索引设置显示的组件
```
IndexedStack(
  index:_wigetIndex,
  children:[
    WidgetOne(),
    WidgetTwo()
  ]
)
```
### TextField(文本输入)
默认情况下，TextField有一个下划线装饰（decoration）。您可以通过提供给decoration属性设置一个InputDecoration来添加一个标签、一个图标、提示文字和错误文本。 要完全删除装饰（包括下划线和为标签保留的空间），将decoration明确设置为空即可。  
### TextFormField(表单文本输入)
TextFormField包裹一个TextField 并将其集成在Form中。你要提供一个验证函数来检查用户的输入是否满足一定的约束（例如，一个电话号码）或当你想将TextField与其他FormField集成时，使用TextFormField。
### LayoutBuilder(获取父组件上下文)
它的构造器函数具有构建上下文(constraints)：
```
Widget build(BuildContext context){
  return LayoutBuilder(
    builder:(context,constraints){
    },
  );
}
```
通过`constraints`可以获取子部件的有效宽度和高度范围，然后对如何构建做出判断:
```
Widget build(BuildContext context){
  return LayoutBuilder(
    builder:(context,constraints){
      if(constraints.maxWidth<600){
        return MyOneColumnLayout()
      }else{
        return MyTwoColumnLayout()
      }
    },
  );
}

```
## 本地化
> https://book.flutterchina.club/chapter13/multi_languages_support.html?h=localizationsDelegates
## API
### [BuildContext class](https://api.flutter.dev/flutter/widgets/BuildContext-class.html)
BuildContext对象实际上就是Element对象，BuildContext 接口用于防止对 Element 对象的直接操作。  
## 开发和工具
1. 高级调试  
在vscode中如果要调试ui问题，请使用`f5`启动程序后，点击`open Devtools widget inspector page`:
![20200223093136.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/20200223093136.png)
之后会跳转到Dart Devtools页面：
![20200223093422.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/20200223093422.png)  

这提供了许多调试工具;
- ‘切换 Select Widget 模式’: 在设备上选择一个widget以在Flutter Inspector中对其进行检查。
- ‘切换 Debug Paint’: 显示Widget布局边界（包括边框、padding、对齐等）
- ‘切换 Platform’: 在Android或iOS渲染之间切换.
- ‘切换 Performance Overlay’: 显示GPU和CPU线程的性能图.
- ‘打开 Timeline 窗口’: 分析应用程序运行时的活动.

菜单中还有一些其他操作：  
- ‘Show Paint Baselines’: 使每个RenderBox显示其基线
- ‘Enable Repaint Rainbow’: 重绘时在层上显示旋转颜色.
- ‘Enable Slow Animations’: 减慢动画以方便观察.
2. Flutter代码提示  
辅助&快速修正：  
辅助是与特定代码标识符相关的代码更改。当光标放置在Flutter Widget标识符上时，可以使用其中的一些标识符，如黄色灯泡图标所示。 可以通过单击灯泡或使用键盘快捷`command+.`来调用该辅助功能，如下所示:
![20200223094542.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/20200223094542.png)
快速修正是类似的，只有显示一段有错误的代码时，他们可以帮助您纠正它。它用一个红色灯泡表示。  
实时模板：  
实时模板可用于加速输入常用的代码结构块。通过输入他们的’前缀’来调用它们，然后在代码补全窗口中选择它们：
![templates.gif](https://flutterchina.club/images/intellij/templates.gif)
Flutter插件包含以下模板:
- 前缀stless: 创建一个StatelessWidget的子类.
- 前缀stful: 创建一个StatefulWidget子类并且关联到一个State子类.
- 前缀stanim: 创建一个StatefulWidget子类, 并且它关联的State子类包括一个 AnimationController
3. 字节跳动开源调试工具：https://github.com/bytedance/flutter_ume

## 实例
1. [flutter examples](https://github.com/flutter/flutter/tree/master/examples)
> flutter官网例子
2. [samples](https://github.com/flutter/samples)
> flutter官网例子
3. [Simple basic isolated apps, for budding flutter devs.](https://github.com/nisrulz/flutter-examples)
4. [FlutterExampleApps](https://github.com/iampawan/FlutterExampleApps)
## 问题
1. 本地化时，ios端长按输入框报错，按照文档已经写好了本地化配置，但是还是少了一样`GlobalCupertinoLocalizations.delegate`:
```diff
Widget build(BuildContext context) {
    return MaterialApp(
      localizationsDelegates: [
        // 本地化的代理类
        GlobalMaterialLocalizations.delegate, // 提供的本地化的字符串和其他值，它可以使Material 组件支持多语言
        GlobalWidgetsLocalizations.delegate, // 定义组件默认的文本方向
+       GlobalCupertinoLocalizations.delegate
      ],
      supportedLocales: [
        const Locale('zh', 'CN'), // 中文简体
        //其它Locales
      ],
      title: _title,
      home: LoginWidget(),
    );
  }
```

2. InkWell没有水波纹效果？  

因为我没有设置onTap方法，设置了`onTap:()=>{}`之后就有了

或者：  
这里问题其实出在了Container上，InkWell其是Material组件。使用Containe的效果其实是盖住了Inkwell而不是给InkWell设置了背景色。正确的应该是（类似问题用这个方法大多可以解决）：
```
new Material(
  color: Colors.red,
  child: new InkWell(),
)
```