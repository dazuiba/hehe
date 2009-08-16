
//~~
Sliver.UserManager=Ext.extend(Ext.app.Module,{
    moduleType:"system",
    moduleId:"user-manager",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"icon-user",
            scope:this,
            shortcutIconCls:"user-shortcut",
            text:"用户管理",
            tooltip:"<b>用户管理</b><br />系统用户管理"
        }
    },
    createWindow:function(){
        var desktop=this.app.getDesktop();var win=desktop.getWindow(this.moduleId);if(!win){
            var winWidth=desktop.getWinWidth()/1.1;var winHeight=desktop.getWinHeight()/1.1;var grouptree=new Ext.tree.TreePanel({
                useArrows:true,
                autoScroll:true,
                animate:true,
                dropConfig:{
                    appendOnly:true
                },
                enableDD:true,
                containerScroll:true,
                rootVisible:true,
                loader:new Ext.tree.SliverTreeLoader({
                    dataUrl:"system/listGroupTree.action"
                }),
                root:new Ext.tree.AsyncTreeNode({
                    id:"group-0",
                    text:"组织架构",
                    draggable:false,
                    expanded:true,
                    singleClickExpand:false
                }),
                tbar:[{
                        tooltip:"重新加载",
                        iconCls:"icon-reload",
                        handler:function(){
                            grouptree.getRootNode().reload()
                        }
                    },"-",{
                        iconCls:"icon-expand-all",
                        tooltip:"全部展开",
                        handler:function(){
                            grouptree.getRootNode().expand(true)
                        }
                    },{
                        iconCls:"icon-collapse-all",
                        tooltip:"全部折叠",
                        handler:function(){
                            grouptree.getRootNode().collapse(true)
                        }
                    }],
                region:"west",
                collapseMode:"mini",
                autoScroll:true,
                collapsible:true,
                margins:"0 0 0 0",
                split:true,
                border:true,
                width:parseFloat(winWidth*0.3)<201?parseFloat(winWidth*0.3):200
            });var store=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"system/listUserRecord.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"list",
                    totalProperty:"total",
                    id:"recordID",
                    fields:["recordID","userName","recordIP","recordStatus","recordDatetime","ipCountry","ipLocal"]
                }),
                remoteSort:false
            });store.setDefaultSort("recordID","DESC");function renderStatus(v){
                if(v===true){
                    return'<span style="font-weight:bold;color:green">登陆</span>'
                }else{
                    return'<span style="font-weight:bold;color:red">退出</span>'
                }
            }var cm=new Ext.grid.ColumnModel([{
                    header:"序号",
                    dataIndex:"recordID",
                    width:40
                },{
                    header:"用户名",
                    dataIndex:"userName",
                    width:40
                },{
                    header:"状态",
                    dataIndex:"recordStatus",
                    renderer:renderStatus,
                    width:40
                },{
                    align:"right",
                    header:"IP地址",
                    dataIndex:"recordIP",
                    width:60
                },{
                    header:"地域",
                    dataIndex:"ipCountry",
                    width:100
                },{
                    header:"类型",
                    dataIndex:"ipLocal",
                    width:100
                },{
                    align:"right",
                    header:"时间",
                    dataIndex:"recordDatetime",
                    width:60
                }]);cm.defaultSortable=true;var filterRecord=function(){
                grid.reconfigure(store,cm);store.baseParams={
                    userName:filterField.getValue()
                };store.setDefaultSort("recordID","DESC");store.load({
                    params:{
                        start:0,
                        limit:pageSizePlugin.getPageSize()
                    }
                })
            };var filterField=new Ext.form.TextField({});var filterButton=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:filterRecord
            });var clearButton=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    filterField.reset();store.baseParams={
                        userName:""
                    };store.reload()
                }
            });var pageSizePlugin=new Ext.ux.Andrie.pPageSize();var grid=new Ext.grid.GridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:store,
                cm:cm,
                sm:new Ext.grid.RowSelectionModel({
                    singleSelect:true
                }),
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:pageSizePlugin,
                    pageSize:20,
                    store:store,
                    displayInfo:true,
                    displayMsg:"显示 {0} - {1} 共{2}",
                    emptyMsg:"",
                    items:["-","过滤用户",filterField,filterButton,clearButton]
                })
            });grid.on("render",function(){
                store.load({
                    params:{
                        start:0,
                        limit:pageSizePlugin.getPageSize()
                    }
                })
            });grid.on("contextmenu",function(e){
                e.stopEvent()
            });var ustore=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"system/listUser.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"list",
                    totalProperty:"total",
                    id:"userID",
                    fields:["userID","userName","userGender","userBirthdate","userRole","groupName","userPhone","userMobile","userEmail"]
                }),
                remoteSort:true
            });ustore.setDefaultSort("userID","ASC");var ucm=new Ext.grid.ColumnModel([{
                    header:"编号",
                    dataIndex:"userID",
                    width:40
                },{
                    header:"用户名",
                    dataIndex:"userName",
                    width:80
                },{
                    header:"性别",
                    dataIndex:"userGender",
                    renderer:SliverUtil.renderGender,
                    width:40
                },{
                    header:"出生日期",
                    dataIndex:"userBirthdate",
                    width:60
                },{
                    header:"职位",
                    dataIndex:"userRole",
                    width:60
                },{
                    header:"部门",
                    dataIndex:"groupName",
                    width:60
                },{
                    header:"电话",
                    dataIndex:"userPhone",
                    widht:60
                },{
                    header:"移动电话",
                    hidden:true,
                    dataIndex:"userMobile",
                    width:60
                },{
                    header:"电子邮件",
                    dataIndex:"userEmail",
                    width:100
                }]);ucm.defaultSortable=true;var filterUserParams={
                "user.userName":"",
                "user.userBirthdate":"",
                "user.userRole":"",
                "user.groupID":"",
                "user.groupName":"",
                "user.userPhone":"",
                "user.userMobile":"",
                "user.userEmail":""
            };var userGridFilterMenu=new Ext.menu.Menu({
                id:"userGridFilterMenu",
                items:[{
                        text:"帐户",
                        checked:true,
                        checkHandler:function(){
                            operateUserGridParams(this.checked,"user.userName")
                        }
                    },{
                        text:"出生日期",
                        checked:true,
                        checkHandler:function(){
                            operateUserGridParams(this.checked,"user.userBirthdate")
                        }
                    },{
                        text:"职位",
                        checked:true,
                        checkHandler:function(){
                            operateUserGridParams(this.checked,"user.userRole")
                        }
                    },{
                        text:"部门",
                        checked:true,
                        checkHandler:function(){
                            operateUserGridParams(this.checked,"user.groupName")
                        }
                    },{
                        text:"电话",
                        checked:true,
                        checkHandler:function(){
                            operateUserGridParams(this.checked,"user.userPhone")
                        }
                    },{
                        text:"移动电话",
                        checked:true,
                        checkHandler:function(){
                            operateUserGridParams(this.checked,"user.userMobile")
                        }
                    },{
                        text:"电子邮件",
                        checked:true,
                        checkHandler:function(){
                            operateUserGridParams(this.checked,"user.userEmail")
                        }
                    }]
            });function operateUserGridParams(status,name){
                if(status===true){
                    filterUserParams[name]=""
                }else{
                    filterUserParams[name]=null
                }
            }var filterUserButton=new Ext.Button({
                iconCls:"icon-search",
                tooltip:"开始搜索",
                handler:function(){
                    if(null!==filterUserParams["user.userName"]){
                        filterUserParams["user.userName"]=filterUserField.getValue()
                    }if(null!==filterUserParams["user.userBirthdate"]){
                        filterUserParams["user.userBirthdate"]=filterUserField.getValue()
                    }if(null!==filterUserParams["user.userRole"]){
                        filterUserParams["user.userRole"]=filterUserField.getValue()
                    }if(null!==filterUserParams["user.groupName"]){
                        filterUserParams["user.groupName"]=filterUserField.getValue()
                    }if(null!==filterUserParams["user.userPhone"]){
                        filterUserParams["user.userPhone"]=filterUserField.getValue()
                    }if(null!==filterUserParams["user.userMobile"]){
                        filterUserParams["user.userMobile"]=filterUserField.getValue()
                    }if(null!==filterUserParams["user.userEmail"]){
                        filterUserParams["user.userEmail"]=filterUserField.getValue()
                    }ustore.baseParams=filterUserParams;ustore.setDefaultSort("userID","ASC");ustore.load({
                        params:{
                            start:0,
                            limit:uPageSizePlugin.getPageSize()
                        }
                    })
                }
            });var filterUserField=new Ext.form.TextField({});var clearUserButton=new Ext.Button({
                iconCls:"icon-clear",
                tooltip:"清空",
                handler:function(){
                    filterUserField.reset();ustore.baseParams={};ustore.setDefaultSort("userID","ASC");ustore.load({
                        params:{
                            start:0,
                            limit:uPageSizePlugin.getPageSize()
                        }
                    })
                }
            });var ugridsm=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });var loadUserGridView=function(){
                var record=ugridsm.getSelected();if(record){
                    var tabID=main.id+"-"+record.data.userID;var tab=main.getComponent(tabID);if(tab){
                        tab.setTitle(record.data.userName);tab.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                userID:record.data.userID,
                                containerID:tab.body.id
                            },
                            url:"system/getUserByIDView.action"
                        });main.setActiveTab(tab)
                    }else{
                        var temp=new Ext.Panel({
                            id:tabID,
                            autoScroll:true,
                            iconCls:"icon-user",
                            title:record.data.userName,
                            closable:true
                        });temp.on("render",function(){
                            temp.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    userID:record.data.userID,
                                    containerID:temp.body.id
                                },
                                url:"system/getUserByIDView.action"
                            })
                        });var p=main.add(temp);main.setActiveTab(p)
                    }
                }
            };var updateUserGridView=function(){
                var record=ugridsm.getSelected();if(record){
                    var tabID=main.id+"-"+record.data.userID;var tab=main.getComponent(tabID);if(tab){
                        tab.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                userID:record.data.userID,
                                containerID:tab.body.id
                            },
                            url:"system/updateUserView.action"
                        });main.setActiveTab(tab)
                    }else{
                        var temp=new Ext.Panel({
                            id:tabID,
                            autoScroll:true,
                            iconCls:"icon-user",
                            title:record.data.userName,
                            closable:true
                        });temp.on("render",function(){
                            temp.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    userID:record.data.userID,
                                    containerID:temp.body.id
                                },
                                url:"system/updateUserView.action"
                            })
                        });var p=main.add(temp);main.setActiveTab(p)
                    }
                }
            };var updateUserModuleGridView=function(){
                var record=ugridsm.getSelected();if(record){
                    var tabID=main.id+"-"+record.data.userID;var tab=main.getComponent(tabID);if(tab){
                        tab.setTitle("["+record.data.userName+"]权限");tab.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                userID:record.data.userID,
                                containerID:tab.body.id
                            },
                            url:"system/updateUserModuleView.action"
                        });main.setActiveTab(tab)
                    }else{
                        var temp=new Ext.Panel({
                            id:tabID,
                            autoScroll:true,
                            iconCls:"icon-user",
                            title:"["+record.data.userName+"]权限",
                            closable:true
                        });temp.on("render",function(){
                            temp.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    userID:record.data.userID,
                                    containerID:temp.body.id
                                },
                                url:"system/updateUserModuleView.action"
                            })
                        });var p=main.add(temp);main.setActiveTab(p)
                    }
                }
            };var removeUserGridView=function(){
                var record=ugridsm.getSelected();if(record){
                    Ext.MessageBox.confirm("删除用户","您确定要删用户 <b>"+record.data.userName+"</b>?",function(btn){
                        if(btn=="yes"){
                            Ext.Ajax.request({
                                url:"system/deleteUser.action",
                                params:{
                                    userID:record.data.userID
                                },
                                success:function(response){
                                    var j=Ext.decode(response.responseText);if(j.success===true){
                                        if(record){
                                            var tabID=main.id+"-"+record.data.userID;var tab=main.getComponent(tabID);if(tab){
                                                main.remove(tab,true)
                                            }ustore.remove(record)
                                        }
                                    }
                                }
                            })
                        }
                    })
                }
            };var uPageSizePlugin=new Ext.ux.Andrie.pPageSize();var ugrid=new Ext.grid.GridPanel({
                border:false,
                viewConfig:{
                    forceFit:true
                },
                store:ustore,
                cm:ucm,
                sm:ugridsm,
                loadMask:true,
                bbar:new Ext.PagingToolbar({
                    plugins:uPageSizePlugin,
                    pageSize:20,
                    store:ustore,
                    displayInfo:true,
                    displayMsg:"显示 {0} - {1} 共{2}",
                    emptyMsg:"",
                    items:["-",{
                            text:"查询范围",
                            menu:userGridFilterMenu
                        },filterUserField,filterUserButton,clearUserButton]
                })
            });ugrid.on("render",function(){
                ustore.load({
                    params:{
                        start:0,
                        limit:uPageSizePlugin.getPageSize()
                    }
                })
            });ugrid.on("rowdblclick",loadUserGridView);var ugridmenu;ugrid.on("rowcontextmenu",function(ugrid,rowindex,e){
                ugrid.getSelectionModel().selectRow(rowindex,false);if(!ugridmenu){
                    ugridmenu=new Ext.menu.Menu([{
                            id:"updateUserGridViewMenu",
                            text:"更新用户",
                            handler:updateUserGridView
                        },{
                            id:"updateUserModuleGridViewMenu",
                            text:"更新用户权限",
                            handler:updateUserModuleGridView
                        },{
                            text:"查看销售业绩",
                            handler:function(){
                                var record=ugridsm.getSelected();if(record){
                                    saleStateView(record.data.userID,record.data.userName)
                                }
                            }
                        },{
                            text:"查看业务数量",
                            handler:function(){
                                var record=ugridsm.getSelected();if(record){
                                    orderStateView(record.data.userID,record.data.userName)
                                }
                            }
                        },"-",{
                            id:"removeContactRecordGridContextView",
                            text:"删除用户",
                            handler:removeUserGridView
                        }])
                }ugridmenu.showAt(e.getPoint());e.stopEvent()
            });var main=new Ext.TabPanel({
                id:"user-manager-body",
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
                        id:"user-manager-userlist",
                        closable:false,
                        title:"用户列表",
                        autoScroll:true,
                        layout:"fit",
                        items:ugrid,
                        iconCls:"icon-user"
                    },{
                        id:"user-manager-welcome",
                        closable:false,
                        title:"用户记录",
                        autoScroll:true,
                        layout:"fit",
                        items:grid,
                        iconCls:"icon-grid"
                    }]
            });grouptree.on("click",function(node,e){
                if(!node.isSelected()){
                    node.select()
                }if(true!==node.isLeaf()){
                    ustore.setDefaultSort("userID","ASC");ustore.baseParams={
                        "user.groupID":node.id.substring(node.id.lastIndexOf("-")+1)
                    };ustore.load({
                        params:{
                            start:0,
                            limit:20
                        }
                    });main.setActiveTab(main.getComponent("user-manager-userlist"))
                }
            });grouptree.on("dblclick",function(node,e){
                if(!node.isSelected()){
                    node.select()
                }node=sm.getSelectedNode();if(node.isLeaf()){
                    e.stopEvent();loadUser(node)
                }
            });var sm=grouptree.getSelectionModel();var cmenu;grouptree.on("contextMenu",function(n,e){
                if(!n.isSelected()){
                    n.select()
                }if(!cmenu){
                    cmenu=new Ext.menu.Menu([{
                            id:"expandGrouptreeItem",
                            text:"展开",
                            handler:expandNode
                        },{
                            id:"collapseGrouptreeItem",
                            text:"折叠",
                            handler:collapseNode
                        },"-",{
                            id:"reloadGrouptreeNode",
                            text:"刷新",
                            handler:reloadNode
                        },"-",{
                            text:"新建",
                            id:"createInGrouptree",
                            menu:{
                                items:[{
                                        id:"addGroupView",
                                        text:"部门",
                                        handler:insertGroupView
                                    },{
                                        id:"addUserView",
                                        text:"用户",
                                        handler:insertUserView
                                    }]
                            }
                        },{
                            id:"updateGrouptreeItem",
                            text:"修改",
                            handler:updateNode
                        },{
                            id:"updateUserConfig",
                            text:"设置权限",
                            handler:updateUserModule
                        },{
                            id:"userSaleState",
                            text:"销售业绩",
                            handler:function(){
                                var node=sm.getSelectedNode();if(node){
                                    saleStateView(node.id.substring(node.id.lastIndexOf("-")+1),node.text.substring(0,node.text.indexOf("(")))
                                }
                            }
                        },{
                            id:"userOrderState",
                            text:"业务数量",
                            handler:function(){
                                var node=sm.getSelectedNode();if(node){
                                    orderStateView(node.id.substring(node.id.lastIndexOf("-")+1),node.text.substring(0,node.text.indexOf("(")))
                                }
                            }
                        },"-",{
                            id:"deleteGrouptreeItem",
                            text:"删除",
                            handler:deleteNode
                        }])
                }var is=cmenu.items;if(n.isLeaf()){
                    is.get("createInGrouptree").hide();is.get("updateUserConfig").show();is.get("userSaleState").show();is.get("userOrderState").show();is.get("reloadGrouptreeNode").setDisabled(true);is.get("expandGrouptreeItem").setDisabled(true);is.get("collapseGrouptreeItem").setDisabled(true)
                }else{
                    is.get("updateUserConfig").hide();is.get("createInGrouptree").show();is.get("userSaleState").hide();is.get("userOrderState").hide();is.get("reloadGrouptreeNode").setDisabled(false);is.get("expandGrouptreeItem").setDisabled(n.isExpanded());is.get("collapseGrouptreeItem").setDisabled(!n.isExpanded())
                }cmenu.showAt(e.getPoint())
            });grouptree.on("movenode",function(grouptree,node,oldParent,newParent,index){
                if(node){
                    if(node.isLeaf()){
                        moveUser(grouptree,node,oldParent,newParent,index)
                    }else{
                        moveGroup(grouptree,node,oldParent,newParent,index)
                    }
                }
            });function reloadNode(){
                var node=sm.getSelectedNode();if(node){
                    node.reload()
                }else{
                    grouptree.getRootNode().reload();sm.select(grouptree.getRootNode())
                }
            }function expandNode(){
                var node=sm.getSelectedNode();if(node){
                    node.expand()
                }else{
                    grouptree.getRootNode().expand();sm.select(grouptree.getRootNode())
                }
            }function collapseNode(){
                var node=sm.getSelectedNode();if(node){
                    node.collapse()
                }else{
                    grouptree.getRootNode().collapse();sm.select(grouptree.getRootNode())
                }
            }function loadUser(){
                var node=sm.getSelectedNode();if(node){
                    var tabID=main.id+"-"+node.id;var tab=main.getComponent(tabID);if(tab){
                        tab.setTitle(node.text.substring(0,(node.text.indexOf("(")==-1?node.text.length:node.text.indexOf("("))));tab.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                userID:node.id.substring(node.id.lastIndexOf("-")+1),
                                containerID:tab.body.id
                            },
                            url:"system/getUserByIDView.action"
                        });main.setActiveTab(tab)
                    }else{
                        var temp=new Ext.Panel({
                            id:tabID,
                            autoScroll:true,
                            iconCls:"icon-user",
                            title:node.text.substring(0,(node.text.indexOf("(")==-1?node.text.length:node.text.indexOf("("))),
                            closable:true
                        });temp.on("render",function(){
                            temp.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    userID:node.id.substring(node.id.lastIndexOf("-")+1),
                                    containerID:temp.body.id
                                },
                                url:"system/getUserByIDView.action"
                            })
                        });var p=main.add(temp);main.setActiveTab(p)
                    }
                }
            }function updateUserModule(){
                var node=sm.getSelectedNode();if(node){
                    var tabID=main.id+"-"+node.id;var tab=main.getComponent(tabID);if(tab){
                        tab.setTitle("["+node.text.substring(0,(node.text.indexOf("(")==-1?node.text.length:node.text.indexOf("(")))+"]权限");tab.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                userID:node.id.substring(node.id.lastIndexOf("-")+1),
                                containerID:tab.body.id
                            },
                            url:"system/updateUserModuleView.action"
                        });main.setActiveTab(tab)
                    }else{
                        var temp=new Ext.Panel({
                            id:tabID,
                            autoScroll:true,
                            iconCls:"icon-user",
                            title:"["+node.text.substring(0,(node.text.indexOf("(")==-1?node.text.length:node.text.indexOf("(")))+"]权限",
                            closable:true
                        });temp.on("render",function(){
                            temp.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    userID:node.id.substring(node.id.lastIndexOf("-")+1),
                                    containerID:temp.body.id
                                },
                                url:"system/updateUserModuleView.action"
                            })
                        });
                        var p=main.add(temp);main.setActiveTab(p)
                    }
                }
            }
            function insertGroupView(){
                var node=sm.getSelectedNode();if(node){
                    Ext.Ajax.request({
                        url:"system/insertGroupView.action",
                        params:{
                            groupPID:node.id.substring(node.id.lastIndexOf("-")+1)
                        },
                        success:function(response){
                            eval(response.responseText)
                        }
                    })
                }
            }
            
            function insertUserView(){
                var node=sm.getSelectedNode();
                if(node){
                    var tabID=Ext.id();
                    var temp=new Ext.Panel({
                        id:tabID,
                        title:"添加用户",
                        closable:true,
                        autoScroll:true
                    })
                    ;temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                groupID:node.id.substring(node.id.lastIndexOf("-")+1),
                                containerID:tabID
                            },
                            url:"system/insertUserView.action"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }
            }
            var deleteNode=function(){
                var node=sm.getSelectedNode();if(node){
                    if(node.isLeaf()){
                        deleteUser(node)
                    }else{
                        deleteGroup(node)
                    }
                }
            };
            var deleteGroup=function(node){
                Ext.MessageBox.confirm("删除部门","您确定要删除部门 <b>"+node.text+"</b>?<br/>注意：将会删除该部门下的所有部门及用户",function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"system/deleteGroup.action",
                            params:{
                                groupID:node.id.substring(node.id.lastIndexOf("-")+1)
                            },
                            success:function(response){
                                node.remove()
                            }
                        })
                    }
                })
            };
            var deleteUser=function(node){
                Ext.MessageBox.confirm("删除用户","您确定要删用户 <b>"+node.text+"</b>?",function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"system/deleteUser.action",
                            params:{
                                userID:node.id.substring(node.id.lastIndexOf("-")+1)
                            },
                            success:function(response){
                                var j=Ext.decode(response.responseText);if(j.success===true){
                                    if(node){
                                        var tabID=main.id+"-"+node.id;var tab=main.getComponent(tabID);if(tab){
                                            main.remove(tab,true)
                                        }node.remove()
                                    }
                                }
                            }
                        })
                    }
                })
            };var updateNode=function(){
                var node=sm.getSelectedNode();if(node){
                    if(node.isLeaf()){
                        updateUserView(node)
                    }else{
                        updateGroupView(node)
                    }
                }
            };var updateGroupView=function(node){
                Ext.Ajax.request({
                    url:"system/updateGroupView.action",
                    params:{
                        groupID:node.id.substring(node.id.lastIndexOf("-")+1)
                    },
                    success:function(response){
                        eval(response.responseText)
                    }
                })
            };var updateUserView=function(node){
                var tabID=main.id+"-"+node.id;var tab=main.getComponent(tabID);if(tab){
                    tab.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            userID:node.id.substring(node.id.lastIndexOf("-")+1),
                            containerID:tab.body.id
                        },
                        url:"system/updateUserView.action"
                    });main.setActiveTab(tab)
                }else{
                    var temp=new Ext.Panel({
                        id:tabID,
                        autoScroll:true,
                        iconCls:"icon-user",
                        title:node.text,
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                userID:node.id.substring(node.id.lastIndexOf("-")+1),
                                containerID:temp.body.id
                            },
                            url:"system/updateUserView.action"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }
            };var moveGroup=function(grouptree,node,oldParent,newParent,index){
                if(oldParent.id!=newParent.id){
                    Ext.Ajax.request({
                        url:"system/moveGroup.action",
                        params:{
                            groupID:node.id.substring(node.id.lastIndexOf("-")+1),
                            groupPID:newParent.id.substring(node.id.lastIndexOf("-")+1)
                        },
                        success:function(response){
                            var s=Ext.decode(response.responseText);if(s.success){}
                        }
                    })
                }
            };var moveUser=function(grouptree,node,oldParent,newParent,index){
                if(oldParent.id!=newParent.id){
                    Ext.Ajax.request({
                        url:"system/moveUser.action",
                        params:{
                            userID:node.id.substring(node.id.lastIndexOf("-")+1),
                            groupID:newParent.id.substring(newParent.id.lastIndexOf("-")+1)
                        },
                        success:function(response){
                            var s=Ext.decode(response.responseText);if(s.success){
                                var tabID=main.id+"-"+node.id;var tab=main.getComponent(tabID);if(tab){
                                    tab.body.getUpdater().update({
                                        scripts:true,
                                        method:"post",
                                        params:{
                                            userID:node.id.substring(node.id.lastIndexOf("-")+1)
                                        },
                                        url:"system/getUserByIDView.action"
                                    });main.setActiveTab(tab)
                                }
                            }
                        }
                    })
                }
            };var saleStateView=function(userID,userName){
                var tabID=main.id+"-saleState-"+userID;var temp=main.getComponent(tabID);if(!temp){
                    var temp=new Ext.Panel({
                        id:tabID,
                        iconCls:"icon-chart-line",
                        autoScroll:true,
                        title:"("+userName+")销售业绩",
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:temp.body.id,
                                userID:userID,
                                userName:userName
                            },
                            url:"system/userSaleStatePanel.jsp"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }else{
                    temp.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:temp.body.id,
                            userID:userID,
                            userName:userName
                        },
                        url:"system/userSaleStatePanel.jsp"
                    });main.setActiveTab(temp)
                }
            };var orderStateView=function(userID,userName){
                var tabID=main.id+"-orderState-"+userID;var temp=main.getComponent(tabID);if(!temp){
                    var temp=new Ext.Panel({
                        id:tabID,
                        iconCls:"icon-chart-curve",
                        autoScroll:true,
                        title:"("+userName+")业务数量",
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:temp.body.id,
                                userID:userID,
                                userName:userName
                            },
                            url:"system/userOrderStatePanel.jsp"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }else{
                    temp.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            containerID:temp.body.id,
                            userID:userID,
                            userName:userName
                        },
                        url:"system/userOrderStatePanel.jsp"
                    });main.setActiveTab(temp)
                }
            };win=desktop.createWindow({
                id:this.moduleId,
                title:"用户管理",
                width:winWidth,
                height:winHeight,
                x:desktop.getWinX(winWidth),
                y:desktop.getWinY(winHeight),
                iconCls:"icon-user",
                shim:false,
                animCollapse:false,
                constrainHeader:true,
                minimizable:true,
                maximizable:true,
                border:true,
                layout:"border",
                items:[grouptree,main],
                taskbuttonTooltip:"<b>用户管理</b><br />系统用户管理"
            })
        }win.show()
    }
});
