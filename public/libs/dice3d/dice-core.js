/* eslint-disable no-undef */
"use strict";

window.diceCore = {};
window.$diceCore = window.diceCore;

diceCore.copyto = function(obj, res) {
  if (obj == null || typeof obj !== 'object') return obj;
  let i
  if (obj instanceof Array) {
    for (i = obj.length - 1; i >= 0; --i)
      res[i] = $diceCore.copy(obj[i]);
  } else {
    for (i in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(i))
        res[i] = $diceCore.copy(obj[i]);
    }
  }
  return res;
}

diceCore.copy = function(obj) {
  if (!obj) return obj;
  return diceCore.copyto(obj, new obj.constructor());
}

diceCore.element = function(name, props, place, content) {
  let dom = document.createElement(name);
  if (props)
    for (let i in props) dom.setAttribute(i, props[i]);
  if (place) place.appendChild(dom);
  if (content !== undefined) $diceCore.inner(content, dom);
  return dom;
}

diceCore.inner = function(obj, sel) {
  sel.appendChild(obj.nodeName != undefined ? obj : document.createTextNode(obj));
  return sel;
}

diceCore.id = function(id) {
  return document.getElementById(id);
}

diceCore.set = function(sel, props) {
  for (let i in props) sel.setAttribute(i, props[i]);
  return sel;
}

diceCore.clas = function(sel, oldclass, newclass) {
  let oc = oldclass ? oldclass.split(/\s+/) : [],
    nc = newclass ? newclass.split(/\s+/) : [],
    classes = (sel.getAttribute('class') || '').split(/\s+/);
  if (!classes[0]) classes = [];
  for (let i in oc) {
    let ind = classes.indexOf(oc[i]);
    if (ind >= 0) classes.splice(ind, 1);
  }
  for (let i in nc) {
    if (nc[i] && classes.indexOf(nc[i]) < 0) classes.push(nc[i]);
  }
  sel.setAttribute('class', classes.join(' '));
}

diceCore.empty = function(sel) {
  if (sel.childNodes)
    while (sel.childNodes.length)
      sel.removeChild(sel.firstChild);
}

diceCore.remove = function(sel) {
  if (sel) {
    if (sel.parentNode) sel.parentNode.removeChild(sel);
    else
      for (let i = sel.length - 1; i >= 0; --i)
        sel[i].parentNode.removeChild(sel[i]);
  }
}

diceCore.bind = function(sel, eventname, func, bubble) {
  if (!sel) return;
  if (eventname.constructor === Array) {
    for (let i in eventname)
      sel.addEventListener(eventname[i], func, bubble ? bubble : false);
  } else
    sel.addEventListener(eventname, func, bubble ? bubble : false);
}

diceCore.unbind = function(sel, eventname, func, bubble) {
  if (eventname.constructor === Array) {
    for (let i in eventname)
      sel.removeEventListener(eventname[i], func, bubble ? bubble : false);
  } else
    sel.removeEventListener(eventname, func, bubble ? bubble : false);
}

diceCore.one = function(sel, eventname, func, bubble) {
  let one_func = function(e) {
    func.call(this, e);
    diceCore.unbind(sel, eventname, one_func, bubble);
  };
  diceCore.bind(sel, eventname, one_func, bubble);
}

diceCore.raise_event = function(sel, eventname, bubble, cancelable) {
  let evt = document.createEvent('UIEvents');
  evt.initEvent(eventname, bubble == undefined ? true : bubble,
    cancelable == undefined ? true : cancelable);
  sel.dispatchEvent(evt);
}

diceCore.raise = function(sel, eventname, params, bubble, cancelable) {
  let ev = document.createEvent("CustomEvent");
  ev.initCustomEvent(eventname, bubble, cancelable, params);
  sel.dispatchEvent(ev);
}

if (!document.getElementsByClassName) {
  diceCore.get_elements_by_class = function(classes, node) {
    node = node || document,
      list = node.getElementsByTagName('*'),
      cl = classes.split(/\s+/),
      result = [];

    for (let i = list.length - 1; i >= 0; --i) {
      for (let j = cl.length - 1; j >= 0; --j) {
        let clas = list[i].getAttribute('class');
        if (clas && clas.search('\\b' + cl[j] + '\\b') != -1) {
          result.push(list[i]);
          break;
        }
      }
    }
    return result;
  }
} else {
  diceCore.get_elements_by_class = function(classes, node) {
    return (node || document).getElementsByClassName(classes);
  }
}

diceCore.uuid = function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    let r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

diceCore.get_url_params = function() {
  let params = window.location.search.substring(1).split("&");
  let res = {};
  for (let i in params) {
    let keyvalue = params[i].split("=");
    res[keyvalue[0]] = decodeURI(keyvalue[1]);
  }
  return res;
}

diceCore.get_mouse_coords = function(ev) {
  let touches = ev.changedTouches;
  if (touches) return { x: touches[0].clientX, y: touches[0].clientY };
  return { x: ev.clientX, y: ev.clientY };
}

diceCore.deferred = function() {
  let solved = false,
    callbacks = [],
    args = [];

  function solve() {
    while (callbacks.length) {
      callbacks.shift().apply(this, args);
    }
  }
  return {
    promise: function() {
      return {
        then: function(callback) {
          let deferred = diceCore.deferred(),
            promise = deferred.promise();
          callbacks.push(function() {
            let res = callback.apply(this, arguments);
            if (res && 'done' in res) res.done(deferred.resolve);
            else deferred.resolve.apply(this, arguments);
          });
          return promise;
        },
        done: function(callback) {
          callbacks.push(callback);
          if (solved) solve();
          return this;
        },
        cancel: function() {
          callbacks = [];
        }
      };
    },
    resolve: function() {
      solved = true;
      args = Array.prototype.slice.call(arguments, 0);
      solve();
    }
  };
}

diceCore.when = function(promises) {
  let deferred = diceCore.deferred();
  let count = promises.length,
    ind = 0;
  if (count == 0) deferred.resolve();
  for (let i = 0; i < count; ++i) {
    promises[i].done(function() {
      if (++ind == count) deferred.resolve();
    });
  }
  return deferred.promise();
}