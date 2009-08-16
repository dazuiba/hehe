var removeChanceManagerFile;
Ext.onReady(function(){
    try{
        var G=new Ext.ux.SliderTip({
            getText:function(e){
                return String.format("<b>{0}%</b>",e.getValue())
                }
            });var I=new Ext.Slider({
            style:"margin-bottom:4px;",
            width:280,
            increment:5,
            maxValue:100,
            minValue:0,
            value:'40',
            plugins:G
        });var f=new Ext.form.Hidden({
            name:"chance.chancePercent",
            value:'40'
        });function y(AE){
            var e=AE.getValue();f.setValue(e)
            }function j(e){
            y.defer(100,null,[e])
            }I.on({
            change:{
                fn:j,
                scope:this
            },
            drag:{
                fn:j,
                scope:this
            }
            });var c=new Ext.form.NumberField({
            fieldLabel:"总额￥",
            anchor:"96%",
            minValue:0,
            name:"chance.chanceTotal",
            value:'10000000.00'
        });var L=Ext.id();var l=new Ext.form.ComboBox({
            store:new Ext.data.SimpleStore({
                fields:["chanceSource"],
                data:SliverData.chanceSource
                }),
            editable:true,
            fieldLabel:"来源",
            name:"chance.chanceSource",
            value:'老客户',
            anchor:"96%",
            displayField:"chanceSource",
            typeAhead:true,
            mode:"local",
            triggerAction:"all",
            selectOnFocus:true
        });var x=new Ext.form.ComboBox({
            store:new Ext.data.SimpleStore({
                fields:["chanceState"],
                data:SliverData.chanceState
                }),
            editable:false,
            fieldLabel:"状态",
            name:"chance.chanceState",
            value:'成功',
            anchor:"96%",
            displayField:"chanceState",
            typeAhead:true,
            mode:"local",
            triggerAction:"all",
            selectOnFocus:true
        });var i=new Ext.tree.TreePanel({
            id:"chance-user-list",
            useArrows:true,
            autoScroll:true,
            animate:true,
            dropConfig:{
                appendOnly:true
            },
            enableDD:true,
            containerScroll:true,
            rootVisible:false,
            border:false,
            loader:new Ext.tree.SliverTreeLoader({
                dataUrl:"system/listGroupTree.action"
            }),
            root:new Ext.tree.AsyncTreeNode({
                id:"chanceUserTree-0",
                text:"组织架构",
                draggable:false,
                expanded:true,
                singleClickExpand:true
            }),
            tools:[{
                id:"refresh",
                on:{
                    click:function(){
                        var e=Ext.getCmp("chance-user-list");e.body.mask("Loading","x-mask-loading");setTimeout(function(){
                            e.body.unmask();e.root.reload()
                            },1000)
                        }
                    }
                }],
            tbar:[{
                tooltip:"重新加载",
                iconCls:"icon-reload",
                handler:function(){
                    i.getRootNode().reload()
                    }
                },"-",{
                iconCls:"icon-expand-all",
                tooltip:"全部展开",
                handler:function(){
                    i.getRootNode().expand(true)
                    }
                },{
                iconCls:"icon-collapse-all",
                tooltip:"全部折叠",
                handler:function(){
                    i.getRootNode().collapse(true)
                    }
                }]
            });var F=new Ext.form.Hidden({
            name:"chance.userID",
            value:'1'
        });var Y=new Ext.form.ComboBox({
            store:new Ext.data.SimpleStore({
                fields:[],
                data:[[]]
                }),
            editable:false,
            mode:"local",
            fieldLabel:"所属帐户",
            triggerAction:"all",
            listWidth:200,
            maxHeight:200,
            tpl:"<tpl for='.'><div style='height:200px;'><div id='chanceUserTree_ext-gen3910'></div></div></tpl>",
            selectedClass:"",
            anchor:"96%",
            name:"userName",
            value:'admin',
            onSelect:function(){}
            });i.on("click",function(AE){
            if(AE.isLeaf()===true){
                var e;Y.setValue(AE.text.substring(0,(AE.text.indexOf("(")==-1?AE.text.length:AE.text.indexOf("("))));F.setValue(AE.id.substring(AE.id.lastIndexOf("-")+1));Y.collapse()
                }
            });Y.on("expand",function(){
            i.render('chanceUserTree_ext-gen3910')
            });var m=new Ext.data.Store({
            proxy:new Ext.data.HttpProxy({
                url:"customer/listAllCustomer.action"
            }),
            reader:new Ext.data.JsonReader({
                root:"customers",
                totalProperty:"total",
                id:"groupID",
                fields:["userID","userName","groupID","groupPID","groupName","groupCustomer","tel","tel2","fax","email","email2","web","employees","source","state","nature","sale","level","category","type","create","userID","userName","country","province","city","address","zipcode","country2","province2","city2","address2","zipcode2","bankName","bankAccount","bankNumber","bankTax","payType","creditLimit","orderTotal","orderAmount","note","input","update"]
                }),
            remoteSort:true
        });m.setDefaultSort("groupID","DESC");var R=new Ext.grid.RowSelectionModel({
            singleSelect:false
        });var AD=new Ext.grid.ColumnModel([{
            header:"客户名称",
            dataIndex:"groupName",
            width:100
        },{
            header:"所属帐户",
            align:"right",
            dataIndex:"userName",
            width:45
        }]);AD.defaultSortable=true;var V=new Ext.grid.GridPanel({
            border:false,
            viewConfig:{
                forceFit:true
            },
            store:m,
            cm:AD,
            sm:R,
            loadMask:true,
            height:300,
            bbar:new Ext.PagingToolbar({
                pageSize:20,
                store:m,
                displayInfo:false
            })
            });V.on("render",function(){
            m.load({
                params:{
                    start:0,
                    limit:20
                }
                })
            });var n=new Ext.form.Hidden({
            name:"chance.groupID",
            value:'230'
        });var E=new Ext.form.ComboBox({
            store:new Ext.data.SimpleStore({
                fields:[],
                data:[[]]
                }),
            editable:false,
            fieldLabel:"客户名称",
            mode:"local",
            triggerAction:"all",
            tpl:"<tpl for='.'><div style='height:300px'><div id='customertree_ext-gen3910'></div></div></tpl>",
            selectedClass:"",
            anchor:"96%",
            name:"chance.groupName",
            value:'vsfvervevre',
            onSelect:function(){}
            });E.on("expand",function(){
            V.render("customertree_ext-gen3910")
            });V.on("rowdblclick",function(){
            var e=R.getSelected();if(e){
                E.setValue(e.data.groupName);n.setValue(e.data.groupID);E.collapse()
                }
            });var U=new Ext.FormPanel({
            region:"north",
            title:"基本信息",
            bodyStyle:"padding:5px 5px 0px 5px;",
            labelAlign:"top",
            anchor:"100%",
            frame:false,
            border:true,
            formId:L,
            items:[{
                layout:"column",
                items:[{
                    columnWidth:0.5,
                    layout:"form",
                    items:[E,n,{
                        xtype:"textfield",
                        fieldLabel:"主题",
                        name:"chance.chanceTitle",
                        value:'test',
                        anchor:"96%"
                    },f,{
                        html:'<label class="x-form-item x-form-item-label" style="width: auto;" for="ext-comp-1271">可能性:</label>'
                    },I,c]
                    },{
                    columnWidth:0.5,
                    layout:"form",
                    items:[F,Y,l,x,{
                        xtype:"datefield",
                        fieldLabel:"登记日期",
                        name:"chance.chanceDate",
                        value:'2009-08-05',
                        anchor:"96%"
                    }]
                    }]
                },{
                xtype:"textarea",
                name:"chance.chanceContent",
                value:'test test',
                height:150,
                width:580,
                fieldLabel:"需求"
            },{
                xtype:"hidden",
                name:"chance.chanceID",
                value:'300'
            }]
            });var T=new Ext.data.Store({
            proxy:new Ext.data.HttpProxy({
                url:"customer/listAllContact.action"
            }),
            reader:new Ext.data.JsonReader({
                root:"contacts",
                totalProperty:"total",
                id:"id",
                fields:["userID","userName","id","groupID","groupName","name","organization","department","role","nameDisplayed","email","email2","email3","emailDisplayed","web","imType","imValue","imType2","imValue2","telKey","telValue","telKey2","telValue2","telKey3","telValue3","telKey4","telValue4","telKey5","telValue5","telKey6","telValue6","country","province","city","address","zipcode","country2","province2","city2","address2","zipcode2","note","create","update"]
                }),
            remoteSort:true
        });T.setDefaultSort("id","desc");var p=new Ext.grid.CheckboxSelectionModel({
            singleSelect:false
        });var g=new Ext.grid.ColumnModel([p,{
            header:"姓名",
            dataIndex:"name",
            width:50
        },{
            header:"所属客户",
            dataIndex:"groupName",
            hidden:false,
            width:100
        },{
            header:"称谓",
            hidden:true,
            dataIndex:"nameDisplayed",
            width:40
        },{
            header:"所属帐户",
            align:"right",
            dataIndex:"userName",
            width:45
        }]);g.defaultSortable=true;var Z=new Ext.grid.GridPanel({
            border:false,
            viewConfig:{
                forceFit:true
            },
            store:T,
            cm:g,
            sm:p,
            height:300,
            loadMask:true,
            bbar:new Ext.PagingToolbar({
                pageSize:20,
                store:T,
                displayInfo:false
            })
            });Z.on("render",function(){
            T.load({
                params:{
                    start:0,
                    limit:20
                }
                })
            });var K=new Ext.form.ComboBox({
            store:new Ext.data.SimpleStore({
                fields:[],
                data:[[]]
                }),
            editable:false,
            mode:"local",
            triggerAction:"all",
            listWidth:400,
            tpl:"<tpl for='.'><div style='height:300px;'><div id='grouptree_ext-gen3910'></div></div></tpl>",
            name:"name",
            onSelect:function(){}
            });Z.on("rowdblclick",function(){
            var e=p.getSelected();if(e){
                var AE=a.getSelected();if(AE){
                    AE.beginEdit();K.setValue(e.data.name);AE.data=e.data;AE.commit()
                    }
                }K.collapse()
            });K.on("expand",function(){
            Z.render('grouptree_ext-gen3910')
            });var a=new Ext.grid.RowSelectionModel();var k=new Ext.grid.ColumnModel([{
            header:"姓名",
            dataIndex:"name",
            editor:K,
            width:60
        },{
            header:"客户（分类）",
            hidden:true,
            css:"background-color:#F1F2F4;",
            dataIndex:"groupName",
            width:100
        },{
            header:"所属帐户",
            hidden:true,
            css:"background-color:#F1F2F4;",
            dataIndex:"userName",
            width:50
        },{
            header:"称谓",
            hidden:true,
            css:"background-color:#F1F2F4;",
            dataIndex:"nameDisplayed",
            width:40
        },{
            header:"职位",
            css:"background-color:#F1F2F4;",
            dataIndex:"role",
            width:80
        },{
            header:"部门",
            hidden:true,
            css:"background-color:#F1F2F4;",
            dataIndex:"department",
            width:40
        },{
            header:"单位（组织）",
            hidden:true,
            css:"background-color:#F1F2F4;",
            dataIndex:"organization",
            width:140
        },{
            header:"电话（商务）",
            css:"background-color:#F1F2F4;",
            dataIndex:"telValue",
            width:100
        },{
            header:"电话2",
            css:"background-color:#F1F2F4;",
            dataIndex:"telValue2",
            width:100
        },{
            header:"电话3",
            css:"background-color:#F1F2F4;",
            dataIndex:"telValue3",
            width:120
        },{
            header:"电子邮件",
            css:"background-color:#F1F2F4;",
            dataIndex:"email",
            width:160
        },{
            header:"创建日期",
            css:"background-color:#F1F2F4;",
            dataIndex:"create",
            width:80
        },{
            header:"更新日期",
            css:"background-color:#F1F2F4;",
            dataIndex:"update",
            width:80
        }]);var O=Ext.data.Record.create(["userID","userName","id","groupID","groupName","name","organization","department","role","nameDisplayed","email","email2","email3","emailDisplayed","web","imType","imValue","imType2","imValue2","telKey","telValue","telKey2","telValue2","telKey3","telValue3","telKey4","telValue4","telKey5","telValue5","telKey6","telValue6","country","province","city","address","zipcode","country2","province2","city2","address2","zipcode2","note","create","update"]);var h=new Ext.data.Store({
            proxy:new Ext.data.HttpProxy({
                url:'chance/loadContactsManagerAction.action?chance.chanceID=300'
            }),
            reader:new Ext.data.JsonReader({
                id:"id",
                fields:["userID","userName","id","groupID","groupName","name","organization","department","role","nameDisplayed","email","email2","email3","emailDisplayed","web","imType","imValue","imType2","imValue2","telKey","telValue","telKey2","telValue2","telKey3","telValue3","telKey4","telValue4","telKey5","telValue5","telKey6","telValue6","country","province","city","address","zipcode","country2","province2","city2","address2","zipcode2","note","create","update"]
                }),
            remoteSort:true
        });var q=function(){
            var e=new O({
                userID:null,
                userName:null,
                id:null,
                groupID:null,
                groupName:null,
                name:null,
                organization:null,
                department:null,
                role:null,
                nameDisplayed:null,
                email:null,
                email2:null,
                email3:null,
                emailDisplayed:null,
                web:null,
                imType:null,
                imValue:null,
                imType2:null,
                imValue2:null,
                telKey:null,
                telValue:null,
                telKey2:null,
                telValue2:null,
                telKey3:null,
                telValue3:null,
                telKey4:null,
                telValue4:null,
                telKey5:null,
                telValue5:null,
                telKey6:null,
                telValue6:null,
                country:null,
                province:null,
                city:null,
                address:null,
                zipcode:null,
                country2:null,
                province2:null,
                city2:null,
                address2:null,
                zipcode2:null,
                note:null,
                create:null,
                update:null
            });t.stopEditing();h.insert(0,e);t.startEditing(0,1)
            };var u=function(){};var AB=function(){
            var e=a.getSelections();if((e)&&(e.length>0)){
                Ext.MessageBox.confirm("删除关联联系人","您确定要删除选中关联联系人?",function(AF){
                    if(AF=="yes"){
                        for(var AE=0;AE<e.length;AE++){
                            h.remove(e[AE])
                            }
                        }
                    })
                }
            };var t=new Ext.grid.EditorGridPanel({
            title:"关联联系人",
            style:"margin-top:10px;",
            store:h,
            border:true,
            cm:k,
            sm:a,
            clicksToEdit:1,
            width:600,
            height:200,
            tbar:["-",{
                iconCls:"icon-add",
                handler:q,
                tooltip:"添加关联联系人"
            },{
                iconCls:"icon-remove",
                handler:AB,
                tooltip:"删除关联联系人"
            },"-",{
                iconCls:"icon-accept",
                tooltip:"更新关联联系人",
                handler:function(){
                    var AE={};var e=h.getCount();if(0<e){
                        for(var AF=0;AF<e;AF++){
                            var AG=h.getAt(AF);AE["chance.chanceID"]='300';AE["chance.contacts["+AF+"].id"]=AG.data.id
                            }Ext.Ajax.request({
                            url:'/chance/syncChanceContactManagerAction.action',
                            params:AE,
                            method:"post",
                            success:function(AH){
                                var AI=Ext.decode(AH.responseText);if(false===AI.success){}else{
                                    delete AE;h.reload()
                                    }
                                }
                            })
                        }
                    }
                },"-",{
                iconCls:"icon-reload",
                tooltip:"重新加载关联联系人",
                handler:function(){
                    h.reload()
                    }
                }],
            frame:true
        });t.on("beforeedit",function(AE){
            a.selectRow(AE.row)
            });t.on("render",function(){
            h.load({})
            });t.on("rowdblclick",u);var S=new Ext.tree.TreePanel({
            useArrows:true,
            autoScroll:true,
            animate:true,
            dropConfig:{
                appendOnly:true
            },
            enableDD:true,
            containerScroll:true,
            rootVisible:false,
            border:false,
            loader:new Ext.tree.SliverTreeLoader({
                dataUrl:'production/listCategoryTree.action'
            }),
            root:new Ext.tree.AsyncTreeNode({
                id:"category-1",
                text:"产品及分类",
                draggable:false,
                expanded:true,
                singleClickExpand:true
            }),
            tbar:[{
                tooltip:"重新加载",
                iconCls:"icon-reload",
                handler:function(){
                    S.getRootNode().reload()
                    }
                },"-",{
                iconCls:"icon-expand-all",
                tooltip:"全部展开",
                handler:function(){
                    S.getRootNode().expand(true)
                    }
                },{
                iconCls:"icon-collapse-all",
                tooltip:"全部折叠",
                handler:function(){
                    S.getRootNode().collapse(true)
                    }
                }]
            });var H=new Ext.form.ComboBox({
            store:new Ext.data.SimpleStore({
                fields:[],
                data:[[]]
                }),
            editable:false,
            mode:"local",
            triggerAction:"all",
            listWidth:200,
            maxHeight:200,
            tpl:"<tpl for='.'><div style='height:200px;'><div id='categorytree_ext-gen3910'></div></div></tpl>",
            selectedClass:"",
            anchor:"96%",
            name:"productionName",
            value:"",
            onSelect:function(){}
            });S.on("click",function(AE){
            if(AE.isLeaf()===true){
                var e;H.setValue(AE.text.substring(0,(AE.text.indexOf("(")==-1?AE.text.length:AE.text.indexOf("("))));Ext.Ajax.request({
                    url:"production/getProductionByIDJson.action",
                    params:{
                        productionID:AE.id.substring(AE.id.lastIndexOf("-")+1)
                        },
                    success:function(AG){
                        e=Ext.decode(AG.responseText);if(e.success===true){
                            var AF=Q.getSelected();AF.data.productionID=e.productionID;AF.data.productionSerial=e.productionSerial;AF.data.productionUnit=e.productionUnit;AF.data.productionVn1=e.productionVn1;AF.data.productionVn2=e.productionVn2;AF.data.productionPrice=e.productionPrice;AF.data.itemPrice=e.productionPrice;AF.data.itemPrice=e.productionPrice
                            }
                        }
                    });H.collapse()
                }
            });H.on("expand",function(){
            S.render('categorytree_ext-gen3910')
            });var g=new Ext.grid.ColumnModel([{
            header:"序号",
            dataIndex:"productionID",
            hidden:true
        },{
            header:"编号",
            css:"background-color:#F1F2F4;",
            dataIndex:"productionSerial",
            width:60
        },{
            header:"产品名称",
            dataIndex:"productionName",
            width:100,
            editor:H
        },{
            header:"单位",
            dataIndex:"productionUnit",
            css:"background-color:#F1F2F4;",
            width:50
        },{
            header:"规格",
            dataIndex:"productionVn1",
            css:"background-color:#F1F2F4;",
            width:50
        },{
            header:"规格2",
            dataIndex:"productionVn2",
            css:"background-color:#F1F2F4;",
            width:90
        },{
            header:"产品报价",
            hidden:true,
            dataIndex:"productionPrice",
            width:100,
            css:"background-color:#F1F2F4;",
            align:"right",
            renderer:SliverUtil.cnMoney
            },{
            header:"价格",
            dataIndex:"itemPrice",
            width:90,
            align:"right",
            renderer:SliverUtil.cnMoney,
            editor:new Ext.form.NumberField({
                allowBlank:false,
                allowNegative:false
            })
            },{
            header:"数量",
            align:"right",
            dataIndex:"itemQuantity",
            width:50,
            editor:new Ext.form.NumberField({
                allowBlank:false,
                allowNegative:false
            })
            },{
            header:"小计",
            dataIndex:"itemTotal",
            width:90,
            css:"background-color:#F1F2F4;",
            align:"right",
            renderer:function(AE,AF,e){
                return SliverUtil.cnMoney(e.data.itemPrice*e.data.itemQuantity)
                }
            }]);var AC=Ext.data.Record.create(["chanceID","productionID","productionSerial","productionName","productionUnit","productionVn1","productionVn2","productionPrice","itemPrice","itemQuantity"]);var b=function(){
            var e=new AC({
                productionID:0,
                productionSerial:"",
                productionName:"",
                productionUnit:"",
                productionVn1:"",
                productionVn2:"",
                productionPrice:"",
                itemPrice:"",
                itemQuantity:0
            });P.stopEditing();B.insert(0,e);P.startEditing(0,1)
            };var N=function(){
            var e=Q.getSelected();if(!e){
                Q.selectFirstRow();e=Q.getSelected()
                }Ext.MessageBox.confirm("删除关联产品","您确定要删除关联产品 "+e.data.productionName+"?",function(AE){
                if(AE=="yes"){
                    P.stopEditing();B.remove(e)
                    }
                })
            };var Q=new Ext.grid.RowSelectionModel({
            singleSelect:true
        });var B=new Ext.data.Store({
            proxy:new Ext.data.HttpProxy({
                url:'chance/loadItemsManagerAction.action?chance.chanceID=300'
            }),
            reader:new Ext.data.JsonReader({
                id:"itemID",
                fields:["productionID","productionSerial","productionName","productionUnit","productionVn1","productionVn2","productionPrice","itemPrice","itemQuantity"]
                }),
            remoteSort:true
        });var P=new Ext.grid.EditorGridPanel({
            title:"关联产品",
            style:"margin-top:10px;",
            store:B,
            border:true,
            cm:g,
            sm:Q,
            width:600,
            height:200,
            clicksToEdit:1,
            tbar:["-",{
                iconCls:"icon-add",
                tooltip:"添加关联产品",
                handler:b
            },{
                iconCls:"icon-remove",
                tooltip:"删除关联产品",
                handler:N
            },"-",{
                iconCls:"icon-accept",
                tooltip:"更新关联产品",
                handler:function(){
                    var AE={};var AG=B.getCount();if(0<AG){
                        for(var e=0;e<AG;e++){
                            var AF=B.getAt(e);AE["chance.chanceID"]='300';AE["chance.items["+e+"].chanceID"]='300';AE["chance.items["+e+"].productionID"]=AF.data.productionID;AE["chance.items["+e+"].itemPrice"]=AF.data.itemPrice;AE["chance.items["+e+"].itemQuantity"]=AF.data.itemQuantity;AE["chance.items["+e+"].itemTotal"]=AF.data.itemTotal
                            }Ext.Ajax.request({
                            url:'/chance/syncChanceItemManagerAction.action',
                            params:AE,
                            method:"post",
                            success:function(AH){
                                var AI=Ext.decode(AH.responseText);if(false===AI.success){}else{
                                    delete AE;B.reload()
                                    }
                                }
                            })
                        }
                    }
                },"-",{
                iconCls:"icon-reload",
                tooltip:"刷新关联产品",
                handler:function(){
                    B.reload()
                    }
                }],
            frame:true
        });P.on("render",function(){
            B.load()
            });P.on("beforeedit",function(AE){
            Q.selectRow(AE.row)
            });P.on("afteredit",function(AH){
            var AG=0;for(var AF=0;AF<B.getCount();AF++){
                var AE=B.getAt(AF);if(AE){
                    AG+=AE.data.itemPrice*AE.data.itemQuantity
                    }
                }c.setValue(AG)
            });var v=new Ext.grid.CheckboxSelectionModel();var C=new Ext.grid.ColumnModel([v,{
            header:"状态",
            dataIndex:"chanceState",
            width:60
        },{
            header:"可能性",
            align:"right",
            dataIndex:"chancePercent",
            renderer:function(e){
                if(e){
                    return e+"%"
                    }
                },
            width:60
        },{
            header:"主题",
            dataIndex:"historyTitle",
            renderer:function(e){
                return Ext.util.Format.ellipsis(e,30)
                },
            width:300
        },{
            header:"日期",
            dataIndex:"historyDate",
            width:80
        }]);var M=Ext.data.Record.create(["historyID","chanceID","chanceState","chancePercent","historyTitle","historyDate","historyContent"]);var X=new Ext.data.Store({
            proxy:new Ext.data.HttpProxy({
                url:'chance/loadHistoriesManagerAction.action?chance.chanceID=300'
            }),
            reader:new Ext.data.JsonReader({
                id:"historyID",
                fields:["historyID","chanceID","chanceState","chancePercent","historyTitle","historyDate","historyContent"]
                }),
            remoteSort:true
        });var o=function(){
            var e=new Ext.Slider({
                style:"margin-bottom:4px;",
                width:280,
                increment:5,
                maxValue:100,
                minValue:0,
                plugins:G
            });var AE=new Ext.form.Hidden({
                name:"history.chancePercent",
                value:0
            });function AG(AK){
                var AL=AK.getValue();AE.setValue(AL)
                }function AF(AK){
                AG.defer(100,null,[AK])
                }e.on({
                change:{
                    fn:AF,
                    scope:this
                },
                drag:{
                    fn:AF,
                    scope:this
                }
                });var AJ=Ext.id();var AI=new Ext.FormPanel({
                labelAlign:"top",
                frame:true,
                border:false,
                formId:AJ,
                items:[{
                    layout:"column",
                    items:[{
                        columnWidth:0.5,
                        layout:"form",
                        items:[{
                            xtype:"combo",
                            store:new Ext.data.SimpleStore({
                                fields:["chanceState"],
                                data:SliverData.chanceState
                                }),
                            editable:false,
                            fieldLabel:"状态",
                            name:"history.chanceState",
                            anchor:"96%",
                            displayField:"chanceState",
                            typeAhead:true,
                            mode:"local",
                            triggerAction:"all",
                            selectOnFocus:true
                        },{
                            html:'<label class="x-form-item x-form-item-label" style="width: auto;" for="ext-comp-1271">可能性:</label>'
                        },e,AE]
                        },{
                        columnWidth:0.5,
                        layout:"form",
                        items:[{
                            xtype:"datefield",
                            fieldLabel:"日期",
                            name:"history.historyDate",
                            anchor:"96%"
                        }]
                        }]
                    },{
                    xtype:"textfield",
                    fieldLabel:"标题",
                    name:"history.historyTitle",
                    width:574
                },{
                    xtype:"textarea",
                    name:"history.historyContent",
                    height:145,
                    width:575,
                    fieldLabel:" 备注"
                },{
                    xtype:"hidden",
                    name:"history.chanceID",
                    value:'300'
                }]
                });var AH=new Ext.Window({
                width:600,
                height:400,
                resizable:false,
                border:false,
                layout:"fit",
                title:"添加关联历史记录",
                iconCls:"icon-contact-add",
                buttonAlign:"right",
                items:AI,
                buttons:[{
                    text:"提交",
                    handler:function(){
                        Ext.Ajax.request({
                            url:'/chance/insertChanceHistoryManagerAction.action',
                            form:AJ,
                            method:"post",
                            success:function(AK){
                                var AL=Ext.decode(AK.responseText);if(false===AL.success){
                                    SliverUtil.markInvalid(AI.items,AL)
                                    }else{
                                    Sliver.getDesktop().msg({
                                        title:"成功",
                                        iconCls:"icon-accept",
                                        html:"关联联系记录已经成功添加"
                                    });if(X){
                                        X.reload()
                                        }AH.close()
                                    }
                                }
                            })
                        }
                    },{
                    text:"关闭",
                    handler:function(){
                        AH.close()
                        }
                    }]
                });AH.show()
            };var s=function(){
            var AF=v.getSelected();if(AF){
                var e=new Ext.Slider({
                    style:"margin-bottom:4px;",
                    width:280,
                    increment:5,
                    maxValue:100,
                    value:AF.data.chancePercent,
                    minValue:0,
                    plugins:G
                });var AE=new Ext.form.Hidden({
                    name:"history.chancePercent",
                    value:AF.data.chancePercent
                    });function AG(AL){
                    var AM=AL.getValue();AE.setValue(AM)
                    }function AK(AL){
                    AG.defer(100,null,[AL])
                    }e.on({
                    change:{
                        fn:AK,
                        scope:this
                    },
                    drag:{
                        fn:AK,
                        scope:this
                    }
                    });var AJ=Ext.id();var AI=new Ext.FormPanel({
                    labelAlign:"top",
                    frame:true,
                    border:false,
                    formId:AJ,
                    items:[{
                        layout:"column",
                        items:[{
                            columnWidth:0.5,
                            layout:"form",
                            items:[{
                                xtype:"combo",
                                store:new Ext.data.SimpleStore({
                                    fields:["chanceState"],
                                    data:SliverData.chanceState
                                    }),
                                editable:false,
                                fieldLabel:"状态",
                                name:"history.chanceState",
                                value:AF.data.chanceState,
                                anchor:"96%",
                                displayField:"chanceState",
                                typeAhead:true,
                                mode:"local",
                                triggerAction:"all",
                                selectOnFocus:true
                            },{
                                html:'<label class="x-form-item x-form-item-label" style="width: auto;" for="ext-comp-1271">可能性:</label>'
                            },e,AE]
                            },{
                            columnWidth:0.5,
                            layout:"form",
                            items:[{
                                xtype:"datefield",
                                fieldLabel:"日期",
                                name:"history.historyDate",
                                value:AF.data.historyDate,
                                anchor:"96%"
                            }]
                            }]
                        },{
                        xtype:"textfield",
                        fieldLabel:"标题",
                        name:"history.historyTitle",
                        value:AF.data.historyTitle,
                        width:574
                    },{
                        xtype:"textarea",
                        name:"history.historyContent",
                        value:AF.data.historyContent,
                        height:145,
                        width:575,
                        fieldLabel:" 备注"
                    },{
                        xtype:"hidden",
                        name:"history.chanceID",
                        value:'300'
                    },{
                        xtype:"hidden",
                        name:"history.historyID",
                        value:AF.data.historyID
                        }]
                    });var AH=new Ext.Window({
                    width:600,
                    height:400,
                    resizable:false,
                    border:false,
                    layout:"fit",
                    title:"关联记录",
                    iconCls:"icon-contact-add",
                    buttonAlign:"right",
                    items:AI,
                    buttons:[{
                        text:"提交",
                        handler:function(){
                            Ext.Ajax.request({
                                url:'/chance/updateChanceHistoryManagerAction.action',
                                form:AJ,
                                method:"post",
                                success:function(AL){
                                    var AM=Ext.decode(AL.responseText);if(false===AM.success){
                                        SliverUtil.markInvalid(AI.items,AM)
                                        }else{
                                        Sliver.getDesktop().msg({
                                            title:"成功",
                                            iconCls:"icon-accept",
                                            html:"关联联系记录已经成功更新"
                                        });if(X){
                                            X.reload()
                                            }AH.close()
                                        }
                                    }
                                })
                            }
                        },{
                        text:"关闭",
                        handler:function(){
                            AH.close()
                            }
                        }]
                    });AH.show()
                }
            };var z=function(){
            var e=v.getSelections();if((e)&&(e.length>0)){
                Ext.MessageBox.confirm("删除关联历史记录","您确定要删除选中关联历史记录?",function(AF){
                    if(AF=="yes"){
                        var AG="";for(var AE=0;AE<e.length;AE++){
                            AG=AG+e[AE].data.historyID;if(AE<e.length-1){
                                AG=AG+","
                                }
                            }Ext.Ajax.request({
                            url:'/chance/removeChanceHistoryManagerAction.action',
                            params:{
                                ids:AG
                            },
                            method:"post",
                            success:function(AH){
                                var AI=Ext.decode(AH.responseText);if(false===AI.success){
                                    SliverUtil.markInvalid(cp.items,AI)
                                    }else{
                                    Sliver.getDesktop().msg({
                                        title:"成功",
                                        iconCls:"icon-accept",
                                        html:"关联联系记录已经成功删除"
                                    });if(X){
                                        X.reload()
                                        }
                                    }
                                }
                            })
                        }
                    })
                }
            };var A=new Ext.grid.GridPanel({
            title:"关联联系记录",
            style:"margin-top:10px;",
            store:X,
            border:true,
            cm:C,
            sm:v,
            width:600,
            height:200,
            tbar:["-",{
                iconCls:"icon-add",
                handler:o,
                tooltip:"添加关联记录"
            },{
                iconCls:"icon-remove",
                handler:z,
                tooltip:"删除关联记录"
            }],
            frame:true
        });A.on("render",function(){
            X.load({})
            });A.on("rowdblclick",s);var d;var W=new Ext.Panel({
            title:"关联文件",
            bodyStyle:"border:1px solid #D0D0D0;",
            style:"margin-top:10px;margin-bottom:5px;background-color:#FFF;height:150px;overflow-x:hidden;overflow-y:auto;",
            border:true,
            width:600,
            height:150,
            frame:false
        });removeChanceManagerFile=function(e){
            Ext.MessageBox.confirm("删除文件","您确定要删除该文件?",function(AE){
                if(AE=="yes"){
                    Ext.Ajax.request({
                        url:'chance/removeChanceManagerFile.action',
                        params:{
                            "file.fileID":e.toString()
                            },
                        success:function(AF){
                            var AG=Ext.decode(AF.responseText);if(AG.success){
                                var AH=document.getElementById('ext-gen3910_'+e);AH.parentNode.removeChild(AH)
                                }
                            }
                        })
                    }
                })
            };var r=new Ext.XTemplate('<tpl for=".">','<div id="ext-gen3910_{fileID}" class="progressWrapper">','<div class="progressContainer">','<a href="#" id="production-handler-{fileID}" class="progressCancel" style="cursor:pointer;visibility:visible;" onclick="javascript:removeChanceManagerFile({fileID})"></a>','<div class="progressName"><a href="javascript:void(0);" style="cursor:pointer;" id="production-handler-{fileID}"  onclick="javascript:window.open(\'chance/downlaodChanceManagerFile.action?file.fileID={fileID}\')"/>{fileName}({fileSize})</div>',"</div></div>","</tpl>",'<div style="clear:both"></div>');W.on("render",function(){
            Ext.Ajax.request({
                url:'/chance/loadFilesManagerAction.action',
                params:{
                    "chance.chanceID":'300'
                },
                method:"post",
                success:function(e){
                    var AF=Ext.decode(e.responseText);if(0<AF.length){
                        for(var AE=0;AE<AF.length;AE++){
                            AF[AE].fileSize=Ext.util.Format.fileSize(AF[AE].fileSize)
                            }
                        }r.overwrite(W.body,AF)
                    }
                });d=new SWFUpload({
                file_dialog_start_handler:fileDialogStart,
                file_queued_handler:fileQueued,
                file_queue_error_handler:fileQueueError,
                file_dialog_complete_handler:fileDialogComplete,
                upload_start_handler:uploadStart,
                upload_progress_handler:uploadProgress,
                upload_error_handler:uploadError,
                upload_success_handler:uploadSuccess,
                upload_complete_handler:uploadComplete,
                flash_url:"js/swfupload/swfupload.swf",
                custom_settings:{
                    progressTarget:W.body.dom.id
                    },
                button_image_url:"images/browser.png",
                button_placeholder_id:J.buttons[0].getId(),
                button_width:75,
                button_height:21,
                debug:false
            })
            });var D=Sliver.getDesktop().getWindow("chance-manager");var w=612;var J=new Ext.Panel({
            buttonAlign:"right",
            frame:true,
            layour:"anchor",
            style:"margin-top:20px;margin-left:"+((D.getSize().width-w-D.getFrameWidth())/2)+"px;padding-bottom:20px;",
            width:w,
            items:[U,t,P,A,W],
            buttons:[{
                text:"浏览"
            },{
                text:"更新",
                handler:function(){
                    var AG=B.getCount();var AE=0;if(0<AG){
                        for(var e=0;e<AG;e++){
                            var AF=B.getAt(e);AE+=AF.data.itemPrice*AF.data.itemQuantity
                            }c.setValue(AE)
                        }Ext.Ajax.request({
                        url:'/chance/updateChanceManagerAction.action',
                        form:L,
                        success:function(AH){
                            var AI=Ext.decode(AH.responseText);if(false===AI.success){
                                SliverUtil.markInvalid(J.items,AI)
                                }else{
                                if(d){
                                    d.setUploadURL('/chance/uploadChanceManagerFile.action');d.setPostParams({
                                        sid:"abct4Ao3lbKrzemVgrdms",
                                        chanceID:'300'
                                    });d.startUpload()
                                    }J.buttons[1].disable()
                                }
                            }
                        })
                    }
                }]
            });J.render('ext-gen3910')
        }catch(AA){
        Sliver.getDesktop().msg({
            title:"错误",
            iconCls:"icon-error",
            html:AA.toString()
            })
        }
    });