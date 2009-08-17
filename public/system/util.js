var ImageUtil = {
    setOpacity: function(B, A) {
        B.filters.alpha.opacity = parseInt(A)
    },
    scaleWidth: function(A, B) {
        var C = new Image();
        C.src = A.src;
        if (C.width > 0 && C.height > 0) {
            if (C.width >= B) {
                A.width = B;
                A.height = (C.height * B) / C.width
            } else {
                A.width = C.width;
                A.height = C.height
            }
        }
    },
    scaleHeight: function(A, B) {
        var C = new Image();
        C.src = A.src;
        if (C.width > 0 && C.height > 0) {
            if (C.height >= B) {
                A.height = B;
                A.width = (C.width * B) / C.height
            } else {
                A.width = C.width;
                A.height = C.height
            }
        }
    },
    scale: function(B, F, D) {
        var G = new Image();
        G.src = B.src;
        if (G.width > 0 && G.height > 0) {
            if (G.height > D || G.width > F) {
                var C = 0,
                A,
                E = false;
                if (G.height > D) {
                    E = true
                }
                if (E) {
                    A = F;
                    C = (G.height * F) / G.width
                }
                if (C == 0 || C > D) {
                    C = D;
                    A = (G.width * D) / G.height
                }
                B.width = A;
                B.height = C
            } else {
                B.width = G.width;
                B.height = G.height
            }
        }
    },
    zoomImg: function(A) {
        var B = parseInt(A.style.zoom, 10) || 100;
        B += event.wheelDelta / 12;
        if (B > 0) {
            A.style.zoom = B + "%"
        }
        return false
    }
};
var SliverUtil = {
    getJson: function(data) {
        return eval("(" + data + ")")
    },
    htmlDecode: function(A) {
        var B = String(A).replace(/&amp;/g, "&").replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"');
        B = B.replace(/\n/g, "<br/>");
        return ! A ? A: B
    },
    markInvalid: function(A, C) {
        for (var B = 0; B < A.getCount(); B++) {
            if (C.fieldErrors[A.itemAt(B).name]) {
                A.itemAt(B).markInvalid(C.fieldErrors[A.itemAt(B).name])
            } else {
                if (C.fieldErrors[A.itemAt(B).id]) {
                    A.itemAt(B).markInvalid(C.fieldErrors[A.itemAt(B).id])
                }
            }
            if (A.itemAt(B).items) {
                this.markInvalid(A.itemAt(B).items, C)
            }
        }
    },
    renderDate: function(B, A) {
        if (Ext.util.Format) {
            return Ext.util.Format.date(B, A)
        }
    },
    renderFile: function(A) {
        if (A === true) {
            return '<img src="images/icons/file.gif" align="center" valign="absmiddle"/>'
        } else {
            return ""
        }
    },
    renderGender: function(A) {
        if ((true === A) || ("true" === A)) {
            return "男"
        } else {
            if ((false === A) || ("false" === A)) {
                return "女"
            }
        }
    },
    renderOfferState: function(A) {
        for (var C = 0; C < SliverData.offerState.length; C++) {
            for (var B = 0; B < SliverData.offerState[C].length; B++) {
                if (A === SliverData.offerState[C][1]) {
                    return SliverData.offerState[C][0]
                }
            }
        }
    },
    renderOrderState: function(A) {
        for (var C = 0; C < SliverData.orderState.length; C++) {
            for (var B = 0; B < SliverData.orderState[C].length; B++) {
                if (A === SliverData.orderState[C][1]) {
                    return SliverData.orderState[C][0]
                }
            }
        }
    },
    gridCnMoney: function(A) {
        A = (Math.round((A - 0) * 100)) / 100;
        A = (A == Math.floor(A)) ? A + ".00": ((A * 10 == Math.floor(A * 10)) ? A + "0": A);
        A = String(A);
        var E = A.split(".");
        var D = E[0];
        var B = E[1] ? "." + E[1] : ".00";
        var C = /(\d+)(\d{3})/;
        while (C.test(D)) {
            D = D.replace(C, "$1,$2")
        }
        A = D + B;
        if (A.charAt(0) == "-") {
            return '-<img src="../images/icons/money_yen.png" align="absbottom"/>' + A.substr(1)
        }
        return '<img src="../images/icons/money_yen.png" align="absbottom"/>' + A
    },
    cnMoney: function(A) {
        A = (Math.round((A - 0) * 100)) / 100;
        A = (A == Math.floor(A)) ? A + ".00": ((A * 10 == Math.floor(A * 10)) ? A + "0": A);
        A = String(A);
        var E = A.split(".");
        var D = E[0];
        var B = E[1] ? "." + E[1] : ".00";
        var C = /(\d+)(\d{3})/;
        while (C.test(D)) {
            D = D.replace(C, "$1,$2")
        }
        A = D + B;
        if (A.charAt(0) == "-") {
            return "-￥" + A.substr(1)
        }
        return "￥" + A
    },
    weekOfDate: function(B, C) {
        if (typeof C === "number") {
            var A = new Date(B);
            A.setDate(A.getDate() + C - A.getDay());
            return A
        } else {
            return null
        }
    }
};