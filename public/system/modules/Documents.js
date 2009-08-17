//~~~
Sliver.Documents=Ext.extend(Ext.app.Module,{
    moduleType:"system",
    moduleId:"system-documents",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"documents-icon",
            scope:this,
            shortcutIconCls:"documents-shortcut",
            text:"我的文档",
            tooltip:"<b>我的文档</b><br />共享文档、我的文档"
        }
    },
    createWindow:function(){
        var desktop=this.app.getDesktop();var win=desktop.getWindow(this.moduleId);var sharedFile=new Ext.tree.TreePanel({
            id:"system-shared-file",
            title:"共享文档",
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
                dataUrl:"file/listSharedFileTree.action"
            }),
            tools:[{
                    id:"refresh",
                    on:{
                        click:function(){
                            var tree=Ext.getCmp("system-shared-file");tree.body.mask("Loading","x-mask-loading");setTimeout(function(){
                                tree.body.unmask();tree.root.reload()
                            },1000)
                        }
                    }
                }],
            tbar:[{
                    tooltip:"重新加载",
                    iconCls:"icon-reload",
                    handler:function(){
                        sharedFile.getRootNode().reload()
                    }
                },"-",{
                    iconCls:"icon-expand-all",
                    tooltip:"全部展开",
                    handler:function(){
                        sharedFile.getRootNode().expand(true)
                    }
                },{
                    iconCls:"icon-collapse-all",
                    tooltip:"全部折叠",
                    handler:function(){
                        sharedFile.getRootNode().collapse(true)
                    }
                }],
            root:new Ext.tree.AsyncTreeNode({
                id:"systemFolder-0",
                text:"共享文档",
                draggable:false,
                expanded:true,
                singleClickExpand:true
            })
        });var userFile=new Ext.tree.TreePanel({
            id:"system-file",
            title:"我的文档",
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
                dataUrl:"file/listUserFileTree.action"
            }),
            tools:[{
                    id:"refresh",
                    on:{
                        click:function(){
                            var tree=Ext.getCmp("system-file");tree.body.mask("Loading","x-mask-loading");setTimeout(function(){
                                tree.body.unmask();tree.root.reload()
                            },1000)
                        }
                    }
                }],
            tbar:[{
                    tooltip:"重新加载",
                    iconCls:"icon-reload",
                    handler:function(){
                        userFile.getRootNode().reload()
                    }
                },"-",{
                    iconCls:"icon-expand-all",
                    tooltip:"全部展开",
                    handler:function(){
                        userFile.getRootNode().expand(true)
                    }
                },{
                    iconCls:"icon-collapse-all",
                    tooltip:"全部折叠",
                    handler:function(){
                        userFile.getRootNode().collapse(true)
                    }
                }],
            root:new Ext.tree.AsyncTreeNode({
                id:"systemFolder-1",
                text:"我的文档",
                draggable:false,
                expanded:true,
                singleClickExpand:true
            })
        });userFile.on("dblclick",function(node,e){
            if(!node.isSelected()){
                node.select()
            }node=userFile.getSelectionModel().getSelectedNode();if(node.isLeaf()){
                e.stopEvent();window.open("file/downloadUserFile.action?file.fileID="+node.id.substring(node.id.lastIndexOf("-")+1))
            }
        });userFile.on("movenode",function(userFile,node,oldParent,newParent,index){
            if(node){
                if(node.isLeaf()){
                    moveUserFile(userFile,node,oldParent,newParent,index)
                }else{
                    moveUserFolder(userFile,node,oldParent,newParent,index)
                }
            }
        });var userFileContextMenu;userFile.on("contextMenu",function(n,e){
            var sm=userFile.getSelectionModel();if(!n.isSelected()){
                n.select()
            }if(!userFileContextMenu){
                userFileContextMenu=new Ext.menu.Menu([{
                        id:"expandUserFileNode",
                        text:"展开目录",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.expand()
                            }
                        }
                    },{
                        id:"collapseUserFileNode",
                        text:"关闭目录",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.collapse()
                            }
                        }
                    },"-",{
                        id:"reloadUserFileNode",
                        text:"刷新",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.reload()
                            }
                        }
                    },"-",{
                        id:"addUserFolderView",
                        text:"创建目录",
                        handler:insertUserFolderView
                    },{
                        id:"addUserFileView",
                        text:"上传文件",
                        handler:insertUserFileView
                    },{
                        id:"updateCategoryItem",
                        text:"重命名",
                        handler:updateUserNode
                    },"-",{
                        id:"deleteCategoryItem",
                        text:"删除",
                        handler:removeUserNode
                    }])
            }var items=userFileContextMenu.items;if(n.isLeaf()){
                items.get("addUserFolderView").hide();items.get("addUserFileView").hide();items.get("reloadUserFileNode").setDisabled(true);items.get("expandUserFileNode").setDisabled(true);items.get("collapseUserFileNode").setDisabled(true)
            }else{
                items.get("addUserFolderView").show();items.get("addUserFileView").show();items.get("reloadUserFileNode").setDisabled(false);items.get("expandUserFileNode").setDisabled(n.isExpanded());items.get("collapseUserFileNode").setDisabled(!n.isExpanded())
            }userFileContextMenu.showAt(e.getPoint())
        });sharedFile.on("dblclick",function(node,e){
            if(!node.isSelected()){
                node.select()
            }node=sharedFile.getSelectionModel().getSelectedNode();if(node.isLeaf()){
                e.stopEvent();window.open("file/downloadSharedFile.action?file.fileID="+node.id.substring(node.id.lastIndexOf("-")+1))
            }
        });sharedFile.on("movenode",function(sharedFile,node,oldParent,newParent,index){
            if(node){
                if(node.isLeaf()){
                    moveSharedFile(sharedFile,node,oldParent,newParent,index)
                }else{
                    moveSharedFolder(sharedFile,node,oldParent,newParent,index)
                }
            }
        });var sharedFileContextMenu;sharedFile.on("contextMenu",function(n,e){
            var sm=sharedFile.getSelectionModel();if(!n.isSelected()){
                n.select()
            }if(!sharedFileContextMenu){
                sharedFileContextMenu=new Ext.menu.Menu([{
                        id:"expandSharedFileNode",
                        text:"展开目录",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.expand()
                            }
                        }
                    },{
                        id:"collapseSharedFileNode",
                        text:"关闭目录",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.collapse()
                            }
                        }
                    },"-",{
                        id:"reloadSharedFileNode",
                        text:"刷新",
                        handler:function(){
                            var node=sm.getSelectedNode();if(node){
                                node.reload()
                            }
                        }
                    },"-",{
                        id:"addSharedFolderView",
                        text:"创建目录",
                        handler:insertSharedFolderView
                    },{
                        id:"addSharedFileView",
                        text:"上传文件",
                        handler:insertSharedFileView
                    },{
                        id:"updateSharedFileView",
                        text:"重命名",
                        handler:updateSharedNode
                    },"-",{
                        id:"removeSharedFile",
                        text:"删除",
                        handler:removeSharedNode
                    }])
            }var items=sharedFileContextMenu.items;if(n.isLeaf()){
                items.get("addSharedFolderView").hide();items.get("addSharedFileView").hide();items.get("reloadSharedFileNode").setDisabled(true);items.get("expandSharedFileNode").setDisabled(true);items.get("collapseSharedFileNode").setDisabled(true)
            }else{
                items.get("addSharedFolderView").show();items.get("addSharedFileView").show();items.get("reloadSharedFileNode").setDisabled(false);items.get("expandSharedFileNode").setDisabled(n.isExpanded());items.get("collapseSharedFileNode").setDisabled(!n.isExpanded())
            }sharedFileContextMenu.showAt(e.getPoint())
        });var updateUserNode=function(){
            var node=userFile.getSelectionModel().getSelectedNode();if(true===node.isLeaf()){
                updateUserFileView(node)
            }else{
                updateUserFolderView(node)
            }
        };var removeUserNode=function(){
            var node=userFile.getSelectionModel().getSelectedNode();if(true===node.isLeaf()){
                removeUserFile(node)
            }else{
                removeUserFolder(node)
            }
        };var insertUserFolderView=function(){
            var node=userFile.getSelectionModel().getSelectedNode();if(node){
                Ext.Ajax.request({
                    url:"file/insertUserFolderView.action",
                    method:"post",
                    params:{
                        "folder.folderID":node.id.substring(node.id.lastIndexOf("-")+1)
                    },
                    success:function(request){
                        eval(request.responseText)
                    }
                })
            }
        };var updateUserFolderView=function(node){
            if(node){
                Ext.Ajax.request({
                    url:"file/updateUserFolderView.action",
                    method:"post",
                    params:{
                        "folder.folderID":node.id.substring(node.id.lastIndexOf("-")+1)
                    },
                    success:function(request){
                        eval(request.responseText)
                    }
                })
            }
        };var removeUserFolder=function(node){
            if(node){
                Ext.MessageBox.confirm("删除目录","您确定删除目录 <b>"+node.text+"</b>?<br/>注意：将会删除该目录下的所有文件",function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"file/removeUserFolder.action",
                            params:{
                                "folder.folderID":node.id.substring(node.id.lastIndexOf("-")+1)
                            },
                            success:function(response){
                                var j=Ext.decode(response.responseText);if(j.success===true){
                                    node.remove()
                                }
                            }
                        })
                    }
                })
            }
        };var moveUserFolder=function(userFile,node,oldParent,newParent,index){
            if(oldParent.id!=newParent.id){
                Ext.Ajax.request({
                    url:"file/updateUserFolderAction.action",
                    params:{
                        "folder.folderID":node.id.substring(node.id.lastIndexOf("-")+1),
                        "folder.folderPID":newParent.id.substring(newParent.id.lastIndexOf("-")+1)
                    },
                    success:function(response){
                        var s=Ext.decode(response.responseText);if(s.success){}
                    }
                })
            }
        };var moveUserFile=function(userFile,node,oldParent,newParent,index){
            if(oldParent.id!=newParent.id){
                Ext.Ajax.request({
                    url:"file/updateUserFileAction.action",
                    params:{
                        "file.fileID":node.id.substring(node.id.lastIndexOf("-")+1),
                        "file.folderID":newParent.id.substring(newParent.id.lastIndexOf("-")+1)
                    },
                    success:function(response){
                        var s=Ext.decode(response.responseText);if(s.success===true){}
                    }
                })
            }
        };var insertUserFileView=function(){
            Ext.Ajax.request({
                url:"file/insertUserFileView.jsp",
                method:"post",
                params:{
                    dc:1222297382
                },
                success:function(response){
                    eval(response.responseText)
                }
            })
        };var updateUserFileView=function(node){
            Ext.Ajax.request({
                url:"file/updateUserFileView.action",
                params:{
                    "file.fileID":node.id.substring(node.id.lastIndexOf("-")+1)
                },
                method:"post",
                success:function(response){
                    eval(response.responseText)
                }
            })
        };var removeUserFile=function(node){
            if(node){
                Ext.MessageBox.confirm("删除文件","您确定删除文件 <b>"+node.text+"</b>?",function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"file/removeUserFile.action",
                            params:{
                                "file.fileID":node.id.substring(node.id.lastIndexOf("-")+1)
                            },
                            success:function(response){
                                var j=Ext.decode(response.responseText);if(j.success===true){
                                    node.remove()
                                }
                            }
                        })
                    }
                })
            }
        };var updateSharedNode=function(){
            var node=sharedFile.getSelectionModel().getSelectedNode();if(true===node.isLeaf()){
                updateSharedFileView(node)
            }else{
                updateSharedFolderView(node)
            }
        };var removeSharedNode=function(){
            var node=sharedFile.getSelectionModel().getSelectedNode();if(true===node.isLeaf()){
                removeSharedFile(node)
            }else{
                removeSharedFolder(node)
            }
        };var insertSharedFolderView=function(){
            var node=sharedFile.getSelectionModel().getSelectedNode();if(node){
                Ext.Ajax.request({
                    url:"file/insertSharedFolderView.action",
                    method:"post",
                    params:{
                        "folder.folderID":node.id.substring(node.id.lastIndexOf("-")+1)
                    },
                    success:function(request){
                        eval(request.responseText)
                    }
                })
            }
        };var updateSharedFolderView=function(node){
            if(node){
                Ext.Ajax.request({
                    url:"file/updateSharedFolderView.action",
                    method:"post",
                    params:{
                        dc:1222297382
                    },
                    params:{
                        "folder.folderID":node.id.substring(node.id.lastIndexOf("-")+1)
                    },
                    success:function(request){
                        eval(request.responseText)
                    }
                })
            }
        };var removeSharedFolder=function(node){
            if(node){
                Ext.MessageBox.confirm("删除目录","您确定删除目录 <b>"+node.text+"</b>?<br/>注意：将会删除该目录下的所有文件",function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"file/removeSharedFolder.action",
                            params:{
                                "folder.folderID":node.id.substring(node.id.lastIndexOf("-")+1)
                            },
                            success:function(response){
                                var j=Ext.decode(response.responseText);if(j.success===true){
                                    node.remove()
                                }
                            }
                        })
                    }
                })
            }
        };var moveSharedFolder=function(sharedFile,node,oldParent,newParent,index){
            if(oldParent.id!=newParent.id){
                Ext.Ajax.request({
                    url:"file/updateSharedFolderAction.action",
                    params:{
                        "folder.folderID":node.id.substring(node.id.lastIndexOf("-")+1),
                        "folder.folderPID":newParent.id.substring(newParent.id.lastIndexOf("-")+1)
                    },
                    success:function(response){
                        var s=Ext.decode(response.responseText);if(s.success){}
                    }
                })
            }
        };var moveSharedFile=function(sharedFile,node,oldParent,newParent,index){
            if(oldParent.id!=newParent.id){
                Ext.Ajax.request({
                    url:"file/updateSharedFileAction.action",
                    params:{
                        "file.fileID":node.id.substring(node.id.lastIndexOf("-")+1),
                        "file.folderID":newParent.id.substring(newParent.id.lastIndexOf("-")+1)
                    },
                    success:function(response){
                        var s=Ext.decode(response.responseText);if(s.success===true){}
                    }
                })
            }
        };var insertSharedFileView=function(){
            Ext.Ajax.request({
                url:"file/insertSharedFileView.jsp",
                method:"post",
                success:function(response){
                    eval(response.responseText)
                }
            })
        };var updateSharedFileView=function(node){
            Ext.Ajax.request({
                url:"file/updateSharedFileView.action",
                params:{
                    "file.fileID":node.id.substring(node.id.lastIndexOf("-")+1)
                },
                method:"post",
                success:function(response){
                    eval(response.responseText)
                }
            })
        };var removeSharedFile=function(node){
            if(node){
                Ext.MessageBox.confirm("删除文件","您确定删除文件 <b>"+node.text+"</b>?",function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"file/removeSharedFile.action",
                            params:{
                                "file.fileID":node.id.substring(node.id.lastIndexOf("-")+1)
                            },
                            success:function(response){
                                var j=Ext.decode(response.responseText);if(j.success===true){
                                    node.remove()
                                }
                            }
                        })
                    }
                })
            }
        };if(!win){
            win=desktop.createWindow({
                id:this.moduleId,
                title:"我的文档",
                width:300,
                height:500,
                iconCls:"documents-icon",
                shim:false,
                border:false,
                animCollapse:false,
                constrainHeader:true,
                maximizable:false,
                taskbuttonTooltip:"<b>我的文档</b><br />共享文档、我的文档",
                layout:"accordion",
                layoutConfig:{
                    animate:false
                },
                items:[userFile,sharedFile]
            })
        }win.show()
    }
});


