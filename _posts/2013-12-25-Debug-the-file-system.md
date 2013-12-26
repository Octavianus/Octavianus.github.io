---
layout: post
category : Technology 
tagline: "开发大型软件的好帮手"
tags : [Experience, Technology]
---
{% include JB/setup %}

#### 调试一个文件系统会面临诸多的问题，如果方式不对，即使通宵一整夜也无法找到问题所在，相信我，我们需要竟可能的缩小出现bug的可能情况。

所以程序员需要有合适的工具帮助他们快速定位错误。
譬如从一个文件系统的上层设计的角度，你需要跟踪一个变量从上层传递到下一层有哪些操作改变了他们的值，这个时候`gdb`就能满足要求，设置判断条件，逐层设置断点观察变量。
再从另外一个角度，一个文件系统的底层设计涉及到大量的内存操作，拷贝一段内容到内存，从一个指针指向的内存地址读出指定长度的数据等等.经常会出现segment fault然后core dump.
造成段错误的原因有很多，对于一个文件系统来说以下问题更为常见：

* 内存访问越界：
    * (a) 在搜索字符串时，依靠字符串结束符来判断字符串是否结束，但是字符串没有正常的使用结束符。
    * (b) 最常见的要数使用strcpy, strcat, sprintf, strcmp, strcasecmp等字符串操作函数，将目标字符串读/写爆。应该使用strncpy, strlcpy, strncat, strlcat, snprintf, strncmp, strncasecmp等函数防止读写越界。
可是很多人偷懒，疲于仔细计算每一个分配的空间需要的字节数，或者计算错误导致越界
    * (c) 另外要说明的是memcpy更是一个重灾区,详细内容会在后面说。

* 非法指针：
    * (a) 使用空指针
    * (b) 随意使用指针转换。一个指向一段内存的指针，除非确定这段内存原先就分配为某种结构或类型，或者这种结构或类型的数组，否则不要将它转换为这种结构或类型 的指针，而应该将这段内存拷贝到一个这种结构或类型中，再访问这个结构或类型。这是因为如果这段内存的开始地址不是按照这种结构或类型对齐的，那么访问它 时就很容易因为bus error而core dump.

* 堆栈溢出：不要使用大的局部变量（因为局部变量都分配在栈上），这样容易造成堆栈溢出，破坏系统的栈和堆结构，导致出现莫名其妙的错误。

这个时候，生成内存内核转储文件，把程序工作的当前状态存储成一个文件结合gdb调试。[代码调试--先内核转储文件再gdb调试](http://blog.csdn.net/hust_wusen/article/details/8776116)

另外一个强大的调试工具Valgrind也可以解决这类问题，我极力推荐，valgrind可以检查内存使用是否存在非法内存访问，和内存泄漏。
调试的过程如下
```c    
     David:  ==9166== Invalid read of size 4
    ==9166==    at 0x804A5AC: LFS_Open (LFS.c:155)
    ==9166==    by 0x804A6E6: LFS_Mkdir (LFS.c:183)
    ==9166==    by 0x405266B: fuse_mkdir (fuse.c:1223)
    ==9166==    by 0xFFFFFFFD: ???
    ==9166==  Address 0x430799c is not stack'd, malloc'd or (recently) free'd
     Sent at 7:14 PM on Tuesday
     David:  ==9265== Invalid write of size 4
    ==9265==    at 0x8048DE8: Dir_Open_File (dir.c:106)
    ==9265==    by 0x804A5BA: LFS_Open (LFS.c:156)
    ==9265==    by 0x804A6C8: LFS_Mkdir (LFS.c:183)
    ==9265==    by 0x405266B: fuse_mkdir (fuse.c:1223)
    ==9265==    by 0xFFFFFFFD: ???
    ==9265== Address 0x4307998 is 12 bytes after a block of size 4 alloc'd
    ==9265==    at 0x402BE68: malloc (in /usr/lib/valgrind/vgpreload_memcheck-x86-linux.so)
    // open a directory or file
    int Dir_Open_File(const char *path, struct fuse_file_info *fi)
    {
           Inode *myNode;
           int status;
    
           status = Get_Inode(path, &myNode);
           if(status) {printf("openning file fail\n"); return status;}
    
           printf("---------------------------ino: %d \n", myNode>ino);
           fi->fh = myNode->ino;
    
           return status;
    }
```

可以看到再没出现问题的时候会有这样的提示`==9166== Invalid read of size 4`and`==9265== Invalid write of size 4`这个4个单位的读和写可以一直追踪到造成越界读或者写操作涉及的函数。
或者更多的是某个地址空间出现的问`Address 0x4307998 is 12 bytes after a block of size 4 alloc'd`，我们都可以根据这些提示信息定位问题并且修复，就上面一个问题而言，段错误出现在fuse中，然而fuse是久经考验的客户态文件系统开发库，不会有问题，用gdb发现之所以是fuse内部报段错误，是因为他内部的一个结构指针莫名其妙的变为0了，访问的时候就成segment fault了。 
我继续跟踪了下，最后发现了源头在log.c:1320文件中的writeToLog函数中的memcpy函数，然后我用valgrind检查了下内存访问情况，发现在这个地方的确存在非法内存写，也就是说在这个memcpy中覆盖了堆中的其他内存区域，造成了fuse内部那个结构指针变为0，报段错误我跟踪的时候发现每次创建文件的时候调用三次WriteToLog函数，第二次创建就会失败，我发现在创建第二个文件时，第二次还是第三次调用WriteToLog文件时会有内存覆盖，所以在这个创建操作返回到fuse框架内部后，就会有段错误 
之后我们好好想想这个拷贝函数的内存地址你计算对了没之后，查到问题的确出在memcpy这个函数， copy大小和分配的大小要一致，否则就会越界访问。
之前存一个自定义的数据结构segment,一个指针类型的变量tseg的时候，比如那个结构中存有指向其他地址的指针，即使想计算sizeof(tseg). 但是指针存的内容无法计算出来，只有通过这种方法计算出来才能分配到真确的空间:

```c
memcpy(buffer + offset, cache_walker->seg
        + log_addr->bk_no * bk_size * FLASH_SECTOR_SIZE,
        bks_remain * bk_size * FLASH_SECTOR_SIZE);
```
 
先声明成void 指针的类型然后用的时候再cast成想要的结构类型
最后就是一个一个的解决 invaliad write of x bytes的问题一个一个算对，就没有bug了。

___Valgrind可以给你带来希望！因为当出现段错误时，使用Valgrind运行程序就不一定会出错，因为Valgrind有着不同的内存分配机制，也许在之前环境下出现了段错误，在valgrind下就可以正常运行了，不过内存覆盖或者读越界的问题仍然存在，只是越界的区域内的内容不是关键内容，所以程序仍然可以正常运行。___


####排除了程序运行的问题以后，给大家介绍另外一个工具[`callgrind`](http://valgrind.org/info/tools.html#callgrind),它可以分析程序每个函数所使用的时间，分析系统瓶颈很方便.
