Ext.ns("Ext.ux");
Ext.ux.Lightbox = (function() {
    var C = {},
    A = [],
    D,
    E = false,
    B = [];
    return {
        overlayOpacity: 0.85,
        animate: true,
        resizeSpeed: 8,
        borderSize: 10,
        labelImage: "Image",
        labelOf: "of",
        init: function() {
            this.resizeDuration = this.animate ? ((11 - this.resizeSpeed) * 0.15) : 0;
            this.overlayDuration = this.animate ? 0.2: 0;
            if (!E) {
                Ext.apply(this, Ext.util.Observable.prototype);
                Ext.util.Observable.constructor.call(this);
                this.addEvents("open", "close");
                this.initMarkup();
                this.initEvents();
                E = true
            }
        },
        initMarkup: function() {
            C.shim = Ext.DomHelper.append(document.body, {
                tag: "iframe",
                id: "ux-lightbox-shim"
            },
            true);
            C.overlay = Ext.DomHelper.append(document.body, {
                id: "ux-lightbox-overlay"
            },
            true);
            var G = new Ext.Template(this.getTemplate());
            C.lightbox = G.append(document.body, {},
            true);
            var H = "outerImageContainer imageContainer image hoverNav navPrev navNext loading loadingLink outerDataContainer dataContainer data details caption imageNumber bottomNav navClose";
            Ext.each(H.split(" "),
            function(I) {
                C[I] = Ext.get("ux-lightbox-" + I)
            });
            C.overlay.visibilityMode = C.lightbox.visibilityMode = C.shim.visibilityMode = Ext.Element.DISPLAY;
            C.overlay.hide();
            C.shim.hide();
            C.lightbox.hide();
            var F = (this.animate ? 250: 1) + "px";
            C.outerImageContainer.setStyle({
                width: F,
                height: F
            })
        },
        getTemplate: function() {
            return ['<div id="ux-lightbox">', '<div id="ux-lightbox-outerImageContainer">', '<div id="ux-lightbox-imageContainer">', '<img id="ux-lightbox-image">', '<div id="ux-lightbox-hoverNav">', '<a href="#" id="ux-lightbox-navPrev"></a>', '<a href="#" id="ux-lightbox-navNext"></a>', "</div>", '<div id="ux-lightbox-loading">', '<a id="ux-lightbox-loadingLink"></a>', "</div>", "</div>", "</div>", '<div id="ux-lightbox-outerDataContainer">', '<div id="ux-lightbox-dataContainer">', '<div id="ux-lightbox-data">', '<div id="ux-lightbox-details">', '<span id="ux-lightbox-caption"></span>', '<span id="ux-lightbox-imageNumber"></span>', "</div>", '<div id="ux-lightbox-bottomNav">', '<a href="#" id="ux-lightbox-navClose"></a>', "</div>", "</div>", "</div>", "</div>", "</div>"]
        },
        initEvents: function() {
            var F = function(G) {
                G.preventDefault();
                this.close()
            };
            C.overlay.on("click", F, this);
            C.loadingLink.on("click", F, this);
            C.navClose.on("click", F, this);
            C.lightbox.on("click",
            function(G) {
                if (G.getTarget().id == "ux-lightbox") {
                    this.close()
                }
            },
            this);
            C.navPrev.on("click",
            function(G) {
                G.preventDefault();
                this.setImage(D - 1)
            },
            this);
            C.navNext.on("click",
            function(G) {
                G.preventDefault();
                this.setImage(D + 1)
            },
            this)
        },
        register: function(F, G) {
            if (B.indexOf(F) === -1) {
                B.push(F);
                Ext.fly(document).on("click",
                function(H) {
                    var I = H.getTarget(F);
                    if (I) {
                        H.preventDefault();
                        this.open(I, F, G)
                    }
                },
                this)
            }
        },
        open: function(H, F, G) {
            G = G || false;
            var I = this.getViewSize();
            C.overlay.setStyle({
                width: I[0] + "px",
                height: I[1] + "px"
            });
            C.shim.setStyle({
                width: I[0] + "px",
                height: I[1] + "px"
            }).show();
            C.overlay.fadeIn({
                duration: this.overlayDuration,
                endOpacity: this.overlayOpacity,
                callback: function() {
                    A = [];
                    var J = 0;
                    if (!G) {
                        A.push([H.href, H.title])
                    } else {
                        var K = Ext.query(F);
                        Ext.each(K,
                        function(O) {
                            if (O.href) {
                                A.push([O.href, O.title])
                            }
                        });
                        while (A[J][0] != H.href) {
                            J++
                        }
                    }
                    var M = Ext.fly(document).getScroll();
                    var N = M.top + (Ext.lib.Dom.getViewportHeight() / 10);
                    var L = M.left;
                    C.lightbox.setStyle({
                        top: N + "px",
                        left: L + "px"
                    }).show();
                    this.setImage(J);
                    this.fireEvent("open", A[J])
                },
                scope: this
            })
        },
        setImage: function(G) {
            D = G;
            this.disableKeyNav();
            if (this.animate) {
                C.loading.show()
            }
            C.image.hide();
            C.hoverNav.hide();
            C.navPrev.hide();
            C.navNext.hide();
            C.dataContainer.setOpacity(0.0001);
            C.imageNumber.hide();
            var F = new Image();
            F.onload = (function() {
                C.image.dom.src = A[D][0];
                this.resizeImage(F.width, F.height)
            }).createDelegate(this);
            F.src = A[D][0]
        },
        resizeImage: function(N, H) {
            var O = C.outerImageContainer.getWidth();
            var L = C.outerImageContainer.getHeight();
            var J = (N + this.borderSize * 2);
            var I = (H + this.borderSize * 2);
            var M = O - J;
            var F = L - I;
            var G = 0;
            if (F != 0 || M != 0) {
                C.outerImageContainer.syncFx().shift({
                    height: I,
                    duration: this.resizeDuration
                }).shift({
                    width: J,
                    duration: this.resizeDuration
                });
                G++
            }
            var K = 0;
            if ((F == 0) && (M == 0)) {
                K = (Ext.isIE) ? 250: 100
            } (function() {
                C.hoverNav.setWidth(C.imageContainer.getWidth() + "px");
                C.navPrev.setHeight(H + "px");
                C.navNext.setHeight(H + "px");
                C.outerDataContainer.setWidth(J + "px");
                this.showImage()
            }).createDelegate(this).defer((this.resizeDuration * 1000) + K)
        },
        showImage: function() {
            C.loading.hide();
            C.image.fadeIn({
                duration: this.resizeDuration,
                scope: this,
                callback: function() {
                    this.updateDetails()
                }
            });
            this.preloadImages()
        },
        updateDetails: function() {
            C.details.setWidth((C.data.getWidth(true) - C.navClose.getWidth() - 10) + "px");
            C.caption.update(A[D][1]);
            C.caption.show();
            if (A.length > 1) {
                C.imageNumber.update(this.labelImage + " " + (D + 1) + " " + this.labelOf + "  " + A.length);
                C.imageNumber.show()
            }
            C.dataContainer.syncFx().slideIn("t", {
                duration: this.resizeDuration / 2
            }).fadeIn({
                duration: this.resizeDuration / 2,
                scope: this,
                callback: function() {
                    var F = this.getViewSize();
                    C.overlay.setHeight(F[1] + "px");
                    this.updateNav()
                }
            })
        },
        updateNav: function() {
            this.enableKeyNav();
            C.hoverNav.show();
            if (D > 0) {
                C.navPrev.show()
            }
            if (D < (A.length - 1)) {
                C.navNext.show()
            }
        },
        enableKeyNav: function() {
            Ext.fly(document).on("keydown", this.keyNavAction, this)
        },
        disableKeyNav: function() {
            Ext.fly(document).un("keydown", this.keyNavAction, this)
        },
        keyNavAction: function(F) {
            var G = F.getKey();
            if (G == 88 || G == 67 || G == 27) {
                this.close()
            } else {
                if (G == 80 || G == 37) {
                    if (D != 0) {
                        this.setImage(D - 1)
                    }
                } else {
                    if (G == 78 || G == 39) {
                        if (D != (A.length - 1)) {
                            this.setImage(D + 1)
                        }
                    }
                }
            }
        },
        preloadImages: function() {
            var F,
            G;
            if (A.length > D + 1) {
                F = new Image();
                F.src = A[D + 1][0]
            }
            if (D > 0) {
                G = new Image();
                G.src = A[D - 1][0]
            }
        },
        close: function() {
            this.disableKeyNav();
            C.lightbox.hide();
            C.overlay.fadeOut({
                duration: this.overlayDuration
            });
            C.shim.hide();
            this.fireEvent("close", D)
        },
        getViewSize: function() {
            return [Ext.lib.Dom.getViewWidth(true), Ext.lib.Dom.getViewHeight(true)]
        }
    }
})();
Ext.onReady(Ext.ux.Lightbox.init, Ext.ux.Lightbox);



Ext.ux.SliderTip = Ext.extend(Ext.Tip, {
    minWidth: 10,
    offsets: [0, -10],
    init: function(A) {
        A.on("dragstart", this.onSlide, this);
        A.on("drag", this.onSlide, this);
        A.on("dragend", this.hide, this);
        A.on("destroy", this.destroy, this)
    },
    onSlide: function(A) {
        this.show();
        this.body.update(this.getText(A));
        this.doAutoWidth();
        this.el.alignTo(A.thumb, "b-t?", this.offsets)
    },
    getText: function(A) {
        return A.getValue()
    }
});
Ext.namespace("Ext.ux.Andrie");
Ext.ux.Andrie.pPageSize = function(A) {
    Ext.apply(this, A)
};
Ext.extend(Ext.ux.Andrie.pPageSize, Ext.util.Observable, {
    beforeText: "行/页:",
    afterText: "",
    addBefore: "-",
    addAfter: null,
    dynamic: false,
    variations: [5, 10, 20, 30, 50, 100, 200, 500],
    comboCfg: undefined,
    init: function(A) {
        this.pagingToolbar = A;
        this.pagingToolbar.pageSizeCombo = this;
        this.pagingToolbar.setPageSize = this.setPageSize.createDelegate(this);
        this.pagingToolbar.getPageSize = this.getPageSize.createDelegate(this);
        this.pagingToolbar.on("render", this.onRender, this)
    },
    addSize: function(A) {
        if (A > 0) {
            this.sizes.push([A])
        }
    },
    updateStore: function() {
        if (this.dynamic) {
            var B = this.pagingToolbar.pageSize,
            E;
            B = (B > 0) ? B: 1;
            this.sizes = [];
            var C = this.variations;
            for (var D = 0, A = C.length; D < A; D++) {
                this.addSize(B - C[C.length - 1 - D])
            }
            this.addToStore(B);
            for (var D = 0, A = C.length; D < A; D++) {
                this.addSize(B + C[D])
            }
        } else {
            if (!this.staticSizes) {
                this.sizes = [];
                var C = this.variations;
                var B = 0;
                for (var D = 0, A = C.length; D < A; D++) {
                    this.addSize(B + C[D])
                }
                this.staticSizes = this.sizes.slice(0)
            } else {
                this.sizes = this.staticSizes.slice(0)
            }
        }
        this.combo.store.loadData(this.sizes);
        this.combo.collapse();
        this.combo.setValue(this.pagingToolbar.pageSize)
    },
    getPageSize: function() {
        return this.pagingToolbar.pageSize
    },
    setPageSize: function(E, H) {
        var I = this.pagingToolbar;
        this.combo.collapse();
        E = parseInt(E) || parseInt(this.combo.getValue());
        E = (E > 0) ? E: 1;
        if (E == I.pageSize) {
            return
        } else {
            if (E < I.pageSize) {
                I.pageSize = E;
                var A = Math.round(I.cursor / E) + 1;
                var G = (A - 1) * E;
                var F = I.store;
                if (G > F.getTotalCount()) {
                    this.pagingToolbar.pageSize = E;
                    this.pagingToolbar.doLoad(G - E)
                } else {
                    F.suspendEvents();
                    for (var B = 0, C = G - I.cursor; B < C; B++) {
                        F.remove(F.getAt(0))
                    }
                    while (F.getCount() > E) {
                        F.remove(F.getAt(F.getCount() - 1))
                    }
                    F.resumeEvents();
                    F.fireEvent("datachanged", F);
                    I.cursor = G;
                    var D = I.getPageData();
                    I.afterTextEl.el.innerHTML = String.format(I.afterPageText, D.pages);
                    I.field.dom.value = A;
                    I.first.setDisabled(A == 1);
                    I.prev.setDisabled(A == 1);
                    I.next.setDisabled(A == D.pages);
                    I.last.setDisabled(A == D.pages);
                    I.updateInfo()
                }
            } else {
                this.pagingToolbar.pageSize = E;
                this.pagingToolbar.doLoad(Math.floor(this.pagingToolbar.cursor / this.pagingToolbar.pageSize) * this.pagingToolbar.pageSize)
            }
        }
        this.updateStore()
    },
    onRender: function() {
        this.combo = Ext.ComponentMgr.create(Ext.applyIf(this.comboCfg || {},
        {
            store: new Ext.data.SimpleStore({
                fields: ["pageSize"],
                data: []
            }),
            displayField: "pageSize",
            valueField: "pageSize",
            mode: "local",
            triggerAction: "all",
            width: 50,
            xtype: "combo"
        }));
        this.combo.on("select", this.setPageSize, this);
        this.updateStore();
        if (this.addBefore) {
            this.pagingToolbar.add(this.addBefore)
        }
        if (this.beforeText) {
            this.pagingToolbar.add(this.beforeText)
        }
        this.pagingToolbar.add(this.combo);
        if (this.afterText) {
            this.pagingToolbar.add(this.afterText)
        }
        if (this.addAfter) {
            this.pagingToolbar.add(this.addAfter)
        }
    }
});