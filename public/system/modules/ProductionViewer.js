var loadProductionInViewer=null;
//~~
Sliver.ProductionViewer=Ext.extend(Ext.app.Module,{
    moduleType:"production",
    moduleId:"production-viewer",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"production-icon",
            scope:this,
            shortcutIconCls:"production-shortcut",
            text:"产品浏览",
            tooltip:"<b>产品浏览</b><br />系统产品浏览"
        }
    },
    createWindow:function(){
        var X=this.app.getDesktop();
		var H=X.getWindow(this.moduleId);
		if(!H){
            var P=X.getWinWidth()/1.1;
			var E=X.getWinHeight()/1.1;
			var I=new Ext.tree.TreePanel({
                useArrows:true,
                autoScroll:true,
                animate:true,
                dropConfig:{
                    appendOnly:true
                },
                enableDD:false,
                containerScroll:true,
                rootVisible:true,
                loader:new Ext.tree.SliverTreeLoader({
                    dataUrl:"production/listCategoryTree.action"
                }),
                root:new Ext.tree.AsyncTreeNode({
                    id:"category-1",
                    text:"产品及分类",
                    draggable:false,
                    expanded:true,
                    singleClickExpand:false
                }),
                tbar:[{
                        tooltip:"重新加载",
                        iconCls:"icon-reload",
                        handler:function(){
                            I.getRootNode().reload()
                        }
                    },"-",{
                        iconCls:"icon-expand-all",
                        tooltip:"全部展开",
                        handler:function(){
                            I.getRootNode().expand(true)
                        }
                    },{
                        iconCls:"icon-collapse-all",
                        tooltip:"全部折叠",
                        handler:function(){
                            I.getRootNode().collapse(true)
                        }
                    }],
                region:"west",
                collapseMode:"mini",
                autoScroll:true,
                collapsible:true,
                margins:"0 0 0 0",
                split:true,
                border:true,
                width:parseFloat(P*0.3)<201?parseFloat(P*0.3):200
            });I.on("contextmenu",Ext.emptyFn);var L=new Ext.data.Store({
                proxy:new Ext.data.HttpProxy({
                    url:"production/listProduction.action"
                }),
                reader:new Ext.data.JsonReader({
                    root:"list",
                    totalProperty:"total",
                    id:"productionID",
                    fields:["productionID","productionSerial","productionName","categoryName","productionUnit","productionPn1","productionPn2","productionPn3","productionPn4","productionPn5","productionVn1","productionVn2","productionVn3","productionVn4","productionVn5","productionPrice","productionMinimum","productionImage","productionDescription","productionParameter"]
                }),
                remoteSort:true
            });L.setDefaultSort("productionID","desc");var a={
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
            };function O(b,c){
                if(b===true){
                    a[c]=""
                }else{
                    a[c]=null
                }
            }var F=new Ext.menu.Menu({
                items:[{
                        text:"产品编号",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"p.productionSerial")
                        }
                    },{
                        text:"产品名称",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"p.productionName")
                        }
                    },{
                        text:"分类名称",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"p.categoryName")
                        }
                    },{
                        text:"单位",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"p.productionUnit")
                        }
                    },{
                        text:"参数名称",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"p.productionPn1")
                        }
                    },{
                        text:"参数数值",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"p.productionVn1")
                        }
                    },{
                        text:"技术参数",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"p.productionParameter")
                        }
                    },{
                        text:"产品描述",
                        checked:true,
                        checkHandler:function(){
                            O(this.checked,"p.productionDescription")
                        }
                    }]
            });var Q=function(){
                if(null!==a["p.productionSerial"]){
                    a["p.productionSerial"]=M.getValue()
                }if(null!==a["p.productionName"]){
                    a["p.productionName"]=M.getValue()
                }if(null!==a["p.categoryName"]){
                    a["p.categoryName"]=M.getValue()
                }if(null!==a["p.productionUnit"]){
                    a["p.productionUnit"]=M.getValue()
                }if(null!==a["p.productionPn1"]){
                    a["p.productionPn1"]=M.getValue()
                }if(null!==a["p.productionVn1"]){
                    a["p.productionVn1"]=M.getValue()
                }if(null!==a["p.productionParameter"]){
                    a["p.productionParameter"]=M.getValue()
                }if(null!==a["p.productionDescription"]){
                    a["p.productionDescription"]=M.getValue()
                }a.f=true;L.baseParams=a;L.setDefaultSort("productionID","desc");L.load({
                    params:{
                        start:0,
                        limit:C.getPageSize()
                    }
                })
            };var G=function(){
                L.setDefaultSort("productionID","desc");L.baseParams={
                    minPrice:T.getValue(),
                    maxPrice:V.getValue(),
                    f:false
                };L.load({
                    params:{
                        start:0,
                        limit:C.getPageSize()
                    }
                })
            };var M=new Ext.form.TextField({});var U=new Ext.Button({
                iconCls:"icon-search",
                handler:Q
            });var N=new Ext.Button({
                iconCls:"icon-clear",
                handler:function(){
                    M.reset();L.baseParams={};L.load({
                        params:{
                            start:0,
                            limit:C.getPageSize()
                        }
                    })
                }
            });var T=new Ext.form.NumberField({});var V=new Ext.form.NumberField({});var D=new Ext.Button({
                iconCls:"icon-search",
                handler:G
            });var R=new Ext.Button({
                iconCls:"icon-clear",
                handler:function(){
                    T.reset();V.reset();L.setDefaultSort("productionID","desc");L.baseParams={
                        minPrice:"",
                        maxPrice:"",
                        f:false
                    };L.load({
                        params:{
                            start:0,
                            limit:C.getPageSize()
                        }
                    })
                }
            });var Z=new Ext.XTemplate('<tpl for=".">','<dd onclick="loadProductionInViewer({productionID},\'{productionName}\')"  style="float:left;width:280px;height:120px;font-size:12px;padding:8px 10px 0px 10px;cursor:pointer;">','<div style="float:left;"><a href="#"><img style="border:4px solid #EFEFEF;" width="120" onload="ImageUtil.scale(this,100,100);" src="{productionImage}"/></a></div>','<div style="float:left;padding-left:10px;">','<h4>编号：{productionSerial}</h4><p style="padding:1px;">名称：{productionName}</p>','<p style="padding:1px;">单位：{productionUnit}</p>','<p style="padding:1px;">报价：￥{productionPrice}</p>','<tpl if="(this.isNull(productionPn1) == false)&&(this.isNull(productionVn1))==false"><p style="padding:1px;">{productionPn1}：{productionVn1}</p></tpl>','<tpl if="(this.isNull(productionPn2) == false)&&(this.isNull(productionVn2))==false"><p style="padding:1px;">{productionPn2}：{productionVn2}</p></tpl>','</div><div style="clear:both"></div>',"</dd>",'</tpl><div style="clear:both"></div>',{
                isNull:function(b){
                    return((null===b)||(""===b))
                }
            });var C=new Ext.ux.Andrie.pPageSize();var J=new Ext.TabPanel({
                id:"production-viewer-body",
                region:"center",
                margins:"0 0 0 0",
                resizeTabs:true,
                minTabWidth:135,
                tabWidth:135,
                plugins:new Ext.ux.TabCloseMenu(),
                enableTabScroll:true,
                border:true,
                activeTab:0,
                autoDestroy:true,
                items:[{
                        id:"production-images-view",
                        layout:"fit",
                        bodyStyle:"padding:20px;",
                        autoScroll:true,
                        title:"产品浏览",
                        iconCls:"production-icon",
                        items:new Ext.DataView({
                            store:L,
                            tpl:Z,
                            autoWidth:true,
                            autoHeight:true,
                            overClass:"over",
                            itemSelector:"dd",
                            emptyText:""
                        }),
                        tbar:new Ext.Toolbar(["-","关键字查询","-",{
                                text:"查询范围",
                                menu:F
                            },M,U,N,"-","->","报价查询","-","下限",T,"-","上限",V,D,R]),
                        bbar:new Ext.PagingToolbar({
                            plugins:C,
                            pageSize:20,
                            store:L,
                            displayInfo:true
                        })
                    }]
            });J.on("render",function(){
                L.load({
                    params:{
                        start:0,
                        limit:C.getPageSize()
                    }
                })
            });I.on("click",function(b,c){
                if(!b.isSelected()){
                    b.select()
                }if(true!==b.isLeaf()){
                    L.setDefaultSort("productionID","desc");L.baseParams={
                        "p.categoryID":b.id.substring(b.id.lastIndexOf("-")+1),
                        f:true
                    };L.load({
                        params:{
                            start:0,
                            limit:20
                        }
                    });J.setActiveTab(J.getComponent("production-images-view"))
                }
            });I.on("dblclick",function(b,c){
                if(!b.isSelected()){
                    b.select()
                }b=W.getSelectedNode();if(true===b.isLeaf()){
                    c.stopEvent();S(b)
                }
            });var W=I.getSelectionModel();function Y(){
                var b=W.getSelectedNode();if(b){
                    b.reload()
                }else{
                    I.getRootNode().reload();W.select(I.getRootNode())
                }
            }function K(){
                var b=W.getSelectedNode();if(b){
                    b.expand()
                }else{
                    I.getRootNode().expand();W.select(I.getRootNode())
                }
            }function B(){
                var b=W.getSelectedNode();if(b){
                    b.collapse()
                }else{
                    I.getRootNode().collapse();W.select(I.getRootNode())
                }
            }function S(b){
                if(b){
                    loadProductionInViewer(b.id.substring(11,b.id.length),b.text)
                }
            }loadProductionInViewer=function A(g,d){
                var c=J.id+"-"+g;var e=J.getComponent(c);if(e){
                    e.body.getUpdater().update({
                        scripts:true,
                        method:"post",
                        params:{
                            productionID:g,
                            containerID:e.body.id
                        },
                        url:"production/getProductionByIDView.action"
                    });J.setActiveTab(e)
                }else{
                    var b=new Ext.Panel({
                        id:c,
                        autoScroll:true,
                        iconCls:"production-icon",
                        title:d,
                        closable:true
                    });b.on("render",function(){
                        b.load({
                            scripts:true,
                            method:"post",
                            params:{
                                productionID:g,
                                containerID:b.body.id
                            },
                            url:"production/getProductionByIDView.action"
                        })
                    });var f=J.add(b);J.setActiveTab(f)
                }
            };H=X.createWindow({
                id:this.moduleId,
                title:"产品浏览",
                width:P,
                height:E,
                x:X.getWinX(P),
                y:X.getWinY(E),
                iconCls:"production-icon",
                shim:true,
                animCollapse:false,
                constrainHeader:true,
                minimizable:true,
                maximizable:true,
                border:true,
                layout:"border",
                items:[I,J],
                taskbuttonTooltip:"<b>产品浏览</b><br />产品资料浏览"
            });H.on("destroy",function(){
                delete loadProductionInViewer
            })
        }H.show()
    }
});
