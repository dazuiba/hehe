Sliver.ServeManager=Ext.extend(Ext.app.Module,{
    moduleType:"serve",
    moduleId:"serve-manager",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"icon-script",
            scope:this,
            shortcutIconCls:"serve-shortcut",
            text:"售后服务",
            tooltip:"<b>售后服务</b><br />售后服务记录处理"
        }
    },
    createWindow:function(){
        var a=this.app.getDesktop();var I=a.getWindow(this.moduleId);if(!I){
            var U=a.getWinWidth()/1.1;var E=a.getWinHeight()/1.1;var L=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"serve/listServe.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"list",
                    totalProperty:"total",
                    id:"serveID",
                    fields:["serveID","serveDate","serveTitle","serveType","serveEngineer","serveDescription","productionID","productionSerial","productionName","customerID","customerName","contactID","contactName","contactGender","contactPhone","contactAddress","serveSkill","serveAttitude","serveResult","serveAdvice"]
                }),
                remoteSort:true
            });L.setDefaultSort("serveID","DESC");var Q=new Ext.grid.RowExpander({
                tpl:new Ext.Template("<p><b>描述 : </b>{serveDescription}</p>","<p><b>建议 : </b>{serveAdvice}</p>")
            });var S=new Ext.form.ComboBox({
                store:new Ext.data.SimpleStore({
                    fields:["serveType"],
                    data:SliverData.serveType
                }),
                fieldLabel:"状态",
                displayField:"serveType",
                editable:false,
                emptyText:SliverData.complainState[0],
                mode:"local",
                anchor:"95%",
                triggerAction:"all",
                selectOnFocus:true,
                name:"serve.serveType"
            });var M=new Ext.form.ComboBox({
                store:new Ext.data.SimpleStore({
                    fields:["serveResult"],
                    data:SliverData.result
                }),
                fieldLabel:"结果",
                displayField:"serveResult",
                editable:false,
                anchor:"95%",
                mode:"local",
                triggerAction:"all",
                selectOnFocus:true,
                name:"serve.serveResult"
            });var b=new Ext.form.ComboBox({
                store:new Ext.data.SimpleStore({
                    fields:["serveSkill"],
                    data:SliverData.result
                }),
                fieldLabel:"专业技术",
                displayField:"serveSkill",
                editable:false,
                anchor:"95%",
                mode:"local",
                triggerAction:"all",
                selectOnFocus:true,
                name:"serve.serveSkill"
            });var T=new Ext.form.ComboBox({
                store:new Ext.data.SimpleStore({
                    fields:["serveAttitude"],
                    data:SliverData.result
                }),
                fieldLabel:"结果",
                displayField:"serveAttitude",
                editable:false,
                anchor:"95%",
                mode:"local",
                triggerAction:"all",
                selectOnFocus:true,
                name:"serve.serveAttitude"
            });function W(e){
                return Ext.util.Format.ellipsis(e,12)
            }function Z(e){
                return Ext.util.Format.ellipsis(e,15)
            }function N(e){
                return Ext.util.Format.ellipsis(e,15)
            }function R(e){
                return Ext.util.Format.ellipsis(e,8)
            }var O=new Ext.grid.ColumnModel([Q,{
                    header:"编号",
                    dataIndex:"serveID",
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
                    dataIndex:"serveTitle",
                    renderer:W,
                    width:100
                },{
                    header:"客户",
                    dataIndex:"customerName",
                    renderer:Z,
                    width:100
                },{
                    header:"联系人",
                    dataIndex:"contactName",
                    width:60
                },{
                    header:"性别",
                    align:"center",
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
                    width:120
                },{
                    header:"日期",
                    dataIndex:"serveDate",
                    width:60
                },{
                    header:"人员",
                    hidden:true,
                    dataIndex:"serveEngineer",
                    renderer:R,
                    width:60
                },{
                    header:"类型",
                    align:"right",
                    editor:S,
                    dataIndex:"serveType",
                    width:50
                },{
                    header:'<span style="color:#FF0000;font-weight:bold;">技能</span>',
                    align:"right",
                    editor:b,
                    dataIndex:"serveSkill",
                    width:40
                },{
                    header:'<span style="color:#FF0000;font-weight:bold;">态度</span>',
                    align:"right",
                    editor:T,
                    dataIndex:"serveAttitude",
                    width:40
                },{
                    header:'<span style="color:#FF0000;font-weight:bold;">结果</span>',
                    align:"right",
                    editor:M,
                    dataIndex:"serveResult",
                    width:40
                }]);O.defaultSortable=true;var d={
                "serve.serveDate":"",
                "serve.serveEngineer":"",
                "serve.serveTitle":"",
                "serve.productionSerial":"",
                "serve.productionName":"",
                "serve.customerName":"",
                "serve.contactName":"",
                "serve.contactPhone":"",
                "serve.contactAddress":""
            };var V=new Ext.menu.Menu({
                items:[{
                        text:"投诉日期",
                        checked:true,
                        checkHandler:function(){
                            C(this.checked,"serve.serveDate")
                        }
                    },{
                        text:"标题",
                        checked:true,
                        checkHandler:function(){
                            C(this.checked,"serve.serveTitle")
                        }
                    },{
                        text:"服务人员",
                        checked:true,
                        checkHandler:function(){
                            C(this.checked,"serve.serveEngineer")
                        }
                    },{
                        text:"产品编号",
                        checked:true,
                        checkHandler:function(){
                            C(this.checked,"serve.productionSerial")
                        }
                    },{
                        text:"产品名称",
                        checked:true,
                        checkHandler:function(){
                            C(this.checked,"serve.productionName")
                        }
                    },{
                        text:"客户名称",
                        checked:true,
                        checkHandler:function(){
                            C(this.checked,"serve.customerName")
                        }
                    },{
                        text:"联系人",
                        checked:true,
                        checkHandler:function(){
                            C(this.checked,"serve.contactName")
                        }
                    },{
                        text:"联系方式",
                        checked:true,
                        checkHandler:function(){
                            C(this.checked,"serve.contactPhone")
                        }
                    },{
                        text:"地址",
                        checked:true,
                        checkHandler:function(){
                            C(this.checked,"serve.contactAddress")
                        }
                    }]
            });function C(e,f){
                if(e===true){
                    d[f]=""
                }else{
                    d[f]=null
                }
            }var K=new Ext.form.TextField({});var X=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==d["serve.serveDate"]){
                        d["serve.serveDate"]=K.getValue()
                    }if(null!==d["serve.serveTitle"]){
                        d["serve.serveTitle"]=K.getValue()
                    }if(null!==d["serve.serveEngineer"]){
                        d["serve.serveEngineer"]=K.getValue()
                    }if(null!==d["serve.productionSerial"]){
                        d["serve.productionSerial"]=K.getValue()
                    }if(null!==d["serve.productionName"]){
                        d["serve.productionName"]=K.getValue()
                    }if(null!==d["serve.customerName"]){
                        d["serve.customerName"]=K.getValue()
                    }if(null!==d["serve.contactName"]){
                        d["serve.contactName"]=K.getValue()
                    }if(null!==d["serve.contactPhone"]){
                        d["serve.contactPhone"]=K.getValue()
                    }if(null!==d["serve.contactAddress"]){
                        d["serve.contactAddress"]=K.getValue()
                    }L.baseParams=d;L.setDefaultSort("serveID","DESC");L.load({
                        params:{
                            start:0,
                            limit:25
                        }
                    })
                }
            });var P=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    K.reset();L.baseParams={};L.setDefaultSort("serveID","DESC");L.load({
                        params:{
                            start:0,
                            limit:25
                        }
                    })
                }
            });var Y=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });var D=new Ext.ux.Andrie.pPageSize();var A=new Ext.grid.EditorGridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:L,
                cm:O,
                sm:Y,
                plugins:Q,
                loadMask:true,
                clicksToEdit:1,
                bbar:new Ext.PagingToolbar({
                    plugins:D,
                    pageSize:20,
                    store:L,
                    displayInfo:true,
                    items:["-",{
                            text:"搜索范围",
                            menu:V
                        },K,X,P]
                })
            });A.on("beforeedit",function(f){
                Y.selectRow(f.row)
            });A.on("afteredit",function(g){
                var f=Y.getSelected();if(f){
                    Ext.Ajax.request({
                        url:"serve/updateServe.action",
                        params:{
                            "serve.serveID":f.data.serveID,
                            "serve.contactName":f.data.contactName,
                            "serve.contactGender":f.data.contactGender,
                            "serve.contactPhone":f.data.contactPhone,
                            "serve.serveDate":f.data.serveDate,
                            "serve.serveTitle":f.data.serveTitle,
                            "serve.serveDescription":f.data.serveDescription,
                            "serve.serveType":f.data.serveType,
                            "serve.serveSkill":f.data.serveSkill,
                            "serve.serveAttitude":f.data.serveAttitude,
                            "serve.serveResult":f.data.serveResult
                        },
                        method:"post",
                        success:function(e){}
                    })
                }
            });A.on("render",function(){
                L.load({
                    params:{
                        start:0,
                        limit:25
                    }
                })
            });var G=function(){
                var e=Y.getSelected();if(e){
                    var g=J.id+"-serve-"+e.data.serveID;var f=J.getComponent(g);if(!f){
                        var f=new Ext.Panel({
                            id:g,
                            iconCls:"icon-script",
                            autoScroll:true,
                            title:"售后服务"+e.data.serveID,
                            closable:true
                        });f.on("render",function(){
                            f.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "serve.serveID":e.data.serveID,
                                    containerID:f.body.id
                                },
                                url:"serve/getServe.action"
                            })
                        });var h=J.add(f);J.setActiveTab(h)
                    }else{
                        f.setTitle("售后服务"+e.data.serveID);f.setIconClass("icon-script");f.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "serve.serveID":e.data.serveID,
                                containerID:f.body.id
                            },
                            url:"serve/getServe.action"
                        });J.setActiveTab(f)
                    }
                }
            };var B=function(){
                var e=Y.getSelected();if(e){
                    var g=J.id+"-serve-"+e.data.serveID;var f=J.getComponent(g);if(!f){
                        var f=new Ext.Panel({
                            id:g,
                            iconCls:"icon-script",
                            autoScroll:true,
                            title:"售后服务"+e.data.serveID,
                            closable:true
                        });f.on("render",function(){
                            f.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    "serve.serveID":e.data.serveID,
                                    containerID:f.body.id
                                },
                                url:"serve/updateServeView.action"
                            })
                        });var h=J.add(f);J.setActiveTab(h)
                    }else{
                        f.setTitle("售后服务"+e.data.serveID);f.setIconClass("icon-script");f.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                "serve.serveID":e.data.serveID,
                                containerID:f.body.id
                            },
                            url:"serve/updateServeView.action"
                        });J.setActiveTab(f)
                    }
                }
            };var c=function(){
                var f=J.id+"-serve-"+Ext.id();var e=new Ext.Panel({
                    id:f,
                    iconCls:"icon-script-add",
                    autoScroll:true,
                    title:"新售后服务记录",
                    closable:true
                });e.on("render",function(){
                    e.load({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:e.body.id
                        },
                        url:"serve/insertServeView.action"
                    })
                });var g=J.add(e);J.setActiveTab(g)
            };var F=function(){
                var e=Y.getSelected();if(e){
                    Ext.MessageBox.confirm("产出售后服务","您确定要删除售后服务?",function(f){
                        if(f=="yes"){
                            Ext.Ajax.request({
                                url:"serve/removeServe.action",
                                method:"post",
                                params:{
                                    "serve.serveID":e.data.serveID
                                },
                                success:function(h){
                                    var g=Ext.decode(h.responseText);if(true===g.success){
                                        L.remove(e)
                                    }
                                }
                            })
                        }
                    })
                }
            };A.on("rowdblclick",G);var H;A.on("rowcontextmenu",function(g,f,h){
                g.getSelectionModel().selectRow(f,false);if(!H){
                    H=new Ext.menu.Menu([{
                            text:"添加售后服务",
                            handler:c
                        },{
                            text:"更新售后服务",
                            handler:B
                        },{
                            text:"查看售后服务",
                            handler:G
                        },"-",{
                            text:"删除售后服务",
                            handler:F
                        }])
                }H.showAt(h.getPoint());h.stopEvent()
            });var J=new Ext.TabPanel({
                id:"serve-manager-body",
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
                        title:"售后服务",
                        autoScroll:true,
                        layout:"fit",
                        items:A,
                        iconCls:"icon-script"
                    }]
            });I=a.createWindow({
                id:this.moduleId,
                title:"售后服务",
                width:U,
                height:E,
                x:a.getWinX(U),
                y:a.getWinY(E),
                iconCls:"icon-script",
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                minimizable:true,
                maximizable:true,
                border:false,
                layout:"border",
                tbar:["-",{
                        iconCls:"icon-script-add",
                        tooltip:"新售后服务记录",
                        handler:c
                    },{
                        iconCls:"icon-script-edit",
                        tooltip:"更新售后服务记录",
                        handler:B
                    },{
                        iconCls:"icon-script-remove",
                        tooltip:"删除售后服务记录",
                        handler:F
                    },{
                        iconCls:"icon-script",
                        tooltip:"浏览售后服务记录",
                        handler:G
                    }],
                items:J,
                taskbuttonTooltip:"<b>售后服务</b><br />售后服务记录处理"
            })
        }I.show()
    }
});