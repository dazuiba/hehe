//~~
Sliver.CustomerOwner=Ext.extend(Ext.app.Module,{
    moduleType:"customer",
    moduleId:"customer-owner",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"icon-contact",
            scope:this,
            shortcutIconCls:"customer-shortcut",
            text:"我的客户",
            tooltip:"<b>我的客户</b><br />我的客户资料，联系记录"
        }
    },
    createWindow:function(){
        var desktop=this.app.getDesktop();var win=desktop.getWindow(this.moduleId);if(!win){
            var winWidth=desktop.getWinWidth();var winHeight=desktop.getWinHeight();var groupTree=new Ext.tree.TreePanel({
                region:"west",
                split:true,
                collapseMode:"mini",
                useArrows:true,
                autoScroll:true,
                animate:true,
                dropConfig:{
                    appendOnly:true
                },
                enableDD:true,
                containerScroll:true,
                rootVisible:true,
                loader:new Ext.tree.ContactTreeLoader({
                    dataUrl:"customer/listContactTree.action"
                }),
                root:new Ext.tree.contactNode({
                    id:"guestGroup-1",
                    text:"客户和联系人",
                    iconCls:"icon-customer",
                    draggable:false,
                    expanded:true,
                    isCustomer:false,
                    singleClickExpand:false
                }),
                tbar:[{
                        tooltip:"重新加载",
                        iconCls:"icon-reload",
                        handler:function(){
                            groupTree.getRootNode().reload()
                        }
                    },"-",{
                        iconCls:"icon-expand-all",
                        tooltip:"全部展开",
                        handler:function(){
                            groupTree.getRootNode().expand(true)
                        }
                    },{
                        iconCls:"icon-collapse-all",
                        tooltip:"全部折叠",
                        handler:function(){
                            groupTree.getRootNode().collapse(true)
                        }
                    },"->","-",{
                        iconCls:"icon-add",
                        menu:new Ext.menu.Menu({
                            items:[{
                                    text:"新建目录",
                                    iconCls:"icon-group-add",
                                    handler:function(){
                                        var node=sm.getSelectedNode();if(node){
                                            insertGroupView(node.id.substring(node.id.lastIndexOf("-")+1))
                                        }else{
                                            insertGroupView()
                                        }
                                    }
                                },{
                                    text:"新建客户",
                                    iconCls:"icon-customer",
                                    handler:function(){
                                        var node=sm.getSelectedNode();if(node){
                                            insertCustomerView(node.id.substring(node.id.lastIndexOf("-")+1))
                                        }else{
                                            insertCustomerView()
                                        }
                                    }
                                },{
                                    text:"新建联系人",
                                    iconCls:"icon-contact-add",
                                    handler:function(){
                                        var node=sm.getSelectedNode();if(node){
                                            insertContactView(node.id.substring(node.id.lastIndexOf("-")+1))
                                        }else{
                                            insertContactView()
                                        }
                                    }
                                }]
                        })
                    }],
                autoScroll:true,
                margins:"0 0 0 0",
                width:parseFloat(winWidth*0.3)<201?parseFloat(winWidth*0.3):200
            });var store=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"customer/listContact.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"contacts",
                    totalProperty:"total",
                    id:"id",
                    fields:["userID","userName","id","groupID","groupName","name","organization","department","role","nameDisplayed","email","email2","email3","emailDisplayed","web","imType","imValue","imType2","imValue2","telKey","telValue","telKey2","telValue2","telKey3","telValue3","telKey4","telValue4","telKey5","telValue5","telKey6","telValue6","country","province","city","address","zipcode","country2","province2","city2","address2","zipcode2","note","create","update"]
                }),
                remoteSort:true
            });store.setDefaultSort("id","desc");var gridsm=new Ext.grid.CheckboxSelectionModel({
                singleSelect:false
            });var cm=new Ext.grid.ColumnModel([gridsm,{
                    header:"姓名",
                    dataIndex:"name",
                    width:50
                },{
                    header:"所属客户",
                    dataIndex:"groupName",
                    hidden:false,
                    width:100
                },{
                    header:"称谓",
                    hidden:true,
                    dataIndex:"nameDisplayed",
                    width:40
                },{
                    header:"职位",
                    dataIndex:"role",
                    width:50
                },{
                    header:"部门",
                    dataIndex:"department",
                    width:40
                },{
                    hidden:true,
                    header:"单位（组织）",
                    dataIndex:"organization",
                    width:140
                },{
                    header:"电话",
                    dataIndex:"telValue",
                    width:100
                },{
                    header:"传真",
                    hidden:true,
                    dataIndex:"telValue2",
                    width:50
                },{
                    header:"移动电话",
                    hidden:true,
                    dataIndex:"telValue3",
                    width:80
                },{
                    header:"电子邮件",
                    hidden:true,
                    dataIndex:"email",
                    width:80
                },{
                    header:"创建日期",
                    hidden:true,
                    dataIndex:"create",
                    width:40
                },{
                    header:"更新日期",
                    dataIndex:"update",
                    align:"right",
                    width:40
                }]);cm.defaultSortable=true;var filterContactParams={
                "contact.groupName":"",
                "contact.name":"",
                "contact.telValue":"",
                "contact.email":"",
                "contact.address":"",
                "contact.city":"",
                "contact.province":"",
                "contact.country":""
            };var contactGridFilterMenu=new Ext.menu.Menu({
                id:"contactGridFilterMenu",
                items:[{
                        text:"客户/目录名称",
                        checked:true,
                        checkHandler:function(){
                            operateContactGridParams(this.checked,"contact.groupName")
                        }
                    },{
                        text:"联系人姓名",
                        checked:true,
                        checkHandler:function(){
                            operateContactGridParams(this.checked,"contact.name")
                        }
                    },{
                        text:"电话",
                        checked:true,
                        checkHandler:function(){
                            operateContactGridParams(this.checked,"contact.telValue")
                        }
                    },{
                        text:"电子邮件",
                        checked:true,
                        checkHandler:function(){
                            operateContactGridParams(this.checked,"contact.mail")
                        }
                    },{
                        text:"地址",
                        checked:true,
                        checkHandler:function(){
                            operateContactGridParams(this.checked,"contact.address")
                        }
                    },{
                        text:"城市",
                        checked:true,
                        checkHandler:function(){
                            operateContactGridParams(this.checked,"contact.city")
                        }
                    },{
                        text:"省份",
                        checked:true,
                        checkHandler:function(){
                            operateContactGridParams(this.checked,"contact.province")
                        }
                    },{
                        text:"国家地区",
                        checked:true,
                        checkHandler:function(){
                            operateContactGridParams(this.checked,"contact.country")
                        }
                    }]
            });function operateContactGridParams(status,name){
                if(status===true){
                    filterContactParams[name]=""
                }else{
                    filterContactParams[name]=null
                }
            }var filterButton=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==filterContactParams["contact.groupName"]){
                        filterContactParams["contact.groupName"]=filterField.getValue()
                    }if(null!==filterContactParams["contact.name"]){
                        filterContactParams["contact.name"]=filterField.getValue()
                    }if(null!==filterContactParams["contact.telValue"]){
                        filterContactParams["contact.telValue"]=filterField.getValue()
                    }if(null!==filterContactParams["contact.email"]){
                        filterContactParams["contact.email"]=filterField.getValue()
                    }if(null!==filterContactParams["contact.address"]){
                        filterContactParams["contact.address"]=filterField.getValue()
                    }if(null!==filterContactParams["contact.city"]){
                        filterContactParams["contact.city"]=filterField.getValue()
                    }if(null!==filterContactParams["contact.province"]){
                        filterContactParams["contact.province"]=filterField.getValue()
                    }if(null!==filterContactParams["contact.country"]){
                        filterContactParams["contact.country"]=filterField.getValue()
                    }store.baseParams=filterContactParams;store.setDefaultSort("id","desc");store.load({
                        params:{
                            start:0,
                            limit:pageSizePlugin.getPageSize()
                        }
                    })
                }
            });var filterField=new Ext.form.TextField({});var clearButton=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    filterField.reset();store.baseParams={};store.setDefaultSort("id","desc");store.load({
                        params:{
                            start:0,
                            limit:pageSizePlugin.getPageSize()
                        }
                    })
                }
            });var pageSizePlugin=new Ext.ux.Andrie.pPageSize();var grid=new Ext.grid.GridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:store,
                cm:cm,
                sm:gridsm,
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:pageSizePlugin,
                    pageSize:20,
                    store:store,
                    displayInfo:true,
                    items:["-",{
                            text:"查询范围",
                            menu:contactGridFilterMenu
                        },filterField,filterButton,clearButton,"-",{
                            iconCls:"icon-pdf",
                            tooltip:"将表格导出为PDF文件",
                            handler:function(){
                                var s="";if(store.lastOptions){
                                    s+=Ext.urlEncode(store.lastOptions)
                                }if(store.baseParams){
                                    if(s===""){
                                        s+=Ext.urlEncode(store.baseParams)
                                    }else{
                                        s+="&";s+=Ext.urlEncode(store.baseParams)
                                    }
                                }if(""!==s){
                                    s="?"+s
                                }window.open("customer/exportContacts.action"+s,"_blank")
                            }
                        },{
                            iconCls:"icon-xls",
                            tooltip:"将表格导出为XLS文件",
                            handler:function(){
                                var s="";if(store.lastOptions){
                                    s+=Ext.urlEncode(store.lastOptions)
                                }if(store.baseParams){
                                    if(s===""){
                                        s+=Ext.urlEncode(store.baseParams)
                                    }else{
                                        s+="&";s+=Ext.urlEncode(store.baseParams)
                                    }
                                }if(""===s){
                                    s="?type=xls"
                                }else{
                                    s="?"+s+"&type=xls"
                                }window.open("customer/exportContacts.action"+s)
                            }
                        },"-",{
                            iconCls:"icon-contact",
                            tooltip:"将选中联系人资料导出为PDF文件",
                            handler:function(){
                                var record=gridsm.getSelected();if(record){
                                    window.open("customer/exportContact.action?contact.id="+record.data.id)
                                }
                            }
                        },{
                            iconCls:"icon-xls",
                            tooltip:"将选中联系人资料导出为Excel文件",
                            handler:function(){
                                var record=gridsm.getSelected();if(record){
                                    window.open("customer/exportContact.action?type=xls&contact.id="+record.data.id)
                                }
                            }
                        }]
                })
            });grid.on("render",function(){
                store.load({
                    params:{
                        start:0,
                        limit:pageSizePlugin.getPageSize()
                    }
                })
            });grid.on("rowdblclick",function(){
                var record=gridsm.getSelected();if(record){
                    updateContactView(record.data.id,record.data.name)
                }
            });var updateContactGridView=function(){
                var record=gridsm.getSelected();if(record){
                    updateContactView(record.data.id,record.data.name)
                }
            };var deleteContactGridView=function(){
                var record=gridsm.getSelected();if(record){
                    removeContactView(record.data.id,record.data.name)
                }
            };var insertContactRecordGridView=function(){
                var record=gridsm.getSelected();if(record){
                    insertContactRecordView(record.data.id,record.data.name)
                }
            };var cMenu;grid.on("rowcontextmenu",function(grid,rowindex,e){
                grid.getSelectionModel().selectRow(rowindex,false);if(!cMenu){
                    cMenu=new Ext.menu.Menu([{
                            id:"updateContactGridViewMenu",
                            text:"更新联系人资料",
                            handler:updateContactGridView
                        },{
                            id:"addContactRecordGridViewMenu",
                            text:"新建联系记录",
                            handler:insertContactRecordGridView
                        },"-",{
                            id:"removeContactRecordGridContextView",
                            text:"删除联系人",
                            handler:deleteContactGridView
                        }])
                }cMenu.showAt(e.getPoint());e.stopEvent()
            });var customerstore=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"customer/listCustomer.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"customers",
                    totalProperty:"total",
                    id:"groupID",
                    fields:["userID","userName","groupID","groupPID","groupName","groupCustomer","tel","tel2","fax","email","email2","web","employees","source","state","nature","sale","level","category","type","create","userID","userName","country","province","city","address","zipcode","country2","province2","city2","address2","zipcode2","bankName","bankAccount","bankNumber","bankTax","payType","creditLimit","orderTotal","orderAmount","note","input","update"]
                }),
                remoteSort:true
            });customerstore.setDefaultSort("groupID","DESC");var customergridsm=new Ext.grid.CheckboxSelectionModel({
                singleSelect:false
            });var customercm=new Ext.grid.ColumnModel([customergridsm,{
                    header:"编号",
                    dataIndex:"groupID",
                    width:40
                },{
                    header:"客户名称",
                    dataIndex:"groupName",
                    width:100
                },{
                    header:"来源",
                    dataIndex:"source",
                    width:40
                },{
                    header:"类型",
                    hidden:true,
                    dataIndex:"type",
                    width:40
                },{
                    header:"电话",
                    dataIndex:"tel",
                    width:80
                },{
                    header:"传真",
                    dataIndex:"fax",
                    width:60
                },{
                    header:"网站",
                    dataIndex:"web",
                    hidden:true,
                    width:100
                },{
                    header:"城市",
                    hidden:true,
                    dataIndex:"city",
                    width:40
                },{
                    header:"省份",
                    hidden:true,
                    dataIndex:"province",
                    width:40
                },{
                    header:"行业",
                    align:"right",
                    dataIndex:"category",
                    width:45
                },{
                    header:"客户等级",
                    align:"right",
                    dataIndex:"level",
                    renderer:function(v){
                        return SliverData.customerLevel[v+1][0]
                    },
                    width:45
                },{
                    header:"创建日期",
                    align:"right",
                    hidden:true,
                    dataIndex:"input",
                    width:60
                },{
                    header:"更新时间",
                    align:"right",
                    hidden:true,
                    dataIndex:"update",
                    width:60
                }]);customercm.defaultSortable=true;var customerGridFilterMenu=new Ext.menu.Menu({
                id:"customerGridFilterMenu",
                items:[{
                        text:"客户名称",
                        checked:true,
                        checkHandler:function(){
                            operateCustomerGridParams(this.checked,"customer.groupName")
                        }
                    },{
                        text:"电话",
                        checked:true,
                        checkHandler:function(){
                            operateCustomerGridParams(this.checked,"customer.tel")
                        }
                    },{
                        text:"传真",
                        checked:true,
                        checkHandler:function(){
                            operateCustomerGridParams(this.checked,"customer.fax")
                        }
                    },{
                        text:"网站",
                        checked:true,
                        checkHandler:function(){
                            operateCustomerGridParams(this.checked,"customer.web")
                        }
                    },{
                        text:"电子邮件",
                        checked:true,
                        checkHandler:function(){
                            operateCustomerGridParams(this.checked,"customer.email")
                        }
                    },{
                        text:"城市",
                        checked:true,
                        checkHandler:function(){
                            operateCustomerGridParams(this.checked,"customer.city")
                        }
                    },{
                        text:"省份",
                        checked:true,
                        checkHandler:function(){
                            operateCustomerGridParams(this.checked,"customer.province")
                        }
                    },{
                        text:"国家",
                        checked:true,
                        checkHandler:function(){
                            operateCustomerGridParams(this.checked,"customer.country")
                        }
                    },{
                        text:"地址",
                        checked:true,
                        checkHandler:function(){
                            operateCustomerGridParams(this.checked,"customer.address")
                        }
                    }]
            });var customerGridFilterParams={
                "customer.groupName":"",
                "customer.tel":"",
                "customer.fax":"",
                "customer.email":"",
                "customer.web":"",
                "customer.city":"",
                "customer.province":"",
                "customer.country":"",
                "customer.address":""
            };function operateCustomerGridParams(status,name){
                if(status===true){
                    customerGridFilterParams[name]=""
                }else{
                    customerGridFilterParams[name]=null
                }
            }var filterCustomerField=new Ext.form.TextField({});var filterCustomerButton=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==customerGridFilterParams["customer.groupName"]){
                        customerGridFilterParams["customer.groupName"]=filterCustomerField.getValue()
                    }if(null!==customerGridFilterParams["customer.tel"]){
                        customerGridFilterParams["customer.tel"]=filterCustomerField.getValue()
                    }if(null!==customerGridFilterParams["customer.fax"]){
                        customerGridFilterParams["customer.fax"]=filterCustomerField.getValue()
                    }if(null!==customerGridFilterParams["customer.web"]){
                        customerGridFilterParams["customer.web"]=filterCustomerField.getValue()
                    }if(null!==customerGridFilterParams["customer.email"]){
                        customerGridFilterParams["customer.email"]=filterCustomerField.getValue()
                    }if(null!==customerGridFilterParams["customer.city"]){
                        customerGridFilterParams["customer.city"]=filterCustomerField.getValue()
                    }if(null!==customerGridFilterParams["customer.province"]){
                        customerGridFilterParams["customer.province"]=filterCustomerField.getValue()
                    }if(null!==customerGridFilterParams["customer.country"]){
                        customerGridFilterParams["customer.country"]=filterCustomerField.getValue()
                    }if(null!==customerGridFilterParams["customer.address"]){
                        customerGridFilterParams["customer.address"]=filterCustomerField.getValue()
                    }customerstore.baseParams=customerGridFilterParams;customerstore.setDefaultSort("groupID","DESC");customerstore.load({
                        params:{
                            start:0,
                            limit:customerPageSizePlugin.getPageSize()
                        }
                    })
                }
            });var clearCustomerButton=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    filterCustomerField.reset();customerstore.baseParams={};customerstore.load({
                        params:{
                            start:0,
                            limit:customerPageSizePlugin.getPageSize()
                        }
                    })
                }
            });var customerPageSizePlugin=new Ext.ux.Andrie.pPageSize();var customergrid=new Ext.grid.GridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:customerstore,
                cm:customercm,
                sm:customergridsm,
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:customerPageSizePlugin,
                    pageSize:20,
                    store:customerstore,
                    displayInfo:true,
                    items:["-",{
                            text:"查询范围",
                            menu:customerGridFilterMenu
                        },filterCustomerField,filterCustomerButton,clearCustomerButton,"-",{
                            iconCls:"icon-pdf",
                            tooltip:"将表格导出为PDF文件",
                            handler:function(){
                                var s="";if(customerstore.lastOptions){
                                    s+=Ext.urlEncode(customerstore.lastOptions)
                                }if(customerstore.baseParams){
                                    if(s===""){
                                        s+=Ext.urlEncode(customerstore.baseParams)
                                    }else{
                                        s+="&";s+=Ext.urlEncode(customerstore.baseParams)
                                    }
                                }if(""!==s){
                                    s="?"+s
                                }window.open("customer/exportCustomers.action"+s)
                            }
                        },{
                            iconCls:"icon-xls",
                            tooltip:"将表格导出为XLS文件",
                            handler:function(){
                                var s="";if(customerstore.lastOptions){
                                    s+=Ext.urlEncode(customerstore.lastOptions)
                                }if(store.baseParams){
                                    if(s===""){
                                        s+=Ext.urlEncode(customerstore.baseParams)
                                    }else{
                                        s+="&";s+=Ext.urlEncode(customerstore.baseParams)
                                    }
                                }if(""===s){
                                    s="?type=xls"
                                }else{
                                    s="?"+s+"&type=xls"
                                }window.open("customer/exportCustomers.action"+s)
                            }
                        },"-",{
                            iconCls:"icon-customer",
                            tooltip:"将选中客户资料导出为PDF文件",
                            handler:function(){
                                var record=customergridsm.getSelected();if(record){
                                    window.open("customer/exportCustomer.action?customer.groupID="+record.data.groupID)
                                }
                            }
                        },{
                            iconCls:"icon-xls",
                            tooltip:"将选中客户资料导出为Excel文件",
                            handler:function(){
                                var record=customergridsm.getSelected();if(record){
                                    window.open("customer/exportCustomer.action?type=xls&customer.groupID="+record.data.groupID)
                                }
                            }
                        }]
                })
            });customergrid.on("render",function(){
                customerstore.load({
                    params:{
                        start:0,
                        limit:customerPageSizePlugin.getPageSize()
                    }
                })
            });customergrid.on("rowdblclick",function(){
                var record=customergridsm.getSelected();if(record){
                    updateCustomerView(record.data.groupID,record.data.groupName)
                }
            });var customerContextMenu;customergrid.on("rowcontextmenu",function(customergrid,rowindex,e){
                customergrid.getSelectionModel().selectRow(rowindex,false);if(!customerContextMenu){
                    customerContextMenu=new Ext.menu.Menu([{
                            id:"insertCustomerContextMenu",
                            text:"新建客户",
                            handler:function(){
                                var record=customergridsm.getSelected();if(record){
                                    insertCustomerView(record.data.groupPID)
                                }
                            }
                        },{
                            id:"updateCustomerContextMenu",
                            text:"更新客户",
                            handler:function(){
                                var record=customergridsm.getSelected();if(record){
                                    updateCustomerView(record.data.groupID,record.data.groupName)
                                }
                            }
                        },{
                            id:"addContactViewContextMenu",
                            text:"新建联系人",
                            handler:function(){
                                var record=customergridsm.getSelected();if(record){
                                    insertContactView(record.data.groupID)
                                }
                            }
                        },"-",{
                            id:"removeCustomerContextMenu",
                            text:"删除客户",
                            handler:function(){
                                var record=customergridsm.getSelected();if(record){
                                    removeCustomerView(record.data.groupID,record.data.groupName)
                                }
                            }
                        }])
                }customerContextMenu.showAt(e.getPoint());e.stopEvent()
            });var recordstore=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"customer/listContactRecord.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"records",
                    totalProperty:"total",
                    id:"recordID",
                    fields:["contactID","contactName","recordID","recordTitle","recordType","recordCommunicateType","recordContent","recordFile","createTimestamp","updateTimestamp"]
                }),
                remoteSort:true
            });recordstore.setDefaultSort("recordID","DESC");var recordExpander=new Ext.grid.RowExpander({
                tpl:new Ext.Template("<p><b>联系内容:</b> {recordContent}</p>")
            });var recordcm=new Ext.grid.ColumnModel([recordExpander,{
                    header:"序号",
                    dataIndex:"recordID",
                    width:40
                },{
                    header:"附件",
                    dataIndex:"recordFile",
                    renderer:SliverUtil.renderFile,
                    width:20
                },{
                    header:"联系人",
                    dataIndex:"contactName",
                    width:50
                },{
                    header:"来源",
                    hidden:true,
                    dataIndex:"recordType",
                    width:60
                },{
                    header:"联系方式",
                    dataIndex:"recordCommunicateType",
                    width:60
                },{
                    header:"标题",
                    dataIndex:"recordTitle",
                    renderer:function(v){
                        return Ext.util.Format.ellipsis(v,25)
                    },
                    width:160
                },{
                    header:"创建时间",
                    align:"right",
                    dataIndex:"createTimestamp",
                    width:80
                },{
                    header:"更新时间",
                    align:"right",
                    hidden:true,
                    dataIndex:"updateTimestamp",
                    width:80
                }]);recordcm.defaultSortable=true;var recordGridFilterMenu=new Ext.menu.Menu({
                id:"recordGridFilterMenu",
                items:[{
                        text:"联系人姓名",
                        checked:true,
                        checkHandler:function(){
                            operateRecordGridParams(this.checked,"record.contactName")
                        }
                    },{
                        text:"联系事由",
                        checked:true,
                        checkHandler:function(){
                            operateRecordGridParams(this.checked,"record.type")
                        }
                    },{
                        text:"标题",
                        checked:true,
                        checkHandler:function(){
                            operateRecordGridParams(this.checked,"record.title")
                        }
                    },{
                        text:"沟通方式",
                        checked:true,
                        checkHandler:function(){
                            operateRecordGridParams(this.checked,"record.recordCommunicateType")
                        }
                    },{
                        text:"内容",
                        checked:true,
                        checkHandler:function(){
                            operateRecordGridParams(this.checked,"record.recordContent")
                        }
                    }]
            });var recordGridFilterParams={
                "record.contactName":"",
                "record.type":"",
                "record.title":"",
                "record.recordCommunicateType":"",
                "record.recordContent":""
            };function operateRecordGridParams(status,name){
                if(status===true){
                    recordGridFilterParams[name]=""
                }else{
                    recordGridFilterParams[name]=null
                }
            }var filterRecordField=new Ext.form.TextField({});var filterRecordButton=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==recordGridFilterParams["record.contactName"]){
                        recordGridFilterParams["record.contactName"]=filterRecordField.getValue()
                    }if(null!==recordGridFilterParams["record.type"]){
                        recordGridFilterParams["record.type"]=filterRecordField.getValue()
                    }if(null!==recordGridFilterParams["record.title"]){
                        recordGridFilterParams["record.title"]=filterRecordField.getValue()
                    }if(null!==recordGridFilterParams["record.recordCommunicateType"]){
                        recordGridFilterParams["record.recordCommunicateType"]=filterRecordField.getValue()
                    }if(null!==recordGridFilterParams["record.recordContent"]){
                        recordGridFilterParams["record.recordContent"]=filterRecordField.getValue()
                    }recordstore.baseParams=recordGridFilterParams;recordstore.setDefaultSort("recordID","DESC");recordstore.load({
                        params:{
                            start:0,
                            limit:recordPageSizePlugin.getPageSize()
                        }
                    })
                }
            });var clearRecordButton=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    filterCustomerField.reset();recordstore.baseParams={};recordstore.load({
                        params:{
                            start:0,
                            limit:recordPageSizePlugin.getPageSize()
                        }
                    })
                }
            });var updateContactRecordGrid=function(){
                var record=recordgridsm.getSelected();if(record){
                    updateContactRecordView(record.data.recordID,record.data.contactID,record.data.contactName)
                }
            };var insertContactRecordGrid=function(){
                var record=recordgridsm.getSelected();if(record){
                    insertContactRecordView(record.data.contactID,record.data.contactName)
                }
            };var removeContactRecordGrid=function(){
                var record=recordgridsm.getSelected();if(record){
                    removeContactRecordView(record.data.recordID)
                }
            };var recordgridsm=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });var recordPageSizePlugin=new Ext.ux.Andrie.pPageSize();var recordgrid=new Ext.grid.GridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:recordstore,
                cm:recordcm,
                sm:recordgridsm,
                plugins:recordExpander,
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:recordPageSizePlugin,
                    pageSize:20,
                    store:recordstore,
                    displayInfo:true,
                    displayMsg:"显示 {0} - {1} 共{2}",
                    emptyMsg:"",
                    items:["-",{
                            text:"查询范围",
                            menu:recordGridFilterMenu
                        },filterRecordField,filterRecordButton,clearRecordButton,"-",{
                            tooltip:"新建联系记录",
                            iconCls:"icon-comment-add",
                            handler:insertContactRecordGrid
                        },{
                            tooltip:"编辑联系记录",
                            iconCls:"icon-comment-edit",
                            handler:updateContactRecordGrid
                        },{
                            tooltip:"删除联系记录",
                            iconCls:"icon-comment-remove",
                            handler:removeContactRecordGrid
                        }]
                })
            });recordgrid.on("render",function(){
                recordstore.load({
                    params:{
                        start:0,
                        limit:recordPageSizePlugin.getPageSize()
                    }
                })
            });var gmenu;recordgrid.on("rowcontextmenu",function(recordgrid,rowindex,e){
                recordgrid.getSelectionModel().selectRow(rowindex,false);if(!gmenu){
                    gmenu=new Ext.menu.Menu([{
                            id:"addContactRecordGridContextView",
                            text:"添加联系记录",
                            handler:insertContactRecordGrid
                        },{
                            id:"updateContactRecordGridContextView",
                            text:"编辑联系记录",
                            handler:updateContactRecordGrid
                        },"-",{
                            id:"removeContactRecordGridContextView",
                            text:"删除联系记录",
                            handler:removeContactRecordGrid
                        }])
                }gmenu.showAt(e.getPoint());e.stopEvent()
            });recordgrid.on("rowdblclick",updateContactRecordGrid);var main=new Ext.TabPanel({
                id:"contact-owner-body",
                region:"center",
                margins:"0 0 0 0",
                resizeTabs:true,
                minTabWidth:135,
                tabWidth:160,
                plugins:new Ext.ux.TabCloseMenu(),
                enableTabScroll:true,
                border:true,
                activeTab:0,
                autoDestroy:true,
                items:[{
                        id:"contact-owner-customer",
                        closable:false,
                        title:"我的客户",
                        autoScroll:true,
                        layout:"fit",
                        items:customergrid,
                        iconCls:"icon-customer"
                    },{
                        id:"contact-owner-contact",
                        closable:false,
                        title:"我的联系人",
                        autoScroll:true,
                        layout:"fit",
                        items:grid,
                        iconCls:"icon-contact"
                    },{
                        id:"contact-owner-record",
                        closable:false,
                        title:"我的联系记录",
                        autoScroll:true,
                        layout:"fit",
                        items:recordgrid,
                        iconCls:"icon-comments"
                    }]
            });groupTree.on("click",function(node,e){
                if(!node.isSelected()){
                    node.select()
                }if(true!==node.isLeaf()){
                    store.baseParams={
                        "contact.groupID":node.id.substring(node.id.lastIndexOf("-")+1)
                    };store.setDefaultSort("id","desc");store.load({
                        params:{
                            start:0,
                            limit:25
                        }
                    });main.setActiveTab(main.getComponent("contact-owner-contact"))
                }else{
                    recordstore.baseParams={
                        "record.contactID":node.id.substring(node.id.lastIndexOf("-")+1)
                    };recordstore.setDefaultSort("recordID","desc");recordstore.load({
                        params:{
                            start:0,
                            limit:recordPageSizePlugin.getPageSize()
                        }
                    });main.setActiveTab(main.getComponent("contact-owner-record"))
                }
            });groupTree.on("dblclick",function(node,e){
                if(!node.isSelected()){
                    node.select()
                }node=sm.getSelectedNode();if(node.isLeaf()){
                    e.stopEvent();updateContactView(node.id.substring(node.id.lastIndexOf("-")+1),node.text)
                }else{
                    if(0<=node.isCustomer()){
                        e.stopEvent();updateCustomerView(node.id.substring(node.id.lastIndexOf("-")+1),node.text)
                    }else{
                        e.stopEvent();updateGroupView(node.id.substring(node.id.lastIndexOf("-")+1),node.text)
                    }
                }
            });var sm=groupTree.getSelectionModel();var cmenu;groupTree.on("contextMenu",function(n,e){
                e.stopEvent();if(!n.isSelected()){
                    n.select()
                }if(!cmenu){
                    cmenu=new Ext.menu.Menu([{
                            id:"expandContacttreeItem",
                            text:"展开",
                            handler:expandNode
                        },{
                            id:"collapseContacttreeItem",
                            text:"折叠",
                            handler:collapseNode
                        },"-",{
                            id:"reloadContacttreeNode",
                            text:"刷新",
                            handler:reloadNode
                        },"-",{
                            text:"新建",
                            id:"createInContacttree",
                            menu:{
                                items:[{
                                        id:"addContactGroupView",
                                        iconCls:"icon-group-add",
                                        text:"目录",
                                        handler:function(){
                                            var node=sm.getSelectedNode();if(node){
                                                insertGroupView(node.id.substring(node.id.lastIndexOf("-")+1))
                                            }
                                        }
                                    },{
                                        id:"addCustomerView",
                                        iconCls:"icon-customer",
                                        text:"客户",
                                        handler:function(){
                                            var node=sm.getSelectedNode();if(node){
                                                insertCustomerView(node.id.substring(node.id.lastIndexOf("-")+1))
                                            }
                                        }
                                    },{
                                        id:"addContactView",
                                        iconCls:"icon-contact-add",
                                        text:"联系人",
                                        handler:function(){
                                            var node=sm.getSelectedNode();if(node){
                                                insertContactView(node.id.substring(node.id.lastIndexOf("-")+1))
                                            }
                                        }
                                    }]
                            }
                        },{
                            id:"addContactRecordView",
                            text:"添加联系记录",
                            handler:function(){
                                var node=sm.getSelectedNode();if(node){
                                    insertContactRecordView(node.id.substring(node.id.lastIndexOf("-")+1),node.text)
                                }
                            }
                        },{
                            id:"updateContacttreeItem",
                            text:"修改",
                            handler:updateNode
                        },"-",{
                            id:"deleteContacttreeItem",
                            text:"删除",
                            handler:deleteNode
                        }])
                }var is=cmenu.items;if(n.isLeaf()){
                    is.get("createInContacttree").hide();is.get("addContactRecordView").show();is.get("reloadContacttreeNode").setDisabled(true);is.get("expandContacttreeItem").setDisabled(true);is.get("collapseContacttreeItem").setDisabled(true)
                }else{
                    is.get("createInContacttree").show();is.get("addContactRecordView").hide();is.get("reloadContacttreeNode").setDisabled(false);is.get("expandContacttreeItem").setDisabled(n.isExpanded());is.get("collapseContacttreeItem").setDisabled(!n.isExpanded())
                }cmenu.showAt(e.getPoint())
            });groupTree.on("movenode",function(groupTree,node,oldParent,newParent,index){
                if(node){
                    if(node.isLeaf()){
                        moveContact(groupTree,node,oldParent,newParent,index)
                    }else{
                        moveGroup(groupTree,node,oldParent,newParent,index)
                    }
                }
            });function reloadNode(){
                var node=sm.getSelectedNode();if(node){
                    node.reload()
                }else{
                    groupTree.getRootNode().reload();sm.select(groupTree.getRootNode())
                }
            }function expandNode(){
                var node=sm.getSelectedNode();if(node){
                    node.expand()
                }else{
                    groupTree.getRootNode().expand();sm.select(groupTree.getRootNode())
                }
            }function collapseNode(){
                var node=sm.getSelectedNode();if(node){
                    node.collapse()
                }else{
                    groupTree.getRootNode().collapse();sm.select(groupTree.getRootNode())
                }
            }function insertContactView(id){
                var tabID=Ext.id();var temp=new Ext.Panel({
                    id:tabID,
                    iconCls:"icon-contact",
                    autoScroll:true,
                    title:"添加联系人",
                    closable:true
                });temp.on("render",function(){
                    temp.load({
                        scripts:true,
                        method:"post",
                        params:{
                            "group.groupID":id,
                            containerID:temp.body.id
                        },
                        url:"customer/insertContactView.action"
                    })
                });var p=main.add(temp);main.setActiveTab(p)
            }function updateContactView(id,title){
                var tabID=main.id+"-contact-"+id;var tab=main.getComponent(tabID);if(tab){
                    tab.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            "contact.id":id,
                            containerID:tab.body.id
                        },
                        url:"customer/updateContactView.action"
                    });main.setActiveTab(tab)
                }else{
                    var temp=new Ext.Panel({
                        id:tabID,
                        autoScroll:true,
                        iconCls:"icon-contact",
                        title:title,
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                "contact.id":id,
                                containerID:temp.body.id
                            },
                            url:"customer/updateContactView.action"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }
            }var removeContactView=function(id,title){
                Ext.MessageBox.confirm("删除联系人","您确定要删除该联系人 <b>"+title+"</b>?",function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"customer/removeContact.action",
                            params:{
                                "contact.id":id
                            },
                            success:function(response){
                                var j=Ext.decode(response.responseText);if(j.success===true){
                                    var tabID=main.id+"-contact-"+id;var tab=main.getComponent(tabID);if(tab){
                                        main.remove(tab,true)
                                    }store.reload();var n=groupTree.getNodeById("contact-"+id);if(n){
                                        n.remove()
                                    }
                                }
                            }
                        })
                    }
                })
            };var deliverContactView=function(id){
                Ext.Ajax.request({
                    url:"customer/deliverContactView.action",
                    params:{
                        "contact.id":id
                    },
                    success:function(response){
                        eval(response.responseText)
                    }
                })
            };var insertCustomerView=function(id){
                var tabID=Ext.id();var temp=new Ext.Panel({
                    id:tabID,
                    iconCls:"icon-customer",
                    autoScroll:true,
                    title:"添加客户",
                    closable:true
                });temp.on("render",function(){
                    temp.load({
                        scripts:true,
                        method:"post",
                        params:{
                            "group.groupID":id,
                            containerID:temp.body.id
                        },
                        url:"customer/insertCustomerView.action"
                    })
                });var p=main.add(temp);main.setActiveTab(p)
            };var updateCustomerView=function(id,tt){
                var tabID=main.id+"-customer-"+id;var tab=main.getComponent(tabID);if(tab){
                    tab.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            "customer.groupID":id,
                            containerID:tab.body.id,
                            parentName:tt
                        },
                        url:"customer/updateCustomerView.action"
                    });main.setActiveTab(tab)
                }else{
                    var temp=new Ext.Panel({
                        id:tabID,
                        autoScroll:true,
                        iconCls:"icon-customer",
                        title:tt,
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                "customer.groupID":id,
                                containerID:temp.body.id,
                                parentName:tt
                            },
                            url:"customer/updateCustomerView.action"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }
            };var updateGroupView=function(id,tt){
                if(id!=="1"){
                    Ext.Ajax.request({
                        url:"customer/updateGroupView.action",
                        params:{
                            "group.groupID":id,
                            parentName:tt
                        },
                        success:function(response){
                            eval(response.responseText)
                        }
                    })
                }
            };var insertGroupView=function(id){
                Ext.Ajax.request({
                    url:"customer/insertGroupView.action",
                    method:"post",
                    params:{
                        "group.groupID":id
                    },
                    success:function(response){
                        eval(response.responseText)
                    }
                })
            };var removeGroupView=function(id,title){
                Ext.MessageBox.confirm("删除目录","您确定要删除目录 <b>"+title+"</b>?",function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"customer/removeGroupAction.action",
                            params:{
                                "group.groupID":id
                            },
                            success:function(response){
                                var result=Ext.decode(response.responseText);if(true===result.success){
                                    var node=groupTree.getNodeById("guestGroup-"+id);if(node){
                                        node.remove()
                                    }
                                }
                            }
                        })
                    }
                })
            };var removeCustomerView=function(id,title){
                Ext.MessageBox.confirm("删除客户","您确定要删除客户 <b>"+title+" ?",function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"customer/removeCustomer.action",
                            params:{
                                "customer.groupID":id
                            },
                            success:function(response){
                                var n=groupTree.getNodeById("guestGroup-"+id);if(n){
                                    n.remove()
                                }customerstore.reload()
                            }
                        })
                    }
                })
            };var deleteNode=function(){
                var node=sm.getSelectedNode();if(node){
                    if(node.id.substring(node.id.lastIndexOf("-")+1)!=="0"){
                        if(node.isLeaf()){
                            removeContactView(node.id.substring(node.id.lastIndexOf("-")+1),node.text)
                        }else{
                            if(node.isCustomer()>=0){
                                removeCustomerView(node.id.substring(node.id.lastIndexOf("-")+1),node.text)
                            }else{
                                if(node.isCustomer()<0){
                                    removeGroupView(node.id.substring(node.id.lastIndexOf("-")+1),node.text)
                                }
                            }
                        }
                    }
                }
            };var updateNode=function(){
                var node=sm.getSelectedNode();if(node){
                    if(node.isLeaf()){
                        updateContactView(node.id.substring(node.id.lastIndexOf("-")+1),node.parentNode.text)
                    }else{
                        if(node.isCustomer()>=0){
                            updateCustomerView(node.id.substring(node.id.lastIndexOf("-")+1),node.parentNode.text)
                        }else{
                            if(node.isCustomer()<0){
                                updateGroupView(node.id.substring(node.id.lastIndexOf("-")+1),node.parentNode.text)
                            }
                        }
                    }
                }
            };var moveGroup=function(groupTree,node,oldParent,newParent,index){
                if(oldParent.id!=newParent.id){
                    Ext.Ajax.request({
                        url:"customer/moveGroupAction.action",
                        params:{
                            "group.groupID":node.id.substring(node.id.lastIndexOf("-")+1),
                            "group.groupPID":newParent.id.substring(node.id.lastIndexOf("-")+1)
                        },
                        success:function(response){
                            var s=Ext.decode(response.responseText);if(s.success){}
                        }
                    })
                }
            };var moveContact=function(groupTree,node,oldParent,newParent,index){
                if(oldParent.id!=newParent.id){
                    Ext.Ajax.request({
                        url:"customer/moveContact.action",
                        params:{
                            "contact.id":node.id.substring(node.id.lastIndexOf("-")+1),
                            "contact.groupID":newParent.id.substring(newParent.id.lastIndexOf("-")+1)
                        },
                        success:function(response){
                            var s=Ext.decode(response.responseText);if(s.success){
                                var tabID=main.id+"-"+node.id;var tab=main.getComponent(tabID);if(tab){
                                    tab.body.getUpdater().update({
                                        scripts:true,
                                        method:"post",
                                        params:{
                                            "contact.id":node.id.substring(node.id.lastIndexOf("-")+1)
                                        },
                                        url:"customer/getContactByID.action"
                                    });main.setActiveTab(tab)
                                }
                            }
                        }
                    })
                }
            };var insertContactRecordView=function(id,title){
                var tabID=Ext.id();var temp=new Ext.Panel({
                    id:tabID,
                    iconCls:"icon-comment-add",
                    autoScroll:true,
                    title:"["+title+"]联系记录",
                    closable:true
                });temp.on("render",function(){
                    temp.load({
                        scripts:true,
                        method:"post",
                        params:{
                            "contact.id":(id)?id:1,
                            "contact.contactName":title,
                            containerID:temp.body.id
                        },
                        url:"customer/insertContactRecordView.action"
                    })
                });var p=main.add(temp);main.setActiveTab(p)
            };var updateContactRecordView=function(id,contactID,title){
                var tabID=main.id+"-contactrecord-"+id;var tab=main.getComponent(tabID);if(tab){
                    tab.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            "record.recordID":id,
                            "record.contactID":contactID,
                            containerID:tab.body.id
                        },
                        url:"customer/updateContactRecordView.action"
                    });tab.setIconClass("icon-comment-edit");main.setActiveTab(tab)
                }else{
                    var temp=new Ext.Panel({
                        id:tabID,
                        autoScroll:true,
                        iconCls:"icon-comment-edit",
                        title:"["+title+"]联系记录",
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                "record.recordID":id,
                                "record.contactID":contactID,
                                containerID:temp.body.id
                            },
                            url:"customer/updateContactRecordView.action"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }
            };var removeContactRecordView=function(id){
                var record=recordgridsm.getSelected();if(record){
                    Ext.MessageBox.confirm("删除记录","您确定要删除本条联系记录?",function(btn){
                        if(btn=="yes"){
                            Ext.Ajax.request({
                                url:"customer/removeContactRecord.action",
                                params:{
                                    "record.recordID":id
                                },
                                method:"post",
                                success:function(response){
                                    var j=Ext.decode(response.responseText);if(j.success===true){
                                        var tabID=main.id+"-contactrecord-"+id;var tab=main.getComponent(tabID);main.remove(tab);recordstore.reload()
                                    }
                                }
                            })
                        }
                    })
                }
            };var contactStateView=function(){
                var tabID=main.id+"-contactState";var temp=main.getComponent(tabID);if(!temp){
                    var temp=new Ext.Panel({
                        id:tabID,
                        iconCls:"icon-chart-pie",
                        autoScroll:true,
                        title:" 联系人份额统计",
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:temp.body.id
                            },
                            url:"order/contactStatePanel.jsp"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }else{
                    temp.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:temp.body.id
                        },
                        url:"order/contactStatePanel.jsp"
                    });main.setActiveTab(temp)
                }
            };var groupStateView=function(){
                var tabID=main.id+"-groupState";var temp=main.getComponent(tabID);if(!temp){
                    var temp=new Ext.Panel({
                        id:tabID,
                        iconCls:"icon-chart-bar",
                        autoScroll:true,
                        title:" 客户(分组)份额统计",
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:temp.body.id
                            },
                            url:"order/groupStatePanel.jsp"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }else{
                    temp.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:temp.body.id
                        },
                        url:"order/groupStatePanel.jsp"
                    });main.setActiveTab(temp)
                }
            };win=desktop.createWindow({
                id:this.moduleId,
                title:"我的客户",
                width:winWidth,
                height:winHeight,
                x:desktop.getWinX(winWidth),
                y:desktop.getWinY(winHeight),
                iconCls:"icon-contact",
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                minimizable:true,
                maximizable:true,
                border:false,
                layout:"border",
                items:[groupTree,main],
                tbar:["-",{
                        text:"新建",
                        menu:new Ext.menu.Menu({
                            items:[{
                                    text:"新建目录",
                                    iconCls:"icon-group",
                                    handler:insertGroupView
                                },{
                                    text:"新建客户",
                                    iconCls:"icon-customer",
                                    handler:insertCustomerView
                                },{
                                    text:"新建联系人",
                                    iconCls:"icon-contact",
                                    handler:insertContactView
                                }]
                        })
                    },"-",{
                        text:"统计报表",
                        menu:new Ext.menu.Menu({
                            items:[{
                                    text:"联系人统计",
                                    iconCls:"icon-chart-pie",
                                    handler:contactStateView
                                },{
                                    text:"客户统计",
                                    iconCls:"icon-chart-bar",
                                    handler:groupStateView
                                }]
                        })
                    },"-","图例","-",{
                        iconCls:"icon-shield-0",
                        tooltip:"潜在客户"
                    },{
                        iconCls:"icon-shield-1",
                        tooltip:"有意向客户"
                    },{
                        iconCls:"icon-shield-2",
                        tooltip:"成交客户"
                    },{
                        iconCls:"icon-shield-3",
                        tooltip:"失败客户"
                    },{
                        iconCls:"icon-shield-4",
                        tooltip:"无状态客户"
                    }],
                taskbuttonTooltip:"<b>我的客户</b><br/>我的客户资料，联系记录"
            })
        }win.show()
    }
});

