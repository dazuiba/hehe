//~~
Sliver.ChanceManager=Ext.extend(Ext.app.Module,{
    moduleType:"chance",
    moduleId:"chance-manager",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"chance-manager-icon",
            scope:this,
            shortcutIconCls:"chance-manager-shortcut",
            text:SliverData.chanceManager.title,
            tooltip:SliverData.chanceManager.tooltip
        }
    },

    createWindow:function(){
        var desktop=this.app.getDesktop();
        var win=desktop.getWindow(this.moduleId);
        if(!win){
            var winWidth=desktop.getWinWidth()/1.1;
            var winHeight=desktop.getWinHeight()/1.1;
            var store=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"chance/listChanceByAll.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"list",
                    totalProperty:"total",
                    id:"chanceID",
                    fields:["chanceID","chanceDate","chanceSource","chanceState","chancePercent","chanceTitle","chanceContent","chanceTotal","groupName","userName"]
                }),
                remoteSort:true
            });

            store.setDefaultSort("chanceID","DESC");
            var expander=new Ext.grid.RowExpander({
                tpl:new Ext.Template("<p><b>"+SliverData.chance.requirement+"</b>{chanceContent}</p>")
            });
            function renderTitle(v){
                return Ext.util.Format.ellipsis(v,12)
            }
			
            function renderCustomer(v){
                return Ext.util.Format.ellipsis(v,15)
            }
			
            function renderPercent(v){
                if(v){
                    return v.toString()+"%"
                }else{
                    return""
                }
            }
			
            var cm=new Ext.grid.ColumnModel([expander,{
                header:"编号",
                dataIndex:"chanceID",
                width:30
            },{
                header:"客户",
                dataIndex:"groupName",
                width:120
            },{
                header:"主题",
                dataIndex:"chanceTitle",
                renderer:renderTitle,
                width:120
            },{
                header:"来源",
                dataIndex:"chanceSource",
                width:40
            },{
                header:"状态",
                dataIndex:"chanceState",
                width:50
            },{
                header:"概率",
                dataIndex:"chancePercent",
                renderer:renderPercent,
                width:30
            },{
                header:"总金额",
                dataIndex:"chanceTotal",
                renderer:SliverUtil.cnMoney,
                align:"right",
                width:40
            },{
                header:"所属帐户",
                dataIndex:"userName",
                width:60,
                align:"right"
            },{
                header:"记录日期",
                dataIndex:"chanceDate",
                align:"right",
                width:40
            }]);
			
            cm.defaultSortable=true;
            var chanceFilterParams={
                "chance.chanceSource":"",
                "chance.chanceTitle":"",
                "chance.chanceContent":"",
                "chance.chanceDate":"",
                "chance.chanceState":"",
                "chance.groupName":""
            };
			
            var chanceGridFilterMenu=new Ext.menu.Menu({
                items:[{
                    text:"客户名称",
                    checked:true,
                    checkHandler:function(){
                        operateChanceParams(this.checked,"chance.groupName")
                    }
                },{
                    text:"名称",
                    checked:true,
                    checkHandler:function(){
                        operateChanceParams(this.checked,"chance.chanceTitle")
                    }
                },{
                    text:"需求",
                    checked:true,
                    checkHandler:function(){
                        operateChanceParams(this.checked,"chance.chanceContent")
                    }
                },{
                    text:"来源",
                    checked:true,
                    checkHandler:function(){
                        operateChanceParams(this.checked,"chance.chanceSource")
                    }
                },{
                    text:"状态",
                    checked:true,
                    checkHandler:function(){
                        operateChanceParams(this.checked,"chance.chanceState")
                    }
                },{
                    text:"日期",
                    checked:true,
                    checkHandler:function(){
                        operateChanceParams(this.checked,"chance.chanceDate")
                    }
                }]
            });
					
            function operateChanceParams(status,name){
                if(status===true){
                    chanceFilterParams[name]=""
                }else{
                    chanceFilterParams[name]=null
                }
            }
			
            var filterField=new Ext.form.TextField({});
            var filterButton=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==chanceFilterParams["chance.chanceSource"]){
                        chanceFilterParams["chance.chanceSource"]=filterField.getValue()
                    }if(null!==chanceFilterParams["chance.chanceTitle"]){
                        chanceFilterParams["chance.chanceTitle"]=filterField.getValue()
                    }if(null!==chanceFilterParams["chance.chanceContent"]){
                        chanceFilterParams["chance.chanceContent"]=filterField.getValue()
                    }if(null!==chanceFilterParams["chance.chanceDate"]){
                        chanceFilterParams["chance.chanceDate"]=filterField.getValue()
                    }if(null!==chanceFilterParams["chance.chanceState"]){
                        chanceFilterParams["chance.chanceState"]=filterField.getValue()
                    }if(null!==chanceFilterParams["chance.groupName"]){
                        chanceFilterParams["chance.groupName"]=filterField.getValue()
                    }
                    store.baseParams=chanceFilterParams;
                    store.setDefaultSort("chanceID","DESC");
                    store.load({
                        params:{
                            start:0,
                            limit:pageSizePlugin.getPageSize()
                        }
                    })
                }
            });
			
            var clearButton=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    filterField.reset();
					store.baseParams={};
					store.setDefaultSort("chanceID","DESC");
					store.load({
                        params:{
                            start:0,
                            limit:pageSizePlugin.getPageSize()
                        }
                    })
                }
            });
			
            var sm=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });
			
            var pageSizePlugin=new Ext.ux.Andrie.pPageSize();
            var grid=new Ext.grid.GridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:store,
                cm:cm,
                sm:sm,
                plugins:expander,
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:pageSizePlugin,
                    pageSize:20,
                    store:store,
                    displayInfo:true,
                    items:["-",{
                        text:"搜索范围",
                        menu:chanceGridFilterMenu
                    },filterField,filterButton,clearButton]
                })
            });
			
            grid.on("render",function(){
                store.load({
                    params:{
                        start:0,
                        limit:pageSizePlugin.getPageSize()
                    }
                })
            });
			
            var updateChanceView=function(){
                var record=sm.getSelected();
                if(record){
                    var tabID=main.id+"-chance-"+record.data.chanceID;
		    var temp=main.getComponent(tabID);
                    if(!temp){
                        var temp=new Ext.Panel({
                            id:tabID,
                            iconCls:"chance-manager-icon",
                            autoScroll:true,
                            title:"销售机会["+record.data.chanceID+"]",
                            closable:true
                        });
						temp.on("render",function(){
                            temp.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "chance.chanceID":record.data.chanceID,
                                    containerID:temp.body.id
                                },
                                url:"chance/updateChanceManagerView.action"
                            })
                        });
						var p=main.add(temp);
						main.setActiveTab(p)
                    }else{
                        temp.setTitle("销售机会["+record.data.chanceID+"]");temp.setIconClass("chance-manager-icon");temp.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "chance.chanceID":record.data.chanceID,
                                containerID:temp.body.id
                            },
                            url:"chance/updateChanceManagerView.action"
                        });main.setActiveTab(temp)
                    }
                }else{
                    Sliver.getDesktop().msg({
                        title:"警告",
                        iconCls:"icon-warn",
                        html:"没有销售机会被选中,请选择表格中销售机会！"
                    })
                }
            };
			
            var insertChanceView=function(){
                var tabID=main.id+"-chance-"+Ext.id();
				var temp=new Ext.Panel({
                    id:tabID,
                    iconCls:"chance-manager-icon",
                    autoScroll:true,
                    title:"新的销售机会",
                    closable:true
                });temp.on("render",function(){
                    temp.load({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:temp.body.id
                        },
                        url:"chance/insertChanceManagerView.action"
                    })
                });
				var p=main.add(temp);
				main.setActiveTab(p)
            };
			
			var removeChanceView=function(){
                var record=sm.getSelected();
                if(record){
                    Ext.MessageBox.confirm("删除销售机会","您确定要删除销售机会?",function(btn){
                        if(btn=="yes"){
                            Ext.Ajax.request({
                                url:"chance/removeChanceManagerAction.action",
                                method:"post",
                                params:{
                                    "chance.chanceID":record.data.chanceID
                                },
                                success:function(response){
                                    var result=Ext.decode(response.responseText);
                                    if(true===result.success){
                                        store.remove(record)
                                    }
                                }
                            })
                        }
                    })
                }else{
                    Sliver.getDesktop().msg({
                        title:"警告",
                        iconCls:"icon-warn",
                        html:"没有销售机会被选中,请选择表格中销售机会！"
                    })
                }
            };
			var genOrderView=function(){
                var record=sm.getSelected();
                if(record){
                    var tabID=Ext.id();var temp=new Ext.Panel({
                        id:tabID,
                        iconCls:"icon-order-add",
                        autoScroll:true,
                        title:"添加订单",
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:temp.body.id,
                                "chance.chanceID":record.data.chanceID
                            },
                            url:"chance/insertOrderManagerViewByChance.action"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }else{
                    Sliver.getDesktop().msg({
                        title:"警告",
                        iconCls:"icon-warn",
                        html:"没有销售机会被选中,请选择表格中销售机会！"
                    })
                }
            };var genOfferView=function(){
                var record=sm.getSelected();
                if(record){
                    var tabID=Ext.id();var temp=new Ext.Panel({
                        id:tabID,
                        iconCls:"icon-offer-add",
                        autoScroll:true,
                        title:"创建报价单",
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:temp.body.id,
                                "chance.chanceID":record.data.chanceID
                            },
                            url:"chance/insertOfferManagerViewByChance.action"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }else{
                    Sliver.getDesktop().msg({
                        title:"警告",
                        iconCls:"icon-warn",
                        html:"没有销售机会被选中,请选择表格中销售机会！"
                    })
                }
            };
            var getChanceStateView=function(){
                var tab=Ext.getCmp("chance-manager-bar");
                if(tab){
                    main.setActiveTab(tab)
                }else{
                    var centerID=Ext.id();
                    var center=new Ext.Panel({
                        id:centerID,
                        border:true,
                        region:"center",
                        autoScroll:true
                    });

                    center.on("render",function(){
                        center.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:centerID+"-bar",
                                width:600,
                                height:400,
                                "chance.chanceDate":Ext.util.Format.date(new Date(Date.parse("01/01/"+new Date().getFullYear())),"Y-m-d"),
                                "chance.chanceTitle":Ext.util.Format.date(new Date(Date.parse("12/31/"+new Date().getFullYear())),"Y-m-d")
                            },
                            url:"chance/getAllChanceStateInformation.jsp"
                        })
                    });
                    var west=new Ext.grid.PropertyGrid({
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
                            "报表高度":400,
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
                                        containerID:centerID+"-bar",
                                        width:ps.getById("报表宽度").data.value,
                                        height:ps.getById("报表高度").data.value,
                                        "chance.chanceDate":Ext.util.Format.date(ps.getById("起始日期").data.value,"Y-m-d"),
                                        "chance.chanceTitle":Ext.util.Format.date(ps.getById("终止日期").data.value,"Y-m-d")
                                    },
                                    url:"chance/getAllChanceStateInformation.jsp"
                                })
                            }
                        }]
                    });
                    var content=new Ext.Panel({
                        id:"chance-manager-bar",
                        iconCls:"icon-chart-bar",
                        autoScroll:true,
                        closable:true,
                        title:"机会状态统计",
                        border:false,
                        buttonAlign:"right",
                        viewConfig:{
                            forceFit:true
                        },
                        layout:"border",
                        items:[center,west]
                    });
                    var p=main.add(content);
                    main.setActiveTab(p)
                }
            };
			
            var getChanceStatePieView=function(){
                var tab=Ext.getCmp("chance-manager-statepie");
                if(tab){
                    main.setActiveTab(tab)
                }else{
                    var centerID=Ext.id();var center=new Ext.Panel({
                        id:centerID,
                        border:true,
                        region:"center",
                        autoScroll:true
                    });center.on("render",function(){
                        center.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:centerID+"-pie",
                                width:600,
                                height:400,
                                "chance.chanceDate":Ext.util.Format.date(new Date(Date.parse("01/01/"+new Date().getFullYear())),"Y-m-d"),
                                "chance.chanceTitle":Ext.util.Format.date(new Date(Date.parse("12/31/"+new Date().getFullYear())),"Y-m-d")
                            },
                            url:"chance/getAllChanceStatePieInformation.jsp"
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
                            "报表高度":400,
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
                                        containerID:centerID+"-pie",
                                        width:ps.getById("报表宽度").data.value,
                                        height:ps.getById("报表高度").data.value,
                                        "chance.chanceDate":Ext.util.Format.date(ps.getById("起始日期").data.value,"Y-m-d"),
                                        "chance.chanceTitle":Ext.util.Format.date(ps.getById("终止日期").data.value,"Y-m-d")
                                    },
                                    url:"chance/getAllChanceStatePieInformation.jsp"
                                })
                            }
                        }]
                    });var content=new Ext.Panel({
                        id:"chance-manager-statepie",
                        iconCls:"icon-chart-pie",
                        autoScroll:true,
                        closable:true,
                        title:"机会状态统计",
                        border:false,
                        buttonAlign:"right",
                        viewConfig:{
                            forceFit:true
                        },
                        layout:"border",
                        items:[center,west]
                    });var p=main.add(content);main.setActiveTab(p)
                }
            };
            
            
            grid.on("rowdblclick",updateChanceView);
            var chanceContextMenu;grid.on("rowcontextmenu",function(grid,rowindex,e){
                grid.getSelectionModel().selectRow(rowindex,false);
                if(!chanceContextMenu){
                    chanceContextMenu=new Ext.menu.Menu([{
                        text:"添加销售机会",
                        handler:insertChanceView
                    },{
                        text:"更新销售机会",
                        handler:updateChanceView
                    },"-",{
                        text:"创建报价单",
                        handler:genOfferView
                    },{
                        text:"创建订单",
                        handler:genOrderView
                    },"-",{
                        text:"删除销售机会",
                        handler:removeChanceView
                    }])
                }
                chanceContextMenu.showAt(e.getPoint());e.stopEvent()
            });
            var main=new Ext.TabPanel({
                id:"chance-manager-body",
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
                    closable:false,
                    title:"销售机会列表",
                    autoScroll:true,
                    layout:"fit",
                    items:grid,
                    iconCls:"chance-manager-icon"
                }]
            });
            win=desktop.createWindow({
                id:this.moduleId,
                title:SliverData.chanceManager.title,
                width:winWidth,
                height:winHeight,
                x:desktop.getWinX(winWidth),
                y:desktop.getWinY(winHeight),
                iconCls:"chance-manager-icon",
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                minimizable:true,
                maximizable:true,
                border:false,
                layout:"border",
                tbar:["-",{
                    tooltip:"新增销售机会",
                    iconCls:"chance-manager-icon-add",
                    handler:insertChanceView
                },{
                    tooltip:"查看销售机会",
                    iconCls:"chance-manager-icon",
                    handler:updateChanceView
                },{
                    tooltip:"删除选中的销售机会",
                    iconCls:"chance-manager-icon-remove",
                    handler:removeChanceView
                },"-",{
                    tooltip:"销售机会数量统计",
                    iconCls:"icon-chart-bar",
                    handler:getChanceStateView
                },{
                    tooltip:"销售机会概率统计",
                    iconCls:"icon-chart-pie",
                    handler:getChanceStatePieView
                },"-",{
                    tooltip:"为销售机会创建报价单",
                    iconCls:"icon-offer-add",
                    handler:genOfferView
                },{
                    tooltip:"为销售机会创建订单",
                    iconCls:"icon-order-add",
                    handler:genOrderView
                },"-",{
                    tooltip:"添加客户",
                    iconCls:"icon-customer",
                    handler:function(){
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
                                    "contactGroup.groupID":"",
                                    containerID:temp.body.id
                                },
                                url:"chance/insertCustomerByAllView.action"
                            })
                        });var p=main.add(temp);main.setActiveTab(p)
                    }
                },{
                    tooltip:"添加目录",
                    iconCls:"icon-group",
                    handler:function(){
                        Ext.Ajax.request({
                            url:"customer/insertGroupView.action",
                            method:"post",
                            params:{
                                "contactGroup.groupID":""
                            },
                            success:function(response){
                                eval(response.responseText)
                            }
                        })
                    }
                },{
                    tooltip:"添加联系人",
                    iconCls:"icon-contact",
                    handler:function(){
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
                                    "contactGroup.groupID":"",
                                    containerID:temp.body.id
                                },
                                url:"chance/insertContactByAllView.action"
                            })
                        });var p=main.add(temp);main.setActiveTab(p)
                    }
                }],
                items:main,
                taskbuttonTooltip:SliverData.chanceManager.tooltip
            })
        }
        win.show()
    }
});
