---
layout: post
category : Technology
tagline: ""
tags : [Technology]
---
{% include JB/setup %}

编写面向对象的程序，经常需要使用到new和delete操作为对象申请内存空间并且初始化。在我博客的另一篇文章 [Debug The File System](http://octavianus.github.io/technology/2013/12/25/Debug-the-file-system/) 我提到内存的分配和回收是开发中最令人头疼的事情，一旦出现内存的重叠分配或者访问越界等问题都是很难察觉到的，到时候出现段错误也需要花费大量的时间检查和排除错误。

在C编程中，程序员只需要谨慎仔细的使用malloc和free(虽然这样也不容易)，C++在C的基础上，添加了强大的new功能，不仅可以分配内存，同时还可以为对象初始化，因此，更多的灵活性带来了更多的使用技巧。以我最近做的DBMS term project为例，对于对象内存的分配和回收这一部分而言，使用最频繁的要算是 __Buffer Manager__ (以下简称`BM`)这一层了，这一层主要的功能是在heap file层申请Insert, Update，delete等等各种操作请求时，由于每一项操作对应一个或多个虚拟的Page(Page是数据库的存储单位之一)，BM会根据这些操作对应的Page，把其从外部存储设备(disk, flash)中读取到内存池(buffer pool)中，或者从内存池写到外部存储设备上。所以这其中涉及到了大量的内存分配和释放，看似new和delelte能为我们处理一切，可是不同的使用模式效率也会不同。首先有必要了解new的基本使用方法，我认为核心内容是关于placement new.内容转自百度sytarchen的空间和博客园的wanghetao.

--- 
###一. New的用法

__1. new( )__ 分配这种类型的一个大小的内存空间,并以括号中的值来初始化这个变量;

__2. new[ ]__ 分配这种类型的n个大小的内存空间,并用默认构造函数来初始化这些变量;

例子：

{% highlight c %}
#include<iostream>
#include<cstring>
using namespace std;
int main(){   
    char * p=new char("Hello");
    //error分配一个char(1字节)的空间,                                  
    //用"Hello"来初始化,这明显不对  
     
    char* p=new char[6];   
    //p="Hello";                
    //不能将字符串直接赋值给该字符指针p，原因是：                                
    //指针p指向的是字符串的第一个字符，只能用下面的                                
    //strcpy   
    strcpy(p,"Hello");   
    cout<<*p<<endl;              //只是输出p指向的字符串的第一个字符！   
    cout<<p<<endl;               //输出p指向的字符串！   
    delete[] p;  
     return 0;
}
{% endhighlight %}

__3．开辟单变量地址空间__

    1)new int;  //开辟一个存放数组的存储空间,返回一个指向该存储空间的地址.int *a = new int 即为将一个int类型的地址赋值给整型指针a. 

    2)int \*a = new int(5) 作用同上,但是同时将整数赋值为5
    
__4．开辟数组空间__

    一维: int \*a = new int[100];开辟一个大小为100的整型数组空间
   
    二维: int \*\*a = new int[5][6]
   
    三维及其以上:依此类推.
   
   一般用法: new 类型 [初值]
   
   
__5.__当使用new运算符定义一个多维数组变量或数组对象时，它产生一个指向数组第一个元素的指针，返回的类型保持了除最左边维数外的所有维数。

例如： 
 
{% highlight c %}
int *p1 = new int[10];   
{% endhighlight %}

返回的是一个指向int的指针int\*   

{% highlight c %}
int (*p2)[10] = new int[2][10];  
{% endhighlight %}
new了一个二维数组,去掉最左边那一维[2],剩下int[10],所以返回的是一个指向int[10]这种一维数组的指针int (\*)[10].
   
{% highlight c %}
int (*p3)[2][10] = new int[5][2][10]; 
{% endhighlight %}
new了一个三维数组,去掉最左边那一维[5],还有int[2][10],所以返回的是一个指向二维数组int[2][10]这种类型的指针int (\*)[2][10].

__例子：__

{% highlight c %}
#include <iostream>
#include <typeinfo>
using namespace std;
int main() {
    int *a = new int[34];
    int *b = new int[];
    int (*c)[2] = new int[34][2];
    int (*d)[2] = new int[][2];
    int (*e)[2][3] = new int[34][2][3];
    int (*f)[2][3] = new int[][2][3];
    a[0] = 1;
    b[0] = 1; //运行时错误,无分配的内存,b只起指针的作用,用来指向相应的数据
    c[0][0] = 1;
    d[0][0] = 1;  //运行时错误,无分配的内存,d只起指针的作用,用来指向相应的数据
    e[0][0][0] = 1;
    f[0][0][0] = 1;   //运行时错误,无分配的内存,f只起指针的作用,用来指向相应的数据
    cout<<typeid(a).name()<<endl;
    cout<<typeid(b).name()<<endl;
    cout<<typeid(c).name()<<endl;
    cout<<typeid(d).name()<<endl;
    cout<<typeid(e).name()<<endl;
    cout<<typeid(f).name()<<endl;
    delete[] a; delete[] b; delete[] c;
    delete[] d; delete[] e; delete[] f;
}
{% endhighlight %}

输出结果：

{% highlight c %}
int *
int *
int (*)[2]
int (*)[2]
int (*)[2][3]
int (*)[2][3]
{% endhighlight %}

__6．new运算符__

最常用的是作为运算符的new，比如：
{% highlight c %}
string *str = new string(“test new”);
{% endhighlight %}
作为运算符，`new和sizeof一样，是C++内置的，你不能对它做任何的改变，除了使用它。`
new会在堆上分配一块内存，并会自动调用类的构造函数。

__7．new函数__

第二种就是new函数，其实new运算符内部分配内存使用的就是new函数，原型是：
{% highlight c %}
void *operator new(size_t size);
{% endhighlight %}
new函数返回的是一个void指针，一块未经初始化的内存。如你所见，这和C语言的malloc行为相似，你可以重载new函数，并且增加额外的参数，但是必须保证第一个参数必须是size_t类型，它指明了分配内存块的大小，C++允许你这么做，当然一般情况下这是不必要的。如果重载了new函数，在使用new操作符时调用的就是你重载后的new函数了。
如果使用new函数，和语句
{% highlight c %}
string *str = new string(“test new”)
{% endhighlight %}
相对的代码大概是如下的样子：
{% highlight c %}
string *str = (string*)operator new(sizeof(string));  
str.string(“test new”);   
// 当然这个调用时非法的，但是编译器是没有这个限制的
{% endhighlight %}

###8.placement new 

####1. placement new的含义
placement new 是重载operator new 的一个标准、全局的版本，它不能够被自定义的版本代替（不像普通版本的operator new 和 operator delete能够被替换）。

{% highlight c %} 
void *operator new( size_t, void *p ) throw()     { return p; }
{% endhighlight %}
placement new的执行忽略了size_t参数，只返还第二个参数。其结果是允许用户把一个对象放到一个特定的地方，达到调用构造函数的效果。

和其他普通的new不同的是，它在括号里多了另外一个参数。比如：

{% highlight c %}
Widget * p = new Widget; - - - - - - - - - //ordinary new 
pi = new (ptr) int; pi = new (ptr) int;     //placement new
{% endhighlight %}

括号里的参数ptr是一个指针，它指向一个内存缓冲器，placement new将在这个缓冲器上分配一个对象。Placement new的返回值是这个被构造对象的地址(比如括号中的传递参数)。placement new主要适用于：在对时间要求非常高的应用程序中，因为这些程序分配的时间是确定的；长时间运行而不被打断的程序；以及执行一个垃圾收集器 (garbage collector)。

####2. new 、operator new 和 placement new 区别
- **new **：不能被重载，其行为总是一致的。它先调用operator new分配内存，然后调用构造函数初始化那段内存。

- **operator new**：要实现不同的内存分配行为，应该重载operator new，而不是new。

- delete和operator delete类似。

- delete首先调用对象的析构函数，然后调用operator delete释放掉所使用的内存。

- **placement new**：只是operator new重载的一个版本。它并不分配内存，只是返回指向已经分配好的某段内存的一个指针。因此不能删除它，但需要调用对象的析构函数。

####3. new 操作符的执行过程
    　　(1). 调用operator new分配内存 ；
    　　(2). 调用构造函数生成类对象；
    　　(3). 返回相应指针。
operator new 就像operator+一样，是可以重载的。如果类中没有重载operator new，那么调用的就是全局的::operator new来完成堆的分配。同理，operator new[]、operator delete、operator delete[]也是可以重载的，其实 operator new也是operator new的一个重载的版本，只是很少用而已。如果你想在已经分配的内存中创建一个对象，使用new时行不通 的。也就是说placement new允许你在一个已经分配好的内存中（栈或者堆中）构造一个新的对象。原型中void\*p实际上就是指向一个已经分配 好的内存缓冲区的的首地址。

####4. Placement new 存在的理由
1. **用Placement new 解决buffer的问题**
问题描述：用new分配的数组缓冲时，由于调用了默认构造函数，因此执行效率上不佳。若没有默认构造函数则会发生编译时错误。如果你想在预分配的内存上创建对象，用缺省的new操作符是行不通的。要解决这个问题，你可以用placement new构造。它允许你构造一个新对象到预分配的内存上。

2. **增大时空效率的问题**
使用new操作符分配内存需要在堆中查找足够大的剩余空间，显然这个操作速度是很慢的，而且有可能出现无法分配内存的异常（空间不够）。 
placement new 就可以解决这个问题。我们构造对象都是在一个预先准备好了的内存缓冲区中进行，不需要查找内存，内存分配的时间是常数；而且不会出现在程序运行中途出现内存不足的异常。所以，placement new非常适合那些对时间要求比较高，长时间运行不希望被打断的应用程序。

####5. 使用步骤
在很多情况下，placement new的使用方法和其他普通的new有所不同。这里提供了它的使用步骤。

######第一步  缓存提前分配

有三种方式：

    1.为了保证通过placement new使用的缓存区的memory alignmen(内存队列)正确准备，使用普通的new来分配它：在堆上进行分配
    
    class Task ;
    
    char \* buff = new [sizeof(Task)]; //分配内存
    
    (请注意auto或者static内存并非都正确地为每一个对象类型排列，所以，你将不能以placement new使用它们。)
    
    2.在栈上进行分配
    
    class Task ;
    char buf[N\*sizeof(Task)]; //分配内存
    
    3.还有一种方式，就是直接通过地址来使用。(必须是有意义的地址)

    void* buf = reinterpret_cast<void*> (0xF00F);

######第二步：对象的分配

在刚才已分配的缓存区调用placement new来构造一个对象。

    Task *ptask = new (buf) Task
######第三步：使用
按照普通方式使用分配的对象：

    ptask->memberfunction();

    ptask-> member; //...
    
######第四步：对象的析构

一旦你使用完这个对象，你必须调用它的析构函数来毁灭它。按照下面的方式调用析构函数：

    ptask->~Task(); //调用外在的析构函数

######第五步：释放

你可以反复利用缓存并给它分配一个新的对象（重复步骤2，3，4）如果你不打算再次使用这个缓存，你可以象这样释放它：

    delete [] buf;

跳过任何步骤就可能导致运行时间的崩溃，内存泄露，以及其它的意想不到的情况。如果你确实需要使用placement new，请认真遵循以上的步骤。

####6. Example [operator new[]](http://www.cplusplus.com/reference/new/operator%20new[]/)

{% highlight c %}
// operator new[] example
#include <iostream>     // std::cout
#include <new>          // ::operator new[]

struct MyClass {
  int data;
  MyClass() {std::cout << '*';}  // print an asterisk for each construction
};

int main () {
  std::cout << "constructions (1): ";
  // allocates and constructs five objects:
  MyClass * p1 = new MyClass[5];
  std::cout << '\n';

  std::cout << "constructions (2): ";
  // allocates and constructs five objects (nothrow):
  MyClass * p2 = new (std::nothrow) MyClass[5];
  std::cout << '\n';

  std::cout << "constructions (3): ";
  // allocates storage for five objects, but does not construct them:
  MyClass * p3 = static_cast<MyClass*> (::operator new (sizeof(MyClass[5])));
  std::cout << '\n';

  std::cout << "constructions (4): ";
  // constructs five objects at p3, but does not allocate:
  new (p3) MyClass[5];
  std::cout << '\n';

  delete[] p3;
  delete[] p2;
  delete[] p1;

  return 0;
}
{% endhighlight %}
####Output:

    constructions (1): *****
    constructions (2): *****
    constructions (3): 
    constructions (4): *****


###二．delete用法:
{% highlight c %}
 1. int *a = new int;
         delete a;   //释放单个int的空间
 2.int *a = new int[5];
        delete [] a; //释放int数组空间
{% endhighlight %}
 要访问new所开辟的结构体空间,无法直接通过变量名进行,只能通过赋值的指针进行访问.
 用new和delete可以动态开辟,撤销地址空间.在编程序时,若用完一个变量(一般是暂时存储的数组),下次需要再用,但却又想省去重新初始化的功夫,可以在每次开始使用时开辟一个空间,在用完后撤销它.

--- 
###总结

1. 函数new

    void \*operator new(size_t size); 在堆上分配一块内存，和placement new（void \*operator new(size_t, void\* buffer)）; 在一块已经存在的内存上创建对象，如果你已经有一块内存，placement new会非常有用，事实上，它STL中有着广泛的使用。
                                                                                         
2. 运算符new
最常用的new，没什么可说的。

3. 函数new不会自动调用类的构造函数，因为它对分配的内存类型一无所知；而运算符new会自动调用类的构造函数。

4. 函数new允许重载，而运算符new不能被重载。

