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
  var dom = document.createElement(name);
  if (props)
    for (var i in props) dom.setAttribute(i, props[i]);
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
  for (var i in props) sel.setAttribute(i, props[i]);
  return sel;
}

diceCore.clas = function(sel, oldclass, newclass) {
  var oc = oldclass ? oldclass.split(/\s+/) : [],
    nc = newclass ? newclass.split(/\s+/) : [],
    classes = (sel.getAttribute('class') || '').split(/\s+/);
  if (!classes[0]) classes = [];
  for (var i in oc) {
    var ind = classes.indexOf(oc[i]);
    if (ind >= 0) classes.splice(ind, 1);
  }
  for (var i in nc) {
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
      for (var i = sel.length - 1; i >= 0; --i)
        sel[i].parentNode.removeChild(sel[i]);
  }
}

diceCore.bind = function(sel, eventname, func, bubble) {
  if (!sel) return;
  if (eventname.constructor === Array) {
    for (var i in eventname)
      sel.addEventListener(eventname[i], func, bubble ? bubble : false);
  } else
    sel.addEventListener(eventname, func, bubble ? bubble : false);
}

diceCore.unbind = function(sel, eventname, func, bubble) {
  if (eventname.constructor === Array) {
    for (var i in eventname)
      sel.removeEventListener(eventname[i], func, bubble ? bubble : false);
  } else
    sel.removeEventListener(eventname, func, bubble ? bubble : false);
}

diceCore.one = function(sel, eventname, func, bubble) {
  var one_func = function(e) {
    func.call(this, e);
    diceCore.unbind(sel, eventname, one_func, bubble);
  };
  diceCore.bind(sel, eventname, one_func, bubble);
}

diceCore.raise_event = function(sel, eventname, bubble, cancelable) {
  var evt = document.createEvent('UIEvents');
  evt.initEvent(eventname, bubble == undefined ? true : bubble,
    cancelable == undefined ? true : cancelable);
  sel.dispatchEvent(evt);
}

diceCore.raise = function(sel, eventname, params, bubble, cancelable) {
  var ev = document.createEvent("CustomEvent");
  ev.initCustomEvent(eventname, bubble, cancelable, params);
  sel.dispatchEvent(ev);
}

if (!document.getElementsByClassName) {
  diceCore.get_elements_by_class = function(classes, node) {
    node = node || document,
      list = node.getElementsByTagName('*'),
      cl = classes.split(/\s+/),
      result = [];

    for (var i = list.length - 1; i >= 0; --i) {
      for (var j = cl.length - 1; j >= 0; --j) {
        var clas = list[i].getAttribute('class');
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
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

diceCore.get_url_params = function() {
  var params = window.location.search.substring(1).split("&");
  var res = {};
  for (var i in params) {
    var keyvalue = params[i].split("=");
    res[keyvalue[0]] = decodeURI(keyvalue[1]);
  }
  return res;
}

diceCore.get_mouse_coords = function(ev) {
  var touches = ev.changedTouches;
  if (touches) return { x: touches[0].clientX, y: touches[0].clientY };
  return { x: ev.clientX, y: ev.clientY };
}

diceCore.deferred = function() {
  var solved = false,
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
          var deferred = diceCore.deferred(),
            promise = deferred.promise();
          callbacks.push(function() {
            var res = callback.apply(this, arguments);
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
  var deferred = diceCore.deferred();
  var count = promises.length,
    ind = 0;
  if (count == 0) deferred.resolve();
  for (var i = 0; i < count; ++i) {
    promises[i].done(function() {
      if (++ind == count) deferred.resolve();
    });
  }
  return deferred.promise();
}