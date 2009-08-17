//~~
Sliver.ComplainManager=Ext.extend(Ext.app.Module,{
    moduleType:"complain",
    moduleId:"complain-manager",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"icon-tag",
            scope:this,
            shortcutIconCls:"customer-complain-shortcut",
            text:"客户投诉",
            tooltip:"<b>客户投诉</b><br />客户投诉记录处理"
        }
    },
    createWindow:function(){
        var X=this.app.getDesktop();var E=X.getWindow(this.moduleId);if(!E){
            var Q=X.getWinWidth()/1.1;var C=X.getWinHeight()/1.1;var H=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"complain/listComplain.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"list",
                    totalProperty:"total",
                    id:"complainID",
                    fields:["complainID","complainDate","complainDescription","complainID","complainTitle","productionID","productionSerial","productionName","customerID","customerName","contactID","contactName","contactGender","contactPhone","contactAddress","complainState","complainResult"]
                }),
                remoteSort:true
            });H.setDefaultSort("complainID","DESC");var N=new Ext.grid.RowExpander({
                tpl:new Ext.Template("<p><b>描述 : </b>{complainDescription}</p>")
            });var V=new Ext.form.ComboBox({
                store:new Ext.data.SimpleStore({
                    fields:["complainState"],
                    data:SliverData.complainState
                }),
                fieldLabel:"状态",
                displayField:"complainState",
                editable:false,
                emptyText:SliverData.complainState[0],
                mode:"local",
                anchor:"95%",
                triggerAction:"all",
                selectOnFocus:true,
                name:"complain.complainState"
            });var J=new Ext.form.ComboBox({
                store:new Ext.data.SimpleStore({
                    fields:["complainResult"],
                    data:SliverData.result
                }),
                fieldLabel:"结果",
                displayField:"complainResult",
                editable:false,
                anchor:"95%",
                mode:"local",
                triggerAction:"all",
                selectOnFocus:true,
                name:"complain.complainResult"
            });function R(b){
                return Ext.util.Format.ellipsis(b,12)
            }function W(b){
                return Ext.util.Format.ellipsis(b,15)
            }function K(b){
                return Ext.util.Format.ellipsis(b,15)
            }var L=new Ext.grid.ColumnModel([N,{
                    header:"编号",
                    dataIndex:"complainID",
                    width:30
                },{
                    header:"产品编号",
                    hidden:true,
                    dataIndex:"productionSerial",
                    width:60
                },{
                    header:"产品名称",
                    hidden:true,
                    dataIndex:"productionName",
                    width:60
                },{
                    header:"主题",
                    dataIndex:"complainTitle",
                    renderer:R,
                    width:120
                },{
                    header:"客户",
                    dataIndex:"customerName",
                    renderer:W,
                    width:90
                },{
                    header:"投诉人",
                    dataIndex:"contactName",
                    width:60
                },{
                    header:"性别",
                    renderer:SliverUtil.renderGender,
                    dataIndex:"contactGender",
                    width:30
                },{
                    header:"联系方式",
                    dataIndex:"contactPhone",
                    width:80
                },{
                    header:"地址",
                    hidden:true,
                    dataIndex:"contactAddress",
                    renderer:K,
                    width:120
                },{
                    header:"日期",
                    dataIndex:"complainDate",
                    width:60
                },{
                    header:"状态",
                    align:"right",
                    editor:V,
                    dataIndex:"complainState",
                    width:50
                },{
                    header:"结果",
                    align:"right",
                    editor:J,
                    dataIndex:"complainResult",
                    width:50
                }]);L.defaultSortable=true;var Y={
                "complain.complainDate":"",
                "complain.complainTitle":"",
                "complain.productionSerial":"",
                "complain.productionName":"",
                "complain.customerName":"",
                "complain.contactName":"",
                "complain.contactPhone":"",
                "complain.contactAddress":""
            };var a=new Ext.menu.Menu({
                items:[{
                        text:"投诉日期",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"complain.complainDate")
                        }
                    },{
                        text:"标题",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"complain.complainTitle")
                        }
                    },{
                        text:"产品编号",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"complain.productionSerial")
                        }
                    },{
                        text:"产品名称",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"complain.productionName")
                        }
                    },{
                        text:"客户名称",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"complain.customerName")
                        }
                    },{
                        text:"联系人",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"complain.contactName")
                        }
                    },{
                        text:"联系方式",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"complain.contactPhone")
                        }
                    },{
                        text:"地址",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"complain.contactAddress")
                        }
                    }]
            });function O(b,c){
                if(b===true){
                    Y[c]=""
                }else{
                    Y[c]=null
                }
            }var I=new Ext.form.TextField({});var T=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==Y["complain.complainDate"]){
                        Y["complain.complainDate"]=I.getValue()
                    }if(null!==Y["complain.complainTitle"]){
                        Y["complain.complainTitle"]=I.getValue()
                    }if(null!==Y["complain.productionSerial"]){
                        Y["complain.productionSerial"]=I.getValue()
                    }if(null!==Y["complain.productionName"]){
                        Y["complain.productionName"]=I.getValue()
                    }if(null!==Y["complain.customerName"]){
                        Y["complain.customerName"]=I.getValue()
                    }if(null!==Y["complain.contactName"]){
                        Y["complain.contactName"]=I.getValue()
                    }if(null!==Y["complain.contactPhone"]){
                        Y["complain.contactPhone"]=I.getValue()
                    }if(null!==Y["complain.contactAddress"]){
                        Y["complain.contactAddress"]=I.getValue()
                    }H.baseParams=Y;H.setDefaultSort("complainID","DESC");H.load({
                        params:{
                            start:0,
                            limit:B.getPageSize()
                        }
                    })
                }
            });var M=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    I.reset();H.baseParams={};H.setDefaultSort("complainID","DESC");H.load({
                        params:{
                            start:0,
                            limit:B.getPageSize()
                        }
                    })
                }
            });var U=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });var B=new Ext.ux.Andrie.pPageSize();var A=new Ext.grid.EditorGridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:H,
                cm:L,
                sm:U,
                plugins:N,
                loadMask:true,
                clicksToEdit:1,
                bbar:new Ext.PagingToolbar({
                    plugins:B,
                    pageSize:20,
                    store:H,
                    displayInfo:true,
                    items:["-",{
                            text:"搜索范围",
                            menu:a
                        },I,T,M]
                })
            });A.on("beforeedit",function(b){
                U.selectRow(b.row)
            });A.on("afteredit",function(c){
                var b=U.getSelected();if(b){
                    Ext.Ajax.request({
                        url:"complain/updateComplain.action",
                        params:{
                            "complain.complainID":b.data.complainID,
                            "complain.contactName":b.data.contactName,
                            "complain.contactGender":b.data.contactGender,
                            "complain.contactPhone":b.data.contactPhone,
                            "complain.complainDate":b.data.complainDate,
                            "complain.complainTitle":b.data.complainTitle,
                            "complain.complainDescription":b.data.complainDescription,
                            "complain.complainState":b.data.complainState,
                            "complain.complainResult":b.data.complainResult
                        },
                        method:"post",
                        success:function(d){}
                    })
                }
            });A.on("render",function(){
                H.load({
                    params:{
                        start:0,
                        limit:B.getPageSize()
                    }
                })
            });var Z=function(){
                var b=U.getSelected();if(b){
                    var d=G.id+"-complain-"+b.data.complainID;var c=G.getComponent(d);if(!c){
                        var c=new Ext.Panel({
                            id:d,
                            iconCls:"icon-tag",
                            autoScroll:true,
                            title:"客诉"+b.data.complainID,
                            closable:true
                        });c.on("render",function(){
                            c.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "complain.complainID":b.data.complainID,
                                    containerID:c.body.id
                                },
                                url:"complain/getComplain.action"
                            })
                        });var e=G.add(c);G.setActiveTab(e)
                    }else{
                        c.setTitle("客诉"+b.data.complainID);c.setIconClass("icon-tag");c.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "complain.complainID":b.data.complainID,
                                containerID:c.body.id
                            },
                            url:"complain/getComplain.action"
                        });G.setActiveTab(c)
                    }
                }
            };var S=function(){
                var b=U.getSelected();if(b){
                    var d=G.id+"-complain-"+b.data.complainID;var c=G.getComponent(d);if(!c){
                        var c=new Ext.Panel({
                            id:d,
                            iconCls:"icon-tag",
                            autoScroll:true,
                            title:"客诉"+b.data.complainID,
                            closable:true
                        });c.on("render",function(){
                            c.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "complain.complainID":b.data.complainID,
                                    containerID:c.body.id
                                },
                                url:"complain/updateComplainView.action"
                            })
                        });var e=G.add(c);G.setActiveTab(e)
                    }else{
                        c.setTitle("客诉"+b.data.complainID);c.setIconClass("icon-tag");c.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "complain.complainID":b.data.complainID,
                                containerID:c.body.id
                            },
                            url:"complain/updateComplainView.action"
                        });G.setActiveTab(c)
                    }
                }
            };var D=function(){
                var c=G.id+"-complain-"+Ext.id();var b=new Ext.Panel({
                    id:c,
                    iconCls:"icon-tag-add",
                    autoScroll:true,
                    title:"新投诉",
                    closable:true
                });b.on("render",function(){
                    b.load({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:b.body.id
                        },
                        url:"complain/insertComplainView.action"
                    })
                });var d=G.add(b);G.setActiveTab(d)
            };var F=function(){
                var b=U.getSelected();if(b){
                    Ext.MessageBox.confirm("删除客户投诉","您确定要删除客户投诉?",function(c){
                        if(c=="yes"){
                            Ext.Ajax.request({
                                url:"complain/removeComplain.action",
                                method:"post",
                                params:{
                                    "complain.complainID":b.data.complainID
                                },
                                success:function(e){
                                    var d=Ext.decode(e.responseText);if(true===d.success){
                                        H.remove(b)
                                    }
                                }
                            })
                        }
                    })
                }
            };A.on("rowdblclick",Z);var P;A.on("rowcontextmenu",function(c,b,d){
                c.getSelectionModel().selectRow(b,false);if(!P){
                    P=new Ext.menu.Menu([{
                            text:"添加客户投诉",
                            handler:D
                        },{
                            text:"更新客户投诉",
                            handler:S
                        },{
                            text:"查看客户投诉",
                            handler:Z
                        },"-",{
                            text:"删除客户投诉",
                            handler:F
                        }])
                }P.showAt(d.getPoint());d.stopEvent()
            });var G=new Ext.TabPanel({
                id:"complain-manager-body",
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
                        title:"客户投诉",
                        autoScroll:true,
                        layout:"fit",
                        items:A,
                        iconCls:"icon-tag"
                    }]
            });E=X.createWindow({
                id:this.moduleId,
                title:"客户投诉",
                width:Q,
                height:C,
                x:X.getWinX(Q),
                y:X.getWinY(C),
                iconCls:"icon-tag",
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                minimizable:true,
                maximizable:true,
                border:false,
                layout:"border",
                tbar:["-",{
                        iconCls:"icon-tag-add",
                        tooltip:"新客户投诉记录",
                        handler:D
                    },{
                        iconCls:"icon-tag-edit",
                        tooltip:"更新户投诉记录",
                        handler:S
                    },{
                        iconCls:"icon-tag-remove",
                        tooltip:"删除户投诉记录",
                        handler:F
                    },{
                        iconCls:"icon-tag",
                        tooltip:"浏览客户投诉记录",
                        handler:Z
                    }],
                items:G,
                taskbuttonTooltip:"<b>客户投诉</b><br />客户投诉记录处理"
            })
        }E.show()
    }
});
