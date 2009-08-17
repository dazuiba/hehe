//~~~
Sliver.ProductionManager=Ext.extend(Ext.app.Module,{
    moduleType:"production",
    moduleId:"production-manager",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"production-manager-icon",
            scope:this,
            shortcutIconCls:"production-manager-shortcut",
            text:"浜у搧绠＄悊",
            tooltip:"<b>浜у搧绠＄悊</b><br />绯荤粺浜у搧绠＄悊"
        }
    },
    createWindow:function(){
        var desktop=this.app.getDesktop();
        var win=desktop.getWindow(this.moduleId);
        if(!win){
            var winWidth=desktop.getWinWidth()/1.1;
            var winHeight=desktop.getWinHeight()/1.1;
            var catetree=new Ext.tree.TreePanel({
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
                    dataUrl:"production/listCategoryTree.action"
                }),
                root:new Ext.tree.AsyncTreeNode({
                    id:"category-1",
                    text:"浜у搧鍙婂垎绫�,
                    draggable:false,
                    expanded:true,
                    singleClickExpand:false
                }),
                tbar:[{
                        tooltip:"閲嶆柊鍔犺浇",
                        iconCls:"icon-reload",
                        handler:function(){
                            catetree.getRootNode().reload()
                        }
                    },"-",{
                        iconCls:"icon-expand-all",
                        tooltip:"鍏ㄩ儴灞曞紑",
                        handler:function(){
                            catetree.getRootNode().expand(true)
                        }
                    },{
                        iconCls:"icon-collapse-all",
                        tooltip:"鍏ㄩ儴鎶樺彔",
                        handler:function(){
                            catetree.getRootNode().collapse(true)
                        }
                    },"->","-",{
                        iconCls:"icon-add",
                        menu:new Ext.menu.Menu({
                            items:[{
                                    text:"鐩綍",
                                    iconCls:"x-tree-node-icon",
                                    handler:function(){
                                        insertCategoryView()
                                    }
                                },{
                                    text:"浜у搧",
                                    iconCls:"icon-production",
                                    handler:function(){
                                        insertProductionView()
                                    }
                                }]
                        })
                    }],
                region:"west",
                collapseMode:"mini",
                autoScroll:true,
                collapsible:true,
                margins:"0 0 0 0",
                split:true,
                border:true,
                width:parseFloat(winWidth*0.3)<201?parseFloat(winWidth*0.3):200
            });
            
            //~store
            var store=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"production/listProduction.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"list",
                    totalProperty:"total",
                    id:"productionID",
                    fields:["productionID","productionSerial","productionName","categoryName","productionUnit","productionVn1","productionVn2","productionVn3","productionVn4","productionVn5","productionPrice","productionDescription","productionParameter"]
                }),
                remoteSort:true
            });
            store.setDefaultSort("production_id","desc");
			//~cm
            var expander=new Ext.grid.RowExpander({
                tpl:new Ext.Template("<p><b>浜у搧璇存槑:</b> {productionDescription}</p><br>","<p><b>鎶�湳鍙傛暟:</b> {productionParameter}</p>")
            });
            var cm=new Ext.grid.ColumnModel([expander,{
                    header:"浜у搧缂栧彿",
                    dataIndex:"productionSerial",
                    width:50
                },{
                    header:"浜у搧鍚嶇О",
                    dataIndex:"productionName",
                    width:80
                },{
                    header:"鍒嗙被鍚嶇О",
                    dataIndex:"categoryName",
                    width:70
                },{
                    header:"鍗曚綅",
                    dataIndex:"productionUnit",
                    width:50
                },{
                    header:"鎶�湳鍙傛暟1",
                    hidden:true,
                    dataIndex:"productionVn1",
                    width:50
                },{
                    header:"鎶�湳鍙傛暟2",
                    hidden:true,
                    dataIndex:"productionVn2",
                    width:50
                },{
                    header:"鎶�湳鍙傛暟3",
                    hidden:true,
                    dataIndex:"productionVn3",
                    width:50
                },{
                    header:"鎶�湳鍙傛暟4",
                    hidden:true,
                    dataIndex:"productionVn4",
                    width:50
                },{
                    header:"鎶�湳鍙傛暟5",
                    hidden:true,
                    dataIndex:"productionVn5",
                    width:50
                },{
                    header:"鎶ヤ环",
                    align:"right",
                    dataIndex:"productionPrice",
                    width:110,
                    renderer:SliverUtil.cnMoney
                }]);
            cm.defaultSortable=true;var filterProductionParams={
                "p.productionSerial":"",
                "p.productionName":"",
                "p.categoryName":"",
                "p.productionUnit":"",
                "p.productionPn1":"",
                "p.productionVn1":"",
                "p.productionPrice":"",
                "p.productionDescription":"",
                "p.productionParameter":"",
                f:false
            };
            function operateProductionGridParams(status,name){
                if(status===true){
                    filterProductionParams[name]=""
                }else{
                    filterProductionParams[name]=null
                }
            }
            var productionFilterMenu=new Ext.menu.Menu({
                items:[{
                        text:"浜у搧缂栧彿",
                        checked:true,
                        checkHandler:function(){
                            operateProductionGridParams(this.checked,"p.productionSerial")
                        }
                    },{
                        text:"浜у搧鍚嶇О",
                        checked:true,
                        checkHandler:function(){
                            operateProductionGridParams(this.checked,"p.productionName")
                        }
                    },{
                        text:"鍒嗙被鍚嶇О",
                        checked:true,
                        checkHandler:function(){
                            operateProductionGridParams(this.checked,"p.categoryName")
                        }
                    },{
                        text:"鍗曚綅",
                        checked:true,
                        checkHandler:function(){
                            operateProductionGridParams(this.checked,"p.productionUnit")
                        }
                    },{
                        text:"鍙傛暟鍚嶇О",
                        checked:true,
                        checkHandler:function(){
                            operateProductionGridParams(this.checked,"p.productionPn1")
                        }
                    },{
                        text:"鍙傛暟鏁板�",
                        checked:true,
                        checkHandler:function(){
                            operateProductionGridParams(this.checked,"p.productionVn1")
                        }
                    },{
                        text:"鎶�湳鍙傛暟",
                        checked:true,
                        checkHandler:function(){
                            operateProductionGridParams(this.checked,"p.productionParameter")
                        }
                    },{
                        text:"浜у搧鎻忚堪",
                        checked:true,
                        checkHandler:function(){
                            operateProductionGridParams(this.checked,"p.productionDescription")
                        }
                    }]
            });
            var filterProduction=function(){
                grid.reconfigure(store,cm);if(null!==filterProductionParams["p.productionSerial"]){
                    filterProductionParams["p.productionSerial"]=filterField.getValue()
                }if(null!==filterProductionParams["p.productionName"]){
                    filterProductionParams["p.productionName"]=filterField.getValue()
                }if(null!==filterProductionParams["p.categoryName"]){
                    filterProductionParams["p.categoryName"]=filterField.getValue()
                }if(null!==filterProductionParams["p.productionUnit"]){
                    filterProductionParams["p.productionUnit"]=filterField.getValue()
                }if(null!==filterProductionParams["p.productionPn1"]){
                    filterProductionParams["p.productionPn1"]=filterField.getValue()
                }if(null!==filterProductionParams["p.productionVn1"]){
                    filterProductionParams["p.productionVn1"]=filterField.getValue()
                }if(null!==filterProductionParams["p.productionParameter"]){
                    filterProductionParams["p.productionParameter"]=filterField.getValue()
                }if(null!==filterProductionParams["p.productionDescription"]){
                    filterProductionParams["p.productionDescription"]=filterField.getValue()
                }filterProductionParams.f=true;store.baseParams=filterProductionParams;store.setDefaultSort("productionID","desc");store.load({
                    params:{
                        start:0,
                        limit:pageSizePlugin.getPageSize()
                    }
                })
            };
            var filterProductionWithPrice=function(){
                store.setDefaultSort("productionID","desc");store.baseParams={
                    minPrice:minPriceField.getValue(),
                    maxPrice:maxPriceField.getValue(),
                    f:false
                };store.load({
                    params:{
                        start:0,
                        limit:pageSizePlugin.getPageSize()
                    }
                })
            };
            var filterField=new Ext.form.TextField({});var filterButton=new Ext.Button({
                iconCls:"icon-search",
                handler:filterProduction
            });
            var clearButton=new Ext.Button({
                iconCls:"icon-clear",
                handler:function(){
                    filterField.reset();store.baseParams={};store.load({
                        params:{
                            start:0,
                            limit:pageSizePlugin.getPageSize()
                        }
                    })
                }
            });
            var minPriceField=new Ext.form.NumberField({});var maxPriceField=new Ext.form.NumberField({});var filterPriceButton=new Ext.Button({
                iconCls:"icon-search",
                handler:filterProductionWithPrice
            });
            var clearPriceButton=new Ext.Button({
                iconCls:"icon-clear",
                handler:function(){
                    minPriceField.reset();maxPriceField.reset();store.setDefaultSort("productionID","desc");store.baseParams={
                        minPrice:"",
                        maxPrice:"",
                        f:false
                    };store.load({
                        params:{
                            start:0,
                            limit:pageSizePlugin.getPageSize()
                        }
                    })
                }
            });
            var gridsm=new Ext.grid.RowSelectionModel({
                singleSelect:true
            });
            var pageSizePlugin=new Ext.ux.Andrie.pPageSize();
            //~grid
            var grid=new Ext.grid.GridPanel({
                viewConfig:{
                    forceFit:true
                },
                border:false,
                store:store,
                cm:cm,
                sm:gridsm,
                plugins:expander,
                loadMask:true,
                tbar:new Ext.Toolbar(["-","鍏抽敭瀛楁煡璇�,"-",{
                        text:"鏌ヨ鑼冨洿",
                        menu:productionFilterMenu
                    },filterField,filterButton,clearButton,"-","->","鎶ヤ环鏌ヨ","-","涓嬮檺",minPriceField,"-","涓婇檺",maxPriceField,filterPriceButton,clearPriceButton]),
                bbar:new Ext.PagingToolbar({
                    plugins:pageSizePlugin,
                    pageSize:20,
                    store:store,
                    displayInfo:true
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
            grid.on("rowdblclick",function(){
                var record=gridsm.getSelected();if(record){
                    var tabID=main.id+"-production-"+record.data.productionID;var tab=main.getComponent(tabID);if(tab){
                        tab.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                productionID:record.data.productionID,
                                containerID:tab.body.id
                            },
                            url:"production/getProductionByAllView.action"
                        });main.setActiveTab(tab)
                    }else{
                        var temp=new Ext.Panel({
                            id:tabID,
                            autoScroll:true,
                            iconCls:"production-manager-icon",
                            title:record.data.productionName,
                            closable:true
                        });temp.on("render",function(){
                            temp.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    productionID:record.data.productionID,
                                    containerID:temp.body.id
                                },
                                url:"production/getProductionByAllView.action"
                            })
                        });var p=main.add(temp);main.setActiveTab(p)
                    }
                }
            });
            var updateProductionGridView=function(){
                var record=gridsm.getSelected();if(record){
                    var tabID=main.id+"-"+record.data.productionID;
                    var tab=main.getComponent(tabID);
                    if(tab){
                        tab.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                productionID:record.data.productionID,
                                containerID:tab.body.id
                            },
                            url:"production/updateProductionView.action"
                        });main.setActiveTab(tab)
                    }else{
                        var temp=new Ext.Panel({
                            id:tabID,
                            autoScroll:true,
                            iconCls:"production-manager-icon",
                            title:record.data.productionName,
                            closable:true
                        });
                        temp.on("render",function(){
                            temp.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    productionID:record.data.productionID,
                                    containerID:temp.body.id
                                },
                                url:"production/updateProductionView.action"
                            })
                        });var p=main.add(temp);main.setActiveTab(p)
                    }
                }
            };
            var removeProductionGridView=function(){
                var record=gridsm.getSelected();if(record){
                    Ext.MessageBox.confirm("鍒犻櫎浜у搧","鎮ㄧ‘瀹氳鍒犻櫎浜у搧 <b>"+record.data.productionName+"</b>?",function(btn){
                        if(btn=="yes"){
                            Ext.Ajax.request({
                                url:"production/deleteProduction.action",
                                params:{
                                    productionID:record.data.productionID
                                },
                                success:function(response){
                                    var j=Ext.decode(response.responseText);if(j.success===true){
                                        if(record){
                                            var tabID=main.id+"-"+record.data.productionID;var tab=main.getComponent(tabID);if(tab){
                                                main.remove(tab,true)
                                            }store.remove(record)
                                        }
                                    }
                                }
                            })
                        }
                    })
                }
            };

            var productionGridMenu;
            grid.on("rowcontextmenu",function(grid,rowindex,e){
                grid.getSelectionModel().selectRow(rowindex,false);
                if(!productionGridMenu){
                    productionGridMenu=new Ext.menu.Menu([{
                            id:"updateProductionGridViewMenu",
                            text:"鏇存柊浜у搧璧勬枡",
                            handler:updateProductionGridView
                        },"-",{
                            id:"removeProductionGridViewMenu",
                            text:"鍒犻櫎浜у搧璧勬枡",
                            handler:removeProductionGridView
                        }])
                }
                productionGridMenu.showAt(e.getPoint());e.stopEvent()
            });
			//~ main
            var main=new Ext.TabPanel({
                id:"production-manager-body",
                region:"center",
                margins:"0 0 0 0",
                resizeTabs:true,
                minTabWidth:135,
                plugins:new Ext.ux.TabCloseMenu(),
                enableTabScroll:true,
                border:true,
                activeTab:0,
                autoDestroy:true,
                items:[{
                        id:"production-manager-welcome",
                        closable:false,
                        layout:"fit",
                        title:"浜у搧鍒楄〃",
                        items:grid,
                        autoScroll:true,
                        iconCls:"production-manager-icon"
                    }]
            });
            catetree.on("click",function(node,e){
                if(!node.isSelected()){
                    node.select()
                }if(true!==node.isLeaf()){
                    store.setDefaultSort("productionID","desc");store.baseParams={
                        "p.categoryID":node.id.substring(node.id.lastIndexOf("-")+1),
                        f:true
                    };store.load({
                        params:{
                            start:0,
                            limit:20
                        }
                    });main.setActiveTab(main.getComponent("production-manager-welcome"))
                }
            });
            catetree.on("dblclick",function(node,e){
                if(!node.isSelected()){
                    node.select()
                }node=sm.getSelectedNode();if(node.isLeaf()){
                    e.stopEvent();
					loadProduction(node)
                }
            });
            var sm=catetree.getSelectionModel();
            var cmenu;
            catetree.on("contextMenu",function(n,e){
                if(!n.isSelected()){
                    n.select()
                }
                if(!cmenu){
                    cmenu=new Ext.menu.Menu([{
                            id:"expandCatetreeItem",
                            text:"灞曞紑鐩綍",
                            handler:expandNode
                        },{
                            id:"collapseCatetreeItem",
                            text:"鍏抽棴鐩綍",
                            handler:collapseNode
                        },"-",{
                            id:"reloadCatetreeNode",
                            text:"鍒锋柊",
                            handler:reloadNode
                        },"-",{
                            text:"鏂板缓",
                            id:"createInCatetree",
                            menu:{
                                items:[{
                                        id:"addCategoryView",
                                        text:"鐩綍",
                                        handler:insertCategoryView
                                    },{
                                        id:"addProductionView",
                                        text:"浜у搧",
                                        handler:insertProductionView
                                    }]
                            }
                        },{
                            id:"updateCategoryItem",
                            text:"淇敼",
                            handler:updateNode
                        },"-",{
                            id:"deleteCategoryItem",
                            text:"鍒犻櫎",
                            handler:deleteNode
                        }])
                }
                var is=cmenu.items;
                if(n.isLeaf()){
                    is.get("createInCatetree").hide();
					is.get("reloadCatetreeNode").setDisabled(true);
					is.get("expandCatetreeItem").setDisabled(true);
					is.get("collapseCatetreeItem").setDisabled(true)
                }else{
                    is.get("createInCatetree").show();
					is.get("reloadCatetreeNode").setDisabled(false);
					is.get("expandCatetreeItem").setDisabled(n.isExpanded());
					is.get("collapseCatetreeItem").setDisabled(!n.isExpanded())
                }
				cmenu.showAt(e.getPoint())
            });

            catetree.on("movenode",function(catetree,node,oldParent,newParent,index){
                if(node){
                    if(node.isLeaf()){
                        moveProduction(catetree,node,oldParent,newParent,index)
                    }else{
                        moveCategory(catetree,node,oldParent,newParent,index)
                    }
                }
            });

            function reloadNode(){
                var node=sm.getSelectedNode();
				if(node){
                    node.reload()
                }else{
                    catetree.getRootNode().reload();
					sm.select(catetree.getRootNode())
                }
            }
            function expandNode(){
                var node=sm.getSelectedNode();
				if(node){
                    node.expand()
                }else{
                    catetree.getRootNode().expand();
					sm.select(catetree.getRootNode())
                }
            }

            function collapseNode(){
                var node=sm.getSelectedNode();if(node){
                    node.collapse()
                }else{
                    catetree.getRootNode().collapse();
					sm.select(catetree.getRootNode())
                }
            }

            function loadProduction(){
                var node=sm.getSelectedNode();
				if(node){
                    var tabID=main.id+"-"+node.id;var tab=main.getComponent(tabID);if(tab){
                        tab.body.getUpdater().update({
                            scripts:true,
                            method:"post",
                            params:{
                                productionID:node.id.substring(11,node.id.length),
                                containerID:tab.body.id
                            },
                            url:"production/getProductionByAllView.action"
                        });main.setActiveTab(tab)
                    }else{
                        var temp=new Ext.Panel({
                            id:tabID,
                            autoScroll:true,
                            iconCls:"production-manager-icon",
                            title:node.text,
                            closable:true
                        });temp.on("render",function(){
                            temp.load({
                                scripts:true,
                                method:"post",
                                params:{
                                    productionID:node.id.substring(11,node.id.length),
                                    containerID:temp.body.id
                                },
                                url:"production/getProductionByAllView.action"
                            })
                        });var p=main.add(temp);main.setActiveTab(p)
                    }
                }
            }

            function insertCategoryView(){
                var node=sm.getSelectedNode();
									if(node){
                    Ext.Ajax.request({
                        url:"production/insertCategoryView.action",
                        params:{
                            categoryPID:node.id.substring(9,node.id.length)
                        },
                        success:function(response){
                            eval(response.responseText)
                        }
                    })
                }else{
                    Ext.Ajax.request({
                        url:"production/insertCategoryView.action",
                        success:function(response){
                            eval(response.responseText)
                        }
                    })
                }
            }

            function insertProductionView(){
                var node=sm.getSelectedNode();
				if(node){
                    var tabID=Ext.id();var temp=new Ext.Panel({
                        id:tabID,
                        title:"澧炲姞浜у搧",
                        closable:true,
                        autoScroll:true
                    });
					temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                categoryID:node.id.substring(9,node.id.length),
                                containerID:tabID
                            },
                            url:"production/insertProductionView.action"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }else{
                    var tabID=Ext.id();
					var temp=new Ext.Panel({
                        id:tabID,
                        title:"澧炲姞浜у搧",
                        closable:true,
                        autoScroll:true
                    });
					temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                containerID:tabID
                            },
                            url:"production/insertProductionView.action"
                        })
                    });
					var p=main.add(temp);
					main.setActiveTab(p)
                }
            }

            var deleteNode=function(){
                var node=sm.getSelectedNode();if(node){
                    if(node.isLeaf()){
                        deleteProduction(node)
                    }else{
                        deleteCategory(node)
                    }
                }
            };

            var deleteCategory=function(node){
                Ext.MessageBox.confirm("鍒犻櫎鐩綍","鎮ㄧ‘瀹氬垹闄ょ洰褰�<b>"+node.text+"</b>?<br/>娉ㄦ剰锛氬皢浼氬垹闄よ鐩綍涓嬬殑鎵�湁鐩綍鍙婁骇鍝�,function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"production/deleteCategory.action",
                            params:{
                                categoryID:node.id.substring(9,node.id.length)
                            },
                            success:function(response){
                                node.remove()
                            }
                        })
                    }
                })
            };

            var deleteProduction=function(node){
                Ext.MessageBox.confirm("鍒犻櫎浜у搧","鎮ㄧ‘瀹氳鍒犻櫎浜у搧 <b>"+node.text+"</b>?",function(btn){
                    if(btn=="yes"){
                        Ext.Ajax.request({
                            url:"production/deleteProduction.action",
                            params:{
                                productionID:node.id.substring(11,node.id.length)
                            },
                            success:function(response){
                                if(node){
                                    var tabID=main.id+"-"+node.id;var tab=main.getComponent(tabID);if(tab){
                                        main.remove(tab,true)
                                    }node.remove()
                                }
                            }
                        })
                    }
                })
            };

            var updateNode=function(){
                var node=sm.getSelectedNode();if(node){
                    if(node.isLeaf()){
                        updateProductionView(node)
                    }else{
                        updateCategoryView(node)
                    }
                }
            };

            var updateCategoryView=function(node){
                Ext.Ajax.request({
                    url:"production/updateCategoryView.action",
                    params:{
                        categoryID:node.id.substring(9,node.id.length)
                    },
                    success:function(response){
                        eval(response.responseText)
                    }
                })
            };

            var updateProductionView=function(node){
                var tabID=main.id+"-"+node.id;var tab=main.getComponent(tabID);if(tab){
                    tab.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            productionID:node.id.substring(11,node.id.length),
                            containerID:tab.body.id
                        },
                        url:"production/updateProductionView.action"
                    });main.setActiveTab(tab)
                }else{
                    var temp=new Ext.Panel({
                        id:tabID,
                        autoScroll:true,
                        iconCls:"production-manager-icon",
                        title:node.text,
                        closable:true
                    });temp.on("render",function(){
                        temp.load({
                            scripts:true,
                            method:"post",
                            params:{
                                productionID:node.id.substring(11,node.id.length),
                                containerID:temp.body.id
                            },
                            url:"production/updateProductionView.action"
                        })
                    });var p=main.add(temp);main.setActiveTab(p)
                }
            };
			var moveCategory=function(catetree,node,oldParent,newParent,index){
                if(oldParent.id!=newParent.id){
                    Ext.Ajax.request({
                        url:"production/moveCategory.action",
                        params:{
                            categoryID:node.id.substring(9,node.id.length),
                            categoryPID:newParent.id.substring(9,newParent.id.length)
                        },
                        success:function(response){
                            var s=Ext.decode(response.responseText);if(s.success){}
                        }
                    })
                }
            };

            var moveProduction=function(catetree,node,oldParent,newParent,index){
                if(oldParent.id!=newParent.id){
                    Ext.Ajax.request({
                        url:"production/moveProduction.action",
                        params:{
                            productionID:node.id.substring(11,node.id.length),
                            categoryID:newParent.id.substring(9,newParent.id.length)
                        },
                        success:function(response){
                            var s=Ext.decode(response.responseText);
							if(s.success){
                                var tabID=main.id+"-"+node.id;
								var tab=main.getComponent(tabID);if(tab){
                                    tab.body.getUpdater().update({
                                        scripts:true,
                                        method:"post",
                                        params:{
                                            productionID:node.id.substring(11,node.id.length)
                                        },
                                        url:"production/getProductionByID.action"
                                    });
									main.setActiveTab(tab)
                                }
                            }
                        }
                    })
                }
            };

            win=desktop.createWindow({
                id:this.moduleId,
                title:"浜у搧绠＄悊",
                width:winWidth,
                height:winHeight,
                x:desktop.getWinX(winWidth),
                y:desktop.getWinY(winHeight),
                iconCls:"production-manager-icon",
                shim:false,
                lines:false,
                animCollapse:false,
                constrainHeader:true,
                minimizable:true,
                maximizable:true,
                border:true,
                layout:"border",
                items:[catetree,main],
                taskbuttonTooltip:"<b>浜у搧绠＄悊</b><br />绯荤粺浜у搧绠＄悊"
            })
        }
        win.show()
    }
});

