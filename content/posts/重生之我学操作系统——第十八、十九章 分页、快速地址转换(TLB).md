+++
categories = ['笔记']
tags = ['操作系统']
title = '重生之我学操作系统——第十八、十九章 分页、快速地址转换(TLB)'
slug = 'note-os-18&19-Paging-and-Fast-Address-Translation'
date = 2024-09-17T16:55:27+08:00
lastmod = 2024-09-17T16:55:27+08:00
draft = false
+++

## 一、“分页”地址转换

### 1. 分页基本原理

分页(paging)是将地址空间划分成固定大小的分片单元， 称为页/页面(page)

相对应的，物理内存同样也要分为相同大小的单元， 叫做页帧(page frame)

![enter image description here](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/54.png)

- 页表是每个进程一个(per process)的数据结构
	- 示例中的页表有四个条目： 
		- VP0->PF3, 
		- VP1->PF7, 
		- VP2->PF5, 
		- VP3->PF2
	- 假设虚拟地址空间是64字节，页大小为16字节(有4页)
		- 虚拟地址为6位，可以分为两个部分 
			- 虚拟页号(**VPN**)：virtual page number 
			- 页内偏移(**Offset**)：offset within the page
		- 虚拟地址“21”的转换过程

![enter image description here](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/55.png)

eg：按照上图页表，虚拟地址“50”转换为物理地址是 <u> 34 </u>

### 2. 页表的存放位置

- 问题：页表可能很大 
	- 32位地址空间(4GB)，带有4KB的页：20位的VPN，12位的offset 
		- 单个页表大小： $4 MB= 2^{20} entries *  4 Bytes$
- 页表存在**内存**里
- 通过页表基址寄存器(**PTBR**)在内存中找到页表的位置

### 3. 页表内容

- 页表就是一种数据结构 
	- 最简单的形式：线性页表，就是一个数组 
		- OS通过虚拟页号(**VPN**)检索数组，并在该索引处查找页表项(**PTE**)，进 一步找到物理页帧号(**PFN**)
		- 有效位(Valid Bit): 表明特定地址转换是否有效
		- 保护位(Protection Bit): 表明页的权限(读，写，执行)
		- 存在位(Present Bit): 表明该页是在内存里还是磁盘上
		- 脏位(Dirty Bit): 表明页面进入内存后是否修改过
		- 参考位/访问位(Reference Bit): 表明追踪页是否被访问

![enter image description here](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/56.png)

示例：x86页表项

![enter image description here](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/57.png)

### 4. 访存示例

#### 例1

``` asm
movl 21,%eax
```

地址转换过程：

``` cpp
// Extract the VPN from the virtual address
VPN = (VirtualAddress & VPN_MASK) >> SHIFT
// Form the address of the page-table entry (PTE)
PTEAddr = PTBR + (VPN * sizeof(PTE))
// Fetch the PTE
PTE = AccessMemory(PTEAddr)

// Check if process can access the page 
if (PTE.Valid == False) {
    RaiseException(SEGMENTATION_FAULT);
} else if (CanAccess(PTE.ProtectBits) == False) {
    RaiseException(PROTECTION_FAULT);
} else {
    // Access is OK: form physical address and fetch it 
    offset = VirtualAddress & OFFSET_MASK;
    PhysAddr = (PTE.PFN << SHIFT) | offset;
    Register = AccessMemory(PhysAddr);
}
```

#### 例2

``` cpp
int array[1000]; 
... 
for (i = 0; i < 1000; i++) 
	array[i] = 0;
```
对应汇编：

``` asm
0x1024 movl $0x0,(%edi,%eax,4) 
0x1028 incl %eax 
0x102c cmpl $0x03e8,%eax 
0x1030 jne 0x1024
```
假设： 

- 页大小：1KB 
- 数组虚拟地址： [40000, 44000)

![enter image description here](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/58.png)

### “分页”小结

- 基本原理 
	- 相同大小划分、page、page frame、page table、VPN、PTE、PFN 
- 页表存放位置 
	- 页表可能很大、内存、页表基址寄存器(PTBR) 
- 页表内容 
	- PFN+一些记录位 
- 访存过程  
	- 地址转换需要一次额外的内存访问

有没有办法加速页表的访问？

## 二、分页中的快速地址转换(TLB)

### 1. TLB基本原理

- 地址转换旁路缓冲存储器(translation lookaside buffer)
	- 是一种硬件，是芯片上MMU的一部分
	- 核心思想是缓存频繁发生的地址转换

![enter image description here](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/59.png)

``` cpp
VPN = (VirtualAddress & VPN_MASK) >> SHIFT;
(Success, TlbEntry) = TLB_Lookup(VPN);

if (Success == True) { // TLB Hit
    if (CanAccess(TlbEntry.ProtectBit) == True) {
        offset = VirtualAddress & OFFSET_MASK;
        PhysAddr = (TlbEntry.PFN << SHIFT) | offset;
        AccessMemory(PhysAddr);
    } else {
        RaiseException(PROTECTION_ERROR);
    }
} else { // TLB Miss
    PTEAddr = PTBR + (VPN * sizeof(PTE));
    PTE = AccessMemory(PTEAddr);
    
    if (...) {
        ...
    } else {
        TLB_Insert(VPN, PTE.PFN, PTE.ProtectBits);
        RetryInstruction();
    }
}
```

### 2. TLB未命中的处理

- 第一种：硬件全权处理(在CISC上) 
	- 硬件知道页表在内存的具体位置 
	- 硬件“遍历”页表，找到页表项 
	- 取出转换映射，更新TLB，然后重试指令

- 第二种：软件处理(在RISC上) 
	- 如果出现TLB miss，硬件抛出异常
	- 暂停指令，提升特权级 
	- 跳转到陷阱处理程序 
	- …

### 3. TLB的内容

- TLB是全相联(fully associative)的 
	- 典型的TLB可能有32，64或128项 
	- 硬件并行搜索整个TLB 
	- other bits: 有效位、保护位、地址空间标识符(ASID)、脏位 

地址格式：| VPN | PFN | other bits |

- ASID

![enter image description here](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/60.png)

### 4.TLB替换策略

- 和所有缓存一样，需要考虑缓存替换 
	- 例：替换最近最少使用(LRU, Least Recently Used)

![enter image description here](https://cdn.jsdelivr.net/gh/Satori5ama/Figurebed@main/img/61.png)

### “TLB”小结

- 基本原理 
	- 利用程序的局部性原理，加入缓存 
- TLB未命中的处理 
	- 硬件处理、软件处理 
- TLB内容 
	- ASID 
- 替换策略 
	- LRU

到目前为止，页表还有什么问题没有解决？ 
