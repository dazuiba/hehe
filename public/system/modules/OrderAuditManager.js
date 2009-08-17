//~~
Sliver.OrderAuditManager=Ext.extend(Ext.app.Module,{
    moduleType:"order",
    moduleId:"order-audit-manager",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"icon-order-edit",
            scope:this,
            shortcutIconCls:"order-audit-shortcut",
            text:"订单审核",
            tooltip:"<b>订单审核</b><br />报价单、订单审核"
        }
    },
    createWindow:function(){
        var x=this.app.getDesktop();var p=x.getWindow(this.moduleId);if(!p){
            var H=x.getWinWidth()/1.1;var l=x.getWinHeight()/1.1;var v=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"order/listAllOffer.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"offerList",
                    totalProperty:"total",
                    id:"offerID",
                    fields:["offerID","contactID","contactName","contactBusinessphone","contactFax","contactMobilephone","contactCustomer","auditID","auditName","ownerID","ownerName","offerState","offerTotal","offerPaymode","offerDescription","createDate","expiryDate"]
                }),
                remoteSort:true
            });v.setDefaultSort("offerID","desc");var t=new Ext.grid.RowExpander({
                tpl:new Ext.Template("<p><b>付款方式:</b>{offerPaymode}</p>","<p><b>备注:</b> {offerDescription}</p>")
            });var U=new Ext.form.ComboBox({
                store:new Ext.data.SimpleStore({
                    fields:["offerStateName","offerState"],
                    data:SliverData.offerState
                }),
                displayField:"offerStateName",
                valueField:"offerState",
                editable:false,
                mode:"local",
                triggerAction:"all",
                selectOnFocus:true,
                name:"offer.offerState"
            });var g=new Ext.grid.ColumnModel([t,{
                    header:"报价单号",
                    dataIndex:"offerID",
                    css:"background-color:#F1F2F4;",
                    width:30
                },{
                    header:"联系人",
                    dataIndex:"contactName",
                    css:"background-color:#F1F2F4;",
                    width:40
                },{
                    header:"分组（客户）",
                    dataIndex:"contactCustomer",
                    css:"background-color:#F1F2F4;",
                    width:80
                },{
                    header:"联系人电话",
                    dataIndex:"contactBusinessphone",
                    css:"background-color:#F1F2F4;",
                    width:80
                },{
                    header:"传真",
                    hidden:true,
                    dataIndex:"contactFax",
                    css:"background-color:#F1F2F4;",
                    width:40
                },{
                    header:"移动电话",
                    hidden:true,
                    dataIndex:"contactMobilephone",
                    css:"background-color:#F1F2F4;",
                    width:40
                },{
                    header:"经办人",
                    align:"right",
                    dataIndex:"ownerName",
                    css:"background-color:#F1F2F4;",
                    width:30
                },{
                    header:"状态",
                    align:"right",
                    dataIndex:"offerState",
                    renderer:SliverUtil.renderOfferState,
                    width:30,
                    editor:U
                },{
                    header:"合计金额",
                    align:"right",
                    dataIndex:"offerTotal",
                    css:"background-color:#F1F2F4;",
                    renderer:SliverUtil.cnMoney,
                    width:60
                },{
                    header:"创建日期",
                    align:"right",
                    css:"background-color:#F1F2F4;",
                    dataIndex:"createDate",
                    width:40
                },{
                    header:"有效日期",
                    align:"right",
                    dataIndex:"expiryDate",
                    css:"background-color:#F1F2F4;",
                    width:40
                }]);g.defaultSortable=true;var E={
                "offer.contactName":"",
                "offer.contactCustomer":"",
                "offer.contactBusinessphone":"",
                "offer.contactFax":"",
                "offer.contactMobilephone":"",
                "offer.ownerName":"",
                "offer.offerState":"",
                "offer.offerPaymode":"",
                "offer.offerDescription":"",
                "offer.createDate":"",
                "offer.expiryDate":""
            };var L=new Ext.menu.Menu({
                items:[{
                        text:"联系人",
                        checked:true,
                        checkHandler:function(){
                            Q(this.checked,"offer.contactName")
                        }
                    },{
                        text:"客户",
                        checked:true,
                        checkHandler:function(){
                            Q(this.checked,"offer.contactCustomer")
                        }
                    },{
                        text:"联系人电话",
                        checked:true,
                        checkHandler:function(){
                            Q(this.checked,"offer.contactBusinessphone")
                        }
                    },{
                        text:"联系人传真",
                        checked:true,
                        checkHandler:function(){
                            Q(this.checked,"offer.contactFax")
                        }
                    },{
                        text:"联系人手机",
                        checked:true,
                        checkHandler:function(){
                            Q(this.checked,"offer.contactMobilephone")
                        }
                    },{
                        text:"经办人",
                        checked:true,
                        checkHandler:function(){
                            Q(this.checked,"offer.ownerName")
                        }
                    },{
                        text:"付款方式",
                        checked:true,
                        checkHandler:function(){
                            Q(this.checked,"offer.offerPaymode")
                        }
                    },{
                        text:"创建日期",
                        checked:true,
                        checkHandler:function(){
                            Q(this.checked,"offer.createDate")
                        }
                    },{
                        text:"过期日期",
                        checked:true,
                        checkHandler:function(){
                            Q(this.checked,"offer.expiryDate")
                        }
                    },{
                        text:"备注",
                        checked:true,
                        checkHandler:function(){
                            Q(this.checked,"offer.offerDescription")
                        }
                    }]
            });function Q(z,AA){
                if(z===true){
                    E[AA]=""
                }else{
                    E[AA]=null
                }
            }var c=new Ext.form.TextField({});var j=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==E["offer.contactName"]){
                        E["offer.contactName"]=c.getValue()
                    }if(null!==E["offer.contactCustomer"]){
                        E["offer.contactCustomer"]=c.getValue()
                    }if(null!==E["offer.contactBusinessphone"]){
                        E["offer.contactBusinessphone"]=c.getValue()
                    }if(null!==E["offer.contactFax"]){
                        E["offer.contactFax"]=c.getValue()
                    }if(null!==E["offer.contactMobilephone"]){
                        E["offer.contactMobilephone"]=c.getValue()
                    }if(null!==E["offer.ownerName"]){
                        E["offer.ownerName"]=c.getValue()
                    }if(null!==E["offer.offerPaymode"]){
                        E["offer.offerPaymode"]=c.getValue()
                    }if(null!==E["offer.createDate"]){
                        E["offer.createDate"]=c.getValue()
                    }if(null!==E["offer.expiryDate"]){
                        E["offer.expiryDate"]=c.getValue()
                    }if(null!==E["offer.offerDescription"]){
                        E["offer.offerDescription"]=c.getValue()
                    }v.baseParams=E;v.setDefaultSort("offerID","DESC");v.load({
                        params:{
                            start:0,
                            limit:b.getPageSize()
                        }
                    })
                }
            });var Y=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    c.reset();v.baseParams={};v.setDefaultSort("offerID","DESC");v.load({
                        params:{
                            start:0,
                            limit:b.getPageSize()
                        }
                    })
                }
            });var h=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });var b=new Ext.ux.Andrie.pPageSize();var u=new Ext.grid.EditorGridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:v,
                cm:g,
                sm:h,
                plugins:t,
                loadMask:true,
                clicksToEdit:1,
                bbar:new Ext.PagingToolbar({
                    plugins:b,
                    pageSize:20,
                    store:v,
                    displayInfo:true,
                    displayMsg:"显示 {0} - {1} 共{2}",
                    emptyMsg:"",
                    items:["-",{
                            text:"搜索范围",
                            menu:L
                        },c,j,Y,"-",{
                            tooltip:"将选中订单导出为PDF格式",
                            iconCls:"icon-pdf",
                            handler:function(){
                                var z=h.getSelected();if(z){
                                    window.open("order/exportAuditOfferPDF.action?offer.offerID="+z.data.offerID)
                                }
                            }
                        },{
                            tooltip:"将选中订单导出为xls格式",
                            iconCls:"icon-xls",
                            handler:function(){
                                var z=h.getSelected();if(z){
                                    window.open("order/exportAuditOfferPDF.action?offer.offerID="+z.data.offerID+"&type=xls")
                                }
                            }
                        }]
                })
            });u.on("render",function(){
                v.load({
                    params:{
                        start:0,
                        limit:b.getPageSize()
                    }
                })
            });u.on("beforeedit",function(z){
                h.selectRow(z.row)
            });u.on("afteredit",function(AA){
                var z=h.getSelected();if(z){
                    Ext.Ajax.request({
                        url:"order/updateOfferState.action",
                        params:{
                            "offer.offerID":z.data.offerID,
                            "offer.offerState":z.data.offerState
                        },
                        success:function(AB){}
                    })
                }
            });var i=function(){
                var AA=Ext.id();var z=new Ext.Panel({
                    id:AA,
                    iconCls:"icon-offer-add",
                    autoScroll:true,
                    title:"创建报价单",
                    closable:true
                });z.on("render",function(){
                    z.load({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:z.body.id
                        },
                        url:"order/insertOfferByAuditView.action"
                    })
                });var AB=F.add(z);F.setActiveTab(AB)
            };var f=function(z){
                var z=h.getSelected();if(z){
                    var AB="auditoffer-"+z.data.offerID;var AA=F.getComponent(AB);if(!AA){
                        var AA=new Ext.Panel({
                            id:AB,
                            iconCls:"icon-offer",
                            autoScroll:true,
                            title:"报价单"+z.data.offerID,
                            closable:true
                        });AA.on("render",function(){
                            AA.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "offer.offerID":z.data.offerID,
                                    containerID:AA.body.id
                                },
                                url:"order/getOfferAuditView.action"
                            })
                        });var AC=F.add(AA);F.setActiveTab(AC)
                    }else{
                        AA.setTitle("报价单"+z.data.offerID);AA.setIconClass("icon-offer");AA.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "offer.offerID":z.data.offerID,
                                containerID:AA.body.id
                            },
                            url:"order/getOfferAuditView.action"
                        });F.setActiveTab(AA)
                    }
                }
            };var n=function(z){
                var z=h.getSelected();if(z){
                    var AB="offerauditorder-"+z.data.offerID;var AA=F.getComponent(AB);if(!AA){
                        var AA=new Ext.Panel({
                            id:AB,
                            iconCls:"icon-order-add",
                            autoScroll:true,
                            title:z.data.offerID+"转为订单",
                            closable:true
                        });AA.on("render",function(){
                            AA.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "offer.offerID":z.data.offerID,
                                    containerID:AA.body.id
                                },
                                url:"order/copyToOrderAuditView.action"
                            })
                        });var AC=F.add(AA);F.setActiveTab(AC)
                    }else{
                        title:z.data.offerID+"转为订单",AA.setIconClass("icon-order-add");AA.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "offer.offerID":z.data.offerID,
                                containerID:AA.body.id
                            },
                            url:"order/copyToOrderAuditView.action"
                        });F.setActiveTab(AA)
                    }
                }
            };var Z=function(){
                var z=h.getSelected();if(z){
                    if(SliverData.offerState[3][1]===z.data.offerState){
                        Ext.MessageBox.alert("警告","报价单["+z.data.offerID+"]已经锁定");return
                    }var AB="auditoffer-"+z.data.offerID;var AA=F.getComponent(AB);if(!AA){
                        var AA=new Ext.Panel({
                            id:AB,
                            iconCls:"icon-offer-edit",
                            autoScroll:true,
                            title:"报价单"+z.data.offerID,
                            closable:true
                        });AA.on("render",function(){
                            AA.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "offer.offerID":z.data.offerID,
                                    containerID:AA.body.id
                                },
                                url:"order/updateOfferByAuditView.action"
                            })
                        });var AC=F.add(AA);F.setActiveTab(AC)
                    }else{
                        AA.setTitle("报价单"+z.data.offerID);AA.setIconClass("icon-offer-edit");AA.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "offer.offerID":z.data.offerID,
                                containerID:AA.body.id
                            },
                            url:"order/updateOfferByAuditView.action"
                        });F.setActiveTab(AA)
                    }
                }
            };var W=function(){
                var z=h.getSelected();if(z){
                    if(SliverData.offerState[3][1]===z.data.offerState){
                        Ext.MessageBox.alert("警告","报价单["+z.data.offerID+"]已经锁定");return
                    }Ext.MessageBox.confirm("删除报价单","您确定要删除选中报价单?",function(AA){
                        if(AA=="yes"){
                            Ext.Ajax.request({
                                url:"order/removeOfferByAudit.action",
                                params:{
                                    "offer.offerID":z.data.offerID,
                                    "offer.offerState":z.data.offerState
                                },
                                method:"post",
                                success:function(AC){
                                    var AD=Ext.decode(AC.responseText);if(AD.success===true){
                                        var AB="auditoffer-"+z.data.offerID;v.remove(z);var AE=F.getComponent(AB);if(AE){
                                            F.remove(AE)
                                        }
                                    }
                                }
                            })
                        }
                    })
                }
            };u.on("rowdblclick",f);var I;u.on("rowcontextmenu",function(z,AA,AB){
                z.getSelectionModel().selectRow(AA,false);if(!I){
                    I=new Ext.menu.Menu([{
                            id:"addOfferContextMenu",
                            text:"添加报价单",
                            handler:i
                        },{
                            id:"copyOfferToOrderAuditContextMenu",
                            text:"转换为订单",
                            handler:n
                        },{
                            id:"updateOfferContextMenu",
                            text:"更新报价单",
                            handler:Z
                        },"-",{
                            id:"removeOfferContextMenu",
                            text:"删除报价单",
                            handler:W
                        }])
                }I.showAt(AB.getPoint());AB.stopEvent()
            });var P=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"order/listAllOrder.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"orderList",
                    totalProperty:"total",
                    id:"orderID",
                    fields:["orderID","contactID","contactName","contactBusinessphone","contactFax","contactMobilephone","contactCustomer","auditID","auditName","ownerID","ownerName","orderLevel","orderState","orderTotal","orderPaymode","orderDescription","createDate","expiryDate"]
                }),
                remoteSort:true
            });P.setDefaultSort("orderID","desc");var K=new Ext.grid.RowExpander({
                tpl:new Ext.Template("<p><b>付款方式:</b>{orderPaymode}</p>","<p><b>备注:</b> {orderDescription}</p>")
            });var a=new Ext.form.ComboBox({
                store:new Ext.data.SimpleStore({
                    fields:["orderStateName","orderState"],
                    data:SliverData.orderState
                }),
                displayField:"orderStateName",
                valueField:"orderState",
                editable:false,
                mode:"local",
                triggerAction:"all",
                selectOnFocus:true,
                name:"order.orderState"
            });var k=new Ext.grid.ColumnModel([K,{
                    header:"订单号",
                    dataIndex:"orderID",
                    css:"background-color:#F1F2F4;",
                    width:30
                },{
                    header:"联系人",
                    dataIndex:"contactName",
                    css:"background-color:#F1F2F4;",
                    width:40
                },{
                    header:"客户",
                    dataIndex:"contactCustomer",
                    css:"background-color:#F1F2F4;",
                    width:80
                },{
                    header:"联系人电话",
                    dataIndex:"contactBusinessphone",
                    css:"background-color:#F1F2F4;",
                    width:80
                },{
                    header:"传真",
                    hidden:true,
                    dataIndex:"contactFax",
                    css:"background-color:#F1F2F4;",
                    width:40
                },{
                    header:"移动电话",
                    hidden:true,
                    dataIndex:"contactMobilephone",
                    css:"background-color:#F1F2F4;",
                    width:40
                },{
                    align:"right",
                    header:"经办人",
                    dataIndex:"ownerName",
                    css:"background-color:#F1F2F4;",
                    width:30
                },{
                    header:"状态",
                    align:"right",
                    dataIndex:"orderState",
                    renderer:SliverUtil.renderOrderState,
                    editor:a,
                    width:30
                },{
                    header:"订单等级",
                    align:"right",
                    dataIndex:"orderLevel",
                    css:"background-color:#F1F2F4;",
                    width:40
                },{
                    header:"合计金额",
                    align:"right",
                    dataIndex:"orderTotal",
                    css:"background-color:#F1F2F4;",
                    renderer:SliverUtil.cnMoney,
                    width:60
                },{
                    header:"创建日期",
                    align:"right",
                    dataIndex:"createDate",
                    css:"background-color:#F1F2F4;",
                    width:40
                },{
                    header:'<font style="color:red;font-weight:bold;">交付日期</font>',
                    align:"right",
                    dataIndex:"expiryDate",
                    css:"background-color:#F1F2F4;",
                    width:40
                }]);k.defaultSortable=true;var r={
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
            };var J=new Ext.menu.Menu({
                items:[{
                        text:"联系人",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.contactName")
                        }
                    },{
                        text:"客户",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.contactCustomer")
                        }
                    },{
                        text:"联系人电话",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.contactBusinessphone")
                        }
                    },{
                        text:"联系人传真",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.contactFax")
                        }
                    },{
                        text:"联系人手机",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.contactMobilephone")
                        }
                    },{
                        text:"发货地址",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.contactAddress")
                        }
                    },{
                        text:"发货地址邮编",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"offer.contactZipcode")
                        }
                    },{
                        text:"订单等级",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.orderLevel")
                        }
                    },{
                        text:"经办人",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.ownerName")
                        }
                    },{
                        text:"付款方式",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.orderPaymode")
                        }
                    },{
                        text:"创建日期",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.createDate")
                        }
                    },{
                        text:"过期日期",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.expiryDate")
                        }
                    },{
                        text:"备注",
                        checked:true,
                        checkHandler:function(){
                            y(this.checked,"order.orderDescription")
                        }
                    }]
            });function y(z,AA){
                if(z===true){
                    r[AA]=""
                }else{
                    r[AA]=null
                }
            }var O=new Ext.form.TextField({});var d=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==r["order.contactName"]){
                        r["order.contactName"]=O.getValue()
                    }if(null!==r["order.contactCustomer"]){
                        r["order.contactCustomer"]=O.getValue()
                    }if(null!==r["order.contactBusinessphone"]){
                        r["order.contactBusinessphone"]=O.getValue()
                    }if(null!==r["order.contactFax"]){
                        r["order.contactFax"]=O.getValue()
                    }if(null!==r["order.contactMobilephone"]){
                        r["order.contactMobilephone"]=O.getValue()
                    }if(null!==r["order.contactAddress"]){
                        r["order.contactAddress"]=O.getValue()
                    }if(null!==r["order.contactZipcode"]){
                        r["order.contactZipcode"]=O.getValue()
                    }if(null!==r["order.ownerName"]){
                        r["order.ownerName"]=O.getValue()
                    }if(null!==r["order.orderState"]){
                        r["order.orderState"]=O.getValue()
                    }if(null!==r["order.orderPaymode"]){
                        r["order.orderPaymode"]=O.getValue()
                    }if(null!==r["order.orderLeval"]){
                        r["order.orderLeval"]=O.getValue()
                    }if(null!==r["order.createDate"]){
                        r["order.createDate"]=O.getValue()
                    }if(null!==r["order.expiryDate"]){
                        r["order.expiryDate"]=O.getValue()
                    }if(null!==r["order.orderDescription"]){
                        r["order.orderDescription"]=O.getValue()
                    }P.baseParams=r;P.setDefaultSort("orderID","DESC");P.load({
                        params:{
                            start:0,
                            limit:B.getPageSize()
                        }
                    })
                }
            });var N=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    O.reset();P.baseParams={};P.setDefaultSort("orderID","DESC");P.load({
                        params:{
                            start:0,
                            limit:B.getPageSize()
                        }
                    })
                }
            });var G=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });var B=new Ext.ux.Andrie.pPageSize();var T=new Ext.grid.EditorGridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:P,
                cm:k,
                sm:G,
                clicksToEdit:1,
                plugins:K,
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:B,
                    pageSize:20,
                    store:P,
                    displayInfo:true,
                    items:["-",{
                            text:"搜索范围",
                            menu:J
                        },O,d,N,"-",{
                            tooltip:"将选中订单导出为PDF格式",
                            iconCls:"icon-pdf",
                            handler:function(){
                                var z=G.getSelected();if(z){
                                    window.open("order/exportAuditOrderPDF.action?order.orderID="+z.data.orderID)
                                }
                            }
                        },{
                            tooltip:"将选中订单导出为xls格式",
                            iconCls:"icon-xls",
                            handler:function(){
                                var z=G.getSelected();if(z){
                                    window.open("order/exportAuditOrderPDF.action?order.orderID="+z.data.orderID+"&type=xls")
                                }
                            }
                        }]
                })
            });T.on("render",function(){
                P.load({
                    params:{
                        start:0,
                        limit:B.getPageSize()
                    }
                })
            });var D=function(){
                var AA=Ext.id();var z=new Ext.Panel({
                    id:AA,
                    iconCls:"icon-order-add",
                    autoScroll:true,
                    title:"添加订单",
                    closable:true
                });z.on("render",function(){
                    z.load({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:z.body.id
                        },
                        url:"order/insertOrderByAuditView.action"
                    })
                });var AB=F.add(z);F.setActiveTab(AB)
            };var R=function(z){
                var z=G.getSelected();if(z){
                    var AB="auditorder-"+z.data.orderID;var AA=F.getComponent(AB);if(!AA){
                        var AA=new Ext.Panel({
                            id:AB,
                            iconCls:"icon-order",
                            autoScroll:true,
                            title:"订单"+z.data.orderID,
                            closable:true
                        });AA.on("render",function(){
                            AA.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "order.orderID":z.data.orderID,
                                    containerID:AA.body.id
                                },
                                url:"order/getOrderByAuditView.action"
                            })
                        });var AC=F.add(AA);F.setActiveTab(AC)
                    }else{
                        AA.setTitle("订单"+z.data.orderID);AA.setIconClass("icon-order");AA.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "order.orderID":z.data.orderID,
                                containerID:AA.body.id
                            },
                            url:"order/getOrderByAuditView.action"
                        });F.setActiveTab(AA)
                    }
                }
            };var m=function(){
                var z=G.getSelected();if(z){
                    if(SliverData.offerState[3][1]===z.data.orderState){
                        Ext.MessageBox.alert("警告","订单["+z.data.orderID+"]已经锁定");return
                    }var AB="auditorder-"+z.data.orderID;var AA=F.getComponent(AB);if(!AA){
                        var AA=new Ext.Panel({
                            id:AB,
                            iconCls:"icon-order-edit",
                            autoScroll:true,
                            title:"订单"+z.data.orderID,
                            closable:true
                        });AA.on("render",function(){
                            AA.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "order.orderID":z.data.orderID,
                                    containerID:AA.body.id
                                },
                                url:"order/updateOrderAuditView.action"
                            })
                        });var AC=F.add(AA);F.setActiveTab(AC)
                    }else{
                        AA.setTitle("订单"+z.data.orderID);AA.setIconClass("icon-order-edit");AA.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "order.orderID":z.data.orderID,
                                containerID:AA.body.id
                            },
                            url:"order/updateOrderAuditView.action"
                        });F.setActiveTab(AA)
                    }
                }
            };var s=function(){
                var z=G.getSelected();if(z){
                    if(SliverData.offerState[3][1]===z.data.orderState){
                        Ext.MessageBox.alert("警告","订单["+z.data.orderID+"]已经锁定");return
                    }Ext.MessageBox.confirm("删除订单","您确定要删除选中订单?",function(AA){
                        if(AA=="yes"){
                            Ext.Ajax.request({
                                url:"order/removeOrderByAudit.action",
                                params:{
                                    "order.orderID":z.data.orderID,
                                    "order.orderState":z.data.orderState
                                },
                                method:"post",
                                success:function(AC){
                                    var AD=Ext.decode(AC.responseText);if(AD.success===true){
                                        var AB="order-"+z.data.orderID;var AE=F.getComponent(AB);F.remove(AE);P.remove(z)
                                    }
                                }
                            })
                        }
                    })
                }
            };T.on("rowdblclick",R);var o;T.on("rowcontextmenu",function(AB,z,AA){
                AB.getSelectionModel().selectRow(z,false);if(!o){
                    o=new Ext.menu.Menu([{
                            id:"addOrderAuditContextMenu",
                            text:"添加订单",
                            handler:D
                        },{
                            id:"updateOrderAuditContextMenu",
                            text:"更新订单",
                            handler:m
                        },"-",{
                            id:"removeOrderAuditContextMenu",
                            text:"删除订单",
                            handler:s
                        }])
                }o.showAt(AA.getPoint());AA.stopEvent()
            });T.on("beforeedit",function(z){
                G.selectRow(z.row)
            });T.on("afteredit",function(AA){
                var z=G.getSelected();if(z){
                    Ext.Ajax.request({
                        url:"order/updateOrderState.action",
                        params:{
                            "order.orderID":z.data.orderID,
                            "order.orderState":z.data.orderState
                        },
                        success:function(AB){}
                    })
                }
            });var q=function(){
                var AA=F.id+"-saleState";var z=F.getComponent(AA);if(!z){
                    var z=new Ext.Panel({
                        id:AA,
                        iconCls:"icon-chart-line",
                        autoScroll:true,
                        title:"销售业绩",
                        closable:true
                    });z.on("render",function(){
                        z.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:z.body.id
                            },
                            url:"order/allSaleStatePanel.jsp"
                        })
                    });var AB=F.add(z);F.setActiveTab(AB)
                }else{
                    z.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:z.body.id
                        },
                        url:"order/allSaleStatePanel.jsp"
                    });F.setActiveTab(z)
                }
            };var S=function(){
                var AA=F.id+"-orderState";var z=F.getComponent(AA);if(!z){
                    var z=new Ext.Panel({
                        id:AA,
                        iconCls:"icon-chart-curve",
                        autoScroll:true,
                        title:" 业务数量",
                        closable:true
                    });z.on("render",function(){
                        z.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:z.body.id
                            },
                            url:"order/allOrderStatePanel.jsp"
                        })
                    });var AB=F.add(z);F.setActiveTab(AB)
                }else{
                    z.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:z.body.id
                        },
                        url:"order/allOrderStatePanel.jsp"
                    });F.setActiveTab(z)
                }
            };var w=function(){
                var AA=F.id+"-contactState";var z=F.getComponent(AA);if(!z){
                    var z=new Ext.Panel({
                        id:AA,
                        iconCls:"icon-chart-pie",
                        autoScroll:true,
                        title:" 联系人份额统计",
                        closable:true
                    });z.on("render",function(){
                        z.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:z.body.id
                            },
                            url:"order/allContactStatePanel.jsp"
                        })
                    });var AB=F.add(z);F.setActiveTab(AB)
                }else{
                    z.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:z.body.id
                        },
                        url:"order/allContactStatePanel.jsp"
                    });F.setActiveTab(z)
                }
            };var C=function(){
                var AA=F.id+"-groupState";var z=F.getComponent(AA);if(!z){
                    var z=new Ext.Panel({
                        id:AA,
                        iconCls:"icon-chart-pie",
                        autoScroll:true,
                        title:" 客户(分组)份额统计",
                        closable:true
                    });z.on("render",function(){
                        z.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:z.body.id
                            },
                            url:"order/allGroupStatePanel.jsp"
                        })
                    });var AB=F.add(z);F.setActiveTab(AB)
                }else{
                    z.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:z.body.id
                        },
                        url:"order/allGroupStatePanel.jsp"
                    });F.setActiveTab(z)
                }
            };var e=function(){
                var AA=F.id+"-contactRank";var z=F.getComponent(AA);if(!z){
                    var z=new Ext.Panel({
                        id:AA,
                        iconCls:"icon-chart-bar",
                        autoScroll:true,
                        title:" 联系人订单排名统计",
                        closable:true
                    });z.on("render",function(){
                        z.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:z.body.id,
                                moduleID:"order-manager"
                            },
                            url:"order/allContactRankPanel.jsp"
                        })
                    });var AB=F.add(z);F.setActiveTab(AB)
                }else{
                    z.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:z.body.id,
                            moduleID:"order-manager"
                        },
                        url:"order/allContactRankPanel.jsp"
                    });F.setActiveTab(z)
                }
            };var M=function(){
                var AA=F.id+"-groupRank";var z=F.getComponent(AA);if(!z){
                    var z=new Ext.Panel({
                        id:AA,
                        iconCls:"icon-chart-bar",
                        autoScroll:true,
                        title:" 客户订单排名统计",
                        closable:true
                    });z.on("render",function(){
                        z.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:z.body.id,
                                moduleID:"order-manager"
                            },
                            url:"order/allGroupRankPanel.jsp"
                        })
                    });var AB=F.add(z);F.setActiveTab(AB)
                }else{
                    z.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:z.body.id,
                            moduleID:"order-manager"
                        },
                        url:"order/allGroupRankPanel.jsp"
                    });F.setActiveTab(z)
                }
            };var A=function(){
                var AA=F.id+"-productionSaleRank";var z=F.getComponent(AA);if(!z){
                    var z=new Ext.Panel({
                        id:AA,
                        iconCls:"icon-chart-bar",
                        autoScroll:true,
                        title:" 产品销量排名统计",
                        closable:true
                    });z.on("render",function(){
                        z.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:z.body.id,
                                moduleID:"order-manager"
                            },
                            url:"order/allProductionSaleRankPanel.jsp"
                        })
                    });var AB=F.add(z);F.setActiveTab(AB)
                }else{
                    z.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:z.body.id,
                            moduleID:"order-manager"
                        },
                        url:"order/allProductionSaleRankPanel.jsp"
                    });F.setActiveTab(z)
                }
            };var V=function(){
                var AA=F.id+"-productionSaleHistory";var z=F.getComponent(AA);if(!z){
                    var z=new Ext.Panel({
                        id:AA,
                        iconCls:"icon-chart-curve",
                        autoScroll:true,
                        title:" 产品销售趋势统计",
                        closable:true
                    });z.on("render",function(){
                        z.load({
                            scripts:true,
                            method:"post",
                            params:{
                                sid:Ext.id(),
                                containerID:z.body.id,
                                moduleID:"order-manager"
                            },
                            url:"order/listAllProductionSaleHistoryPanel.jsp"
                        })
                    });var AB=F.add(z);F.setActiveTab(AB)
                }else{
                    z.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            sid:Ext.id(),
                            containerID:z.body.id,
                            moduleID:"order-manager"
                        },
                        url:"order/listAllProductionSaleHistoryPanel.jsp"
                    });F.setActiveTab(z)
                }
            };var X=new Ext.menu.Menu({
                items:["-",{
                        text:"销售业绩",
                        tooltip:"销售业绩",
                        iconCls:"icon-chart-line",
                        handler:q
                    },{
                        text:"订单数量",
                        tooltip:"订单数量",
                        iconCls:"icon-chart-curve",
                        handler:S
                    },"-",{
                        text:"产品销量",
                        tooltip:"产品销量",
                        iconCls:"icon-chart-bar",
                        handler:A
                    },{
                        text:"产品趋势",
                        tooltip:"产品销售趋势",
                        iconCls:"icon-chart-curve",
                        handler:V
                    },"-",{
                        text:"联系人份额",
                        tooltip:"联系人份额统计",
                        iconCls:"icon-chart-pie",
                        handler:w
                    },{
                        text:"联系人排名",
                        tooltip:"联系人订单金额排名",
                        iconCls:"icon-chart-bar",
                        handler:e
                    },"-",{
                        text:"客户份额",
                        tooltip:"客户(分组)份额统计",
                        iconCls:"icon-chart-pie",
                        handler:C
                    },{
                        text:"客户排名",
                        tooltip:"客户(分组)订单金额排名",
                        iconCls:"icon-chart-bar",
                        handler:M
                    }]
            });var F=new Ext.TabPanel({
                id:"auditorder-manager-body",
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
                        id:"audit-offer-grid",
                        closable:false,
                        title:"报价单列表",
                        autoScroll:true,
                        layout:"fit",
                        items:u,
                        iconCls:"icon-grid"
                    },{
                        id:"audit-order-grid",
                        closable:false,
                        title:"订单列表",
                        autoScroll:true,
                        layout:"fit",
                        items:T,
                        iconCls:"icon-grid"
                    }]
            });p=x.createWindow({
                id:this.moduleId,
                title:"报价单、订单审核",
                width:H,
                height:l,
                x:x.getWinX(H),
                y:x.getWinY(l),
                iconCls:"icon-order-edit",
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
                        handler:i
                    },{
                        tooltip:"更新报价单",
                        iconCls:"icon-offer-edit",
                        handler:Z
                    },{
                        tooltip:"删除报价单",
                        iconCls:"icon-offer-remove",
                        handler:W
                    },"-",{
                        tooltip:"将报价单转为订单",
                        iconCls:"icon-order",
                        handler:n
                    },"-",{
                        tooltip:"新建订单",
                        iconCls:"icon-order-add",
                        handler:D
                    },{
                        tooltip:"更新订单",
                        iconCls:"icon-order-edit",
                        handler:m
                    },{
                        tooltip:"删除订单",
                        iconCls:"icon-order-remove",
                        handler:s
                    },"-",{
                        text:"销售报表",
                        menu:X
                    }],
                items:F,
                taskbuttonTooltip:"<b>订单审核</b><br />报价单、订单审核"
            })
        }
		p.show()
    }
});

