Ext.grid.taskIcon = function(A) {
    Ext.apply(this, A)
};
Ext.grid.taskIcon.prototype = {
    header: "",
    width: 30,
    sortable: false,
    fixed: true,
    menuDisabled: true,
    dataIndex: "taskPercent",
    id: "taskPercent",
    renderer: function(B, C, A, D) {
        if (B >= 100) {
            return '<div class="x-btn-text task-complete" style="width:16px;height:16px;border:none;"></div>'
        } else {
            return '<div class="x-btn-text task-incomplete" style="width:16px;height:16px;border:none;"></div>'
        }
    }
};
Ext.grid.Timer = function(A) {
    Ext.apply(this, A)
};
Ext.grid.Timer.prototype = {
    header: "",
    width: 60,
    sortable: false,
    fixed: true,
    menuDisabled: true,
    dataIndex: "time",
    id: "time",
    css: "background-color:#EFF0F2;text-align:right;height:30px;",
    renderer: function(B, C, A, D) {
        if (A.data.sn === new Date().getHours()) {
            return '<div style="font-weight:bold;color:#FF0000;">' + B + "</div>"
        } else {
            return B
        }
    }
};

Ext.grid.RowExpander = function(A) {
    Ext.apply(this, A);
    this.addEvents({
        beforeexpand: true,
        expand: true,
        beforecollapse: true,
        collapse: true
    });
    Ext.grid.RowExpander.superclass.constructor.call(this);
    if (this.tpl) {
        if (typeof this.tpl == "string") {
            this.tpl = new Ext.Template(this.tpl)
        }
        this.tpl.compile()
    }
    this.state = {};
    this.bodyContent = {}
};
Ext.extend(Ext.grid.RowExpander, Ext.util.Observable, {
    header: "",
    width: 20,
    sortable: false,
    fixed: true,
    menuDisabled: true,
    dataIndex: "",
    id: "expander",
    lazyRender: true,
    enableCaching: true,
    getRowClass: function(A, E, D, C) {
        D.cols = D.cols - 1;
        var B = this.bodyContent[A.id];
        if (!B && !this.lazyRender) {
            B = this.getBodyContent(A, E)
        }
        if (B) {
            D.body = B
        }
        return this.state[A.id] ? "x-grid3-row-expanded": "x-grid3-row-collapsed"
    },
    init: function(B) {
        this.grid = B;
        var A = B.getView();
        A.getRowClass = this.getRowClass.createDelegate(this);
        A.enableRowBody = true;
        B.on("render",
        function() {
            A.mainBody.on("mousedown", this.onMouseDown, this)
        },
        this)
    },
    getBodyContent: function(A, B) {
        if (!this.enableCaching) {
            return this.tpl.apply(A.data)
        }
        var C = this.bodyContent[A.id];
        if (!C) {
            C = this.tpl.apply(A.data);
            this.bodyContent[A.id] = C
        }
        return C
    },
    onMouseDown: function(B, A) {
        if (A.className == "x-grid3-row-expander") {
            B.stopEvent();
            var C = B.getTarget(".x-grid3-row");
            this.toggleRow(C)
        }
    },
    renderer: function(B, C, A) {
        C.cellAttr = 'rowspan="2"';
        return '<div class="x-grid3-row-expander">&#160;</div>'
    },
    beforeExpand: function(B, A, C) {
        if (this.fireEvent("beforeexpand", this, B, A, C) !== false) {
            if (this.tpl && this.lazyRender) {
                A.innerHTML = this.getBodyContent(B, C)
            }
            return true
        } else {
            return false
        }
    },
    toggleRow: function(A) {
        if (typeof A == "number") {
            A = this.grid.view.getRow(A)
        }
        this[Ext.fly(A).hasClass("x-grid3-row-collapsed") ? "expandRow": "collapseRow"](A)
    },
    expandRow: function(C) {
        if (typeof C == "number") {
            C = this.grid.view.getRow(C)
        }
        var B = this.grid.store.getAt(C.rowIndex);
        var A = Ext.DomQuery.selectNode("tr:nth(2) div.x-grid3-row-body", C);
        if (this.beforeExpand(B, A, C.rowIndex)) {
            this.state[B.id] = true;
            Ext.fly(C).replaceClass("x-grid3-row-collapsed", "x-grid3-row-expanded");
            this.fireEvent("expand", this, B, A, C.rowIndex)
        }
    },
    collapseRow: function(C) {
        if (typeof C == "number") {
            C = this.grid.view.getRow(C)
        }
        var B = this.grid.store.getAt(C.rowIndex);
        var A = Ext.fly(C).child("tr:nth(1) div.x-grid3-row-body", true);
        if (this.fireEvent("beforcollapse", this, B, A, C.rowIndex) !== false) {
            this.state[B.id] = false;
            Ext.fly(C).replaceClass("x-grid3-row-expanded", "x-grid3-row-collapsed");
            this.fireEvent("collapse", this, B, A, C.rowIndex)
        }
    }
});
Ext.override(Ext.Window, {
    show: function(C, A, B) {
        if (!this.rendered) {
            this.render(Ext.getBody())
        }
        if (this.hidden === false) {
            this.toFront();
            return
        }
        if (this.fireEvent("beforeshow", this) === false) {
            return
        }
        if (A) {
            this.on("show", A, B, {
                single: true
            })
        }
        this.hidden = false;
        if (C !== undefined) {
            this.setAnimateTarget(C)
        }
        this.beforeShow();
        if (this.animateTarget) {
            this.animShow()
        } else {
            this.afterShow()
        }
        this.toFront()
    }
});
Ext.override(Ext.tree.AsyncTreeNode, {
    expandChildNodes: function(B) {
        var D = this.childNodes;
        for (var C = 0, A = D.length; C < A; C++) {
            if (!D[C].isLeaf()) {
                D[C].expand(B)
            }
        }
    },
    expand: function(B, D, F) {
        if (this.loading) {
            var E;
            var C = function() {
                if (!this.loading) {
                    clearInterval(E);
                    this.expand(B, D, F)
                }
            }.createDelegate(this);
            E = setInterval(C, 200);
            return
        }
        if (!this.loaded) {
            if (this.fireEvent("beforeload", this) === false) {
                return
            }
            this.loading = true;
            this.ui.beforeLoad(this);
            var A = this.loader || this.attributes.loader || this.getOwnerTree().getLoader();
            if (A) {
                A.load(this, this.loadComplete.createDelegate(this, [B, D, F]));
                return
            }
        }
        if (!this.expanded) {
            if (this.fireEvent("beforeexpand", this, B, D) === false) {
                return
            }
            if (!this.childrenRendered) {
                this.renderChildren()
            }
            this.expanded = true;
            if (!this.isHiddenRoot() && (this.getOwnerTree().animate && D !== false) || D) {
                this.ui.animExpand(function() {
                    this.fireEvent("expand", this);
                    if (typeof F == "function") {
                        F(this)
                    }
                    if (B === true) {
                        this.expandChildNodes(true)
                    }
                }.createDelegate(this));
                return
            } else {
                this.ui.expand();
                this.fireEvent("expand", this);
                if (typeof F == "function") {
                    F(this)
                }
            }
        } else {
            if (typeof F == "function") {
                F(this)
            }
        }
        if (B === true) {
            this.expandChildNodes(true)
        }
    }
});
Ext.tree.SliverTreeLoader = function(A) {
    Ext.tree.SliverTreeLoader.superclass.constructor.apply(this, arguments)
};
Ext.extend(Ext.tree.SliverTreeLoader, Ext.tree.TreeLoader, {
    createNode: function(attr) {
        if (this.applyLoader !== false) {
            attr.loader = this
        }
        if (typeof attr.uiProvider == "string") {
            attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider)
        }
        return (new Ext.tree.AsyncTreeNode(attr))
    },
    getParams: function(D) {
        var A = [],
        C = this.baseParams;
        for (var B in C) {
            if (typeof C[B] != "function") {
                A.push(encodeURIComponent(B), "=", encodeURIComponent(C[B]), "&")
            }
        }
        A.push(encodeURIComponent("node"), "=", encodeURIComponent(D.id.substring(D.id.lastIndexOf("-") + 1)), "&");
        return A.join("")
    }
});
Ext.tree.contactNode = function(A) {
    Ext.tree.contactNode.superclass.constructor.apply(this, arguments);
    this.customer = A.customer;
    this.userID = A.userID
};
Ext.extend(Ext.tree.contactNode, Ext.tree.AsyncTreeNode, {
    isCustomer: function() {
        if (this.isLeaf() === true) {
            return false
        }
        return this.customer
    },
    getUserID: function() {
        if (this.userID) {
            return this.userID
        }
    }
});
Ext.tree.ContactTreeLoader = function(A) {
    Ext.tree.ContactTreeLoader.superclass.constructor.apply(this, arguments)
};
Ext.extend(Ext.tree.ContactTreeLoader, Ext.tree.SliverTreeLoader, {
    createNode: function(attr) {
        if (this.applyLoader !== false) {
            attr.loader = this
        }
        if (typeof attr.uiProvider == "string") {
            attr.uiProvider = this.uiProviders[attr.uiProvider] || eval(attr.uiProvider)
        }
        return (new Ext.tree.contactNode(attr))
    },
    getParams: function(D) {
        var A = [],
        C = this.baseParams;
        for (var B in C) {
            if (typeof C[B] != "function") {
                A.push(encodeURIComponent(B), "=", encodeURIComponent(C[B]), "&")
            }
        }
        A.push(encodeURIComponent("node"), "=", encodeURIComponent(D.id.substring(D.id.lastIndexOf("-") + 1)), "&");
        if (D.userID) {
            A.push(encodeURIComponent("userID"), "=", encodeURIComponent(D.userID, "&"))
        }
        return A.join("")
    }
});
Ext.ux.TabCloseMenu = function() {
    var A,
    C,
    B;
    this.init = function(E) {
        A = E;
        A.on("contextmenu", D)
    };
    function D(G, F, H) {
        if (!C) {
            C = new Ext.menu.Menu([{
                id: A.id + "-close",
                text: "关闭标签",
                handler: function() {
                    A.remove(B)
                }
            },
            {
                id: A.id + "-close-others",
                text: "关闭其他标签",
                handler: function() {
                    A.items.each(function(J) {
                        if (J.closable && J != B) {
                            A.remove(J)
                        }
                    })
                }
            }])
        }
        B = F;
        var E = C.items;
        E.get(A.id + "-close").setDisabled(!F.closable);
        var I = true;
        A.items.each(function() {
            if (this != F && this.closable) {
                I = false;
                return false
            }
        });
        E.get(A.id + "-close-others").setDisabled(I);
        C.showAt(H.getPoint())
    }
};
Ext.override(Ext.TabPanel, {
    onStripDblClick: function(B) {
        var A = this.findTargets(B);
        if ((A.item) && (A.item.closable === true)) {
            this.remove(A.item);
            return
        }
    },
    initEvents: function() {
        Ext.TabPanel.superclass.initEvents.call(this);
        this.on("add", this.onAdd, this);
        this.on("remove", this.onRemove, this);
        this.strip.on("dblclick", this.onStripDblClick, this);
        this.strip.on("mousedown", this.onStripMouseDown, this);
        this.strip.on("click", this.onStripClick, this);
        this.strip.on("contextmenu", this.onStripContextMenu, this);
        if (this.enableTabScroll) {
            this.strip.on("mousewheel", this.onWheel, this)
        }
    }
});
Ext.ns("Ext.ux.layout");
Ext.ux.layout.CenterLayout = Ext.extend(Ext.layout.FitLayout, {
    setItemSize: function(B, A) {
        this.container.addClass("ux-layout-center");
        B.addClass("ux-layout-center-item");
        if (B && A.height > 0) {
            if (B.width) {
                A.width = B.width
            }
            B.setSize(A)
        }
    }
});
Ext.Container.LAYOUTS["ux.center"] = Ext.ux.layout.CenterLayout;
Ext.ux.layout.RowLayout = Ext.extend(Ext.layout.ContainerLayout, {
    monitorResize: true,
    isValidParent: function(B, A) {
        return B.getEl().dom.parentNode == this.innerCt.dom
    },
    onLayout: function(F, H) {
        var B = F.items.items,
        G = B.length,
        A,
        C;
        if (!this.innerCt) {
            H.addClass("ux-row-layout-ct");
            this.innerCt = H.createChild({
                cls: "x-row-inner"
            })
        }
        this.renderAll(F, this.innerCt);
        var I = H.getViewSize();
        if (I.width < 1 && I.height < 1) {
            return
        }
        var D = I.height - H.getPadding("tb"),
        E = D;
        this.innerCt.setSize({
            height: D
        });
        for (C = 0; C < G; C++) {
            A = B[C];
            if (!A.rowHeight) {
                E -= (A.getSize().height + A.getEl().getMargins("tb"))
            }
        }
        E = E < 0 ? 0: E;
        for (C = 0; C < G; C++) {
            A = B[C];
            if (A.rowHeight) {
                A.setSize({
                    height: Math.floor(A.rowHeight * E) - A.getEl().getMargins("tb")
                })
            }
        }
    }
});
Ext.Container.LAYOUTS["ux.row"] = Ext.ux.layout.RowLayout;