/**
* @vue/shared v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
// @__NO_SIDE_EFFECTS__
function ht(e) {
  const t = /* @__PURE__ */ Object.create(null);
  for (const n of e.split(",")) t[n] = 1;
  return (n) => n in t;
}
const dt = Object.assign, mt = (e, t) => {
  const n = e.indexOf(t);
  n > -1 && e.splice(n, 1);
}, vt = Object.prototype.hasOwnProperty, ue = (e, t) => vt.call(e, t), b = Array.isArray, se = (e) => be(e) === "[object Map]", Ae = (e) => be(e) === "[object Date]", M = (e) => typeof e == "string", P = (e) => typeof e == "symbol", A = (e) => e !== null && typeof e == "object", gt = Object.prototype.toString, be = (e) => gt.call(e), yt = (e) => be(e).slice(8, -1), xe = (e) => M(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, ze = (e) => {
  const t = /* @__PURE__ */ Object.create(null);
  return ((n) => t[n] || (t[n] = e(n)));
}, bt = /-\w/g, xt = ze(
  (e) => e.replace(bt, (t) => t.slice(1).toUpperCase())
), _t = /\B([A-Z])/g, We = ze(
  (e) => e.replace(_t, "-$1").toLowerCase()
), Fe = (e, t) => !Object.is(e, t), ke = (e) => {
  const t = M(e) ? Number(e) : NaN;
  return isNaN(t) ? e : t;
};
function qe(e) {
  if (b(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n], i = M(s) ? Rt(s) : qe(s);
      if (i)
        for (const r in i)
          t[r] = i[r];
    }
    return t;
  } else if (M(e) || A(e))
    return e;
}
const St = /;(?![^(]*\))/g, wt = /:([^]+)/, Et = /\/\*[^]*?\*\//g;
function Rt(e) {
  const t = {};
  return e.replace(Et, "").split(St).forEach((n) => {
    if (n) {
      const s = n.split(wt);
      s.length > 1 && (t[s[0].trim()] = s[1].trim());
    }
  }), t;
}
function Je(e) {
  let t = "";
  if (M(e))
    t = e;
  else if (b(e))
    for (let n = 0; n < e.length; n++) {
      const s = Je(e[n]);
      s && (t += s + " ");
    }
  else if (A(e))
    for (const n in e)
      e[n] && (t += n + " ");
  return t.trim();
}
function Tt(e, t) {
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
  if (n = P(e), s = P(t), n || s)
    return e === t;
  if (n = b(e), s = b(t), n || s)
    return n && s ? Tt(e, t) : !1;
  if (n = A(e), s = A(t), n || s) {
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
function ie(e, t) {
  return e.findIndex((n) => B(n, t));
}
/**
* @vue/reactivity v3.5.21
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
let h;
const re = /* @__PURE__ */ new WeakSet();
class De {
  constructor(t) {
    this.fn = t, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0;
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    this.flags & 64 && (this.flags &= -65, re.has(this) && (re.delete(this), this.trigger()));
  }
  /**
   * @internal
   */
  notify() {
    this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ot(this);
  }
  run() {
    if (!(this.flags & 1))
      return this.fn();
    this.flags |= 2, $e(this), Ze(this);
    const t = h, n = E;
    h = this, E = !0;
    try {
      return this.fn();
    } finally {
      Ge(this), h = t, E = n, this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let t = this.deps; t; t = t.nextDep)
        we(t);
      this.deps = this.depsTail = void 0, $e(this), this.onStop && this.onStop(), this.flags &= -2;
    }
  }
  trigger() {
    this.flags & 64 ? re.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
  }
  /**
   * @internal
   */
  runIfDirty() {
    ae(this) && this.run();
  }
  get dirty() {
    return ae(this);
  }
}
let Ye = 0, H, z;
function Ot(e, t = !1) {
  if (e.flags |= 8, t) {
    e.next = z, z = e;
    return;
  }
  e.next = H, H = e;
}
function _e() {
  Ye++;
}
function Se() {
  if (--Ye > 0)
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
function Ze(e) {
  for (let t = e.deps; t; t = t.nextDep)
    t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Ge(e) {
  let t, n = e.depsTail, s = n;
  for (; s; ) {
    const i = s.prevDep;
    s.version === -1 ? (s === n && (n = i), we(s), kt(s)) : t = s, s.dep.activeLink = s.prevActiveLink, s.prevActiveLink = void 0, s = i;
  }
  e.deps = t, e.depsTail = n;
}
function ae(e) {
  for (let t = e.deps; t; t = t.nextDep)
    if (t.dep.version !== t.version || t.dep.computed && (At(t.dep.computed) || t.dep.version !== t.version))
      return !0;
  return !!e._dirty;
}
function At(e) {
  if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === U) || (e.globalVersion = U, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !ae(e))))
    return;
  e.flags |= 2;
  const t = e.dep, n = h, s = E;
  h = e, E = !0;
  try {
    Ze(e);
    const i = e.fn(e._value);
    (t.version === 0 || Fe(i, e._value)) && (e.flags |= 128, e._value = i, t.version++);
  } catch (i) {
    throw t.version++, i;
  } finally {
    h = n, E = s, Ge(e), e.flags &= -3;
  }
}
function we(e, t = !1) {
  const { dep: n, prevSub: s, nextSub: i } = e;
  if (s && (s.nextSub = i, e.prevSub = void 0), i && (i.prevSub = s, e.nextSub = void 0), n.subs === e && (n.subs = s, !s && n.computed)) {
    n.computed.flags &= -5;
    for (let r = n.computed.deps; r; r = r.nextDep)
      we(r, !0);
  }
  !t && !--n.sc && n.map && n.map.delete(n.key);
}
function kt(e) {
  const { prevDep: t, nextDep: n } = e;
  t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
function Dt(e, t) {
  e.effect instanceof De && (e = e.effect.fn);
  const n = new De(e);
  t && dt(n, t);
  try {
    n.run();
  } catch (i) {
    throw n.stop(), i;
  }
  const s = n.run.bind(n);
  return s.effect = n, s;
}
function $t(e) {
  e.effect.stop();
}
let E = !0;
const Qe = [];
function Ct() {
  Qe.push(E), E = !1;
}
function It() {
  const e = Qe.pop();
  E = e === void 0 ? !0 : e;
}
function $e(e) {
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
let U = 0;
class jt {
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
    if (!h || !E || h === this.computed)
      return;
    let n = this.activeLink;
    if (n === void 0 || n.sub !== h)
      n = this.activeLink = new jt(h, this), h.deps ? (n.prevDep = h.depsTail, h.depsTail.nextDep = n, h.depsTail = n) : h.deps = h.depsTail = n, Ue(n);
    else if (n.version === -1 && (n.version = this.version, n.nextDep)) {
      const s = n.nextDep;
      s.prevDep = n.prevDep, n.prevDep && (n.prevDep.nextDep = s), n.prevDep = h.depsTail, n.nextDep = void 0, h.depsTail.nextDep = n, h.depsTail = n, h.deps === n && (h.deps = s);
    }
    return n;
  }
  trigger(t) {
    this.version++, U++, this.notify(t);
  }
  notify(t) {
    _e();
    try {
      for (let n = this.subs; n; n = n.prevSub)
        n.sub.notify() && n.sub.dep.notify();
    } finally {
      Se();
    }
  }
}
function Ue(e) {
  if (e.dep.sc++, e.sub.flags & 4) {
    const t = e.dep.computed;
    if (t && !e.dep.subs) {
      t.flags |= 20;
      for (let s = t.deps; s; s = s.nextDep)
        Ue(s);
    }
    const n = e.dep.subs;
    n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
  }
}
const pe = /* @__PURE__ */ new WeakMap(), G = Symbol(
  ""
), Ce = Symbol(
  ""
), F = Symbol(
  ""
);
function N(e, t, n) {
  if (E && h) {
    let s = pe.get(e);
    s || pe.set(e, s = /* @__PURE__ */ new Map());
    let i = s.get(n);
    i || (s.set(n, i = new Mt()), i.map = s, i.key = n), i.track();
  }
}
function oe(e, t, n, s, i, r) {
  const c = pe.get(e);
  if (!c) {
    U++;
    return;
  }
  const o = (l) => {
    l && l.trigger();
  };
  if (_e(), t === "clear")
    c.forEach(o);
  else {
    const l = b(e), f = l && xe(n);
    if (l && n === "length") {
      const u = Number(s);
      c.forEach((a, p) => {
        (p === "length" || p === F || !P(p) && p >= u) && o(a);
      });
    } else
      switch ((n !== void 0 || c.has(void 0)) && o(c.get(n)), f && o(c.get(F)), t) {
        case "add":
          l ? f && o(c.get("length")) : (o(c.get(G)), se(e) && o(c.get(Ce)));
          break;
        case "delete":
          l || (o(c.get(G)), se(e) && o(c.get(Ce)));
          break;
        case "set":
          se(e) && o(c.get(G));
          break;
      }
  }
  Se();
}
function L(e) {
  const t = T(e);
  return t === e ? t : (N(t, "iterate", F), Y(e) ? t : t.map(R));
}
function Ee(e) {
  return N(e = T(e), "iterate", F), e;
}
const Pt = {
  __proto__: null,
  [Symbol.iterator]() {
    return ce(this, Symbol.iterator, R);
  },
  concat(...e) {
    return L(this).concat(
      ...e.map((t) => b(t) ? L(t) : t)
    );
  },
  entries() {
    return ce(this, "entries", (e) => (e[1] = R(e[1]), e));
  },
  every(e, t) {
    return O(this, "every", e, t, void 0, arguments);
  },
  filter(e, t) {
    return O(this, "filter", e, t, (n) => n.map(R), arguments);
  },
  find(e, t) {
    return O(this, "find", e, t, R, arguments);
  },
  findIndex(e, t) {
    return O(this, "findIndex", e, t, void 0, arguments);
  },
  findLast(e, t) {
    return O(this, "findLast", e, t, R, arguments);
  },
  findLastIndex(e, t) {
    return O(this, "findLastIndex", e, t, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(e, t) {
    return O(this, "forEach", e, t, void 0, arguments);
  },
  includes(...e) {
    return le(this, "includes", e);
  },
  indexOf(...e) {
    return le(this, "indexOf", e);
  },
  join(e) {
    return L(this).join(e);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...e) {
    return le(this, "lastIndexOf", e);
  },
  map(e, t) {
    return O(this, "map", e, t, void 0, arguments);
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
    return O(this, "some", e, t, void 0, arguments);
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
    return ce(this, "values", R);
  }
};
function ce(e, t, n) {
  const s = Ee(e), i = s[t]();
  return s !== e && !Y(e) && (i._next = i.next, i.next = () => {
    const r = i._next();
    return r.value && (r.value = n(r.value)), r;
  }), i;
}
const Nt = Array.prototype;
function O(e, t, n, s, i, r) {
  const c = Ee(e), o = c !== e && !Y(e), l = c[t];
  if (l !== Nt[t]) {
    const a = l.apply(e, r);
    return o ? R(a) : a;
  }
  let f = n;
  c !== e && (o ? f = function(a, p) {
    return n.call(this, R(a), p, e);
  } : n.length > 2 && (f = function(a, p) {
    return n.call(this, a, p, e);
  }));
  const u = l.call(c, f, s);
  return o && i ? i(u) : u;
}
function Ie(e, t, n, s) {
  const i = Ee(e);
  let r = n;
  return i !== e && (Y(e) ? n.length > 3 && (r = function(c, o, l) {
    return n.call(this, c, o, l, e);
  }) : r = function(c, o, l) {
    return n.call(this, c, R(o), l, e);
  }), i[t](r, ...s);
}
function le(e, t, n) {
  const s = T(e);
  N(s, "iterate", F);
  const i = s[t](...n);
  return (i === -1 || i === !1) && Zt(n[0]) ? (n[0] = T(n[0]), s[t](...n)) : i;
}
function K(e, t, n = []) {
  Ct(), _e();
  const s = T(e)[t].apply(e, n);
  return Se(), It(), s;
}
const Vt = /* @__PURE__ */ ht("__proto__,__v_isRef,__isVue"), Xe = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(P)
);
function Lt(e) {
  P(e) || (e = String(e));
  const t = T(this);
  return N(t, "has", e), t.hasOwnProperty(e);
}
class et {
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
      return s === (i ? r ? Ft : nt : r ? Wt : tt).get(t) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(t) === Object.getPrototypeOf(s) ? t : void 0;
    const c = b(t);
    if (!i) {
      let l;
      if (c && (l = Pt[n]))
        return l;
      if (n === "hasOwnProperty")
        return Lt;
    }
    const o = Reflect.get(
      t,
      n,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      W(t) ? t : s
    );
    return (P(n) ? Xe.has(n) : Vt(n)) || (i || N(t, "get", n), r) ? o : W(o) ? c && xe(n) ? o : o.value : A(o) ? i ? Yt(o) : J(o) : o;
  }
}
class Bt extends et {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, i) {
    let r = t[n];
    if (!this._isShallow) {
      const l = he(r);
      if (!Y(s) && !he(s) && (r = T(r), s = T(s)), !b(t) && W(r) && !W(s))
        return l || (r.value = s), !0;
    }
    const c = b(t) && xe(n) ? Number(n) < t.length : ue(t, n), o = Reflect.set(
      t,
      n,
      s,
      W(t) ? t : i
    );
    return t === T(i) && (c ? Fe(s, r) && oe(t, "set", n, s) : oe(t, "add", n, s)), o;
  }
  deleteProperty(t, n) {
    const s = ue(t, n);
    t[n];
    const i = Reflect.deleteProperty(t, n);
    return i && s && oe(t, "delete", n, void 0), i;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!P(n) || !Xe.has(n)) && N(t, "has", n), s;
  }
  ownKeys(t) {
    return N(
      t,
      "iterate",
      b(t) ? "length" : G
    ), Reflect.ownKeys(t);
  }
}
class Kt extends et {
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
const Ht = /* @__PURE__ */ new Bt(), zt = /* @__PURE__ */ new Kt(), tt = /* @__PURE__ */ new WeakMap(), Wt = /* @__PURE__ */ new WeakMap(), nt = /* @__PURE__ */ new WeakMap(), Ft = /* @__PURE__ */ new WeakMap();
function qt(e) {
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
function Jt(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : qt(yt(e));
}
function J(e) {
  return he(e) ? e : st(
    e,
    !1,
    Ht,
    null,
    tt
  );
}
function Yt(e) {
  return st(
    e,
    !0,
    zt,
    null,
    nt
  );
}
function st(e, t, n, s, i) {
  if (!A(e) || e.__v_raw && !(t && e.__v_isReactive))
    return e;
  const r = Jt(e);
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
function he(e) {
  return !!(e && e.__v_isReadonly);
}
function Y(e) {
  return !!(e && e.__v_isShallow);
}
function Zt(e) {
  return e ? !!e.__v_raw : !1;
}
function T(e) {
  const t = e && e.__v_raw;
  return t ? T(t) : e;
}
const R = (e) => A(e) ? J(e) : e;
function W(e) {
  return e ? e.__v_isRef === !0 : !1;
}
let de = !1;
const X = [], Gt = Promise.resolve(), ee = (e) => Gt.then(e), je = (e) => {
  X.includes(e) || X.push(e), de || (de = !0, ee(Qt));
}, Qt = () => {
  for (const e of X)
    e();
  X.length = 0, de = !1;
}, Ut = /^(spellcheck|draggable|form|list|type)$/, me = ({
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
      i?.camel && (s = xt(s)), fe(e, s, c, r);
    else {
      for (const o in c)
        fe(e, o, c[o], r && r[o]);
      for (const o in r)
        (!c || !(o in c)) && fe(e, o, null);
    }
    r = c;
  });
}, fe = (e, t, n, s) => {
  if (t === "class")
    e.setAttribute(
      "class",
      Je(e._class ? [e._class, n] : n) || ""
    );
  else if (t === "style") {
    n = qe(n);
    const { style: i } = e;
    if (!n)
      e.removeAttribute("style");
    else if (M(n))
      n !== s && (i.cssText = n);
    else {
      for (const r in n)
        ve(i, r, n[r]);
      if (s && !M(s))
        for (const r in s)
          n[r] == null && ve(i, r, "");
    }
  } else !(e instanceof SVGElement) && t in e && !Ut.test(t) ? (e[t] = n, t === "value" && (e._value = n)) : t === "true-value" ? e._trueValue = n : t === "false-value" ? e._falseValue = n : n != null ? e.setAttribute(t, n) : e.removeAttribute(t);
}, Me = /\s*!important$/, ve = (e, t, n) => {
  b(n) ? n.forEach((s) => ve(e, t, s)) : t.startsWith("--") ? e.setProperty(t, n) : Me.test(n) ? e.setProperty(
    We(t),
    n.replace(Me, ""),
    "important"
  ) : e[t] = n;
}, C = (e, t) => {
  const n = e.getAttribute(t);
  return n != null && e.removeAttribute(t), n;
}, $ = (e, t, n, s) => {
  e.addEventListener(t, n, s);
}, Xt = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/, en = ["ctrl", "shift", "alt", "meta"], tn = {
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
  exact: (e, t) => en.some((n) => e[`${n}Key`] && !t[n])
}, it = ({ el: e, get: t, exp: n, arg: s, modifiers: i }) => {
  if (!s)
    return;
  let r = Xt.test(n) ? t(`(e => ${n}(e))`) : t(`($event => { ${n} })`);
  if (s === "vue:mounted") {
    ee(r);
    return;
  } else if (s === "vue:unmounted")
    return () => r();
  if (i) {
    s === "click" && (i.right && (s = "contextmenu"), i.middle && (s = "mouseup"));
    const c = r;
    r = (o) => {
      if (!("key" in o && !(We(o.key) in i))) {
        for (const l in i) {
          const f = tn[l];
          if (f && f(o, i))
            return;
        }
        return c(o);
      }
    };
  }
  $(e, s, r, i);
}, nn = ({ el: e, get: t, effect: n }) => {
  const s = e.style.display;
  n(() => {
    e.style.display = t() ? s : "none";
  });
}, rt = ({ el: e, get: t, effect: n }) => {
  n(() => {
    e.textContent = ot(t());
  });
}, ot = (e) => e == null ? "" : A(e) ? (() => {
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return "[Object]";
  }
})() : String(e), sn = ({ el: e, get: t, effect: n }) => {
  n(() => {
    e.innerHTML = t();
  });
}, rn = ({ el: e, exp: t, get: n, effect: s, modifiers: i }) => {
  const r = e.type, c = n(`(val) => { ${t} = val }`), { trim: o, number: l = r === "number" || r === "range" } = i || {};
  if (e.tagName === "SELECT") {
    const f = e;
    $(e, "change", () => {
      const u = Array.prototype.filter.call(f.options, (a) => a.selected).map(
        (a) => l ? ke(D(a)) : D(a)
      );
      c(f.multiple ? u : u[0]);
    }), s(() => {
      const u = n(), a = f.multiple;
      for (let p = 0, x = f.options.length; p < x; p++) {
        const y = f.options[p], _ = D(y);
        if (a)
          b(u) ? y.selected = ie(u, _) > -1 : y.selected = u.has(_);
        else if (B(D(y), u)) {
          f.selectedIndex !== p && (f.selectedIndex = p);
          return;
        }
      }
      !a && f.selectedIndex !== -1 && (f.selectedIndex = -1);
    });
  } else if (r === "checkbox") {
    $(e, "change", () => {
      const u = n(), a = e.checked;
      if (b(u)) {
        const p = D(e), x = ie(u, p), y = x !== -1;
        if (a && !y)
          c(u.concat(p));
        else if (!a && y) {
          const _ = [...u];
          _.splice(x, 1), c(_);
        }
      } else
        c(Pe(e, a));
    });
    let f;
    s(() => {
      const u = n();
      b(u) ? e.checked = ie(u, D(e)) > -1 : u !== f && (e.checked = B(
        u,
        Pe(e, !0)
      )), f = u;
    });
  } else if (r === "radio") {
    $(e, "change", () => {
      c(D(e));
    });
    let f;
    s(() => {
      const u = n();
      u !== f && (e.checked = B(u, D(e)));
    });
  } else {
    const f = (u) => o ? u.trim() : l ? ke(u) : u;
    $(e, "compositionstart", on), $(e, "compositionend", cn), $(e, i?.lazy ? "change" : "input", () => {
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
}, D = (e) => "_value" in e ? e._value : e.value, Pe = (e, t) => {
  const n = t ? "_trueValue" : "_falseValue";
  return n in e ? e[n] : t;
}, on = (e) => {
  e.target.composing = !0;
}, cn = (e) => {
  const t = e.target;
  t.composing && (t.composing = !1, ln(t, "input"));
}, ln = (e, t) => {
  const n = document.createEvent("HTMLEvents");
  n.initEvent(t, !0, !0), e.dispatchEvent(n);
}, Ne = /* @__PURE__ */ Object.create(null), q = (e, t, n) => ct(e, `return(${t})`, n), ct = (e, t, n) => {
  const s = Ne[t] || (Ne[t] = fn(t));
  try {
    return s(e, n);
  } catch (i) {
    console.error(i);
  }
}, fn = (e) => {
  try {
    return new Function("$data", "$el", `with($data){${e}}`);
  } catch (t) {
    return console.error(`${t.message} in expression: ${e}`), () => {
    };
  }
}, un = ({ el: e, ctx: t, exp: n, effect: s }) => {
  ee(() => s(() => ct(t.scope, n, e)));
}, an = {
  bind: me,
  on: it,
  show: nn,
  text: rt,
  html: sn,
  model: rn,
  effect: un
}, pn = (e, t, n) => {
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
  for (; (c = e.nextElementSibling) && (o = null, C(c, "v-else") === "" || (o = C(c, "v-else-if"))); )
    s.removeChild(c), r.push({ exp: o, el: c });
  const l = e.nextSibling;
  s.removeChild(e);
  let f, u = -1;
  const a = () => {
    f && (s.insertBefore(i, f.el), f.remove(), f = void 0);
  };
  return n.effect(() => {
    for (let p = 0; p < r.length; p++) {
      const { exp: x, el: y } = r[p];
      if (!x || q(n.scope, x)) {
        p !== u && (a(), f = new Re(y, n), f.insert(s, i), s.removeChild(i), u = p);
        return;
      }
    }
    u = -1, a();
  }), l;
}, hn = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/, Ve = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/, dn = /^\(|\)$/g, mn = /^[{[]\s*((?:[\w_$]+\s*,?\s*)+)[\]}]$/, vn = (e, t, n) => {
  const s = t.match(hn);
  if (!s)
    return;
  const i = e.nextSibling, r = e.parentElement, c = new Text("");
  r.insertBefore(c, e), r.removeChild(e);
  const o = s[2].trim();
  let l = s[1].trim().replace(dn, "").trim(), f, u = !1, a, p, x = "key", y = e.getAttribute(x) || e.getAttribute(x = ":key") || e.getAttribute(x = "v-bind:key");
  y && (e.removeAttribute(x), x === "key" && (y = JSON.stringify(y)));
  let _;
  (_ = l.match(Ve)) && (l = l.replace(Ve, "").trim(), a = _[1].trim(), _[2] && (p = _[2].trim())), (_ = l.match(mn)) && (f = _[1].split(",").map((v) => v.trim()), u = l[0] === "[");
  let Te = !1, I, Z, te;
  const pt = (v) => {
    const S = /* @__PURE__ */ new Map(), d = [];
    if (b(v))
      for (let m = 0; m < v.length; m++)
        d.push(ne(S, v[m], m));
    else if (typeof v == "number")
      for (let m = 0; m < v; m++)
        d.push(ne(S, m + 1, m));
    else if (A(v)) {
      let m = 0;
      for (const g in v)
        d.push(ne(S, v[g], m++, g));
    }
    return [d, S];
  }, ne = (v, S, d, m) => {
    const g = {};
    f ? f.forEach(
      (j, k) => g[j] = S[u ? k : j]
    ) : g[l] = S, m ? (a && (g[a] = m), p && (g[p] = d)) : a && (g[a] = d);
    const V = ut(n, g), w = y ? q(V.scope, y) : d;
    return v.set(w, d), V.key = w, V;
  }, Oe = (v, S) => {
    const d = new Re(e, v);
    return d.key = v.key, d.insert(r, S), d;
  };
  return n.effect(() => {
    const v = q(n.scope, o), S = te;
    if ([Z, te] = pt(v), !Te)
      I = Z.map((d) => Oe(d, c)), Te = !0;
    else {
      for (let w = 0; w < I.length; w++)
        te.has(I[w].key) || I[w].remove();
      const d = [];
      let m = Z.length, g, V;
      for (; m--; ) {
        const w = Z[m], j = S.get(w.key);
        let k;
        j == null ? k = Oe(
          w,
          g ? g.el : c
        ) : (k = I[j], Object.assign(k.ctx.scope, w.scope), j !== m && (I[j + 1] !== g || // If the next has moved, it must move too
        V === g) && (V = k, k.insert(r, g ? g.el : c))), d.unshift(g = k);
      }
      I = d;
    }
  }), i;
}, ge = ({
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
}, gn = /^(?:v-|:|@)/, yn = /\.([\w-]+)/g;
let ye = !1;
const lt = (e, t) => {
  const n = t, s = e.nodeType;
  if (s === 1) {
    const i = e;
    if (i.hasAttribute("v-pre"))
      return;
    C(i, "v-cloak");
    let r;
    if (r = C(i, "v-if"))
      return pn(i, r, t);
    if (r = C(i, "v-for"))
      return vn(i, r, t);
    if ((r = C(i, "v-scope")) || r === "") {
      const l = r ? q(t.scope, r, i) : {};
      l.$root = i, t = ut(t, l), l.$template && bn(i, l.$template);
    }
    const c = C(i, "v-once") != null;
    c && (ye = !0), (r = C(i, "ref")) && (t !== n && Q(i, ge, `"${r}"`, n), Q(i, ge, `"${r}"`, t)), Le(i, t);
    const o = [];
    for (const { name: l, value: f } of [...i.attributes])
      gn.test(l) && l !== "v-cloak" && (l === "v-model" ? o.unshift([l, f]) : l[0] === "@" || /^v-on\b/.test(l) ? o.push([l, f]) : Be(i, l, f, t));
    for (const [l, f] of o)
      Be(i, l, f, t);
    c && (ye = !1);
  } else if (s === 3) {
    const i = e.data;
    if (i.includes(t.delimiters[0])) {
      let r = [], c = 0, o;
      for (; o = t.delimitersRE.exec(i); ) {
        const l = i.slice(c, o.index);
        l && r.push(JSON.stringify(l)), r.push(`$s(${o[1]})`), c = o.index + o[0].length;
      }
      c < i.length && r.push(JSON.stringify(i.slice(c))), Q(e, rt, r.join("+"), t);
    }
  } else s === 11 && Le(e, t);
}, Le = (e, t) => {
  let n = e.firstChild;
  for (; n; )
    n = lt(n, t) || n.nextSibling;
}, Be = (e, t, n, s) => {
  let i, r, c;
  if (t = t.replace(yn, (o, l) => ((c || (c = {}))[l] = !0, "")), t[0] === ":")
    i = me, r = t.slice(1);
  else if (t[0] === "@")
    i = it, r = t.slice(1);
  else {
    const o = t.indexOf(":"), l = o > 0 ? t.slice(2, o) : t.slice(2);
    i = an[l] || s.dirs[l], r = o > 0 ? t.slice(o + 1) : void 0;
  }
  i && (i === me && r === "ref" && (i = ge), Q(e, i, n, s, r, c), e.removeAttribute(t));
}, Q = (e, t, n, s, i, r) => {
  const o = t({
    el: e,
    get: (l = n) => q(s.scope, l, e),
    effect: s.effect,
    ctx: s,
    exp: n,
    arg: i,
    modifiers: r
  });
  o && s.cleanups.push(o);
}, bn = (e, t) => {
  if (t[0] === "#") {
    const n = document.querySelector(t);
    e.appendChild(n.content.cloneNode(!0));
    return;
  }
  e.innerHTML = t.replace(/<[\/\s]*template\s*>/ig, "");
}, ft = (e) => {
  const t = {
    delimiters: ["{{", "}}"],
    delimitersRE: /\{\{([^]+?)\}\}/g,
    ...e,
    scope: e ? e.scope : J({}),
    dirs: e ? e.dirs : {},
    effects: [],
    blocks: [],
    cleanups: [],
    effect: (n) => {
      if (ye)
        return je(n), n;
      const s = Dt(n, {
        scheduler: () => je(s)
      });
      return t.effects.push(s), s;
    }
  };
  return t;
}, ut = (e, t = {}) => {
  const n = e.scope, s = Object.create(n);
  Object.defineProperties(s, Object.getOwnPropertyDescriptors(t)), s.$refs = Object.create(n.$refs);
  const i = J(
    new Proxy(s, {
      set(r, c, o, l) {
        return l === i && !ue(r, c) ? Reflect.set(n, c, o) : Reflect.set(r, c, o, l);
      }
    })
  );
  return at(i), {
    ...e,
    scope: i
  };
}, at = (e) => {
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
    ) : this.template = t.cloneNode(!0), s ? this.ctx = n : (this.parentCtx = n, n.blocks.push(this), this.ctx = ft(n)), lt(this.template, this.ctx);
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
    }), this.ctx.effects.forEach($t), this.ctx.cleanups.forEach((t) => t());
  }
}
const Ke = (e) => e.replace(/[-.*+?^${}()|[\]\/\\]/g, "\\$&"), xn = (e) => {
  const t = ft();
  if (e && (t.scope = J(e), at(t.scope), e.$delimiters)) {
    const [s, i] = t.delimiters = e.$delimiters;
    t.delimitersRE = new RegExp(
      Ke(s) + "([^]+?)" + Ke(i),
      "g"
    );
  }
  t.scope.$s = ot, t.scope.$nextTick = ee, t.scope.$refs = /* @__PURE__ */ Object.create(null);
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
    }
  };
}, He = document.currentScript;
He && He.hasAttribute("init") && xn().mount();
export {
  xn as createApp,
  ee as nextTick,
  J as reactive,
  Dt as watchEffect
};
