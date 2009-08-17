//~~~
Sliver.ShowDesktop=Ext.extend(Ext.app.Module,{
    moduleType:"system",
    moduleId:"system-showdesktop",
    init:function(){
        this.launcher={
            handler:this.showDesktop,
            iconCls:"icon-showdesktop",
            scope:this,
            shortcutIconCls:"system-showdesktop-shortcut",
            text:"显示桌面",
            tooltip:"<b>显示桌面</b><br />显示桌面按钮"
        }
    },
    isAllMinimized:true,
    isModuleWindow:function(C){
        var A=this.app.getModules();for(var B=0;B<A.length;B++){
            if(C.id&&A[B].moduleId===C.id){
                return true
            }else{
                return false
            }
        }
    },
    showDesktop:function(){
        var C=this.app.getDesktop().getManager();var D=C.getBy(function(E){
            return true
        });var A=this.app.getModules();for(var B=0;B<D.length;B++){
            if(D[B].isVisible()){
                this.isAllMinimized=false;break
            }
        }if(!this.isAllMinimized){
            C.hideAll();this.isAllMinimized=true
        }else{
            C.each(function(F){
                for(var E=0;E<A.length;E++){
                    if(F.id&&A[E].moduleId===F.id){
                        if(!F.isVisible()){
                            F.show()
                        }else{
                            F.restore()
                        }
                    }
                }
            },C);this.isAllMinimized=false
        }
    }
});