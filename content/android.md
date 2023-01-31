---
title: android学习笔记
category: 分享
tags:
  - android
date: 2019-02-22
vssue-title: android学习笔记
---
## andorid密度对应分辨率
![20190724150859.png](https://blog-pic.oss-cn-beijing.aliyuncs.com/20190724150859.png)
> 引用：https://blog.csdn.net/u010413574/article/details/52790253
## Application
- <b>单例模式</b>：每个App都有且只有一个Application的实例对象，可以通过继承Application子类来进行自定义,如果没有自定义的话,APP会在打开是自动创建一个默认的实例对象.
- <b>生命周期</b>：APP开启时就会开始实例化Application对象,Application实例的生命周期是最长的,拥有和APP一样长的生命周期
- <b>获取方式</b>：如果没有自定义Application的话,同样可以获取到Application对象,使用Activity.getApplication()或者  Context.getApplicationContext()方法都可以获取到对象.    
```
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    //这两种方法都可以获取到实例对象
    val application = application
    val otherApplication = applicationContext
}
```
- <b>全局实例</b>：在不同的组件中(如:Activity,Service),都可以获取Application对象,并且都会是同一个对象  
## Activity
### Activity是什么？
Activity是一个Android应用程序组件(也称为Android四大组件之一)，它提供了一个屏幕，用户可以通过该屏幕进行交互以执行某些操作，例如拨打电话，拍照，发送电子邮件或查看地图。每个活动都有一个窗口，用于绘制其用户界面。窗口通常填满屏幕，但可能比屏幕小，并漂浮在其他窗口的顶部.  
Android应用程序通常由多个彼此松散绑定的Activity组成。通常，应用程序中的一个Activity被指定为“主要”Activity，该Activity在首次启动应用程序时呈现给用户。然后，每个Activity可以启动另一个Activity以执行不同的操作。每次新Activity开始时，前一个Activity都会停止，但系统会将Activity保留在后台堆栈中（“后堆栈”）。当一个新的Activity开始时，它会被推到后面的堆栈上，并引起用户的注意。后栈遵循基本的“ 后进先出”堆栈机制，因此，当用户完成当前活动并按下"后退按钮"时，它从堆栈弹出（并销毁），之前的活动恢复。（后台堆栈将在后面为大家详细介绍。） 
### 如何创建Activity
要创建Activity,您必须创建Activity的子类。在子类中，您需要实现当Activity在其生命周期的各个状态之间转换时系统调用的回调方法，例如在创建，停止，恢复或销毁活动时。两个最重要的回调方法是
``` 
public class ExampleActivity extends AppCompatActivity {

 @Override
    public void onCreate(@Nullable Bundle savedInstanceState, @Nullable PersistableBundle persistentState) {
        super.onCreate(savedInstanceState, persistentState);
//您必须实现此方法。系统在创建Activity时调用此方法。在您的实施中，您应该初始化Activity的基本组成部分。最重要的是，您必须在此处调用以定义Activity用户界面的布局。
        setContentView();
    }


//系统将此方法称为用户离开您的Activity的第一个指示（尽管并不总是意味着Activity正在被销毁）。这通常是您应该提交应该在当前用户会话之外保留的任何更改的地方（因为用户可能不会回来）。

@Override
    protected void onPause() {
        super.onPause();
        //在此处应该提交应该在当前用户会话之外保留的任何更改的地方
    }

}


```
>在访问Activity时，必须在manifest中声明此Activity
```
<manifest ... >
 <application ... > 
    <activity android：name = “.ExampleActivity” />    
 </ application ... >  
</ manifest >

```
### 如何启动Activity
您可以通过调用启动另一个Activity,通过startActivity()方法，并将Intent传递给您要启动的Activity。intent指定要启动的确切Activity或描述您要执行的操作类型（系统为您选择适当的活动，甚至可以来自不同的应用程序）。Intent(意图)还可以携带少量数据以供启动的活动使用。
- 启动指定自建的Activity
```java
Intent intent = new Intent(this, SignInActivity.class);
startActivity(intent);
``` 
此种启动又叫做显示Intent .
- 启动其他类型的Activity
```java
Intent intent = new Intent(Intent.ACTION_SEND);
intent.putExtra(Intent.EXTRA_EMAIL, recipientArray);
startActivity(intent);
```
此种启动又叫做隐式Intent .
>有时候，我们可能需要从上一个Activity接收返回数据结果，这时，我们就需要另外一种启动方式了。

在这种情况下，通过调用startActivityForResult()（而不是startActivity()）来启动Activity。然后，要从后续Activity接收结果，就需要实现onActivityResult()回调方法。完成后续Activity后，它会在您的onActivityResult() 方法中返回结果。
```java
private void pickContact() {
    // Create an intent to "pick" a contact, as defined by the content provider URI
    Intent intent = new Intent(Intent.ACTION_PICK, Contacts.CONTENT_URI);
    startActivityForResult(intent, PICK_CONTACT_REQUEST);
}

@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    // If the request went well (OK) and the request was PICK_CONTACT_REQUEST
    if (resultCode == Activity.RESULT_OK && requestCode == PICK_CONTACT_REQUEST) {
        // Perform a query to the contact's content provider for the contact's name
        Cursor cursor = getContentResolver().query(data.getData(),
        new String[] {Contacts.DISPLAY_NAME}, null, null, null);
        if (cursor.moveToFirst()) { // True if the cursor is not empty
            int columnIndex = cursor.getColumnIndex(Contacts.DISPLAY_NAME);
            String name = cursor.getString(columnIndex);
            // Do something with the selected contact's name...
        }
    }
}

```
### 关闭Activity
您可以通过调用其finish()方法来关闭活动。您还可以关闭之前通过调用启动的单独活动finishActivity()。
>接下来便是整个Activity最核心的地方了，只要搞清楚一下内容，Activity也就理解的差不多了
### Activity生命周期详解
Activity之所以能够成为Android四大组件之一,原因便是其具有非常灵活的生命周期回调方法,通过实现回调方法来管理Activity的生命周期对于开发强大而灵活的应用程序至关重要。Activity的生命周期直接受其与其他Activity，其任务和后台堆栈的关联的影响。  
Activity基本上存在于三种状态：
1. 恢复 onResume() Activity位于屏幕的前景并具有用户焦点。
2. 已暂停 onPause()当系统开始准备停止当前Activity的时候调用，在该方法中google给出的建议是存储一些变化的数据同时停止一些类似于动画等消耗CPU的工作。该方法的调用过程是很快的，否则会影响到后面的Activity的显示，所以在该方法里不宜做过多耗时操作。
3. 停止 onStop() activity完全被其他activity掩盖，不可见。仍然保留所有状态和变量信息，但是在系统其他地方需要内存的情况下，可能会被系统杀死。