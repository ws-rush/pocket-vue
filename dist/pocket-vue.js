/**
* @vue/shared v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function mt(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const vt = Object.assign, gt = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, bt = Object.prototype.hasOwnProperty, pe = (e, t) => bt.call(e, t), y = Array.isArray, re = (e) => ye(e) === "[object Map]", Oe = (e) => ye(e) === "[object Date]", M = (e) => typeof e == "string", P = (e) => typeof e == "symbol", O = (e) => e !== null && typeof e == "object", yt = Object.prototype.toString, ye = (e) => yt.call(e), xt = (e) => ye(e).slice(8, -1), xe = (e) => M(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Fe = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, _t = /-\w/g, wt = Fe(
  (e) => e.replace(_t, (t) => t.slice(1).toUpperCase())
), St = /\B([A-Z])/g, We = Fe(
  (e) => e.replace(St, "-$1").toLowerCase()
), qe = (e, t) => !Object.is(e, t), De = (e) => {
  const t = M(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
function Je(e) {
  if (y(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = M(s) ? At(s) : Je(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (M(e) || O(e))
    return e;
}
const Et = /;(?![^(]*\))/g, Rt = /:([^]+)/, Tt = /\/\*[^]*?\*\//g;
function At(e) {
  const t = {};
  return e.replace(Tt, "").split(Et).forEach((n) => {
    if (n) {
      const s = n.split(Rt);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function Ye(e) {
  let t = "";
  if (M(e))
    t = e;
  else if (y(e))
    for (let n = 0; n < e.length; n++) {
      const s = Ye(e[n]);
      s && (t += s + " ");
    }
  else if (O(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function Ot(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++)
    n = B(e[s], t[s]);
  return n;
}
function B(e, t) {
  if (e === t) return !0;
  let n = Oe(e), s = Oe(t);
  if (n || s)
    return n && s ? e.getTime() === t.getTime() : !1;
  if (n = P(e), s = P(t), n || s)
    return e === t;
  if (n = y(e), s = y(t), n || s)
    return n && s ? Ot(e, t) : !1;
  if (n = O(e), s = O(t), n || s) {
    if (!n || !s)
      return !1;
    const i = Object.keys(e).length, r = Object.keys(t).length;
    if (i !== r)
      return !1;
    for (const o in e) {
      const c = e.hasOwnProperty(o), l = t.hasOwnProperty(o);
      if (c && !l || !c && l || !B(e[o], t[o]))
        return !1;
    }
  }
  return String(e) === String(t);
}
function oe(e, t) {
  return e.findIndex((n) => B(n, t));
}
/**
* @vue/reactivity v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let h;
const ce = /* @__PURE__ */ new WeakSet();
class $e {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, ce.has(this) && (ce.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Dt(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, ke(this), Ge(this);
    const t = h, n = E;
    h = this, E = !0;
    try {
      return this.fn();
    } finally {
      Qe(this), h = t, E = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Se(t);
      this.deps = this.depsTail = void 0, ke(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? ce.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    he(this) && this.run();
  }
  get dirty() {
    return he(this);
  }
}
let Ze = 0, H, z;
function Dt(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = z, z = e;
    return;
  }
  e.next = H, H = e;
}
function _e() {
  Ze++;
}
function we() {
  if (--Ze > 0)
    return;
  if (z) {
    let t = z;
    for (z = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; H; ) {
    let t = H;
    for (H = void 0; t; ) {
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
function Ge(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Qe(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), Se(s), kt(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function he(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && ($t(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function $t(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === X) || (e.globalVersion = X, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !he(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = h, s = E;
  h = e, E = !0;
  try {
    Ge(e);
    const i = e.fn(e._value);
    (t.version === 0 || qe(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    h = n, E = s, Qe(e), e.flags &= -3;
  }
}
function Se(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Se(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function kt(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function Ct(e, t) {
  e.effect instanceof $e && (e = e.effect.fn);
  const n = new $e(e);
  t && vt(n, t);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const s = n.run.bind(n);
  return s.effect = n, s;
}
function It(e) {
  e.effect.stop();
}
let E = !0;
const Ue = [];
function jt() {
  Ue.push(E), E = !1;
}
function Mt() {
  const e = Ue.pop();
  E = e === void 0 ? !0 : e;
}
function ke(e) {
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
let X = 0;
class Pt {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Nt {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!h || !E || h === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== h)
      n = this.activeLink = new Pt(h, this), h.deps ? (n.prevDep = h.depsTail, h.depsTail.nextDep = n, h.depsTail = n) : h.deps = h.depsTail = n, Xe(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = h.depsTail, n.nextDep = void 0, h.depsTail.nextDep = n, h.depsTail = n, h.deps === n && (h.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, X++, this.notify(t);
  }
  notify(t) {
    _e();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      we();
    }
  }
}
function Xe(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Xe(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const de = /* @__PURE__ */ new WeakMap(), Q = Symbol(
  ""
), Ce = Symbol(
  ""
), W = Symbol(
  ""
);
function N(e, t, n) {
  if (E && h) {
    let s = de.get(e);
    s || de.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new Nt()), i.map = s, i.key = n), i.track();
  }
}
function le(e, t, n, s, i, r) {
  const o = de.get(e);
  if (!o) {
    X++;
    return;
  }
  const c = (l) => {
    l && l.trigger();
  };
  if (_e(), t === "clear")
    o.forEach(c);
  else {
    const l = y(e), f = l && xe(n);
    if (l && n === "length") {
      const u = Number(s);
      o.forEach((a, p) => {
        (p === "length" || p === W || !P(p) && p >= u) && c(a);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && c(o.get(n)), f && c(o.get(W)), t) {
        case "add":
          l ? f && c(o.get("length")) : (c(o.get(Q)), re(e) && c(o.get(Ce)));
          break;
        case "delete":
          l || (c(o.get(Q)), re(e) && c(o.get(Ce)));
          break;
        case "set":
          re(e) && c(o.get(Q));
          break;
      }
  }
  we();
}
function L(e) {
  const t = T(e);
  return t === e ? t : (N(t, "iterate", W), Z(e) ? t : t.map(R));
}
function Ee(e) {
  return N(e = T(e), "iterate", W), e;
}
const Vt = {
  __proto__: null,
  [Symbol.iterator]() {
    return fe(this, Symbol.iterator, R);
  },
  concat(...e) {
    return L(this).concat(
      ...e.map((t) => y(t) ? L(t) : t)
    );
  },
  entries() {
    return fe(this, "entries", (e) => (e[1] = R(e[1]), e));
  },
  every(e, t) {
    return A(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return A(this, "filter", e, t, (n) => n.map(R), arguments);
  },
  find(e, t) {
    return A(this, "find", e, t, R, arguments);
  },
  findIndex(e, t) {
    return A(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return A(this, "findLast", e, t, R, arguments);
  },
  findLastIndex(e, t) {
    return A(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return A(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return ue(this, "includes", e);
  },
  indexOf(...e) {
    return ue(this, "indexOf", e);
  },
  join(e) {
    return L(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return ue(this, "lastIndexOf", e);
  },
  map(e, t) {
    return A(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return K(this, "pop");
  },
  push(...e) {
    return K(this, "push", e);
  },
  reduce(e, ...t) {
    return Ie(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return Ie(this, "reduceRight", e, t);
  },
  shift() {
    return K(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return A(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return K(this, "splice", e);
  },
  toReversed() {
    return L(this).toReversed();
  },
  toSorted(e) {
    return L(this).toSorted(e);
  },
  toSpliced(...e) {
    return L(this).toSpliced(...e);
  },
  unshift(...e) {
    return K(this, "unshift", e);
  },
  values() {
    return fe(this, "values", R);
  }
};
function fe(e, t, n) {
  const s = Ee(e), i = s[t]();
  return s !== e && !Z(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.value && (r.value = n(r.value)), r;
  }), i;
}
const Lt = Array.prototype;
function A(e, t, n, s, i, r) {
  const o = Ee(e), c = o !== e && !Z(e), l = o[t];
  if (l !== Lt[t]) {
    const a = l.apply(e, r);
    return c ? R(a) : a;
  }
  let f = n;
  o !== e && (c ? f = function(a, p) {
    return n.call(this, R(a), p, e);
  } : n.length > 2 && (f = function(a, p) {
    return n.call(this, a, p, e);
  }));
  const u = l.call(o, f, s);
  return c && i ? i(u) : u;
}
function Ie(e, t, n, s) {
  const i = Ee(e);
  let r = n;
  return i !== e && (Z(e) ? n.length > 3 && (r = function(o, c, l) {
    return n.call(this, o, c, l, e);
  }) : r = function(o, c, l) {
    return n.call(this, o, R(c), l, e);
  }), i[t](r, ...s);
}
function ue(e, t, n) {
  const s = T(e);
  N(s, "iterate", W);
  const i = s[t](...n);
  return (i === -1 || i === !1) && Qt(n[0]) ? (n[0] = T(n[0]), s[t](...n)) : i;
}
function K(e, t, n = []) {
  jt(), _e();
  const s = T(e)[t].apply(e, n);
  return we(), Mt(), s;
}
const Bt = /* @__PURE__ */ mt("__proto__,__v_isRef,__isVue"), et = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(P)
);
function Kt(e) {
  P(e) || (e = String(e));
  const t = T(this);
  return N(t, "has", e), t.hasOwnProperty(e);
}
class tt {
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
      return s === (i ? r ? Jt : st : r ? qt : nt).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = y(t);
    if (!i) {
      let l;
      if (o && (l = Vt[n]))
        return l;
      if (n === "hasOwnProperty")
        return Kt;
    }
    const c = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      F(t) ? t : s
    );
    return (P(n) ? et.has(n) : Bt(n)) || (i || N(t, "get", n), r) ? c : F(c) ? o && xe(n) ? c : c.value : O(c) ? i ? Gt(c) : Y(c) : c;
  }
}
class Ht extends tt {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    if (!this._isShallow) {
      const l = me(r);
      if (!Z(s) && !me(s) && (r = T(r), s = T(s)), !y(t) && F(r) && !F(s))
        return l || (r.value = s), !0;
    }
    const o = y(t) && xe(n) ? Number(n) < t.length : pe(t, n), c = Reflect.set(
      t,
      n,
      s,
      F(t) ? t : i
    );
    return t === T(i) && (o ? qe(s, r) && le(t, "set", n, s) : le(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = pe(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && le(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!P(n) || !et.has(n)) && N(t, "has", n), s;
  }
  ownKeys(t) {
    return N(
      t,
      "iterate",
      y(t) ? "length" : Q
    ), Reflect.ownKeys(t);
  }
}
class zt extends tt {
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
const Ft = /* @__PURE__ */ new Ht(), Wt = /* @__PURE__ */ new zt(), nt = /* @__PURE__ */ new WeakMap(), qt = /* @__PURE__ */ new WeakMap(), st = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new WeakMap();
function Yt(e) {
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
function Zt(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Yt(xt(e));
}
function Y(e) {
  return me(e) ? e : it(
    e,
    !1,
    Ft,
    null,
    nt
  );
}
function Gt(e) {
  return it(
    e,
    !0,
    Wt,
    null,
    st
  );
}
function it(e, t, n, s, i) {
  if (!O(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = Zt(e);
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
function me(e) {
  return !!(e && e.__v_isReadonly);
}
function Z(e) {
  return !!(e && e.__v_isShallow);
}
function Qt(e) {
  return e ? !!e.__v_raw : !1;
}
function T(e) {
  const t = e && e.__v_raw;
  return t ? T(t) : e;
}
const R = (e) => O(e) ? Y(e) : e;
function F(e) {
  return e ? e.__v_isRef === !0 : !1;
}
let ee = !1;
const q = [], je = Promise.resolve(), ne = (e) => e ? je.then(e) : je.then(() => new Promise((t) => {
  const n = () => {
    q.length === 0 && !ee ? t(void 0) : setTimeout(n, 0);
  };
  n();
})), Me = (e) => {
  q.includes(e) || q.push(e), ee || (ee = !0, ne(Ut));
}, Ut = () => {
  for (const e of q)
    e();
  q.length = 0, ee = !1;
}, Xt = /^(spellcheck|draggable|form|list|type)$/, ve = ({
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
      i?.camel && (s = wt(s)), ae(e, s, o, r, i?.camel);
    else {
      for (const c in o)
        ae(e, c, o[c], r && r[c]);
      for (const c in r)
        (!o || !(c in o)) && ae(e, c, null);
    }
    r = o;
  });
}, ae = (e, t, n, s, i) => {
  const { style: r } = e;
  if (t === "class") {
    const o = Ye(e._class ? [e._class, n] : n) || "";
    e.setAttribute("class", o);
  } else if (t === "style")
    if (n = Je(n), !n)
      e.removeAttribute("style");
    else if (M(n))
      n !== s && (r.cssText = n);
    else {
      for (const o in n)
        ge(r, o, n[o]);
      if (s && !M(s))
        for (const o in s)
          n[o] == null && ge(r, o, "");
    }
  else t !== "class" && t !== "style" && !(e instanceof SVGElement) && (t in e || i) && !Xt.test(t) ? t === "id" || t === "title" || t === "lang" || t === "dir" ? n == null ? e.removeAttribute(t) : e.setAttribute(t, n) : (e[t] = n, t === "value" && (e._value = n)) : t === "true-value" ? e._trueValue = n : t === "false-value" ? e._falseValue = n : n != null ? e.setAttribute(t, n) : e.removeAttribute(t);
}, Pe = /\s*!important$/, ge = (e, t, n) => {
  y(n) ? n.forEach((s) => ge(e, t, s)) : t.startsWith("--") ? e.setProperty(t, n) : Pe.test(n) ? e.setProperty(
    We(t),
    n.replace(Pe, ""),
    "important"
  ) : e[t] = n;
}, C = (e, t) => {
  const n = e.getAttribute(t);
  return n != null && e.removeAttribute(t), n;
}, k = (e, t, n, s) => {
  e.addEventListener(t, n, s);
}, en = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/, tn = ["ctrl", "shift", "alt", "meta"], nn = {
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
  exact: (e, t) => tn.some((n) => e[`${n}Key`] && !t[n])
}, rt = ({ el: e, get: t, exp: n, arg: s, modifiers: i }) => {
  if (!s)
    return;
  let r = en.test(n) ? t(`(e => ${n}(e))`) : t(`($event => { ${n} })`);
  if (s === "vue:mounted") {
    ne(r);
    return;
  } else if (s === "vue:unmounted")
    return () => r();
  if (i) {
    s === "click" && (i.right && (s = "contextmenu"), i.middle && (s = "mouseup"));
    const o = r;
    r = (c) => {
      if (!("key" in c && !(We(c.key) in i))) {
        for (const l in i) {
          const f = nn[l];
          if (f && f(c, i))
            return;
        }
        return o(c);
      }
    };
  }
  k(e, s, r, i);
}, sn = ({ el: e, get: t, effect: n }) => {
  const s = e.style.display;
  n(() => {
    e.style.display = t() ? s : "none";
  });
}, ot = ({ el: e, get: t, effect: n }) => {
  n(() => {
    e.textContent = ct(t());
  });
}, ct = (e) => e == null ? "" : O(e) ? (() => {
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return "[Object]";
  }
})() : String(e), rn = ({ el: e, get: t, effect: n }) => {
  n(() => {
    e.innerHTML = t();
  });
}, on = ({ el: e, exp: t, get: n, effect: s, modifiers: i }) => {
  const r = e.type, o = n(`(val) => { ${t} = val }`), { trim: c, number: l = r === "number" || r === "range" } = i || {};
  if (e.tagName === "SELECT") {
    const f = e;
    k(e, "change", () => {
      const u = Array.prototype.filter.call(f.options, (a) => a.selected).map(
        (a) => l ? De($(a)) : $(a)
      );
      o(f.multiple ? [...u] : u[0]);
    }), s(() => {
      const u = n(), a = f.multiple;
      for (let p = 0, x = f.options.length; p < x; p++) {
        const b = f.options[p], _ = $(b);
        if (a)
          y(u) ? b.selected = oe(u, _) > -1 : b.selected = !1;
        else if (B($(b), u)) {
          f.selectedIndex !== p && (f.selectedIndex = p);
          return;
        }
      }
      !a && f.selectedIndex !== -1 && (f.selectedIndex = -1);
    });
  } else if (r === "checkbox") {
    k(e, "change", () => {
      const u = n(), a = e.checked;
      if (y(u)) {
        const p = $(e), x = oe(u, p), b = x !== -1;
        if (a && !b)
          o(u.concat(p));
        else if (!a && b) {
          const _ = [...u];
          _.splice(x, 1), o(_);
        }
      } else
        o(Ne(e, a));
    });
    let f;
    s(() => {
      const u = n();
      y(u) ? e.checked = oe(u, $(e)) > -1 : u !== f && (e.checked = B(
        u,
        Ne(e, !0)
      )), f = u;
    });
  } else if (r === "radio") {
    k(e, "change", () => {
      o($(e));
    });
    let f;
    s(() => {
      const u = n();
      u !== f && (e.checked = B(u, $(e)));
    });
  } else {
    const f = (u) => c ? u.trim() : l ? De(u) : u;
    k(e, "compositionstart", cn), k(e, "compositionend", ln), k(e, i?.lazy ? "change" : "input", () => {
      e.composing || o(f(e.value));
    }), c && k(e, "change", () => {
      e.value = e.value.trim();
    }), s(() => {
      if (e.composing)
        return;
      const u = e.value, a = n();
      document.activeElement === e && f(u) === a || u !== a && (e.value = a);
    });
  }
}, $ = (e) => "_value" in e ? e._value : e.value, Ne = (e, t) => {
  const n = t ? "_trueValue" : "_falseValue";
  return n in e ? e[n] : t;
}, cn = (e) => {
  e.target.composing = !0;
}, ln = (e) => {
  const t = e.target;
  t.composing && (t.composing = !1, fn(t, "input"));
}, fn = (e, t) => {
  const n = document.createEvent("HTMLEvents");
  n.initEvent(t, !0, !0), e.dispatchEvent(n);
}, Ve = /* @__PURE__ */ Object.create(null), J = (e, t, n) => {
  try {
    return new Function(`with (this) { return ${t} }`).call(e);
  } catch {
  }
}, un = (e, t, n) => {
  const s = Ve[t] || (Ve[t] = an(t));
  try {
    return s(e, n);
  } catch (i) {
    console.error(i);
  }
}, an = (e) => {
  try {
    return new Function("$data", "$el", `with($data){${e}}`);
  } catch (t) {
    return console.error(`${t.message} in expression: ${e}`), () => {
    };
  }
}, pn = ({ el: e, ctx: t, exp: n, effect: s }) => {
  ne(() => s(() => un(t.scope, n, e)));
}, te = ({
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
}, hn = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, Le = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, dn = /^\(|\)$/g, mn = /^[{[]\s*((?:[\w_$]+\s*,?\s*)+)[\]}]$/, lt = (e, t, n) => {
  const s = t.match(hn);
  if (!s)
    return;
  const i = e.nextSibling, r = e.parentElement, o = new Text("");
  r.insertBefore(o, e), r.removeChild(e);
  const c = s[2].trim();
  let l = s[1].trim().replace(dn, "").trim(), f, u = !1, a, p, x = "key", b = e.getAttribute(x) || e.getAttribute(x = ":key") || e.getAttribute(x = "v-bind:key");
  b && (e.removeAttribute(x), x === "key" && (b = JSON.stringify(b)));
  let _;
  (_ = l.match(Le)) && (l = l.replace(Le, "").trim(), a = _[1].trim(), _[2] && (p = _[2].trim())), (_ = l.match(mn)) && (f = _[1].split(",").map((v) => v.trim()), u = l[0] === "[");
  let Te = !1, I, G, se;
  const dt = (v) => {
    const w = /* @__PURE__ */ new Map(), d = [];
    if (y(v))
      for (let m = 0; m < v.length; m++)
        d.push(ie(w, v[m], m));
    else if (typeof v == "number")
      for (let m = 0; m < v; m++)
        d.push(ie(w, m + 1, m));
    else if (O(v)) {
      let m = 0;
      for (const g in v)
        d.push(ie(w, v[g], m++, g));
    }
    return [d, w];
  }, ie = (v, w, d, m) => {
    const g = {};
    f ? f.forEach(
      (j, D) => g[j] = w[u ? D : j]
    ) : g[l] = w, m ? (a && (g[a] = m), p && (g[p] = d)) : a && (g[a] = d);
    const V = pt(n, g), S = b ? J(V.scope, b) : d;
    return v.set(S, d), V.key = S, V;
  }, Ae = (v, w) => {
    const d = new Re(e, v);
    return d.key = v.key, d.insert(r, w), d;
  };
  return n.effect(() => {
    const v = J(n.scope, c), w = se;
    if ([G, se] = dt(v), !Te)
      I = G.map((d) => Ae(d, o)), Te = !0;
    else {
      for (let S = 0; S < I.length; S++)
        se.has(I[S].key) || I[S].remove();
      const d = [];
      let m = G.length, g, V;
      for (; m--; ) {
        const S = G[m], j = w.get(S.key);
        let D;
        j == null ? D = Ae(
          S,
          g ? g.el : o
        ) : (D = I[j], Object.assign(D.ctx.scope, S.scope), j !== m && (I[j + 1] !== g || // If the next has moved, it must move too
        V === g) && (V = D, D.insert(r, g ? g.el : o))), d.unshift(g = D);
      }
      I = d;
    }
  }), i;
}, ft = (e, t, n) => {
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
  for (; (o = e.nextElementSibling) && (c = null, C(o, "v-else") === "" || (c = C(o, "v-else-if"))); )
    s.removeChild(o), r.push({ exp: c, el: o });
  const l = e.nextSibling;
  s.removeChild(e);
  let f, u = -1;
  const a = () => {
    f && (s.insertBefore(i, f.el), f.remove(), f = void 0);
  };
  return n.effect(() => {
    for (let p = 0; p < r.length; p++) {
      const { exp: x, el: b } = r[p];
      if (!x || J(n.scope, x)) {
        p !== u && (a(), f = new Re(b, n), f.insert(s, i), s.removeChild(i), u = p);
        return;
      }
    }
    u = -1, a();
  }), l;
}, vn = {
  bind: ve,
  on: rt,
  show: sn,
  text: ot,
  html: rn,
  model: on,
  effect: pn,
  ref: te,
  for: (e) => (lt(e.el, e.exp, e.ctx), () => {
  }),
  if: (e) => (ft(e.el, e.exp, e.ctx), () => {
  })
}, gn = /^(?:v-|:|@)/, bn = /\.([\w-]+)/g;
let be = !1;
const ut = (e, t) => {
  const n = t, s = e.nodeType;
  if (s === 1) {
    const i = e;
    if (i.hasAttribute("v-pre"))
      return;
    C(i, "v-cloak");
    let r;
    if (r = C(i, "v-if"))
      return ft(i, r, t);
    if (r = C(i, "v-for"))
      return lt(i, r, t);
    if ((r = C(i, "v-scope")) || r === "") {
      const l = r ? J(t.scope, r) : {};
      l.$root = i, t = pt(t, l), l.$template && yn(i, l.$template);
    }
    const o = C(i, "v-once") != null;
    o && (be = !0), (r = C(i, "ref")) && (t !== n && U(i, te, r, n), U(i, te, r, t)), Be(i, t);
    const c = [];
    for (const { name: l, value: f } of [...i.attributes])
      gn.test(l) && l !== "v-cloak" && (l === "v-model" ? c.unshift([l, f]) : l[0] === "@" || /^v-on\b/.test(l) ? c.push([l, f]) : Ke(i, l, f, t));
    for (const [l, f] of c)
      Ke(i, l, f, t);
    o && (be = !1);
  } else if (s === 3) {
    const i = e.data;
    if (i.includes(t.delimiters[0])) {
      let r = [], o = 0, c;
      for (; c = t.delimitersRE.exec(i); ) {
        const l = i.slice(o, c.index);
        l && r.push(JSON.stringify(l)), r.push(`$s(${c[1]})`), o = c.index + c[0].length;
      }
      o < i.length && r.push(JSON.stringify(i.slice(o))), U(e, ot, r.join("+"), t);
    }
  } else s === 11 && Be(e, t);
}, Be = (e, t) => {
  let n = e.firstChild;
  for (; n; )
    n = ut(n, t) || n.nextSibling;
}, Ke = (e, t, n, s) => {
  let i, r, o;
  if (t = t.replace(bn, (c, l) => ((o || (o = {}))[l] = !0, "")), t[0] === ":")
    i = ve, r = t.slice(1);
  else if (t[0] === "@")
    i = rt, r = t.slice(1);
  else {
    const c = t.indexOf(":"), l = c > 0 ? t.slice(2, c) : t.slice(2);
    i = vn[l] || s.dirs[l], r = c > 0 ? t.slice(c + 1) : void 0;
  }
  i && (i === ve && r === "ref" && (i = te), U(e, i, n, s, r, o), e.removeAttribute(t));
}, U = (e, t, n, s, i, r) => {
  const c = t({
    el: e,
    get: (l = n) => J(s.scope, l),
    effect: s.effect,
    ctx: s,
    exp: n,
    arg: i,
    modifiers: r
  });
  c && s.cleanups.push(c);
}, yn = (e, t) => {
  if (t[0] === "#") {
    const n = document.querySelector(t);
    e.appendChild(n.content.cloneNode(!0));
    return;
  }
  e.innerHTML = t.replace(/<[\/\s]*template\s*>/ig, "");
}, at = (e) => {
  const t = {
    delimiters: ["{{", "}}"],
    delimitersRE: /\{\{([^]+?)\}\}/g,
    ...e,
    scope: e ? e.scope : Y({}),
    dirs: e ? e.dirs : {},
    effects: [],
    blocks: [],
    cleanups: [],
    effect: (n) => {
      if (be)
        return Me(n), n;
      const s = Ct(n, {
        scheduler: () => Me(s)
      });
      return t.effects.push(s), s;
    }
  };
  return t;
}, pt = (e, t = {}) => {
  const n = e.scope, s = Object.create(n);
  Object.defineProperties(s, Object.getOwnPropertyDescriptors(t)), s.$refs = Object.create(n.$refs);
  const i = Y(
    new Proxy(s, {
      set(r, o, c, l) {
        return l === i && !pe(r, o) ? Reflect.set(n, o, c) : Reflect.set(r, o, c, l);
      }
    })
  );
  return ht(i), {
    ...e,
    scope: i
  };
}, ht = (e) => {
  for (const t of Object.keys(e))
    typeof e[t] == "function" && (e[t] = e[t].bind(e));
};
class Re {
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
    ) : this.template = t.cloneNode(!0), s ? this.ctx = n : (this.parentCtx = n, n.blocks.push(this), this.ctx = at(n)), ut(this.template, this.ctx);
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
    if (this.parentCtx && gt(this.parentCtx.blocks, this), this.start) {
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
    }), this.ctx.effects.forEach(It), this.ctx.cleanups.forEach((t) => t());
  }
}
const He = (e) => e.replace(/[-.*+?^${}()|[\]\/\\]/g, "\\$&"), xn = (e) => {
  const t = at();
  if (e && (t.scope = Y(e), ht(t.scope), e.$delimiters)) {
    const [s, i] = t.delimiters = e.$delimiters;
    t.delimitersRE = new RegExp(
      He(s) + "([^]+?)" + He(i),
      "g"
    );
  }
  t.scope.$s = ct, t.scope.$nextTick = ne, t.scope.$refs = /* @__PURE__ */ Object.create(null);
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
      ), i.length || (i = [s]), n = i.map((r) => new Re(r, t, !0)), this;
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
}, ze = document.currentScript;
ze && ze.hasAttribute("init") && xn().mount();
export {
  xn as createApp,
  ne as nextTick,
  Y as reactive,
  Ct as watchEffect
};
