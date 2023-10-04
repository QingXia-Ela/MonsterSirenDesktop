try {
  self["workbox:core:6.1.1"] && _()
} catch (e) { }
const e = (e, ...t) => {
  let s = e;
  return t.length > 0 && (s += ` :: ${JSON.stringify(t)}`),
    s
}
  ;
class t extends Error {
  constructor(t, s) {
    super(e(t, s)),
      this.name = t,
      this.details = s
  }
}
try {
  self["workbox:routing:6.1.1"] && _()
} catch (e) { }
const s = e => e && "object" == typeof e ? e : {
  handle: e
};
class n {
  constructor(e, t, n = "GET") {
    this.handler = s(t),
      this.match = e,
      this.method = n
  }
  setCatchHandler(e) {
    this.catchHandler = s(e)
  }
}
class i extends n {
  constructor(e, t, s) {
    super((({ url: t }) => {
      const s = e.exec(t.href);
      if (s && (t.origin === location.origin || 0 === s.index))
        return s.slice(1)
    }
    ), t, s)
  }
}
class c {
  constructor() {
    this.t = new Map,
      this.i = new Map
  }
  get routes() {
    return this.t
  }
  addFetchListener() {
    self.addEventListener("fetch", (e => {
      const { request: t } = e
        , s = this.handleRequest({
          request: t,
          event: e
        });
      s && e.respondWith(s)
    }
    ))
  }
  addCacheListener() {
    self.addEventListener("message", (e => {
      if (e.data && "CACHE_URLS" === e.data.type) {
        const { payload: t } = e.data
          , s = Promise.all(t.urlsToCache.map((t => {
            "string" == typeof t && (t = [t]);
            const s = new Request(...t);
            return this.handleRequest({
              request: s,
              event: e
            })
          }
          )));
        e.waitUntil(s),
          e.ports && e.ports[0] && s.then((() => e.ports[0].postMessage(!0)))
      }
    }
    ))
  }
  handleRequest({ request: e, event: t }) {
    const s = new URL(e.url, location.href);
    if (!s.protocol.startsWith("http"))
      return;
    const n = s.origin === location.origin
      , { params: i, route: c } = this.findMatchingRoute({
        event: t,
        request: e,
        sameOrigin: n,
        url: s
      });
    let r = c && c.handler;
    const a = e.method;
    if (!r && this.i.has(a) && (r = this.i.get(a)),
      !r)
      return;
    let o;
    try {
      o = r.handle({
        url: s,
        request: e,
        event: t,
        params: i
      })
    } catch (e) {
      o = Promise.reject(e)
    }
    const h = c && c.catchHandler;
    return o instanceof Promise && (this.o || h) && (o = o.catch((async n => {
      if (h)
        try {
          return await h.handle({
            url: s,
            request: e,
            event: t,
            params: i
          })
        } catch (e) {
          n = e
        }
      if (this.o)
        return this.o.handle({
          url: s,
          request: e,
          event: t
        });
      throw n
    }
    ))),
      o
  }
  findMatchingRoute({ url: e, sameOrigin: t, request: s, event: n }) {
    const i = this.t.get(s.method) || [];
    for (const c of i) {
      let i;
      const r = c.match({
        url: e,
        sameOrigin: t,
        request: s,
        event: n
      });
      if (r)
        return i = r,
          (Array.isArray(r) && 0 === r.length || r.constructor === Object && 0 === Object.keys(r).length || "boolean" == typeof r) && (i = void 0),
        {
          route: c,
          params: i
        }
    }
    return {}
  }
  setDefaultHandler(e, t = "GET") {
    this.i.set(t, s(e))
  }
  setCatchHandler(e) {
    this.o = s(e)
  }
  registerRoute(e) {
    this.t.has(e.method) || this.t.set(e.method, []),
      this.t.get(e.method).push(e)
  }
  unregisterRoute(e) {
    if (!this.t.has(e.method))
      throw new t("unregister-route-but-not-found-with-method", {
        method: e.method
      });
    const s = this.t.get(e.method).indexOf(e);
    if (!(s > -1))
      throw new t("unregister-route-route-not-registered");
    this.t.get(e.method).splice(s, 1)
  }
}
let r;
const a = () => (r || (r = new c,
  r.addFetchListener(),
  r.addCacheListener()),
  r);
function o(e, s, c) {
  let r;
  if ("string" == typeof e) {
    const t = new URL(e, location.href);
    r = new n((({ url: e }) => e.href === t.href), s, c)
  } else if (e instanceof RegExp)
    r = new i(e, s, c);
  else if ("function" == typeof e)
    r = new n(e, s, c);
  else {
    if (!(e instanceof n))
      throw new t("unsupported-route-type", {
        moduleName: "workbox-routing",
        funcName: "registerRoute",
        paramName: "capture"
      });
    r = e
  }
  return a().registerRoute(r),
    r
}
try {
  self["workbox:strategies:6.1.1"] && _()
} catch (e) { }
const h = {
  cacheWillUpdate: async ({ response: e }) => 200 === e.status || 0 === e.status ? e : null
}
  , d = {
    googleAnalytics: "googleAnalytics",
    precache: "precache-v2",
    prefix: "workbox",
    runtime: "runtime",
    suffix: "undefined" != typeof registration ? registration.scope : ""
  }
  , f = e => [d.prefix, e, d.suffix].filter((e => e && e.length > 0)).join("-")
  , u = e => e || f(d.precache)
  , l = e => e || f(d.runtime);
function b() {
  return (b = Object.assign || function (e) {
    for (var t = 1; t < arguments.length; t++) {
      var s = arguments[t];
      for (var n in s)
        Object.prototype.hasOwnProperty.call(s, n) && (e[n] = s[n])
    }
    return e
  }
  ).apply(this, arguments)
}
function w(e, t) {
  const s = new URL(e);
  for (const e of t)
    s.searchParams.delete(e);
  return s.href
}
class p {
  constructor() {
    this.promise = new Promise(((e, t) => {
      this.resolve = e,
        this.reject = t
    }
    ))
  }
}
const y = new Set;
function v(e) {
  return "string" == typeof e ? new Request(e) : e
}
class g {
  constructor(e, t) {
    this.h = {},
      Object.assign(this, t),
      this.event = t.event,
      this.u = e,
      this.l = new p,
      this.p = [],
      this.v = [...e.plugins],
      this.g = new Map;
    for (const e of this.v)
      this.g.set(e, {});
    this.event.waitUntil(this.l.promise)
  }
  fetch(e) {
    return this.waitUntil((async () => {
      const { event: s } = this;
      let n = v(e);
      if ("navigate" === n.mode && s instanceof FetchEvent && s.preloadResponse) {
        const e = await s.preloadResponse;
        if (e)
          return e
      }
      const i = this.hasCallback("fetchDidFail") ? n.clone() : null;
      try {
        for (const e of this.iterateCallbacks("requestWillFetch"))
          n = await e({
            request: n.clone(),
            event: s
          })
      } catch (e) {
        throw new t("plugin-error-request-will-fetch", {
          thrownError: e
        })
      }
      const c = n.clone();
      try {
        let e;
        e = await fetch(n, "navigate" === n.mode ? void 0 : this.u.fetchOptions);
        for (const t of this.iterateCallbacks("fetchDidSucceed"))
          e = await t({
            event: s,
            request: c,
            response: e
          });
        return e
      } catch (e) {
        throw i && await this.runCallbacks("fetchDidFail", {
          error: e,
          event: s,
          originalRequest: i.clone(),
          request: c.clone()
        }),
        e
      }
    }
    )())
  }
  async fetchAndCachePut(e) {
    const t = await this.fetch(e)
      , s = t.clone();
    return this.waitUntil(this.cachePut(e, s)),
      t
  }
  cacheMatch(e) {
    return this.waitUntil((async () => {
      const t = v(e);
      let s;
      const { cacheName: n, matchOptions: i } = this.u
        , c = await this.getCacheKey(t, "read")
        , r = b({}, i, {
          cacheName: n
        });
      s = await caches.match(c, r);
      for (const e of this.iterateCallbacks("cachedResponseWillBeUsed"))
        s = await e({
          cacheName: n,
          matchOptions: i,
          cachedResponse: s,
          request: c,
          event: this.event
        }) || void 0;
      return s
    }
    )())
  }
  async cachePut(e, s) {
    const n = v(e);
    var i;
    await (i = 0,
      new Promise((e => setTimeout(e, i))));
    const c = await this.getCacheKey(n, "write");
    if (!s)
      throw new t("cache-put-with-no-response", {
        url: (r = c.url,
          new URL(String(r), location.href).href.replace(new RegExp(`^${location.origin}`), ""))
      });
    var r;
    const a = await this.m(s);
    if (!a)
      return !1;
    const { cacheName: o, matchOptions: h } = this.u
      , d = await self.caches.open(o)
      , f = this.hasCallback("cacheDidUpdate")
      , u = f ? await async function (e, t, s, n) {
        const i = w(t.url, s);
        if (t.url === i)
          return e.match(t, n);
        const c = b({}, n, {
          ignoreSearch: !0
        })
          , r = await e.keys(t, c);
        for (const t of r)
          if (i === w(t.url, s))
            return e.match(t, n)
      }(d, c.clone(), ["__WB_REVISION__"], h) : null;
    try {
      await d.put(c, f ? a.clone() : a)
    } catch (e) {
      throw "QuotaExceededError" === e.name && await async function () {
        for (const e of y)
          await e()
      }(),
      e
    }
    for (const e of this.iterateCallbacks("cacheDidUpdate"))
      await e({
        cacheName: o,
        oldResponse: u,
        newResponse: a.clone(),
        request: c,
        event: this.event
      });
    return !0
  }
  async getCacheKey(e, t) {
    if (!this.h[t]) {
      let s = e;
      for (const e of this.iterateCallbacks("cacheKeyWillBeUsed"))
        s = v(await e({
          mode: t,
          request: s,
          event: this.event,
          params: this.params
        }));
      this.h[t] = s
    }
    return this.h[t]
  }
  hasCallback(e) {
    for (const t of this.u.plugins)
      if (e in t)
        return !0;
    return !1
  }
  async runCallbacks(e, t) {
    for (const s of this.iterateCallbacks(e))
      await s(t)
  }
  *iterateCallbacks(e) {
    for (const t of this.u.plugins)
      if ("function" == typeof t[e]) {
        const s = this.g.get(t)
          , n = n => {
            const i = b({}, n, {
              state: s
            });
            return t[e](i)
          }
          ;
        yield n
      }
  }
  waitUntil(e) {
    return this.p.push(e),
      e
  }
  async doneWaiting() {
    let e;
    for (; e = this.p.shift();)
      await e
  }
  destroy() {
    this.l.resolve()
  }
  async m(e) {
    let t = e
      , s = !1;
    for (const e of this.iterateCallbacks("cacheWillUpdate"))
      if (t = await e({
        request: this.request,
        response: t,
        event: this.event
      }) || void 0,
        s = !0,
        !t)
        break;
    return s || t && 200 !== t.status && (t = void 0),
      t
  }
}
class m {
  constructor(e = {}) {
    this.cacheName = l(e.cacheName),
      this.plugins = e.plugins || [],
      this.fetchOptions = e.fetchOptions,
      this.matchOptions = e.matchOptions
  }
  handle(e) {
    const [t] = this.handleAll(e);
    return t
  }
  handleAll(e) {
    e instanceof FetchEvent && (e = {
      event: e,
      request: e.request
    });
    const t = e.event
      , s = "string" == typeof e.request ? new Request(e.request) : e.request
      , n = "params" in e ? e.params : void 0
      , i = new g(this, {
        event: t,
        request: s,
        params: n
      })
      , c = this.R(i, s, t);
    return [c, this.S(c, i, s, t)]
  }
  async R(e, s, n) {
    let i;
    await e.runCallbacks("handlerWillStart", {
      event: n,
      request: s
    });
    try {
      if (i = await this.N(s, e),
        !i || "error" === i.type)
        throw new t("no-response", {
          url: s.url
        })
    } catch (t) {
      for (const c of e.iterateCallbacks("handlerDidError"))
        if (i = await c({
          error: t,
          event: n,
          request: s
        }),
          i)
          break;
      if (!i)
        throw t
    }
    for (const t of e.iterateCallbacks("handlerWillRespond"))
      i = await t({
        event: n,
        request: s,
        response: i
      });
    return i
  }
  async S(e, t, s, n) {
    let i, c;
    try {
      i = await e
    } catch (c) { }
    try {
      await t.runCallbacks("handlerDidRespond", {
        event: n,
        request: s,
        response: i
      }),
        await t.doneWaiting()
    } catch (e) {
      c = e
    }
    if (await t.runCallbacks("handlerDidComplete", {
      event: n,
      request: s,
      response: i,
      error: c
    }),
      t.destroy(),
      c)
      throw c
  }
}
function R(e, t) {
  const s = t();
  return e.waitUntil(s),
    s
}
try {
  self["workbox:precaching:6.1.1"] && _()
} catch (e) { }
function S(e) {
  if (!e)
    throw new t("add-to-cache-list-unexpected-type", {
      entry: e
    });
  if ("string" == typeof e) {
    const t = new URL(e, location.href);
    return {
      cacheKey: t.href,
      url: t.href
    }
  }
  const { revision: s, url: n } = e;
  if (!n)
    throw new t("add-to-cache-list-unexpected-type", {
      entry: e
    });
  if (!s) {
    const e = new URL(n, location.href);
    return {
      cacheKey: e.href,
      url: e.href
    }
  }
  const i = new URL(n, location.href)
    , c = new URL(n, location.href);
  return i.searchParams.set("__WB_REVISION__", s),
  {
    cacheKey: i.href,
    url: c.href
  }
}
class N {
  constructor() {
    this.updatedURLs = [],
      this.notUpdatedURLs = [],
      this.handlerWillStart = async ({ request: e, state: t }) => {
        t && (t.originalRequest = e)
      }
      ,
      this.cachedResponseWillBeUsed = async ({ event: e, state: t, cachedResponse: s }) => {
        if ("install" === e.type) {
          const e = t.originalRequest.url;
          s ? this.notUpdatedURLs.push(e) : this.updatedURLs.push(e)
        }
        return s
      }
  }
}
class q {
  constructor({ precacheController: e }) {
    this.cacheKeyWillBeUsed = async ({ request: e, params: t }) => {
      const s = t && t.cacheKey || this.q.getCacheKeyForURL(e.url);
      return s ? new Request(s) : e
    }
      ,
      this.q = e
  }
}
let U, C;
async function L(e, s) {
  let n = null;
  if (e.url) {
    n = new URL(e.url).origin
  }
  if (n !== self.location.origin)
    throw new t("cross-origin-copy-response", {
      origin: n
    });
  const i = e.clone()
    , c = {
      headers: new Headers(i.headers),
      status: i.status,
      statusText: i.statusText
    }
    , r = s ? s(c) : c
    , a = function () {
      if (void 0 === U) {
        const e = new Response("");
        if ("body" in e)
          try {
            new Response(e.body),
              U = !0
          } catch (e) {
            U = !1
          }
        U = !1
      }
      return U
    }() ? i.body : await i.blob();
  return new Response(a, r)
}
class H extends m {
  constructor(e = {}) {
    e.cacheName = u(e.cacheName),
      super(e),
      this._ = !1 !== e.fallbackToNetwork,
      this.plugins.push(H.copyRedirectedCacheableResponsesPlugin)
  }
  async N(e, t) {
    const s = await t.cacheMatch(e);
    return s || (t.event && "install" === t.event.type ? await this.U(e, t) : await this.C(e, t))
  }
  async C(e, s) {
    let n;
    if (!this._)
      throw new t("missing-precache-entry", {
        cacheName: this.cacheName,
        url: e.url
      });
    return n = await s.fetch(e),
      n
  }
  async U(e, s) {
    this.L();
    const n = await s.fetch(e);
    if (!await s.cachePut(e, n.clone()))
      throw new t("bad-precaching-response", {
        url: e.url,
        status: n.status
      });
    return n
  }
  L() {
    let e = null
      , t = 0;
    for (const [s, n] of this.plugins.entries())
      n !== H.copyRedirectedCacheableResponsesPlugin && (n === H.defaultPrecacheCacheabilityPlugin && (e = s),
        n.cacheWillUpdate && t++);
    0 === t ? this.plugins.push(H.defaultPrecacheCacheabilityPlugin) : t > 1 && null !== e && this.plugins.splice(e, 1)
  }
}
H.defaultPrecacheCacheabilityPlugin = {
  cacheWillUpdate: async ({ response: e }) => !e || e.status >= 400 ? null : e
},
  H.copyRedirectedCacheableResponsesPlugin = {
    cacheWillUpdate: async ({ response: e }) => e.redirected ? await L(e) : e
  };
class W {
  constructor({ cacheName: e, plugins: t = [], fallbackToNetwork: s = !0 } = {}) {
    this.H = new Map,
      this.W = new Map,
      this.T = new Map,
      this.u = new H({
        cacheName: u(e),
        plugins: [...t, new q({
          precacheController: this
        })],
        fallbackToNetwork: s
      }),
      this.install = this.install.bind(this),
      this.activate = this.activate.bind(this)
  }
  get strategy() {
    return this.u
  }
  precache(e) {
    this.addToCacheList(e),
      this.O || (self.addEventListener("install", this.install),
        self.addEventListener("activate", this.activate),
        this.O = !0)
  }
  addToCacheList(e) {
    const s = [];
    for (const n of e) {
      "string" == typeof n ? s.push(n) : n && void 0 === n.revision && s.push(n.url);
      const { cacheKey: e, url: i } = S(n)
        , c = "string" != typeof n && n.revision ? "reload" : "default";
      if (this.H.has(i) && this.H.get(i) !== e)
        throw new t("add-to-cache-list-conflicting-entries", {
          firstEntry: this.H.get(i),
          secondEntry: e
        });
      if ("string" != typeof n && n.integrity) {
        if (this.T.has(e) && this.T.get(e) !== n.integrity)
          throw new t("add-to-cache-list-conflicting-integrities", {
            url: i
          });
        this.T.set(e, n.integrity)
      }
      if (this.H.set(i, e),
        this.W.set(i, c),
        s.length > 0) {
        const e = `Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
        console.warn(e)
      }
    }
  }
  install(e) {
    return R(e, (async () => {
      const t = new N;
      this.strategy.plugins.push(t);
      for (const [t, s] of this.H) {
        const n = this.T.get(s)
          , i = this.W.get(t)
          , c = new Request(t, {
            integrity: n,
            cache: i,
            credentials: "same-origin"
          });
        await Promise.all(this.strategy.handleAll({
          params: {
            cacheKey: s
          },
          request: c,
          event: e
        }))
      }
      const { updatedURLs: s, notUpdatedURLs: n } = t;
      return {
        updatedURLs: s,
        notUpdatedURLs: n
      }
    }
    ))
  }
  activate(e) {
    return R(e, (async () => {
      const e = await self.caches.open(this.strategy.cacheName)
        , t = await e.keys()
        , s = new Set(this.H.values())
        , n = [];
      for (const i of t)
        s.has(i.url) || (await e.delete(i),
          n.push(i.url));
      return {
        deletedURLs: n
      }
    }
    ))
  }
  getURLsToCacheKeys() {
    return this.H
  }
  getCachedURLs() {
    return [...this.H.keys()]
  }
  getCacheKeyForURL(e) {
    const t = new URL(e, location.href);
    return this.H.get(t.href)
  }
  async matchPrecache(e) {
    const t = e instanceof Request ? e.url : e
      , s = this.getCacheKeyForURL(t);
    if (s) {
      return (await self.caches.open(this.strategy.cacheName)).match(s)
    }
  }
  createHandlerBoundToURL(e) {
    const s = this.getCacheKeyForURL(e);
    if (!s)
      throw new t("non-precached-url", {
        url: e
      });
    return t => (t.request = new Request(e),
      t.params = b({
        cacheKey: s
      }, t.params),
      this.strategy.handle(t))
  }
}
const x = () => (C || (C = new W),
  C);
class E extends n {
  constructor(e, t) {
    super((({ request: s }) => {
      const n = e.getURLsToCacheKeys();
      for (const e of function* (e, { ignoreURLParametersMatching: t = [/^utm_/, /^fbclid$/], directoryIndex: s = "index.html", cleanURLs: n = !0, urlManipulation: i } = {}) {
        const c = new URL(e, location.href);
        c.hash = "",
          yield c.href;
        console.log(c.href)
        const r = function (e, t = []) {
          for (const s of [...e.searchParams.keys()])
            t.some((e => e.test(s))) && e.searchParams.delete(s);
          return e
        }(c, t);
        if (yield r.href,
          s && r.pathname.endsWith("/")) {
          const e = new URL(r.href);
          e.pathname += s,
            yield e.href
        }
        if (n) {
          const e = new URL(r.href);
          e.pathname += ".html",
            yield e.href
        }
        if (i) {
          const e = i({
            url: c
          });
          for (const t of e)
            yield t.href
        }
      }(s.url, t)) {
        const t = n.get(e);
        if (t)
          return {
            cacheKey: t
          }
      }
    }
    ), e.strategy)
  }
}
var T, O;
self.skipWaiting(),
  self.addEventListener("activate", (() => self.clients.claim())),
  T = {},
  function (e) {
    x().precache(e)
  }([{
    url: "/appShell.html",
    revision: "1695122224615"
  }, {
    url: "https://localhost:11451/siren/site/favicon.ico",
    revision: "691511c4d25432d5504fe07e3753ab2c"
  }, {
    url: "https://localhost:11451/siren/site/static/Bender.0d3c9c62.eot",
    revision: "bd1adc901b94ca66a83cdb0d439933c5"
  }, {
    url: "https://localhost:11451/siren/site/static/Bender.11795b1b.woff",
    revision: "45fbf8dd8d2f57514a6bd1ddfe4d9873"
  }, {
    url: "https://localhost:11451/siren/site/static/Bender.39b9791f.ttf",
    revision: "22da1999b65f3831ee16c0a3fe9c24ee"
  }, {
    url: "https://localhost:11451/siren/site/static/Bender.b9131ac7.svg",
    revision: "8b0e7339b6c0f5cbf0ee2c39a6320c8e"
  }, {
    url: "https://localhost:11451/siren/site/static/Geometos.73852980.eot",
    revision: "0a9385620942372f3fea2cd01b09512d"
  }, {
    url: "https://localhost:11451/siren/site/static/Geometos.76f01edc.woff",
    revision: "485d50d3aa6dca14511b56bf85fdc08f"
  }, {
    url: "https://localhost:11451/siren/site/static/Geometos.b4b69057.svg",
    revision: "385da599a9cfc32cca22e59ce59e6a0c"
  }, {
    url: "https://localhost:11451/siren/site/static/Geometos.f643a91a.ttf",
    revision: "8db94ce247ff2ab0b07a11e94f79591c"
  }, {
    url: "https://localhost:11451/siren/site/static/NovecentoSansWide-Normal.015a79b3.eot",
    revision: "18e1b60a8a40c99570dd905a0b59e745"
  }, {
    url: "https://localhost:11451/siren/site/static/NovecentoSansWide-Normal.5496e67e.svg",
    revision: "0239d0d0c64c19c6beca3ae0ad52c082"
  }, {
    url: "https://localhost:11451/siren/site/static/NovecentoSansWide-Normal.ddaefd96.ttf",
    revision: "324de03d18d6e442cd71d1e71b7c8ff6"
  }, {
    url: "https://localhost:11451/siren/site/static/NovecentoSansWide-Normal.e7805af0.woff",
    revision: "b5dbaf24e894adf80125efe7c18b14bf"
  }, {
    url: "https://localhost:11451/siren/site/static/NovecentoSansWide-UltraLight.3770f329.svg",
    revision: "692467deae03876dd4e8d30a2c0d172f"
  }, {
    url: "https://localhost:11451/siren/site/static/NovecentoSansWide-UltraLight.9f4c8be9.woff",
    revision: "170f34a4659b6f81ed1421b655d740ae"
  }, {
    url: "https://localhost:11451/siren/site/static/NovecentoSansWide-UltraLight.c38b83c5.ttf",
    revision: "d2ba6c549a4bdb69beb07191e50742d9"
  }, {
    url: "https://localhost:11451/siren/site/static/NovecentoSansWide-UltraLight.d6f99b49.eot",
    revision: "e8a984bdfcd8ccb9798f641e506f5be0"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Bold.23527b5f.svg",
    revision: "8f7b2528e53026218a703f19ef276a22"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Bold.80092f79.woff",
    revision: "945f6150b92d0e439068b0b414760e0c"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Bold.bfadba10.eot",
    revision: "0506c7e3c5f1ec62fbbe9351086ad6ef"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Bold.da0a3d5e.ttf",
    revision: "2e0e8dd96535eeb2916b7ca0446c23a3"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Medium.36e43fc7.svg",
    revision: "7a568f56f7837d603ce7c0189b2ed804"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Medium.55379b93.woff",
    revision: "eae8898efbaf81ad7e04a6603a6d4807"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Medium.b5006a15.eot",
    revision: "f1a1d17030b17b47e63322b6202ffd17"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Medium.e1a7befb.ttf",
    revision: "ea30845d211fc3ba86f5b398efcf1c66"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Regular.2e12e12e.ttf",
    revision: "1623a6dc0850ee3b0b8ec18ad48e163d"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Regular.325e22cd.woff",
    revision: "dd8ac4bcc303451107134d8a8dcd1036"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Regular.481dbb74.eot",
    revision: "acb47400afd60af1870c5e1cc3f52c04"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSansCN-Regular.96f67806.svg",
    revision: "9070022aff55ed3f629d9d79cf4fd576"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSerifCN-Heavy.1c7cb620.woff",
    revision: "f8924f09ebd7c76079aaac61ed8859e3"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSerifCN-Heavy.35027919.svg",
    revision: "e5fc2d79fd384f95a3e8ed770a75d402"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSerifCN-Heavy.717500b5.ttf",
    revision: "4a276d3de575b41a80c5cb8b828a500a"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSerifCN-Heavy.7bc8c979.eot",
    revision: "a57cac8c53c663dd56b6dab3b2aeacbf"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSerifCN-Regular.33630529.svg",
    revision: "c08883d78acf02baadd6158d98d274a1"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSerifCN-Regular.b962f6d2.ttf",
    revision: "4f40c1a0aa1967a0d92475278aef086b"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSerifCN-Regular.bb26b595.eot",
    revision: "1778a43782f41f3aa8cd2c442ea0e389"
  }, {
    url: "https://localhost:11451/siren/site/static/SourceHanSerifCN-Regular.ce5bffe3.woff",
    revision: "4c26e0502d6d98cf6765d100e39d6b3a"
  }, {
    url: "https://localhost:11451/siren/site/static/bg-info.3be98aea.png",
    revision: "fc2c85e610d2bc4ada4c7cee66de5e15"
  }, {
    url: "https://localhost:11451/siren/site/static/bg-music-play.b00c7d0a.png",
    revision: "b6b5030bb71f187c9a3d4c54aefb92f7"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_about.96d7c1c3.png",
    revision: "e76d98c7e4ef916aaaef902b18a7dab0"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_album_detail.b6a577d2.png",
    revision: "7b00f6b24c1b217d8a4ac2a56db4f375"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_contact_h5.c8635cb5.png",
    revision: "0c781fe30ca553dc70ce29e29fe5e7ce"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_h5.9013681d.png",
    revision: "edc16976ee35254c5d23732eb0ad36ab"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_index.e734f0e3.png",
    revision: "f08448258163a9bdd4b235739dddf8d2"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_index_h5.1b3d3a14.png",
    revision: "3793f5e2b11ec4e7c39eaaa4ff3d3265"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_inner.3d1e0e7c.png",
    revision: "564a6cb7adb171f41e4de4d9c3f48369"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_loading.6e8e3229.png",
    revision: "c71fa5d7691b84780b761f3b69a43244"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_menu_h5.1c19747b.png",
    revision: "5e086d15a94e29f39cc9c9cb6cc3e20d"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_modal.d4749766.png",
    revision: "d6d8e8f9969785d3e0e342557b1f6476"
  }, {
    url: "https://localhost:11451/siren/site/static/bg_pole.bfa19473.png",
    revision: "252c4a2d0f8e15b6dfd61ee65ade7d3a"
  }, {
    url: "https://localhost:11451/siren/site/static/copyright.a1f8ed16.png",
    revision: "dbab4b7b945afa6f8882517c504c8762"
  }, {
    url: "https://localhost:11451/siren/site/static/cursor-default.9c62a210.svg",
    revision: "adc94fa23b1092c7481b335b4474c432"
  }, {
    url: "https://localhost:11451/siren/site/static/cursor-play.2f5d726b.svg",
    revision: "94c2c0c1aff5680fe440aa7025ab351a"
  }, {
    url: "https://localhost:11451/siren/site/static/cursor-pointer.85abc5ae.svg",
    revision: "40d395d46e870cb9acfe39569f907d51"
  }, {
    url: "https://localhost:11451/siren/site/static/share_logo.b11ee809.png",
    revision: "44bcf8a322e44ba447cd1b4c9920ff37"
  }, {
    url: "https://localhost:11451/siren/site/static/vinyl-pointer.75720e5f.png",
    revision: "094343971475c2ea61b9b81b8ae1d8d4"
  }, {
    url: "https://localhost:11451/siren/site/umi.62693412.css",
    revision: null
  }, {
    url: "https://localhost:11451/siren/site/umi.87fedd26.js",
    revision: null
  }]),
  function (e) {
    const t = x();
    o(new E(t, e))
  }(T),
  o(new class extends n {
    constructor(e, { allowlist: t = [/./], denylist: s = [] } = {}) {
      super((e => this.P(e)), e),
        this.k = t,
        this.M = s
    }
    P({ url: e, request: t }) {
      if (t && "navigate" !== t.mode)
        return !1;
      const s = e.pathname + e.search;
      for (const e of this.M)
        if (e.test(s))
          return !1;
      return !!this.k.some((e => e.test(s)))
    }
  }
    ((O = "/appShell.html",
      x().createHandlerBoundToURL(O)), {
      denylist: [/\/api\//, /\/special\//]
    })),
  o(/\/api\//, new class extends m {
    constructor(e = {}) {
      super(e),
        this.plugins.some((e => "cacheWillUpdate" in e)) || this.plugins.unshift(h),
        this.B = e.networkTimeoutSeconds || 0
    }
    async N(e, s) {
      const n = []
        , i = [];
      let c;
      if (this.B) {
        const { id: t, promise: r } = this.K({
          request: e,
          logs: n,
          handler: s
        });
        c = t,
          i.push(r)
      }
      const r = this.D({
        timeoutId: c,
        request: e,
        logs: n,
        handler: s
      });
      i.push(r);
      const a = await s.waitUntil((async () => await s.waitUntil(Promise.race(i)) || await r)());
      if (!a)
        throw new t("no-response", {
          url: e.url
        });
      return a
    }
    K({ request: e, logs: t, handler: s }) {
      let n;
      return {
        promise: new Promise((t => {
          n = setTimeout((async () => {
            t(await s.cacheMatch(e))
          }
          ), 1e3 * this.B)
        }
        )),
        id: n
      }
    }
    async D({ timeoutId: e, request: t, logs: s, handler: n }) {
      let i, c;
      try {
        c = await n.fetchAndCachePut(t)
      } catch (e) {
        i = e
      }
      return e && clearTimeout(e),
        !i && c || (c = await n.cacheMatch(t)),
        c
    }
  }
    ({
      networkTimeoutSeconds: 20,
      plugins: []
    }), "GET");
