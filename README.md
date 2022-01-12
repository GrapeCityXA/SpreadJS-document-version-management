## 葡萄城表格技术 - 文档版本管理

在线文档的版本管理功能，可谓牵一发而动全身。由于企业文档版本管理不到位，在关键时刻出差错，导致发生严重的经济损失和信用危机的事件，已是屡见不鲜。从记录修改的单元格信息，到获得并记录用户的操作行为；从保护所有单元格不被修改，到记录原始单元格保护状态等，几乎都是来自于版本管理的需求范畴。

葡萄城表格技术以 [纯前端表格控件 SpreadJS ](https://www.grapecity.com.cn/developer/spreadjs)和 [服务端表格组件 GcExcel ](https://www.grapecity.com.cn/developer/grapecitydocuments/excel-java/)为核心组件，可满足在线文档版本管理的各项开发需求。使用葡萄城表格技术构建的版本管理模块，既支持由用户主动创建版本（版本快照），又可在用户生成副本、保存模板或导出本地 Excel 文档时由系统自动生成。

![输入图片说明](https://videos.grapecity.com.cn/SpreadJS/online/wendangguanli.mp4)

[直接下载示例代码](https://www.grapecity.com.cn/developer/spreadjs/applyonline)

#### 实现文档版本管理的技术难点

 **版本管理无序化，冗余程度高** 

常规的版本管理是通过区分历史版本文件命名的方式来保存的，当文件修改频繁、版本数量不断增多时，极易发生文件冗余、版本混乱、查找困难等状况，在分享传递这些文件时，也会频繁出现使用错误版本的情况。

 **缺乏统一的文件管理平台** 

在文档修改迭代后，无法及时通知相关人等，未能实现文件协同办公，由多人编辑造成的文件版本冲突问题将无法避免。

 **版本文件查找效率低** 

由于不注重文件历史版本的存档与记录，在需要查找指定历史版本的时候显得非常耗时耗力。例如，在文档编辑修改过程中，修改多次后，发现先前的版本反而比最新的更好，但是反过来查找历史版本时，却发现历史版本已经被覆盖，文件找不到了。

 **内容安全无法保证** 

多人维护同一文件、修改更新文件时，因为不能对文档版本进行锁定后操作，可能会发生多人重复修改同一问题，或多人操作造成文件重要内容丢失等情况。

 **缺乏完整的操作记录** 

文件修改更新后不知道操作人、操作时间、修改次数等信息，出现问题后更是容易造成相互间推诿责任。

#### 葡萄城表格技术的优势

![输入图片说明](https://www.grapecity.com.cn/images/metalsmith/developer/spreadjs/industry/version/wendnag.png)

 **自动检测文档版本** 
针对版本管理无序化，冗余程度高的问题，用 SpreadJS 纯前端表格控件所构建的版本管理系统可有效解决。借助 SpreadJS 的 API，可实现对文档版本生成时机的精确自动化判别，自动生成有效的文件版本。

 **避免文件内容冲突** 
借助 SpreadJS 在开发在线文档以及处理多人协同编辑时的天然优势，可建立统一的文件管理平台，实现文件间的共享与传递，有效避免多人编辑文件造成的文件版本冲突问题，保障文件内容的安全有序。

 **高效管理版本文件** 
由 SpreadJS 和 GcExcel 共同构建的 类 Excel 全栈解决方案，可提供多人实时在线编辑、前后端数据同步、文档自动保存和恢复等功能，满足多人协作、在线编辑、数据同步、多级上报、历史查询等业务需求。借助这一方案，在进行版本管理时，仅保存有效的文件版本，避免因频繁保存文件而产生大量的垃圾历史版本的问题，更有效率地管理和查找文件。

 **降低成本提升效率** 
葡萄城的表格技术兼具 “高性能、跨平台、与 Excel 高度兼容”的产品特性，使用 SpreadJS 和 GcExcel 管理版本文件，可有效减少垃圾文件的产生，降低存储扩容成本；同时，还可提升文件版本的质量，让文件管理和审计变得更加直观方便。

#### 葡萄城表格技术的功能特色

|  |   |
|---|---|
|支持跨平台开发|以原生方式嵌入，支持 B/S、H5 小程序、APP 和桌面应用程序开发|
|不依赖第三方库|加载、编辑、导入、导出 Excel 时无需预装插件和第三方应用软件|
|支持主流技术栈 |前端组件基于 HTML5 标准，可与前、后端技术框架相结合|
|支持国产操作系统|支持 Windows、Mac、Linux，通过麒麟软件、统信 UOS 兼容性认证|
|支持云应用开发|支持公有云部署、私有云部署和独立服务器部署 |
|开放的 API 接口|内置大量 API 接口可供调用，轻松扩展，满足更多定制化需求 |


#### 葡萄城表格技术的成功案例

 **网易 - 灵犀办公文档** 

[![输入图片说明](https://www.grapecity.com.cn/images/metalsmith/developer/casestudies/casestudies-netease/pic02.png)](https://www.grapecity.com.cn/developer/casestudies/netease)

通过对 SpreadJS 定制化开发，网易灵犀文档将文档与企业通讯工具相结合，打通了邮件与即时消息，实现了线程回复、历史追溯和批量发信等功能，满足了企业对于信息高速流转和团队快速响应的需求，提升了协作效率，降低了时间成本。

[查看详细](https://www.grapecity.com.cn/developer/casestudies/netease)

 **上海佳软 - 雷鸟365在线表格文档系统** 

[![输入图片说明](https://www.grapecity.com.cn/images/metalsmith/developer/spreadjs/online-editor/teamwork.gif)](https://www.grapecity.com.cn/developer/casestudies/shjr)

基于 SpreadJS 实现了版本记录功能，可记录用户每一步动作，并针对某个历史版本进行命名。系统会过滤掉自动保存的版本，仅保留用户命名的版本，且版本信息中包含了文件的来源（导入的 xlsx 文件）以及原始文件查看功能。

[查看详细](https://www.grapecity.com.cn/developer/casestudies/shjr)

 **成都三节课 - Teammark 知识管理库** 

[![输入图片说明](https://www.grapecity.com.cn/images/metalsmith/developer/casestudies/casestudies-cdsjk/pic06-1.png)](https://www.grapecity.com.cn/developer/casestudies/cdsjk)

借助葡萄城表格组件高度复刻了类似 Excel 的操作体验，系统界面右侧保留了历史记录列表，用户可以根据列表建立当前历史状态的副本，以及执行回滚到选中记录的状态。

[查看详细](https://www.grapecity.com.cn/developer/casestudies/cdsjk)

 **金蝶云 - BOM 管理模块** 

![输入图片说明](https://www.grapecity.com.cn/images/metalsmith/developer/spreadjs/industry/version/jindie.png)

BOM 管理（Bill of Material 物料管理）涉及对 BOM 的建立、流转、变更、结算等环节进行维护和控制的过程。金蝶云通过嵌入 SpreadJS 表格组件开发的 BOM 管理模块，实现了大量的表格报表设计、比对、版本、生命周期控制等功能点。

#### SpreadJS 三大应用场景

[ **表格文档协同编辑** ](https://www.grapecity.com.cn/developer/spreadjs/scenarios/collaborate-edits)
SpreadJS 的应用场景之一，可实现多人实时协作的在线文档编辑系统。

[ **类Excel报表设计** ](https://www.grapecity.com.cn/developer/spreadjs/scenarios/excel-design)
SpreadJS 的应用场景之一，可大幅降低从本地到线上的数据迁移工作量。

[ **数据填报** ](https://www.grapecity.com.cn/developer/spreadjs/scenarios/data-filling)
SpreadJS 的应用场景之一，可实现类Excel的数据填报与展示。

