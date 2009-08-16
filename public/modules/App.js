Ext.app.App=function(A){
    Ext.apply(this,A);this.addEvents({
        ready:true,
        beforeunload:true
    });Ext.onReady(this.initApp,this)
    };
Ext.extend(Ext.app.App,Ext.util.Observable,{
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
    });