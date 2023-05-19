// ----------------------------------------------------------------
// Vue 3 Reactivity
// Marc Backes (@themarcba)
// ----------------------------------------------------------------

let activeEffect: (() => void) | null = null;
const targetMap = new WeakMap<object, Map<any, Set<() => void>>>();

// Register an effect
function track(target: object, key: any) {
  // Get depsMap from targetMap
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    // new depsMap if it doesn't exist yet
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  // Get dep from depsMap
  let dep = depsMap.get(key);
  if (!dep) {
    // new dep if it doesn't exist yet
    dep = new Set();
    depsMap.set(key, dep);
  }

  // Add effect
  if (activeEffect) dep.add(activeEffect);
}

// Execute all registered effects for the target/key combination
function trigger(target: object, key: any) {
  // Get depsMap from targetMap
  const depsMap = targetMap.get(target);
  // If there is no depsMap, no need to resume
  if (!depsMap) return;

  // Get dep from depsMap
  const dep = depsMap.get(key);
  // If there is no dep, no need to resume
  if (!dep) return;

  // Execute all effects
  dep.forEach((effect) => effect());
}

// Makes an object "reactive". Changes will be triggered once the property is tracked
function reactive<T extends object>(target: T): T {
  const handler: ProxyHandler<T> = {
    // Intercept getter
    get(target, key, receiver) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      return result;
    },
    // Intercept setter
    set(target, key, value, receiver) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key); // trigger a change in the target
      return result;
    },
  };

  return new Proxy(target, handler);
}

// Watcher
function effect(fn: () => void) {
  activeEffect = fn;
  // Only execute when there is an activeEffect
  if (activeEffect) activeEffect();
  activeEffect = null;

    // Return the function for easier cleanup
    return fn;


}

// function stop(effect: () => void) {
//     for (const [target, depsMap] of targetMap) {
//       for (const depSet of depsMap.values()) {
//         depSet.delete(effect);
//       }
//     }
// }  

export { reactive, effect };