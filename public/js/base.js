Ext.app.App=function(A){
    Ext.apply(this,A);this.addEvents({
        ready:true,
        beforeunload:true
    });Ext.onReady(this.initApp,this)
};Ext.extend(Ext.app.App,Ext.util.Observable,{
    isReady:false,
    modules:null,
    initApp:function(){
        var A=new Ext.KeyMap(document,[{
            key:Ext.EventObject.BACKSPACE,
            stopEvent:false,
            fn:function(C,D){
                var B=D.target.tagName;if((B!=="INPUT")&&(B!=="TEXTAREA")){
                    D.stopEvent()
                }
            }
        }]);this.startConfig=this.startConfig||this.getStartConfig();this.desktop=new Ext.Desktop(this);this.modules=this.getModules();if(this.modules){
            this.initModules(this.modules);this.initDesktopConfig()
        }this.init();Ext.EventManager.on(window,"beforeunload",this.onUnload,this);this.fireEvent("ready",this);this.isReady=true
    },
    getModules:Ext.emptyFn,
    getStartConfig:Ext.emptyFn,
    getDesktopConfig:Ext.emptyFn,
    init:Ext.emptyFn,
    initModules:function(B){
        for(var C=0,A=B.length;C<A;C++){
            B[C].app=this
        }
    },
    initDesktopConfig:function(A){
        if(!A){
            this.getDesktopConfig()
        }else{
            A.contextmenu=A.contextmenu||[];A.startmenu=A.startmenu||[];A.quickstart=A.quickstart||[];A.shortcuts=A.shortcuts||[];A.styles=A.styles||[];A.autorun=A.autorun||[];this.desktop.config=A;this.desktop.initialConfig=A;this.initContextMenu(A.contextmenu);this.initStartMenu(A.startmenu);this.initQuickStart(A.quickstart);this.initShortcuts(A.shortcuts);this.initStyles(A.styles);this.initAutoRun(A.autorun)
        }
    },
    initAutoRun:function(D){
        if(D){
            for(var C=0,B=D.length;C<B;C++){
                var A=this.getModule(D[C]);if(A){
                    A.autorun=true;A.createWindow()
                }
            }
        }
    },
    initContextMenu:function(C){
        if(C){
            for(var B=0,A=C.length;B<A;B++){
                this.desktop.addContextMenuItem(C[B])
            }
        }
    },
    initShortcuts:function(C){
        if(C){
            for(var B=0,A=C.length;B<A;B++){
                this.desktop.addShortcut(C[B],false)
            }
        }
    },
    initStartMenu:function(E){
        if(E){
            for(var D=0,B=E.length;D<B;D++){
                var A=this.getModule(E[D]);if(A){
                    var F=this;C(this.desktop.taskbar.startMenu,A)
                }
            }
        }function C(L,G){
            if(G.moduleType=="menu"){
                var H=G.items;for(var I=0,K=H.length;I<K;I++){
                    var J=F.getModule(H[I]);if(J){
                        C(G.menu,J)
                    }
                }
            }if(G.launcher){
                L.add(G.launcher)
            }
        }
    },
    initQuickStart:function(C){
        if(C){
            for(var B=0,A=C.length;B<A;B++){
                this.desktop.addQuickStartButton(C[B],false)
            }
        }
    },
    initStyles:function(A){
        this.desktop.setBackgroundColor(A.backgroundcolor);this.desktop.setFontColor(A.fontcolor);this.desktop.setTheme(A.theme);this.desktop.setTransparency(A.transparency);this.desktop.setWallpaper(A.wallpaper);this.desktop.setWallpaperPosition(A.wallpaperposition)
    },
    getModule:function(B){
        var C=this.modules;for(var D=0,A=C.length;D<A;D++){
            if(C[D].moduleId==B||C[D].moduleType==B){
                return C[D]
            }
        }return""
    },
    onReady:function(B,A){
        if(!this.isReady){
            this.on("ready",B,A)
        }else{
            B.call(A,this)
        }
    },
    getDesktop:function(){
        return this.desktop
    },
    onUnload:function(A){
        if(this.fireEvent("beforeunload",this)===false){
            A.stopEvent()
        }
    }
});Ext.Desktop=function(A){
    this.taskbar=new Ext.ux.TaskBar(A);var F=this.taskbar;this.el=Ext.get("x-desktop");var J=this.el;var C=Ext.get("ux-taskbar");this.shortcuts=new Ext.ux.Shortcuts({
        renderTo:"x-desktop",
        taskbarEl:C
    });this.config=null;this.initialConfig=null;var H=Ext.WindowMgr;var D;function E(L){
        L.minimized=true;L.hide()
    }function I(L){
        if(D&&D!=L){
            K(D)
        }F.setActiveButton(L.taskButton);D=L;Ext.fly(L.taskButton.el).addClass("active-win");Ext.fly(L.el).removeClass("x-masked");L.minimized=false
    }function K(L){
        if(L==D){
            D=null;Ext.fly(L.taskButton.el).removeClass("active-win");Ext.fly(L.el).addClass("x-masked")
        }
    }function B(L){
        F.taskButtonPanel.remove(L.taskButton);G()
    }function G(){
        J.setHeight(Ext.lib.Dom.getViewHeight()-C.getHeight())
    }Ext.EventManager.onWindowResize(G);this.layout=G;this.createWindow=function(M,L){
        var N=new (L||Ext.Window)(Ext.applyIf(M||{},{
            manager:H,
            minimizable:true,
            maximizable:true
        }));N.render(J);N.taskButton=F.taskButtonPanel.add(N);N.cmenu=new Ext.menu.Menu({
            items:[]
        });N.animateTarget=N.taskButton.el;N.on({
            activate:{
                fn:I
            },
            beforeshow:{
                fn:I
            },
            deactivate:{
                fn:K
            },
            minimize:{
                fn:E
            },
            close:{
                fn:B
            }
        });G();return N
    };this.getManager=function(){
        return H
    };this.getWindow=function(L){
        return H.get(L)
    };this.getWinWidth=function(){
        var L=Ext.lib.Dom.getViewWidth();return L<200?200:L
    };this.getWinHeight=function(){
        var L=(Ext.lib.Dom.getViewHeight()-C.getHeight());return L<100?100:L
    };this.getWinX=function(L){
        return(Ext.lib.Dom.getViewWidth()-L)/2
    };this.getWinY=function(L){
        return(Ext.lib.Dom.getViewHeight()-C.getHeight()-L)/2
    };this.setBackgroundColor=function(L){
        if(L){
            Ext.get(document.body).setStyle("background-color","#"+L);this.config.styles.backgroundcolor=L
        }
    };this.setFontColor=function(L){
        if(L){
            Ext.util.CSS.updateRule(".ux-shortcut-btn-text","color","#"+L);this.config.styles.fontcolor=L
        }
    };this.setTheme=function(L){
        if(L&&L.themeID&&L.themeName&&L.themePath){
            Ext.util.CSS.swapStyleSheet("theme",L.themePath);this.config.styles.theme=L
        }
    };this.setTransparency=function(L){
        if(L>=0&&L<=100){
            C.addClass("transparent");Ext.util.CSS.updateRule(".transparent","opacity",L/100);Ext.util.CSS.updateRule(".transparent","-moz-opacity",L/100);Ext.util.CSS.updateRule(".transparent","filter","alpha(opacity="+L+")");this.config.styles.transparency=L
        }
    };this.getTransparency=function(){
        return this.config.styles.transparency
    };this.setWallpaper=function(O){
        if(O&&O.wallpaperID&&O.wallpaperName&&O.wallpaperPath){
            var M=new Image();M.src=O.wallpaperPath;var L=new Ext.util.DelayedTask(N);L.delay(200);this.config.styles.wallpaper=O
        }function N(){
            if(M.complete){
                Ext.MessageBox.hide();L.cancel();document.body.background=M.src
            }else{
                L.delay(200)
            }
        }
    };this.setWallpaperPosition=function(M){
        if(M){
            if(M==="center"){
                var L=Ext.get(document.body);L.removeClass("wallpaper-tile");L.addClass("wallpaper-center")
            }else{
                if(M==="tile"){
                    var L=Ext.get(document.body);L.removeClass("wallpaper-center");L.addClass("wallpaper-tile")
                }
            }this.config.styles.wallpaperposition=M
        }
    };this.addAutoRun=function(N){
        var L=A.getModule(N),M=this.config.autorun;if(L&&!L.autorun){
            L.autorun=true;M.push(N)
        }
    };this.removeAutoRun=function(O){
        var L=A.getModule(O),N=this.config.autorun;if(L&&L.autorun){
            var M=0;while(M<N.length){
                if(N[M]==O){
                    N.splice(M,1)
                }else{
                    M++
                }
            }L.autorun=null
        }
    };this.addContextMenuItem=function(M){
        var L=A.getModule(M);if(L&&!L.contextMenuItem){
            this.cmenu.add(L.launcher)
        }
    };this.addShortcut=function(O,M){
        var L=A.getModule(O);if(L&&!L.shortcut){
            var N=L.launcher;L.shortcut=this.shortcuts.addShortcut({
                handler:N.handler,
                iconCls:N.shortcutIconCls,
                scope:N.scope,
                text:N.text
            });if(M){
                this.config.shortcuts.push(O)
            }
        }
    };this.removeShortcut=function(P,M){
        var L=A.getModule(P);if(L&&L.shortcut){
            this.shortcuts.removeShortcut(L.shortcut);L.shortcut=null;if(M){
                var O=this.config.shortcuts,N=0;while(N<O.length){
                    if(O[N]==P){
                        O.splice(N,1)
                    }else{
                        N++
                    }
                }
            }
        }
    };this.addQuickStartButton=function(O,M){
        var L=A.getModule(O);if(L&&!L.quickStartButton){
            var N=L.launcher;L.quickStartButton=this.taskbar.quickStartPanel.add({
                handler:N.handler,
                iconCls:N.iconCls,
                scope:N.scope,
                text:N.text,
                tooltip:N.tooltip||N.text
            });if(M){
                this.config.quickstart.push(O)
            }
        }
    };this.removeQuickStartButton=function(P,N){
        var M=A.getModule(P);if(M&&M.quickStartButton){
            this.taskbar.quickStartPanel.remove(M.quickStartButton);M.quickStartButton=null;if(N){
                var L=this.config.quickstart,O=0;while(O<L.length){
                    if(L[O]==P){
                        L.splice(O,1)
                    }else{
                        O++
                    }
                }
            }
        }
    };this.msg=function(L){
        var M=new Ext.ux.Message(Ext.apply({
            animateTarget:C,
            autoDestroy:true,
            hideDelay:5000,
            html:"",
            iconCls:"icon-waiting",
            title:""
        },L));M.show();return M
    };this.hideMsg=function(M,L){
        if(M){
            (function(){
                M.animHide()
            }).defer(L||3000)
        }
    };G();this.cmenu=new Ext.menu.Menu();J.on("contextmenu",function(M){
        if(M.target.id===J.id){
            M.stopEvent();if(!this.cmenu.el){
                this.cmenu.render()
            }var L=M.getXY();L[1]-=this.cmenu.el.getHeight();this.cmenu.showAt(L)
        }
    },this)
};Ext.ux.MessageMgr={
    positions:[]
};Ext.ux.Message=Ext.extend(Ext.Window,{
    initComponent:function(){
        Ext.apply(this,{
            iconCls:this.iconCls||"icon-comment",
            width:200,
            autoHeight:true,
            closable:true,
            plain:false,
            draggable:false,
            bodyStyle:"text-align:left;padding:10px;",
            resizable:false
        });if(this.autoDestroy){
            this.task=new Ext.util.DelayedTask(this.close,this)
        }else{
            this.closable=true
        }Ext.ux.Message.superclass.initComponent.call(this)
    },
    setMessage:function(A){
        this.body.update(A)
    },
    setTitle:function(B,A){
        Ext.ux.Message.superclass.setTitle.call(this,B,A||this.iconCls)
    },
    onRender:function(B,A){
        Ext.ux.Message.superclass.onRender.call(this,B,A)
    },
    onDestroy:function(){
        Ext.ux.MessageMgr.positions.remove(this.pos);Ext.ux.Message.superclass.onDestroy.call(this)
    },
    afterShow:function(){
        Ext.ux.Message.superclass.afterShow.call(this);this.on("move",function(){
            Ext.ux.MessageMgr.positions.remove(this.pos);if(this.autoDestroy){
                this.task.cancel()
            }
        },this);if(this.autoDestroy){
            this.task.delay(this.hideDelay||5000)
        }
    },
    animShow:function(){
        this.pos=0;while(Ext.ux.MessageMgr.positions.indexOf(this.pos)>-1){
            this.pos++
        }Ext.ux.MessageMgr.positions.push(this.pos);this.setSize(200,100);this.el.alignTo(this.animateTarget||document,"br-tr",[-1,-1-((this.getSize().height+10)*this.pos)]);this.el.slideIn("b",{
            duration:0.7,
            callback:this.afterShow,
            scope:this
        })
    },
    animHide:function(){
        Ext.ux.MessageMgr.positions.remove(this.pos);this.el.ghost("b",{
            duration:1,
            remove:true
        })
    }
});Ext.app.Module=function(A){
    Ext.apply(this,A);Ext.app.Module.superclass.constructor.call(this);this.init()
};Ext.extend(Ext.app.Module,Ext.util.Observable,{
    init:Ext.emptyFn
});Ext.namespace("Ext.ux");Ext.ux.Shortcuts=function(A){
    var J=Ext.get(A.renderTo),D=A.taskbarEl,E=74,I=64,C=15,B=null,K=null,G=[];F();function F(){
        B={
            index:1,
            x:C
        };K={
            index:1,
            y:C
        }
    }function H(L){
        if(L>(Ext.lib.Dom.getViewHeight()-D.getHeight())){
            return true
        }return false
    }this.addShortcut=function(L){
        var N=J.createChild({
            tag:"div",
            cls:"ux-shortcut-item"
        });var M=new Ext.ux.ShortcutButton(Ext.apply(L,{
            text:Ext.util.Format.ellipsis(L.text,16)
        }),N);G.push(M);this.setXY(M.container);return M
    };this.removeShortcut=function(M){
        var P=document.getElementById(M.container.id);M.destroy();P.parentNode.removeChild(P);var O=[];for(var N=0,L=G.length;N<L;N++){
            if(G[N]!=M){
                O.push(G[N])
            }
        }G=O;this.handleUpdate()
    };this.handleUpdate=function(){
        F();for(var M=0,L=G.length;M<L;M++){
            this.setXY(G[M].container)
        }
    };this.setXY=function(M){
        var L=K.y+E;var N=H(K.y+E);if(N&&L>(E+C)){
            B={
                index:B.index++,
                x:B.x+I+C
            };K={
                index:1,
                y:C
            }
        }M.setXY([B.x,K.y]);K.index++;K.y=K.y+E+C
    };Ext.EventManager.onWindowResize(this.handleUpdate,this,{
        delay:500
    })
};Ext.ux.ShortcutButton=function(A,B){
    Ext.ux.ShortcutButton.superclass.constructor.call(this,Ext.apply(A,{
        renderTo:B,
        template:new Ext.Template('<div class="ux-shortcut-btn"><div>','<img src="'+Ext.BLANK_IMAGE_URL+'" />','<div class="ux-shortcut-btn-text">{0}</div>',"</div></div>")
    }))
};Ext.extend(Ext.ux.ShortcutButton,Ext.Button,{
    buttonSelector:"div:first",
    initButtonEl:function(A,B){
        Ext.ux.ShortcutButton.superclass.initButtonEl.apply(this,arguments);A.removeClass("x-btn");if(this.iconCls){
            if(!this.cls){
                A.removeClass(this.text?"x-btn-text-icon":"x-btn-icon")
            }
        }
    },
    autoWidth:function(){},
    setText:function(A){
        this.text=A;if(this.el){
            this.el.child("div.ux-shortcut-btn-text").update(A)
        }
    }
});Ext.namespace("Ext.ux");Ext.ux.StartMenu=function(A){
    Ext.ux.StartMenu.superclass.constructor.call(this,A);var B=this.toolItems;this.toolItems=new Ext.util.MixedCollection();if(B){
        this.addTool.apply(this,B)
    }
};Ext.extend(Ext.ux.StartMenu,Ext.menu.Menu,{
    height:300,
    toolPanelWidth:100,
    width:300,
    render:function(){
        if(this.el){
            return
        }var A=this.el=new Ext.Layer({
            cls:"x-menu ux-start-menu",
            shadow:this.shadow,
            constrain:false,
            parentEl:this.parentEl||document.body,
            zindex:15000
        });var E=A.createChild({
            tag:"div",
            cls:"x-window-header x-unselectable x-panel-icon "+this.iconCls
        });E.setStyle("padding","7px 0 0 0");this.header=E;var F=E.createChild({
            tag:"span",
            cls:"x-window-header-text"
        });var O=E.wrap({
            cls:"ux-start-menu-tl"
        });var K=E.wrap({
            cls:"ux-start-menu-tr"
        });var C=E.wrap({
            cls:"ux-start-menu-tc"
        });this.menuBWrap=A.createChild({
            tag:"div",
            cls:"ux-start-menu-body x-border-layout-ct ux-start-menu-body"
        });var D=this.menuBWrap.wrap({
            cls:"ux-start-menu-ml"
        });var L=this.menuBWrap.wrap({
            cls:"ux-start-menu-mc ux-start-menu-bwrap"
        });this.menuPanel=this.menuBWrap.createChild({
            tag:"div",
            cls:"x-panel x-border-panel ux-start-menu-apps-panel opaque"
        });this.toolsPanel=this.menuBWrap.createChild({
            tag:"div",
            cls:"x-panel x-border-panel ux-start-menu-tools-panel opaque"
        });var J=D.wrap({
            cls:"x-window-bwrap"
        });var I=J.createChild({
            tag:"div",
            cls:"ux-start-menu-bc"
        });var B=I.wrap({
            cls:"ux-start-menu-bl x-panel-nofooter"
        });var N=I.wrap({
            cls:"ux-start-menu-br"
        });I.setStyle({
            height:"0px",
            padding:"0 0 6px 0"
        });this.keyNav=new Ext.menu.MenuNav(this);if(this.plain){
            A.addClass("x-menu-plain")
        }if(this.cls){
            A.addClass(this.cls)
        }this.focusEl=A.createChild({
            tag:"a",
            cls:"x-menu-focus",
            href:"#",
            onclick:"return false;",
            tabIndex:"-1"
        });var H=this.menuPanel.createChild({
            id:"SliverDesktopStartMenu",
            tag:"ul",
            cls:"x-menu-list"
        });var M=this.toolsPanel.createChild({
            id:"SliverDesktopStartToolMenu",
            tag:"ul",
            cls:"x-menu-list"
        });var G={
            click:{
                fn:this.onClick,
                scope:this
            },
            mouseover:{
                fn:this.onMouseOver,
                scope:this
            },
            mouseout:{
                fn:this.onMouseOut,
                scope:this
            }
        };H.on(G);this.items.each(function(Q){
            var P=document.createElement("li");P.className="x-menu-list-item";H.dom.appendChild(P);Q.render(P,this)
        },this);this.ul=H;this.autoWidth();M.on(G);this.toolItems.each(function(Q){
            var P=document.createElement("li");P.className="x-menu-list-item";M.dom.appendChild(P);Q.render(P,this)
        },this);this.toolsUl=M;this.autoWidth();this.menuBWrap.setStyle("position","relative");this.menuBWrap.setHeight(this.height);this.menuPanel.setStyle({
            padding:"2px",
            position:"absolute",
            overflow:"auto"
        });this.toolsPanel.setStyle({
            padding:"2px 4px 2px 2px",
            position:"absolute",
            overflow:"auto"
        });this.setTitle(this.title,"user")
    },
    findTargetItem:function(B){
        var A=B.getTarget(".x-menu-list-item",this.ul,true);if(A&&A.menuItemId){
            if(this.items.get(A.menuItemId)){
                return this.items.get(A.menuItemId)
            }else{
                return this.toolItems.get(A.menuItemId)
            }
        }
    },
    show:function(B,E,A){
        this.parentMenu=A;if(!this.el){
            this.render()
        }this.fireEvent("beforeshow",this);this.showAt(this.el.getAlignToXY(B,E||this.defaultAlign),A,false);var D=this.toolPanelWidth;var C=this.menuBWrap.getBox();this.menuPanel.setWidth(C.width-D);this.menuPanel.setHeight(C.height);this.toolsPanel.setWidth(D);this.toolsPanel.setX(C.x+C.width-D);this.toolsPanel.setHeight(C.height)
    },
    addTool:function(){
        var B=arguments,A=B.length,E;for(var C=0;C<A;C++){
            var D=B[C];if(D.render){
                E=this.addToolItem(D)
            }else{
                if(typeof D=="string"){
                    if(D=="separator"||D=="-"){
                        E=this.addToolSeparator()
                    }else{
                        E=this.addText(D)
                    }
                }else{
                    if(D.tagName||D.el){
                        E=this.addElement(D)
                    }else{
                        if(typeof D=="object"){
                            E=this.addToolMenuItem(D)
                        }
                    }
                }
            }
        }return E
    },
    addToolSeparator:function(){
        return this.addToolItem(new Ext.menu.Separator({
            itemCls:"ux-toolmenu-sep"
        }))
    },
    addToolItem:function(B){
        this.toolItems.add(B);if(this.toolsUl){
            var A=document.createElement("li");A.className="x-menu-list-item";this.toolsUl.dom.appendChild(A);B.render(A,this);this.delayAutoWidth()
        }return B
    },
    addToolMenuItem:function(A){
        if(!(A instanceof Ext.menu.Item)){
            if(typeof A.checked=="boolean"){
                A=new Ext.menu.CheckItem(A)
            }else{
                A=new Ext.menu.Item(A)
            }
        }return this.addToolItem(A)
    },
    setTitle:function(B,A){
        this.title=B;if(this.header.child("span")){
            this.header.child("span").update(B)
        }return this
    },
    getToolButton:function(A){
        var B=new Ext.Button({
            handler:A.handler,
            minWidth:this.toolPanelWidth-10,
            scope:A.scope,
            text:A.text
        });return B
    }
});Ext.namespace("Ext.ux");Ext.ux.TaskBar=function(A){
    this.app=A;this.init()
};Ext.extend(Ext.ux.TaskBar,Ext.util.Observable,{
    init:function(){
        this.startMenu=new Ext.ux.StartMenu(Ext.apply({
            iconCls:"user",
            height:300,
            shadow:true,
            title:"Todd Murdock",
            width:300
        },this.app.startConfig));this.startButton=new Ext.Button({
            text:"开始",
            id:"ux-startbutton",
            iconCls:"start",
            menu:this.startMenu,
            menuAlign:"bl-tl",
            renderTo:"ux-taskbar-start"
        });var A=Ext.get("ux-startbutton").getWidth()+10;var D=new Ext.BoxComponent({
            el:"ux-taskbar-start",
            id:"TaskBarStart",
            minWidth:A,
            region:"west",
            split:false,
            width:A
        });this.quickStartPanel=new Ext.ux.QuickStartPanel({
            el:"ux-quickstart-panel",
            id:"TaskBarQuickStart",
            minWidth:60,
            region:"west",
            split:true,
            width:94
        });Ext.ux.Clock=function(){
            this.init=function(F){
                Ext.TaskMgr.start({
                    interval:1000,
                    run:function(){
                        var H=new Date();var J=H.getHours();var G=H.getMinutes();var I="";if(J<10){
                            I="上午"
                        }else{
                            if(J>12){
                                J=J-12;I="下午"
                            }
                        }if(G<10){
                            G="0"+G
                        }F.setText(I+" "+J+":"+G)
                    },
                    scope:this
                })
            }
        };var E=new Ext.Button({
            text:"&nbsp;",
            id:"tasktime",
            iconCls:"icon-time",
            menu:new Ext.menu.DateMenu({}),
            plugins:new Ext.ux.Clock()
        });this.cklPanel=new Ext.Panel({
            el:"ux-taskclock-panel",
            id:"TaskBarClock",
            minWidth:100,
            bodyStyle:"padding-top: 4px; background: none",
            border:false,
            split:false,
            region:"east",
            width:100,
            items:[E]
        });this.taskButtonPanel=new Ext.ux.TaskButtonsPanel({
            el:"ux-taskbuttons-panel",
            id:"TaskBarButtons",
            region:"center"
        });var C=new Ext.Container({
            el:"ux-taskbar-panel-wrap",
            items:[this.quickStartPanel,this.taskButtonPanel,this.cklPanel],
            layout:"border",
            region:"center"
        });var B=new Ext.ux.TaskBarContainer({
            el:"ux-taskbar",
            layout:"border",
            items:[D,C]
        });this.el=B.el;return this
    },
    setActiveButton:function(A){
        this.taskButtonPanel.setActiveButton(A)
    }
});Ext.ux.TaskBarContainer=Ext.extend(Ext.Container,{
    initComponent:function(){
        Ext.ux.TaskBarContainer.superclass.initComponent.call(this);this.el=Ext.get(this.el)||Ext.getBody();this.el.setHeight=Ext.emptyFn;this.el.setWidth=Ext.emptyFn;this.el.setSize=Ext.emptyFn;this.el.setStyle({
            overflow:"hidden",
            margin:"0",
            border:"0 none"
        });this.el.dom.scroll="no";this.allowDomMove=false;this.autoWidth=true;this.autoHeight=true;Ext.EventManager.onWindowResize(this.fireResize,this);this.renderTo=this.el
    },
    fireResize:function(A,B){
        this.fireEvent("resize",this,A,B,A,B)
    }
});Ext.ux.TaskButtonsPanel=Ext.extend(Ext.BoxComponent,{
    activeButton:null,
    enableScroll:true,
    scrollIncrement:0,
    scrollRepeatInterval:400,
    scrollDuration:0.35,
    animScroll:true,
    resizeButtons:true,
    buttonWidth:168,
    minButtonWidth:118,
    buttonMargin:2,
    buttonWidthSet:false,
    initComponent:function(){
        Ext.ux.TaskButtonsPanel.superclass.initComponent.call(this);this.on("resize",this.delegateUpdates);this.items=[];this.stripWrap=Ext.get(this.el).createChild({
            cls:"ux-taskbuttons-strip-wrap",
            cn:{
                tag:"ul",
                cls:"ux-taskbuttons-strip"
            }
        });this.stripSpacer=Ext.get(this.el).createChild({
            cls:"ux-taskbuttons-strip-spacer"
        });this.strip=new Ext.Element(this.stripWrap.dom.firstChild);this.edge=this.strip.createChild({
            tag:"li",
            cls:"ux-taskbuttons-edge"
        });this.strip.createChild({
            cls:"x-clear"
        })
    },
    add:function(C){
        var A=this.strip.createChild({
            tag:"li"
        },this.edge);var B=new Ext.ux.TaskBar.TaskButton(C,A);this.items.push(B);if(!this.buttonWidthSet){
            this.lastButtonWidth=B.container.getWidth()
        }this.setActiveButton(B);return B
    },
    remove:function(D){
        var B=document.getElementById(D.container.id);D.destroy();B.parentNode.removeChild(B);var E=[];for(var C=0,A=this.items.length;C<A;C++){
            if(this.items[C]!=D){
                E.push(this.items[C])
            }
        }this.items=E;this.delegateUpdates()
    },
    setActiveButton:function(A){
        this.activeButton=A;this.delegateUpdates()
    },
    delegateUpdates:function(){
        if(this.resizeButtons&&this.rendered){
            this.autoSize()
        }if(this.enableScroll&&this.rendered){
            this.autoScroll()
        }
    },
    autoSize:function(){
        var H=this.items.length;var C=this.el.dom.offsetWidth;var A=this.el.dom.clientWidth;if(!this.resizeButtons||H<1||!A){
            return
        }var J=Math.max(Math.min(Math.floor((A-4)/H)-this.buttonMargin,this.buttonWidth),this.minButtonWidth);var E=this.stripWrap.dom.getElementsByTagName("button");this.lastButtonWidth=Ext.get(E[0].id).findParent("li").offsetWidth;for(var F=0,I=E.length;F<I;F++){
            var B=E[F];var G=Ext.get(E[F].id).findParent("li").offsetWidth;var D=B.offsetWidth;B.style.width=(J-(G-D))+"px"
        }
    },
    autoScroll:function(){
        var F=this.items.length;var D=this.el.dom.offsetWidth;var C=this.el.dom.clientWidth;var E=this.stripWrap;var B=E.dom.offsetWidth;var G=this.getScrollPos();var A=this.edge.getOffsetsTo(this.stripWrap)[0]+G;if(!this.enableScroll||F<1||B<20){
            return
        }E.setWidth(C);if(A<=C){
            E.dom.scrollLeft=0;if(this.scrolling){
                this.scrolling=false;this.el.removeClass("x-taskbuttons-scrolling");this.scrollLeft.hide();this.scrollRight.hide()
            }
        }else{
            if(!this.scrolling){
                this.el.addClass("x-taskbuttons-scrolling")
            }C-=E.getMargins("lr");E.setWidth(C>20?C:20);if(!this.scrolling){
                if(!this.scrollLeft){
                    this.createScrollers()
                }else{
                    this.scrollLeft.show();this.scrollRight.show()
                }
            }this.scrolling=true;if(G>(A-C)){
                E.dom.scrollLeft=A-C
            }else{
                this.scrollToButton(this.activeButton,true)
            }this.updateScrollButtons()
        }
    },
    createScrollers:function(){
        var C=this.el.dom.offsetHeight;var A=this.el.insertFirst({
            cls:"ux-taskbuttons-scroller-left"
        });A.setHeight(C);A.addClassOnOver("ux-taskbuttons-scroller-left-over");this.leftRepeater=new Ext.util.ClickRepeater(A,{
            interval:this.scrollRepeatInterval,
            handler:this.onScrollLeft,
            scope:this
        });this.scrollLeft=A;var B=this.el.insertFirst({
            cls:"ux-taskbuttons-scroller-right"
        });B.setHeight(C);B.addClassOnOver("ux-taskbuttons-scroller-right-over");this.rightRepeater=new Ext.util.ClickRepeater(B,{
            interval:this.scrollRepeatInterval,
            handler:this.onScrollRight,
            scope:this
        });this.scrollRight=B
    },
    getScrollWidth:function(){
        return this.edge.getOffsetsTo(this.stripWrap)[0]+this.getScrollPos()
    },
    getScrollPos:function(){
        return parseInt(this.stripWrap.dom.scrollLeft,10)||0
    },
    getScrollArea:function(){
        return parseInt(this.stripWrap.dom.clientWidth,10)||0
    },
    getScrollAnim:function(){
        return{
            duration:this.scrollDuration,
            callback:this.updateScrollButtons,
            scope:this
        }
    },
    getScrollIncrement:function(){
        return(this.scrollIncrement||this.lastButtonWidth+2)
    },
    scrollToButton:function(E,A){
        E=E.el.dom.parentNode;if(!E){
            return
        }var C=E;var G=this.getScrollPos(),D=this.getScrollArea();var F=Ext.fly(C).getOffsetsTo(this.stripWrap)[0]+G;var B=F+C.offsetWidth;if(F<G){
            this.scrollTo(F,A)
        }else{
            if(B>(G+D)){
                this.scrollTo(B-D,A)
            }
        }
    },
    scrollTo:function(B,A){
        this.stripWrap.scrollTo("left",B,A?this.getScrollAnim():false);if(!A){
            this.updateScrollButtons()
        }
    },
    onScrollRight:function(){
        var A=this.getScrollWidth()-this.getScrollArea();var C=this.getScrollPos();var B=Math.min(A,C+this.getScrollIncrement());if(B!=C){
            this.scrollTo(B,this.animScroll)
        }
    },
    onScrollLeft:function(){
        var B=this.getScrollPos();var A=Math.max(0,B-this.getScrollIncrement());if(A!=B){
            this.scrollTo(A,this.animScroll)
        }
    },
    updateScrollButtons:function(){
        var A=this.getScrollPos();this.scrollLeft[A==0?"addClass":"removeClass"]("ux-taskbuttons-scroller-left-disabled");this.scrollRight[A>=(this.getScrollWidth()-this.getScrollArea())?"addClass":"removeClass"]("ux-taskbuttons-scroller-right-disabled")
    }
});Ext.ux.TaskBar.TaskButton=function(B,A){
    this.win=B;Ext.ux.TaskBar.TaskButton.superclass.constructor.call(this,{
        iconCls:B.iconCls,
        text:Ext.util.Format.ellipsis(B.title,12),
        tooltip:B.taskbuttonTooltip||B.title,
        renderTo:A,
        handler:function(){
            if(B.minimized||B.hidden){
                B.show()
            }else{
                if(B==B.manager.getActive()){
                    B.minimize()
                }else{
                    B.toFront()
                }
            }
        },
        clickEvent:"mousedown"
    })
};Ext.extend(Ext.ux.TaskBar.TaskButton,Ext.Button,{
    onRender:function(){
        Ext.ux.TaskBar.TaskButton.superclass.onRender.apply(this,arguments);this.cmenu=new Ext.menu.Menu({
            items:[{
                id:"restore",
                text:"恢复",
                handler:function(){
                    if(!this.win.isVisible()){
                        this.win.show()
                    }else{
                        this.win.restore()
                    }
                },
                scope:this
            },{
                id:"minimize",
                text:"最小化",
                handler:this.win.minimize,
                scope:this.win
            },{
                id:"maximize",
                text:"最大化",
                handler:this.win.maximize,
                scope:this.win
            },"-",{
                id:"close",
                text:"关闭",
                handler:this.closeWin.createDelegate(this,this.win,true),
                scope:this.win
            }]
        });this.cmenu.on("beforeshow",function(){
            var B=this.cmenu.items.items;var A=this.win;B[0].setDisabled(A.maximized!==true&&A.hidden!==true);B[1].setDisabled(A.minimized===true);B[2].setDisabled(A.maximized===true||A.hidden===true);B[2].setDisabled(A.maximizable===false);B[3].setDisabled(A.closable===false)
        },this);this.el.on("contextmenu",function(B){
            B.stopEvent();if(!this.cmenu.el){
                this.cmenu.render()
            }var A=B.getXY();A[1]-=this.cmenu.el.getHeight();this.cmenu.showAt(A)
        },this)
    },
    closeWin:function(A,C,B){
        if(!B.isVisible()){
            B.show()
        }else{
            B.restore()
        }B.close()
    },
    setText:function(A){
        if(A){
            this.text=A;if(this.el){
                this.el.child("td.x-btn-center "+this.buttonSelector).update(Ext.util.Format.ellipsis(A,12))
            }
        }
    },
    setTooltip:function(B){
        if(B){
            this.tooltip=B;var A=this.el.child(this.buttonSelector);Ext.QuickTips.unregister(A.id);if(typeof this.tooltip=="object"){
                Ext.QuickTips.register(Ext.apply({
                    target:A.id
                },this.tooltip))
            }else{
                A.dom[this.tooltipType]=this.tooltip
            }
        }
    }
});Ext.ux.QuickStartPanel=Ext.extend(Ext.BoxComponent,{
    enableMenu:true,
    initComponent:function(){
        Ext.ux.QuickStartPanel.superclass.initComponent.call(this);this.on("resize",this.delegateUpdates);this.menu=new Ext.menu.Menu();this.items=[];this.stripWrap=Ext.get(this.el).createChild({
            cls:"ux-quickstart-strip-wrap",
            cn:{
                tag:"ul",
                cls:"ux-quickstart-strip"
            }
        });this.stripSpacer=Ext.get(this.el).createChild({
            cls:"ux-quickstart-strip-spacer"
        });this.strip=new Ext.Element(this.stripWrap.dom.firstChild);this.edge=this.strip.createChild({
            tag:"li",
            cls:"ux-quickstart-edge"
        });this.strip.createChild({
            cls:"x-clear"
        })
    },
    add:function(B){
        var A=this.strip.createChild({
            tag:"li"
        },this.edge);var C=new Ext.Button(Ext.apply(B,{
            cls:"x-btn-icon",
            menuText:B.text,
            renderTo:A,
            text:""
        }));this.items.push(C);this.delegateUpdates();return C
    },
    remove:function(D){
        var B=document.getElementById(D.container.id);D.destroy();B.parentNode.removeChild(B);var E=[];for(var C=0,A=this.items.length;C<A;C++){
            if(this.items[C]!=D){
                E.push(this.items[C])
            }
        }this.items=E;this.delegateUpdates()
    },
    menuAdd:function(A){
        this.menu.add(A)
    },
    delegateUpdates:function(){
        if(this.enableMenu&&this.rendered){
            this.showButtons();this.clearMenu();this.autoMenu()
        }
    },
    showButtons:function(){
        var B=this.items.length;for(var A=0;A<B;A++){
            this.items[A].show()
        }
    },
    clearMenu:function(){
        this.menu.removeAll()
    },
    autoMenu:function(){
        var J=this.items.length;var E=this.el.dom.offsetWidth;var I=this.el.dom.clientWidth;var B=this.stripWrap;var G=B.dom.offsetWidth;var F=this.edge.getOffsetsTo(this.stripWrap)[0];if(!this.enableMenu||J<1||G<20){
            return
        }B.setWidth(I);if(F<=I){
            if(this.showingMenu){
                this.showingMenu=false;this.menuButton.hide()
            }
        }else{
            I-=B.getMargins("lr");B.setWidth(I>20?I:20);if(!this.showingMenu){
                if(!this.menuButton){
                    this.createMenuButton()
                }else{
                    this.menuButton.show()
                }
            }mo=this.getMenuButtonPos();for(var H=J-1;H>=0;H--){
                var A=this.items[H].el.dom.offsetLeft+this.items[H].el.dom.offsetWidth;if(A>mo){
                    this.items[H].hide();var C=this.items[H].initialConfig,D={
                        iconCls:C.iconCls,
                        handler:C.handler,
                        scope:C.scope,
                        text:C.menuText
                    };this.menuAdd(D)
                }else{
                    this.items[H].show()
                }
            }this.showingMenu=true
        }
    },
    createMenuButton:function(){
        var B=this.el.dom.offsetHeight;var C=this.el.insertFirst({
            cls:"ux-quickstart-menubutton-wrap"
        });C.setHeight(B);var A=new Ext.Button({
            cls:"x-btn-icon",
            id:"ux-quickstart-menubutton",
            menu:this.menu,
            renderTo:C
        });C.setWidth(Ext.get("ux-quickstart-menubutton").getWidth());this.menuButton=C
    },
    getMenuButtonPos:function(){
        return this.menuButton.dom.offsetLeft
    }
});Ext.BLANK_IMAGE_URL="js/ext-2.2/resources/images/default/s.gif";Ext.SSL_SECURE_URL="js/ext-2.2/resources/images/default/s.gif";Ext.app.App=function(A){
    Ext.apply(this,A);this.addEvents({
        ready:true,
        beforeunload:true
    });Ext.onReady(this.initApp,this)
};Ext.extend(Ext.app.App,Ext.util.Observable,{
    isReady:false,
    modules:null,
    initApp:function(){
        var A=new Ext.KeyMap(document,[{
            key:Ext.EventObject.BACKSPACE,
            stopEvent:false,
            fn:function(C,D){
                var B=D.target.tagName;if((B!=="INPUT")&&(B!=="TEXTAREA")){
                    D.stopEvent()
                }
            }
        }]);this.startConfig=this.startConfig||this.getStartConfig();this.desktop=new Ext.Desktop(this);this.modules=this.getModules();if(this.modules){
            this.initModules(this.modules);this.initDesktopConfig()
        }this.init();Ext.EventManager.on(window,"beforeunload",this.onUnload,this);this.fireEvent("ready",this);this.isReady=true
    },
    getModules:Ext.emptyFn,
    getStartConfig:Ext.emptyFn,
    getDesktopConfig:Ext.emptyFn,
    init:Ext.emptyFn,
    initModules:function(B){
        for(var C=0,A=B.length;C<A;C++){
            B[C].app=this
        }
    },
    initDesktopConfig:function(A){
        if(!A){
            this.getDesktopConfig()
        }else{
            A.contextmenu=A.contextmenu||[];A.startmenu=A.startmenu||[];A.quickstart=A.quickstart||[];A.shortcuts=A.shortcuts||[];A.styles=A.styles||[];A.autorun=A.autorun||[];this.desktop.config=A;this.desktop.initialConfig=A;this.initContextMenu(A.contextmenu);this.initStartMenu(A.startmenu);this.initQuickStart(A.quickstart);this.initShortcuts(A.shortcuts);this.initStyles(A.styles);this.initAutoRun(A.autorun)
        }
    },
    initAutoRun:function(D){
        if(D){
            for(var C=0,B=D.length;C<B;C++){
                var A=this.getModule(D[C]);if(A){
                    A.autorun=true;A.createWindow()
                }
            }
        }
    },
    initContextMenu:function(C){
        if(C){
            for(var B=0,A=C.length;B<A;B++){
                this.desktop.addContextMenuItem(C[B])
            }
        }
    },
    initShortcuts:function(C){
        if(C){
            for(var B=0,A=C.length;B<A;B++){
                this.desktop.addShortcut(C[B],false)
            }
        }
    },
    initStartMenu:function(E){
        if(E){
            for(var D=0,B=E.length;D<B;D++){
                var A=this.getModule(E[D]);if(A){
                    var F=this;C(this.desktop.taskbar.startMenu,A)
                }
            }
        }function C(L,G){
            if(G.moduleType=="menu"){
                var H=G.items;for(var I=0,K=H.length;I<K;I++){
                    var J=F.getModule(H[I]);if(J){
                        C(G.menu,J)
                    }
                }
            }if(G.launcher){
                L.add(G.launcher)
            }
        }
    },
    initQuickStart:function(C){
        if(C){
            for(var B=0,A=C.length;B<A;B++){
                this.desktop.addQuickStartButton(C[B],false)
            }
        }
    },
    initStyles:function(A){
        this.desktop.setBackgroundColor(A.backgroundcolor);this.desktop.setFontColor(A.fontcolor);this.desktop.setTheme(A.theme);this.desktop.setTransparency(A.transparency);this.desktop.setWallpaper(A.wallpaper);this.desktop.setWallpaperPosition(A.wallpaperposition)
    },
    getModule:function(B){
        var C=this.modules;for(var D=0,A=C.length;D<A;D++){
            if(C[D].moduleId==B||C[D].moduleType==B){
                return C[D]
            }
        }return""
    },
    onReady:function(B,A){
        if(!this.isReady){
            this.on("ready",B,A)
        }else{
            B.call(A,this)
        }
    },
    getDesktop:function(){
        return this.desktop
    },
    onUnload:function(A){
        if(this.fireEvent("beforeunload",this)===false){
            A.stopEvent()
        }
    }
});Ext.Desktop=function(A){
    this.taskbar=new Ext.ux.TaskBar(A);var F=this.taskbar;this.el=Ext.get("x-desktop");var J=this.el;var C=Ext.get("ux-taskbar");this.shortcuts=new Ext.ux.Shortcuts({
        renderTo:"x-desktop",
        taskbarEl:C
    });this.config=null;this.initialConfig=null;var H=Ext.WindowMgr;var D;function E(L){
        L.minimized=true;L.hide()
    }function I(L){
        if(D&&D!=L){
            K(D)
        }F.setActiveButton(L.taskButton);D=L;Ext.fly(L.taskButton.el).addClass("active-win");Ext.fly(L.el).removeClass("x-masked");L.minimized=false
    }function K(L){
        if(L==D){
            D=null;Ext.fly(L.taskButton.el).removeClass("active-win");Ext.fly(L.el).addClass("x-masked")
        }
    }function B(L){
        F.taskButtonPanel.remove(L.taskButton);G()
    }function G(){
        J.setHeight(Ext.lib.Dom.getViewHeight()-C.getHeight())
    }Ext.EventManager.onWindowResize(G);this.layout=G;this.createWindow=function(M,L){
        var N=new (L||Ext.Window)(Ext.applyIf(M||{},{
            manager:H,
            minimizable:true,
            maximizable:true
        }));N.render(J);N.taskButton=F.taskButtonPanel.add(N);N.cmenu=new Ext.menu.Menu({
            items:[]
        });N.animateTarget=N.taskButton.el;N.on({
            activate:{
                fn:I
            },
            beforeshow:{
                fn:I
            },
            deactivate:{
                fn:K
            },
            minimize:{
                fn:E
            },
            close:{
                fn:B
            }
        });G();return N
    };this.getManager=function(){
        return H
    };this.getWindow=function(L){
        return H.get(L)
    };this.getWinWidth=function(){
        var L=Ext.lib.Dom.getViewWidth();return L<200?200:L
    };this.getWinHeight=function(){
        var L=(Ext.lib.Dom.getViewHeight()-C.getHeight());return L<100?100:L
    };this.getWinX=function(L){
        return(Ext.lib.Dom.getViewWidth()-L)/2
    };this.getWinY=function(L){
        return(Ext.lib.Dom.getViewHeight()-C.getHeight()-L)/2
    };this.setBackgroundColor=function(L){
        if(L){
            Ext.get(document.body).setStyle("background-color","#"+L);this.config.styles.backgroundcolor=L
        }
    };this.setFontColor=function(L){
        if(L){
            Ext.util.CSS.updateRule(".ux-shortcut-btn-text","color","#"+L);this.config.styles.fontcolor=L
        }
    };this.setTheme=function(L){
        if(L&&L.themeID&&L.themeName&&L.themePath){
            Ext.util.CSS.swapStyleSheet("theme",L.themePath);this.config.styles.theme=L
        }
    };this.setTransparency=function(L){
        if(L>=0&&L<=100){
            C.addClass("transparent");Ext.util.CSS.updateRule(".transparent","opacity",L/100);Ext.util.CSS.updateRule(".transparent","-moz-opacity",L/100);Ext.util.CSS.updateRule(".transparent","filter","alpha(opacity="+L+")");this.config.styles.transparency=L
        }
    };this.getTransparency=function(){
        return this.config.styles.transparency
    };this.setWallpaper=function(O){
        if(O&&O.wallpaperID&&O.wallpaperName&&O.wallpaperPath){
            var M=new Image();M.src=O.wallpaperPath;var L=new Ext.util.DelayedTask(N);L.delay(200);this.config.styles.wallpaper=O
        }function N(){
            if(M.complete){
                Ext.MessageBox.hide();L.cancel();document.body.background=M.src
            }else{
                L.delay(200)
            }
        }
    };this.setWallpaperPosition=function(M){
        if(M){
            if(M==="center"){
                var L=Ext.get(document.body);L.removeClass("wallpaper-tile");L.addClass("wallpaper-center")
            }else{
                if(M==="tile"){
                    var L=Ext.get(document.body);L.removeClass("wallpaper-center");L.addClass("wallpaper-tile")
                }
            }this.config.styles.wallpaperposition=M
        }
    };this.addAutoRun=function(N){
        var L=A.getModule(N),M=this.config.autorun;if(L&&!L.autorun){
            L.autorun=true;M.push(N)
        }
    };this.removeAutoRun=function(O){
        var L=A.getModule(O),N=this.config.autorun;if(L&&L.autorun){
            var M=0;while(M<N.length){
                if(N[M]==O){
                    N.splice(M,1)
                }else{
                    M++
                }
            }L.autorun=null
        }
    };this.addContextMenuItem=function(M){
        var L=A.getModule(M);if(L&&!L.contextMenuItem){
            this.cmenu.add(L.launcher)
        }
    };this.addShortcut=function(O,M){
        var L=A.getModule(O);if(L&&!L.shortcut){
            var N=L.launcher;L.shortcut=this.shortcuts.addShortcut({
                handler:N.handler,
                iconCls:N.shortcutIconCls,
                scope:N.scope,
                text:N.text
            });if(M){
                this.config.shortcuts.push(O)
            }
        }
    };this.removeShortcut=function(P,M){
        var L=A.getModule(P);if(L&&L.shortcut){
            this.shortcuts.removeShortcut(L.shortcut);L.shortcut=null;if(M){
                var O=this.config.shortcuts,N=0;while(N<O.length){
                    if(O[N]==P){
                        O.splice(N,1)
                    }else{
                        N++
                    }
                }
            }
        }
    };this.addQuickStartButton=function(O,M){
        var L=A.getModule(O);if(L&&!L.quickStartButton){
            var N=L.launcher;L.quickStartButton=this.taskbar.quickStartPanel.add({
                handler:N.handler,
                iconCls:N.iconCls,
                scope:N.scope,
                text:N.text,
                tooltip:N.tooltip||N.text
            });if(M){
                this.config.quickstart.push(O)
            }
        }
    };this.removeQuickStartButton=function(P,N){
        var M=A.getModule(P);if(M&&M.quickStartButton){
            this.taskbar.quickStartPanel.remove(M.quickStartButton);M.quickStartButton=null;if(N){
                var L=this.config.quickstart,O=0;while(O<L.length){
                    if(L[O]==P){
                        L.splice(O,1)
                    }else{
                        O++
                    }
                }
            }
        }
    };this.msg=function(L){
        var M=new Ext.ux.Message(Ext.apply({
            animateTarget:C,
            autoDestroy:true,
            hideDelay:5000,
            html:"",
            iconCls:"icon-waiting",
            title:""
        },L));M.show();return M
    };this.hideMsg=function(M,L){
        if(M){
            (function(){
                M.animHide()
            }).defer(L||3000)
        }
    };G();this.cmenu=new Ext.menu.Menu();J.on("contextmenu",function(M){
        if(M.target.id===J.id){
            M.stopEvent();if(!this.cmenu.el){
                this.cmenu.render()
            }var L=M.getXY();L[1]-=this.cmenu.el.getHeight();this.cmenu.showAt(L)
        }
    },this)
};Ext.ux.MessageMgr={
    positions:[]
};Ext.ux.Message=Ext.extend(Ext.Window,{
    initComponent:function(){
        Ext.apply(this,{
            iconCls:this.iconCls||"icon-comment",
            width:200,
            autoHeight:true,
            closable:true,
            plain:false,
            draggable:false,
            bodyStyle:"text-align:left;padding:10px;",
            resizable:false
        });if(this.autoDestroy){
            this.task=new Ext.util.DelayedTask(this.close,this)
        }else{
            this.closable=true
        }Ext.ux.Message.superclass.initComponent.call(this)
    },
    setMessage:function(A){
        this.body.update(A)
    },
    setTitle:function(B,A){
        Ext.ux.Message.superclass.setTitle.call(this,B,A||this.iconCls)
    },
    onRender:function(B,A){
        Ext.ux.Message.superclass.onRender.call(this,B,A)
    },
    onDestroy:function(){
        Ext.ux.MessageMgr.positions.remove(this.pos);Ext.ux.Message.superclass.onDestroy.call(this)
    },
    afterShow:function(){
        Ext.ux.Message.superclass.afterShow.call(this);this.on("move",function(){
            Ext.ux.MessageMgr.positions.remove(this.pos);if(this.autoDestroy){
                this.task.cancel()
            }
        },this);if(this.autoDestroy){
            this.task.delay(this.hideDelay||5000)
        }
    },
    animShow:function(){
        this.pos=0;while(Ext.ux.MessageMgr.positions.indexOf(this.pos)>-1){
            this.pos++
        }Ext.ux.MessageMgr.positions.push(this.pos);this.setSize(200,100);this.el.alignTo(this.animateTarget||document,"br-tr",[-1,-1-((this.getSize().height+10)*this.pos)]);this.el.slideIn("b",{
            duration:0.7,
            callback:this.afterShow,
            scope:this
        })
    },
    animHide:function(){
        Ext.ux.MessageMgr.positions.remove(this.pos);this.el.ghost("b",{
            duration:1,
            remove:true
        })
    }
});Ext.app.Module=function(A){
    Ext.apply(this,A);Ext.app.Module.superclass.constructor.call(this);this.init()
};Ext.extend(Ext.app.Module,Ext.util.Observable,{
    init:Ext.emptyFn
});Ext.namespace("Ext.ux");Ext.ux.Shortcuts=function(A){
    var J=Ext.get(A.renderTo),D=A.taskbarEl,E=74,I=64,C=15,B=null,K=null,G=[];F();function F(){
        B={
            index:1,
            x:C
        };K={
            index:1,
            y:C
        }
    }function H(L){
        if(L>(Ext.lib.Dom.getViewHeight()-D.getHeight())){
            return true
        }return false
    }this.addShortcut=function(L){
        var N=J.createChild({
            tag:"div",
            cls:"ux-shortcut-item"
        });var M=new Ext.ux.ShortcutButton(Ext.apply(L,{
            text:Ext.util.Format.ellipsis(L.text,16)
        }),N);G.push(M);this.setXY(M.container);return M
    };this.removeShortcut=function(M){
        var P=document.getElementById(M.container.id);M.destroy();P.parentNode.removeChild(P);var O=[];for(var N=0,L=G.length;N<L;N++){
            if(G[N]!=M){
                O.push(G[N])
            }
        }G=O;this.handleUpdate()
    };this.handleUpdate=function(){
        F();for(var M=0,L=G.length;M<L;M++){
            this.setXY(G[M].container)
        }
    };this.setXY=function(M){
        var L=K.y+E;var N=H(K.y+E);if(N&&L>(E+C)){
            B={
                index:B.index++,
                x:B.x+I+C
            };K={
                index:1,
                y:C
            }
        }M.setXY([B.x,K.y]);K.index++;K.y=K.y+E+C
    };Ext.EventManager.onWindowResize(this.handleUpdate,this,{
        delay:500
    })
};Ext.ux.ShortcutButton=function(A,B){
    Ext.ux.ShortcutButton.superclass.constructor.call(this,Ext.apply(A,{
        renderTo:B,
        template:new Ext.Template('<div class="ux-shortcut-btn"><div>','<img src="'+Ext.BLANK_IMAGE_URL+'" />','<div class="ux-shortcut-btn-text">{0}</div>',"</div></div>")
    }))
};Ext.extend(Ext.ux.ShortcutButton,Ext.Button,{
    buttonSelector:"div:first",
    initButtonEl:function(A,B){
        Ext.ux.ShortcutButton.superclass.initButtonEl.apply(this,arguments);A.removeClass("x-btn");if(this.iconCls){
            if(!this.cls){
                A.removeClass(this.text?"x-btn-text-icon":"x-btn-icon")
            }
        }
    },
    autoWidth:function(){},
    setText:function(A){
        this.text=A;if(this.el){
            this.el.child("div.ux-shortcut-btn-text").update(A)
        }
    }
});Ext.namespace("Ext.ux");Ext.ux.StartMenu=function(A){
    Ext.ux.StartMenu.superclass.constructor.call(this,A);var B=this.toolItems;this.toolItems=new Ext.util.MixedCollection();if(B){
        this.addTool.apply(this,B)
    }
};Ext.extend(Ext.ux.StartMenu,Ext.menu.Menu,{
    height:300,
    toolPanelWidth:100,
    width:300,
    render:function(){
        if(this.el){
            return
        }var A=this.el=new Ext.Layer({
            cls:"x-menu ux-start-menu",
            shadow:this.shadow,
            constrain:false,
            parentEl:this.parentEl||document.body,
            zindex:15000
        });var E=A.createChild({
            tag:"div",
            cls:"x-window-header x-unselectable x-panel-icon "+this.iconCls
        });E.setStyle("padding","7px 0 0 0");this.header=E;var F=E.createChild({
            tag:"span",
            cls:"x-window-header-text"
        });var O=E.wrap({
            cls:"ux-start-menu-tl"
        });var K=E.wrap({
            cls:"ux-start-menu-tr"
        });var C=E.wrap({
            cls:"ux-start-menu-tc"
        });this.menuBWrap=A.createChild({
            tag:"div",
            cls:"ux-start-menu-body x-border-layout-ct ux-start-menu-body"
        });var D=this.menuBWrap.wrap({
            cls:"ux-start-menu-ml"
        });var L=this.menuBWrap.wrap({
            cls:"ux-start-menu-mc ux-start-menu-bwrap"
        });this.menuPanel=this.menuBWrap.createChild({
            tag:"div",
            cls:"x-panel x-border-panel ux-start-menu-apps-panel opaque"
        });this.toolsPanel=this.menuBWrap.createChild({
            tag:"div",
            cls:"x-panel x-border-panel ux-start-menu-tools-panel opaque"
        });var J=D.wrap({
            cls:"x-window-bwrap"
        });var I=J.createChild({
            tag:"div",
            cls:"ux-start-menu-bc"
        });var B=I.wrap({
            cls:"ux-start-menu-bl x-panel-nofooter"
        });var N=I.wrap({
            cls:"ux-start-menu-br"
        });I.setStyle({
            height:"0px",
            padding:"0 0 6px 0"
        });this.keyNav=new Ext.menu.MenuNav(this);if(this.plain){
            A.addClass("x-menu-plain")
        }if(this.cls){
            A.addClass(this.cls)
        }this.focusEl=A.createChild({
            tag:"a",
            cls:"x-menu-focus",
            href:"#",
            onclick:"return false;",
            tabIndex:"-1"
        });var H=this.menuPanel.createChild({
            id:"SliverDesktopStartMenu",
            tag:"ul",
            cls:"x-menu-list"
        });var M=this.toolsPanel.createChild({
            id:"SliverDesktopStartToolMenu",
            tag:"ul",
            cls:"x-menu-list"
        });var G={
            click:{
                fn:this.onClick,
                scope:this
            },
            mouseover:{
                fn:this.onMouseOver,
                scope:this
            },
            mouseout:{
                fn:this.onMouseOut,
                scope:this
            }
        };H.on(G);this.items.each(function(Q){
            var P=document.createElement("li");P.className="x-menu-list-item";H.dom.appendChild(P);Q.render(P,this)
        },this);this.ul=H;this.autoWidth();M.on(G);this.toolItems.each(function(Q){
            var P=document.createElement("li");P.className="x-menu-list-item";M.dom.appendChild(P);Q.render(P,this)
        },this);this.toolsUl=M;this.autoWidth();this.menuBWrap.setStyle("position","relative");this.menuBWrap.setHeight(this.height);this.menuPanel.setStyle({
            padding:"2px",
            position:"absolute",
            overflow:"auto"
        });this.toolsPanel.setStyle({
            padding:"2px 4px 2px 2px",
            position:"absolute",
            overflow:"auto"
        });this.setTitle(this.title,"user")
    },
    findTargetItem:function(B){
        var A=B.getTarget(".x-menu-list-item",this.ul,true);if(A&&A.menuItemId){
            if(this.items.get(A.menuItemId)){
                return this.items.get(A.menuItemId)
            }else{
                return this.toolItems.get(A.menuItemId)
            }
        }
    },
    show:function(B,E,A){
        this.parentMenu=A;if(!this.el){
            this.render()
        }this.fireEvent("beforeshow",this);this.showAt(this.el.getAlignToXY(B,E||this.defaultAlign),A,false);var D=this.toolPanelWidth;var C=this.menuBWrap.getBox();this.menuPanel.setWidth(C.width-D);this.menuPanel.setHeight(C.height);this.toolsPanel.setWidth(D);this.toolsPanel.setX(C.x+C.width-D);this.toolsPanel.setHeight(C.height)
    },
    addTool:function(){
        var B=arguments,A=B.length,E;for(var C=0;C<A;C++){
            var D=B[C];if(D.render){
                E=this.addToolItem(D)
            }else{
                if(typeof D=="string"){
                    if(D=="separator"||D=="-"){
                        E=this.addToolSeparator()
                    }else{
                        E=this.addText(D)
                    }
                }else{
                    if(D.tagName||D.el){
                        E=this.addElement(D)
                    }else{
                        if(typeof D=="object"){
                            E=this.addToolMenuItem(D)
                        }
                    }
                }
            }
        }return E
    },
    addToolSeparator:function(){
        return this.addToolItem(new Ext.menu.Separator({
            itemCls:"ux-toolmenu-sep"
        }))
    },
    addToolItem:function(B){
        this.toolItems.add(B);if(this.toolsUl){
            var A=document.createElement("li");A.className="x-menu-list-item";this.toolsUl.dom.appendChild(A);B.render(A,this);this.delayAutoWidth()
        }return B
    },
    addToolMenuItem:function(A){
        if(!(A instanceof Ext.menu.Item)){
            if(typeof A.checked=="boolean"){
                A=new Ext.menu.CheckItem(A)
            }else{
                A=new Ext.menu.Item(A)
            }
        }return this.addToolItem(A)
    },
    setTitle:function(B,A){
        this.title=B;if(this.header.child("span")){
            this.header.child("span").update(B)
        }return this
    },
    getToolButton:function(A){
        var B=new Ext.Button({
            handler:A.handler,
            minWidth:this.toolPanelWidth-10,
            scope:A.scope,
            text:A.text
        });return B
    }
});Ext.namespace("Ext.ux");Ext.ux.TaskBar=function(A){
    this.app=A;this.init()
};Ext.extend(Ext.ux.TaskBar,Ext.util.Observable,{
    init:function(){
        this.startMenu=new Ext.ux.StartMenu(Ext.apply({
            iconCls:"user",
            height:300,
            shadow:true,
            title:"Todd Murdock",
            width:300
        },this.app.startConfig));this.startButton=new Ext.Button({
            text:"菜单",
            id:"ux-startbutton",
            iconCls:"start",
            menu:this.startMenu,
            menuAlign:"bl-tl",
            renderTo:"ux-taskbar-start"
        });var A=Ext.get("ux-startbutton").getWidth()+10;var D=new Ext.BoxComponent({
            el:"ux-taskbar-start",
            id:"TaskBarStart",
            minWidth:A,
            region:"west",
            split:false,
            width:A
        });this.quickStartPanel=new Ext.ux.QuickStartPanel({
            el:"ux-quickstart-panel",
            id:"TaskBarQuickStart",
            minWidth:60,
            region:"west",
            split:true,
            width:94
        });Ext.ux.Clock=function(){
            this.init=function(F){
                Ext.TaskMgr.start({
                    interval:1000,
                    run:function(){
                        var H=new Date();var J=H.getHours();var G=H.getMinutes();var I="";if(J<10){
                            I="上午"
                        }else{
                            if(J>12){
                                J=J-12;I="下午"
                            }
                        }if(G<10){
                            G="0"+G
                        }F.setText(I+" "+J+":"+G)
                    },
                    scope:this
                })
            }
        };var E=new Ext.Button({
            text:"&nbsp;",
            id:"tasktime",
            iconCls:"icon-time",
            menu:new Ext.menu.DateMenu({}),
            plugins:new Ext.ux.Clock()
        });this.cklPanel=new Ext.Panel({
            el:"ux-taskclock-panel",
            id:"TaskBarClock",
            minWidth:100,
            bodyStyle:"padding-top: 4px; background: none",
            border:false,
            split:false,
            region:"east",
            width:100,
            items:[E]
        });this.taskButtonPanel=new Ext.ux.TaskButtonsPanel({
            el:"ux-taskbuttons-panel",
            id:"TaskBarButtons",
            region:"center"
        });var C=new Ext.Container({
            el:"ux-taskbar-panel-wrap",
            items:[this.quickStartPanel,this.taskButtonPanel,this.cklPanel],
            layout:"border",
            region:"center"
        });var B=new Ext.ux.TaskBarContainer({
            el:"ux-taskbar",
            layout:"border",
            items:[D,C]
        });this.el=B.el;return this
    },
    setActiveButton:function(A){
        this.taskButtonPanel.setActiveButton(A)
    }
});Ext.ux.TaskBarContainer=Ext.extend(Ext.Container,{
    initComponent:function(){
        Ext.ux.TaskBarContainer.superclass.initComponent.call(this);this.el=Ext.get(this.el)||Ext.getBody();this.el.setHeight=Ext.emptyFn;this.el.setWidth=Ext.emptyFn;this.el.setSize=Ext.emptyFn;this.el.setStyle({
            overflow:"hidden",
            margin:"0",
            border:"0 none"
        });this.el.dom.scroll="no";this.allowDomMove=false;this.autoWidth=true;this.autoHeight=true;Ext.EventManager.onWindowResize(this.fireResize,this);this.renderTo=this.el
    },
    fireResize:function(A,B){
        this.fireEvent("resize",this,A,B,A,B)
    }
});Ext.ux.TaskButtonsPanel=Ext.extend(Ext.BoxComponent,{
    activeButton:null,
    enableScroll:true,
    scrollIncrement:0,
    scrollRepeatInterval:400,
    scrollDuration:0.35,
    animScroll:true,
    resizeButtons:true,
    buttonWidth:168,
    minButtonWidth:118,
    buttonMargin:2,
    buttonWidthSet:false,
    initComponent:function(){
        Ext.ux.TaskButtonsPanel.superclass.initComponent.call(this);this.on("resize",this.delegateUpdates);this.items=[];this.stripWrap=Ext.get(this.el).createChild({
            cls:"ux-taskbuttons-strip-wrap",
            cn:{
                tag:"ul",
                cls:"ux-taskbuttons-strip"
            }
        });this.stripSpacer=Ext.get(this.el).createChild({
            cls:"ux-taskbuttons-strip-spacer"
        });this.strip=new Ext.Element(this.stripWrap.dom.firstChild);this.edge=this.strip.createChild({
            tag:"li",
            cls:"ux-taskbuttons-edge"
        });this.strip.createChild({
            cls:"x-clear"
        })
    },
    add:function(C){
        var A=this.strip.createChild({
            tag:"li"
        },this.edge);var B=new Ext.ux.TaskBar.TaskButton(C,A);this.items.push(B);if(!this.buttonWidthSet){
            this.lastButtonWidth=B.container.getWidth()
        }this.setActiveButton(B);return B
    },
    remove:function(D){
        var B=document.getElementById(D.container.id);D.destroy();B.parentNode.removeChild(B);var E=[];for(var C=0,A=this.items.length;C<A;C++){
            if(this.items[C]!=D){
                E.push(this.items[C])
            }
        }this.items=E;this.delegateUpdates()
    },
    setActiveButton:function(A){
        this.activeButton=A;this.delegateUpdates()
    },
    delegateUpdates:function(){
        if(this.resizeButtons&&this.rendered){
            this.autoSize()
        }if(this.enableScroll&&this.rendered){
            this.autoScroll()
        }
    },
    autoSize:function(){
        var H=this.items.length;var C=this.el.dom.offsetWidth;var A=this.el.dom.clientWidth;if(!this.resizeButtons||H<1||!A){
            return
        }var J=Math.max(Math.min(Math.floor((A-4)/H)-this.buttonMargin,this.buttonWidth),this.minButtonWidth);var E=this.stripWrap.dom.getElementsByTagName("button");this.lastButtonWidth=Ext.get(E[0].id).findParent("li").offsetWidth;for(var F=0,I=E.length;F<I;F++){
            var B=E[F];var G=Ext.get(E[F].id).findParent("li").offsetWidth;var D=B.offsetWidth;B.style.width=(J-(G-D))+"px"
        }
    },
    autoScroll:function(){
        var F=this.items.length;var D=this.el.dom.offsetWidth;var C=this.el.dom.clientWidth;var E=this.stripWrap;var B=E.dom.offsetWidth;var G=this.getScrollPos();var A=this.edge.getOffsetsTo(this.stripWrap)[0]+G;if(!this.enableScroll||F<1||B<20){
            return
        }E.setWidth(C);if(A<=C){
            E.dom.scrollLeft=0;if(this.scrolling){
                this.scrolling=false;this.el.removeClass("x-taskbuttons-scrolling");this.scrollLeft.hide();this.scrollRight.hide()
            }
        }else{
            if(!this.scrolling){
                this.el.addClass("x-taskbuttons-scrolling")
            }C-=E.getMargins("lr");E.setWidth(C>20?C:20);if(!this.scrolling){
                if(!this.scrollLeft){
                    this.createScrollers()
                }else{
                    this.scrollLeft.show();this.scrollRight.show()
                }
            }this.scrolling=true;if(G>(A-C)){
                E.dom.scrollLeft=A-C
            }else{
                this.scrollToButton(this.activeButton,true)
            }this.updateScrollButtons()
        }
    },
    createScrollers:function(){
        var C=this.el.dom.offsetHeight;var A=this.el.insertFirst({
            cls:"ux-taskbuttons-scroller-left"
        });A.setHeight(C);A.addClassOnOver("ux-taskbuttons-scroller-left-over");this.leftRepeater=new Ext.util.ClickRepeater(A,{
            interval:this.scrollRepeatInterval,
            handler:this.onScrollLeft,
            scope:this
        });this.scrollLeft=A;var B=this.el.insertFirst({
            cls:"ux-taskbuttons-scroller-right"
        });B.setHeight(C);B.addClassOnOver("ux-taskbuttons-scroller-right-over");this.rightRepeater=new Ext.util.ClickRepeater(B,{
            interval:this.scrollRepeatInterval,
            handler:this.onScrollRight,
            scope:this
        });this.scrollRight=B
    },
    getScrollWidth:function(){
        return this.edge.getOffsetsTo(this.stripWrap)[0]+this.getScrollPos()
    },
    getScrollPos:function(){
        return parseInt(this.stripWrap.dom.scrollLeft,10)||0
    },
    getScrollArea:function(){
        return parseInt(this.stripWrap.dom.clientWidth,10)||0
    },
    getScrollAnim:function(){
        return{
            duration:this.scrollDuration,
            callback:this.updateScrollButtons,
            scope:this
        }
    },
    getScrollIncrement:function(){
        return(this.scrollIncrement||this.lastButtonWidth+2)
    },
    scrollToButton:function(E,A){
        E=E.el.dom.parentNode;if(!E){
            return
        }var C=E;var G=this.getScrollPos(),D=this.getScrollArea();var F=Ext.fly(C).getOffsetsTo(this.stripWrap)[0]+G;var B=F+C.offsetWidth;if(F<G){
            this.scrollTo(F,A)
        }else{
            if(B>(G+D)){
                this.scrollTo(B-D,A)
            }
        }
    },
    scrollTo:function(B,A){
        this.stripWrap.scrollTo("left",B,A?this.getScrollAnim():false);if(!A){
            this.updateScrollButtons()
        }
    },
    onScrollRight:function(){
        var A=this.getScrollWidth()-this.getScrollArea();var C=this.getScrollPos();var B=Math.min(A,C+this.getScrollIncrement());if(B!=C){
            this.scrollTo(B,this.animScroll)
        }
    },
    onScrollLeft:function(){
        var B=this.getScrollPos();var A=Math.max(0,B-this.getScrollIncrement());if(A!=B){
            this.scrollTo(A,this.animScroll)
        }
    },
    updateScrollButtons:function(){
        var A=this.getScrollPos();this.scrollLeft[A==0?"addClass":"removeClass"]("ux-taskbuttons-scroller-left-disabled");this.scrollRight[A>=(this.getScrollWidth()-this.getScrollArea())?"addClass":"removeClass"]("ux-taskbuttons-scroller-right-disabled")
    }
});Ext.ux.TaskBar.TaskButton=function(B,A){
    this.win=B;Ext.ux.TaskBar.TaskButton.superclass.constructor.call(this,{
        iconCls:B.iconCls,
        text:Ext.util.Format.ellipsis(B.title,12),
        tooltip:B.taskbuttonTooltip||B.title,
        renderTo:A,
        handler:function(){
            if(B.minimized||B.hidden){
                B.show()
            }else{
                if(B==B.manager.getActive()){
                    B.minimize()
                }else{
                    B.toFront()
                }
            }
        },
        clickEvent:"mousedown"
    })
};Ext.extend(Ext.ux.TaskBar.TaskButton,Ext.Button,{
    onRender:function(){
        Ext.ux.TaskBar.TaskButton.superclass.onRender.apply(this,arguments);this.cmenu=new Ext.menu.Menu({
            items:[{
                id:"restore",
                text:"恢复",
                handler:function(){
                    if(!this.win.isVisible()){
                        this.win.show()
                    }else{
                        this.win.restore()
                    }
                },
                scope:this
            },{
                id:"minimize",
                text:"最小化",
                handler:this.win.minimize,
                scope:this.win
            },{
                id:"maximize",
                text:"最大化",
                handler:this.win.maximize,
                scope:this.win
            },"-",{
                id:"close",
                text:"关闭",
                handler:this.closeWin.createDelegate(this,this.win,true),
                scope:this.win
            }]
        });this.cmenu.on("beforeshow",function(){
            var B=this.cmenu.items.items;var A=this.win;B[0].setDisabled(A.maximized!==true&&A.hidden!==true);B[1].setDisabled(A.minimized===true);B[2].setDisabled(A.maximized===true||A.hidden===true);B[2].setDisabled(A.maximizable===false);B[3].setDisabled(A.closable===false)
        },this);this.el.on("contextmenu",function(B){
            B.stopEvent();if(!this.cmenu.el){
                this.cmenu.render()
            }var A=B.getXY();A[1]-=this.cmenu.el.getHeight();this.cmenu.showAt(A)
        },this)
    },
    closeWin:function(A,C,B){
        if(!B.isVisible()){
            B.show()
        }else{
            B.restore()
        }B.close()
    },
    setText:function(A){
        if(A){
            this.text=A;if(this.el){
                this.el.child("td.x-btn-center "+this.buttonSelector).update(Ext.util.Format.ellipsis(A,12))
            }
        }
    },
    setTooltip:function(B){
        if(B){
            this.tooltip=B;var A=this.el.child(this.buttonSelector);Ext.QuickTips.unregister(A.id);if(typeof this.tooltip=="object"){
                Ext.QuickTips.register(Ext.apply({
                    target:A.id
                },this.tooltip))
            }else{
                A.dom[this.tooltipType]=this.tooltip
            }
        }
    }
});Ext.ux.QuickStartPanel=Ext.extend(Ext.BoxComponent,{
    enableMenu:true,
    initComponent:function(){
        Ext.ux.QuickStartPanel.superclass.initComponent.call(this);this.on("resize",this.delegateUpdates);this.menu=new Ext.menu.Menu();this.items=[];this.stripWrap=Ext.get(this.el).createChild({
            cls:"ux-quickstart-strip-wrap",
            cn:{
                tag:"ul",
                cls:"ux-quickstart-strip"
            }
        });this.stripSpacer=Ext.get(this.el).createChild({
            cls:"ux-quickstart-strip-spacer"
        });this.strip=new Ext.Element(this.stripWrap.dom.firstChild);this.edge=this.strip.createChild({
            tag:"li",
            cls:"ux-quickstart-edge"
        });this.strip.createChild({
            cls:"x-clear"
        })
    },
    add:function(B){
        var A=this.strip.createChild({
            tag:"li"
        },this.edge);var C=new Ext.Button(Ext.apply(B,{
            cls:"x-btn-icon",
            menuText:B.text,
            renderTo:A,
            text:""
        }));this.items.push(C);this.delegateUpdates();return C
    },
    remove:function(D){
        var B=document.getElementById(D.container.id);D.destroy();B.parentNode.removeChild(B);var E=[];for(var C=0,A=this.items.length;C<A;C++){
            if(this.items[C]!=D){
                E.push(this.items[C])
            }
        }this.items=E;this.delegateUpdates()
    },
    menuAdd:function(A){
        this.menu.add(A)
    },
    delegateUpdates:function(){
        if(this.enableMenu&&this.rendered){
            this.showButtons();this.clearMenu();this.autoMenu()
        }
    },
    showButtons:function(){
        var B=this.items.length;for(var A=0;A<B;A++){
            this.items[A].show()
        }
    },
    clearMenu:function(){
        this.menu.removeAll()
    },
    autoMenu:function(){
        var J=this.items.length;var E=this.el.dom.offsetWidth;var I=this.el.dom.clientWidth;var B=this.stripWrap;var G=B.dom.offsetWidth;var F=this.edge.getOffsetsTo(this.stripWrap)[0];if(!this.enableMenu||J<1||G<20){
            return
        }B.setWidth(I);if(F<=I){
            if(this.showingMenu){
                this.showingMenu=false;this.menuButton.hide()
            }
        }else{
            I-=B.getMargins("lr");B.setWidth(I>20?I:20);if(!this.showingMenu){
                if(!this.menuButton){
                    this.createMenuButton()
                }else{
                    this.menuButton.show()
                }
            }mo=this.getMenuButtonPos();for(var H=J-1;H>=0;H--){
                var A=this.items[H].el.dom.offsetLeft+this.items[H].el.dom.offsetWidth;if(A>mo){
                    this.items[H].hide();var C=this.items[H].initialConfig,D={
                        iconCls:C.iconCls,
                        handler:C.handler,
                        scope:C.scope,
                        text:C.menuText
                    };this.menuAdd(D)
                }else{
                    this.items[H].show()
                }
            }this.showingMenu=true
        }
    },
    createMenuButton:function(){
        var B=this.el.dom.offsetHeight;var C=this.el.insertFirst({
            cls:"ux-quickstart-menubutton-wrap"
        });C.setHeight(B);var A=new Ext.Button({
            cls:"x-btn-icon",
            id:"ux-quickstart-menubutton",
            menu:this.menu,
            renderTo:C
        });C.setWidth(Ext.get("ux-quickstart-menubutton").getWidth());this.menuButton=C
    },
    getMenuButtonPos:function(){
        return this.menuButton.dom.offsetLeft
    }
});var createAboutAuthorWindow=function(){
    var B=Ext.getCmp("about-author-win");if(!B){
        var A=new Ext.Panel({
            baseCls:"x-plain",
            bodyStyle:"background:url(../images/sliver.png) no-repeat center center;",
            height:120,
            region:"center"
        });southPanel=new Ext.Panel({
            baseCls:"x-plain",
            height:100,
            bodyStyle:"font-weight:bold;color:appworkspace;padding-left:150px;padding-top:5px;",
            html:'QQ ： 6041738<br/>MSN ： vflying@gmail.com<br/>网站 ： <a href="http://www.slivercrm.cn" target="_blank">www.slivercrm.cn</a><br/>邮件 ： <a href="mailto:vflying@gmail.com" target="_blank">vflying@gmail.com</a><br/>',
            region:"south"
        });B=new Ext.Window({
            title:"联系我们",
            minHeight:300,
            minWidth:530,
            width:530,
            height:300,
            closable:true,
            draggable:true,
            iconCls:"icon-contact",
            id:"about-author-win",
            layout:"border",
            plain:false,
            resizable:false,
            items:[A,southPanel],
            buttonAlign:"right",
            buttons:[{
                text:"关闭",
                handler:function(){
                    B.close()
                }
            }]
        });B.show()
    }
};Ext.grid.Timer=function(A){
    Ext.apply(this,A)
};Ext.grid.Timer.prototype={
    header:"",
    width:60,
    sortable:false,
    fixed:true,
    menuDisabled:true,
    dataIndex:"time",
    id:"time",
    css:"background-color:#EFF0F2;text-align:right;height:30px;",
    renderer:function(B,C,A,D){
        if(A.data.sn===new Date().getHours()){
            return'<div style="font-weight:bold;color:#FF0000;">'+B+"</div>"
        }else{
            return B
        }
    }
};Ext.ux.SliderTip=Ext.extend(Ext.Tip,{
    minWidth:10,
    offsets:[0,-10],
    init:function(A){
        A.on("dragstart",this.onSlide,this);A.on("drag",this.onSlide,this);A.on("dragend",this.hide,this);A.on("destroy",this.destroy,this)
    },
    onSlide:function(A){
        this.show();this.body.update(this.getText(A));this.doAutoWidth();this.el.alignTo(A.thumb,"b-t?",this.offsets)
    },
    getText:function(A){
        return A.getValue()
    }
});Ext.namespace("Ext.ux.Andrie");Ext.ux.Andrie.pPageSize=function(A){
    Ext.apply(this,A)
};Ext.extend(Ext.ux.Andrie.pPageSize,Ext.util.Observable,{
    beforeText:"行/页:",
    afterText:"",
    addBefore:"-",
    addAfter:null,
    dynamic:false,
    variations:[5,10,20,30,50,100,200,500],
    comboCfg:undefined,
    init:function(A){
        this.pagingToolbar=A;this.pagingToolbar.pageSizeCombo=this;this.pagingToolbar.setPageSize=this.setPageSize.createDelegate(this);this.pagingToolbar.getPageSize=this.getPageSize.createDelegate(this);this.pagingToolbar.on("render",this.onRender,this)
    },
    addSize:function(A){
        if(A>0){
            this.sizes.push([A])
        }
    },
    updateStore:function(){
        if(this.dynamic){
            var B=this.pagingToolbar.pageSize,E;B=(B>0)?B:1;this.sizes=[];var C=this.variations;for(var D=0,A=C.length;D<A;D++){
                this.addSize(B-C[C.length-1-D])
            }this.addToStore(B);for(var D=0,A=C.length;D<A;D++){
                this.addSize(B+C[D])
            }
        }else{
            if(!this.staticSizes){
                this.sizes=[];var C=this.variations;var B=0;for(var D=0,A=C.length;D<A;D++){
                    this.addSize(B+C[D])
                }this.staticSizes=this.sizes.slice(0)
            }else{
                this.sizes=this.staticSizes.slice(0)
            }
        }this.combo.store.loadData(this.sizes);this.combo.collapse();this.combo.setValue(this.pagingToolbar.pageSize)
    },
    getPageSize:function(){
        return this.pagingToolbar.pageSize
    },
    setPageSize:function(E,H){
        var I=this.pagingToolbar;this.combo.collapse();E=parseInt(E)||parseInt(this.combo.getValue());E=(E>0)?E:1;if(E==I.pageSize){
            return
        }else{
            if(E<I.pageSize){
                I.pageSize=E;var A=Math.round(I.cursor/E)+1;var G=(A-1)*E;var F=I.store;if(G>F.getTotalCount()){
                    this.pagingToolbar.pageSize=E;this.pagingToolbar.doLoad(G-E)
                }else{
                    F.suspendEvents();for(var B=0,C=G-I.cursor;B<C;B++){
                        F.remove(F.getAt(0))
                    }while(F.getCount()>E){
                        F.remove(F.getAt(F.getCount()-1))
                    }F.resumeEvents();F.fireEvent("datachanged",F);I.cursor=G;var D=I.getPageData();I.afterTextEl.el.innerHTML=String.format(I.afterPageText,D.pages);I.field.dom.value=A;I.first.setDisabled(A==1);I.prev.setDisabled(A==1);I.next.setDisabled(A==D.pages);I.last.setDisabled(A==D.pages);I.updateInfo()
                }
            }else{
                this.pagingToolbar.pageSize=E;this.pagingToolbar.doLoad(Math.floor(this.pagingToolbar.cursor/this.pagingToolbar.pageSize)*this.pagingToolbar.pageSize)
            }
        }this.updateStore()
    },
    onRender:function(){
        this.combo=Ext.ComponentMgr.create(Ext.applyIf(this.comboCfg||{},{
            store:new Ext.data.SimpleStore({
                fields:["pageSize"],
                data:[]
            }),
            displayField:"pageSize",
            valueField:"pageSize",
            mode:"local",
            triggerAction:"all",
            width:50,
            xtype:"combo"
        }));this.combo.on("select",this.setPageSize,this);this.updateStore();if(this.addBefore){
            this.pagingToolbar.add(this.addBefore)
        }if(this.beforeText){
            this.pagingToolbar.add(this.beforeText)
        }this.pagingToolbar.add(this.combo);if(this.afterText){
            this.pagingToolbar.add(this.afterText)
        }if(this.addAfter){
            this.pagingToolbar.add(this.addAfter)
        }
    }
});Ext.grid.RowExpander=function(A){
    Ext.apply(this,A);this.addEvents({
        beforeexpand:true,
        expand:true,
        beforecollapse:true,
        collapse:true
    });Ext.grid.RowExpander.superclass.constructor.call(this);if(this.tpl){
        if(typeof this.tpl=="string"){
            this.tpl=new Ext.Template(this.tpl)
        }this.tpl.compile()
    }this.state={};this.bodyContent={}
};Ext.extend(Ext.grid.RowExpander,Ext.util.Observable,{
    header:"",
    width:20,
    sortable:false,
    fixed:true,
    menuDisabled:true,
    dataIndex:"",
    id:"expander",
    lazyRender:true,
    enableCaching:true,
    getRowClass:function(A,E,D,C){
        D.cols=D.cols-1;var B=this.bodyContent[A.id];if(!B&&!this.lazyRender){
            B=this.getBodyContent(A,E)
        }if(B){
            D.body=B
        }return this.state[A.id]?"x-grid3-row-expanded":"x-grid3-row-collapsed"
    },
    init:function(B){
        this.grid=B;var A=B.getView();A.getRowClass=this.getRowClass.createDelegate(this);A.enableRowBody=true;B.on("render",function(){
            A.mainBody.on("mousedown",this.onMouseDown,this)
        },this)
    },
    getBodyContent:function(A,B){
        if(!this.enableCaching){
            return this.tpl.apply(A.data)
        }var C=this.bodyContent[A.id];if(!C){
            C=this.tpl.apply(A.data);this.bodyContent[A.id]=C
        }return C
    },
    onMouseDown:function(B,A){
        if(A.className=="x-grid3-row-expander"){
            B.stopEvent();var C=B.getTarget(".x-grid3-row");this.toggleRow(C)
        }
    },
    renderer:function(B,C,A){
        C.cellAttr='rowspan="2"';return'<div class="x-grid3-row-expander">&#160;</div>'
    },
    beforeExpand:function(B,A,C){
        if(this.fireEvent("beforeexpand",this,B,A,C)!==false){
            if(this.tpl&&this.lazyRender){
                A.innerHTML=this.getBodyContent(B,C)
            }return true
        }else{
            return false
        }
    },
    toggleRow:function(A){
        if(typeof A=="number"){
            A=this.grid.view.getRow(A)
        }this[Ext.fly(A).hasClass("x-grid3-row-collapsed")?"expandRow":"collapseRow"](A)
    },
    expandRow:function(C){
        if(typeof C=="number"){
            C=this.grid.view.getRow(C)
        }var B=this.grid.store.getAt(C.rowIndex);var A=Ext.DomQuery.selectNode("tr:nth(2) div.x-grid3-row-body",C);if(this.beforeExpand(B,A,C.rowIndex)){
            this.state[B.id]=true;Ext.fly(C).replaceClass("x-grid3-row-collapsed","x-grid3-row-expanded");this.fireEvent("expand",this,B,A,C.rowIndex)
        }
    },
    collapseRow:function(C){
        if(typeof C=="number"){
            C=this.grid.view.getRow(C)
        }var B=this.grid.store.getAt(C.rowIndex);var A=Ext.fly(C).child("tr:nth(1) div.x-grid3-row-body",true);if(this.fireEvent("beforcollapse",this,B,A,C.rowIndex)!==false){
            this.state[B.id]=false;Ext.fly(C).replaceClass("x-grid3-row-expanded","x-grid3-row-collapsed");this.fireEvent("collapse",this,B,A,C.rowIndex)
        }
    }
});Ext.override(Ext.Window,{
    show:function(C,A,B){
        if(!this.rendered){
            this.render(Ext.getBody())
        }if(this.hidden===false){
            this.toFront();return
        }if(this.fireEvent("beforeshow",this)===false){
            return
        }if(A){
            this.on("show",A,B,{
                single:true
            })
        }this.hidden=false;if(C!==undefined){
            this.setAnimateTarget(C)
        }this.beforeShow();if(this.animateTarget){
            this.animShow()
        }else{
            this.afterShow()
        }this.toFront()
    }
});Ext.override(Ext.tree.AsyncTreeNode,{
    expandChildNodes:function(B){
        var D=this.childNodes;for(var C=0,A=D.length;C<A;C++){
            if(!D[C].isLeaf()){
                D[C].expand(B)
            }
        }
    },
    expand:function(B,D,F){
        if(this.loading){
            var E;var C=function(){
                if(!this.loading){
                    clearInterval(E);this.expand(B,D,F)
                }
            }.createDelegate(this);E=setInterval(C,200);return
        }if(!this.loaded){
            if(this.fireEvent("beforeload",this)===false){
                return
            }this.loading=true;this.ui.beforeLoad(this);var A=this.loader||this.attributes.loader||this.getOwnerTree().getLoader();if(A){
                A.load(this,this.loadComplete.createDelegate(this,[B,D,F]));return
            }
        }if(!this.expanded){
            if(this.fireEvent("beforeexpand",this,B,D)===false){
                return
            }if(!this.childrenRendered){
                this.renderChildren()
            }this.expanded=true;if(!this.isHiddenRoot()&&(this.getOwnerTree().animate&&D!==false)||D){
                this.ui.animExpand(function(){
                    this.fireEvent("expand",this);if(typeof F=="function"){
                        F(this)
                    }if(B===true){
                        this.expandChildNodes(true)
                    }
                }.createDelegate(this));return
            }else{
                this.ui.expand();this.fireEvent("expand",this);if(typeof F=="function"){
                    F(this)
                }
            }
        }else{
            if(typeof F=="function"){
                F(this)
            }
        }if(B===true){
            this.expandChildNodes(true)
        }
    }
});
Ext.tree.SliverTreeLoader=function(A){
    Ext.tree.SliverTreeLoader.superclass.constructor.apply(this,arguments)
};

Ext.extend(Ext.tree.SliverTreeLoader,Ext.tree.TreeLoader,{
    createNode:function(attr){
        if(this.applyLoader!==false){
            attr.loader=this
        }if(typeof attr.uiProvider=="string"){
            attr.uiProvider=this.uiProviders[attr.uiProvider]||eval(attr.uiProvider)
        }
        return(new Ext.tree.AsyncTreeNode(attr))
    },
    getParams:function(D){
        var A=[],C=this.baseParams;for(var B in C){
            if(typeof C[B]!="function"){
                A.push(encodeURIComponent(B),"=",encodeURIComponent(C[B]),"&")
            }
        }A.push(encodeURIComponent("node"),"=",encodeURIComponent(D.id.substring(D.id.lastIndexOf("-")+1)),"&");return A.join("")
    }
});Ext.tree.contactNode=function(A){
    Ext.tree.contactNode.superclass.constructor.apply(this,arguments);this.customer=A.customer
};Ext.extend(Ext.tree.contactNode,Ext.tree.AsyncTreeNode,{
    isCustomer:function(){
        if(this.isLeaf()===true){
            return false
        }return this.customer
    }
});Ext.tree.ContactTreeLoader=function(A){
    Ext.tree.ContactTreeLoader.superclass.constructor.apply(this,arguments)
};Ext.extend(Ext.tree.ContactTreeLoader,Ext.tree.SliverTreeLoader,{
    createNode:function(attr){
        if(this.applyLoader!==false){
            attr.loader=this
        }if(typeof attr.uiProvider=="string"){
            attr.uiProvider=this.uiProviders[attr.uiProvider]||eval(attr.uiProvider)
        }return(new Ext.tree.contactNode(attr))
    }
});Ext.ux.TabCloseMenu=function(){
    var A,C,B;this.init=function(E){
        A=E;A.on("contextmenu",D)
    };function D(G,F,H){
        if(!C){
            C=new Ext.menu.Menu([{
                id:A.id+"-close",
                text:"关闭标签",
                handler:function(){
                    A.remove(B)
                }
            },{
                id:A.id+"-close-others",
                text:"关闭其他标签",
                handler:function(){
                    A.items.each(function(J){
                        if(J.closable&&J!=B){
                            A.remove(J)
                        }
                    })
                }
            }])
        }B=F;var E=C.items;E.get(A.id+"-close").setDisabled(!F.closable);var I=true;A.items.each(function(){
            if(this!=F&&this.closable){
                I=false;return false
            }
        });E.get(A.id+"-close-others").setDisabled(I);C.showAt(H.getPoint())
    }
};Ext.override(Ext.TabPanel,{
    onStripDblClick:function(B){
        var A=this.findTargets(B);if((A.item)&&(A.item.closable===true)){
            this.remove(A.item);return
        }
    },
    initEvents:function(){
        Ext.TabPanel.superclass.initEvents.call(this);this.on("add",this.onAdd,this);this.on("remove",this.onRemove,this);this.strip.on("dblclick",this.onStripDblClick,this);this.strip.on("mousedown",this.onStripMouseDown,this);this.strip.on("click",this.onStripClick,this);this.strip.on("contextmenu",this.onStripContextMenu,this);if(this.enableTabScroll){
            this.strip.on("mousewheel",this.onWheel,this)
        }
    }
});var ImageUtil={
    setOpacity:function(B,A){
        B.filters.alpha.opacity=parseInt(A)
    },
    scaleWidth:function(A,B){
        var C=new Image();C.src=A.src;if(C.width>0&&C.height>0){
            if(C.width>=B){
                A.width=B;A.height=(C.height*B)/C.width
            }else{
                A.width=C.width;A.height=C.height
            }
        }
    },
    scaleHeight:function(A,B){
        var C=new Image();C.src=A.src;if(C.width>0&&C.height>0){
            if(C.height>=B){
                A.height=B;A.width=(C.width*B)/C.height
            }else{
                A.width=C.width;A.height=C.height
            }
        }
    },
    scale:function(B,F,D){
        var G=new Image();G.src=B.src;if(G.width>0&&G.height>0){
            if(G.height>D||G.width>F){
                var C=0,A,E=false;if(G.height>D){
                    E=true
                }if(E){
                    A=F;C=(G.height*F)/G.width
                }if(C==0||C>D){
                    C=D;A=(G.width*D)/G.height
                }B.width=A;B.height=C
            }else{
                B.width=G.width;B.height=G.height
            }
        }
    },
    zoomImg:function(A){
        var B=parseInt(A.style.zoom,10)||100;B+=event.wheelDelta/12;if(B>0){
            A.style.zoom=B+"%"
        }return false
    }
};var SliverUtil={
    getJson:function(data){
        return eval("("+data.substring(data.indexOf("/*")+2,data.lastIndexOf("*/"))+")")
    },
    htmlDecode:function(A){
        var B=String(A).replace(/&amp;/g,"&").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,'"');B=B.replace(/\n/g,"<br/>");return !A?A:B
    },
    markInvalid:function(A,C){
        for(var B=0;B<A.getCount();B++){
            if(C.fieldErrors[A.itemAt(B).name]){
                A.itemAt(B).markInvalid(C.fieldErrors[A.itemAt(B).name])
            }else{
                if(C.fieldErrors[A.itemAt(B).id]){
                    A.itemAt(B).markInvalid(C.fieldErrors[A.itemAt(B).id])
                }
            }if(A.itemAt(B).items){
                this.markInvalid(A.itemAt(B).items,C)
            }
        }
    },
    renderDate:function(B,A){
        if(Ext.util.Format){
            return Ext.util.Format.date(B,A)
        }
    },
    renderFile:function(A){
        if(A===true){
            return'<img src="images/icons/file.gif" align="center" valign="absmiddle"/>'
        }else{
            return""
        }
    },
    renderGender:function(A){
        if((true===A)||("true"===A)){
            return"男"
        }else{
            if((false===A)||("false"===A)){
                return"女"
            }
        }
    },
    renderOrderState:function(A){
        for(var C=0;C<SliverData.offerState.length;C++){
            for(var B=0;B<SliverData.offerState[C].length;B++){
                if(A===SliverData.offerState[C][1]){
                    return SliverData.offerState[C][0]
                }
            }
        }
    },
    gridCnMoney:function(A){
        A=(Math.round((A-0)*100))/100;A=(A==Math.floor(A))?A+".00":((A*10==Math.floor(A*10))?A+"0":A);A=String(A);var E=A.split(".");var D=E[0];var B=E[1]?"."+E[1]:".00";var C=/(\d+)(\d{3})/;while(C.test(D)){
            D=D.replace(C,"$1,$2")
        }A=D+B;if(A.charAt(0)=="-"){
            return'-<img src="../images/icons/money_yen.png" align="absbottom"/>'+A.substr(1)
        }return'<img src="../images/icons/money_yen.png" align="absbottom"/>'+A
    },
    cnMoney:function(A){
        A=(Math.round((A-0)*100))/100;A=(A==Math.floor(A))?A+".00":((A*10==Math.floor(A*10))?A+"0":A);A=String(A);var E=A.split(".");var D=E[0];var B=E[1]?"."+E[1]:".00";var C=/(\d+)(\d{3})/;while(C.test(D)){
            D=D.replace(C,"$1,$2")
        }A=D+B;if(A.charAt(0)=="-"){
            return"-￥"+A.substr(1)
        }return"￥"+A
    },
    weekOfDate:function(B,C){
        if(typeof C==="number"){
            var A=new Date(B);A.setDate(A.getDate()+C-A.getDay());return A
        }else{
            return null
        }
    }
};Ext.namespace("SliverData");SliverData.recordStatus=[["客户关怀"],["客户回访"],["客户投诉"],["其他事宜"]];SliverData.province=[["上海"],["云南"],["内蒙古"],["北京"],["台湾"],["吉林"],["四川"],["天津"],["宁夏"],["安徽"],["山东"],["山西"],["广东"],["广西"],["新疆"],["江苏"],["江西"],["河北"],["河南"],["浙江"],["海南"],["湖北"],["湖南"],["澳门"],["甘肃"],["福建"],["西藏"],["贵州"],["辽宁"],["重庆"],["陕西"],["青海"],["香港"],["黑龙江"]];SliverData.communicate=[["面谈"],["电话"],["传真"],["电子邮件"],["互联网"],["其他"]];SliverData.customerFrom=[["介绍"],["展会"],["电话"],["平面媒体"],["互联网"],["其他"]];SliverData.customerType=[["直销客户"],["代理商"],["分销商"]];SliverData.status=[["高"],["较高"],["普通"],["较低"],["低"]];SliverData.relationship=[["好"],["较好"],["一般"],["较差"],["差"]];SliverData.offerState=[["待审","0"],["批准","1"],["驳回","-1"],["锁定","2"]];SliverData.complainState=[["未解决"],["处理中"],["已解决"]];SliverData.result=[["非常满意"],["满意"],["一般"],["不满意"],["非常不满意"]];SliverData.serveType=[["回访"],["维修"],["返修"],["其它"]];SliverData.cashedType=[["现金"],["支票"],["转账"],["电汇"],["其它"]];SliverData.businessChance=[["初期沟通","0"],["立项评估","1"],["需求分析","2"],["方案制定","3"],["投标竞争","4"],["商务谈判","5"],["合同签约","6"]];SliverData.chanceSource=[["媒体宣传"],["网络"],["邮件"],["介绍"],["电子邮件"],["电话"],["传真"],["其他"]];SliverData.chanceState=[["跟踪"],["成功"],["放弃"],["搁置"],["失效"]];Ext.namespace("SliverData.storage");SliverData.storage.title="产品库存";SliverData.storage.tooltip="<b>产品库存</b><br />产品库存、收发记录";SliverData.storage.productionDescription="产品说明";SliverData.storage.productionParameter="技术说明";Ext.namespace("SliverData.chance");SliverData.chance.title="我的机会";SliverData.chance.tooltip="<b>我的销售机会</b><br />我的销售机会记录、追踪";SliverData.chance.requirement="客户需求: ";Ext.namespace("SliverData.chanceManager");SliverData.chanceManager.title="销售机会";SliverData.chanceManager.tooltip="<b>所有销售机会管理</b><br />所有销售机会记录、追踪的管理";Ext.namespace("SliverData.calendar");SliverData.calendar.hour=[[0,"凌晨0点"],[1,"凌晨1点"],[2,"凌晨2点"],[3,"凌晨3点"],[4,"早上4点"],[5,"早上5点"],[6,"早上6点"],[7,"早上7点"],[8,"早上8点"],[9,"上午9点"],[10,"上午10点"],[11,"上午11点"],[12,"中午12点"],[13,"下午1点"],[14,"下午2点"],[15,"下午3点"],[16,"下午4点"],[17,"下午5点"],[18,"下午6点"],[19,"晚上7点"],[20,"晚上8点"],[21,"晚上9点"],[22,"晚上10点"],[23,"晚上11点"]];var SWFUpload=function(A){
    this.initSWFUpload(A)
};SWFUpload.prototype.initSWFUpload=function(B){
    try{
        this.customSettings={};this.settings=B;this.eventQueue=[];this.movieName="SWFUpload_"+SWFUpload.movieCount++;this.movieElement=null;SWFUpload.instances[this.movieName]=this;this.initSettings();this.loadFlash();this.displayDebugInfo()
    }catch(A){
        delete SWFUpload.instances[this.movieName];throw A
    }
};SWFUpload.instances={};SWFUpload.movieCount=0;SWFUpload.version="2.2.0 Alpha";SWFUpload.QUEUE_ERROR={
    QUEUE_LIMIT_EXCEEDED:-100,
    FILE_EXCEEDS_SIZE_LIMIT:-110,
    ZERO_BYTE_FILE:-120,
    INVALID_FILETYPE:-130
};SWFUpload.UPLOAD_ERROR={
    HTTP_ERROR:-200,
    MISSING_UPLOAD_URL:-210,
    IO_ERROR:-220,
    SECURITY_ERROR:-230,
    UPLOAD_LIMIT_EXCEEDED:-240,
    UPLOAD_FAILED:-250,
    SPECIFIED_FILE_ID_NOT_FOUND:-260,
    FILE_VALIDATION_FAILED:-270,
    FILE_CANCELLED:-280,
    UPLOAD_STOPPED:-290
};SWFUpload.FILE_STATUS={
    QUEUED:-1,
    IN_PROGRESS:-2,
    ERROR:-3,
    COMPLETE:-4,
    CANCELLED:-5
};SWFUpload.BUTTON_ACTION={
    SELECT_FILE:-100,
    SELECT_FILES:-110,
    START_UPLOAD:-120
};SWFUpload.prototype.initSettings=function(){
    this.ensureDefault=function(B,A){
        this.settings[B]=(this.settings[B]==undefined)?A:this.settings[B]
    };this.ensureDefault("upload_url","");this.ensureDefault("file_post_name","Filedata");this.ensureDefault("post_params",{});this.ensureDefault("use_query_string",false);this.ensureDefault("requeue_on_error",false);this.ensureDefault("file_types","*.bmp;*.jpg;*.jpeg;*.gif;*.png;*.swf;*.doc;*.xls;*.ppt;*.pdf;*.zip;*.rar");this.ensureDefault("file_types_description","选择要上传的文件");this.ensureDefault("file_size_limit","10240");this.ensureDefault("file_upload_limit",0);this.ensureDefault("file_queue_limit",0);this.ensureDefault("flash_url","swfupload.swf");this.ensureDefault("prevent_swf_caching",true);this.ensureDefault("button_image_url","");this.ensureDefault("button_width",1);this.ensureDefault("button_height",1);this.ensureDefault("button_text","");this.ensureDefault("button_text_style","color: #000000; font-size: 16pt;");this.ensureDefault("button_text_top_padding",0);this.ensureDefault("button_text_left_padding",0);this.ensureDefault("button_action",SWFUpload.BUTTON_ACTION.SELECT_FILES);this.ensureDefault("button_disabled",false);this.ensureDefault("button_placeholder_id",null);this.ensureDefault("debug",false);this.settings.debug_enabled=this.settings.debug;this.settings.return_upload_start_handler=this.returnUploadStart;this.ensureDefault("swfupload_loaded_handler",null);this.ensureDefault("file_dialog_start_handler",null);this.ensureDefault("file_queued_handler",null);this.ensureDefault("file_queue_error_handler",null);this.ensureDefault("file_dialog_complete_handler",null);this.ensureDefault("upload_start_handler",null);this.ensureDefault("upload_progress_handler",null);this.ensureDefault("upload_error_handler",null);this.ensureDefault("upload_success_handler",null);this.ensureDefault("upload_complete_handler",null);this.ensureDefault("debug_handler",this.debugMessage);this.ensureDefault("custom_settings",{});this.customSettings=this.settings.custom_settings;if(this.settings.prevent_swf_caching){
        this.settings.flash_url=this.settings.flash_url+"?swfuploadrnd="+Math.floor(Math.random()*999999999)
    }delete this.ensureDefault
};SWFUpload.prototype.loadFlash=function(){
    if(this.settings.button_placeholder_id!==""){
        this.replaceWithFlash()
    }else{
        this.appendFlash()
    }
};SWFUpload.prototype.appendFlash=function(){
    var B,A;if(document.getElementById(this.movieName)!==null){
        throw"ID "+this.movieName+" is already in use. The Flash Object could not be added"
    }B=document.getElementsByTagName("body")[0];if(B==undefined){
        throw"Could not find the 'body' element."
    }A=document.createElement("div");A.style.width="1px";A.style.height="1px";A.style.overflow="hidden";B.appendChild(A);A.innerHTML=this.getFlashHTML()
};SWFUpload.prototype.replaceWithFlash=function(){
    var A,B;if(document.getElementById(this.movieName)!==null){
        throw"ID "+this.movieName+" is already in use. The Flash Object could not be added"
    }A=document.getElementById(this.settings.button_placeholder_id);if(A==undefined){
        throw"Could not find the placeholder element."
    }B=document.createElement("div");B.innerHTML=this.getFlashHTML();A.parentNode.replaceChild(B.firstChild,A)
};SWFUpload.prototype.getFlashHTML=function(){
    var A=this.settings.button_image_url===""?true:false;return['<object id="',this.movieName,'" type="application/x-shockwave-flash" data="',this.settings.flash_url,'" width="',this.settings.button_width,'" height="',this.settings.button_height,'" class="swfupload">','<param name="wmode" value="',A?"transparent":"window",'" />','<param name="movie" value="',this.settings.flash_url,'" />','<param name="quality" value="high" />','<param name="menu" value="false" />','<param name="allowScriptAccess" value="always" />','<param name="flashvars" value="'+this.getFlashVars()+'" />',"</object>"].join("")
};SWFUpload.prototype.getFlashVars=function(){
    var A=this.buildParamString();return["movieName=",encodeURIComponent(this.movieName),"&amp;uploadURL=",encodeURIComponent(this.settings.upload_url),"&amp;useQueryString=",encodeURIComponent(this.settings.use_query_string),"&amp;requeueOnError=",encodeURIComponent(this.settings.requeue_on_error),"&amp;params=",encodeURIComponent(A),"&amp;filePostName=",encodeURIComponent(this.settings.file_post_name),"&amp;fileTypes=",encodeURIComponent(this.settings.file_types),"&amp;fileTypesDescription=",encodeURIComponent(this.settings.file_types_description),"&amp;fileSizeLimit=",encodeURIComponent(this.settings.file_size_limit),"&amp;fileUploadLimit=",encodeURIComponent(this.settings.file_upload_limit),"&amp;fileQueueLimit=",encodeURIComponent(this.settings.file_queue_limit),"&amp;debugEnabled=",encodeURIComponent(this.settings.debug_enabled),"&amp;buttonImageURL=",encodeURIComponent(this.settings.button_image_url),"&amp;buttonWidth=",encodeURIComponent(this.settings.button_width),"&amp;buttonHeight=",encodeURIComponent(this.settings.button_height),"&amp;buttonText=",encodeURIComponent(this.settings.button_text),"&amp;buttonTextTopPadding=",encodeURIComponent(this.settings.button_text_top_padding),"&amp;buttonTextLeftPadding=",encodeURIComponent(this.settings.button_text_left_padding),"&amp;buttonTextStyle=",encodeURIComponent(this.settings.button_text_style),"&amp;buttonAction=",encodeURIComponent(this.settings.button_action),"&amp;buttonDisabled=",encodeURIComponent(this.settings.button_disabled)].join("")
};SWFUpload.prototype.getMovieElement=function(){
    if(this.movieElement==undefined){
        this.movieElement=document.getElementById(this.movieName)
    }if(this.movieElement===null){
        throw"Could not find Flash element"
    }return this.movieElement
};SWFUpload.prototype.buildParamString=function(){
    var C=this.settings.post_params;var B=[];if(typeof (C)==="object"){
        for(var A in C){
            if(C.hasOwnProperty(A)){
                B.push(encodeURIComponent(A.toString())+"="+encodeURIComponent(C[A].toString()))
            }
        }
    }return B.join("&amp;")
};SWFUpload.prototype.destroy=function(){
    try{
        this.stopUpload();var B=null;try{
            B=this.getMovieElement()
        }catch(C){}if(B!=undefined&&B.parentNode!=undefined&&typeof B.parentNode.removeChild==="function"){
            var A=B.parentNode;if(A!=undefined){
                A.removeChild(B);if(A.parentNode!=undefined&&typeof A.parentNode.removeChild==="function"){
                    A.parentNode.removeChild(A)
                }
            }
        }SWFUpload.instances[this.movieName]=null;delete SWFUpload.instances[this.movieName];delete this.movieElement;delete this.settings;delete this.customSettings;delete this.eventQueue;delete this.movieName;delete window[this.movieName];return true
    }catch(D){
        return false
    }
};SWFUpload.prototype.displayDebugInfo=function(){
    this.debug(["---SWFUpload Instance Info---\n","Version: ",SWFUpload.version,"\n","Movie Name: ",this.movieName,"\n","Settings:\n","\t","upload_url:               ",this.settings.upload_url,"\n","\t","flash_url:                ",this.settings.flash_url,"\n","\t","use_query_string:         ",this.settings.use_query_string.toString(),"\n","\t","file_post_name:           ",this.settings.file_post_name,"\n","\t","post_params:              ",this.settings.post_params.toString(),"\n","\t","file_types:               ",this.settings.file_types,"\n","\t","file_types_description:   ",this.settings.file_types_description,"\n","\t","file_size_limit:          ",this.settings.file_size_limit,"\n","\t","file_upload_limit:        ",this.settings.file_upload_limit,"\n","\t","file_queue_limit:         ",this.settings.file_queue_limit,"\n","\t","debug:                    ",this.settings.debug.toString(),"\n","\t","prevent_swf_caching:      ",this.settings.prevent_swf_caching.toString(),"\n","\t","button_placeholder_id:    ",this.settings.button_placeholder_id.toString(),"\n","\t","button_image_url:         ",this.settings.button_image_url.toString(),"\n","\t","button_width:             ",this.settings.button_width.toString(),"\n","\t","button_height:            ",this.settings.button_height.toString(),"\n","\t","button_text:              ",this.settings.button_text.toString(),"\n","\t","button_text_style:        ",this.settings.button_text_style.toString(),"\n","\t","button_text_top_padding:  ",this.settings.button_text_top_padding.toString(),"\n","\t","button_text_left_padding: ",this.settings.button_text_left_padding.toString(),"\n","\t","button_action:            ",this.settings.button_action.toString(),"\n","\t","button_disabled:          ",this.settings.button_disabled.toString(),"\n","\t","custom_settings:          ",this.settings.custom_settings.toString(),"\n","Event Handlers:\n","\t","swfupload_loaded_handler assigned:  ",(typeof this.settings.swfupload_loaded_handler==="function").toString(),"\n","\t","file_dialog_start_handler assigned: ",(typeof this.settings.file_dialog_start_handler==="function").toString(),"\n","\t","file_queued_handler assigned:       ",(typeof this.settings.file_queued_handler==="function").toString(),"\n","\t","file_queue_error_handler assigned:  ",(typeof this.settings.file_queue_error_handler==="function").toString(),"\n","\t","upload_start_handler assigned:      ",(typeof this.settings.upload_start_handler==="function").toString(),"\n","\t","upload_progress_handler assigned:   ",(typeof this.settings.upload_progress_handler==="function").toString(),"\n","\t","upload_error_handler assigned:      ",(typeof this.settings.upload_error_handler==="function").toString(),"\n","\t","upload_success_handler assigned:    ",(typeof this.settings.upload_success_handler==="function").toString(),"\n","\t","upload_complete_handler assigned:   ",(typeof this.settings.upload_complete_handler==="function").toString(),"\n","\t","debug_handler assigned:             ",(typeof this.settings.debug_handler==="function").toString(),"\n"].join(""))
};SWFUpload.prototype.addSetting=function(B,C,A){
    if(C==undefined){
        return(this.settings[B]=A)
    }else{
        return(this.settings[B]=C)
    }
};SWFUpload.prototype.getSetting=function(A){
    if(this.settings[A]!=undefined){
        return this.settings[A]
    }return""
};SWFUpload.prototype.callFlash=function(C,D){
    D=D||[];var A=this.getMovieElement();var B;if(typeof A[C]==="function"){
        if(D.length===0){
            B=A[C]()
        }else{
            if(D.length===1){
                B=A[C](D[0])
            }else{
                if(D.length===2){
                    B=A[C](D[0],D[1])
                }else{
                    if(D.length===3){
                        B=A[C](D[0],D[1],D[2])
                    }else{
                        throw"Too many arguments"
                    }
                }
            }
        }if(B!=undefined&&typeof B.post==="object"){
            B=this.unescapeFilePostParams(B)
        }return B
    }else{
        throw"Invalid function name: "+C
    }
};SWFUpload.prototype.selectFile=function(){
    this.callFlash("SelectFile")
};SWFUpload.prototype.selectFiles=function(){
    this.callFlash("SelectFiles")
};SWFUpload.prototype.startUpload=function(A){
    this.callFlash("StartUpload",[A])
};SWFUpload.prototype.cancelUpload=function(A){
    this.callFlash("CancelUpload",[A])
};SWFUpload.prototype.stopUpload=function(){
    this.callFlash("StopUpload")
};SWFUpload.prototype.getStats=function(){
    return this.callFlash("GetStats")
};SWFUpload.prototype.setStats=function(A){
    this.callFlash("SetStats",[A])
};SWFUpload.prototype.getFile=function(A){
    if(typeof (A)==="number"){
        return this.callFlash("GetFileByIndex",[A])
    }else{
        return this.callFlash("GetFile",[A])
    }
};SWFUpload.prototype.addFileParam=function(A,B,C){
    return this.callFlash("AddFileParam",[A,B,C])
};SWFUpload.prototype.removeFileParam=function(A,B){
    this.callFlash("RemoveFileParam",[A,B])
};SWFUpload.prototype.setUploadURL=function(A){
    this.settings.upload_url=A.toString();this.callFlash("SetUploadURL",[A])
};SWFUpload.prototype.setPostParams=function(A){
    this.settings.post_params=A;this.callFlash("SetPostParams",[A])
};SWFUpload.prototype.addPostParam=function(A,B){
    this.settings.post_params[A]=B;this.callFlash("SetPostParams",[this.settings.post_params])
};SWFUpload.prototype.removePostParam=function(A){
    delete this.settings.post_params[A];this.callFlash("SetPostParams",[this.settings.post_params])
};SWFUpload.prototype.setFileTypes=function(A,B){
    this.settings.file_types=A;this.settings.file_types_description=B;this.callFlash("SetFileTypes",[A,B])
};SWFUpload.prototype.setFileSizeLimit=function(A){
    this.settings.file_size_limit=A;this.callFlash("SetFileSizeLimit",[A])
};SWFUpload.prototype.setFileUploadLimit=function(A){
    this.settings.file_upload_limit=A;this.callFlash("SetFileUploadLimit",[A])
};SWFUpload.prototype.setFileQueueLimit=function(A){
    this.settings.file_queue_limit=A;this.callFlash("SetFileQueueLimit",[A])
};SWFUpload.prototype.setFilePostName=function(A){
    this.settings.file_post_name=A;this.callFlash("SetFilePostName",[A])
};SWFUpload.prototype.setUseQueryString=function(A){
    this.settings.use_query_string=A;this.callFlash("SetUseQueryString",[A])
};SWFUpload.prototype.setRequeueOnError=function(A){
    this.settings.requeue_on_error=A;this.callFlash("SetRequeueOnError",[A])
};SWFUpload.prototype.setDebugEnabled=function(A){
    this.settings.debug_enabled=A;this.callFlash("SetDebugEnabled",[A])
};SWFUpload.prototype.setButtonImageURL=function(A){
    if(A==undefined){
        A=""
    }this.settings.button_image_url=A;this.callFlash("SetButtonImageURL",[A])
};SWFUpload.prototype.setButtonDimensions=function(C,A){
    this.settings.button_width=C;this.settings.button_height=A;var B=this.getMovieElement();if(B!=undefined){
        B.style.width=C+"px";B.style.height=A+"px"
    }this.callFlash("SetButtonDimensions",[C,A])
};SWFUpload.prototype.setButtonText=function(A){
    this.settings.button_text=A;this.callFlash("SetButtonText",[A])
};SWFUpload.prototype.setButtonTextPadding=function(B,A){
    this.settings.button_text_top_padding=A;this.settings.button_text_left_padding=B;this.callFlash("SetButtonTextPadding",[B,A])
};SWFUpload.prototype.setButtonTextStyle=function(A){
    this.settings.button_text_style=A;this.callFlash("SetButtonTextStyle",[A])
};SWFUpload.prototype.setButtonDisabled=function(A){
    this.settings.button_disabled=A;this.callFlash("SetButtonDisabled",[A])
};SWFUpload.prototype.setButtonAction=function(A){
    this.settings.button_action=A;this.callFlash("SetButtonAction",[A])
};SWFUpload.prototype.queueEvent=function(B,C){
    if(C==undefined){
        C=[]
    }else{
        if(!(C instanceof Array)){
            C=[C]
        }
    }var A=this;if(typeof this.settings[B]==="function"){
        this.eventQueue.push(function(){
            this.settings[B].apply(this,C)
        });setTimeout(function(){
            A.executeNextEvent()
        },0)
    }else{
        if(this.settings[B]!==null){
            throw"Event handler "+B+" is unknown or is not a function"
        }
    }
};SWFUpload.prototype.executeNextEvent=function(){
    var A=this.eventQueue?this.eventQueue.shift():null;if(typeof (A)==="function"){
        A.apply(this)
    }
};SWFUpload.prototype.unescapeFilePostParams=function(C){
    var E=/[$]([0-9a-f]{4})/i;var F={};var D;if(C!=undefined){
        for(var A in C.post){
            if(C.post.hasOwnProperty(A)){
                D=A;var B;while((B=E.exec(D))!==null){
                    D=D.replace(B[0],String.fromCharCode(parseInt("0x"+B[1],16)))
                }F[D]=C.post[A]
            }
        }C.post=F
    }return C
};SWFUpload.prototype.flashReady=function(){
    var A=this.getMovieElement();if(typeof A.StartUpload!=="function"){
        throw"ExternalInterface methods failed to initialize."
    }if(window[this.movieName]==undefined){
        window[this.movieName]=A
    }this.queueEvent("swfupload_loaded_handler")
};SWFUpload.prototype.fileDialogStart=function(){
    this.queueEvent("file_dialog_start_handler")
};SWFUpload.prototype.fileQueued=function(A){
    A=this.unescapeFilePostParams(A);this.queueEvent("file_queued_handler",A)
};SWFUpload.prototype.fileQueueError=function(A,C,B){
    A=this.unescapeFilePostParams(A);this.queueEvent("file_queue_error_handler",[A,C,B])
};SWFUpload.prototype.fileDialogComplete=function(A,B){
    this.queueEvent("file_dialog_complete_handler",[A,B])
};SWFUpload.prototype.uploadStart=function(A){
    A=this.unescapeFilePostParams(A);this.queueEvent("return_upload_start_handler",A)
};SWFUpload.prototype.returnUploadStart=function(A){
    var B;if(typeof this.settings.upload_start_handler==="function"){
        A=this.unescapeFilePostParams(A);B=this.settings.upload_start_handler.call(this,A)
    }else{
        if(this.settings.upload_start_handler!=undefined){
            throw"upload_start_handler must be a function"
        }
    }if(B===undefined){
        B=true
    }B=!!B;this.callFlash("ReturnUploadStart",[B])
};SWFUpload.prototype.uploadProgress=function(A,C,B){
    A=this.unescapeFilePostParams(A);this.queueEvent("upload_progress_handler",[A,C,B])
};SWFUpload.prototype.uploadError=function(A,C,B){
    A=this.unescapeFilePostParams(A);this.queueEvent("upload_error_handler",[A,C,B])
};SWFUpload.prototype.uploadSuccess=function(B,A){
    B=this.unescapeFilePostParams(B);this.queueEvent("upload_success_handler",[B,A])
};SWFUpload.prototype.uploadComplete=function(A){
    A=this.unescapeFilePostParams(A);this.queueEvent("upload_complete_handler",A)
};SWFUpload.prototype.debug=function(A){
    this.queueEvent("debug_handler",A)
};SWFUpload.prototype.debugMessage=function(C){
    if(this.settings.debug){
        var A,D=[];if(typeof C==="object"&&typeof C.name==="string"&&typeof C.message==="string"){
            for(var B in C){
                if(C.hasOwnProperty(B)){
                    D.push(B+": "+C[B])
                }
            }A=D.join("\n")||"";D=A.split("\n");A="EXCEPTION: "+D.join("\nEXCEPTION: ");SWFUpload.Console.writeLine(A)
        }else{
            SWFUpload.Console.writeLine(C)
        }
    }
};SWFUpload.Console={};SWFUpload.Console.writeLine=function(D){
    var B,A;try{
        B=document.getElementById("SWFUpload_Console");if(!B){
            A=document.createElement("form");document.getElementsByTagName("body")[0].appendChild(A);B=document.createElement("textarea");B.id="SWFUpload_Console";B.style.fontFamily="monospace";B.setAttribute("wrap","off");B.wrap="off";B.style.overflow="auto";B.style.width="700px";B.style.height="350px";B.style.margin="5px";A.appendChild(B)
        }B.value+=D+"\n";B.scrollTop=B.scrollHeight-B.clientHeight
    }catch(C){
        alert("Exception: "+C.name+" Message: "+C.message)
    }
};var SWFUpload;if(typeof (SWFUpload)==="function"){
    SWFUpload.queue={};SWFUpload.prototype.initSettings=(function(A){
        return function(){
            if(typeof (A)==="function"){
                A.call(this)
            }this.customSettings.queue_cancelled_flag=false;this.customSettings.queue_upload_count=0;this.settings.user_upload_complete_handler=this.settings.upload_complete_handler;this.settings.upload_complete_handler=SWFUpload.queue.uploadCompleteHandler;this.settings.queue_complete_handler=this.settings.queue_complete_handler||null
        }
    })(SWFUpload.prototype.initSettings);SWFUpload.prototype.startUpload=function(A){
        this.customSettings.queue_cancelled_flag=false;this.callFlash("StartUpload",false,[A])
    };SWFUpload.prototype.cancelQueue=function(){
        this.customSettings.queue_cancelled_flag=true;this.stopUpload();var A=this.getStats();while(A.files_queued>0){
            this.cancelUpload();A=this.getStats()
        }
    };SWFUpload.queue.uploadCompleteHandler=function(B){
        var C=this.settings.user_upload_complete_handler;var D;if(B.filestatus===SWFUpload.FILE_STATUS.COMPLETE){
            this.customSettings.queue_upload_count++
        }if(typeof (C)==="function"){
            D=(C.call(this,B)===false)?false:true
        }else{
            D=true
        }if(D){
            var A=this.getStats();if(A.files_queued>0&&this.customSettings.queue_cancelled_flag===false){
                this.startUpload()
            }else{
                if(this.customSettings.queue_cancelled_flag===false){
                    this.queueEvent("queue_complete_handler",[this.customSettings.queue_upload_count]);this.customSettings.queue_upload_count=0
                }else{
                    this.customSettings.queue_cancelled_flag=false;this.customSettings.queue_upload_count=0
                }
            }
        }
    }
}function cancelQueue(A){
    document.getElementById(A.customSettings.cancelButtonId).disabled=true;A.stopUpload();var B;do{
        B=A.getStats();A.cancelUpload()
    }while(B.files_queued!==0)
}function fileDialogStart(){}function fileQueued(C){
    try{
        var A=new FileProgress(C,this.customSettings.progressTarget);A.setStatus("Pending...");A.toggleCancel(true,this)
    }catch(B){
        this.debug(B)
    }
}function fileQueueError(C,E,D){
    try{
        if(E===SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED){
            alert("You have attempted to queue too many files.\n"+(D===0?"You have reached the upload limit.":"You may select "+(D>1?"up to "+D+" files.":"one file.")));return
        }var A=new FileProgress(C,this.customSettings.progressTarget);A.setError();A.toggleCancel(false);switch(E){
            case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:A.setStatus("File is too big.");this.debug("Error Code: File too big, File name: "+C.name+", File size: "+C.size+", Message: "+D);break;case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:A.setStatus("Cannot upload Zero Byte files.");this.debug("Error Code: Zero byte file, File name: "+C.name+", File size: "+C.size+", Message: "+D);break;case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:A.setStatus("Invalid File Type.");this.debug("Error Code: Invalid File Type, File name: "+C.name+", File size: "+C.size+", Message: "+D);break;case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:alert("You have selected too many files.  "+(D>1?"You may only add "+D+" more files":"You cannot add any more files."));break;default:if(C!==null){
                A.setStatus("Unhandled Error")
            }this.debug("Error Code: "+E+", File name: "+C.name+", File size: "+C.size+", Message: "+D);break
        }
    }catch(B){
        this.debug(B)
    }
}function fileDialogComplete(A,C){
    try{
        if(this.getStats().files_queued>0){}
    }catch(B){
        this.debug(B)
    }
}function uploadStart(C){
    try{
        var A=new FileProgress(C,this.customSettings.progressTarget);A.setStatus("Uploading...");A.toggleCancel(true,this)
    }catch(B){}return true
}function uploadProgress(C,F,E){
    try{
        var D=Math.ceil((F/E)*100);var A=new FileProgress(C,this.customSettings.progressTarget);A.setProgress(D);A.setStatus("Uploading...")
    }catch(B){
        this.debug(B)
    }
}function uploadSuccess(D,B){
    try{
        var A=new FileProgress(D,this.customSettings.progressTarget);A.setComplete();A.setStatus("Complete.");A.toggleCancel(false)
    }catch(C){
        this.debug(C)
    }
}function uploadComplete(B){
    try{
        if(this.getStats().files_queued===0){}else{
            this.startUpload()
        }
    }catch(A){
        this.debug(A)
    }
}function uploadError(C,E,D){
    try{
        var A=new FileProgress(C,this.customSettings.progressTarget);A.setError();A.toggleCancel(false);switch(E){
            case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:A.setStatus("Upload Error: "+D);this.debug("Error Code: HTTP Error, File name: "+C.name+", Message: "+D);break;case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:A.setStatus("Configuration Error");this.debug("Error Code: No backend file, File name: "+C.name+", Message: "+D);break;case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:A.setStatus("Upload Failed.");this.debug("Error Code: Upload Failed, File name: "+C.name+", File size: "+C.size+", Message: "+D);break;case SWFUpload.UPLOAD_ERROR.IO_ERROR:A.setStatus("Server (IO) Error");this.debug("Error Code: IO Error, File name: "+C.name+", Message: "+D);break;case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:A.setStatus("Security Error");this.debug("Error Code: Security Error, File name: "+C.name+", Message: "+D);break;case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:A.setStatus("Upload limit exceeded.");this.debug("Error Code: Upload Limit Exceeded, File name: "+C.name+", File size: "+C.size+", Message: "+D);break;case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:A.setStatus("File not found.");this.debug("Error Code: The file was not found, File name: "+C.name+", File size: "+C.size+", Message: "+D);break;case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:A.setStatus("Failed Validation.  Upload skipped.");this.debug("Error Code: File Validation Failed, File name: "+C.name+", File size: "+C.size+", Message: "+D);break;case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:if(this.getStats().files_queued===0){
                document.getElementById(this.customSettings.cancelButtonId).disabled=true
            }A.setStatus("Cancelled");A.setCancelled();break;case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:A.setStatus("Stopped");break;default:A.setStatus("Unhandled Error: "+error_code);this.debug("Error Code: "+E+", File name: "+C.name+", File size: "+C.size+", Message: "+D);break
        }
    }catch(B){
        this.debug(B)
    }
}function FileProgress(C,A){
    this.fileProgressID=C.id;this.opacity=100;this.height=0;this.fileProgressWrapper=document.getElementById(this.fileProgressID);if(!this.fileProgressWrapper){
        this.fileProgressWrapper=document.createElement("div");this.fileProgressWrapper.className="progressWrapper";this.fileProgressWrapper.id=this.fileProgressID;this.fileProgressElement=document.createElement("div");this.fileProgressElement.className="progressContainer";var F=document.createElement("a");F.className="progressCancel";F.href="#";F.style.visibility="hidden";F.appendChild(document.createTextNode(" "));var B=document.createElement("div");B.className="progressName";B.appendChild(document.createTextNode(C.name));var E=document.createElement("div");E.className="progressBarInProgress";var D=document.createElement("div");D.className="progressBarStatus";D.innerHTML="&nbsp;";this.fileProgressElement.appendChild(F);this.fileProgressElement.appendChild(B);this.fileProgressElement.appendChild(D);this.fileProgressElement.appendChild(E);this.fileProgressWrapper.appendChild(this.fileProgressElement);document.getElementById(A).appendChild(this.fileProgressWrapper)
    }else{
        this.fileProgressElement=this.fileProgressWrapper.firstChild
    }this.height=this.fileProgressWrapper.offsetHeight
}FileProgress.prototype.setProgress=function(A){
    this.fileProgressElement.className="progressContainer green";this.fileProgressElement.childNodes[3].className="progressBarInProgress";this.fileProgressElement.childNodes[3].style.width=A+"%"
};FileProgress.prototype.setComplete=function(){
    this.fileProgressElement.className="progressContainer blue";this.fileProgressElement.childNodes[3].className="progressBarComplete";this.fileProgressElement.childNodes[3].style.width="";var A=this;setTimeout(function(){
        A.disappear()
    },10000)
};FileProgress.prototype.setError=function(){
    this.fileProgressElement.className="progressContainer red";this.fileProgressElement.childNodes[3].className="progressBarError";this.fileProgressElement.childNodes[3].style.width="";var A=this;setTimeout(function(){
        A.disappear()
    },5000)
};FileProgress.prototype.setCancelled=function(){
    this.fileProgressElement.className="progressContainer";this.fileProgressElement.childNodes[3].className="progressBarError";this.fileProgressElement.childNodes[3].style.width="";var A=this;setTimeout(function(){
        A.disappear()
    },2000)
};FileProgress.prototype.setStatus=function(A){
    this.fileProgressElement.childNodes[2].innerHTML=A
};FileProgress.prototype.toggleCancel=function(B,C){
    this.fileProgressElement.childNodes[0].style.visibility=B?"visible":"hidden";if(C){
        var A=this.fileProgressID;this.fileProgressElement.childNodes[0].onclick=function(){
            C.cancelUpload(A);return false
        }
    }
};FileProgress.prototype.disappear=function(){
    var E=15;var C=4;var B=30;if(this.opacity>0){
        this.opacity-=E;if(this.opacity<0){
            this.opacity=0
        }if(this.fileProgressWrapper.filters){
            try{
                this.fileProgressWrapper.filters.item("DXImageTransform.Microsoft.Alpha").opacity=this.opacity
            }catch(D){
                this.fileProgressWrapper.style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity="+this.opacity+")"
            }
        }else{
            this.fileProgressWrapper.style.opacity=this.opacity/100
        }
    }if(this.height>0){
        this.height-=C;if(this.height<0){
            this.height=0
        }this.fileProgressWrapper.style.height=this.height+"px"
    }if(this.height>0||this.opacity>0){
        var A=this;setTimeout(function(){
            A.disappear()
        },B)
    }else{
        this.fileProgressWrapper.style.display="none";if(this.fileProgressWrapper.parentNode){
            this.fileProgressWrapper.parentNode.removeChild(this.fileProgressWrapper)
        }
    }
};Ext.UpdateManager.defaults.indicatorText='<div class="loading-indicator">加载中...</div>';if(Ext.View){
    Ext.View.prototype.emptyText=""
}if(Ext.grid.GridPanel){
    Ext.grid.GridPanel.prototype.ddText="{0} 选择行"
}if(Ext.TabPanelItem){
    Ext.TabPanelItem.prototype.closeText="关闭"
}if(Ext.form.Field){
    Ext.form.Field.prototype.invalidText="输入值非法"
}Date.monthNames=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];Date.dayNames=["日","一","二","三","四","五","六"];if(Ext.MessageBox){
    Ext.MessageBox.buttonText={
        ok:"确定",
        cancel:"取消",
        yes:"是",
        no:"否"
    }
}if(Ext.util.Format){
    Ext.util.Format.date=function(A,B){
        if(!A){
            return""
        }if(!(A instanceof Date)){
            A=new Date(Date.parse(A))
        }return A.dateFormat(B||"Y-m-d")
    }
}if(Ext.DatePicker){
    Ext.apply(Ext.DatePicker.prototype,{
        todayText:"今天",
        minText:"日期在最小日期之前",
        maxText:"日期在最大日期之后",
        disabledDaysText:"",
        disabledDatesText:"",
        monthNames:Date.monthNames,
        dayNames:Date.dayNames,
        nextText:"下月 (Control+Right)",
        prevText:"上月 (Control+Left)",
        monthYearText:"选择一个月 (Control+Up/Down 来改变年)",
        todayTip:"{0} (空格键选择)",
        format:"Y-m-d",
        okText:"确定",
        cancelText:"取消"
    })
}if(Ext.PagingToolbar){
    Ext.apply(Ext.PagingToolbar.prototype,{
        beforePageText:"第",
        afterPageText:"页/共 {0} 页",
        firstText:"第一页",
        prevText:"前一页",
        nextText:"下一页",
        lastText:"最后页",
        refreshText:"刷新",
        displayMsg:"显示 {0} - {1}，共 {2} 条",
        emptyMsg:"没有数据需要显示"
    })
}if(Ext.form.TextField){
    Ext.apply(Ext.form.TextField.prototype,{
        minLengthText:"该输入项的最小长度是 {0}",
        maxLengthText:"该输入项的最大长度是 {0}",
        blankText:"该输入项为必输项",
        regexText:"",
        emptyText:null
    })
}if(Ext.form.NumberField){
    Ext.apply(Ext.form.NumberField.prototype,{
        minText:"该输入项的最小值是 {0}",
        maxText:"该输入项的最大值是 {0}",
        nanText:"{0} 不是有效数值"
    })
}if(Ext.form.DateField){
    Ext.apply(Ext.form.DateField.prototype,{
        disabledDaysText:"禁用",
        disabledDatesText:"禁用",
        minText:"该输入项的日期必须在 {0} 之后",
        maxText:"该输入项的日期必须在 {0} 之前",
        invalidText:"{0} 是无效的日期 - 必须符合格式： {1}",
        format:"Y-m-d"
    })
}if(Ext.form.ComboBox){
    Ext.apply(Ext.form.ComboBox.prototype,{
        loadingText:"加载...",
        valueNotFoundText:undefined
    })
}if(Ext.form.VTypes){
    Ext.apply(Ext.form.VTypes,{
        emailText:'该输入项必须是电子邮件地址，格式如： "user@domain.com"',
        urlText:'该输入项必须是URL地址，格式如： "http://www.domain.com"',
        alphaText:"该输入项只能包含字符和_",
        alphanumText:"该输入项只能包含字符,数字和_"
    })
}if(Ext.grid.GridView){
    Ext.apply(Ext.grid.GridView.prototype,{
        sortAscText:"正序",
        sortDescText:"逆序",
        lockText:"锁列",
        unlockText:"解锁列",
        columnsText:"列"
    })
}if(Ext.grid.PropertyColumnModel){
    Ext.apply(Ext.grid.PropertyColumnModel.prototype,{
        nameText:"名称",
        valueText:"值",
        dateFormat:"Y-m-d"
    })
}if(Ext.layout.BorderLayout&&Ext.layout.BorderLayout.SplitRegion){
    Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype,{
        splitTip:"拖动来改变尺寸.",
        collapsibleSplitTip:"拖动来改变尺寸. 双击隐藏."
    })
}function SoundManager(B,A){
    this.flashVersion=8;this.debugMode=true;this.useConsole=true;this.consoleOnly=false;this.waitForWindowLoad=false;this.nullURL="data/null.mp3";this.allowPolling=true;this.defaultOptions={
        autoLoad:false,
        stream:true,
        autoPlay:false,
        onid3:null,
        onload:null,
        whileloading:null,
        onplay:null,
        onpause:null,
        onresume:null,
        whileplaying:null,
        onstop:null,
        onfinish:null,
        onbeforefinish:null,
        onbeforefinishtime:5000,
        onbeforefinishcomplete:null,
        onjustbeforefinish:null,
        onjustbeforefinishtime:200,
        multiShot:true,
        position:null,
        pan:0,
        volume:100
    };this.flash9Options={
        usePeakData:false,
        useWaveformData:false,
        useEQData:false
    };this.flashBlockHelper={
        enabled:false,
        message:['<div id="sm2-flashblock" style="position:fixed;left:0px;top:0px;width:100%;min-height:24px;z-index:9999;background:#666;color:#fff;font-family:helvetica,verdana,arial;font-size:11px;border-bottom:1px solid #333;opacity:0.95">','<div style="float:right;display:inline;margin-right:0.5em;color:#999;line-height:24px">[<a href="#noflashblock" onclick="document.getElementById(\'sm2-flashblock\').style.display=\'none\'" title="Go away! :)" style="color:#fff;text-decoration:none">x</a>]</div>','<div id="sm2-flashmovie" style="float:left;display:inline;margin-left:0.5em;margin-right:0.5em"><!-- [flash] --></div>','<div style="padding-left:0.5em;padding-right:0.5em;line-height:24px">Using Flashblock? Please right-click the icon and "<b>allow flash from this site</b>" to enable sound/audio features, and then reload this page.</div>',"</div>"]
    };var C=this;this.version=null;this.versionNumber="V2.77a.20080901";this.movieURL=null;this.url=null;this.swfLoaded=false;this.enabled=false;this.o=null;this.id=(A||"sm2movie");this.oMC=null;this.sounds=[];this.soundIDs=[];this.muted=false;this.isIE=(navigator.userAgent.match(/MSIE/i));this.isSafari=(navigator.userAgent.match(/safari/i));this.isGecko=(navigator.userAgent.match(/gecko/i));this.debugID="soundmanager-debug";this._debugOpen=true;this._didAppend=false;this._appendSuccess=false;this._didInit=false;this._disabled=false;this._windowLoaded=false;this._hasConsole=(typeof console!="undefined"&&typeof console.log!="undefined");this._debugLevels=["log","info","warn","error"];this._defaultFlashVersion=8;this.features={
        peakData:false,
        waveformData:false,
        eqData:false
    };this.sandbox={
        type:null,
        types:{
            remote:"remote (domain-based) rules",
            localWithFile:"local with file access (no internet access)",
            localWithNetwork:"local with network (internet access only, no local access)",
            localTrusted:"local, trusted (local + internet access)"
        },
        description:null,
        noRemote:null,
        noLocal:null
    };this._setVersionInfo=function(){
        if(C.flashVersion!=8&&C.flashVersion!=9){
            alert('soundManager.flashVersion must be 8 or 9. "'+C.flashVersion+'" is invalid. Reverting to '+C._defaultFlashVersion+".");C.flashVersion=C._defaultFlashVersion
        }C.version=C.versionNumber+(C.flashVersion==9?" (AS3/Flash 9)":" (AS2/Flash 8)");C.movieURL=(C.flashVersion==8?"soundmanager2.swf":"soundmanager2_flash9.swf");C.features.peakData=C.features.waveformData=C.features.eqData=(C.flashVersion==9)
    };this._overHTTP=(document.location?document.location.protocol.match(/http/i):null);this._waitingforEI=false;this._initPending=false;this._tryInitOnFocus=(this.isSafari&&typeof document.hasFocus=="undefined");this._isFocused=(typeof document.hasFocus!="undefined"?document.hasFocus():null);this._okToDisable=!this._tryInitOnFocus;var D="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html";this.supported=function(){
        return(C._didInit&&!C._disabled)
    };this.getMovie=function(G){
        return C.isIE?window[G]:(C.isSafari?document.getElementById(G)||document[G]:document.getElementById(G))
    };this.loadFromXML=function(G){
        try{
            C.o._loadFromXML(G)
        }catch(H){
            C._failSafely();return true
        }
    };this.createSound=function(G){
        if(!C._didInit){
            throw new Error("soundManager.createSound(): Not loaded yet - wait for soundManager.onload() before calling sound-related methods")
        }if(arguments.length==2){
            G={
                id:arguments[0],
                url:arguments[1]
            }
        }var H=C._mergeObjects(G);if(C._idCheck(H.id,true)){
            return C.sounds[H.id]
        }C.sounds[H.id]=new E(C,H);C.soundIDs[C.soundIDs.length]=H.id;if(C.flashVersion==8){
            C.o._createSound(H.id,H.onjustbeforefinishtime)
        }else{
            C.o._createSound(H.id,H.url,H.onjustbeforefinishtime,H.usePeakData,H.useWaveformData,H.useEQData)
        }if(H.autoLoad||H.autoPlay){
            window.setTimeout(function(){
                C.sounds[H.id].load(H)
            },20)
        }if(H.autoPlay){
            if(C.flashVersion==8){
                C.sounds[H.id].playState=1
            }else{
                C.sounds[H.id].play()
            }
        }return C.sounds[H.id]
    };this.destroySound=function(H,G){
        if(!C._idCheck(H)){
            return false
        }for(var I=0;I<C.soundIDs.length;I++){
            if(C.soundIDs[I]==H){
                C.soundIDs.splice(I,1);continue
            }
        }C.sounds[H].unload();if(!G){
            C.sounds[H].destruct()
        }delete C.sounds[H]
    };this.load=function(G,H){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].load(H)
    };this.unload=function(G){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].unload()
    };this.play=function(G,H){
        if(!C._idCheck(G)){
            if(typeof H!="Object"){
                H={
                    url:H
                }
            }if(H&&H.url){
                H.id=G;C.createSound(H)
            }else{
                return false
            }
        }C.sounds[G].play(H)
    };this.start=this.play;this.setPosition=function(G,H){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].setPosition(H)
    };this.stop=function(G){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].stop()
    };this.stopAll=function(){
        for(var G in C.sounds){
            if(C.sounds[G] instanceof E){
                C.sounds[G].stop()
            }
        }
    };this.pause=function(G){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].pause()
    };this.resume=function(G){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].resume()
    };this.togglePause=function(G){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].togglePause()
    };this.setPan=function(G,H){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].setPan(H)
    };this.setVolume=function(H,G){
        if(!C._idCheck(H)){
            return false
        }C.sounds[H].setVolume(G)
    };this.mute=function(G){
        if(typeof G!="string"){
            G=null
        }if(!G){
            var I=null;for(var H=C.soundIDs.length;H--;){
                C.sounds[C.soundIDs[H]].mute()
            }C.muted=true
        }else{
            if(!C._idCheck(G)){
                return false
            }C.sounds[G].mute()
        }
    };this.unmute=function(G){
        if(typeof G!="string"){
            G=null
        }if(!G){
            var I=null;for(var H=C.soundIDs.length;H--;){
                C.sounds[C.soundIDs[H]].unmute()
            }C.muted=false
        }else{
            if(!C._idCheck(G)){
                return false
            }C.sounds[G].unmute()
        }
    };this.setPolling=function(G){
        if(!C.o||!C.allowPolling){
            return false
        }C.o._setPolling(G)
    };this.disable=function(G){
        if(C._disabled){
            return false
        }if(!G&&C.flashBlockHelper.enabled){
            C.handleFlashBlock()
        }C._disabled=true;for(var H=C.soundIDs.length;H--;){
            C._disableObject(C.sounds[C.soundIDs[H]])
        }C.initComplete();C._disableObject(C)
    };this.handleFlashBlock=function(I){
        function H(){
            var M=document.getElementById("sm2-flashblock");if(!M){
                try{
                    var K=document.getElementById("sm2-container");if(K){
                        K.parentNode.removeChild(K)
                    }var N=document.createElement("div");N.innerHTML=C.flashBlockHelper.message.join("").replace("<!-- [flash] -->",C._html);C._getDocument().appendChild(N);window.setTimeout(function(){
                        var O=document.getElementById("sm2-flashmovie").getElementsByTagName("div")[0];O.style.background="url(chrome://flashblock/skin/flash-disabled-16.png) 0px 0px no-repeat";O.style.border="none";O.style.minWidth="";O.style.minHeight="";O.style.width="16px";O.style.height="16px";O.style.marginTop="4px";O.onmouseover=null;O.onmouseout=null;O.onclick=null;document.getElementById("sm2-flashmovie").onclick=O.onclick
                    },1)
                }catch(L){
                    return false
                }
            }else{
                M.style.display="block"
            }this.onload=null
        }if(I){
            H();return false
        }if(!C.isGecko){
            return false
        }if(window.location.toString().match(/\#noflashblock/i)){
            return false
        }var J="chrome://flashblock/skin/flash-disabled-16.png";var G=new Image();G.style.position="absolute";G.style.left="-256px";G.style.top="-256px";G.onload=H;G.onerror=function(){
            this.onerror=null
        };G.src=J;C._getDocument().appendChild(G)
    };this.getSoundById=function(H,I){
        if(!H){
            throw new Error("SoundManager.getSoundById(): sID is null/undefined")
        }var G=C.sounds[H];if(!G&&!I){}return G
    };this.onload=function(){};this.onerror=function(){};this._idCheck=this.getSoundById;this._disableObject=function(H){
        for(var G in H){
            if(typeof H[G]=="function"&&typeof H[G]._protected=="undefined"){
                H[G]=function(){
                    return false
                }
            }
        }G=null
    };this._failSafely=function(){
        var I="You may need to whitelist this location/domain eg. file:///C:/ or C:/ or mysite.com, or set ALWAYS ALLOW under the Flash Player Global Security Settings page. The latter is probably less-secure.";var H='<a href="'+D+'" title="'+I+'">view/edit</a>';var G='<a href="'+D+'" title="Flash Player Global Security Settings">FPGSS</a>';if(!C._disabled){
            C.disable()
        }
    };this._normalizeMovieURL=function(G){
        if(G){
            if(G.match(/\.swf/)){
                G=G.substr(0,G.lastIndexOf(".swf"))
            }if(G.lastIndexOf("/")!=G.length-1){
                G=G+"/"
            }
        }return(G&&G.lastIndexOf("/")!=-1?G.substr(0,G.lastIndexOf("/")+1):"./")+C.movieURL
    };this._getDocument=function(){
        return(document.body?document.body:(document.documentElement?document.documentElement:document.getElementsByTagName("div")[0]))
    };this._getDocument._protected=true;this._createMovie=function(I,H){
        if(C._didAppend&&C._appendSuccess){
            return false
        }if(window.location.href.indexOf("debug=1")+1){
            C.debugMode=true
        }C._didAppend=true;C._setVersionInfo();C.url=C._normalizeMovieURL(H?H:C.url);H=C.url;var R='<embed name="'+I+'" id="'+I+'" src="'+H+'" width="1" height="1" quality="high" allowScriptAccess="always" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>';var N='<object id="'+I+'" data="'+H+'" type="application/x-shockwave-flash" width="1" height="1"><param name="movie" value="'+H+'" /><param name="AllowScriptAccess" value="always" /><!-- --></object>';html=(!C.isIE?R:N);C._html=html;var P='<div id="'+C.debugID+'-toggle" style="position:fixed;_position:absolute;right:0px;bottom:0px;_top:0px;width:1.2em;height:1.2em;line-height:1.2em;margin:2px;padding:0px;text-align:center;border:1px solid #999;cursor:pointer;background:#fff;color:#333;z-index:706" title="Toggle SM2 debug console" onclick="soundManager._toggleDebug()">-</div>';var M='<div id="'+C.debugID+'" style="display:'+(C.debugMode&&((!C._hasConsole||!C.useConsole)||(C.useConsole&&C._hasConsole&&!C.consoleOnly))?"block":"none")+';opacity:0.85"></div>';var L="soundManager._createMovie(): appendChild/innerHTML set failed. May be app/xhtml+xml DOM-related.";var J='<div id="sm2-container" style="position:absolute;left:-256px;top:-256px;width:1px;height:1px" class="movieContainer">'+html+"</div>"+(C.debugMode&&((!C._hasConsole||!C.useConsole)||(C.useConsole&&C._hasConsole&&!C.consoleOnly))&&!document.getElementById(C.debugID)?"x"+M+P:"");var G=C._getDocument();if(G){
            C.oMC=document.createElement("div");C.oMC.id="sm2-container";C.oMC.className="movieContainer";C.oMC.style.position="absolute";C.oMC.style.left="-256px";C.oMC.style.width="1px";C.oMC.style.height="1px";try{
                G.appendChild(C.oMC);C.oMC.innerHTML=html;C._appendSuccess=true
            }catch(O){
                throw new Error(L)
            }if(!document.getElementById(C.debugID)&&((!C._hasConsole||!C.useConsole)||(C.useConsole&&C._hasConsole&&!C.consoleOnly))){
                var Q=document.createElement("div");Q.id=C.debugID;Q.style.display=(C.debugMode?"block":"none");if(C.debugMode){
                    try{
                        var K=document.createElement("div");G.appendChild(K);K.innerHTML=P
                    }catch(O){
                        throw new Error(L)
                    }
                }G.appendChild(Q)
            }G=null
        }
    };this._writeDebug=function(G,I,H){};this._writeDebug._protected=true;this._writeDebugAlert=function(G){
        alert(G)
    };if(window.location.href.indexOf("debug=alert")+1&&C.debugMode){}this._toggleDebug=function(){
        var H=document.getElementById(C.debugID);var G=document.getElementById(C.debugID+"-toggle");if(!H){
            return false
        }if(C._debugOpen){
            G.innerHTML="+";H.style.display="none"
        }else{
            G.innerHTML="-";H.style.display="block"
        }C._debugOpen=!C._debugOpen
    };this._toggleDebug._protected=true;this._debug=function(){
        for(var H=0,G=C.soundIDs.length;H<G;H++){
            C.sounds[C.soundIDs[H]]._debug()
        }
    };this._mergeObjects=function(H,G){
        var K={};for(var I in H){
            K[I]=H[I]
        }var J=(typeof G=="undefined"?C.defaultOptions:G);for(var L in J){
            if(typeof K[L]=="undefined"){
                K[L]=J[L]
            }
        }return K
    };this.createMovie=function(G){
        if(G){
            C.url=G
        }C._initMovie()
    };this.go=this.createMovie;this._initMovie=function(){
        if(C.o){
            return false
        }C.o=C.getMovie(C.id);if(!C.o){
            C._createMovie(C.id,C.url);C.o=C.getMovie(C.id)
        }if(C.o){}
    };this.waitForExternalInterface=function(){
        if(C._waitingForEI){
            return false
        }C._waitingForEI=true;if(C._tryInitOnFocus&&!C._isFocused){
            return false
        }if(!C._didInit){}setTimeout(function(){
            if(!C._didInit){
                if(!C._overHTTP){}
            }if(!C._didInit&&C._okToDisable){
                C._failSafely()
            }
        },750)
    };this.handleFocus=function(){
        if(C._isFocused||!C._tryInitOnFocus){
            return true
        }C._okToDisable=true;C._isFocused=true;if(C._tryInitOnFocus){
            window.removeEventListener("mousemove",C.handleFocus,false)
        }C._waitingForEI=false;setTimeout(C.waitForExternalInterface,500);if(window.removeEventListener){
            window.removeEventListener("focus",C.handleFocus,false)
        }else{
            if(window.detachEvent){
                window.detachEvent("onfocus",C.handleFocus)
            }
        }
    };this.initComplete=function(){
        if(C._didInit){
            return false
        }C._didInit=true;if(C._disabled){
            C.onerror.apply(window);return false
        }if(C.waitForWindowLoad&&!C._windowLoaded){
            if(window.addEventListener){
                window.addEventListener("load",C.initUserOnload,false)
            }else{
                if(window.attachEvent){
                    window.attachEvent("onload",C.initUserOnload)
                }
            }return false
        }else{
            if(C.waitForWindowLoad&&C._windowLoaded){}C.initUserOnload()
        }
    };this.initUserOnload=function(){
        try{
            C.onload.apply(window)
        }catch(G){
            setTimeout(function(){
                throw new Error(G)
            },20);return false
        }
    };this.init=function(){
        C._initMovie();if(C._didInit){
            return false
        }if(window.removeEventListener){
            window.removeEventListener("load",C.beginDelayedInit,false)
        }else{
            if(window.detachEvent){
                window.detachEvent("onload",C.beginDelayedInit)
            }
        }try{
            C.o._externalInterfaceTest(false);C.setPolling(true);if(!C.debugMode){
                C.o._disableDebug()
            }C.enabled=true
        }catch(G){
            C._failSafely();C.initComplete();return false
        }C.initComplete()
    };this.beginDelayedInit=function(){
        C._windowLoaded=true;setTimeout(C.waitForExternalInterface,500);setTimeout(C.beginInit,20)
    };this.beginInit=function(){
        if(C._initPending){
            return false
        }C.createMovie();C._initMovie();C._initPending=true;return true
    };this.domContentLoaded=function(){
        if(document.removeEventListener){
            document.removeEventListener("DOMContentLoaded",C.domContentLoaded,false)
        }C.go()
    };this._externalInterfaceOK=function(){
        if(C.swfLoaded){
            return false
        }C.swfLoaded=true;C._tryInitOnFocus=false;if(C.isIE){
            setTimeout(C.init,100)
        }else{
            C.init()
        }
    };this._setSandboxType=function(G){
        var H=C.sandbox;H.type=G;H.description=H.types[(typeof H.types[G]!="undefined"?G:"unknown")];if(H.type=="localWithFile"){
            H.noRemote=true;H.noLocal=false
        }else{
            if(H.type=="localWithNetwork"){
                H.noRemote=false;H.noLocal=true
            }else{
                if(H.type=="localTrusted"){
                    H.noRemote=false;H.noLocal=false
                }
            }
        }
    };this.destruct=function(){
        C.disable(true)
    };function E(I,H){
        var G=this;var J=I;this.sID=H.id;this.url=H.url;this.options=J._mergeObjects(H);this.instanceOptions=this.options;this._debug=function(){
            if(J.debugMode){
                var M=null;var O=[];var L=null;var N=null;var K=64;for(M in G.options){
                    if(G.options[M]!=null){
                        if(G.options[M] instanceof Function){
                            L=G.options[M].toString();L=L.replace(/\s\s+/g," ");N=L.indexOf("{");O[O.length]=" "+M+": {"+L.substr(N+1,(Math.min(Math.max(L.indexOf("\n")-1,K),K))).replace(/\n/g,"")+"... }"
                        }else{
                            O[O.length]=" "+M+": "+G.options[M]
                        }
                    }
                }
            }
        };this._debug();this.id3={};G.resetProperties=function(K){
            G.bytesLoaded=null;G.bytesTotal=null;G.position=null;G.duration=null;G.durationEstimate=null;G.loaded=false;G.loadSuccess=null;G.playState=0;G.paused=false;G.readyState=0;G.muted=false;G.didBeforeFinish=false;G.didJustBeforeFinish=false;G.instanceOptions={};G.instanceCount=0;G.peakData={
                left:0,
                right:0
            };G.waveformData=[];G.eqData=[]
        };G.resetProperties();this.load=function(K){
            G.instanceOptions=J._mergeObjects(K);if(typeof G.instanceOptions.url=="undefined"){
                G.instanceOptions.url=G.url
            }if(G.instanceOptions.url==G.url&&G.readyState!=0&&G.readyState!=2){
                return false
            }G.loaded=false;G.loadSuccess=null;G.readyState=1;G.playState=(K.autoPlay?1:0);try{
                if(J.flashVersion==8){
                    J.o._load(G.sID,G.instanceOptions.url,G.instanceOptions.stream,G.instanceOptions.autoPlay,(G.instanceOptions.whileloading?1:0))
                }else{
                    J.o._load(G.sID,G.instanceOptions.url,G.instanceOptions.stream?true:false,G.instanceOptions.autoPlay?true:false)
                }
            }catch(L){
                J.onerror();J.disable()
            }
        };this.unload=function(){
            if(G.readyState!=0){
                G.setPosition(0);J.o._unload(G.sID,J.nullURL);G.resetProperties()
            }
        };this.destruct=function(){
            J.o._destroySound(G.sID);J.destroySound(G.sID,true)
        };this.play=function(L){
            if(!L){
                L={}
            }G.instanceOptions=J._mergeObjects(L,G.instanceOptions);G.instanceOptions=J._mergeObjects(G.instanceOptions,G.options);if(G.playState==1){
                var K=G.instanceOptions.multiShot;if(!K){
                    return false
                }else{}
            }if(!G.loaded){
                if(G.readyState==0){
                    G.instanceOptions.stream=true;G.instanceOptions.autoPlay=true;G.load(G.instanceOptions)
                }else{
                    if(G.readyState==2){
                        return false
                    }else{}
                }
            }else{}if(G.paused){
                G.resume()
            }else{
                G.playState=1;if(!G.instanceCount||J.flashVersion==9){
                    G.instanceCount++
                }G.position=(typeof G.instanceOptions.position!="undefined"&&!isNaN(G.instanceOptions.position)?G.instanceOptions.position:0);if(G.instanceOptions.onplay){
                    G.instanceOptions.onplay.apply(G)
                }G.setVolume(G.instanceOptions.volume);G.setPan(G.instanceOptions.pan);J.o._start(G.sID,G.instanceOptions.loop||1,(J.flashVersion==9?G.position:G.position/1000))
            }
        };this.start=this.play;this.stop=function(K){
            if(G.playState==1){
                G.playState=0;G.paused=false;if(G.instanceOptions.onstop){
                    G.instanceOptions.onstop.apply(G)
                }J.o._stop(G.sID,K);G.instanceCount=0;G.instanceOptions={}
            }
        };this.setPosition=function(K){
            G.instanceOptions.position=K;J.o._setPosition(G.sID,(J.flashVersion==9?G.instanceOptions.position:G.instanceOptions.position/1000),(G.paused||!G.playState))
        };this.pause=function(){
            if(G.paused){
                return false
            }G.paused=true;J.o._pause(G.sID);if(G.instanceOptions.onpause){
                G.instanceOptions.onpause.apply(G)
            }
        };this.resume=function(){
            if(!G.paused){
                return false
            }G.paused=false;J.o._pause(G.sID);if(G.instanceOptions.onresume){
                G.instanceOptions.onresume.apply(G)
            }
        };this.togglePause=function(){
            if(!G.playState){
                G.play({
                    position:(J.flashVersion==9?G.position:G.position/1000)
                });return false
            }if(G.paused){
                G.resume()
            }else{
                G.pause()
            }
        };this.setPan=function(K){
            if(typeof K=="undefined"){
                K=0
            }J.o._setPan(G.sID,K);G.instanceOptions.pan=K
        };this.setVolume=function(K){
            if(typeof K=="undefined"){
                K=100
            }J.o._setVolume(G.sID,(J.muted&&!G.muted)||G.muted?0:K);G.instanceOptions.volume=K
        };this.mute=function(){
            G.muted=true;J.o._setVolume(G.sID,0)
        };this.unmute=function(){
            G.muted=false;J.o._setVolume(G.sID,typeof G.instanceOptions.volume!="undefined"?G.instanceOptions.volume:G.options.volume)
        };this._whileloading=function(K,L,M){
            G.bytesLoaded=K;G.bytesTotal=L;G.duration=Math.floor(M);G.durationEstimate=parseInt((G.bytesTotal/G.bytesLoaded)*G.duration);if(G.readyState!=3&&G.instanceOptions.whileloading){
                G.instanceOptions.whileloading.apply(G)
            }
        };this._onid3=function(N,K){
            var O=[];for(var M=0,L=N.length;M<L;M++){
                O[N[M]]=K[M]
            }G.id3=J._mergeObjects(G.id3,O);if(G.instanceOptions.onid3){
                G.instanceOptions.onid3.apply(G)
            }
        };this._whileplaying=function(L,M,K,N){
            if(isNaN(L)||L==null){
                return false
            }G.position=L;if(G.instanceOptions.usePeakData&&typeof M!="undefined"&&M){
                G.peakData={
                    left:M.leftPeak,
                    right:M.rightPeak
                }
            }if(G.instanceOptions.useWaveformData&&typeof K!="undefined"&&K){
                G.waveformData=K
            }if(G.instanceOptions.useEQData&&typeof N!="undefined"&&N){
                G.eqData=N
            }if(G.playState==1){
                if(G.instanceOptions.whileplaying){
                    G.instanceOptions.whileplaying.apply(G)
                }if(G.loaded&&G.instanceOptions.onbeforefinish&&G.instanceOptions.onbeforefinishtime&&!G.didBeforeFinish&&G.duration-G.position<=G.instanceOptions.onbeforefinishtime){
                    G._onbeforefinish()
                }
            }
        };this._onload=function(K){
            K=(K==1?true:false);if(!K){
                if(J.sandbox.noRemote==true){}if(J.sandbox.noLocal==true){}
            }G.loaded=K;G.loadSuccess=K;G.readyState=K?3:2;if(G.instanceOptions.onload){
                G.instanceOptions.onload.apply(G)
            }
        };this._onbeforefinish=function(){
            if(!G.didBeforeFinish){
                G.didBeforeFinish=true;if(G.instanceOptions.onbeforefinish){
                    G.instanceOptions.onbeforefinish.apply(G)
                }
            }
        };this._onjustbeforefinish=function(K){
            if(!G.didJustBeforeFinish){
                G.didJustBeforeFinish=true;if(G.instanceOptions.onjustbeforefinish){
                    G.instanceOptions.onjustbeforefinish.apply(G)
                }
            }
        };this._onfinish=function(){
            G.playState=0;G.paused=false;if(G.instanceOptions.onfinish){
                G.instanceOptions.onfinish.apply(G)
            }if(G.instanceOptions.onbeforefinishcomplete){
                G.instanceOptions.onbeforefinishcomplete.apply(G)
            }G.didBeforeFinish=false;G.didJustBeforeFinish=false;if(G.instanceCount){
                G.instanceCount--;if(!G.instanceCount){
                    G.instanceCount=0;G.instanceOptions={}
                }
            }
        }
    }if(this.flashVersion==9){
        this.defaultOptions=this._mergeObjects(this.defaultOptions,this.flash9Options)
    }if(window.addEventListener){
        window.addEventListener("focus",C.handleFocus,false);window.addEventListener("load",C.beginDelayedInit,false);window.addEventListener("beforeunload",C.destruct,false);if(C._tryInitOnFocus){
            window.addEventListener("mousemove",C.handleFocus,false)
        }
    }else{
        if(window.attachEvent){
            window.attachEvent("onfocus",C.handleFocus);window.attachEvent("onload",C.beginDelayedInit);window.attachEvent("beforeunload",C.destruct)
        }else{
            soundManager.onerror();soundManager.disable()
        }
    }if(document.addEventListener){
        document.addEventListener("DOMContentLoaded",C.domContentLoaded,false)
    }var F=["SoundManager 2: Javascript Sound for the Web","http://schillmania.com/projects/soundmanager2/","Copyright (c) 2008, Scott Schiller. All rights reserved.","Code provided under the BSD License: http://schillmania.com/projects/soundmanager2/license.txt",]
}var soundManager=new SoundManager();soundManager.debugMode=false;soundManager.flashVersion=9;soundManager.url="js/";soundManager.onload=function(){
    soundManager.createSound("msg","js/msg.mp3")
};if(typeof deconcept=="undefined"){
    var deconcept=new Object()
}if(typeof deconcept.util=="undefined"){
    deconcept.util=new Object()
}if(typeof deconcept.SWFObjectUtil=="undefined"){
    deconcept.SWFObjectUtil=new Object()
}deconcept.SWFObject=function(K,B,L,D,H,I,F,E,C,J){
    if(!document.getElementById){
        return
    }this.DETECT_KEY=J?J:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(K){
        this.setAttribute("swf",K)
    }if(B){
        this.setAttribute("id",B)
    }if(L){
        this.setAttribute("width",L)
    }if(D){
        this.setAttribute("height",D)
    }if(H){
        this.setAttribute("version",new deconcept.PlayerVersion(H.toString().split(".")))
    }this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){
        deconcept.SWFObject.doPrepUnload=true
    }if(I){
        this.addParam("bgcolor",I)
    }var A=F?F:"high";this.addParam("quality",A);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var G=(E)?E:window.location;this.setAttribute("xiRedirectUrl",G);this.setAttribute("redirectUrl","");if(C){
        this.setAttribute("redirectUrl",C)
    }
};deconcept.SWFObject.prototype={
    useExpressInstall:function(A){
        this.xiSWFPath=!A?"expressinstall.swf":A;this.setAttribute("useExpressInstall",true)
    },
    setAttribute:function(A,B){
        this.attributes[A]=B
    },
    getAttribute:function(A){
        return this.attributes[A]
    },
    addParam:function(B,A){
        this.params[B]=A
    },
    getParams:function(){
        return this.params
    },
    addVariable:function(B,A){
        this.variables[B]=A
    },
    getVariable:function(A){
        return this.variables[A]
    },
    getVariables:function(){
        return this.variables
    },
    getVariablePairs:function(){
        var C=new Array();var B;var A=this.getVariables();for(B in A){
            C[C.length]=B+"="+A[B]
        }return C
    },
    getSWFHTML:function(){
        var B="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){
            if(this.getAttribute("doExpressInstall")){
                this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath)
            }B='<embed type="application/x-shockwave-flash" src="'+this.getAttribute("swf")+'" width="'+this.getAttribute("width")+'" height="'+this.getAttribute("height")+'" style="'+this.getAttribute("style")+'"';B+=' id="'+this.getAttribute("id")+'" name="'+this.getAttribute("id")+'" ';var F=this.getParams();for(var E in F){
                B+=[E]+'="'+F[E]+'" '
            }var D=this.getVariablePairs().join("&");if(D.length>0){
                B+='flashvars="'+D+'"'
            }B+="/>"
        }else{
            if(this.getAttribute("doExpressInstall")){
                this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath)
            }B='<object id="'+this.getAttribute("id")+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+this.getAttribute("width")+'" height="'+this.getAttribute("height")+'" style="'+this.getAttribute("style")+'">';B+='<param name="movie" value="'+this.getAttribute("swf")+'" />';var C=this.getParams();for(var E in C){
                B+='<param name="'+E+'" value="'+C[E]+'" />'
            }var A=this.getVariablePairs().join("&");if(A.length>0){
                B+='<param name="flashvars" value="'+A+'" />'
            }B+="</object>"
        }return B
    },
    write:function(B){
        if(this.getAttribute("useExpressInstall")){
            var A=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(A)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){
                this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",encodeURIComponent(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title)
            }
        }if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){
            var C=(typeof B=="string")?document.getElementById(B):B;C.innerHTML=this.getSWFHTML();if(!(navigator.plugins&&navigator.mimeTypes.length)){
                window[this.getAttribute("id")]=document.getElementById(this.getAttribute("id"))
            }return true
        }else{
            if(this.getAttribute("redirectUrl")!=""){
                document.location.replace(this.getAttribute("redirectUrl"))
            }
        }return false
    }
};deconcept.SWFObjectUtil.getPlayerVersion=function(){
    var E=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){
        var A=navigator.plugins["Shockwave Flash"];if(A&&A.description){
            E=new deconcept.PlayerVersion(A.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."))
        }
    }else{
        if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){
            var B=1;var C=3;while(B){
                try{
                    C++;B=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+C);E=new deconcept.PlayerVersion([C,0,0])
                }catch(D){
                    B=null
                }
            }
        }else{
            try{
                var B=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")
            }catch(D){
                try{
                    var B=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");E=new deconcept.PlayerVersion([6,0,21]);B.AllowScriptAccess="always"
                }catch(D){
                    if(E.major==6){
                        return E
                    }
                }try{
                    B=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
                }catch(D){}
            }if(B!=null){
                E=new deconcept.PlayerVersion(B.GetVariable("$version").split(" ")[1].split(","))
            }
        }
    }return E
};deconcept.PlayerVersion=function(A){
    this.major=A[0]!=null?parseInt(A[0]):0;this.minor=A[1]!=null?parseInt(A[1]):0;this.rev=A[2]!=null?parseInt(A[2]):0
};deconcept.PlayerVersion.prototype.versionIsValid=function(A){
    if(this.major<A.major){
        return false
    }if(this.major>A.major){
        return true
    }if(this.minor<A.minor){
        return false
    }if(this.minor>A.minor){
        return true
    }if(this.rev<A.rev){
        return false
    }return true
};deconcept.util={
    getRequestParameter:function(C){
        var D=document.location.search||document.location.hash;if(C==null){
            return D
        }if(D){
            var B=D.substring(1).split("&");for(var A=0;A<B.length;A++){
                if(B[A].substring(0,B[A].indexOf("="))==C){
                    return B[A].substring((B[A].indexOf("=")+1))
                }
            }
        }return""
    }
};deconcept.SWFObjectUtil.cleanupSWFs=function(){
    var B=document.getElementsByTagName("OBJECT");for(var C=B.length-1;C>=0;C--){
        B[C].style.display="none";for(var A in B[C]){
            if(typeof B[C][A]=="function"){
                B[C][A]=function(){}
            }
        }
    }
};if(deconcept.SWFObject.doPrepUnload){
    if(!deconcept.unloadSet){
        deconcept.SWFObjectUtil.prepUnload=function(){
            __flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs)
        };window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true
    }
}if(!document.getElementById&&document.all){
    document.getElementById=function(A){
        return document.all[A]
    }
}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;Ext.UpdateManager.defaults.indicatorText='<div class="loading-indicator">加载中...</div>';if(Ext.View){
    Ext.View.prototype.emptyText=""
}if(Ext.grid.GridPanel){
    Ext.grid.GridPanel.prototype.ddText="{0} 选择行"
}if(Ext.TabPanelItem){
    Ext.TabPanelItem.prototype.closeText="关闭"
}if(Ext.form.Field){
    Ext.form.Field.prototype.invalidText="输入值非法"
}Date.monthNames=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];Date.dayNames=["日","一","二","三","四","五","六"];if(Ext.MessageBox){
    Ext.MessageBox.buttonText={
        ok:"确定",
        cancel:"取消",
        yes:"是",
        no:"否"
    }
}if(Ext.util.Format){
    Ext.util.Format.date=function(A,B){
        if(!A){
            return""
        }if(!(A instanceof Date)){
            A=new Date(Date.parse(A))
        }return A.dateFormat(B||"Y-m-d")
    }
}if(Ext.DatePicker){
    Ext.apply(Ext.DatePicker.prototype,{
        todayText:"今天",
        minText:"日期在最小日期之前",
        maxText:"日期在最大日期之后",
        disabledDaysText:"",
        disabledDatesText:"",
        monthNames:Date.monthNames,
        dayNames:Date.dayNames,
        nextText:"下月 (Control+Right)",
        prevText:"上月 (Control+Left)",
        monthYearText:"选择一个月 (Control+Up/Down 来改变年)",
        todayTip:"{0} (空格键选择)",
        format:"Y-m-d",
        okText:"确定",
        cancelText:"取消"
    })
}if(Ext.PagingToolbar){
    Ext.apply(Ext.PagingToolbar.prototype,{
        beforePageText:"第",
        afterPageText:"页/共 {0} 页",
        firstText:"第一页",
        prevText:"前一页",
        nextText:"下一页",
        lastText:"最后页",
        refreshText:"刷新",
        displayMsg:"显示 {0} - {1}，共 {2} 条",
        emptyMsg:"没有数据需要显示"
    })
}if(Ext.form.TextField){
    Ext.apply(Ext.form.TextField.prototype,{
        minLengthText:"该输入项的最小长度是 {0}",
        maxLengthText:"该输入项的最大长度是 {0}",
        blankText:"该输入项为必输项",
        regexText:"",
        emptyText:null
    })
}if(Ext.form.NumberField){
    Ext.apply(Ext.form.NumberField.prototype,{
        minText:"该输入项的最小值是 {0}",
        maxText:"该输入项的最大值是 {0}",
        nanText:"{0} 不是有效数值"
    })
}if(Ext.form.DateField){
    Ext.apply(Ext.form.DateField.prototype,{
        disabledDaysText:"禁用",
        disabledDatesText:"禁用",
        minText:"该输入项的日期必须在 {0} 之后",
        maxText:"该输入项的日期必须在 {0} 之前",
        invalidText:"{0} 是无效的日期 - 必须符合格式： {1}",
        format:"Y-m-d"
    })
}if(Ext.form.ComboBox){
    Ext.apply(Ext.form.ComboBox.prototype,{
        loadingText:"加载...",
        valueNotFoundText:undefined
    })
}if(Ext.form.VTypes){
    Ext.apply(Ext.form.VTypes,{
        emailText:'该输入项必须是电子邮件地址，格式如： "user@domain.com"',
        urlText:'该输入项必须是URL地址，格式如： "http://www.domain.com"',
        alphaText:"该输入项只能包含字符和_",
        alphanumText:"该输入项只能包含字符,数字和_"
    })
}if(Ext.grid.GridView){
    Ext.apply(Ext.grid.GridView.prototype,{
        sortAscText:"正序",
        sortDescText:"逆序",
        lockText:"锁列",
        unlockText:"解锁列",
        columnsText:"列"
    })
}if(Ext.grid.PropertyColumnModel){
    Ext.apply(Ext.grid.PropertyColumnModel.prototype,{
        nameText:"名称",
        valueText:"值",
        dateFormat:"Y-m-d"
    })
}if(Ext.layout.BorderLayout&&Ext.layout.BorderLayout.SplitRegion){
    Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype,{
        splitTip:"拖动来改变尺寸.",
        collapsibleSplitTip:"拖动来改变尺寸. 双击隐藏."
    })
};Ext.ns("Ext.ux");Ext.ux.Lightbox=(function(){
    var C={},A=[],D,E=false,B=[];return{
        overlayOpacity:0.85,
        animate:true,
        resizeSpeed:8,
        borderSize:10,
        labelImage:"Image",
        labelOf:"of",
        init:function(){
            this.resizeDuration=this.animate?((11-this.resizeSpeed)*0.15):0;this.overlayDuration=this.animate?0.2:0;if(!E){
                Ext.apply(this,Ext.util.Observable.prototype);Ext.util.Observable.constructor.call(this);this.addEvents("open","close");this.initMarkup();this.initEvents();E=true
            }
        },
        initMarkup:function(){
            C.shim=Ext.DomHelper.append(document.body,{
                tag:"iframe",
                id:"ux-lightbox-shim"
            },true);C.overlay=Ext.DomHelper.append(document.body,{
                id:"ux-lightbox-overlay"
            },true);var G=new Ext.Template(this.getTemplate());C.lightbox=G.append(document.body,{},true);var H="outerImageContainer imageContainer image hoverNav navPrev navNext loading loadingLink outerDataContainer dataContainer data details caption imageNumber bottomNav navClose";Ext.each(H.split(" "),function(I){
                C[I]=Ext.get("ux-lightbox-"+I)
            });C.overlay.visibilityMode=C.lightbox.visibilityMode=C.shim.visibilityMode=Ext.Element.DISPLAY;C.overlay.hide();C.shim.hide();C.lightbox.hide();var F=(this.animate?250:1)+"px";C.outerImageContainer.setStyle({
                width:F,
                height:F
            })
        },
        getTemplate:function(){
            return['<div id="ux-lightbox">','<div id="ux-lightbox-outerImageContainer">','<div id="ux-lightbox-imageContainer">','<img id="ux-lightbox-image">','<div id="ux-lightbox-hoverNav">','<a href="#" id="ux-lightbox-navPrev"></a>','<a href="#" id="ux-lightbox-navNext"></a>',"</div>",'<div id="ux-lightbox-loading">','<a id="ux-lightbox-loadingLink"></a>',"</div>","</div>","</div>",'<div id="ux-lightbox-outerDataContainer">','<div id="ux-lightbox-dataContainer">','<div id="ux-lightbox-data">','<div id="ux-lightbox-details">','<span id="ux-lightbox-caption"></span>','<span id="ux-lightbox-imageNumber"></span>',"</div>",'<div id="ux-lightbox-bottomNav">','<a href="#" id="ux-lightbox-navClose"></a>',"</div>","</div>","</div>","</div>","</div>"]
        },
        initEvents:function(){
            var F=function(G){
                G.preventDefault();this.close()
            };C.overlay.on("click",F,this);C.loadingLink.on("click",F,this);C.navClose.on("click",F,this);C.lightbox.on("click",function(G){
                if(G.getTarget().id=="ux-lightbox"){
                    this.close()
                }
            },this);C.navPrev.on("click",function(G){
                G.preventDefault();this.setImage(D-1)
            },this);C.navNext.on("click",function(G){
                G.preventDefault();this.setImage(D+1)
            },this)
        },
        register:function(F,G){
            if(B.indexOf(F)===-1){
                B.push(F);Ext.fly(document).on("click",function(H){
                    var I=H.getTarget(F);if(I){
                        H.preventDefault();this.open(I,F,G)
                    }
                },this)
            }
        },
        open:function(H,F,G){
            G=G||false;var I=this.getViewSize();C.overlay.setStyle({
                width:I[0]+"px",
                height:I[1]+"px"
            });C.shim.setStyle({
                width:I[0]+"px",
                height:I[1]+"px"
            }).show();C.overlay.fadeIn({
                duration:this.overlayDuration,
                endOpacity:this.overlayOpacity,
                callback:function(){
                    A=[];var J=0;if(!G){
                        A.push([H.href,H.title])
                    }else{
                        var K=Ext.query(F);Ext.each(K,function(O){
                            if(O.href){
                                A.push([O.href,O.title])
                            }
                        });while(A[J][0]!=H.href){
                            J++
                        }
                    }var M=Ext.fly(document).getScroll();var N=M.top+(Ext.lib.Dom.getViewportHeight()/10);var L=M.left;C.lightbox.setStyle({
                        top:N+"px",
                        left:L+"px"
                    }).show();this.setImage(J);this.fireEvent("open",A[J])
                },
                scope:this
            })
        },
        setImage:function(G){
            D=G;this.disableKeyNav();if(this.animate){
                C.loading.show()
            }C.image.hide();C.hoverNav.hide();C.navPrev.hide();C.navNext.hide();C.dataContainer.setOpacity(0.0001);C.imageNumber.hide();var F=new Image();F.onload=(function(){
                C.image.dom.src=A[D][0];this.resizeImage(F.width,F.height)
            }).createDelegate(this);F.src=A[D][0]
        },
        resizeImage:function(N,H){
            var O=C.outerImageContainer.getWidth();var L=C.outerImageContainer.getHeight();var J=(N+this.borderSize*2);var I=(H+this.borderSize*2);var M=O-J;var F=L-I;var G=0;if(F!=0||M!=0){
                C.outerImageContainer.syncFx().shift({
                    height:I,
                    duration:this.resizeDuration
                }).shift({
                    width:J,
                    duration:this.resizeDuration
                });G++
            }var K=0;if((F==0)&&(M==0)){
                K=(Ext.isIE)?250:100
            }(function(){
                C.hoverNav.setWidth(C.imageContainer.getWidth()+"px");C.navPrev.setHeight(H+"px");C.navNext.setHeight(H+"px");C.outerDataContainer.setWidth(J+"px");this.showImage()
            }).createDelegate(this).defer((this.resizeDuration*1000)+K)
        },
        showImage:function(){
            C.loading.hide();C.image.fadeIn({
                duration:this.resizeDuration,
                scope:this,
                callback:function(){
                    this.updateDetails()
                }
            });this.preloadImages()
        },
        updateDetails:function(){
            C.details.setWidth((C.data.getWidth(true)-C.navClose.getWidth()-10)+"px");C.caption.update(A[D][1]);C.caption.show();if(A.length>1){
                C.imageNumber.update(this.labelImage+" "+(D+1)+" "+this.labelOf+"  "+A.length);C.imageNumber.show()
            }C.dataContainer.syncFx().slideIn("t",{
                duration:this.resizeDuration/2
            }).fadeIn({
                duration:this.resizeDuration/2,
                scope:this,
                callback:function(){
                    var F=this.getViewSize();C.overlay.setHeight(F[1]+"px");this.updateNav()
                }
            })
        },
        updateNav:function(){
            this.enableKeyNav();C.hoverNav.show();if(D>0){
                C.navPrev.show()
            }if(D<(A.length-1)){
                C.navNext.show()
            }
        },
        enableKeyNav:function(){
            Ext.fly(document).on("keydown",this.keyNavAction,this)
        },
        disableKeyNav:function(){
            Ext.fly(document).un("keydown",this.keyNavAction,this)
        },
        keyNavAction:function(F){
            var G=F.getKey();if(G==88||G==67||G==27){
                this.close()
            }else{
                if(G==80||G==37){
                    if(D!=0){
                        this.setImage(D-1)
                    }
                }else{
                    if(G==78||G==39){
                        if(D!=(A.length-1)){
                            this.setImage(D+1)
                        }
                    }
                }
            }
        },
        preloadImages:function(){
            var F,G;if(A.length>D+1){
                F=new Image();F.src=A[D+1][0]
            }if(D>0){
                G=new Image();G.src=A[D-1][0]
            }
        },
        close:function(){
            this.disableKeyNav();C.lightbox.hide();C.overlay.fadeOut({
                duration:this.overlayDuration
            });C.shim.hide();this.fireEvent("close",D)
        },
        getViewSize:function(){
            return[Ext.lib.Dom.getViewWidth(true),Ext.lib.Dom.getViewHeight(true)]
        }
    }
})();Ext.onReady(Ext.ux.Lightbox.init,Ext.ux.Lightbox);Ext.BLANK_IMAGE_URL="js/ext-2.2/resources/images/default/s.gif";Ext.SSL_SECURE_URL="js/ext-2.2/resources/images/default/s.gif";Ext.Ajax.timeout=120000;Ext.QuickTips.init();var createAboutAuthorWindow=function(){
    var B=Ext.getCmp("about-author-win");if(!B){
        var A=new Ext.Panel({
            baseCls:"x-plain",
            bodyStyle:"background:url(../images/sliver.png) no-repeat center center;",
            height:120,
            region:"center"
        });southPanel=new Ext.Panel({
            baseCls:"x-plain",
            height:100,
            bodyStyle:"font-size:12px;font-weight:bold;color:appworkspace;padding-left:150px;padding-top:5px;",
            html:'网站 ： <a href="http://www.slivercrm.cn" target="_blank">www.slivercrm.cn</a><br/>讨论 ： <a href="http://www.slivercrm.cn/forum/" target="_blank">www.slivercrm.cn/forum</a><br/>博客 ： <a href="http://www.slivercrm.cn/log/" target="_blank">www.slivercrm.cn/log</a><br/>',
            region:"south"
        });B=new Ext.Window({
            title:"联系我们",
            minHeight:300,
            minWidth:530,
            width:530,
            height:300,
            closable:true,
            draggable:true,
            iconCls:"icon-contact",
            id:"about-author-win",
            layout:"border",
            plain:false,
            resizable:false,
            items:[A,southPanel],
            buttonAlign:"right",
            buttons:[{
                text:"关闭",
                handler:function(){
                    B.close()
                }
            }]
        });B.show()
    }
};Ext.grid.taskIcon=function(A){
    Ext.apply(this,A)
};Ext.grid.taskIcon.prototype={
    header:"",
    width:30,
    sortable:false,
    fixed:true,
    menuDisabled:true,
    dataIndex:"taskPercent",
    id:"taskPercent",
    renderer:function(B,C,A,D){
        if(B>=100){
            return'<div class="x-btn-text task-complete" style="width:16px;height:16px;border:none;"></div>'
        }else{
            return'<div class="x-btn-text task-incomplete" style="width:16px;height:16px;border:none;"></div>'
        }
    }
};Ext.grid.Timer=function(A){
    Ext.apply(this,A)
};Ext.grid.Timer.prototype={
    header:"",
    width:60,
    sortable:false,
    fixed:true,
    menuDisabled:true,
    dataIndex:"time",
    id:"time",
    css:"background-color:#EFF0F2;text-align:right;height:30px;",
    renderer:function(B,C,A,D){
        if(A.data.sn===new Date().getHours()){
            return'<div style="font-weight:bold;color:#FF0000;">'+B+"</div>"
        }else{
            return B
        }
    }
};Ext.ux.SliderTip=Ext.extend(Ext.Tip,{
    minWidth:10,
    offsets:[0,-10],
    init:function(A){
        A.on("dragstart",this.onSlide,this);A.on("drag",this.onSlide,this);A.on("dragend",this.hide,this);A.on("destroy",this.destroy,this)
    },
    onSlide:function(A){
        this.show();this.body.update(this.getText(A));this.doAutoWidth();this.el.alignTo(A.thumb,"b-t?",this.offsets)
    },
    getText:function(A){
        return A.getValue()
    }
});Ext.namespace("Ext.ux.Andrie");Ext.ux.Andrie.pPageSize=function(A){
    Ext.apply(this,A)
};Ext.extend(Ext.ux.Andrie.pPageSize,Ext.util.Observable,{
    beforeText:"行/页:",
    afterText:"",
    addBefore:"-",
    addAfter:null,
    dynamic:false,
    variations:[5,10,20,30,50,100,200,500],
    comboCfg:undefined,
    init:function(A){
        this.pagingToolbar=A;this.pagingToolbar.pageSizeCombo=this;this.pagingToolbar.setPageSize=this.setPageSize.createDelegate(this);this.pagingToolbar.getPageSize=this.getPageSize.createDelegate(this);this.pagingToolbar.on("render",this.onRender,this)
    },
    addSize:function(A){
        if(A>0){
            this.sizes.push([A])
        }
    },
    updateStore:function(){
        if(this.dynamic){
            var B=this.pagingToolbar.pageSize,E;B=(B>0)?B:1;this.sizes=[];var C=this.variations;for(var D=0,A=C.length;D<A;D++){
                this.addSize(B-C[C.length-1-D])
            }this.addToStore(B);for(var D=0,A=C.length;D<A;D++){
                this.addSize(B+C[D])
            }
        }else{
            if(!this.staticSizes){
                this.sizes=[];var C=this.variations;var B=0;for(var D=0,A=C.length;D<A;D++){
                    this.addSize(B+C[D])
                }this.staticSizes=this.sizes.slice(0)
            }else{
                this.sizes=this.staticSizes.slice(0)
            }
        }this.combo.store.loadData(this.sizes);this.combo.collapse();this.combo.setValue(this.pagingToolbar.pageSize)
    },
    getPageSize:function(){
        return this.pagingToolbar.pageSize
    },
    setPageSize:function(E,H){
        var I=this.pagingToolbar;this.combo.collapse();E=parseInt(E)||parseInt(this.combo.getValue());E=(E>0)?E:1;if(E==I.pageSize){
            return
        }else{
            if(E<I.pageSize){
                I.pageSize=E;var A=Math.round(I.cursor/E)+1;var G=(A-1)*E;var F=I.store;if(G>F.getTotalCount()){
                    this.pagingToolbar.pageSize=E;this.pagingToolbar.doLoad(G-E)
                }else{
                    F.suspendEvents();for(var B=0,C=G-I.cursor;B<C;B++){
                        F.remove(F.getAt(0))
                    }while(F.getCount()>E){
                        F.remove(F.getAt(F.getCount()-1))
                    }F.resumeEvents();F.fireEvent("datachanged",F);I.cursor=G;var D=I.getPageData();I.afterTextEl.el.innerHTML=String.format(I.afterPageText,D.pages);I.field.dom.value=A;I.first.setDisabled(A==1);I.prev.setDisabled(A==1);I.next.setDisabled(A==D.pages);I.last.setDisabled(A==D.pages);I.updateInfo()
                }
            }else{
                this.pagingToolbar.pageSize=E;this.pagingToolbar.doLoad(Math.floor(this.pagingToolbar.cursor/this.pagingToolbar.pageSize)*this.pagingToolbar.pageSize)
            }
        }this.updateStore()
    },
    onRender:function(){
        this.combo=Ext.ComponentMgr.create(Ext.applyIf(this.comboCfg||{},{
            store:new Ext.data.SimpleStore({
                fields:["pageSize"],
                data:[]
            }),
            displayField:"pageSize",
            valueField:"pageSize",
            mode:"local",
            triggerAction:"all",
            width:50,
            xtype:"combo"
        }));this.combo.on("select",this.setPageSize,this);this.updateStore();if(this.addBefore){
            this.pagingToolbar.add(this.addBefore)
        }if(this.beforeText){
            this.pagingToolbar.add(this.beforeText)
        }this.pagingToolbar.add(this.combo);if(this.afterText){
            this.pagingToolbar.add(this.afterText)
        }if(this.addAfter){
            this.pagingToolbar.add(this.addAfter)
        }
    }
});Ext.grid.RowExpander=function(A){
    Ext.apply(this,A);this.addEvents({
        beforeexpand:true,
        expand:true,
        beforecollapse:true,
        collapse:true
    });Ext.grid.RowExpander.superclass.constructor.call(this);if(this.tpl){
        if(typeof this.tpl=="string"){
            this.tpl=new Ext.Template(this.tpl)
        }this.tpl.compile()
    }this.state={};this.bodyContent={}
};Ext.extend(Ext.grid.RowExpander,Ext.util.Observable,{
    header:"",
    width:20,
    sortable:false,
    fixed:true,
    menuDisabled:true,
    dataIndex:"",
    id:"expander",
    lazyRender:true,
    enableCaching:true,
    getRowClass:function(A,E,D,C){
        D.cols=D.cols-1;var B=this.bodyContent[A.id];if(!B&&!this.lazyRender){
            B=this.getBodyContent(A,E)
        }if(B){
            D.body=B
        }return this.state[A.id]?"x-grid3-row-expanded":"x-grid3-row-collapsed"
    },
    init:function(B){
        this.grid=B;var A=B.getView();A.getRowClass=this.getRowClass.createDelegate(this);A.enableRowBody=true;B.on("render",function(){
            A.mainBody.on("mousedown",this.onMouseDown,this)
        },this)
    },
    getBodyContent:function(A,B){
        if(!this.enableCaching){
            return this.tpl.apply(A.data)
        }var C=this.bodyContent[A.id];if(!C){
            C=this.tpl.apply(A.data);this.bodyContent[A.id]=C
        }return C
    },
    onMouseDown:function(B,A){
        if(A.className=="x-grid3-row-expander"){
            B.stopEvent();var C=B.getTarget(".x-grid3-row");this.toggleRow(C)
        }
    },
    renderer:function(B,C,A){
        C.cellAttr='rowspan="2"';return'<div class="x-grid3-row-expander">&#160;</div>'
    },
    beforeExpand:function(B,A,C){
        if(this.fireEvent("beforeexpand",this,B,A,C)!==false){
            if(this.tpl&&this.lazyRender){
                A.innerHTML=this.getBodyContent(B,C)
            }return true
        }else{
            return false
        }
    },
    toggleRow:function(A){
        if(typeof A=="number"){
            A=this.grid.view.getRow(A)
        }this[Ext.fly(A).hasClass("x-grid3-row-collapsed")?"expandRow":"collapseRow"](A)
    },
    expandRow:function(C){
        if(typeof C=="number"){
            C=this.grid.view.getRow(C)
        }var B=this.grid.store.getAt(C.rowIndex);var A=Ext.DomQuery.selectNode("tr:nth(2) div.x-grid3-row-body",C);if(this.beforeExpand(B,A,C.rowIndex)){
            this.state[B.id]=true;Ext.fly(C).replaceClass("x-grid3-row-collapsed","x-grid3-row-expanded");this.fireEvent("expand",this,B,A,C.rowIndex)
        }
    },
    collapseRow:function(C){
        if(typeof C=="number"){
            C=this.grid.view.getRow(C)
        }var B=this.grid.store.getAt(C.rowIndex);var A=Ext.fly(C).child("tr:nth(1) div.x-grid3-row-body",true);if(this.fireEvent("beforcollapse",this,B,A,C.rowIndex)!==false){
            this.state[B.id]=false;Ext.fly(C).replaceClass("x-grid3-row-expanded","x-grid3-row-collapsed");this.fireEvent("collapse",this,B,A,C.rowIndex)
        }
    }
});Ext.override(Ext.Window,{
    show:function(C,A,B){
        if(!this.rendered){
            this.render(Ext.getBody())
        }if(this.hidden===false){
            this.toFront();return
        }if(this.fireEvent("beforeshow",this)===false){
            return
        }if(A){
            this.on("show",A,B,{
                single:true
            })
        }this.hidden=false;if(C!==undefined){
            this.setAnimateTarget(C)
        }this.beforeShow();if(this.animateTarget){
            this.animShow()
        }else{
            this.afterShow()
        }this.toFront()
    }
});Ext.override(Ext.tree.AsyncTreeNode,{
    expandChildNodes:function(B){
        var D=this.childNodes;for(var C=0,A=D.length;C<A;C++){
            if(!D[C].isLeaf()){
                D[C].expand(B)
            }
        }
    },
    expand:function(B,D,F){
        if(this.loading){
            var E;var C=function(){
                if(!this.loading){
                    clearInterval(E);this.expand(B,D,F)
                }
            }.createDelegate(this);E=setInterval(C,200);return
        }if(!this.loaded){
            if(this.fireEvent("beforeload",this)===false){
                return
            }this.loading=true;this.ui.beforeLoad(this);var A=this.loader||this.attributes.loader||this.getOwnerTree().getLoader();if(A){
                A.load(this,this.loadComplete.createDelegate(this,[B,D,F]));return
            }
        }if(!this.expanded){
            if(this.fireEvent("beforeexpand",this,B,D)===false){
                return
            }if(!this.childrenRendered){
                this.renderChildren()
            }this.expanded=true;if(!this.isHiddenRoot()&&(this.getOwnerTree().animate&&D!==false)||D){
                this.ui.animExpand(function(){
                    this.fireEvent("expand",this);if(typeof F=="function"){
                        F(this)
                    }if(B===true){
                        this.expandChildNodes(true)
                    }
                }.createDelegate(this));return
            }else{
                this.ui.expand();this.fireEvent("expand",this);if(typeof F=="function"){
                    F(this)
                }
            }
        }else{
            if(typeof F=="function"){
                F(this)
            }
        }if(B===true){
            this.expandChildNodes(true)
        }
    }
});Ext.tree.SliverTreeLoader=function(A){
    Ext.tree.SliverTreeLoader.superclass.constructor.apply(this,arguments)
};Ext.extend(Ext.tree.SliverTreeLoader,Ext.tree.TreeLoader,{
    createNode:function(attr){
        if(this.applyLoader!==false){
            attr.loader=this
        }if(typeof attr.uiProvider=="string"){
            attr.uiProvider=this.uiProviders[attr.uiProvider]||eval(attr.uiProvider)
        }return(new Ext.tree.AsyncTreeNode(attr))
    },
    getParams:function(D){
        var A=[],C=this.baseParams;for(var B in C){
            if(typeof C[B]!="function"){
                A.push(encodeURIComponent(B),"=",encodeURIComponent(C[B]),"&")
            }
        }A.push(encodeURIComponent("node"),"=",encodeURIComponent(D.id.substring(D.id.lastIndexOf("-")+1)),"&");return A.join("")
    }
});Ext.tree.contactNode=function(A){
    Ext.tree.contactNode.superclass.constructor.apply(this,arguments);this.customer=A.customer;this.userID=A.userID
};Ext.extend(Ext.tree.contactNode,Ext.tree.AsyncTreeNode,{
    isCustomer:function(){
        if(this.isLeaf()===true){
            return false
        }return this.customer
    },
    getUserID:function(){
        if(this.userID){
            return this.userID
        }
    }
});Ext.tree.ContactTreeLoader=function(A){
    Ext.tree.ContactTreeLoader.superclass.constructor.apply(this,arguments)
};Ext.extend(Ext.tree.ContactTreeLoader,Ext.tree.SliverTreeLoader,{
    createNode:function(attr){
        if(this.applyLoader!==false){
            attr.loader=this
        }if(typeof attr.uiProvider=="string"){
            attr.uiProvider=this.uiProviders[attr.uiProvider]||eval(attr.uiProvider)
        }return(new Ext.tree.contactNode(attr))
    },
    getParams:function(D){
        var A=[],C=this.baseParams;for(var B in C){
            if(typeof C[B]!="function"){
                A.push(encodeURIComponent(B),"=",encodeURIComponent(C[B]),"&")
            }
        }A.push(encodeURIComponent("node"),"=",encodeURIComponent(D.id.substring(D.id.lastIndexOf("-")+1)),"&");if(D.userID){
            A.push(encodeURIComponent("userID"),"=",encodeURIComponent(D.userID,"&"))
        }return A.join("")
    }
});Ext.ux.TabCloseMenu=function(){
    var A,C,B;this.init=function(E){
        A=E;A.on("contextmenu",D)
    };function D(G,F,H){
        if(!C){
            C=new Ext.menu.Menu([{
                id:A.id+"-close",
                text:"关闭标签",
                handler:function(){
                    A.remove(B)
                }
            },{
                id:A.id+"-close-others",
                text:"关闭其他标签",
                handler:function(){
                    A.items.each(function(J){
                        if(J.closable&&J!=B){
                            A.remove(J)
                        }
                    })
                }
            }])
        }B=F;var E=C.items;E.get(A.id+"-close").setDisabled(!F.closable);var I=true;A.items.each(function(){
            if(this!=F&&this.closable){
                I=false;return false
            }
        });E.get(A.id+"-close-others").setDisabled(I);C.showAt(H.getPoint())
    }
};Ext.override(Ext.TabPanel,{
    onStripDblClick:function(B){
        var A=this.findTargets(B);if((A.item)&&(A.item.closable===true)){
            this.remove(A.item);return
        }
    },
    initEvents:function(){
        Ext.TabPanel.superclass.initEvents.call(this);this.on("add",this.onAdd,this);this.on("remove",this.onRemove,this);this.strip.on("dblclick",this.onStripDblClick,this);this.strip.on("mousedown",this.onStripMouseDown,this);this.strip.on("click",this.onStripClick,this);this.strip.on("contextmenu",this.onStripContextMenu,this);if(this.enableTabScroll){
            this.strip.on("mousewheel",this.onWheel,this)
        }
    }
});Ext.ns("Ext.ux.layout");Ext.ux.layout.CenterLayout=Ext.extend(Ext.layout.FitLayout,{
    setItemSize:function(B,A){
        this.container.addClass("ux-layout-center");B.addClass("ux-layout-center-item");if(B&&A.height>0){
            if(B.width){
                A.width=B.width
            }B.setSize(A)
        }
    }
});Ext.Container.LAYOUTS["ux.center"]=Ext.ux.layout.CenterLayout;Ext.ux.layout.RowLayout=Ext.extend(Ext.layout.ContainerLayout,{
    monitorResize:true,
    isValidParent:function(B,A){
        return B.getEl().dom.parentNode==this.innerCt.dom
    },
    onLayout:function(F,H){
        var B=F.items.items,G=B.length,A,C;if(!this.innerCt){
            H.addClass("ux-row-layout-ct");this.innerCt=H.createChild({
                cls:"x-row-inner"
            })
        }this.renderAll(F,this.innerCt);var I=H.getViewSize();if(I.width<1&&I.height<1){
            return
        }var D=I.height-H.getPadding("tb"),E=D;this.innerCt.setSize({
            height:D
        });for(C=0;C<G;C++){
            A=B[C];if(!A.rowHeight){
                E-=(A.getSize().height+A.getEl().getMargins("tb"))
            }
        }E=E<0?0:E;for(C=0;C<G;C++){
            A=B[C];if(A.rowHeight){
                A.setSize({
                    height:Math.floor(A.rowHeight*E)-A.getEl().getMargins("tb")
                })
            }
        }
    }
});Ext.Container.LAYOUTS["ux.row"]=Ext.ux.layout.RowLayout;var ImageUtil={
    setOpacity:function(B,A){
        B.filters.alpha.opacity=parseInt(A)
    },
    scaleWidth:function(A,B){
        var C=new Image();C.src=A.src;if(C.width>0&&C.height>0){
            if(C.width>=B){
                A.width=B;A.height=(C.height*B)/C.width
            }else{
                A.width=C.width;A.height=C.height
            }
        }
    },
    scaleHeight:function(A,B){
        var C=new Image();C.src=A.src;if(C.width>0&&C.height>0){
            if(C.height>=B){
                A.height=B;A.width=(C.width*B)/C.height
            }else{
                A.width=C.width;A.height=C.height
            }
        }
    },
    scale:function(B,F,D){
        var G=new Image();G.src=B.src;if(G.width>0&&G.height>0){
            if(G.height>D||G.width>F){
                var C=0,A,E=false;if(G.height>D){
                    E=true
                }if(E){
                    A=F;C=(G.height*F)/G.width
                }if(C==0||C>D){
                    C=D;A=(G.width*D)/G.height
                }B.width=A;B.height=C
            }else{
                B.width=G.width;B.height=G.height
            }
        }
    },
    zoomImg:function(A){
        var B=parseInt(A.style.zoom,10)||100;B+=event.wheelDelta/12;if(B>0){
            A.style.zoom=B+"%"
        }return false
    }
};var SliverUtil={
    getJson:function(data){
        return eval("("+data+")")
    },
    htmlDecode:function(A){
        var B=String(A).replace(/&amp;/g,"&").replace(/&gt;/g,">").replace(/&lt;/g,"<").replace(/&quot;/g,'"');B=B.replace(/\n/g,"<br/>");return !A?A:B
    },
    markInvalid:function(A,C){
        for(var B=0;B<A.getCount();B++){
            if(C.fieldErrors[A.itemAt(B).name]){
                A.itemAt(B).markInvalid(C.fieldErrors[A.itemAt(B).name])
            }else{
                if(C.fieldErrors[A.itemAt(B).id]){
                    A.itemAt(B).markInvalid(C.fieldErrors[A.itemAt(B).id])
                }
            }if(A.itemAt(B).items){
                this.markInvalid(A.itemAt(B).items,C)
            }
        }
    },
    renderDate:function(B,A){
        if(Ext.util.Format){
            return Ext.util.Format.date(B,A)
        }
    },
    renderFile:function(A){
        if(A===true){
            return'<img src="images/icons/file.gif" align="center" valign="absmiddle"/>'
        }else{
            return""
        }
    },
    renderGender:function(A){
        if((true===A)||("true"===A)){
            return"男"
        }else{
            if((false===A)||("false"===A)){
                return"女"
            }
        }
    },
    renderOfferState:function(A){
        for(var C=0;C<SliverData.offerState.length;C++){
            for(var B=0;B<SliverData.offerState[C].length;B++){
                if(A===SliverData.offerState[C][1]){
                    return SliverData.offerState[C][0]
                }
            }
        }
    },
    renderOrderState:function(A){
        for(var C=0;C<SliverData.orderState.length;C++){
            for(var B=0;B<SliverData.orderState[C].length;B++){
                if(A===SliverData.orderState[C][1]){
                    return SliverData.orderState[C][0]
                }
            }
        }
    },
    gridCnMoney:function(A){
        A=(Math.round((A-0)*100))/100;A=(A==Math.floor(A))?A+".00":((A*10==Math.floor(A*10))?A+"0":A);A=String(A);var E=A.split(".");var D=E[0];var B=E[1]?"."+E[1]:".00";var C=/(\d+)(\d{3})/;while(C.test(D)){
            D=D.replace(C,"$1,$2")
        }A=D+B;if(A.charAt(0)=="-"){
            return'-<img src="../images/icons/money_yen.png" align="absbottom"/>'+A.substr(1)
        }return'<img src="../images/icons/money_yen.png" align="absbottom"/>'+A
    },
    cnMoney:function(A){
        A=(Math.round((A-0)*100))/100;A=(A==Math.floor(A))?A+".00":((A*10==Math.floor(A*10))?A+"0":A);A=String(A);var E=A.split(".");var D=E[0];var B=E[1]?"."+E[1]:".00";var C=/(\d+)(\d{3})/;while(C.test(D)){
            D=D.replace(C,"$1,$2")
        }A=D+B;if(A.charAt(0)=="-"){
            return"-￥"+A.substr(1)
        }return"￥"+A
    },
    weekOfDate:function(B,C){
        if(typeof C==="number"){
            var A=new Date(B);A.setDate(A.getDate()+C-A.getDay());return A
        }else{
            return null
        }
    }
};Ext.namespace("SliverData");SliverData.recordStatus=[["客户关怀"],["客户回访"],["客户投诉"],["其他事宜"]];SliverData.province=[["上海"],["云南"],["内蒙古"],["北京"],["台湾"],["吉林"],["四川"],["天津"],["宁夏"],["安徽"],["山东"],["山西"],["广东"],["广西"],["新疆"],["江苏"],["江西"],["河北"],["河南"],["浙江"],["海南"],["湖北"],["湖南"],["澳门"],["甘肃"],["福建"],["西藏"],["贵州"],["辽宁"],["重庆"],["陕西"],["青海"],["香港"],["黑龙江"]];SliverData.communicate=[["面谈"],["电话"],["传真"],["电子邮件"],["互联网"],["其他"]];SliverData.customerFrom=[["介绍"],["展会"],["电话"],["平面媒体"],["互联网"],["其他"]];SliverData.customerType=[["分析者","0"],["代理商","1"],["分销商","2"],["集成商",3],["投资商",4],["合作伙伴",5],["出版商",5],["供应商",6],["目标",7],["其他",8]];SliverData.status=[["高"],["较高"],["普通"],["较低"],["低"]];SliverData.relationship=[["好"],["较好"],["一般"],["较差"],["差"]];SliverData.offerState=[["已建立","0"],["已批准","1"],["已取消","-1"],["已锁定","2"]];SliverData.orderState=[["已建立","0"],["已批准","1"],["已取消","-1"],["已发货","2"]];SliverData.complainState=[["未解决"],["处理中"],["已解决"]];SliverData.result=[["非常满意"],["满意"],["一般"],["不满意"],["非常不满意"]];SliverData.serveType=[["回访"],["维修"],["返修"],["其它"]];SliverData.cashedType=[["现金"],["支票"],["转账"],["电汇"],["支付宝"],["paypal"],["其它"]];SliverData.businessChance=[["初期沟通","0"],["立项评估","1"],["需求分析","2"],["方案制定","3"],["投标竞争","4"],["商务谈判","5"],["合同签约","6"]];SliverData.chanceSource=[["电话来访"],["老客户"],["客户介绍"],["独立开发"],["媒体宣传"],["促销活动"],["代理商"],["合作伙伴"],["邮件"],["电子邮件"],["网站"],["会议"],["展会"],["口碑"],["其他"]];SliverData.employees=[["10人以下"],["10 - 50人"],["50 - 100人"],["100 - 500人"],["500 - 1000人"],["1000人以上"]];SliverData.sale=[["人民币10万以下"],["人民币10万 - 100万人"],["人民币100万 - 500万"],["人民币500万 - 1000万"],["人民币1000万 - 5000万"],["人民币5000万-1亿"],["人民币1亿以上"]];SliverData.nature=[["国有企业"],["股份制企业"],["外商独资企业(欧美)"],["外商独资企业(非欧美)"],["合资企业"],["私营企业"],["集体企业"],["其他"]];SliverData.category=[["农业"],["食品、饮料"],["服装"],["纺织、皮革"],["电工电气"],["家用电器"],["电脑、软件"],["化工"],["冶金矿产"],["能源"],["环保"],["交通运输"],["建筑、建材"],["机械及行业设备"],["家居用品"],["医药、保养"],["礼品、工艺品、饰品"],["运动、休闲"],["办公、文教"],["包装"],["商务服务"],["安全、防护"],["库存积压"],["汽摩及配件"],["印刷"],["代理"],["纸业"],["传媒"],["服饰"],["橡塑"],["精细化学品"],["电子元器件"],["照明工业"],["五金、工具"],["通讯产品"],["玩具"],["加工"],["二手设备转让"],["项目合作"],["仪器仪表"],["其它"]];SliverData.customerType=[["潜在","0"],["有意向","1"],["已成交","2"],["失败","3"],["无","4"]];SliverData.customerLevel=[["1星","1"],["2星","2"],["3星","3"],["4星","4"],["5星","5"],["6星","6"],["7星","7"],["8星","8"],["9星","9"],["10星","10"]];SliverData.telKey=[["商务"],["商务2"],["助理"],["商务传真"],["回电话"],["车载电话"],["单位"],["住宅"],["住宅2"],["移动电话"],["其他"],["其他传真"],["主要电话"],["无线电话"]];SliverData.imKey=[["QQ"],["MSN"],["阿里旺旺"],["百度HI"],["慧聪发发"],["飞信"],["其他"]];SliverData.chanceState=[["跟踪"],["成功"],["放弃"],["搁置"],["失效"]];SliverData.pn=[["尺寸"],["重量"],["颜色"],["体积"],["容积"],["功率"],["材质"],["压力"],["密度"],["保质期"]];Ext.namespace("SliverData.storage");SliverData.storage.title="产品库存";SliverData.storage.tooltip="<b>产品库存</b><br />产品库存、收发记录";SliverData.storage.productionDescription="产品说明";SliverData.storage.productionParameter="技术说明";Ext.namespace("SliverData.chance");SliverData.chance.title="我的机会";SliverData.chance.tooltip="<b>我的销售机会</b><br />我的销售机会记录、追踪";SliverData.chance.requirement="客户需求: ";Ext.namespace("SliverData.chanceManager");SliverData.chanceManager.title="销售机会";SliverData.chanceManager.tooltip="<b>所有销售机会管理</b><br />所有销售机会记录、追踪的管理";function SoundManager(B,A){
    this.flashVersion=8;this.debugMode=true;this.useConsole=true;this.consoleOnly=false;this.waitForWindowLoad=false;this.nullURL="data/null.mp3";this.allowPolling=true;this.defaultOptions={
        autoLoad:false,
        stream:true,
        autoPlay:false,
        onid3:null,
        onload:null,
        whileloading:null,
        onplay:null,
        onpause:null,
        onresume:null,
        whileplaying:null,
        onstop:null,
        onfinish:null,
        onbeforefinish:null,
        onbeforefinishtime:5000,
        onbeforefinishcomplete:null,
        onjustbeforefinish:null,
        onjustbeforefinishtime:200,
        multiShot:true,
        position:null,
        pan:0,
        volume:100
    };this.flash9Options={
        usePeakData:false,
        useWaveformData:false,
        useEQData:false
    };this.flashBlockHelper={
        enabled:false,
        message:['<div id="sm2-flashblock" style="position:fixed;left:0px;top:0px;width:100%;min-height:24px;z-index:9999;background:#666;color:#fff;font-family:helvetica,verdana,arial;font-size:11px;border-bottom:1px solid #333;opacity:0.95">','<div style="float:right;display:inline;margin-right:0.5em;color:#999;line-height:24px">[<a href="#noflashblock" onclick="document.getElementById(\'sm2-flashblock\').style.display=\'none\'" title="Go away! :)" style="color:#fff;text-decoration:none">x</a>]</div>','<div id="sm2-flashmovie" style="float:left;display:inline;margin-left:0.5em;margin-right:0.5em"><!-- [flash] --></div>','<div style="padding-left:0.5em;padding-right:0.5em;line-height:24px">Using Flashblock? Please right-click the icon and "<b>allow flash from this site</b>" to enable sound/audio features, and then reload this page.</div>',"</div>"]
    };var C=this;this.version=null;this.versionNumber="V2.77a.20080901";this.movieURL=null;this.url=null;this.swfLoaded=false;this.enabled=false;this.o=null;this.id=(A||"sm2movie");this.oMC=null;this.sounds=[];this.soundIDs=[];this.muted=false;this.isIE=(navigator.userAgent.match(/MSIE/i));this.isSafari=(navigator.userAgent.match(/safari/i));this.isGecko=(navigator.userAgent.match(/gecko/i));this.debugID="soundmanager-debug";this._debugOpen=true;this._didAppend=false;this._appendSuccess=false;this._didInit=false;this._disabled=false;this._windowLoaded=false;this._hasConsole=(typeof console!="undefined"&&typeof console.log!="undefined");this._debugLevels=["log","info","warn","error"];this._defaultFlashVersion=8;this.features={
        peakData:false,
        waveformData:false,
        eqData:false
    };this.sandbox={
        type:null,
        types:{
            remote:"remote (domain-based) rules",
            localWithFile:"local with file access (no internet access)",
            localWithNetwork:"local with network (internet access only, no local access)",
            localTrusted:"local, trusted (local + internet access)"
        },
        description:null,
        noRemote:null,
        noLocal:null
    };this._setVersionInfo=function(){
        if(C.flashVersion!=8&&C.flashVersion!=9){
            alert('soundManager.flashVersion must be 8 or 9. "'+C.flashVersion+'" is invalid. Reverting to '+C._defaultFlashVersion+".");C.flashVersion=C._defaultFlashVersion
        }C.version=C.versionNumber+(C.flashVersion==9?" (AS3/Flash 9)":" (AS2/Flash 8)");C.movieURL=(C.flashVersion==8?"soundmanager2.swf":"soundmanager2_flash9.swf");C.features.peakData=C.features.waveformData=C.features.eqData=(C.flashVersion==9)
    };this._overHTTP=(document.location?document.location.protocol.match(/http/i):null);this._waitingforEI=false;this._initPending=false;this._tryInitOnFocus=(this.isSafari&&typeof document.hasFocus=="undefined");this._isFocused=(typeof document.hasFocus!="undefined"?document.hasFocus():null);this._okToDisable=!this._tryInitOnFocus;var D="http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html";this.supported=function(){
        return(C._didInit&&!C._disabled)
    };this.getMovie=function(G){
        return C.isIE?window[G]:(C.isSafari?document.getElementById(G)||document[G]:document.getElementById(G))
    };this.loadFromXML=function(G){
        try{
            C.o._loadFromXML(G)
        }catch(H){
            C._failSafely();return true
        }
    };this.createSound=function(G){
        if(!C._didInit){
            throw new Error("soundManager.createSound(): Not loaded yet - wait for soundManager.onload() before calling sound-related methods")
        }if(arguments.length==2){
            G={
                id:arguments[0],
                url:arguments[1]
            }
        }var H=C._mergeObjects(G);if(C._idCheck(H.id,true)){
            return C.sounds[H.id]
        }C.sounds[H.id]=new E(C,H);C.soundIDs[C.soundIDs.length]=H.id;if(C.flashVersion==8){
            C.o._createSound(H.id,H.onjustbeforefinishtime)
        }else{
            C.o._createSound(H.id,H.url,H.onjustbeforefinishtime,H.usePeakData,H.useWaveformData,H.useEQData)
        }if(H.autoLoad||H.autoPlay){
            window.setTimeout(function(){
                C.sounds[H.id].load(H)
            },20)
        }if(H.autoPlay){
            if(C.flashVersion==8){
                C.sounds[H.id].playState=1
            }else{
                C.sounds[H.id].play()
            }
        }return C.sounds[H.id]
    };this.destroySound=function(H,G){
        if(!C._idCheck(H)){
            return false
        }for(var I=0;I<C.soundIDs.length;I++){
            if(C.soundIDs[I]==H){
                C.soundIDs.splice(I,1);continue
            }
        }C.sounds[H].unload();if(!G){
            C.sounds[H].destruct()
        }delete C.sounds[H]
    };this.load=function(G,H){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].load(H)
    };this.unload=function(G){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].unload()
    };this.play=function(G,H){
        if(!C._idCheck(G)){
            if(typeof H!="Object"){
                H={
                    url:H
                }
            }if(H&&H.url){
                H.id=G;C.createSound(H)
            }else{
                return false
            }
        }C.sounds[G].play(H)
    };this.start=this.play;this.setPosition=function(G,H){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].setPosition(H)
    };this.stop=function(G){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].stop()
    };this.stopAll=function(){
        for(var G in C.sounds){
            if(C.sounds[G] instanceof E){
                C.sounds[G].stop()
            }
        }
    };this.pause=function(G){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].pause()
    };this.resume=function(G){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].resume()
    };this.togglePause=function(G){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].togglePause()
    };this.setPan=function(G,H){
        if(!C._idCheck(G)){
            return false
        }C.sounds[G].setPan(H)
    };this.setVolume=function(H,G){
        if(!C._idCheck(H)){
            return false
        }C.sounds[H].setVolume(G)
    };this.mute=function(G){
        if(typeof G!="string"){
            G=null
        }if(!G){
            var I=null;for(var H=C.soundIDs.length;H--;){
                C.sounds[C.soundIDs[H]].mute()
            }C.muted=true
        }else{
            if(!C._idCheck(G)){
                return false
            }C.sounds[G].mute()
        }
    };this.unmute=function(G){
        if(typeof G!="string"){
            G=null
        }if(!G){
            var I=null;for(var H=C.soundIDs.length;H--;){
                C.sounds[C.soundIDs[H]].unmute()
            }C.muted=false
        }else{
            if(!C._idCheck(G)){
                return false
            }C.sounds[G].unmute()
        }
    };this.setPolling=function(G){
        if(!C.o||!C.allowPolling){
            return false
        }C.o._setPolling(G)
    };this.disable=function(G){
        if(C._disabled){
            return false
        }if(!G&&C.flashBlockHelper.enabled){
            C.handleFlashBlock()
        }C._disabled=true;for(var H=C.soundIDs.length;H--;){
            C._disableObject(C.sounds[C.soundIDs[H]])
        }C.initComplete();C._disableObject(C)
    };this.handleFlashBlock=function(I){
        function H(){
            var M=document.getElementById("sm2-flashblock");if(!M){
                try{
                    var K=document.getElementById("sm2-container");if(K){
                        K.parentNode.removeChild(K)
                    }var N=document.createElement("div");N.innerHTML=C.flashBlockHelper.message.join("").replace("<!-- [flash] -->",C._html);C._getDocument().appendChild(N);window.setTimeout(function(){
                        var O=document.getElementById("sm2-flashmovie").getElementsByTagName("div")[0];O.style.background="url(chrome://flashblock/skin/flash-disabled-16.png) 0px 0px no-repeat";O.style.border="none";O.style.minWidth="";O.style.minHeight="";O.style.width="16px";O.style.height="16px";O.style.marginTop="4px";O.onmouseover=null;O.onmouseout=null;O.onclick=null;document.getElementById("sm2-flashmovie").onclick=O.onclick
                    },1)
                }catch(L){
                    return false
                }
            }else{
                M.style.display="block"
            }this.onload=null
        }if(I){
            H();return false
        }if(!C.isGecko){
            return false
        }if(window.location.toString().match(/\#noflashblock/i)){
            return false
        }var J="chrome://flashblock/skin/flash-disabled-16.png";var G=new Image();G.style.position="absolute";G.style.left="-256px";G.style.top="-256px";G.onload=H;G.onerror=function(){
            this.onerror=null
        };G.src=J;C._getDocument().appendChild(G)
    };this.getSoundById=function(H,I){
        if(!H){
            throw new Error("SoundManager.getSoundById(): sID is null/undefined")
        }var G=C.sounds[H];if(!G&&!I){}return G
    };this.onload=function(){};this.onerror=function(){};this._idCheck=this.getSoundById;this._disableObject=function(H){
        for(var G in H){
            if(typeof H[G]=="function"&&typeof H[G]._protected=="undefined"){
                H[G]=function(){
                    return false
                }
            }
        }G=null
    };this._failSafely=function(){
        var I="You may need to whitelist this location/domain eg. file:///C:/ or C:/ or mysite.com, or set ALWAYS ALLOW under the Flash Player Global Security Settings page. The latter is probably less-secure.";var H='<a href="'+D+'" title="'+I+'">view/edit</a>';var G='<a href="'+D+'" title="Flash Player Global Security Settings">FPGSS</a>';if(!C._disabled){
            C.disable()
        }
    };this._normalizeMovieURL=function(G){
        if(G){
            if(G.match(/\.swf/)){
                G=G.substr(0,G.lastIndexOf(".swf"))
            }if(G.lastIndexOf("/")!=G.length-1){
                G=G+"/"
            }
        }return(G&&G.lastIndexOf("/")!=-1?G.substr(0,G.lastIndexOf("/")+1):"./")+C.movieURL
    };this._getDocument=function(){
        return(document.body?document.body:(document.documentElement?document.documentElement:document.getElementsByTagName("div")[0]))
    };this._getDocument._protected=true;this._createMovie=function(I,H){
        if(C._didAppend&&C._appendSuccess){
            return false
        }if(window.location.href.indexOf("debug=1")+1){
            C.debugMode=true
        }C._didAppend=true;C._setVersionInfo();C.url=C._normalizeMovieURL(H?H:C.url);H=C.url;var R='<embed name="'+I+'" id="'+I+'" src="'+H+'" width="1" height="1" quality="high" allowScriptAccess="always" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>';var N='<object id="'+I+'" data="'+H+'" type="application/x-shockwave-flash" width="1" height="1"><param name="movie" value="'+H+'" /><param name="AllowScriptAccess" value="always" /><!-- --></object>';html=(!C.isIE?R:N);C._html=html;var P='<div id="'+C.debugID+'-toggle" style="position:fixed;_position:absolute;right:0px;bottom:0px;_top:0px;width:1.2em;height:1.2em;line-height:1.2em;margin:2px;padding:0px;text-align:center;border:1px solid #999;cursor:pointer;background:#fff;color:#333;z-index:706" title="Toggle SM2 debug console" onclick="soundManager._toggleDebug()">-</div>';var M='<div id="'+C.debugID+'" style="display:'+(C.debugMode&&((!C._hasConsole||!C.useConsole)||(C.useConsole&&C._hasConsole&&!C.consoleOnly))?"block":"none")+';opacity:0.85"></div>';var L="soundManager._createMovie(): appendChild/innerHTML set failed. May be app/xhtml+xml DOM-related.";var J='<div id="sm2-container" style="position:absolute;left:-256px;top:-256px;width:1px;height:1px" class="movieContainer">'+html+"</div>"+(C.debugMode&&((!C._hasConsole||!C.useConsole)||(C.useConsole&&C._hasConsole&&!C.consoleOnly))&&!document.getElementById(C.debugID)?"x"+M+P:"");var G=C._getDocument();if(G){
            C.oMC=document.createElement("div");C.oMC.id="sm2-container";C.oMC.className="movieContainer";C.oMC.style.position="absolute";C.oMC.style.left="-256px";C.oMC.style.width="1px";C.oMC.style.height="1px";try{
                G.appendChild(C.oMC);C.oMC.innerHTML=html;C._appendSuccess=true
            }catch(O){
                throw new Error(L)
            }if(!document.getElementById(C.debugID)&&((!C._hasConsole||!C.useConsole)||(C.useConsole&&C._hasConsole&&!C.consoleOnly))){
                var Q=document.createElement("div");Q.id=C.debugID;Q.style.display=(C.debugMode?"block":"none");if(C.debugMode){
                    try{
                        var K=document.createElement("div");G.appendChild(K);K.innerHTML=P
                    }catch(O){
                        throw new Error(L)
                    }
                }G.appendChild(Q)
            }G=null
        }
    };this._writeDebug=function(G,I,H){};this._writeDebug._protected=true;this._writeDebugAlert=function(G){
        alert(G)
    };if(window.location.href.indexOf("debug=alert")+1&&C.debugMode){}this._toggleDebug=function(){
        var H=document.getElementById(C.debugID);var G=document.getElementById(C.debugID+"-toggle");if(!H){
            return false
        }if(C._debugOpen){
            G.innerHTML="+";H.style.display="none"
        }else{
            G.innerHTML="-";H.style.display="block"
        }C._debugOpen=!C._debugOpen
    };this._toggleDebug._protected=true;this._debug=function(){
        for(var H=0,G=C.soundIDs.length;H<G;H++){
            C.sounds[C.soundIDs[H]]._debug()
        }
    };this._mergeObjects=function(H,G){
        var K={};for(var I in H){
            K[I]=H[I]
        }var J=(typeof G=="undefined"?C.defaultOptions:G);for(var L in J){
            if(typeof K[L]=="undefined"){
                K[L]=J[L]
            }
        }return K
    };this.createMovie=function(G){
        if(G){
            C.url=G
        }C._initMovie()
    };this.go=this.createMovie;this._initMovie=function(){
        if(C.o){
            return false
        }C.o=C.getMovie(C.id);if(!C.o){
            C._createMovie(C.id,C.url);C.o=C.getMovie(C.id)
        }if(C.o){}
    };this.waitForExternalInterface=function(){
        if(C._waitingForEI){
            return false
        }C._waitingForEI=true;if(C._tryInitOnFocus&&!C._isFocused){
            return false
        }if(!C._didInit){}setTimeout(function(){
            if(!C._didInit){
                if(!C._overHTTP){}
            }if(!C._didInit&&C._okToDisable){
                C._failSafely()
            }
        },750)
    };this.handleFocus=function(){
        if(C._isFocused||!C._tryInitOnFocus){
            return true
        }C._okToDisable=true;C._isFocused=true;if(C._tryInitOnFocus){
            window.removeEventListener("mousemove",C.handleFocus,false)
        }C._waitingForEI=false;setTimeout(C.waitForExternalInterface,500);if(window.removeEventListener){
            window.removeEventListener("focus",C.handleFocus,false)
        }else{
            if(window.detachEvent){
                window.detachEvent("onfocus",C.handleFocus)
            }
        }
    };this.initComplete=function(){
        if(C._didInit){
            return false
        }C._didInit=true;if(C._disabled){
            C.onerror.apply(window);return false
        }if(C.waitForWindowLoad&&!C._windowLoaded){
            if(window.addEventListener){
                window.addEventListener("load",C.initUserOnload,false)
            }else{
                if(window.attachEvent){
                    window.attachEvent("onload",C.initUserOnload)
                }
            }return false
        }else{
            if(C.waitForWindowLoad&&C._windowLoaded){}C.initUserOnload()
        }
    };this.initUserOnload=function(){
        try{
            C.onload.apply(window)
        }catch(G){
            setTimeout(function(){
                throw new Error(G)
            },20);return false
        }
    };this.init=function(){
        C._initMovie();if(C._didInit){
            return false
        }if(window.removeEventListener){
            window.removeEventListener("load",C.beginDelayedInit,false)
        }else{
            if(window.detachEvent){
                window.detachEvent("onload",C.beginDelayedInit)
            }
        }try{
            C.o._externalInterfaceTest(false);C.setPolling(true);if(!C.debugMode){
                C.o._disableDebug()
            }C.enabled=true
        }catch(G){
            C._failSafely();C.initComplete();return false
        }C.initComplete()
    };this.beginDelayedInit=function(){
        C._windowLoaded=true;setTimeout(C.waitForExternalInterface,500);setTimeout(C.beginInit,20)
    };this.beginInit=function(){
        if(C._initPending){
            return false
        }C.createMovie();C._initMovie();C._initPending=true;return true
    };this.domContentLoaded=function(){
        if(document.removeEventListener){
            document.removeEventListener("DOMContentLoaded",C.domContentLoaded,false)
        }C.go()
    };this._externalInterfaceOK=function(){
        if(C.swfLoaded){
            return false
        }C.swfLoaded=true;C._tryInitOnFocus=false;if(C.isIE){
            setTimeout(C.init,100)
        }else{
            C.init()
        }
    };this._setSandboxType=function(G){
        var H=C.sandbox;H.type=G;H.description=H.types[(typeof H.types[G]!="undefined"?G:"unknown")];if(H.type=="localWithFile"){
            H.noRemote=true;H.noLocal=false
        }else{
            if(H.type=="localWithNetwork"){
                H.noRemote=false;H.noLocal=true
            }else{
                if(H.type=="localTrusted"){
                    H.noRemote=false;H.noLocal=false
                }
            }
        }
    };this.destruct=function(){
        C.disable(true)
    };function E(I,H){
        var G=this;var J=I;this.sID=H.id;this.url=H.url;this.options=J._mergeObjects(H);this.instanceOptions=this.options;this._debug=function(){
            if(J.debugMode){
                var M=null;var O=[];var L=null;var N=null;var K=64;for(M in G.options){
                    if(G.options[M]!=null){
                        if(G.options[M] instanceof Function){
                            L=G.options[M].toString();L=L.replace(/\s\s+/g," ");N=L.indexOf("{");O[O.length]=" "+M+": {"+L.substr(N+1,(Math.min(Math.max(L.indexOf("\n")-1,K),K))).replace(/\n/g,"")+"... }"
                        }else{
                            O[O.length]=" "+M+": "+G.options[M]
                        }
                    }
                }
            }
        };this._debug();this.id3={};G.resetProperties=function(K){
            G.bytesLoaded=null;G.bytesTotal=null;G.position=null;G.duration=null;G.durationEstimate=null;G.loaded=false;G.loadSuccess=null;G.playState=0;G.paused=false;G.readyState=0;G.muted=false;G.didBeforeFinish=false;G.didJustBeforeFinish=false;G.instanceOptions={};G.instanceCount=0;G.peakData={
                left:0,
                right:0
            };G.waveformData=[];G.eqData=[]
        };G.resetProperties();this.load=function(K){
            G.instanceOptions=J._mergeObjects(K);if(typeof G.instanceOptions.url=="undefined"){
                G.instanceOptions.url=G.url
            }if(G.instanceOptions.url==G.url&&G.readyState!=0&&G.readyState!=2){
                return false
            }G.loaded=false;G.loadSuccess=null;G.readyState=1;G.playState=(K.autoPlay?1:0);try{
                if(J.flashVersion==8){
                    J.o._load(G.sID,G.instanceOptions.url,G.instanceOptions.stream,G.instanceOptions.autoPlay,(G.instanceOptions.whileloading?1:0))
                }else{
                    J.o._load(G.sID,G.instanceOptions.url,G.instanceOptions.stream?true:false,G.instanceOptions.autoPlay?true:false)
                }
            }catch(L){
                J.onerror();J.disable()
            }
        };this.unload=function(){
            if(G.readyState!=0){
                G.setPosition(0);J.o._unload(G.sID,J.nullURL);G.resetProperties()
            }
        };this.destruct=function(){
            J.o._destroySound(G.sID);J.destroySound(G.sID,true)
        };this.play=function(L){
            if(!L){
                L={}
            }G.instanceOptions=J._mergeObjects(L,G.instanceOptions);G.instanceOptions=J._mergeObjects(G.instanceOptions,G.options);if(G.playState==1){
                var K=G.instanceOptions.multiShot;if(!K){
                    return false
                }else{}
            }if(!G.loaded){
                if(G.readyState==0){
                    G.instanceOptions.stream=true;G.instanceOptions.autoPlay=true;G.load(G.instanceOptions)
                }else{
                    if(G.readyState==2){
                        return false
                    }else{}
                }
            }else{}if(G.paused){
                G.resume()
            }else{
                G.playState=1;if(!G.instanceCount||J.flashVersion==9){
                    G.instanceCount++
                }G.position=(typeof G.instanceOptions.position!="undefined"&&!isNaN(G.instanceOptions.position)?G.instanceOptions.position:0);if(G.instanceOptions.onplay){
                    G.instanceOptions.onplay.apply(G)
                }G.setVolume(G.instanceOptions.volume);G.setPan(G.instanceOptions.pan);J.o._start(G.sID,G.instanceOptions.loop||1,(J.flashVersion==9?G.position:G.position/1000))
            }
        };this.start=this.play;this.stop=function(K){
            if(G.playState==1){
                G.playState=0;G.paused=false;if(G.instanceOptions.onstop){
                    G.instanceOptions.onstop.apply(G)
                }J.o._stop(G.sID,K);G.instanceCount=0;G.instanceOptions={}
            }
        };this.setPosition=function(K){
            G.instanceOptions.position=K;J.o._setPosition(G.sID,(J.flashVersion==9?G.instanceOptions.position:G.instanceOptions.position/1000),(G.paused||!G.playState))
        };this.pause=function(){
            if(G.paused){
                return false
            }G.paused=true;J.o._pause(G.sID);if(G.instanceOptions.onpause){
                G.instanceOptions.onpause.apply(G)
            }
        };this.resume=function(){
            if(!G.paused){
                return false
            }G.paused=false;J.o._pause(G.sID);if(G.instanceOptions.onresume){
                G.instanceOptions.onresume.apply(G)
            }
        };this.togglePause=function(){
            if(!G.playState){
                G.play({
                    position:(J.flashVersion==9?G.position:G.position/1000)
                });return false
            }if(G.paused){
                G.resume()
            }else{
                G.pause()
            }
        };this.setPan=function(K){
            if(typeof K=="undefined"){
                K=0
            }J.o._setPan(G.sID,K);G.instanceOptions.pan=K
        };this.setVolume=function(K){
            if(typeof K=="undefined"){
                K=100
            }J.o._setVolume(G.sID,(J.muted&&!G.muted)||G.muted?0:K);G.instanceOptions.volume=K
        };this.mute=function(){
            G.muted=true;J.o._setVolume(G.sID,0)
        };this.unmute=function(){
            G.muted=false;J.o._setVolume(G.sID,typeof G.instanceOptions.volume!="undefined"?G.instanceOptions.volume:G.options.volume)
        };this._whileloading=function(K,L,M){
            G.bytesLoaded=K;G.bytesTotal=L;G.duration=Math.floor(M);G.durationEstimate=parseInt((G.bytesTotal/G.bytesLoaded)*G.duration);if(G.readyState!=3&&G.instanceOptions.whileloading){
                G.instanceOptions.whileloading.apply(G)
            }
        };this._onid3=function(N,K){
            var O=[];for(var M=0,L=N.length;M<L;M++){
                O[N[M]]=K[M]
            }G.id3=J._mergeObjects(G.id3,O);if(G.instanceOptions.onid3){
                G.instanceOptions.onid3.apply(G)
            }
        };this._whileplaying=function(L,M,K,N){
            if(isNaN(L)||L==null){
                return false
            }G.position=L;if(G.instanceOptions.usePeakData&&typeof M!="undefined"&&M){
                G.peakData={
                    left:M.leftPeak,
                    right:M.rightPeak
                }
            }if(G.instanceOptions.useWaveformData&&typeof K!="undefined"&&K){
                G.waveformData=K
            }if(G.instanceOptions.useEQData&&typeof N!="undefined"&&N){
                G.eqData=N
            }if(G.playState==1){
                if(G.instanceOptions.whileplaying){
                    G.instanceOptions.whileplaying.apply(G)
                }if(G.loaded&&G.instanceOptions.onbeforefinish&&G.instanceOptions.onbeforefinishtime&&!G.didBeforeFinish&&G.duration-G.position<=G.instanceOptions.onbeforefinishtime){
                    G._onbeforefinish()
                }
            }
        };this._onload=function(K){
            K=(K==1?true:false);if(!K){
                if(J.sandbox.noRemote==true){}if(J.sandbox.noLocal==true){}
            }G.loaded=K;G.loadSuccess=K;G.readyState=K?3:2;if(G.instanceOptions.onload){
                G.instanceOptions.onload.apply(G)
            }
        };this._onbeforefinish=function(){
            if(!G.didBeforeFinish){
                G.didBeforeFinish=true;if(G.instanceOptions.onbeforefinish){
                    G.instanceOptions.onbeforefinish.apply(G)
                }
            }
        };this._onjustbeforefinish=function(K){
            if(!G.didJustBeforeFinish){
                G.didJustBeforeFinish=true;if(G.instanceOptions.onjustbeforefinish){
                    G.instanceOptions.onjustbeforefinish.apply(G)
                }
            }
        };this._onfinish=function(){
            G.playState=0;G.paused=false;if(G.instanceOptions.onfinish){
                G.instanceOptions.onfinish.apply(G)
            }if(G.instanceOptions.onbeforefinishcomplete){
                G.instanceOptions.onbeforefinishcomplete.apply(G)
            }G.didBeforeFinish=false;G.didJustBeforeFinish=false;if(G.instanceCount){
                G.instanceCount--;if(!G.instanceCount){
                    G.instanceCount=0;G.instanceOptions={}
                }
            }
        }
    }if(this.flashVersion==9){
        this.defaultOptions=this._mergeObjects(this.defaultOptions,this.flash9Options)
    }if(window.addEventListener){
        window.addEventListener("focus",C.handleFocus,false);window.addEventListener("load",C.beginDelayedInit,false);window.addEventListener("beforeunload",C.destruct,false);if(C._tryInitOnFocus){
            window.addEventListener("mousemove",C.handleFocus,false)
        }
    }else{
        if(window.attachEvent){
            window.attachEvent("onfocus",C.handleFocus);window.attachEvent("onload",C.beginDelayedInit);window.attachEvent("beforeunload",C.destruct)
        }else{
            soundManager.onerror();soundManager.disable()
        }
    }if(document.addEventListener){
        document.addEventListener("DOMContentLoaded",C.domContentLoaded,false)
    }var F=["SoundManager 2: Javascript Sound for the Web","http://schillmania.com/projects/soundmanager2/","Copyright (c) 2008, Scott Schiller. All rights reserved.","Code provided under the BSD License: http://schillmania.com/projects/soundmanager2/license.txt",]
}var soundManager=new SoundManager();soundManager.debugMode=false;soundManager.flashVersion=9;soundManager.url="js/";soundManager.onload=function(){
    soundManager.createSound("msg","js/msg.mp3")
};if(typeof deconcept=="undefined"){
    var deconcept=new Object()
}if(typeof deconcept.util=="undefined"){
    deconcept.util=new Object()
}if(typeof deconcept.SWFObjectUtil=="undefined"){
    deconcept.SWFObjectUtil=new Object()
}deconcept.SWFObject=function(K,B,L,D,H,I,F,E,C,J){
    if(!document.getElementById){
        return
    }this.DETECT_KEY=J?J:"detectflash";this.skipDetect=deconcept.util.getRequestParameter(this.DETECT_KEY);this.params=new Object();this.variables=new Object();this.attributes=new Array();if(K){
        this.setAttribute("swf",K)
    }if(B){
        this.setAttribute("id",B)
    }if(L){
        this.setAttribute("width",L)
    }if(D){
        this.setAttribute("height",D)
    }if(H){
        this.setAttribute("version",new deconcept.PlayerVersion(H.toString().split(".")))
    }this.installedVer=deconcept.SWFObjectUtil.getPlayerVersion();if(!window.opera&&document.all&&this.installedVer.major>7){
        deconcept.SWFObject.doPrepUnload=true
    }if(I){
        this.addParam("bgcolor",I)
    }var A=F?F:"high";this.addParam("quality",A);this.setAttribute("useExpressInstall",false);this.setAttribute("doExpressInstall",false);var G=(E)?E:window.location;this.setAttribute("xiRedirectUrl",G);this.setAttribute("redirectUrl","");if(C){
        this.setAttribute("redirectUrl",C)
    }
};deconcept.SWFObject.prototype={
    useExpressInstall:function(A){
        this.xiSWFPath=!A?"expressinstall.swf":A;this.setAttribute("useExpressInstall",true)
    },
    setAttribute:function(A,B){
        this.attributes[A]=B
    },
    getAttribute:function(A){
        return this.attributes[A]
    },
    addParam:function(B,A){
        this.params[B]=A
    },
    getParams:function(){
        return this.params
    },
    addVariable:function(B,A){
        this.variables[B]=A
    },
    getVariable:function(A){
        return this.variables[A]
    },
    getVariables:function(){
        return this.variables
    },
    getVariablePairs:function(){
        var C=new Array();var B;var A=this.getVariables();for(B in A){
            C[C.length]=B+"="+A[B]
        }return C
    },
    getSWFHTML:function(){
        var B="";if(navigator.plugins&&navigator.mimeTypes&&navigator.mimeTypes.length){
            if(this.getAttribute("doExpressInstall")){
                this.addVariable("MMplayerType","PlugIn");this.setAttribute("swf",this.xiSWFPath)
            }B='<embed type="application/x-shockwave-flash" src="'+this.getAttribute("swf")+'" width="'+this.getAttribute("width")+'" height="'+this.getAttribute("height")+'" style="'+this.getAttribute("style")+'"';B+=' id="'+this.getAttribute("id")+'" name="'+this.getAttribute("id")+'" ';var F=this.getParams();for(var E in F){
                B+=[E]+'="'+F[E]+'" '
            }var D=this.getVariablePairs().join("&");if(D.length>0){
                B+='flashvars="'+D+'"'
            }B+="/>"
        }else{
            if(this.getAttribute("doExpressInstall")){
                this.addVariable("MMplayerType","ActiveX");this.setAttribute("swf",this.xiSWFPath)
            }B='<object id="'+this.getAttribute("id")+'" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'+this.getAttribute("width")+'" height="'+this.getAttribute("height")+'" style="'+this.getAttribute("style")+'">';B+='<param name="movie" value="'+this.getAttribute("swf")+'" />';var C=this.getParams();for(var E in C){
                B+='<param name="'+E+'" value="'+C[E]+'" />'
            }var A=this.getVariablePairs().join("&");if(A.length>0){
                B+='<param name="flashvars" value="'+A+'" />'
            }B+="</object>"
        }return B
    },
    write:function(B){
        if(this.getAttribute("useExpressInstall")){
            var A=new deconcept.PlayerVersion([6,0,65]);if(this.installedVer.versionIsValid(A)&&!this.installedVer.versionIsValid(this.getAttribute("version"))){
                this.setAttribute("doExpressInstall",true);this.addVariable("MMredirectURL",encodeURIComponent(this.getAttribute("xiRedirectUrl")));document.title=document.title.slice(0,47)+" - Flash Player Installation";this.addVariable("MMdoctitle",document.title)
            }
        }if(this.skipDetect||this.getAttribute("doExpressInstall")||this.installedVer.versionIsValid(this.getAttribute("version"))){
            var C=(typeof B=="string")?document.getElementById(B):B;C.innerHTML=this.getSWFHTML();if(!(navigator.plugins&&navigator.mimeTypes.length)){
                window[this.getAttribute("id")]=document.getElementById(this.getAttribute("id"))
            }return true
        }else{
            if(this.getAttribute("redirectUrl")!=""){
                document.location.replace(this.getAttribute("redirectUrl"))
            }
        }return false
    }
};deconcept.SWFObjectUtil.getPlayerVersion=function(){
    var E=new deconcept.PlayerVersion([0,0,0]);if(navigator.plugins&&navigator.mimeTypes.length){
        var A=navigator.plugins["Shockwave Flash"];if(A&&A.description){
            E=new deconcept.PlayerVersion(A.description.replace(/([a-zA-Z]|\s)+/,"").replace(/(\s+r|\s+b[0-9]+)/,".").split("."))
        }
    }else{
        if(navigator.userAgent&&navigator.userAgent.indexOf("Windows CE")>=0){
            var B=1;var C=3;while(B){
                try{
                    C++;B=new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+C);E=new deconcept.PlayerVersion([C,0,0])
                }catch(D){
                    B=null
                }
            }
        }else{
            try{
                var B=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")
            }catch(D){
                try{
                    var B=new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");E=new deconcept.PlayerVersion([6,0,21]);B.AllowScriptAccess="always"
                }catch(D){
                    if(E.major==6){
                        return E
                    }
                }try{
                    B=new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
                }catch(D){}
            }if(B!=null){
                E=new deconcept.PlayerVersion(B.GetVariable("$version").split(" ")[1].split(","))
            }
        }
    }return E
};deconcept.PlayerVersion=function(A){
    this.major=A[0]!=null?parseInt(A[0]):0;this.minor=A[1]!=null?parseInt(A[1]):0;this.rev=A[2]!=null?parseInt(A[2]):0
};deconcept.PlayerVersion.prototype.versionIsValid=function(A){
    if(this.major<A.major){
        return false
    }if(this.major>A.major){
        return true
    }if(this.minor<A.minor){
        return false
    }if(this.minor>A.minor){
        return true
    }if(this.rev<A.rev){
        return false
    }return true
};deconcept.util={
    getRequestParameter:function(C){
        var D=document.location.search||document.location.hash;if(C==null){
            return D
        }if(D){
            var B=D.substring(1).split("&");for(var A=0;A<B.length;A++){
                if(B[A].substring(0,B[A].indexOf("="))==C){
                    return B[A].substring((B[A].indexOf("=")+1))
                }
            }
        }return""
    }
};deconcept.SWFObjectUtil.cleanupSWFs=function(){
    var B=document.getElementsByTagName("OBJECT");for(var C=B.length-1;C>=0;C--){
        B[C].style.display="none";for(var A in B[C]){
            if(typeof B[C][A]=="function"){
                B[C][A]=function(){}
            }
        }
    }
};if(deconcept.SWFObject.doPrepUnload){
    if(!deconcept.unloadSet){
        deconcept.SWFObjectUtil.prepUnload=function(){
            __flash_unloadHandler=function(){};__flash_savedUnloadHandler=function(){};window.attachEvent("onunload",deconcept.SWFObjectUtil.cleanupSWFs)
        };window.attachEvent("onbeforeunload",deconcept.SWFObjectUtil.prepUnload);deconcept.unloadSet=true
    }
}if(!document.getElementById&&document.all){
    document.getElementById=function(A){
        return document.all[A]
    }
}var getQueryParamValue=deconcept.util.getRequestParameter;var FlashObject=deconcept.SWFObject;var SWFObject=deconcept.SWFObject;