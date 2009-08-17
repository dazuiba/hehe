Ext.namespace("Sliver")
Ext.app.App = function(A) {
    Ext.apply(this, A);
    this.addEvents({
        ready: true,
        beforeunload: true
    });
    Ext.onReady(this.initApp, this)
};
Ext.extend(Ext.app.App, Ext.util.Observable, {
    isReady: false,
    modules: null,
    initApp: function() {
        var A = new Ext.KeyMap(document, [{
            key: Ext.EventObject.BACKSPACE,
            stopEvent: false,
            fn: function(C, D) {
                var B = D.target.tagName;
                if ((B !== "INPUT") && (B !== "TEXTAREA")) {
                    D.stopEvent()
                }
            }
        }]);
        this.startConfig = this.startConfig || this.getStartConfig();
        this.desktop = new Ext.Desktop(this);
        this.modules = this.getModules();
        if (this.modules) {
            this.initModules(this.modules);
            this.initDesktopConfig()
        }
        this.init();
        Ext.EventManager.on(window, "beforeunload", this.onUnload, this);
        this.fireEvent("ready", this);
        this.isReady = true
    },
    getModules: Ext.emptyFn,
    getStartConfig: Ext.emptyFn,
    getDesktopConfig: Ext.emptyFn,
    init: Ext.emptyFn,
    initModules: function(B) {
        for (var C = 0, A = B.length; C < A; C++) {
            B[C].app = this
        }
    },
    initDesktopConfig: function(A) {
        if (!A) {
            this.getDesktopConfig()
        } else {
            A.contextmenu = A.contextmenu || [];
            A.startmenu = A.startmenu || [];
            A.quickstart = A.quickstart || [];
            A.shortcuts = A.shortcuts || [];
            A.styles = A.styles || [];
            A.autorun = A.autorun || [];
            this.desktop.config = A;
            this.desktop.initialConfig = A;
            this.initContextMenu(A.contextmenu);
            this.initStartMenu(A.startmenu);
            this.initQuickStart(A.quickstart);
            this.initShortcuts(A.shortcuts);
            this.initStyles(A.styles);
            this.initAutoRun(A.autorun)
        }
    },
    initAutoRun: function(D) {
        if (D) {
            for (var C = 0, B = D.length; C < B; C++) {
                var A = this.getModule(D[C]);
                if (A) {
                    A.autorun = true;
                    A.createWindow()
                }
            }
        }
    },
    initContextMenu: function(C) {
        if (C) {
            for (var B = 0, A = C.length; B < A; B++) {
                this.desktop.addContextMenuItem(C[B])
            }
        }
    },
    initShortcuts: function(C) {
        if (C) {
            for (var B = 0, A = C.length; B < A; B++) {
                this.desktop.addShortcut(C[B], false)
            }
        }
    },
    initStartMenu: function(E) {
        if (E) {
            for (var D = 0, B = E.length; D < B; D++) {
                var A = this.getModule(E[D]);
                if (A) {
                    var F = this;
                    C(this.desktop.taskbar.startMenu, A)
                }
            }
        }
        function C(L, G) {
            if (G.moduleType == "menu") {
                var H = G.items;
                for (var I = 0, K = H.length; I < K; I++) {
                    var J = F.getModule(H[I]);
                    if (J) {
                        C(G.menu, J)
                    }
                }
            }
            if (G.launcher) {
                L.add(G.launcher)
            }
        }
    },
    initQuickStart: function(C) {
        if (C) {
            for (var B = 0, A = C.length; B < A; B++) {
                this.desktop.addQuickStartButton(C[B], false)
            }
        }
    },
    initStyles: function(A) {
        this.desktop.setBackgroundColor(A.backgroundcolor);
        this.desktop.setFontColor(A.fontcolor);
        this.desktop.setTheme(A.theme);
        this.desktop.setTransparency(A.transparency);
        this.desktop.setWallpaper(A.wallpaper);
        this.desktop.setWallpaperPosition(A.wallpaperposition)
    },
    getModule: function(B) {
        var C = this.modules;
        for (var D = 0, A = C.length; D < A; D++) {
            if (C[D].moduleId == B || C[D].moduleType == B) {
                return C[D]
            }
        }
        return ""
    },
    onReady: function(B, A) {
        if (!this.isReady) {
            this.on("ready", B, A)
        } else {
            B.call(A, this)
        }
    },
    getDesktop: function() {
        return this.desktop
    },
    onUnload: function(A) {
        if (this.fireEvent("beforeunload", this) === false) {
            A.stopEvent()
        }
    }
});

Ext.Desktop = function(A) {
    this.taskbar = new Ext.ux.TaskBar(A);
    var F = this.taskbar;
    this.el = Ext.get("x-desktop");
    var J = this.el;
    var C = Ext.get("ux-taskbar");
    this.shortcuts = new Ext.ux.Shortcuts({
        renderTo: "x-desktop",
        taskbarEl: C
    });
    this.config = null;
    this.initialConfig = null;
    var H = Ext.WindowMgr;
    var D;
    function E(L) {
        L.minimized = true;
        L.hide()
    }
    function I(L) {
        if (D && D != L) {
            K(D)
        }
        F.setActiveButton(L.taskButton);
        D = L;
        Ext.fly(L.taskButton.el).addClass("active-win");
        Ext.fly(L.el).removeClass("x-masked");
        L.minimized = false
    }
    function K(L) {
        if (L == D) {
            D = null;
            Ext.fly(L.taskButton.el).removeClass("active-win");
            Ext.fly(L.el).addClass("x-masked")
        }
    }
    function B(L) {
        F.taskButtonPanel.remove(L.taskButton);
        G()
    }
    function G() {
        J.setHeight(Ext.lib.Dom.getViewHeight() - C.getHeight())
    }
    Ext.EventManager.onWindowResize(G);
    this.layout = G;
    this.createWindow = function(M, L) {
        var N = new(L || Ext.Window)(Ext.applyIf(M || {},
        {
            manager: H,
            minimizable: true,
            maximizable: true
        }));
        N.render(J);
        N.taskButton = F.taskButtonPanel.add(N);
        N.cmenu = new Ext.menu.Menu({
            items: []
        });
        N.animateTarget = N.taskButton.el;
        N.on({
            activate: {
                fn: I
            },
            beforeshow: {
                fn: I
            },
            deactivate: {
                fn: K
            },
            minimize: {
                fn: E
            },
            close: {
                fn: B
            }
        });
        G();
        return N
    };
    this.getManager = function() {
        return H
    };
    this.getWindow = function(L) {
        return H.get(L)
    };
    this.getWinWidth = function() {
        var L = Ext.lib.Dom.getViewWidth();
        return L < 200 ? 200: L
    };
    this.getWinHeight = function() {
        var L = (Ext.lib.Dom.getViewHeight() - C.getHeight());
        return L < 100 ? 100: L
    };
    this.getWinX = function(L) {
        return (Ext.lib.Dom.getViewWidth() - L) / 2
    };
    this.getWinY = function(L) {
        return (Ext.lib.Dom.getViewHeight() - C.getHeight() - L) / 2
    };
    this.setBackgroundColor = function(L) {
        if (L) {
            Ext.get(document.body).setStyle("background-color", "#" + L);
            this.config.styles.backgroundcolor = L
        }
    };
    this.setFontColor = function(L) {
        if (L) {
            Ext.util.CSS.updateRule(".ux-shortcut-btn-text", "color", "#" + L);
            this.config.styles.fontcolor = L
        }
    };
    this.setTheme = function(L) {
        if (L && L.themeID && L.themeName && L.themePath) {
            Ext.util.CSS.swapStyleSheet("theme", L.themePath);
            this.config.styles.theme = L
        }
    };
    this.setTransparency = function(L) {
        if (L >= 0 && L <= 100) {
            C.addClass("transparent");
            Ext.util.CSS.updateRule(".transparent", "opacity", L / 100);
            Ext.util.CSS.updateRule(".transparent", "-moz-opacity", L / 100);
            Ext.util.CSS.updateRule(".transparent", "filter", "alpha(opacity=" + L + ")");
            this.config.styles.transparency = L
        }
    };
    this.getTransparency = function() {
        return this.config.styles.transparency
    };
    this.setWallpaper = function(O) {
        if (O && O.wallpaperID && O.wallpaperName && O.wallpaperPath) {
            var M = new Image();
            M.src = O.wallpaperPath;
            var L = new Ext.util.DelayedTask(N);
            L.delay(200);
            this.config.styles.wallpaper = O
        }
        function N() {
            if (M.complete) {
                Ext.MessageBox.hide();
                L.cancel();
                document.body.background = M.src
            } else {
                L.delay(200)
            }
        }
    };
    this.setWallpaperPosition = function(M) {
        if (M) {
            if (M === "center") {
                var L = Ext.get(document.body);
                L.removeClass("wallpaper-tile");
                L.addClass("wallpaper-center")
            } else {
                if (M === "tile") {
                    var L = Ext.get(document.body);
                    L.removeClass("wallpaper-center");
                    L.addClass("wallpaper-tile")
                }
            }
            this.config.styles.wallpaperposition = M
        }
    };
    this.addAutoRun = function(N) {
        var L = A.getModule(N),
        M = this.config.autorun;
        if (L && !L.autorun) {
            L.autorun = true;
            M.push(N)
        }
    };
    this.removeAutoRun = function(O) {
        var L = A.getModule(O),
        N = this.config.autorun;
        if (L && L.autorun) {
            var M = 0;
            while (M < N.length) {
                if (N[M] == O) {
                    N.splice(M, 1)
                } else {
                    M++
                }
            }
            L.autorun = null
        }
    };
    this.addContextMenuItem = function(M) {
        var L = A.getModule(M);
        if (L && !L.contextMenuItem) {
            this.cmenu.add(L.launcher)
        }
    };
    this.addShortcut = function(O, M) {
        var L = A.getModule(O);
        if (L && !L.shortcut) {
            var N = L.launcher;
            L.shortcut = this.shortcuts.addShortcut({
                handler: N.handler,
                iconCls: N.shortcutIconCls,
                scope: N.scope,
                text: N.text
            });
            if (M) {
                this.config.shortcuts.push(O)
            }
        }
    };
    this.removeShortcut = function(P, M) {
        var L = A.getModule(P);
        if (L && L.shortcut) {
            this.shortcuts.removeShortcut(L.shortcut);
            L.shortcut = null;
            if (M) {
                var O = this.config.shortcuts,
                N = 0;
                while (N < O.length) {
                    if (O[N] == P) {
                        O.splice(N, 1)
                    } else {
                        N++
                    }
                }
            }
        }
    };
    this.addQuickStartButton = function(O, M) {
        var L = A.getModule(O);
        if (L && !L.quickStartButton) {
            var N = L.launcher;
            L.quickStartButton = this.taskbar.quickStartPanel.add({
                handler: N.handler,
                iconCls: N.iconCls,
                scope: N.scope,
                text: N.text,
                tooltip: N.tooltip || N.text
            });
            if (M) {
                this.config.quickstart.push(O)
            }
        }
    };
    this.removeQuickStartButton = function(P, N) {
        var M = A.getModule(P);
        if (M && M.quickStartButton) {
            this.taskbar.quickStartPanel.remove(M.quickStartButton);
            M.quickStartButton = null;
            if (N) {
                var L = this.config.quickstart,
                O = 0;
                while (O < L.length) {
                    if (L[O] == P) {
                        L.splice(O, 1)
                    } else {
                        O++
                    }
                }
            }
        }
    };
    this.msg = function(L) {
        var M = new Ext.ux.Message(Ext.apply({
            animateTarget: C,
            autoDestroy: true,
            hideDelay: 5000,
            html: "",
            iconCls: "icon-waiting",
            title: ""
        },
        L));
        M.show();
        return M
    };
    this.hideMsg = function(M, L) {
        if (M) { (function() {
                M.animHide()
            }).defer(L || 3000)
        }
    };
    G();
    this.cmenu = new Ext.menu.Menu();
    J.on("contextmenu",
    function(M) {
        if (M.target.id === J.id) {
            M.stopEvent();
            if (!this.cmenu.el) {
                this.cmenu.render()
            }
            var L = M.getXY();
            L[1] -= this.cmenu.el.getHeight();
            this.cmenu.showAt(L)
        }
    },
    this)
};
Ext.ux.MessageMgr = {
    positions: []
};
Ext.ux.Message = Ext.extend(Ext.Window, {
    initComponent: function() {
        Ext.apply(this, {
            iconCls: this.iconCls || "icon-comment",
            width: 200,
            autoHeight: true,
            closable: true,
            plain: false,
            draggable: false,
            bodyStyle: "text-align:left;padding:10px;",
            resizable: false
        });
        if (this.autoDestroy) {
            this.task = new Ext.util.DelayedTask(this.close, this)
        } else {
            this.closable = true
        }
        Ext.ux.Message.superclass.initComponent.call(this)
    },
    setMessage: function(A) {
        this.body.update(A)
    },
    setTitle: function(B, A) {
        Ext.ux.Message.superclass.setTitle.call(this, B, A || this.iconCls)
    },
    onRender: function(B, A) {
        Ext.ux.Message.superclass.onRender.call(this, B, A)
    },
    onDestroy: function() {
        Ext.ux.MessageMgr.positions.remove(this.pos);
        Ext.ux.Message.superclass.onDestroy.call(this)
    },
    afterShow: function() {
        Ext.ux.Message.superclass.afterShow.call(this);
        this.on("move",
        function() {
            Ext.ux.MessageMgr.positions.remove(this.pos);
            if (this.autoDestroy) {
                this.task.cancel()
            }
        },
        this);
        if (this.autoDestroy) {
            this.task.delay(this.hideDelay || 5000)
        }
    },
    animShow: function() {
        this.pos = 0;
        while (Ext.ux.MessageMgr.positions.indexOf(this.pos) > -1) {
            this.pos++
        }
        Ext.ux.MessageMgr.positions.push(this.pos);
        this.setSize(200, 100);
        this.el.alignTo(this.animateTarget || document, "br-tr", [ - 1, -1 - ((this.getSize().height + 10) * this.pos)]);
        this.el.slideIn("b", {
            duration: 0.7,
            callback: this.afterShow,
            scope: this
        })
    },
    animHide: function() {
        Ext.ux.MessageMgr.positions.remove(this.pos);
        this.el.ghost("b", {
            duration: 1,
            remove: true
        })
    }
});
Ext.app.Module = function(A) {
    Ext.apply(this, A);
    Ext.app.Module.superclass.constructor.call(this);
    this.init()
};
Ext.extend(Ext.app.Module, Ext.util.Observable, {
    init: Ext.emptyFn
});
Ext.namespace("Ext.ux");
Ext.ux.Shortcuts = function(A) {
    var J = Ext.get(A.renderTo),
    D = A.taskbarEl,
    E = 74,
    I = 64,
    C = 15,
    B = null,
    K = null,
    G = [];
    F();
    function F() {
        B = {
            index: 1,
            x: C
        };
        K = {
            index: 1,
            y: C
        }
    }
    function H(L) {
        if (L > (Ext.lib.Dom.getViewHeight() - D.getHeight())) {
            return true
        }
        return false
    }
    this.addShortcut = function(L) {
        var N = J.createChild({
            tag: "div",
            cls: "ux-shortcut-item"
        });
        var M = new Ext.ux.ShortcutButton(Ext.apply(L, {
            text: Ext.util.Format.ellipsis(L.text, 16)
        }), N);
        G.push(M);
        this.setXY(M.container);
        return M
    };
    this.removeShortcut = function(M) {
        var P = document.getElementById(M.container.id);
        M.destroy();
        P.parentNode.removeChild(P);
        var O = [];
        for (var N = 0, L = G.length; N < L; N++) {
            if (G[N] != M) {
                O.push(G[N])
            }
        }
        G = O;
        this.handleUpdate()
    };
    this.handleUpdate = function() {
        F();
        for (var M = 0, L = G.length; M < L; M++) {
            this.setXY(G[M].container)
        }
    };
    this.setXY = function(M) {
        var L = K.y + E;
        var N = H(K.y + E);
        if (N && L > (E + C)) {
            B = {
                index: B.index++,
                x: B.x + I + C
            };
            K = {
                index: 1,
                y: C
            }
        }
        M.setXY([B.x, K.y]);
        K.index++;
        K.y = K.y + E + C
    };
    Ext.EventManager.onWindowResize(this.handleUpdate, this, {
        delay: 500
    })
};
Ext.ux.ShortcutButton = function(A, B) {
    Ext.ux.ShortcutButton.superclass.constructor.call(this, Ext.apply(A, {
        renderTo: B,
        template: new Ext.Template('<div class="ux-shortcut-btn"><div>', '<img src="' + Ext.BLANK_IMAGE_URL + '" />', '<div class="ux-shortcut-btn-text">{0}</div>', "</div></div>")
    }))
};
Ext.extend(Ext.ux.ShortcutButton, Ext.Button, {
    buttonSelector: "div:first",
    initButtonEl: function(A, B) {
        Ext.ux.ShortcutButton.superclass.initButtonEl.apply(this, arguments);
        A.removeClass("x-btn");
        if (this.iconCls) {
            if (!this.cls) {
                A.removeClass(this.text ? "x-btn-text-icon": "x-btn-icon")
            }
        }
    },
    autoWidth: function() {},
    setText: function(A) {
        this.text = A;
        if (this.el) {
            this.el.child("div.ux-shortcut-btn-text").update(A)
        }
    }
});
Ext.namespace("Ext.ux");
Ext.ux.StartMenu = function(A) {
    Ext.ux.StartMenu.superclass.constructor.call(this, A);
    var B = this.toolItems;
    this.toolItems = new Ext.util.MixedCollection();
    if (B) {
        this.addTool.apply(this, B)
    }
};
Ext.extend(Ext.ux.StartMenu, Ext.menu.Menu, {
    height: 300,
    toolPanelWidth: 100,
    width: 300,
    render: function() {
        if (this.el) {
            return
        }
        var A = this.el = new Ext.Layer({
            cls: "x-menu ux-start-menu",
            shadow: this.shadow,
            constrain: false,
            parentEl: this.parentEl || document.body,
            zindex: 15000
        });
        var E = A.createChild({
            tag: "div",
            cls: "x-window-header x-unselectable x-panel-icon " + this.iconCls
        });
        E.setStyle("padding", "7px 0 0 0");
        this.header = E;
        var F = E.createChild({
            tag: "span",
            cls: "x-window-header-text"
        });
        var O = E.wrap({
            cls: "ux-start-menu-tl"
        });
        var K = E.wrap({
            cls: "ux-start-menu-tr"
        });
        var C = E.wrap({
            cls: "ux-start-menu-tc"
        });
        this.menuBWrap = A.createChild({
            tag: "div",
            cls: "ux-start-menu-body x-border-layout-ct ux-start-menu-body"
        });
        var D = this.menuBWrap.wrap({
            cls: "ux-start-menu-ml"
        });
        var L = this.menuBWrap.wrap({
            cls: "ux-start-menu-mc ux-start-menu-bwrap"
        });
        this.menuPanel = this.menuBWrap.createChild({
            tag: "div",
            cls: "x-panel x-border-panel ux-start-menu-apps-panel opaque"
        });
        this.toolsPanel = this.menuBWrap.createChild({
            tag: "div",
            cls: "x-panel x-border-panel ux-start-menu-tools-panel opaque"
        });
        var J = D.wrap({
            cls: "x-window-bwrap"
        });
        var I = J.createChild({
            tag: "div",
            cls: "ux-start-menu-bc"
        });
        var B = I.wrap({
            cls: "ux-start-menu-bl x-panel-nofooter"
        });
        var N = I.wrap({
            cls: "ux-start-menu-br"
        });
        I.setStyle({
            height: "0px",
            padding: "0 0 6px 0"
        });
        this.keyNav = new Ext.menu.MenuNav(this);
        if (this.plain) {
            A.addClass("x-menu-plain")
        }
        if (this.cls) {
            A.addClass(this.cls)
        }
        this.focusEl = A.createChild({
            tag: "a",
            cls: "x-menu-focus",
            href: "#",
            onclick: "return false;",
            tabIndex: "-1"
        });
        var H = this.menuPanel.createChild({
            id: "SliverDesktopStartMenu",
            tag: "ul",
            cls: "x-menu-list"
        });
        var M = this.toolsPanel.createChild({
            id: "SliverDesktopStartToolMenu",
            tag: "ul",
            cls: "x-menu-list"
        });
        var G = {
            click: {
                fn: this.onClick,
                scope: this
            },
            mouseover: {
                fn: this.onMouseOver,
                scope: this
            },
            mouseout: {
                fn: this.onMouseOut,
                scope: this
            }
        };
        H.on(G);
        this.items.each(function(Q) {
            var P = document.createElement("li");
            P.className = "x-menu-list-item";
            H.dom.appendChild(P);
            Q.render(P, this)
        },
        this);
        this.ul = H;
        this.autoWidth();
        M.on(G);
        this.toolItems.each(function(Q) {
            var P = document.createElement("li");
            P.className = "x-menu-list-item";
            M.dom.appendChild(P);
            Q.render(P, this)
        },
        this);
        this.toolsUl = M;
        this.autoWidth();
        this.menuBWrap.setStyle("position", "relative");
        this.menuBWrap.setHeight(this.height);
        this.menuPanel.setStyle({
            padding: "2px",
            position: "absolute",
            overflow: "auto"
        });
        this.toolsPanel.setStyle({
            padding: "2px 4px 2px 2px",
            position: "absolute",
            overflow: "auto"
        });
        this.setTitle(this.title, "user")
    },
    findTargetItem: function(B) {
        var A = B.getTarget(".x-menu-list-item", this.ul, true);
        if (A && A.menuItemId) {
            if (this.items.get(A.menuItemId)) {
                return this.items.get(A.menuItemId)
            } else {
                return this.toolItems.get(A.menuItemId)
            }
        }
    },
    show: function(B, E, A) {
        this.parentMenu = A;
        if (!this.el) {
            this.render()
        }
        this.fireEvent("beforeshow", this);
        this.showAt(this.el.getAlignToXY(B, E || this.defaultAlign), A, false);
        var D = this.toolPanelWidth;
        var C = this.menuBWrap.getBox();
        this.menuPanel.setWidth(C.width - D);
        this.menuPanel.setHeight(C.height);
        this.toolsPanel.setWidth(D);
        this.toolsPanel.setX(C.x + C.width - D);
        this.toolsPanel.setHeight(C.height)
    },
    addTool: function() {
        var B = arguments,
        A = B.length,
        E;
        for (var C = 0; C < A; C++) {
            var D = B[C];
            if (D.render) {
                E = this.addToolItem(D)
            } else {
                if (typeof D == "string") {
                    if (D == "separator" || D == "-") {
                        E = this.addToolSeparator()
                    } else {
                        E = this.addText(D)
                    }
                } else {
                    if (D.tagName || D.el) {
                        E = this.addElement(D)
                    } else {
                        if (typeof D == "object") {
                            E = this.addToolMenuItem(D)
                        }
                    }
                }
            }
        }
        return E
    },
    addToolSeparator: function() {
        return this.addToolItem(new Ext.menu.Separator({
            itemCls: "ux-toolmenu-sep"
        }))
    },
    addToolItem: function(B) {
        this.toolItems.add(B);
        if (this.toolsUl) {
            var A = document.createElement("li");
            A.className = "x-menu-list-item";
            this.toolsUl.dom.appendChild(A);
            B.render(A, this);
            this.delayAutoWidth()
        }
        return B
    },
    addToolMenuItem: function(A) {
        if (! (A instanceof Ext.menu.Item)) {
            if (typeof A.checked == "boolean") {
                A = new Ext.menu.CheckItem(A)
            } else {
                A = new Ext.menu.Item(A)
            }
        }
        return this.addToolItem(A)
    },
    setTitle: function(B, A) {
        this.title = B;
        if (this.header.child("span")) {
            this.header.child("span").update(B)
        }
        return this
    },
    getToolButton: function(A) {
        var B = new Ext.Button({
            handler: A.handler,
            minWidth: this.toolPanelWidth - 10,
            scope: A.scope,
            text: A.text
        });
        return B
    }
});
Ext.namespace("Ext.ux");
Ext.ux.TaskBar = function(A) {
    this.app = A;
    this.init()
};
Ext.extend(Ext.ux.TaskBar, Ext.util.Observable, {
    init: function() {
        this.startMenu = new Ext.ux.StartMenu(Ext.apply({
            iconCls: "user",
            height: 300,
            shadow: true,
            title: "Todd Murdock",
            width: 300
        },
        this.app.startConfig));
        this.startButton = new Ext.Button({
            text: "开始",
            id: "ux-startbutton",
            iconCls: "start",
            menu: this.startMenu,
            menuAlign: "bl-tl",
            renderTo: "ux-taskbar-start"
        });
        var A = Ext.get("ux-startbutton").getWidth() + 10;
        var D = new Ext.BoxComponent({
            el: "ux-taskbar-start",
            id: "TaskBarStart",
            minWidth: A,
            region: "west",
            split: false,
            width: A
        });
        this.quickStartPanel = new Ext.ux.QuickStartPanel({
            el: "ux-quickstart-panel",
            id: "TaskBarQuickStart",
            minWidth: 90,
            region: "west",
            split: (Ext.isIE) ? false: true,
            width: 94
        });
        Ext.ux.Clock = function() {
            this.init = function(F) {
                Ext.TaskMgr.start({
                    interval: 1000,
                    run: function() {
                        var H = new Date();
                        var J = H.getHours();
                        var G = H.getMinutes();
                        var I = "";
                        if (J < 10) {
                            I = "上午"
                        } else {
                            if (J > 12) {
                                J = J - 12;
                                I = "下午"
                            }
                        }
                        if (G < 10) {
                            G = "0" + G
                        }
                        F.setText(I + " " + J + ":" + G)
                    },
                    scope: this
                })
            }
        };
        var E = new Ext.Button({
            text: "&nbsp;",
            id: "tasktime",
            iconCls: "icon-time",
            menu: new Ext.menu.DateMenu({}),
            plugins: new Ext.ux.Clock()
        });
        this.cklPanel = new Ext.Panel({
            el: "ux-taskclock-panel",
            id: "TaskBarClock",
            minWidth: 100,
            bodyStyle: "padding-top: 4px; background: none",
            border: false,
            split: false,
            region: "east",
            width: 100,
            items: [E]
        });
        this.taskButtonPanel = new Ext.ux.TaskButtonsPanel({
            el: "ux-taskbuttons-panel",
            id: "TaskBarButtons",
            region: "center"
        });
        var C = new Ext.Container({
            el: "ux-taskbar-panel-wrap",
            items: [this.quickStartPanel, this.taskButtonPanel, this.cklPanel],
            layout: "border",
            region: "center"
        });
        var B = new Ext.ux.TaskBarContainer({
            el: "ux-taskbar",
            layout: "border",
            items: [D, C]
        });
        this.el = B.el;
        return this
    },
    setActiveButton: function(A) {
        this.taskButtonPanel.setActiveButton(A)
    }
});
Ext.ux.TaskBarContainer = Ext.extend(Ext.Container, {
    initComponent: function() {
        Ext.ux.TaskBarContainer.superclass.initComponent.call(this);
        this.el = Ext.get(this.el) || Ext.getBody();
        this.el.setHeight = Ext.emptyFn;
        this.el.setWidth = Ext.emptyFn;
        this.el.setSize = Ext.emptyFn;
        this.el.setStyle({
            overflow: "hidden",
            margin: "0",
            border: "0 none"
        });
        this.el.dom.scroll = "no";
        this.allowDomMove = false;
        this.autoWidth = true;
        this.autoHeight = true;
        Ext.EventManager.onWindowResize(this.fireResize, this);
        this.renderTo = this.el
    },
    fireResize: function(A, B) {
        this.fireEvent("resize", this, A, B, A, B)
    }
});
Ext.ux.TaskButtonsPanel = Ext.extend(Ext.BoxComponent, {
    activeButton: null,
    enableScroll: true,
    scrollIncrement: 0,
    scrollRepeatInterval: 400,
    scrollDuration: 0.35,
    animScroll: true,
    resizeButtons: true,
    buttonWidth: 168,
    minButtonWidth: 118,
    buttonMargin: 2,
    buttonWidthSet: false,
    initComponent: function() {
        Ext.ux.TaskButtonsPanel.superclass.initComponent.call(this);
        this.on("resize", this.delegateUpdates);
        this.items = [];
        this.stripWrap = Ext.get(this.el).createChild({
            cls: "ux-taskbuttons-strip-wrap",
            cn: {
                tag: "ul",
                cls: "ux-taskbuttons-strip"
            }
        });
        this.stripSpacer = Ext.get(this.el).createChild({
            cls: "ux-taskbuttons-strip-spacer"
        });
        this.strip = new Ext.Element(this.stripWrap.dom.firstChild);
        this.edge = this.strip.createChild({
            tag: "li",
            cls: "ux-taskbuttons-edge"
        });
        this.strip.createChild({
            cls: "x-clear"
        })
    },
    add: function(C) {
        var A = this.strip.createChild({
            tag: "li"
        },
        this.edge);
        var B = new Ext.ux.TaskBar.TaskButton(C, A);
        this.items.push(B);
        if (!this.buttonWidthSet) {
            this.lastButtonWidth = B.container.getWidth()
        }
        this.setActiveButton(B);
        return B
    },
    remove: function(D) {
        var B = document.getElementById(D.container.id);
        D.destroy();
        B.parentNode.removeChild(B);
        var E = [];
        for (var C = 0, A = this.items.length; C < A; C++) {
            if (this.items[C] != D) {
                E.push(this.items[C])
            }
        }
        this.items = E;
        this.delegateUpdates()
    },
    setActiveButton: function(A) {
        this.activeButton = A;
        this.delegateUpdates()
    },
    delegateUpdates: function() {
        if (this.resizeButtons && this.rendered) {
            this.autoSize()
        }
        if (this.enableScroll && this.rendered) {
            this.autoScroll()
        }
    },
    autoSize: function() {
        var H = this.items.length;
        var C = this.el.dom.offsetWidth;
        var A = this.el.dom.clientWidth;
        if (!this.resizeButtons || H < 1 || !A) {
            return
        }
        var J = Math.max(Math.min(Math.floor((A - 4) / H) - this.buttonMargin, this.buttonWidth), this.minButtonWidth);
        var E = this.stripWrap.dom.getElementsByTagName("button");
        this.lastButtonWidth = Ext.get(E[0].id).findParent("li").offsetWidth;
        for (var F = 0, I = E.length; F < I; F++) {
            var B = E[F];
            var G = Ext.get(E[F].id).findParent("li").offsetWidth;
            var D = B.offsetWidth;
            B.style.width = (J - (G - D)) + "px"
        }
    },
    autoScroll: function() {
        var F = this.items.length;
        var D = this.el.dom.offsetWidth;
        var C = this.el.dom.clientWidth;
        var E = this.stripWrap;
        var B = E.dom.offsetWidth;
        var G = this.getScrollPos();
        var A = this.edge.getOffsetsTo(this.stripWrap)[0] + G;
        if (!this.enableScroll || F < 1 || B < 20) {
            return
        }
        E.setWidth(C);
        if (A <= C) {
            E.dom.scrollLeft = 0;
            if (this.scrolling) {
                this.scrolling = false;
                this.el.removeClass("x-taskbuttons-scrolling");
                this.scrollLeft.hide();
                this.scrollRight.hide()
            }
        } else {
            if (!this.scrolling) {
                this.el.addClass("x-taskbuttons-scrolling")
            }
            C -= E.getMargins("lr");
            E.setWidth(C > 20 ? C: 20);
            if (!this.scrolling) {
                if (!this.scrollLeft) {
                    this.createScrollers()
                } else {
                    this.scrollLeft.show();
                    this.scrollRight.show()
                }
            }
            this.scrolling = true;
            if (G > (A - C)) {
                E.dom.scrollLeft = A - C
            } else {
                this.scrollToButton(this.activeButton, true)
            }
            this.updateScrollButtons()
        }
    },
    createScrollers: function() {
        var C = this.el.dom.offsetHeight;
        var A = this.el.insertFirst({
            cls: "ux-taskbuttons-scroller-left"
        });
        A.setHeight(C);
        A.addClassOnOver("ux-taskbuttons-scroller-left-over");
        this.leftRepeater = new Ext.util.ClickRepeater(A, {
            interval: this.scrollRepeatInterval,
            handler: this.onScrollLeft,
            scope: this
        });
        this.scrollLeft = A;
        var B = this.el.insertFirst({
            cls: "ux-taskbuttons-scroller-right"
        });
        B.setHeight(C);
        B.addClassOnOver("ux-taskbuttons-scroller-right-over");
        this.rightRepeater = new Ext.util.ClickRepeater(B, {
            interval: this.scrollRepeatInterval,
            handler: this.onScrollRight,
            scope: this
        });
        this.scrollRight = B
    },
    getScrollWidth: function() {
        return this.edge.getOffsetsTo(this.stripWrap)[0] + this.getScrollPos()
    },
    getScrollPos: function() {
        return parseInt(this.stripWrap.dom.scrollLeft, 10) || 0
    },
    getScrollArea: function() {
        return parseInt(this.stripWrap.dom.clientWidth, 10) || 0
    },
    getScrollAnim: function() {
        return {
            duration: this.scrollDuration,
            callback: this.updateScrollButtons,
            scope: this
        }
    },
    getScrollIncrement: function() {
        return (this.scrollIncrement || this.lastButtonWidth + 2)
    },
    scrollToButton: function(E, A) {
        E = E.el.dom.parentNode;
        if (!E) {
            return
        }
        var C = E;
        var G = this.getScrollPos(),
        D = this.getScrollArea();
        var F = Ext.fly(C).getOffsetsTo(this.stripWrap)[0] + G;
        var B = F + C.offsetWidth;
        if (F < G) {
            this.scrollTo(F, A)
        } else {
            if (B > (G + D)) {
                this.scrollTo(B - D, A)
            }
        }
    },
    scrollTo: function(B, A) {
        this.stripWrap.scrollTo("left", B, A ? this.getScrollAnim() : false);
        if (!A) {
            this.updateScrollButtons()
        }
    },
    onScrollRight: function() {
        var A = this.getScrollWidth() - this.getScrollArea();
        var C = this.getScrollPos();
        var B = Math.min(A, C + this.getScrollIncrement());
        if (B != C) {
            this.scrollTo(B, this.animScroll)
        }
    },
    onScrollLeft: function() {
        var B = this.getScrollPos();
        var A = Math.max(0, B - this.getScrollIncrement());
        if (A != B) {
            this.scrollTo(A, this.animScroll)
        }
    },
    updateScrollButtons: function() {
        var A = this.getScrollPos();
        this.scrollLeft[A == 0 ? "addClass": "removeClass"]("ux-taskbuttons-scroller-left-disabled");
        this.scrollRight[A >= (this.getScrollWidth() - this.getScrollArea()) ? "addClass": "removeClass"]("ux-taskbuttons-scroller-right-disabled")
    }
});
Ext.ux.TaskBar.TaskButton = function(B, A) {
    this.win = B;
    Ext.ux.TaskBar.TaskButton.superclass.constructor.call(this, {
        iconCls: B.iconCls,
        text: Ext.util.Format.ellipsis(B.title, 12),
        tooltip: B.taskbuttonTooltip || B.title,
        renderTo: A,
        handler: function() {
            if (B.minimized || B.hidden) {
                B.show()
            } else {
                if (B == B.manager.getActive()) {
                    B.minimize()
                } else {
                    B.toFront()
                }
            }
        },
        clickEvent: "mousedown"
    })
};
Ext.extend(Ext.ux.TaskBar.TaskButton, Ext.Button, {
    onRender: function() {
        Ext.ux.TaskBar.TaskButton.superclass.onRender.apply(this, arguments);
        this.cmenu = new Ext.menu.Menu({
            items: [{
                id: "restore",
                text: "恢复",
                handler: function() {
                    if (!this.win.isVisible()) {
                        this.win.show()
                    } else {
                        this.win.restore()
                    }
                },
                scope: this
            },
            {
                id: "minimize",
                text: "最小化",
                handler: this.win.minimize,
                scope: this.win
            },
            {
                id: "maximize",
                text: "最大化",
                handler: this.win.maximize,
                scope: this.win
            },
            "-", {
                id: "close",
                text: "关闭",
                handler: this.closeWin.createDelegate(this, this.win, true),
                scope: this.win
            }]
        });
        this.cmenu.on("beforeshow",
        function() {
            var B = this.cmenu.items.items;
            var A = this.win;
            B[0].setDisabled(A.maximized !== true && A.hidden !== true);
            B[1].setDisabled(A.minimized === true);
            B[2].setDisabled(A.maximized === true || A.hidden === true);
            B[2].setDisabled(A.maximizable === false);
            B[3].setDisabled(A.closable === false)
        },
        this);
        this.el.on("contextmenu",
        function(B) {
            B.stopEvent();
            if (!this.cmenu.el) {
                this.cmenu.render()
            }
            var A = B.getXY();
            A[1] -= this.cmenu.el.getHeight();
            this.cmenu.showAt(A)
        },
        this)
    },
    closeWin: function(A, C, B) {
        if (!B.isVisible()) {
            B.show()
        } else {
            B.restore()
        }
        B.close()
    },
    setText: function(A) {
        if (A) {
            this.text = A;
            if (this.el) {
                this.el.child("td.x-btn-center " + this.buttonSelector).update(Ext.util.Format.ellipsis(A, 12))
            }
        }
    },
    setTooltip: function(B) {
        if (B) {
            this.tooltip = B;
            var A = this.el.child(this.buttonSelector);
            Ext.QuickTips.unregister(A.id);
            if (typeof this.tooltip == "object") {
                Ext.QuickTips.register(Ext.apply({
                    target: A.id
                },
                this.tooltip))
            } else {
                A.dom[this.tooltipType] = this.tooltip
            }
        }
    }
});
Ext.ux.QuickStartPanel = Ext.extend(Ext.BoxComponent, {
    enableMenu: true,
    initComponent: function() {
        Ext.ux.QuickStartPanel.superclass.initComponent.call(this);
        this.on("resize", this.delegateUpdates);
        this.menu = new Ext.menu.Menu();
        this.items = [];
        this.stripWrap = Ext.get(this.el).createChild({
            cls: "ux-quickstart-strip-wrap",
            cn: {
                tag: "ul",
                cls: "ux-quickstart-strip"
            }
        });
        this.stripSpacer = Ext.get(this.el).createChild({
            cls: "ux-quickstart-strip-spacer"
        });
        this.strip = new Ext.Element(this.stripWrap.dom.firstChild);
        this.edge = this.strip.createChild({
            tag: "li",
            cls: "ux-quickstart-edge"
        });
        this.strip.createChild({
            cls: "x-clear"
        })
    },
    add: function(B) {
        var A = this.strip.createChild({
            tag: "li"
        },
        this.edge);
        var C = new Ext.Button(Ext.apply(B, {
            cls: "x-btn-icon",
            menuText: B.text,
            renderTo: A,
            text: ""
        }));
        this.items.push(C);
        this.delegateUpdates();
        return C
    },
    remove: function(D) {
        var B = document.getElementById(D.container.id);
        D.destroy();
        B.parentNode.removeChild(B);
        var E = [];
        for (var C = 0, A = this.items.length; C < A; C++) {
            if (this.items[C] != D) {
                E.push(this.items[C])
            }
        }
        this.items = E;
        this.delegateUpdates()
    },
    menuAdd: function(A) {
        this.menu.add(A)
    },
    delegateUpdates: function() {
        if (this.enableMenu && this.rendered) {
            this.showButtons();
            this.clearMenu();
            this.autoMenu()
        }
    },
    showButtons: function() {
        var B = this.items.length;
        for (var A = 0; A < B; A++) {
            this.items[A].show()
        }
    },
    clearMenu: function() {
        this.menu.removeAll()
    },
    autoMenu: function() {
        var J = this.items.length;
        var E = this.el.dom.offsetWidth;
        var I = this.el.dom.clientWidth;
        var B = this.stripWrap;
        var G = B.dom.offsetWidth;
        var F = this.edge.getOffsetsTo(this.stripWrap)[0];
        if (!this.enableMenu || J < 1 || G < 20) {
            return
        }
        B.setWidth(I);
        if (F <= I) {
            if (this.showingMenu) {
                this.showingMenu = false;
                this.menuButton.hide()
            }
        } else {
            I -= B.getMargins("lr");
            B.setWidth(I > 20 ? I: 20);
            if (!this.showingMenu) {
                if (!this.menuButton) {
                    this.createMenuButton()
                } else {
                    this.menuButton.show()
                }
            }
            mo = this.getMenuButtonPos();
            for (var H = J - 1; H >= 0; H--) {
                var A = this.items[H].el.dom.offsetLeft + this.items[H].el.dom.offsetWidth;
                if (A > mo) {
                    this.items[H].hide();
                    var C = this.items[H].initialConfig,
                    D = {
                        iconCls: C.iconCls,
                        handler: C.handler,
                        scope: C.scope,
                        text: C.menuText
                    };
                    this.menuAdd(D)
                } else {
                    this.items[H].show()
                }
            }
            this.showingMenu = true
        }
    },
    createMenuButton: function() {
        var B = this.el.dom.offsetHeight;
        var C = this.el.insertFirst({
            cls: "ux-quickstart-menubutton-wrap"
        });
        C.setHeight(B);
        var A = new Ext.Button({
            cls: "x-btn-icon",
            id: "ux-quickstart-menubutton",
            menu: this.menu,
            renderTo: C
        });
        C.setWidth(Ext.get("ux-quickstart-menubutton").getWidth());
        this.menuButton = C
    },
    getMenuButtonPos: function() {
        return this.menuButton.dom.offsetLeft
    }
});



Sliver.Preferences = Ext.extend(Ext.app.Module, {
    moduleType: "system",
    moduleId: "system-preferences",
    cards: ["pref-win-card-1", "pref-win-card-2", "pref-win-card-3", "pref-win-card-4", "pref-win-card-5", "pref-win-card-6", "perf-win-card-7"],
    contentPanel: null,
    cardHistory: ["pref-win-card-1"],
    layout: null,
    win: null,
    init: function() {
        this.launcher = {
            iconCls: "pref-icon",
            handler: this.createWindow,
            scope: this,
            shortcutIconCls: "pref-shortcut-icon",
            text: "帐户设置",
            tooltip: "<b>帐户设置</b><br />更改您的帐户设置"
        }
    },
    createWindow: function() {
        var D = this.app.getDesktop();
        this.win = D.getWindow(this.moduleId);
        var C = new Sliver.Preferences.UserMessage({
            owner: this,
            autoScroll: true,
            title: "帐户信息",
            border: false,
            id: "perf-win-card-7"
        });
        C.on("render",
        function() {
            C.body.getUpdater().update({
                scripts: true,
                method: "post",
                params: {
                    containerID: C.body.id
                },
                url: "system/updateCurrentUserView.action"
            })
        });

        if (!this.win) {
            var B = 610;
            var A = 460;
            this.contentPanel = new Ext.Panel({
                activeItem: 0,
                border: false,
                id: "pref-win-content",
                items: [new Sliver.Preferences.NavPanel({
                    owner: this,
                    id: "pref-win-card-1"
                }), new Sliver.Preferences.Shortcuts({
                    owner: this,
                    id: "pref-win-card-6"
                }), new Sliver.Preferences.AutoRun({
                    owner: this,
                    id: "pref-win-card-5"
                }), new Sliver.Preferences.QuickStart({
                    owner: this,
                    id: "pref-win-card-2"
                }), new Sliver.Preferences.Appearance({
                    owner: this,
                    id: "pref-win-card-3"
                }), new Sliver.Preferences.Background({
                    owner: this,
                    id: "pref-win-card-4"
                }), C],
                layout: "card",
                bbar: [{
                    xtype: "tbfill"
                },
                {
                    disabled: true,
                    handler: this.navHandler.createDelegate(this, [ - 1]),
                    id: "back",
                    scope: this,
                    text: "上一步"
                },
                {
                    disabled: true,
                    handler: this.navHandler.createDelegate(this, [1]),
                    id: "next",
                    scope: this,
                    text: "下一步"
                }]
            });
            this.win = D.createWindow({
                animCollapse: false,
                constrainHeader: true,
                id: this.moduleId,
                height: A,
                iconCls: "pref-icon",
                items: this.contentPanel,
                layout: "fit",
                shim: false,
                taskbuttonTooltip: "<b>帐户设置</b><br />更改您的设置",
                title: "帐户设置",
                width: B
            });
            this.layout = this.contentPanel.getLayout()
        }
        this.win.show()
    },
    handleButtonState: function() {
        var G = this.cardHistory,
        D = this.layout.activeItem.id,
        C = this.contentPanel.getBottomToolbar().items,
        B = C.get(1),
        F = C.get(2);
        for (var E = 0, A = G.length; E < A; E++) {
            if (G[E] === D) {
                if (E <= 0) {
                    B.disable();
                    F.enable()
                } else {
                    if (E >= (A - 1)) {
                        B.enable();
                        F.disable()
                    } else {
                        B.enable();
                        F.enable()
                    }
                }
                break
            }
        }
    },
    navHandler: function(C) {
        var F = this.cardHistory,
        B = this.layout.activeItem.id,
        E;
        for (var D = 0, A = F.length; D < A; D++) {
            if (F[D] === B) {
                E = F[D + C];
                break
            }
        }
        this.layout.setActiveItem(E);
        this.handleButtonState()
    },
    save: function(A) {
        Ext.MessageBox.show({
            msg: "正在保存数据，请等待...",
            progressText: "保存中...",
            width: 300,
            wait: true,
            waitConfig: {
                interval: 200
            },
            icon: "desktop-download"
        });
        Ext.Ajax.request({
            url: "system/saveCurrentStyle.action",
            params: A,
            success: function(B) {
                if (Ext.decode(B.responseText).success) {
                    Ext.MessageBox.hide()
                } else {
                    Ext.MessageBox.hide();
                    Ext.MessageBox.alert("Error", "Errors encountered on the server.")
                }
            },
            failure: function() {
                Ext.MessageBox.hide();
                Ext.MessageBox.alert("Error", "Lost connection to server.")
            },
            scope: this
        })
    },
    viewCard: function(A) {
        this.layout.setActiveItem(A);
        if (this.cardHistory.length > 1) {
            this.cardHistory.pop()
        }
        this.cardHistory.push(A);
        this.handleButtonState()
    }
});

//~~
Sliver.Preferences.NavPanel = function(A) {
    this.owner = A.owner;
    Sliver.Preferences.NavPanel.superclass.constructor.call(this, {
        autoScroll: true,
        bodyStyle: "padding:15px",
        border: false,
        html: '<ul id="pref-nav-panel">         <li>           <img src="' + Ext.BLANK_IMAGE_URL + '" class="icon-pref-shortcut"/>           <a id="viewShortcuts" href="#">快捷方式</a><br />           <span>选择出现在桌面上的程序的快捷方式</span>         </li>         <li>           <img src="' + Ext.BLANK_IMAGE_URL + '" class="icon-pref-autorun"/>           <a id="viewAutoRun" href="#">自动运行程序</a><br />           <span>选择登录后及自动运行的程序</span>         </li>         <li>           <img src="' + Ext.BLANK_IMAGE_URL + '" class="icon-pref-quickstart"/>           <a id="viewQuickstart" href="#">快速启动程序</a><br />           <span>设置常用的程序图标</span>         </li>         <li>           <img src="' + Ext.BLANK_IMAGE_URL + '" class="icon-pref-appearance"/>           <a id="viewAppearance" href="#">系统主题</a><br />           <span>选择您的系统主题</span>         </li>         <li>           <img src="' + Ext.BLANK_IMAGE_URL + '" class="icon-pref-wallpaper"/>           <a id="viewWallpapers" href="#">桌面背景</a><br />           <span>选择您的桌面背景图片及背景颜色</span>         </li>         <li>           <img src="' + Ext.BLANK_IMAGE_URL + '" class="icon-pref-account"/>           <a id="viewUserMessage" href="#">帐户信息</a><br />           <span>更改您的帐户信息</span>         </li>       </ul>',
        id: A.id
    });
    this.actions = {
        viewShortcuts: function(B) {
            B.viewCard("pref-win-card-6")
        },
        viewAutoRun: function(B) {
            B.viewCard("pref-win-card-5")
        },
        viewQuickstart: function(B) {
            B.viewCard("pref-win-card-2")
        },
        viewAppearance: function(B) {
            B.viewCard("pref-win-card-3")
        },
        viewWallpapers: function(B) {
            B.viewCard("pref-win-card-4")
        },
        viewUserMessage: function(B) {
            B.viewCard("perf-win-card-7")
        }
    }
};

Ext.extend(Sliver.Preferences.NavPanel, Ext.Panel, {
    afterRender: function() {
        this.body.on({
            mousedown: {
                fn: this.doAction,
                scope: this,
                delegate: "a"
            },
            click: {
                fn: Ext.emptyFn,
                scope: null,
                delegate: "a",
                preventDefault: true
            }
        });
        Sliver.Preferences.NavPanel.superclass.afterRender.call(this)
    },
    doAction: function(B, A) {
        B.stopEvent();
        this.actions[A.id](this.owner)
    }
});
//~~
Sliver.Preferences.AutoRun = function(E) {
    this.owner = E.owner;
    this.app = this.owner.app;
    var C = this.app.modules,
    A = this.app.desktop.config.autorun,
    D = B(C, A);
    Sliver.Preferences.AutoRun.superclass.constructor.call(this, {
        autoScroll: true,
        bodyStyle: "padding:10px",
        border: false,
        buttons: [{
            handler: G,
            scope: this,
            text: "保存"
        },
        {
            handler: I,
            scope: this,
            text: "关闭"
        }],
        cls: "pref-card pref-check-tree",
        id: E.id,
        lines: false,
        listeners: {
            checkchange: {
                fn: H,
                scope: this
            }
        },
        loader: new Ext.tree.TreeLoader(),
        rootVisible: false,
        root: new Ext.tree.AsyncTreeNode({
            text: "自动运行程序",
            children: D
        }),
        title: "自动运行程序"
    });
    function B(L, N) {
        var K = [];
        for (var M = 0, J = L.length; M < J; M++) {
            var O = L[M].launcher ? L[M].launcher: L[M];
            if (O.menu) {} else {
                K.push({
                    checked: F(L[M].moduleId, N) ? true: false,
                    iconCls: L[M].launcher.iconCls,
                    id: L[M].moduleId,
                    leaf: true,
                    selected: true,
                    text: O.text || O.menuText
                })
            }
        }
        return K
    }
    function F(M, L) {
        for (var K = 0, J = L.length; K < J; K++) {
            if (M == L[K]) {
                return true
            }
        }
    }
    function H(K, J) {
        if (K.leaf && K.id) {
            if (J) {
                this.app.desktop.addAutoRun(K.id, true)
            } else {
                this.app.desktop.removeAutoRun(K.id, true)
            }
        }
        K.ownerTree.selModel.select(K)
    }
    function I() {
        this.owner.win.close()
    }
    function G() {
        this.owner.save({
            task: "autorun",
            autorun: Ext.encode(this.app.desktop.config.autorun).toString()
        })
    }
};

Ext.extend(Sliver.Preferences.AutoRun, Ext.tree.TreePanel);

//~~
Sliver.Preferences.Shortcuts = function(E) {
    this.owner = E.owner;
    this.app = this.owner.app;
    var C = this.app.modules,
    A = this.app.desktop.config.shortcuts,
    D = B(C, A);
    Sliver.Preferences.Shortcuts.superclass.constructor.call(this, {
        autoScroll: true,
        bodyStyle: "padding:10px",
        border: false,
        buttons: [{
            handler: G,
            scope: this,
            text: "保存"
        },
        {
            handler: I,
            scope: this,
            text: "关闭"
        }],
        cls: "pref-card pref-check-tree",
        id: E.id,
        lines: false,
        listeners: {
            checkchange: {
                fn: H,
                scope: this
            }
        },
        loader: new Ext.tree.TreeLoader(),
        rootVisible: false,
        root: new Ext.tree.AsyncTreeNode({
            text: "快捷方式",
            children: D
        }),
        title: "快捷方式"
    });
    function B(L, N) {
        var K = [];
        for (var M = 0, J = L.length; M < J; M++) {
            var O = L[M].launcher ? L[M].launcher: L[M];
            if (O.menu) {} else {
                K.push({
                    checked: F(L[M].moduleId, N) ? true: false,
                    iconCls: L[M].launcher.iconCls,
                    id: L[M].moduleId,
                    leaf: true,
                    selected: true,
                    text: O.text || O.menuText
                })
            }
        }
        return K
    }
    function F(M, L) {
        for (var K = 0, J = L.length; K < J; K++) {
            if (M == L[K]) {
                return true
            }
        }
    }
    function H(K, J) {
        if (K.leaf && K.id) {
            if (J) {
                this.app.desktop.addShortcut(K.id, true)
            } else {
                this.app.desktop.removeShortcut(K.id, true)
            }
        }
        K.ownerTree.selModel.select(K)
    }
    function I() {
        this.owner.win.close()
    }
    function G() {
        this.owner.save({
            task: "shortcut",
            shortcut: Ext.encode(this.app.desktop.config.shortcuts).toString()
        })
    }
};

Ext.extend(Sliver.Preferences.Shortcuts, Ext.tree.TreePanel);

//~~
Sliver.Preferences.QuickStart = function(E) {
    this.owner = E.owner;
    this.app = this.owner.app;
    var C = this.app.modules,
    A = this.app.desktop.config.quickstart,
    D = B(C, A);
    Sliver.Preferences.QuickStart.superclass.constructor.call(this, {
        autoScroll: true,
        bodyStyle: "padding:10px",
        border: false,
        buttons: [{
            handler: G,
            scope: this,
            text: "保存"
        },
        {
            handler: I,
            scope: this,
            text: "关闭"
        }],
        cls: "pref-card pref-check-tree",
        id: E.id,
        lines: false,
        listeners: {
            checkchange: {
                fn: H,
                scope: this
            }
        },
        loader: new Ext.tree.TreeLoader(),
        rootVisible: false,
        root: new Ext.tree.AsyncTreeNode({
            text: "快速启动",
            children: D
        }),
        title: "快速启动"
    });
    function B(L, N) {
        var K = [];
        for (var M = 0, J = L.length; M < J; M++) {
            var O = L[M].launcher ? L[M].launcher: L[M];
            if (O.menu) {} else {
                K.push({
                    checked: F(L[M].moduleId, N) ? true: false,
                    iconCls: L[M].launcher.iconCls,
                    id: L[M].moduleId,
                    leaf: true,
                    selected: true,
                    text: O.text || O.menuText
                })
            }
        }
        return K
    }
    function F(M, L) {
        for (var K = 0, J = L.length; K < J; K++) {
            if (M == L[K]) {
                return true
            }
        }
    }
    function H(K, J) {
        if (K.leaf && K.id) {
            if (J) {
                this.app.desktop.addQuickStartButton(K.id, true)
            } else {
                this.app.desktop.removeQuickStartButton(K.id, true)
            }
        }
        K.ownerTree.selModel.select(K)
    }
    function I() {
        this.owner.win.close()
    }
    function G() {
        this.owner.save({
            task: "quickstart",
            quickstart: Ext.encode(this.app.desktop.config.quickstart).toString()
        })
    }
};

Ext.extend(Sliver.Preferences.QuickStart, Ext.tree.TreePanel);


Sliver.Preferences.Appearance = function(A) {
    this.owner = A.owner;
    this.app = this.owner.app;
    var N = this.app.getDesktop();
    var M = new Ext.data.JsonStore({
        baseParams: {},
        fields: ["themeID", "themeName", "themeThumbnail", "themePath"],
        id: "themeID",
        root: "themes",
        url: "system/listSystemTheme.action"
    });
    M.load();
    this.store = M;
    M.on("load",
    function(P, O) {
        if (O) {
            D.setTitle("可用主题 (" + O.length + ")");
            var Q = this.app.desktop.config.styles.theme.id;
            if (Q) {
                K.select(String(Q))
            }
        }
    },
    this);
    var H = new Ext.XTemplate('<tpl for=".">', '<div class="pref-view-thumb-wrap" id="{themeID}">', '<div class="pref-view-thumb"><img src="{themeThumbnail}" title="{themeName}" /></div>', "<span>{shortName}</span></div>", "</tpl>", '<div class="x-clear"></div>');
    var K = new Ext.DataView({
        autoHeight: true,
        emptyText: "无可用主题",
        itemSelector: "div.pref-view-thumb-wrap",
        loadingText: "加载中...",
        singleSelect: true,
        overClass: "x-view-over",
        prepareData: function(O) {
            O.shortName = Ext.util.Format.ellipsis(O.name, 17);
            return O
        },
        store: M,
        tpl: H
    });
    K.on("selectionchange", E, this);
    var D = new Ext.Panel({
        border: false,
        cls: "pref-thumbnail-viewer",
        collapsible: true,
        id: "pref-theme-view",
        items: K,
        title: "默认主题",
        titleCollapse: true
    });
    var L = new Ext.Panel({
        autoScroll: true,
        bodyStyle: "padding:10px",
        border: true,
        cls: "pref-card-subpanel",
        id: "themes",
        items: D,
        margins: "10 15 0 15",
        region: "center"
    });
    this.slider = G({
        handler: new Ext.util.DelayedTask(I, this),
        min: 0,
        max: 100,
        x: 15,
        y: 35,
        width: 100
    });
    var B = new Ext.FormPanel({
        border: false,
        height: 70,
        bodyStyle: "font-size:12px;",
        items: [{
            x: 15,
            y: 15,
            xtype: "label",
            text: "设置任务栏 透明度"
        },
        this.slider.slider, this.slider.display],
        layout: "absolute",
        split: false,
        region: "south"
    });
    function G(Q) {
        var X = Q.handler,
        R = Q.min,
        U = Q.max,
        P = Q.width || 100,
        V = Q.x,
        T = Q.y;
        var O = new Ext.Slider({
            width: P,
            maxValue: U,
            minValue: R,
            x: V,
            y: T
        });
        var S = new Ext.form.NumberField({
            cls: "pref-percent-field",
            enableKeyEvents: true,
            maxValue: U,
            minValue: R,
            width: 45,
            x: V + P + 15,
            y: T - 1
        });
        function W(Z) {
            var Y = Z.getValue();
            S.setValue(Y);
            X.delay(100, null, null, [Y])
        }
        O.on({
            change: {
                fn: W,
                scope: this
            },
            drag: {
                fn: W,
                scope: this
            }
        });
        S.on({
            keyup: {
                fn: function(Z) {
                    var Y = Z.getValue();
                    if (Y !== "" && !isNaN(Y) && Y >= Z.minValue && Y <= Z.maxValue) {
                        O.setValue(Y)
                    }
                },
                buffer: 350,
                scope: this
            }
        });
        return {
            slider: O,
            display: S
        }
    }
    Sliver.Preferences.Appearance.superclass.constructor.call(this, {
        border: false,
        buttons: [{
            handler: F,
            scope: this,
            text: "保存"
        },
        {
            handler: J,
            scope: this,
            text: "关闭"
        }],
        cls: "pref-card",
        id: A.id,
        items: [L, B],
        layout: "border",
        title: "系统主题"
    });
    function J() {
        this.owner.win.close()
    }
    function F() {
        var O = this.app.desktop.config.styles;
        this.owner.save({
            task: "theme",
            themeID: O.theme.themeID,
            transparency: O.transparency
        })
    }
    function E(P, R) {
        if (R.length > 0) {
            var O = this.app.desktop.config.styles.theme.themeID,
            Q = P.getRecord(R[0]),
            S = Q.data;
            if (parseInt(O) !== parseInt(Q.id)) {
                if (Q && Q.id && S.themeName && S.themePath) {
                    N.setTheme({
                        themeID: Q.id,
                        themeName: S.themeName,
                        themePath: S.themePath
                    })
                }
            }
        }
    }
    function I(O) {
        N.setTransparency(O)
    }
    function C(P, O) {
        N.setTransparency(O)
    }
};


Ext.extend(Sliver.Preferences.Appearance, Ext.Panel, {
    afterRender: function() {
        Sliver.Preferences.Appearance.superclass.afterRender.call(this);
        this.on("show", this.loadStore, this, {
            single: true
        })
    },
    loadStore: function() {
        this.store.load();
        this.slider.slider.setValue(this.app.desktop.getTransparency())
    }
});


Sliver.Preferences.Background = function(P) {
    this.owner = P.owner;
    this.app = this.owner.app;
    var N = this.app.getDesktop();
    var C = new Ext.data.JsonStore({
        baseParams: {},
        fields: ["wallpaperID", "wallpaperName", "wallpaperThumbnail", "wallpaperPath"],
        id: "wallpaperID",
        root: "wallpapers",
        url: "system/listSystemWallpaper.action"
    });
    C.load();
    this.store = C;
    C.on("load",
    function(T, S) {
        if (S) {
            E.setTitle("可用桌面背景 (" + S.length + ")");
            var U = this.app.desktop.config.styles.wallpaper.id;
            if (U) {
                G.select("wallpaper-" + U)
            }
        }
    },
    this);
    var R = new Ext.XTemplate('<tpl for=".">', '<div class="pref-view-thumb-wrap" id="{wallpaperID}">', '<div class="pref-view-thumb"><img src="{wallpaperThumbnail}" title="{wallpaperName}" /></div>', "<span>{shortName}</span></div>", "</tpl>", '<div class="x-clear"></div>');
    var G = new Ext.DataView({
        autoHeight: true,
        emptyText: "没有可用桌面背景",
        itemSelector: "div.pref-view-thumb-wrap",
        loadingText: "加载中...",
        singleSelect: true,
        overClass: "x-view-over",
        prepareData: function(S) {
            S.shortName = Ext.util.Format.ellipsis(S.name, 17);
            return S
        },
        store: C,
        tpl: R
    });
    G.on("selectionchange", H, this);
    var E = new Ext.Panel({
        border: false,
        cls: "pref-thumbnail-viewer",
        collapsible: true,
        id: "pref-wallpaper-view",
        items: G,
        title: "桌面背景",
        titleCollapse: true
    });
    var D = new Ext.Panel({
        autoScroll: true,
        bodyStyle: "padding:10px",
        border: true,
        cls: "pref-card-subpanel",
        id: "wallpapers",
        items: E,
        margins: "10 15 0 15",
        region: "center"
    });
    var J = this.app.desktop.config.styles.wallpaperposition;
    var M = O("tile", J == "tile" ? true: false, 90, 40);
    var F = O("center", J == "center" ? true: false, 200, 40);
    var Q = new Ext.FormPanel({
        border: false,
        height: 140,
        bodyStyle: "font-size:12px;",
        id: "position",
        items: [{
            border: false,
            items: {
                border: false,
                html: "选择背景图片排列方式?"
            },
            x: 15,
            y: 15
        },
        {
            border: false,
            items: {
                border: false,
                html: '<img class="bg-pos-tile" src="' + Ext.BLANK_IMAGE_URL + '" width="64" height="44" border="0" alt="" />'
            },
            x: 15,
            y: 40
        },
        M, {
            border: false,
            items: {
                border: false,
                html: '<img class="bg-pos-center" src="' + Ext.BLANK_IMAGE_URL + '" width="64" height="44" border="0" alt="" />'
            },
            x: 125,
            y: 40
        },
        F, {
            border: false,
            items: {
                border: false,
                html: "桌面背景颜色"
            },
            x: 245,
            y: 15
        },
        {
            border: false,
            items: new Ext.ColorPalette({
                listeners: {
                    select: {
                        fn: L,
                        scope: this
                    }
                }
            }),
            x: 245,
            y: 40
        },
        {
            border: false,
            items: {
                border: false,
                html: "选择桌面字体颜色"
            },
            x: 425,
            y: 15
        },
        {
            border: false,
            items: new Ext.ColorPalette({
                listeners: {
                    select: {
                        fn: K,
                        scope: this
                    }
                }
            }),
            x: 425,
            y: 40
        }],
        layout: "absolute",
        region: "south",
        split: false
    });
    //~~
    Sliver.Preferences.Background.superclass.constructor.call(this, {
        border: false,
        buttons: [{
            handler: I,
            scope: this,
            text: "保存"
        },
        {
            handler: A,
            scope: this,
            text: "关闭"
        }],
        cls: "pref-card",
        id: P.id,
        items: [D, Q],
        layout: "border",
        title: "桌面背景"
    });
    function O(U, T, S, V) {
        if (U) {
            radio = new Ext.form.Radio({
                name: "position",
                inputValue: U,
                checked: T,
                x: S,
                y: V
            });
            radio.on("check", B, radio);
            return radio
        }
    }
    function A() {
        this.owner.win.close()
    }
    function L(T, S) {
        N.setBackgroundColor(S)
    }
    function K(T, S) {
        N.setFontColor(S)
    }
    function I() {
        var S = this.app.desktop.config.styles;
        this.owner.save({
            task: "wallpaper",
            wallpaperID: S.wallpaper.wallpaperID,
            backgroundColor: S.backgroundcolor,
            fontColor: S.fontcolor,
            wallpaperPosition: S.wallpaperposition
        })
    }
    function H(T, V) {
        if (V.length > 0) {
            var S = this.app.desktop.config.styles.wallpaper.wallpaperID,
            U = T.getRecord(V[0]),
            W = U.data;
            if (parseInt(S) !== parseInt(U.id)) {
                if (U && U.id && W.wallpaperName && W.wallpaperPath) {
                    N.setWallpaper({
                        wallpaperID: U.id,
                        wallpaperName: W.wallpaperName,
                        wallpaperPath: W.wallpaperPath
                    })
                }
            }
        }
    }
    function B(T, S) {
        if (S === true) {
            N.setWallpaperPosition(T.inputValue)
        }
    }
};
Ext.extend(Sliver.Preferences.Background, Ext.Panel, {
    afterRender: function() {
        Sliver.Preferences.Background.superclass.afterRender.call(this)
    }
});

Sliver.Preferences.UserMessage = function(A) {
    this.owner = A.owner;
    Sliver.Preferences.UserMessage.superclass.constructor.call(this, A)
};
Ext.extend(Sliver.Preferences.UserMessage, Ext.Panel, {});
Ext.override(Ext.tree.TreeNodeUI, {
    toggleCheck: function(B) {
        var A = this.checkbox;
        if (A) {
            A.checked = (B === undefined ? !A.checked: B);
            this.fireEvent("checkchange", this.node, A.checked)
        }
    }
});
