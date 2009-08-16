//~~
Sliver.WebForum=Ext.extend(Ext.app.Module,{
    moduleType:"web",
    moduleId:"web-forum",
    init:function(){
        this.launcher={
            handler:this.createWindow,
            iconCls:"web-forum-icon",
            scope:this,
            shortcutIconCls:"web-forum-shortcut",
            text:"论坛",
            tooltip:"<b>论坛</b><br />论坛交流"
        }
    },
    createWindow:function(){
        var E=this.app.getDesktop();
        var D=E.getWindow(this.moduleId);
        if(!D){
            var C=E.getWinWidth();var B=E.getWinHeight();var A=new Ext.Panel({
                id:"web-forum-body",
                region:"center",
                margins:"0 0 0 0",
                border:true,
                autoScroll:false,
                html:'<iframe width="100%" height="100%" border="no" src="http://www.slivercrm.cn/forum"></iframe>'
            });D=E.createWindow({
                id:this.moduleId,
                title:"讨论",
                width:C,
                height:B,
                x:E.getWinX(C),
                y:E.getWinY(B),
                iconCls:"web-forum-icon",
                shim:false,
                autoScroll:false,
                animCollapse:false,
                constrainHeader:true,
                minimizable:true,
                maximizable:false,
                border:false,
                layout:"border",
                items:A,
                taskbuttonTooltip:"<b>论坛讨论</b><br />到论坛讨论"
            })
        }
        D.show()
    }
});
