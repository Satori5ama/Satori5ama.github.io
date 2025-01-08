+++

categories = ['笔记']
tags = ['网安','Windows-Rootkits']
title = '源代码阅读项目——CheckKernelEATHook'
slug = 'Source-Code-Reading-Project-CheckKernelEATHook"'
date = 2025-01-08T08:52:25+08:00
lastmod = 2025-01-08T19:52:25+08:00
draft = false

+++

[ciyze0101/Windows-Rootkits](https://github.com/ciyze0101/Windows-Rootkits/tree/master)

# 项目概况

``` markdown
+---CheckKernelHook
|   |   CheckKernelHook.sln
|   |
|   \---CheckKernelHook
|       |   AddService.cpp
|       |   AddService.h
|       |   CheckKernelHook.aps
|       |   CheckKernelHook.cpp
|       |   CheckKernelHook.h
|       |   CheckKernelHook.rc
|       |   CheckKernelHook.vcxproj
|       |   CheckKernelHook.vcxproj.filters
|       |   CheckKernelHookDlg.cpp
|       |   CheckKernelHookDlg.h
|       |   resource.h
|       |   stdafx.cpp
|       |   stdafx.h
|       |   targetver.h
|       |   tempCodeRunnerFile.cpp
|       |
|       \---res
|               CheckKernelHook.ico
|               CheckKernelHook.rc2
|               ReadMe.txt
|
\---CheckKernelHookDrv
    |   CheckKernelHook.sln
    |
    \---CheckKernelHook
            CheckKernelHook.vcxproj
            CheckKernelHook.vcxproj.filters
            Common.c
            Common.h
            DriverEntry.c
            DriverEntry.h
            FileSystem.c
            FileSystem.h
            FixRelocation.c
            FixRelocation.h
            KernelHookCheck.c
            KernelHookCheck.h
            KernelReload.c
            KernelReload.h
            libdasm.c
            libdasm.h
            ReadMe.txt
            Reload.c
            Reload.h
            sources
            tables.h
```

该项目是一个用于检测和管理Windows内核钩子（Kernel Hooks）的应用程序，主要包括用户界面部分和内核驱动部分。

### 用户界面部分（User Interface）

#### 1. CheckKernelHook 应用程序
- **功能**：提供一个图形用户界面，用于检测和显示内核钩子信息。
- **组成**：
  - **CheckKernelHook.h/cpp**：定义和实现应用程序的主类`CCheckKernelHookApp`，负责应用程序的初始化和消息处理。
  - **CheckKernelHookDlg.h/cpp**：定义和实现主对话框类`CCheckKernelHookDlg`，用于显示检测到的内核钩子信息，并提供用户交互界面。
  - **AddService.h/cpp**：提供驱动程序的加载和卸载功能，包括创建新的驱动文件、加载和卸载指定的驱动程序。

#### 2. 功能实现
- **检测内核钩子**：通过与内核驱动程序通信，获取系统中存在的钩子信息，并在对话框中以列表形式展示。
- **驱动程序管理**：提供驱动程序的加载和卸载功能，方便对驱动程序进行维护和更新。

### 内核驱动部分（Kernel Driver）

#### 1. CheckKernelHookDrv 驱动程序
- **功能**：在内核模式下检测内核钩子，并提供与用户界面通信的接口。
- **组成**：
  - **Common.h/c**：定义和实现一些通用的内核操作函数，如操作码解析、文件映射、函数长度计算等。
  - **DriverEntry.c**：定义驱动程序的入口函数`DriverEntry`，负责驱动程序的初始化和卸载。
  - **FixRelocation.c**：实现PE文件重定位表的修复功能，确保程序在加载到新的基地址时能够正确运行。
  - **KernelHookCheck.c**：实现内核钩子检测的核心逻辑，包括获取系统内核模块信息、修复导入表、加载PE文件等。
  - **libdasm.c**：实现x86反汇编功能，将机器码转换为可读的汇编语言指令。
  - **reload.c**：实现内核模块的重载和SSDT表的修复功能，确保内核函数的调用是安全的、未被篡改的。

#### 2. 功能实现
- **内核钩子检测**：通过分析内核模块和系统服务描述符表（SSDT），检测内核中存在的钩子行为。
- **内核模块重载**：加载并重载内核模块，修复SSDT表中的函数地址，确保内核函数的调用安全性。
- **与用户界面通信**：通过设备I/O控制码与用户界面进行通信，提供检测到的内核钩子信息。

### 总结
该项目通过用户界面和内核驱动的协同工作，实现了对Windows内核钩子的检测和管理。用户界面部分负责提供用户交互界面和驱动程序管理功能，而内核驱动部分则负责在内核模式下进行钩子检测、模块重载和SSDT修复等核心操作。整体上，该项目能够有效地检测和管理内核钩子，有助于提高系统的安全性和稳定性。



# 主要函数

### 用户界面部分

#### CheckKernelHook.h
- **函数**：
  - `CCheckKernelHookApp()`：构造函数，用于初始化应用程序实例。
  - `InitInstance()`：重写自`CWinApp`的虚方法，负责应用程序的初始化工作，如创建主窗口。
- **功能**：定义Windows MFC应用程序的主类`CCheckKernelHookApp`，设置应用程序的基本框架，包括必要的头文件引用、资源文件引用以及应用程序的初始化和消息处理机制.

#### CheckKernelHook.cpp
- **函数**：
  - `BEGIN_MESSAGE_MAP()`和`END_MESSAGE_MAP()`：定义消息映射，将命令与相应的处理函数关联。
  - `CCheckKernelHookApp::CCheckKernelHookApp()`：构造函数实现，设置应用程序支持重新启动管理器的标志。
  - `InitInstance()`：应用程序初始化函数的实现，包括公共控件的初始化、Shell管理器的创建、注册表设置、对话框的创建与显示以及应用程序退出的处理。
- **功能**：实现Windows应用程序的初始化、环境设置、对话框管理和用户交互处理，提供一个可以与用户进行互动的简单界面.

#### CheckKernelHookDlg.h
- **函数**：
  - `CCheckKernelHookDlg()`：构造函数，用于创建对话框对象。
  - `DoDataExchange()`：用于对话框数据交换的函数。
  - `OpenDevice()`：用于打开设备的函数，返回设备句柄。
  - `CheckKernelHook()`：用于检查内核钩子的函数。
  - `InsertDataToList()`：用于将钩子信息插入到列表中的函数。
  - `OnInitDialog()`：对话框初始化函数。
  - `OnSysCommand()`：处理系统命令的函数。
  - `OnPaint()`：处理绘图的函数。
  - `OnQueryDragIcon()`：返回对话框图标的函数.
- **功能**：定义用于检查内核钩子的对话框类`CCheckKernelHookDlg`，实现对话框的创建、初始化、数据交换、设备通信、钩子检测、信息展示以及界面绘制等功能，为用户提供一个直观的钩子检测界面.

#### CheckKernelHookDlg.cpp
- **函数**：
  - `CAboutDlg`类的相关函数：用于处理“关于”对话框的显示。
  - `CCheckKernelHookDlg`类的构造函数、数据交换函数、初始化函数、系统命令处理函数、绘图函数和图标查询函数的实现。
  - `CheckKernelHook()`：检查内核钩子状态的实现，向驱动程序发送IO控制请求，获取钩子信息。
  - `InsertDataToList()`：将钩子信息插入到列表控件的实现，提取数据并填充到对话框的列表中.
- **功能**：实现对话框类的具体功能，包括对话框的创建和显示、与驱动程序的通信、钩子信息的获取和展示，以及用户界面的交互和绘制.

#### AddService.h
- **函数**：
  - `Release()`：释放相关资源的函数。
  - `UnloadDrv()`：卸载指定驱动程序的函数。
  - `LoadDrv()`：加载指定驱动程序的函数.
- **功能**：提供驱动程序的管理接口，包括资源释放、驱动卸载和驱动加载，为驱动程序的维护和更新提供支持.

#### AddService.cpp
- **函数**：
  - `Release()`：实现释放资源并创建新的驱动文件的功能。
  - `UnloadDrv()`：实现卸载指定驱动程序的功能，包括打开服务控制管理器、打开服务、停止和删除服务等步骤。
  - `LoadDrv()`：实现加载指定驱动程序的功能，包括卸载已存在的同名驱动、获取驱动程序的完整路径、打开服务控制管理器、创建和启动服务等步骤.
- **功能**：实现对Windows驱动程序的管理，包括创建、加载和卸载驱动程序，确保驱动程序的正常运行和更新.

### 内核驱动部分

#### Common.h
- **函数**：
  - `RtlImageNtHeader()`：获取可执行映像文件的NT头信息的函数。
  - `MapFileInUserSpace()`：将指定文件映射到指定进程的用户空间中的函数。
  - `GetSSDTApiFunctionIndexFromNtdll()`：从ntdll.dll中获取特定的SSDT API函数索引的函数。
  - `IsAddressInSystem()`：检查给定地址是否属于系统模块的函数。
  - `GetFunctionCodeSize()`：获取特定函数的代码大小的函数。
  - `SizeOfCode()`：计算给定代码的大小并识别操作码的函数.
- **功能**：为内核驱动开发提供基本的工具和接口，包括信息获取、内存映射、函数代码分析等，便于处理不同的进程、文件和系统服务.

#### Common.c
- **函数**：
  - `MapFileInUserSpace()`：实现将文件映射到用户空间的功能，包括创建文件句柄、创建文件映射区域、映射到进程地址空间等步骤。
  - `GetFunctionCodeSize()`：实现计算函数代码大小的功能，通过循环分析指令并调用`SizeOfCode()`函数获取各指令长度.
  - `SizeOfCode()`：实现计算代码段大小的功能，通过分析操作数标志位来适应不同类型的数据操作.
  - `IsAddressInSystem()`：实现检查地址是否在系统模块中的功能，包括查询模块信息、分配内存获取模块列表、遍历模块查找地址等步骤.
- **功能**：实现操作码解析、文件映射、函数长度计算和地址验证等功能，为内核驱动的开发和运行提供底层支持，便于进行代码分析、文件操作和系统模块管理.

#### DriverEntry.c
- **函数**：
  - `DriverEntry()`：驱动程序的入口函数，负责初始化驱动程序。
  - `ControlPassThrough()`：处理设备控制请求的函数。
  - `DefaultPassThrough()`：处理未明确指定的IRP请求的函数。
  - `UnloadDriver()`：驱动程序卸载时的清理函数.
- **功能**：实现驱动程序的初始化、设备控制请求处理、默认IRP请求处理和卸载清理等功能，为驱动程序的正常运行和管理提供基础.

#### FixRelocation.c
- **函数**：
  - `FixBaseRelocTable()`：修复重定位表的函数。
  - `LdrProcessRelocationBlockLongLong()`：处理重定位块的函数。
  - `RtlImageNtHeaderEx()`：获取PE文件的NT头并进行有效性检查的函数。
- **功能**：实现PE文件重定位表的修复、重定位块的处理以及NT头的获取和检查，确保程序在加载到新的基地址时能够正确运行，为动态加载和重定位提供支持.

#### KernelHookCheck.c
- **函数**：
  - `GetSystemKernelModuleInfo()`：获取系统内核模块信息的函数。
  - `IoGetFileSystemVpbInfo()`：获取文件系统的VPB信息的函数。
  - `GetDeviceObjectFromFileFullName()`：从文件完整路径获取设备对象的函数。
  - `GetWindowsRootName()`：获取Windows根目录名称的函数。
  - `KernelOpenFile()`：在内核中打开文件的函数。
  - `KernelGetFileSize()`：获取文件大小的函数。
  - `KernelReadFile()`：从文件中读取数据的函数。
  - `ImageFile()`：判断是否为映像文件的函数。
  - `AlignSize()`：对齐大小的函数。
  - `GetKernelModuleBase()`：获取内核模块基址的函数。
  - `InsertOriginalFirstThunk()`：插入原始第一个[Thunk](https://www.ruanyifeng.com/blog/2015/05/thunk.html)的函数。
  - `MiFindExportedRoutine()`：查找导出例程的函数。
  - `FixImportTable()`：修复导入表的函数。
  - `PeLoad()`：加载PE文件的函数.
- **功能**：实现内核钩子检测的核心逻辑，包括文件操作、内核模块信息获取、PE文件处理、内存对齐、模块基址获取、导入表修复、导出例程查找以及PE文件加载等功能，为检测和管理内核钩子提供关键支持.

#### libdasm.c
- **函数**：
  - `FETCH8()`、`FETCH16()`、`FETCH32()`：字节序转换函数。
  - `get_real_instruction()`、`get_real_instruction2()`：指令解析函数。
  - `get_operand()`：操作数解析函数。
  - `get_operand_string()`：打印操作数字符串的函数。
  - `get_instruction()`：获取指令的函数。
  - `get_instruction_string()`：打印指令字符串的函数.
  - 一系列辅助函数：用于获取操作数的具体信息，如寄存器类型、操作数类型、立即数、位移等.
- **功能**：实现x86反汇编功能，将机器码转换为可读的汇编语言指令，支持字节序转换、指令解析、操作数提取以及指令字符串生成等，为代码分析和调试提供工具.

#### reload.c
- **函数：**
  - `ReLoadNtosCALL()`：根据函数名、原始内核模块基址和重载后的内核模块基址，计算并返回重载后的函数地址。
  - `ReLoadNtos()`：初始化并重载内核模块，包括获取系统内核模块信息、加载并初始化重载后的内核模块、重载关键函数等步骤.
  - `InitSafeOperationModule()`：加载并初始化重载后的内核模块，修复SSDT表，创建并初始化安全服务描述符表.
  - `FixOriginalKiServiceTable()`：修复SSDT表中的函数地址，使其指向重载后的内核模块.
  - `GetOriginalKiServiceTable()`：通过重定位表获取原始的SSDT基址.
- **功能**：实现内核模块的重载和SSDT表的修复，确保内核函数的调用是安全的、未被篡改的，为内核安全提供保障.

# 功能

1. ***重新加载第一个内核模块***：这通常指的是在操作系统的内核环境中，卸载并再次加载一个特定的驱动程序或模块。这种操作通常用于测试模块的功能、更新模块或解决由于模块问题导致的系统故障。重新加载内核模块有助于确保模块的最新状态被应用。
2. ***检查EAT函数（[Zwxx](https://www.cnblogs.com/liaoguifa/p/9647870.html)）***：EAT（Export Address Table）是Windows操作系统中的一个重要数据结构，用于管理导出函数的地址。在检查EAT函数时，我们通常会关注像Zwxx这样的函数，这些函数是内核模式下的系统调用接口。检查EAT函数常常意味着要验证这些函数的行为、地址或任何可能的异常，以确保它们按预期工作。
3. ***检查InlineHook（非Zwxx）***：InlineHook是一种技术，用于在函数调用的开始处插入自定义代码，以改变函数的执行流（比如拦截调用或修改参数）。在检查InlineHook时，我们关注的是非Zwxx的其他系统调用或函数，目的是确保这些函数的执行未被篡改，或者检测是否有恶意代码插入。通常，这样的检查涉及分析特定内存地址的内容和状态。



# 1. CheckKernelHook

## 1.1 CheckKernelHook.h

这段代码是一个C++头文件，主要用于定义一个Windows应用程序的主类。下面逐步分解并详细解释代码的每个部分：

1. **文件描述和预处理指令**：
   
   ```cpp
   // CheckKernelHook.h : PROJECT_NAME 应用程序的主头文件
   
   #pragma once
   ```
   这部分是文件注释，表明该文件为某个项目的主头文件。而`#pragma once`是一种预处理指令，用于确保该头文件只会被编译一次，防止重复包含。
   
2. **条件编译**：
   
   ```cpp
   #ifndef __AFXWIN_H__
       #error "在包含此文件之前包含“stdafx.h”以生成 PCH 文件"
   #endif
   ```
   这段代码是一个条件编译检查，确保在包含`CheckKernelHook.h`文件之前，已经包含了`stdafx.h`，这是一个预编译头文件。若没有包含，编译器将会生成错误消息。
   
3. **资源文件的包含**：
   
   ```cpp
   #include "resource.h"    // 主符号
   ```
   这行代码包含了一个资源文件头（`resource.h`），这个文件通常定义了应用程序中使用的资源符号，例如图标、菜单和对话框等。
   
   resource.h内容如下：
   
   ``` cpp
   //{{NO_DEPENDENCIES}}
   // Microsoft Visual C++ generated include file.
   // Used by CheckKernelHook.rc
   
   // 该代码的主要功能是为一个 Windows 应用程序（CheckKernelHook）定义和管理资源标识符
   
   #define IDM_ABOUTBOX                    0x0010
   #define IDD_ABOUTBOX                    100
   #define IDS_ABOUTBOX                    101
   #define IDD_CHECKKERNELHOOK_DIALOG      102
   #define IDR_MAINFRAME                   128
   #define IDC_LIST1                       1000
   #define IDC_LIST                        1000
   
   /* 这些 #define 语句定义了一系列的标识符（ID），用于在资源文件和程序代码中引用不同的窗口、对话框、菜单和控件等。具体说明：
   IDM_ABOUTBOX：标识菜单项的ID。
   IDD_ABOUTBOX：标识关于对话框的ID。
   IDS_ABOUTBOX：标识关于对话框所使用的字符串ID。
   IDD_CHECKKERNELHOOK_DIALOG：标识主对话框的ID。
   IDR_MAINFRAME：标识主窗口框架的ID。
   IDC_LIST1 和 IDC_LIST：标识列表控件的ID（在此处是相同的）。
   */
   
   // Next default values for new objects
   // 
   #ifdef APSTUDIO_INVOKED
   #ifndef APSTUDIO_READONLY_SYMBOLS
   #define _APS_NEXT_RESOURCE_VALUE        129
   #define _APS_NEXT_COMMAND_VALUE         32771
   #define _APS_NEXT_CONTROL_VALUE         1001
   #define _APS_NEXT_SYMED_VALUE           101
   
   /* 这一部分为新的资源对象定义了默认值，仅在使用 Microsoft Visual Studio 的资源编辑器时有效，以便快速创建新的资源。这种用法有助于避免 ID 冲突。*/
   #endif
   #endif
   ```
   
   
   
4. **CCheckKernelHookApp类的定义**：
   ```cpp
   class CCheckKernelHookApp : public CWinApp
   {
   public:
       CCheckKernelHookApp();
   
       // 重写
   public:
       virtual BOOL InitInstance();
   
       // 实现
   
       DECLARE_MESSAGE_MAP()
   };
   ```
   这里定义了`CCheckKernelHookApp`类，它继承自`CWinApp`，这是MFC（Microsoft Foundation Class）库中定义的一个类，代表Windows应用程序的基础结构。  
   - **构造函数** `CCheckKernelHookApp()`：用于初始化类的实例。
   - **InitInstance()**：这是一个虚方法，重写了`CWinApp`中的同名方法。这个方法通常负责应用程序的初始化工作，例如创建主窗口。
   - **DECLARE_MESSAGE_MAP()**：这是一个宏，用于声明消息映射，这样类可以接收Windows消息并且执行相应的处理。

5. **全局变量的声明**：
   ```cpp
   extern CCheckKernelHookApp theApp;
   ```
   这行代码声明了一个全局变量`theApp`，这个变量的类型是`CCheckKernelHookApp`，用于在整个程序中访问该应用程序实例。

### 总结
这段代码的主要功能是定义一个Windows MFC应用程序的主类`CCheckKernelHookApp`，并设置其基本框架。它包括了必要的头文件、资源文件的引用，并声明了应用程序的初始化函数以及消息处理机制。整体上，它为后续实现应用程序的功能提供了基础结构。



## 1.2 CheckKernelHook.cpp

这段代码是一个使用 MFC（Microsoft Foundation Class）库开发的 Windows 应用程序。其主要目的是初始化应用程序、创建主对话框并处理用户的交互。以下是对代码的逐步分解与详细解释：

1. **头文件包含**：
   
   ```cpp
   #include "stdafx.h"
   #include "CheckKernelHook.h"
   #include "CheckKernelHookDlg.h"
   ```
   这部分代码引入了程序功能所需的头文件。`stdafx.h` 是预编译头文件，用于加速编译过程。`CheckKernelHook.h` 和 `CheckKernelHookDlg.h` 分别是主应用程序类和对话框类所需的头文件。
   
2. **DEBUG宏定义**：
   
   ```cpp
   #ifdef _DEBUG
   #define new DEBUG_NEW
   #endif
   ```
   这段代码用于调试模式，重定义 `new` 操作符，以便在 DEBUG 模式下跟踪内存分配问题。
   
3. **CCheckKernelHookApp 类**：
   ```cpp
   BEGIN_MESSAGE_MAP(CCheckKernelHookApp, CWinApp)
   ON_COMMAND(ID_HELP, &CWinApp::OnHelp)
   END_MESSAGE_MAP()
   ```
   这里定义了一个消息映射，将 `ID_HELP` 命令与 `CWinApp` 类的 `OnHelp` 函数关联。消息映射是 MFC 处理用户输入以及窗口消息的机制。

4. **构造函数**：
   ```cpp
   CCheckKernelHookApp::CCheckKernelHookApp()
   {
       m_dwRestartManagerSupportFlags = AFX_RESTART_MANAGER_SUPPORT_RESTART;
   }
   ```
   在构造函数中，设置应用程序支持重新启动管理器的标志。

5. **应用程序初始化**：
   ```cpp
   BOOL CCheckKernelHookApp::InitInstance()
   {
       INITCOMMONCONTROLSEX InitCtrls;
       InitCtrls.dwSize = sizeof(InitCtrls);
       InitCtrls.dwICC = ICC_WIN95_CLASSES;
       InitCommonControlsEx(&InitCtrls);
       
       CWinApp::InitInstance();
       AfxEnableControlContainer();
   ```

   - 首先，初始化公共控件以确保创建设备窗口的必要控件（如按钮、滚动条等）。
   - 然后调用基类 `CWinApp::InitInstance()` 进行进一步的初始化。
   - 启用控制容器，以支持特定的控件类型。

6. **Shell 管理器创建**：
   ```cpp
   CShellManager *pShellManager = new CShellManager;
   ```
   创建一个 Shell 管理器实例，以支持应用程序中可能包含的 Shell 树视图或列表视图控件。

7. **注册表设置**：
   
   ```cpp
   SetRegistryKey(_T("应用程序向导生成的本地应用程序"));
   ```
   这行代码用于设置存储应用程序设置的注册表位置。
   
8. **对话框创建与显示**：
   ```cpp
   CCheckKernelHookDlg dlg;
   m_pMainWnd = &dlg;
   INT_PTR nResponse = dlg.DoModal();
   ```
   创建一个对话框实例并将其设置为主窗口，随后调用 `DoModal` 函数显示对话框，等待用户响应。

9. **处理对话框响应**：
   ```cpp
   if (nResponse == IDOK)
   {
       // 处理用户按下“确定”的情况
   }
   else if (nResponse == IDCANCEL)
   {
       // 处理用户按下“取消”的情况
   }
   ```

10. **Shell 管理器删除**：
    ```cpp
    if (pShellManager != NULL)
    {
        delete pShellManager;
    }
    ```

11. **应用程序退出**：
    ```cpp
    return FALSE;
    ```
    由于对话框已关闭，返回 `FALSE` 使程序退出而不启动消息循环。

### 总结
这段代码的主要功能是创建一个 Windows 应用程序，初始化必要的环境，打开一个对话框并处理用户的交互。它使用 MFC 框架提供了一些基本功能，如消息映射、公共控件初始化以及对话框管理，目的是提供一个可以与用户进行互动的简单界面。同时，它依赖于 Shell 管理器来处理复杂的控件类型。

## 1.3 CheckKernelHookDlg.h

这段代码是一个C++头文件，定义了一个用于检查内核钩子的对话框类 `CCheckKernelHookDlg`。以下是代码的详细解释：

1. **头文件包含**：
   - `#pragma once`：确保头文件只被包含一次，防止重复定义。
   - `#include "afxcmn.h"`：包含MFC（Microsoft Foundation Classes）的常用头文件，提供了一些常用的MFC类和宏。
   - `#include "resource.h"`：包含资源文件，通常用于定义对话框、菜单、图标等资源的ID。
   - `#include <WinIoCtl.h>`：包含Windows I/O控制相关的头文件，用于设备I/O控制操作。

2. **结构体定义**：
   - `_INLINEHOOKINFO_INFORMATION`：定义了一个结构体，用于存储内联钩子的信息。包含以下字段：
     - `ulHookType`：钩子类型。
     - `ulMemoryFunctionBase`：原始函数的基地址。
     - `ulMemoryHookBase`：钩子函数的基地址。
     - `lpszFunction`：函数名称。
     - `lpszHookModuleImage`：钩子模块的映像名称。
     - `ulHookModuleBase`：钩子模块的基地址。
     - `ulHookModuleSize`：钩子模块的大小。
   - `_INLINEHOOKINFO`：定义了一个结构体，用于存储多个内联钩子的信息。包含以下字段：
     - `ulCount`：钩子的数量。
     - `InlineHook[1]`：一个内联钩子信息的数组，数组大小为1，但通常用于动态分配内存以存储多个钩子信息。

3. **宏定义**：
   - `CTL_CHECKKERNELMODULE`：定义了一个设备I/O控制码，用于与内核模块进行通信。`CTL_CODE`宏用于生成设备控制码，参数包括设备类型、功能码、访问方式和访问权限。

4. **类定义**：
   - `CCheckKernelHookDlg`：继承自`CDialogEx`，表示一个对话框类。包含以下成员：
     - 构造函数：`CCheckKernelHookDlg(CWnd* pParent = NULL)`，用于创建对话框对象。
     - `IDD`：对话框的资源ID。
     - `CheckKernelHook()`：用于检查内核钩子的函数。
     - `InsertDataToList(PINLINEHOOKINFO PInlineHookInfo)`：用于将钩子信息插入到列表中的函数。
     - `DoDataExchange(CDataExchange* pDX)`：用于对话框数据交换的函数。
     - `OpenDevice(LPCTSTR wzLinkPath)`：用于打开设备的函数，返回设备句柄。

5. **其他成员**：
   - `m_hIcon`：对话框的图标句柄。
   - `OnInitDialog()`：对话框初始化函数。
   - `OnSysCommand(UINT nID, LPARAM lParam)`：处理系统命令的函数。
   - `OnPaint()`：处理绘图的函数。
   - `OnQueryDragIcon()`：返回对话框图标的函数。
   - `DECLARE_MESSAGE_MAP()`：声明消息映射宏，用于处理Windows消息。
   - `m_List`：一个`CListCtrl`对象，用于在对话框中显示列表控件。

这段代码主要用于定义一个对话框类，用于检查和显示内核钩子的信息。通过设备I/O控制码与内核模块进行通信，获取钩子信息并显示在对话框中。

## 1.4 CheckKernelHookDlg.cpp

这段代码是一个 Windows 应用程序的实现文件，主要关注于检查内核钩子（Kernel Hook）的功能。代码的主要功能是与驱动程序进行通信，获取系统中存在的钩子信息，并将这些信息以列表形式显示在对话框中。以下是逐步分解和详细解释：

### 包含的头文件
```cpp
#include "stdafx.h"
#include "CheckKernelHook.h"
#include "CheckKernelHookDlg.h"
#include "afxdialogex.h"
#include "AddService.h"
```
- 这些头文件包括了应用程序所需的基本库、对话框类的定义以及其他功能的实现。

### 全局变量
```cpp
HANDLE g_hDevice = NULL; // 全局设备句柄，用于与驱动程序进行通信
```
- `g_hDevice` 是用于与底层驱动程序通信的句柄。

### 列表结构体定义
```cpp
typedef struct
{
    WCHAR*     szTitle;           // 列表的名称
    int        nWidth;            // 列表的宽度
} COLUMNSTRUCT;
```
- 定义一个结构体 `COLUMNSTRUCT`，用于存储列表的列名称和宽度。

### 列表列信息初始化
```cpp
COLUMNSTRUCT g_Column_Data_Online[] = 
{
    {L"原始地址",          148 },
    {L"函数名称",          150 },
    {L"Hook地址",          160 },
    {L"模块名称",          300 },
    {L"模块基址",          80  },
    {L"模块大小",          81  },
    {L"类型",              81  }
};
```
- 初始化了一个包含7列的列表结构，定义了每一列的名称和宽度，这些列用于展示钩子信息。

### 对话框类的实现
```cpp
class CAboutDlg : public CDialogEx
{
    // ... 省略内容
};
```
- `CAboutDlg` 类用于处理“关于”对话框的显示。

### `CCheckKernelHookDlg`对话框类
```cpp
CCheckKernelHookDlg::CCheckKernelHookDlg(CWnd* pParent /*=NULL*/)
    : CDialogEx(CCheckKernelHookDlg::IDD, pParent)
{
    m_hIcon = AfxGetApp()->LoadIcon(IDR_MAINFRAME); // 加载对话框图标
}

void CCheckKernelHookDlg::DoDataExchange(CDataExchange* pDX)
{
    CDialogEx::DoDataExchange(pDX);
    DDX_Control(pDX, IDC_LIST, m_List); // 绑定列表控件
}
```
- 类 `CCheckKernelHookDlg` 继承自 `CDialogEx`，实现主对话框的功能，包括控件的绑定和初始化。

### `OnInitDialog` 方法
```cpp
BOOL CCheckKernelHookDlg::OnInitDialog()
{
    // ... 省略部分内容
    g_hDevice = OpenDevice(L"\\\\.\\CheckKernelHookLinkName");
    if (g_hDevice == (HANDLE)-1)
    {
        MessageBox(L"打开设备失败"); // 打开设备失败提示
        return TRUE;
    }
    CheckKernelHook(); // 检查内核 Hook 状态
    return TRUE;  // 除非将焦点设置到控件，否则返回 TRUE
}
```
- 初始化对话框，设置图标，绑定控件并尝试打开与驱动程序的通信通道。如果打开失败，则显示消息框并返回。

### 检查内核 Hook 状态
```cpp
VOID CCheckKernelHookDlg::CheckKernelHook()
{
    // ... 省略内容
    bRet = DeviceIoControl(g_hDevice, CTL_CHECKKERNELMODULE, NULL, 
        0, PInlineHookInfo, ulSize, &ulReturnSize, NULL); // 向驱动发送 IO 控制请求
    // ... 省略部分内容
}
```
- 该方法向驱动程序发送 IO 控制请求，获取内核钩子信息，并通过内存分配和操作来处理响应。

### 插入数据到列表
```cpp
VOID CCheckKernelHookDlg::InsertDataToList(PINLINEHOOKINFO PInlineHookInfo)
{
    // ... 省略部分内容
    m_List.SetItemText(n, 6, Type); // 设置类型
}
```
- 从获取的钩子信息中提取数据并填充到对话框的列表控件中，使用户能够查看内核钩子的详细信息。

### 消息处理程序和绘画
```cpp
void CCheckKernelHookDlg::OnSysCommand(UINT nID, LPARAM lParam) { /*...*/ }
void CCheckKernelHookDlg::OnPaint() { /*...*/ }
HCURSOR CCheckKernelHookDlg::OnQueryDragIcon() { /*...*/ }
```
- 这些方法处理系统命令、绘制窗口和获取光标，提供了用户界面交互所需的功能。

### 总结
这个代码的主要功能是创建一个 Windows 对话框应用程序，能够与底层驱动程序通信以检测和显示当前内核钩子的信息。通过详细的信息列表，用户可以查看钩子的原始地址、函数名称、当前 Hook 地址、模块名称等信息，从而帮助分析系统的安全性。这种功能在系统安全监控和反病毒软件中是非常重要的。

## 1.5 AddService.h

这段代码的主要功能是提供一个接口来管理驱动程序的加载和卸载。具体来说：

- `Release`函数用于释放相关资源。
- `UnloadDrv`函数用于卸载指定的驱动程序。
- `LoadDrv`函数用于加载指定的驱动程序。 整个代码片段为驱动程序的管理逻辑提供了基础结构，便于后续实现具体的驱动加载和卸载功能。

## 1.6 AddService.cpp

这段代码的主要功能是管理Windows系统中的驱动程序，主要包括加载和卸载指定的驱动，以及创建一个新驱动文件。以下是代码的逐步分解和详细解释：

### 1. 头文件包含
```cpp
#include "AddService.h"
#include "stdafx.h"
#include "CheckKernelHookDlg.h"
#include <Winsvc.h>
#pragma once
```
- 这些头文件包含了相关的定义、函数原型和Windows服务管理所需的API。

### 2. Release 函数
```cpp
BOOL Release() {
 HANDLE hFile = CreateFile(TEXT("ReloadKernel.sys"), GENERIC_WRITE,
  0, NULL, CREATE_ALWAYS, FILE_ATTRIBUTE_NORMAL, NULL);
 if (hFile == INVALID_HANDLE_VALUE)
  return FALSE;
 CloseHandle(hFile);
 return TRUE;
}
```
- **功能**：释放资源并创建一个名为 `ReloadKernel.sys` 的新驱动文件。此处的代码注释掉的部分表明原计划是从资源中加载驱动内容，但最终实现了简单的文件创建。
- 如果文件创建成功，返回 `TRUE`；否则返回 `FALSE`。

### 3. UnloadDrv 函数
```cpp
BOOL UnloadDrv(TCHAR* DriverName) {
 SC_HANDLE hSCManager;
 SC_HANDLE hService;
 SERVICE_STATUS ss;

 hSCManager = OpenSCManager(NULL, NULL, SC_MANAGER_ALL_ACCESS);
 if (!hSCManager) {
  return FALSE;
 }

 hService = OpenService(hSCManager, DriverName, SERVICE_ALL_ACCESS);
 if (!hService) {
  CloseServiceHandle(hSCManager);
  return FALSE;
 }

 ControlService(hService, SERVICE_CONTROL_STOP, &ss);
 DeleteService(hService);
 CloseServiceHandle(hService);
 CloseServiceHandle(hSCManager);
 return TRUE;
}
```
- **功能**：卸载指定的驱动程序。通过 `OpenSCManager` 打开服务控制管理器，然后打开指定的服务，停止并删除该服务。
- 处理操作失败的情况，如果任一步骤失败会返回 `FALSE`。

### 4. LoadDrv 函数
```cpp
BOOL LoadDrv(TCHAR* DriverName) {
 TCHAR DrvFullPathName[MAX_PATH];
 SC_HANDLE schSCManager;
 SC_HANDLE schService;
 UnloadDrv(L"CheckKernelHook");
 GetFullPathName(TEXT("CheckKernelHook.sys"), MAX_PATH, DrvFullPathName, NULL);
 schSCManager = OpenSCManager(NULL, NULL, SC_MANAGER_ALL_ACCESS);
 if (!schSCManager)
  return FALSE;

 schService = CreateService(
  schSCManager, DriverName, DriverName,
  SERVICE_ALL_ACCESS,
  SERVICE_KERNEL_DRIVER,
  SERVICE_DEMAND_START,
  SERVICE_ERROR_NORMAL,
  DrvFullPathName,
  NULL, NULL, NULL, NULL, NULL
 );

 if (!schService) {
  if (GetLastError() == ERROR_SERVICE_EXISTS) {
   schService = OpenService(schSCManager, DriverName, SERVICE_ALL_ACCESS);
   if (!schService) {
    CloseServiceHandle(schSCManager);
    return FALSE;
   }
  } else {
   CloseServiceHandle(schSCManager);
   return FALSE;
  }
 }

 if (!StartService(schService, 0, NULL)) {
  if (!(GetLastError() == ERROR_SERVICE_ALREADY_RUNNING)) {
   CloseServiceHandle(schService);
   CloseServiceHandle(schSCManager);
   return FALSE;
  }
 }
 
 CloseServiceHandle(schService);
 CloseServiceHandle(schSCManager);
 return TRUE;
}
```
- **功能**：加载指定的驱动程序。首先卸载已存在的同名驱动，然后获取驱动程序的完整路径，打开服务控制管理器，创建新的服务，最后启动它。
- 处理可能出现的错误，如服务已存在或服务已经在运行。

### 总结
整体来看，这段代码的主要功能是提供对Windows驱动程序的管理，包括创建、加载和卸载驱动程序。而具体来说，`Release` 函数用于创建新的驱动文件，`UnloadDrv` 函数用于卸载指定的驱动，而 `LoadDrv` 函数则用于加载并启动驱动程序。这些功能通常用于对驱动进行维护和更新，以确保系统的稳定性和安全性。

## 核心代码

``` cpp
// CCheckKernelHookDlg 类的方法，用于检查内核是否存在 Hook
VOID CCheckKernelHookDlg::CheckKernelHook()
{
    ULONG_PTR ulCount = 0x1000; // 初始化计数
    PINLINEHOOKINFO PInlineHookInfo = NULL; // 指向内联 Hook 信息的指针
    BOOL bRet = FALSE;
    DWORD ulReturnSize = 0;
    do 
    {
        ULONG_PTR ulSize = 0; // 每次循环申请新的内存空间
        if (PInlineHookInfo)
        {
            free(PInlineHookInfo); // 释放之前申请的内存
            PInlineHookInfo = NULL;
        }
        ulSize = sizeof(INLINEHOOKINFO) + ulCount * sizeof(INLINEHOOKINFO_INFORMATION);
        PInlineHookInfo = (PINLINEHOOKINFO)malloc(ulSize); // 申请内存
        if (!PInlineHookInfo)
        {
            break; // 内存申请失败时退出
        }
        memset(PInlineHookInfo, 0, ulSize); // 清空申请的内存
        bRet = DeviceIoControl(g_hDevice, CTL_CHECKKERNELMODULE, NULL, 
            0, PInlineHookInfo, ulSize, &ulReturnSize, NULL); // 向驱动发送 IO 控制请求
        ulCount = PInlineHookInfo->ulCount + 1000; // 更新计数
    } while (bRet == FALSE && GetLastError() == ERROR_INSUFFICIENT_BUFFER); // 错误处理

    if (PInlineHookInfo->ulCount == 0)
    {
        MessageBox(L"当前内核安全", L""); // 提示内核安全
    }
    else
    {
        InsertDataToList(PInlineHookInfo); // 插入数据到列表
    }
    if (PInlineHookInfo)
    {
        free(PInlineHookInfo); // 释放内存
        PInlineHookInfo = NULL;
    }
}

// 将缺少的内联Hook信息插入到列表控件
VOID CCheckKernelHookDlg::InsertDataToList(PINLINEHOOKINFO PInlineHookInfo)
{
    CString OrgAddress, CurAddress, ModuleBase, ModuleSize;
    for (int i = 0; i < PInlineHookInfo->ulCount; i++)
    {
        // 格式化地址和信息
        OrgAddress.Format(L"0x%p", PInlineHookInfo->InlineHook[i].ulMemoryFunctionBase);
        CurAddress.Format(L"0x%p", PInlineHookInfo->InlineHook[i].ulMemoryHookBase);
        ModuleBase.Format(L"0x%p", PInlineHookInfo->InlineHook[i].ulHookModuleBase);
        ModuleSize.Format(L"%d", PInlineHookInfo->InlineHook[i].ulHookModuleSize);
        
        int n = m_List.InsertItem(m_List.GetItemCount(), OrgAddress, 0); // 插入项到列表
        CString szFunc = L""; 
        CString ModuleName = L"";
        szFunc += PInlineHookInfo->InlineHook[i].lpszFunction; // 函数名称
        ModuleName += PInlineHookInfo->InlineHook[i].lpszHookModuleImage; // 模块名称
        m_List.SetItemText(n, 1, szFunc); // 设置函数名称
        m_List.SetItemText(n, 2, CurAddress); // 设置当前地址
        m_List.SetItemText(n, 3, ModuleName); // 设置模块名称
        m_List.SetItemText(n, 4, ModuleBase); // 设置模块基址
        m_List.SetItemText(n, 5, ModuleSize); // 设置模块大小
        
        CString Type = L""; // 类型的初始化
        if (PInlineHookInfo->InlineHook[i].ulHookType == 1)
        {
            Type += L"SSDT Hook"; // SSDT Hook 类型
        }
        else if (PInlineHookInfo->InlineHook[i].ulHookType == 2)
        {
            Type += L"Next Call Hook"; // 下一次调用 Hook 类型
        }
        else if (PInlineHookInfo->InlineHook[i].ulHookType == 0)
        {
            Type += L"Inline Hook"; // 内联 Hook 类型
        }
        m_List.SetItemText(n, 6, Type); // 设置类型
    }
    UpdateData(TRUE); // 更新数据
}
```

# 2. CheckKernelHookDrv

## 2.1 Common.h

该代码片段主要是一个用于内核级驱动开发的头文件，包含了一些数据类型定义和多种函数的声明，这些函数一般用于与内核内存和映像的操作。

整个代码片段的目的在于为内核驱动开发提供基本的工具和接口，主要功能包括：

\- 提供信息获取和内存映射的接口，以便在驱动程序中处理不同的进程和文件。

\- 提供判断和解析相关操作码的能力，便于对函数和代码特征的分析。

\- 使得驱动开发者能够容易访问和处理与Windows内核相关的底层操作，特别是在与SSDT和映像文件处理相关的场景下。

1. **头文件引入**
   - `#include "DriverEntry.h"`: 引入自定义的驱动程序入口头文件。
   - `#include <ntimage.h>`: 引入 Windows NT 内核的映像头文件，以支持操作映像文件的结构。

2. **类型定义**
   - `typedef unsigned long DWORD;`: 定义 `DWORD` 为一个无符号长整型（32位）。
   - `typedef void *HANDLE;`: 定义 `HANDLE` 为一个指向任意类型的指针。
   - `typedef unsigned char  BOOL, *PBOOL;`: 定义布尔类型 `BOOL` 及其指针类型 `PBOOL`。
   - `#define SEC_IMAGE 0x01000000`: 定义宏 `SEC_IMAGE` 的值，用于表示映像的安全标志。

3. **函数声明**
   - `RtlImageNtHeader`: 用于获取可执行映像文件的 NT 头信息。
   - `MapFileInUserSpace`: 将指定文件映射到指定进程的用户空间中。
   - `GetSSDTApiFunctionIndexFromNtdll`: 从 ntdll.dll 中获取特定的 SSDT（系统服务描述符表） API 函数索引。
   - `IsAddressInSystem`: 检查给定地址是否属于系统模块。
   - `GetFunctionCodeSize`: 获取特定函数的代码大小。
   - `SizeOfCode`: 计算给定代码的大小并识别操作码。

4. **操作码类型宏定义**
   - 定义操作码操作的类型，例如 `OP_MODRM`, `OP_DATA_I8`, `OP_DATA_I32` 等，便于在处理或分析汇编代码时使用。

## 2.2 Common.c

这段代码主要用于在Windows内核驱动开发中，处理有关CPU指令操作码的标识、文件在用户空间的映射、计算函数代码的大小以及检查驱动程序基地址的功能。

这段代码实现了以下几个主要功能：

- **操作码解析**: 用于识别和处理CPU指令的操作码，通过定义标志数组来支持不同的操作数类型。
- **文件映射**: 提供了将文件映射到用户空间的能力，便于后续文件的读写和分析操作。
- **函数长度计算**: 提供了获取给定函数在内存中的大小的功能，适合用于调试和性能分析。
- **地址验证**: 检查特定地址是否在当前运行的驱动程序或模块中，有助于确保驱动的正确性和安全性。

1. **操作码标志数组**:
   - `OpcodeFlags` 和 `OpcodeFlagsExt` 是两个256大小的数组，用于表示不同操作码（Opcode）对应的标志位。这些标志位用于指示操作码的种类、所需的操作数类型等。主要目的是为了在解析和分析汇编代码时，快速了解每条指令的特性。

2. **`MapFileInUserSpace` 函数**:
   - 这个函数的功能是将指定的文件映射到用户空间。
   - 输入参数包括文件路径和可选的进程句柄，输出参数为映射的基地址和视图大小。
   - 该函数首先初始化文件路径，然后调用 `IoCreateFile` 创建文件句柄，接着使用 `ZwCreateSection` 创建文件映射区域，再通过 `ZwMapViewOfSection` 将该区域映射到调用进程的地址空间。
   - 这样可以在用户空间操作驱动文件，有助于调试和分析。

3. **`GetFunctionCodeSize` 函数**:
   - 此函数用于计算给定函数代码的大小，它会通过循环逐条分析指令，直到遇到某些特定条件（如`INT3`指令或`NULL`指针）才停止。
   - 它调用了 `SizeOfCode` 函数来实际获取各指令的长度，汇总最终的大小进行返回。

4. **`SizeOfCode` 函数**:
   - 该函数负责计算给定代码段的大小，优先处理前缀和操作码，然后根据操作码的不同类型来决定操作数大小，最终返回代码段的长度。
   - 通过分析操作数标志位，来适应不同类型的数据操作。

5. **`IsAddressInSystem` 函数**:
   - 这个函数的功能是检查指定的驱动程序基地址是否存在于系统模块列表中。
   - 首先，它会查询系统模块信息的大小，然后分配相应内存获取模块列表，遍历模块，查找给定基地址是否在任何一个模块的地址范围内。
   - 如果找到，会填充返回参数以提供更多信息。

## 2.3 DriverEntry

这段代码是一个Windows内核驱动程序的实现，主要用于检测内核中的钩子（Hook）行为。以下是逐步分解和详细解释：

---

### **1. 头文件引入**
```c
#include "DriverEntry.h"
#include "KernelHookCheck.h"
#include "Reload.h"
```
- 引入了三个头文件：
  - `DriverEntry.h`：包含驱动入口函数的声明。
  - `KernelHookCheck.h`：包含检测内核钩子的函数声明。
  - `Reload.h`：包含重新加载内核模块的函数声明。

---

### **2. 驱动入口函数 `DriverEntry`**
```c
NTSTATUS DriverEntry(IN PDRIVER_OBJECT DriverObject, IN PUNICODE_STRING RegisterPath)
```
- **功能**：驱动程序的入口点，负责初始化驱动程序。
- **参数**：
  - `DriverObject`：指向驱动对象的指针。
  - `RegisterPath`：注册表路径，通常用于存储驱动配置。
- **主要逻辑**：
  1. 初始化设备名称和符号链接名称。
  2. 设置驱动的主要功能函数（`MajorFunction`）为默认的透传函数 `DefaultPassThrough`。
  3. 设置驱动的卸载函数为 `UnloadDriver`。
  4. 创建设备对象（`IoCreateDevice`）和符号链接（`IoCreateSymbolicLink`）。
  5. 调用 `ReLoadNtos` 函数重新加载内核模块。
  6. 返回成功状态 `STATUS_SUCCESS`。

---

### **3. 设备控制函数 `ControlPassThrough`**
```c
NTSTATUS ControlPassThrough(PDEVICE_OBJECT DeviceObject, PIRP Irp)
```
- **功能**：处理设备控制请求（`IRP_MJ_DEVICE_CONTROL`）。
- **参数**：
  - `DeviceObject`：指向设备对象的指针。
  - `Irp`：指向I/O请求包（IRP）的指针。
- **主要逻辑**：
  1. 获取IRP的输入缓冲区、输出缓冲区和控制代码。
  2. 根据控制代码 `IoControlCode` 执行不同的操作：
     - 如果控制代码是 `CTL_CHECKKERNELMODULE`，则调用 `KernelHookCheck` 函数检测内核钩子。
     - 如果输出缓冲区无效，则返回失败状态。
     - 使用 `__try` 和 `__except` 处理异常。
  3. 完成IRP请求并返回状态。

---

### **4. 默认透传函数 `DefaultPassThrough`**
```c
NTSTATUS DefaultPassThrough(PDEVICE_OBJECT DeviceObject, PIRP Irp)
```
- **功能**：处理未明确指定的IRP请求。
- **参数**：
  - `DeviceObject`：指向设备对象的指针。
  - `Irp`：指向I/O请求包（IRP）的指针。
- **主要逻辑**：
  1. 设置IRP的状态为成功。
  2. 完成IRP请求并返回成功状态。

---

### **5. 驱动卸载函数 `UnloadDriver`**
```c
VOID UnloadDriver(PDRIVER_OBJECT DriverObject)
```
- **功能**：在驱动程序卸载时执行清理操作。
- **参数**：
  - `DriverObject`：指向驱动对象的指针。
- **主要逻辑**：
  1. 删除符号链接（`IoDeleteSymbolicLink`）。
  2. 删除所有设备对象（`IoDeleteDevice`）。
  3. 打印卸载信息（`DbgPrint`）。

---

### **6. 关键功能总结**
- **主要功能**：
  1. **驱动初始化**：在 `DriverEntry` 中创建设备对象和符号链接，并设置驱动的主要功能函数。
  2. **内核钩子检测**：通过 `ControlPassThrough` 函数处理设备控制请求，调用 `KernelHookCheck` 检测内核钩子。
  3. **驱动卸载**：在 `UnloadDriver` 中清理资源，确保驱动程序安全卸载。
- **用途**：
  - 该驱动程序主要用于检测内核中的钩子行为，通常用于安全领域，如检测恶意软件或Rootkit。

---

### **7. 代码总结**
- **目标**：实现一个Windows内核驱动程序，用于检测内核中的钩子行为。
- **核心功能**：
  - 初始化驱动并创建设备对象。
  - 处理设备控制请求，检测内核钩子。
  - 安全卸载驱动并清理资源。
- **适用场景**：
  - 用于安全分析、恶意软件检测或内核调试。

## 2.4 FixRelocation

### 代码逐步分解与详细解释

#### 1. **FixBaseRelocTable 函数**
   - **功能**：修复重定位表，确保程序在加载到新的基地址时能够正确运行。
   - **参数**：
     - `NewImageBase`：新的基地址。
     - `ExistImageBase`：现有的基地址。
   - **流程**：
     1. 通过 `RtlImageNtHeader` 获取 PE 文件的 NT 头。
     2. 根据 NT 头的 `OptionalHeader.Magic` 判断是 32 位还是 64 位程序，并获取原始基地址。
     3. 使用 `RtlImageDirectoryEntryToData` 定位重定位表。
     4. 如果重定位表不存在且未被剥离，则直接返回成功。
     5. 计算新旧基地址的差值 `Diff`。
     6. 遍历重定位表，调用 `LdrProcessRelocationBlockLongLong` 对每个重定位块进行处理。

#### 2. **LdrProcessRelocationBlockLongLong 函数**
   - **功能**：处理重定位块，根据重定位类型对地址进行修正。
   - **参数**：
     - `VA`：虚拟地址。
     - `SizeOfBlock`：重定位块的大小。
     - `NextOffset`：指向重定位偏移的指针。
     - `Diff`：新旧基地址的差值。
   - **流程**：
     1. 遍历重定位块中的每个重定位项。
     2. 根据重定位类型（如 `IMAGE_REL_BASED_HIGHLOW`、`IMAGE_REL_BASED_HIGH` 等），对地址进行修正。
     3. 对于 `IMAGE_REL_BASED_IA64_IMM64` 类型，处理 IA64 架构的 64 位立即数重定位。
     4. 对于其他类型（如 `IMAGE_REL_BASED_ABSOLUTE`），不做处理。
     5. 返回下一个重定位块的指针。

#### 3. **RtlImageNtHeaderEx 函数**
   - **功能**：获取 PE 文件的 NT 头，并进行有效性检查。
   - **参数**：
     - `Flags`：控制标志。
     - `Base`：PE 文件的基地址。
     - `Size`：PE 文件的大小。
     - `OutHeaders`：输出 NT 头指针。
   - **流程**：
     1. 检查输入参数的有效性。
     2. 检查 PE 文件的 DOS 头签名。
     3. 获取 NT 头的偏移 `e_lfanew`。
     4. 检查 NT 头的有效性，包括地址范围和签名。
     5. 返回 NT 头指针。

#### 4. **RtlImageNtHeader 函数（注释部分）**
   - **功能**：简化版的 `RtlImageNtHeaderEx`，用于获取 NT 头。
   - **参数**：
     - `Base`：PE 文件的基地址。
   - **流程**：
     1. 调用 `RtlImageNtHeaderEx`，忽略范围检查，获取 NT 头。

### 代码总结

#### 主要功能
- **FixBaseRelocTable**：修复 PE 文件的重定位表，确保程序在加载到新的基地址时能够正确运行。
- **LdrProcessRelocationBlockLongLong**：处理重定位块，根据重定位类型对地址进行修正。
- **RtlImageNtHeaderEx**：获取 PE 文件的 NT 头，并进行有效性检查。

#### 关键点
- **重定位表修复**：通过计算新旧基地址的差值，修正重定位表中的地址，确保程序在加载到新的基地址时能够正确运行。
- **NT 头获取与检查**：通过 `RtlImageNtHeaderEx` 获取 PE 文件的 NT 头，并进行有效性检查，确保 PE 文件的合法性。

#### 应用场景
- **动态加载与重定位**：在动态加载 DLL 或驱动程序时，修复重定位表，确保程序能够正确运行。
- **PE 文件解析**：在解析 PE 文件时，获取并检查 NT 头，确保 PE 文件的合法性。

通过这些功能，代码能够有效地处理 PE 文件的重定位问题，并确保程序在加载到新的基地址时能够正确运行。

## 2.5 KernelHookCheck

### 代码逐步分解与详细解释

1. **引入头文件**
   
   ```c
   #include "Reload.h"
   ```
   - 引入了 `Reload.h` 头文件，该文件包含了一些与内核模块重载相关的定义和声明。
   
2. **获取系统内核模块信息**
   ```c
   BOOLEAN GetSystemKernelModuleInfo(WCHAR **SystemKernelModulePath, PDWORD SystemKernelModuleBase, PDWORD SystemKernelModuleSize);
   ```
   - 该函数用于获取系统内核模块的路径、基址和大小信息。
   - 参数：
     - `SystemKernelModulePath`：指向内核模块路径的指针。
     - `SystemKernelModuleBase`：指向内核模块基址的指针。
     - `SystemKernelModuleSize`：指向内核模块大小的指针。

3. **获取文件系统的VPB信息**
   ```c
   BOOLEAN IoGetFileSystemVpbInfo(IN PFILE_OBJECT FileObject, PDEVICE_OBJECT *DeviceObject, PDEVICE_OBJECT *RealDevice);
   ```
   - 该函数用于获取文件系统的卷参数块（VPB）信息。
   - 参数：
     - `FileObject`：文件对象指针。
     - `DeviceObject`：指向设备对象的指针。
     - `RealDevice`：指向实际设备对象的指针。

4. **从文件完整路径获取设备对象**
   ```c
   BOOLEAN GetDeviceObjectFromFileFullName(WCHAR *FileFullName, PDEVICE_OBJECT *RealDevice, PDEVICE_OBJECT *DeviceObject);
   ```
   - 该函数通过文件的完整路径获取设备对象。
   - 参数：
     - `FileFullName`：文件的完整路径。
     - `RealDevice`：指向实际设备对象的指针。
     - `DeviceObject`：指向设备对象的指针。

5. **获取Windows根目录名称**
   ```c
   BOOLEAN GetWindowsRootName(WCHAR *WindowsRootName);
   ```
   - 该函数用于获取Windows系统的根目录名称。
   - 参数：
     - `WindowsRootName`：指向存储根目录名称的缓冲区。

6. **在内核中打开文件**
   ```c
   NTSTATUS KernelOpenFile(wchar_t *FileFullName, 
       PHANDLE FileHandle, 
       ACCESS_MASK DesiredAccess, 
       ULONG FileAttributes, 
       ULONG ShareAccess, 
       ULONG CreateDisposition, 
       ULONG CreateOptions);
   ```
   - 该函数用于在内核中打开文件。
   - 参数：
     - `FileFullName`：文件的完整路径。
     - `FileHandle`：指向文件句柄的指针。
     - `DesiredAccess`：访问权限。
     - `FileAttributes`：文件属性。
     - `ShareAccess`：共享访问权限。
     - `CreateDisposition`：创建选项。
     - `CreateOptions`：创建选项。

7. **获取文件大小**
   ```c
   NTSTATUS KernelGetFileSize(HANDLE hFile, PLARGE_INTEGER FileSize);
   ```
   - 该函数用于获取文件的大小。
   - 参数：
     - `hFile`：文件句柄。
     - `FileSize`：指向文件大小的指针。

8. **从文件中读取数据**
   ```c
   NTSTATUS KernelReadFile(HANDLE hFile, PLARGE_INTEGER ByteOffset, ULONG Length, PVOID FileBuffer, PIO_STATUS_BLOCK IoStatusBlock);
   ```
   - 该函数用于从文件中读取数据。
   - 参数：
     - `hFile`：文件句柄。
     - `ByteOffset`：读取的字节偏移量。
     - `Length`：读取的长度。
     - `FileBuffer`：指向存储读取数据的缓冲区。
     - `IoStatusBlock`：指向I/O状态块的指针。

9. **判断是否为映像文件**
   ```c
   BOOLEAN ImageFile(BYTE *FileBuffer, BYTE **ImageModuleBase);
   ```
   - 该函数用于判断给定的文件缓冲区是否为映像文件（如PE文件）。
   - 参数：
     - `FileBuffer`：文件缓冲区。
     - `ImageModuleBase`：指向映像文件基址的指针。

10. **对齐大小**
    ```c
    ULONG AlignSize(ULONG nSize, ULONG nAlign);
    ```
    - 该函数用于将大小对齐到指定的边界。
    - 参数：
      - `nSize`：原始大小。
      - `nAlign`：对齐边界。

11. **获取内核模块基址**
    ```c
    PVOID GetKernelModuleBase(PDRIVER_OBJECT DriverObject, char *KernelModuleName);
    ```
    - 该函数用于获取指定内核模块的基址。
    - 参数：
      - `DriverObject`：驱动对象。
      - `KernelModuleName`：内核模块名称。

12. **插入原始第一个Thunk**
    ```c
    BOOLEAN InsertOriginalFirstThunk(DWORD ImageBase, DWORD ExistImageBase, PIMAGE_THUNK_DATA FirstThunk);
    ```
    - 该函数用于在导入表中插入原始的第一个Thunk。
    - 参数：
      - `ImageBase`：映像基址。
      - `ExistImageBase`：现有映像基址。
      - `FirstThunk`：指向第一个Thunk的指针。

13. **查找导出例程**
    ```c
    PVOID MiFindExportedRoutine (
        IN PVOID DllBase,
        BOOLEAN ByName,
        IN char *RoutineName,
        DWORD Ordinal
    );
    ```
    - 该函数用于在DLL中查找导出的例程。
    - 参数：
      - `DllBase`：DLL基址。
      - `ByName`：是否按名称查找。
      - `RoutineName`：例程名称。
      - `Ordinal`：例程序号。

14. **修复导入表**
    ```c
    BOOLEAN FixImportTable(BYTE *ImageBase, DWORD ExistImageBase, PDRIVER_OBJECT DriverObject);
    ```
    - 该函数用于修复PE文件的导入表。
    - 参数：
      - `ImageBase`：映像基址。
      - `ExistImageBase`：现有映像基址。
      - `DriverObject`：驱动对象。

15. **加载PE文件**
    
    ```c
    BOOLEAN PeLoad(
        WCHAR *FileFullPath,
        BYTE **ImageModeleBase,
        PDRIVER_OBJECT DeviceObject,
        DWORD ExistImageBase
    );
    ```
    - 该函数用于加载PE文件到内存中。
    - 参数：
      - `FileFullPath`：PE文件的完整路径。
      - `ImageModeleBase`：指向映像基址的指针。
      - `DeviceObject`：设备对象。
      - `ExistImageBase`：现有映像基址。

### 总结

该代码的主要功能是**在内核模式下操作文件、加载和修复PE文件**。具体来说，它提供了以下关键功能：

1. **文件操作**：包括在内核中打开文件、获取文件大小、读取文件数据等。
2. **内核模块信息获取**：获取系统内核模块的路径、基址和大小信息。
3. **PE文件处理**：判断文件是否为映像文件、修复导入表、加载PE文件到内存中。
4. **内存对齐与模块基址获取**：提供内存对齐功能，并能够获取指定内核模块的基址。
5. **导入表修复与导出例程查找**：修复PE文件的导入表，并能够在DLL中查找导出的例程。

这些功能通常用于**内核级Rootkit或驱动开发**中，特别是在需要动态加载和修复内核模块时。


## 2.6 libdasm.c

这段代码是一个简单的x86反汇编库（libdasm），其主要功能是将x86机器码转换为可读的汇编语言指令。代码实现了字节序转换、指令解析、操作数提取以及指令字符串生成等功能。

以下是代码的逐步分解和详细解释：

### 1. 文件头和相关库
```c
/*
 * libdasm -- simple x86 disassembly library
 * (c) 2004 - 2005  jt / nologin.org
 *
 *
 * TODO:
 * - more documentation
 * - do more code validation
 */
```
这里是文件头部分，描述了库的名称、版权信息以及TODO列表，提醒开发者后续需要添加的文档和代码验证内容。

### 2. 包含库和宏定义
```c
#include <stdio.h>
#include <string.h>
#include "libdasm.h"
#include "tables.h"
```
包含了标准输入输出库和字符串操作库，同时引入了自定义头文件“libdasm.h”和“tables.h”，这些可能包含数据结构定义、常量和其他功能定义。

### 3. 字节序转换函数
```c
__inline__ BYTE FETCH8(BYTE *addr) { /* ... */ }
__inline__ WORD FETCH16(BYTE *addr) { /* ... */ }
__inline__ DWORD FETCH32(BYTE *addr) { /* ... */ }
```
这三个函数分别用于从内存地址中读取8位、16位和32位的数据，并考虑了不同平台的字节序处理。在x86架构上直接读取，而在其他架构上则使用内存拷贝并进行字节序转换。

### 4. 指令解析函数
```c
int get_real_instruction2(BYTE *addr, int *flags) { /* ... */ }
int get_real_instruction(BYTE *addr, int *index, int *flags) { /* ... */ }
```
这两个函数负责解析指令，提取操作码及其标志。`get_real_instruction`函数解析指令的前缀和操作码，并设置相应的标志。`get_real_instruction2`函数处理具体的2字节和3字节操作码扩展。

### 5. 操作数解析函数
```c
int get_operand(PINST inst, int oflags, PINSTRUCTION instruction, POPERAND op, BYTE *data, int offset, enum Mode mode, int iflags) { /* ... */ }
```
此函数负责解析操作数并填充操作数结构体。它会根据指令的MODRM字节和其他信息，确定操作数的类型（寄存器、内存、立即数等），并获取其大小和地址。

### 6. 打印操作数字符串
```c
int get_operand_string(INSTRUCTION *inst, OPERAND *op, enum Format format, DWORD offset, char *string, int length) { /* ... */ }
```
此函数用于格式化操作数的字符串表示，支持不同的格式（ATT和Intel）。它根据操作数的类型和格式，生成对应的文本字符串。

### 7. 获取指令函数
```c
int get_instruction(PINSTRUCTION inst, BYTE *addr, enum Mode mode) { /* ... */ }
```
该函数从给定的地址获取指令的内容，包括解析指令的各个组成部分（操作码、操作数等），并将其返回。

### 8. 打印指令字符串
```c
int get_instruction_string(INSTRUCTION *inst, enum Format format, DWORD offset, char *string, int length) { /* ... */ }
```
此函数将指令的助记符、前缀及操作数合并成一个完整的可读字符串，可用于输出。

### 9. 辅助函数
一系列辅助函数用于获取操作数的具体信息（如寄存器类型、操作数类型、立即数、位移等），为其他函数提供支持。

### 总结
整体来看，这段代码实现了一个x86反汇编库，通过以下关键功能实现其目标：
- **字节序处理**：支持不同平台的字节序读取。
- **指令解析**：从机器码中提取出指令的操作码及其相关标志位。
- **操作数提取**：根据指令的格式，正确解析操作数并将其类型信息存储。
- **字符串生成**：将解析出的指令及操作数转化为可读的汇编语言形式，支持多种格式。

该库的应用场景可能包括逆向工程、调试工具、静态分析等领域。

## 2.7 reload.c


这段代码的主要功能是**重载Windows内核模块（如`ntoskrnl.exe`）并修复系统服务描述符表（SSDT）**，以确保内核函数的调用是安全的、未被篡改的。以下是代码的逐步分解和详细解释：

---

### 1. **代码结构概述**
代码分为以下几个主要部分：
- **全局变量声明**：定义了与内核模块和SSDT相关的全局变量。
- **函数重载逻辑**：通过`ReLoadNtosCALL`函数重载内核函数。
- **内核模块初始化**：通过`ReLoadNtos`和`InitSafeOperationModule`函数初始化并加载内核模块。
- **SSDT修复逻辑**：通过`FixOriginalKiServiceTable`和`GetOriginalKiServiceTable`函数修复SSDT表。

---

### 2. **全局变量**
```c
WCHAR* SystemKernelFilePath = NULL; // 系统内核模块文件路径
ULONG_PTR SystemKernelModuleBase = 0; // 系统内核模块基址
ULONG_PTR SystemKernelModuleSize = 0; // 系统内核模块大小
ULONG_PTR ImageModuleBase; // 重载后的内核模块基址

PVOID OriginalKiServiceTable; // 原始的SSDT表
extern PSERVICE_DESCRIPTOR_TABLE KeServiceDescriptorTable; // 系统服务描述符表
PSERVICE_DESCRIPTOR_TABLE OriginalServiceDescriptorTable; // 原始服务描述符表
PSERVICE_DESCRIPTOR_TABLE Safe_ServiceDescriptorTable; // 安全服务描述符表
```
- 这些变量用于存储内核模块的信息和SSDT表的相关数据。

---

### 3. **函数重载逻辑 (`ReLoadNtosCALL`)**
```c
ULONG ReLoadNtosCALL(WCHAR *lpwzFuncTion, ULONG ulOldNtosBase, ULONG ulReloadNtosBase)
```
- **功能**：根据函数名、原始内核模块基址和重载后的内核模块基址，计算并返回重载后的函数地址。
- **实现步骤**：
  1. 通过`RMmGetSystemRoutineAddress`获取原始函数地址。
  2. 计算重载后的函数地址：`ulReloadFunctionAddress = (PUCHAR)(ulOldFunctionAddress - ulOldNtosBase + ulReloadNtosBase)`。
  3. 如果地址无效，则遍历导出表查找函数地址。
  4. 返回重载后的函数地址。

---

### 4. **内核模块初始化 (`ReLoadNtos`)**
```c
NTSTATUS ReLoadNtos(PDRIVER_OBJECT DriverObject, DWORD RetAddress)
```
- **功能**：初始化并重载内核模块。
- **实现步骤**：
  1. 调用`GetSystemKernelModuleInfo`获取系统内核模块信息。
  2. 调用`InitSafeOperationModule`加载并初始化重载后的内核模块。
  3. 通过`ReLoadNtosCALL`重载关键函数（如`RtlInitUnicodeString`、`MmGetSystemRoutineAddress`等）。
  4. 如果重载失败，返回错误状态。

---

### 5. **安全操作模块初始化 (`InitSafeOperationModule`)**
```c
BOOLEAN InitSafeOperationModule(PDRIVER_OBJECT pDriverObject, WCHAR *SystemModulePath, ULONG KernelModuleBase)
```
- **功能**：加载并初始化重载后的内核模块，修复SSDT表。
- **实现步骤**：
  1. 调用`PeLoad`加载内核模块。
  2. 分配内存并获取原始的SSDT表。
  3. 调用`GetOriginalKiServiceTable`获取原始的SSDT基址。
  4. 调用`FixOriginalKiServiceTable`修复SSDT表中的函数地址。
  5. 创建并初始化安全服务描述符表（`Safe_ServiceDescriptorTable`）。

---

### 6. **SSDT修复逻辑 (`FixOriginalKiServiceTable` 和 `GetOriginalKiServiceTable`)**
#### `FixOriginalKiServiceTable`
```c
VOID FixOriginalKiServiceTable(PDWORD OriginalKiServiceTable, DWORD ModuleBase, DWORD ExistImageBase)
```
- **功能**：修复SSDT表中的函数地址，使其指向重载后的内核模块。
- **实现步骤**：
  1. 遍历SSDT表中的每个函数地址。
  2. 计算并修复函数地址：`OriginalKiServiceTable[Index] = OriginalKiServiceTable[Index] - ExistImageBase + ModuleBase`。

#### `GetOriginalKiServiceTable`
```c
BOOLEAN GetOriginalKiServiceTable(BYTE *NewImageBase, DWORD ExistImageBase, DWORD *NewKiServiceTable)
```
- **功能**：通过重定位表获取原始的SSDT基址。
- **实现步骤**：
  1. 解析PE文件头，找到重定位表。
  2. 遍历重定位表，查找与`KeServiceDescriptorTable`相关的重定位项。
  3. 获取并返回原始的SSDT基址。

---

### 7. **代码总结**
#### **主要功能**
- **内核模块重载**：通过加载并重载内核模块（如`ntoskrnl.exe`），确保内核函数的调用是安全的、未被篡改的。
- **SSDT修复**：修复系统服务描述符表（SSDT），使其指向重载后的内核模块中的函数地址。
- **安全操作模块初始化**：创建并初始化安全服务描述符表，确保系统调用的安全性。

#### **关键点**
- **重载内核模块**：通过`PeLoad`加载内核模块，并通过`ReLoadNtosCALL`重载关键函数。
- **SSDT修复**：通过`FixOriginalKiServiceTable`和`GetOriginalKiServiceTable`修复SSDT表中的函数地址。
- **安全性**：通过创建安全服务描述符表，确保系统调用的安全性，防止内核函数被篡改。

---

### 总结
这段代码的核心目标是**通过重载内核模块和修复SSDT表，确保系统调用的安全性**。它通过加载并重载内核模块、修复SSDT表中的函数地址，以及创建安全服务描述符表，实现了对内核函数的保护和检测。



