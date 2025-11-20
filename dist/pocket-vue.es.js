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
const gt = Object.assign, vt = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, yt = Object.prototype.hasOwnProperty, ae = (e, t) => yt.call(e, t), v = Array.isArray, se = (e) => ye(e) === "[object Map]", ke = (e) => ye(e) === "[object Date]", D = (e) => typeof e == "string", I = (e) => typeof e == "symbol", A = (e) => e !== null && typeof e == "object", bt = Object.prototype.toString, ye = (e) => bt.call(e), _t = (e) => ye(e).slice(8, -1), be = (e) => D(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, Fe = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, Et = /-\w/g, xt = Fe(
  (e) => e.replace(Et, (t) => t.slice(1).toUpperCase())
), St = /\B([A-Z])/g, He = Fe(
  (e) => e.replace(St, "-$1").toLowerCase()
), We = (e, t) => !Object.is(e, t), De = (e) => {
  const t = D(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
function qe(e) {
  if (v(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = D(s) ? At(s) : qe(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (D(e) || A(e))
    return e;
}
const Rt = /;(?![^(]*\))/g, wt = /:([^]+)/, Tt = /\/\*[^]*?\*\//g;
function At(e) {
  const t = {};
  return e.replace(Tt, "").split(Rt).forEach((n) => {
    if (n) {
      const s = n.split(wt);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function ze(e) {
  let t = "";
  if (D(e))
    t = e;
  else if (v(e))
    for (let n = 0; n < e.length; n++) {
      const s = ze(e[n]);
      s && (t += s + " ");
    }
  else if (A(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function Ot(e, t) {
  if (e.length !== t.length) return !1;
  let n = !0;
  for (let s = 0; n && s < e.length; s++)
    n = $(e[s], t[s]);
  return n;
}
function $(e, t) {
  if (e === t) return !0;
  let n = ke(e), s = ke(t);
  if (n || s)
    return n && s ? e.getTime() === t.getTime() : !1;
  if (n = I(e), s = I(t), n || s)
    return e === t;
  if (n = v(e), s = v(t), n || s)
    return n && s ? Ot(e, t) : !1;
  if (n = A(e), s = A(t), n || s) {
    if (!n || !s)
      return !1;
    const i = Object.keys(e).length, r = Object.keys(t).length;
    if (i !== r)
      return !1;
    for (const o in e) {
      const c = e.hasOwnProperty(o), l = t.hasOwnProperty(o);
      if (c && !l || !c && l || !$(e[o], t[o]))
        return !1;
    }
  }
  return String(e) === String(t);
}
function _e(e, t) {
  return e.findIndex((n) => $(n, t));
}
/**
* @vue/reactivity v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let d;
const ie = /* @__PURE__ */ new WeakSet();
class Ie {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, ie.has(this) && (ie.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || kt(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, Ce(this), Ue(this);
    const t = d, n = E;
    d = this, E = !0;
    try {
      return this.fn();
    } finally {
      Ye(this), d = t, E = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        Se(t);
      this.deps = this.depsTail = void 0, Ce(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? ie.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ue(this) && this.run();
  }
  get dirty() {
    return ue(this);
  }
}
let Je = 0, V, L;
function kt(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = L, L = e;
    return;
  }
  e.next = V, V = e;
}
function Ee() {
  Je++;
}
function xe() {
  if (--Je > 0)
    return;
  if (L) {
    let t = L;
    for (L = void 0; t; ) {
      const n = t.next;
      t.next = void 0, t.flags &= -9, t = n;
    }
  }
  let e;
  for (; V; ) {
    let t = V;
    for (V = void 0; t; ) {
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
function Ue(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ye(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), Se(s), It(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function ue(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (Dt(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function Dt(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === U) || (e.globalVersion = U, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ue(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = d, s = E;
  d = e, E = !0;
  try {
    Ue(e);
    const i = e.fn(e._value);
    (t.version === 0 || We(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    d = n, E = s, Ye(e), e.flags &= -3;
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
function It(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function Ct(e, t) {
  e.effect instanceof Ie && (e = e.effect.fn);
  const n = new Ie(e);
  t && gt(n, t);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const s = n.run.bind(n);
  return s.effect = n, s;
}
function Mt(e) {
  e.effect.stop();
}
let E = !0;
const Ze = [];
function $t() {
  Ze.push(E), E = !1;
}
function Pt() {
  const e = Ze.pop();
  E = e === void 0 ? !0 : e;
}
function Ce(e) {
  const { cleanup: t } = e;
  if (e.cleanup = void 0, t) {
    const n = d;
    d = void 0;
    try {
      t();
    } finally {
      d = n;
    }
  }
}
let U = 0;
class Nt {
  constructor(t, n) {
    this.sub = t, this.dep = n, this.version = n.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class jt {
  // TODO isolatedDeclarations "__v_skip"
  constructor(t) {
    this.computed = t, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
  }
  track(t) {
    if (!d || !E || d === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== d)
      n = this.activeLink = new Nt(d, this), d.deps ? (n.prevDep = d.depsTail, d.depsTail.nextDep = n, d.depsTail = n) : d.deps = d.depsTail = n, Ge(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = d.depsTail, n.nextDep = void 0, d.depsTail.nextDep = n, d.depsTail = n, d.deps === n && (d.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, U++, this.notify(t);
  }
  notify(t) {
    Ee();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      xe();
    }
  }
}
function Ge(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Ge(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const he = /* @__PURE__ */ new WeakMap(), z = Symbol(
  ""
), Me = Symbol(
  ""
), F = Symbol(
  ""
);
function C(e, t, n) {
  if (E && d) {
    let s = he.get(e);
    s || he.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new jt()), i.map = s, i.key = n), i.track();
  }
}
function re(e, t, n, s, i, r) {
  const o = he.get(e);
  if (!o) {
    U++;
    return;
  }
  const c = (l) => {
    l && l.trigger();
  };
  if (Ee(), t === "clear")
    o.forEach(c);
  else {
    const l = v(e), f = l && be(n);
    if (l && n === "length") {
      const a = Number(s);
      o.forEach((u, h) => {
        (h === "length" || h === F || !I(h) && h >= a) && c(u);
      });
    } else
      switch ((n !== void 0 || o.has(void 0)) && c(o.get(n)), f && c(o.get(F)), t) {
        case "add":
          l ? f && c(o.get("length")) : (c(o.get(z)), se(e) && c(o.get(Me)));
          break;
        case "delete":
          l || (c(o.get(z)), se(e) && c(o.get(Me)));
          break;
        case "set":
          se(e) && c(o.get(z));
          break;
      }
  }
  xe();
}
function M(e) {
  const t = R(e);
  return t === e ? t : (C(t, "iterate", F), q(e) ? t : t.map(S));
}
function Re(e) {
  return C(e = R(e), "iterate", F), e;
}
const Vt = {
  __proto__: null,
  [Symbol.iterator]() {
    return oe(this, Symbol.iterator, S);
  },
  concat(...e) {
    return M(this).concat(
      ...e.map((t) => v(t) ? M(t) : t)
    );
  },
  entries() {
    return oe(this, "entries", (e) => (e[1] = S(e[1]), e));
  },
  every(e, t) {
    return T(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return T(this, "filter", e, t, (n) => n.map(S), arguments);
  },
  find(e, t) {
    return T(this, "find", e, t, S, arguments);
  },
  findIndex(e, t) {
    return T(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return T(this, "findLast", e, t, S, arguments);
  },
  findLastIndex(e, t) {
    return T(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return T(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return ce(this, "includes", e);
  },
  indexOf(...e) {
    return ce(this, "indexOf", e);
  },
  join(e) {
    return M(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return ce(this, "lastIndexOf", e);
  },
  map(e, t) {
    return T(this, "map", e, t, void 0, arguments);
  },
  pop() {
    return j(this, "pop");
  },
  push(...e) {
    return j(this, "push", e);
  },
  reduce(e, ...t) {
    return $e(this, "reduce", e, t);
  },
  reduceRight(e, ...t) {
    return $e(this, "reduceRight", e, t);
  },
  shift() {
    return j(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(e, t) {
    return T(this, "some", e, t, void 0, arguments);
  },
  splice(...e) {
    return j(this, "splice", e);
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
    return j(this, "unshift", e);
  },
  values() {
    return oe(this, "values", S);
  }
};
function oe(e, t, n) {
  const s = Re(e), i = s[t]();
  return s !== e && !q(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.value && (r.value = n(r.value)), r;
  }), i;
}
const Lt = Array.prototype;
function T(e, t, n, s, i, r) {
  const o = Re(e), c = o !== e && !q(e), l = o[t];
  if (l !== Lt[t]) {
    const u = l.apply(e, r);
    return c ? S(u) : u;
  }
  let f = n;
  o !== e && (c ? f = function(u, h) {
    return n.call(this, S(u), h, e);
  } : n.length > 2 && (f = function(u, h) {
    return n.call(this, u, h, e);
  }));
  const a = l.call(o, f, s);
  return c && i ? i(a) : a;
}
function $e(e, t, n, s) {
  const i = Re(e);
  let r = n;
  return i !== e && (q(e) ? n.length > 3 && (r = function(o, c, l) {
    return n.call(this, o, c, l, e);
  }) : r = function(o, c, l) {
    return n.call(this, o, S(c), l, e);
  }), i[t](r, ...s);
}
function ce(e, t, n) {
  const s = R(e);
  C(s, "iterate", F);
  const i = s[t](...n);
  return (i === -1 || i === !1) && Gt(n[0]) ? (n[0] = R(n[0]), s[t](...n)) : i;
}
function j(e, t, n = []) {
  $t(), Ee();
  const s = R(e)[t].apply(e, n);
  return xe(), Pt(), s;
}
const Bt = /* @__PURE__ */ mt("__proto__,__v_isRef,__isVue"), Qe = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(I)
);
function Kt(e) {
  I(e) || (e = String(e));
  const t = R(this);
  return C(t, "has", e), t.hasOwnProperty(e);
}
class Xe {
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
      return s === (i ? r ? Jt : tt : r ? zt : et).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const o = v(t);
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
      B(t) ? t : s
    );
    return (I(n) ? Qe.has(n) : Bt(n)) || (i || C(t, "get", n), r) ? c : B(c) ? o && be(n) ? c : c.value : A(c) ? i ? Zt(c) : W(c) : c;
  }
}
class Ft extends Xe {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    if (!this._isShallow) {
      const l = pe(r);
      if (!q(s) && !pe(s) && (r = R(r), s = R(s)), !v(t) && B(r) && !B(s))
        return l || (r.value = s), !0;
    }
    const o = v(t) && be(n) ? Number(n) < t.length : ae(t, n), c = Reflect.set(
      t,
      n,
      s,
      B(t) ? t : i
    );
    return t === R(i) && (o ? We(s, r) && re(t, "set", n, s) : re(t, "add", n, s)), c;
  }
  deleteProperty(t, n) {
    const s = ae(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && re(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!I(n) || !Qe.has(n)) && C(t, "has", n), s;
  }
  ownKeys(t) {
    return C(
      t,
      "iterate",
      v(t) ? "length" : z
    ), Reflect.ownKeys(t);
  }
}
class Ht extends Xe {
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
const Wt = /* @__PURE__ */ new Ft(), qt = /* @__PURE__ */ new Ht(), et = /* @__PURE__ */ new WeakMap(), zt = /* @__PURE__ */ new WeakMap(), tt = /* @__PURE__ */ new WeakMap(), Jt = /* @__PURE__ */ new WeakMap();
function Ut(e) {
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
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Ut(_t(e));
}
function W(e) {
  return pe(e) ? e : nt(
    e,
    !1,
    Wt,
    null,
    et
  );
}
function Zt(e) {
  return nt(
    e,
    !0,
    qt,
    null,
    tt
  );
}
function nt(e, t, n, s, i) {
  if (!A(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = Yt(e);
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
function pe(e) {
  return !!(e && e.__v_isReadonly);
}
function q(e) {
  return !!(e && e.__v_isShallow);
}
function Gt(e) {
  return e ? !!e.__v_raw : !1;
}
function R(e) {
  const t = e && e.__v_raw;
  return t ? R(t) : e;
}
const S = (e) => A(e) ? W(e) : e;
function B(e) {
  return e ? e.__v_isRef === !0 : !1;
}
let de = !1;
const Y = [], Pe = (e) => {
  Y.includes(e) || Y.push(e), de || (de = !0, queueMicrotask(Qt));
}, we = (e) => queueMicrotask(() => e?.()), Qt = () => {
  for (const e of Y)
    e();
  Y.length = 0, de = !1;
}, Ne = /* @__PURE__ */ new WeakMap();
function Te(e) {
  let t = Ne.get(e);
  return t || (t = {}, Ne.set(e, t)), t;
}
const Xt = /^(spellcheck|draggable|form|list|type)$/, me = ({
  el: e,
  get: t,
  effect: n,
  arg: s,
  modifiers: i
}) => {
  let r;
  if (s === "class") {
    const o = Te(e);
    o.originalClass = e.className;
  }
  n(() => {
    let o = t();
    if (s)
      i?.camel && (s = xt(s)), le(e, s, o, r, i?.camel);
    else {
      for (const c in o)
        le(e, c, o[c], r?.[c]);
      for (const c in r)
        (!o || !(c in o)) && le(e, c, null);
    }
    r = o;
  });
}, le = (e, t, n, s, i) => {
  t === "class" ? en(e, n) : t === "style" ? tn(e, n, s) : nn(e, t, i) ? rn(e, t, n) : on(e, t, n);
}, en = (e, t) => {
  const s = Te(e).originalClass, i = ze(s ? [s, t] : t) ?? "";
  e.setAttribute("class", i);
}, tn = (e, t, n) => {
  if (t = qe(t), !t)
    e.removeAttribute("style");
  else if (D(t))
    t !== n && (e.style.cssText = t);
  else {
    for (const s in t)
      ge(e.style, s, t[s]);
    if (n && !D(n))
      for (const s in n)
        t[s] == null && ge(e.style, s, "");
  }
}, nn = (e, t, n) => t !== "class" && t !== "style" && !(e instanceof SVGElement) && (t in e || n) && !Xt.test(t), sn = /* @__PURE__ */ new Set(["id", "title", "lang", "dir"]), rn = (e, t, n) => {
  sn.has(t) ? n == null ? e.removeAttribute(t) : e.setAttribute(t, n) : (e[t] = n, t === "value" && (e._value = n));
}, on = (e, t, n) => {
  t === "true-value" ? e._trueValue = n : t === "false-value" ? e._falseValue = n : n != null ? e.setAttribute(t, n) : e.removeAttribute(t);
}, je = /\s*!important$/, ge = (e, t, n) => {
  v(n) ? n.forEach((s) => ge(e, t, s)) : t.startsWith("--") ? e.setProperty(t, n) : je.test(n) ? e.setProperty(
    He(t),
    n.replace(je, ""),
    "important"
  ) : e[t] = n;
}, O = (e, t) => {
  const n = e.getAttribute(t);
  return n != null && e.removeAttribute(t), n;
}, K = (e, t, n, s) => {
  e.addEventListener(t, n, s);
}, P = {
  /** Matches directive prefixes: v-, :, @ */
  DIR_RE: /^(?:v-|:|@)/,
  /** Matches modifiers like .camel, .lazy, etc. */
  MODIFIER_RE: /\.([\w-]+)/g,
  /** Matches v-for alias pattern: "item in items" or "item of items" */
  FOR_ALIAS_RE: /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,
  /** Matches v-for iterators: ", index" or ", key, index" */
  FOR_ITERATOR_RE: /,([^,\}\]]*)(?:,([^,\}\]]*))?$/,
  /** Matches parentheses to strip from expressions */
  STRIP_PARENS_RE: /^\(|\)$/g,
  /** Matches destructuring patterns: [a, b] or {a, b} */
  DESTRUCTURE_RE: /^[{[]\s*((?:[\w_$]+\s*,?\s*)+)[\]}]$/
}, cn = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/, ln = ["ctrl", "shift", "alt", "meta"], fn = {
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
  exact: (e, t) => ln.some((n) => e[`${n}Key`] && !t[n])
}, st = ({ el: e, get: t, exp: n, arg: s, modifiers: i }) => {
  if (!s)
    return;
  let r = cn.test(n) ? t(`(e => ${n}(e))`) : t(`($event => { ${n} })`);
  if (s === "vue:mounted") {
    we(r);
    return;
  } else if (s === "vue:unmounted")
    return () => r();
  if (i) {
    s === "click" && (i.right && (s = "contextmenu"), i.middle && (s = "mouseup"));
    const o = r;
    r = (c) => {
      if (!("key" in c && !(He(c.key) in i))) {
        for (const l in i) {
          const f = fn[l];
          if (f?.(c, i))
            return;
        }
        return o(c);
      }
    };
  }
  K(e, s, r, i);
}, an = ({ el: e, get: t, effect: n }) => {
  const s = Te(e);
  s.originalDisplay === void 0 && (s.originalDisplay = e.style.display || ""), n(() => {
    const i = t();
    e.style.display = i ? s.originalDisplay : "none";
  });
}, it = ({ el: e, get: t, effect: n }) => {
  n(() => {
    e.textContent = rt(t());
  });
}, rt = (e) => e != null ? A(e) ? (() => {
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return "[Object]";
  }
})() : String(e) : "", un = ({ el: e, get: t, effect: n }) => {
  n(() => {
    e.innerHTML = t();
  });
}, hn = (e) => (t, n) => {
  t.composing || n(e(t.value));
}, pn = (e, t) => {
  Object.entries(t).forEach(([n, s]) => {
    K(e, n, s);
  });
}, dn = ({ el: e, exp: t, get: n, effect: s, modifiers: i }) => {
  const r = e.type, o = n(`(val) => { ${t} = val }`), { trim: c, number: l = r === "number" || r === "range" } = i ?? {};
  if (e.tagName === "SELECT") {
    const f = e;
    K(e, "change", () => {
      const a = Array.from(f.options).filter((u) => u.selected).map(
        (u) => l ? De(k(u)) : k(u)
      );
      o(f.multiple ? [...a] : a[0]);
    }), s(() => {
      const a = n(), u = f.multiple, h = f.options;
      for (let p = 0, x = h.length; p < x; p++) {
        const b = h[p], N = k(b);
        if (u)
          v(a) ? b.selected = _e(a, N) > -1 : b.selected = !1;
        else if ($(N, a)) {
          f.selectedIndex !== p && (f.selectedIndex = p);
          return;
        }
      }
      !u && f.selectedIndex !== -1 && (f.selectedIndex = -1);
    });
  } else if (r === "checkbox") {
    K(e, "change", () => {
      bn(e, n, o);
    });
    let f;
    s(() => {
      yn(e, n, f), f = n();
    });
  } else if (r === "radio") {
    K(e, "change", () => {
      vn(e, o);
    });
    let f;
    s(() => {
      const a = n();
      a !== f && (e.checked = $(a, k(e)));
    });
  } else {
    const f = (h) => c ? h.trim() : l ? De(h) : h, a = hn(f), u = {
      compositionstart: mn,
      compositionend: gn,
      [i?.lazy ? "change" : "input"]: () => a(e, o)
    };
    c && (u.change = () => {
      e.value = e.value.trim();
    }), pn(e, u), s(() => {
      _n(e, n, f);
    });
  }
}, k = (e) => "_value" in e ? e._value : e.value, ot = (e, t) => {
  const n = t ? "_trueValue" : "_falseValue";
  return n in e ? e[n] : t;
}, mn = (e) => {
  e.target.composing = !0;
}, gn = (e) => {
  const t = e.target;
  t.composing && (t.composing = !1, En(t, "input"));
}, vn = (e, t) => {
  t(k(e));
}, yn = (e, t, n) => {
  const s = t();
  v(s) ? e.checked = _e(s, k(e)) > -1 : s !== n && (e.checked = $(s, ot(e, !0)));
}, bn = (e, t, n) => {
  const s = t(), i = e.checked;
  if (v(s)) {
    const r = k(e), o = _e(s, r), c = o !== -1;
    if (i && !c)
      n(s.concat(r));
    else if (!i && c) {
      const l = [...s];
      l.splice(o, 1), n(l);
    }
  } else
    n(ot(e, i));
}, _n = (e, t, n) => {
  if (e.composing)
    return;
  const s = e.value, i = t();
  document.activeElement === e && n(s) === i || s !== i && (e.value = i);
}, En = (e, t) => {
  const n = document.createEvent("HTMLEvents");
  n.initEvent(t, !0, !0), e.dispatchEvent(n);
}, fe = /* @__PURE__ */ Object.create(null), xn = [
  /\b(eval|Function|setTimeout|setInterval|XMLHttpRequest|fetch|WebSocket|Worker)\b/,
  /\b(window|document|globalThis|global|process|require|import|export)\b/,
  /\b(delete|void|typeof|instanceof)\b.*\(/
], ct = (e) => e == null || e === "" || e.length > 1e3 ? !1 : !xn.some((t) => t.test(e)), H = (e, t, n) => {
  if (ct(t))
    try {
      return new Function(`with (this) { return ${t} }`).call(e);
    } catch {
      return;
    }
}, Sn = (e, t, n) => {
  if (!ct(t))
    return;
  const s = fe[t] ?? (fe[t] = Rn(t));
  try {
    return s(e, n);
  } catch {
    delete fe[t];
    return;
  }
}, Rn = (e) => {
  try {
    return new Function("$data", "$el", `with($data){${e}}`);
  } catch {
    return () => {
    };
  }
}, wn = ({ el: e, ctx: t, exp: n, effect: s }) => {
  we(() => s(() => Sn(t.scope, n, e)));
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
}, Tn = {
  bind: me,
  on: st,
  show: an,
  text: it,
  html: un,
  model: dn,
  effect: wn,
  ref: Z
}, An = (e, t, n) => {
  const s = e.parentElement ?? e.parentNode;
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
  for (; (o = e.nextElementSibling) && (c = null, O(o, "v-else") === "" || (c = O(o, "v-else-if"))); )
    s.removeChild(o), r.push({ exp: c, el: o });
  const l = e.nextSibling;
  s.removeChild(e);
  let f, a = -1;
  const u = () => {
    f && (s.insertBefore(i, f.el), f.remove(), f = void 0);
  };
  return n.effect(() => {
    for (let h = 0; h < r.length; h++) {
      const { exp: p, el: x } = r[h];
      if (p == null || H(n.scope, p)) {
        h !== a && (u(), f = new G(x, n), f.insert(s, i), s.removeChild(i), a = h);
        return;
      }
    }
    a = -1, u();
  }), l;
}, On = P.FOR_ALIAS_RE, Ve = P.FOR_ITERATOR_RE, kn = P.STRIP_PARENS_RE, Dn = P.DESTRUCTURE_RE, In = (e, t, n, s, i, r, o, c) => {
  const l = new Array(e.length), f = /* @__PURE__ */ new Map();
  t.forEach((a) => {
    a.key != null && f.set(a.key, a);
  });
  for (let a = 0; a < e.length; a++) {
    const u = e[a], h = u.key;
    let p;
    h != null && (p = f.get(h), p && (Object.assign(p.ctx.scope, u.scope), f.delete(h))), p || (p = new G(o, u), p.key = h), l[a] = p;
  }
  f.forEach((a) => a.remove());
  for (let a = l.length - 1; a >= 0; a--) {
    const u = l[a], h = l[a + 1], p = h ? h.el : i;
    (u.isFragment ? u.end : u.el)?.nextSibling !== p && u.insert(r, p);
  }
  return l;
}, Cn = (e, t, n) => {
  const s = t.match(On);
  if (!s)
    return;
  const i = e.nextSibling, r = e.parentElement, o = new Text("");
  r.insertBefore(o, e), r.removeChild(e);
  const c = s[2].trim();
  let l = s[1].trim().replace(kn, "").trim(), f, a = !1, u, h, p = "key", x = e.getAttribute(p) || e.getAttribute(p = ":key") || e.getAttribute(p = "v-bind:key");
  x && (e.removeAttribute(p), p === "key" && (x = JSON.stringify(x)));
  let b;
  (b = l.match(Ve)) && (l = l.replace(Ve, "").trim(), u = b[1].trim(), b[2] && (h = b[2].trim())), (b = l.match(Dn)) && (f = b[1].split(",").map((m) => m.trim()), a = l[0] === "[");
  let N = !1, Q, X, ee;
  const ht = (m) => {
    const _ = /* @__PURE__ */ new Map(), g = [];
    if (v(m))
      for (let y = 0; y < m.length; y++)
        g.push(te(_, m[y], y));
    else if (typeof m == "number")
      for (let y = 0; y < m; y++)
        g.push(te(_, y + 1, y));
    else if (A(m)) {
      let y = 0;
      for (const w in m)
        g.push(te(_, m[w], y++, w));
    }
    return [g, _];
  }, te = (m, _, g, y) => {
    const w = {};
    f ? f.forEach(
      (Oe, dt) => w[Oe] = _[a ? dt : Oe]
    ) : w[l] = _, y ? (u && (w[u] = y), h && (w[h] = g)) : u && (w[u] = g);
    const ne = at(n, w), Ae = x ? H(ne.scope, x) : g;
    return m.set(Ae, g), ne.key = Ae, ne;
  }, pt = (m, _) => {
    const g = new G(e, m);
    return g.key = m.key, g.insert(r, _), g;
  };
  return n.effect(() => {
    const m = H(n.scope, c), _ = ee;
    [X, ee] = ht(m), N ? Q = In(X, Q, ee, _, o, r, e) : (Q = X.map((g) => pt(g, o)), N = !0);
  }), i;
}, Mn = P.DIR_RE, $n = P.MODIFIER_RE;
let ve = !1;
const lt = (e, t) => {
  const n = t, s = e.nodeType;
  if (s === 1) {
    const i = e;
    if (i.hasAttribute("v-pre"))
      return;
    O(i, "v-cloak");
    let r;
    if (r = O(i, "v-if"))
      return An(i, r, t);
    if (r = O(i, "v-for"))
      return Cn(i, r, t);
    if ((r = O(i, "v-scope")) != null) {
      const l = r ? H(t.scope, r) : {};
      l.$root = i, t = at(t, l), l.$template && Pn(i, l.$template);
    }
    const o = O(i, "v-once") != null;
    o && (ve = !0), (r = O(i, "ref")) && (t !== n && J(i, Z, r, n), J(i, Z, r, t)), Le(i, t);
    const c = [];
    for (const { name: l, value: f } of Array.from(i.attributes))
      Mn.test(l) && l !== "v-cloak" && (l === "v-model" ? c.unshift([l, f]) : l[0] === "@" || /^v-on\b/.test(l) ? c.push([l, f]) : Be(i, l, f, t));
    for (const [l, f] of c)
      Be(i, l, f, t);
    o && (ve = !1);
  } else if (s === 3) {
    const i = e.data;
    if (i.includes(t.delimiters[0])) {
      let r = [], o = 0, c;
      for (; c = t.delimitersRE.exec(i); ) {
        const l = i.slice(o, c.index);
        l && r.push(JSON.stringify(l)), r.push(`$s(${c[1]})`), o = c.index + c[0].length;
      }
      o < i.length && r.push(JSON.stringify(i.slice(o))), J(e, it, r.join("+"), t);
    }
  } else s === 11 && Le(e, t);
}, Le = (e, t) => {
  let n = e.firstChild;
  for (; n; )
    n = lt(n, t) ?? n.nextSibling;
}, Be = (e, t, n, s) => {
  let i, r, o;
  if (t = t.replace($n, (c, l) => ((o ??= {})[l] = !0, "")), t[0] === ":")
    i = me, r = t.slice(1);
  else if (t[0] === "@")
    i = st, r = t.slice(1);
  else {
    const c = t.indexOf(":"), l = c > 0 ? t.slice(2, c) : t.slice(2);
    i = Tn[l] ?? s.dirs[l], r = c > 0 ? t.slice(c + 1) : void 0;
  }
  i && (i === me && r === "ref" && (i = Z), J(e, i, n, s, r, o), e.removeAttribute(t));
}, J = (e, t, n, s, i, r) => {
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
}, Pn = (e, t) => {
  if (t[0] === "#") {
    const n = document.querySelector(t);
    n && e.appendChild(n.content.cloneNode(!0));
    return;
  }
  e.innerHTML = t.replace(/<[\/\s]*template\s*>/ig, "");
}, ft = (e) => {
  const t = {
    delimiters: ["{{", "}}"],
    delimitersRE: /\{\{([^]+?)\}\}/g,
    ...e,
    scope: e ? e.scope : W({}),
    dirs: e ? e.dirs : {},
    effects: [],
    blocks: [],
    cleanups: [],
    effect: (n) => {
      if (ve)
        return Pe(n), n;
      const s = Ct(n, {
        scheduler: () => Pe(s)
      });
      return t.effects.push(s), s;
    }
  };
  return t;
}, at = (e, t = {}) => {
  const n = e.scope, s = Object.create(n);
  Object.defineProperties(s, Object.getOwnPropertyDescriptors(t)), s.$refs = Object.create(n.$refs);
  const i = W(
    new Proxy(s, {
      set(r, o, c, l) {
        return l === i && !ae(r, o) ? Reflect.set(n, o, c) : Reflect.set(r, o, c, l);
      }
    })
  );
  return ut(i), {
    ...e,
    scope: i
  };
}, ut = (e) => {
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
    return this.start ?? this.template;
  }
  constructor(t, n, s = !1) {
    this.isFragment = t instanceof HTMLTemplateElement, s ? this.template = t : this.isFragment ? this.template = t.content.cloneNode(
      !0
    ) : this.template = t.cloneNode(!0), s ? this.ctx = n : (this.parentCtx = n, n.blocks.push(this), this.ctx = ft(n)), lt(this.template, this.ctx);
  }
  insert(t, n = null) {
    if (this.isFragment)
      if (this.start) {
        const s = [];
        let i = this.start;
        for (; i && (s.push(i), i !== this.end); )
          i = i.nextSibling;
        for (let r = s.length - 1; r >= 0; r--)
          t.insertBefore(s[r], n);
      } else
        this.start = new Text(""), this.end = new Text(""), t.insertBefore(this.end, n), t.insertBefore(this.start, this.end), t.insertBefore(this.template, this.end);
    else
      t.insertBefore(this.template, n);
  }
  remove() {
    if (this.parentCtx && vt(this.parentCtx.blocks, this), this.start) {
      const t = this.start.parentNode;
      let n = this.start, s;
      for (; n && (s = n.nextSibling, t.removeChild(n), n !== this.end); )
        n = s;
    } else
      this.template.parentNode.removeChild(this.template);
    this.teardown();
  }
  /**
   * Cleanup all effects and child blocks
   * Enhanced with better error handling and cleanup callbacks
   */
  teardown() {
    this.ctx.blocks.forEach((t) => {
      try {
        t.teardown();
      } catch {
      }
    }), this.ctx.effects.forEach((t) => {
      try {
        Mt(t);
      } catch {
      }
    }), this.ctx.cleanups.forEach((t) => {
      try {
        t();
      } catch {
      }
    }), this.ctx.blocks.length = 0, this.ctx.effects.length = 0, this.ctx.cleanups.length = 0;
  }
}
const Ke = (e) => e.replace(/[-.*+?^${}()|[\]\/\\]/g, "\\$&"), Nn = (e) => {
  const t = ft();
  if (e && (t.scope = W(e), ut(t.scope), e.$delimiters)) {
    const [s, i] = t.delimiters = e.$delimiters;
    t.delimitersRE = new RegExp(
      Ke(s) + "([^]+?)" + Ke(i),
      "g"
    );
  }
  t.scope.$s = rt, t.scope.$nextTick = we, t.scope.$refs = /* @__PURE__ */ Object.create(null);
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
      s = s ?? document.documentElement;
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
}, jn = () => {
  document.currentScript?.hasAttribute("init") && Nn().mount();
};
jn();
export {
  jn as autoMount,
  Nn as createApp,
  we as nextTick,
  W as reactive,
  Ct as watchEffect
};
