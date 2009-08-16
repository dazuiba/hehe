//~~
Sliver.Preferences=Ext.extend(Ext.app.Module,{
    moduleType:"system",
    moduleId:"system-preferences",
    cards:["pref-win-card-1","pref-win-card-2","pref-win-card-3","pref-win-card-4","pref-win-card-5","pref-win-card-6","perf-win-card-7"],
    contentPanel:null,
    cardHistory:["pref-win-card-1"],
    layout:null,
    win:null,
    init:function(){
        this.launcher={
            iconCls:"pref-icon",
            handler:this.createWindow,
            scope:this,
            shortcutIconCls:"pref-shortcut-icon",
            text:"帐户设置",
            tooltip:"<b>帐户设置</b><br />更改您的帐户设置"
        }
    },
    createWindow:function(){
        var D=this.app.getDesktop();this.win=D.getWindow(this.moduleId);
		var C=new Sliver.Preferences.UserMessage({
            owner:this,
            autoScroll:true,
            title:"帐户信息",
            border:false,
            id:"perf-win-card-7"
        });
		C.on("render",function(){
            C.body.getUpdater().update({
                scripts:true,
                method:"post",
                params:{
                    containerID:C.body.id
                },
                url:"system/updateCurrentUserView.action"
            })
        });
		
		if(!this.win){
            var B=610;var A=460;this.contentPanel=new Ext.Panel({
                activeItem:0,
                border:false,
                id:"pref-win-content",
                items:[new Sliver.Preferences.NavPanel({
                        owner:this,
                        id:"pref-win-card-1"
                    }),new Sliver.Preferences.Shortcuts({
                        owner:this,
                        id:"pref-win-card-6"
                    }),new Sliver.Preferences.AutoRun({
                        owner:this,
                        id:"pref-win-card-5"
                    }),new Sliver.Preferences.QuickStart({
                        owner:this,
                        id:"pref-win-card-2"
                    }),new Sliver.Preferences.Appearance({
                        owner:this,
                        id:"pref-win-card-3"
                    }),new Sliver.Preferences.Background({
                        owner:this,
                        id:"pref-win-card-4"
                    }),C],
                layout:"card",
                bbar:[{
                        xtype:"tbfill"
                    },{
                        disabled:true,
                        handler:this.navHandler.createDelegate(this,[-1]),
                        id:"back",
                        scope:this,
                        text:"上一步"
                    },{
                        disabled:true,
                        handler:this.navHandler.createDelegate(this,[1]),
                        id:"next",
                        scope:this,
                        text:"下一步"
                    }]
            });this.win=D.createWindow({
                animCollapse:false,
                constrainHeader:true,
                id:this.moduleId,
                height:A,
                iconCls:"pref-icon",
                items:this.contentPanel,
                layout:"fit",
                shim:false,
                taskbuttonTooltip:"<b>帐户设置</b><br />更改您的设置",
                title:"帐户设置",
                width:B
            });this.layout=this.contentPanel.getLayout()
        }this.win.show()
    },
    handleButtonState:function(){
        var G=this.cardHistory,D=this.layout.activeItem.id,C=this.contentPanel.getBottomToolbar().items,B=C.get(1),F=C.get(2);for(var E=0,A=G.length;E<A;E++){
            if(G[E]===D){
                if(E<=0){
                    B.disable();F.enable()
                }else{
                    if(E>=(A-1)){
                        B.enable();F.disable()
                    }else{
                        B.enable();F.enable()
                    }
                }break
            }
        }
    },
    navHandler:function(C){
        var F=this.cardHistory,B=this.layout.activeItem.id,E;for(var D=0,A=F.length;D<A;D++){
            if(F[D]===B){
                E=F[D+C];break
            }
        }this.layout.setActiveItem(E);this.handleButtonState()
    },
    save:function(A){
        Ext.MessageBox.show({
            msg:"正在保存数据，请等待...",
            progressText:"保存中...",
            width:300,
            wait:true,
            waitConfig:{
                interval:200
            },
            icon:"desktop-download"
        });Ext.Ajax.request({
            url:"system/saveCurrentStyle.action",
            params:A,
            success:function(B){
                if(Ext.decode(B.responseText).success){
                    Ext.MessageBox.hide()
                }else{
                    Ext.MessageBox.hide();Ext.MessageBox.alert("Error","Errors encountered on the server.")
                }
            },
            failure:function(){
                Ext.MessageBox.hide();Ext.MessageBox.alert("Error","Lost connection to server.")
            },
            scope:this
        })
    },
    viewCard:function(A){
        this.layout.setActiveItem(A);if(this.cardHistory.length>1){
            this.cardHistory.pop()
        }this.cardHistory.push(A);this.handleButtonState()
    }
});

//~~
Sliver.Preferences.NavPanel=function(A){
    this.owner=A.owner;Sliver.Preferences.NavPanel.superclass.constructor.call(this,{
        autoScroll:true,
        bodyStyle:"padding:15px",
        border:false,
        html:'<ul id="pref-nav-panel">         <li>           <img src="'+Ext.BLANK_IMAGE_URL+'" class="icon-pref-shortcut"/>           <a id="viewShortcuts" href="#">快捷方式</a><br />           <span>选择出现在桌面上的程序的快捷方式</span>         </li>         <li>           <img src="'+Ext.BLANK_IMAGE_URL+'" class="icon-pref-autorun"/>           <a id="viewAutoRun" href="#">自动运行程序</a><br />           <span>选择登录后及自动运行的程序</span>         </li>         <li>           <img src="'+Ext.BLANK_IMAGE_URL+'" class="icon-pref-quickstart"/>           <a id="viewQuickstart" href="#">快速启动程序</a><br />           <span>设置常用的程序图标</span>         </li>         <li>           <img src="'+Ext.BLANK_IMAGE_URL+'" class="icon-pref-appearance"/>           <a id="viewAppearance" href="#">系统主题</a><br />           <span>选择您的系统主题</span>         </li>         <li>           <img src="'+Ext.BLANK_IMAGE_URL+'" class="icon-pref-wallpaper"/>           <a id="viewWallpapers" href="#">桌面背景</a><br />           <span>选择您的桌面背景图片及背景颜色</span>         </li>         <li>           <img src="'+Ext.BLANK_IMAGE_URL+'" class="icon-pref-account"/>           <a id="viewUserMessage" href="#">帐户信息</a><br />           <span>更改您的帐户信息</span>         </li>       </ul>',
        id:A.id
    });this.actions={
        viewShortcuts:function(B){
            B.viewCard("pref-win-card-6")
        },
        viewAutoRun:function(B){
            B.viewCard("pref-win-card-5")
        },
        viewQuickstart:function(B){
            B.viewCard("pref-win-card-2")
        },
        viewAppearance:function(B){
            B.viewCard("pref-win-card-3")
        },
        viewWallpapers:function(B){
            B.viewCard("pref-win-card-4")
        },
        viewUserMessage:function(B){
            B.viewCard("perf-win-card-7")
        }
    }
};

Ext.extend(Sliver.Preferences.NavPanel,Ext.Panel,{
    afterRender:function(){
        this.body.on({
            mousedown:{
                fn:this.doAction,
                scope:this,
                delegate:"a"
            },
            click:{
                fn:Ext.emptyFn,
                scope:null,
                delegate:"a",
                preventDefault:true
            }
        });Sliver.Preferences.NavPanel.superclass.afterRender.call(this)
    },
    doAction:function(B,A){
        B.stopEvent();this.actions[A.id](this.owner)
    }
});
//~~
Sliver.Preferences.AutoRun=function(E){
    this.owner=E.owner;this.app=this.owner.app;var C=this.app.modules,A=this.app.desktop.config.autorun,D=B(C,A);Sliver.Preferences.AutoRun.superclass.constructor.call(this,{
        autoScroll:true,
        bodyStyle:"padding:10px",
        border:false,
        buttons:[{
                handler:G,
                scope:this,
                text:"保存"
            },{
                handler:I,
                scope:this,
                text:"关闭"
            }],
        cls:"pref-card pref-check-tree",
        id:E.id,
        lines:false,
        listeners:{
            checkchange:{
                fn:H,
                scope:this
            }
        },
        loader:new Ext.tree.TreeLoader(),
        rootVisible:false,
        root:new Ext.tree.AsyncTreeNode({
            text:"自动运行程序",
            children:D
        }),
        title:"自动运行程序"
    });function B(L,N){
        var K=[];for(var M=0,J=L.length;M<J;M++){
            var O=L[M].launcher?L[M].launcher:L[M];if(O.menu){}else{
                K.push({
                    checked:F(L[M].moduleId,N)?true:false,
                    iconCls:L[M].launcher.iconCls,
                    id:L[M].moduleId,
                    leaf:true,
                    selected:true,
                    text:O.text||O.menuText
                })
            }
        }return K
    }function F(M,L){
        for(var K=0,J=L.length;K<J;K++){
            if(M==L[K]){
                return true
            }
        }
    }function H(K,J){
        if(K.leaf&&K.id){
            if(J){
                this.app.desktop.addAutoRun(K.id,true)
            }else{
                this.app.desktop.removeAutoRun(K.id,true)
            }
        }K.ownerTree.selModel.select(K)
    }function I(){
        this.owner.win.close()
    }function G(){
        this.owner.save({
            task:"autorun",
            autorun:Ext.encode(this.app.desktop.config.autorun).toString()
        })
    }
};

Ext.extend(Sliver.Preferences.AutoRun,Ext.tree.TreePanel);

//~~
Sliver.Preferences.Shortcuts=function(E){
    this.owner=E.owner;this.app=this.owner.app;var C=this.app.modules,A=this.app.desktop.config.shortcuts,D=B(C,A);Sliver.Preferences.Shortcuts.superclass.constructor.call(this,{
        autoScroll:true,
        bodyStyle:"padding:10px",
        border:false,
        buttons:[{
                handler:G,
                scope:this,
                text:"保存"
            },{
                handler:I,
                scope:this,
                text:"关闭"
            }],
        cls:"pref-card pref-check-tree",
        id:E.id,
        lines:false,
        listeners:{
            checkchange:{
                fn:H,
                scope:this
            }
        },
        loader:new Ext.tree.TreeLoader(),
        rootVisible:false,
        root:new Ext.tree.AsyncTreeNode({
            text:"快捷方式",
            children:D
        }),
        title:"快捷方式"
    });function B(L,N){
        var K=[];for(var M=0,J=L.length;M<J;M++){
            var O=L[M].launcher?L[M].launcher:L[M];if(O.menu){}else{
                K.push({
                    checked:F(L[M].moduleId,N)?true:false,
                    iconCls:L[M].launcher.iconCls,
                    id:L[M].moduleId,
                    leaf:true,
                    selected:true,
                    text:O.text||O.menuText
                })
            }
        }return K
    }function F(M,L){
        for(var K=0,J=L.length;K<J;K++){
            if(M==L[K]){
                return true
            }
        }
    }function H(K,J){
        if(K.leaf&&K.id){
            if(J){
                this.app.desktop.addShortcut(K.id,true)
            }else{
                this.app.desktop.removeShortcut(K.id,true)
            }
        }K.ownerTree.selModel.select(K)
    }function I(){
        this.owner.win.close()
    }function G(){
        this.owner.save({
            task:"shortcut",
            shortcut:Ext.encode(this.app.desktop.config.shortcuts).toString()
        })
    }
};

Ext.extend(Sliver.Preferences.Shortcuts,Ext.tree.TreePanel);

//~~
Sliver.Preferences.QuickStart=function(E){
    this.owner=E.owner;this.app=this.owner.app;var C=this.app.modules,A=this.app.desktop.config.quickstart,D=B(C,A);Sliver.Preferences.QuickStart.superclass.constructor.call(this,{
        autoScroll:true,
        bodyStyle:"padding:10px",
        border:false,
        buttons:[{
                handler:G,
                scope:this,
                text:"保存"
            },{
                handler:I,
                scope:this,
                text:"关闭"
            }],
        cls:"pref-card pref-check-tree",
        id:E.id,
        lines:false,
        listeners:{
            checkchange:{
                fn:H,
                scope:this
            }
        },
        loader:new Ext.tree.TreeLoader(),
        rootVisible:false,
        root:new Ext.tree.AsyncTreeNode({
            text:"快速启动",
            children:D
        }),
        title:"快速启动"
    });function B(L,N){
        var K=[];for(var M=0,J=L.length;M<J;M++){
            var O=L[M].launcher?L[M].launcher:L[M];if(O.menu){}else{
                K.push({
                    checked:F(L[M].moduleId,N)?true:false,
                    iconCls:L[M].launcher.iconCls,
                    id:L[M].moduleId,
                    leaf:true,
                    selected:true,
                    text:O.text||O.menuText
                })
            }
        }return K
    }function F(M,L){
        for(var K=0,J=L.length;K<J;K++){
            if(M==L[K]){
                return true
            }
        }
    }function H(K,J){
        if(K.leaf&&K.id){
            if(J){
                this.app.desktop.addQuickStartButton(K.id,true)
            }else{
                this.app.desktop.removeQuickStartButton(K.id,true)
            }
        }K.ownerTree.selModel.select(K)
    }function I(){
        this.owner.win.close()
    }function G(){
        this.owner.save({
            task:"quickstart",
            quickstart:Ext.encode(this.app.desktop.config.quickstart).toString()
        })
    }
};

Ext.extend(Sliver.Preferences.QuickStart,Ext.tree.TreePanel);


//~~
Sliver.Preferences.Appearance=function(A){
    this.owner=A.owner;this.app=this.owner.app;var N=this.app.getDesktop();var M=new Ext.data.JsonStore({
        baseParams:{},
        fields:["themeID","themeName","themeThumbnail","themePath"],
        id:"themeID",
        root:"themes",
        url:"system/listSystemTheme.action"
    });M.load();this.store=M;M.on("load",function(P,O){
        if(O){
            D.setTitle("可用主题 ("+O.length+")");var Q=this.app.desktop.config.styles.theme.id;if(Q){
                K.select(String(Q))
            }
        }
    },this);var H=new Ext.XTemplate('<tpl for=".">','<div class="pref-view-thumb-wrap" id="{themeID}">','<div class="pref-view-thumb"><img src="{themeThumbnail}" title="{themeName}" /></div>',"<span>{shortName}</span></div>","</tpl>",'<div class="x-clear"></div>');var K=new Ext.DataView({
        autoHeight:true,
        emptyText:"无可用主题",
        itemSelector:"div.pref-view-thumb-wrap",
        loadingText:"加载中...",
        singleSelect:true,
        overClass:"x-view-over",
        prepareData:function(O){
            O.shortName=Ext.util.Format.ellipsis(O.name,17);return O
        },
        store:M,
        tpl:H
    });K.on("selectionchange",E,this);var D=new Ext.Panel({
        border:false,
        cls:"pref-thumbnail-viewer",
        collapsible:true,
        id:"pref-theme-view",
        items:K,
        title:"默认主题",
        titleCollapse:true
    });var L=new Ext.Panel({
        autoScroll:true,
        bodyStyle:"padding:10px",
        border:true,
        cls:"pref-card-subpanel",
        id:"themes",
        items:D,
        margins:"10 15 0 15",
        region:"center"
    });this.slider=G({
        handler:new Ext.util.DelayedTask(I,this),
        min:0,
        max:100,
        x:15,
        y:35,
        width:100
    });var B=new Ext.FormPanel({
        border:false,
        height:70,
        bodyStyle:"font-size:12px;",
        items:[{
                x:15,
                y:15,
                xtype:"label",
                text:"设置任务栏 透明度"
            },this.slider.slider,this.slider.display],
        layout:"absolute",
        split:false,
        region:"south"
    });function G(Q){
        var X=Q.handler,R=Q.min,U=Q.max,P=Q.width||100,V=Q.x,T=Q.y;var O=new Ext.Slider({
            width:P,
            maxValue:U,
            minValue:R,
            x:V,
            y:T
        });var S=new Ext.form.NumberField({
            cls:"pref-percent-field",
            enableKeyEvents:true,
            maxValue:U,
            minValue:R,
            width:45,
            x:V+P+15,
            y:T-1
        });function W(Z){
            var Y=Z.getValue();S.setValue(Y);X.delay(100,null,null,[Y])
        }O.on({
            change:{
                fn:W,
                scope:this
            },
            drag:{
                fn:W,
                scope:this
            }
        });S.on({
            keyup:{
                fn:function(Z){
                    var Y=Z.getValue();if(Y!==""&&!isNaN(Y)&&Y>=Z.minValue&&Y<=Z.maxValue){
                        O.setValue(Y)
                    }
                },
                buffer:350,
                scope:this
            }
        });return{
            slider:O,
            display:S
        }
    }Sliver.Preferences.Appearance.superclass.constructor.call(this,{
        border:false,
        buttons:[{
                handler:F,
                scope:this,
                text:"保存"
            },{
                handler:J,
                scope:this,
                text:"关闭"
            }],
        cls:"pref-card",
        id:A.id,
        items:[L,B],
        layout:"border",
        title:"系统主题"
    });function J(){
        this.owner.win.close()
    }function F(){
        var O=this.app.desktop.config.styles;this.owner.save({
            task:"theme",
            themeID:O.theme.themeID,
            transparency:O.transparency
        })
    }function E(P,R){
        if(R.length>0){
            var O=this.app.desktop.config.styles.theme.themeID,Q=P.getRecord(R[0]),S=Q.data;if(parseInt(O)!==parseInt(Q.id)){
                if(Q&&Q.id&&S.themeName&&S.themePath){
                    N.setTheme({
                        themeID:Q.id,
                        themeName:S.themeName,
                        themePath:S.themePath
                    })
                }
            }
        }
    }function I(O){
        N.setTransparency(O)
    }function C(P,O){
        N.setTransparency(O)
    }
};


Ext.extend(Sliver.Preferences.Appearance,Ext.Panel,{
    afterRender:function(){
        Sliver.Preferences.Appearance.superclass.afterRender.call(this);this.on("show",this.loadStore,this,{
            single:true
        })
    },
    loadStore:function(){
        this.store.load();this.slider.slider.setValue(this.app.desktop.getTransparency())
    }
});
//~~
Sliver.Preferences.Background=function(P){
    this.owner=P.owner;this.app=this.owner.app;var N=this.app.getDesktop();var C=new Ext.data.JsonStore({
        baseParams:{},
        fields:["wallpaperID","wallpaperName","wallpaperThumbnail","wallpaperPath"],
        id:"wallpaperID",
        root:"wallpapers",
        url:"system/listSystemWallpaper.action"
    });C.load();this.store=C;C.on("load",function(T,S){
        if(S){
            E.setTitle("可用桌面背景 ("+S.length+")");var U=this.app.desktop.config.styles.wallpaper.id;if(U){
                G.select("wallpaper-"+U)
            }
        }
    },this);var R=new Ext.XTemplate('<tpl for=".">','<div class="pref-view-thumb-wrap" id="{wallpaperID}">','<div class="pref-view-thumb"><img src="{wallpaperThumbnail}" title="{wallpaperName}" /></div>',"<span>{shortName}</span></div>","</tpl>",'<div class="x-clear"></div>');var G=new Ext.DataView({
        autoHeight:true,
        emptyText:"没有可用桌面背景",
        itemSelector:"div.pref-view-thumb-wrap",
        loadingText:"加载中...",
        singleSelect:true,
        overClass:"x-view-over",
        prepareData:function(S){
            S.shortName=Ext.util.Format.ellipsis(S.name,17);return S
        },
        store:C,
        tpl:R
    });G.on("selectionchange",H,this);var E=new Ext.Panel({
        border:false,
        cls:"pref-thumbnail-viewer",
        collapsible:true,
        id:"pref-wallpaper-view",
        items:G,
        title:"桌面背景",
        titleCollapse:true
    });var D=new Ext.Panel({
        autoScroll:true,
        bodyStyle:"padding:10px",
        border:true,
        cls:"pref-card-subpanel",
        id:"wallpapers",
        items:E,
        margins:"10 15 0 15",
        region:"center"
    });var J=this.app.desktop.config.styles.wallpaperposition;var M=O("tile",J=="tile"?true:false,90,40);var F=O("center",J=="center"?true:false,200,40);var Q=new Ext.FormPanel({
        border:false,
        height:140,
        bodyStyle:"font-size:12px;",
        id:"position",
        items:[{
                border:false,
                items:{
                    border:false,
                    html:"选择背景图片排列方式?"
                },
                x:15,
                y:15
            },{
                border:false,
                items:{
                    border:false,
                    html:'<img class="bg-pos-tile" src="'+Ext.BLANK_IMAGE_URL+'" width="64" height="44" border="0" alt="" />'
                },
                x:15,
                y:40
            },M,{
                border:false,
                items:{
                    border:false,
                    html:'<img class="bg-pos-center" src="'+Ext.BLANK_IMAGE_URL+'" width="64" height="44" border="0" alt="" />'
                },
                x:125,
                y:40
            },F,{
                border:false,
                items:{
                    border:false,
                    html:"桌面背景颜色"
                },
                x:245,
                y:15
            },{
                border:false,
                items:new Ext.ColorPalette({
                    listeners:{
                        select:{
                            fn:L,
                            scope:this
                        }
                    }
                }),
                x:245,
                y:40
            },{
                border:false,
                items:{
                    border:false,
                    html:"选择桌面字体颜色"
                },
                x:425,
                y:15
            },{
                border:false,
                items:new Ext.ColorPalette({
                    listeners:{
                        select:{
                            fn:K,
                            scope:this
                        }
                    }
                }),
                x:425,
                y:40
            }],
        layout:"absolute",
        region:"south",
        split:false
    });
//~~
Sliver.Preferences.Background.superclass.constructor.call(this,{
        border:false,
        buttons:[{
                handler:I,
                scope:this,
                text:"保存"
            },{
                handler:A,
                scope:this,
                text:"关闭"
            }],
        cls:"pref-card",
        id:P.id,
        items:[D,Q],
        layout:"border",
        title:"桌面背景"
    });function O(U,T,S,V){
        if(U){
            radio=new Ext.form.Radio({
                name:"position",
                inputValue:U,
                checked:T,
                x:S,
                y:V
            });radio.on("check",B,radio);return radio
        }
    }function A(){
        this.owner.win.close()
    }function L(T,S){
        N.setBackgroundColor(S)
    }function K(T,S){
        N.setFontColor(S)
    }function I(){
        var S=this.app.desktop.config.styles;this.owner.save({
            task:"wallpaper",
            wallpaperID:S.wallpaper.wallpaperID,
            backgroundColor:S.backgroundcolor,
            fontColor:S.fontcolor,
            wallpaperPosition:S.wallpaperposition
        })
    }function H(T,V){
        if(V.length>0){
            var S=this.app.desktop.config.styles.wallpaper.wallpaperID,U=T.getRecord(V[0]),W=U.data;if(parseInt(S)!==parseInt(U.id)){
                if(U&&U.id&&W.wallpaperName&&W.wallpaperPath){
                    N.setWallpaper({
                        wallpaperID:U.id,
                        wallpaperName:W.wallpaperName,
                        wallpaperPath:W.wallpaperPath
                    })
                }
            }
        }
    }function B(T,S){
        if(S===true){
            N.setWallpaperPosition(T.inputValue)
        }
    }
};

Ext.extend(Sliver.Preferences.Background,Ext.Panel,{
    afterRender:function(){
        Sliver.Preferences.Background.superclass.afterRender.call(this)
    }
});

Sliver.Preferences.UserMessage=function(A){
    this.owner=A.owner;Sliver.Preferences.UserMessage.superclass.constructor.call(this,A)
};
Ext.extend(Sliver.Preferences.UserMessage,Ext.Panel,{});
Ext.override(Ext.tree.TreeNodeUI,{
    toggleCheck:function(B){
        var A=this.checkbox;if(A){
            A.checked=(B===undefined?!A.checked:B);this.fireEvent("checkchange",this.node,A.checked)
        }
    }
});
