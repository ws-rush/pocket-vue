/**
* @vue/shared v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function vt(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
process.env.NODE_ENV !== "production" && Object.freeze({});
process.env.NODE_ENV !== "production" && Object.freeze([]);
const ae = Object.assign, mt = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, gt = Object.prototype.hasOwnProperty, pe = (e, t) => gt.call(e, t), y = Array.isArray, ie = (e) => Ee(e) === "[object Map]", Ae = (e) => Ee(e) === "[object Date]", j = (e) => typeof e == "string", I = (e) => typeof e == "symbol", R = (e) => e !== null && typeof e == "object", bt = Object.prototype.toString, Ee = (e) => bt.call(e), yt = (e) => Ee(e).slice(8, -1), xe = (e) => j(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Fe = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, _t = /-\w/g, Et = Fe(
  (e) => e.replace(_t, (t) => t.slice(1).toUpperCase())
), xt = /\B([A-Z])/g, qe = Fe(
  (e) => e.replace(xt, "-$1").toLowerCase()
), Je = (e, t) => !Object.is(e, t), $e = (e) => {
  const t = j(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
function Ye(e) {
  if (y(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = j(s) ? Dt(s) : Ye(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (j(e) || R(e))
    return e;
}
const St = /;(?![^(]*\))/g, wt = /:([^]+)/, Ot = /\/\*[^]*?\*\//g;
function Dt(e) {
  const t = {};
  return e.replace(Ot, "").split(St).forEach((n) => {
    if (n) {
      const s = n.split(wt);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function Ze(e) {
  let t = "";
  if (j(e))
    t = e;
  else if (y(e))
    for (let n = 0; n < e.length; n++) {
      const s = Ze(e[n]);
      s && (t += s + " ");
    }
  else if (R(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function Nt(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++)
    n = B(e[s], t[s]);
  return n;
}
function B(e, t) {
  if (e === t) return !0;
  let n = Ae(e), s = Ae(t);
  if (n || s)
    return n && s ? e.getTime() === t.getTime() : !1;
  if (n = I(e), s = I(t), n || s)
    return e === t;
  if (n = y(e), s = y(t), n || s)
    return n && s ? Nt(e, t) : !1;
  if (n = R(e), s = R(t), n || s) {
    if (!n || !s)
      return !1;
    const i = Object.keys(e).length, r = Object.keys(t).length;
    if (i !== r)
      return !1;
    for (const c in e) {
      const o = e.hasOwnProperty(c), l = t.hasOwnProperty(c);
      if (o && !l || !o && l || !B(e[c], t[c]))
        return !1;
    }
  }
  return String(e) === String(t);
}
function re(e, t) {
  return e.findIndex((n) => B(n, t));
}
/**
* @vue/reactivity v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function F(e, ...t) {
  console.warn(`[Vue warn] ${e}`, ...t);
}
let p;
const oe = /* @__PURE__ */ new WeakSet();
class ke {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, oe.has(this) && (oe.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Rt(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ve(this), Qe(this);
    const t = p, n = w;
    p = this, w = !0;
    try {
      return this.fn();
    } finally {
      process.env.NODE_ENV !== "production" && p !== this && F(
        "Active effect was not restored correctly - this is likely a Vue internal bug."
      ), Ue(this), p = t, w = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Oe(t);
      this.deps = this.depsTail = void 0, Ve(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? oe.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
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
let Ge = 0, H, z;
function Rt(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = z, z = e;
    return;
  }
  e.next = H, H = e;
}
function Se() {
  Ge++;
}
function we() {
  if (--Ge > 0)
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
function Qe(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ue(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), Oe(s), At(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function he(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Tt(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Tt(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === X) || (e.globalVersion = X, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !he(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = p, s = w;
  p = e, w = !0;
  try {
    Qe(e);
    const i = e.fn(e._value);
    (t.version === 0 || Je(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    p = n, w = s, Ue(e), e.flags &= -3;
  }
}
function Oe(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), process.env.NODE_ENV !== "production" && n.subsHead === e && (n.subsHead = i), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      Oe(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function At(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function $t(e, t) {
  e.effect instanceof ke && (e = e.effect.fn);
  const n = new ke(e);
  t && ae(n, t);
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
let w = !0;
const Xe = [];
function Vt() {
  Xe.push(w), w = !1;
}
function Ct() {
  const e = Xe.pop();
  w = e === void 0 ? !0 : e;
}
function Ve(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = p;
    p = void 0;
    try {
      t();
    } finally {
      p = n;
    }
  }
}
let X = 0;
class jt {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class It {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0, process.env.NODE_ENV !== "production" && (this.subsHead = void 0);
  }
  track(t) {
    if (!p || !w || p === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== p)
      n = this.activeLink = new jt(p, this), p.deps ? (n.prevDep = p.depsTail, p.depsTail.nextDep = n, p.depsTail = n) : p.deps = p.depsTail = n, et(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = p.depsTail, n.nextDep = void 0, p.depsTail.nextDep = n, p.depsTail = n, p.deps === n && (p.deps = s);
    }
    return process.env.NODE_ENV !== "production" && p.onTrack && p.onTrack(
      ae(
        {
          effect: p
        },
        t
      )
    ), n;
  }
  trigger(t) {
    this.version++, X++, this.notify(t);
  }
  notify(t) {
    Se();
    try {
      if (process.env.NODE_ENV !== "production")
        for (let n = this.subsHead; n; n = n.nextSub)
          n.sub.onTrigger && !(n.sub.flags & 8) && n.sub.onTrigger(
            ae(
              {
                effect: n.sub
              },
              t
            )
          );
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      we();
    }
  }
}
function et(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        et(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), process.env.NODE_ENV !== "production" && e.dep.subsHead === void 0 && (e.dep.subsHead = e), e.dep.subs = e;
  }
}
const de = /* @__PURE__ */ new WeakMap(), Q = Symbol(
  process.env.NODE_ENV !== "production" ? "Object iterate" : ""
), Ce = Symbol(
  process.env.NODE_ENV !== "production" ? "Map keys iterate" : ""
), q = Symbol(
  process.env.NODE_ENV !== "production" ? "Array iterate" : ""
);
function M(e, t, n) {
  if (w && p) {
    let s = de.get(e);
    s || de.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new It()), i.map = s, i.key = n), process.env.NODE_ENV !== "production" ? i.track({
      target: e,
      type: t,
      key: n
    }) : i.track();
  }
}
function ce(e, t, n, s, i, r) {
  const c = de.get(e);
  if (!c) {
    X++;
    return;
  }
  const o = (l) => {
    l && (process.env.NODE_ENV !== "production" ? l.trigger({
      target: e,
      type: t,
      key: n,
      newValue: s,
      oldValue: i,
      oldTarget: r
    }) : l.trigger());
  };
  if (Se(), t === "clear")
    c.forEach(o);
  else {
    const l = y(e), f = l && xe(n);
    if (l && n === "length") {
      const u = Number(s);
      c.forEach((a, h) => {
        (h === "length" || h === q || !I(h) && h >= u) && o(a);
      });
    } else
      switch ((n !== void 0 || c.has(void 0)) && o(c.get(n)), f && o(c.get(q)), t) {
        case "add":
          l ? f && o(c.get("length")) : (o(c.get(Q)), ie(e) && o(c.get(Ce)));
          break;
        case "delete":
          l || (o(c.get(Q)), ie(e) && o(c.get(Ce)));
          break;
        case "set":
          ie(e) && o(c.get(Q));
          break;
      }
  }
  we();
}
function L(e) {
  const t = D(e);
  return t === e ? t : (M(t, "iterate", q), Z(e) ? t : t.map(O));
}
function De(e) {
  return M(e = D(e), "iterate", q), e;
}
const Mt = {
  __proto__: null,
  [Symbol.iterator]() {
    return le(this, Symbol.iterator, O);
  },
  concat(...e) {
    return L(this).concat(
      ...e.map((t) => y(t) ? L(t) : t)
    );
  },
  entries() {
    return le(this, "entries", (e) => (e[1] = O(e[1]), e));
  },
  every(e, t) {
    return N(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return N(this, "filter", e, t, (n) => n.map(O), arguments);
  },
  find(e, t) {
    return N(this, "find", e, t, O, arguments);
  },
  findIndex(e, t) {
    return N(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return N(this, "findLast", e, t, O, arguments);
  },
  findLastIndex(e, t) {
    return N(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return N(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return fe(this, "includes", e);
  },
  indexOf(...e) {
    return fe(this, "indexOf", e);
  },
  join(e) {
    return L(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return fe(this, "lastIndexOf", e);
  },
  map(e, t) {
    return N(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return K(this, "pop");
  },
  push(...e) {
    return K(this, "push", e);
  },
  reduce(e, ...t) {
    return je(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return je(this, "reduceRight", e, t);
  },
  shift() {
    return K(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return N(this, "some", e, t, void 0, arguments);
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
    return le(this, "values", O);
  }
};
function le(e, t, n) {
  const s = De(e), i = s[t]();
  return s !== e && !Z(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.value && (r.value = n(r.value)), r;
  }), i;
}
const Pt = Array.prototype;
function N(e, t, n, s, i, r) {
  const c = De(e), o = c !== e && !Z(e), l = c[t];
  if (l !== Pt[t]) {
    const a = l.apply(e, r);
    return o ? O(a) : a;
  }
  let f = n;
  c !== e && (o ? f = function(a, h) {
    return n.call(this, O(a), h, e);
  } : n.length > 2 && (f = function(a, h) {
    return n.call(this, a, h, e);
  }));
  const u = l.call(c, f, s);
  return o && i ? i(u) : u;
}
function je(e, t, n, s) {
  const i = De(e);
  let r = n;
  return i !== e && (Z(e) ? n.length > 3 && (r = function(c, o, l) {
    return n.call(this, c, o, l, e);
  }) : r = function(c, o, l) {
    return n.call(this, c, O(o), l, e);
  }), i[t](r, ...s);
}
function fe(e, t, n) {
  const s = D(e);
  M(s, "iterate", q);
  const i = s[t](...n);
  return (i === -1 || i === !1) && Gt(n[0]) ? (n[0] = D(n[0]), s[t](...n)) : i;
}
function K(e, t, n = []) {
  Vt(), Se();
  const s = D(e)[t].apply(e, n);
  return we(), Ct(), s;
}
const Lt = /* @__PURE__ */ vt("__proto__,__v_isRef,__isVue"), tt = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(I)
);
function Bt(e) {
  I(e) || (e = String(e));
  const t = D(this);
  return M(t, "has", e), t.hasOwnProperty(e);
}
class nt {
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
      return s === (i ? r ? qt : it : r ? Ft : st).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const c = y(t);
    if (!i) {
      let l;
      if (c && (l = Mt[n]))
        return l;
      if (n === "hasOwnProperty")
        return Bt;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      W(t) ? t : s
    );
    return (I(n) ? tt.has(n) : Lt(n)) || (i || M(t, "get", n), r) ? o : W(o) ? c && xe(n) ? o : o.value : R(o) ? i ? Zt(o) : Y(o) : o;
  }
}
class Kt extends nt {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    if (!this._isShallow) {
      const l = ve(r);
      if (!Z(s) && !ve(s) && (r = D(r), s = D(s)), !y(t) && W(r) && !W(s))
        return l ? (process.env.NODE_ENV !== "production" && F(
          `Set operation on key "${String(n)}" failed: target is readonly.`,
          t[n]
        ), !0) : (r.value = s, !0);
    }
    const c = y(t) && xe(n) ? Number(n) < t.length : pe(t, n), o = Reflect.set(
      t,
      n,
      s,
      W(t) ? t : i
    );
    return t === D(i) && (c ? Je(s, r) && ce(t, "set", n, s, r) : ce(t, "add", n, s)), o;
  }
  deleteProperty(t, n) {
    const s = pe(t, n), i = t[n], r = Reflect.deleteProperty(t, n);
    return r && s && ce(t, "delete", n, void 0, i), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!I(n) || !tt.has(n)) && M(t, "has", n), s;
  }
  ownKeys(t) {
    return M(
      t,
      "iterate",
      y(t) ? "length" : Q
    ), Reflect.ownKeys(t);
  }
}
class Ht extends nt {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return process.env.NODE_ENV !== "production" && F(
      `Set operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
  deleteProperty(t, n) {
    return process.env.NODE_ENV !== "production" && F(
      `Delete operation on key "${String(n)}" failed: target is readonly.`,
      t
    ), !0;
  }
}
const zt = /* @__PURE__ */ new Kt(), Wt = /* @__PURE__ */ new Ht(), st = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap(), it = /* @__PURE__ */ new WeakMap(), qt = /* @__PURE__ */ new WeakMap();
function Jt(e) {
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
function Yt(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Jt(yt(e));
}
function Y(e) {
  return ve(e) ? e : rt(
    e,
    !1,
    zt,
    null,
    st
  );
}
function Zt(e) {
  return rt(
    e,
    !0,
    Wt,
    null,
    it
  );
}
function rt(e, t, n, s, i) {
  if (!R(e))
    return process.env.NODE_ENV !== "production" && F(
      `value cannot be made ${t ? "readonly" : "reactive"}: ${String(
        e
      )}`
    ), e;
  if (e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = Yt(e);
  if (r === 0)
    return e;
  const c = i.get(e);
  if (c)
    return c;
  const o = new Proxy(
    e,
    r === 2 ? s : n
  );
  return i.set(e, o), o;
}
function ve(e) {
  return !!(e && e.__v_isReadonly);
}
function Z(e) {
  return !!(e && e.__v_isShallow);
}
function Gt(e) {
  return e ? !!e.__v_raw : !1;
}
function D(e) {
  const t = e && e.__v_raw;
  return t ? D(t) : e;
}
const O = (e) => R(e) ? Y(e) : e;
function W(e) {
  return e ? e.__v_isRef === !0 : !1;
}
let me = !1;
const ee = [], Qt = Promise.resolve(), te = (e) => Qt.then(e), Ie = (e) => {
  ee.includes(e) || ee.push(e), me || (me = !0, te(Ut));
}, Ut = () => {
  for (const e of ee)
    e();
  ee.length = 0, me = !1;
}, Xt = /^(spellcheck|draggable|form|list|type)$/, ge = ({
  el: e,
  get: t,
  effect: n,
  arg: s,
  modifiers: i
}) => {
  let r;
  s === "class" && (e._class = e.className), n(() => {
    let c = t();
    if (s)
      i?.camel && (s = Et(s)), ue(e, s, c, r);
    else {
      for (const o in c)
        ue(e, o, c[o], r && r[o]);
      for (const o in r)
        (!c || !(o in c)) && ue(e, o, null);
    }
    r = c;
  });
}, ue = (e, t, n, s) => {
  if (t === "class")
    e.setAttribute(
      "class",
      Ze(e._class ? [e._class, n] : n) || ""
    );
  else if (t === "style") {
    n = Ye(n);
    const { style: i } = e;
    if (!n)
      e.removeAttribute("style");
    else if (j(n))
      n !== s && (i.cssText = n);
    else {
      for (const r in n)
        be(i, r, n[r]);
      if (s && !j(s))
        for (const r in s)
          n[r] == null && be(i, r, "");
    }
  } else !(e instanceof SVGElement) && t in e && !Xt.test(t) ? (e[t] = n, t === "value" && (e._value = n)) : t === "true-value" ? e._trueValue = n : t === "false-value" ? e._falseValue = n : n != null ? e.setAttribute(t, n) : e.removeAttribute(t);
}, Me = /\s*!important$/, be = (e, t, n) => {
  y(n) ? n.forEach((s) => be(e, t, s)) : t.startsWith("--") ? e.setProperty(t, n) : Me.test(n) ? e.setProperty(
    qe(t),
    n.replace(Me, ""),
    "important"
  ) : e[t] = n;
}, k = (e, t) => {
  const n = e.getAttribute(t);
  return n != null && e.removeAttribute(t), n;
}, $ = (e, t, n, s) => {
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
}, ot = ({ el: e, get: t, exp: n, arg: s, modifiers: i }) => {
  if (!s)
    return;
  let r = en.test(n) ? t(`(e => ${n}(e))`) : t(`($event => { ${n} })`);
  if (s === "vue:mounted") {
    te(r);
    return;
  } else if (s === "vue:unmounted")
    return () => r();
  if (i) {
    s === "click" && (i.right && (s = "contextmenu"), i.middle && (s = "mouseup"));
    const c = r;
    r = (o) => {
      if (!("key" in o && !(qe(o.key) in i))) {
        for (const l in i) {
          const f = nn[l];
          if (f && f(o, i))
            return;
        }
        return c(o);
      }
    };
  }
  $(e, s, r, i);
}, sn = ({ el: e, get: t, effect: n }) => {
  const s = e.style.display;
  n(() => {
    e.style.display = t() ? s : "none";
  });
}, ct = ({ el: e, get: t, effect: n }) => {
  n(() => {
    e.textContent = lt(t());
  });
}, lt = (e) => e == null ? "" : R(e) ? (() => {
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
  const r = e.type, c = n(`(val) => { ${t} = val }`), { trim: o, number: l = r === "number" || r === "range" } = i || {};
  if (e.tagName === "SELECT") {
    const f = e;
    $(e, "change", () => {
      const u = Array.prototype.filter.call(f.options, (a) => a.selected).map(
        (a) => l ? $e(A(a)) : A(a)
      );
      c(f.multiple ? u : u[0]);
    }), s(() => {
      const u = n(), a = f.multiple;
      for (let h = 0, _ = f.options.length; h < _; h++) {
        const b = f.options[h], E = A(b);
        if (a)
          y(u) ? b.selected = re(u, E) > -1 : b.selected = u.has(E);
        else if (B(A(b), u)) {
          f.selectedIndex !== h && (f.selectedIndex = h);
          return;
        }
      }
      !a && f.selectedIndex !== -1 && (f.selectedIndex = -1);
    });
  } else if (r === "checkbox") {
    $(e, "change", () => {
      const u = n(), a = e.checked;
      if (y(u)) {
        const h = A(e), _ = re(u, h), b = _ !== -1;
        if (a && !b)
          c(u.concat(h));
        else if (!a && b) {
          const E = [...u];
          E.splice(_, 1), c(E);
        }
      } else
        c(Pe(e, a));
    });
    let f;
    s(() => {
      const u = n();
      y(u) ? e.checked = re(u, A(e)) > -1 : u !== f && (e.checked = B(
        u,
        Pe(e, !0)
      )), f = u;
    });
  } else if (r === "radio") {
    $(e, "change", () => {
      c(A(e));
    });
    let f;
    s(() => {
      const u = n();
      u !== f && (e.checked = B(u, A(e)));
    });
  } else {
    const f = (u) => o ? u.trim() : l ? $e(u) : u;
    $(e, "compositionstart", cn), $(e, "compositionend", ln), $(e, i?.lazy ? "change" : "input", () => {
      e.composing || c(f(e.value));
    }), o && $(e, "change", () => {
      e.value = e.value.trim();
    }), s(() => {
      if (e.composing)
        return;
      const u = e.value, a = n();
      document.activeElement === e && f(u) === a || u !== a && (e.value = a);
    });
  }
}, A = (e) => "_value" in e ? e._value : e.value, Pe = (e, t) => {
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
}, Le = /* @__PURE__ */ Object.create(null), J = (e, t, n) => ft(e, `return(${t})`, n), ft = (e, t, n) => {
  const s = Le[t] || (Le[t] = un(t));
  try {
    return s(e, n);
  } catch (i) {
    console.error(i);
  }
}, un = (e) => {
  try {
    return new Function("$data", "$el", `with($data){${e}}`);
  } catch (t) {
    return console.error(`${t.message} in expression: ${e}`), () => {
    };
  }
}, an = ({ el: e, ctx: t, exp: n, effect: s }) => {
  te(() => s(() => ft(t.scope, n, e)));
}, pn = {
  bind: ge,
  on: ot,
  show: sn,
  text: ct,
  html: rn,
  model: on,
  effect: an
}, hn = (e, t, n) => {
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
  let c, o;
  for (; (c = e.nextElementSibling) && (o = null, k(c, "v-else") === "" || (o = k(c, "v-else-if"))); )
    s.removeChild(c), r.push({ exp: o, el: c });
  const l = e.nextSibling;
  s.removeChild(e);
  let f, u = -1;
  const a = () => {
    f && (s.insertBefore(i, f.el), f.remove(), f = void 0);
  };
  return n.effect(() => {
    for (let h = 0; h < r.length; h++) {
      const { exp: _, el: b } = r[h];
      if (!_ || J(n.scope, _)) {
        h !== u && (a(), f = new Ne(b, n), f.insert(s, i), s.removeChild(i), u = h);
        return;
      }
    }
    u = -1, a();
  }), l;
}, dn = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, Be = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, vn = /^\(|\)$/g, mn = /^[{[]\s*((?:[\w_$]+\s*,?\s*)+)[\]}]$/, gn = (e, t, n) => {
  const s = t.match(dn);
  if (!s)
    return;
  const i = e.nextSibling, r = e.parentElement, c = new Text("");
  r.insertBefore(c, e), r.removeChild(e);
  const o = s[2].trim();
  let l = s[1].trim().replace(vn, "").trim(), f, u = !1, a, h, _ = "key", b = e.getAttribute(_) || e.getAttribute(_ = ":key") || e.getAttribute(_ = "v-bind:key");
  b && (e.removeAttribute(_), _ === "key" && (b = JSON.stringify(b)));
  let E;
  (E = l.match(Be)) && (l = l.replace(Be, "").trim(), a = E[1].trim(), E[2] && (h = E[2].trim())), (E = l.match(mn)) && (f = E[1].split(",").map((m) => m.trim()), u = l[0] === "[");
  let Re = !1, V, G, ne;
  const dt = (m) => {
    const x = /* @__PURE__ */ new Map(), d = [];
    if (y(m))
      for (let v = 0; v < m.length; v++)
        d.push(se(x, m[v], v));
    else if (typeof m == "number")
      for (let v = 0; v < m; v++)
        d.push(se(x, v + 1, v));
    else if (R(m)) {
      let v = 0;
      for (const g in m)
        d.push(se(x, m[g], v++, g));
    }
    return [d, x];
  }, se = (m, x, d, v) => {
    const g = {};
    f ? f.forEach(
      (C, T) => g[C] = x[u ? T : C]
    ) : g[l] = x, v ? (a && (g[a] = v), h && (g[h] = d)) : a && (g[a] = d);
    const P = pt(n, g), S = b ? J(P.scope, b) : d;
    return m.set(S, d), P.key = S, P;
  }, Te = (m, x) => {
    const d = new Ne(e, m);
    return d.key = m.key, d.insert(r, x), d;
  };
  return n.effect(() => {
    const m = J(n.scope, o), x = ne;
    if ([G, ne] = dt(m), !Re)
      V = G.map((d) => Te(d, c)), Re = !0;
    else {
      for (let S = 0; S < V.length; S++)
        ne.has(V[S].key) || V[S].remove();
      const d = [];
      let v = G.length, g, P;
      for (; v--; ) {
        const S = G[v], C = x.get(S.key);
        let T;
        C == null ? T = Te(
          S,
          g ? g.el : c
        ) : (T = V[C], Object.assign(T.ctx.scope, S.scope), C !== v && (V[C + 1] !== g || // If the next has moved, it must move too
        P === g) && (P = T, T.insert(r, g ? g.el : c))), d.unshift(g = T);
      }
      V = d;
    }
  }), i;
}, ye = ({
  el: e,
  ctx: {
    scope: { $refs: t }
  },
  get: n,
  effect: s
}) => {
  let i;
  return s(() => {
    const r = n();
    t[r] = e, i && r !== i && delete t[i], i = r;
  }), () => {
    i && delete t[i];
  };
}, bn = /^(?:v-|:|@)/, yn = /\.([\w-]+)/g;
let _e = !1;
const ut = (e, t) => {
  const n = t, s = e.nodeType;
  if (s === 1) {
    const i = e;
    if (i.hasAttribute("v-pre"))
      return;
    k(i, "v-cloak");
    let r;
    if (r = k(i, "v-if"))
      return hn(i, r, t);
    if (r = k(i, "v-for"))
      return gn(i, r, t);
    if ((r = k(i, "v-scope")) || r === "") {
      const l = r ? J(t.scope, r, i) : {};
      l.$root = i, t = pt(t, l), l.$template && _n(i, l.$template);
    }
    const c = k(i, "v-once") != null;
    c && (_e = !0), (r = k(i, "ref")) && (t !== n && U(i, ye, `"${r}"`, n), U(i, ye, `"${r}"`, t)), Ke(i, t);
    const o = [];
    for (const { name: l, value: f } of [...i.attributes])
      bn.test(l) && l !== "v-cloak" && (l === "v-model" ? o.unshift([l, f]) : l[0] === "@" || /^v-on\b/.test(l) ? o.push([l, f]) : He(i, l, f, t));
    for (const [l, f] of o)
      He(i, l, f, t);
    c && (_e = !1);
  } else if (s === 3) {
    const i = e.data;
    if (i.includes(t.delimiters[0])) {
      let r = [], c = 0, o;
      for (; o = t.delimitersRE.exec(i); ) {
        const l = i.slice(c, o.index);
        l && r.push(JSON.stringify(l)), r.push(`$s(${o[1]})`), c = o.index + o[0].length;
      }
      c < i.length && r.push(JSON.stringify(i.slice(c))), U(e, ct, r.join("+"), t);
    }
  } else s === 11 && Ke(e, t);
}, Ke = (e, t) => {
  let n = e.firstChild;
  for (; n; )
    n = ut(n, t) || n.nextSibling;
}, He = (e, t, n, s) => {
  let i, r, c;
  if (t = t.replace(yn, (o, l) => ((c || (c = {}))[l] = !0, "")), t[0] === ":")
    i = ge, r = t.slice(1);
  else if (t[0] === "@")
    i = ot, r = t.slice(1);
  else {
    const o = t.indexOf(":"), l = o > 0 ? t.slice(2, o) : t.slice(2);
    i = pn[l] || s.dirs[l], r = o > 0 ? t.slice(o + 1) : void 0;
  }
  i && (i === ge && r === "ref" && (i = ye), U(e, i, n, s, r, c), e.removeAttribute(t));
}, U = (e, t, n, s, i, r) => {
  const o = t({
    el: e,
    get: (l = n) => J(s.scope, l, e),
    effect: s.effect,
    ctx: s,
    exp: n,
    arg: i,
    modifiers: r
  });
  o && s.cleanups.push(o);
}, _n = (e, t) => {
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
      if (_e)
        return Ie(n), n;
      const s = $t(n, {
        scheduler: () => Ie(s)
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
      set(r, c, o, l) {
        return l === i && !pe(r, c) ? Reflect.set(n, c, o) : Reflect.set(r, c, o, l);
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
class Ne {
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
    if (this.parentCtx && mt(this.parentCtx.blocks, this), this.start) {
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
const ze = (e) => e.replace(/[-.*+?^${}()|[\]\/\\]/g, "\\$&"), En = (e) => {
  const t = at();
  if (e && (t.scope = Y(e), ht(t.scope), e.$delimiters)) {
    const [s, i] = t.delimiters = e.$delimiters;
    t.delimitersRE = new RegExp(
      ze(s) + "([^]+?)" + ze(i),
      "g"
    );
  }
  t.scope.$s = lt, t.scope.$nextTick = te, t.scope.$refs = /* @__PURE__ */ Object.create(null);
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
      ), i.length || (i = [s]), n = i.map((r) => new Ne(r, t, !0)), this;
    },
    unmount() {
      n.forEach((s) => s.teardown());
    }
  };
}, We = document.currentScript;
We && We.hasAttribute("init") && En().mount();
export {
  En as createApp,
  te as nextTick,
  Y as reactive,
  $t as watchEffect
};
