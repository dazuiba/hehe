Ext.BLANK_IMAGE_URL = "/images/default/s.gif";
Ext.SSL_SECURE_URL = "/images/default/s.gif";
Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">加载中...</div>';
Ext.Ajax.timeout = 120000;
Ext.QuickTips.init();

if (Ext.View) {
    Ext.View.prototype.emptyText = ""
}
if (Ext.grid.GridPanel) {
    Ext.grid.GridPanel.prototype.ddText = "{0} 选择行"
}
if (Ext.TabPanelItem) {
    Ext.TabPanelItem.prototype.closeText = "关闭"
}
if (Ext.form.Field) {
    Ext.form.Field.prototype.invalidText = "输入值非法"
}
Date.monthNames = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
Date.dayNames = ["日", "一", "二", "三", "四", "五", "六"];
if (Ext.MessageBox) {
    Ext.MessageBox.buttonText = {
        ok: "确定",
        cancel: "取消",
        yes: "是",
        no: "否"
    }
}
if (Ext.util.Format) {
    Ext.util.Format.date = function(A, B) {
        if (!A) {
            return ""
        }
        if (! (A instanceof Date)) {
            A = new Date(Date.parse(A))
        }
        return A.dateFormat(B || "Y-m-d")
    }
}
if (Ext.DatePicker) {
    Ext.apply(Ext.DatePicker.prototype, {
        todayText: "今天",
        minText: "日期在最小日期之前",
        maxText: "日期在最大日期之后",
        disabledDaysText: "",
        disabledDatesText: "",
        monthNames: Date.monthNames,
        dayNames: Date.dayNames,
        nextText: "下月 (Control+Right)",
        prevText: "上月 (Control+Left)",
        monthYearText: "选择一个月 (Control+Up/Down 来改变年)",
        todayTip: "{0} (空格键选择)",
        format: "Y-m-d",
        okText: "确定",
        cancelText: "取消"
    })
}
if (Ext.PagingToolbar) {
    Ext.apply(Ext.PagingToolbar.prototype, {
        beforePageText: "第",
        afterPageText: "页/共 {0} 页",
        firstText: "第一页",
        prevText: "前一页",
        nextText: "下一页",
        lastText: "最后页",
        refreshText: "刷新",
        displayMsg: "显示 {0} - {1}，共 {2} 条",
        emptyMsg: "没有数据需要显示"
    })
}
if (Ext.form.TextField) {
    Ext.apply(Ext.form.TextField.prototype, {
        minLengthText: "该输入项的最小长度是 {0}",
        maxLengthText: "该输入项的最大长度是 {0}",
        blankText: "该输入项为必输项",
        regexText: "",
        emptyText: null
    })
}
if (Ext.form.NumberField) {
    Ext.apply(Ext.form.NumberField.prototype, {
        minText: "该输入项的最小值是 {0}",
        maxText: "该输入项的最大值是 {0}",
        nanText: "{0} 不是有效数值"
    })
}
if (Ext.form.DateField) {
    Ext.apply(Ext.form.DateField.prototype, {
        disabledDaysText: "禁用",
        disabledDatesText: "禁用",
        minText: "该输入项的日期必须在 {0} 之后",
        maxText: "该输入项的日期必须在 {0} 之前",
        invalidText: "{0} 是无效的日期 - 必须符合格式： {1}",
        format: "Y-m-d"
    })
}
if (Ext.form.ComboBox) {
    Ext.apply(Ext.form.ComboBox.prototype, {
        loadingText: "加载...",
        valueNotFoundText: undefined
    })
}
if (Ext.form.VTypes) {
    Ext.apply(Ext.form.VTypes, {
        emailText: '该输入项必须是电子邮件地址，格式如： "user@domain.com"',
        urlText: '该输入项必须是URL地址，格式如： "http://www.domain.com"',
        alphaText: "该输入项只能包含字符和_",
        alphanumText: "该输入项只能包含字符,数字和_"
    })
}
if (Ext.grid.GridView) {
    Ext.apply(Ext.grid.GridView.prototype, {
        sortAscText: "正序",
        sortDescText: "逆序",
        lockText: "锁列",
        unlockText: "解锁列",
        columnsText: "列"
    })
}
if (Ext.grid.PropertyColumnModel) {
    Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
        nameText: "名称",
        valueText: "值",
        dateFormat: "Y-m-d"
    })
}
if (Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion) {
    Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
        splitTip: "拖动来改变尺寸.",
        collapsibleSplitTip: "拖动来改变尺寸. 双击隐藏."
    })
};

Ext.namespace("SliverData");
SliverData.recordStatus = [["客户关怀"], ["客户回访"], ["客户投诉"], ["其他事宜"]];
SliverData.province = [["上海"], ["云南"], ["内蒙古"], ["北京"], ["台湾"], ["吉林"], ["四川"], ["天津"], ["宁夏"], ["安徽"], ["山东"], ["山西"], ["广东"], ["广西"], ["新疆"], ["江苏"], ["江西"], ["河北"], ["河南"], ["浙江"], ["海南"], ["湖北"], ["湖南"], ["澳门"], ["甘肃"], ["福建"], ["西藏"], ["贵州"], ["辽宁"], ["重庆"], ["陕西"], ["青海"], ["香港"], ["黑龙江"]];
SliverData.communicate = [["面谈"], ["电话"], ["传真"], ["电子邮件"], ["互联网"], ["其他"]];
SliverData.customerFrom = [["介绍"], ["展会"], ["电话"], ["平面媒体"], ["互联网"], ["其他"]];
SliverData.customerType = [["分析者", "0"], ["代理商", "1"], ["分销商", "2"], ["集成商", 3], ["投资商", 4], ["合作伙伴", 5], ["出版商", 5], ["供应商", 6], ["目标", 7], ["其他", 8]];
SliverData.status = [["高"], ["较高"], ["普通"], ["较低"], ["低"]];
SliverData.relationship = [["好"], ["较好"], ["一般"], ["较差"], ["差"]];
SliverData.offerState = [["已建立", "0"], ["已批准", "1"], ["已取消", "-1"], ["已锁定", "2"]];
SliverData.orderState = [["已建立", "0"], ["已批准", "1"], ["已取消", "-1"], ["已发货", "2"]];
SliverData.complainState = [["未解决"], ["处理中"], ["已解决"]];
SliverData.result = [["非常满意"], ["满意"], ["一般"], ["不满意"], ["非常不满意"]];
SliverData.serveType = [["回访"], ["维修"], ["返修"], ["其它"]];
SliverData.cashedType = [["现金"], ["支票"], ["转账"], ["电汇"], ["支付宝"], ["paypal"], ["其它"]];
SliverData.businessChance = [["初期沟通", "0"], ["立项评估", "1"], ["需求分析", "2"], ["方案制定", "3"], ["投标竞争", "4"], ["商务谈判", "5"], ["合同签约", "6"]];
SliverData.chanceSource = [["电话来访"], ["老客户"], ["客户介绍"], ["独立开发"], ["媒体宣传"], ["促销活动"], ["代理商"], ["合作伙伴"], ["邮件"], ["电子邮件"], ["网站"], ["会议"], ["展会"], ["口碑"], ["其他"]];
SliverData.employees = [["10人以下"], ["10 - 50人"], ["50 - 100人"], ["100 - 500人"], ["500 - 1000人"], ["1000人以上"]];
SliverData.sale = [["人民币10万以下"], ["人民币10万 - 100万人"], ["人民币100万 - 500万"], ["人民币500万 - 1000万"], ["人民币1000万 - 5000万"], ["人民币5000万-1亿"], ["人民币1亿以上"]];
SliverData.nature = [["国有企业"], ["股份制企业"], ["外商独资企业(欧美)"], ["外商独资企业(非欧美)"], ["合资企业"], ["私营企业"], ["集体企业"], ["其他"]];
SliverData.category = [["农业"], ["食品、饮料"], ["服装"], ["纺织、皮革"], ["电工电气"], ["家用电器"], ["电脑、软件"], ["化工"], ["冶金矿产"], ["能源"], ["环保"], ["交通运输"], ["建筑、建材"], ["机械及行业设备"], ["家居用品"], ["医药、保养"], ["礼品、工艺品、饰品"], ["运动、休闲"], ["办公、文教"], ["包装"], ["商务服务"], ["安全、防护"], ["库存积压"], ["汽摩及配件"], ["印刷"], ["代理"], ["纸业"], ["传媒"], ["服饰"], ["橡塑"], ["精细化学品"], ["电子元器件"], ["照明工业"], ["五金、工具"], ["通讯产品"], ["玩具"], ["加工"], ["二手设备转让"], ["项目合作"], ["仪器仪表"], ["其它"]];
SliverData.customerType = [["潜在", "0"], ["有意向", "1"], ["已成交", "2"], ["失败", "3"], ["无", "4"]];
SliverData.customerLevel = [["1星", "1"], ["2星", "2"], ["3星", "3"], ["4星", "4"], ["5星", "5"], ["6星", "6"], ["7星", "7"], ["8星", "8"], ["9星", "9"], ["10星", "10"]];
SliverData.telKey = [["商务"], ["商务2"], ["助理"], ["商务传真"], ["回电话"], ["车载电话"], ["单位"], ["住宅"], ["住宅2"], ["移动电话"], ["其他"], ["其他传真"], ["主要电话"], ["无线电话"]];
SliverData.imKey = [["QQ"], ["MSN"], ["阿里旺旺"], ["百度HI"], ["慧聪发发"], ["飞信"], ["其他"]];
SliverData.chanceState = [["跟踪"], ["成功"], ["放弃"], ["搁置"], ["失效"]];
SliverData.pn = [["尺寸"], ["重量"], ["颜色"], ["体积"], ["容积"], ["功率"], ["材质"], ["压力"], ["密度"], ["保质期"]];
Ext.namespace("SliverData.storage");
SliverData.storage.title = "产品库存";
SliverData.storage.tooltip = "<b>产品库存</b><br />产品库存、收发记录";
SliverData.storage.productionDescription = "产品说明";
SliverData.storage.productionParameter = "技术说明";
Ext.namespace("SliverData.chance");
SliverData.chance.title = "我的机会";
SliverData.chance.tooltip = "<b>我的销售机会</b><br />我的销售机会记录、追踪";
SliverData.chance.requirement = "客户需求: ";
Ext.namespace("SliverData.chanceManager");
SliverData.chanceManager.title = "销售机会";
SliverData.chanceManager.tooltip = "<b>所有销售机会管理</b><br />所有销售机会记录、追踪的管理";