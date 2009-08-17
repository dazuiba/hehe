//~~~
Sliver.IMWindow=Ext.extend(Ext.app.Module,{
    moduleType:"system",
    moduleId:"system-im",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"icon-comments",
            scope:this,
            shortcutIconCls:"im-shortcut",
            text:"即时通信",
            tooltip:"<b>及时通讯</b><br />在线交流、发送留言、发送文件"
        }
    },
    createWindow:function(){
        var desktop=this.app.getDesktop();var win=desktop.getWindow(this.moduleId);var runner=new Ext.util.TaskRunner();var onlineUser=new Ext.tree.TreePanel({
            id:"system-onlineuser-list",
            title:"在线用户",
            loader:new Ext.tree.SliverTreeLoader({
                dataUrl:"im/listOnlineUser.action"
            }),
            rootVisible:false,
            lines:false,
            autoScroll:true,
            tools:[{
                    id:"refresh",
                    on:{
                        click:function(){
                            var tree=Ext.getCmp("system-onlineuser-list");tree.body.mask("Loading","x-mask-loading");setTimeout(function(){
                                tree.body.unmask();tree.root.reload()
                            },1000)
                        }
                    }
                }],
            tbar:[{
                    tooltip:"刷新",
                    iconCls:"icon-reload",
                    handler:function(){
                        onlineUser.getRootNode().reload()
                    }
                },"-",{
                    iconCls:"icon-expand-all",
                    tooltip:"全部展开",
                    handler:function(){
                        onlineUser.getRootNode().expand(true)
                    }
                },{
                    iconCls:"icon-collapse-all",
                    tooltip:"全部折叠",
                    handler:function(){
                        onlineUser.getRootNode().collapse(true)
                    }
                }],
            root:new Ext.tree.AsyncTreeNode({
                id:"ImOnlieUser-0",
                text:"组织架构",
                draggable:false,
                expanded:true,
                singleClickExpand:true
            })
        });var allUser=new Ext.tree.TreePanel({
            id:"system-user-list",
            title:"所有用户",
            loader:new Ext.tree.SliverTreeLoader({
                dataUrl:"system/listGroupTree.action"
            }),
            rootVisible:false,
            lines:false,
            autoScroll:true,
            tools:[{
                    id:"refresh",
                    on:{
                        click:function(){
                            var tree=Ext.getCmp("system-user-list");tree.body.mask("Loading","x-mask-loading");setTimeout(function(){
                                tree.body.unmask();tree.root.reload()
                            },1000)
                        }
                    }
                }],
            tbar:[{
                    tooltip:"重新加载",
                    iconCls:"icon-reload",
                    handler:function(){
                        userMessage.getRootNode().reload()
                    }
                },"-",{
                    iconCls:"icon-expand-all",
                    tooltip:"全部展开",
                    handler:function(){
                        allUser.getRootNode().expand(true)
                    }
                },{
                    iconCls:"icon-collapse-all",
                    tooltip:"全部折叠",
                    handler:function(){
                        allUser.getRootNode().collapse(true)
                    }
                }],
            root:new Ext.tree.AsyncTreeNode({
                id:"systemImUser-0",
                text:"组织架构",
                draggable:false,
                expanded:true,
                singleClickExpand:true
            })
        });allUser.on("dblclick",function(node,e){
            if(!node.isSelected()){
                node.select()
            }node=allUser.getSelectionModel().getSelectedNode();if(node.isLeaf()){
                e.stopEvent();sendMsgView()
            }
        });var msgContextMenu;allUser.on("contextMenu",function(n,e){
            var sm=allUser.getSelectionModel();if(!n.isSelected()){
                n.select()
            }if(!msgContextMenu){
                msgContextMenu=new Ext.menu.Menu([{
                        id:"expandAllUserMenuItem",
                        text:"展开目录",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.expand()
                            }
                        }
                    },{
                        id:"collapseAllUserMenuItem",
                        text:"关闭目录",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.collapse()
                            }
                        }
                    },"-",{
                        id:"reloadAllUserMenuItem",
                        text:"刷新",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.reload()
                            }
                        }
                    },{
                        id:"listHistoryMsgMenuItem",
                        text:"聊天记录",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                listHistoryMsg(node)
                            }
                        }
                    },"-",{
                        id:"sendMsgMenuItem",
                        text:"发送信息",
                        handler:sendMsgView
                    },{
                        id:"sendFileMenuItem",
                        text:"发送文件",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                Ext.Ajax.request({
                                    url:"im/sendOfflineFileView.jsp",
                                    method:"post",
                                    success:function(response){
                                        eval(response.responseText)
                                    }
                                })
                            }
                        }
                    }])
            }var items=msgContextMenu.items;if(n.isLeaf()){}else{
                items.get("sendMsgMenuItem").setDisabled(true);items.get("expandAllUserMenuItem").setDisabled(n.isExpanded());items.get("collapseAllUserMenuItem").setDisabled(!n.isExpanded())
            }msgContextMenu.showAt(e.getPoint())
        });onlineUser.on("dblclick",function(node,e){
            if(!node.isSelected()){
                node.select()
            }node=onlineUser.getSelectionModel().getSelectedNode();if(true===node.isLeaf()){
                e.stopEvent();sendOnlineMsgView()
            }
        });var onlineMsgContextMenu;onlineUser.on("contextMenu",function(n,e){
            var sm=onlineUser.getSelectionModel();if(!n.isSelected()){
                n.select()
            }if(!onlineMsgContextMenu){
                onlineMsgContextMenu=new Ext.menu.Menu([{
                        id:"expandOnlineUserMenuItem",
                        text:"展开目录",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.expand()
                            }
                        }
                    },{
                        id:"collapseOnlineUserMenuItem",
                        text:"关闭目录",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.collapse()
                            }
                        }
                    },"-",{
                        id:"reloadOnlineUserMenuItem",
                        text:"刷新",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.reload()
                            }
                        }
                    },{
                        id:"listHistoryMsgMenuItem",
                        text:"聊天记录",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                listHistoryMsg(node)
                            }
                        }
                    },"-",{
                        id:"sendOnlineMsgMenuItem",
                        text:"发送信息",
                        handler:sendOnlineMsgView
                    },{
                        id:"sendFileMenuItem",
                        text:"发送文件",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                Ext.Ajax.request({
                                    url:"im/sendOnlineFileView.jsp",
                                    method:"post",
                                    success:function(response){
                                        eval(response.responseText)
                                    }
                                })
                            }
                        }
                    }])
            }var items=onlineMsgContextMenu.items;if(!n.isLeaf()){
                items.get("sendOnlineMsgMenuItem").setDisabled(true);items.get("listHistoryMsgMenuItem").setDisabled(true);items.get("expandOnlineUserMenuItem").setDisabled(n.isExpanded());items.get("collapseOnlineUserMenuItem").setDisabled(!n.isExpanded())
            }onlineMsgContextMenu.showAt(e.getPoint())
        });var sendMsgView=function(){
            Ext.Ajax.request({
                url:"im/sendMessageView.action",
                success:function(response){
                    eval(response.responseText)
                }
            })
        };var sendOnlineMsgView=function(){
            Ext.Ajax.request({
                url:"im/sendOnlineMessageView.action",
                success:function(response){
                    eval(response.responseText)
                }
            })
        };var listHistoryMsg=function(node){
            var sendTo=null;if(node.text.indexOf("(")===-1){
                sendTo=node.text
            }else{
                sendTo=node.text.substring(0,node.text.indexOf("("))
            }Ext.Ajax.request({
                url:"im/listHistoryMsgView.action",
                params:{
                    "msg.msgTo":sendTo
                },
                success:function(response){
                    eval(response.responseText)
                }
            })
        };var getFirstUnReadMsg=function(){
            Ext.Ajax.request({
                url:"im/countUnReadMsg.action",
                success:function(response){
                    var j=Ext.decode(response.responseText);if(j.success===true){
                        if(j.unread>0){
                            Ext.Ajax.request({
                                url:"im/getMessageView.action",
                                success:function(response){
                                    eval(response.responseText);countUnReadMessage()
                                }
                            })
                        }
                    }
                }
            })
        };var countUnReadMessage=function(){
            Ext.Ajax.request({
                url:"im/countUnReadMsg.action",
                method:"post",
                params:{
                    dc:1222297382
                },
                success:function(response){
                    var j=Ext.decode(response.responseText);if(j.success===true){
                        unReadMsgButton.setText("("+j.unread+")");if(0<j.unread){
                            unReadMsgButton.setIconClass("icon-messages");soundManager.play("msg")
                        }else{
                            unReadMsgButton.setIconClass("icon-comments")
                        }
                    }
                }
            })
        };var unReadMsgButton=new Ext.Button({
            tooltip:"新留言",
            iconCls:"icon-comments",
            text:"(0)",
            handler:getFirstUnReadMsg
        });if(!win){
            win=desktop.createWindow({
                id:this.moduleId,
                title:"即时通信",
                width:250,
                height:500,
                iconCls:"icon-comments",
                shim:false,
                border:false,
                animCollapse:false,
                constrainHeader:true,
                maximizable:false,
                taskbuttonTooltip:"<b>即时通信</b><br />在线交流、发送留言、发送文件",
                tbar:["-",unReadMsgButton],
                layout:"accordion",
                layoutConfig:{
                    animate:false
                },
                items:[onlineUser,allUser]
            })
        }var countTask={
            run:countUnReadMessage,
            interval:5000
        };runner.start(countTask);win.on("beforeclose",function(){
            runner.stopAll()
        });win.show()
    }
});