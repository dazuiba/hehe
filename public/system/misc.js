function SoundManager(B, A){
    this.flashVersion = 8;
    this.debugMode = true;
    this.useConsole = true;
    this.consoleOnly = false;
    this.waitForWindowLoad = false;
    this.nullURL = "data/null.mp3";
    this.allowPolling = true;
    this.defaultOptions = {
        autoLoad: false,
        stream: true,
        autoPlay: false,
        onid3: null,
        onload: null,
        whileloading: null,
        onplay: null,
        onpause: null,
        onresume: null,
        whileplaying: null,
        onstop: null,
        onfinish: null,
        onbeforefinish: null,
        onbeforefinishtime: 5000,
        onbeforefinishcomplete: null,
        onjustbeforefinish: null,
        onjustbeforefinishtime: 200,
        multiShot: true,
        position: null,
        pan: 0,
        volume: 100
    };
    this.flash9Options = {
        usePeakData: false,
        useWaveformData: false,
        useEQData: false
    };
    this.flashBlockHelper = {
        enabled: false,
        message: ['<div id="sm2-flashblock" style="position:fixed;left:0px;top:0px;width:100%;min-height:24px;z-index:9999;background:#666;color:#fff;font-family:helvetica,verdana,arial;font-size:11px;border-bottom:1px solid #333;opacity:0.95">', '<div style="float:right;display:inline;margin-right:0.5em;color:#999;line-height:24px">[<a href="#noflashblock" onclick="document.getElementById(\'sm2-flashblock\').style.display=\'none\'" title="Go away! :)" style="color:#fff;text-decoration:none">x</a>]</div>', '<div id="sm2-flashmovie" style="float:left;display:inline;margin-left:0.5em;margin-right:0.5em"><!-- [flash] --></div>', '<div style="padding-left:0.5em;padding-right:0.5em;line-height:24px">Using Flashblock? Please right-click the icon and "<b>allow flash from this site</b>" to enable sound/audio features, and then reload this page.</div>', "</div>"]
    };
    var C = this;
    this.version = null;
    this.versionNumber = "V2.77a.20080901";
    this.movieURL = null;
    this.url = null;
    this.swfLoaded = false;
    this.enabled = false;
    this.o = null;
    this.id = (A || "sm2movie");
    this.oMC = null;
    this.sounds = [];
    this.soundIDs = [];
    this.muted = false;
    this.isIE = (navigator.userAgent.match(/MSIE/i));
    this.isSafari = (navigator.userAgent.match(/safari/i));
    this.isGecko = (navigator.userAgent.match(/gecko/i));
    this.debugID = "soundmanager-debug";
    this._debugOpen = true;
    this._didAppend = false;
    this._appendSuccess = false;
    this._didInit = false;
    this._disabled = false;
    this._windowLoaded = false;
    this._hasConsole = (typeof console != "undefined" && typeof console.log != "undefined");
    this._debugLevels = ["log", "info", "warn", "error"];
    this._defaultFlashVersion = 8;
    this.features = {
        peakData: false,
        waveformData: false,
        eqData: false
    };
    this.sandbox = {
        type: null,
        types: {
            remote: "remote (domain-based) rules",
            localWithFile: "local with file access (no internet access)",
            localWithNetwork: "local with network (internet access only, no local access)",
            localTrusted: "local, trusted (local + internet access)"
        },
        description: null,
        noRemote: null,
        noLocal: null
    };
    this._setVersionInfo = function() {
        if (C.flashVersion != 8 && C.flashVersion != 9) {
            alert('soundManager.flashVersion must be 8 or 9. "' + C.flashVersion + '" is invalid. Reverting to ' + C._defaultFlashVersion + ".");
            C.flashVersion = C._defaultFlashVersion
        }
        C.version = C.versionNumber + (C.flashVersion == 9 ? " (AS3/Flash 9)": " (AS2/Flash 8)");
        C.movieURL = (C.flashVersion == 8 ? "soundmanager2.swf": "soundmanager2_flash9.swf");
        C.features.peakData = C.features.waveformData = C.features.eqData = (C.flashVersion == 9)
    };
    this._overHTTP = (document.location ? document.location.protocol.match(/http/i) : null);
    this._waitingforEI = false;
    this._initPending = false;
    this._tryInitOnFocus = (this.isSafari && typeof document.hasFocus == "undefined");
    this._isFocused = (typeof document.hasFocus != "undefined" ? document.hasFocus() : null);
    this._okToDisable = !this._tryInitOnFocus;
    var D = "http://www.macromedia.com/support/documentation/en/flashplayer/help/settings_manager04.html";
    this.supported = function() {
        return (C._didInit && !C._disabled)
    };
    this.getMovie = function(G) {
        return C.isIE ? window[G] : (C.isSafari ? document.getElementById(G) || document[G] : document.getElementById(G))
    };
    this.loadFromXML = function(G) {
        try {
            C.o._loadFromXML(G)
        } catch(H) {
            C._failSafely();
            return true
        }
    };
    this.createSound = function(G) {
        if (!C._didInit) {
            throw new Error("soundManager.createSound(): Not loaded yet - wait for soundManager.onload() before calling sound-related methods")
        }
        if (arguments.length == 2) {
            G = {
                id: arguments[0],
                url: arguments[1]
            }
        }
        var H = C._mergeObjects(G);
        if (C._idCheck(H.id, true)) {
            return C.sounds[H.id]
        }
        C.sounds[H.id] = new E(C, H);
        C.soundIDs[C.soundIDs.length] = H.id;
        if (C.flashVersion == 8) {
            C.o._createSound(H.id, H.onjustbeforefinishtime)
        } else {
            C.o._createSound(H.id, H.url, H.onjustbeforefinishtime, H.usePeakData, H.useWaveformData, H.useEQData)
        }
        if (H.autoLoad || H.autoPlay) {
            window.setTimeout(function() {
                C.sounds[H.id].load(H)
            },
            20)
        }
        if (H.autoPlay) {
            if (C.flashVersion == 8) {
                C.sounds[H.id].playState = 1
            } else {
                C.sounds[H.id].play()
            }
        }
        return C.sounds[H.id]
    };
    this.destroySound = function(H, G) {
        if (!C._idCheck(H)) {
            return false
        }
        for (var I = 0; I < C.soundIDs.length; I++) {
            if (C.soundIDs[I] == H) {
                C.soundIDs.splice(I, 1);
                continue
            }
        }
        C.sounds[H].unload();
        if (!G) {
            C.sounds[H].destruct()
        }
        delete C.sounds[H]
    };
    this.load = function(G, H) {
        if (!C._idCheck(G)) {
            return false
        }
        C.sounds[G].load(H)
    };
    this.unload = function(G) {
        if (!C._idCheck(G)) {
            return false
        }
        C.sounds[G].unload()
    };
    this.play = function(G, H) {
        if (!C._idCheck(G)) {
            if (typeof H != "Object") {
                H = {
                    url: H
                }
            }
            if (H && H.url) {
                H.id = G;
                C.createSound(H)
            } else {
                return false
            }
        }
        C.sounds[G].play(H)
    };
    this.start = this.play;
    this.setPosition = function(G, H) {
        if (!C._idCheck(G)) {
            return false
        }
        C.sounds[G].setPosition(H)
    };
    this.stop = function(G) {
        if (!C._idCheck(G)) {
            return false
        }
        C.sounds[G].stop()
    };
    this.stopAll = function() {
        for (var G in C.sounds) {
            if (C.sounds[G] instanceof E) {
                C.sounds[G].stop()
            }
        }
    };
    this.pause = function(G) {
        if (!C._idCheck(G)) {
            return false
        }
        C.sounds[G].pause()
    };
    this.resume = function(G) {
        if (!C._idCheck(G)) {
            return false
        }
        C.sounds[G].resume()
    };
    this.togglePause = function(G) {
        if (!C._idCheck(G)) {
            return false
        }
        C.sounds[G].togglePause()
    };
    this.setPan = function(G, H) {
        if (!C._idCheck(G)) {
            return false
        }
        C.sounds[G].setPan(H)
    };
    this.setVolume = function(H, G) {
        if (!C._idCheck(H)) {
            return false
        }
        C.sounds[H].setVolume(G)
    };
    this.mute = function(G) {
        if (typeof G != "string") {
            G = null
        }
        if (!G) {
            var I = null;
            for (var H = C.soundIDs.length; H--;) {
                C.sounds[C.soundIDs[H]].mute()
            }
            C.muted = true
        } else {
            if (!C._idCheck(G)) {
                return false
            }
            C.sounds[G].mute()
        }
    };
    this.unmute = function(G) {
        if (typeof G != "string") {
            G = null
        }
        if (!G) {
            var I = null;
            for (var H = C.soundIDs.length; H--;) {
                C.sounds[C.soundIDs[H]].unmute()
            }
            C.muted = false
        } else {
            if (!C._idCheck(G)) {
                return false
            }
            C.sounds[G].unmute()
        }
    };
    this.setPolling = function(G) {
        if (!C.o || !C.allowPolling) {
            return false
        }
        C.o._setPolling(G)
    };
    this.disable = function(G) {
        if (C._disabled) {
            return false
        }
        if (!G && C.flashBlockHelper.enabled) {
            C.handleFlashBlock()
        }
        C._disabled = true;
        for (var H = C.soundIDs.length; H--;) {
            C._disableObject(C.sounds[C.soundIDs[H]])
        }
        C.initComplete();
        C._disableObject(C)
    };
    this.handleFlashBlock = function(I) {
        function H() {
            var M = document.getElementById("sm2-flashblock");
            if (!M) {
                try {
                    var K = document.getElementById("sm2-container");
                    if (K) {
                        K.parentNode.removeChild(K)
                    }
                    var N = document.createElement("div");
                    N.innerHTML = C.flashBlockHelper.message.join("").replace("<!-- [flash] -->", C._html);
                    C._getDocument().appendChild(N);
                    window.setTimeout(function() {
                        var O = document.getElementById("sm2-flashmovie").getElementsByTagName("div")[0];
                        O.style.background = "url(chrome://flashblock/skin/flash-disabled-16.png) 0px 0px no-repeat";
                        O.style.border = "none";
                        O.style.minWidth = "";
                        O.style.minHeight = "";
                        O.style.width = "16px";
                        O.style.height = "16px";
                        O.style.marginTop = "4px";
                        O.onmouseover = null;
                        O.onmouseout = null;
                        O.onclick = null;
                        document.getElementById("sm2-flashmovie").onclick = O.onclick
                    },
                    1)
                } catch(L) {
                    return false
                }
            } else {
                M.style.display = "block"
            }
            this.onload = null
        }
        if (I) {
            H();
            return false
        }
        if (!C.isGecko) {
            return false
        }
        if (window.location.toString().match(/\#noflashblock/i)) {
            return false
        }
        var J = "chrome://flashblock/skin/flash-disabled-16.png";
        var G = new Image();
        G.style.position = "absolute";
        G.style.left = "-256px";
        G.style.top = "-256px";
        G.onload = H;
        G.onerror = function() {
            this.onerror = null
        };
        G.src = J;
        C._getDocument().appendChild(G)
    };
    this.getSoundById = function(H, I) {
        if (!H) {
            throw new Error("SoundManager.getSoundById(): sID is null/undefined")
        }
        var G = C.sounds[H];
        if (!G && !I) {}
        return G
    };
    this.onload = function() {};
    this.onerror = function() {};
    this._idCheck = this.getSoundById;
    this._disableObject = function(H) {
        for (var G in H) {
            if (typeof H[G] == "function" && typeof H[G]._protected == "undefined") {
                H[G] = function() {
                    return false
                }
            }
        }
        G = null
    };
    this._failSafely = function() {
        var I = "You may need to whitelist this location/domain eg. file:///C:/ or C:/ or mysite.com, or set ALWAYS ALLOW under the Flash Player Global Security Settings page. The latter is probably less-secure.";
        var H = '<a href="' + D + '" title="' + I + '">view/edit</a>';
        var G = '<a href="' + D + '" title="Flash Player Global Security Settings">FPGSS</a>';
        if (!C._disabled) {
            C.disable()
        }
    };
    this._normalizeMovieURL = function(G) {
        if (G) {
            if (G.match(/\.swf/)) {
                G = G.substr(0, G.lastIndexOf(".swf"))
            }
            if (G.lastIndexOf("/") != G.length - 1) {
                G = G + "/"
            }
        }
        return (G && G.lastIndexOf("/") != -1 ? G.substr(0, G.lastIndexOf("/") + 1) : "./") + C.movieURL
    };
    this._getDocument = function() {
        return (document.body ? document.body: (document.documentElement ? document.documentElement: document.getElementsByTagName("div")[0]))
    };
    this._getDocument._protected = true;
    this._createMovie = function(I, H) {
        if (C._didAppend && C._appendSuccess) {
            return false
        }
        if (window.location.href.indexOf("debug=1") + 1) {
            C.debugMode = true
        }
        C._didAppend = true;
        C._setVersionInfo();
        C.url = C._normalizeMovieURL(H ? H: C.url);
        H = C.url;
        var R = '<embed name="' + I + '" id="' + I + '" src="' + H + '" width="1" height="1" quality="high" allowScriptAccess="always" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash"></embed>';
        var N = '<object id="' + I + '" data="' + H + '" type="application/x-shockwave-flash" width="1" height="1"><param name="movie" value="' + H + '" /><param name="AllowScriptAccess" value="always" /><!-- --></object>';
        html = (!C.isIE ? R: N);
        C._html = html;
        var P = '<div id="' + C.debugID + '-toggle" style="position:fixed;_position:absolute;right:0px;bottom:0px;_top:0px;width:1.2em;height:1.2em;line-height:1.2em;margin:2px;padding:0px;text-align:center;border:1px solid #999;cursor:pointer;background:#fff;color:#333;z-index:706" title="Toggle SM2 debug console" onclick="soundManager._toggleDebug()">-</div>';
        var M = '<div id="' + C.debugID + '" style="display:' + (C.debugMode && ((!C._hasConsole || !C.useConsole) || (C.useConsole && C._hasConsole && !C.consoleOnly)) ? "block": "none") + ';opacity:0.85"></div>';
        var L = "soundManager._createMovie(): appendChild/innerHTML set failed. May be app/xhtml+xml DOM-related.";
        var J = '<div id="sm2-container" style="position:absolute;left:-256px;top:-256px;width:1px;height:1px" class="movieContainer">' + html + "</div>" + (C.debugMode && ((!C._hasConsole || !C.useConsole) || (C.useConsole && C._hasConsole && !C.consoleOnly)) && !document.getElementById(C.debugID) ? "x" + M + P: "");
        var G = C._getDocument();
        if (G) {
            C.oMC = document.createElement("div");
            C.oMC.id = "sm2-container";
            C.oMC.className = "movieContainer";
            C.oMC.style.position = "absolute";
            C.oMC.style.left = "-256px";
            C.oMC.style.width = "1px";
            C.oMC.style.height = "1px";
            try {
                G.appendChild(C.oMC);
                C.oMC.innerHTML = html;
                C._appendSuccess = true
            } catch(O) {
                throw new Error(L)
            }
            if (!document.getElementById(C.debugID) && ((!C._hasConsole || !C.useConsole) || (C.useConsole && C._hasConsole && !C.consoleOnly))) {
                var Q = document.createElement("div");
                Q.id = C.debugID;
                Q.style.display = (C.debugMode ? "block": "none");
                if (C.debugMode) {
                    try {
                        var K = document.createElement("div");
                        G.appendChild(K);
                        K.innerHTML = P
                    } catch(O) {
                        throw new Error(L)
                    }
                }
                G.appendChild(Q)
            }
            G = null
        }
    };
    this._writeDebug = function(G, I, H) {};
    this._writeDebug._protected = true;
    this._writeDebugAlert = function(G) {
        alert(G)
    };
    if (window.location.href.indexOf("debug=alert") + 1 && C.debugMode) {}
    this._toggleDebug = function() {
        var H = document.getElementById(C.debugID);
        var G = document.getElementById(C.debugID + "-toggle");
        if (!H) {
            return false
        }
        if (C._debugOpen) {
            G.innerHTML = "+";
            H.style.display = "none"
        } else {
            G.innerHTML = "-";
            H.style.display = "block"
        }
        C._debugOpen = !C._debugOpen
    };
    this._toggleDebug._protected = true;
    this._debug = function() {
        for (var H = 0, G = C.soundIDs.length; H < G; H++) {
            C.sounds[C.soundIDs[H]]._debug()
        }
    };
    this._mergeObjects = function(H, G) {
        var K = {};
        for (var I in H) {
            K[I] = H[I]
        }
        var J = (typeof G == "undefined" ? C.defaultOptions: G);
        for (var L in J) {
            if (typeof K[L] == "undefined") {
                K[L] = J[L]
            }
        }
        return K
    };
    this.createMovie = function(G) {
        if (G) {
            C.url = G
        }
        C._initMovie()
    };
    this.go = this.createMovie;
    this._initMovie = function() {
        if (C.o) {
            return false
        }
        C.o = C.getMovie(C.id);
        if (!C.o) {
            C._createMovie(C.id, C.url);
            C.o = C.getMovie(C.id)
        }
        if (C.o) {}
    };
    this.waitForExternalInterface = function() {
        if (C._waitingForEI) {
            return false
        }
        C._waitingForEI = true;
        if (C._tryInitOnFocus && !C._isFocused) {
            return false
        }
        if (!C._didInit) {}
        setTimeout(function() {
            if (!C._didInit) {
                if (!C._overHTTP) {}
            }
            if (!C._didInit && C._okToDisable) {
                C._failSafely()
            }
        },
        750)
    };
    this.handleFocus = function() {
        if (C._isFocused || !C._tryInitOnFocus) {
            return true
        }
        C._okToDisable = true;
        C._isFocused = true;
        if (C._tryInitOnFocus) {
            window.removeEventListener("mousemove", C.handleFocus, false)
        }
        C._waitingForEI = false;
        setTimeout(C.waitForExternalInterface, 500);
        if (window.removeEventListener) {
            window.removeEventListener("focus", C.handleFocus, false)
        } else {
            if (window.detachEvent) {
                window.detachEvent("onfocus", C.handleFocus)
            }
        }
    };
    this.initComplete = function() {
        if (C._didInit) {
            return false
        }
        C._didInit = true;
        if (C._disabled) {
            C.onerror.apply(window);
            return false
        }
        if (C.waitForWindowLoad && !C._windowLoaded) {
            if (window.addEventListener) {
                window.addEventListener("load", C.initUserOnload, false)
            } else {
                if (window.attachEvent) {
                    window.attachEvent("onload", C.initUserOnload)
                }
            }
            return false
        } else {
            if (C.waitForWindowLoad && C._windowLoaded) {}
            C.initUserOnload()
        }
    };
    this.initUserOnload = function() {
        try {
            C.onload.apply(window)
        } catch(G) {
            setTimeout(function() {
                throw new Error(G)
            },
            20);
            return false
        }
    };
    this.init = function() {
        C._initMovie();
        if (C._didInit) {
            return false
        }
        if (window.removeEventListener) {
            window.removeEventListener("load", C.beginDelayedInit, false)
        } else {
            if (window.detachEvent) {
                window.detachEvent("onload", C.beginDelayedInit)
            }
        }
        try {
            C.o._externalInterfaceTest(false);
            C.setPolling(true);
            if (!C.debugMode) {
                C.o._disableDebug()
            }
            C.enabled = true
        } catch(G) {
            C._failSafely();
            C.initComplete();
            return false
        }
        C.initComplete()
    };
    this.beginDelayedInit = function() {
        C._windowLoaded = true;
        setTimeout(C.waitForExternalInterface, 500);
        setTimeout(C.beginInit, 20)
    };
    this.beginInit = function() {
        if (C._initPending) {
            return false
        }
        C.createMovie();
        C._initMovie();
        C._initPending = true;
        return true
    };
    this.domContentLoaded = function() {
        if (document.removeEventListener) {
            document.removeEventListener("DOMContentLoaded", C.domContentLoaded, false)
        }
        C.go()
    };
    this._externalInterfaceOK = function() {
        if (C.swfLoaded) {
            return false
        }
        C.swfLoaded = true;
        C._tryInitOnFocus = false;
        if (C.isIE) {
            setTimeout(C.init, 100)
        } else {
            C.init()
        }
    };
    this._setSandboxType = function(G) {
        var H = C.sandbox;
        H.type = G;
        H.description = H.types[(typeof H.types[G] != "undefined" ? G: "unknown")];
        if (H.type == "localWithFile") {
            H.noRemote = true;
            H.noLocal = false
        } else {
            if (H.type == "localWithNetwork") {
                H.noRemote = false;
                H.noLocal = true
            } else {
                if (H.type == "localTrusted") {
                    H.noRemote = false;
                    H.noLocal = false
                }
            }
        }
    };
    this.destruct = function() {
        C.disable(true)
    };
    function E(I, H) {
        var G = this;
        var J = I;
        this.sID = H.id;
        this.url = H.url;
        this.options = J._mergeObjects(H);
        this.instanceOptions = this.options;
        this._debug = function() {
            if (J.debugMode) {
                var M = null;
                var O = [];
                var L = null;
                var N = null;
                var K = 64;
                for (M in G.options) {
                    if (G.options[M] != null) {
                        if (G.options[M] instanceof Function) {
                            L = G.options[M].toString();
                            L = L.replace(/\s\s+/g, " ");
                            N = L.indexOf("{");
                            O[O.length] = " " + M + ": {" + L.substr(N + 1, (Math.min(Math.max(L.indexOf("\n") - 1, K), K))).replace(/\n/g, "") + "... }"
                        } else {
                            O[O.length] = " " + M + ": " + G.options[M]
                        }
                    }
                }
            }
        };
        this._debug();
        this.id3 = {};
        G.resetProperties = function(K) {
            G.bytesLoaded = null;
            G.bytesTotal = null;
            G.position = null;
            G.duration = null;
            G.durationEstimate = null;
            G.loaded = false;
            G.loadSuccess = null;
            G.playState = 0;
            G.paused = false;
            G.readyState = 0;
            G.muted = false;
            G.didBeforeFinish = false;
            G.didJustBeforeFinish = false;
            G.instanceOptions = {};
            G.instanceCount = 0;
            G.peakData = {
                left: 0,
                right: 0
            };
            G.waveformData = [];
            G.eqData = []
        };
        G.resetProperties();
        this.load = function(K) {
            G.instanceOptions = J._mergeObjects(K);
            if (typeof G.instanceOptions.url == "undefined") {
                G.instanceOptions.url = G.url
            }
            if (G.instanceOptions.url == G.url && G.readyState != 0 && G.readyState != 2) {
                return false
            }
            G.loaded = false;
            G.loadSuccess = null;
            G.readyState = 1;
            G.playState = (K.autoPlay ? 1: 0);
            try {
                if (J.flashVersion == 8) {
                    J.o._load(G.sID, G.instanceOptions.url, G.instanceOptions.stream, G.instanceOptions.autoPlay, (G.instanceOptions.whileloading ? 1: 0))
                } else {
                    J.o._load(G.sID, G.instanceOptions.url, G.instanceOptions.stream ? true: false, G.instanceOptions.autoPlay ? true: false)
                }
            } catch(L) {
                J.onerror();
                J.disable()
            }
        };
        this.unload = function() {
            if (G.readyState != 0) {
                G.setPosition(0);
                J.o._unload(G.sID, J.nullURL);
                G.resetProperties()
            }
        };
        this.destruct = function() {
            J.o._destroySound(G.sID);
            J.destroySound(G.sID, true)
        };
        this.play = function(L) {
            if (!L) {
                L = {}
            }
            G.instanceOptions = J._mergeObjects(L, G.instanceOptions);
            G.instanceOptions = J._mergeObjects(G.instanceOptions, G.options);
            if (G.playState == 1) {
                var K = G.instanceOptions.multiShot;
                if (!K) {
                    return false
                } else {}
            }
            if (!G.loaded) {
                if (G.readyState == 0) {
                    G.instanceOptions.stream = true;
                    G.instanceOptions.autoPlay = true;
                    G.load(G.instanceOptions)
                } else {
                    if (G.readyState == 2) {
                        return false
                    } else {}
                }
            } else {}
            if (G.paused) {
                G.resume()
            } else {
                G.playState = 1;
                if (!G.instanceCount || J.flashVersion == 9) {
                    G.instanceCount++
                }
                G.position = (typeof G.instanceOptions.position != "undefined" && !isNaN(G.instanceOptions.position) ? G.instanceOptions.position: 0);
                if (G.instanceOptions.onplay) {
                    G.instanceOptions.onplay.apply(G)
                }
                G.setVolume(G.instanceOptions.volume);
                G.setPan(G.instanceOptions.pan);
                J.o._start(G.sID, G.instanceOptions.loop || 1, (J.flashVersion == 9 ? G.position: G.position / 1000))
            }
        };
        this.start = this.play;
        this.stop = function(K) {
            if (G.playState == 1) {
                G.playState = 0;
                G.paused = false;
                if (G.instanceOptions.onstop) {
                    G.instanceOptions.onstop.apply(G)
                }
                J.o._stop(G.sID, K);
                G.instanceCount = 0;
                G.instanceOptions = {}
            }
        };
        this.setPosition = function(K) {
            G.instanceOptions.position = K;
            J.o._setPosition(G.sID, (J.flashVersion == 9 ? G.instanceOptions.position: G.instanceOptions.position / 1000), (G.paused || !G.playState))
        };
        this.pause = function() {
            if (G.paused) {
                return false
            }
            G.paused = true;
            J.o._pause(G.sID);
            if (G.instanceOptions.onpause) {
                G.instanceOptions.onpause.apply(G)
            }
        };
        this.resume = function() {
            if (!G.paused) {
                return false
            }
            G.paused = false;
            J.o._pause(G.sID);
            if (G.instanceOptions.onresume) {
                G.instanceOptions.onresume.apply(G)
            }
        };
        this.togglePause = function() {
            if (!G.playState) {
                G.play({
                    position: (J.flashVersion == 9 ? G.position: G.position / 1000)
                });
                return false
            }
            if (G.paused) {
                G.resume()
            } else {
                G.pause()
            }
        };
        this.setPan = function(K) {
            if (typeof K == "undefined") {
                K = 0
            }
            J.o._setPan(G.sID, K);
            G.instanceOptions.pan = K
        };
        this.setVolume = function(K) {
            if (typeof K == "undefined") {
                K = 100
            }
            J.o._setVolume(G.sID, (J.muted && !G.muted) || G.muted ? 0: K);
            G.instanceOptions.volume = K
        };
        this.mute = function() {
            G.muted = true;
            J.o._setVolume(G.sID, 0)
        };
        this.unmute = function() {
            G.muted = false;
            J.o._setVolume(G.sID, typeof G.instanceOptions.volume != "undefined" ? G.instanceOptions.volume: G.options.volume)
        };
        this._whileloading = function(K, L, M) {
            G.bytesLoaded = K;
            G.bytesTotal = L;
            G.duration = Math.floor(M);
            G.durationEstimate = parseInt((G.bytesTotal / G.bytesLoaded) * G.duration);
            if (G.readyState != 3 && G.instanceOptions.whileloading) {
                G.instanceOptions.whileloading.apply(G)
            }
        };
        this._onid3 = function(N, K) {
            var O = [];
            for (var M = 0, L = N.length; M < L; M++) {
                O[N[M]] = K[M]
            }
            G.id3 = J._mergeObjects(G.id3, O);
            if (G.instanceOptions.onid3) {
                G.instanceOptions.onid3.apply(G)
            }
        };
        this._whileplaying = function(L, M, K, N) {
            if (isNaN(L) || L == null) {
                return false
            }
            G.position = L;
            if (G.instanceOptions.usePeakData && typeof M != "undefined" && M) {
                G.peakData = {
                    left: M.leftPeak,
                    right: M.rightPeak
                }
            }
            if (G.instanceOptions.useWaveformData && typeof K != "undefined" && K) {
                G.waveformData = K
            }
            if (G.instanceOptions.useEQData && typeof N != "undefined" && N) {
                G.eqData = N
            }
            if (G.playState == 1) {
                if (G.instanceOptions.whileplaying) {
                    G.instanceOptions.whileplaying.apply(G)
                }
                if (G.loaded && G.instanceOptions.onbeforefinish && G.instanceOptions.onbeforefinishtime && !G.didBeforeFinish && G.duration - G.position <= G.instanceOptions.onbeforefinishtime) {
                    G._onbeforefinish()
                }
            }
        };
        this._onload = function(K) {
            K = (K == 1 ? true: false);
            if (!K) {
                if (J.sandbox.noRemote == true) {}
                if (J.sandbox.noLocal == true) {}
            }
            G.loaded = K;
            G.loadSuccess = K;
            G.readyState = K ? 3: 2;
            if (G.instanceOptions.onload) {
                G.instanceOptions.onload.apply(G)
            }
        };
        this._onbeforefinish = function() {
            if (!G.didBeforeFinish) {
                G.didBeforeFinish = true;
                if (G.instanceOptions.onbeforefinish) {
                    G.instanceOptions.onbeforefinish.apply(G)
                }
            }
        };
        this._onjustbeforefinish = function(K) {
            if (!G.didJustBeforeFinish) {
                G.didJustBeforeFinish = true;
                if (G.instanceOptions.onjustbeforefinish) {
                    G.instanceOptions.onjustbeforefinish.apply(G)
                }
            }
        };
        this._onfinish = function() {
            G.playState = 0;
            G.paused = false;
            if (G.instanceOptions.onfinish) {
                G.instanceOptions.onfinish.apply(G)
            }
            if (G.instanceOptions.onbeforefinishcomplete) {
                G.instanceOptions.onbeforefinishcomplete.apply(G)
            }
            G.didBeforeFinish = false;
            G.didJustBeforeFinish = false;
            if (G.instanceCount) {
                G.instanceCount--;
                if (!G.instanceCount) {
                    G.instanceCount = 0;
                    G.instanceOptions = {}
                }
            }
        }
    }
    if (this.flashVersion == 9) {
        this.defaultOptions = this._mergeObjects(this.defaultOptions, this.flash9Options)
    }
    if (window.addEventListener) {
        window.addEventListener("focus", C.handleFocus, false);
        window.addEventListener("load", C.beginDelayedInit, false);
        window.addEventListener("beforeunload", C.destruct, false);
        if (C._tryInitOnFocus) {
            window.addEventListener("mousemove", C.handleFocus, false)
        }
    } else {
        if (window.attachEvent) {
            window.attachEvent("onfocus", C.handleFocus);
            window.attachEvent("onload", C.beginDelayedInit);
            window.attachEvent("beforeunload", C.destruct)
        } else {
            soundManager.onerror();
            soundManager.disable()
        }
    }
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", C.domContentLoaded, false)
    }
    var F = ["SoundManager 2: Javascript Sound for the Web", "http://schillmania.com/projects/soundmanager2/", "Copyright (c) 2008, Scott Schiller. All rights reserved.", "Code provided under the BSD License: http://schillmania.com/projects/soundmanager2/license.txt", ]
}
var soundManager = new SoundManager();
soundManager.debugMode = false;
soundManager.flashVersion = 9;
soundManager.url = "js/";
soundManager.onload = function() {
    soundManager.createSound("msg", "js/msg.mp3")
};
if (typeof deconcept == "undefined") {
    var deconcept = new Object()
}
if (typeof deconcept.util == "undefined") {
    deconcept.util = new Object()
}
if (typeof deconcept.SWFObjectUtil == "undefined") {
    deconcept.SWFObjectUtil = new Object()
}
deconcept.SWFObject = function(K, B, L, D, H, I, F, E, C, J) {
    if (!document.getElementById) {
        return
    }
    this.DETECT_KEY = J ? J: "detectflash";
    this.skipDetect = deconcept.util.getRequestParameter(this.DETECT_KEY);
    this.params = new Object();
    this.variables = new Object();
    this.attributes = new Array();
    if (K) {
        this.setAttribute("swf", K)
    }
    if (B) {
        this.setAttribute("id", B)
    }
    if (L) {
        this.setAttribute("width", L)
    }
    if (D) {
        this.setAttribute("height", D)
    }
    if (H) {
        this.setAttribute("version", new deconcept.PlayerVersion(H.toString().split(".")))
    }
    this.installedVer = deconcept.SWFObjectUtil.getPlayerVersion();
    if (!window.opera && document.all && this.installedVer.major > 7) {
        deconcept.SWFObject.doPrepUnload = true
    }
    if (I) {
        this.addParam("bgcolor", I)
    }
    var A = F ? F: "high";
    this.addParam("quality", A);
    this.setAttribute("useExpressInstall", false);
    this.setAttribute("doExpressInstall", false);
    var G = (E) ? E: window.location;
    this.setAttribute("xiRedirectUrl", G);
    this.setAttribute("redirectUrl", "");
    if (C) {
        this.setAttribute("redirectUrl", C)
    }
};
deconcept.SWFObject.prototype = {
    useExpressInstall: function(A) {
        this.xiSWFPath = !A ? "expressinstall.swf": A;
        this.setAttribute("useExpressInstall", true)
    },
    setAttribute: function(A, B) {
        this.attributes[A] = B
    },
    getAttribute: function(A) {
        return this.attributes[A]
    },
    addParam: function(B, A) {
        this.params[B] = A
    },
    getParams: function() {
        return this.params
    },
    addVariable: function(B, A) {
        this.variables[B] = A
    },
    getVariable: function(A) {
        return this.variables[A]
    },
    getVariables: function() {
        return this.variables
    },
    getVariablePairs: function() {
        var C = new Array();
        var B;
        var A = this.getVariables();
        for (B in A) {
            C[C.length] = B + "=" + A[B]
        }
        return C
    },
    getSWFHTML: function() {
        var B = "";
        if (navigator.plugins && navigator.mimeTypes && navigator.mimeTypes.length) {
            if (this.getAttribute("doExpressInstall")) {
                this.addVariable("MMplayerType", "PlugIn");
                this.setAttribute("swf", this.xiSWFPath)
            }
            B = '<embed type="application/x-shockwave-flash" src="' + this.getAttribute("swf") + '" width="' + this.getAttribute("width") + '" height="' + this.getAttribute("height") + '" style="' + this.getAttribute("style") + '"';
            B += ' id="' + this.getAttribute("id") + '" name="' + this.getAttribute("id") + '" ';
            var F = this.getParams();
            for (var E in F) {
                B += [E] + '="' + F[E] + '" '
            }
            var D = this.getVariablePairs().join("&");
            if (D.length > 0) {
                B += 'flashvars="' + D + '"'
            }
            B += "/>"
        } else {
            if (this.getAttribute("doExpressInstall")) {
                this.addVariable("MMplayerType", "ActiveX");
                this.setAttribute("swf", this.xiSWFPath)
            }
            B = '<object id="' + this.getAttribute("id") + '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + this.getAttribute("width") + '" height="' + this.getAttribute("height") + '" style="' + this.getAttribute("style") + '">';
            B += '<param name="movie" value="' + this.getAttribute("swf") + '" />';
            var C = this.getParams();
            for (var E in C) {
                B += '<param name="' + E + '" value="' + C[E] + '" />'
            }
            var A = this.getVariablePairs().join("&");
            if (A.length > 0) {
                B += '<param name="flashvars" value="' + A + '" />'
            }
            B += "</object>"
        }
        return B
    },
    write: function(B) {
        if (this.getAttribute("useExpressInstall")) {
            var A = new deconcept.PlayerVersion([6, 0, 65]);
            if (this.installedVer.versionIsValid(A) && !this.installedVer.versionIsValid(this.getAttribute("version"))) {
                this.setAttribute("doExpressInstall", true);
                this.addVariable("MMredirectURL", encodeURIComponent(this.getAttribute("xiRedirectUrl")));
                document.title = document.title.slice(0, 47) + " - Flash Player Installation";
                this.addVariable("MMdoctitle", document.title)
            }
        }
        if (this.skipDetect || this.getAttribute("doExpressInstall") || this.installedVer.versionIsValid(this.getAttribute("version"))) {
            var C = (typeof B == "string") ? document.getElementById(B) : B;
            C.innerHTML = this.getSWFHTML();
            if (! (navigator.plugins && navigator.mimeTypes.length)) {
                window[this.getAttribute("id")] = document.getElementById(this.getAttribute("id"))
            }
            return true
        } else {
            if (this.getAttribute("redirectUrl") != "") {
                document.location.replace(this.getAttribute("redirectUrl"))
            }
        }
        return false
    }
};
deconcept.SWFObjectUtil.getPlayerVersion = function() {
    var E = new deconcept.PlayerVersion([0, 0, 0]);
    if (navigator.plugins && navigator.mimeTypes.length) {
        var A = navigator.plugins["Shockwave Flash"];
        if (A && A.description) {
            E = new deconcept.PlayerVersion(A.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split("."))
        }
    } else {
        if (navigator.userAgent && navigator.userAgent.indexOf("Windows CE") >= 0) {
            var B = 1;
            var C = 3;
            while (B) {
                try {
                    C++;
                    B = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + C);
                    E = new deconcept.PlayerVersion([C, 0, 0])
                } catch(D) {
                    B = null
                }
            }
        } else {
            try {
                var B = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")
            } catch(D) {
                try {
                    var B = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                    E = new deconcept.PlayerVersion([6, 0, 21]);
                    B.AllowScriptAccess = "always"
                } catch(D) {
                    if (E.major == 6) {
                        return E
                    }
                }
                try {
                    B = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")
                } catch(D) {}
            }
            if (B != null) {
                E = new deconcept.PlayerVersion(B.GetVariable("$version").split(" ")[1].split(","))
            }
        }
    }
    return E
};
deconcept.PlayerVersion = function(A) {
    this.major = A[0] != null ? parseInt(A[0]) : 0;
    this.minor = A[1] != null ? parseInt(A[1]) : 0;
    this.rev = A[2] != null ? parseInt(A[2]) : 0
};
deconcept.PlayerVersion.prototype.versionIsValid = function(A) {
    if (this.major < A.major) {
        return false
    }
    if (this.major > A.major) {
        return true
    }
    if (this.minor < A.minor) {
        return false
    }
    if (this.minor > A.minor) {
        return true
    }
    if (this.rev < A.rev) {
        return false
    }
    return true
};
deconcept.util = {
    getRequestParameter: function(C) {
        var D = document.location.search || document.location.hash;
        if (C == null) {
            return D
        }
        if (D) {
            var B = D.substring(1).split("&");
            for (var A = 0; A < B.length; A++) {
                if (B[A].substring(0, B[A].indexOf("=")) == C) {
                    return B[A].substring((B[A].indexOf("=") + 1))
                }
            }
        }
        return ""
    }
};
deconcept.SWFObjectUtil.cleanupSWFs = function() {
    var B = document.getElementsByTagName("OBJECT");
    for (var C = B.length - 1; C >= 0; C--) {
        B[C].style.display = "none";
        for (var A in B[C]) {
            if (typeof B[C][A] == "function") {
                B[C][A] = function() {}
            }
        }
    }
};
if (deconcept.SWFObject.doPrepUnload) {
    if (!deconcept.unloadSet) {
        deconcept.SWFObjectUtil.prepUnload = function() {
            __flash_unloadHandler = function() {};
            __flash_savedUnloadHandler = function() {};
            window.attachEvent("onunload", deconcept.SWFObjectUtil.cleanupSWFs)
        };
        window.attachEvent("onbeforeunload", deconcept.SWFObjectUtil.prepUnload);
        deconcept.unloadSet = true
    }
}
if (!document.getElementById && document.all) {
    document.getElementById = function(A) {
        return document.all[A]
    }
}
var getQueryParamValue = deconcept.util.getRequestParameter;
var FlashObject = deconcept.SWFObject;
var SWFObject = deconcept.SWFObject;
var SWFUpload = function(A) {
    this.initSWFUpload(A)
};
SWFUpload.prototype.initSWFUpload = function(B) {
    try {
        this.customSettings = {};
        this.settings = B;
        this.eventQueue = [];
        this.movieName = "SWFUpload_" + SWFUpload.movieCount++;
        this.movieElement = null;
        SWFUpload.instances[this.movieName] = this;
        this.initSettings();
        this.loadFlash();
        this.displayDebugInfo()
    } catch(A) {
        delete SWFUpload.instances[this.movieName];
        throw A
    }
};
SWFUpload.instances = {};
SWFUpload.movieCount = 0;
SWFUpload.version = "2.2.0 Alpha";
SWFUpload.QUEUE_ERROR = {
    QUEUE_LIMIT_EXCEEDED: -100,
    FILE_EXCEEDS_SIZE_LIMIT: -110,
    ZERO_BYTE_FILE: -120,
    INVALID_FILETYPE: -130
};
SWFUpload.UPLOAD_ERROR = {
    HTTP_ERROR: -200,
    MISSING_UPLOAD_URL: -210,
    IO_ERROR: -220,
    SECURITY_ERROR: -230,
    UPLOAD_LIMIT_EXCEEDED: -240,
    UPLOAD_FAILED: -250,
    SPECIFIED_FILE_ID_NOT_FOUND: -260,
    FILE_VALIDATION_FAILED: -270,
    FILE_CANCELLED: -280,
    UPLOAD_STOPPED: -290
};
SWFUpload.FILE_STATUS = {
    QUEUED: -1,
    IN_PROGRESS: -2,
    ERROR: -3,
    COMPLETE: -4,
    CANCELLED: -5
};
SWFUpload.BUTTON_ACTION = {
    SELECT_FILE: -100,
    SELECT_FILES: -110,
    START_UPLOAD: -120
};
SWFUpload.prototype.initSettings = function() {
    this.ensureDefault = function(B, A) {
        this.settings[B] = (this.settings[B] == undefined) ? A: this.settings[B]
    };
    this.ensureDefault("upload_url", "");
    this.ensureDefault("file_post_name", "Filedata");
    this.ensureDefault("post_params", {});
    this.ensureDefault("use_query_string", false);
    this.ensureDefault("requeue_on_error", false);
    this.ensureDefault("file_types", "*.bmp;*.jpg;*.jpeg;*.gif;*.png;*.swf;*.doc;*.xls;*.ppt;*.pdf;*.zip;*.rar");
    this.ensureDefault("file_types_description", "选择要上传的文件");
    this.ensureDefault("file_size_limit", "10240");
    this.ensureDefault("file_upload_limit", 0);
    this.ensureDefault("file_queue_limit", 0);
    this.ensureDefault("flash_url", "swfupload.swf");
    this.ensureDefault("prevent_swf_caching", true);
    this.ensureDefault("button_image_url", "");
    this.ensureDefault("button_width", 1);
    this.ensureDefault("button_height", 1);
    this.ensureDefault("button_text", "");
    this.ensureDefault("button_text_style", "color: #000000; font-size: 16pt;");
    this.ensureDefault("button_text_top_padding", 0);
    this.ensureDefault("button_text_left_padding", 0);
    this.ensureDefault("button_action", SWFUpload.BUTTON_ACTION.SELECT_FILES);
    this.ensureDefault("button_disabled", false);
    this.ensureDefault("button_placeholder_id", null);
    this.ensureDefault("debug", false);
    this.settings.debug_enabled = this.settings.debug;
    this.settings.return_upload_start_handler = this.returnUploadStart;
    this.ensureDefault("swfupload_loaded_handler", null);
    this.ensureDefault("file_dialog_start_handler", null);
    this.ensureDefault("file_queued_handler", null);
    this.ensureDefault("file_queue_error_handler", null);
    this.ensureDefault("file_dialog_complete_handler", null);
    this.ensureDefault("upload_start_handler", null);
    this.ensureDefault("upload_progress_handler", null);
    this.ensureDefault("upload_error_handler", null);
    this.ensureDefault("upload_success_handler", null);
    this.ensureDefault("upload_complete_handler", null);
    this.ensureDefault("debug_handler", this.debugMessage);
    this.ensureDefault("custom_settings", {});
    this.customSettings = this.settings.custom_settings;
    if (this.settings.prevent_swf_caching) {
        this.settings.flash_url = this.settings.flash_url + "?swfuploadrnd=" + Math.floor(Math.random() * 999999999)
    }
    delete this.ensureDefault
};
SWFUpload.prototype.loadFlash = function() {
    if (this.settings.button_placeholder_id !== "") {
        this.replaceWithFlash()
    } else {
        this.appendFlash()
    }
};
SWFUpload.prototype.appendFlash = function() {
    var B,
    A;
    if (document.getElementById(this.movieName) !== null) {
        throw "ID " + this.movieName + " is already in use. The Flash Object could not be added"
    }
    B = document.getElementsByTagName("body")[0];
    if (B == undefined) {
        throw "Could not find the 'body' element."
    }
    A = document.createElement("div");
    A.style.width = "1px";
    A.style.height = "1px";
    A.style.overflow = "hidden";
    B.appendChild(A);
    A.innerHTML = this.getFlashHTML()
};
SWFUpload.prototype.replaceWithFlash = function() {
    var A,
    B;
    if (document.getElementById(this.movieName) !== null) {
        throw "ID " + this.movieName + " is already in use. The Flash Object could not be added"
    }
    A = document.getElementById(this.settings.button_placeholder_id);
    if (A == undefined) {
        throw "Could not find the placeholder element."
    }
    B = document.createElement("div");
    B.innerHTML = this.getFlashHTML();
    A.parentNode.replaceChild(B.firstChild, A)
};
SWFUpload.prototype.getFlashHTML = function() {
    var A = this.settings.button_image_url === "" ? true: false;
    return ['<object id="', this.movieName, '" type="application/x-shockwave-flash" data="', this.settings.flash_url, '" width="', this.settings.button_width, '" height="', this.settings.button_height, '" class="swfupload">', '<param name="wmode" value="', A ? "transparent": "window", '" />', '<param name="movie" value="', this.settings.flash_url, '" />', '<param name="quality" value="high" />', '<param name="menu" value="false" />', '<param name="allowScriptAccess" value="always" />', '<param name="flashvars" value="' + this.getFlashVars() + '" />', "</object>"].join("")
};
SWFUpload.prototype.getFlashVars = function() {
    var A = this.buildParamString();
    return ["movieName=", encodeURIComponent(this.movieName), "&amp;uploadURL=", encodeURIComponent(this.settings.upload_url), "&amp;useQueryString=", encodeURIComponent(this.settings.use_query_string), "&amp;requeueOnError=", encodeURIComponent(this.settings.requeue_on_error), "&amp;params=", encodeURIComponent(A), "&amp;filePostName=", encodeURIComponent(this.settings.file_post_name), "&amp;fileTypes=", encodeURIComponent(this.settings.file_types), "&amp;fileTypesDescription=", encodeURIComponent(this.settings.file_types_description), "&amp;fileSizeLimit=", encodeURIComponent(this.settings.file_size_limit), "&amp;fileUploadLimit=", encodeURIComponent(this.settings.file_upload_limit), "&amp;fileQueueLimit=", encodeURIComponent(this.settings.file_queue_limit), "&amp;debugEnabled=", encodeURIComponent(this.settings.debug_enabled), "&amp;buttonImageURL=", encodeURIComponent(this.settings.button_image_url), "&amp;buttonWidth=", encodeURIComponent(this.settings.button_width), "&amp;buttonHeight=", encodeURIComponent(this.settings.button_height), "&amp;buttonText=", encodeURIComponent(this.settings.button_text), "&amp;buttonTextTopPadding=", encodeURIComponent(this.settings.button_text_top_padding), "&amp;buttonTextLeftPadding=", encodeURIComponent(this.settings.button_text_left_padding), "&amp;buttonTextStyle=", encodeURIComponent(this.settings.button_text_style), "&amp;buttonAction=", encodeURIComponent(this.settings.button_action), "&amp;buttonDisabled=", encodeURIComponent(this.settings.button_disabled)].join("")
};
SWFUpload.prototype.getMovieElement = function() {
    if (this.movieElement == undefined) {
        this.movieElement = document.getElementById(this.movieName)
    }
    if (this.movieElement === null) {
        throw "Could not find Flash element"
    }
    return this.movieElement
};
SWFUpload.prototype.buildParamString = function() {
    var C = this.settings.post_params;
    var B = [];
    if (typeof(C) === "object") {
        for (var A in C) {
            if (C.hasOwnProperty(A)) {
                B.push(encodeURIComponent(A.toString()) + "=" + encodeURIComponent(C[A].toString()))
            }
        }
    }
    return B.join("&amp;")
};
SWFUpload.prototype.destroy = function() {
    try {
        this.stopUpload();
        var B = null;
        try {
            B = this.getMovieElement()
        } catch(C) {}
        if (B != undefined && B.parentNode != undefined && typeof B.parentNode.removeChild === "function") {
            var A = B.parentNode;
            if (A != undefined) {
                A.removeChild(B);
                if (A.parentNode != undefined && typeof A.parentNode.removeChild === "function") {
                    A.parentNode.removeChild(A)
                }
            }
        }
        SWFUpload.instances[this.movieName] = null;
        delete SWFUpload.instances[this.movieName];
        delete this.movieElement;
        delete this.settings;
        delete this.customSettings;
        delete this.eventQueue;
        delete this.movieName;
        delete window[this.movieName];
        return true
    } catch(D) {
        return false
    }
};
SWFUpload.prototype.displayDebugInfo = function() {
    this.debug(["---SWFUpload Instance Info---\n", "Version: ", SWFUpload.version, "\n", "Movie Name: ", this.movieName, "\n", "Settings:\n", "\t", "upload_url:               ", this.settings.upload_url, "\n", "\t", "flash_url:                ", this.settings.flash_url, "\n", "\t", "use_query_string:         ", this.settings.use_query_string.toString(), "\n", "\t", "file_post_name:           ", this.settings.file_post_name, "\n", "\t", "post_params:              ", this.settings.post_params.toString(), "\n", "\t", "file_types:               ", this.settings.file_types, "\n", "\t", "file_types_description:   ", this.settings.file_types_description, "\n", "\t", "file_size_limit:          ", this.settings.file_size_limit, "\n", "\t", "file_upload_limit:        ", this.settings.file_upload_limit, "\n", "\t", "file_queue_limit:         ", this.settings.file_queue_limit, "\n", "\t", "debug:                    ", this.settings.debug.toString(), "\n", "\t", "prevent_swf_caching:      ", this.settings.prevent_swf_caching.toString(), "\n", "\t", "button_placeholder_id:    ", this.settings.button_placeholder_id.toString(), "\n", "\t", "button_image_url:         ", this.settings.button_image_url.toString(), "\n", "\t", "button_width:             ", this.settings.button_width.toString(), "\n", "\t", "button_height:            ", this.settings.button_height.toString(), "\n", "\t", "button_text:              ", this.settings.button_text.toString(), "\n", "\t", "button_text_style:        ", this.settings.button_text_style.toString(), "\n", "\t", "button_text_top_padding:  ", this.settings.button_text_top_padding.toString(), "\n", "\t", "button_text_left_padding: ", this.settings.button_text_left_padding.toString(), "\n", "\t", "button_action:            ", this.settings.button_action.toString(), "\n", "\t", "button_disabled:          ", this.settings.button_disabled.toString(), "\n", "\t", "custom_settings:          ", this.settings.custom_settings.toString(), "\n", "Event Handlers:\n", "\t", "swfupload_loaded_handler assigned:  ", (typeof this.settings.swfupload_loaded_handler === "function").toString(), "\n", "\t", "file_dialog_start_handler assigned: ", (typeof this.settings.file_dialog_start_handler === "function").toString(), "\n", "\t", "file_queued_handler assigned:       ", (typeof this.settings.file_queued_handler === "function").toString(), "\n", "\t", "file_queue_error_handler assigned:  ", (typeof this.settings.file_queue_error_handler === "function").toString(), "\n", "\t", "upload_start_handler assigned:      ", (typeof this.settings.upload_start_handler === "function").toString(), "\n", "\t", "upload_progress_handler assigned:   ", (typeof this.settings.upload_progress_handler === "function").toString(), "\n", "\t", "upload_error_handler assigned:      ", (typeof this.settings.upload_error_handler === "function").toString(), "\n", "\t", "upload_success_handler assigned:    ", (typeof this.settings.upload_success_handler === "function").toString(), "\n", "\t", "upload_complete_handler assigned:   ", (typeof this.settings.upload_complete_handler === "function").toString(), "\n", "\t", "debug_handler assigned:             ", (typeof this.settings.debug_handler === "function").toString(), "\n"].join(""))
};
SWFUpload.prototype.addSetting = function(B, C, A) {
    if (C == undefined) {
        return (this.settings[B] = A)
    } else {
        return (this.settings[B] = C)
    }
};
SWFUpload.prototype.getSetting = function(A) {
    if (this.settings[A] != undefined) {
        return this.settings[A]
    }
    return ""
};
SWFUpload.prototype.callFlash = function(C, D) {
    D = D || [];
    var A = this.getMovieElement();
    var B;
    if (typeof A[C] === "function") {
        if (D.length === 0) {
            B = A[C]()
        } else {
            if (D.length === 1) {
                B = A[C](D[0])
            } else {
                if (D.length === 2) {
                    B = A[C](D[0], D[1])
                } else {
                    if (D.length === 3) {
                        B = A[C](D[0], D[1], D[2])
                    } else {
                        throw "Too many arguments"
                    }
                }
            }
        }
        if (B != undefined && typeof B.post === "object") {
            B = this.unescapeFilePostParams(B)
        }
        return B
    } else {
        throw "Invalid function name: " + C
    }
};
SWFUpload.prototype.selectFile = function() {
    this.callFlash("SelectFile")
};
SWFUpload.prototype.selectFiles = function() {
    this.callFlash("SelectFiles")
};
SWFUpload.prototype.startUpload = function(A) {
    this.callFlash("StartUpload", [A])
};
SWFUpload.prototype.cancelUpload = function(A) {
    this.callFlash("CancelUpload", [A])
};
SWFUpload.prototype.stopUpload = function() {
    this.callFlash("StopUpload")
};
SWFUpload.prototype.getStats = function() {
    return this.callFlash("GetStats")
};
SWFUpload.prototype.setStats = function(A) {
    this.callFlash("SetStats", [A])
};
SWFUpload.prototype.getFile = function(A) {
    if (typeof(A) === "number") {
        return this.callFlash("GetFileByIndex", [A])
    } else {
        return this.callFlash("GetFile", [A])
    }
};
SWFUpload.prototype.addFileParam = function(A, B, C) {
    return this.callFlash("AddFileParam", [A, B, C])
};
SWFUpload.prototype.removeFileParam = function(A, B) {
    this.callFlash("RemoveFileParam", [A, B])
};
SWFUpload.prototype.setUploadURL = function(A) {
    this.settings.upload_url = A.toString();
    this.callFlash("SetUploadURL", [A])
};
SWFUpload.prototype.setPostParams = function(A) {
    this.settings.post_params = A;
    this.callFlash("SetPostParams", [A])
};
SWFUpload.prototype.addPostParam = function(A, B) {
    this.settings.post_params[A] = B;
    this.callFlash("SetPostParams", [this.settings.post_params])
};
SWFUpload.prototype.removePostParam = function(A) {
    delete this.settings.post_params[A];
    this.callFlash("SetPostParams", [this.settings.post_params])
};
SWFUpload.prototype.setFileTypes = function(A, B) {
    this.settings.file_types = A;
    this.settings.file_types_description = B;
    this.callFlash("SetFileTypes", [A, B])
};
SWFUpload.prototype.setFileSizeLimit = function(A) {
    this.settings.file_size_limit = A;
    this.callFlash("SetFileSizeLimit", [A])
};
SWFUpload.prototype.setFileUploadLimit = function(A) {
    this.settings.file_upload_limit = A;
    this.callFlash("SetFileUploadLimit", [A])
};
SWFUpload.prototype.setFileQueueLimit = function(A) {
    this.settings.file_queue_limit = A;
    this.callFlash("SetFileQueueLimit", [A])
};
SWFUpload.prototype.setFilePostName = function(A) {
    this.settings.file_post_name = A;
    this.callFlash("SetFilePostName", [A])
};
SWFUpload.prototype.setUseQueryString = function(A) {
    this.settings.use_query_string = A;
    this.callFlash("SetUseQueryString", [A])
};
SWFUpload.prototype.setRequeueOnError = function(A) {
    this.settings.requeue_on_error = A;
    this.callFlash("SetRequeueOnError", [A])
};
SWFUpload.prototype.setDebugEnabled = function(A) {
    this.settings.debug_enabled = A;
    this.callFlash("SetDebugEnabled", [A])
};
SWFUpload.prototype.setButtonImageURL = function(A) {
    if (A == undefined) {
        A = ""
    }
    this.settings.button_image_url = A;
    this.callFlash("SetButtonImageURL", [A])
};
SWFUpload.prototype.setButtonDimensions = function(C, A) {
    this.settings.button_width = C;
    this.settings.button_height = A;
    var B = this.getMovieElement();
    if (B != undefined) {
        B.style.width = C + "px";
        B.style.height = A + "px"
    }
    this.callFlash("SetButtonDimensions", [C, A])
};
SWFUpload.prototype.setButtonText = function(A) {
    this.settings.button_text = A;
    this.callFlash("SetButtonText", [A])
};
SWFUpload.prototype.setButtonTextPadding = function(B, A) {
    this.settings.button_text_top_padding = A;
    this.settings.button_text_left_padding = B;
    this.callFlash("SetButtonTextPadding", [B, A])
};
SWFUpload.prototype.setButtonTextStyle = function(A) {
    this.settings.button_text_style = A;
    this.callFlash("SetButtonTextStyle", [A])
};
SWFUpload.prototype.setButtonDisabled = function(A) {
    this.settings.button_disabled = A;
    this.callFlash("SetButtonDisabled", [A])
};
SWFUpload.prototype.setButtonAction = function(A) {
    this.settings.button_action = A;
    this.callFlash("SetButtonAction", [A])
};
SWFUpload.prototype.queueEvent = function(B, C) {
    if (C == undefined) {
        C = []
    } else {
        if (! (C instanceof Array)) {
            C = [C]
        }
    }
    var A = this;
    if (typeof this.settings[B] === "function") {
        this.eventQueue.push(function() {
            this.settings[B].apply(this, C)
        });
        setTimeout(function() {
            A.executeNextEvent()
        },
        0)
    } else {
        if (this.settings[B] !== null) {
            throw "Event handler " + B + " is unknown or is not a function"
        }
    }
};
SWFUpload.prototype.executeNextEvent = function() {
    var A = this.eventQueue ? this.eventQueue.shift() : null;
    if (typeof(A) === "function") {
        A.apply(this)
    }
};
SWFUpload.prototype.unescapeFilePostParams = function(C) {
    var E = /[$]([0-9a-f]{4})/i;
    var F = {};
    var D;
    if (C != undefined) {
        for (var A in C.post) {
            if (C.post.hasOwnProperty(A)) {
                D = A;
                var B;
                while ((B = E.exec(D)) !== null) {
                    D = D.replace(B[0], String.fromCharCode(parseInt("0x" + B[1], 16)))
                }
                F[D] = C.post[A]
            }
        }
        C.post = F
    }
    return C
};
SWFUpload.prototype.flashReady = function() {
    var A = this.getMovieElement();
    if (typeof A.StartUpload !== "function") {
        throw "ExternalInterface methods failed to initialize."
    }
    if (window[this.movieName] == undefined) {
        window[this.movieName] = A
    }
    this.queueEvent("swfupload_loaded_handler")
};
SWFUpload.prototype.fileDialogStart = function() {
    this.queueEvent("file_dialog_start_handler")
};
SWFUpload.prototype.fileQueued = function(A) {
    A = this.unescapeFilePostParams(A);
    this.queueEvent("file_queued_handler", A)
};
SWFUpload.prototype.fileQueueError = function(A, C, B) {
    A = this.unescapeFilePostParams(A);
    this.queueEvent("file_queue_error_handler", [A, C, B])
};
SWFUpload.prototype.fileDialogComplete = function(A, B) {
    this.queueEvent("file_dialog_complete_handler", [A, B])
};
SWFUpload.prototype.uploadStart = function(A) {
    A = this.unescapeFilePostParams(A);
    this.queueEvent("return_upload_start_handler", A)
};
SWFUpload.prototype.returnUploadStart = function(A) {
    var B;
    if (typeof this.settings.upload_start_handler === "function") {
        A = this.unescapeFilePostParams(A);
        B = this.settings.upload_start_handler.call(this, A)
    } else {
        if (this.settings.upload_start_handler != undefined) {
            throw "upload_start_handler must be a function"
        }
    }
    if (B === undefined) {
        B = true
    }
    B = !!B;
    this.callFlash("ReturnUploadStart", [B])
};
SWFUpload.prototype.uploadProgress = function(A, C, B) {
    A = this.unescapeFilePostParams(A);
    this.queueEvent("upload_progress_handler", [A, C, B])
};
SWFUpload.prototype.uploadError = function(A, C, B) {
    A = this.unescapeFilePostParams(A);
    this.queueEvent("upload_error_handler", [A, C, B])
};
SWFUpload.prototype.uploadSuccess = function(B, A) {
    B = this.unescapeFilePostParams(B);
    this.queueEvent("upload_success_handler", [B, A])
};
SWFUpload.prototype.uploadComplete = function(A) {
    A = this.unescapeFilePostParams(A);
    this.queueEvent("upload_complete_handler", A)
};
SWFUpload.prototype.debug = function(A) {
    this.queueEvent("debug_handler", A)
};
SWFUpload.prototype.debugMessage = function(C) {
    if (this.settings.debug) {
        var A,
        D = [];
        if (typeof C === "object" && typeof C.name === "string" && typeof C.message === "string") {
            for (var B in C) {
                if (C.hasOwnProperty(B)) {
                    D.push(B + ": " + C[B])
                }
            }
            A = D.join("\n") || "";
            D = A.split("\n");
            A = "EXCEPTION: " + D.join("\nEXCEPTION: ");
            SWFUpload.Console.writeLine(A)
        } else {
            SWFUpload.Console.writeLine(C)
        }
    }
};
SWFUpload.Console = {};
SWFUpload.Console.writeLine = function(D) {
    var B,
    A;
    try {
        B = document.getElementById("SWFUpload_Console");
        if (!B) {
            A = document.createElement("form");
            document.getElementsByTagName("body")[0].appendChild(A);
            B = document.createElement("textarea");
            B.id = "SWFUpload_Console";
            B.style.fontFamily = "monospace";
            B.setAttribute("wrap", "off");
            B.wrap = "off";
            B.style.overflow = "auto";
            B.style.width = "700px";
            B.style.height = "350px";
            B.style.margin = "5px";
            A.appendChild(B)
        }
        B.value += D + "\n";
        B.scrollTop = B.scrollHeight - B.clientHeight
    } catch(C) {
        alert("Exception: " + C.name + " Message: " + C.message)
    }
};
function FileProgress(C, A) {
    this.fileProgressID = C.id;
    this.opacity = 100;
    this.height = 0;
    this.fileProgressWrapper = document.getElementById(this.fileProgressID);
    if (!this.fileProgressWrapper) {
        this.fileProgressWrapper = document.createElement("div");
        this.fileProgressWrapper.className = "progressWrapper";
        this.fileProgressWrapper.id = this.fileProgressID;
        this.fileProgressElement = document.createElement("div");
        this.fileProgressElement.className = "progressContainer";
        var F = document.createElement("a");
        F.className = "progressCancel";
        F.href = "#";
        F.style.visibility = "hidden";
        F.appendChild(document.createTextNode(" "));
        var B = document.createElement("div");
        B.className = "progressName";
        B.appendChild(document.createTextNode(C.name));
        var E = document.createElement("div");
        E.className = "progressBarInProgress";
        var D = document.createElement("div");
        D.className = "progressBarStatus";
        D.innerHTML = "&nbsp;";
        this.fileProgressElement.appendChild(F);
        this.fileProgressElement.appendChild(B);
        this.fileProgressElement.appendChild(D);
        this.fileProgressElement.appendChild(E);
        this.fileProgressWrapper.appendChild(this.fileProgressElement);
        document.getElementById(A).appendChild(this.fileProgressWrapper)
    } else {
        this.fileProgressElement = this.fileProgressWrapper.firstChild
    }
    this.height = this.fileProgressWrapper.offsetHeight
}
FileProgress.prototype.setProgress = function(A) {
    this.fileProgressElement.className = "progressContainer green";
    this.fileProgressElement.childNodes[3].className = "progressBarInProgress";
    this.fileProgressElement.childNodes[3].style.width = A + "%"
};
FileProgress.prototype.setComplete = function() {
    this.fileProgressElement.className = "progressContainer blue";
    this.fileProgressElement.childNodes[3].className = "progressBarComplete";
    this.fileProgressElement.childNodes[3].style.width = "";
    var A = this;
    setTimeout(function() {
        A.disappear()
    },
    10000)
};
FileProgress.prototype.setError = function() {
    this.fileProgressElement.className = "progressContainer red";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";
    var A = this;
    setTimeout(function() {
        A.disappear()
    },
    5000)
};
FileProgress.prototype.setCancelled = function() {
    this.fileProgressElement.className = "progressContainer";
    this.fileProgressElement.childNodes[3].className = "progressBarError";
    this.fileProgressElement.childNodes[3].style.width = "";
    var A = this;
    setTimeout(function() {
        A.disappear()
    },
    2000)
};
FileProgress.prototype.setStatus = function(A) {
    this.fileProgressElement.childNodes[2].innerHTML = A
};
FileProgress.prototype.toggleCancel = function(B, C) {
    this.fileProgressElement.childNodes[0].style.visibility = B ? "visible": "hidden";
    if (C) {
        var A = this.fileProgressID;
        this.fileProgressElement.childNodes[0].onclick = function() {
            C.cancelUpload(A);
            return false
        }
    }
};
FileProgress.prototype.disappear = function() {
    var E = 15;
    var C = 4;
    var B = 30;
    if (this.opacity > 0) {
        this.opacity -= E;
        if (this.opacity < 0) {
            this.opacity = 0
        }
        if (this.fileProgressWrapper.filters) {
            try {
                this.fileProgressWrapper.filters.item("DXImageTransform.Microsoft.Alpha").opacity = this.opacity
            } catch(D) {
                this.fileProgressWrapper.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + this.opacity + ")"
            }
        } else {
            this.fileProgressWrapper.style.opacity = this.opacity / 100
        }
    }
    if (this.height > 0) {
        this.height -= C;
        if (this.height < 0) {
            this.height = 0
        }
        this.fileProgressWrapper.style.height = this.height + "px"
    }
    if (this.height > 0 || this.opacity > 0) {
        var A = this;
        setTimeout(function() {
            A.disappear()
        },
        B)
    } else {
        this.fileProgressWrapper.style.display = "none";
        if (this.fileProgressWrapper.parentNode) {
            this.fileProgressWrapper.parentNode.removeChild(this.fileProgressWrapper)
        }
    }
};
function cancelQueue(A) {
    document.getElementById(A.customSettings.cancelButtonId).disabled = true;
    A.stopUpload();
    var B;
    do {
        B = A.getStats();
        A.cancelUpload()
    }
    while (B.files_queued !== 0)
}
function fileDialogStart() {}
function fileQueued(C) {
    try {
        var A = new FileProgress(C, this.customSettings.progressTarget);
        A.setStatus("Pending...");
        A.toggleCancel(true, this)
    } catch(B) {
        this.debug(B)
    }
}
function fileQueueError(C, E, D) {
    try {
        if (E === SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
            alert("You have attempted to queue too many files.\n" + (D === 0 ? "You have reached the upload limit.": "You may select " + (D > 1 ? "up to " + D + " files.": "one file.")));
            return
        }
        var A = new FileProgress(C, this.customSettings.progressTarget);
        A.setError();
        A.toggleCancel(false);
        switch (E) {
        case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:
            A.setStatus("File is too big.");
            this.debug("Error Code: File too big, File name: " + C.name + ", File size: " + C.size + ", Message: " + D);
            break;
        case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:
            A.setStatus("Cannot upload Zero Byte files.");
            this.debug("Error Code: Zero byte file, File name: " + C.name + ", File size: " + C.size + ", Message: " + D);
            break;
        case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:
            A.setStatus("Invalid File Type.");
            this.debug("Error Code: Invalid File Type, File name: " + C.name + ", File size: " + C.size + ", Message: " + D);
            break;
        case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:
            alert("You have selected too many files.  " + (D > 1 ? "You may only add " + D + " more files": "You cannot add any more files."));
            break;
        default:
            if (C !== null) {
                A.setStatus("Unhandled Error")
            }
            this.debug("Error Code: " + E + ", File name: " + C.name + ", File size: " + C.size + ", Message: " + D);
            break
        }
    } catch(B) {
        this.debug(B)
    }
}
function fileDialogComplete(A, C) {
    try {
        if (this.getStats().files_queued > 0) {}
    } catch(B) {
        this.debug(B)
    }
}
function uploadStart(C) {
    try {
        var A = new FileProgress(C, this.customSettings.progressTarget);
        A.setStatus("Uploading...");
        A.toggleCancel(true, this)
    } catch(B) {}
    return true
}
function uploadProgress(C, F, E) {
    try {
        var D = Math.ceil((F / E) * 100);
        var A = new FileProgress(C, this.customSettings.progressTarget);
        A.setProgress(D);
        A.setStatus("Uploading...")
    } catch(B) {
        this.debug(B)
    }
}
function uploadSuccess(D, B) {
    try {
        var A = new FileProgress(D, this.customSettings.progressTarget);
        A.setComplete();
        A.setStatus("Complete.");
        A.toggleCancel(false)
    } catch(C) {
        this.debug(C)
    }
}
function uploadComplete(B) {
    try {
        if (this.getStats().files_queued === 0) {} else {
            this.startUpload()
        }
    } catch(A) {
        this.debug(A)
    }
}
function uploadError(C, E, D) {
    try {
        var A = new FileProgress(C, this.customSettings.progressTarget);
        A.setError();
        A.toggleCancel(false);
        switch (E) {
        case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
            A.setStatus("Upload Error: " + D);
            this.debug("Error Code: HTTP Error, File name: " + C.name + ", Message: " + D);
            break;
        case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
            A.setStatus("Configuration Error");
            this.debug("Error Code: No backend file, File name: " + C.name + ", Message: " + D);
            break;
        case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
            A.setStatus("Upload Failed.");
            this.debug("Error Code: Upload Failed, File name: " + C.name + ", File size: " + C.size + ", Message: " + D);
            break;
        case SWFUpload.UPLOAD_ERROR.IO_ERROR:
            A.setStatus("Server (IO) Error");
            this.debug("Error Code: IO Error, File name: " + C.name + ", Message: " + D);
            break;
        case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
            A.setStatus("Security Error");
            this.debug("Error Code: Security Error, File name: " + C.name + ", Message: " + D);
            break;
        case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
            A.setStatus("Upload limit exceeded.");
            this.debug("Error Code: Upload Limit Exceeded, File name: " + C.name + ", File size: " + C.size + ", Message: " + D);
            break;
        case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
            A.setStatus("File not found.");
            this.debug("Error Code: The file was not found, File name: " + C.name + ", File size: " + C.size + ", Message: " + D);
            break;
        case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
            A.setStatus("Failed Validation.  Upload skipped.");
            this.debug("Error Code: File Validation Failed, File name: " + C.name + ", File size: " + C.size + ", Message: " + D);
            break;
        case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
            if (this.getStats().files_queued === 0) {
                document.getElementById(this.customSettings.cancelButtonId).disabled = true
            }
            A.setStatus("Cancelled");
            A.setCancelled();
            break;
        case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
            A.setStatus("Stopped");
            break;
        default:
            A.setStatus("Unhandled Error: " + error_code);
            this.debug("Error Code: " + E + ", File name: " + C.name + ", File size: " + C.size + ", Message: " + D);
            break
        }
    } catch(B) {
        this.debug(B)
    }
}
var SWFUpload;
if (typeof(SWFUpload) === "function") {
    SWFUpload.queue = {};
    SWFUpload.prototype.initSettings = (function(A) {
        return function() {
            if (typeof(A) === "function") {
                A.call(this)
            }
            this.customSettings.queue_cancelled_flag = false;
            this.customSettings.queue_upload_count = 0;
            this.settings.user_upload_complete_handler = this.settings.upload_complete_handler;
            this.settings.upload_complete_handler = SWFUpload.queue.uploadCompleteHandler;
            this.settings.queue_complete_handler = this.settings.queue_complete_handler || null
        }
    })(SWFUpload.prototype.initSettings);
    SWFUpload.prototype.startUpload = function(A) {
        this.customSettings.queue_cancelled_flag = false;
        this.callFlash("StartUpload", false, [A])
    };
    SWFUpload.prototype.cancelQueue = function() {
        this.customSettings.queue_cancelled_flag = true;
        this.stopUpload();
        var A = this.getStats();
        while (A.files_queued > 0) {
            this.cancelUpload();
            A = this.getStats()
        }
    };
    SWFUpload.queue.uploadCompleteHandler = function(B) {
        var C = this.settings.user_upload_complete_handler;
        var D;
        if (B.filestatus === SWFUpload.FILE_STATUS.COMPLETE) {
            this.customSettings.queue_upload_count++
        }
        if (typeof(C) === "function") {
            D = (C.call(this, B) === false) ? false: true
        } else {
            D = true
        }
        if (D) {
            var A = this.getStats();
            if (A.files_queued > 0 && this.customSettings.queue_cancelled_flag === false) {
                this.startUpload()
            } else {
                if (this.customSettings.queue_cancelled_flag === false) {
                    this.queueEvent("queue_complete_handler", [this.customSettings.queue_upload_count]);
                    this.customSettings.queue_upload_count = 0
                } else {
                    this.customSettings.queue_cancelled_flag = false;
                    this.customSettings.queue_upload_count = 0
                }
            }
        }
    }
};