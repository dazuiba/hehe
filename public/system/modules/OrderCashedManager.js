//~~~
Sliver.OrderCashedManager=Ext.extend(Ext.app.Module,{
    moduleType:"order",
    moduleId:"order-cashed-manager",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"icon-cashed",
            scope:this,
            shortcutIconCls:"order-cahed-shortcut",
            text:"订单回款",
            tooltip:"<b>订单回款</b><br />回款管理、回款记录"
        }
    },
    createWindow:function(){
        var desktop=this.app.getDesktop();var win=desktop.getWindow(this.moduleId);if(!win){
            var winWidth=desktop.getWinWidth()/1.1;var winHeight=desktop.getWinHeight()/1.1;var ostore=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"order/listAllOrder.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"orderList",
                    totalProperty:"total",
                    id:"orderID",
                    fields:["orderID","contactID","contactName","contactBusinessphone","contactFax","contactMobilephone","contactCustomer","auditID","auditName","ownerID","ownerName","orderLevel","orderState","orderTotal","orderCashed","orderPaymode","orderDescription","createDate","expiryDate"]
                }),
                remoteSort:true
            });var oexpander=new Ext.grid.RowExpander({
                tpl:new Ext.Template("<p><b>付款方式:</b>{orderPaymode}</p>","<p><b>备注:</b> {orderDescription}</p>")
            });var ocm=new Ext.grid.ColumnModel([oexpander,{
                    header:"订单号",
                    dataIndex:"orderID",
                    width:30
                },{
                    header:"联系人",
                    dataIndex:"contactName",
                    width:40
                },{
                    header:"客户",
                    dataIndex:"contactCustomer",
                    width:80
                },{
                    header:"联系人电话",
                    dataIndex:"contactBusinessphone",
                    width:80
                },{
                    header:"传真",
                    hidden:true,
                    dataIndex:"contactFax",
                    width:40
                },{
                    header:"移动电话",
                    hidden:true,
                    dataIndex:"contactMobilephone",
                    width:40
                },{
                    header:"状态",
                    hidden:true,
                    align:"right",
                    dataIndex:"orderState",
                    width:30
                },{
                    header:"订单等级",
                    hidden:true,
                    align:"right",
                    dataIndex:"orderLevel",
                    width:40
                },{
                    align:"right",
                    header:"经办人",
                    dataIndex:"ownerName",
                    width:30
                },{
                    header:"合计金额",
                    align:"right",
                    dataIndex:"orderTotal",
                    renderer:SliverUtil.cnMoney,
                    width:60
                },{
                    header:"回款金额",
                    align:"right",
                    dataIndex:"orderCashed",
                    renderer:SliverUtil.cnMoney,
                    width:60
                },{
                    header:"创建日期",
                    align:"right",
                    dataIndex:"createDate",
                    width:40
                },{
                    header:"交付日期",
                    align:"right",
                    dataIndex:"expiryDate",
                    width:40
                }]);ocm.defaultSortable=true;var orderAuditFilterParams={
                "order.contactName":"",
                "order.contactCustomer":"",
                "order.contactBusinessphone":"",
                "order.contactFax":"",
                "order.contactMobilephone":"",
                "order.contactAddress":"",
                "order.contactZipcode":"",
                "order.ownerName":"",
                "order.orderState":"",
                "order.orderPaymode":"",
                "order.orderLeval":"",
                "order.orderDescription":"",
                "order.createDate":"",
                "order.expiryDate":""
            };var orderCashedGridFilterMenu=new Ext.menu.Menu({
                items:[{
                        text:"联系人",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.contactName")
                        }
                    },{
                        text:"客户",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.contactCustomer")
                        }
                    },{
                        text:"联系人电话",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.contactBusinessphone")
                        }
                    },{
                        text:"联系人传真",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.contactFax")
                        }
                    },{
                        text:"联系人手机",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.contactMobilephone")
                        }
                    },{
                        text:"发货地址",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.contactAddress")
                        }
                    },{
                        text:"发货地址邮编",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"offer.contactZipcode")
                        }
                    },{
                        text:"订单等级",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.orderLevel")
                        }
                    },{
                        text:"经办人",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.ownerName")
                        }
                    },{
                        text:"付款方式",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.orderPaymode")
                        }
                    },{
                        text:"创建日期",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.createDate")
                        }
                    },{
                        text:"过期日期",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.expiryDate")
                        }
                    },{
                        text:"备注",
                        checked:true,
                        checkHandler:function(){
                            operateAuditOrderParams(this.checked,"order.orderDescription")
                        }
                    }]
            });function operateAuditOrderParams(status,name){
                if(status===true){
                    orderAuditFilterParams[name]=""
                }else{
                    orderAuditFilterParams[name]=null
                }
            }var ofilterField=new Ext.form.TextField({});var ofilterButton=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==orderAuditFilterParams["order.contactName"]){
                        orderAuditFilterParams["order.contactName"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.contactCustomer"]){
                        orderAuditFilterParams["order.contactCustomer"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.contactBusinessphone"]){
                        orderAuditFilterParams["order.contactBusinessphone"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.contactFax"]){
                        orderAuditFilterParams["order.contactFax"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.contactMobilephone"]){
                        orderAuditFilterParams["order.contactMobilephone"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.contactAddress"]){
                        orderAuditFilterParams["order.contactAddress"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.contactZipcode"]){
                        orderAuditFilterParams["order.contactZipcode"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.ownerName"]){
                        orderAuditFilterParams["order.ownerName"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.orderState"]){
                        orderAuditFilterParams["order.orderState"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.orderPaymode"]){
                        orderAuditFilterParams["order.orderPaymode"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.orderLeval"]){
                        orderAuditFilterParams["order.orderLeval"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.createDate"]){
                        orderAuditFilterParams["order.createDate"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.expiryDate"]){
                        orderAuditFilterParams["order.expiryDate"]=ofilterField.getValue()
                    }if(null!==orderAuditFilterParams["order.orderDescription"]){
                        orderAuditFilterParams["order.orderDescription"]=ofilterField.getValue()
                    }ostore.baseParams=orderAuditFilterParams;ostore.setDefaultSort("orderID","DESC");ostore.load({
                        params:{
                            start:0,
                            limit:pageSizePlugin.getPageSize()
                        }
                    })
                }
            });var oclearButton=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    ofilterField.reset();ostore.baseParams={};ostore.setDefaultSort("orderID","DESC");ostore.load({
                        params:{
                            start:0,
                            limit:pageSizePlugin.getPageSize()
                        }
                    })
                }
            });ostore.setDefaultSort("orderID","desc");var ogridsm=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });var pageSizePlugin=new Ext.ux.Andrie.pPageSize();var ogrid=new Ext.grid.GridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:ostore,
                cm:ocm,
                sm:ogridsm,
                plugins:oexpander,
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:pageSizePlugin,
                    pageSize:20,
                    store:ostore,
                    displayInfo:true,
                    items:["-",{
                            text:"搜索范围",
                            menu:orderCashedGridFilterMenu
                        },ofilterField,ofilterButton,oclearButton]
                })
            });ogrid.on("render",function(){
                ostore.load({
                    params:{
                        start:0,
                        limit:pageSizePlugin.getPageSize()
                    }
                })
            });var getOrderByAuditView=function(record){
                var record=ogridsm.getSelected();if(record){
                    var tabID="auditorder-"+record.data.orderID;var temp=main.getComponent(tabID);if(!temp){
                        var temp=new Ext.Panel({
                            id:tabID,
                            iconCls:"icon-order",
                            autoScroll:true,
                            title:"订单"+record.data.orderID,
                            closable:true
                        });temp.on("render",function(){
                            temp.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "order.orderID":record.data.orderID,
                                    containerID:temp.body.id
                                },
                                url:"order/getOrderByAuditView.action"
                            })
                        });var p=main.add(temp);main.setActiveTab(p)
                    }else{
                        temp.setTitle("订单"+record.data.orderID);temp.setIconClass("icon-order");temp.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "order.orderID":record.data.orderID,
                                containerID:temp.body.id
                            },
                            url:"order/getOrderByAuditView.action"
                        });main.setActiveTab(temp)
                    }
                }
            };ogrid.on("rowdblclick",getOrderByAuditView);var orderCashedContextMenu;ogrid.on("rowcontextmenu",function(ogrid,rowindex,e){
                ogrid.getSelectionModel().selectRow(rowindex,false);if(!orderCashedContextMenu){
                    orderCashedContextMenu=new Ext.menu.Menu([{
                            id:"addOrderCashedContextMenuItem",
                            text:"添加订单回款",
                            handler:insertCashedOrderView
                        },{
                            id:"listOrderCashContextMenuItem",
                            text:"查看订单回款",
                            handler:listCashedByOrderID
                        }])
                }orderCashedContextMenu.showAt(e.getPoint());e.stopEvent()
            });var insertCashedOrderView=function(){
                var record=ogridsm.getSelected();if(record){
                    Ext.Ajax.request({
                        url:"cashed/insertCashedView.action",
                        method:"post",
                        params:{
                            "order.orderID":record.data.orderID
                        },
                        success:function(response){
                            eval(response.responseText)
                        }
                    })
                }
            };var listCashedByOrderID=function(){
                Ext.Ajax.request({
                    url:"cashed/listCashedView.jsp",
                    method:"post",
                    success:function(response){
                        eval(response.responseText)
                    }
                })
            };var cashed_store=new Ext.data.GroupingStore({
                reader:new Ext.data.JsonReader({
                    root:"cashedList",
                    totalProperty:"total",
                    id:"orderCashedID",
                    fields:["orderID","orderCashedID","orderCashedAmount","orderCashedDate","orderCashedDescription"]
                }),
                url:"cashed/listAllCashed.action",
                sortInfo:{
                    field:"orderID",
                    direction:"DESC"
                },
                groupField:"orderID",
                remoteSort:true
            });cashed_store.load({
                params:{
                    start:0,
                    limit:25,
                    sort:"orderID",
                    dir:"DESC"
                }
            });var cashed_columns=new Ext.grid.ColumnModel([{
                    header:"订单号",
                    dataIndex:"orderID",
                    width:40
                },{
                    header:"回款序号",
                    dataIndex:"orderCashedID",
                    width:40
                },{
                    header:"回款日期",
                    align:"right",
                    dataIndex:"orderCashedDate",
                    width:60
                },{
                    header:"回款金额",
                    align:"right",
                    renderer:SliverUtil.cnMoney,
                    dataIndex:"orderCashedAmount",
                    width:60
                },{
                    header:"备注",
                    dataIndex:"orderCashedDescription",
                    width:200
                }]);cashed_columns.defaultSortable=true;var cashed_sm=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });var filterOrderID=function(){
                cashed_store.setDefaultSort("orderID","DESC");cashed_store.baseParams={
                    "orderCashed.orderID":orderIDField.getValue()
                };cashed_store.load({
                    params:{
                        start:0,
                        limit:cashedPageSizePlugin.getPageSize()
                    }
                })
            };var orderIDField=new Ext.form.NumberField();var orderIDButton=new Ext.Button({
                iconCls:"icon-search",
                handler:filterOrderID
            });var orderIDCleaner=new Ext.Button({
                iconCls:"icon-clear",
                handler:function(){
                    orderIDField.reset();cashed_store.baseParams={};cashed_store.load({
                        params:{
                            start:0,
                            limit:cashedPageSizePlugin.getPageSize()
                        }
                    })
                }
            });var filterOrderCashedID=function(){
                cashed_store.setDefaultSort("orderID","DESC");cashed_store.baseParams={
                    "orderCashed.orderCashedID":orderCashedIDField.getValue()
                };cashed_store.load({
                    params:{
                        start:0,
                        limit:cashedPageSizePlugin.getPageSize()
                    }
                })
            };var orderCashedIDField=new Ext.form.NumberField();var orderCashedIDButton=new Ext.Button({
                iconCls:"icon-search",
                handler:filterOrderCashedID
            });var orderCashedIDCleaner=new Ext.Button({
                iconCls:"icon-clear",
                handler:function(){
                    orderCashedIDField.reset();cashed_store.baseParams={};cashed_store.load({
                        params:{
                            start:0,
                            limit:cashedPageSizePlugin.getPageSize()
                        }
                    })
                }
            });var cashedPageSizePlugin=new Ext.ux.Andrie.pPageSize();var cashed_grid=new Ext.grid.GridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:cashed_store,
                cm:cashed_columns,
                sm:cashed_sm,
                view:new Ext.grid.GroupingView({
                    forceFit:true,
                    groupTextTpl:"{text} (回款数量：{[values.rs.length]})"
                }),
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:cashedPageSizePlugin,
                    pageSize:20,
                    store:cashed_store,
                    displayInfo:true,
                    items:["-","订单编号：",orderIDField,orderIDButton,orderIDCleaner,"-","回款编号：",orderCashedIDField,orderCashedIDButton,orderCashedIDCleaner]
                })
            });cashed_grid.on("render",function(){
                cashed_store.load({
                    params:{
                        start:0,
                        limit:cashedPageSizePlugin.getPageSize()
                    }
                })
            });var cashedContextMenu;cashed_grid.on("rowcontextmenu",function(ogrid,rowindex,e){
                cashed_grid.getSelectionModel().selectRow(rowindex,false);if(!cashedContextMenu){
                    cashedContextMenu=new Ext.menu.Menu([{
                            id:"addCashedContextMenuItem",
                            text:"添加回款记录",
                            handler:insertCashedView
                        },{
                            id:"updateCashedContextMenuItem",
                            text:"更新回款记录",
                            handler:updateCashedView
                        },{
                            id:"removeCashedContextMenuItem",
                            text:"删除回款记录",
                            handler:removeCashedView
                        }])
                }cashedContextMenu.showAt(e.getPoint());e.stopEvent()
            });var insertCashedView=function(){
                var record=cashed_sm.getSelected();if(record){
                    Ext.Ajax.request({
                        url:"cashed/insertCashedView.action",
                        method:"post",
                        params:{
                            "order.orderID":record.data.orderID
                        },
                        success:function(response){
                            eval(response.responseText)
                        }
                    })
                }
            };var updateCashedView=function(){
                var record=cashed_sm.getSelected();if(record){
                    Ext.Ajax.request({
                        url:"cashed/updateCashedView.action",
                        method:"post",
                        params:{
                            "orderCashed.orderCashedID":record.data.orderCashedID,
                            "order.orderID":record.data.orderID
                        },
                        success:function(response){
                            eval(response.responseText)
                        }
                    })
                }
            };var removeCashedView=function(){
                var record=cashed_sm.getSelected();if(record){
                    Ext.MessageBox.confirm("删除回款记录","您确定要删除回款记录?",function(btn){
                        if(btn=="yes"){
                            Ext.Ajax.request({
                                url:"cashed/removeCashed.action",
                                method:"post",
                                params:{
                                    "orderCashed.orderCashedID":record.data.orderCashedID,
                                    "order.orderID":record.data.orderID
                                },
                                success:function(response){
                                    var j=Ext.decode(response.responseText);if(true===j.success){
                                        cashed_store.remove(record)
                                    }
                                }
                            })
                        }
                    })
                }
            };var centerID=Ext.id();var center=new Ext.Panel({
                id:centerID,
                border:true,
                region:"center",
                autoScroll:true
            });center.on("render",function(){
                center.load({
                    scripts:true,
                    method:"post",
                    params:{
                        containerID:centerID,
                        width:600,
                        height:300,
                        "order.createDate":Ext.util.Format.date(new Date(Date.parse("01/01/"+new Date().getFullYear())),"Y-m-d"),
                        "order.expiryDate":Ext.util.Format.date(new Date(Date.parse("12/31/"+new Date().getFullYear())),"Y-m-d")
                    },
                    url:"order/allSaleStateInformation.jsp"
                })
            });var west=new Ext.grid.PropertyGrid({
                border:true,
                region:"west",
                split:true,
                collapseMode:"mini",
                autoScroll:true,
                collapsible:true,
                width:225,
                minSize:175,
                maxSize:400,
                layout:"fit",
                source:{
                    "起始日期":new Date(Date.parse("01/01/"+new Date().getFullYear())),
                    "终止日期":new Date(Date.parse("12/31/"+new Date().getFullYear())),
                    "报表高度":300,
                    "报表宽度":600
                },
                bbar:["-",{
                        tooltip:"刷新报表",
                        iconCls:"icon-reload",
                        handler:function(){
                            var ps=west.getStore();center.body.getUpdater().update({
                                scripts:true,
                                method:"post",
                                params:{
                                    containerID:centerID,
                                    width:ps.getById("报表宽度").data.value,
                                    height:ps.getById("报表高度").data.value,
                                    "order.createDate":Ext.util.Format.date(ps.getById("起始日期").data.value,"Y-m-d"),
                                    "order.expiryDate":Ext.util.Format.date(ps.getById("终止日期").data.value,"Y-m-d")
                                },
                                url:"order/allSaleStateInformation.jsp"
                            })
                        }
                    },"-",{
                        tooltip:"导出到PDF",
                        iconCls:"icon-pdf",
                        handler:function(){
                            window.open("order/allSaleStateReport.action?order.createDate="+Ext.util.Format.date(west.getStore().getById("起始日期").data.value,"Y-m-d")+"&order.expiryDate="+Ext.util.Format.date(west.getStore().getById("终止日期").data.value,"Y-m-d"))
                        }
                    }]
            });var content=new Ext.Panel({
                title:"回款统计",
                iconCls:"icon-chart-line",
                border:false,
                buttonAlign:"right",
                viewConfig:{
                    forceFit:true
                },
                layout:"border",
                items:[center,west]
            });var main=new Ext.TabPanel({
                id:"order-cashed-manager-body",
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
                items:[content,{
                        id:"order-cashed-grid",
                        closable:false,
                        title:"订单列表",
                        autoScroll:true,
                        layout:"fit",
                        items:ogrid,
                        iconCls:"icon-order"
                    },{
                        id:"order-cashedlist-grid",
                        closable:false,
                        title:"回款记录",
                        autoScroll:true,
                        layout:"fit",
                        items:cashed_grid,
                        iconCls:"icon-cashed"
                    }]
            });win=desktop.createWindow({
                id:this.moduleId,
                title:"订单回款",
                width:winWidth,
                height:winHeight,
                x:desktop.getWinX(winWidth),
                y:desktop.getWinY(winHeight),
                iconCls:"icon-cashed",
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                minimizable:true,
                maximizable:true,
                border:false,
                layout:"border",
                items:main,
                taskbuttonTooltip:"<b>订单回款</b><br />回款管理、回款记录"
            })
        }win.show()
    }
});

Sliver.OrderManager=Ext.extend(Ext.app.Module,{
    moduleType:"order",
    moduleId:"order-manager",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"icon-order",
            scope:this,
            shortcutIconCls:"order-manager-shortcut",
            text:"我的订单",
            tooltip:"<b>我的报价单、订单</b><br />我的订单"
        }
    },
    createWindow:function(){
        var v=this.app.getDesktop();var o=v.getWindow(this.moduleId);if(!o){
            var J=v.getWinWidth()/1.1;var l=v.getWinHeight()/1.1;var G=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"order/listOffer.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"offerList",
                    totalProperty:"total",
                    id:"offerID",
                    fields:["offerID","contactID","contactName","contactBusinessphone","contactFax","contactMobilephone","contactCustomer","auditID","auditName","ownerID","ownerName","offerState","offerTotal","offerPaymode","offerDescription","createDate","expiryDate"]
                }),
                remoteSort:true
            });G.setDefaultSort("offerID","desc");var r=new Ext.grid.RowExpander({
                tpl:new Ext.Template("<p><b>付款方式:</b>{offerPaymode}</p>","<p><b>备注:</b> {offerDescription}</p>")
            });var d=new Ext.grid.ColumnModel([r,{
                    header:"报价单号",
                    dataIndex:"offerID",
                    width:30
                },{
                    header:"联系人",
                    dataIndex:"contactName",
                    width:50
                },{
                    header:"客户",
                    dataIndex:"contactCustomer",
                    width:80
                },{
                    header:"联系人电话",
                    dataIndex:"contactBusinessphone",
                    width:80
                },{
                    header:"传真",
                    hidden:true,
                    dataIndex:"contactFax",
                    width:40
                },{
                    header:"移动电话",
                    hidden:true,
                    dataIndex:"contactMobilephone",
                    width:40
                },{
                    header:"状态",
                    align:"right",
                    renderer:SliverUtil.renderOfferState,
                    dataIndex:"offerState",
                    width:30
                },{
                    align:"right",
                    header:"审核人",
                    dataIndex:"auditName",
                    width:30
                },{
                    header:"合计金额",
                    align:"right",
                    dataIndex:"offerTotal",
                    renderer:SliverUtil.cnMoney,
                    width:60
                },{
                    header:"创建日期",
                    align:"right",
                    dataIndex:"createDate",
                    width:40
                },{
                    header:"有效日期",
                    align:"right",
                    dataIndex:"expiryDate",
                    width:40
                }]);d.defaultSortable=true;var g={
                "offer.contactName":"",
                "offer.contactCustomer":"",
                "offer.contactBusinessphone":"",
                "offer.contactFax":"",
                "offer.contactMobilephone":"",
                "offer.auditName":"",
                "offer.offerState":"",
                "offer.offerPaymode":"",
                "offer.offerDescription":"",
                "offer.createDate":"",
                "offer.expiryDate":""
            };var e=new Ext.menu.Menu({
                items:[{
                        text:"联系人",
                        checked:true,
                        checkHandler:function(){
                            D(this.checked,"offer.contactName")
                        }
                    },{
                        text:"客户",
                        checked:true,
                        checkHandler:function(){
                            D(this.checked,"offer.contactCustomer")
                        }
                    },{
                        text:"联系人电话",
                        checked:true,
                        checkHandler:function(){
                            D(this.checked,"offer.contactBusinessphone")
                        }
                    },{
                        text:"联系人传真",
                        checked:true,
                        checkHandler:function(){
                            D(this.checked,"offer.contactFax")
                        }
                    },{
                        text:"联系人手机",
                        checked:true,
                        checkHandler:function(){
                            D(this.checked,"offer.contactMobilephone")
                        }
                    },{
                        text:"审核帐户",
                        checked:true,
                        checkHandler:function(){
                            D(this.checked,"offer.auditName")
                        }
                    },{
                        text:"付款方式",
                        checked:true,
                        checkHandler:function(){
                            D(this.checked,"offer.offerPaymode")
                        }
                    },{
                        text:"创建日期",
                        checked:true,
                        checkHandler:function(){
                            D(this.checked,"offer.createDate")
                        }
                    },{
                        text:"过期日期",
                        checked:true,
                        checkHandler:function(){
                            D(this.checked,"offer.expiryDate")
                        }
                    },{
                        text:"备注",
                        checked:true,
                        checkHandler:function(){
                            D(this.checked,"offer.offerDescription")
                        }
                    }]
            });function D(x,y){
                if(x===true){
                    g[y]=""
                }else{
                    g[y]=null
                }
            }var a=new Ext.form.TextField({});var j=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==g["offer.contactName"]){
                        g["offer.contactName"]=a.getValue()
                    }if(null!==g["offer.contactCustomer"]){
                        g["offer.contactCustomer"]=a.getValue()
                    }if(null!==g["offer.contactBusinessphone"]){
                        g["offer.contactBusinessphone"]=a.getValue()
                    }if(null!==g["offer.contactFax"]){
                        g["offer.contactFax"]=a.getValue()
                    }if(null!==g["offer.contactMobilephone"]){
                        g["offer.contactMobilephone"]=a.getValue()
                    }if(null!==g["offer.auditName"]){
                        g["offer.auditName"]=a.getValue()
                    }if(null!==g["offer.offerPaymode"]){
                        g["offer.offerPaymode"]=a.getValue()
                    }if(null!==g["offer.createDate"]){
                        g["offer.createDate"]=a.getValue()
                    }if(null!==g["offer.expiryDate"]){
                        g["offer.expiryDate"]=a.getValue()
                    }if(null!==g["offer.offerDescription"]){
                        g["offer.offerDescription"]=a.getValue()
                    }G.baseParams=g;G.setDefaultSort("offerID","DESC");G.load({
                        params:{
                            start:0,
                            limit:Z.getPageSize()
                        }
                    })
                }
            });var Y=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    a.reset();G.baseParams={};G.setDefaultSort("offerID","DESC");G.load({
                        params:{
                            start:0,
                            limit:Z.getPageSize()
                        }
                    })
                }
            });var p=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });var Z=new Ext.ux.Andrie.pPageSize();var n=new Ext.grid.GridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:G,
                cm:d,
                sm:p,
                plugins:r,
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:Z,
                    pageSize:20,
                    store:G,
                    displayInfo:true,
                    displayMsg:"显示 {0} - {1} 共{2}",
                    emptyMsg:"",
                    items:["-",{
                            text:"搜索范围",
                            menu:e
                        },a,j,Y,"-",{
                            tooltip:"将选中订单导出为PDF格式",
                            iconCls:"icon-pdf",
                            handler:function(){
                                var x=p.getSelected();if(x){
                                    window.open("order/exportOfferPDF.action?offer.offerID="+x.data.offerID)
                                }
                            }
                        },{
                            tooltip:"将选中订单导出为xls格式",
                            iconCls:"icon-xls",
                            handler:function(){
                                var x=p.getSelected();if(x){
                                    window.open("order/exportOfferPDF.action?offer.offerID="+x.data.offerID+"&type=xls")
                                }
                            }
                        }]
                })
            });n.on("render",function(){
                G.load({
                    params:{
                        start:0,
                        limit:Z.getPageSize()
                    }
                })
            });var L=function(){
                var y=Ext.id();var x=new Ext.Panel({
                    id:y,
                    iconCls:"icon-offer-add",
                    autoScroll:true,
                    title:"创建报价单",
                    closable:true
                });x.on("render",function(){
                    x.load({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:x.body.id
                        },
                        url:"order/insertOfferView.action"
                    })
                });var z=H.add(x);H.setActiveTab(z)
            };var X=function(x){
                var x=p.getSelected();if(x){
                    var z="offer-"+x.data.offerID;var y=H.getComponent(z);if(!y){
                        var y=new Ext.Panel({
                            id:z,
                            iconCls:"icon-offer",
                            autoScroll:true,
                            title:"报价单"+x.data.offerID,
                            closable:true
                        });y.on("render",function(){
                            y.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "offer.offerID":x.data.offerID,
                                    containerID:y.body.id
                                },
                                url:"order/getOfferView.action"
                            })
                        });var AA=H.add(y);H.setActiveTab(AA)
                    }else{
                        y.setTitle("报价单"+x.data.offerID);y.setIconClass("icon-offer");y.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "offer.offerID":x.data.offerID,
                                containerID:y.body.id
                            },
                            url:"order/getOfferView.action"
                        });H.setActiveTab(y)
                    }
                }
            };var h=function(x){
                var x=p.getSelected();if(x){
                    var z="offerorder-"+x.data.offerID;var y=H.getComponent(z);if(!y){
                        var y=new Ext.Panel({
                            id:z,
                            iconCls:"icon-order-add",
                            autoScroll:true,
                            title:x.data.offerID+"转为订单",
                            closable:true
                        });y.on("render",function(){
                            y.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "offer.offerID":x.data.offerID,
                                    containerID:y.body.id
                                },
                                url:"order/copyToOrderView.action"
                            })
                        });var AA=H.add(y);H.setActiveTab(AA)
                    }else{
                        title:x.data.offerID+"转为订单",y.setIconClass("icon-order-add");y.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "offer.offerID":x.data.offerID,
                                containerID:y.body.id
                            },
                            url:"order/copyToOrderView.action"
                        });H.setActiveTab(y)
                    }
                }
            };var w=function(){
                var x=p.getSelected();if(x){
                    if(SliverData.offerState[3][1]===x.data.offerState){
                        Ext.MessageBox.alert("警告","报价单["+x.data.offerID+"]已经锁定");return
                    }var z="offer-"+x.data.offerID;var y=H.getComponent(z);if(!y){
                        var y=new Ext.Panel({
                            id:z,
                            iconCls:"icon-offer-edit",
                            autoScroll:true,
                            title:"报价单"+x.data.offerID,
                            closable:true
                        });y.on("render",function(){
                            y.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "offer.offerID":x.data.offerID,
                                    containerID:y.body.id
                                },
                                url:"order/updateOfferView.action"
                            })
                        });var AA=H.add(y);H.setActiveTab(AA)
                    }else{
                        y.setTitle("报价单"+x.data.offerID);y.setIconClass("icon-offer-edit");y.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "offer.offerID":x.data.offerID,
                                containerID:y.body.id
                            },
                            url:"order/updateOfferView.action"
                        });H.setActiveTab(y)
                    }
                }
            };var f=function(){
                var x=p.getSelected();if(x){
                    if(SliverData.offerState[3][1]===x.data.offerState){
                        Ext.MessageBox.alert("警告","报价单["+x.data.offerID+"]已经锁定");return
                    }Ext.MessageBox.confirm("删除报价单","您确定要删除选中报价单?",function(y){
                        if(y=="yes"){
                            Ext.Ajax.request({
                                url:"order/removeOffer.action",
                                params:{
                                    "offer.offerID":x.data.offerID,
                                    "offer.offerState":x.data.offerState
                                },
                                method:"post",
                                success:function(AA){
                                    var AB=Ext.decode(AA.responseText);if(AB.success===true){
                                        var z="offer-"+x.data.offerID;var AC=H.getComponent(z);H.remove(AC);G.remove(x)
                                    }
                                }
                            })
                        }
                    })
                }
            };n.on("rowdblclick",X);var K;n.on("rowcontextmenu",function(y,x,z){
                y.getSelectionModel().selectRow(x,false);if(!K){
                    K=new Ext.menu.Menu([{
                            id:"addOfferContextMenu",
                            text:"添加报价单",
                            handler:L
                        },{
                            id:"copyOfferToOrderContextMenu",
                            text:"转为为订单",
                            handler:h
                        },{
                            id:"updateOfferContextMenu",
                            text:"更新报价单",
                            handler:w
                        },"-",{
                            id:"removeOfferContextMenu",
                            text:"删除报价单",
                            handler:f
                        }])
                }K.showAt(z.getPoint());z.stopEvent()
            });var R=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"order/listOrder.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"orderList",
                    totalProperty:"total",
                    id:"orderID",
                    fields:["orderID","contactID","contactName","contactBusinessphone","contactFax","contactMobilephone","contactCustomer","auditID","auditName","ownerID","ownerName","orderLevel","orderState","orderTotal","orderPaymode","orderDescription","createDate","expiryDate"]
                }),
                remoteSort:true
            });R.setDefaultSort("orderID","desc");var M=new Ext.grid.RowExpander({
                tpl:new Ext.Template("<p><b>付款方式:</b>{orderPaymode}</p>","<p><b>备注:</b> {orderDescription}</p>")
            });var k=new Ext.grid.ColumnModel([M,{
                    header:"订单号",
                    dataIndex:"orderID",
                    width:30
                },{
                    header:"联系人",
                    dataIndex:"contactName",
                    width:50
                },{
                    header:"客户",
                    dataIndex:"contactCustomer",
                    width:80
                },{
                    header:"联系人电话",
                    dataIndex:"contactBusinessphone",
                    width:80
                },{
                    header:"传真",
                    hidden:true,
                    dataIndex:"contactFax",
                    width:40
                },{
                    header:"移动电话",
                    hidden:true,
                    dataIndex:"contactMobilephone",
                    width:40
                },{
                    header:"状态",
                    align:"right",
                    renderer:SliverUtil.renderOrderState,
                    dataIndex:"orderState",
                    width:30
                },{
                    header:"订单等级",
                    align:"right",
                    dataIndex:"orderLevel",
                    width:40
                },{
                    align:"right",
                    header:"审核人",
                    dataIndex:"auditName",
                    width:30
                },{
                    header:"合计金额",
                    align:"right",
                    dataIndex:"orderTotal",
                    renderer:SliverUtil.cnMoney,
                    width:60
                },{
                    header:"创建日期",
                    align:"right",
                    dataIndex:"createDate",
                    width:40
                },{
                    header:'<font style="color:red;font-weight:bold;">交付日期</font>',
                    align:"right",
                    dataIndex:"expiryDate",
                    width:40
                }]);k.defaultSortable=true;var s={
                "order.contactName":"",
                "order.contactCustomer":"",
                "order.contactBusinessphone":"",
                "order.contactFax":"",
                "order.contactMobilephone":"",
                "order.contactAddress":"",
                "order.contactZipcode":"",
                "order.auditName":"",
                "order.orderState":"",
                "order.orderPaymode":"",
                "order.orderLeval":"",
                "order.orderDescription":"",
                "order.createDate":"",
                "order.expiryDate":""
            };var P=new Ext.menu.Menu({
                items:[{
                        text:"联系人",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.contactName")
                        }
                    },{
                        text:"客户",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.contactCustomer")
                        }
                    },{
                        text:"联系人电话",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.contactBusinessphone")
                        }
                    },{
                        text:"联系人传真",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.contactFax")
                        }
                    },{
                        text:"联系人手机",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.contactMobilephone")
                        }
                    },{
                        text:"发货地址",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.contactAddress")
                        }
                    },{
                        text:"发货地址邮编",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"offer.contactZipcode")
                        }
                    },{
                        text:"订单等级",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.orderLevel")
                        }
                    },{
                        text:"审核帐户",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.auditName")
                        }
                    },{
                        text:"付款方式",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.orderPaymode")
                        }
                    },{
                        text:"创建日期",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.createDate")
                        }
                    },{
                        text:"过期日期",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.expiryDate")
                        }
                    },{
                        text:"备注",
                        checked:true,
                        checkHandler:function(){
                            i(this.checked,"order.orderDescription")
                        }
                    }]
            });function i(x,y){
                if(x===true){
                    s[y]=""
                }else{
                    s[y]=null
                }
            }var Q=new Ext.form.TextField({});var b=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==s["order.contactName"]){
                        s["order.contactName"]=Q.getValue()
                    }if(null!==s["order.contactCustomer"]){
                        s["order.contactCustomer"]=Q.getValue()
                    }if(null!==s["order.contactBusinessphone"]){
                        s["order.contactBusinessphone"]=Q.getValue()
                    }if(null!==s["order.contactFax"]){
                        s["order.contactFax"]=Q.getValue()
                    }if(null!==s["order.contactMobilephone"]){
                        s["order.contactMobilephone"]=Q.getValue()
                    }if(null!==s["order.contactAddress"]){
                        s["order.contactAddress"]=Q.getValue()
                    }if(null!==s["order.contactZipcode"]){
                        s["order.contactZipcode"]=Q.getValue()
                    }if(null!==s["order.auditName"]){
                        s["order.auditName"]=Q.getValue()
                    }if(null!==s["order.orderState"]){
                        s["order.orderState"]=Q.getValue()
                    }if(null!==s["order.orderPaymode"]){
                        s["order.orderPaymode"]=Q.getValue()
                    }if(null!==s["order.orderLeval"]){
                        s["order.orderLeval"]=Q.getValue()
                    }if(null!==s["order.createDate"]){
                        s["order.createDate"]=Q.getValue()
                    }if(null!==s["order.expiryDate"]){
                        s["order.expiryDate"]=Q.getValue()
                    }if(null!==s["order.orderDescription"]){
                        s["order.orderDescription"]=Q.getValue()
                    }R.baseParams=s;R.setDefaultSort("orderID","DESC");R.load({
                        params:{
                            start:0,
                            limit:C.getPageSize()
                        }
                    })
                }
            });var O=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    Q.reset();R.baseParams={};R.setDefaultSort("orderID","DESC");R.load({
                        params:{
                            start:0,
                            limit:C.getPageSize()
                        }
                    })
                }
            });var I=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });var C=new Ext.ux.Andrie.pPageSize();var U=new Ext.grid.GridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:R,
                cm:k,
                sm:I,
                plugins:M,
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:C,
                    pageSize:20,
                    store:R,
                    displayInfo:true,
                    displayMsg:"显示 {0} - {1} 共{2}",
                    emptyMsg:"",
                    items:["-",{
                            text:"搜索范围",
                            menu:P
                        },Q,b,O,"-",{
                            tooltip:"将选中订单导出为PDF格式",
                            iconCls:"icon-pdf",
                            handler:function(){
                                var x=I.getSelected();if(x){
                                    window.open("order/exportOrderPDF.action?order.orderID="+x.data.orderID)
                                }
                            }
                        },{
                            tooltip:"将选中订单导出为xls格式",
                            iconCls:"icon-xls",
                            handler:function(){
                                var x=I.getSelected();if(x){
                                    window.open("order/exportOrderPDF.action?order.orderID="+x.data.orderID+"&type=xls")
                                }
                            }
                        }]
                })
            });U.on("render",function(){
                R.load({
                    params:{
                        start:0,
                        limit:C.getPageSize()
                    }
                })
            });var F=function(){
                var y=Ext.id();var x=new Ext.Panel({
                    id:y,
                    iconCls:"icon-order-add",
                    autoScroll:true,
                    title:"添加订单",
                    closable:true
                });x.on("render",function(){
                    x.load({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:x.body.id
                        },
                        url:"order/insertOrderView.action"
                    })
                });var z=H.add(x);H.setActiveTab(z)
            };var S=function(x){
                var x=I.getSelected();if(x){
                    var z="order-"+x.data.orderID;var y=H.getComponent(z);if(!y){
                        var y=new Ext.Panel({
                            id:z,
                            iconCls:"icon-order",
                            autoScroll:true,
                            title:"订单"+x.data.orderID,
                            closable:true
                        });y.on("render",function(){
                            y.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "order.orderID":x.data.orderID,
                                    containerID:y.body.id
                                },
                                url:"order/getOrderView.action"
                            })
                        });var AA=H.add(y);H.setActiveTab(AA)
                    }else{
                        y.setTitle("订单"+x.data.orderID);y.setIconClass("icon-order");y.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "order.orderID":x.data.orderID,
                                containerID:y.body.id
                            },
                            url:"order/getOrderView.action"
                        });H.setActiveTab(y)
                    }
                }
            };var t=function(){
                var x=I.getSelected();if(x){
                    if(SliverData.offerState[3][1]===x.data.orderState){
                        Ext.MessageBox.alert("警告","订单["+x.data.orderID+"]已经锁定");return
                    }var z="order-"+x.data.orderID;var y=H.getComponent(z);if(!y){
                        var y=new Ext.Panel({
                            id:z,
                            iconCls:"icon-order-edit",
                            autoScroll:true,
                            title:"订单"+x.data.orderID,
                            closable:true
                        });y.on("render",function(){
                            y.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "order.orderID":x.data.orderID,
                                    containerID:y.body.id
                                },
                                url:"order/updateOrderView.action"
                            })
                        });var AA=H.add(y);H.setActiveTab(AA)
                    }else{
                        y.setTitle("订单"+x.data.orderID);y.setIconClass("icon-order-edit");y.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "order.orderID":x.data.orderID,
                                containerID:y.body.id
                            },
                            url:"order/updateOrderView.action"
                        });H.setActiveTab(y)
                    }
                }
            };var m=function(){
                var x=I.getSelected();if(x){
                    if(SliverData.offerState[3][1]===x.data.orderState){
                        Ext.MessageBox.alert("警告","订单["+x.data.orderID+"]已经锁定");return
                    }Ext.MessageBox.confirm("删除订单","您确定要删除选中订单?",function(y){
                        if(y=="yes"){
                            Ext.Ajax.request({
                                url:"order/removeOrder.action",
                                params:{
                                    "order.orderID":x.data.orderID,
                                    "order.orderState":x.data.orderState
                                },
                                method:"post",
                                success:function(AA){
                                    var AB=Ext.decode(AA.responseText);if(AB.success===true){
                                        var z="order-"+x.data.orderID;var AC=H.getComponent(z);H.remove(AC);R.remove(x)
                                    }
                                }
                            })
                        }
                    })
                }
            };U.on("rowdblclick",S);var A;U.on("rowcontextmenu",function(z,x,y){
                z.getSelectionModel().selectRow(x,false);if(!A){
                    A=new Ext.menu.Menu([{
                            id:"addOrderContextMenu",
                            text:"添加订单",
                            handler:F
                        },{
                            id:"updateOrderContextMenu",
                            text:"更新订单",
                            handler:t
                        },"-",{
                            id:"removeOrderContextMenu",
                            text:"删除订单",
                            handler:m
                        }])
                }A.showAt(y.getPoint());y.stopEvent()
            });var q=function(){
                var y=H.id+"-saleState";var x=H.getComponent(y);if(!x){
                    var x=new Ext.Panel({
                        id:y,
                        iconCls:"icon-chart-line",
                        autoScroll:true,
                        layout:"fit",
                        title:"销售业绩",
                        closable:true
                    });x.on("render",function(){
                        x.load({
                            scripts:true,
                            params:{
                                containerID:x.body.id,
                                moduleID:"order-manager"
                            },
                            method:"post",
                            url:"order/saleStatePanel.jsp"
                        })
                    });var z=H.add(x);H.setActiveTab(z)
                }else{
                    x.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:x.body.id,
                            moduleID:"order-manager"
                        },
                        url:"order/saleStatePanel.jsp"
                    });H.setActiveTab(x)
                }
            };var T=function(){
                var y=H.id+"-orderState";var x=H.getComponent(y);if(!x){
                    var x=new Ext.Panel({
                        id:y,
                        iconCls:"icon-chart-curve",
                        autoScroll:true,
                        title:" 订单数量",
                        closable:true
                    });x.on("render",function(){
                        x.load({
                            scripts:true,
                            params:{
                                containerID:x.body.id,
                                moduleID:"order-manager"
                            },
                            method:"post",
                            url:"order/orderStatePanel.jsp"
                        })
                    });var z=H.add(x);H.setActiveTab(z)
                }else{
                    x.body.getUpdater().update({
                        scripts:true,
                        params:{
                            containerID:x.body.id,
                            moduleID:"order-manager"
                        },
                        method:"post",
                        url:"order/orderStatePanel.jsp"
                    });H.setActiveTab(x)
                }
            };var u=function(){
                var y=H.id+"-contactState";var x=H.getComponent(y);if(!x){
                    var x=new Ext.Panel({
                        id:y,
                        iconCls:"icon-chart-pie",
                        autoScroll:true,
                        title:" 联系人份额统计",
                        closable:true
                    });x.on("render",function(){
                        x.load({
                            scripts:true,
                            params:{
                                containerID:x.body.id,
                                moduleID:"order-manager"
                            },
                            method:"post",
                            url:"order/contactStatePanel.jsp"
                        })
                    });var z=H.add(x);H.setActiveTab(z)
                }else{
                    x.body.getUpdater().update({
                        scripts:true,
                        params:{
                            containerID:x.body.id,
                            moduleID:"order-manager"
                        },
                        method:"post",
                        url:"order/contactStatePanel.jsp"
                    });H.setActiveTab(x)
                }
            };var E=function(){
                var y=H.id+"-groupState";var x=H.getComponent(y);if(!x){
                    var x=new Ext.Panel({
                        id:y,
                        iconCls:"icon-chart-pie",
                        autoScroll:true,
                        title:" 客户(分组)份额统计",
                        closable:true
                    });x.on("render",function(){
                        x.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:x.body.id,
                                moduleID:"order-manager"
                            },
                            url:"order/groupStatePanel.jsp"
                        })
                    });var z=H.add(x);H.setActiveTab(z)
                }else{
                    x.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:x.body.id,
                            moduleID:"order-manager"
                        },
                        url:"order/groupStatePanel.jsp"
                    });H.setActiveTab(x)
                }
            };var c=function(){
                var y=H.id+"-contactRank";var x=H.getComponent(y);if(!x){
                    var x=new Ext.Panel({
                        id:y,
                        iconCls:"icon-chart-bar",
                        autoScroll:true,
                        title:" 联系人订单排名统计",
                        closable:true
                    });x.on("render",function(){
                        x.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:x.body.id,
                                moduleID:"order-manager"
                            },
                            url:"order/contactRankPanel.jsp"
                        })
                    });var z=H.add(x);H.setActiveTab(z)
                }else{
                    x.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:x.body.id,
                            moduleID:"order-manager"
                        },
                        url:"order/contactRankPanel.jsp"
                    });H.setActiveTab(x)
                }
            };var N=function(){
                var y=H.id+"-groupRank";var x=H.getComponent(y);if(!x){
                    var x=new Ext.Panel({
                        id:y,
                        iconCls:"icon-chart-bar",
                        autoScroll:true,
                        title:" 客户订单排名统计",
                        closable:true
                    });x.on("render",function(){
                        x.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:x.body.id,
                                moduleID:"order-manager"
                            },
                            url:"order/groupRankPanel.jsp"
                        })
                    });var z=H.add(x);H.setActiveTab(z)
                }else{
                    x.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:x.body.id,
                            moduleID:"order-manager"
                        },
                        url:"order/groupRankPanel.jsp"
                    });H.setActiveTab(x)
                }
            };var B=function(){
                var y=H.id+"-productionSaleRank";var x=H.getComponent(y);if(!x){
                    var x=new Ext.Panel({
                        id:y,
                        iconCls:"icon-chart-bar",
                        autoScroll:true,
                        title:" 产品订单排名统计",
                        closable:true
                    });x.on("render",function(){
                        x.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:x.body.id,
                                moduleID:"order-manager"
                            },
                            url:"order/productionSaleRankPanel.jsp"
                        })
                    });var z=H.add(x);H.setActiveTab(z)
                }else{
                    x.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:x.body.id,
                            moduleID:"order-manager"
                        },
                        url:"order/productionSaleRankPanel.jsp"
                    });H.setActiveTab(x)
                }
            };var V=function(){
                var y=H.id+"-productionSaleHistory";var x=H.getComponent(y);if(!x){
                    var x=new Ext.Panel({
                        id:y,
                        iconCls:"icon-chart-curve",
                        autoScroll:true,
                        title:" 产品销售趋势统计",
                        closable:true
                    });x.on("render",function(){
                        x.load({
                            scripts:true,
                            method:"post",
                            params:{
                                sid:Ext.id(),
                                containerID:x.body.id,
                                moduleID:"order-manager"
                            },
                            url:"order/listProductionSaleHistoryPanel.jsp"
                        })
                    });var z=H.add(x);H.setActiveTab(z)
                }else{
                    x.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            sid:Ext.id(),
                            containerID:x.body.id,
                            moduleID:"order-manager"
                        },
                        url:"order/listProductionSaleHistoryPanel.jsp"
                    });H.setActiveTab(x)
                }
            };var W=new Ext.menu.Menu({
                items:[{
                        text:"销售业绩",
                        tooltip:"订单及汇款统计",
                        iconCls:"icon-chart-line",
                        handler:q
                    },{
                        text:"订单数量",
                        tooltip:"订单及报价单数量统计",
                        iconCls:"icon-chart-curve",
                        handler:T
                    },"-",{
                        text:"产品销量",
                        tooltip:"产品销量排名",
                        iconCls:"icon-chart-bar",
                        handler:B
                    },{
                        text:"产品趋势",
                        tooltip:"产品销售趋势",
                        iconCls:"icon-chart-curve",
                        handler:V
                    },"-",{
                        text:"联系人份额",
                        tooltip:"联系人份额",
                        iconCls:"icon-chart-pie",
                        handler:u
                    },{
                        text:"联系人排名",
                        tooltip:"联系人订单金额排名",
                        iconCls:"icon-chart-bar",
                        handler:c
                    },"-",{
                        text:"客户份额",
                        tooltip:"客户(分组)份额",
                        iconCls:"icon-chart-pie",
                        handler:E
                    },{
                        text:"客户排名",
                        tooltip:"客户(分组)订单金额排名",
                        iconCls:"icon-chart-bar",
                        handler:N
                    }]
            });var H=new Ext.TabPanel({
                id:"order-manager-body",
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
                        id:"offer-grid",
                        closable:false,
                        title:"报价单列表",
                        autoScroll:true,
                        layout:"fit",
                        items:n,
                        iconCls:"icon-offer"
                    },{
                        id:"order-grid",
                        closable:false,
                        title:"订单列表",
                        autoScroll:true,
                        layout:"fit",
                        items:U,
                        iconCls:"icon-order"
                    }]
            });o=v.createWindow({
                id:this.moduleId,
                title:"我的订单",
                width:J,
                height:l,
                x:v.getWinX(J),
                y:v.getWinY(l),
                iconCls:"icon-order",
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                minimizable:true,
                maximizable:true,
                border:false,
                layout:"border",
                tbar:["-",{
                        tooltip:"新建报价单",
                        iconCls:"icon-offer-add",
                        handler:L
                    },{
                        tooltip:"更新报价单",
                        iconCls:"icon-offer-edit",
                        handler:w
                    },{
                        tooltip:"删除报价单",
                        iconCls:"icon-offer-remove",
                        handler:f
                    },"-",{
                        tooltip:"报价单转为订单",
                        iconCls:"icon-order",
                        handler:h
                    },"-",{
                        tooltip:"新建订单",
                        iconCls:"icon-order-add",
                        handler:F
                    },{
                        tooltip:"更新订单",
                        iconCls:"icon-order-edit",
                        handler:t
                    },{
                        tooltip:"删除订单",
                        iconCls:"icon-order-remove",
                        handler:m
                    },"-",{
                        text:"销售报表",
                        menu:W
                    }],
                items:H,
                taskbuttonTooltip:"<b>我的报价单、订单</b><br />我的订单、报价单"
            })
        }o.show()
    }
});
