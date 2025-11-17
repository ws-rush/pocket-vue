/**
* @vue/shared v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function pt(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const ht = Object.assign, dt = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, mt = Object.prototype.hasOwnProperty, le = (e, t) => mt.call(e, t), y = Array.isArray, ne = (e) => me(e) === "[object Map]", Te = (e) => me(e) === "[object Date]", C = (e) => typeof e == "string", $ = (e) => typeof e == "symbol", T = (e) => e !== null && typeof e == "object", vt = Object.prototype.toString, me = (e) => vt.call(e), gt = (e) => me(e).slice(8, -1), ve = (e) => C(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Le = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, yt = /-\w/g, bt = Le(
  (e) => e.replace(yt, (t) => t.slice(1).toUpperCase())
), xt = /\B([A-Z])/g, Ke = Le(
  (e) => e.replace(xt, "-$1").toLowerCase()
), He = (e, t) => !Object.is(e, t), Ae = (e) => {
  const t = C(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
function ze(e) {
  if (y(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = C(s) ? Et(s) : ze(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (C(e) || T(e))
    return e;
}
const _t = /;(?![^(]*\))/g, wt = /:([^]+)/, St = /\/\*[^]*?\*\//g;
function Et(e) {
  const t = {};
  return e.replace(St, "").split(_t).forEach((n) => {
    if (n) {
      const s = n.split(wt);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function Fe(e) {
  let t = "";
  if (C(e))
    t = e;
  else if (y(e))
    for (let n = 0; n < e.length; n++) {
      const s = Fe(e[n]);
      s && (t += s + " ");
    }
  else if (T(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function Rt(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++)
    n = j(e[s], t[s]);
  return n;
}
function j(e, t) {
  if (e === t) return !0;
  let n = Te(e), s = Te(t);
  if (n || s)
    return n && s ? e.getTime() === t.getTime() : !1;
  if (n = $(e), s = $(t), n || s)
    return e === t;
  if (n = y(e), s = y(t), n || s)
    return n && s ? Rt(e, t) : !1;
  if (n = T(e), s = T(t), n || s) {
    if (!n || !s)
      return !1;
    const i = Object.keys(e).length, r = Object.keys(t).length;
    if (i !== r)
      return !1;
    for (const o in e) {
      const c = e.hasOwnProperty(o), l = t.hasOwnProperty(o);
      if (c && !l || !c && l || !j(e[o], t[o]))
        return !1;
    }
  }
  return String(e) === String(t);
}
function ge(e, t) {
  return e.findIndex((n) => j(n, t));
}
/**
* @vue/reactivity v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let h;
const se = /* @__PURE__ */ new WeakSet();
class Oe {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, se.has(this) && (se.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Tt(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, De(this), qe(this);
    const t = h, n = _;
    h = this, _ = !0;
    try {
      return this.fn();
    } finally {
      Je(this), h = t, _ = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        xe(t);
      this.deps = this.depsTail = void 0, De(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? se.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    fe(this) && this.run();
  }
  get dirty() {
    return fe(this);
  }
}
let We = 0, N, V;
function Tt(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = V, V = e;
    return;
  }
  e.next = N, N = e;
}
function ye() {
  We++;
}
function be() {
  if (--We > 0)
    return;
  if (V) {
    let t = V;
    for (V = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; N; ) {
    let t = N;
    for (N = void 0; t; ) {
      const n = t.next;
      if (t.next = void 0, t.flags &= -9, t.flags & 1)
        try {
          t.trigger();
        } catch (s) {
          e || (e = s);
        }
      t = n;
    }
  }
  if (e) throw e;
}
function qe(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Je(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), xe(s), Ot(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function fe(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (At(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function At(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === J) || (e.globalVersion = J, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !fe(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = h, s = _;
  h = e, _ = !0;
  try {
    qe(e);
    const i = e.fn(e._value);
    (t.version === 0 || He(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    h = n, _ = s, Je(e), e.flags &= -3;
  }
}
function xe(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      xe(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ot(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function Dt(e, t) {
  e.effect instanceof Oe && (e = e.effect.fn);
  const n = new Oe(e);
  t && ht(n, t);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const s = n.run.bind(n);
  return s.effect = n, s;
}
function kt(e) {
  e.effect.stop();
}
let _ = !0;
const Ye = [];
function Ct() {
  Ye.push(_), _ = !1;
}
function $t() {
  const e = Ye.pop();
  _ = e === void 0 ? !0 : e;
}
function De(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = h;
    h = void 0;
    try {
      t();
    } finally {
      h = n;
    }
  }
}
let J = 0;
class It {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Mt {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!h || !_ || h === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== h)
      n = this.activeLink = new It(h, this), h.deps ? (n.prevDep = h.depsTail, h.depsTail.nextDep = n, h.depsTail = n) : h.deps = h.depsTail = n, Ze(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = h.depsTail, n.nextDep = void 0, h.depsTail.nextDep = n, h.depsTail = n, h.deps === n && (h.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, J++, this.notify(t);
  }
  notify(t) {
    ye();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      be();
    }
  }
}
function Ze(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Ze(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const ue = /* @__PURE__ */ new WeakMap(), W = Symbol(
  ""
), ke = Symbol(
  ""
), L = Symbol(
  ""
);
function I(e, t, n) {
  if (_ && h) {
    let s = ue.get(e);
    s || ue.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new Mt()), i.map = s, i.key = n), i.track();
  }
}
function ie(e, t, n, s, i, r) {
  const o = ue.get(e);
  if (!o) {
    J++;
    return;
  }
  const c = (l) => {
    l && l.trigger();
  };
  if (ye(), t === "clear")
    o.forEach(c);
  else {
    const l = y(e), f = l && ve(n);
    if (l && n === "length") {
      const a = Number(s);
      o.forEach((p, u) => {
        (u === "length" || u === L || !$(u) && u >= a) && c(p);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && c(o.get(n)), f && c(o.get(L)), t) {
        case "add":
          l ? f && c(o.get("length")) : (c(o.get(W)), ne(e) && c(o.get(ke)));
          break;
        case "delete":
          l || (c(o.get(W)), ne(e) && c(o.get(ke)));
          break;
        case "set":
          ne(e) && c(o.get(W));
          break;
      }
  }
  be();
}
function M(e) {
  const t = S(e);
  return t === e ? t : (I(t, "iterate", L), F(e) ? t : t.map(w));
}
function _e(e) {
  return I(e = S(e), "iterate", L), e;
}
const jt = {
  __proto__: null,
  [Symbol.iterator]() {
    return re(this, Symbol.iterator, w);
  },
  concat(...e) {
    return M(this).concat(
      ...e.map((t) => y(t) ? M(t) : t)
    );
  },
  entries() {
    return re(this, "entries", (e) => (e[1] = w(e[1]), e));
  },
  every(e, t) {
    return R(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return R(this, "filter", e, t, (n) => n.map(w), arguments);
  },
  find(e, t) {
    return R(this, "find", e, t, w, arguments);
  },
  findIndex(e, t) {
    return R(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return R(this, "findLast", e, t, w, arguments);
  },
  findLastIndex(e, t) {
    return R(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return R(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return oe(this, "includes", e);
  },
  indexOf(...e) {
    return oe(this, "indexOf", e);
  },
  join(e) {
    return M(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return oe(this, "lastIndexOf", e);
  },
  map(e, t) {
    return R(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return P(this, "pop");
  },
  push(...e) {
    return P(this, "push", e);
  },
  reduce(e, ...t) {
    return Ce(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Ce(this, "reduceRight", e, t);
  },
  shift() {
    return P(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return R(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return P(this, "splice", e);
  },
  toReversed() {
    return M(this).toReversed();
  },
  toSorted(e) {
    return M(this).toSorted(e);
  },
  toSpliced(...e) {
    return M(this).toSpliced(...e);
  },
  unshift(...e) {
    return P(this, "unshift", e);
  },
  values() {
    return re(this, "values", w);
  }
};
function re(e, t, n) {
  const s = _e(e), i = s[t]();
  return s !== e && !F(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.value && (r.value = n(r.value)), r;
  }), i;
}
const Pt = Array.prototype;
function R(e, t, n, s, i, r) {
  const o = _e(e), c = o !== e && !F(e), l = o[t];
  if (l !== Pt[t]) {
    const p = l.apply(e, r);
    return c ? w(p) : p;
  }
  let f = n;
  o !== e && (c ? f = function(p, u) {
    return n.call(this, w(p), u, e);
  } : n.length > 2 && (f = function(p, u) {
    return n.call(this, p, u, e);
  }));
  const a = l.call(o, f, s);
  return c && i ? i(a) : a;
}
function Ce(e, t, n, s) {
  const i = _e(e);
  let r = n;
  return i !== e && (F(e) ? n.length > 3 && (r = function(o, c, l) {
    return n.call(this, o, c, l, e);
  }) : r = function(o, c, l) {
    return n.call(this, o, w(c), l, e);
  }), i[t](r, ...s);
}
function oe(e, t, n) {
  const s = S(e);
  I(s, "iterate", L);
  const i = s[t](...n);
  return (i === -1 || i === !1) && Yt(n[0]) ? (n[0] = S(n[0]), s[t](...n)) : i;
}
function P(e, t, n = []) {
  Ct(), ye();
  const s = S(e)[t].apply(e, n);
  return be(), $t(), s;
}
const Nt = /* @__PURE__ */ pt("__proto__,__v_isRef,__isVue"), Ge = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter($)
);
function Vt(e) {
  $(e) || (e = String(e));
  const t = S(this);
  return I(t, "has", e), t.hasOwnProperty(e);
}
class Qe {
  constructor(t = !1, n = !1) {
    this._isReadonly = t, this._isShallow = n;
  }
  get(t, n, s) {
    if (n === "__v_skip") return t.__v_skip;
    const i = this._isReadonly, r = this._isShallow;
    if (n === "__v_isReactive")
      return !i;
    if (n === "__v_isReadonly")
      return i;
    if (n === "__v_isShallow")
      return r;
    if (n === "__v_raw")
      return s === (i ? r ? Ft : Xe : r ? zt : Ue).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = y(t);
    if (!i) {
      let l;
      if (o && (l = jt[n]))
        return l;
      if (n === "hasOwnProperty")
        return Vt;
    }
    const c = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      B(t) ? t : s
    );
    return ($(n) ? Ge.has(n) : Nt(n)) || (i || I(t, "get", n), r) ? c : B(c) ? o && ve(n) ? c : c.value : T(c) ? i ? Jt(c) : z(c) : c;
  }
}
class Bt extends Qe {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    if (!this._isShallow) {
      const l = ae(r);
      if (!F(s) && !ae(s) && (r = S(r), s = S(s)), !y(t) && B(r) && !B(s))
        return l || (r.value = s), !0;
    }
    const o = y(t) && ve(n) ? Number(n) < t.length : le(t, n), c = Reflect.set(
      t,
      n,
      s,
      B(t) ? t : i
    );
    return t === S(i) && (o ? He(s, r) && ie(t, "set", n, s) : ie(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = le(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && ie(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!$(n) || !Ge.has(n)) && I(t, "has", n), s;
  }
  ownKeys(t) {
    return I(
      t,
      "iterate",
      y(t) ? "length" : W
    ), Reflect.ownKeys(t);
  }
}
class Lt extends Qe {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const Kt = /* @__PURE__ */ new Bt(), Ht = /* @__PURE__ */ new Lt(), Ue = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new WeakMap(), Xe = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap();
function Wt(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function qt(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Wt(gt(e));
}
function z(e) {
  return ae(e) ? e : et(
    e,
    !1,
    Kt,
    null,
    Ue
  );
}
function Jt(e) {
  return et(
    e,
    !0,
    Ht,
    null,
    Xe
  );
}
function et(e, t, n, s, i) {
  if (!T(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = qt(e);
  if (r === 0)
    return e;
  const o = i.get(e);
  if (o)
    return o;
  const c = new Proxy(
    e,
    r === 2 ? s : n
  );
  return i.set(e, c), c;
}
function ae(e) {
  return !!(e && e.__v_isReadonly);
}
function F(e) {
  return !!(e && e.__v_isShallow);
}
function Yt(e) {
  return e ? !!e.__v_raw : !1;
}
function S(e) {
  const t = e && e.__v_raw;
  return t ? S(t) : e;
}
const w = (e) => T(e) ? z(e) : e;
function B(e) {
  return e ? e.__v_isRef === !0 : !1;
}
let Y = !1;
const K = [], $e = Promise.resolve(), we = (e) => e ? $e.then(e) : $e.then(() => new Promise((t) => {
  const n = () => {
    K.length === 0 && !Y ? t(void 0) : setTimeout(n, 0);
  };
  n();
})), Ie = (e) => {
  K.includes(e) || K.push(e), Y || (Y = !0, setTimeout(Zt, 0));
}, Zt = () => {
  for (const e of K)
    e();
  K.length = 0, Y = !1;
}, Gt = /^(spellcheck|draggable|form|list|type)$/, pe = ({
  el: e,
  get: t,
  effect: n,
  arg: s,
  modifiers: i
}) => {
  let r;
  s === "class" && (e._class = e.className), n(() => {
    let o = t();
    if (s)
      i?.camel && (s = bt(s)), ce(e, s, o, r, i?.camel);
    else {
      for (const c in o)
        ce(e, c, o[c], r && r[c]);
      for (const c in r)
        (!o || !(c in o)) && ce(e, c, null);
    }
    r = o;
  });
}, ce = (e, t, n, s, i) => {
  const { style: r } = e;
  if (t === "class") {
    const o = Fe(e._class ? [e._class, n] : n) || "";
    e.setAttribute("class", o);
  } else if (t === "style")
    if (n = ze(n), !n)
      e.removeAttribute("style");
    else if (C(n))
      n !== s && (r.cssText = n);
    else {
      for (const o in n)
        he(r, o, n[o]);
      if (s && !C(s))
        for (const o in s)
          n[o] == null && he(r, o, "");
    }
  else t !== "class" && t !== "style" && !(e instanceof SVGElement) && (t in e || i) && !Gt.test(t) ? t === "id" || t === "title" || t === "lang" || t === "dir" ? n == null ? e.removeAttribute(t) : e.setAttribute(t, n) : (e[t] = n, t === "value" && (e._value = n)) : t === "true-value" ? e._trueValue = n : t === "false-value" ? e._falseValue = n : n != null ? e.setAttribute(t, n) : e.removeAttribute(t);
}, Me = /\s*!important$/, he = (e, t, n) => {
  y(n) ? n.forEach((s) => he(e, t, s)) : t.startsWith("--") ? e.setProperty(t, n) : Me.test(n) ? e.setProperty(
    Ke(t),
    n.replace(Me, ""),
    "important"
  ) : e[t] = n;
}, D = (e, t) => {
  const n = e.getAttribute(t);
  return n != null && e.removeAttribute(t), n;
}, O = (e, t, n, s) => {
  e.addEventListener(t, n, s);
}, Qt = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/, Ut = ["ctrl", "shift", "alt", "meta"], Xt = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, t) => Ut.some((n) => e[`${n}Key`] && !t[n])
}, tt = ({ el: e, get: t, exp: n, arg: s, modifiers: i }) => {
  if (!s)
    return;
  let r = Qt.test(n) ? t(`(e => ${n}(e))`) : t(`($event => { ${n} })`);
  if (s === "vue:mounted") {
    we(r);
    return;
  } else if (s === "vue:unmounted")
    return () => r();
  if (i) {
    s === "click" && (i.right && (s = "contextmenu"), i.middle && (s = "mouseup"));
    const o = r;
    r = (c) => {
      if (!("key" in c && !(Ke(c.key) in i))) {
        for (const l in i) {
          const f = Xt[l];
          if (f && f(c, i))
            return;
        }
        return o(c);
      }
    };
  }
  O(e, s, r, i);
}, en = ({ el: e, get: t, effect: n }) => {
  const s = e.style.display;
  n(() => {
    e.style.display = t() ? s : "none";
  });
}, nt = ({ el: e, get: t, effect: n }) => {
  n(() => {
    e.textContent = st(t());
  });
}, st = (e) => e == null ? "" : T(e) ? (() => {
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return "[Object]";
  }
})() : String(e), tn = ({ el: e, get: t, effect: n }) => {
  n(() => {
    e.innerHTML = t();
  });
}, nn = ({ el: e, exp: t, get: n, effect: s, modifiers: i }) => {
  const r = e.type, o = n(`(val) => { ${t} = val }`), { trim: c, number: l = r === "number" || r === "range" } = i || {};
  if (e.tagName === "SELECT") {
    const f = e;
    O(e, "change", () => {
      const a = Array.prototype.filter.call(f.options, (p) => p.selected).map(
        (p) => l ? Ae(k(p)) : k(p)
      );
      o(f.multiple ? [...a] : a[0]);
    }), s(() => {
      const a = n(), p = f.multiple;
      for (let u = 0, v = f.options.length; u < v; u++) {
        const d = f.options[u], A = k(d);
        if (p)
          y(a) ? d.selected = ge(a, A) > -1 : d.selected = !1;
        else if (j(k(d), a)) {
          f.selectedIndex !== u && (f.selectedIndex = u);
          return;
        }
      }
      !p && f.selectedIndex !== -1 && (f.selectedIndex = -1);
    });
  } else if (r === "checkbox") {
    O(e, "change", () => {
      fn(e, n, o);
    });
    let f;
    s(() => {
      cn(e, n, f), f = n();
    });
  } else if (r === "radio") {
    O(e, "change", () => {
      on(e, o);
    });
    let f;
    s(() => {
      const a = n();
      a !== f && (e.checked = j(a, k(e)));
    });
  } else {
    const f = (a) => c ? a.trim() : l ? Ae(a) : a;
    O(e, "compositionstart", sn), O(e, "compositionend", rn), O(e, i?.lazy ? "change" : "input", () => {
      ln(e, o, f);
    }), c && O(e, "change", () => {
      e.value = e.value.trim();
    }), s(() => {
      un(e, n, f);
    });
  }
}, k = (e) => "_value" in e ? e._value : e.value, it = (e, t) => {
  const n = t ? "_trueValue" : "_falseValue";
  return n in e ? e[n] : t;
}, sn = (e) => {
  e.target.composing = !0;
}, rn = (e) => {
  const t = e.target;
  t.composing && (t.composing = !1, an(t, "input"));
}, on = (e, t) => {
  t(k(e));
}, cn = (e, t, n) => {
  const s = t();
  y(s) ? e.checked = ge(s, k(e)) > -1 : s !== n && (e.checked = j(s, it(e, !0)));
}, ln = (e, t, n) => {
  e.composing || t(n(e.value));
}, fn = (e, t, n) => {
  const s = t(), i = e.checked;
  if (y(s)) {
    const r = k(e), o = ge(s, r), c = o !== -1;
    if (i && !c)
      n(s.concat(r));
    else if (!i && c) {
      const l = [...s];
      l.splice(o, 1), n(l);
    }
  } else
    n(it(e, i));
}, un = (e, t, n) => {
  if (e.composing)
    return;
  const s = e.value, i = t();
  document.activeElement === e && n(s) === i || s !== i && (e.value = i);
}, an = (e, t) => {
  const n = document.createEvent("HTMLEvents");
  n.initEvent(t, !0, !0), e.dispatchEvent(n);
}, je = /* @__PURE__ */ Object.create(null), H = (e, t, n) => {
  try {
    return new Function(`with (this) { return ${t} }`).call(e);
  } catch {
  }
}, pn = (e, t, n) => {
  const s = je[t] || (je[t] = hn(t));
  try {
    return s(e, n);
  } catch (i) {
    console.error(i);
  }
}, hn = (e) => {
  try {
    return new Function("$data", "$el", `with($data){${e}}`);
  } catch (t) {
    return console.error(`${t.message} in expression: ${e}`), () => {
    };
  }
}, dn = ({ el: e, ctx: t, exp: n, effect: s }) => {
  we(() => s(() => pn(t.scope, n, e)));
}, Z = ({
  el: e,
  ctx: {
    scope: { $refs: t }
  },
  get: n,
  effect: s,
  exp: i
}) => {
  let r;
  return s(() => {
    let o = n();
    o === void 0 && i && !i.includes("${") && !i.includes("}") && (o = i), t[o] = e, r && o !== r && delete t[r], r = o;
  }), () => {
    r && delete t[r];
  };
}, mn = {
  bind: pe,
  on: tt,
  show: en,
  text: nt,
  html: tn,
  model: nn,
  effect: dn,
  ref: Z
}, vn = (e, t, n) => {
  const s = e.parentElement || e.parentNode;
  if (!s) return;
  const i = new Comment("v-if");
  s.insertBefore(i, e);
  const r = [
    {
      exp: t,
      el: e
    }
  ];
  let o, c;
  for (; (o = e.nextElementSibling) && (c = null, D(o, "v-else") === "" || (c = D(o, "v-else-if"))); )
    s.removeChild(o), r.push({ exp: c, el: o });
  const l = e.nextSibling;
  s.removeChild(e);
  let f, a = -1;
  const p = () => {
    f && (s.insertBefore(i, f.el), f.remove(), f = void 0);
  };
  return n.effect(() => {
    for (let u = 0; u < r.length; u++) {
      const { exp: v, el: d } = r[u];
      if (!v || H(n.scope, v)) {
        u !== a && (p(), f = new G(d, n), f.insert(s, i), s.removeChild(i), a = u);
        return;
      }
    }
    a = -1, p();
  }), l;
}, gn = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, Pe = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, yn = /^\(|\)$/g, bn = /^[{[]\s*((?:[\w_$]+\s*,?\s*)+)[\]}]$/, xn = (e, t, n, s, i, r, o, c) => {
  for (let u = 0; u < t.length; u++)
    n.has(t[u].key) || t[u].remove();
  const l = [];
  let f = e.length, a, p;
  for (; f--; ) {
    const u = e[f], v = s.get(u.key);
    let d;
    v == null ? (d = new G(o, u), d.key = u.key, d.insert(r, a ? a.el : i)) : (d = t[v], Object.assign(d.ctx.scope, u.scope), v !== f && (t[v + 1] !== a || // If the next has moved, it must move too
    p === a) && (p = d, d.insert(r, a ? a.el : i))), l.unshift(a = d);
  }
  return l;
}, _n = (e, t, n) => {
  const s = t.match(gn);
  if (!s)
    return;
  const i = e.nextSibling, r = e.parentElement, o = new Text("");
  r.insertBefore(o, e), r.removeChild(e);
  const c = s[2].trim();
  let l = s[1].trim().replace(yn, "").trim(), f, a = !1, p, u, v = "key", d = e.getAttribute(v) || e.getAttribute(v = ":key") || e.getAttribute(v = "v-bind:key");
  d && (e.removeAttribute(v), v === "key" && (d = JSON.stringify(d)));
  let A;
  (A = l.match(Pe)) && (l = l.replace(Pe, "").trim(), p = A[1].trim(), A[2] && (u = A[2].trim())), (A = l.match(bn)) && (f = A[1].split(",").map((m) => m.trim()), a = l[0] === "[");
  let Se = !1, Q, U, X;
  const ft = (m) => {
    const x = /* @__PURE__ */ new Map(), g = [];
    if (y(m))
      for (let b = 0; b < m.length; b++)
        g.push(ee(x, m[b], b));
    else if (typeof m == "number")
      for (let b = 0; b < m; b++)
        g.push(ee(x, b + 1, b));
    else if (T(m)) {
      let b = 0;
      for (const E in m)
        g.push(ee(x, m[E], b++, E));
    }
    return [g, x];
  }, ee = (m, x, g, b) => {
    const E = {};
    f ? f.forEach(
      (Re, at) => E[Re] = x[a ? at : Re]
    ) : E[l] = x, b ? (p && (E[p] = b), u && (E[u] = g)) : p && (E[p] = g);
    const te = ct(n, E), Ee = d ? H(te.scope, d) : g;
    return m.set(Ee, g), te.key = Ee, te;
  }, ut = (m, x) => {
    const g = new G(e, m);
    return g.key = m.key, g.insert(r, x), g;
  };
  return n.effect(() => {
    const m = H(n.scope, c), x = X;
    [U, X] = ft(m), Se ? Q = xn(U, Q, X, x, o, r, e) : (Q = U.map((g) => ut(g, o)), Se = !0);
  }), i;
}, wn = /^(?:v-|:|@)/, Sn = /\.([\w-]+)/g;
let de = !1;
const rt = (e, t) => {
  const n = t, s = e.nodeType;
  if (s === 1) {
    const i = e;
    if (i.hasAttribute("v-pre"))
      return;
    D(i, "v-cloak");
    let r;
    if (r = D(i, "v-if"))
      return vn(i, r, t);
    if (r = D(i, "v-for"))
      return _n(i, r, t);
    if ((r = D(i, "v-scope")) || r === "") {
      const l = r ? H(t.scope, r) : {};
      l.$root = i, t = ct(t, l), l.$template && En(i, l.$template);
    }
    const o = D(i, "v-once") != null;
    o && (de = !0), (r = D(i, "ref")) && (t !== n && q(i, Z, r, n), q(i, Z, r, t)), Ne(i, t);
    const c = [];
    for (const { name: l, value: f } of Array.from(i.attributes))
      wn.test(l) && l !== "v-cloak" && (l === "v-model" ? c.unshift([l, f]) : l[0] === "@" || /^v-on\b/.test(l) ? c.push([l, f]) : Ve(i, l, f, t));
    for (const [l, f] of c)
      Ve(i, l, f, t);
    o && (de = !1);
  } else if (s === 3) {
    const i = e.data;
    if (i.includes(t.delimiters[0])) {
      let r = [], o = 0, c;
      for (; c = t.delimitersRE.exec(i); ) {
        const l = i.slice(o, c.index);
        l && r.push(JSON.stringify(l)), r.push(`$s(${c[1]})`), o = c.index + c[0].length;
      }
      o < i.length && r.push(JSON.stringify(i.slice(o))), q(e, nt, r.join("+"), t);
    }
  } else s === 11 && Ne(e, t);
}, Ne = (e, t) => {
  let n = e.firstChild;
  for (; n; )
    n = rt(n, t) || n.nextSibling;
}, Ve = (e, t, n, s) => {
  let i, r, o;
  if (t = t.replace(Sn, (c, l) => ((o || (o = {}))[l] = !0, "")), t[0] === ":")
    i = pe, r = t.slice(1);
  else if (t[0] === "@")
    i = tt, r = t.slice(1);
  else {
    const c = t.indexOf(":"), l = c > 0 ? t.slice(2, c) : t.slice(2);
    i = mn[l] || s.dirs[l], r = c > 0 ? t.slice(c + 1) : void 0;
  }
  i && (i === pe && r === "ref" && (i = Z), q(e, i, n, s, r, o), e.removeAttribute(t));
}, q = (e, t, n, s, i, r) => {
  const c = t({
    el: e,
    get: (l = n) => H(s.scope, l),
    effect: s.effect,
    ctx: s,
    exp: n,
    ...i !== void 0 && { arg: i },
    ...r && { modifiers: r }
  });
  c && s.cleanups.push(c);
}, En = (e, t) => {
  if (t[0] === "#") {
    const n = document.querySelector(t);
    n && e.appendChild(n.content.cloneNode(!0));
    return;
  }
  e.innerHTML = t.replace(/<[\/\s]*template\s*>/ig, "");
}, ot = (e) => {
  const t = {
    delimiters: ["{{", "}}"],
    delimitersRE: /\{\{([^]+?)\}\}/g,
    ...e,
    scope: e ? e.scope : z({}),
    dirs: e ? e.dirs : {},
    effects: [],
    blocks: [],
    cleanups: [],
    effect: (n) => {
      if (de)
        return Ie(n), n;
      const s = Dt(n, {
        scheduler: () => Ie(s)
      });
      return t.effects.push(s), s;
    }
  };
  return t;
}, ct = (e, t = {}) => {
  const n = e.scope, s = Object.create(n);
  Object.defineProperties(s, Object.getOwnPropertyDescriptors(t)), s.$refs = Object.create(n.$refs);
  const i = z(
    new Proxy(s, {
      set(r, o, c, l) {
        return l === i && !le(r, o) ? Reflect.set(n, o, c) : Reflect.set(r, o, c, l);
      }
    })
  );
  return lt(i), {
    ...e,
    scope: i
  };
}, lt = (e) => {
  for (const t of Object.keys(e))
    typeof e[t] == "function" && (e[t] = e[t].bind(e));
};
class G {
  template;
  ctx;
  key;
  parentCtx;
  isFragment;
  start;
  end;
  get el() {
    return this.start || this.template;
  }
  constructor(t, n, s = !1) {
    this.isFragment = t instanceof HTMLTemplateElement, s ? this.template = t : this.isFragment ? this.template = t.content.cloneNode(
      !0
    ) : this.template = t.cloneNode(!0), s ? this.ctx = n : (this.parentCtx = n, n.blocks.push(this), this.ctx = ot(n)), rt(this.template, this.ctx);
  }
  insert(t, n = null) {
    if (this.isFragment)
      if (this.start) {
        let s = this.start, i;
        for (; s && (i = s.nextSibling, t.insertBefore(s, n), s !== this.end); )
          s = i;
      } else
        this.start = new Text(""), this.end = new Text(""), t.insertBefore(this.end, n), t.insertBefore(this.start, this.end), t.insertBefore(this.template, this.end);
    else
      t.insertBefore(this.template, n);
  }
  remove() {
    if (this.parentCtx && dt(this.parentCtx.blocks, this), this.start) {
      const t = this.start.parentNode;
      let n = this.start, s;
      for (; n && (s = n.nextSibling, t.removeChild(n), n !== this.end); )
        n = s;
    } else
      this.template.parentNode.removeChild(this.template);
    this.teardown();
  }
  teardown() {
    this.ctx.blocks.forEach((t) => {
      t.teardown();
    }), this.ctx.effects.forEach(kt), this.ctx.cleanups.forEach((t) => t());
  }
}
const Be = (e) => e.replace(/[-.*+?^${}()|[\]\/\\]/g, "\\$&"), Rn = (e) => {
  const t = ot();
  if (e && (t.scope = z(e), lt(t.scope), e.$delimiters)) {
    const [s, i] = t.delimiters = e.$delimiters;
    t.delimitersRE = new RegExp(
      Be(s) + "([^]+?)" + Be(i),
      "g"
    );
  }
  t.scope.$s = st, t.scope.$nextTick = we, t.scope.$refs = /* @__PURE__ */ Object.create(null);
  let n;
  return {
    directive(s, i) {
      return i ? (t.dirs[s] = i, this) : t.dirs[s];
    },
    use(s, i = {}) {
      return s.install(this, i), this;
    },
    mount(s) {
      if (typeof s == "string" && (s = document.querySelector(s), !s))
        return;
      s = s || document.documentElement;
      let i;
      return s.hasAttribute("v-scope") ? i = [s] : i = [...s.querySelectorAll("[v-scope]")].filter(
        (r) => !r.matches("[v-scope] [v-scope]")
      ), i.length || (i = [s]), n = i.map((r) => new G(r, t, !0)), this;
    },
    unmount() {
      n.forEach((s) => s.teardown());
    },
    get rootBlocks() {
      return n;
    },
    get scope() {
      return t.scope;
    }
  };
}, Tn = () => {
  const e = document.currentScript;
  e && e.hasAttribute("init") && Rn().mount();
};
Tn();
export {
  Tn as autoMount,
  Rn as createApp,
  we as nextTick,
  z as reactive,
  Dt as watchEffect
};
