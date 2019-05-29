    sNkp: function(e, t, n) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var i = n("MbB6")
          , o = n.n(i)
          , s = n("dnTF")
          , a = n.n(s)
          , r = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                for (var i in n)
                    Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i])
            }
            return e
        }
          , l = {
            transitionDuration: 300,
            zoomFactor: 1.45,
            minZoom: .2,
            maxZoom: 6
        }
          , c = function(e) {
            return +e.toFixed(10).replace(/^(\-)?(.*)\./, "$10.")
        }
          , d = function(e, t, n, i, o) {
            this.originX = e,
            this.originY = t,
            this.translateX = n,
            this.translateY = i,
            this.scale = +o.toFixed(1)
        }
          , h = function(e) {
            x = e
        }
          , u = function(e, t) {
            e.scrollLeft -= t.translateX - x.translateX,
            e.scrollTop -= t.translateY - x.translateY
        }
          , p = function(e) {
            S = e
        }
          , f = function(e, t, n) {
            var i = 1 - n.scale
              , o = n.scale - 1 || 1;
            k = n.originX * i,
            A = n.originY * i;
            var s = t.scrollLeft - k
              , a = t.scrollTop - A;
            M.x = c(s) / o,
            M.y = c(a) / o,
            CSS.set(e, {
                transformOrigin: M.x + "px " + M.y + "px"
            }),
            t.scrollLeft = s,
            t.scrollTop = a,
            E = !0
        }
          , g = a()(function(e) {
            ServerConnection.setPreference("zoom_factor", C[e])
        }, 250)
          , m = function(e, t, n, i) {
            clearTimeout(w),
            E && (t.scrollLeft += k,
            t.scrollTop += A,
            E = !1);
            var o = n.originX + "px " + n.originY + "px"
              , s = i ? l.transitionDuration : 0;
            M.x = n.originX,
            M.y = n.originY,
            CSS.set(e, {
                transformOrigin: o,
                transform: "scale(" + n.scale.toFixed(2) + ")",
                transition: (MM.ua.isBrowser("Safari") ? browserPrefix() : "") + "transform " + s + "ms linear 0s"
            }),
            n.scale >= 1 && (w = setTimeout(f.bind(null, e, t, n), s + 200))
        }
          , v = function(el, container, left, top, scale, s, a, r) {
            var l = _(el, x, left, top, el.offsetLeft, el.offsetTop, scale, r.minScale, r.maxScale);
            if (l !== x) {
                var c = C.indexOf(+l.scale.toFixed(1));
                m(e, container, l, s),
                u(container, l),
                h(l),
                p(c),
                App.config.persistent && App.config.editable && a && g(S)
            }
        }
          , _ = function(el, t, leftPosition, topPostion, elOffsetLeft, elOffsetTop, a, r, l) {
            var scale = t.scale
              , h = scale + a / 10;
            h < r ? h = r : h > l && (h = l);
            var u = el.getBoundingClientRect()
              , x = leftPosition - elOffsetLeft - u.left
              , y = topPostion - elOffsetTop - u.top
              , newOriginX = x / scale
              , newOriginY = y / scale;
            if (scale === h || newOriginX === t.originX && newOriginY === t.originY && (h === l || h === r))
                return t;
            var lastX = t.originX * scale
              , lastY = t.originY * scale
              , newTranslateX = t.translateX
              , newTranslateY = t.translateY;
            return (Math.abs(x - lastX) > 1 || Math.abs(y - lastY) > 1) && c <= l ? (newTranslateX += (x - lastX) * (1 - 1 / c),
            newTranslateY += (y - lastY) * (1 - 1 / scale)) : (1 !== scale || x !== lastX && y !== lastY) && (newOriginX = lastX / scale,
            newOriginY = lastY / scale),
            new d(newOriginX,newOriginY,newTranslateX,newTranslateY,h)
        }
          , y = o()(v, 50)
          , b = o()(v, l.transitionDuration + 100)
          , w = void 0
          , C = []
          , x = void 0
          , S = void 0
          , k = 0
          , A = 0
          , M = {
            x: 0,
            y: 0
        }
          , E = !1;
        t.default = {
            init: function(e, t, n) {
                this.el = e,
                this.scrollingContainer = t,
                this.opts = r({
                    minScale: l.minZoom,
                    maxScale: l.maxZoom
                }, n);
                for (var i = this.opts.minScale; i <= this.opts.maxScale; i += .1)
                    C.push(+i.toFixed(1));
                S = this.getZoomIndex(1),
                h(new d(0,0,0,0,1)),
                this.initialized = !0
            },
            canZoomOut: function() {
                return S > 0
            },
            canZoomIn: function() {
                return S < C.length - 1
            },
            zoomIn: function(e, t, n) {
                if (this.canZoomIn()) {
                    var i = Math.ceil(S * l.zoomFactor) || 1;
                    this.zoomTo(i, e, t, n)
                }
            },
            zoomOut: function(e, t, n) {
                if (this.canZoomOut()) {
                    var i = Math.floor(S / l.zoomFactor);
                    this.zoomTo(i, e, t, n)
                }
            },
            getScaleAvg: function() {
                return (this.opts.minScale + this.opts.maxScale) / 2
            },
            getZoomFactor: function(e) {
                return C[e || S]
            },
            getCurrentZoomIndex: function() {
                return S
            },
            getZoomIndex: function(e) {
                return C.indexOf(e)
            },
            zoomTo: function(e, t, n, i) {
                if (!i) {
                    var o = document.body.getBoundingClientRect()
                      , s = UI.Registry.viewportOffset;
                    i = {
                        left: (o.width - s.left - s.right) / 2,
                        top: o.height / 2
                    }
                }
                n ? b(this.el, this.scrollingContainer, i.left, i.top, e - S, n, t, this.opts) : v(this.el, this.scrollingContainer, i.left, i.top, e - S, n, t, this.opts)
            },
            onWheel: function(e, t) {
                e.preventDefault(),
                e.stopPropagation();
                var n = this.getZoomFactor() > 1 ? this.getZoomFactor() : 1;
                y(this.el, this.scrollingContainer, e.pageX, e.pageY, t * n, !1, !0, this.opts)
            },
            zoomToFit: function() {, scale
                if (tree.finishedInitialization) {
                    var e = Math.max(.2, Math.min(1, parseFloat((MM.ui.page.width / App.config.layout.mapSize().width).toFixed(1))));
                    this.getZoomIndex(e) >= 0 && this.zoomTo(this.getZoomIndex(e), !1, !1)
                }
            },
            transformCssZoomValue: function(e, t) {
                return t ? e * this.getZoomFactor() : e / this.getZoomFactor()
            },
            transformCssZoomCoordinate: function(e, t, n) {
                var i = M[t]
                  , o = e - i;
                return i + this.transformCssZoomValue(o, n)
            }
        }
    },
