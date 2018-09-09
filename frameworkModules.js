/**
 * @license AngularJS v1.4.8
 * (c) 2010-2015 Google, Inc. http://angularjs.org
 * License: MIT
 */

/**
 * State-based routing for AngularJS
 * @version v0.2.7
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

/*!
 * Bootstrap v3.3.7 (http://getbootstrap.com)
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under the MIT license
 */

/*! Sortable 1.7.0 - MIT | git://github.com/rubaxa/Sortable.git */

(function(root) {
  define("angular/angular-animate", [], function() {
    return function() {
      (function(window, angular, undefined) {
        "use strict";
        function assertArg(arg, name, reason) {
          if (!arg)
            throw ngMinErr(
              "areq",
              "Argument '{0}' is {1}",
              name || "?",
              reason || "required"
            );
          return arg;
        }
        function mergeClasses(a, b) {
          if (!a && !b) return "";
          if (!a) return b;
          if (!b) return a;
          isArray(a) && (a = a.join(" "));
          isArray(b) && (b = b.join(" "));
          return a + " " + b;
        }
        function packageStyles(options) {
          var styles = {};
          if (options && (options.to || options.from)) {
            styles.to = options.to;
            styles.from = options.from;
          }
          return styles;
        }
        function pendClasses(classes, fix, isPrefix) {
          var className = "";
          classes = isArray(classes)
            ? classes
            : classes && isString(classes) && classes.length
              ? classes.split(/\s+/)
              : [];
          forEach(classes, function(klass, i) {
            if (klass && klass.length > 0) {
              className += i > 0 ? " " : "";
              className += isPrefix ? fix + klass : klass + fix;
            }
          });
          return className;
        }
        function removeFromArray(arr, val) {
          var index = arr.indexOf(val);
          val >= 0 && arr.splice(index, 1);
        }
        function stripCommentsFromElement(element) {
          if (element instanceof jqLite)
            switch (element.length) {
              case 0:
                return [];
              case 1:
                if (element[0].nodeType === ELEMENT_NODE) return element;
                break;
              default:
                return jqLite(extractElementNode(element));
            }
          if (element.nodeType === ELEMENT_NODE) return jqLite(element);
        }
        function extractElementNode(element) {
          var i, elm;
          if (!element[0]) return element;
          for (i = 0; i < element.length; i++) {
            elm = element[i];
            if (elm.nodeType == ELEMENT_NODE) return elm;
          }
        }
        function $$addClass($$jqLite, element, className) {
          forEach(element, function(elm) {
            $$jqLite.addClass(elm, className);
          });
        }
        function $$removeClass($$jqLite, element, className) {
          forEach(element, function(elm) {
            $$jqLite.removeClass(elm, className);
          });
        }
        function applyAnimationClassesFactory($$jqLite) {
          return function(element, options) {
            if (options.addClass) {
              $$addClass($$jqLite, element, options.addClass);
              options.addClass = null;
            }
            if (options.removeClass) {
              $$removeClass($$jqLite, element, options.removeClass);
              options.removeClass = null;
            }
          };
        }
        function prepareAnimationOptions(options) {
          options = options || {};
          if (!options.$$prepared) {
            var domOperation = options.domOperation || noop;
            options.domOperation = function() {
              options.$$domOperationFired = !0;
              domOperation();
              domOperation = noop;
            };
            options.$$prepared = !0;
          }
          return options;
        }
        function applyAnimationStyles(element, options) {
          applyAnimationFromStyles(element, options);
          applyAnimationToStyles(element, options);
        }
        function applyAnimationFromStyles(element, options) {
          if (options.from) {
            element.css(options.from);
            options.from = null;
          }
        }
        function applyAnimationToStyles(element, options) {
          if (options.to) {
            element.css(options.to);
            options.to = null;
          }
        }
        function mergeAnimationOptions(element, target, newOptions) {
          var realDomOperation,
            toAdd = (target.addClass || "") + " " + (newOptions.addClass || ""),
            toRemove =
              (target.removeClass || "") + " " + (newOptions.removeClass || ""),
            classes = resolveElementClasses(
              element.attr("class"),
              toAdd,
              toRemove
            );
          if (newOptions.preparationClasses) {
            target.preparationClasses = concatWithSpace(
              newOptions.preparationClasses,
              target.preparationClasses
            );
            delete newOptions.preparationClasses;
          }
          realDomOperation =
            target.domOperation !== noop ? target.domOperation : null;
          extend(target, newOptions);
          realDomOperation && (target.domOperation = realDomOperation);
          classes.addClass
            ? (target.addClass = classes.addClass)
            : (target.addClass = null);
          classes.removeClass
            ? (target.removeClass = classes.removeClass)
            : (target.removeClass = null);
          return target;
        }
        function resolveElementClasses(existing, toAdd, toRemove) {
          function splitClassesToLookup(classes) {
            isString(classes) && (classes = classes.split(" "));
            var obj = {};
            forEach(classes, function(klass) {
              klass.length && (obj[klass] = !0);
            });
            return obj;
          }
          var classes,
            ADD_CLASS = 1,
            REMOVE_CLASS = -1,
            flags = {};
          existing = splitClassesToLookup(existing);
          toAdd = splitClassesToLookup(toAdd);
          forEach(toAdd, function(value, key) {
            flags[key] = ADD_CLASS;
          });
          toRemove = splitClassesToLookup(toRemove);
          forEach(toRemove, function(value, key) {
            flags[key] = flags[key] === ADD_CLASS ? null : REMOVE_CLASS;
          });
          classes = { addClass: "", removeClass: "" };
          forEach(flags, function(val, klass) {
            var prop, allow;
            if (val === ADD_CLASS) {
              prop = "addClass";
              allow = !existing[klass];
            } else if (val === REMOVE_CLASS) {
              prop = "removeClass";
              allow = existing[klass];
            }
            if (allow) {
              classes[prop].length && (classes[prop] += " ");
              classes[prop] += klass;
            }
          });
          return classes;
        }
        function getDomNode(element) {
          return element instanceof angular.element ? element[0] : element;
        }
        function applyGeneratedPreparationClasses(element, event, options) {
          var classes = "";
          event && (classes = pendClasses(event, EVENT_CLASS_PREFIX, !0));
          options.addClass &&
            (classes = concatWithSpace(
              classes,
              pendClasses(options.addClass, ADD_CLASS_SUFFIX)
            ));
          options.removeClass &&
            (classes = concatWithSpace(
              classes,
              pendClasses(options.removeClass, REMOVE_CLASS_SUFFIX)
            ));
          if (classes.length) {
            options.preparationClasses = classes;
            element.addClass(classes);
          }
        }
        function clearGeneratedClasses(element, options) {
          if (options.preparationClasses) {
            element.removeClass(options.preparationClasses);
            options.preparationClasses = null;
          }
          if (options.activeClasses) {
            element.removeClass(options.activeClasses);
            options.activeClasses = null;
          }
        }
        function blockTransitions(node, duration) {
          var value = duration ? "-" + duration + "s" : "";
          applyInlineStyle(node, [TRANSITION_DELAY_PROP, value]);
          return [TRANSITION_DELAY_PROP, value];
        }
        function blockKeyframeAnimations(node, applyBlock) {
          var value = applyBlock ? "paused" : "",
            key = ANIMATION_PROP + ANIMATION_PLAYSTATE_KEY;
          applyInlineStyle(node, [key, value]);
          return [key, value];
        }
        function applyInlineStyle(node, styleTuple) {
          var prop = styleTuple[0],
            value = styleTuple[1];
          node.style[prop] = value;
        }
        function concatWithSpace(a, b) {
          if (!a) return b;
          if (!b) return a;
          return a + " " + b;
        }
        function getCssKeyframeDurationStyle(duration) {
          return [ANIMATION_DURATION_PROP, duration + "s"];
        }
        function getCssDelayStyle(delay, isKeyframeAnimation) {
          return [
            isKeyframeAnimation ? ANIMATION_DELAY_PROP : TRANSITION_DELAY_PROP,
            delay + "s"
          ];
        }
        function computeCssStyles($window, element, properties) {
          var styles = Object.create(null),
            detectedStyles = $window.getComputedStyle(element) || {};
          forEach(properties, function(formalStyleName, actualStyleName) {
            var c,
              val = detectedStyles[formalStyleName];
            if (val) {
              c = val.charAt(0);
              ("-" === c || "+" === c || c >= 0) && (val = parseMaxTime(val));
              0 === val && (val = null);
              styles[actualStyleName] = val;
            }
          });
          return styles;
        }
        function parseMaxTime(str) {
          var maxValue = 0,
            values = str.split(/\s*,\s*/);
          forEach(values, function(value) {
            "s" == value.charAt(value.length - 1) &&
              (value = value.substring(0, value.length - 1));
            value = parseFloat(value) || 0;
            maxValue = maxValue ? Math.max(value, maxValue) : value;
          });
          return maxValue;
        }
        function truthyTimingValue(val) {
          return 0 === val || null != val;
        }
        function getCssTransitionDurationStyle(duration, applyOnlyDuration) {
          var style = TRANSITION_PROP,
            value = duration + "s";
          applyOnlyDuration
            ? (style += DURATION_KEY)
            : (value += " linear all");
          return [style, value];
        }
        function createLocalCacheLookup() {
          var cache = Object.create(null);
          return {
            flush: function() {
              cache = Object.create(null);
            },
            count: function(key) {
              var entry = cache[key];
              return entry ? entry.total : 0;
            },
            get: function(key) {
              var entry = cache[key];
              return entry && entry.value;
            },
            put: function(key, value) {
              cache[key]
                ? cache[key].total++
                : (cache[key] = { total: 1, value: value });
            }
          };
        }
        function registerRestorableStyles(backup, node, properties) {
          forEach(properties, function(prop) {
            backup[prop] = isDefined(backup[prop])
              ? backup[prop]
              : node.style.getPropertyValue(prop);
          });
        }
        var TRANSITION_PROP,
          TRANSITIONEND_EVENT,
          ANIMATION_PROP,
          ANIMATIONEND_EVENT,
          DURATION_KEY,
          PROPERTY_KEY,
          DELAY_KEY,
          TIMING_KEY,
          ANIMATION_ITERATION_COUNT_KEY,
          ANIMATION_PLAYSTATE_KEY,
          SAFE_FAST_FORWARD_DURATION_VALUE,
          ANIMATION_DELAY_PROP,
          ANIMATION_DURATION_PROP,
          TRANSITION_DELAY_PROP,
          TRANSITION_DURATION_PROP,
          $$rAFSchedulerFactory,
          $$AnimateChildrenDirective,
          ANIMATE_TIMER_KEY,
          ONE_SECOND,
          ELAPSED_TIME_MAX_DECIMAL_PLACES,
          CLOSING_TIME_BUFFER,
          DETECT_CSS_PROPERTIES,
          DETECT_STAGGER_CSS_PROPERTIES,
          $AnimateCssProvider,
          $$AnimateCssDriverProvider,
          $$AnimateJsProvider,
          $$AnimateJsDriverProvider,
          NG_ANIMATE_ATTR_NAME,
          NG_ANIMATE_PIN_DATA,
          $$AnimateQueueProvider,
          $$AnimateAsyncRunFactory,
          $$AnimateRunnerFactory,
          $$AnimationProvider,
          noop = angular.noop,
          extend = angular.extend,
          jqLite = angular.element,
          forEach = angular.forEach,
          isArray = angular.isArray,
          isString = angular.isString,
          isObject = angular.isObject,
          isUndefined = angular.isUndefined,
          isDefined = angular.isDefined,
          isFunction = angular.isFunction,
          isElement = angular.isElement,
          ELEMENT_NODE = 1,
          ADD_CLASS_SUFFIX = "-add",
          REMOVE_CLASS_SUFFIX = "-remove",
          EVENT_CLASS_PREFIX = "ng-",
          ACTIVE_CLASS_SUFFIX = "-active",
          NG_ANIMATE_CLASSNAME = "ng-animate",
          NG_ANIMATE_CHILDREN_DATA = "$$ngAnimateChildren";
        if (
          isUndefined(window.ontransitionend) &&
          isDefined(window.onwebkittransitionend)
        ) {
          ("-webkit-");
          TRANSITION_PROP = "WebkitTransition";
          TRANSITIONEND_EVENT = "webkitTransitionEnd transitionend";
        } else {
          TRANSITION_PROP = "transition";
          TRANSITIONEND_EVENT = "transitionend";
        }
        if (
          isUndefined(window.onanimationend) &&
          isDefined(window.onwebkitanimationend)
        ) {
          ("-webkit-");
          ANIMATION_PROP = "WebkitAnimation";
          ANIMATIONEND_EVENT = "webkitAnimationEnd animationend";
        } else {
          ANIMATION_PROP = "animation";
          ANIMATIONEND_EVENT = "animationend";
        }
        DURATION_KEY = "Duration";
        PROPERTY_KEY = "Property";
        DELAY_KEY = "Delay";
        TIMING_KEY = "TimingFunction";
        ANIMATION_ITERATION_COUNT_KEY = "IterationCount";
        ANIMATION_PLAYSTATE_KEY = "PlayState";
        SAFE_FAST_FORWARD_DURATION_VALUE = 9999;
        ANIMATION_DELAY_PROP = ANIMATION_PROP + DELAY_KEY;
        ANIMATION_DURATION_PROP = ANIMATION_PROP + DURATION_KEY;
        TRANSITION_DELAY_PROP = TRANSITION_PROP + DELAY_KEY;
        TRANSITION_DURATION_PROP = TRANSITION_PROP + DURATION_KEY;
        (function(p) {
          return !(!p || !p.then);
        });
        $$rAFSchedulerFactory = [
          "$$rAF",
          function($$rAF) {
            function scheduler(tasks) {
              queue = queue.concat(tasks);
              nextTick();
            }
            function nextTick() {
              var items, i;
              if (!queue.length) return;
              items = queue.shift();
              for (i = 0; i < items.length; i++) items[i]();
              cancelFn ||
                $$rAF(function() {
                  cancelFn || nextTick();
                });
            }
            var queue, cancelFn;
            queue = scheduler.queue = [];
            scheduler.waitUntilQuiet = function(fn) {
              cancelFn && cancelFn();
              cancelFn = $$rAF(function() {
                cancelFn = null;
                fn();
                nextTick();
              });
            };
            return scheduler;
          }
        ];
        $$AnimateChildrenDirective = [
          function() {
            return function(scope, element, attrs) {
              var val = attrs.ngAnimateChildren;
              angular.isString(val) && 0 === val.length
                ? element.data(NG_ANIMATE_CHILDREN_DATA, !0)
                : attrs.$observe("ngAnimateChildren", function(value) {
                    value = "on" === value || "true" === value;
                    element.data(NG_ANIMATE_CHILDREN_DATA, value);
                  });
            };
          }
        ];
        ANIMATE_TIMER_KEY = "$$animateCss";
        ONE_SECOND = 1e3;
        10;
        ELAPSED_TIME_MAX_DECIMAL_PLACES = 3;
        CLOSING_TIME_BUFFER = 1.5;
        DETECT_CSS_PROPERTIES = {
          transitionDuration: TRANSITION_DURATION_PROP,
          transitionDelay: TRANSITION_DELAY_PROP,
          transitionProperty: TRANSITION_PROP + PROPERTY_KEY,
          animationDuration: ANIMATION_DURATION_PROP,
          animationDelay: ANIMATION_DELAY_PROP,
          animationIterationCount:
            ANIMATION_PROP + ANIMATION_ITERATION_COUNT_KEY
        };
        DETECT_STAGGER_CSS_PROPERTIES = {
          transitionDuration: TRANSITION_DURATION_PROP,
          transitionDelay: TRANSITION_DELAY_PROP,
          animationDuration: ANIMATION_DURATION_PROP,
          animationDelay: ANIMATION_DELAY_PROP
        };
        $AnimateCssProvider = [
          "$animateProvider",
          function($animateProvider) {
            var gcsLookup = createLocalCacheLookup(),
              gcsStaggerLookup = createLocalCacheLookup();
            this.$get = [
              "$window",
              "$$jqLite",
              "$$AnimateRunner",
              "$timeout",
              "$$forceReflow",
              "$sniffer",
              "$$rAFScheduler",
              "$animate",
              function(
                $window,
                $$jqLite,
                $$AnimateRunner,
                $timeout,
                $$forceReflow,
                $sniffer,
                $$rAFScheduler,
                $animate
              ) {
                function gcsHashFn(node, extraClasses) {
                  var KEY = "$$ngAnimateParentKey",
                    parentNode = node.parentNode;
                  return (
                    (parentNode[KEY] || (parentNode[KEY] = ++parentCounter)) +
                    "-" +
                    node.getAttribute("class") +
                    "-" +
                    extraClasses
                  );
                }
                function computeCachedCssStyles(
                  node,
                  className,
                  cacheKey,
                  properties
                ) {
                  var timings = gcsLookup.get(cacheKey);
                  if (!timings) {
                    timings = computeCssStyles($window, node, properties);
                    "infinite" === timings.animationIterationCount &&
                      (timings.animationIterationCount = 1);
                  }
                  gcsLookup.put(cacheKey, timings);
                  return timings;
                }
                function computeCachedCssStaggerStyles(
                  node,
                  className,
                  cacheKey,
                  properties
                ) {
                  var stagger, staggerClassName;
                  if (gcsLookup.count(cacheKey) > 0) {
                    stagger = gcsStaggerLookup.get(cacheKey);
                    if (!stagger) {
                      staggerClassName = pendClasses(className, "-stagger");
                      $$jqLite.addClass(node, staggerClassName);
                      stagger = computeCssStyles($window, node, properties);
                      stagger.animationDuration = Math.max(
                        stagger.animationDuration,
                        0
                      );
                      stagger.transitionDuration = Math.max(
                        stagger.transitionDuration,
                        0
                      );
                      $$jqLite.removeClass(node, staggerClassName);
                      gcsStaggerLookup.put(cacheKey, stagger);
                    }
                  }
                  return stagger || {};
                }
                function waitUntilQuiet(callback) {
                  rafWaitQueue.push(callback);
                  $$rAFScheduler.waitUntilQuiet(function() {
                    var pageWidth, i;
                    gcsLookup.flush();
                    gcsStaggerLookup.flush();
                    pageWidth = $$forceReflow();
                    for (i = 0; i < rafWaitQueue.length; i++)
                      rafWaitQueue[i](pageWidth);
                    rafWaitQueue.length = 0;
                  });
                }
                function computeTimings(node, className, cacheKey) {
                  var timings = computeCachedCssStyles(
                      node,
                      className,
                      cacheKey,
                      DETECT_CSS_PROPERTIES
                    ),
                    aD = timings.animationDelay,
                    tD = timings.transitionDelay;
                  timings.maxDelay = aD && tD ? Math.max(aD, tD) : aD || tD;
                  timings.maxDuration = Math.max(
                    timings.animationDuration * timings.animationIterationCount,
                    timings.transitionDuration
                  );
                  return timings;
                }
                var applyAnimationClasses = applyAnimationClassesFactory(
                    $$jqLite
                  ),
                  parentCounter = 0,
                  rafWaitQueue = [];
                return function(element, options) {
                  function endFn() {
                    close();
                  }
                  function cancelFn() {
                    close(!0);
                  }
                  function close(rejected) {
                    if (
                      animationClosed ||
                      (animationCompleted && animationPaused)
                    )
                      return;
                    animationClosed = !0;
                    animationPaused = !1;
                    options.$$skipPreparationClasses ||
                      $$jqLite.removeClass(element, preparationClasses);
                    $$jqLite.removeClass(element, activeClasses);
                    blockKeyframeAnimations(node, !1);
                    blockTransitions(node, !1);
                    forEach(temporaryStyles, function(entry) {
                      node.style[entry[0]] = "";
                    });
                    applyAnimationClasses(element, options);
                    applyAnimationStyles(element, options);
                    Object.keys(restoreStyles).length &&
                      forEach(restoreStyles, function(value, prop) {
                        value
                          ? node.style.setProperty(prop, value)
                          : node.style.removeProperty(prop);
                      });
                    options.onDone && options.onDone();
                    runner && runner.complete(!rejected);
                  }
                  function applyBlocking(duration) {
                    flags.blockTransition && blockTransitions(node, duration);
                    flags.blockKeyframeAnimation &&
                      blockKeyframeAnimations(node, !!duration);
                  }
                  function closeAndReturnNoopAnimator() {
                    runner = new $$AnimateRunner({
                      end: endFn,
                      cancel: cancelFn
                    });
                    waitUntilQuiet(noop);
                    close();
                    return {
                      $$willAnimate: !1,
                      start: function() {
                        return runner;
                      },
                      end: endFn
                    };
                  }
                  function start() {
                    function triggerAnimationStart() {
                      var easeProp,
                        easeVal,
                        timerTime,
                        endTime,
                        animationsData,
                        setupFallbackTimer,
                        currentTimerData,
                        timer;
                      if (animationClosed) return;
                      applyBlocking(!1);
                      forEach(temporaryStyles, function(entry) {
                        var key = entry[0],
                          value = entry[1];
                        node.style[key] = value;
                      });
                      applyAnimationClasses(element, options);
                      $$jqLite.addClass(element, activeClasses);
                      if (flags.recalculateTimingStyles) {
                        fullClassName =
                          node.className + " " + preparationClasses;
                        cacheKey = gcsHashFn(node, fullClassName);
                        timings = computeTimings(node, fullClassName, cacheKey);
                        relativeDelay = timings.maxDelay;
                        maxDelay = Math.max(relativeDelay, 0);
                        maxDuration = timings.maxDuration;
                        if (0 === maxDuration) {
                          close();
                          return;
                        }
                        flags.hasTransitions = timings.transitionDuration > 0;
                        flags.hasAnimations = timings.animationDuration > 0;
                      }
                      if (flags.applyAnimationDelay) {
                        relativeDelay =
                          "boolean" != typeof options.delay &&
                          truthyTimingValue(options.delay)
                            ? parseFloat(options.delay)
                            : relativeDelay;
                        maxDelay = Math.max(relativeDelay, 0);
                        timings.animationDelay = relativeDelay;
                        delayStyle = getCssDelayStyle(relativeDelay, !0);
                        temporaryStyles.push(delayStyle);
                        node.style[delayStyle[0]] = delayStyle[1];
                      }
                      maxDelayTime = maxDelay * ONE_SECOND;
                      maxDurationTime = maxDuration * ONE_SECOND;
                      if (options.easing) {
                        easeVal = options.easing;
                        if (flags.hasTransitions) {
                          easeProp = TRANSITION_PROP + TIMING_KEY;
                          temporaryStyles.push([easeProp, easeVal]);
                          node.style[easeProp] = easeVal;
                        }
                        if (flags.hasAnimations) {
                          easeProp = ANIMATION_PROP + TIMING_KEY;
                          temporaryStyles.push([easeProp, easeVal]);
                          node.style[easeProp] = easeVal;
                        }
                      }
                      timings.transitionDuration &&
                        events.push(TRANSITIONEND_EVENT);
                      timings.animationDuration &&
                        events.push(ANIMATIONEND_EVENT);
                      startTime = Date.now();
                      timerTime =
                        maxDelayTime + CLOSING_TIME_BUFFER * maxDurationTime;
                      endTime = startTime + timerTime;
                      animationsData = element.data(ANIMATE_TIMER_KEY) || [];
                      setupFallbackTimer = !0;
                      if (animationsData.length) {
                        currentTimerData = animationsData[0];
                        setupFallbackTimer =
                          endTime > currentTimerData.expectedEndTime;
                        setupFallbackTimer
                          ? $timeout.cancel(currentTimerData.timer)
                          : animationsData.push(close);
                      }
                      if (setupFallbackTimer) {
                        timer = $timeout(onAnimationExpired, timerTime, !1);
                        animationsData[0] = {
                          timer: timer,
                          expectedEndTime: endTime
                        };
                        animationsData.push(close);
                        element.data(ANIMATE_TIMER_KEY, animationsData);
                      }
                      element.on(events.join(" "), onAnimationProgress);
                      if (options.to) {
                        options.cleanupStyles &&
                          registerRestorableStyles(
                            restoreStyles,
                            node,
                            Object.keys(options.to)
                          );
                        applyAnimationToStyles(element, options);
                      }
                    }
                    function onAnimationExpired() {
                      var i,
                        animationsData = element.data(ANIMATE_TIMER_KEY);
                      if (animationsData) {
                        for (i = 1; i < animationsData.length; i++)
                          animationsData[i]();
                        element.removeData(ANIMATE_TIMER_KEY);
                      }
                    }
                    function onAnimationProgress(event) {
                      var ev, timeStamp, elapsedTime;
                      event.stopPropagation();
                      ev = event.originalEvent || event;
                      timeStamp =
                        ev.$manualTimeStamp || ev.timeStamp || Date.now();
                      elapsedTime = parseFloat(
                        ev.elapsedTime.toFixed(ELAPSED_TIME_MAX_DECIMAL_PLACES)
                      );
                      if (
                        Math.max(timeStamp - startTime, 0) >= maxDelayTime &&
                        elapsedTime >= maxDuration
                      ) {
                        animationCompleted = !0;
                        close();
                      }
                    }
                    var startTime, events, playPause, maxStagger;
                    if (animationClosed) return;
                    if (!node.parentNode) {
                      close();
                      return;
                    }
                    events = [];
                    playPause = function(playAnimation) {
                      if (animationCompleted) {
                        if (animationPaused && playAnimation) {
                          animationPaused = !1;
                          close();
                        }
                      } else {
                        animationPaused = !playAnimation;
                        if (timings.animationDuration) {
                          var value = blockKeyframeAnimations(
                            node,
                            animationPaused
                          );
                          animationPaused
                            ? temporaryStyles.push(value)
                            : removeFromArray(temporaryStyles, value);
                        }
                      }
                    };
                    maxStagger =
                      itemIndex > 0 &&
                      ((timings.transitionDuration &&
                        0 === stagger.transitionDuration) ||
                        (timings.animationDuration &&
                          0 === stagger.animationDuration)) &&
                      Math.max(stagger.animationDelay, stagger.transitionDelay);
                    maxStagger
                      ? $timeout(
                          triggerAnimationStart,
                          Math.floor(maxStagger * itemIndex * ONE_SECOND),
                          !1
                        )
                      : triggerAnimationStart();
                    runnerHost.resume = function() {
                      playPause(!0);
                    };
                    runnerHost.pause = function() {
                      playPause(!1);
                    };
                  }
                  var temporaryStyles,
                    classes,
                    styles,
                    animationClosed,
                    animationPaused,
                    animationCompleted,
                    runner,
                    runnerHost,
                    maxDelay,
                    maxDelayTime,
                    maxDuration,
                    maxDurationTime,
                    method,
                    isStructural,
                    structuralClassName,
                    addRemoveClassName,
                    preparationClasses,
                    fullClassName,
                    activeClasses,
                    hasToStyles,
                    containsKeyframeAnimation,
                    cacheKey,
                    stagger,
                    staggerVal,
                    applyOnlyDuration,
                    transitionStyle,
                    durationStyle,
                    keyframeStyle,
                    itemIndex,
                    isFirst,
                    timings,
                    relativeDelay,
                    flags,
                    delayStyle,
                    restoreStyles = {},
                    node = getDomNode(element);
                  if (!node || !node.parentNode || !$animate.enabled())
                    return closeAndReturnNoopAnimator();
                  options = prepareAnimationOptions(options);
                  temporaryStyles = [];
                  classes = element.attr("class");
                  styles = packageStyles(options);
                  if (
                    0 === options.duration ||
                    (!$sniffer.animations && !$sniffer.transitions)
                  )
                    return closeAndReturnNoopAnimator();
                  method =
                    options.event && isArray(options.event)
                      ? options.event.join(" ")
                      : options.event;
                  isStructural = method && options.structural;
                  structuralClassName = "";
                  addRemoveClassName = "";
                  isStructural
                    ? (structuralClassName = pendClasses(
                        method,
                        EVENT_CLASS_PREFIX,
                        !0
                      ))
                    : method && (structuralClassName = method);
                  options.addClass &&
                    (addRemoveClassName += pendClasses(
                      options.addClass,
                      ADD_CLASS_SUFFIX
                    ));
                  if (options.removeClass) {
                    addRemoveClassName.length && (addRemoveClassName += " ");
                    addRemoveClassName += pendClasses(
                      options.removeClass,
                      REMOVE_CLASS_SUFFIX
                    );
                  }
                  options.applyClassesEarly &&
                    addRemoveClassName.length &&
                    applyAnimationClasses(element, options);
                  preparationClasses = [structuralClassName, addRemoveClassName]
                    .join(" ")
                    .trim();
                  fullClassName = classes + " " + preparationClasses;
                  activeClasses = pendClasses(
                    preparationClasses,
                    ACTIVE_CLASS_SUFFIX
                  );
                  hasToStyles = styles.to && Object.keys(styles.to).length > 0;
                  containsKeyframeAnimation =
                    (options.keyframeStyle || "").length > 0;
                  if (
                    !containsKeyframeAnimation &&
                    !hasToStyles &&
                    !preparationClasses
                  )
                    return closeAndReturnNoopAnimator();
                  if (options.stagger > 0) {
                    staggerVal = parseFloat(options.stagger);
                    stagger = {
                      transitionDelay: staggerVal,
                      animationDelay: staggerVal,
                      transitionDuration: 0,
                      animationDuration: 0
                    };
                  } else {
                    cacheKey = gcsHashFn(node, fullClassName);
                    stagger = computeCachedCssStaggerStyles(
                      node,
                      preparationClasses,
                      cacheKey,
                      DETECT_STAGGER_CSS_PROPERTIES
                    );
                  }
                  options.$$skipPreparationClasses ||
                    $$jqLite.addClass(element, preparationClasses);
                  if (options.transitionStyle) {
                    transitionStyle = [
                      TRANSITION_PROP,
                      options.transitionStyle
                    ];
                    applyInlineStyle(node, transitionStyle);
                    temporaryStyles.push(transitionStyle);
                  }
                  if (options.duration >= 0) {
                    applyOnlyDuration = node.style[TRANSITION_PROP].length > 0;
                    durationStyle = getCssTransitionDurationStyle(
                      options.duration,
                      applyOnlyDuration
                    );
                    applyInlineStyle(node, durationStyle);
                    temporaryStyles.push(durationStyle);
                  }
                  if (options.keyframeStyle) {
                    keyframeStyle = [ANIMATION_PROP, options.keyframeStyle];
                    applyInlineStyle(node, keyframeStyle);
                    temporaryStyles.push(keyframeStyle);
                  }
                  itemIndex = stagger
                    ? options.staggerIndex >= 0
                      ? options.staggerIndex
                      : gcsLookup.count(cacheKey)
                    : 0;
                  isFirst = 0 === itemIndex;
                  isFirst &&
                    !options.skipBlocking &&
                    blockTransitions(node, SAFE_FAST_FORWARD_DURATION_VALUE);
                  timings = computeTimings(node, fullClassName, cacheKey);
                  relativeDelay = timings.maxDelay;
                  maxDelay = Math.max(relativeDelay, 0);
                  maxDuration = timings.maxDuration;
                  flags = {};
                  flags.hasTransitions = timings.transitionDuration > 0;
                  flags.hasAnimations = timings.animationDuration > 0;
                  flags.hasTransitionAll =
                    flags.hasTransitions && "all" == timings.transitionProperty;
                  flags.applyTransitionDuration =
                    hasToStyles &&
                    ((flags.hasTransitions && !flags.hasTransitionAll) ||
                      (flags.hasAnimations && !flags.hasTransitions));
                  flags.applyAnimationDuration =
                    options.duration && flags.hasAnimations;
                  flags.applyTransitionDelay =
                    truthyTimingValue(options.delay) &&
                    (flags.applyTransitionDuration || flags.hasTransitions);
                  flags.applyAnimationDelay =
                    truthyTimingValue(options.delay) && flags.hasAnimations;
                  flags.recalculateTimingStyles = addRemoveClassName.length > 0;
                  if (
                    flags.applyTransitionDuration ||
                    flags.applyAnimationDuration
                  ) {
                    maxDuration = options.duration
                      ? parseFloat(options.duration)
                      : maxDuration;
                    if (flags.applyTransitionDuration) {
                      flags.hasTransitions = !0;
                      timings.transitionDuration = maxDuration;
                      applyOnlyDuration =
                        node.style[TRANSITION_PROP + PROPERTY_KEY].length > 0;
                      temporaryStyles.push(
                        getCssTransitionDurationStyle(
                          maxDuration,
                          applyOnlyDuration
                        )
                      );
                    }
                    if (flags.applyAnimationDuration) {
                      flags.hasAnimations = !0;
                      timings.animationDuration = maxDuration;
                      temporaryStyles.push(
                        getCssKeyframeDurationStyle(maxDuration)
                      );
                    }
                  }
                  if (0 === maxDuration && !flags.recalculateTimingStyles)
                    return closeAndReturnNoopAnimator();
                  if (null != options.delay) {
                    delayStyle = parseFloat(options.delay);
                    flags.applyTransitionDelay &&
                      temporaryStyles.push(getCssDelayStyle(delayStyle));
                    flags.applyAnimationDelay &&
                      temporaryStyles.push(getCssDelayStyle(delayStyle, !0));
                  }
                  null == options.duration &&
                    timings.transitionDuration > 0 &&
                    (flags.recalculateTimingStyles =
                      flags.recalculateTimingStyles || isFirst);
                  maxDelayTime = maxDelay * ONE_SECOND;
                  maxDurationTime = maxDuration * ONE_SECOND;
                  if (!options.skipBlocking) {
                    flags.blockTransition = timings.transitionDuration > 0;
                    flags.blockKeyframeAnimation =
                      timings.animationDuration > 0 &&
                      stagger.animationDelay > 0 &&
                      0 === stagger.animationDuration;
                  }
                  if (options.from) {
                    options.cleanupStyles &&
                      registerRestorableStyles(
                        restoreStyles,
                        node,
                        Object.keys(options.from)
                      );
                    applyAnimationFromStyles(element, options);
                  }
                  flags.blockTransition || flags.blockKeyframeAnimation
                    ? applyBlocking(maxDuration)
                    : options.skipBlocking || blockTransitions(node, !1);
                  return {
                    $$willAnimate: !0,
                    end: endFn,
                    start: function() {
                      if (animationClosed) return;
                      runnerHost = {
                        end: endFn,
                        cancel: cancelFn,
                        resume: null,
                        pause: null
                      };
                      runner = new $$AnimateRunner(runnerHost);
                      waitUntilQuiet(start);
                      return runner;
                    }
                  };
                };
              }
            ];
          }
        ];
        $$AnimateCssDriverProvider = [
          "$$animationProvider",
          function($$animationProvider) {
            function isDocumentFragment(node) {
              return node.parentNode && 11 === node.parentNode.nodeType;
            }
            var NG_ANIMATE_SHIM_CLASS_NAME,
              NG_ANIMATE_ANCHOR_CLASS_NAME,
              NG_OUT_ANCHOR_CLASS_NAME,
              NG_IN_ANCHOR_CLASS_NAME;
            $$animationProvider.drivers.push("$$animateCssDriver");
            NG_ANIMATE_SHIM_CLASS_NAME = "ng-animate-shim";
            NG_ANIMATE_ANCHOR_CLASS_NAME = "ng-anchor";
            NG_OUT_ANCHOR_CLASS_NAME = "ng-anchor-out";
            NG_IN_ANCHOR_CLASS_NAME = "ng-anchor-in";
            this.$get = [
              "$animateCss",
              "$rootScope",
              "$$AnimateRunner",
              "$rootElement",
              "$sniffer",
              "$$jqLite",
              "$document",
              function(
                $animateCss,
                $rootScope,
                $$AnimateRunner,
                $rootElement,
                $sniffer,
                $$jqLite,
                $document
              ) {
                function filterCssClasses(classes) {
                  return classes.replace(/\bng-\S+\b/g, "");
                }
                function getUniqueValues(a, b) {
                  isString(a) && (a = a.split(" "));
                  isString(b) && (b = b.split(" "));
                  return a
                    .filter(function(val) {
                      return -1 === b.indexOf(val);
                    })
                    .join(" ");
                }
                function prepareAnchoredAnimation(
                  classes,
                  outAnchor,
                  inAnchor
                ) {
                  function calculateAnchorStyles(anchor) {
                    var styles = {},
                      coords = getDomNode(anchor).getBoundingClientRect();
                    forEach(["width", "height", "top", "left"], function(key) {
                      var value = coords[key];
                      switch (key) {
                        case "top":
                          value += bodyNode.scrollTop;
                          break;
                        case "left":
                          value += bodyNode.scrollLeft;
                      }
                      styles[key] = Math.floor(value) + "px";
                    });
                    return styles;
                  }
                  function getClassVal(element) {
                    return element.attr("class") || "";
                  }
                  function prepareInAnimation() {
                    var endingClasses = filterCssClasses(getClassVal(inAnchor)),
                      toAdd = getUniqueValues(endingClasses, startingClasses),
                      toRemove = getUniqueValues(
                        startingClasses,
                        endingClasses
                      ),
                      animator = $animateCss(clone, {
                        to: calculateAnchorStyles(inAnchor),
                        addClass: NG_IN_ANCHOR_CLASS_NAME + " " + toAdd,
                        removeClass: NG_OUT_ANCHOR_CLASS_NAME + " " + toRemove,
                        delay: !0
                      });
                    return animator.$$willAnimate ? animator : null;
                  }
                  function end() {
                    clone.remove();
                    outAnchor.removeClass(NG_ANIMATE_SHIM_CLASS_NAME);
                    inAnchor.removeClass(NG_ANIMATE_SHIM_CLASS_NAME);
                  }
                  var animatorIn,
                    animatorOut,
                    startingAnimator,
                    clone = jqLite(getDomNode(outAnchor).cloneNode(!0)),
                    startingClasses = filterCssClasses(getClassVal(clone));
                  outAnchor.addClass(NG_ANIMATE_SHIM_CLASS_NAME);
                  inAnchor.addClass(NG_ANIMATE_SHIM_CLASS_NAME);
                  clone.addClass(NG_ANIMATE_ANCHOR_CLASS_NAME);
                  rootBodyElement.append(clone);
                  animatorOut = (function() {
                    var animator = $animateCss(clone, {
                      addClass: NG_OUT_ANCHOR_CLASS_NAME,
                      delay: !0,
                      from: calculateAnchorStyles(outAnchor)
                    });
                    return animator.$$willAnimate ? animator : null;
                  })();
                  if (!animatorOut) {
                    animatorIn = prepareInAnimation();
                    if (!animatorIn) return end();
                  }
                  startingAnimator = animatorOut || animatorIn;
                  return {
                    start: function() {
                      function endFn() {
                        currentAnimation && currentAnimation.end();
                      }
                      var runner,
                        currentAnimation = startingAnimator.start();
                      currentAnimation.done(function() {
                        currentAnimation = null;
                        if (!animatorIn) {
                          animatorIn = prepareInAnimation();
                          if (animatorIn) {
                            currentAnimation = animatorIn.start();
                            currentAnimation.done(function() {
                              currentAnimation = null;
                              end();
                              runner.complete();
                            });
                            return currentAnimation;
                          }
                        }
                        end();
                        runner.complete();
                      });
                      runner = new $$AnimateRunner({
                        end: endFn,
                        cancel: endFn
                      });
                      return runner;
                    }
                  };
                }
                function prepareFromToAnchorAnimation(
                  from,
                  to,
                  classes,
                  anchors
                ) {
                  var fromAnimation = prepareRegularAnimation(from),
                    toAnimation = prepareRegularAnimation(to),
                    anchorAnimations = [];
                  forEach(anchors, function(anchor) {
                    var outElement = anchor.out,
                      inElement = anchor.in,
                      animator = prepareAnchoredAnimation(
                        classes,
                        outElement,
                        inElement
                      );
                    animator && anchorAnimations.push(animator);
                  });
                  if (
                    !fromAnimation &&
                    !toAnimation &&
                    0 === anchorAnimations.length
                  )
                    return;
                  return {
                    start: function() {
                      function endFn() {
                        forEach(animationRunners, function(runner) {
                          runner.end();
                        });
                      }
                      var runner,
                        animationRunners = [];
                      fromAnimation &&
                        animationRunners.push(fromAnimation.start());
                      toAnimation && animationRunners.push(toAnimation.start());
                      forEach(anchorAnimations, function(animation) {
                        animationRunners.push(animation.start());
                      });
                      runner = new $$AnimateRunner({
                        end: endFn,
                        cancel: endFn
                      });
                      $$AnimateRunner.all(animationRunners, function(status) {
                        runner.complete(status);
                      });
                      return runner;
                    }
                  };
                }
                function prepareRegularAnimation(animationDetails) {
                  var animator,
                    element = animationDetails.element,
                    options = animationDetails.options || {};
                  if (animationDetails.structural) {
                    options.event = animationDetails.event;
                    options.structural = !0;
                    options.applyClassesEarly = !0;
                    "leave" === animationDetails.event &&
                      (options.onDone = options.domOperation);
                  }
                  options.preparationClasses &&
                    (options.event = concatWithSpace(
                      options.event,
                      options.preparationClasses
                    ));
                  animator = $animateCss(element, options);
                  return animator.$$willAnimate ? animator : null;
                }
                var bodyNode, rootNode, rootBodyElement;
                if (!$sniffer.animations && !$sniffer.transitions) return noop;
                bodyNode = $document[0].body;
                rootNode = getDomNode($rootElement);
                rootBodyElement = jqLite(
                  isDocumentFragment(rootNode) || bodyNode.contains(rootNode)
                    ? rootNode
                    : bodyNode
                );
                applyAnimationClassesFactory($$jqLite);
                return function(animationDetails) {
                  return animationDetails.from && animationDetails.to
                    ? prepareFromToAnchorAnimation(
                        animationDetails.from,
                        animationDetails.to,
                        animationDetails.classes,
                        animationDetails.anchors
                      )
                    : prepareRegularAnimation(animationDetails);
                };
              }
            ];
          }
        ];
        $$AnimateJsProvider = [
          "$animateProvider",
          function($animateProvider) {
            this.$get = [
              "$injector",
              "$$AnimateRunner",
              "$$jqLite",
              function($injector, $$AnimateRunner, $$jqLite) {
                function lookupAnimations(classes) {
                  var matches, flagMap, i, klass, animationFactory;
                  classes = isArray(classes) ? classes : classes.split(" ");
                  (matches = []), (flagMap = {});
                  for (i = 0; i < classes.length; i++) {
                    (klass = classes[i]),
                      (animationFactory =
                        $animateProvider.$$registeredAnimations[klass]);
                    if (animationFactory && !flagMap[klass]) {
                      matches.push($injector.get(animationFactory));
                      flagMap[klass] = !0;
                    }
                  }
                  return matches;
                }
                var applyAnimationClasses = applyAnimationClassesFactory(
                  $$jqLite
                );
                return function(element, event, classes, options) {
                  function applyOptions() {
                    options.domOperation();
                    applyAnimationClasses(element, options);
                  }
                  function executeAnimationFn(
                    fn,
                    element,
                    event,
                    options,
                    onDone
                  ) {
                    var args, value;
                    switch (event) {
                      case "animate":
                        args = [element, options.from, options.to, onDone];
                        break;
                      case "setClass":
                        args = [element, classesToAdd, classesToRemove, onDone];
                        break;
                      case "addClass":
                        args = [element, classesToAdd, onDone];
                        break;
                      case "removeClass":
                        args = [element, classesToRemove, onDone];
                        break;
                      default:
                        args = [element, onDone];
                    }
                    args.push(options);
                    value = fn.apply(fn, args);
                    if (value) {
                      isFunction(value.start) && (value = value.start());
                      if (value instanceof $$AnimateRunner) value.done(onDone);
                      else if (isFunction(value)) return value;
                    }
                    return noop;
                  }
                  function groupEventedAnimations(
                    element,
                    event,
                    options,
                    animations,
                    fnName
                  ) {
                    var operations = [];
                    forEach(animations, function(ani) {
                      var animation = ani[fnName];
                      if (!animation) return;
                      operations.push(function() {
                        var resolved = !1,
                          onAnimationComplete = function(rejected) {
                            if (!resolved) {
                              resolved = !0;
                              (endProgressCb || noop)(rejected);
                              runner.complete(!rejected);
                            }
                          },
                          runner = new $$AnimateRunner({
                            end: function() {
                              onAnimationComplete();
                            },
                            cancel: function() {
                              onAnimationComplete(!0);
                            }
                          }),
                          endProgressCb = executeAnimationFn(
                            animation,
                            element,
                            event,
                            options,
                            function(result) {
                              onAnimationComplete(!1 === result);
                            }
                          );
                        return runner;
                      });
                    });
                    return operations;
                  }
                  function packageAnimations(
                    element,
                    event,
                    options,
                    animations,
                    fnName
                  ) {
                    var a,
                      b,
                      operations = groupEventedAnimations(
                        element,
                        event,
                        options,
                        animations,
                        fnName
                      );
                    if (0 === operations.length) {
                      if ("beforeSetClass" === fnName) {
                        a = groupEventedAnimations(
                          element,
                          "removeClass",
                          options,
                          animations,
                          "beforeRemoveClass"
                        );
                        b = groupEventedAnimations(
                          element,
                          "addClass",
                          options,
                          animations,
                          "beforeAddClass"
                        );
                      } else if ("setClass" === fnName) {
                        a = groupEventedAnimations(
                          element,
                          "removeClass",
                          options,
                          animations,
                          "removeClass"
                        );
                        b = groupEventedAnimations(
                          element,
                          "addClass",
                          options,
                          animations,
                          "addClass"
                        );
                      }
                      a && (operations = operations.concat(a));
                      b && (operations = operations.concat(b));
                    }
                    if (0 === operations.length) return;
                    return function(callback) {
                      var runners = [];
                      operations.length &&
                        forEach(operations, function(animateFn) {
                          runners.push(animateFn());
                        });
                      runners.length
                        ? $$AnimateRunner.all(runners, callback)
                        : callback();
                      return function(reject) {
                        forEach(runners, function(runner) {
                          reject ? runner.cancel() : runner.end();
                        });
                      };
                    };
                  }
                  var classesToAdd,
                    classesToRemove,
                    animations,
                    before,
                    after,
                    afterFn,
                    beforeFn;
                  if (3 === arguments.length && isObject(classes)) {
                    options = classes;
                    classes = null;
                  }
                  options = prepareAnimationOptions(options);
                  if (!classes) {
                    classes = element.attr("class") || "";
                    options.addClass && (classes += " " + options.addClass);
                    options.removeClass &&
                      (classes += " " + options.removeClass);
                  }
                  classesToAdd = options.addClass;
                  classesToRemove = options.removeClass;
                  animations = lookupAnimations(classes);
                  if (animations.length) {
                    if ("leave" == event) {
                      beforeFn = "leave";
                      afterFn = "afterLeave";
                    } else {
                      beforeFn =
                        "before" +
                        event.charAt(0).toUpperCase() +
                        event.substr(1);
                      afterFn = event;
                    }
                    "enter" !== event &&
                      "move" !== event &&
                      (before = packageAnimations(
                        element,
                        event,
                        options,
                        animations,
                        beforeFn
                      ));
                    after = packageAnimations(
                      element,
                      event,
                      options,
                      animations,
                      afterFn
                    );
                  }
                  if (!before && !after) return;
                  return {
                    start: function() {
                      function onComplete(success) {
                        animationClosed = !0;
                        applyOptions();
                        applyAnimationStyles(element, options);
                        runner.complete(success);
                      }
                      function endAnimations(cancelled) {
                        if (!animationClosed) {
                          (closeActiveAnimations || noop)(cancelled);
                          onComplete(cancelled);
                        }
                      }
                      var closeActiveAnimations,
                        animationClosed,
                        runner,
                        chain = [];
                      before &&
                        chain.push(function(fn) {
                          closeActiveAnimations = before(fn);
                        });
                      chain.length
                        ? chain.push(function(fn) {
                            applyOptions();
                            fn(!0);
                          })
                        : applyOptions();
                      after &&
                        chain.push(function(fn) {
                          closeActiveAnimations = after(fn);
                        });
                      animationClosed = !1;
                      runner = new $$AnimateRunner({
                        end: function() {
                          endAnimations();
                        },
                        cancel: function() {
                          endAnimations(!0);
                        }
                      });
                      $$AnimateRunner.chain(chain, onComplete);
                      return runner;
                    }
                  };
                };
              }
            ];
          }
        ];
        $$AnimateJsDriverProvider = [
          "$$animationProvider",
          function($$animationProvider) {
            $$animationProvider.drivers.push("$$animateJsDriver");
            this.$get = [
              "$$animateJs",
              "$$AnimateRunner",
              function($$animateJs, $$AnimateRunner) {
                function prepareAnimation(animationDetails) {
                  var element = animationDetails.element,
                    event = animationDetails.event,
                    options = animationDetails.options,
                    classes = animationDetails.classes;
                  return $$animateJs(element, event, classes, options);
                }
                return function(animationDetails) {
                  var fromAnimation, toAnimation;
                  if (animationDetails.from && animationDetails.to) {
                    fromAnimation = prepareAnimation(animationDetails.from);
                    toAnimation = prepareAnimation(animationDetails.to);
                    if (!fromAnimation && !toAnimation) return;
                    return {
                      start: function() {
                        function endFnFactory() {
                          return function() {
                            forEach(animationRunners, function(runner) {
                              runner.end();
                            });
                          };
                        }
                        function done(status) {
                          runner.complete(status);
                        }
                        var runner,
                          animationRunners = [];
                        fromAnimation &&
                          animationRunners.push(fromAnimation.start());
                        toAnimation &&
                          animationRunners.push(toAnimation.start());
                        $$AnimateRunner.all(animationRunners, done);
                        runner = new $$AnimateRunner({
                          end: endFnFactory(),
                          cancel: endFnFactory()
                        });
                        return runner;
                      }
                    };
                  }
                  return prepareAnimation(animationDetails);
                };
              }
            ];
          }
        ];
        NG_ANIMATE_ATTR_NAME = "data-ng-animate";
        NG_ANIMATE_PIN_DATA = "$ngAnimatePin";
        $$AnimateQueueProvider = [
          "$animateProvider",
          function($animateProvider) {
            function isAllowed(
              ruleType,
              element,
              currentAnimation,
              previousAnimation
            ) {
              return rules[ruleType].some(function(fn) {
                return fn(element, currentAnimation, previousAnimation);
              });
            }
            function hasAnimationClasses(options, and) {
              var a, b;
              options = options || {};
              a = (options.addClass || "").length > 0;
              b = (options.removeClass || "").length > 0;
              return and ? a && b : a || b;
            }
            var PRE_DIGEST_STATE = 1,
              RUNNING_STATE = 2,
              rules = (this.rules = { skip: [], cancel: [], join: [] });
            rules.join.push(function(element, newAnimation, currentAnimation) {
              return (
                !newAnimation.structural &&
                hasAnimationClasses(newAnimation.options)
              );
            });
            rules.skip.push(function(element, newAnimation, currentAnimation) {
              return (
                !newAnimation.structural &&
                !hasAnimationClasses(newAnimation.options)
              );
            });
            rules.skip.push(function(element, newAnimation, currentAnimation) {
              return (
                "leave" == currentAnimation.event && newAnimation.structural
              );
            });
            rules.skip.push(function(element, newAnimation, currentAnimation) {
              return (
                currentAnimation.structural &&
                currentAnimation.state === RUNNING_STATE &&
                !newAnimation.structural
              );
            });
            rules.cancel.push(function(
              element,
              newAnimation,
              currentAnimation
            ) {
              return currentAnimation.structural && newAnimation.structural;
            });
            rules.cancel.push(function(
              element,
              newAnimation,
              currentAnimation
            ) {
              return (
                currentAnimation.state === RUNNING_STATE &&
                newAnimation.structural
              );
            });
            rules.cancel.push(function(
              element,
              newAnimation,
              currentAnimation
            ) {
              var nO = newAnimation.options,
                cO = currentAnimation.options;
              return (
                (nO.addClass && nO.addClass === cO.removeClass) ||
                (nO.removeClass && nO.removeClass === cO.addClass)
              );
            });
            this.$get = [
              "$$rAF",
              "$rootScope",
              "$rootElement",
              "$document",
              "$$HashMap",
              "$$animation",
              "$$AnimateRunner",
              "$templateRequest",
              "$$jqLite",
              "$$forceReflow",
              function(
                $$rAF,
                $rootScope,
                $rootElement,
                $document,
                $$HashMap,
                $$animation,
                $$AnimateRunner,
                $templateRequest,
                $$jqLite,
                $$forceReflow
              ) {
                function postDigestTaskFactory() {
                  var postDigestCalled = !1;
                  return function(fn) {
                    postDigestCalled
                      ? fn()
                      : $rootScope.$$postDigest(function() {
                          postDigestCalled = !0;
                          fn();
                        });
                  };
                }
                function normalizeAnimationOptions(element, options) {
                  return mergeAnimationOptions(element, options, {});
                }
                function findCallbacks(parent, element, event) {
                  var targetNode = getDomNode(element),
                    targetParentNode = getDomNode(parent),
                    matches = [],
                    entries = callbackRegistry[event];
                  entries &&
                    forEach(entries, function(entry) {
                      entry.node.contains(targetNode)
                        ? matches.push(entry.callback)
                        : "leave" === event &&
                          entry.node.contains(targetParentNode) &&
                          matches.push(entry.callback);
                    });
                  return matches;
                }
                function queueAnimation(element, event, options) {
                  function notifyProgress(runner, event, phase, data) {
                    runInNextPostDigestOrNow(function() {
                      var callbacks = findCallbacks(parent, element, event);
                      callbacks.length &&
                        $$rAF(function() {
                          forEach(callbacks, function(callback) {
                            callback(element, phase, data);
                          });
                        });
                    });
                    runner.progress(event, phase, data);
                  }
                  function close(reject) {
                    clearGeneratedClasses(element, options);
                    applyAnimationClasses(element, options);
                    applyAnimationStyles(element, options);
                    options.domOperation();
                    runner.complete(!reject);
                  }
                  var node,
                    parent,
                    runner,
                    runInNextPostDigestOrNow,
                    className,
                    isStructural,
                    skipAnimations,
                    existingAnimation,
                    hasExistingAnimation,
                    newAnimation,
                    skipAnimationFlag,
                    cancelAnimationFlag,
                    joinAnimationFlag,
                    isValidAnimation,
                    counter;
                  element = stripCommentsFromElement(element);
                  if (element) {
                    node = getDomNode(element);
                    parent = element.parent();
                  }
                  options = prepareAnimationOptions(options);
                  runner = new $$AnimateRunner();
                  runInNextPostDigestOrNow = postDigestTaskFactory();
                  isArray(options.addClass) &&
                    (options.addClass = options.addClass.join(" "));
                  options.addClass &&
                    !isString(options.addClass) &&
                    (options.addClass = null);
                  isArray(options.removeClass) &&
                    (options.removeClass = options.removeClass.join(" "));
                  options.removeClass &&
                    !isString(options.removeClass) &&
                    (options.removeClass = null);
                  options.from &&
                    !isObject(options.from) &&
                    (options.from = null);
                  options.to && !isObject(options.to) && (options.to = null);
                  if (!node) {
                    close();
                    return runner;
                  }
                  className = [
                    node.className,
                    options.addClass,
                    options.removeClass
                  ].join(" ");
                  if (!isAnimatableClassName(className)) {
                    close();
                    return runner;
                  }
                  isStructural = ["enter", "move", "leave"].indexOf(event) >= 0;
                  skipAnimations =
                    !animationsEnabled || disabledElementsLookup.get(node);
                  existingAnimation =
                    (!skipAnimations && activeAnimationsLookup.get(node)) || {};
                  hasExistingAnimation = !!existingAnimation.state;
                  skipAnimations ||
                    (hasExistingAnimation &&
                      existingAnimation.state == PRE_DIGEST_STATE) ||
                    (skipAnimations = !areAnimationsAllowed(
                      element,
                      parent,
                      event
                    ));
                  if (skipAnimations) {
                    close();
                    return runner;
                  }
                  isStructural && closeChildAnimations(element);
                  newAnimation = {
                    structural: isStructural,
                    element: element,
                    event: event,
                    close: close,
                    options: options,
                    runner: runner
                  };
                  if (hasExistingAnimation) {
                    skipAnimationFlag = isAllowed(
                      "skip",
                      element,
                      newAnimation,
                      existingAnimation
                    );
                    if (skipAnimationFlag) {
                      if (existingAnimation.state === RUNNING_STATE) {
                        close();
                        return runner;
                      }
                      mergeAnimationOptions(
                        element,
                        existingAnimation.options,
                        options
                      );
                      return existingAnimation.runner;
                    }
                    cancelAnimationFlag = isAllowed(
                      "cancel",
                      element,
                      newAnimation,
                      existingAnimation
                    );
                    if (cancelAnimationFlag)
                      if (existingAnimation.state === RUNNING_STATE)
                        existingAnimation.runner.end();
                      else {
                        if (!existingAnimation.structural) {
                          mergeAnimationOptions(
                            element,
                            existingAnimation.options,
                            newAnimation.options
                          );
                          return existingAnimation.runner;
                        }
                        existingAnimation.close();
                      }
                    else {
                      joinAnimationFlag = isAllowed(
                        "join",
                        element,
                        newAnimation,
                        existingAnimation
                      );
                      if (joinAnimationFlag) {
                        if (existingAnimation.state !== RUNNING_STATE) {
                          applyGeneratedPreparationClasses(
                            element,
                            isStructural ? event : null,
                            options
                          );
                          event = newAnimation.event = existingAnimation.event;
                          options = mergeAnimationOptions(
                            element,
                            existingAnimation.options,
                            newAnimation.options
                          );
                          return existingAnimation.runner;
                        }
                        normalizeAnimationOptions(element, options);
                      }
                    }
                  } else normalizeAnimationOptions(element, options);
                  isValidAnimation = newAnimation.structural;
                  isValidAnimation ||
                    (isValidAnimation =
                      ("animate" === newAnimation.event &&
                        Object.keys(newAnimation.options.to || {}).length >
                          0) ||
                      hasAnimationClasses(newAnimation.options));
                  if (!isValidAnimation) {
                    close();
                    clearElementAnimationState(element);
                    return runner;
                  }
                  counter = (existingAnimation.counter || 0) + 1;
                  newAnimation.counter = counter;
                  markElementAnimationState(
                    element,
                    PRE_DIGEST_STATE,
                    newAnimation
                  );
                  $rootScope.$$postDigest(function() {
                    var parentElement,
                      isValidAnimation,
                      realRunner,
                      animationDetails = activeAnimationsLookup.get(node),
                      animationCancelled = !animationDetails;
                    animationDetails = animationDetails || {};
                    parentElement = element.parent() || [];
                    isValidAnimation =
                      parentElement.length > 0 &&
                      ("animate" === animationDetails.event ||
                        animationDetails.structural ||
                        hasAnimationClasses(animationDetails.options));
                    if (
                      animationCancelled ||
                      animationDetails.counter !== counter ||
                      !isValidAnimation
                    ) {
                      if (animationCancelled) {
                        applyAnimationClasses(element, options);
                        applyAnimationStyles(element, options);
                      }
                      if (
                        animationCancelled ||
                        (isStructural && animationDetails.event !== event)
                      ) {
                        options.domOperation();
                        runner.end();
                      }
                      isValidAnimation || clearElementAnimationState(element);
                      return;
                    }
                    event =
                      !animationDetails.structural &&
                      hasAnimationClasses(animationDetails.options, !0)
                        ? "setClass"
                        : animationDetails.event;
                    markElementAnimationState(element, RUNNING_STATE);
                    realRunner = $$animation(
                      element,
                      event,
                      animationDetails.options
                    );
                    realRunner.done(function(status) {
                      close(!status);
                      var animationDetails = activeAnimationsLookup.get(node);
                      animationDetails &&
                        animationDetails.counter === counter &&
                        clearElementAnimationState(getDomNode(element));
                      notifyProgress(runner, event, "close", {});
                    });
                    runner.setHost(realRunner);
                    notifyProgress(runner, event, "start", {});
                  });
                  return runner;
                }
                function closeChildAnimations(element) {
                  var node = getDomNode(element),
                    children = node.querySelectorAll(
                      "[" + NG_ANIMATE_ATTR_NAME + "]"
                    );
                  forEach(children, function(child) {
                    var state = parseInt(
                        child.getAttribute(NG_ANIMATE_ATTR_NAME)
                      ),
                      animationDetails = activeAnimationsLookup.get(child);
                    switch (state) {
                      case RUNNING_STATE:
                        animationDetails.runner.end();
                      case PRE_DIGEST_STATE:
                        animationDetails &&
                          activeAnimationsLookup.remove(child);
                    }
                  });
                }
                function clearElementAnimationState(element) {
                  var node = getDomNode(element);
                  node.removeAttribute(NG_ANIMATE_ATTR_NAME);
                  activeAnimationsLookup.remove(node);
                }
                function isMatchingElement(nodeOrElmA, nodeOrElmB) {
                  return getDomNode(nodeOrElmA) === getDomNode(nodeOrElmB);
                }
                function areAnimationsAllowed(element, parentElement, event) {
                  var animateChildren,
                    parentNode,
                    details,
                    value,
                    allowAnimation,
                    bodyElement = jqLite($document[0].body),
                    bodyElementDetected =
                      isMatchingElement(element, bodyElement) ||
                      "HTML" === element[0].nodeName,
                    rootElementDetected = isMatchingElement(
                      element,
                      $rootElement
                    ),
                    parentAnimationDetected = !1,
                    parentHost = element.data(NG_ANIMATE_PIN_DATA);
                  parentHost && (parentElement = parentHost);
                  for (; parentElement && parentElement.length; ) {
                    rootElementDetected ||
                      (rootElementDetected = isMatchingElement(
                        parentElement,
                        $rootElement
                      ));
                    parentNode = parentElement[0];
                    if (parentNode.nodeType !== ELEMENT_NODE) break;
                    details = activeAnimationsLookup.get(parentNode) || {};
                    parentAnimationDetected ||
                      (parentAnimationDetected =
                        details.structural ||
                        disabledElementsLookup.get(parentNode));
                    if (
                      isUndefined(animateChildren) ||
                      !0 === animateChildren
                    ) {
                      value = parentElement.data(NG_ANIMATE_CHILDREN_DATA);
                      isDefined(value) && (animateChildren = value);
                    }
                    if (parentAnimationDetected && !1 === animateChildren)
                      break;
                    if (!rootElementDetected) {
                      rootElementDetected = isMatchingElement(
                        parentElement,
                        $rootElement
                      );
                      if (!rootElementDetected) {
                        parentHost = parentElement.data(NG_ANIMATE_PIN_DATA);
                        parentHost && (parentElement = parentHost);
                      }
                    }
                    bodyElementDetected ||
                      (bodyElementDetected = isMatchingElement(
                        parentElement,
                        bodyElement
                      ));
                    parentElement = parentElement.parent();
                  }
                  allowAnimation = !parentAnimationDetected || animateChildren;
                  return (
                    allowAnimation && rootElementDetected && bodyElementDetected
                  );
                }
                function markElementAnimationState(element, state, details) {
                  var node, oldValue, newValue;
                  details = details || {};
                  details.state = state;
                  node = getDomNode(element);
                  node.setAttribute(NG_ANIMATE_ATTR_NAME, state);
                  oldValue = activeAnimationsLookup.get(node);
                  newValue = oldValue ? extend(oldValue, details) : details;
                  activeAnimationsLookup.put(node, newValue);
                }
                var activeAnimationsLookup = new $$HashMap(),
                  disabledElementsLookup = new $$HashMap(),
                  animationsEnabled = null,
                  deregisterWatch = $rootScope.$watch(
                    function() {
                      return 0 === $templateRequest.totalPendingRequests;
                    },
                    function(isEmpty) {
                      if (!isEmpty) return;
                      deregisterWatch();
                      $rootScope.$$postDigest(function() {
                        $rootScope.$$postDigest(function() {
                          null === animationsEnabled &&
                            (animationsEnabled = !0);
                        });
                      });
                    }
                  ),
                  callbackRegistry = {},
                  classNameFilter = $animateProvider.classNameFilter(),
                  isAnimatableClassName = classNameFilter
                    ? function(className) {
                        return classNameFilter.test(className);
                      }
                    : function() {
                        return !0;
                      },
                  applyAnimationClasses = applyAnimationClassesFactory(
                    $$jqLite
                  );
                return {
                  on: function(event, container, callback) {
                    var node = extractElementNode(container);
                    callbackRegistry[event] = callbackRegistry[event] || [];
                    callbackRegistry[event].push({
                      node: node,
                      callback: callback
                    });
                  },
                  off: function(event, container, callback) {
                    var entries = callbackRegistry[event];
                    if (!entries) return;
                    callbackRegistry[event] =
                      1 === arguments.length
                        ? null
                        : (function(list, matchContainer, matchCallback) {
                            var containerNode = extractElementNode(
                              matchContainer
                            );
                            return list.filter(function(entry) {
                              return !(
                                entry.node === containerNode &&
                                (!matchCallback ||
                                  entry.callback === matchCallback)
                              );
                            });
                          })(entries, container, callback);
                  },
                  pin: function(element, parentElement) {
                    assertArg(isElement(element), "element", "not an element");
                    assertArg(
                      isElement(parentElement),
                      "parentElement",
                      "not an element"
                    );
                    element.data(NG_ANIMATE_PIN_DATA, parentElement);
                  },
                  push: function(element, event, options, domOperation) {
                    options = options || {};
                    options.domOperation = domOperation;
                    return queueAnimation(element, event, options);
                  },
                  enabled: function(element, bool) {
                    var hasElement,
                      node,
                      recordExists,
                      argCount = arguments.length;
                    if (0 === argCount) bool = !!animationsEnabled;
                    else {
                      hasElement = isElement(element);
                      if (hasElement) {
                        node = getDomNode(element);
                        recordExists = disabledElementsLookup.get(node);
                        if (1 === argCount) bool = !recordExists;
                        else {
                          bool = !!bool;
                          bool
                            ? recordExists &&
                              disabledElementsLookup.remove(node)
                            : disabledElementsLookup.put(node, !0);
                        }
                      } else bool = animationsEnabled = !!element;
                    }
                    return bool;
                  }
                };
              }
            ];
          }
        ];
        $$AnimateAsyncRunFactory = [
          "$$rAF",
          function($$rAF) {
            function waitForTick(fn) {
              waitQueue.push(fn);
              if (waitQueue.length > 1) return;
              $$rAF(function() {
                for (var i = 0; i < waitQueue.length; i++) waitQueue[i]();
                waitQueue = [];
              });
            }
            var waitQueue = [];
            return function() {
              var passed = !1;
              waitForTick(function() {
                passed = !0;
              });
              return function(callback) {
                passed ? callback() : waitForTick(callback);
              };
            };
          }
        ];
        $$AnimateRunnerFactory = [
          "$q",
          "$sniffer",
          "$$animateAsyncRun",
          function($q, $sniffer, $$animateAsyncRun) {
            function AnimateRunner(host) {
              this.setHost(host);
              this._doneCallbacks = [];
              this._runInAnimationFrame = $$animateAsyncRun();
              this._state = 0;
            }
            var INITIAL_STATE = 0,
              DONE_PENDING_STATE = 1,
              DONE_COMPLETE_STATE = 2;
            AnimateRunner.chain = function(chain, callback) {
              function next() {
                if (index === chain.length) {
                  callback(!0);
                  return;
                }
                chain[index](function(response) {
                  if (!1 === response) {
                    callback(!1);
                    return;
                  }
                  index++;
                  next();
                });
              }
              var index = 0;
              next();
            };
            AnimateRunner.all = function(runners, callback) {
              function onProgress(response) {
                status = status && response;
                ++count === runners.length && callback(status);
              }
              var count = 0,
                status = !0;
              forEach(runners, function(runner) {
                runner.done(onProgress);
              });
            };
            AnimateRunner.prototype = {
              setHost: function(host) {
                this.host = host || {};
              },
              done: function(fn) {
                this._state === DONE_COMPLETE_STATE
                  ? fn()
                  : this._doneCallbacks.push(fn);
              },
              progress: noop,
              getPromise: function() {
                if (!this.promise) {
                  var self = this;
                  this.promise = $q(function(resolve, reject) {
                    self.done(function(status) {
                      !1 === status ? reject() : resolve();
                    });
                  });
                }
                return this.promise;
              },
              then: function(resolveHandler, rejectHandler) {
                return this.getPromise().then(resolveHandler, rejectHandler);
              },
              catch: function(handler) {
                return this.getPromise().catch(handler);
              },
              finally: function(handler) {
                return this.getPromise().finally(handler);
              },
              pause: function() {
                this.host.pause && this.host.pause();
              },
              resume: function() {
                this.host.resume && this.host.resume();
              },
              end: function() {
                this.host.end && this.host.end();
                this._resolve(!0);
              },
              cancel: function() {
                this.host.cancel && this.host.cancel();
                this._resolve(!1);
              },
              complete: function(response) {
                var self = this;
                if (self._state === INITIAL_STATE) {
                  self._state = DONE_PENDING_STATE;
                  self._runInAnimationFrame(function() {
                    self._resolve(response);
                  });
                }
              },
              _resolve: function(response) {
                if (this._state !== DONE_COMPLETE_STATE) {
                  forEach(this._doneCallbacks, function(fn) {
                    fn(response);
                  });
                  this._doneCallbacks.length = 0;
                  this._state = DONE_COMPLETE_STATE;
                }
              }
            };
            return AnimateRunner;
          }
        ];
        $$AnimationProvider = [
          "$animateProvider",
          function($animateProvider) {
            function setRunner(element, runner) {
              element.data(RUNNER_STORAGE_KEY, runner);
            }
            function removeRunner(element) {
              element.removeData(RUNNER_STORAGE_KEY);
            }
            function getRunner(element) {
              return element.data(RUNNER_STORAGE_KEY);
            }
            var NG_ANIMATE_REF_ATTR = "ng-animate-ref",
              drivers = (this.drivers = []),
              RUNNER_STORAGE_KEY = "$$animationRunner";
            this.$get = [
              "$$jqLite",
              "$rootScope",
              "$injector",
              "$$AnimateRunner",
              "$$HashMap",
              "$$rAFScheduler",
              function(
                $$jqLite,
                $rootScope,
                $injector,
                $$AnimateRunner,
                $$HashMap,
                $$rAFScheduler
              ) {
                function sortAnimations(animations) {
                  function processNode(entry) {
                    var elementNode, parentNode, parentEntry;
                    if (entry.processed) return entry;
                    entry.processed = !0;
                    elementNode = entry.domNode;
                    parentNode = elementNode.parentNode;
                    lookup.put(elementNode, entry);
                    for (; parentNode; ) {
                      parentEntry = lookup.get(parentNode);
                      if (parentEntry) {
                        parentEntry.processed ||
                          (parentEntry = processNode(parentEntry));
                        break;
                      }
                      parentNode = parentNode.parentNode;
                    }
                    (parentEntry || tree).children.push(entry);
                    return entry;
                  }
                  var i,
                    animation,
                    tree = { children: [] },
                    lookup = new $$HashMap();
                  for (i = 0; i < animations.length; i++) {
                    animation = animations[i];
                    lookup.put(
                      animation.domNode,
                      (animations[i] = {
                        domNode: animation.domNode,
                        fn: animation.fn,
                        children: []
                      })
                    );
                  }
                  for (i = 0; i < animations.length; i++)
                    processNode(animations[i]);
                  return (function(tree) {
                    var i,
                      remainingLevelEntries,
                      nextLevelEntries,
                      row,
                      entry,
                      result = [],
                      queue = [];
                    for (i = 0; i < tree.children.length; i++)
                      queue.push(tree.children[i]);
                    remainingLevelEntries = queue.length;
                    nextLevelEntries = 0;
                    row = [];
                    for (i = 0; i < queue.length; i++) {
                      entry = queue[i];
                      if (remainingLevelEntries <= 0) {
                        remainingLevelEntries = nextLevelEntries;
                        nextLevelEntries = 0;
                        result.push(row);
                        row = [];
                      }
                      row.push(entry.fn);
                      entry.children.forEach(function(childEntry) {
                        nextLevelEntries++;
                        queue.push(childEntry);
                      });
                      remainingLevelEntries--;
                    }
                    row.length && result.push(row);
                    return result;
                  })(tree);
                }
                var animationQueue = [],
                  applyAnimationClasses = applyAnimationClassesFactory(
                    $$jqLite
                  );
                return function(element, event, options) {
                  function getAnchorNodes(node) {
                    var SELECTOR = "[" + NG_ANIMATE_REF_ATTR + "]",
                      items = node.hasAttribute(NG_ANIMATE_REF_ATTR)
                        ? [node]
                        : node.querySelectorAll(SELECTOR),
                      anchors = [];
                    forEach(items, function(node) {
                      var attr = node.getAttribute(NG_ANIMATE_REF_ATTR);
                      attr && attr.length && anchors.push(node);
                    });
                    return anchors;
                  }
                  function groupAnimations(animations) {
                    var usedIndicesLookup,
                      anchorGroups,
                      preparedAnimations = [],
                      refLookup = {};
                    forEach(animations, function(animation, index) {
                      var direction,
                        element = animation.element,
                        node = getDomNode(element),
                        event = animation.event,
                        enterOrMove = ["enter", "move"].indexOf(event) >= 0,
                        anchorNodes = animation.structural
                          ? getAnchorNodes(node)
                          : [];
                      if (anchorNodes.length) {
                        direction = enterOrMove ? "to" : "from";
                        forEach(anchorNodes, function(anchor) {
                          var key = anchor.getAttribute(NG_ANIMATE_REF_ATTR);
                          refLookup[key] = refLookup[key] || {};
                          refLookup[key][direction] = {
                            animationID: index,
                            element: jqLite(anchor)
                          };
                        });
                      } else preparedAnimations.push(animation);
                    });
                    usedIndicesLookup = {};
                    anchorGroups = {};
                    forEach(refLookup, function(operations, key) {
                      var index,
                        indexKey,
                        fromAnimation,
                        toAnimation,
                        lookupKey,
                        group,
                        from = operations.from,
                        to = operations.to;
                      if (!from || !to) {
                        index = from ? from.animationID : to.animationID;
                        indexKey = index.toString();
                        if (!usedIndicesLookup[indexKey]) {
                          usedIndicesLookup[indexKey] = !0;
                          preparedAnimations.push(animations[index]);
                        }
                        return;
                      }
                      fromAnimation = animations[from.animationID];
                      toAnimation = animations[to.animationID];
                      lookupKey = from.animationID.toString();
                      if (!anchorGroups[lookupKey]) {
                        group = anchorGroups[lookupKey] = {
                          structural: !0,
                          beforeStart: function() {
                            fromAnimation.beforeStart();
                            toAnimation.beforeStart();
                          },
                          close: function() {
                            fromAnimation.close();
                            toAnimation.close();
                          },
                          classes: cssClassesIntersection(
                            fromAnimation.classes,
                            toAnimation.classes
                          ),
                          from: fromAnimation,
                          to: toAnimation,
                          anchors: []
                        };
                        if (group.classes.length)
                          preparedAnimations.push(group);
                        else {
                          preparedAnimations.push(fromAnimation);
                          preparedAnimations.push(toAnimation);
                        }
                      }
                      anchorGroups[lookupKey].anchors.push({
                        out: from.element,
                        in: to.element
                      });
                    });
                    return preparedAnimations;
                  }
                  function cssClassesIntersection(a, b) {
                    var matches, i, aa, j;
                    a = a.split(" ");
                    b = b.split(" ");
                    matches = [];
                    for (i = 0; i < a.length; i++) {
                      aa = a[i];
                      if ("ng-" === aa.substring(0, 3)) continue;
                      for (j = 0; j < b.length; j++)
                        if (aa === b[j]) {
                          matches.push(aa);
                          break;
                        }
                    }
                    return matches.join(" ");
                  }
                  function invokeFirstDriver(animationDetails) {
                    var i, driverName, factory, driver;
                    for (i = drivers.length - 1; i >= 0; i--) {
                      driverName = drivers[i];
                      if (!$injector.has(driverName)) continue;
                      factory = $injector.get(driverName);
                      driver = factory(animationDetails);
                      if (driver) return driver;
                    }
                  }
                  function beforeStart() {
                    element.addClass(NG_ANIMATE_CLASSNAME);
                    tempClasses && $$jqLite.addClass(element, tempClasses);
                  }
                  function updateAnimationRunners(animation, newRunner) {
                    function update(element) {
                      getRunner(element).setHost(newRunner);
                    }
                    if (animation.from && animation.to) {
                      update(animation.from.element);
                      update(animation.to.element);
                    } else update(animation.element);
                  }
                  function handleDestroyedElement() {
                    var runner = getRunner(element);
                    !runner ||
                      ("leave" === event && options.$$domOperationFired) ||
                      runner.end();
                  }
                  function close(rejected) {
                    element.off("$destroy", handleDestroyedElement);
                    removeRunner(element);
                    applyAnimationClasses(element, options);
                    applyAnimationStyles(element, options);
                    options.domOperation();
                    tempClasses && $$jqLite.removeClass(element, tempClasses);
                    element.removeClass(NG_ANIMATE_CLASSNAME);
                    runner.complete(!rejected);
                  }
                  var isStructural, runner, classes, tempClasses;
                  options = prepareAnimationOptions(options);
                  isStructural = ["enter", "move", "leave"].indexOf(event) >= 0;
                  runner = new $$AnimateRunner({
                    end: function() {
                      close();
                    },
                    cancel: function() {
                      close(!0);
                    }
                  });
                  if (!drivers.length) {
                    close();
                    return runner;
                  }
                  setRunner(element, runner);
                  classes = mergeClasses(
                    element.attr("class"),
                    mergeClasses(options.addClass, options.removeClass)
                  );
                  tempClasses = options.tempClasses;
                  if (tempClasses) {
                    classes += " " + tempClasses;
                    options.tempClasses = null;
                  }
                  animationQueue.push({
                    element: element,
                    classes: classes,
                    event: event,
                    structural: isStructural,
                    options: options,
                    beforeStart: beforeStart,
                    close: close
                  });
                  element.on("$destroy", handleDestroyedElement);
                  if (animationQueue.length > 1) return runner;
                  $rootScope.$$postDigest(function() {
                    var groupedAnimations,
                      toBeSortedAnimations,
                      animations = [];
                    forEach(animationQueue, function(entry) {
                      getRunner(entry.element)
                        ? animations.push(entry)
                        : entry.close();
                    });
                    animationQueue.length = 0;
                    groupedAnimations = groupAnimations(animations);
                    toBeSortedAnimations = [];
                    forEach(groupedAnimations, function(animationEntry) {
                      toBeSortedAnimations.push({
                        domNode: getDomNode(
                          animationEntry.from
                            ? animationEntry.from.element
                            : animationEntry.element
                        ),
                        fn: function() {
                          var startAnimationFn,
                            closeFn,
                            targetElement,
                            operation,
                            animationRunner;
                          animationEntry.beforeStart();
                          closeFn = animationEntry.close;
                          targetElement = animationEntry.anchors
                            ? animationEntry.from.element ||
                              animationEntry.to.element
                            : animationEntry.element;
                          if (getRunner(targetElement)) {
                            operation = invokeFirstDriver(animationEntry);
                            operation && (startAnimationFn = operation.start);
                          }
                          if (startAnimationFn) {
                            animationRunner = startAnimationFn();
                            animationRunner.done(function(status) {
                              closeFn(!status);
                            });
                            updateAnimationRunners(
                              animationEntry,
                              animationRunner
                            );
                          } else closeFn();
                        }
                      });
                    });
                    $$rAFScheduler(sortAnimations(toBeSortedAnimations));
                  });
                  return runner;
                };
              }
            ];
          }
        ];
        angular
          .module("ngAnimate", [])
          .directive("ngAnimateChildren", $$AnimateChildrenDirective)
          .factory("$$rAFScheduler", $$rAFSchedulerFactory)
          .factory("$$AnimateRunner", $$AnimateRunnerFactory)
          .factory("$$animateAsyncRun", $$AnimateAsyncRunFactory)
          .provider("$$animateQueue", $$AnimateQueueProvider)
          .provider("$$animation", $$AnimationProvider)
          .provider("$animateCss", $AnimateCssProvider)
          .provider("$$animateCssDriver", $$AnimateCssDriverProvider)
          .provider("$$animateJs", $$AnimateJsProvider)
          .provider("$$animateJsDriver", $$AnimateJsDriverProvider);
      })(window, window.angular);
    }.apply(root, arguments);
  });
})(this);
(function(root) {
  define("ui-router/angular-ui-router", [], function() {
    return function() {
      "undefined" != typeof module &&
        "undefined" != typeof exports &&
        module.exports === exports &&
        (module.exports = "ui.router");
      (function(window, angular, undefined) {
        function inherit(parent, extra) {
          return extend(
            new (extend(function() {}, { prototype: parent }))(),
            extra
          );
        }
        function merge(dst) {
          forEach(arguments, function(obj) {
            obj !== dst &&
              forEach(obj, function(value, key) {
                dst.hasOwnProperty(key) || (dst[key] = value);
              });
          });
          return dst;
        }
        function ancestors(first, second) {
          var n,
            path = [];
          for (n in first.path) {
            if ("" === first.path[n]) continue;
            if (!second.path[n]) break;
            path.push(first.path[n]);
          }
          return path;
        }
        function arraySearch(array, value) {
          if (Array.prototype.indexOf)
            return array.indexOf(value, Number(arguments[2]) || 0);
          var len = array.length >>> 0,
            from = Number(arguments[2]) || 0;
          from = from < 0 ? Math.ceil(from) : Math.floor(from);
          from < 0 && (from += len);
          for (; from < len; from++)
            if (from in array && array[from] === value) return from;
          return -1;
        }
        function inheritParams(currentParams, newParams, $current, $to) {
          var parentParams,
            i,
            j,
            parents = ancestors($current, $to),
            inherited = {},
            inheritList = [];
          for (i in parents) {
            if (!parents[i].params || !parents[i].params.length) continue;
            parentParams = parents[i].params;
            for (j in parentParams) {
              if (arraySearch(inheritList, parentParams[j]) >= 0) continue;
              inheritList.push(parentParams[j]);
              inherited[parentParams[j]] = currentParams[parentParams[j]];
            }
          }
          return extend({}, inherited, newParams);
        }
        function normalize(keys, values) {
          var normalized = {};
          forEach(keys, function(name) {
            var value = values[name];
            normalized[name] = null != value ? String(value) : null;
          });
          return normalized;
        }
        function equalForKeys(a, b, keys) {
          var n, i, k;
          if (!keys) {
            keys = [];
            for (n in a) keys.push(n);
          }
          for (i = 0; i < keys.length; i++) {
            k = keys[i];
            if (a[k] != b[k]) return !1;
          }
          return !0;
        }
        function filterByKeys(keys, values) {
          var filtered = {};
          forEach(keys, function(name) {
            filtered[name] = values[name];
          });
          return filtered;
        }
        function $Resolve($q, $injector) {
          var VISIT_IN_PROGRESS = 1,
            VISIT_DONE = 2,
            NOTHING = {},
            NO_DEPENDENCIES = [],
            NO_LOCALS = NOTHING,
            NO_PARENT = extend($q.when(NOTHING), {
              $$promises: NOTHING,
              $$values: NOTHING
            });
          this.study = function(invocables) {
            function visit(value, key) {
              if (visited[key] === VISIT_DONE) return;
              cycle.push(key);
              if (visited[key] === VISIT_IN_PROGRESS) {
                cycle.splice(0, cycle.indexOf(key));
                throw new Error("Cyclic dependency: " + cycle.join(" -> "));
              }
              visited[key] = VISIT_IN_PROGRESS;
              if (isString(value))
                plan.push(
                  key,
                  [
                    function() {
                      return $injector.get(value);
                    }
                  ],
                  NO_DEPENDENCIES
                );
              else {
                var params = $injector.annotate(value);
                forEach(params, function(param) {
                  param !== key &&
                    invocables.hasOwnProperty(param) &&
                    visit(invocables[param], param);
                });
                plan.push(key, value, params);
              }
              cycle.pop();
              visited[key] = VISIT_DONE;
            }
            function isResolve(value) {
              return isObject(value) && value.then && value.$$promises;
            }
            if (!isObject(invocables))
              throw new Error("'invocables' must be an object");
            var plan = [],
              cycle = [],
              visited = {};
            forEach(invocables, visit);
            invocables = cycle = visited = null;
            return function(locals, parent, self) {
              function done() {
                if (!--wait) {
                  merged || merge(values, parent.$$values);
                  result.$$values = values;
                  result.$$promises = !0;
                  resolution.resolve(values);
                }
              }
              function fail(reason) {
                result.$$failure = reason;
                resolution.reject(reason);
              }
              var resolution, result, promises, values, wait, merged, i, ii;
              if (isResolve(locals) && self === undefined) {
                self = parent;
                parent = locals;
                locals = null;
              }
              if (locals) {
                if (!isObject(locals))
                  throw new Error("'locals' must be an object");
              } else locals = NO_LOCALS;
              if (parent) {
                if (!isResolve(parent))
                  throw new Error(
                    "'parent' must be a promise returned by $resolve.resolve()"
                  );
              } else parent = NO_PARENT;
              (resolution = $q.defer()),
                (result = resolution.promise),
                (promises = result.$$promises = {}),
                (values = extend({}, locals)),
                (wait = 1 + plan.length / 3),
                (merged = !1);
              if (isDefined(parent.$$failure)) {
                fail(parent.$$failure);
                return result;
              }
              if (parent.$$values) {
                merged = merge(values, parent.$$values);
                done();
              } else {
                extend(promises, parent.$$promises);
                parent.then(done, fail);
              }
              for (i = 0, ii = plan.length; i < ii; i += 3)
                locals.hasOwnProperty(plan[i])
                  ? done()
                  : (function(key, invocable, params) {
                      function onfailure(reason) {
                        invocation.reject(reason);
                        fail(reason);
                      }
                      function proceed() {
                        if (isDefined(result.$$failure)) return;
                        try {
                          invocation.resolve(
                            $injector.invoke(invocable, self, values)
                          );
                          invocation.promise.then(function(result) {
                            values[key] = result;
                            done();
                          }, onfailure);
                        } catch (e) {
                          onfailure(e);
                        }
                      }
                      var invocation = $q.defer(),
                        waitParams = 0;
                      forEach(params, function(dep) {
                        if (
                          promises.hasOwnProperty(dep) &&
                          !locals.hasOwnProperty(dep)
                        ) {
                          waitParams++;
                          promises[dep].then(function(result) {
                            values[dep] = result;
                            --waitParams || proceed();
                          }, onfailure);
                        }
                      });
                      waitParams || proceed();
                      promises[key] = invocation.promise;
                    })(plan[i], plan[i + 1], plan[i + 2]);
              return result;
            };
          };
          this.resolve = function(invocables, locals, parent, self) {
            return this.study(invocables)(locals, parent, self);
          };
        }
        function $TemplateFactory($http, $templateCache, $injector) {
          this.fromConfig = function(config, params, locals) {
            return isDefined(config.template)
              ? this.fromString(config.template, params)
              : isDefined(config.templateUrl)
                ? this.fromUrl(config.templateUrl, params)
                : isDefined(config.templateProvider)
                  ? this.fromProvider(config.templateProvider, params, locals)
                  : null;
          };
          this.fromString = function(template, params) {
            return isFunction(template) ? template(params) : template;
          };
          this.fromUrl = function(url, params) {
            isFunction(url) && (url = url(params));
            if (null == url) return null;
            var flag =
              url.indexOf(
                "//console-static.huaweicloud.com/static/framework/"
              ) >= 0;
            window.bussinessVersion && !flag
              ? (url = url)
              : window.frameworkVersion && flag && (url = url);
            return $http
              .get(url, { cache: $templateCache })
              .then(function(response) {
                return response.data;
              });
          };
          this.fromProvider = function(provider, params, locals) {
            return $injector.invoke(
              provider,
              null,
              locals || { params: params }
            );
          };
        }
        function UrlMatcher(pattern) {
          function addParameter(id) {
            if (!/^\w+(-+\w+)*$/.test(id))
              throw new Error(
                "Invalid parameter name '" +
                  id +
                  "' in pattern '" +
                  pattern +
                  "'"
              );
            if (names[id])
              throw new Error(
                "Duplicate parameter name '" +
                  id +
                  "' in pattern '" +
                  pattern +
                  "'"
              );
            names[id] = !0;
            params.push(id);
          }
          function quoteRegExp(string) {
            return string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
          }
          var m,
            id,
            regexp,
            segment,
            i,
            search,
            placeholder = /([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
            names = {},
            compiled = "^",
            last = 0,
            segments = (this.segments = []),
            params = (this.params = []);
          this.source = pattern;
          for (; (m = placeholder.exec(pattern)); ) {
            id = m[2] || m[3];
            regexp = m[4] || ("*" == m[1] ? ".*" : "[^/]*");
            segment = pattern.substring(last, m.index);
            if (segment.indexOf("?") >= 0) break;
            compiled += quoteRegExp(segment) + "(" + regexp + ")";
            addParameter(id);
            segments.push(segment);
            last = placeholder.lastIndex;
          }
          segment = pattern.substring(last);
          i = segment.indexOf("?");
          if (i >= 0) {
            search = this.sourceSearch = segment.substring(i);
            segment = segment.substring(0, i);
            this.sourcePath = pattern.substring(0, last + i);
            forEach(search.substring(1).split(/[&?]/), addParameter);
          } else {
            this.sourcePath = pattern;
            this.sourceSearch = "";
          }
          compiled += quoteRegExp(segment) + "$";
          segments.push(segment);
          this.regexp = new RegExp(compiled);
          this.prefix = segments[0];
        }
        function $UrlMatcherFactory() {
          this.compile = function(pattern) {
            return new UrlMatcher(pattern);
          };
          this.isMatcher = function(o) {
            return (
              isObject(o) &&
              isFunction(o.exec) &&
              isFunction(o.format) &&
              isFunction(o.concat)
            );
          };
          this.$get = function() {
            return this;
          };
        }
        function $UrlRouterProvider($urlMatcherFactory) {
          function regExpPrefix(re) {
            var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(
              re.source
            );
            return null != prefix ? prefix[1].replace(/\\(.)/g, "$1") : "";
          }
          function interpolate(pattern, match) {
            return pattern.replace(/\$(\$|\d{1,2})/, function(m, what) {
              return match["$" === what ? 0 : Number(what)];
            });
          }
          function handleIfMatch($injector, handler, match) {
            if (!match) return !1;
            var result = $injector.invoke(handler, handler, { $match: match });
            return !isDefined(result) || result;
          }
          var rules = [],
            otherwise = null;
          this.rule = function(rule) {
            if (!isFunction(rule)) throw new Error("'rule' must be a function");
            rules.push(rule);
            return this;
          };
          this.otherwise = function(rule) {
            if (isString(rule)) {
              var redirect = rule;
              rule = function() {
                return redirect;
              };
            } else if (!isFunction(rule))
              throw new Error("'rule' must be a function");
            otherwise = rule;
            return this;
          };
          this.when = function(what, handler) {
            var redirect,
              strategies,
              check,
              n,
              handlerIsString = isString(handler);
            isString(what) && (what = $urlMatcherFactory.compile(what));
            if (!handlerIsString && !isFunction(handler) && !isArray(handler))
              throw new Error("invalid 'handler' in when()");
            strategies = {
              matcher: function(what, handler) {
                if (handlerIsString) {
                  redirect = $urlMatcherFactory.compile(handler);
                  handler = [
                    "$match",
                    function($match) {
                      return redirect.format($match);
                    }
                  ];
                }
                return extend(
                  function($injector, $location) {
                    return handleIfMatch(
                      $injector,
                      handler,
                      what.exec($location.path(), $location.search())
                    );
                  },
                  { prefix: isString(what.prefix) ? what.prefix : "" }
                );
              },
              regex: function(what, handler) {
                if (what.global || what.sticky)
                  throw new Error("when() RegExp must not be global or sticky");
                if (handlerIsString) {
                  redirect = handler;
                  handler = [
                    "$match",
                    function($match) {
                      return interpolate(redirect, $match);
                    }
                  ];
                }
                return extend(
                  function($injector, $location) {
                    return handleIfMatch(
                      $injector,
                      handler,
                      what.exec($location.path())
                    );
                  },
                  { prefix: regExpPrefix(what) }
                );
              }
            };
            check = {
              matcher: $urlMatcherFactory.isMatcher(what),
              regex: what instanceof RegExp
            };
            for (n in check)
              if (check[n]) return this.rule(strategies[n](what, handler));
            throw new Error("invalid 'what' in when()");
          };
          this.$get = [
            "$location",
            "$rootScope",
            "$injector",
            function($location, $rootScope, $injector) {
              function update(evt) {
                function check(rule) {
                  var handled = rule($injector, $location);
                  if (handled) {
                    isString(handled) && $location.replace().url(handled);
                    return !0;
                  }
                  return !1;
                }
                if (evt && evt.defaultPrevented) return;
                var i,
                  n = rules.length;
                for (i = 0; i < n; i++) if (check(rules[i])) return;
                otherwise && check(otherwise);
              }
              $rootScope.$on("$locationChangeSuccess", update);
              return {
                sync: function() {
                  update();
                }
              };
            }
          ];
        }
        function $StateProvider(
          $urlRouterProvider,
          $urlMatcherFactory,
          $locationProvider
        ) {
          function isRelative(stateName) {
            return 0 === stateName.indexOf(".") || 0 === stateName.indexOf("^");
          }
          function findState(stateOrName, base) {
            var rel,
              i,
              pathLength,
              current,
              state,
              isStr = isString(stateOrName),
              name = isStr ? stateOrName : stateOrName.name;
            if (isRelative(name)) {
              if (!base)
                throw new Error(
                  "No reference point given for path '" + name + "'"
                );
              (rel = name.split(".")),
                (i = 0),
                (pathLength = rel.length),
                (current = base);
              for (; i < pathLength; i++) {
                if ("" === rel[i] && 0 === i) {
                  current = base;
                  continue;
                }
                if ("^" === rel[i]) {
                  if (!current.parent)
                    throw new Error(
                      "Path '" +
                        name +
                        "' not valid for state '" +
                        base.name +
                        "'"
                    );
                  current = current.parent;
                  continue;
                }
                break;
              }
              rel = rel.slice(i).join(".");
              name = current.name + (current.name && rel ? "." : "") + rel;
            }
            state = states[name];
            if (
              state &&
              (isStr ||
                (!isStr &&
                  (state === stateOrName || state.self === stateOrName)))
            )
              return state;
            return undefined;
          }
          function queueState(parentName, state) {
            queue[parentName] || (queue[parentName] = []);
            queue[parentName].push(state);
          }
          function registerState(state) {
            var name, parentName, key, i;
            state = inherit(state, {
              self: state,
              resolve: state.resolve || {},
              toString: function() {
                return this.name;
              }
            });
            name = state.name;
            if (!isString(name) || name.indexOf("@") >= 0)
              throw new Error("State must have a valid name");
            if (states.hasOwnProperty(name))
              throw new Error("State '" + name + "'' is already defined");
            parentName =
              -1 !== name.indexOf(".")
                ? name.substring(0, name.lastIndexOf("."))
                : isString(state.parent)
                  ? state.parent
                  : "";
            if (parentName && !states[parentName])
              return queueState(parentName, state.self);
            for (key in stateBuilder)
              isFunction(stateBuilder[key]) &&
                (state[key] = stateBuilder[key](
                  state,
                  stateBuilder.$delegates[key]
                ));
            states[name] = state;
            !state[abstractKey] &&
              state.url &&
              $urlRouterProvider.when(state.url, [
                "$match",
                "$stateParams",
                function($match, $stateParams) {
                  ($state.$current.navigable == state &&
                    equalForKeys($match, $stateParams)) ||
                    $state.transitionTo(state, $match, { location: !1 });
                }
              ]);
            if (queue[name])
              for (i = 0; i < queue[name].length; i++)
                registerState(queue[name][i]);
            return state;
          }
          function decorator(name, func) {
            if (isString(name) && !isDefined(func)) return stateBuilder[name];
            if (!isFunction(func) || !isString(name)) return this;
            stateBuilder[name] &&
              !stateBuilder.$delegates[name] &&
              (stateBuilder.$delegates[name] = stateBuilder[name]);
            stateBuilder[name] = func;
            return this;
          }
          function state(name, definition) {
            isObject(name) ? (definition = name) : (definition.name = name);
            registerState(definition);
            return this;
          }
          function $get(
            $rootScope,
            $q,
            $view,
            $injector,
            $resolve,
            $stateParams,
            $location,
            $urlRouter
          ) {
            function syncUrl() {
              if ($location.url() !== currentLocation) {
                $location.url(currentLocation);
                $location.replace();
              }
            }
            function resolveState(
              state,
              params,
              paramsAreFiltered,
              inherited,
              dst
            ) {
              var promises,
                $stateParams = paramsAreFiltered
                  ? params
                  : filterByKeys(state.params, params),
                locals = { $stateParams: $stateParams };
              dst.resolve = $resolve.resolve(
                state.resolve,
                locals,
                dst.resolve,
                state
              );
              promises = [
                dst.resolve.then(function(globals) {
                  dst.globals = globals;
                })
              ];
              inherited && promises.push(inherited);
              forEach(state.views, function(view, name) {
                var injectables =
                  view.resolve && view.resolve !== state.resolve
                    ? view.resolve
                    : {};
                injectables.$template = [
                  function() {
                    return (
                      $view.load(name, {
                        view: view,
                        locals: locals,
                        params: $stateParams,
                        notify: !1
                      }) || ""
                    );
                  }
                ];
                promises.push(
                  $resolve
                    .resolve(injectables, locals, dst.resolve, state)
                    .then(function(result) {
                      if (
                        isFunction(view.controllerProvider) ||
                        isArray(view.controllerProvider)
                      ) {
                        var injectLocals = angular.extend(
                          {},
                          injectables,
                          locals
                        );
                        result.$$controller = $injector.invoke(
                          view.controllerProvider,
                          null,
                          injectLocals
                        );
                      } else result.$$controller = view.controller;
                      result.$$state = state;
                      dst[name] = result;
                    })
                );
              });
              return $q.all(promises).then(function(values) {
                return dst;
              });
            }
            var TransitionSuperseded = $q.reject(
                new Error("transition superseded")
              ),
              TransitionPrevented = $q.reject(
                new Error("transition prevented")
              ),
              TransitionAborted = $q.reject(new Error("transition aborted")),
              TransitionFailed = $q.reject(new Error("transition failed")),
              currentLocation = $location.url();
            root.locals = { resolve: null, globals: { $stateParams: {} } };
            $state = {
              params: {},
              current: root.self,
              $current: root,
              transition: null
            };
            $state.reload = function() {
              $state.transitionTo($state.current, $stateParams, {
                reload: !0,
                inherit: !1,
                notify: !1
              });
            };
            $state.go = function(to, params, options) {
              return this.transitionTo(
                to,
                params,
                extend({ inherit: !0, relative: $state.$current }, options)
              );
            };
            $state.transitionTo = function(to, toParams, options) {
              var from,
                fromParams,
                fromPath,
                evt,
                toState,
                redirect,
                retryTransition,
                toPath,
                keep,
                state,
                locals,
                toLocals,
                resolved,
                l,
                transition;
              toParams = toParams || {};
              options = extend(
                {
                  location: !0,
                  inherit: !1,
                  relative: null,
                  notify: !0,
                  reload: !1,
                  $retry: !1
                },
                options || {}
              );
              (from = $state.$current),
                (fromParams = $state.params),
                (fromPath = from.path);
              toState = findState(to, options.relative);
              if (!isDefined(toState)) {
                redirect = { to: to, toParams: toParams, options: options };
                evt = $rootScope.$broadcast(
                  "$stateNotFound",
                  redirect,
                  from.self,
                  fromParams
                );
                if (evt.defaultPrevented) {
                  syncUrl();
                  return TransitionAborted;
                }
                if (evt.retry) {
                  if (options.$retry) {
                    syncUrl();
                    return TransitionFailed;
                  }
                  retryTransition = $state.transition = $q.when(evt.retry);
                  retryTransition.then(
                    function() {
                      if (retryTransition !== $state.transition)
                        return TransitionSuperseded;
                      redirect.options.$retry = !0;
                      return $state.transitionTo(
                        redirect.to,
                        redirect.toParams,
                        redirect.options
                      );
                    },
                    function() {
                      return TransitionAborted;
                    }
                  );
                  syncUrl();
                  return retryTransition;
                }
                to = redirect.to;
                toParams = redirect.toParams;
                options = redirect.options;
                toState = findState(to, options.relative);
                if (!isDefined(toState)) {
                  if (options.relative)
                    throw new Error(
                      "Could not resolve '" +
                        to +
                        "' from state '" +
                        options.relative +
                        "'"
                    );
                  throw new Error("No such state '" + to + "'");
                }
              }
              if (toState[abstractKey])
                throw new Error(
                  "Cannot transition to abstract state '" + to + "'"
                );
              options.inherit &&
                (toParams = inheritParams(
                  $stateParams,
                  toParams || {},
                  $state.$current,
                  toState
                ));
              to = toState;
              toPath = to.path;
              (locals = root.locals), (toLocals = []);
              for (
                keep = 0, state = toPath[keep];
                state &&
                state === fromPath[keep] &&
                equalForKeys(toParams, fromParams, state.ownParams) &&
                !options.reload;
                keep++, state = toPath[keep]
              )
                locals = toLocals[keep] = state.locals;
              if (shouldTriggerReload(to, from, locals, options)) {
                !1 !== to.self.reloadOnSearch && syncUrl();
                $state.transition = null;
                return $q.when($state.current);
              }
              toParams = normalize(to.params, toParams || {});
              if (options.notify) {
                evt = $rootScope.$broadcast(
                  "$stateChangeStart",
                  to.self,
                  toParams,
                  from.self,
                  fromParams
                );
                if (evt.defaultPrevented) {
                  syncUrl();
                  return TransitionPrevented;
                }
              }
              resolved = $q.when(locals);
              for (l = keep; l < toPath.length; l++, state = toPath[l]) {
                locals = toLocals[l] = inherit(locals);
                resolved = resolveState(
                  state,
                  toParams,
                  state === to,
                  resolved,
                  locals
                );
              }
              transition = $state.transition = resolved.then(
                function() {
                  var l, entering, exiting, toNav;
                  if ($state.transition !== transition)
                    return TransitionSuperseded;
                  for (l = fromPath.length - 1; l >= keep; l--) {
                    exiting = fromPath[l];
                    exiting.self.onExit &&
                      $injector.invoke(
                        exiting.self.onExit,
                        exiting.self,
                        exiting.locals.globals
                      );
                    exiting.locals = null;
                  }
                  for (l = keep; l < toPath.length; l++) {
                    entering = toPath[l];
                    entering.locals = toLocals[l];
                    entering.self.onEnter &&
                      $injector.invoke(
                        entering.self.onEnter,
                        entering.self,
                        entering.locals.globals
                      );
                  }
                  if ($state.transition !== transition)
                    return TransitionSuperseded;
                  $state.$current = to;
                  $state.current = to.self;
                  $state.params = toParams;
                  copy($state.params, $stateParams);
                  $state.transition = null;
                  toNav = to.navigable;
                  if (options.location && toNav) {
                    $location.url(
                      toNav.url.format(toNav.locals.globals.$stateParams)
                    );
                    "replace" === options.location && $location.replace();
                  }
                  options.notify &&
                    $rootScope.$broadcast(
                      "$stateChangeSuccess",
                      to.self,
                      toParams,
                      from.self,
                      fromParams
                    );
                  currentLocation = $location.url();
                  return $state.current;
                },
                function(error) {
                  if ($state.transition !== transition)
                    return TransitionSuperseded;
                  $state.transition = null;
                  $rootScope.$broadcast(
                    "$stateChangeError",
                    to.self,
                    toParams,
                    from.self,
                    fromParams,
                    error
                  );
                  syncUrl();
                  return $q.reject(error);
                }
              );
              return transition;
            };
            $state.is = function(stateOrName, params) {
              var state = findState(stateOrName);
              if (!isDefined(state)) return undefined;
              if ($state.$current !== state) return !1;
              return !isDefined(params) || angular.equals($stateParams, params);
            };
            $state.includes = function(stateOrName, params) {
              var validParams,
                state = findState(stateOrName);
              if (!isDefined(state)) return undefined;
              if (!isDefined($state.$current.includes[state.name])) return !1;
              validParams = !0;
              angular.forEach(params, function(value, key) {
                (isDefined($stateParams[key]) && $stateParams[key] === value) ||
                  (validParams = !1);
              });
              return validParams;
            };
            $state.href = function(stateOrName, params, options) {
              var state, nav, url;
              options = extend(
                {
                  lossy: !0,
                  inherit: !1,
                  absolute: !1,
                  relative: $state.$current
                },
                options || {}
              );
              state = findState(stateOrName, options.relative);
              if (!isDefined(state)) return null;
              params = inheritParams(
                $stateParams,
                params || {},
                $state.$current,
                state
              );
              nav = state && options.lossy ? state.navigable : state;
              url =
                nav && nav.url
                  ? nav.url.format(normalize(state.params, params || {}))
                  : null;
              !$locationProvider.html5Mode() &&
                url &&
                (url = "#" + $locationProvider.hashPrefix() + url);
              options.absolute &&
                url &&
                (url =
                  $location.protocol() +
                  "://" +
                  $location.host() +
                  (80 == $location.port() || 443 == $location.port()
                    ? ""
                    : ":" + $location.port()) +
                  (!$locationProvider.html5Mode() && url ? "/" : "") +
                  url);
              return url;
            };
            $state.get = function(stateOrName, context) {
              var list, state;
              if (!isDefined(stateOrName)) {
                list = [];
                forEach(states, function(state) {
                  list.push(state.self);
                });
                return list;
              }
              state = findState(stateOrName, context);
              return state && state.self ? state.self : null;
            };
            return $state;
          }
          function shouldTriggerReload(to, from, locals, options) {
            if (
              to === from &&
              ((locals === from.locals && !options.reload) ||
                !1 === to.self.reloadOnSearch)
            )
              return !0;
          }
          var $state,
            states = {},
            queue = {},
            abstractKey = "abstract",
            stateBuilder = {
              parent: function(state) {
                if (isDefined(state.parent) && state.parent)
                  return findState(state.parent);
                var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
                return compositeName ? findState(compositeName[1]) : root;
              },
              data: function(state) {
                state.parent &&
                  state.parent.data &&
                  (state.data = state.self.data = extend(
                    {},
                    state.parent.data,
                    state.data
                  ));
                return state.data;
              },
              url: function(state) {
                var url = state.url;
                if (isString(url)) {
                  if ("^" == url.charAt(0))
                    return $urlMatcherFactory.compile(url.substring(1));
                  return (state.parent.navigable || root).url.concat(url);
                }
                if ($urlMatcherFactory.isMatcher(url) || null == url)
                  return url;
                throw new Error(
                  "Invalid url '" + url + "' in state '" + state + "'"
                );
              },
              navigable: function(state) {
                return state.url
                  ? state
                  : state.parent
                    ? state.parent.navigable
                    : null;
              },
              params: function(state) {
                if (!state.params)
                  return state.url
                    ? state.url.parameters()
                    : state.parent.params;
                if (!isArray(state.params))
                  throw new Error("Invalid params in state '" + state + "'");
                if (state.url)
                  throw new Error(
                    "Both params and url specicified in state '" + state + "'"
                  );
                return state.params;
              },
              views: function(state) {
                var views = {};
                forEach(
                  isDefined(state.views) ? state.views : { "": state },
                  function(view, name) {
                    name.indexOf("@") < 0 && (name += "@" + state.parent.name);
                    views[name] = view;
                  }
                );
                return views;
              },
              ownParams: function(state) {
                var paramNames, ownParams;
                if (!state.parent) return state.params;
                paramNames = {};
                forEach(state.params, function(p) {
                  paramNames[p] = !0;
                });
                forEach(state.parent.params, function(p) {
                  if (!paramNames[p])
                    throw new Error(
                      "Missing required parameter '" +
                        p +
                        "' in state '" +
                        state.name +
                        "'"
                    );
                  paramNames[p] = !1;
                });
                ownParams = [];
                forEach(paramNames, function(own, p) {
                  own && ownParams.push(p);
                });
                return ownParams;
              },
              path: function(state) {
                return state.parent ? state.parent.path.concat(state) : [];
              },
              includes: function(state) {
                var includes = state.parent
                  ? extend({}, state.parent.includes)
                  : {};
                includes[state.name] = !0;
                return includes;
              },
              $delegates: {}
            },
            root = registerState({
              name: "",
              url: "^",
              views: null,
              abstract: !0
            });
          root.navigable = null;
          this.decorator = decorator;
          this.state = state;
          this.$get = $get;
          $get.$inject = [
            "$rootScope",
            "$q",
            "$view",
            "$injector",
            "$resolve",
            "$stateParams",
            "$location",
            "$urlRouter"
          ];
        }
        function $ViewProvider() {
          function $get($rootScope, $templateFactory) {
            return {
              load: function(name, options) {
                var result;
                options = extend(
                  {
                    template: null,
                    controller: null,
                    view: null,
                    locals: null,
                    notify: !0,
                    async: !0,
                    params: {}
                  },
                  options
                );
                options.view &&
                  (result = $templateFactory.fromConfig(
                    options.view,
                    options.params,
                    options.locals
                  ));
                result &&
                  options.notify &&
                  $rootScope.$broadcast("$viewContentLoading", options);
                return result;
              }
            };
          }
          this.$get = $get;
          $get.$inject = ["$rootScope", "$templateFactory"];
        }
        function $ViewDirective(
          $state,
          $compile,
          $controller,
          $injector,
          $anchorScroll
        ) {
          var $animator =
              !!$injector.has("$animator") && $injector.get("$animator"),
            viewIsUpdating = !1,
            directive = {
              restrict: "ECA",
              terminal: !0,
              priority: 1e3,
              transclude: !0,
              compile: function(element, attr, transclude) {
                return function(scope, element, attr) {
                  function updateView(doAnimate) {
                    var render,
                      link,
                      controller,
                      locals = $state.$current && $state.$current.locals[name];
                    if (locals === viewLocals) return;
                    render = renderer(animate && doAnimate);
                    render.remove(element);
                    if (viewScope) {
                      viewScope.$destroy();
                      viewScope = null;
                    }
                    if (!locals) {
                      viewLocals = null;
                      view.state = null;
                      return render.restore(initialView, element);
                    }
                    viewLocals = locals;
                    view.state = locals.$$state;
                    link = $compile(render.populate(locals.$template, element));
                    viewScope = scope.$new();
                    if (locals.$$controller) {
                      locals.$scope = viewScope;
                      controller = $controller(locals.$$controller, locals);
                      element
                        .children()
                        .data("$ngControllerController", controller);
                    }
                    link(viewScope);
                    viewScope.$emit("$viewContentLoaded");
                    onloadExp && viewScope.$eval(onloadExp);
                    $anchorScroll();
                  }
                  var viewScope,
                    viewLocals,
                    parent,
                    view,
                    eventHook,
                    name = attr[directive.name] || attr.name || "",
                    onloadExp = attr.onload || "",
                    animate = $animator && $animator(scope, attr),
                    initialView = transclude(scope),
                    renderer = function(doAnimate) {
                      return {
                        true: {
                          remove: function(element) {
                            animate.leave(element.contents(), element);
                          },
                          restore: function(compiled, element) {
                            animate.enter(compiled, element);
                          },
                          populate: function(template, element) {
                            var contents = angular
                              .element("<div></div>")
                              .html(template)
                              .contents();
                            animate.enter(contents, element);
                            return contents;
                          }
                        },
                        false: {
                          remove: function(element) {
                            element.html("");
                          },
                          restore: function(compiled, element) {
                            element.append(compiled);
                          },
                          populate: function(template, element) {
                            element.html(template);
                            return element.contents();
                          }
                        }
                      }[doAnimate.toString()];
                    };
                  element.append(initialView);
                  parent = element.parent().inheritedData("$uiView");
                  name.indexOf("@") < 0 &&
                    (name = name + "@" + (parent ? parent.state.name : ""));
                  view = { name: name, state: null };
                  element.data("$uiView", view);
                  eventHook = function() {
                    if (viewIsUpdating) return;
                    viewIsUpdating = !0;
                    try {
                      updateView(!0);
                    } catch (e) {
                      viewIsUpdating = !1;
                      throw e;
                    }
                    viewIsUpdating = !1;
                  };
                  scope.$on("$stateChangeSuccess", eventHook);
                  scope.$on("$viewContentLoading", eventHook);
                  updateView(!1);
                };
              }
            };
          return directive;
        }
        function parseStateRef(ref) {
          var parsed = ref
            .replace(/\n/g, " ")
            .match(/^([^(]+?)\s*(\((.*)\))?$/);
          if (!parsed || 4 !== parsed.length)
            throw new Error("Invalid state ref '" + ref + "'");
          return { state: parsed[1], paramExpr: parsed[3] || null };
        }
        function stateContext(el) {
          var stateData = el.parent().inheritedData("$uiView");
          if (stateData && stateData.state && stateData.state.name)
            return stateData.state;
        }
        function $StateRefDirective($state, $timeout) {
          return {
            restrict: "A",
            require: "?^uiSrefActive",
            link: function(scope, element, attrs, uiSrefActive) {
              var ref = parseStateRef(attrs.uiSref),
                params = null,
                base = stateContext(element) || $state.$current,
                isForm = "FORM" === element[0].nodeName,
                attr = isForm ? "action" : "href",
                nav = !0,
                update = function(newVal) {
                  newVal && (params = newVal);
                  if (!nav) return;
                  var newHref = $state.href(ref.state, params, {
                    relative: base
                  });
                  if (!newHref) {
                    nav = !1;
                    return !1;
                  }
                  element[0][attr] = newHref;
                  uiSrefActive &&
                    uiSrefActive.$$setStateInfo(ref.state, params);
                };
              if (ref.paramExpr) {
                scope.$watch(
                  ref.paramExpr,
                  function(newVal, oldVal) {
                    newVal !== params && update(newVal);
                  },
                  !0
                );
                params = scope.$eval(ref.paramExpr);
              }
              update();
              if (isForm) return;
              element.bind("click", function(e) {
                var button = e.which || e.button;
                if (
                  !(
                    (0 !== button && 1 != button) ||
                    e.ctrlKey ||
                    e.metaKey ||
                    e.shiftKey
                  )
                ) {
                  $timeout(function() {
                    scope.$apply(function() {
                      $state.go(ref.state, params, { relative: base });
                    });
                  });
                  e.preventDefault();
                }
              });
            }
          };
        }
        function $StateActiveDirective($state, $stateParams, $interpolate) {
          return {
            restrict: "A",
            controller: function($scope, $element, $attrs) {
              function update() {
                $state.$current.self === state && matchesParams()
                  ? $element.addClass(activeClass)
                  : $element.removeClass(activeClass);
              }
              function matchesParams() {
                return !params || equalForKeys(params, $stateParams);
              }
              var state, params, activeClass;
              activeClass = $interpolate($attrs.uiSrefActive || "", !1)($scope);
              this.$$setStateInfo = function(newState, newParams) {
                state = $state.get(newState, stateContext($element));
                params = newParams;
                update();
              };
              $scope.$on("$stateChangeSuccess", update);
            }
          };
        }
        function $RouteProvider($stateProvider, $urlRouterProvider) {
          function onEnterRoute($$state) {
            this.locals = $$state.locals.globals;
            this.params = this.locals.$stateParams;
          }
          function onExitRoute() {
            this.locals = null;
            this.params = null;
          }
          function when(url, route) {
            if (null != route.redirectTo) {
              var handler,
                redirect = route.redirectTo;
              if (isString(redirect)) handler = redirect;
              else {
                if (!isFunction(redirect))
                  throw new Error("Invalid 'redirectTo' in when()");
                handler = function(params, $location) {
                  return redirect(params, $location.path(), $location.search());
                };
              }
              $urlRouterProvider.when(url, handler);
            } else
              $stateProvider.state(
                inherit(route, {
                  parent: null,
                  name: "route:" + encodeURIComponent(url),
                  url: url,
                  onEnter: onEnterRoute,
                  onExit: onExitRoute
                })
              );
            routes.push(route);
            return this;
          }
          function $get($state, $rootScope, $routeParams) {
            function stateAsRoute(state) {
              return "" !== state.name ? state : undefined;
            }
            var $route = {
              routes: routes,
              params: $routeParams,
              current: undefined
            };
            $rootScope.$on("$stateChangeStart", function(
              ev,
              to,
              toParams,
              from,
              fromParams
            ) {
              $rootScope.$broadcast(
                "$routeChangeStart",
                stateAsRoute(to),
                stateAsRoute(from)
              );
            });
            $rootScope.$on("$stateChangeSuccess", function(
              ev,
              to,
              toParams,
              from,
              fromParams
            ) {
              $route.current = stateAsRoute(to);
              $rootScope.$broadcast(
                "$routeChangeSuccess",
                stateAsRoute(to),
                stateAsRoute(from)
              );
              copy(toParams, $route.params);
            });
            $rootScope.$on("$stateChangeError", function(
              ev,
              to,
              toParams,
              from,
              fromParams,
              error
            ) {
              $rootScope.$broadcast(
                "$routeChangeError",
                stateAsRoute(to),
                stateAsRoute(from),
                error
              );
            });
            return $route;
          }
          var routes = [];
          onEnterRoute.$inject = ["$$state"];
          this.when = when;
          this.$get = $get;
          $get.$inject = ["$state", "$rootScope", "$routeParams"];
        }
        var isDefined = angular.isDefined,
          isFunction = angular.isFunction,
          isString = angular.isString,
          isObject = angular.isObject,
          isArray = angular.isArray,
          forEach = angular.forEach,
          extend = angular.extend,
          copy = angular.copy;
        angular.module("ui.router.util", ["ng"]);
        angular.module("ui.router.router", ["ui.router.util"]);
        angular.module("ui.router.state", [
          "ui.router.router",
          "ui.router.util"
        ]);
        angular.module("ui.router", ["ui.router.state"]);
        angular.module("ui.router.compat", ["ui.router"]);
        $Resolve.$inject = ["$q", "$injector"];
        angular.module("ui.router.util").service("$resolve", $Resolve);
        $TemplateFactory.$inject = ["$http", "$templateCache", "$injector"];
        angular
          .module("ui.router.util")
          .service("$templateFactory", $TemplateFactory);
        UrlMatcher.prototype.concat = function(pattern) {
          return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch);
        };
        UrlMatcher.prototype.toString = function() {
          return this.source;
        };
        UrlMatcher.prototype.exec = function(path, searchParams) {
          var params,
            nTotal,
            nPath,
            values,
            i,
            m = this.regexp.exec(path);
          if (!m) return null;
          (params = this.params),
            (nTotal = params.length),
            (nPath = this.segments.length - 1),
            (values = {});
          if (nPath !== m.length - 1)
            throw new Error(
              "Unbalanced capture group in route '" + this.source + "'"
            );
          for (i = 0; i < nPath; i++) values[params[i]] = m[i + 1];
          for (; i < nTotal; i++) values[params[i]] = searchParams[params[i]];
          return values;
        };
        UrlMatcher.prototype.parameters = function() {
          return this.params;
        };
        UrlMatcher.prototype.format = function(values) {
          var nPath,
            nTotal,
            result,
            i,
            search,
            value,
            segments = this.segments,
            params = this.params;
          if (!values) return segments.join("");
          (nPath = segments.length - 1),
            (nTotal = params.length),
            (result = segments[0]);
          for (i = 0; i < nPath; i++) {
            value = values[params[i]];
            null != value && (result += encodeURIComponent(value));
            result += segments[i + 1];
          }
          for (; i < nTotal; i++) {
            value = values[params[i]];
            if (null != value) {
              result +=
                (search ? "&" : "?") +
                params[i] +
                "=" +
                encodeURIComponent(value);
              search = !0;
            }
          }
          return result;
        };
        angular
          .module("ui.router.util")
          .provider("$urlMatcherFactory", $UrlMatcherFactory);
        $UrlRouterProvider.$inject = ["$urlMatcherFactoryProvider"];
        angular
          .module("ui.router.router")
          .provider("$urlRouter", $UrlRouterProvider);
        $StateProvider.$inject = [
          "$urlRouterProvider",
          "$urlMatcherFactoryProvider",
          "$locationProvider"
        ];
        angular
          .module("ui.router.state")
          .value("$stateParams", {})
          .provider("$state", $StateProvider);
        $ViewProvider.$inject = [];
        angular.module("ui.router.state").provider("$view", $ViewProvider);
        $ViewDirective.$inject = [
          "$state",
          "$compile",
          "$controller",
          "$injector",
          "$anchorScroll"
        ];
        angular.module("ui.router.state").directive("uiView", $ViewDirective);
        $StateRefDirective.$inject = ["$state", "$timeout"];
        $StateActiveDirective.$inject = [
          "$state",
          "$stateParams",
          "$interpolate"
        ];
        angular
          .module("ui.router.state")
          .directive("uiSref", $StateRefDirective)
          .directive("uiSrefActive", $StateActiveDirective);
        $RouteProvider.$inject = ["$stateProvider", "$urlRouterProvider"];
        angular
          .module("ui.router.compat")
          .provider("$route", $RouteProvider)
          .directive("ngView", $ViewDirective);
      })(window, window.angular);
    }.apply(root, arguments);
  });
})(this);
define("app-remote/framework/directive/hwsDirective", [], function() {
  "use strict";
  function Point(x, y) {
    return { x: x, y: y, left: x, top: y };
  }
  $.fn.fixedPosition = function() {
    var offset = this.offset(),
      $doc = $(document),
      bodyOffset = $(document.body).offset();
    return new Point(
      offset.left - $doc.scrollLeft() + bodyOffset.left,
      offset.top - $doc.scrollTop() + bodyOffset.top
    );
  };
  var hwsModule = angular.module("hws", ["ng"]);
  hwsModule.directive("hwsHref", function() {
    return {
      priority: 100,
      link: function(scope, elem, attrs) {
        elem.bind("click", function() {
          var href = elem.attr("href");
          elem.attr("href", scope.genHWSHref(href));
        });
      }
    };
  });
  hwsModule.directive("refrenceHref", [
    "$rootScope",
    function($rootScope) {
      return {
        restrict: "A",
        scope: { refrence: "@" },
        priority: 100,
        link: function(scope, elem, attrs) {
          elem.bind("click", function() {
            var href = elem.attr("href");
            scope.refrence = scope.refrence || "";
            elem.attr(
              "href",
              $rootScope.genHWSHref(href, null, null, scope.refrence)
            );
          });
        }
      };
    }
  ]);
  hwsModule.directive("localeHref", function() {
    return {
      priority: 100,
      link: function(scope, elem, attrs) {
        elem.bind("click", function() {
          var href = elem.attr("href");
          elem.attr("href", scope.genHWSHref(href, "locale"));
        });
      }
    };
  });
  hwsModule.directive("localeLinkHref", function() {
    return {
      priority: 100,
      link: function(scope, elem, attrs) {
        elem.bind("click", function() {
          var hrefs,
            hrefPostfix,
            locale,
            href = elem.attr("href");
          if (!href || "" === href || "#" === href) return href;
          hrefs = href.split("#/");
          hrefPostfix = "";
          if (hrefs.length > 1) {
            hrefPostfix = "#/" + hrefs[1];
            if (-1 === hrefPostfix.indexOf("%26locale")) {
              hrefs[0] = hrefs[0] + "?locale=" + window.urlParams.lang;
              href = hrefs[0] + encodeURIComponent(hrefPostfix);
            }
          } else if (
            -1 !== hrefs[0].indexOf("?region=") &&
            -1 === hrefs[0].indexOf("%26locale")
          ) {
            locale = "&locale=" + window.urlParams.lang;
            href = hrefs[0] + encodeURIComponent(locale);
          }
          elem.attr("href", href);
        });
      }
    };
  });
  hwsModule.directive("shortcut", [
    "$rootScope",
    function($rootScope) {
      return {
        restrict: "EA",
        templateUrl: function() {
          return { url: "src/app/framework/views/consultMenu.html" }.url;
        },
        link: function($scope, $element) {
          $rootScope.consultAndFeedback = "zh-cn" === $rootScope.language;
          $rootScope.intelligentAndService = "zh-cn" === $rootScope.language;
          $rootScope.customerAndService = "zh-cn" === $rootScope.language;
          $scope.$watch(
            "localizationConfig",
            function(nv, ov) {
              $rootScope.localizationConfig &&
                $rootScope.localizationConfig.displayShortcut &&
                $element.show();
            },
            !0
          );
        }
      };
    }
  ]);
  hwsModule.directive("consoleDropdown", [
    "$rootScope",
    "$compile",
    function($rootScope, $compile) {
      return {
        restrict: "EA",
        scope: { region: "=" },
        link: function($scope, $element) {
          $scope.region &&
            $scope.region.projects &&
            $scope.region.projects.length > 0 &&
            $element.bind("mouseenter", function(event) {
              function hideSubMenu(event) {
                var relatedTarget =
                  event.relatedTarget && $(event.relatedTarget);
                if (
                  $("#" + domId).length > 0 &&
                  relatedTarget &&
                  relatedTarget.closest("#" + domId).length <= 0
                ) {
                  $("#" + domId).hide();
                  $("#" + domId).css({ height: "auto" });
                }
              }
              var copySubMenu,
                target = event.target && $(event.target).closest("li"),
                offset = target.fixedPosition(),
                width = target.outerWidth(),
                domId = (target.outerHeight(),
                "J_SubRegion_" + $scope.region.id + $scope.region.seqId),
                top = offset.top,
                left = offset.left + width,
                subMenu = target.find(".sub-dropdown-menu-region");
              $scope.projectName = $rootScope.projectName;
              if ($("#" + domId).length > 0)
                $("#" + domId)
                  .css({
                    left: left,
                    top: $(document).scrollTop() + top,
                    "z-index": 1e4
                  })
                  .show();
              else {
                copySubMenu = subMenu.clone();
                copySubMenu
                  .attr("id", domId)
                  .css({
                    left: left,
                    top: $(document).scrollTop() + top,
                    "z-index": 1e4
                  });
                copySubMenu.appendTo(document.body).show();
              }
              (function() {
                var windowsClientHeight = document.body.clientHeight,
                  projectTop =
                    parseInt($("#" + domId).css("top"), 10) -
                    parseInt($(document).scrollTop(), 10),
                  projectHeight = parseInt($("#" + domId).css("height"), 10),
                  projectMaxHeight = windowsClientHeight - projectTop - 34;
                projectMaxHeight < projectHeight &&
                  $("#" + domId).css({
                    height: projectMaxHeight,
                    "overflow-y": "scroll"
                  });
              })();
              $scope.$applyAsync();
              event.stopPropagation();
              target.bind("mouseleave", hideSubMenu);
              $("#" + domId).bind("mouseleave", hideSubMenu);
              $("#" + domId)
                .find(".J_Project")
                .bind("click", function(event) {
                  var target, projectName, projectDisabled;
                  event.stopPropagation();
                  target =
                    event.target &&
                    $(event.target) &&
                    $(event.target).closest(".J_Project");
                  projectName = target && target.attr("project-name");
                  projectDisabled = target && target.attr("project-disable");
                  if ("false" === projectDisabled && projectName) {
                    $rootScope.changeRegion(projectName);
                    $("#" + domId).length;
                  }
                });
              $(window).scroll(function(event) {
                $(window).scrollTop() &&
                  copySubMenu &&
                  copySubMenu.css({ top: $(document).scrollTop() + top });
              });
            });
        }
      };
    }
  ]);
  hwsModule.directive("regionTiledDropdown", [
    "$rootScope",
    "$compile",
    "$timeout",
    function($rootScope, $compile, $timeout) {
      return {
        restrict: "EA",
        scope: { selectAscription: "=", showRegions: "=" },
        link: function($scope, $element) {
          $element.children("a:eq(0)").bind("click", function(event) {
            var parentTarget, phoneticMenu, subMenu;
            $rootScope.selectAscription = $scope.selectAscription;
            parentTarget = $(event.target).parents(".region-tiled-menu");
            phoneticMenu = parentTarget.children(".phonetic-row");
            subMenu = parentTarget.children(".region-tiled-submenu");
            subMenu.css({ "min-height": parentTarget.height() });
            $timeout(function() {
              phoneticMenu.hide();
              subMenu.show();
            });
            $scope.$applyAsync();
            event.stopPropagation();
            $(document).on("click", function() {
              subMenu.hide();
            });
            $('[data-toggle="dropdown"]').on("click", function() {
              subMenu.hide();
              phoneticMenu.show();
            });
            $(".region-tiled-menu .submenu-back").bind("click", function(
              event
            ) {
              subMenu.hide();
              phoneticMenu.show();
              event.stopPropagation();
            });
          });
        }
      };
    }
  ]);
  hwsModule.directive("ngInclude", [
    "frameworkService",
    "$rootScope",
    function(frameworkService, $rootScope) {
      return {
        restrict: "A",
        link: function(scope, element, attr, ngModel) {
          scope.$on("$routeChangeSuccess", function() {
            frameworkService.setTipTopPadding();
          });
          $rootScope.$on("$stateChangeSuccess", function() {
            frameworkService.setTipTopPadding();
          });
          scope.$on("$includeContentLoaded", function(event) {
            frameworkService.setTipTopPadding();
          });
        }
      };
    }
  ]);
  hwsModule.directive("cfFeedback", [
    "$rootScope",
    "$timeout",
    "tiModal",
    "tiValid",
    "frameworkService",
    "msgService",
    function(
      $rootScope,
      $timeout,
      tiModal,
      tiValid,
      frameworkService,
      msgService
    ) {
      return {
        scope: { i18n: "=" },
        restrict: "EA",
        link: function($scope, $element) {
          function openFeedback() {
            $scope.feedbackContent = "";
            $scope.btnOK.disable = !0;
            $scope.feedbackModalInstance = tiModal.open({
              templateUrl: $rootScope.feedback.url,
              scope: $scope,
              closeOnEsc: !0,
              draggable: !0,
              modalClass: "feedback-dialog-show"
            });
            $scope.feedbackModalInstance.resultPromise.then(
              function(data) {
                $rootScope.isModalOpened = !1;
              },
              function(reason) {
                $rootScope.isModalOpened = !1;
              }
            );
          }
          $("#J_FeedbackContent");
          $rootScope.isModalOpened = !1;
          $scope.feedbackContent = "";
          $scope.maxContentLength = 400;
          $scope.btnOK = {
            disable: !0,
            click: function() {
              if ($scope.btnOK.disable) return;
              if (!$scope.feedbackContent) return;
              if ($scope.feedbackContent.length > $scope.maxContentLength)
                return;
              var createFeedback = {
                feedbackType: "",
                sourceId: "Console",
                contactNumber: "",
                serviceType: $rootScope.currentService,
                feedbackContent: $scope.feedbackContent
              };
              frameworkService.createIncidentInfo(createFeedback).then(
                function(data) {
                  msgService.alert(
                    "success",
                    $rootScope.i18n.console_term_feedback_button_submit_success
                  );
                  $scope.feedbackModalInstance.close();
                },
                function(jqXHR) {
                  msgService.alert(
                    "error",
                    $rootScope.i18n.console_term_feedback_button_submit_failure
                  );
                }
              );
            }
          };
          $scope.btnCancel = function() {
            $scope.feedbackModalInstance.dismiss();
            $scope.btnOK.disable = !1;
          };
          $element.on("click", function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($rootScope.isModalOpened) return;
            $rootScope.isModalOpened = !0;
            $rootScope.cfShowMenuItemHideOtherMenu();
            openFeedback();
          });
          $scope.textKeyup = function(e) {
            var target = e.target;
            if (target) {
              if (!target.value.trim()) {
                $scope.btnOK.disable = !0;
                $scope.feedbackContent = "";
                return !1;
              }
              $scope.feedbackContent = target.value;
              if (target.value.length > $scope.maxContentLength) {
                $scope.btnOK.disable = !0;
                e.preventDefault();
                return !1;
              }
              $scope.btnOK.disable = !1;
            }
          };
        }
      };
    }
  ]);
  hwsModule.directive("traceLog", [
    "frameworkService",
    "$rootScope",
    "$window",
    function(frameworkService, $rootScope, $window) {
      return {
        restrict: "A",
        link: function(scope, element, attr, ngModel) {
          function getTopAndHeight() {
            var top, height;
            top =
              $("#frame-os-check").length > 0
                ? $("#frame-os-check").height() + $("#service-menus").height()
                : $("#frame-suspended-check").length > 0
                  ? $("#frame-suspended-check").height() +
                    $("#service-menus").height()
                  : $("#service-menus").height();
            height = $("body").height() - top - $("#service-footer").height();
            return { top: top, height: height };
          }
          scope.showLogLayout = function() {
            var topHeight = getTopAndHeight();
            element
              .find(".J_TraceContainer")
              .css({
                top: topHeight.top + "px",
                height: topHeight.height + "px"
              })
              .addClass("trace-open");
            $rootScope.isShowLogLayout = !0;
            return !0;
          };
          scope.hideLogLayout = function() {
            $rootScope.isShowLogLayout = !1;
            return !1;
          };
          angular.element($window).bind("resize", function() {
            var topHeight = getTopAndHeight();
            element
              .find(".J_TraceContainer")
              .css({
                top: topHeight.top + "px !important",
                height: topHeight.height + "px"
              });
          });
        }
      };
    }
  ]);
  hwsModule.directive("customHeadMenu", [
    "frameworkService",
    "$rootScope",
    "$window",
    function(frameworkService, $rootScope, $window) {
      return {
        restrict: "EA",
        templateUrl: function() {
          return { url: "src/app/framework/views/appendCustomLeftMenu.html" }
            .url;
        },
        link: function($scope, $element) {}
      };
    }
  ]);
  hwsModule.directive("customHeadLogo", [
    "frameworkService",
    "$rootScope",
    "$window",
    function(frameworkService, $rootScope, $window) {
      return {
        restrict: "EA",
        template:
          '<a class="pull-left custom-logo"  ng-href="{{headLogo.href}}" target="_blank" meta-data-uba="www_v1_framework.click.customLogo"></a><span ng-if="headLogo.href" class="pull-left console-menu-home-custom" ></span>  <a ng-if="headLogo.url"  locale-href ng-href="{{links.portal_common}}" class="console-menu-custom-logo pull-left" style="margin-left:17px;" target="_blank" meta-data-uba="www_v1_framework.click.headLogo"></a>',
        link: function($scope, $element) {
          $rootScope.$watch("headLogo", function() {
            $rootScope.headLogo &&
              $element
                .find(".custom-logo")
                .css({
                  display: "block",
                  width: "83px",
                  height: "50px",
                  background:
                    "url(" + $rootScope.headLogo.url + ") no-repeat left center"
                });
          });
        }
      };
    }
  ]);
  hwsModule.directive("userInfoTpl", [
    "frameworkService",
    "$rootScope",
    "$window",
    function(frameworkService, $rootScope, $window) {
      return {
        restrict: "EA",
        templateUrl: function() {
          return { url: "src/app/framework/views/userInfoTpl.html" }.url;
        },
        compile: function(scope, element, attrs) {
          function removeItemClass(item) {
            $("#" + item).hasClass("menu-largeScreen") &&
              $("#" + item).removeClass("menu-largeScreen");
            $("#" + item).hasClass("menu-smallScreen") &&
              $("#" + item).removeClass("menu-smallScreen");
          }
          function getSmallScreenId(hideContentList) {
            var hideContent;
            if (-1 !== hideContentList.toString().indexOf("SmallScreen"))
              return hideContentList;
            hideContent = hideContentList;
            hideContentList.forEach(function(item) {
              hideContent.push(item + "SmallScreen");
            });
            return hideContent;
          }
          $rootScope.$watchGroup(
            [
              "linksInterfaceFlag",
              "userCustomizationContentResolveFlag",
              "realNameAuthOk",
              "BusinessManagementIsOpen",
              "isLoginUserFlag",
              "hasAssumeRoleFlag",
              "isVendorSubUser",
              "isvManagementIsOpen",
              "changeDistributorByResize"
            ],
            function() {
              !angular.isUndefined($rootScope.userHideContent) &&
                $rootScope.userHideContent.length > 0 &&
                ($rootScope.userHideContent = getSmallScreenId(
                  $rootScope.userHideContent
                ));
              !angular.isUndefined($rootScope.userHideUserContent) &&
                $rootScope.userHideUserContent.length > 0 &&
                ($rootScope.userHideUserContent = getSmallScreenId(
                  $rootScope.userHideUserContent
                ));
              !angular.isUndefined($rootScope.hideResourcesList) &&
                $rootScope.hideResourcesList.length > 0 &&
                ($rootScope.hideResourcesList = getSmallScreenId(
                  $rootScope.hideResourcesList
                ));
              if (
                !0 === $rootScope.userCustomizationContentResolveFlag &&
                !0 === $rootScope.linksInterfaceFlag &&
                $rootScope.links
              ) {
                !angular.isUndefined($rootScope.userHideContent) &&
                  $rootScope.userHideContent.length > 0 &&
                  $rootScope.userHideContent.forEach(function(item) {
                    removeItemClass(item);
                    "headerWorkOrderSmallScreen" === item &&
                      ($rootScope.workConfigFlag = !0);
                    $("#" + item).css({ display: "none" });
                  });
                !angular.isUndefined($rootScope.hideResourcesList) &&
                  $rootScope.hideResourcesList.length > 0 &&
                  $rootScope.hideResourcesList.forEach(function(item) {
                    removeItemClass(item);
                    $("#" + item).css({ display: "none" });
                  });
                !angular.isUndefined($rootScope.userHideUserContent) &&
                  $rootScope.userHideUserContent.length > 0 &&
                  $rootScope.userHideUserContent.forEach(function(item) {
                    removeItemClass(item);
                    "userChangeRoleItem" === item &&
                      $("#userChangeSubRoleItem").css({ display: "none" });
                    $("#" + item).css({ display: "none" });
                  });
              }
            }
          );
        }
      };
    }
  ]);
  hwsModule.directive("favoriteShowView", [
    "frameworkService",
    "$rootScope",
    "$window",
    "$timeout",
    function(frameworkService, $rootScope, $window, $timeout) {
      return {
        restrict: "EA",
        scope: { onChanged: "&" },
        template:
          '<span><span class="pull-left padding-left-5" ng-bind="collectTip"></span>  <span class="hwsicon-frame-image-caret menu-hwsicon-frame-main-caret console-topbar-fixed-width-div"></span></span>',
        replace: !0,
        link: function($scope, $element) {
          $rootScope.showCustomFavoriteMenu = function() {
            var top, serviceContent;
            if (
              !$rootScope.localizationConfig.newHECMenu ||
              $rootScope.localizationConfig.isCMC
            )
              return;
            top = document.getElementById("service-menus").style.top;
            top &&
              $timeout(function() {
                var offset = parseInt(top, 10) + 50 + "px";
                $(".frame-favorite-service-list-options").css({ top: offset });
              }, 10);
            $rootScope.cfShowMenuItemHideOtherMenu(
              "frame-favorite-service-list"
            );
            $(".custom-favorite-menu").show();
            serviceContent = $("#service-content");
            serviceContent.css(
              "padding-top",
              parseInt($("#service-menus").css("top"), 10) + 90 + "px"
            );
            $(".framework-scrolling").css(
              "cssText",
              "top: " +
                (parseInt($("#service-menus").css("top"), 10) + 90) +
                "px !important"
            );
            $rootScope.$broadcast("cfNewTopAndHeight");
            $scope.onChanged({ value: !0 });
          };
          $scope.collectTip = $rootScope.i18n.console_term_collect_tip;
        }
      };
    }
  ]);
  hwsModule.directive("favoriteHideView", [
    "frameworkService",
    "$rootScope",
    "$window",
    function(frameworkService, $rootScope, $window) {
      return {
        restrict: "EA",
        template:
          '<span class="pull-left padding-left-5" ng-bind="collectTip"></span>  <span class="hwsicon-frame-image-caret-up menu-hwsicon-frame-main-caret console-topbar-fixed-width-div"></span>',
        link: function($scope, $element) {
          $rootScope.hideCustomFavoriteMenu = function() {
            if (!$rootScope.localizationConfig.newHECMenu) return;
            $(".custom-favorite-menu").hide();
            $(".frame-favorite-service-list .console-topbar-btn").show();
            $(".frame-favorite-service-list .console-topbar-btn-click").hide();
            $("#service-content").css(
              "padding-top",
              parseInt($("#service-menus").css("top"), 10) + 50 + "px"
            );
            $(".framework-scrolling").css(
              "cssText",
              "top: " +
                (parseInt($("#service-menus").css("top"), 10) + 50) +
                "px !important"
            );
            $rootScope.$broadcast("cfNewTopAndHeight");
          };
          $scope.collectTip = $rootScope.i18n.console_term_collect_tip;
        }
      };
    }
  ]);
  hwsModule.directive("workOderManagement", [
    "$rootScope",
    function($rootScope) {
      return {
        restrict: "EA",
        templateUrl: function() {
          return { url: "src/app/framework/views/workOrder.html" }.url;
        },
        scope: !0,
        replace: !0,
        link: function($scope, $element) {
          $rootScope.$watch("cfScreenFlag", function() {
            if (!0 === $rootScope.cfScreenFlag) {
              $scope.myWorkOrder = { number: "myWorkOrderSmallScreen" };
              $scope.newWorkOrder = { number: "newWorkOrderSmallScreen" };
            } else if (!1 === $rootScope.cfScreenFlag) {
              $scope.myWorkOrder = { number: "myWorkOrder" };
              $scope.newWorkOrder = { number: "newWorkOrder" };
            }
          });
        }
      };
    }
  ]);
  hwsModule.directive("frameworkrepeatFinished", function($rootScope) {
    return {
      restrict: "A",
      link: function(scope) {
        !0 === scope.$last &&
          scope.$watch("serviceEndpointsFlag", function() {
            !0 === $rootScope.serviceEndpointsFlag &&
              $rootScope.serviceEndpoints &&
              $rootScope.serviceEndpoints.length > 0 &&
              scope.$emit("waterfall:frameworkrepeatFinished");
          });
      }
    };
  });
  hwsModule.directive("collectWaterfall", function(
    $window,
    $document,
    $rootScope
  ) {
    return {
      restrict: "A",
      scope: { contentWidth: "@", cols: "@" },
      link: function(scope, element) {
        function getMinKeyByArray(arr) {
          var k,
            val = arr[0],
            key = 0;
          for (k in arr)
            if (arr[k] < val) {
              val = arr[k];
              key = k;
            }
          return key;
        }
        $(window).resize(function() {
          $rootScope.collectWaterfall();
        });
        $rootScope.$on("waterfall:frameworkrepeatFinished", function() {
          !0 === $rootScope.serviceEndpointsFlag &&
            $rootScope.serviceEndpoints &&
            $rootScope.serviceEndpoints.length > 0 &&
            $rootScope.collectWaterfall();
        });
        $rootScope.collectWaterfall = function() {
          var containerWidth,
            oLis,
            minCols,
            colWidth,
            currentClos,
            m,
            i,
            h,
            k,
            index,
            sorted;
          !0 === window.tiny.utils.browser.ie &&
          9 !== document.documentMode &&
          document.body.scrollHeight > document.body.offsetHeight
            ? $(".favorite-modal-service-list").css({
                "margin-right": "17px",
                height:
                  $("#service-footer").offset().top -
                  $(".favorite-modal-service-list").offset().top +
                  "px"
              })
            : $(".favorite-modal-service-list").css({
                "margin-right": "0px",
                height:
                  $("#service-footer").offset().top -
                  $(".favorite-modal-service-list").offset().top +
                  "px"
              });
          containerWidth =
            window.innerWidth > 1440 ? "1400px" : window.innerWidth - 40 + "px";
          $(".favorite-modal-service-list-content").css({
            width: containerWidth
          });
          element[0].style.width = containerWidth;
          oLis = element.find(".favorite-modal-catalog");
          if (oLis.length > 0) {
            scope.oLiHeight = [];
            minCols = 5;
            colWidth = (scope.contentWidth || element[0].offsetWidth) / minCols;
            currentClos = minCols;
            for (m = 0; m < oLis.length; m++)
              oLis[m].style.width = colWidth + "px";
            oLis.length < minCols && (currentClos = oLis.length);
            for (i = 0; i < currentClos; i++) {
              oLis[i].style.top = 0;
              oLis[i].style.left = 30 + i * colWidth + "px";
              h = parseInt(oLis[i].offsetHeight, 10);
              scope.oLiHeight.push(h);
            }
            for (k = minCols; k < oLis.length; k++) {
              index = getMinKeyByArray(scope.oLiHeight);
              oLis[k].style.top = scope.oLiHeight[index] + "px";
              oLis[k].style.left = 30 + colWidth * index + "px";
              scope.oLiHeight[index] =
                scope.oLiHeight[index] + parseInt(oLis[k].offsetHeight, 10);
            }
            scope.$emit("waterfall:colData", scope.oLiHeight);
            sorted = scope.oLiHeight.sort(function(a, b) {
              return a - b;
            });
            element[0].style.height = sorted[sorted.length - 1] + "px";
          }
        };
      }
    };
  });
  hwsModule.directive("serviceWaterfall", function(
    $window,
    $document,
    $rootScope
  ) {
    return {
      restrict: "A",
      scope: { contentWidth: "@", cols: "@" },
      link: function(scope, element) {
        function getMinKeyByArray(arr) {
          var k,
            val = arr[0],
            key = 0;
          for (k in arr)
            if (arr[k] < val) {
              val = arr[k];
              key = k;
            }
          return key;
        }
        $(".console-menu-service-link,.favorite-service-list-menu").on(
          "click",
          function() {
            $rootScope.serviceListWaterfall();
          }
        );
        $rootScope.$on("waterfall:frameworkrepeatFinished", function() {
          $rootScope.serviceListWaterfall();
        });
        $rootScope.serviceListWaterfall = function() {
          var oLis = element.find(".service-list-submen-all-service");
          window.setTimeout(function() {
            var innerWidthParam,
              minCols,
              colWidth,
              currentClos,
              m,
              i,
              offHeight,
              k,
              index,
              sorted;
            if (oLis.length > 0) {
              scope.oLiHeight = [];
              innerWidthParam = $window.innerWidth;
              minCols = 0;
              minCols =
                innerWidthParam > 1440
                  ? scope.cols
                  : innerWidthParam > 1366 && innerWidthParam <= 1440
                    ? 4
                    : 3;
              colWidth =
                (scope.contentWidth || element[0].offsetWidth) / minCols;
              currentClos = minCols;
              for (m = 0; m < oLis.length; m++)
                oLis[m].style.width = colWidth + "px";
              oLis.length < minCols && (currentClos = oLis.length);
              for (i = 0; i < currentClos; i++) {
                oLis[i].style.top = 0;
                oLis[i].style.left = i * colWidth + "px";
                offHeight = parseInt(oLis[i].offsetHeight, 10);
                scope.oLiHeight.push(offHeight);
              }
              for (k = minCols; k < oLis.length; k++) {
                index = getMinKeyByArray(scope.oLiHeight);
                oLis[k].style.top = scope.oLiHeight[index] + "px";
                oLis[k].style.left = colWidth * index + "px";
                scope.oLiHeight[index] =
                  scope.oLiHeight[index] + parseInt(oLis[k].offsetHeight, 10);
              }
              scope.$emit("waterfall:colData", scope.oLiHeight);
              sorted = scope.oLiHeight.sort(function(a, b) {
                return a - b;
              });
              element[0].style.height = sorted[sorted.length - 1] + "px";
            }
          }, 10);
        };
      }
    };
  });
  hwsModule.directive("frameworkDropdownServiceList", function(
    $window,
    $document,
    $rootScope,
    $compile
  ) {
    return {
      restrict: "E",
      templateUrl: function() {
        return { url: "src/app/framework/views/serviceList.html" }.url;
      },
      scope: { options: "=?" },
      link: function(scope, element, attrs) {
        function initServiceList(list) {
          !0 === window.tiny.utils.browser.ie &&
          9 !== document.documentMode &&
          document.body.scrollHeight > document.body.offsetHeight
            ? $(".framework-dropdown-menu-service-list").css({
                "margin-right": "17px",
                height:
                  $("#service-footer").offset().top -
                  $("#service-menus").height() -
                  $("#service-menus").offset().top +
                  "px"
              })
            : $(".framework-dropdown-menu-service-list").css({
                "margin-right": "0",
                height:
                  $("#service-footer").offset().top -
                  $("#service-menus").height() -
                  $("#service-menus").offset().top +
                  "px"
              });
          list[0] &&
            list[0].endpoints &&
            list[0].endpoints.length > 0 &&
            (function(item) {
              var index,
                containerWidth =
                  window.innerWidth - 40 > 1480 ? 1480 : window.innerWidth - 40,
                containerPaddingWidth =
                  window.innerWidth - 40 > 1480
                    ? (window.innerWidth - containerWidth) / 2
                    : 0,
                cols = 5,
                $catalogWidth = (containerWidth / cols).toFixed(2),
                newWidth = $catalogWidth - 20 - 30 - 80;
              $(".servicelist-all-service-content").css({
                width: containerWidth + "px",
                left: containerPaddingWidth + "px",
                rigth: containerPaddingWidth + "px",
                position: "inherit",
                height: 40 * item.endpoints.length + 80 + "px"
              });
              $(".servicelist-all-service-content").empty();
              heightMap = {};
              index = 0;
              item.endpoints &&
                item.endpoints.forEach(function(row, i) {
                  var topPx,
                    rowHeigth,
                    minIndex,
                    key,
                    width,
                    endpoints,
                    html,
                    list = [],
                    left = 0,
                    heigthList = [],
                    colsindex = Math.ceil((i + 1) / cols),
                    minHeight = 0;
                  if (1 === colsindex) {
                    topPx = "0px";
                    rowHeigth = 33 * row.endpoints.length + 30 + 24;
                    heightMap[i] = { height: rowHeigth };
                    heigthList.push(rowHeigth);
                    left = index * $catalogWidth + 0 + "px";
                    index++;
                  } else {
                    index === cols && (index = 0);
                    minIndex = 0;
                    for (key in heightMap)
                      if (0 === minHeight) {
                        minHeight = heightMap[key].height;
                        minIndex = key;
                      } else if (minHeight > heightMap[key].height) {
                        minIndex = key;
                        minHeight = heightMap[key].height;
                      }
                    left = minIndex * $catalogWidth + 0 + "px";
                    topPx = minHeight + "px";
                    heightMap[minIndex].height =
                      heightMap[minIndex].height +
                      33 * row.endpoints.length +
                      30 +
                      24;
                    index++;
                  }
                  width = $catalogWidth + "px";
                  list.push(
                    '<div id="categlog_' +
                      i +
                      '" class="servicelist-all-catalog" style="top:' +
                      topPx +
                      ";left:" +
                      left +
                      ";width:" +
                      width +
                      ';">'
                  );
                  list.push(
                    '<div class="catalog-title-for-banner"><span>' +
                      row.catalog +
                      "</span></div>"
                  );
                  endpoints = row.endpoints || [];
                  endpoints.forEach(function(endpoint) {
                    list.push(
                      '<div class="catalog-service-for-banner"><a hws-href href="{{\'' +
                        endpoint.endpoint +
                        "'}}\" ng-click=\"currentSelectedService('" +
                        endpoint.endpoint +
                        "','" +
                        endpoint.id +
                        '\')" meta-data-uba="www_v1_framework.click.' +
                        endpoint.name +
                        '_all"><div><span id="serviceId_' +
                        endpoint.seq_id +
                        '" title="' +
                        endpoint.name +
                        '"class="framework-text-endpoint framework-text-over-flow-hidden-' +
                        endpoint.seq_id +
                        "\" ng-class=\"{'framework-text-over-flow-hidden':" +
                        endpoint.showNew +
                        '}" style="float:left;">' +
                        endpoint.name +
                        "</span>"
                    );
                    $rootScope.localizationConfig.showNewSwitch &&
                      endpoint.showNew &&
                      list.push(
                        '<span class="icon-cloud-new-1 word-new-css"></span>'
                      );
                    list.push(
                      '<span style="clear:both;"><span></div></a></div>'
                    );
                  });
                  list.push("</div>");
                  html = list.join("");
                  html = $compile(html)($rootScope);
                  $(".servicelist-all-service-content").append(html);
                  endpoints.forEach(function(endpoint) {
                    if (
                      $rootScope.localizationConfig.showNewSwitch &&
                      endpoint.showNew
                    )
                      $(
                        ".framework-text-over-flow-hidden-" + endpoint.seq_id
                      ).css({ "max-width": newWidth });
                    else {
                      var pwidth = $catalogWidth - 80;
                      $("#serviceId_" + endpoint.seq_id).css({
                        "max-width": pwidth
                      });
                    }
                  });
                });
            })(list[0]);
        }
        var debounce = function(time) {
            var timeoutIndex;
            return function(callback) {
              "number" == typeof timeoutIndex && clearTimeout(timeoutIndex);
              timeoutIndex = setTimeout(callback, time);
            };
          },
          heightMap = (debounce(140), {});
        scope.$watch(
          "options",
          function(newvalue, oldvalue) {
            if (0 === newvalue.length) return;
            initServiceList(newvalue);
          },
          !0
        );
        $(window).resize(function() {
          initServiceList(scope.options);
        });
      }
    };
  });
  hwsModule.directive("frameworkSearchServicelistBar", function(
    $timeout,
    $rootScope,
    storage
  ) {
    return {
      scope: !0,
      restrict: "A",
      controller: function($scope) {},
      link: function(scope) {
        function hideframeworkServicelistPanel() {
          if ($(".framework-service-list").hasClass("open")) {
            $("#frameworkSearchModuleListInput").val("");
            $(".framework-service-list").removeClass("open");
            $(".framework-service-list .console-topbar-btn").show();
            $(".framework-service-list .console-topbar-btn-click").hide();
          }
        }
        var timer;
        scope.selectIndex = -1;
        scope.selectPoint = "#";
        scope.searchList = [];
        scope.searchMethod = {};
        scope.isSearchFocused = !1;
        scope.searchMethod.searchData = function() {
          var i,
            point,
            catalog,
            description,
            name,
            shortName,
            id,
            catalogCss,
            serviceCss,
            inputVal;
          scope.searchList = [];
          scope.isSearchFocused = !0;
          if (void 0 === scope.searchInputModel) return;
          if (scope.searchInputModel.length > 0) {
            for (i = 0; i < $rootScope.serviceEndpointList.length; i++) {
              point = $rootScope.serviceEndpointList[i];
              catalog = point.catalog ? point.catalog.toLowerCase() : "";
              description = point.description
                ? point.description.toLowerCase()
                : "";
              name = point.name ? point.name.toLowerCase() : "";
              shortName = point.shortName ? point.shortName.toLowerCase() : "";
              id = point.id ? point.id.toLowerCase() : "";
              catalogCss = point.catalogCss
                ? point.catalogCss.toLowerCase()
                : "";
              serviceCss = point.serviceCss
                ? point.serviceCss.toLowerCase()
                : "";
              inputVal = scope.searchInputModel.toLowerCase();
              (-1 === catalog.indexOf(inputVal) &&
                -1 === description.indexOf(inputVal) &&
                -1 === name.indexOf(inputVal) &&
                -1 === shortName.indexOf(inputVal) &&
                -1 === id.indexOf(inputVal) &&
                -1 === catalogCss.indexOf(inputVal) &&
                -1 === serviceCss.indexOf(inputVal)) ||
                scope.searchList.push(point);
            }
            if (0 === scope.searchList.length)
              $("#frameworkSearchModuleEmpty").show();
            else {
              scope.selectIndex = 0;
              $("#frameworkSearchModuleList").show();
            }
          }
        };
        scope.searchMethod.keyDownEvent = function($event) {
          $event.stopPropagation();
          var list = $("#frameworkSearchModuleList>a");
          switch ($event.keyCode) {
            case 38:
              scope.selectIndex--;
              if (scope.selectIndex >= 0 && scope.selectIndex < list.length)
                scope.searchInputModel = list
                  .eq(scope.selectIndex)
                  .attr("title");
              else if (scope.selectIndex < 0) {
                scope.selectIndex = list.length - 1;
                scope.searchInputModel = list
                  .eq(scope.selectIndex)
                  .attr("title");
              }
              scope.searchMethod.activeScrollMove(scope.selectIndex, !1);
              break;
            case 40:
              scope.selectIndex++;
              if (scope.selectIndex >= 0 && scope.selectIndex < list.length)
                scope.searchInputModel = list
                  .eq(scope.selectIndex)
                  .attr("title");
              else if (scope.selectIndex >= list.length) {
                scope.selectIndex = 0;
                scope.searchInputModel = list
                  .eq(scope.selectIndex)
                  .attr("title");
              }
              scope.searchMethod.activeScrollMove(scope.selectIndex, !0);
              break;
            case 13:
              -1 === scope.selectIndex && (scope.selectIndex = 0);
              if (list.length > 0) {
                scope.searchInputModel = list
                  .eq(scope.selectIndex)
                  .attr("title");
                scope.selectPoint = $rootScope.genHWSHref(
                  list.eq(scope.selectIndex).attr("rel")
                );
                $rootScope.setServiceInCookie(
                  scope.searchList[scope.selectIndex].id
                );
                $("#frameworkSearchModuleList").css({ display: "none" });
                hideframeworkServicelistPanel();
                window.location.href = scope.selectPoint;
              } else {
                hideframeworkServicelistPanel();
                window.location.href = scope.selectPoint;
              }
              "function" == typeof window.onEvent &&
                $rootScope.cloudBiOnEvent(
                  scope.searchInputModel + "_cfSearchService"
                );
          }
        };
        scope.searchMethod.activeScrollMove = function(index, isDown) {
          var i,
            listBox = $("#frameworkSearchModuleList"),
            list = $("#frameworkSearchModuleList>a"),
            maxHeight = listBox.height(),
            indexTop = 0;
          if (0 === index) {
            indexTop = 0;
            listBox.scrollTop(indexTop);
          } else {
            for (i = 0; i <= index; i++) indexTop += list.eq(i)[0].clientHeight;
            (indexTop - listBox.scrollTop() - maxHeight > 0 ||
              indexTop - listBox.scrollTop() - list.eq(index)[0].clientHeight <
                0) &&
              (isDown
                ? listBox.scrollTop(indexTop - maxHeight)
                : listBox.scrollTop(indexTop - list.eq(index)[0].clientHeight));
          }
        };
        scope.searchMethod.mouseOverEvent = function(index) {
          scope.selectIndex = index;
        };
        scope.searchMethod.selectItem = function($event, index) {
          if (1 === $event.which) {
            scope.selectIndex = index;
            var list = $("#frameworkSearchModuleList>a");
            scope.searchInputModel = list.eq(scope.selectIndex).attr("title");
            scope.selectPoint = $rootScope.genHWSHref(
              list.eq(scope.selectIndex).attr("rel")
            );
            $rootScope.setServiceInCookie(
              scope.searchList[scope.selectIndex].id
            );
            hideframeworkServicelistPanel();
            window.location.href = scope.selectPoint;
            "function" == typeof window.onEvent &&
              $rootScope.cloudBiOnEvent(
                scope.searchInputModel + "_cfSearchService"
              );
          }
        };
        scope.searchMethod.timeFlash = function() {
          $timeout.cancel(timer);
          timer = $timeout(function() {
            scope.searchMethod.searchData();
          }, 200);
        };
        scope.panelMousedown = function(event) {
          if (!0 === window.tiny.utils.browser.ie) {
            scope.isTiPrevented = !0;
            event.stopPropagation();
            event.preventDefault();
          }
        };
        scope.searchMethod.blurFn = function() {
          setTimeout(function() {
            if (
              !0 === window.tiny.utils.browser.ie &&
              !0 === scope.isTiPrevented
            ) {
              $("#frameworkSearchModuleListInput").focus();
              scope.isTiPrevented = !1;
              return;
            }
            $("#frameworkSearchModuleList").css({ display: "none" });
            $("#frameworkSearchModuleEmpty").css({ display: "none" });
          }, 0);
        };
      }
    };
  });
  hwsModule.directive("frameworkRecentServiceBar", function(
    $timeout,
    $rootScope,
    storage,
    $window
  ) {
    return {
      scope: !0,
      restrict: "A",
      controller: function($scope) {},
      link: function(scope) {
        function ieWidthTrack() {
          if (
            window.tiny.utils.browser.ie &&
            9 === parseInt(window.tiny.utils.browser.version, 10)
          ) {
            var parent = window.innerWidth - 100;
            $(".framework-content-recent-service").css({
              width: parent - 380 + "px"
            });
          }
        }
        $rootScope.$watchGroup(
          ["serviceEndpointsFlag", "cfRencentServices"],
          function(newValue, oldValue) {
            if (!0 === $rootScope.serviceEndpointsFlag) {
              $rootScope.rencentServiceList = $rootScope.getRecentServicesFromCookie();
              ieWidthTrack();
            }
          }
        );
        scope.clickToService = function(href, serviceId, serviceName) {
          if (!href) return;
          $rootScope.setServiceInCookie(serviceId);
          if ($(".framework-service-list").hasClass("open")) {
            $("#frameworkSearchModuleListInput").val("");
            $(".framework-service-list").removeClass("open");
            $(".framework-service-list .console-topbar-btn").show();
            $(".framework-service-list .console-topbar-btn-click").hide();
          }
          "function" == typeof window.onEvent &&
            $rootScope.cloudBiOnEvent(serviceName + "_cfRecentService");
          window.location.href = $rootScope.genHWSHref(href);
        };
        $(window).resize(function() {
          ieWidthTrack();
        });
      }
    };
  });
  hwsModule.directive("frameworkShowMenuHideOtherMenus", function(
    $window,
    $document,
    $rootScope
  ) {
    return {
      restrict: "A",
      link: function(scope, element) {
        $rootScope.cfShowMenuItemHideOtherMenu = function(showMenuItem) {
          if (
            $(".framework-service-list").hasClass("open") &&
            "framework-service-list" !== showMenuItem
          ) {
            $("#frameworkSearchModuleListInput").val("");
            $(".framework-service-list").removeClass("open");
            $(".framework-service-list .console-topbar-btn").show();
            $(".framework-service-list .console-topbar-btn-click").hide();
          }
          if (
            $(".console-menu-region").hasClass("open") &&
            "console-menu-region" !== showMenuItem
          ) {
            $(".console-menu-region").removeClass("open");
            $(".console-menu-region .console-topbar-btn").show();
            $(".console-menu-region .console-topbar-btn-click").hide();
          }
          if (
            $(".frame-favorite-service-list").hasClass("open") &&
            "frame-favorite-service-list" !== showMenuItem
          ) {
            $(".frame-favorite-service-list").removeClass("open");
            $rootScope.hideCustomFavoriteMenu();
            "block" ===
              (($(".favorite-modal") &&
                $(".favorite-modal")[0] &&
                $(".favorite-modal")[0].style &&
                $(".favorite-modal")[0].style.display) ||
                "") && $rootScope.hideFavoriteModal();
          }
          !0 === $rootScope.topSerarchBoxBtn &&
            "console-top-search-box" !== showMenuItem &&
            ($rootScope.topSerarchBoxBtn = !1);
        };
      }
    };
  });
  hwsModule.directive("addMessageUnreadBackgroundColor", function($rootScope) {
    return {
      restrict: "EA",
      link: function() {
        $rootScope.$watch("loadCssSuccess", function(newVal) {
          var stylecolor = $("#menu").css("background-color");
          $(".message-box-unread-count-background").css(
            "background-color",
            stylecolor
          );
        });
      }
    };
  });
  hwsModule.directive("dropDownTriangle", function() {
    return {
      restrict: "A",
      scope: { triangleName: "=" },
      link: function(scope, $element) {
        var list = [];
        $element.mouseenter(function() {
          var width = $element.width() - 8,
            style =
              "<style>.user-dropdown-menu.dropdown-menu.top-drop-down-menu-" +
              scope.triangleName +
              ":before{right:" +
              width +
              "px}</style>";
          if (-1 === list.indexOf(style)) {
            list.push(style);
            $(style).appendTo("head");
          }
        });
      }
    };
  });
  hwsModule.directive("frameFavoritesDragPanelEdit", function(
    $window,
    $document,
    $rootScope,
    $sce
  ) {
    return {
      restrict: "A",
      link: function(scope, $element) {
        function dealFavoriteBottomPanelData(endpointId) {
          var i, catalogServiceEndpoints, k;
          if (
            $rootScope.serviceEndpoints &&
            $rootScope.serviceEndpoints.length > 0
          )
            for (i = 0; i < $rootScope.serviceEndpoints.length; i++) {
              catalogServiceEndpoints = $rootScope.serviceEndpoints[i];
              if (
                catalogServiceEndpoints.endpoints &&
                catalogServiceEndpoints.endpoints.length > 0
              )
                for (k = 0; k < catalogServiceEndpoints.endpoints.length; k++)
                  if (catalogServiceEndpoints.endpoints[k].id === endpointId) {
                    catalogServiceEndpoints.endpoints[k].isFavorite = !1;
                    break;
                  }
            }
        }
        scope.cfFavoriteEndpointEdit = function(endpoint, isFavorite) {
          var appendHtml,
            removeDomId,
            endpointId = endpoint.id || endpoint.endpointId;
          $(".frame-dropdown-tinyTip").remove();
          if (
            isFavorite &&
            $rootScope.cfFavoriteEndpointsLen >= $rootScope.favoriteServiceMax
          ) {
            $rootScope.favoriteError = !0;
            return;
          }
          if (isFavorite) {
            appendHtml =
              '<li class="favorite-service-list favorite-services-item" id="' +
              endpointId +
              '" title="' +
              endpoint.name +
              '"> <span class="favorite-services-item-text pull-left">' +
              endpoint.name +
              '</span> <span class="ti-close ui-draggable-handle ti-icon ti-icon-close favorite-services-item-delete pull-right" onclick="frameworkRemoveFavoriteEndpoint(\'' +
              endpointId +
              '\')"></span><span class="clearfix"></span></li>';
            $("#framefavoritesDragPanel").append($sce.trustAsHtml(appendHtml));
            endpoint.isFavorite = !0;
            $rootScope.cfFavoriteEndpointsLen =
              $rootScope.cfFavoriteEndpointsLen + 1;
          } else {
            removeDomId = "#" + endpointId;
            $(removeDomId).remove();
            endpoint.isFavorite = !1;
            $rootScope.cfFavoriteEndpointsLen =
              $rootScope.cfFavoriteEndpointsLen - 1;
            endpoint.endpointId &&
              dealFavoriteBottomPanelData(endpoint.endpointId);
          }
        };
        $window.frameworkRemoveFavoriteEndpoint = function(endpointId) {
          dealFavoriteBottomPanelData(endpointId);
          var removeDomId = "#" + endpointId;
          $(removeDomId).remove();
          $rootScope.cfFavoriteEndpointsLen =
            $rootScope.cfFavoriteEndpointsLen - 1;
        };
        scope.initGetFavoriteTipOptions = function(endpoint) {
          endpoint.favoriteTipContent = {
            content: $rootScope.i18n.console_term_collectModal_tip,
            maxWidth: 300,
            customClass: "frame-dropdown-tinyTip",
            position: "bottom-right"
          };
        };
        scope.removeFavoriteTipOptions = function() {
          $(".frame-dropdown-tinyTip").remove();
        };
        scope.getFavoriteTipOptions = function(ev, endpoint) {
          (window.event || ev).clientY > document.body.clientHeight - 64 &&
            (endpoint.favoriteTipContent.position = "top-right");
          endpoint.isFavorite
            ? (endpoint.favoriteTipContent.content =
                $rootScope.i18n.console_term_unCollect_tip)
            : $rootScope.cfFavoriteEndpointsLen >= $rootScope.favoriteServiceMax
              ? (endpoint.favoriteTipContent.content = $sce.trustAsHtml(
                  $rootScope.i18nReplace(
                    $rootScope.i18n.console_term_collectFull_tip,
                    { 1: $rootScope.favoriteServiceMax }
                  )
                ))
              : (endpoint.favoriteTipContent.content =
                  $rootScope.i18n.console_term_collectModal_tip);
        };
      }
    };
  });
  hwsModule.directive("feeLayout", [
    "$rootScope",
    function($rootScope) {
      return {
        restrict: "EA",
        templateUrl: function() {
          return { url: "src/app/framework/views/feeTemplate.html" }.url;
        },
        scope: !0,
        replace: !0
      };
    }
  ]);
  return hwsModule;
});
define("app-remote/services/maskService", [], function() {
  "use strict";
  return function() {
    this.background = $("<div>").css({
      "z-index": 1e10,
      background:
        "#aaaaaa url('//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/mask-cover.png') 50% 50% repeat-x",
      opacity: ".30",
      filter: "Alpha(Opacity=30)",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    });
    this.loading = $("<div>").css({
      "z-index": 1e10,
      margin: "auto",
      "text-align": "center",
      position: "fixed",
      width: "100%",
      height: "100%",
      top: 0,
      "background-image":
        "url('//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/mask-loading.gif')",
      "background-repeat": "no-repeat",
      "background-position": "50%"
    });
    this.pageInitBackground = $("<div>").css({
      "z-index": 9999,
      background: "#FFFFFF",
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%"
    });
    this.pageInitLoading = $("<div>").css({
      "z-index": 9999,
      margin: "auto",
      "text-align": "center",
      position: "fixed",
      width: "100%",
      height: "100%",
      top: 0,
      "background-image":
        "url('//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/loading_big.gif')",
      "background-repeat": "no-repeat",
      "background-position": "50%"
    });
    this.show = function() {
      $("body").append(this.background);
      $("body").append(this.loading);
    };
    this.hide = function() {
      this.background.remove();
      this.loading.remove();
    };
    this.pageInitShow = function() {
      $("body").append(this.pageInitBackground);
      $("body").append(this.pageInitLoading);
    };
    this.pageInitHide = function() {
      this.pageInitBackground.remove();
      this.pageInitLoading.remove();
    };
  };
});
define("app-remote/services/cookieService", [], function() {
  "use strict";
  var storage,
    cookieStorage = {
      cache: [],
      setItem: function(key, value, ttl) {
        var date,
          cookieString = key + "=" + encodeURIComponent(value);
        if (ttl > 0) {
          date = new Date();
          date.setTime(date.getTime + ttl);
          cookieString = cookieString + "; expire=" + date.toGMTString();
        }
        this.cache.push(key);
        document.cookie = cookieString;
      },
      getItem: function(key) {
        var cookies = document.cookie.split("; "),
          arr = null,
          i = 0;
        for (; i < cookies.length; ) {
          arr = cookies[i++].split("=");
          if (arr[0] === key) return decodeURIComponent(arr[1]);
        }
        return "";
      },
      removeItem: function(key) {
        var date = new Date();
        date.setTime(date.getTime() - 1e4);
        document.cookie = key + "=v; expire=" + date.toGMTString();
      },
      clear: function() {
        var cache = this.cache,
          i = 0;
        for (; i < cache.length; ) this.removeItem(cache[i++]);
      }
    };
  window.cookieStorage = window.cookieStorage || cookieStorage;
  storage = function() {
    var storage = window.cookieStorage;
    "undefined" != typeof Storage && (storage = window.sessionStorage);
    this.storage = storage;
    this.cookieStorage = cookieStorage;
  };
  storage.prototype.add = function(key, value, ttl) {
    var storage = this.storage;
    "object" == typeof value && (value = JSON.stringify(value));
    storage.setItem(key, value, ttl);
  };
  storage.prototype.get = function(key) {
    var storage = this.storage,
      value = storage.getItem(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      return value;
    }
  };
  storage.prototype.del = function(key) {
    this.storage.removeItem(key);
  };
  storage.prototype.flush = function() {
    this.storage.clear();
  };
  return storage;
});
define("app-remote/services/tipMsgService", [
  "language-remote/framework",
  "app-remote/framework/localization/config",
  "app-remote/services/cookieService"
], function(i18n, localizationConfig, Storage) {
  "use strict";
  var storage, tipMessage;
  $.fn.alert = function() {
    var self = $(this);
    self.find(".close").bind("click", function() {
      self.remove();
    });
  };
  storage = new Storage();
  tipMessage = function($timeout) {
    var target, types, images, fade_duration, auto_fade_alerts_delay;
    $timeout || ($timeout = setTimeout);
    target = "#frame-cloud-messages-tips";
    types = ["error", "success"];
    images = {
      success: {
        url:
          "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/cloud-tips-success.png"
      },
      error: {
        url:
          "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/cloud-tips-error.png"
      },
      "success-big": { url: "theme/default/images/cloud-tips-success-big.png" },
      "error-big": { url: "theme/default/images/cloud-tips-error-big.png" }
    };
    fade_duration = 2e3;
    auto_fade_alerts_delay = 5e3;
    this.alert = function(type, message, marginLeft, width) {
      this.alertCore(!1, type, message, marginLeft, width);
    };
    this.alertAdaptive = function(type, message, marginLeft, width) {
      this.alertCore(!0, type, message, marginLeft, width);
    };
    this.alertCore = function(adaptiveFlag, type, message, marginLeft, width) {
      var messageTemplate = $(
        '<div class="alert alert-block fade in frame-cloud-alert-block frame-normal-font-size"><a class="close frame-cloud-close" data-dismiss="alert">&times;</a><p></p></div>'
      );
      if (type === types[0]) {
        auto_fade_alerts_delay = 1e4;
        messageTemplate.addClass("frame-cloud-alert-error");
      } else {
        if (type !== types[1]) {
          auto_fade_alerts_delay = 5e3;
          return;
        }
        auto_fade_alerts_delay = 5e3;
        messageTemplate.addClass("frame-cloud-alert-success");
      }
      adaptiveFlag &&
        (($(".leftContainer") && $(".leftContainer").length) ||
        ($(".left-container") && $(".left-container").length) ||
        ($(".tiny-layout-west") && $(".tiny-layout-west").length)
          ? $(target).css("padding-left", 242)
          : $(target).css("padding-left", 0));
      marginLeft && messageTemplate.css({ "margin-left": marginLeft });
      width && messageTemplate.css({ width: width });
      messageTemplate
        .find("p")
        .append(
          '<img class="frame-cloud-message-img" src="' + images[type].url + '">'
        )
        .append($.encoder.encodeForHTML(message));
      messageTemplate.alert();
      messageTemplate
        .hide()
        .prependTo(target)
        .fadeIn(100);
      this.autoDismissAlert(messageTemplate);
      message && this.storageMsg(type, message);
      return messageTemplate;
    };
    this.clearErrorMessages = function() {
      $(target + " .alert.frame-cloud-alert-error").remove();
    };
    this.clearSuccessMessages = function() {
      $(target + " .alert.frame-cloud-alert-success").remove();
    };
    this.clearAllMessages = function() {
      this.clearErrorMessages();
      this.clearSuccessMessages();
    };
    this.autoDismissAlerts = function() {
      var self = this;
      $(target + " .alert").each(function(index, alert) {
        var $alert = $(this),
          types = $alert.attr("class").split(" ");
        $.grep(types, function(value) {
          return -1 !== $.inArray(value, types);
        }).length > 0 && self.autoDismissAlert($alert);
      });
    };
    this.storageMsg = function(type, msg) {
      var agencyID,
        tipsMessages,
        msgData = {};
      msgData.content = "[" + type + "] " + msg;
      msgData.time = new Date();
      agencyID = storage.cookieStorage.getItem("agencyID");
      tipsMessages = storage.get("framework_tips_msg" + agencyID);
      tipsMessages = tipsMessages || [];
      tipsMessages.unshift(msgData) > 50 && tipsMessages.pop();
      storage.add("framework_tips_msg" + agencyID, tipsMessages);
      storage.add("framework_tips_new_msg" + agencyID, !0);
      $(".frame-message-round") &&
        $(".frame-message-round").css("display", "block");
    };
    this.autoDismissAlert = function(itemMessage) {
      $timeout(function() {
        itemMessage.fadeOut(fade_duration).remove();
      }, auto_fade_alerts_delay);
    };
    this.init = function() {
      var self = this;
      $("a.ajax-modal").click(function() {
        self.clearAllMessages();
      });
      self.autoDismissAlerts();
    };
    this.init();
  };
  return tipMessage;
});
define("app-remote/services/consoleModal", [], function() {
  "use strict";
  return function() {
    this.options = {
      title: "Confirm",
      type: "info",
      modalClass: "",
      closeBtn: !0,
      width: 400,
      okBtn: { key: "", show: !0, text: "OK", click: function() {} },
      cancelBtn: { key: "", show: !0, text: "Cancel", click: function() {} },
      content: ""
    };
    this.open = function(options) {
      var isOkHide,
        isCancelHide,
        self = this;
      self.close();
      self.options = $.extend(!0, self.options, options);
      isOkHide =
        void 0 === self.options.okBtn.show || self.options.okBtn.show
          ? ""
          : "cf-btn-ok-hide";
      isCancelHide =
        void 0 === self.options.cancelBtn.show || self.options.cancelBtn.show
          ? ""
          : "cf-btn-cancel-hide";
      self.modalTemplate =
        '<div class="cf-modal cf-fade cf-in cf-' +
        self.options.modalClass +
        '"><div class="cf-modal-shadow"></div><div class="cf-modal-dialog ' +
        self.options.modalClass +
        '" style="width: ' +
        self.options.width +
        'px;"><div class="cf-modal-content"><div class="cf-modal-header ui-draggable-handle"><span class="cf-icon cf-icon-close ' +
        (self.options.closeBtn ? "" : "cf-icon-close-hide") +
        '"></span><span class="cf-border-inline"></span><span class="cf-modal-title">' +
        self.options.title +
        '</span></div><div class="cf-modal-body"><div class="cf-msg-content-wrapper' +
        (self.options.type ? "" : "-noicon") +
        '"><div class="cf-msg-icon cf-icon-status-' +
        ("fail" === self.options.type
          ? "fail-big"
          : "warn" === self.options.type
            ? "exception-large"
            : self.options.type) +
        '"></div>' +
        self.options.content +
        "</div></div>";
      (isOkHide && isCancelHide) ||
        (self.modalTemplate +=
          '<div class="cf-modal-footer"><button type="button" class="cf-btn cf-btn-ok ' +
          isOkHide +
          '" id="' +
          self.options.okBtn.key +
          '">' +
          self.options.okBtn.text +
          '</button><button type="button" class="cf-btn cf-btn-cancel ' +
          isCancelHide +
          '" id="' +
          self.options.cancelBtn.key +
          '">' +
          self.options.cancelBtn.text +
          "</button></div>");
      self.modalTemplate += "</div></div></div>";
      angular
        .element(self.modalTemplate)
        .prependTo(angular.element(document.body));
      angular.element(".cf-btn-ok").on("click", function() {
        self.options.okBtn.click();
      });
      angular.element(".cf-btn-cancel").on("click", function() {
        self.options.cancelBtn.click();
      });
      angular
        .element(".cf-icon-close, .cf-btn-ok, .cf-btn-cancel")
        .on("click", function() {
          self.close();
        });
    };
    this.close = function() {
      var self = this;
      angular.element(".cf-" + self.options.modalClass).remove();
    };
  };
});
define("app-remote/services/httpService", [
  "language-remote/framework",
  "app-remote/services/tipMsgService",
  "app-remote/services/cookieService",
  "app-remote/services/consoleModal"
], function(i18n, TipMsgService, Storage, ConsoleModal) {
  "use strict";
  var TIME_OUT = 6e5,
    redirect302 = function(xhr, $state) {
      if (200 === xhr.status) {
        if (xhr.getResponseHeader("HW-AJAX-REDIRECT")) {
          new Storage().flush();
          window.location.reload();
          return !1;
        }
        if (xhr.getResponseHeader("X-Frame-Maintenance")) {
          $state.go("beingMaintained");
          return !1;
        }
      }
      return !0;
    },
    redirect403 = function(xhr, $scope) {
      var href, hrefTarget, consoleModal;
      if (403 === xhr.status && xhr.getResponseHeader("HW-IAM-FORBIDDEN")) {
        href = window.location.href;
        hrefTarget = $scope.delUrlParameter(href, "agencyId");
        if (href !== hrefTarget && !xhr.getResponseHeader("NOT-REFRESH")) {
          window.location.replace(hrefTarget);
          return;
        }
        if (0 === $("#console_frame_forbidden_confirm").length) {
          consoleModal = new ConsoleModal();
          consoleModal.open({
            type: "fail",
            title: i18n.console_term_note_value,
            content:
              '<div class="cf-console-modal-content"><p>' +
              i18n.console_term_errorForbidden_msg +
              "</p></div>",
            okBtn: {
              key: "console_frame_forbidden_confirm",
              text: i18n.console_term_confirm_button,
              show: !0,
              click: function() {
                window.location.href = i18n.console_term_portal_link;
              }
            },
            cancelBtn: { key: "", text: "", show: !1, click: function() {} }
          });
        }
      }
    },
    service = function(mask, $q, storage, $rootScope, $state, utilService) {
      this.get = function(config) {
        var error,
          $ajax,
          deferred = $q.defer(),
          settings = {
            type: "GET",
            contentType: "application/json; charset=UTF-8",
            timeout: config.timeout || TIME_OUT,
            headers: {
              "X-Language": window.urlParams.lang || "",
              cftk:
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cftk"
                ) || "",
              "cf2-cftk":
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cf2_cftk"
                ) || "",
              AgencyId: $rootScope.getUrlParameter("agencyId", !0) || "",
              ProjectName: $rootScope.getUrlParameter("region", !0) || "",
              region: $rootScope.selectRegionId || ""
            },
            url: angular.isString(config.url)
              ? config.url
              : utilService.i18nReplace(config.url.s, config.url.o),
            data: config.params || {},
            beforeSend: function(request, setting) {
              config.mask && mask.show();
              config.beforeSend && config.beforeSend(request, setting);
            },
            complete: function(xhr, status) {
              config.mask && mask.hide();
              redirect302(xhr, $state);
              redirect403(xhr, $rootScope);
            }
          };
        config.contentType && (settings.contentType = config.contentType);
        config.dataType && (settings.dataType = config.dataType);
        config.headers && $.extend(!0, settings.headers, config.headers);
        $ajax = $.ajax(settings);
        error =
          window.app_enable_framework_503 && !config.disable_503
            ? function(data) {
                if (data && 503 === data.status) {
                  new TipMsgService().alert(
                    "error",
                    i18n.console_term_503Error_label
                  );
                } else deferred.reject.apply(deferred, arguments);
              }
            : function() {
                deferred.reject.apply(deferred, arguments);
              };
        $ajax
          .success(function(data, status, xhr) {
            redirect302(xhr, $state) &&
              deferred.resolve.apply(deferred, arguments);
          })
          .error(error);
        return deferred.promise;
      };
      this.post = function(config) {
        var error,
          $ajax,
          deferred = $q.defer(),
          settings = {
            type: "POST",
            contentType: "application/json; charset=UTF-8",
            timeout: config.timeout || TIME_OUT,
            headers: {
              "X-Language": window.urlParams.lang,
              cftk:
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cftk"
                ) || "",
              "cf2-cftk":
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cf2_cftk"
                ) || "",
              AgencyId: $rootScope.getUrlParameter("agencyId", !0) || "",
              ProjectName: $rootScope.getUrlParameter("region", !0) || "",
              region: $rootScope.selectRegionId || ""
            },
            url: angular.isString(config.url)
              ? config.url
              : utilService.i18nReplace(config.url.s, config.url.o),
            data:
              "string" == typeof config.params
                ? config.params
                : JSON.stringify(config.params),
            beforeSend: function(request, setting) {
              config.mask && mask.show();
              config.beforeSend && config.beforeSend(request, setting);
            },
            complete: function(xhr, status) {
              config.mask && mask.hide();
              redirect403(xhr, $rootScope);
            }
          };
        config.contentType && (settings.contentType = config.contentType);
        config.dataType && (settings.dataType = config.dataType);
        $ajax = $.ajax(settings);
        error =
          window.app_enable_framework_503 && !config.disable_503
            ? function(data) {
                if (data && 503 === data.status) {
                  new TipMsgService().alert(
                    "error",
                    i18n.console_term_503Error_label
                  );
                } else deferred.reject.apply(deferred, arguments);
              }
            : function() {
                deferred.reject.apply(deferred, arguments);
              };
        $ajax
          .success(function(data, status, xhr) {
            redirect302(xhr, $state) &&
              deferred.resolve.apply(deferred, arguments);
          })
          .error(error);
        return deferred.promise;
      };
      this.deleter = function(config) {
        var error,
          $ajax,
          deferred = $q.defer(),
          settings = {
            type: "DELETE",
            contentType: "application/json; charset=UTF-8",
            timeout: config.timeout || TIME_OUT,
            headers: {
              "X-Language": window.urlParams.lang,
              cftk:
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cftk"
                ) || "",
              "cf2-cftk":
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cf2_cftk"
                ) || "",
              AgencyId: $rootScope.getUrlParameter("agencyId", !0) || "",
              ProjectName: $rootScope.getUrlParameter("region", !0) || "",
              region: $rootScope.selectRegionId || ""
            },
            url: angular.isString(config.url)
              ? config.url
              : utilService.i18nReplace(config.url.s, config.url.o),
            data: config.params
              ? "string" == typeof config.params
                ? config.params
                : JSON.stringify(config.params || {})
              : null,
            beforeSend: function(request, setting) {
              config.mask && mask.show();
              config.beforeSend && config.beforeSend(request, setting);
            },
            complete: function(xhr, status) {
              config.mask && mask.hide();
              redirect403(xhr, $rootScope);
            }
          };
        config.contentType && (settings.contentType = config.contentType);
        config.dataType && (settings.dataType = config.dataType);
        $ajax = $.ajax(settings);
        error =
          window.app_enable_framework_503 && !config.disable_503
            ? function(data) {
                if (data && 503 === data.status) {
                  new TipMsgService().alert(
                    "error",
                    i18n.console_term_503Error_label
                  );
                } else deferred.reject.apply(deferred, arguments);
              }
            : function() {
                deferred.reject.apply(deferred, arguments);
              };
        $ajax
          .success(function(data, status, xhr) {
            redirect302(xhr, $state) &&
              deferred.resolve.apply(deferred, arguments);
          })
          .error(error);
        return deferred.promise;
      };
      this.put = function(config) {
        var error,
          $ajax,
          deferred = $q.defer(),
          settings = {
            type: "PUT",
            contentType: "application/json; charset=UTF-8",
            timeout: config.timeout || TIME_OUT,
            headers: {
              "X-Language": window.urlParams.lang,
              cftk:
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cftk"
                ) || "",
              "cf2-cftk":
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cf2_cftk"
                ) || "",
              AgencyId: $rootScope.getUrlParameter("agencyId", !0) || "",
              ProjectName: $rootScope.getUrlParameter("region", !0) || "",
              region: $rootScope.selectRegionId || ""
            },
            url: angular.isString(config.url)
              ? config.url
              : utilService.i18nReplace(config.url.s, config.url.o),
            data:
              "string" == typeof config.params
                ? config.params
                : JSON.stringify(config.params || {}),
            beforeSend: function(request, setting) {
              config.mask && mask.show();
              config.beforeSend && config.beforeSend(request, setting);
            },
            complete: function(xhr, status) {
              config.mask && mask.hide();
              redirect403(xhr, $rootScope);
            }
          };
        config.contentType && (settings.contentType = config.contentType);
        config.dataType && (settings.dataType = config.dataType);
        $ajax = $.ajax(settings);
        error =
          window.app_enable_framework_503 && !config.disable_503
            ? function(data) {
                if (data && 503 === data.status) {
                  new TipMsgService().alert(
                    "error",
                    i18n.console_term_503Error_label
                  );
                } else deferred.reject.apply(deferred, arguments);
              }
            : function() {
                deferred.reject.apply(deferred, arguments);
              };
        $ajax
          .success(function(data, status, xhr) {
            redirect302(xhr, $state) &&
              deferred.resolve.apply(deferred, arguments);
          })
          .error(error);
        return deferred.promise;
      };
      this.patch = function(config) {
        var error,
          $ajax,
          deferred = $q.defer(),
          settings = {
            type: "PATCH",
            contentType: "application/json; charset=UTF-8",
            timeout: config.timeout || TIME_OUT,
            headers: {
              "X-Language": window.urlParams.lang,
              cftk:
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cftk"
                ) || "",
              "cf2-cftk":
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cf2_cftk"
                ) || "",
              AgencyId: $rootScope.getUrlParameter("agencyId", !0) || "",
              ProjectName: $rootScope.getUrlParameter("region", !0) || "",
              region: $rootScope.selectRegionId || ""
            },
            url: angular.isString(config.url)
              ? config.url
              : utilService.i18nReplace(config.url.s, config.url.o),
            data:
              "string" == typeof config.params
                ? config.params
                : JSON.stringify(config.params || {}),
            beforeSend: function(request, setting) {
              config.mask && mask.show();
              config.beforeSend && config.beforeSend(request, setting);
            },
            complete: function(xhr, status) {
              config.mask && mask.hide();
              redirect403(xhr, $rootScope);
            }
          };
        config.contentType && (settings.contentType = config.contentType);
        config.dataType && (settings.dataType = config.dataType);
        $ajax = $.ajax(settings);
        error =
          window.app_enable_framework_503 && !config.disable_503
            ? function(data) {
                if (data && 503 === data.status) {
                  new TipMsgService().alert(
                    "error",
                    i18n.console_term_503Error_label
                  );
                } else deferred.reject.apply(deferred, arguments);
              }
            : function() {
                deferred.reject.apply(deferred, arguments);
              };
        $ajax
          .success(function(data, status, xhr) {
            redirect302(xhr, $state) &&
              deferred.resolve.apply(deferred, arguments);
          })
          .error(error);
        return deferred.promise;
      };
      this.ajax = function(config) {
        var $ajax,
          settings = {
            type: config.type,
            contentType: "application/json; charset=UTF-8",
            timeout: config.timeout || TIME_OUT,
            headers: {
              "X-Language": window.urlParams.lang,
              cftk:
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cftk"
                ) || "",
              "cf2-cftk":
                storage.cookieStorage.getItem(
                  (window.app_cookie_prefix || "") + "cf2_cftk"
                ) || "",
              AgencyId: $rootScope.getUrlParameter("agencyId", !0) || "",
              ProjectName: $rootScope.getUrlParameter("region", !0) || "",
              region: $rootScope.selectRegionId || ""
            },
            url: angular.isString(config.url)
              ? config.url
              : utilService.i18nReplace(config.url.s, config.url.o),
            data:
              "string" == typeof config.params
                ? config.params
                : JSON.stringify(config.params || {}),
            beforeSend: function(request, setting) {
              config.mask && mask.show();
              config.beforeSend && config.beforeSend(request, setting);
            },
            complete: function(xhr, status) {
              config.mask && mask.hide();
              redirect302(xhr, $state);
              redirect403(xhr, $rootScope);
            }
          };
        config.contentType && (settings.contentType = config.contentType);
        config.dataType && (settings.dataType = config.dataType);
        $ajax = $.ajax(settings);
        return $ajax;
      };
    };
  service.$injector = [
    "mask",
    "$q",
    "storage",
    "$rootScope",
    "$state",
    "utilService"
  ];
  return service;
});
define("app-remote/services/exceptionService", [
  "app-remote/services/tipMsgService"
], function(TipMessageService) {
  "use strict";
  return function() {
    var tipMessage = new TipMessageService();
    this.doException = function(response, widget) {
      tipMessage.alert("error", response.message);
    };
    this.isException = function(response) {
      if (
        !response ||
        /^2\d\d$/.test(response.status) ||
        ("" === response.responseText && 401 !== response.status)
      )
        return !1;
      return !0;
    };
  };
});
define("app-remote/framework/controllers/serviceCtrl", [
  "language-remote/framework",
  "app-remote/framework/localization/config",
  "app-remote/services/consoleModal"
], function(i18n, localization, consoleModal) {
  "use strict";
  function setCookie(cname, cvalue) {
    document.cookie =
      cname + "=" + cvalue + ";path=/;domain=" + window.cloudCookieDomain;
  }
  function getCookie(key) {
    var consoleCookies, cookie, i;
    if (!document.cookie) return null;
    consoleCookies = document.cookie.split(";");
    for (i = 0; i < consoleCookies.length; i++) {
      cookie = consoleCookies[i].split("=");
      if (cookie && cookie.length >= 2 && key === trimEmpty(cookie[0]))
        return trimEmpty(cookie[1]);
    }
  }
  function trimEmpty(value) {
    if (!value) return "";
    return value.replace(/(^\s*)|(\s*$)/g, "");
  }
  function sessionDirectiveFn(camel, rootScope, ConsoleModal) {
    function oneMinuteMeTask() {
      oneMinutefun = window.setInterval(function() {
        Date.now() - latesttouchTime < oneMinute &&
          expireMethodMap.sendTouchRequest();
      }, oneMinute);
    }
    function pageKeyPressEvent() {
      angular.element(document).bind("keypress", function() {
        setCookie("latestRecordTimestamp", Date.now());
        expireMethodMap.refreshSession();
      });
    }
    function pageMousedown() {
      angular.element(document).bind("mousedown", function() {
        setCookie("latestRecordTimestamp", Date.now());
        expireMethodMap.refreshSession();
      });
    }
    var maxInactiveInterval,
      consoleModal,
      countdown,
      latesttouchTime,
      oneMinute,
      oneMinutefun,
      expireMethodMap,
      hasOpenExpireModal;
    rootScope.latestSessionTimestamp = Date.now();
    setCookie("latestRecordTimestamp", Date.now());
    0;
    null;
    maxInactiveInterval = 30;
    consoleModal = new ConsoleModal();
    latesttouchTime = 0;
    oneMinute = 6e4;
    oneMinutefun = 0;
    oneMinuteMeTask();
    expireMethodMap = {
      sendTouchRequest: function() {
        camel.get({
          url: window.appWebPath + "/rest/me",
          timeout: 6e4,
          beforeSend: function(request) {
            request.setRequestHeader("X-Request-From", "Framework");
          }
        });
      },
      sessionCountDown: function(totalSecond) {
        var _this = this,
          _fillZeroPrefix = function(num) {
            return num < 10 ? "0" + num : num;
          },
          second = Math.floor(totalSecond),
          min = _fillZeroPrefix(Math.floor(second / 60)),
          sec = _fillZeroPrefix(second - 60 * min);
        angular
          .element("#sessionExpiredCountDown")
          .text("00:" + (min > 0 ? min : "00") + ":" + (sec > 0 ? sec : "00"));
        if (totalSecond <= 0) {
          _this.expireModalOpen();
          return;
        }
        countdown = window.setTimeout(function() {
          totalSecond -= 1;
          _this.sessionCountDown(totalSecond);
        }, 1e3);
      },
      refreshSession: function() {
        latesttouchTime = Date.now();
      },
      expireModalOpen: function() {
        var _this = this;
        consoleModal.open({
          type: "info",
          title: rootScope.i18n.console_term_loginSessionHasExpiredTitle_label,
          modalClass: "session-expired-timeout-modal",
          closeBtn: !1,
          okBtn: {
            show: !0,
            text: rootScope.i18n.console_term_loginSessionExpiredHasOk_label,
            click: function() {
              window.clearInterval(rootScope.checkSessionTimeout);
              window.location.href = rootScope.logoutUrl;
            }
          },
          cancelBtn: {
            show: !1,
            text:
              rootScope.i18n.console_term_loginSessionExpiredHasCancel_label,
            click: function() {
              angular.element(document).bind("keypress", function() {
                _this.refreshSession();
              });
              angular.element(document).bind("mousedown", function() {
                _this.refreshSession();
              });
            }
          },
          content:
            '<div class="cf-console-modal-content"><p>' +
            rootScope.i18n.console_term_loginSessionHasExpired_label +
            "</p></div>"
        });
      }
    };
    pageKeyPressEvent();
    pageMousedown();
    rootScope.consoleModalKeyboardEventFunction = function(event) {
      event.preventDefault();
      event.stopPropagation();
    };
    hasOpenExpireModal = !1;
    rootScope.checkSessionTimeout = window.setInterval(function() {
      var currentLocaleTime,
        latestRecordTimestampValue,
        sessionTimeoutDurationValue,
        differ,
        latestRecordTimestamp = getCookie("latestRecordTimestamp"),
        sessionTimeoutDuration = getCookie("popup_max_time");
      (sessionTimeoutDuration &&
        "null" !== sessionTimeoutDuration &&
        "" !== sessionTimeoutDuration.replace('""', "")) ||
        (sessionTimeoutDuration = maxInactiveInterval.toString());
      currentLocaleTime = Date.now();
      if (
        latestRecordTimestamp &&
        sessionTimeoutDuration &&
        angular.isString(latestRecordTimestamp) &&
        angular.isString(sessionTimeoutDuration) &&
        "" !== latestRecordTimestamp.replace('""', "") &&
        "null" !== latestRecordTimestamp &&
        "" !== sessionTimeoutDuration.replace('""', "") &&
        "null" !== sessionTimeoutDuration
      ) {
        latestRecordTimestampValue = Number(latestRecordTimestamp);
        sessionTimeoutDurationValue = Number(sessionTimeoutDuration);
        if (
          angular.isNumber(latestRecordTimestampValue) &&
          angular.isNumber(sessionTimeoutDurationValue) &&
          !isNaN(latestRecordTimestampValue) &&
          !isNaN(sessionTimeoutDurationValue)
        ) {
          sessionTimeoutDurationValue < 2 &&
            (sessionTimeoutDurationValue = maxInactiveInterval);
          differ =
            currentLocaleTime -
            latestRecordTimestampValue -
            60 * sessionTimeoutDurationValue * 1e3;
          rootScope.currentSessionExpireTimestamp = differ;
          if (differ >= 0) {
            angular.element(".cf-modal").remove();
            expireMethodMap.expireModalOpen();
            $("body").on(
              "keydown keyup keypress",
              rootScope.consoleModalKeyboardEventFunction
            );
            hasOpenExpireModal = !0;
            window.clearInterval(oneMinutefun);
            angular.element(document).unbind("keypress");
            angular.element(document).unbind("mousedown");
          } else if (!0 === hasOpenExpireModal) {
            consoleModal.close();
            $("body").off(
              "keydown keyup keypress",
              rootScope.consoleModalKeyboardEventFunction
            );
            pageKeyPressEvent();
            pageMousedown();
            oneMinuteMeTask();
            hasOpenExpireModal = !1;
          }
        }
      }
    }, 3e3);
  }
  var ctrl = function(
    $rootScope,
    $scope,
    $state,
    $stateParams,
    mask,
    storage,
    $compile,
    camel,
    frameworkService,
    msgService,
    localeService
  ) {
    function showBrowserTips() {
      var $fs,
        messageTemplate = $(
          '<div id="frame-os-check"><span class="frame-os-check-hint-display common-font-size-big1"><span class="frame-os-check-tips-icon hwsicon-frame-image-tip"></span><span class="frame-os-check-tips" ng-bind="i18n.console_term_tipInfo_label"></span> <span class="frame-os-check-link-info"><a ng-if="i18n.console_term_learnMore_link" ng-href="{{i18n.console_term_learnMore_link}}" class="learn-more-link-info" ng-bind="i18n.console_term_learnMore_label" target="_blank"></a></span><a class="frame-os-check-close-icon hwsicon-frame-image-close" ng-click="tipInfoClose()"></a></span></div>'
        );
      $("#frame-os-check").length > 0 && $("#frame-os-check").remove();
      messageTemplate.prependTo($(document.body));
      setMenuTop(62);
      $fs = $(".framework-scrolling");
      if ("TSI" !== localization.x_domain_type) {
        $("#service-content").css("padding-top", "112px");
        $fs.attr("style")
          ? $fs.css("cssText", $fs.attr("style") + "top: 112px !important")
          : $fs.css("cssText", "top: 112px !important");
      } else {
        $("#service-content").css("padding-top", "162px");
        $fs.attr("style")
          ? $fs.css("cssText", $fs.attr("style") + "top: 162px !important")
          : $fs.css("cssText", "top: 162px !important");
      }
    }
    function setCookie(cname, cvalue) {
      document.cookie =
        cname + "=" + cvalue + ";path=/;domain=" + window.cloudCookieDomain;
    }
    function setMenuLeft() {
      var scrollTop,
        msgTop,
        top,
        scrollLeft = jqueryWindow.scrollLeft(),
        $serviceFooter = $("#service-footer");
      $(
        "#service-menus,#frame-os-check,#frame-suspended-check,.frame-scrolling-horizon"
      ).css("left", -scrollLeft);
      "fixed" === $serviceFooter.css("position") &&
        $serviceFooter.css("left", -scrollLeft);
      scrollTop = jqueryWindow.scrollTop();
      msgTop = scrollTop + 50;
      scrollTop > 50
        ? (scrollTop = 50)
        : "TSI" === localization.x_domain_type && (msgTop += 50);
      "TSI" === localization.x_domain_type
        ? $(".fw-msg-alert-wrapper").css(
            "top",
            (msgTop - 100 <= 0 ? 0 : msgTop - 100) + "px"
          )
        : $(".fw-msg-alert-wrapper").css(
            "top",
            (msgTop - 50 <= 0 ? 0 : msgTop - 50) + "px"
          );
      $(".console-menu-nav-list-wrapper").css("left", 20 - scrollLeft);
      if (
        "none" === $("#service-menus .menu-top-content").css("display") ||
        !$("#service-menus .menu-top-content").css("display")
      )
        return;
      top = 0;
      $("#frame-suspended-check").length > 0 &&
      "none" !== $("#frame-suspended-check").css("display")
        ? (top = $("#frame-suspended-check").height())
        : $("#frame-os-check").length > 0 &&
          (top = $("#frame-os-check").height());
      setMenuTop(top - scrollTop);
      $(".framework-scrolling").css(
        "cssText",
        "top: " + (100 + top - scrollTop) + "px !important"
      );
    }
    var userProjectSupportChangeState, setMenuTop, jqueryWindow;
    $compile("<div session-directive-listener></div>")($rootScope.$new());
    sessionDirectiveFn(camel, $rootScope, consoleModal);
    $rootScope.supportLanguage = [["zh-cn", "简体中文"], ["en-us", "English"]];
    $rootScope.localeService = localeService;
    $rootScope.projectNameRegExp = /^(DeC)_([^_]+)_(.+)$/;
    $rootScope.userProjectNameRegExp = /^([^_]+)_(.+)$/;
    $rootScope.i18n = i18n;
    $rootScope.language = window.urlParams.lang;
    $rootScope.languageName = (function(key, languages) {
      if (languages)
        for (var i = 0; i < languages.length; i++)
          if (key === languages[i][0]) return languages[i][1];
      return null;
    })($rootScope.language, $rootScope.supportLanguage);
    $rootScope.offsets = { leftMenuWidth: 240 };
    userProjectSupportChangeState = function() {
      if (
        !$rootScope.supportMultiProject &&
        !$rootScope.projectNameRegExp.test($rootScope.projectName) &&
        $rootScope.userProjectNameRegExp.test($rootScope.projectName)
      ) {
        $rootScope.lastState = $state.current;
        "nonsupportRegion" !== $rootScope.lastState.name &&
          $state.go("nonsupportRegion");
      }
    };
    $rootScope.setSupportMultiProject = function(isSupportMultiProject) {
      $rootScope.supportMultiProject = isSupportMultiProject;
      "" !== $rootScope.projectName
        ? userProjectSupportChangeState()
        : $rootScope.$on("initUser", userProjectSupportChangeState);
    };
    mask.pageInitShow();
    $rootScope.menus = { url: "src/app/framework/views/menus.html" };
    $rootScope.footer = { url: "src/app/framework/views/footer.html" };
    $rootScope.changeLanguage = function(language) {
      setCookie("locale", language);
      window.location.href = $rootScope.addOrReplaceUrlParameter(
        window.location.href,
        "locale",
        language
      );
    };
    $rootScope.feedback = { url: "src/app/framework/views/feedback.html" };
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.displayConsoleFeedback = localization.displayConsoleFeedback;
    $rootScope.closeMenusFavoriteError = function() {
      $rootScope.favoriteError = !1;
    };
    $rootScope.$on("$viewContentLoaded", function(event, target) {
      mask.pageInitHide();
      if (
        "B" === storage.cookieStorage.getItem("browserCheckResult") &&
        "true" !== storage.cookieStorage.getItem("browserCheckClose")
      ) {
        showBrowserTips();
        angular
          .element(document)
          .injector()
          .invoke(function($compile) {
            var scope = $("#frame-os-check").scope();
            $compile($("#frame-os-check"))(scope);
            scope.$evalAsync();
          });
      }
    });
    $rootScope.$on("$includeContentLoaded", function(event, target) {});
    setMenuTop = function(offset) {
      var $serviceMenus = $("#service-menus");
      $rootScope.offsets.headerHeight = offset + $serviceMenus.height();
      $serviceMenus.css("top", offset);
      $(".console-menu-nav-list-wrapper").css(
        "top",
        $rootScope.offsets.headerHeight
      );
      $(".framework-service-list .dropdown-menu:before").css(
        "top",
        $rootScope.offsets.headerHeight - 6
      );
    };
    $rootScope.tipInfoClose = function() {
      $("#frame-os-check").remove();
      setMenuTop(0);
      var $fs = $(".framework-scrolling");
      if ("TSI" !== localization.x_domain_type) {
        $("#service-content").css("padding-top", "50px");
        $fs.attr("style")
          ? $fs.css("cssText", $fs.attr("style") + "top: 50px !important")
          : $fs.css("cssText", "top: 50px !important");
      } else {
        $("#service-content").css("padding-top", "100px");
        $fs.attr("style")
          ? $fs.css("cssText", $fs.attr("style") + "top: 102px !important")
          : $fs.css("cssText", "top: 102px !important");
      }
      setCookie("browserCheckClose", "true");
    };
    jqueryWindow = $(window);
    jqueryWindow.scroll(setMenuLeft);
    setMenuLeft();
    $rootScope.genHWSHref = function(href, flag, param, refrence) {
      param || (param = {});
      if (!href || "" === href || "#" === href) return href;
      if (flag)
        "locale" === flag &&
          (href = $rootScope.addOrReplaceUrlParameter(
            href,
            "locale",
            window.urlParams.lang
          ));
      else {
        href = $rootScope.addOrReplaceUrlParameter(
          href,
          "agencyId",
          $rootScope.getUrlParameter("agencyId", !0)
        );
        var region = param.region || $rootScope.getUrlParameter("region", !0);
        region &&
          "" !== region &&
          "null" !== region &&
          (href = $rootScope.addOrReplaceUrlParameter(href, "region", region));
        href = $rootScope.addOrReplaceUrlParameter(
          href,
          "locale",
          window.urlParams.lang
        );
      }
      refrence &&
        (href = $rootScope.addOrReplaceUrlParameter(
          href,
          "refrence",
          refrence
        ));
      return href;
    };
    $rootScope.addOrReplaceUrlParameter = function(href, key, value) {
      var hrefs, hrefPostfix;
      if (!href || !key) return href;
      hrefs = href.split("#/");
      hrefPostfix = "";
      hrefs.length > 1 && (hrefPostfix = "#/" + hrefs[1]);
      hrefs[0] = $rootScope.delUrlParameter(hrefs[0], key);
      value &&
        (-1 !== hrefs[0].indexOf("?")
          ? (hrefs[0] = hrefs[0] + "&" + key + "=" + value)
          : (hrefs[0] = hrefs[0] + "?" + key + "=" + value));
      return hrefs[0] + hrefPostfix;
    };
    $rootScope.getUrlParameter = function(paramKey, scopeFlag) {
      var sURLVariables,
        i,
        sParameterName,
        sPageURL = window.location.search.substring(1);
      if (sPageURL) {
        sURLVariables = sPageURL.split("&");
        for (i = 0; i < sURLVariables.length; i++) {
          sParameterName = sURLVariables[i].split("=");
          if (sParameterName[0] === paramKey) return sParameterName[1];
        }
      }
      if (!scopeFlag) return null;
      if ("agencyId" === paramKey) return $rootScope.userId;
      if ("region" === paramKey)
        return encodeURIComponent($rootScope.projectName || "");
    };
    $rootScope.delUrlParameter = function(url, name) {
      return url
        .replace(new RegExp("[?&]" + name + "=[^&#]*(#.*)?$"), "$1")
        .replace(new RegExp("([?&])" + name + "=[^&]*&"), "$1");
    };
    $rootScope.getImageByCloudType = function(type) {
      var cloud_type,
        imagesUrl,
        typeMatch = {
          aws: ["aws", "AWS"],
          toc: ["toc", "TOC"],
          otc: ["otc", "OTC"],
          hec: ["hec", "HPC"],
          ctc: ["ctc", "eCloud"],
          fs_cloud: ["fs_cloud", "DC2"],
          private_cloud: ["private_cloud", "localcloud"],
          fe: ["FE"]
        };
      window._.each(typeMatch, function(values, key) {
        window._.contains(values, type) && (cloud_type = key);
      });
      imagesUrl = {
        aws: {
          url:
            "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/aws.png"
        },
        fs_cloud: {
          url:
            "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/fs_cloud.png"
        },
        toc: {
          url:
            "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/toc.png"
        },
        otc: {
          url:
            "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/otc.png"
        },
        hec: {
          url:
            "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/hec.png"
        },
        ctc: {
          url:
            "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/ctc.png"
        },
        private_cloud: {
          url:
            "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/private_cloud.png"
        },
        fe: {
          url:
            "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/fe.png"
        }
      };
      return (imagesUrl[cloud_type] && imagesUrl[cloud_type].url) || "";
    };
    if ($rootScope.displayConsoleFeedback)
      try {
        angular.module("tiny")
          ? ($rootScope.displayConsoleFeedback = !0)
          : ($rootScope.displayConsoleFeedback = !1);
      } catch (e) {
        $rootScope.displayConsoleFeedback = !1;
      }
    window.tiny.utils.browser.chrome &&
      parseInt(window.tiny.utils.browser.version, 10) >= 60 &&
      $scope.$watch(
        function() {
          return Math.ceil($(document).scrollTop());
        },
        function() {
          var scrollTop = Math.ceil($(document).scrollTop()),
            height = $(window).height(),
            scrollHeight = $("body")[0].scrollHeight;
          if (scrollTop > 0 && scrollTop + height >= scrollHeight) {
            $(document).scrollTop(scrollTop - 0.5);
            $(document).scrollTop(scrollTop + 0.5);
          }
        }
      );
  };
  ctrl.$injector = [
    "$rootScope",
    "$scope",
    "$state",
    "$stateParams",
    "camel",
    "frameworkService",
    "msgService",
    "localeService"
  ];
  return ctrl;
});
(function(root) {
  define("bootstrap/bootstrap.min", [], function() {
    return function() {
      if ("undefined" == typeof jQuery)
        throw new Error("Bootstrap's JavaScript requires jQuery");
      +(function(a) {
        "use strict";
        var b = a.fn.jquery.split(" ")[0].split(".");
        if (
          (b[0] < 2 && b[1] < 9) ||
          (1 == b[0] && 9 == b[1] && b[2] < 1) ||
          b[0] > 3
        )
          throw new Error(
            "Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 4"
          );
      })(jQuery),
        (function(a) {
          "use strict";
          function b() {
            var c,
              a = document.createElement("bootstrap"),
              b = {
                WebkitTransition: "webkitTransitionEnd",
                MozTransition: "transitionend",
                OTransition: "oTransitionEnd otransitionend",
                transition: "transitionend"
              };
            for (c in b) if (void 0 !== a.style[c]) return { end: b[c] };
            return !1;
          }
          (a.fn.emulateTransitionEnd = function(b) {
            var e,
              c = !1,
              d = this;
            a(this).one("bsTransitionEnd", function() {
              c = !0;
            });
            e = function() {
              c || a(d).trigger(a.support.transition.end);
            };
            return setTimeout(e, b), this;
          }),
            a(function() {
              (a.support.transition = b()),
                a.support.transition &&
                  (a.event.special.bsTransitionEnd = {
                    bindType: a.support.transition.end,
                    delegateType: a.support.transition.end,
                    handle: function(b) {
                      if (a(b.target).is(this))
                        return b.handleObj.handler.apply(this, arguments);
                    }
                  });
            });
        })(jQuery),
        (function(a) {
          "use strict";
          function b(b) {
            return this.each(function() {
              var c = a(this),
                e = c.data("bs.alert");
              e || c.data("bs.alert", (e = new d(this))),
                "string" == typeof b && e[b].call(c);
            });
          }
          var e,
            c = '[data-dismiss="alert"]',
            d = function(b) {
              a(b).on("click", c, this.close);
            };
          (d.VERSION = "3.3.7"),
            (d.TRANSITION_DURATION = 150),
            (d.prototype.close = function(b) {
              function c() {
                g.detach()
                  .trigger("closed.bs.alert")
                  .remove();
              }
              var g,
                e = a(this),
                f = e.attr("data-target");
              f ||
                ((f = e.attr("href")),
                (f = f && f.replace(/.*(?=#[^\s]*$)/, "")));
              g = a("#" === f ? [] : f);
              b && b.preventDefault(),
                g.length || (g = e.closest(".alert")),
                g.trigger((b = a.Event("close.bs.alert"))),
                b.isDefaultPrevented() ||
                  (g.removeClass("in"),
                  a.support.transition && g.hasClass("fade")
                    ? g
                        .one("bsTransitionEnd", c)
                        .emulateTransitionEnd(d.TRANSITION_DURATION)
                    : c());
            });
          e = a.fn.alert;
          (a.fn.alert = b),
            (a.fn.alert.Constructor = d),
            (a.fn.alert.noConflict = function() {
              return (a.fn.alert = e), this;
            }),
            a(document).on("click.bs.alert.data-api", c, d.prototype.close);
        })(jQuery),
        (function(a) {
          "use strict";
          function b(b) {
            return this.each(function() {
              var d = a(this),
                e = d.data("bs.button"),
                f = "object" == typeof b && b;
              e || d.data("bs.button", (e = new c(this, f))),
                "toggle" == b ? e.toggle() : b && e.setState(b);
            });
          }
          var d,
            c = function(b, d) {
              (this.$element = a(b)),
                (this.options = a.extend({}, c.DEFAULTS, d)),
                (this.isLoading = !1);
            };
          (c.VERSION = "3.3.7"),
            (c.DEFAULTS = { loadingText: "loading..." }),
            (c.prototype.setState = function(b) {
              var c = "disabled",
                d = this.$element,
                e = d.is("input") ? "val" : "html",
                f = d.data();
              (b += "Text"),
                null == f.resetText && d.data("resetText", d[e]()),
                setTimeout(
                  a.proxy(function() {
                    d[e](null == f[b] ? this.options[b] : f[b]),
                      "loadingText" == b
                        ? ((this.isLoading = !0),
                          d
                            .addClass(c)
                            .attr(c, c)
                            .prop(c, !0))
                        : this.isLoading &&
                          ((this.isLoading = !1),
                          d
                            .removeClass(c)
                            .removeAttr(c)
                            .prop(c, !1));
                  }, this),
                  0
                );
            }),
            (c.prototype.toggle = function() {
              var c,
                a = !0,
                b = this.$element.closest('[data-toggle="buttons"]');
              if (b.length) {
                c = this.$element.find("input");
                "radio" == c.prop("type")
                  ? (c.prop("checked") && (a = !1),
                    b.find(".active").removeClass("active"),
                    this.$element.addClass("active"))
                  : "checkbox" == c.prop("type") &&
                    (c.prop("checked") !== this.$element.hasClass("active") &&
                      (a = !1),
                    this.$element.toggleClass("active")),
                  c.prop("checked", this.$element.hasClass("active")),
                  a && c.trigger("change");
              } else
                this.$element.attr(
                  "aria-pressed",
                  !this.$element.hasClass("active")
                ),
                  this.$element.toggleClass("active");
            });
          d = a.fn.button;
          (a.fn.button = b),
            (a.fn.button.Constructor = c),
            (a.fn.button.noConflict = function() {
              return (a.fn.button = d), this;
            }),
            a(document)
              .on(
                "click.bs.button.data-api",
                '[data-toggle^="button"]',
                function(c) {
                  var d = a(c.target).closest(".btn");
                  b.call(d, "toggle"),
                    a(c.target).is(
                      'input[type="radio"], input[type="checkbox"]'
                    ) ||
                      (c.preventDefault(),
                      d.is("input,button")
                        ? d.trigger("focus")
                        : d
                            .find("input:visible,button:visible")
                            .first()
                            .trigger("focus"));
                }
              )
              .on(
                "focus.bs.button.data-api blur.bs.button.data-api",
                '[data-toggle^="button"]',
                function(b) {
                  a(b.target)
                    .closest(".btn")
                    .toggleClass("focus", /^focus(in)?$/.test(b.type));
                }
              );
        })(jQuery),
        (function(a) {
          "use strict";
          function b(b) {
            return this.each(function() {
              var d = a(this),
                e = d.data("bs.carousel"),
                f = a.extend(
                  {},
                  c.DEFAULTS,
                  d.data(),
                  "object" == typeof b && b
                ),
                g = "string" == typeof b ? b : f.slide;
              e || d.data("bs.carousel", (e = new c(this, f))),
                "number" == typeof b
                  ? e.to(b)
                  : g
                    ? e[g]()
                    : f.interval && e.pause().cycle();
            });
          }
          var d,
            e,
            c = function(b, c) {
              (this.$element = a(b)),
                (this.$indicators = this.$element.find(".carousel-indicators")),
                (this.options = c),
                (this.paused = null),
                (this.sliding = null),
                (this.interval = null),
                (this.$active = null),
                (this.$items = null),
                this.options.keyboard &&
                  this.$element.on(
                    "keydown.bs.carousel",
                    a.proxy(this.keydown, this)
                  ),
                "hover" == this.options.pause &&
                  !("ontouchstart" in document.documentElement) &&
                  this.$element
                    .on("mouseenter.bs.carousel", a.proxy(this.pause, this))
                    .on("mouseleave.bs.carousel", a.proxy(this.cycle, this));
            };
          (c.VERSION = "3.3.7"),
            (c.TRANSITION_DURATION = 600),
            (c.DEFAULTS = {
              interval: 5e3,
              pause: "hover",
              wrap: !0,
              keyboard: !0
            }),
            (c.prototype.keydown = function(a) {
              if (!/input|textarea/i.test(a.target.tagName)) {
                switch (a.which) {
                  case 37:
                    this.prev();
                    break;
                  case 39:
                    this.next();
                    break;
                  default:
                    return;
                }
                a.preventDefault();
              }
            }),
            (c.prototype.cycle = function(b) {
              return (
                b || (this.paused = !1),
                this.interval && clearInterval(this.interval),
                this.options.interval &&
                  !this.paused &&
                  (this.interval = setInterval(
                    a.proxy(this.next, this),
                    this.options.interval
                  )),
                this
              );
            }),
            (c.prototype.getItemIndex = function(a) {
              return (
                (this.$items = a.parent().children(".item")),
                this.$items.index(a || this.$active)
              );
            }),
            (c.prototype.getItemForDirection = function(a, b) {
              var e,
                f,
                c = this.getItemIndex(b);
              if (
                (("prev" == a && 0 === c) ||
                  ("next" == a && c == this.$items.length - 1)) &&
                !this.options.wrap
              )
                return b;
              (e = "prev" == a ? -1 : 1), (f = (c + e) % this.$items.length);
              return this.$items.eq(f);
            }),
            (c.prototype.to = function(a) {
              var b = this,
                c = this.getItemIndex(
                  (this.$active = this.$element.find(".item.active"))
                );
              if (!(a > this.$items.length - 1 || a < 0))
                return this.sliding
                  ? this.$element.one("slid.bs.carousel", function() {
                      b.to(a);
                    })
                  : c == a
                    ? this.pause().cycle()
                    : this.slide(a > c ? "next" : "prev", this.$items.eq(a));
            }),
            (c.prototype.pause = function(b) {
              return (
                b || (this.paused = !0),
                this.$element.find(".next, .prev").length &&
                  a.support.transition &&
                  (this.$element.trigger(a.support.transition.end),
                  this.cycle(!0)),
                (this.interval = clearInterval(this.interval)),
                this
              );
            }),
            (c.prototype.next = function() {
              if (!this.sliding) return this.slide("next");
            }),
            (c.prototype.prev = function() {
              if (!this.sliding) return this.slide("prev");
            }),
            (c.prototype.slide = function(b, d) {
              var j,
                k,
                l,
                m,
                e = this.$element.find(".item.active"),
                f = d || this.getItemForDirection(b, e),
                g = this.interval,
                h = "next" == b ? "left" : "right",
                i = this;
              if (f.hasClass("active")) return (this.sliding = !1);
              (j = f[0]),
                (k = a.Event("slide.bs.carousel", {
                  relatedTarget: j,
                  direction: h
                }));
              if ((this.$element.trigger(k), !k.isDefaultPrevented())) {
                if (
                  ((this.sliding = !0),
                  g && this.pause(),
                  this.$indicators.length)
                ) {
                  this.$indicators.find(".active").removeClass("active");
                  l = a(this.$indicators.children()[this.getItemIndex(f)]);
                  l && l.addClass("active");
                }
                m = a.Event("slid.bs.carousel", {
                  relatedTarget: j,
                  direction: h
                });
                return (
                  a.support.transition && this.$element.hasClass("slide")
                    ? (f.addClass(b),
                      f[0].offsetWidth,
                      e.addClass(h),
                      f.addClass(h),
                      e
                        .one("bsTransitionEnd", function() {
                          f.removeClass([b, h].join(" ")).addClass("active"),
                            e.removeClass(["active", h].join(" ")),
                            (i.sliding = !1),
                            setTimeout(function() {
                              i.$element.trigger(m);
                            }, 0);
                        })
                        .emulateTransitionEnd(c.TRANSITION_DURATION))
                    : (e.removeClass("active"),
                      f.addClass("active"),
                      (this.sliding = !1),
                      this.$element.trigger(m)),
                  g && this.cycle(),
                  this
                );
              }
            });
          d = a.fn.carousel;
          (a.fn.carousel = b),
            (a.fn.carousel.Constructor = c),
            (a.fn.carousel.noConflict = function() {
              return (a.fn.carousel = d), this;
            });
          e = function(c) {
            var d,
              g,
              h,
              e = a(this),
              f = a(
                e.attr("data-target") ||
                  ((d = e.attr("href")) && d.replace(/.*(?=#[^\s]+$)/, ""))
              );
            if (f.hasClass("carousel")) {
              (g = a.extend({}, f.data(), e.data())),
                (h = e.attr("data-slide-to"));
              h && (g.interval = !1),
                b.call(f, g),
                h && f.data("bs.carousel").to(h),
                c.preventDefault();
            }
          };
          a(document)
            .on("click.bs.carousel.data-api", "[data-slide]", e)
            .on("click.bs.carousel.data-api", "[data-slide-to]", e),
            a(window).on("load", function() {
              a('[data-ride="carousel"]').each(function() {
                var c = a(this);
                b.call(c, c.data());
              });
            });
        })(jQuery),
        (function(a) {
          "use strict";
          function b(b) {
            var c,
              d =
                b.attr("data-target") ||
                ((c = b.attr("href")) && c.replace(/.*(?=#[^\s]+$)/, ""));
            return a(d);
          }
          function c(b) {
            return this.each(function() {
              var c = a(this),
                e = c.data("bs.collapse"),
                f = a.extend(
                  {},
                  d.DEFAULTS,
                  c.data(),
                  "object" == typeof b && b
                );
              !e && f.toggle && /show|hide/.test(b) && (f.toggle = !1),
                e || c.data("bs.collapse", (e = new d(this, f))),
                "string" == typeof b && e[b]();
            });
          }
          var e,
            d = function(b, c) {
              (this.$element = a(b)),
                (this.options = a.extend({}, d.DEFAULTS, c)),
                (this.$trigger = a(
                  '[data-toggle="collapse"][href="#' +
                    b.id +
                    '"],[data-toggle="collapse"][data-target="#' +
                    b.id +
                    '"]'
                )),
                (this.transitioning = null),
                this.options.parent
                  ? (this.$parent = this.getParent())
                  : this.addAriaAndCollapsedClass(this.$element, this.$trigger),
                this.options.toggle && this.toggle();
            };
          (d.VERSION = "3.3.7"),
            (d.TRANSITION_DURATION = 350),
            (d.DEFAULTS = { toggle: !0 }),
            (d.prototype.dimension = function() {
              return this.$element.hasClass("width") ? "width" : "height";
            }),
            (d.prototype.show = function() {
              var b, e, f, g, h, i;
              if (!this.transitioning && !this.$element.hasClass("in")) {
                e =
                  this.$parent &&
                  this.$parent.children(".panel").children(".in, .collapsing");
                if (
                  !(
                    e &&
                    e.length &&
                    (b = e.data("bs.collapse")) &&
                    b.transitioning
                  )
                ) {
                  f = a.Event("show.bs.collapse");
                  if ((this.$element.trigger(f), !f.isDefaultPrevented())) {
                    e &&
                      e.length &&
                      (c.call(e, "hide"), b || e.data("bs.collapse", null));
                    g = this.dimension();
                    this.$element
                      .removeClass("collapse")
                      .addClass("collapsing")
                      [g](0)
                      .attr("aria-expanded", !0),
                      this.$trigger
                        .removeClass("collapsed")
                        .attr("aria-expanded", !0),
                      (this.transitioning = 1);
                    h = function() {
                      this.$element
                        .removeClass("collapsing")
                        .addClass("collapse in")
                        [g](""),
                        (this.transitioning = 0),
                        this.$element.trigger("shown.bs.collapse");
                    };
                    if (!a.support.transition) return h.call(this);
                    i = a.camelCase(["scroll", g].join("-"));
                    this.$element
                      .one("bsTransitionEnd", a.proxy(h, this))
                      .emulateTransitionEnd(d.TRANSITION_DURATION)
                      [g](this.$element[0][i]);
                  }
                }
              }
            }),
            (d.prototype.hide = function() {
              var b, c, e;
              if (!this.transitioning && this.$element.hasClass("in")) {
                b = a.Event("hide.bs.collapse");
                if ((this.$element.trigger(b), !b.isDefaultPrevented())) {
                  c = this.dimension();
                  this.$element[c](this.$element[c]())[0].offsetHeight,
                    this.$element
                      .addClass("collapsing")
                      .removeClass("collapse in")
                      .attr("aria-expanded", !1),
                    this.$trigger
                      .addClass("collapsed")
                      .attr("aria-expanded", !1),
                    (this.transitioning = 1);
                  e = function() {
                    (this.transitioning = 0),
                      this.$element
                        .removeClass("collapsing")
                        .addClass("collapse")
                        .trigger("hidden.bs.collapse");
                  };
                  return a.support.transition
                    ? void this.$element[c](0)
                        .one("bsTransitionEnd", a.proxy(e, this))
                        .emulateTransitionEnd(d.TRANSITION_DURATION)
                    : e.call(this);
                }
              }
            }),
            (d.prototype.toggle = function() {
              this[this.$element.hasClass("in") ? "hide" : "show"]();
            }),
            (d.prototype.getParent = function() {
              return a(this.options.parent)
                .find(
                  '[data-toggle="collapse"][data-parent="' +
                    this.options.parent +
                    '"]'
                )
                .each(
                  a.proxy(function(c, d) {
                    var e = a(d);
                    this.addAriaAndCollapsedClass(b(e), e);
                  }, this)
                )
                .end();
            }),
            (d.prototype.addAriaAndCollapsedClass = function(a, b) {
              var c = a.hasClass("in");
              a.attr("aria-expanded", c),
                b.toggleClass("collapsed", !c).attr("aria-expanded", c);
            });
          e = a.fn.collapse;
          (a.fn.collapse = c),
            (a.fn.collapse.Constructor = d),
            (a.fn.collapse.noConflict = function() {
              return (a.fn.collapse = e), this;
            }),
            a(document).on(
              "click.bs.collapse.data-api",
              '[data-toggle="collapse"]',
              function(d) {
                var f,
                  g,
                  h,
                  e = a(this);
                e.attr("data-target") || d.preventDefault();
                (f = b(e)),
                  (g = f.data("bs.collapse")),
                  (h = g ? "toggle" : e.data());
                c.call(f, h);
              }
            );
        })(jQuery),
        (function(a) {
          "use strict";
          function b(b) {
            var d,
              c = b.attr("data-target");
            c ||
              ((c = b.attr("href")),
              (c =
                c && /#[A-Za-z]/.test(c) && c.replace(/.*(?=#[^\s]*$)/, "")));
            d = c && a(c);
            return d && d.length ? d : b.parent();
          }
          function c(c) {
            (c && 3 === c.which) ||
              (a(e).remove(),
              a(f).each(function() {
                var d = a(this),
                  e = b(d),
                  f = { relatedTarget: this };
                e.hasClass("open") &&
                  ((c &&
                    "click" == c.type &&
                    /input|textarea/i.test(c.target.tagName) &&
                    a.contains(e[0], c.target)) ||
                    (e.trigger((c = a.Event("hide.bs.dropdown", f))),
                    c.isDefaultPrevented() ||
                      (d.attr("aria-expanded", "false"),
                      e
                        .removeClass("open")
                        .trigger(a.Event("hidden.bs.dropdown", f)))));
              }));
          }
          function d(b) {
            return this.each(function() {
              var c = a(this),
                d = c.data("bs.dropdown");
              d || c.data("bs.dropdown", (d = new g(this))),
                "string" == typeof b && d[b].call(c);
            });
          }
          var h,
            e = ".dropdown-backdrop",
            f = '[data-toggle="dropdown"]',
            g = function(b) {
              a(b).on("click.bs.dropdown", this.toggle);
            };
          (g.VERSION = "3.3.7"),
            (g.prototype.toggle = function(d) {
              var f,
                g,
                h,
                e = a(this);
              if (!e.is(".disabled, :disabled")) {
                (f = b(e)), (g = f.hasClass("open"));
                if ((c(), !g)) {
                  "ontouchstart" in document.documentElement &&
                    !f.closest(".navbar-nav").length &&
                    a(document.createElement("div"))
                      .addClass("dropdown-backdrop")
                      .insertAfter(a(this))
                      .on("click", c);
                  h = { relatedTarget: this };
                  if (
                    (f.trigger((d = a.Event("show.bs.dropdown", h))),
                    d.isDefaultPrevented())
                  )
                    return;
                  e.trigger("focus").attr("aria-expanded", "true"),
                    f
                      .toggleClass("open")
                      .trigger(a.Event("shown.bs.dropdown", h));
                }
                return !1;
              }
            }),
            (g.prototype.keydown = function(c) {
              var d, e, g, h, i, j;
              if (
                /(38|40|27|32)/.test(c.which) &&
                !/input|textarea/i.test(c.target.tagName)
              ) {
                d = a(this);
                if (
                  (c.preventDefault(),
                  c.stopPropagation(),
                  !d.is(".disabled, :disabled"))
                ) {
                  (e = b(d)), (g = e.hasClass("open"));
                  if ((!g && 27 != c.which) || (g && 27 == c.which))
                    return (
                      27 == c.which && e.find(f).trigger("focus"),
                      d.trigger("click")
                    );
                  (h = " li:not(.disabled):visible a"),
                    (i = e.find(".dropdown-menu" + h));
                  if (i.length) {
                    j = i.index(c.target);
                    38 == c.which && j > 0 && j--,
                      40 == c.which && j < i.length - 1 && j++,
                      ~j || (j = 0),
                      i.eq(j).trigger("focus");
                  }
                }
              }
            });
          h = a.fn.dropdown;
          (a.fn.dropdown = d),
            (a.fn.dropdown.Constructor = g),
            (a.fn.dropdown.noConflict = function() {
              return (a.fn.dropdown = h), this;
            }),
            a(document)
              .on("click.bs.dropdown.data-api", c)
              .on("click.bs.dropdown.data-api", ".dropdown form", function(a) {
                a.stopPropagation();
              })
              .on("click.bs.dropdown.data-api", f, g.prototype.toggle)
              .on("keydown.bs.dropdown.data-api", f, g.prototype.keydown)
              .on(
                "keydown.bs.dropdown.data-api",
                ".dropdown-menu",
                g.prototype.keydown
              );
        })(jQuery),
        (function(a) {
          "use strict";
          function b(b, d) {
            return this.each(function() {
              var e = a(this),
                f = e.data("bs.modal"),
                g = a.extend(
                  {},
                  c.DEFAULTS,
                  e.data(),
                  "object" == typeof b && b
                );
              f || e.data("bs.modal", (f = new c(this, g))),
                "string" == typeof b ? f[b](d) : g.show && f.show(d);
            });
          }
          var d,
            c = function(b, c) {
              (this.options = c),
                (this.$body = a(document.body)),
                (this.$element = a(b)),
                (this.$dialog = this.$element.find(".modal-dialog")),
                (this.$backdrop = null),
                (this.isShown = null),
                (this.originalBodyPad = null),
                (this.scrollbarWidth = 0),
                (this.ignoreBackdropClick = !1),
                this.options.remote &&
                  this.$element.find(".modal-content").load(
                    this.options.remote,
                    a.proxy(function() {
                      this.$element.trigger("loaded.bs.modal");
                    }, this)
                  );
            };
          (c.VERSION = "3.3.7"),
            (c.TRANSITION_DURATION = 300),
            (c.BACKDROP_TRANSITION_DURATION = 150),
            (c.DEFAULTS = { backdrop: !0, keyboard: !0, show: !0 }),
            (c.prototype.toggle = function(a) {
              return this.isShown ? this.hide() : this.show(a);
            }),
            (c.prototype.show = function(b) {
              var d = this,
                e = a.Event("show.bs.modal", { relatedTarget: b });
              this.$element.trigger(e),
                this.isShown ||
                  e.isDefaultPrevented() ||
                  ((this.isShown = !0),
                  this.checkScrollbar(),
                  this.setScrollbar(),
                  this.$body.addClass("modal-open"),
                  this.escape(),
                  this.resize(),
                  this.$element.on(
                    "click.dismiss.bs.modal",
                    '[data-dismiss="modal"]',
                    a.proxy(this.hide, this)
                  ),
                  this.$dialog.on("mousedown.dismiss.bs.modal", function() {
                    d.$element.one("mouseup.dismiss.bs.modal", function(b) {
                      a(b.target).is(d.$element) &&
                        (d.ignoreBackdropClick = !0);
                    });
                  }),
                  this.backdrop(function() {
                    var f,
                      e = a.support.transition && d.$element.hasClass("fade");
                    d.$element.parent().length || d.$element.appendTo(d.$body),
                      d.$element.show().scrollTop(0),
                      d.adjustDialog(),
                      e && d.$element[0].offsetWidth,
                      d.$element.addClass("in"),
                      d.enforceFocus();
                    f = a.Event("shown.bs.modal", { relatedTarget: b });
                    e
                      ? d.$dialog
                          .one("bsTransitionEnd", function() {
                            d.$element.trigger("focus").trigger(f);
                          })
                          .emulateTransitionEnd(c.TRANSITION_DURATION)
                      : d.$element.trigger("focus").trigger(f);
                  }));
            }),
            (c.prototype.hide = function(b) {
              b && b.preventDefault(),
                (b = a.Event("hide.bs.modal")),
                this.$element.trigger(b),
                this.isShown &&
                  !b.isDefaultPrevented() &&
                  ((this.isShown = !1),
                  this.escape(),
                  this.resize(),
                  a(document).off("focusin.bs.modal"),
                  this.$element
                    .removeClass("in")
                    .off("click.dismiss.bs.modal")
                    .off("mouseup.dismiss.bs.modal"),
                  this.$dialog.off("mousedown.dismiss.bs.modal"),
                  a.support.transition && this.$element.hasClass("fade")
                    ? this.$element
                        .one("bsTransitionEnd", a.proxy(this.hideModal, this))
                        .emulateTransitionEnd(c.TRANSITION_DURATION)
                    : this.hideModal());
            }),
            (c.prototype.enforceFocus = function() {
              a(document)
                .off("focusin.bs.modal")
                .on(
                  "focusin.bs.modal",
                  a.proxy(function(a) {
                    document === a.target ||
                      this.$element[0] === a.target ||
                      this.$element.has(a.target).length ||
                      this.$element.trigger("focus");
                  }, this)
                );
            }),
            (c.prototype.escape = function() {
              this.isShown && this.options.keyboard
                ? this.$element.on(
                    "keydown.dismiss.bs.modal",
                    a.proxy(function(a) {
                      27 == a.which && this.hide();
                    }, this)
                  )
                : this.isShown || this.$element.off("keydown.dismiss.bs.modal");
            }),
            (c.prototype.resize = function() {
              this.isShown
                ? a(window).on(
                    "resize.bs.modal",
                    a.proxy(this.handleUpdate, this)
                  )
                : a(window).off("resize.bs.modal");
            }),
            (c.prototype.hideModal = function() {
              var a = this;
              this.$element.hide(),
                this.backdrop(function() {
                  a.$body.removeClass("modal-open"),
                    a.resetAdjustments(),
                    a.resetScrollbar(),
                    a.$element.trigger("hidden.bs.modal");
                });
            }),
            (c.prototype.removeBackdrop = function() {
              this.$backdrop && this.$backdrop.remove(),
                (this.$backdrop = null);
            }),
            (c.prototype.backdrop = function(b) {
              var f,
                g,
                d = this,
                e = this.$element.hasClass("fade") ? "fade" : "";
              if (this.isShown && this.options.backdrop) {
                f = a.support.transition && e;
                if (
                  ((this.$backdrop = a(document.createElement("div"))
                    .addClass("modal-backdrop " + e)
                    .appendTo(this.$body)),
                  this.$element.on(
                    "click.dismiss.bs.modal",
                    a.proxy(function(a) {
                      return this.ignoreBackdropClick
                        ? void (this.ignoreBackdropClick = !1)
                        : void (
                            a.target === a.currentTarget &&
                            ("static" == this.options.backdrop
                              ? this.$element[0].focus()
                              : this.hide())
                          );
                    }, this)
                  ),
                  f && this.$backdrop[0].offsetWidth,
                  this.$backdrop.addClass("in"),
                  !b)
                )
                  return;
                f
                  ? this.$backdrop
                      .one("bsTransitionEnd", b)
                      .emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION)
                  : b();
              } else if (!this.isShown && this.$backdrop) {
                this.$backdrop.removeClass("in");
                g = function() {
                  d.removeBackdrop(), b && b();
                };
                a.support.transition && this.$element.hasClass("fade")
                  ? this.$backdrop
                      .one("bsTransitionEnd", g)
                      .emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION)
                  : g();
              } else b && b();
            }),
            (c.prototype.handleUpdate = function() {
              this.adjustDialog();
            }),
            (c.prototype.adjustDialog = function() {
              var a =
                this.$element[0].scrollHeight >
                document.documentElement.clientHeight;
              this.$element.css({
                paddingLeft:
                  !this.bodyIsOverflowing && a ? this.scrollbarWidth : "",
                paddingRight:
                  this.bodyIsOverflowing && !a ? this.scrollbarWidth : ""
              });
            }),
            (c.prototype.resetAdjustments = function() {
              this.$element.css({ paddingLeft: "", paddingRight: "" });
            }),
            (c.prototype.checkScrollbar = function() {
              var b,
                a = window.innerWidth;
              if (!a) {
                b = document.documentElement.getBoundingClientRect();
                a = b.right - Math.abs(b.left);
              }
              (this.bodyIsOverflowing = document.body.clientWidth < a),
                (this.scrollbarWidth = this.measureScrollbar());
            }),
            (c.prototype.setScrollbar = function() {
              var a = parseInt(this.$body.css("padding-right") || 0, 10);
              (this.originalBodyPad = document.body.style.paddingRight || ""),
                this.bodyIsOverflowing &&
                  this.$body.css("padding-right", a + this.scrollbarWidth);
            }),
            (c.prototype.resetScrollbar = function() {
              this.$body.css("padding-right", this.originalBodyPad);
            }),
            (c.prototype.measureScrollbar = function() {
              var b,
                a = document.createElement("div");
              (a.className = "modal-scrollbar-measure"), this.$body.append(a);
              b = a.offsetWidth - a.clientWidth;
              return this.$body[0].removeChild(a), b;
            });
          d = a.fn.modal;
          (a.fn.modal = b),
            (a.fn.modal.Constructor = c),
            (a.fn.modal.noConflict = function() {
              return (a.fn.modal = d), this;
            }),
            a(document).on(
              "click.bs.modal.data-api",
              '[data-toggle="modal"]',
              function(c) {
                var d = a(this),
                  e = d.attr("href"),
                  f = a(
                    d.attr("data-target") ||
                      (e && e.replace(/.*(?=#[^\s]+$)/, ""))
                  ),
                  g = f.data("bs.modal")
                    ? "toggle"
                    : a.extend(
                        { remote: !/#/.test(e) && e },
                        f.data(),
                        d.data()
                      );
                d.is("a") && c.preventDefault(),
                  f.one("show.bs.modal", function(a) {
                    a.isDefaultPrevented() ||
                      f.one("hidden.bs.modal", function() {
                        d.is(":visible") && d.trigger("focus");
                      });
                  }),
                  b.call(f, g, this);
              }
            );
        })(jQuery),
        (function(a) {
          "use strict";
          function b(b) {
            return this.each(function() {
              var d = a(this),
                e = d.data("bs.tooltip"),
                f = "object" == typeof b && b;
              (!e && /destroy|hide/.test(b)) ||
                (e || d.data("bs.tooltip", (e = new c(this, f))),
                "string" == typeof b && e[b]());
            });
          }
          var d,
            c = function(a, b) {
              (this.type = null),
                (this.options = null),
                (this.enabled = null),
                (this.timeout = null),
                (this.hoverState = null),
                (this.$element = null),
                (this.inState = null),
                this.init("tooltip", a, b);
            };
          (c.VERSION = "3.3.7"),
            (c.TRANSITION_DURATION = 150),
            (c.DEFAULTS = {
              animation: !0,
              placement: "top",
              selector: !1,
              template:
                '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
              trigger: "hover focus",
              title: "",
              delay: 0,
              html: !1,
              container: !1,
              viewport: { selector: "body", padding: 0 }
            }),
            (c.prototype.init = function(b, c, d) {
              var e, f, g, h, i;
              if (
                ((this.enabled = !0),
                (this.type = b),
                (this.$element = a(c)),
                (this.options = this.getOptions(d)),
                (this.$viewport =
                  this.options.viewport &&
                  a(
                    a.isFunction(this.options.viewport)
                      ? this.options.viewport.call(this, this.$element)
                      : this.options.viewport.selector || this.options.viewport
                  )),
                (this.inState = { click: !1, hover: !1, focus: !1 }),
                this.$element[0] instanceof document.constructor &&
                  !this.options.selector)
              )
                throw new Error(
                  "`selector` option must be specified when initializing " +
                    this.type +
                    " on the window.document object!"
                );
              for (e = this.options.trigger.split(" "), f = e.length; f--; ) {
                g = e[f];
                if ("click" == g)
                  this.$element.on(
                    "click." + this.type,
                    this.options.selector,
                    a.proxy(this.toggle, this)
                  );
                else if ("manual" != g) {
                  (h = "hover" == g ? "mouseenter" : "focusin"),
                    (i = "hover" == g ? "mouseleave" : "focusout");
                  this.$element.on(
                    h + "." + this.type,
                    this.options.selector,
                    a.proxy(this.enter, this)
                  ),
                    this.$element.on(
                      i + "." + this.type,
                      this.options.selector,
                      a.proxy(this.leave, this)
                    );
                }
              }
              this.options.selector
                ? (this._options = a.extend({}, this.options, {
                    trigger: "manual",
                    selector: ""
                  }))
                : this.fixTitle();
            }),
            (c.prototype.getDefaults = function() {
              return c.DEFAULTS;
            }),
            (c.prototype.getOptions = function(b) {
              return (
                (b = a.extend({}, this.getDefaults(), this.$element.data(), b)),
                b.delay &&
                  "number" == typeof b.delay &&
                  (b.delay = { show: b.delay, hide: b.delay }),
                b
              );
            }),
            (c.prototype.getDelegateOptions = function() {
              var b = {},
                c = this.getDefaults();
              return (
                this._options &&
                  a.each(this._options, function(a, d) {
                    c[a] != d && (b[a] = d);
                  }),
                b
              );
            }),
            (c.prototype.enter = function(b) {
              var c =
                b instanceof this.constructor
                  ? b
                  : a(b.currentTarget).data("bs." + this.type);
              return (
                c ||
                  ((c = new this.constructor(
                    b.currentTarget,
                    this.getDelegateOptions()
                  )),
                  a(b.currentTarget).data("bs." + this.type, c)),
                b instanceof a.Event &&
                  (c.inState["focusin" == b.type ? "focus" : "hover"] = !0),
                c.tip().hasClass("in") || "in" == c.hoverState
                  ? void (c.hoverState = "in")
                  : (clearTimeout(c.timeout),
                    (c.hoverState = "in"),
                    c.options.delay && c.options.delay.show
                      ? void (c.timeout = setTimeout(function() {
                          "in" == c.hoverState && c.show();
                        }, c.options.delay.show))
                      : c.show())
              );
            }),
            (c.prototype.isInStateTrue = function() {
              for (var a in this.inState) if (this.inState[a]) return !0;
              return !1;
            }),
            (c.prototype.leave = function(b) {
              var c =
                b instanceof this.constructor
                  ? b
                  : a(b.currentTarget).data("bs." + this.type);
              if (
                (c ||
                  ((c = new this.constructor(
                    b.currentTarget,
                    this.getDelegateOptions()
                  )),
                  a(b.currentTarget).data("bs." + this.type, c)),
                b instanceof a.Event &&
                  (c.inState["focusout" == b.type ? "focus" : "hover"] = !1),
                !c.isInStateTrue())
              )
                return (
                  clearTimeout(c.timeout),
                  (c.hoverState = "out"),
                  c.options.delay && c.options.delay.hide
                    ? void (c.timeout = setTimeout(function() {
                        "out" == c.hoverState && c.hide();
                      }, c.options.delay.hide))
                    : c.hide()
                );
            }),
            (c.prototype.show = function() {
              var d,
                e,
                f,
                g,
                h,
                i,
                j,
                k,
                l,
                m,
                n,
                o,
                p,
                q,
                b = a.Event("show.bs." + this.type);
              if (this.hasContent() && this.enabled) {
                this.$element.trigger(b);
                d = a.contains(
                  this.$element[0].ownerDocument.documentElement,
                  this.$element[0]
                );
                if (b.isDefaultPrevented() || !d) return;
                (e = this), (f = this.tip()), (g = this.getUID(this.type));
                this.setContent(),
                  f.attr("id", g),
                  this.$element.attr("aria-describedby", g),
                  this.options.animation && f.addClass("fade");
                (h =
                  "function" == typeof this.options.placement
                    ? this.options.placement.call(this, f[0], this.$element[0])
                    : this.options.placement),
                  (i = /\s?auto?\s?/i),
                  (j = i.test(h));
                j && (h = h.replace(i, "") || "top"),
                  f
                    .detach()
                    .css({ top: 0, left: 0, display: "block" })
                    .addClass(h)
                    .data("bs." + this.type, this),
                  this.options.container
                    ? f.appendTo(this.options.container)
                    : f.insertAfter(this.$element),
                  this.$element.trigger("inserted.bs." + this.type);
                (k = this.getPosition()),
                  (l = f[0].offsetWidth),
                  (m = f[0].offsetHeight);
                if (j) {
                  (n = h), (o = this.getPosition(this.$viewport));
                  (h =
                    "bottom" == h && k.bottom + m > o.bottom
                      ? "top"
                      : "top" == h && k.top - m < o.top
                        ? "bottom"
                        : "right" == h && k.right + l > o.width
                          ? "left"
                          : "left" == h && k.left - l < o.left
                            ? "right"
                            : h),
                    f.removeClass(n).addClass(h);
                }
                p = this.getCalculatedOffset(h, k, l, m);
                this.applyPlacement(p, h);
                q = function() {
                  var a = e.hoverState;
                  e.$element.trigger("shown.bs." + e.type),
                    (e.hoverState = null),
                    "out" == a && e.leave(e);
                };
                a.support.transition && this.$tip.hasClass("fade")
                  ? f
                      .one("bsTransitionEnd", q)
                      .emulateTransitionEnd(c.TRANSITION_DURATION)
                  : q();
              }
            }),
            (c.prototype.applyPlacement = function(b, c) {
              var i,
                j,
                k,
                l,
                m,
                n,
                d = this.tip(),
                e = d[0].offsetWidth,
                f = d[0].offsetHeight,
                g = parseInt(d.css("margin-top"), 10),
                h = parseInt(d.css("margin-left"), 10);
              isNaN(g) && (g = 0),
                isNaN(h) && (h = 0),
                (b.top += g),
                (b.left += h),
                a.offset.setOffset(
                  d[0],
                  a.extend(
                    {
                      using: function(a) {
                        d.css({
                          top: Math.round(a.top),
                          left: Math.round(a.left)
                        });
                      }
                    },
                    b
                  ),
                  0
                ),
                d.addClass("in");
              (i = d[0].offsetWidth), (j = d[0].offsetHeight);
              "top" == c && j != f && (b.top = b.top + f - j);
              k = this.getViewportAdjustedDelta(c, b, i, j);
              k.left ? (b.left += k.left) : (b.top += k.top);
              (l = /top|bottom/.test(c)),
                (m = l ? 2 * k.left - e + i : 2 * k.top - f + j),
                (n = l ? "offsetWidth" : "offsetHeight");
              d.offset(b), this.replaceArrow(m, d[0][n], l);
            }),
            (c.prototype.replaceArrow = function(a, b, c) {
              this.arrow()
                .css(c ? "left" : "top", 50 * (1 - a / b) + "%")
                .css(c ? "top" : "left", "");
            }),
            (c.prototype.setContent = function() {
              var a = this.tip(),
                b = this.getTitle();
              a.find(".tooltip-inner")[this.options.html ? "html" : "text"](b),
                a.removeClass("fade in top bottom left right");
            }),
            (c.prototype.hide = function(b) {
              function d() {
                "in" != e.hoverState && f.detach(),
                  e.$element &&
                    e.$element
                      .removeAttr("aria-describedby")
                      .trigger("hidden.bs." + e.type),
                  b && b();
              }
              var e = this,
                f = a(this.$tip),
                g = a.Event("hide.bs." + this.type);
              if ((this.$element.trigger(g), !g.isDefaultPrevented()))
                return (
                  f.removeClass("in"),
                  a.support.transition && f.hasClass("fade")
                    ? f
                        .one("bsTransitionEnd", d)
                        .emulateTransitionEnd(c.TRANSITION_DURATION)
                    : d(),
                  (this.hoverState = null),
                  this
                );
            }),
            (c.prototype.fixTitle = function() {
              var a = this.$element;
              (a.attr("title") ||
                "string" != typeof a.attr("data-original-title")) &&
                a
                  .attr("data-original-title", a.attr("title") || "")
                  .attr("title", "");
            }),
            (c.prototype.hasContent = function() {
              return this.getTitle();
            }),
            (c.prototype.getPosition = function(b) {
              var c, d, e, f, g, h, i;
              b = b || this.$element;
              (c = b[0]),
                (d = "BODY" == c.tagName),
                (e = c.getBoundingClientRect());
              null == e.width &&
                (e = a.extend({}, e, {
                  width: e.right - e.left,
                  height: e.bottom - e.top
                }));
              (f = window.SVGElement && c instanceof window.SVGElement),
                (g = d ? { top: 0, left: 0 } : f ? null : b.offset()),
                (h = {
                  scroll: d
                    ? document.documentElement.scrollTop ||
                      document.body.scrollTop
                    : b.scrollTop()
                }),
                (i = d
                  ? { width: a(window).width(), height: a(window).height() }
                  : null);
              return a.extend({}, e, h, i, g);
            }),
            (c.prototype.getCalculatedOffset = function(a, b, c, d) {
              return "bottom" == a
                ? { top: b.top + b.height, left: b.left + b.width / 2 - c / 2 }
                : "top" == a
                  ? { top: b.top - d, left: b.left + b.width / 2 - c / 2 }
                  : "left" == a
                    ? { top: b.top + b.height / 2 - d / 2, left: b.left - c }
                    : {
                        top: b.top + b.height / 2 - d / 2,
                        left: b.left + b.width
                      };
            }),
            (c.prototype.getViewportAdjustedDelta = function(a, b, c, d) {
              var f,
                g,
                h,
                i,
                j,
                k,
                e = { top: 0, left: 0 };
              if (!this.$viewport) return e;
              (f =
                (this.options.viewport && this.options.viewport.padding) || 0),
                (g = this.getPosition(this.$viewport));
              if (/right|left/.test(a)) {
                (h = b.top - f - g.scroll), (i = b.top + f - g.scroll + d);
                h < g.top
                  ? (e.top = g.top - h)
                  : i > g.top + g.height && (e.top = g.top + g.height - i);
              } else {
                (j = b.left - f), (k = b.left + f + c);
                j < g.left
                  ? (e.left = g.left - j)
                  : k > g.right && (e.left = g.left + g.width - k);
              }
              return e;
            }),
            (c.prototype.getTitle = function() {
              var b = this.$element,
                c = this.options;
              return (
                b.attr("data-original-title") ||
                ("function" == typeof c.title ? c.title.call(b[0]) : c.title)
              );
            }),
            (c.prototype.getUID = function(a) {
              do {
                a += ~~(1e6 * Math.random());
              } while (document.getElementById(a));
              return a;
            }),
            (c.prototype.tip = function() {
              if (
                !this.$tip &&
                ((this.$tip = a(this.options.template)), 1 != this.$tip.length)
              )
                throw new Error(
                  this.type +
                    " `template` option must consist of exactly 1 top-level element!"
                );
              return this.$tip;
            }),
            (c.prototype.arrow = function() {
              return (this.$arrow =
                this.$arrow || this.tip().find(".tooltip-arrow"));
            }),
            (c.prototype.enable = function() {
              this.enabled = !0;
            }),
            (c.prototype.disable = function() {
              this.enabled = !1;
            }),
            (c.prototype.toggleEnabled = function() {
              this.enabled = !this.enabled;
            }),
            (c.prototype.toggle = function(b) {
              var c = this;
              b &&
                ((c = a(b.currentTarget).data("bs." + this.type)) ||
                  ((c = new this.constructor(
                    b.currentTarget,
                    this.getDelegateOptions()
                  )),
                  a(b.currentTarget).data("bs." + this.type, c))),
                b
                  ? ((c.inState.click = !c.inState.click),
                    c.isInStateTrue() ? c.enter(c) : c.leave(c))
                  : c.tip().hasClass("in")
                    ? c.leave(c)
                    : c.enter(c);
            }),
            (c.prototype.destroy = function() {
              var a = this;
              clearTimeout(this.timeout),
                this.hide(function() {
                  a.$element.off("." + a.type).removeData("bs." + a.type),
                    a.$tip && a.$tip.detach(),
                    (a.$tip = null),
                    (a.$arrow = null),
                    (a.$viewport = null),
                    (a.$element = null);
                });
            });
          d = a.fn.tooltip;
          (a.fn.tooltip = b),
            (a.fn.tooltip.Constructor = c),
            (a.fn.tooltip.noConflict = function() {
              return (a.fn.tooltip = d), this;
            });
        })(jQuery),
        (function(a) {
          "use strict";
          function b(b) {
            return this.each(function() {
              var d = a(this),
                e = d.data("bs.popover"),
                f = "object" == typeof b && b;
              (!e && /destroy|hide/.test(b)) ||
                (e || d.data("bs.popover", (e = new c(this, f))),
                "string" == typeof b && e[b]());
            });
          }
          var d,
            c = function(a, b) {
              this.init("popover", a, b);
            };
          if (!a.fn.tooltip) throw new Error("Popover requires tooltip.js");
          (c.VERSION = "3.3.7"),
            (c.DEFAULTS = a.extend({}, a.fn.tooltip.Constructor.DEFAULTS, {
              placement: "right",
              trigger: "click",
              content: "",
              template:
                '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
            })),
            (c.prototype = a.extend({}, a.fn.tooltip.Constructor.prototype)),
            (c.prototype.constructor = c),
            (c.prototype.getDefaults = function() {
              return c.DEFAULTS;
            }),
            (c.prototype.setContent = function() {
              var a = this.tip(),
                b = this.getTitle(),
                c = this.getContent();
              a.find(".popover-title")[this.options.html ? "html" : "text"](b),
                a
                  .find(".popover-content")
                  .children()
                  .detach()
                  .end()
                  [
                    this.options.html
                      ? "string" == typeof c
                        ? "html"
                        : "append"
                      : "text"
                  ](c),
                a.removeClass("fade top bottom left right in"),
                a.find(".popover-title").html() ||
                  a.find(".popover-title").hide();
            }),
            (c.prototype.hasContent = function() {
              return this.getTitle() || this.getContent();
            }),
            (c.prototype.getContent = function() {
              var a = this.$element,
                b = this.options;
              return (
                a.attr("data-content") ||
                ("function" == typeof b.content
                  ? b.content.call(a[0])
                  : b.content)
              );
            }),
            (c.prototype.arrow = function() {
              return (this.$arrow = this.$arrow || this.tip().find(".arrow"));
            });
          d = a.fn.popover;
          (a.fn.popover = b),
            (a.fn.popover.Constructor = c),
            (a.fn.popover.noConflict = function() {
              return (a.fn.popover = d), this;
            });
        })(jQuery),
        (function(a) {
          "use strict";
          function b(c, d) {
            (this.$body = a(document.body)),
              (this.$scrollElement = a(a(c).is(document.body) ? window : c)),
              (this.options = a.extend({}, b.DEFAULTS, d)),
              (this.selector = (this.options.target || "") + " .nav li > a"),
              (this.offsets = []),
              (this.targets = []),
              (this.activeTarget = null),
              (this.scrollHeight = 0),
              this.$scrollElement.on(
                "scroll.bs.scrollspy",
                a.proxy(this.process, this)
              ),
              this.refresh(),
              this.process();
          }
          function c(c) {
            return this.each(function() {
              var d = a(this),
                e = d.data("bs.scrollspy"),
                f = "object" == typeof c && c;
              e || d.data("bs.scrollspy", (e = new b(this, f))),
                "string" == typeof c && e[c]();
            });
          }
          (b.VERSION = "3.3.7"),
            (b.DEFAULTS = { offset: 10 }),
            (b.prototype.getScrollHeight = function() {
              return (
                this.$scrollElement[0].scrollHeight ||
                Math.max(
                  this.$body[0].scrollHeight,
                  document.documentElement.scrollHeight
                )
              );
            }),
            (b.prototype.refresh = function() {
              var b = this,
                c = "offset",
                d = 0;
              (this.offsets = []),
                (this.targets = []),
                (this.scrollHeight = this.getScrollHeight()),
                a.isWindow(this.$scrollElement[0]) ||
                  ((c = "position"), (d = this.$scrollElement.scrollTop())),
                this.$body
                  .find(this.selector)
                  .map(function() {
                    var b = a(this),
                      e = b.data("target") || b.attr("href"),
                      f = /^#./.test(e) && a(e);
                    return (
                      (f &&
                        f.length &&
                        f.is(":visible") && [[f[c]().top + d, e]]) ||
                      null
                    );
                  })
                  .sort(function(a, b) {
                    return a[0] - b[0];
                  })
                  .each(function() {
                    b.offsets.push(this[0]), b.targets.push(this[1]);
                  });
            }),
            (b.prototype.process = function() {
              var a,
                b = this.$scrollElement.scrollTop() + this.options.offset,
                c = this.getScrollHeight(),
                d = this.options.offset + c - this.$scrollElement.height(),
                e = this.offsets,
                f = this.targets,
                g = this.activeTarget;
              if ((this.scrollHeight != c && this.refresh(), b >= d))
                return g != (a = f[f.length - 1]) && this.activate(a);
              if (g && b < e[0])
                return (this.activeTarget = null), this.clear();
              for (a = e.length; a--; )
                g != f[a] &&
                  b >= e[a] &&
                  (void 0 === e[a + 1] || b < e[a + 1]) &&
                  this.activate(f[a]);
            }),
            (b.prototype.activate = function(b) {
              (this.activeTarget = b), this.clear();
              var c =
                  this.selector +
                  '[data-target="' +
                  b +
                  '"],' +
                  this.selector +
                  '[href="' +
                  b +
                  '"]',
                d = a(c)
                  .parents("li")
                  .addClass("active");
              d.parent(".dropdown-menu").length &&
                (d = d.closest("li.dropdown").addClass("active")),
                d.trigger("activate.bs.scrollspy");
            }),
            (b.prototype.clear = function() {
              a(this.selector)
                .parentsUntil(this.options.target, ".active")
                .removeClass("active");
            });
          var d = a.fn.scrollspy;
          (a.fn.scrollspy = c),
            (a.fn.scrollspy.Constructor = b),
            (a.fn.scrollspy.noConflict = function() {
              return (a.fn.scrollspy = d), this;
            }),
            a(window).on("load.bs.scrollspy.data-api", function() {
              a('[data-spy="scroll"]').each(function() {
                var b = a(this);
                c.call(b, b.data());
              });
            });
        })(jQuery),
        (function(a) {
          "use strict";
          function b(b) {
            return this.each(function() {
              var d = a(this),
                e = d.data("bs.tab");
              e || d.data("bs.tab", (e = new c(this))),
                "string" == typeof b && e[b]();
            });
          }
          var d,
            e,
            c = function(b) {
              this.element = a(b);
            };
          (c.VERSION = "3.3.7"),
            (c.TRANSITION_DURATION = 150),
            (c.prototype.show = function() {
              var e,
                f,
                g,
                h,
                b = this.element,
                c = b.closest("ul:not(.dropdown-menu)"),
                d = b.data("target");
              if (
                (d ||
                  ((d = b.attr("href")),
                  (d = d && d.replace(/.*(?=#[^\s]*$)/, ""))),
                !b.parent("li").hasClass("active"))
              ) {
                (e = c.find(".active:last a")),
                  (f = a.Event("hide.bs.tab", { relatedTarget: b[0] })),
                  (g = a.Event("show.bs.tab", { relatedTarget: e[0] }));
                if (
                  (e.trigger(f),
                  b.trigger(g),
                  !g.isDefaultPrevented() && !f.isDefaultPrevented())
                ) {
                  h = a(d);
                  this.activate(b.closest("li"), c),
                    this.activate(h, h.parent(), function() {
                      e.trigger({ type: "hidden.bs.tab", relatedTarget: b[0] }),
                        b.trigger({
                          type: "shown.bs.tab",
                          relatedTarget: e[0]
                        });
                    });
                }
              }
            }),
            (c.prototype.activate = function(b, d, e) {
              function f() {
                g
                  .removeClass("active")
                  .find("> .dropdown-menu > .active")
                  .removeClass("active")
                  .end()
                  .find('[data-toggle="tab"]')
                  .attr("aria-expanded", !1),
                  b
                    .addClass("active")
                    .find('[data-toggle="tab"]')
                    .attr("aria-expanded", !0),
                  h
                    ? (b[0].offsetWidth, b.addClass("in"))
                    : b.removeClass("fade"),
                  b.parent(".dropdown-menu").length &&
                    b
                      .closest("li.dropdown")
                      .addClass("active")
                      .end()
                      .find('[data-toggle="tab"]')
                      .attr("aria-expanded", !0),
                  e && e();
              }
              var g = d.find("> .active"),
                h =
                  e &&
                  a.support.transition &&
                  ((g.length && g.hasClass("fade")) ||
                    !!d.find("> .fade").length);
              g.length && h
                ? g
                    .one("bsTransitionEnd", f)
                    .emulateTransitionEnd(c.TRANSITION_DURATION)
                : f(),
                g.removeClass("in");
            });
          d = a.fn.tab;
          (a.fn.tab = b),
            (a.fn.tab.Constructor = c),
            (a.fn.tab.noConflict = function() {
              return (a.fn.tab = d), this;
            });
          e = function(c) {
            c.preventDefault(), b.call(a(this), "show");
          };
          a(document)
            .on("click.bs.tab.data-api", '[data-toggle="tab"]', e)
            .on("click.bs.tab.data-api", '[data-toggle="pill"]', e);
        })(jQuery),
        (function(a) {
          "use strict";
          function b(b) {
            return this.each(function() {
              var d = a(this),
                e = d.data("bs.affix"),
                f = "object" == typeof b && b;
              e || d.data("bs.affix", (e = new c(this, f))),
                "string" == typeof b && e[b]();
            });
          }
          var d,
            c = function(b, d) {
              (this.options = a.extend({}, c.DEFAULTS, d)),
                (this.$target = a(this.options.target)
                  .on(
                    "scroll.bs.affix.data-api",
                    a.proxy(this.checkPosition, this)
                  )
                  .on(
                    "click.bs.affix.data-api",
                    a.proxy(this.checkPositionWithEventLoop, this)
                  )),
                (this.$element = a(b)),
                (this.affixed = null),
                (this.unpin = null),
                (this.pinnedOffset = null),
                this.checkPosition();
            };
          (c.VERSION = "3.3.7"),
            (c.RESET = "affix affix-top affix-bottom"),
            (c.DEFAULTS = { offset: 0, target: window }),
            (c.prototype.getState = function(a, b, c, d) {
              var h,
                i,
                j,
                e = this.$target.scrollTop(),
                f = this.$element.offset(),
                g = this.$target.height();
              if (null != c && "top" == this.affixed) return e < c && "top";
              if ("bottom" == this.affixed)
                return null != c
                  ? !(e + this.unpin <= f.top) && "bottom"
                  : !(e + g <= a - d) && "bottom";
              (h = null == this.affixed), (i = h ? e : f.top), (j = h ? g : b);
              return null != c && e <= c
                ? "top"
                : null != d && i + j >= a - d && "bottom";
            }),
            (c.prototype.getPinnedOffset = function() {
              if (this.pinnedOffset) return this.pinnedOffset;
              this.$element.removeClass(c.RESET).addClass("affix");
              var a = this.$target.scrollTop(),
                b = this.$element.offset();
              return (this.pinnedOffset = b.top - a);
            }),
            (c.prototype.checkPositionWithEventLoop = function() {
              setTimeout(a.proxy(this.checkPosition, this), 1);
            }),
            (c.prototype.checkPosition = function() {
              var b, d, e, f, g, h, i, j;
              if (this.$element.is(":visible")) {
                (b = this.$element.height()),
                  (d = this.options.offset),
                  (e = d.top),
                  (f = d.bottom),
                  (g = Math.max(
                    a(document).height(),
                    a(document.body).height()
                  ));
                "object" != typeof d && (f = e = d),
                  "function" == typeof e && (e = d.top(this.$element)),
                  "function" == typeof f && (f = d.bottom(this.$element));
                h = this.getState(g, b, e, f);
                if (this.affixed != h) {
                  null != this.unpin && this.$element.css("top", "");
                  (i = "affix" + (h ? "-" + h : "")),
                    (j = a.Event(i + ".bs.affix"));
                  if ((this.$element.trigger(j), j.isDefaultPrevented()))
                    return;
                  (this.affixed = h),
                    (this.unpin =
                      "bottom" == h ? this.getPinnedOffset() : null),
                    this.$element
                      .removeClass(c.RESET)
                      .addClass(i)
                      .trigger(i.replace("affix", "affixed") + ".bs.affix");
                }
                "bottom" == h && this.$element.offset({ top: g - b - f });
              }
            });
          d = a.fn.affix;
          (a.fn.affix = b),
            (a.fn.affix.Constructor = c),
            (a.fn.affix.noConflict = function() {
              return (a.fn.affix = d), this;
            }),
            a(window).on("load", function() {
              a('[data-spy="affix"]').each(function() {
                var c = a(this),
                  d = c.data();
                (d.offset = d.offset || {}),
                  null != d.offsetBottom && (d.offset.bottom = d.offsetBottom),
                  null != d.offsetTop && (d.offset.top = d.offsetTop),
                  b.call(c, d);
              });
            });
        })(jQuery);
    }.apply(root, arguments);
  });
})(this);
!(function(a) {
  "use strict";
  "function" == typeof define && define.amd
    ? define("remote-lib/Sortable.min", a)
    : "undefined" != typeof module && void 0 !== module.exports
      ? (module.exports = a())
      : (window.Sortable = a());
})(function() {
  "use strict";
  function a(b, c) {
    var d, e, g;
    if (!b || !b.nodeType || 1 !== b.nodeType)
      throw "Sortable: `el` must be HTMLElement, and not " +
        {}.toString.call(b);
    (this.el = b), (this.options = c = t({}, c)), (b[V] = this);
    d = {
      group: Math.random(),
      sort: !0,
      disabled: !1,
      store: null,
      handle: null,
      scroll: !0,
      scrollSensitivity: 30,
      scrollSpeed: 10,
      draggable: /[uo]l/i.test(b.nodeName) ? "li" : ">*",
      ghostClass: "sortable-ghost",
      chosenClass: "sortable-chosen",
      dragClass: "sortable-drag",
      ignore: "a, img",
      filter: null,
      preventOnFilter: !0,
      animation: 0,
      setData: function(a, b) {
        a.setData("Text", b.textContent);
      },
      dropBubble: !1,
      dragoverBubble: !1,
      dataIdAttr: "data-id",
      delay: 0,
      forceFallback: !1,
      fallbackClass: "sortable-fallback",
      fallbackOnBody: !1,
      fallbackTolerance: 0,
      fallbackOffset: { x: 0, y: 0 },
      supportPointer: !1 !== a.supportPointer
    };
    for (e in d) !(e in c) && (c[e] = d[e]);
    ka(c);
    for (g in this)
      "_" === g.charAt(0) &&
        "function" == typeof this[g] &&
        (this[g] = this[g].bind(this));
    (this.nativeDraggable = !c.forceFallback && ca),
      f(b, "mousedown", this._onTapStart),
      f(b, "touchstart", this._onTapStart),
      c.supportPointer && f(b, "pointerdown", this._onTapStart),
      this.nativeDraggable && (f(b, "dragover", this), f(b, "dragenter", this)),
      ia.push(this._onDragOver),
      c.store && this.sort(c.store.get(this));
  }
  function b(a, b) {
    "clone" !== a.lastPullMode && (b = !0),
      B &&
        B.state !== b &&
        (i(B, "display", b ? "none" : ""),
        b ||
          (B.state &&
            (a.options.group.revertClone
              ? (C.insertBefore(B, D), a._animate(y, B))
              : C.insertBefore(B, y))),
        (B.state = b));
  }
  function c(a, b, c) {
    if (a) {
      c = c || X;
      do {
        if ((">*" === b && a.parentNode === c) || r(a, b)) return a;
      } while ((a = d(a)));
    }
    return null;
  }
  function d(a) {
    var b = a.host;
    return b && b.nodeType ? b : a.parentNode;
  }
  function e(a) {
    a.dataTransfer && (a.dataTransfer.dropEffect = "move"), a.preventDefault();
  }
  function f(a, b, c) {
    a.addEventListener(b, c, aa);
  }
  function g(a, b, c) {
    a.removeEventListener(b, c, aa);
  }
  function h(a, b, c) {
    if (a)
      if (a.classList) a.classList[c ? "add" : "remove"](b);
      else {
        var d = (" " + a.className + " ")
          .replace(T, " ")
          .replace(" " + b + " ", " ");
        a.className = (d + (c ? " " + b : "")).replace(T, " ");
      }
  }
  function i(a, b, c) {
    var d = a && a.style;
    if (d) {
      if (void 0 === c)
        return (
          X.defaultView && X.defaultView.getComputedStyle
            ? (c = X.defaultView.getComputedStyle(a, ""))
            : a.currentStyle && (c = a.currentStyle),
          void 0 === b ? c : c[b]
        );
      b in d || (b = "-webkit-" + b),
        (d[b] = c + ("string" == typeof c ? "" : "px"));
    }
  }
  function j(a, b, c) {
    if (a) {
      var d = a.getElementsByTagName(b),
        e = 0,
        f = d.length;
      if (c) for (; e < f; e++) c(d[e], e);
      return d;
    }
    return [];
  }
  function k(a, b, c, d, e, f, g, h) {
    a = a || b[V];
    var i = X.createEvent("Event"),
      j = a.options,
      k = "on" + c.charAt(0).toUpperCase() + c.substr(1);
    i.initEvent(c, !0, !0),
      (i.to = e || b),
      (i.from = f || b),
      (i.item = d || b),
      (i.clone = B),
      (i.oldIndex = g),
      (i.newIndex = h),
      b.dispatchEvent(i),
      j[k] && j[k].call(a, i);
  }
  function l(a, b, c, d, e, f, g, h) {
    var i,
      j,
      k = a[V],
      l = k.options.onMove;
    return (
      (i = X.createEvent("Event")),
      i.initEvent("move", !0, !0),
      (i.to = b),
      (i.from = a),
      (i.dragged = c),
      (i.draggedRect = d),
      (i.related = e || b),
      (i.relatedRect = f || b.getBoundingClientRect()),
      (i.willInsertAfter = h),
      a.dispatchEvent(i),
      l && (j = l.call(k, i, g)),
      j
    );
  }
  function m(a) {
    a.draggable = !1;
  }
  function n() {
    ea = !1;
  }
  function o(a, b) {
    var c = a.lastElementChild,
      d = c.getBoundingClientRect();
    return (
      b.clientY - (d.top + d.height) > 5 || b.clientX - (d.left + d.width) > 5
    );
  }
  function p(a) {
    for (
      var b = a.tagName + a.className + a.src + a.href + a.textContent,
        c = b.length,
        d = 0;
      c--;

    )
      d += b.charCodeAt(c);
    return d.toString(36);
  }
  function q(a, b) {
    var c = 0;
    if (!a || !a.parentNode) return -1;
    for (; a && (a = a.previousElementSibling); )
      "TEMPLATE" === a.nodeName.toUpperCase() ||
        (">*" !== b && !r(a, b)) ||
        c++;
    return c;
  }
  function r(a, b) {
    if (a) {
      b = b.split(".");
      var c = b.shift().toUpperCase(),
        d = new RegExp("\\s(" + b.join("|") + ")(?=\\s)", "g");
      return !(
        ("" !== c && a.nodeName.toUpperCase() != c) ||
        (b.length &&
          ((" " + a.className + " ").match(d) || []).length != b.length)
      );
    }
    return !1;
  }
  function s(a, b) {
    var c, d;
    return function() {
      void 0 === c &&
        ((c = arguments),
        (d = this),
        Z(function() {
          1 === c.length ? a.call(d, c[0]) : a.apply(d, c), (c = void 0);
        }, b));
    };
  }
  function t(a, b) {
    if (a && b) for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
    return a;
  }
  function u(a) {
    return _ && _.dom
      ? _.dom(a).cloneNode(!0)
      : $
        ? $(a).clone(!0)[0]
        : a.cloneNode(!0);
  }
  function v(a) {
    var b, c, d;
    for (b = a.getElementsByTagName("input"), c = b.length; c--; ) {
      d = b[c];
      d.checked && ha.push(d);
    }
  }
  function w(a) {
    return Z(a, 0);
  }
  function x(a) {
    return clearTimeout(a);
  }
  if ("undefined" == typeof window || !window.document)
    return function() {
      throw new Error("Sortable.js requires a window with a document");
    };
  var y,
    z,
    A,
    B,
    C,
    D,
    E,
    F,
    G,
    H,
    I,
    J,
    K,
    L,
    M,
    N,
    O,
    P,
    Q,
    R,
    S = {},
    T = /\s+/g,
    U = /left|right|inline/,
    V = "Sortable" + new Date().getTime(),
    W = window,
    X = W.document,
    Y = W.parseInt,
    Z = W.setTimeout,
    $ = W.jQuery || W.Zepto,
    _ = W.Polymer,
    aa = !1,
    ba = !1,
    ca = "draggable" in X.createElement("div"),
    da = (function(a) {
      return (
        !navigator.userAgent.match(/(?:Trident.*rv[ :]?11\.|msie)/i) &&
        ((a = X.createElement("x")),
        (a.style.cssText = "pointer-events:auto"),
        "auto" === a.style.pointerEvents)
      );
    })(),
    ea = !1,
    fa = Math.abs,
    ga = Math.min,
    ha = [],
    ia = [],
    ja = s(function(a, b, c) {
      if (c && b.scroll) {
        var d,
          e,
          f,
          g,
          h,
          i,
          j = c[V],
          k = b.scrollSensitivity,
          l = b.scrollSpeed,
          m = a.clientX,
          n = a.clientY,
          o = window.innerWidth,
          p = window.innerHeight;
        if (G !== c && ((F = b.scroll), (G = c), (H = b.scrollFn), !0 === F)) {
          F = c;
          do {
            if (
              F.offsetWidth < F.scrollWidth ||
              F.offsetHeight < F.scrollHeight
            )
              break;
          } while ((F = F.parentNode));
        }
        F &&
          ((d = F),
          (e = F.getBoundingClientRect()),
          (f = (fa(e.right - m) <= k) - (fa(e.left - m) <= k)),
          (g = (fa(e.bottom - n) <= k) - (fa(e.top - n) <= k))),
          f ||
            g ||
            ((f = (o - m <= k) - (m <= k)),
            (g = (p - n <= k) - (n <= k)),
            (f || g) && (d = W)),
          (S.vx === f && S.vy === g && S.el === d) ||
            ((S.el = d),
            (S.vx = f),
            (S.vy = g),
            clearInterval(S.pid),
            d &&
              (S.pid = setInterval(function() {
                return (
                  (i = g ? g * l : 0),
                  (h = f ? f * l : 0),
                  "function" == typeof H
                    ? H.call(j, h, i, a)
                    : void (d === W
                        ? W.scrollTo(W.pageXOffset + h, W.pageYOffset + i)
                        : ((d.scrollTop += i), (d.scrollLeft += h)))
                );
              }, 24)));
      }
    }, 30),
    ka = function(a) {
      function b(a, b) {
        return (
          (void 0 !== a && !0 !== a) || (a = c.name),
          "function" == typeof a
            ? a
            : function(c, d) {
                var e = d.options.group.name;
                return b ? a : a && (a.join ? a.indexOf(e) > -1 : e == a);
              }
        );
      }
      var c = {},
        d = a.group;
      (d && "object" == typeof d) || (d = { name: d }),
        (c.name = d.name),
        (c.checkPull = b(d.pull, !0)),
        (c.checkPut = b(d.put)),
        (c.revertClone = d.revertClone),
        (a.group = c);
    };
  try {
    window.addEventListener(
      "test",
      null,
      Object.defineProperty({}, "passive", {
        get: function() {
          (ba = !1), (aa = { capture: !1, passive: ba });
        }
      })
    );
  } catch (a) {}
  return (
    (a.prototype = {
      constructor: a,
      _onTapStart: function(a) {
        var b,
          d = this,
          e = this.el,
          f = this.options,
          g = f.preventOnFilter,
          h = a.type,
          i = a.touches && a.touches[0],
          j = (i || a).target,
          l = (a.target.shadowRoot && a.path && a.path[0]) || j,
          m = f.filter;
        if (
          (v(e),
          !y &&
            !(
              (/mousedown|pointerdown/.test(h) && 0 !== a.button) ||
              f.disabled
            ) &&
            !l.isContentEditable &&
            (j = c(j, f.draggable, e)) &&
            E !== j)
        ) {
          if (((b = q(j, f.draggable)), "function" == typeof m)) {
            if (m.call(this, a, j, this))
              return (
                k(d, l, "filter", j, e, e, b), void (g && a.preventDefault())
              );
          } else if (
            m &&
            (m = m.split(",").some(function(a) {
              if ((a = c(l, a.trim(), e)))
                return k(d, a, "filter", j, e, e, b), !0;
            }))
          )
            return void (g && a.preventDefault());
          (f.handle && !c(l, f.handle, e)) ||
            this._prepareDragStart(a, i, j, b);
        }
      },
      _prepareDragStart: function(a, b, c, d) {
        var e,
          g = this,
          i = g.el,
          l = g.options,
          n = i.ownerDocument;
        c &&
          !y &&
          c.parentNode === i &&
          ((P = a),
          (C = i),
          (y = c),
          (z = y.parentNode),
          (D = y.nextSibling),
          (E = c),
          (N = l.group),
          (L = d),
          (this._lastX = (b || a).clientX),
          (this._lastY = (b || a).clientY),
          (y.style["will-change"] = "all"),
          (e = function() {
            g._disableDelayedDrag(),
              (y.draggable = g.nativeDraggable),
              h(y, l.chosenClass, !0),
              g._triggerDragStart(a, b),
              k(g, C, "choose", y, C, C, L);
          }),
          l.ignore.split(",").forEach(function(a) {
            j(y, a.trim(), m);
          }),
          f(n, "mouseup", g._onDrop),
          f(n, "touchend", g._onDrop),
          f(n, "touchcancel", g._onDrop),
          f(n, "selectstart", g),
          l.supportPointer && f(n, "pointercancel", g._onDrop),
          l.delay
            ? (f(n, "mouseup", g._disableDelayedDrag),
              f(n, "touchend", g._disableDelayedDrag),
              f(n, "touchcancel", g._disableDelayedDrag),
              f(n, "mousemove", g._disableDelayedDrag),
              f(n, "touchmove", g._disableDelayedDrag),
              l.supportPointer && f(n, "pointermove", g._disableDelayedDrag),
              (g._dragStartTimer = Z(e, l.delay)))
            : e());
      },
      _disableDelayedDrag: function() {
        var a = this.el.ownerDocument;
        clearTimeout(this._dragStartTimer),
          g(a, "mouseup", this._disableDelayedDrag),
          g(a, "touchend", this._disableDelayedDrag),
          g(a, "touchcancel", this._disableDelayedDrag),
          g(a, "mousemove", this._disableDelayedDrag),
          g(a, "touchmove", this._disableDelayedDrag),
          g(a, "pointermove", this._disableDelayedDrag);
      },
      _triggerDragStart: function(a, b) {
        (b = b || ("touch" == a.pointerType ? a : null)),
          b
            ? ((P = { target: y, clientX: b.clientX, clientY: b.clientY }),
              this._onDragStart(P, "touch"))
            : this.nativeDraggable
              ? (f(y, "dragend", this), f(C, "dragstart", this._onDragStart))
              : this._onDragStart(P, !0);
        try {
          X.selection
            ? w(function() {
                X.selection.empty();
              })
            : window.getSelection().removeAllRanges();
        } catch (a) {}
      },
      _dragStarted: function() {
        if (C && y) {
          var b = this.options;
          h(y, b.ghostClass, !0),
            h(y, b.dragClass, !1),
            (a.active = this),
            k(this, C, "start", y, C, C, L);
        } else this._nulling();
      },
      _emulateDragOver: function() {
        if (Q) {
          if (this._lastX === Q.clientX && this._lastY === Q.clientY) return;
          (this._lastX = Q.clientX),
            (this._lastY = Q.clientY),
            da || i(A, "display", "none");
          var a = X.elementFromPoint(Q.clientX, Q.clientY),
            b = a,
            c = ia.length;
          if (
            (a &&
              a.shadowRoot &&
              ((a = a.shadowRoot.elementFromPoint(Q.clientX, Q.clientY)),
              (b = a)),
            b)
          )
            do {
              if (b[V]) {
                for (; c--; )
                  ia[c]({
                    clientX: Q.clientX,
                    clientY: Q.clientY,
                    target: a,
                    rootEl: b
                  });
                break;
              }
              a = b;
            } while ((b = b.parentNode));
          da || i(A, "display", "");
        }
      },
      _onTouchMove: function(b) {
        if (P) {
          var c = this.options,
            d = c.fallbackTolerance,
            e = c.fallbackOffset,
            f = b.touches ? b.touches[0] : b,
            g = f.clientX - P.clientX + e.x,
            h = f.clientY - P.clientY + e.y,
            j = b.touches
              ? "translate3d(" + g + "px," + h + "px,0)"
              : "translate(" + g + "px," + h + "px)";
          if (!a.active) {
            if (
              d &&
              ga(fa(f.clientX - this._lastX), fa(f.clientY - this._lastY)) < d
            )
              return;
            this._dragStarted();
          }
          this._appendGhost(),
            (R = !0),
            (Q = f),
            i(A, "webkitTransform", j),
            i(A, "mozTransform", j),
            i(A, "msTransform", j),
            i(A, "transform", j),
            b.preventDefault();
        }
      },
      _appendGhost: function() {
        if (!A) {
          var a,
            b = y.getBoundingClientRect(),
            c = i(y),
            d = this.options;
          (A = y.cloneNode(!0)),
            h(A, d.ghostClass, !1),
            h(A, d.fallbackClass, !0),
            h(A, d.dragClass, !0),
            i(A, "top", b.top - Y(c.marginTop, 10)),
            i(A, "left", b.left - Y(c.marginLeft, 10)),
            i(A, "width", b.width),
            i(A, "height", b.height),
            i(A, "opacity", "0.8"),
            i(A, "position", "fixed"),
            i(A, "zIndex", "100000"),
            i(A, "pointerEvents", "none"),
            (d.fallbackOnBody && X.body.appendChild(A)) || C.appendChild(A),
            (a = A.getBoundingClientRect()),
            i(A, "width", 2 * b.width - a.width),
            i(A, "height", 2 * b.height - a.height);
        }
      },
      _onDragStart: function(a, b) {
        var c = this,
          d = a.dataTransfer,
          e = c.options;
        c._offUpEvents(),
          N.checkPull(c, c, y, a) &&
            ((B = u(y)),
            (B.draggable = !1),
            (B.style["will-change"] = ""),
            i(B, "display", "none"),
            h(B, c.options.chosenClass, !1),
            (c._cloneId = w(function() {
              C.insertBefore(B, y), k(c, C, "clone", y);
            }))),
          h(y, e.dragClass, !0),
          b
            ? ("touch" === b
                ? (f(X, "touchmove", c._onTouchMove),
                  f(X, "touchend", c._onDrop),
                  f(X, "touchcancel", c._onDrop),
                  e.supportPointer &&
                    (f(X, "pointermove", c._onTouchMove),
                    f(X, "pointerup", c._onDrop)))
                : (f(X, "mousemove", c._onTouchMove),
                  f(X, "mouseup", c._onDrop)),
              (c._loopId = setInterval(c._emulateDragOver, 50)))
            : (d &&
                ((d.effectAllowed = "move"),
                e.setData && e.setData.call(c, d, y)),
              f(X, "drop", c),
              (c._dragStartId = w(c._dragStarted)));
      },
      _onDragOver: function(d) {
        var e,
          f,
          g,
          h,
          t,
          u,
          v,
          w,
          x,
          E,
          F,
          G,
          H,
          L,
          M,
          j = this.el,
          k = this.options,
          m = k.group,
          p = a.active,
          q = N === m,
          r = !1,
          s = k.sort;
        if (
          (void 0 !== d.preventDefault &&
            (d.preventDefault(), !k.dragoverBubble && d.stopPropagation()),
          !y.animated &&
            ((R = !0),
            p &&
              !k.disabled &&
              (q
                ? s || (h = !C.contains(y))
                : O === this ||
                  ((p.lastPullMode = N.checkPull(this, p, y, d)) &&
                    m.checkPut(this, p, y, d))) &&
              (void 0 === d.rootEl || d.rootEl === this.el)))
        ) {
          if ((ja(d, k, this.el), ea)) return;
          if (
            ((e = c(d.target, k.draggable, j)),
            (f = y.getBoundingClientRect()),
            O !== this && ((O = this), (r = !0)),
            h)
          )
            return (
              b(p, !0),
              (z = C),
              void (B || D ? C.insertBefore(y, B || D) : s || C.appendChild(y))
            );
          if (
            0 === j.children.length ||
            j.children[0] === A ||
            (j === d.target && o(j, d))
          ) {
            if (
              (0 !== j.children.length &&
                j.children[0] !== A &&
                j === d.target &&
                (e = j.lastElementChild),
              e)
            ) {
              if (e.animated) return;
              g = e.getBoundingClientRect();
            }
            b(p, q),
              !1 !== l(C, j, y, f, e, g, d) &&
                (y.contains(j) || (j.appendChild(y), (z = j)),
                this._animate(f, y),
                e && this._animate(g, e));
          } else if (
            e &&
            !e.animated &&
            e !== y &&
            void 0 !== e.parentNode[V]
          ) {
            I !== e && ((I = e), (J = i(e)), (K = i(e.parentNode))),
              (g = e.getBoundingClientRect());
            (t = g.right - g.left),
              (u = g.bottom - g.top),
              (v =
                U.test(J.cssFloat + J.display) ||
                ("flex" == K.display &&
                  0 === K["flex-direction"].indexOf("row"))),
              (w = e.offsetWidth > y.offsetWidth),
              (x = e.offsetHeight > y.offsetHeight),
              (E =
                (v ? (d.clientX - g.left) / t : (d.clientY - g.top) / u) > 0.5),
              (F = e.nextElementSibling),
              (G = !1);
            if (v) {
              (H = y.offsetTop), (L = e.offsetTop);
              G =
                H === L
                  ? (e.previousElementSibling === y && !w) || (E && w)
                  : e.previousElementSibling === y ||
                    y.previousElementSibling === e
                    ? (d.clientY - g.top) / u > 0.5
                    : L > H;
            } else r || (G = (F !== y && !x) || (E && x));
            M = l(C, j, y, f, e, g, d, G);
            !1 !== M &&
              ((1 !== M && -1 !== M) || (G = 1 === M),
              (ea = !0),
              Z(n, 30),
              b(p, q),
              y.contains(j) ||
                (G && !F
                  ? j.appendChild(y)
                  : e.parentNode.insertBefore(y, G ? F : e)),
              (z = y.parentNode),
              this._animate(f, y),
              this._animate(g, e));
          }
        }
      },
      _animate: function(a, b) {
        var d,
          c = this.options.animation;
        if (c) {
          d = b.getBoundingClientRect();
          1 === a.nodeType && (a = a.getBoundingClientRect()),
            i(b, "transition", "none"),
            i(
              b,
              "transform",
              "translate3d(" +
                (a.left - d.left) +
                "px," +
                (a.top - d.top) +
                "px,0)"
            ),
            b.offsetWidth,
            i(b, "transition", "all " + c + "ms"),
            i(b, "transform", "translate3d(0,0,0)"),
            clearTimeout(b.animated),
            (b.animated = Z(function() {
              i(b, "transition", ""), i(b, "transform", ""), (b.animated = !1);
            }, c));
        }
      },
      _offUpEvents: function() {
        var a = this.el.ownerDocument;
        g(X, "touchmove", this._onTouchMove),
          g(X, "pointermove", this._onTouchMove),
          g(a, "mouseup", this._onDrop),
          g(a, "touchend", this._onDrop),
          g(a, "pointerup", this._onDrop),
          g(a, "touchcancel", this._onDrop),
          g(a, "pointercancel", this._onDrop),
          g(a, "selectstart", this);
      },
      _onDrop: function(b) {
        var c = this.el,
          d = this.options;
        clearInterval(this._loopId),
          clearInterval(S.pid),
          clearTimeout(this._dragStartTimer),
          x(this._cloneId),
          x(this._dragStartId),
          g(X, "mouseover", this),
          g(X, "mousemove", this._onTouchMove),
          this.nativeDraggable &&
            (g(X, "drop", this), g(c, "dragstart", this._onDragStart)),
          this._offUpEvents(),
          b &&
            (R && (b.preventDefault(), !d.dropBubble && b.stopPropagation()),
            A && A.parentNode && A.parentNode.removeChild(A),
            (C !== z && "clone" === a.active.lastPullMode) ||
              (B && B.parentNode && B.parentNode.removeChild(B)),
            y &&
              (this.nativeDraggable && g(y, "dragend", this),
              m(y),
              (y.style["will-change"] = ""),
              h(y, this.options.ghostClass, !1),
              h(y, this.options.chosenClass, !1),
              k(this, C, "unchoose", y, z, C, L),
              C !== z
                ? (M = q(y, d.draggable)) >= 0 &&
                  (k(null, z, "add", y, z, C, L, M),
                  k(this, C, "remove", y, z, C, L, M),
                  k(null, z, "sort", y, z, C, L, M),
                  k(this, C, "sort", y, z, C, L, M))
                : y.nextSibling !== D &&
                  (M = q(y, d.draggable)) >= 0 &&
                  (k(this, C, "update", y, z, C, L, M),
                  k(this, C, "sort", y, z, C, L, M)),
              a.active &&
                ((null != M && -1 !== M) || (M = L),
                k(this, C, "end", y, z, C, L, M),
                this.save()))),
          this._nulling();
      },
      _nulling: function() {
        (C = y = z = A = D = B = E = F = G = P = Q = R = M = I = J = O = N = a.active = null),
          ha.forEach(function(a) {
            a.checked = !0;
          }),
          (ha.length = 0);
      },
      handleEvent: function(a) {
        switch (a.type) {
          case "drop":
          case "dragend":
            this._onDrop(a);
            break;
          case "dragover":
          case "dragenter":
            y && (this._onDragOver(a), e(a));
            break;
          case "mouseover":
            this._onDrop(a);
            break;
          case "selectstart":
            a.preventDefault();
        }
      },
      toArray: function() {
        for (
          var a,
            b = [],
            d = this.el.children,
            e = 0,
            f = d.length,
            g = this.options;
          e < f;
          e++
        )
          (a = d[e]),
            c(a, g.draggable, this.el) &&
              b.push(a.getAttribute(g.dataIdAttr) || p(a));
        return b;
      },
      sort: function(a) {
        var b = {},
          d = this.el;
        this.toArray().forEach(function(a, e) {
          var f = d.children[e];
          c(f, this.options.draggable, d) && (b[a] = f);
        }, this),
          a.forEach(function(a) {
            b[a] && (d.removeChild(b[a]), d.appendChild(b[a]));
          });
      },
      save: function() {
        var a = this.options.store;
        a && a.set(this);
      },
      closest: function(a, b) {
        return c(a, b || this.options.draggable, this.el);
      },
      option: function(a, b) {
        var c = this.options;
        return void 0 === b
          ? c[a]
          : ((c[a] = b), void ("group" === a && ka(c)));
      },
      destroy: function() {
        var a = this.el;
        (a[V] = null),
          g(a, "mousedown", this._onTapStart),
          g(a, "touchstart", this._onTapStart),
          g(a, "pointerdown", this._onTapStart),
          this.nativeDraggable &&
            (g(a, "dragover", this), g(a, "dragenter", this)),
          Array.prototype.forEach.call(
            a.querySelectorAll("[draggable]"),
            function(a) {
              a.removeAttribute("draggable");
            }
          ),
          ia.splice(ia.indexOf(this._onDragOver), 1),
          this._onDrop(),
          (this.el = a = null);
      }
    }),
    f(X, "touchmove", function(b) {
      a.active && b.preventDefault();
    }),
    (a.utils = {
      on: f,
      off: g,
      css: i,
      find: j,
      is: function(a, b) {
        return !!c(a, b, a);
      },
      extend: t,
      throttle: s,
      closest: c,
      toggleClass: h,
      clone: u,
      index: q,
      nextTick: w,
      cancelNextTick: x
    }),
    (a.create = function(b, c) {
      return new a(b, c);
    }),
    (a.version = "1.7.0"),
    a
  );
});
define("app-remote/framework/controllers/menusCtrl", [
  "bootstrap/bootstrap.min",
  "app-remote/framework/localization/config",
  "app-remote/services/consoleModal",
  "remote-lib/Sortable.min"
], function(bootstrap, localizationConfig, ConsoleModal, Sortable) {
  "use strict";
  var ctrl = function(
    $rootScope,
    frameworkService,
    globalRegionName,
    currentService,
    $sce,
    $state,
    $location,
    storage,
    $window,
    utilService,
    $timeout,
    $filter,
    tiTipService,
    msgService,
    $compile
  ) {
    function initUserHead() {
      frameworkService.queryIamUser($rootScope.userId).then(function(data) {
        if (data && data.user && data.user.img_path) {
          $rootScope.user_head_all = data.user.img_path;
          data.user.img_path.small &&
            ($rootScope.user_head_href.url = data.user.img_path.small);
        }
      });
    }
    function initRegions() {
      promiseRegion.then(function(data) {
        if (!data || !data.regions) return;
        $rootScope.tmpRegions = data.regions;
      });
    }
    function detectCustomLogo(url) {
      var detectImage = new Image();
      detectImage.onload = function() {
        $rootScope.isCustomLogo = !0;
      };
      detectImage.onerror = function() {
        $rootScope.isCustomLogo = !1;
      };
      detectImage.src = url;
    }
    function initAllUserInfo() {
      initUserInfo();
    }
    function initAllLinks() {
      var cfRegion = $rootScope.getUrlParameter("region", !0) || "",
        options = { region: getProjectRegionId(cfRegion) };
      frameworkService.getLinks(options).then(function(data) {
        var links, key, index;
        if (data && data.links) {
          links = {};
          key = "";
          for (index = 0; index < data.links.length; index++) {
            key = data.links[index].key + "_" + data.links[index].type;
            links[key] = data.links[index].href;
          }
          window.doubleAuthenticate = links.doubleAuthenticate_identity;
          $rootScope.links = links;
          $rootScope.linksInterfaceFlag = !0;
          window.tinyPlus.constants.link_user_center =
            links.user_center_common + "/";
          $rootScope.userCenterLink = $rootScope.links.user_center_common;
          userCenterLinkSwitch();
          getTopSearchLink();
          topSearchInputParamSet();
        }
      });
    }
    function getTopSearchLink() {
      $rootScope.links.topSearchZh_link &&
        $rootScope.links.topSearchEn_link &&
        ($rootScope.language && "zh-cn" === $rootScope.language
          ? ($rootScope.newTopSearchLink = $rootScope.links.topSearchZh_link)
          : ($rootScope.newTopSearchLink = $rootScope.links.topSearchEn_link));
    }
    function getVariable(str) {
      var strValue,
        strValueFinaly,
        result = "";
      str && (result = str.replace("-", "_") + "_");
      strValue = "user_center_" + result + "common";
      $rootScope.links &&
        Object.keys($rootScope.links).length > 0 &&
        (strValue =
          Object.keys($rootScope.links).indexOf(strValue) > 0
            ? strValue
            : "user_center_common");
      strValueFinaly = "links." + strValue;
      $rootScope.userCenterLink = $rootScope.$eval(strValueFinaly);
    }
    function userCenterLinkSwitch() {
      $rootScope.$watch("xDomainType", function(value) {
        getVariable(
          localizationConfig.userCenterLinkSwitch ? $rootScope.xDomainType : ""
        );
      });
    }
    function getDateTime(dateValue) {
      var showTime, nowTime, recordTime;
      if (!dateValue) return;
      showTime = "";
      nowTime = new Date();
      recordTime = new Date(dateValue);
      showTime =
        nowTime.getFullYear() === recordTime.getFullYear() &&
        nowTime.getMonth() === recordTime.getMonth() &&
        nowTime.getDate() === recordTime.getDate()
          ? $filter("date")(recordTime, $rootScope.i18n.timeShortFormat)
          : nowTime.getFullYear() === recordTime.getFullYear() &&
            nowTime.getMonth() === recordTime.getMonth() &&
            nowTime.getDate() - 1 === recordTime.getDate()
            ? $rootScope.i18n.console_term_operate_log_label
            : nowTime.getFullYear() === recordTime.getFullYear()
              ? $filter("date")(recordTime, $rootScope.i18n.dateShortFormat)
              : $filter("date")(
                  recordTime,
                  $rootScope.i18n.localeRule.DATETIME_FORMATS.mediumDate
                );
      return showTime;
    }
    function initUserInfo() {
      frameworkService
        .getLoginUser()
        .then(function(data) {
          $rootScope.userId = data.id;
          $rootScope.username = data.name;
          $rootScope.domainName = data.domainName;
          $rootScope.projectId = data.projectId;
          $rootScope.projectName = data.region;
          $rootScope.xDomainType = data.xDomainType;
          updateUserRoles(data.roles);
          $rootScope.isShowDistributorLink = distributorAccoutSetting(
            $rootScope.userId
          );
          data.nonsupportRegions &&
            ($rootScope.nonsupportRegions = data.nonsupportRegions);
          data.supportRegions &&
            ($rootScope.supportRegions = data.supportRegions);
          if (
            $rootScope.isNonsupportRegion(
              $rootScope.nonsupportRegions,
              $rootScope.projectName,
              $rootScope.supportRegions
            )
          ) {
            $rootScope.lastState = $state.current;
            "nonsupportRegion" !== $rootScope.lastState.name &&
              $state.go("nonsupportRegion");
          }
          if (
            !$rootScope.supportMultiProject &&
            !$rootScope.projectNameRegExp.test(data.region) &&
            $rootScope.userProjectNameRegExp.test(data.region)
          ) {
            $rootScope.lastState = $state.current;
            "nonsupportRegion" !== $rootScope.lastState.name &&
              $state.go("nonsupportRegion");
          }
          $rootScope.$on("$stateChangeSuccess", function(
            event,
            toState,
            toParams,
            fromState,
            fromParams
          ) {
            if (
              !$rootScope.supportMultiProject &&
              !$rootScope.projectNameRegExp.test(data.region) &&
              $rootScope.userProjectNameRegExp.test(data.region)
            ) {
              $rootScope.lastState = $state.current;
              "nonsupportRegion" !== $rootScope.lastState.name &&
                $state.go("nonsupportRegion");
            }
          });
          if ($.inArray("op_vendor_sub_user", data.roles) >= 0) {
            $rootScope.isVendorSubUser = !0;
            $rootScope.isVendorUser = !0;
          }
          $.inArray("op_vendor", data.roles) >= 0 &&
            ($rootScope.isVendorUser = !0);
          var isShowSuspendedStatusFrameTip = !0;
          ($.inArray("op_pc_vendor", data.roles) >= 0 ||
            $.inArray("op_vendor", data.roles) >= 0 ||
            $.inArray("op_vendor_sub_user", data.roles) >= 0 ||
            $.inArray("op_gated_pc_vendor", data.roles) >= 0) &&
            (isShowSuspendedStatusFrameTip = !1);
          if (
            $.inArray("op_suspended", data.roles) >= 0 &&
            !0 === isShowSuspendedStatusFrameTip
          ) {
            $rootScope.isSuspendedUser = !0;
            $.inArray("op_prj_disabled", data.roles) >= 0
              ? $rootScope.$watch("regionDisplayFlag", function(
                  newVal,
                  oldVal
                ) {
                  $timeout(function() {
                    $rootScope.regionDisplayFlag &&
                    $rootScope.isServiceConsole &&
                    !$rootScope.globalRegionName
                      ? $rootScope.showSuspendedProjectTipCtrl(!0)
                      : $rootScope.showSuspendedProjectTipCtrl(!1);
                  }, 800);
                })
              : $rootScope.showSuspendedUserTipCtrl(!0);
          }
          $.inArray("op_legacy", data.roles) >= 0 &&
            localizationConfig.isOldUser &&
            ($rootScope.isOldUser = !0);
          $.inArray("op_gated_pc_vendor_subuser", data.roles) >= 0 ||
          $.inArray("op_pc_vendor_subuser", data.roles) >= 0
            ? ($rootScope.isPcVendorSubuser = !0)
            : ($rootScope.isPcVendorSubuser = !1);
          $rootScope.domainId = data.domainId;
          initUserHead();
          $rootScope.localizationConfig.csbGetInterfaceSwitch &&
            queryBusinessManage();
          localizationConfig.isOpenAllianceToken &&
            isAllianceUser(
              $rootScope.domainId,
              $rootScope.cloudAllianceSiteType
            );
          localizationConfig.newMenuAdjustSwitch && querySellerAndPartner();
          if (localizationConfig.userBalanceSwitch) {
            initUserBalance();
            if ($rootScope.localizationConfig.newHECMenu) {
              initOrderInfo();
              $rootScope.localizationConfig.isHecHk || initRealNameAuth();
            }
          }
          $rootScope.$broadcast("initUser");
          promiseRegion.then(function() {
            initUserProjects();
          });
          initDefaultRegion();
          getAssumeRoles();
          $rootScope.isMessageBoxEnabled && initMessageBox();
          return frameworkService.queryEndpoints({
            region: $rootScope.projectName,
            include: !0
          });
        })
        .then(function(data) {
          dealAllEndpoints(data);
          beautifierEndpoints();
          updateFavoriteEndpoints();
        });
    }
    function updateFavoriteEndpoints() {
      return getFavoriteEndpoints().then(function(data) {
        dealFavoriteEndpoints(data);
        initIsFavorite();
      });
    }
    function initUserBalance() {
      localizationConfig.newHECMenu
        ? frameworkService.queryBESumInfo().then(function(data) {
            var currentBe, i, j, domainId, beId, currentChoiceElement;
            if (!data) return;
            currentBe = [];
            for (i = 0; i < data.cusInfoList.length; i++)
              if (3 === data.cusInfoList[i].beType) {
                currentBe.push(data.cusInfoList[i]);
                $rootScope.DistributorList.push(data.cusInfoList[i]);
                break;
              }
            if (0 === currentBe.length)
              for (j = 0; j < data.cusInfoList.length; j++)
                if (1 === data.cusInfoList[j].beType) {
                  currentBe.push(data.cusInfoList[j]);
                  break;
                }
            domainId = currentBe[0].domainId || "";
            beId = currentBe[0].beId || "0";
            $rootScope.DistributorList.forEach(function(item) {
              item.beId === beId &&
                item.domainId === domainId &&
                item.beName === currentBe[0].beName &&
                (currentChoiceElement = item);
            });
            $rootScope.isDistributor = !!currentChoiceElement;
            $rootScope.accountBalanceSum = data.cusInfoList;
            $rootScope.accountBalanceName =
              currentBe[0].beName +
              ("zh-cn" !== utilService.getCookie("locale") ? " " : "") +
              $rootScope.i18n.console_term_accountBalance_label
                .replace(":", "")
                .replace("：", "");
            $rootScope.accountBalanceLink =
              $rootScope.links.recharge_userCenter + "?mybeId=" + beId;
            frameworkService.queryAccountBalance(domainId, beId).then(
              function(data) {
                var n,
                  accountBalance = 0;
                for (n = 0; n < data.accountBalance.length; n++) {
                  accountBalance += data.accountBalance[n].amount;
                  2 === data.accountBalance[n].accountType &&
                    ($rootScope.debitBalance = data.accountBalance[n].amount);
                  5 === data.accountBalance[n].accountType &&
                    ($rootScope.bonusBalance = data.accountBalance[n].amount);
                }
                accountBalance = accountBalance.toFixed(2);
                $rootScope.accountBalance = accountBalance;
                $rootScope.showBalance = !0;
              },
              function(data) {
                $rootScope.showBalance = !1;
              }
            );
          })
        : frameworkService.queryAccountSum().then(
            function(data) {
              if (!data) return;
              var accountBalance = $.isNumeric(data.sumAmount)
                ? data.sumAmount
                : 0;
              accountBalance = accountBalance.toFixed(2);
              $rootScope.accountBalance = accountBalance;
              $rootScope.debitBalance = $.isNumeric(data.debitAmount)
                ? data.debitAmount
                : 0;
              $rootScope.bonusBalance = $.isNumeric(data.bonusAmount)
                ? data.bonusAmount
                : 0;
              $rootScope.showBalance = !0;
            },
            function(data) {
              $rootScope.showBalance = !1;
            }
          );
    }
    function initOrderInfo() {
      frameworkService.queryCusBrief($rootScope.domainId).then(function(data) {
        if (data && data.totalCount >= 0) {
          $rootScope.workOrderCount = data.totalCount;
          $rootScope.workOrderTip =
            $rootScope.i18n.console_term_workOrder_process_label +
            ": " +
            $rootScope.workOrderCount;
        }
      });
    }
    function initRealNameAuth() {
      localizationConfig.realNameAuthSwitch &&
        frameworkService
          .queryRealNameAuth({ customerId: $rootScope.domainId })
          .then(function(data) {
            $rootScope.realNameAuthOk = data && data.isVerified;
          });
    }
    function initTraceLog() {
      getTraceLog();
      $rootScope.trace = {
        traceCount: 0,
        traceList: [],
        tracker: [],
        hasTraceInRegion: !1,
        enableClick: function() {
          $rootScope.trace.ctsEndpoint &&
            $rootScope.trace.ctsEndpoint.endpoint &&
            (window.location.href = $rootScope.genHWSHref(
              $rootScope.trace.ctsEndpoint.endpoint.split("#")[0] +
                "#/cts/manager/settingList"
            ));
        }
      };
      $rootScope.$watch("serviceEndpointList", function(newVal, oldVal) {
        newVal &&
          ($rootScope.trace.ctsEndpoint = _.find(
            $rootScope.serviceEndpointList,
            function(item) {
              return "cts" === item.id;
            }
          ));
      });
      $rootScope.$watch("isShowLogLayout", function(newVal, oldVal) {
        !0 === newVal && getTraceLog();
      });
    }
    function getTraceLog() {
      frameworkService.queryTracker($rootScope.projectId).then(
        function(data) {
          $rootScope.trace.tracker = data || [];
          $rootScope.trace.hasTraceInRegion = !0;
          if ($rootScope.trace.tracker.length > 0) {
            var params = { limit: 10 };
            frameworkService
              .queryTraceList(
                $rootScope.projectId,
                encodeURIComponent($rootScope.trace.tracker[0].tracker_name),
                params
              )
              .then(
                function(data) {
                  $rootScope.trace.traceList = (data && data.traces) || [];
                  $rootScope.trace.traceList.sort(function(first, second) {
                    return second.record_time - first.record_time;
                  });
                  $rootScope.trace.traceList.forEach(function(item) {
                    item.showTime = getDateTime(item.record_time);
                  });
                },
                function(jqXHR, textStatus, errorThrown) {
                  $rootScope.trace.traceList = [];
                }
              );
          } else $rootScope.trace.tracker = [];
        },
        function(jqXHR, textStatus, errorThrown) {
          $rootScope.trace.hasTraceInRegion = !1;
        }
      );
    }
    function getDisplayRegionName(regionId) {
      var projectElms, projectElms1;
      if (regionId && $rootScope.projectNameRegExp.test(regionId)) {
        projectElms = regionId.match($rootScope.projectNameRegExp);
        0 === regionId.indexOf("DeC") && ($rootScope.isVdcRegion = !0);
        return getRegionNameById(projectElms[2]) + "(" + projectElms[3] + ")";
      }
      if (regionId && $rootScope.userProjectNameRegExp.test(regionId)) {
        projectElms1 = regionId.match($rootScope.userProjectNameRegExp);
        return getRegionNameById(projectElms1[1]) + "(" + projectElms1[2] + ")";
      }
      return getRegionNameById(regionId);
    }
    function initDefaultRegion() {
      if (!$rootScope.projectName || $rootScope.regions.length <= 0) return;
      $rootScope.selectRegionId = getProjectRegionId($rootScope.projectName);
      $rootScope.regionName = getRegionNameById($rootScope.selectRegionId);
      $rootScope.displayRegionName =
        globalRegionName + "" == ""
          ? getDisplayRegionName($rootScope.projectName)
          : globalRegionName;
      $rootScope.localizationConfig.newHECMenu && initTraceLog();
      $rootScope.$broadcast("initDefaultRegion");
    }
    function getRegionNameById(regionId) {
      var index,
        curProjectName,
        regionName,
        paramsList,
        paramsSubNumber,
        regionNameLength,
        paramsDisplay;
      for (index in $rootScope.regions)
        if (regionId === $rootScope.regions[index].id) {
          $rootScope.regionColorIndex = index;
          if (!$rootScope.localizationConfig.leftMenuRegionAdjustSwitch)
            return $rootScope.regions[index].name;
          $rootScope.regions[index].curProjectFlag = !1;
          if ($rootScope.projectName && $rootScope.projectName.split("_")) {
            curProjectName = $rootScope.projectName.split("_");
            curProjectName[0] &&
              curProjectName[0] === $rootScope.regions[index].id &&
              ($rootScope.regions[index].curProjectFlag = !0);
          }
          regionName = $rootScope.regions[index].name;
          if (regionName) {
            paramsList = regionName.split("-");
            if (paramsList.length > 1) {
              paramsSubNumber = regionName.indexOf("-") + 1;
              regionNameLength = regionName.length;
              paramsDisplay = regionName.substring(
                paramsSubNumber,
                regionNameLength
              );
              return paramsDisplay;
            }
            return regionName;
          }
        }
      return "";
    }
    function getProjectRegionId(projectName) {
      if (projectName) {
        if ($rootScope.projectNameRegExp.test(projectName))
          return projectName.match($rootScope.projectNameRegExp)[2];
        if ($rootScope.userProjectNameRegExp.test(projectName))
          return projectName.match($rootScope.userProjectNameRegExp)[1];
      }
      return projectName;
    }
    function initUserProjects() {
      var options = {
        domain_id: $rootScope.domainId,
        userId: $rootScope.userId
      };
      frameworkService.getUserProjects(options).then(
        function(data) {
          data && data.projects && genProjectList(data.projects);
        },
        function(data) {
          genProjectList(null);
        }
      );
    }
    function genProjectList(sProjects) {
      var index,
        projectElms,
        projectElms1,
        regions,
        i,
        getAscriptionSegment,
        regionGroup,
        projects = {};
      if (sProjects)
        for (index = 0; index < sProjects.length; index++)
          if (
            sProjects[index] &&
            sProjects[index].name &&
            $rootScope.projectNameRegExp.test(sProjects[index].name)
          ) {
            projectElms = sProjects[index].name.match(
              $rootScope.projectNameRegExp
            );
            projects[projectElms[2]] = projects[projectElms[2]] || [];
            projects[projectElms[2]].push({
              id: sProjects[index].id,
              name: sProjects[index].name,
              userProjectNameFlag: !1,
              displayName: projectElms[3],
              disable: $rootScope.isNonsupportRegion(
                $rootScope.nonsupportRegions,
                sProjects[index].name,
                $rootScope.supportRegions
              ),
              maintence: isMaintainedRegion(
                $rootScope.maintenanceRegions,
                sProjects[index].name
              )
            });
          } else if (
            sProjects[index] &&
            sProjects[index].name &&
            $rootScope.userProjectNameRegExp.test(sProjects[index].name)
          ) {
            projectElms1 = sProjects[index].name.match(
              $rootScope.userProjectNameRegExp
            );
            projects[projectElms1[1]] = projects[projectElms1[1]] || [];
            projects[projectElms1[1]].push({
              id: sProjects[index].id,
              name: sProjects[index].name,
              userProjectNameFlag: !0,
              displayName: projectElms1[2],
              disable: $rootScope.isNonsupportRegion(
                $rootScope.nonsupportRegions,
                sProjects[index].name,
                $rootScope.supportRegions
              ),
              maintence: isMaintainedRegion(
                $rootScope.maintenanceRegions,
                sProjects[index].name
              )
            });
          }
      $rootScope.projects = projects;
      regions = $rootScope.tmpRegions;
      for (index = 0; index < regions.length; index++) {
        regions[index].projects = projects[regions[index].id];
        if (
          $rootScope.isNonsupportRegion(
            $rootScope.nonsupportRegions,
            regions[index].id,
            $rootScope.supportRegions
          )
        ) {
          regions[index].disable = !0;
          if (
            regions[index].projects &&
            regions[index].projects.length > 0 &&
            regions[index].disable
          )
            for (i = 0; i < regions[index].projects.length; i++)
              regions[index].projects[i].disable = !0;
        } else regions[index].disable = !1;
      }
      for (index = 0; index < regions.length; index++) {
        regions[index].projects = projects[regions[index].id];
        $rootScope.maintenanceRegions &&
        isMaintainedRegion($rootScope.maintenanceRegions, regions[index].id)
          ? (regions[index].maintence = !0)
          : (regions[index].maintence = !1);
      }
      $rootScope.regions = regions;
      $rootScope.regions.length > 0 && ($rootScope.regionFlag = !0);
      $rootScope.regionAscriptions = [
        { min: "A", max: "G" },
        { min: "H", max: "K" },
        { min: "L", max: "S" },
        { min: "T", max: "Z" }
      ];
      getAscriptionSegment = function(alphabet) {
        if (!alphabet) return null;
        alphabet = (alphabet + "").substr(0, 1).toUpperCase();
        return _.findIndex($rootScope.regionAscriptions, function(item) {
          return alphabet >= item.min && alphabet <= item.max;
        });
      };
      regionGroup = _.groupBy($rootScope.regions, function(item) {
        return item.ascription;
      });
      _.each(regionGroup, function(item, key) {
        var regions, shortNameObj, index;
        if ("undefined" !== key) {
          regions = regionGroup[key];
          shortNameObj = _.find(regions, function(regionItem) {
            return !!regionItem.shortName;
          });
          index = getAscriptionSegment(shortNameObj && shortNameObj.shortName);
          if ($rootScope.regionAscriptions[index]) {
            $rootScope.regionAscriptions[index].ascriptionList =
              $rootScope.regionAscriptions[index].ascriptionList || [];
            $rootScope.regionAscriptions[index].ascriptionList.push({
              displayName: key,
              regions: regions
            });
          }
        }
      });
      _.each($rootScope.regionAscriptions, function(item) {
        item.ascriptionList &&
          (item.ascriptionList = _.sortBy(item.ascriptionList, function(
            ascription
          ) {
            var shortNameObj = _.find(ascription.regions || [], function(
              regionItem
            ) {
              return !!regionItem.shortName;
            });
            return (shortNameObj && shortNameObj.shortName) || "";
          }));
      });
      initDefaultRegion();
    }
    function getFavoriteEndpoints(maskFlag) {
      var options = { user_id: $rootScope.userId, maskFlag: maskFlag };
      return frameworkService.favoriteEndpoints(options);
    }
    function dealAllEndpoints(data) {
      var endpoints,
        tmpEndpoints,
        endpoint,
        endpointScope,
        newNumber,
        nowTime,
        minNum,
        minIndex,
        item,
        endpointOnlineTime,
        newOutTime,
        m;
      if (!data || !data.endpoints) return;
      endpoints = data.endpoints;
      tmpEndpoints = [];
      endpointScope = {};
      newNumber = 0;
      nowTime = new Date().getTime();
      for (item = 0; item < endpoints.length; item++) {
        endpoint = endpoints[item];
        if (endpoint.onlineTime) {
          endpoint.onlineTime = endpoint.onlineTime.replace(/-/g, "/");
          endpointOnlineTime = new Date(endpoint.onlineTime).getTime();
          newOutTime = endpointOnlineTime + 7776e6;
          if (endpointOnlineTime < nowTime && newOutTime > nowTime) {
            newNumber++;
            endpoint.showNew = !0;
            minNum = new Date(endpoint.onlineTime).getTime();
            minIndex = item;
            if (newNumber > parseInt(0.2 * endpoints.length, 10)) {
              for (m = 0; m < endpoints.length; m++) {
                new Date(endpoints[m].onlineTime).getTime();
                if (endpoints[m].showNew && endpointOnlineTime < minNum) {
                  minNum = new Date(endpoints[m].onlineTime).getTime();
                  minIndex = m;
                }
              }
              endpoints[minIndex].showNew = !1;
            }
          }
        }
        endpoint.id === window.global_endpoint_id &&
          ($rootScope.endpointName = endpoint.name);
        "home" === endpoint.id
          ? ($rootScope.homeEndpoint = endpoint)
          : tmpEndpoints.push(endpoint);
        endpointScope[endpoint.id] = endpoint.endpointScope;
      }
      $rootScope.$watch("displayRegionName", function(newValue) {
        var item, supportRegionArr, nonsupportRegionArr;
        for (item = 0; item < endpoints.length; item++) {
          endpoints[item].nonsupportCurrentRegion = !1;
          supportRegionArr =
            endpoints[item].supportRegions &&
            endpoints[item].supportRegions.split(",");
          nonsupportRegionArr =
            endpoints[item].nonsupportRegion &&
            endpoints[item].nonsupportRegion.split(",");
          $rootScope.isNonsupportRegion(
            nonsupportRegionArr,
            $rootScope.projectName,
            supportRegionArr
          ) &&
            localizationConfig.ifSupportRegionsDisplay &&
            (endpoints[item].nonsupportCurrentRegion = !0);
        }
      });
      $rootScope.serviceEndpointList = tmpEndpoints;
      $rootScope.endpointScopeMap = endpointScope;
    }
    function dealFavoriteEndpoints(data) {
      var length, result, i;
      if (!data || !data.endpointCollects) return;
      length = data.endpointCollects.length;
      result = [];
      for (i = 0; i < $rootScope.favoriteServiceMax && i < length; i++) {
        data.endpointCollects[i].tooltip = {
          content: $.encoder.encodeForHTML(data.endpointCollects[i].shortName),
          customClass: "frame-dropdown-tinyTip",
          position: "bottom-right",
          maxWidth: 200
        };
        data.endpointCollects[i].tipsElementId =
          "frameFavoriteEndpointId" + data.endpointCollects[i].endpointId + i;
        result.push(data.endpointCollects[i]);
      }
      $rootScope.favoriteEndpoints = result;
      $rootScope.console_term_clickhere_tips = $sce.trustAsHtml(
        $rootScope.i18nReplace($rootScope.i18n.console_term_clickhere_tips, {
          1: '<span class="hwsicon-frame-image-favorite-new menu-hwsicon-frame-service-favorite-tip"></span>',
          2: $rootScope.favoriteServiceMax - $rootScope.favoriteEndpoints.length
        })
      );
    }
    function beautifierEndpoints(flag) {
      var catalogs,
        endpoint,
        catalog,
        item,
        result,
        index,
        endpoints = $rootScope.serviceEndpointList;
      if (!endpoints) return [];
      catalogs = {};
      for (item = 0; item < endpoints.length; item++) {
        endpoint = endpoints[item];
        catalog = $.trim(endpoint.catalog);
        catalogs[catalog] = catalogs[catalog] || [];
        catalogs[catalog].push(endpoint);
      }
      result = [];
      for (index in catalogs)
        catalogs.hasOwnProperty(index) &&
          result.push({ catalog: index, endpoints: catalogs[index] });
      $rootScope.ServcieListForBanner = angular.copy(result);
      $rootScope.ServcieListForBanner.unshift({
        catalog: $rootScope.i18n.console_term_serviceList_allService,
        endpoints: angular.copy(result)
      });
      $rootScope.serviceEndpoints = result;
      $rootScope.serviceEndpointsFlag = !0;
      flag || ($rootScope.endpointInitFlag = !0);
    }
    function initIsFavorite() {
      ($rootScope.serviceEndpointList || []).forEach(function(item) {
        item.isFavorite = isFavoriteEndpoint(item);
      });
    }
    function isFavoriteEndpoint(endpoint) {
      if ($rootScope.favoriteEndpoints)
        for (
          var index = 0;
          index < $rootScope.favoriteEndpoints.length;
          index++
        )
          if (endpoint.id === $rootScope.favoriteEndpoints[index].endpointId) {
            $rootScope.favoriteEndpoints[index].serviceCss =
              endpoint.serviceCss;
            return !0;
          }
      return !1;
    }
    function importantMessage() {
      if (!localizationConfig.getMessageFlag) return;
      frameworkService.getMessages().then(function(data) {
        if (!data || !data.messages) return;
        $rootScope.importantMessages = data.messages;
        $rootScope.noticeNum = data.total;
      });
    }
    function isMaintainedRegion(maintenanceRegions, regionId) {
      var i,
        result = !1;
      if (regionId && $rootScope.projectNameRegExp.test(regionId)) {
        for (i = 0; i < maintenanceRegions.length; i++)
          if (
            maintenanceRegions[i] &&
            0 === regionId.indexOf(maintenanceRegions[i])
          ) {
            result = !0;
            break;
          }
      } else result = maintenanceRegions.indexOf(regionId) >= 0;
      return result;
    }
    function initMessageTypes() {
      if (!localizationConfig.getMessageFlag) return;
      var options = { userId: $rootScope.userId, type: choiceMessageType };
      frameworkService.getUserChoices(options).then(function(choices) {
        frameworkService.getMessagesTypes().then(function(types) {
          dealMessageTypes(choices, types);
        });
      });
    }
    function dealMessageTypes(choices, types) {
      var index,
        values = [],
        keys = [];
      for (index = 0; index < types.length; index++) {
        values.push({
          key: types[index].key,
          text: types[index].text,
          checked: isChoiceMessageType(types[index].key, choices)
        });
        keys.push(types[index].key);
      }
      $rootScope.messageTypeKeys = keys;
      $rootScope.messageTypes = {
        id: "messageTypes",
        values: values,
        change: function() {
          var index,
            options,
            checkedArray = $("#messageTypes")
              .widget()
              .opChecked("checked"),
            unChecked = [];
          for (index = 0; index < $rootScope.messageTypeKeys.length; index++)
            _.contains(checkedArray, $rootScope.messageTypeKeys[index]) ||
              unChecked.push($rootScope.messageTypeKeys[index]);
          options = {
            userId: $rootScope.userId,
            type: choiceMessageType,
            value: unChecked.join(","),
            preferDesc: ""
          };
          frameworkService.updateUserChoices(options);
          importantMessage();
        }
      };
      importantMessage();
    }
    function isChoiceMessageType(key, choices) {
      if (
        choices &&
        choices.preferences &&
        choices.preferences[0] &&
        choices.preferences[0].preferDisplayName
      ) {
        var choiceArr = choices.preferences[0].preferDisplayName.split(",");
        return !_.contains(choiceArr, key);
      }
      return !0;
    }
    function getAssumeRoles() {
      var options = { userId: $rootScope.userId, limit: $rootScope.limit };
      frameworkService.getAssumeRoles(options).then(function(data) {
        if (data) {
          if (
            data.account &&
            data.account.id &&
            data.account.id !== $rootScope.userId
          ) {
            $rootScope.isLoginUserFlag = !1;
            $rootScope.hasAssumeRoleFlag = !0;
            $rootScope.loginUserAccount = data.account;
            var tmpIndex = $rootScope.username.indexOf("/");
            if (tmpIndex > 0) {
              $rootScope.company = $rootScope.username.substring(tmpIndex + 1);
              $rootScope.shortName = $rootScope.username.substring(0, tmpIndex);
            }
          } else {
            $rootScope.isLoginUserFlag = !0;
            $rootScope.hasAssumeRoleFlag = !1;
          }
          if (data.xrole_history && data.xrole_history.length > 0) {
            $rootScope.assumeRoles = data.xrole_history;
            $rootScope.hasAssumeRoleFlag = !0;
          }
        } else {
          $rootScope.assumeRoles = [];
          $rootScope.hasAssumeRoleFlag = !1;
        }
      });
    }
    function loadCustomizationConf(dir) {
      var timestamp = new Date().getTime(),
        customJavascript =
          "//console-static.huaweicloud.com/static/framework/" +
          dir +
          "/customization.js?timestamp=" +
          timestamp,
        customCss =
          "//console-static.huaweicloud.com/static/framework/" +
          dir +
          "/css/customization.css?timestamp=" +
          timestamp;
      loadJavascript(customJavascript, function() {
        $rootScope.loadJSSuccess = !0;
        $rootScope.$apply();
      });
      loadCss(customCss, function() {
        $rootScope.loadCssSuccess = !0;
        $rootScope.$apply();
      });
    }
    function loadCss(filename, callback) {
      var fileref = document.createElement("link");
      fileref.setAttribute("rel", "stylesheet");
      fileref.setAttribute("type", "text/css");
      fileref.setAttribute("href", filename);
      void 0 !== callback &&
        (fileref.readyState
          ? (fileref.onreadystatechange = function() {
              if (
                "loaded" === fileref.readyState ||
                "complete" === fileref.readyState
              ) {
                fileref.onreadystatechange = null;
                callback();
              }
            })
          : (fileref.onload = function() {
              callback();
            }));
      document.getElementsByTagName("head")[0].appendChild(fileref);
    }
    function loadJavascript(filename, callback) {
      var fileref = document.createElement("script");
      fileref.setAttribute("type", "text/javascript");
      fileref.setAttribute("src", filename);
      void 0 !== callback &&
        (fileref.readyState
          ? (fileref.onreadystatechange = function() {
              if (
                "loaded" === fileref.readyState ||
                "complete" === fileref.readyState
              ) {
                fileref.onreadystatechange = null;
                callback();
              }
            })
          : (fileref.onload = function() {
              callback();
            }));
      document.getElementsByTagName("head")[0].appendChild(fileref);
    }
    function updateUserRoles(roles) {
      $rootScope.userRoles = roles;
      $.inArray("op_restricted", roles) >= 0
        ? ($rootScope.isRestrictedUser = !0)
        : ($rootScope.isRestrictedUser = !1);
    }
    function topSearchInputParamSet() {
      $(".top-search-input").on("input", function() {
        var val = $(this).val();
        val.length > 0
          ? $(".top-search-close-btn").addClass("close-btn-block")
          : $(".top-search-close-btn").removeClass("close-btn-block");
        $(".top-search-a").attr(
          "href",
          $rootScope.newTopSearchLink + $.base64.urlSafeEncode(val, !0)
        );
      });
    }
    function queryBusinessManage() {
      var options = { domainId: $rootScope.domainId };
      frameworkService.queryCustomerManangment(options).then(function(data) {
        "1" === data.isEmPriCustomer
          ? ($rootScope.BusinessManagementIsOpen = !0)
          : ($rootScope.BusinessManagementIsOpen = !1);
      });
    }
    function querySellerAndPartner() {
      var customerOptions = { customerID: $rootScope.domainId, source: 1 };
      frameworkService
        .getSellerAndPartner(customerOptions)
        .then(function(data) {
          data && 1 === data.isvStatus
            ? ($rootScope.isvManagementIsOpen = !0)
            : ($rootScope.isvManagementIsOpen = !1);
        });
    }
    function changeShowSmallScreen() {
      setTimeout(function() {
        var thirdPartnerFlag = !(
          !window.thirdPartner ||
          "" === window.thirdPartner.replace('""', "") ||
          "null" === window.thirdPartner
        );
        if (
          ("zh-cn" === window.urlParams.lang && !thirdPartnerFlag) ||
          window.innerWidth > 1440
        ) {
          $rootScope.cfScreenFlag = !1;
          $(".menu-smallScreen").css({ display: "none" });
          $(".menu-largeScreen").css({ display: "block" });
        } else {
          $rootScope.cfScreenFlag = !0;
          $(".menu-smallScreen").css({ display: "block" });
          $(".menu-largeScreen").css({ display: "none" });
        }
      }, 0);
    }
    function initFavoriteEndpoints(maskFlag) {
      getFavoriteEndpoints(maskFlag).then(function(data) {
        dealFavoriteEndpoints(data);
        initIsFavorite();
        $rootScope.cfFavoriteEndpointsLen = $rootScope.favoriteEndpoints.length;
      });
    }
    function distributorAccoutSetting(userId) {
      return (
        [
          "9a37a440718d4c32a73035a37cbed10e",
          "e8e4e1dd4b7c44ae98a17903eefe77db",
          "dc48a6511a3b47b18cf1215217e1f920",
          "32114dbcc3b5472bb6ce062a7bc9bd8b",
          "808a5be279e34b7da7c7f1efd2cd1fc4",
          "1fbff4a735354d18adf61f35a0915f3e",
          "274133e2ba7e4011b8747c144c13adf4"
        ].indexOf(userId) > -1
      );
    }
    function setCookie(cname, cvalue) {
      var date = new Date("2099-01-01");
      date.setTime(date.getTime());
      document.cookie =
        cname +
        "=" +
        cvalue +
        ";path=/;domain=" +
        window.cloudCookieDomain +
        ";expires=" +
        date.toGMTString();
    }
    function isAllianceUser(domainId, site) {
      var options = { domainId: domainId, siteType: site };
      frameworkService.getAllianceAccountInfo(options).then(function(data) {
        data && data.xdomains && data.xdomains.length > 0
          ? ($rootScope.cfIsAllianceUser = !0)
          : ($rootScope.cfIsAllianceUser = !1);
      });
    }
    function getCloudAllianceToken(samlUrl, ocbTokenUrl) {
      frameworkService.getSAMLResponse(samlUrl).then(function(data) {
        var samlResponse =
          $(data).find("input") &&
          $(data).find("input")[0] &&
          $(data).find("input")[0].value;
        samlResponse &&
          ocbTokenUrl &&
          frameworkService.getOCBToken(samlResponse, ocbTokenUrl).then(
            function(data) {
              if (data) {
                $rootScope.cfXOCBFedrationToken =
                  data.xhr && data.xhr.getResponseHeader("X-Subject-Token");
                $rootScope.cfXOCBFedrationTokenData = data.data;
              }
            },
            function(xhr) {}
          );
      });
    }
    function getFedrationToken() {
      !0 === $rootScope.cfIsAllianceUser &&
        !0 === $rootScope.linksInterfaceFlag &&
        $rootScope.links.getSAMLResponse_url &&
        $rootScope.links.getOCBToken_url &&
        getCloudAllianceToken(
          $rootScope.links.getSAMLResponse_url,
          $rootScope.links.getOCBToken_url
        );
    }
    var regionParams,
      promiseRegion,
      initMessageBox,
      tipConfig,
      favoriteEndpointTips,
      choiceMessageType;
    $rootScope.i18nReplace = utilService.i18nReplaceFull;
    $rootScope.widgetsLanguage = window.tinyLanguage.language;
    $rootScope.timeFormat = $rootScope.i18n.dateFormat + " HH:mm:ss";
    $rootScope.tmpRegions = [];
    $rootScope.regions = [];
    $rootScope.projects = {};
    $rootScope.regionAscriptions = [];
    $rootScope.selectRegionId = "";
    $rootScope.projectName = "";
    $rootScope.displayRegionName = "";
    $rootScope.isVdcRegion = !1;
    $rootScope.noticeNum = 0;
    $rootScope.username = "";
    $rootScope.company = "";
    $rootScope.userId = "";
    $rootScope.projectId = "";
    $rootScope.domainId = "";
    $rootScope.userRoles = [];
    $rootScope.isOldUser = !1;
    $rootScope.accountBalance = 0;
    $rootScope.debitBalance = 0;
    $rootScope.bonusBalance = 0;
    $rootScope.importantMessages = [];
    $rootScope.homeEndpoint = null;
    $rootScope.domainPre = (window.location.host || "").split(".")[0] || "";
    $rootScope.serviceEndpoints = [];
    $rootScope.serviceEndpointList = [];
    $rootScope.favoriteEndpoints = [];
    $rootScope.favoriteError = !0;
    $rootScope.isCustomLogo = !1;
    $rootScope.isLoginUserFlag = !0;
    $rootScope.loginUserAccount = {};
    $rootScope.hasAssumeRoleFlag = !1;
    $rootScope.assumeRoles = [];
    $rootScope.links = [];
    $rootScope.favoriteServiceMax = 10;
    $rootScope.showBalance = !1;
    $rootScope.accountBalanceName = "";
    $rootScope.accountBalanceLink = "";
    $rootScope.accountBalanceSum = [];
    $rootScope.isBalanceAccountOpen = !1;
    $rootScope.isVendorSubUser = !1;
    $rootScope.isVendorUser = !1;
    $rootScope.isSuspendedUser = !1;
    $rootScope.isVerifiedUser = !1;
    $rootScope.endpointInitFlag = !1;
    $rootScope.elementDisplayFlag = !0;
    $rootScope.regionDisplayFlag = !0;
    $rootScope.globalRegionName = globalRegionName;
    $rootScope.currentService = currentService;
    $rootScope.bussinessConsoleList = [
      "authCenter",
      "marketplace",
      "userCenter"
    ];
    $rootScope.isServiceConsole =
      $.inArray($rootScope.currentService, $rootScope.bussinessConsoleList) < 0;
    $rootScope.currentServiceName =
      $rootScope.i18n["console_term_" + $rootScope.currentService + "_label"];
    $rootScope.logoutUrl = window.appWebPath + "/logout";
    $rootScope.lastState = "";
    $rootScope.localizationConfig = localizationConfig;
    $rootScope.canAssumeRole = localizationConfig.canAssumeRole;
    $rootScope.console_term_copyright_label = $sce.trustAsHtml(
      $rootScope.i18n.console_term_copyright_label
    );
    $rootScope.isMessageBoxEnabled = localizationConfig.isMessageBoxEnabled;
    $rootScope.serviceCategoryFlag = !0;
    $rootScope.DistributorList = [];
    $rootScope.xDomainType = "";
    $rootScope.regionFlag = !1;
    $rootScope.ServcieListForBanner = [];
    $rootScope.cfUpdateFrameworkMenu = !1;
    $rootScope.isallService = !0;
    $rootScope.$$active = $rootScope.i18n.console_term_serviceList_allService;
    $rootScope.cloudAllianceSiteType = 3;
    $rootScope.userAccoutInfo = function() {
      $(".user-accout-manager-text").mouseover(function() {
        $(".infor-real").addClass("infor-realhover");
      });
      $(".user-accout-manager-text").mouseout(function() {
        $(".infor-real").removeClass("infor-realhover");
      });
    };
    $rootScope.regionTpl = { url: "src/app/framework/views/region.html" };
    $rootScope.traceTpl = { url: "src/app/framework/views/traceTpl.html" };
    $rootScope.userInfoTpl = {
      url: "src/app/framework/views/userInfoTpl.html"
    };
    $rootScope.user_head_href = {
      url:
        "//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/user-head.png"
    };
    $rootScope.user_head_all = {};
    $rootScope.my_quota_link =
      $rootScope.i18n.console_term_consoleHome_link + "#/quota";
    $rootScope.nonsupportRegions = [];
    $rootScope.supportRegions = [];
    $rootScope.endpointScopeMap = {};
    $rootScope.maintenanceRegions = [];
    $rootScope.regionHighlightColor = [
      "#82b1ff",
      "#ea80fc",
      "#85f2a3",
      "#b388ff",
      "#80d8ff",
      "#39e749",
      "#5ff7d4",
      "#ff6e40",
      "#ffd180",
      "#ff9e80",
      "#ff8a80",
      "#ffff8d"
    ];
    $rootScope.displayMenuElements = function(flag) {
      $rootScope.regionDisplayFlag = flag;
    };
    $rootScope.displayMenusWithOutRegion = function(flag) {};
    $rootScope.logout = function() {
      storage.flush();
      window.location.href = $rootScope.logoutUrl;
    };
    $rootScope.$watch("cfUpdateFrameworkMenu", function() {
      if (!0 === $rootScope.cfUpdateFrameworkMenu) {
        updateFavoriteEndpoints();
        $rootScope.cfUpdateFrameworkMenu = !1;
      }
    });
    regionParams = {
      selfDevelop: !!localizationConfig.ctcRegionTiledDisplay,
      alliance: !0
    };
    promiseRegion = frameworkService.queryRegions(regionParams);
    $rootScope.genFavTipOptions = function() {
      $rootScope.i18n.console_term_collectFull_tip = $sce.trustAsHtml(
        $rootScope.i18nReplace($rootScope.i18n.console_term_collectFull_tip, {
          1: $rootScope.favoriteServiceMax
        })
      );
      var favTipOptions = (this.$index,
      (this.favTipOptions = {
        collect: {
          content: $rootScope.i18n.console_term_collectModal_tip,
          maxWidth: 300,
          customClass: "frame-dropdown-tinyTip",
          position: "bottom-right"
        },
        cancel: {
          content: $rootScope.i18n.console_term_unCollect_tip,
          maxWidth: 300,
          customClass: "frame-dropdown-tinyTip",
          position: "bottom-right"
        },
        collectFull: {
          content: $rootScope.i18n.console_term_collectFull_tip,
          maxWidth: 300,
          customClass: "frame-dropdown-tinyTip",
          position: "bottom-right"
        }
      }));
      $(window).resize(function() {
        $rootScope.$apply(function() {
          favTipOptions.collect.position = favTipOptions.cancel.position = favTipOptions.collectFull.position =
            "bottom-right";
        });
      });
    };
    $rootScope.oldTips = {
      tooltip: {
        content: $rootScope.i18n.console_term_oldConsoleTips_label,
        maxWidth: 180,
        customClass: "frame-dropdown-tinyTip old-console-tips",
        position: "bottom"
      }
    };
    $rootScope.helpTips = {
      tooltip: {
        content: $rootScope.i18n.console_term_helpcenter_label,
        position: "bottom-right"
      }
    };
    $rootScope.i18n.console_term_collectTip_valid = $sce.trustAsHtml(
      $rootScope.i18nReplace($rootScope.i18n.console_term_collectTip_valid, {
        1: $rootScope.favoriteServiceMax,
        2: '<span class="hwsicon-frame-image-favorite-true menu-hwsicon-frame-service-favorite-max"></span>'
      })
    );
    initMessageBox = function() {
      function requestInformation() {
        void 0 === $rootScope.messageBox.role &&
          frameworkService
            .queryMcUserRole($rootScope.userId)
            .then(function(data) {
              $rootScope.messageBox.role = data.role;
            });
        return frameworkService.queryMcMessages($rootScope.domainId, {
          offset: 0,
          limit: 5,
          status: 0
        });
      }
      function ergodicImpimportantMessage() {
        var j, i;
        if (
          $rootScope.messageBox.messages.length > 0 &&
          $window.importantMessageArr.length > 0
        )
          for (j = 0; j < $rootScope.messageBox.messages.length; j++)
            for (i = 0; i < $window.importantMessageArr.length; i++)
              if (
                $rootScope.messageBox.messages[j].sub_category_id ===
                  Number($window.importantMessageArr[i]) &&
                0 === $rootScope.messageBox.messages[j].status
              ) {
                $rootScope.showMessageBox = !0;
                $rootScope.importantMessageContent =
                  $rootScope.messageBox.messages[j].title;
                $rootScope.importantMessageHref =
                  $rootScope.links.message_center_endpoint +
                  "#/mc/messages/" +
                  $rootScope.messageBox.messages[j].id;
                $rootScope.importantMessageId =
                  $rootScope.messageBox.messages[j].id;
                $rootScope.ergodicAllMessage = !0;
                return;
              }
      }
      $rootScope.messageBox = {};
      var lastRequestDate,
        getUnreadCount = function(date) {
          lastRequestDate = date || new Date();
          frameworkService
            .queryMcUnreadCount($rootScope.domainId)
            .then(function(data) {
              $rootScope.messageBox.unreadCount = data;
              $rootScope.$broadcast("mc.unreadCountTotalUpdated", data.total);
            });
        };
      getUnreadCount();
      $rootScope.messageBox.getMessages = function() {
        requestInformation().then(function(data) {
          $rootScope.messageBox.messages = data.messages || [];
        });
        return !0;
      };
      $rootScope.ergodicAllMessage = !1;
      (function() {
        requestInformation().then(function(data) {
          $rootScope.messageBox.messages = data.messages || [];
          ergodicImpimportantMessage();
          $rootScope.ergodicAllMessage ||
            $window.importantMessageArr.forEach(function(item) {
              var options = {
                sub_category_id: Number(item),
                status: 0,
                offset: 0,
                limit: 1
              };
              frameworkService
                .queryMcMessages($rootScope.domainId, options)
                .then(function(data) {
                  $rootScope.messageBox.messages = data.messages;
                  if (
                    $rootScope.messageBox.messages.length > 0 &&
                    $window.importantMessageArr.length > 0
                  ) {
                    $rootScope.showMessageBox = !0;
                    $rootScope.importantMessageContent =
                      $rootScope.messageBox.messages[0].title;
                    $rootScope.importantMessageHref =
                      $rootScope.links.message_center_endpoint +
                      "#/mc/messages/" +
                      $rootScope.messageBox.messages[0].id;
                    $rootScope.importantMessageId =
                      $rootScope.messageBox.messages[0].id;
                    return;
                  }
                });
            });
        });
      })();
      $rootScope.closeMessageBox = function() {
        var options = {
          domainId: $rootScope.domainId,
          messageIds: [$rootScope.importantMessageId]
        };
        frameworkService.messageStatus(options);
        $rootScope.showMessageBox = !1;
      };
      $rootScope.$on("$viewContentLoaded", function(event, viewConfig) {
        var date = new Date();
        date - lastRequestDate > 3e4 && getUnreadCount(date);
      });
      angular.element($window).focus(function(event) {
        getUnreadCount(new Date());
      });
    };
    (function() {
      if (localizationConfig.customLogo) {
        detectCustomLogo({ url: "/theme/default/images/custom_logo.png" }.url);
      }
      initAllUserInfo();
      initRegions();
      importantMessage();
      initAllLinks();
    })();
    $rootScope.$on("$stateChangeStart", function(
      event,
      toState,
      toParams,
      fromState,
      fromParams
    ) {
      if (
        "nonsupportRegion" !== toState.name &&
        $rootScope.isNonsupportRegion(
          $rootScope.nonsupportRegions,
          $rootScope.projectName,
          $rootScope.supportRegions
        )
      ) {
        $rootScope.lastState = toState;
        event.preventDefault();
      }
    });
    $rootScope.getDateTimeMessage = function(dataTimeMessage) {
      return getDateTime(new Date(dataTimeMessage).getTime());
    };
    $rootScope.showSuspendedUserTipCtrl = function(show) {
      if (show || void 0 === show) {
        frameworkService.showSuspendedTip(localizationConfig, "suspendedUser");
        angular
          .element(document)
          .injector()
          .invoke(function($compile) {
            var scope = $("#frame-suspended-check").scope();
            $compile($("#frame-suspended-check"))(scope);
            scope.$evalAsync();
          });
      } else frameworkService.hideSuspendedTip(localizationConfig);
    };
    $rootScope.showSuspendedProjectTipCtrl = function(show) {
      if (show || void 0 === show) {
        frameworkService.showSuspendedTip(
          localizationConfig,
          "suspendedProject"
        );
        angular
          .element(document)
          .injector()
          .invoke(function($compile) {
            var scope = $("#frame-suspended-check").scope();
            $compile($("#frame-suspended-check"))(scope);
            scope.$evalAsync();
          });
      } else frameworkService.hideSuspendedTip(localizationConfig);
    };
    $rootScope.isShowFeesLayout = function() {
      initUserBalance();
      return !0;
    };
    (function() {
      frameworkService.queryMaintenanceRegions().then(function(data) {
        data && ($rootScope.maintenanceRegions = data);
      });
    })();
    $rootScope.ifContainRegion = function(regions, projectName) {
      regions = regions || [];
      return !!_.find(regions, function(item) {
        return (
          item.id === projectName ||
          !!_.find(item.projects, function(projectItem) {
            return projectItem.name === projectName;
          })
        );
      });
    };
    tipConfig = {
      customClass: "frame-dropdown-tinyTip",
      position: "bottom-right",
      maxWidth: 200
    };
    favoriteEndpointTips = {};
    $rootScope.favoriteEndpointMouseEnter = function(content, elementId) {
      tipConfig.content = $.encoder.encodeForHTML(content);
      favoriteEndpointTips = tiTipService.createTip(
        $("#" + elementId),
        tipConfig
      );
      favoriteEndpointTips.show = !0;
    };
    $rootScope.favoriteEndpointMouseLeave = function() {
      favoriteEndpointTips.show = !1;
    };
    $rootScope.favorite = function(endpointId, isFavorite) {
      var options, promise;
      $(".frame-dropdown-tinyTip").remove();
      $rootScope.favoriteError = !1;
      if (
        isFavorite &&
        $rootScope.favoriteEndpoints.length >= $rootScope.favoriteServiceMax
      ) {
        $rootScope.favoriteError = !0;
        return;
      }
      if ($rootScope.favoriteOperating) return;
      options = { user_id: $rootScope.userId, id: endpointId };
      $rootScope.favoriteOperating = !0;
      promise = isFavorite
        ? frameworkService.addFavoriteEndpoint(options)
        : frameworkService.deleteFavoriteEndpoint(options);
      promise
        .then(
          function() {
            $rootScope.favoriteError = !1;
            return getFavoriteEndpoints();
          },
          function(data) {
            if (data && 400 === data.status && data.responseText) {
              var result = JSON.parse(data.responseText);
              if (result && "0000010002" === result.code) {
                $rootScope.favoriteError = !0;
                initFavoriteEndpoints();
              }
            }
          }
        )
        .then(function(data) {
          $rootScope.favoriteOperating = !1;
          dealFavoriteEndpoints(data);
          initIsFavorite();
        });
    };
    $rootScope.isNonsupportRegion = function(
      nonsupportRegions,
      regionId,
      supportRegions
    ) {
      var regionName,
        regionArray,
        flag1,
        flag2,
        i,
        j,
        k,
        l,
        result = !1;
      if (!regionId) return !1;
      regionArray = regionId.split("_");
      if (supportRegions && supportRegions.length > 0) {
        result = !0;
        if (
          regionId &&
          ($rootScope.projectNameRegExp.test(regionId) ||
            $rootScope.userProjectNameRegExp.test(regionId))
        ) {
          if ($rootScope.projectNameRegExp.test(regionId)) {
            regionName =
              regionArray.length >= 2 ? regionArray[1] : regionArray[0];
            flag1 = !1;
            flag2 = !1;
            for (i = 0; i < supportRegions.length; i++) {
              supportRegions[i] &&
                0 === regionId.indexOf(supportRegions[i]) &&
                (flag1 = !0);
              supportRegions[i] &&
                regionName === supportRegions[i] &&
                (flag2 = !0);
              if (flag1 && flag2) {
                result = !1;
                break;
              }
            }
          } else
            for (j = 0; j < supportRegions.length; j++)
              if (
                supportRegions[j] &&
                0 === regionId.indexOf(supportRegions[j])
              ) {
                result = !1;
                break;
              }
        } else result = supportRegions.indexOf(regionId) < 0;
        return result;
      }
      if (nonsupportRegions && nonsupportRegions.length > 0) {
        result = !1;
        if (
          regionId &&
          ($rootScope.projectNameRegExp.test(regionId) ||
            $rootScope.userProjectNameRegExp.test(regionId))
        ) {
          if ($rootScope.projectNameRegExp.test(regionId)) {
            regionName =
              regionArray.length >= 2 ? regionArray[1] : regionArray[0];
            for (k = 0; k < nonsupportRegions.length; k++)
              if (
                nonsupportRegions[k] &&
                (0 === regionId.indexOf(nonsupportRegions[k]) ||
                  regionName === nonsupportRegions[k])
              ) {
                result = !0;
                break;
              }
          } else
            for (l = 0; l < nonsupportRegions.length; l++)
              if (
                nonsupportRegions[l] &&
                0 === regionId.indexOf(nonsupportRegions[l])
              ) {
                result = !0;
                break;
              }
        } else result = nonsupportRegions.indexOf(regionId) >= 0;
      }
      return result;
    };
    $rootScope.changeRegion = function(projectName, projectDisable) {
      if (
        $rootScope.isNonsupportRegion(
          $rootScope.nonsupportRegions,
          projectName,
          $rootScope.supportRegions
        ) ||
        projectDisable
      )
        return;
      var href = $rootScope.addOrReplaceUrlParameter(
        window.location.href,
        "region",
        projectName
      );
      $rootScope.projectName = projectName;
      "nonsupportRegion" === $state.current.name ||
      "beingMaintained" === $state.current.name ||
      "accessDeclined" === $state.current.name
        ? (window.location.href = href.replace("#" + $location.url(), ""))
        : href === window.location.href
          ? window.location.reload()
          : (window.location.href = href);
    };
    $rootScope.$watch("userId", function(newVal, oldVal) {
      newVal &&
        newVal + "" != "" &&
        newVal + "" != oldVal + "" &&
        initMessageTypes();
    });
    $rootScope.$watch("domainId", function() {
      if (!$rootScope.domainId) return;
      localizationConfig.analysis &&
        $rootScope.domainId &&
        require(["remote-lib/analysis"], function(analysis) {
          analysis &&
            analysis.start(
              "8f1bb48d165bb0ab3b8d69128fdc3317",
              "UA-55836286-24",
              $rootScope.domainId
            );
        });
    });
    choiceMessageType = "frameworkMessageType";
    $rootScope.assumeRole = function(agencyId) {
      if (agencyId) {
        var options = { agencyId: agencyId };
        frameworkService.assumeRole(options).then(function() {
          var href = $rootScope.delUrlParameter(
            window.location.href,
            "agencyId"
          );
          href = $rootScope.delUrlParameter(href, "region");
          if (-1 !== href.indexOf("accessDeclined")) {
            storage.cookieStorage.removeItem("agencyID");
            window.location.href = href;
            window.setTimeout(function() {
              window.location.reload();
              window.location.href = href.replace("#/accessDeclined", "");
            }, 10);
          } else
            href === window.location.href
              ? window.location.reload()
              : (window.location.href = href);
        });
      }
    };
    $rootScope.assumeRoleToIAM = function() {
      var href, iamHref;
      if ($rootScope.links.assume_role_iam + "" == "") return;
      href = $rootScope.delUrlParameter(window.location.href, "agencyId");
      href = $rootScope.delUrlParameter(href, "region");
      iamHref = $rootScope.addOrReplaceUrlParameter(
        $rootScope.links.assume_role_iam,
        "callbackurl",
        encodeURIComponent(href)
      );
      window.location.href = $rootScope.genHWSHref(iamHref);
    };
    $rootScope.goHome = function() {
      $rootScope.isServiceConsole
        ? (window.location.href = $rootScope.genHWSHref(
            $rootScope.homeEndpoint.endpoint
          ))
        : (window.location.href = $rootScope.genHWSHref(
            $rootScope.links.console_common,
            "locale"
          ));
    };
    storage.get(
      "framework_tips_new_msg" + storage.cookieStorage.getItem("agencyID")
    ) &&
      $(".frame-message-round") &&
      $(".frame-message-round").css("display", "block");
    $rootScope.showTipsMsg = function(page) {
      var tipsMessages, total;
      storage.add(
        "framework_tips_new_msg" + storage.cookieStorage.getItem("agencyID"),
        !1
      );
      $(".frame-message-round").css("display", "none");
      page = page < 1 ? 1 : page;
      tipsMessages = storage.get(
        "framework_tips_msg" + storage.cookieStorage.getItem("agencyID")
      );
      tipsMessages = tipsMessages || [];
      total = Math.ceil(tipsMessages.length / 10);
      $rootScope.tipsMessagesTotal = 0 === total ? 1 : total;
      page =
        page > $rootScope.tipsMessagesTotal
          ? $rootScope.tipsMessagesTotal
          : page;
      1 === page
        ? $(".hwsicon-frame-image-pre-page").addClass("disabled")
        : $(".hwsicon-frame-image-pre-page").removeClass("disabled");
      page === $rootScope.tipsMessagesTotal
        ? $(".hwsicon-frame-image-next-page").addClass("disabled")
        : $(".hwsicon-frame-image-next-page").removeClass("disabled");
      $rootScope.tipsMessagesCurrent = page;
      $rootScope.tipsMessages = tipsMessages.slice(10 * (page - 1), 10 * page);
    };
    $rootScope.clearTipsMsg = function() {
      storage.add(
        "framework_tips_msg" + storage.cookieStorage.getItem("agencyID"),
        []
      );
      $rootScope.showTipsMsg(1);
    };
    $rootScope.cfFavoriteMenusDropdown = {
      onChanged: function(value) {
        value && initFavoriteEndpoints();
      }
    };
    $rootScope.showFavoriteModal = function() {
      $(document).on("keyup", function(e) {
        27 === (e || window.event).keyCode && $rootScope.hideFavoriteModal();
      });
      $(".frame-favorite-service-list").on("click", function() {
        setTimeout(function() {
          "none" === $("#favoriteListShow").css("display") &&
            $rootScope.hideFavoriteModal();
          !0 === window.tiny.utils.browser.ie &&
            9 === document.documentMode &&
            $(".edit-favorite-close").css(
              "cssText",
              "top: " +
                (parseInt($(".favorite-modal-main-top").height(), 10) - 25) /
                  2 +
                "px !important"
            );
        }, 0);
      });
      $(".favorite-modal").show();
      $rootScope.collectWaterfall();
      initFavoriteEndpoints(!0);
      $rootScope.cfhideFavoriteDropListFalg = !0;
      $rootScope.cfFavoriteEndpointsLen = $rootScope.favoriteEndpoints.length;
      setTimeout(function() {
        Sortable.create(document.getElementById("framefavoritesDragPanel"), {
          group: "words",
          animation: 150,
          onEnd: function() {}
        });
        document.getElementById("framefavoritesDragPanel").ondrop = function(
          event
        ) {
          event.preventDefault();
          event.stopPropagation();
        };
        $(".favorite-modal-service-list").css({
          height:
            $("#service-footer").offset().top -
            $(".favorite-modal-service-list").offset().top +
            "px"
        });
      }, 0);
    };
    $rootScope.getSortedValues = function() {
      var favoriteServiceItems,
        favoriteSortedValues,
        i,
        value,
        options,
        sortFavoriteEndpointPromise;
      if (!$rootScope.cfhideFavoriteDropListFalg) return;
      favoriteServiceItems = $("#framefavoritesDragPanel>li");
      favoriteSortedValues = [];
      for (i = 0; i < favoriteServiceItems.length; i++)
        if (favoriteServiceItems[i].id) {
          value = {};
          value.endpointId = favoriteServiceItems[i].id;
          favoriteSortedValues.push(value);
        }
      $rootScope.cfhideFavoriteDropListFalg = !1;
      options = {
        user_id: $rootScope.userId,
        endpointResources: favoriteSortedValues
      };
      sortFavoriteEndpointPromise = frameworkService.sortFavoriteEndpoint(
        options
      );
      sortFavoriteEndpointPromise
        .then(
          function() {
            $rootScope.favoriteError = !1;
            return getFavoriteEndpoints();
          },
          function(data) {
            msgService.alert(
              "error",
              $rootScope.i18n.console_term_collect_button_submit_failure
            );
            if (data && 400 === data.status && data.responseText) {
              var result = JSON.parse(data.responseText);
              if (result && "0000010002" === result.code) {
                $rootScope.favoriteError = !0;
                initFavoriteEndpoints();
              }
            }
          }
        )
        .then(function(data) {
          $rootScope.favoriteOperating = !1;
          dealFavoriteEndpoints(data);
          initIsFavorite();
        });
    };
    $rootScope.hideFavoriteModal = function() {
      $rootScope.getSortedValues();
      $(".favorite-modal").hide();
    };
    $rootScope.recharge = function() {
      window.open($rootScope.genHWSHref($rootScope.accountBalanceLink));
    };
    $rootScope.showBalanceAccount = function(ev) {
      var e = window.event || ev;
      e && e.stopPropagation
        ? e.stopPropagation()
        : window.event && (window.event.cancelBubble = !0);
    };
    $rootScope.changeBalanceAccount = function(domainId, beId, beName) {
      var currentChoiceElement;
      $rootScope.DistributorList.forEach(function(item) {
        item.beId === beId &&
          item.domainId === domainId &&
          item.beName === beName &&
          (currentChoiceElement = item);
      });
      $rootScope.isDistributor = !!currentChoiceElement;
      $rootScope.accountBalanceName =
        beName +
        ("zh-cn" !== utilService.getCookie("locale") ? " " : "") +
        $rootScope.i18n.console_term_accountBalance_label
          .replace(":", "")
          .replace("：", "");
      $rootScope.accountBalanceLink =
        $rootScope.links.recharge_userCenter + "?mybeId=" + beId;
      $rootScope.isBalanceAccountOpen = !1;
      frameworkService.queryAccountBalance(domainId, beId).then(
        function(data) {
          var accountBalance, n;
          if (!data) return;
          accountBalance = 0;
          for (n = 0; n < data.accountBalance.length; n++) {
            accountBalance += data.accountBalance[n].amount;
            2 === data.accountBalance[n].accountType &&
              ($rootScope.debitBalance = data.accountBalance[n].amount);
            5 === data.accountBalance[n].accountType &&
              ($rootScope.bonusBalance = data.accountBalance[n].amount);
          }
          accountBalance = accountBalance.toFixed(2);
          $rootScope.accountBalance = accountBalance;
          $rootScope.showBalance = !0;
        },
        function(data) {
          $rootScope.showBalance = !1;
        }
      );
    };
    $rootScope.catalogLength = function(catalog) {
      var i = 0;
      catalog.forEach(function(item) {
        item.nonsupportCurrentRegion && i++;
      });
      return i !== catalog.length;
    };
    $rootScope.customContent = function() {
      var customLogo,
        hideContent,
        hideResources,
        userDefinedContent,
        userHideUserContent,
        userAppend;
      if (
        window.customization &&
        window.customization.CONTENT &&
        window.customization.CONTENT.HEADER
      ) {
        $rootScope.userCustomizationContentResolveFlag = !0;
        $rootScope.leftMenuAppend = [];
        window.customization.CONTENT.HEADER.LEFT_APPEND.forEach(function(item) {
          $rootScope.leftMenuAppend.push(item[$rootScope.language]);
        });
        customLogo = window.customization.CONTENT.HEADER.LOGO;
        customLogo && ($rootScope.headLogo = customLogo[$rootScope.language]);
        hideContent = window.customization.CONTENT.HEADER.HIDEEN || [];
        hideContent.length > 0 && ($rootScope.userHideContent = hideContent);
        hideResources = window.customization.CONTENT.HEADER.RESOURCES || [];
        hideResources.length > 0 &&
          ($rootScope.hideResourcesList = hideResources);
        $rootScope.rightMenuAppend = [];
        window.customization.CONTENT.HEADER.RIGHT_APPEND.forEach(function(
          item
        ) {
          $rootScope.rightMenuAppend.push(item[$rootScope.language]);
        });
        $rootScope.rightMenuAppend.reverse();
        userDefinedContent = window.customization.CONTENT.HEADER.DROPDOWN;
        if (userDefinedContent) {
          userHideUserContent = userDefinedContent.HIDEEN || [];
          userAppend = userDefinedContent.USER_APPEND || [];
          userHideUserContent.length > 0 &&
            ($rootScope.userHideUserContent = userHideUserContent);
          if (userAppend.length > 0) {
            $rootScope.userMenuAppend = [];
            userAppend.forEach(function(item) {
              $rootScope.userMenuAppend.push(item[$rootScope.language]);
            });
          }
        }
      }
    };
    (function() {
      var timestamp,
        customJavascript,
        thirdPartner = window.thirdPartner;
      if (
        thirdPartner &&
        "" !== thirdPartner.replace('""', "") &&
        "null" !== thirdPartner
      ) {
        timestamp = new Date().getTime();
        customJavascript =
          "//console-static.huaweicloud.com/static/framework/customizationConfig.js?timestamp=" +
          timestamp;
        loadJavascript(customJavascript, function() {
          var customizationConfig;
          if (
            !!window.customizationConfig &&
            !!window.customizationConfig.customizationType &&
            window.customizationConfig.customizationType.length > 0
          ) {
            customizationConfig = window.customizationConfig.customizationType;
            customizationConfig.indexOf(thirdPartner) > -1 &&
              loadCustomizationConf(thirdPartner);
          }
        });
      }
    })();
    $rootScope.$watchGroup(["loadJSSuccess", "loadCssSuccess"], function() {
      !0 === $rootScope.loadJSSuccess &&
        !0 === $rootScope.loadCssSuccess &&
        $rootScope.customContent();
    });
    $(".framework-service-list").click(function() {
      $("#frameworkSearchModuleListInput").val("");
      $rootScope.cfShowMenuItemHideOtherMenu("framework-service-list");
      $rootScope.topSerarchBoxBtn = !1;
      (localizationConfig.newHECMenu && !localizationConfig.isCMC) ||
        initFavoriteEndpoints();
    });
    $(".frame-favorite-service-list").click(function() {
      $rootScope.cfShowMenuItemHideOtherMenu("frame-favorite-service-list");
      $rootScope.topSerarchBoxBtn = !1;
      (localizationConfig.newHECMenu && !localizationConfig.isCMC) ||
        initFavoriteEndpoints();
    });
    $(".frame-menu-left").on("click", ".console-menu-region", function() {
      $(this).hasClass("open") || $rootScope.cfShowMenuItemHideOtherMenu();
    });
    $(".frame-menu-right").on("click", function() {
      $rootScope.cfShowMenuItemHideOtherMenu("console-menu-region");
    });
    $rootScope.isShowTopSearchCloseBtn = !0;
    $rootScope.topSerarchBoxBtn = !1;
    $(document).click(function() {
      $rootScope.topSerarchBoxBtn = !1;
      $rootScope.$apply();
    });
    $rootScope.showSearchBox = function($event) {
      "function" == typeof window.onEvent &&
        $rootScope.cloudBiOnEvent("showSearchBox");
      $rootScope.topSerarchBoxBtn = !0;
      $(".top-search-a").attr("href", $(".top-search-a").data("href"));
      $rootScope.cfShowMenuItemHideOtherMenu("console-top-search-box");
      var searchValue = $(".top-search-input").val();
      searchValue &&
        $(".top-search-a").attr(
          "href",
          $(".top-search-a").data("href") +
            $.base64.urlSafeEncode(searchValue, !0)
        );
      $event.stopPropagation();
    };
    $rootScope.eventHideSearchBox = function($event) {
      "function" == typeof window.onEvent &&
        $rootScope.cloudBiOnEvent($rootScope.i18n.console_term_search_word);
      $event.stopPropagation();
    };
    $rootScope.hideSearchBox = function() {
      $rootScope.topSerarchBoxBtn = !1;
    };
    $rootScope.emptySearch = function() {
      $(".top-search-input").val("");
      $(".top-search-close-btn").removeClass("close-btn-block");
      $rootScope.$watch("linksInterfaceFlag", function(value) {
        value && $(".top-search-a").attr("href", $rootScope.newTopSearchLink);
      });
    };
    $(".top-search-a").click(function() {
      $rootScope.$watch("linksInterfaceFlag", function(value) {
        if (value) {
          var searchInputValue = $(".top-search-input").val();
          $(".top-search-a").attr(
            "href",
            $rootScope.newTopSearchLink +
              $.base64.urlSafeEncode(searchInputValue, !0)
          );
        }
      });
    });
    $rootScope.topSearchKeyDownEvent = function($event) {
      $event.stopPropagation();
      switch ($event.keyCode) {
        case 13:
          $rootScope.$watch("linksInterfaceFlag", function(value) {
            var searchInputValue, win;
            if (value) {
              searchInputValue = $(".top-search-input").val();
              win = window.open(
                $rootScope.newTopSearchLink +
                  $.base64.urlSafeEncode(searchInputValue, !0)
              );
              win.opener = null;
            }
          });
      }
    };
    $rootScope.refreshUserInfo = function() {
      var promiseUser = frameworkService.getLoginUser(!0);
      promiseUser.then(function(data) {
        updateUserRoles(data.roles);
      });
      return promiseUser;
    };
    $rootScope.currentSelectedService = function(endpiont, serviceId) {
      $rootScope.setServiceInCookie(serviceId);
      if ($(".framework-service-list").hasClass("open")) {
        $("#frameworkSearchModuleListInput").val("");
        $(".framework-service-list").removeClass("open");
        $(".framework-service-list .console-topbar-btn").show();
        $(".framework-service-list .console-topbar-btn-click").hide();
      }
    };
    $rootScope.setServiceInCookie = function(serviceId) {
      var hasService,
        recentServiceList =
          storage.cookieStorage.getItem("recentServices") || "";
      recentServiceList =
        "" === recentServiceList ? [] : JSON.parse(recentServiceList);
      hasService = recentServiceList.indexOf(serviceId);
      hasService > -1 && recentServiceList.splice(hasService, 1);
      recentServiceList.unshift(serviceId);
      recentServiceList.length > 6 &&
        (recentServiceList = recentServiceList.slice(0, 6));
      setCookie("recentServices", JSON.stringify(recentServiceList));
      $rootScope.cfRencentServices = recentServiceList;
    };
    $rootScope.cloudBiOnEvent = function(EventLabel) {
      window.onEvent(
        "www_v1_framework".replace("www", $rootScope.domainPre),
        "click",
        EventLabel,
        1,
        {
          C1: $rootScope.domainPre,
          D1: window.location.href,
          AppKey: "8f1bb48d165bb0ab3b8d69128fdc3317"
        }
      );
    };
    $(window).resize(function() {
      $rootScope.changeDistributorByResize = !1;
      changeShowSmallScreen();
      $rootScope.changeDistributorByResize = !0;
    });
    changeShowSmallScreen();
    $rootScope.$watchGroup(
      ["cfIsAllianceUser", "linksInterfaceFlag"],
      function() {
        getFedrationToken();
      }
    );
    $rootScope.refreshFedrationToken = window.setInterval(function() {
      localizationConfig.isOpenAllianceToken &&
      $rootScope.currentSessionExpireTimestamp &&
      $rootScope.currentSessionExpireTimestamp < 0
        ? getFedrationToken()
        : window.clearInterval($rootScope.refreshFedrationToken);
    }, 72e5);
    $rootScope.serviceListClick = function() {
      !0 === $rootScope.serviceEndpointsFlag &&
        ($rootScope.rencentServiceList = $rootScope.getRecentServicesFromCookie());
    };
    $rootScope.getRecentServicesFromCookie = function() {
      var rencentServices,
        rencentServicesLen,
        j,
        k,
        item,
        recentServices = [],
        serviceList = $rootScope.serviceEndpointList,
        length = serviceList && serviceList.length;
      if (length) {
        rencentServices = storage.cookieStorage.getItem("recentServices") || "";
        rencentServices = rencentServices && JSON.parse(rencentServices);
        rencentServicesLen = rencentServices && rencentServices.length;
        if (!rencentServicesLen) return recentServices;
        for (j = 0; j < rencentServicesLen; j++)
          for (k = 0; k < length; k++) {
            item = serviceList[k];
            if (item.id === rencentServices[j]) {
              recentServices.push(item);
              break;
            }
          }
      }
      return recentServices;
    };
  };
  ctrl.$injector = [
    "$rootScope",
    "frameworkService",
    "globalRegionName",
    "currentService",
    "$state",
    "$location",
    "$window",
    "utilService",
    "$timeout"
  ];
  return ctrl;
});
define("app-remote/framework/services/frameworkService", [
  "",
  "app-remote/framework/localization/config"
], function(fixtures, localizationConfig) {
  "use strict";
  var framework = {
      beforeSend: function(request, setting) {
        request.setRequestHeader("X-Request-From", "Framework");
      }
    },
    service = function($rootScope, $timeout, $q, camel) {
      this.queryEndpoints = function(options) {
        options = options || {};
        return camel.get({
          url: window.appWebPath + "/rest/silvan/rest/v1.0/endpoints",
          timeout: 6e4,
          params: { region: options.region, include: options.include },
          beforeSend: function(request, setting) {
            request.setRequestHeader(
              "Frame-Domain-Type",
              localizationConfig.x_domain_type || ""
            );
            framework.beforeSend(request, setting);
          }
        });
      };
      this.favoriteEndpoints = function(options) {
        options = options || {};
        return camel.get({
          url: {
            s:
              window.appWebPath +
              "/rest/silvan/rest/v1.0/users/{user_id}/endpoints",
            o: { user_id: options.user_id }
          },
          mask: options.maskFlag || !1,
          timeout: 6e4,
          beforeSend: function(request, setting) {
            request.setRequestHeader(
              "Frame-Domain-Type",
              localizationConfig.x_domain_type || ""
            );
            framework.beforeSend(request, setting);
          }
        });
      };
      this.addFavoriteEndpoint = function(options) {
        options = options || {};
        return camel.post({
          url: {
            s:
              window.appWebPath +
              "/rest/silvan/rest/v1.0/users/{user_id}/endpoints/{id}",
            o: { user_id: options.user_id, id: options.id }
          },
          timeout: 6e4,
          beforeSend: function(request, setting) {
            request.setRequestHeader(
              "Frame-Domain-Type",
              localizationConfig.x_domain_type || ""
            );
            framework.beforeSend(request, setting);
          }
        });
      };
      this.deleteFavoriteEndpoint = function(options) {
        options = options || {};
        return camel.deleter({
          url: {
            s:
              window.appWebPath +
              "/rest/silvan/rest/v1.0/users/{user_id}/endpoints/{id}",
            o: { user_id: options.user_id, id: options.id }
          },
          timeout: 6e4,
          beforeSend: framework.beforeSend
        });
      };
      this.sortFavoriteEndpoint = function(options) {
        options = options || {};
        return camel.post({
          url: {
            s:
              window.appWebPath +
              "/rest/silvan/rest/v1.0/users/{user_id}/endpoints/{id}",
            o: { user_id: options.user_id, id: "all" }
          },
          timeout: 6e4,
          params: { endpointResources: options.endpointResources },
          beforeSend: framework.beforeSend
        });
      };
      this.queryRegions = function(options) {
        options = options || {};
        return camel.get({
          url: window.appWebPath + "/rest/silvan/rest/v1.0/regions",
          timeout: 6e4,
          params: {
            selfDevelop: options.selfDevelop,
            alliance: options.alliance
          },
          beforeSend: function(request, setting) {
            request.setRequestHeader(
              "Frame-Domain-Type",
              localizationConfig.x_domain_type || ""
            );
            framework.beforeSend(request, setting);
          }
        });
      };
      this.changeRegion = function(options) {
        options = options || {};
        return camel.get({
          url: window.appWebPath + "/rest/changeRegion",
          timeout: 6e4,
          mask: !0,
          params: { project: options.project },
          beforeSend: framework.beforeSend
        });
      };
      this.queryMaintenanceRegions = function() {
        return camel.get({
          url: window.appWebPath + "/rest/maintenanceRegion",
          timeout: 6e4,
          mask: !0,
          beforeSend: framework.beforeSend
        });
      };
      this.getMessages = function(options) {
        options = options || {};
        return camel.get({
          url: window.appWebPath + "/rest/silvan/rest/v1.0/messages",
          timeout: 6e4,
          params: { start: options.start || 0, limit: options.limit || 0 },
          beforeSend: framework.beforeSend
        });
      };
      this.getLinks = function(options) {
        options = options || {};
        return camel.get({
          url: window.appWebPath + "/rest/silvan/rest/v1.0/links",
          timeout: 6e4,
          params: {
            key: options.key || "",
            type: options.type || "",
            region: options.region || ""
          },
          beforeSend: function(request, setting) {
            request.setRequestHeader(
              "Frame-Domain-Type",
              localizationConfig.x_domain_type || ""
            );
            framework.beforeSend(request, setting);
          }
        });
      };
      this.getLoginUser = function(isRefreshToken) {
        return camel.get({
          url: window.appWebPath + "/rest/me",
          timeout: 6e4,
          beforeSend: function(request, setting) {
            isRefreshToken &&
              request.setRequestHeader("Token-Refresh", isRefreshToken);
            framework.beforeSend(request, setting);
          }
        });
      };
      this.queryAccountSum = function() {
        return camel.get({
          url:
            window.appWebPath + "/rest/BSS/OpenApi/v1/accounts/sum/accountinfo",
          timeout: 1e4,
          beforeSend: framework.beforeSend
        });
      };
      this.queryBESumInfo = function() {
        return camel.get({
          url:
            window.appWebPath +
            "/rest/BSS/OpenApi/v1/customers/get-beinfos?excludeUselessBe=1",
          timeout: 1e4,
          beforeSend: framework.beforeSend
        });
      };
      this.queryAccountBalance = function(customerId, beId) {
        return camel.get({
          url: {
            s:
              window.appWebPath +
              "/rest/csb-financial-service/v1/account/balances?customerId={customer_id}&accountType=-1&beId={be_id}",
            o: { customer_id: customerId, be_id: beId }
          },
          timeout: 1e4,
          beforeSend: framework.beforeSend
        });
      };
      this.heartbeat = function() {
        return camel.get({
          url: window.appWebPath + "/rest/heartbeat",
          timeout: 6e4,
          beforeSend: framework.beforeSend
        });
      };
      this.getMessagesTypes = function() {
        return camel.get({
          url: window.appWebPath + "/rest/silvan/rest/v1.0/messageTypes",
          timeout: 6e4,
          beforeSend: framework.beforeSend
        });
      };
      this.getUserChoices = function(options) {
        options = options || {};
        return camel.get({
          url: window.appWebPath + "/rest/silvan/rest/v1.0/user_choices",
          params: {
            userId: options.userId || "",
            preferName: options.type || ""
          },
          timeout: 6e4,
          beforeSend: framework.beforeSend
        });
      };
      this.updateUserChoices = function(options) {
        options = options || {};
        return camel.post({
          url: window.appWebPath + "/rest/silvan/rest/v1.0/user_choices",
          params: {
            userId: options.userId || "",
            preferName: options.type || "",
            preferDisplayName: options.value || "",
            preferDesc: options.preferDesc || ""
          },
          timeout: 6e4,
          beforeSend: framework.beforeSend
        });
      };
      this.getAssumeRoles = function(options) {
        options = options || {};
        return camel.get({
          url: {
            s: window.appWebPath + "/rest/iam/assumeRoles/{user_id}",
            o: { user_id: options.userId }
          },
          params: { limit: 5 },
          timeout: 6e4,
          beforeSend: framework.beforeSend
        });
      };
      this.assumeRole = function(options) {
        options = options || {};
        return camel.get({
          url: window.appWebPath + "/rest/changeRole",
          timeout: 6e4,
          mask: !0,
          params: { agencyId: options.agencyId },
          beforeSend: framework.beforeSend
        });
      };
      this.getUserProjects = function(options) {
        options = options || {};
        var promise;
        promise =
          "private" === localizationConfig.x_cloud_type
            ? camel.get({
                url: {
                  s:
                    window.appWebPath + "/rest/iam/v3/users/{user_id}/projects",
                  o: { user_id: options.userId }
                },
                timeout: 6e4,
                beforeSend: framework.beforeSend
              })
            : camel.get({
                url: window.appWebPath + "/rest/iam/v3/projects",
                timeout: 6e4,
                beforeSend: framework.beforeSend
              });
        return promise;
      };
      this.queryIamUser = function(userId) {
        return camel.get({
          url: {
            s: window.appWebPath + "/rest/iam/service/user/{userId}",
            o: { userId: userId }
          },
          timeout: 1e4,
          params: { scope: "imgpaths" },
          beforeSend: framework.beforeSend
        });
      };
      this.queryMcUserRole = function(userId) {
        return camel.get({
          url: {
            s: window.appWebPath + "/rest/mc/v1/{user_id}/role",
            o: { user_id: userId }
          },
          timeout: 1e4,
          beforeSend: framework.beforeSend
        });
      };
      this.messageStatus = function(options) {
        return camel.put({
          url: {
            s: window.appWebPath + "/rest/mc/v1/{domain_id}/messages/status",
            o: { domain_id: options.domainId }
          },
          timeout: 1e4,
          params: {
            message_ids: options.messageIds,
            category_id: options.categoryId
          },
          beforeSend: framework.beforeSend
        });
      };
      this.queryMcUnreadCount = function(domainId) {
        return camel.get({
          url: {
            s:
              window.appWebPath +
              "/rest/mc/v1/{domain_id}/messages/envelope/unread",
            o: { domain_id: domainId }
          },
          timeout: 1e4,
          beforeSend: framework.beforeSend
        });
      };
      this.queryMcMessages = function(domainId, params) {
        return camel.get({
          url: {
            s: window.appWebPath + "/rest/mc/v1/{domain_id}/messages",
            o: { domain_id: domainId }
          },
          params: params,
          timeout: 1e4,
          beforeSend: framework.beforeSend
        });
      };
      this.createIncidentInfo = function(createFeedback) {
        createFeedback = createFeedback || {};
        return camel.post({
          url: window.appWebPath + "/rest/osm/incidentservice/api/v1/feedback",
          params: { createFeedback: createFeedback },
          timeout: 6e4,
          beforeSend: framework.beforeSend
        });
      };
      this.queryCusBrief = function(userId) {
        return camel.get({
          url: {
            s:
              window.appWebPath +
              "/rest/osm/incidentservice/api/v1/queryincident"
          },
          params: { status: 1 },
          timeout: 1e4,
          beforeSend: framework.beforeSend
        });
      };
      this.queryRealNameAuth = function(params) {
        return camel.get({
          url: {
            s:
              window.appWebPath +
              "/rest/BSS/OpenApi/v1/extention/customer/customerverified/status"
          },
          params: params,
          timeout: 6e4,
          beforeSend: framework.beforeSend
        });
      };
      this.queryTracker = function(projectId) {
        var params = params || {};
        return camel.get({
          url: {
            s: window.appWebPath + "/rest/v1.0/{projectId}/tracker",
            o: { projectId: projectId }
          },
          params: params,
          timeout: 6e4,
          beforeSend: framework.beforeSend
        });
      };
      this.queryTraceList = function(projectId, trackerName, params, regionId) {
        params = params || {};
        return camel.get({
          url: {
            s: window.appWebPath + "/rest/v2.0/{projectId}/{trackername}/trace",
            o: { trackername: trackerName, projectId: projectId }
          },
          params: params,
          timeout: 6e4,
          region: regionId,
          beforeSend: framework.beforeSend
        });
      };
      this.customMaintenances = function() {
        return camel.get({
          url: {
            s:
              window.appWebPath +
              "/rest/silvan/rest/v1.0/customMaintenances/{region_id}/{service_id}?locale={locale}",
            o: {
              region_id: $rootScope.selectRegionId,
              service_id: window.location.pathname.split("/")[1],
              locale: window.urlParams.lang
            }
          },
          timeout: 6e4,
          beforeSend: framework.beforeSend
        });
      };
      this.showSuspendedTip = function(localizationConfig, type) {
        var $serviceMenus,
          offset,
          headerHeight,
          messageTemplate =
            '<span class="frame-os-check-hint-display common-font-size-big1"> <span class="frame-os-check-tips-icon hwsicon-frame-image-tip dt-tip-background-color"></span><span class="frame-os-check-tips" ng-bind="i18n.console_term_tipInfo_' +
            type +
            '_label"></span><span class="frame-os-check-link-info"><a ng-if="i18n.console_term_learnMore_' +
            type +
            '_link" ng-href="{{i18n.console_term_learnMore_' +
            type +
            '_link}}"class="learn-more-link-info" ng-bind="i18n.console_term_learnMore_label" target="_blank"></a></span></span></div>',
          messageWrap = $('<div id="frame-suspended-check"></div>');
        $("#frame-suspended-check").length <= 0 &&
          messageWrap.prependTo($(document.body));
        $("#frame-suspended-check").html(messageTemplate);
        $serviceMenus = $("#service-menus");
        (offset = 62), (headerHeight = offset + $serviceMenus.height());
        $serviceMenus.css("top", offset);
        $(".console-menu-nav-list-wrapper").css("top", headerHeight);
        $rootScope.tipPosition = { paddingTop1: 112, paddingTop2: 162 };
        this.setTipTopPadding(
          $rootScope.tipPosition.paddingTop1,
          $rootScope.tipPosition.paddingTop2
        );
        $("#frame-suspended-check").length > 0 &&
          $("#frame-suspended-check").show();
      };
      this.hideSuspendedTip = function(localizationConfig) {
        var $serviceMenus, offset, headerHeight;
        $("#frame-suspended-check").hide();
        $serviceMenus = $("#service-menus");
        (offset = 0), (headerHeight = offset + $serviceMenus.height());
        $serviceMenus.css("top", offset);
        $(".console-menu-nav-list-wrapper").css("top", headerHeight);
        $("#frame-os-check").length > 0 &&
          ($rootScope.tipPosition = { paddingTop1: 112, paddingTop2: 162 });
        $rootScope.tipPosition = { paddingTop1: 50, paddingTop2: 100 };
        this.setTipTopPadding(
          $rootScope.tipPosition.paddingTop1,
          $rootScope.tipPosition.paddingTop2
        );
      };
      this.setTipTopPadding = function(paddingTop1, paddingTop2) {
        if (!paddingTop1 && !paddingTop2 && !$rootScope.tipPosition) return;
        paddingTop1 = paddingTop1 || $rootScope.tipPosition.paddingTop1;
        paddingTop2 = paddingTop2 || $rootScope.tipPosition.paddingTop2;
        $timeout(function() {
          var $fs = $(".framework-scrolling"),
            bodyHeight = $(document.body).height(),
            footerHeight = $("#footer").height();
          if ($("#frame-os-check").length > 0 && 50 === paddingTop1) {
            paddingTop1 = 112;
            paddingTop2 = 162;
          }
          if ("TSI" !== localizationConfig.x_domain_type) {
            $("#service-content").css("padding-top", paddingTop1 + "px");
            $fs.attr("style")
              ? $fs.css(
                  "cssText",
                  $fs.attr("style") + "top: " + paddingTop1 + "px !important"
                )
              : $fs.css("cssText", "top: " + paddingTop1 + "px !important");
            $(".dropdown-menu").css({
              "max-height": bodyHeight - paddingTop1 - footerHeight + "px"
            });
          } else {
            $("#service-content").css("padding-top", paddingTop2 + "px");
            $fs.attr("style")
              ? $fs.css(
                  "cssText",
                  $fs.attr("style") + "top: " + paddingTop2 + "px !important"
                )
              : $fs.css("cssText", "top: " + paddingTop2 + "px !important");
            $(".dropdown-menu").css({
              "max-height": bodyHeight - paddingTop2 - footerHeight + "px"
            });
          }
        }, 10);
      };
      this.queryCustomerManangment = function(options) {
        return camel.get({
          url: {
            s:
              window.appWebPath +
              "/rest/BSS/OpenApi/v1/customers/queryCusBrief/{userId}",
            o: { userId: options.domainId }
          },
          timeout: 1e4,
          beforeSend: framework.beforeSend
        });
      };
      this.getSellerAndPartner = function(customerOptions) {
        customerOptions = customerOptions || {};
        return camel.post({
          url: window.appWebPath + "/rest/v1/isvMgr/isvInfo",
          params: customerOptions,
          timeout: 1e4,
          beforeSend: framework.beforeSend
        });
      };
      this.getAllianceAccountInfo = function(options) {
        return camel.get({
          url: {
            s:
              window.appWebPath +
              "/rest/cbc/cbccustmgrservice/v1/site/customer/xdomains"
          },
          params: {
            customer_id: options.domainId,
            site_type: options.siteType
          },
          timeout: 1e4
        });
      };
      this.getSAMLResponse = function(url) {
        var deferred = $q.defer(),
          settings = {
            type: "get",
            timeout: 3e4,
            xhrFields: { withCredentials: "true" },
            url: url,
            data: {},
            beforeSend: function(request, setting) {},
            complete: function(xhr, status) {}
          };
        $.ajax(settings)
          .success(function(data, status, xhr) {
            deferred.resolve.apply(deferred, arguments);
          })
          .error(function() {
            deferred.reject.apply(deferred, arguments);
          });
        return deferred.promise;
      };
      this.getOCBToken = function(samlResponse, url) {
        var deferred = $q.defer(),
          settings = {
            type: "post",
            timeout: 3e4,
            url: url,
            data: {
              SAMLResponse: samlResponse,
              "X-Idp-Id": "@ALLY_HUAWEICLOUD"
            },
            dataType: "json",
            beforeSend: function(request, setting) {
              request.setRequestHeader(
                "Content-Type",
                "application/x-www-form-urlencoded"
              );
            },
            complete: function(xhr, status) {}
          };
        $.ajax(settings)
          .success(function(data, status, xhr) {
            deferred.resolve.call(deferred, { data: data, xhr: xhr });
          })
          .error(function() {
            deferred.reject.apply(deferred, arguments);
          });
        return deferred.promise;
      };
    };
  service.$injector = ["$q", "camel"];
  return service;
});
define("app-remote/services/utilService", [], function() {
  "use strict";
  return function() {
    function trimEmpty(value) {
      if (!value) return "";
      return value.replace(/(^\s*)|(\s*$)/g, "");
    }
    var i18nSubRegRex = /\{\s*([^\|\}]+?)\s*(?:\|([^\}]*))?\s*\}/g;
    this.i18nReplace = function(s, o) {
      return s.replace
        ? s.replace(i18nSubRegRex, function(match, key) {
            return angular.isUndefined(o[key]) ? match : o[key];
          })
        : s;
    };
    this.i18nReplaceFull = function(s, o) {
      if (!s || !o) return;
      return s.replace
        ? s.replace(i18nSubRegRex, function(match, key) {
            return angular.isUndefined(o[key]) ? match : o[key];
          })
        : s;
    };
    this.getCookie = function(key) {
      var consoleCookies, cookie, i;
      if (!document.cookie) return null;
      consoleCookies = document.cookie.split(";");
      for (i = 0; i < consoleCookies.length; i++) {
        cookie = consoleCookies[i].split("=");
        if (cookie && cookie.length >= 2 && key === trimEmpty(cookie[0]))
          return trimEmpty(cookie[1]);
      }
    };
    this.setCookie = function(cname, cvalue) {
      document.cookie =
        cname + "=" + cvalue + ";path=/;domain=" + window.cloudCookieDomain;
    };
    this.getPostcode = function(callback) {
      var options;
      options =
        "zh-cn" === window.urlParams.lang
          ? {
              url:
                "//console-static.huaweicloud.com/static/framework/4.4.0/i18n/default/zh-cn/postcode_zh.json?_=" +
                new Date().getTime()
            }
          : {
              url:
                "//console-static.huaweicloud.com/static/framework/4.4.0/i18n/default/en-us/postcode_en.json?_=" +
                new Date().getTime()
            };
      $.ajax({
        url: options.url,
        data: null,
        success: function(response, status) {
          "function" == typeof callback && callback(response);
        },
        error: function(response) {
          "function" == typeof callback && callback(response.responseText);
        },
        dataType: "json"
      });
    };
    this.getAdministrative = function(callback) {
      var options;
      options =
        "zh-cn" === window.urlParams.lang
          ? {
              url:
                "//console-static.huaweicloud.com/static/framework/4.4.0/i18n/default/zh-cn/administrative_zh.json?_=" +
                new Date().getTime()
            }
          : {
              url:
                "//console-static.huaweicloud.com/static/framework/4.4.0/i18n/default/en-us/administrative_en.json?_=" +
                new Date().getTime()
            };
      $.ajax({
        url: options.url,
        data: null,
        success: function(response, status) {
          "function" == typeof callback && callback(response);
        },
        error: function(response) {
          "function" == typeof callback && callback(response.responseText);
        },
        dataType: "json"
      });
    };
  };
});
define("app-remote/services/messageService", [], function() {
  "use strict";
  var MAX_MSG_NUMBER = 3,
    msgID = 1;
  return [
    "$timeout",
    "$rootScope",
    "storage",
    function($timeout, rootScope, storage) {
      rootScope.ctiMsgManager || (rootScope.ctiMsgManager = []);
      this.alert = function(type, message, duration, noTypeIcon, noCloseIcon) {
        var msgObj,
          i,
          curLen = rootScope.ctiMsgManager.length;
        curLen >= MAX_MSG_NUMBER &&
          rootScope.ctiMsgManager.splice(
            MAX_MSG_NUMBER - 1,
            curLen - MAX_MSG_NUMBER + 1
          );
        duration || (duration = "error" === type ? 1e4 : 5e3);
        msgObj = {
          id: "msg_" + msgID++,
          show: !0,
          label: message,
          type: type,
          typeIcon: !noTypeIcon,
          closeIcon: !noCloseIcon,
          duration: duration
        };
        if (rootScope.ctiMsgManager.length > 0)
          for (i = 0; i < rootScope.ctiMsgManager.length; i++)
            if (message === rootScope.ctiMsgManager[i].label) {
              rootScope.ctiMsgManager[i].show = !1;
              rootScope.ctiMsgManager.splice(i, 1);
            }
        message && this.storageMsg(type, message);
        rootScope.ctiMsgManager.splice(0, 0, msgObj);
      };
      this.showError = function(message, duration) {
        this.alert("error", message, duration);
      };
      this.showSuccess = function(message, duration) {
        this.alert("success", message, duration);
      };
      this.showPrompt = function(message, duration) {
        this.alert("prompt", message, duration);
      };
      this.showWarn = function(message, duration) {
        this.alert("warn", message, duration);
      };
      this.storageMsg = function(type, msg) {
        var agencyID,
          tipsMessages,
          msgData = {};
        msgData.content = "[" + type + "] " + msg;
        msgData.time = new Date();
        agencyID = storage.cookieStorage.getItem("agencyID");
        tipsMessages = storage.get("framework_tips_msg" + agencyID);
        tipsMessages = tipsMessages || [];
        tipsMessages.unshift(msgData) > 50 && tipsMessages.pop();
        storage.add("framework_tips_msg" + agencyID, tipsMessages);
        storage.add("framework_tips_new_msg" + agencyID, !0);
        $(".frame-message-round") &&
          $(".frame-message-round").css("display", "block");
      };
    }
  ];
});
define("app-remote/services/localeService", [
  "language-remote/framework"
], function(i18n) {
  "use strict";
  var service = function(tiService, $filter) {
    function getDecimalsCount(currency) {
      var newNumber,
        result = -1;
      if (angular.isNumber(currency)) {
        newNumber = currency.toString().split(".");
        result = newNumber[1] ? newNumber[1].length : 0;
      }
      return result;
    }
    angular.extend(this, tiService);
    this.formatCurrency = function(currency, type) {
      var currentDecimalsCount, result, min, max, currencySymbol;
      !angular.isNumber(currency) &&
        angular.isString(currency) &&
        (currency = Number(currency));
      currentDecimalsCount = getDecimalsCount(currency);
      result = "";
      if (-1 === currentDecimalsCount) return result;
      min = parseInt(i18n.localeRule.NUMBER_FORMATS.PATTERNS[1].minFrac, 10);
      max = parseInt(i18n.localeRule.NUMBER_FORMATS.PATTERNS[1].maxFrac, 10);
      currencySymbol = i18n.localeRule.NUMBER_FORMATS.CURRENCY_SYM;
      result =
        0 <= currentDecimalsCount && currentDecimalsCount <= min
          ? $filter("currency")(currency, currencySymbol, min)
          : min < currentDecimalsCount && currentDecimalsCount <= max
            ? $filter("currency")(
                currency,
                currencySymbol,
                currentDecimalsCount
              )
            : $filter("currency")(currency, currencySymbol, max);
      "short" === type &&
        (result = result.replace(
          i18n.localeRule.NUMBER_FORMATS.PATTERNS[1].posSuf,
          ""
        ));
      return result;
    };
    this.formatLocaleDateTime = function(dateTime) {
      return this.formatDateTime(dateTime) + " " + this.getZoneSuffix(dateTime);
    };
    this.getZoneSuffix = function(dateTime) {
      var timeZoneStr = $filter("date")(dateTime, "Z");
      return (
        "GMT" +
        timeZoneStr.substr(0, 1) +
        timeZoneStr.substr(1, 2) +
        ":" +
        timeZoneStr.substr(3, 4)
      );
    };
  };
  service.$injector = ["tiService", "$filter"];
  return service;
});
define("lazy-load/lazyLoad", ["ui-router/angular-ui-router"], function(router) {
  var lazy = angular.module("lazy", ["ui.router"]);
  lazy.makeLazy = function(module) {
    module.config(function(
      $compileProvider,
      $filterProvider,
      $controllerProvider,
      $provide
    ) {
      module.tinyDirective = lazy.register($compileProvider.directive);
      module.tinyFilter = lazy.register($filterProvider.register);
      module.tinyController = lazy.register($controllerProvider.register);
      module.tinyProvider = lazy.register($provide.provider);
      module.tinyService = lazy.register($provide.service);
      module.tinyFactory = lazy.register($provide.factory);
      module.tinyValue = lazy.register($provide.value);
      module.tinyConstant = lazy.register($provide.constant);
    });
    module.tinyStateConfig = function(routerConfig) {
      function isConfigArrayLike(config) {
        return angular.isArray(config) && config.length > 0;
      }
      if (!angular.isObject(routerConfig)) return;
      module.config([
        "$stateProvider",
        "$urlRouterProvider",
        function($stateProvider, $urlRouterProvider) {
          if (isConfigArrayLike(routerConfig.stateConfig)) {
            var normalConfig = null;
            angular.forEach(routerConfig.stateConfig, function(
              stateConfig,
              key
            ) {
              normalConfig = lazy.parseConfig(stateConfig);
              $stateProvider.state(normalConfig);
            });
          }
          isConfigArrayLike(routerConfig.urlMatch) &&
            angular.forEach(routerConfig.urlMatch, function(urlMatch, key) {
              2 === urlMatch.length
                ? $urlRouterProvider.when(urlMatch[0], urlMatch[1])
                : 1 === urlMatch.length &&
                  $urlRouterProvider.otherwise(urlMatch[0]);
            });
        }
      ]);
    };
    return module;
  };
  lazy.register = function(registrationMethod) {
    return function(name, constructor) {
      registrationMethod(name, constructor);
    };
  };
  lazy.parseConfig = function(stateConfig) {
    if (!stateConfig.scripts) return stateConfig;
    stateConfig.resolve = stateConfig.resolve || {};
    stateConfig.resolve.deps = function($q, $rootScope) {
      function load(url) {
        var deferred = $q.defer();
        if (null === url) {
          deferred.resolve();
          return deferred.promise;
        }
        require(url, function() {
          $rootScope.$apply(function() {
            deferred.resolve();
          });
        });
        return deferred.promise;
      }
      return $q.all([
        load(stateConfig.scripts.directives || null),
        load(stateConfig.scripts.controllers || null),
        load(stateConfig.scripts.services || null),
        load(stateConfig.scripts.factories || null),
        load(stateConfig.scripts.js || null)
      ]);
    };
    return stateConfig;
  };
  return lazy;
});
define("app-remote/framework/configures/frameworkRouterConfig", [
  "lazy-load/lazyLoad"
], function(lazyLoadModule) {
  "use strict";
  var nonsupportRegion = {
      url: "src/app/framework/views/nonsupportRegion.html"
    },
    beingMaintained = { url: "src/app/framework/views/beingMaintained.html" },
    accessDeclined = { url: "src/app/framework/views/accessDeclined.html" },
    configArr = [
      { name: "frameworkIndex", url: "/frameworkIndex" },
      {
        name: "nonsupportRegion",
        url: "/nonsupportRegion",
        templateUrl: nonsupportRegion.url,
        controller: "nonsupportRegion.ctrl",
        scripts: {
          controllers: ["app-remote/framework/controllers/nonsupportRegionCtrl"]
        }
      },
      {
        name: "beingMaintained",
        url: "/beingMaintained",
        templateUrl: beingMaintained.url,
        controller: "beingMaintained.ctrl",
        scripts: {
          controllers: ["app-remote/framework/controllers/beingMaintainedCtrl"]
        }
      },
      {
        name: "accessDeclined",
        url: "/accessDeclined",
        templateUrl: accessDeclined.url,
        controller: "accessDeclined.ctrl",
        scripts: {
          controllers: ["app-remote/framework/controllers/accessDeclinedCtrl"]
        }
      }
    ],
    frmModule = angular.module("frm", ["ui.router"]);
  frmModule = lazyLoadModule.makeLazy(frmModule);
  frmModule.tinyStateConfig({ stateConfig: configArr });
  frmModule.filter("maxDigits", function() {
    return function(input, digits) {
      var maxNumber = Math.pow(10, digits) - 1;
      input > maxNumber && (input = maxNumber + "+");
      return input;
    };
  });
  return frmModule;
});
define("app-remote/framework/controllers/nonsupportRegionCtrl", [], function() {
  "use strict";
  var nonsupportCtrl = [
      "$rootScope",
      "$scope",
      "$sce",
      "$stateParams",
      function($rootScope, $scope, $sce, $stateParams) {
        function isRegionFn() {
          var i,
            isRegion = !1;
          for (i = 0; i < $rootScope.regions.length; i++)
            if ($rootScope.regions[i].id === $rootScope.projectName) {
              isRegion = !0;
              break;
            }
          return isRegion;
        }
        function initNonsupportTips() {
          $scope.displayRegionName &&
            $scope.endpointName &&
            ($scope.console_term_nonsupportRegion_tips = $sce.trustAsHtml(
              $scope.i18nReplace(
                $scope.i18n.console_term_nonsupportRegion_tips,
                {
                  serviceName:
                    '<span class="common-color-title">' +
                    $scope.endpointName +
                    "</span>",
                  regionName:
                    '<span class="common-color-title">' +
                    $scope.displayRegionName +
                    "</span>"
                }
              )
            ));
        }
        $scope.$watch("endpointName", initNonsupportTips);
        $scope.$watch("displayRegionName", initNonsupportTips);
        $scope.$watch("regions", function(nv) {
          nv.length > 0 &&
            ($scope.console_term_nonsupport_label = isRegionFn()
              ? $scope.i18n.console_term_nonsupportRegion_label
              : $scope.i18n.console_term_nonsupportProject_label);
        });
      }
    ],
    frameModule = angular.module("frm");
  frameModule.tinyController("nonsupportRegion.ctrl", nonsupportCtrl);
  return frameModule;
});
define("app-remote/framework/controllers/beingMaintainedCtrl", [], function() {
  "use strict";
  var beingMaintainedCtrl = [
      "$scope",
      "$sce",
      "frameworkService",
      function($scope, $sce, frameworkService) {
        function initBeingMaintainedTips() {
          if ($scope.displayRegionName) {
            $scope.console_term_beingMaintained_label = $sce.trustAsHtml(
              $scope.i18nReplace(
                $scope.i18n.console_term_beingMaintained_label,
                {
                  regionName:
                    '<span class="common-color-title">' +
                    $scope.displayRegionName +
                    "</span>"
                }
              )
            );
            frameworkService.customMaintenances().then(function(data) {
              $scope.console_term_beingMaintained_describe_label =
                data.describe;
              $scope.console_term_beingMaintained_time_label =
                $scope.i18n.console_term_beingMaintained_time_label +
                data.startTime +
                " - " +
                data.endTime;
            });
          }
        }
        $scope.$watch("displayRegionName", initBeingMaintainedTips);
      }
    ],
    frameModule = angular.module("frm");
  frameModule.tinyController("beingMaintained.ctrl", beingMaintainedCtrl);
  return frameModule;
});
define("app-remote/framework/controllers/accessDeclinedCtrl", [], function() {
  "use strict";
  var accessDeclinedCtrl = [function() {}],
    frameModule = angular.module("frm");
  frameModule.tinyController("accessDeclined.ctrl", accessDeclinedCtrl);
  return frameModule;
});
define("framework.tpls", [
  "app-remote/framework/directive/hwsDirective"
], function(module) {
  module.run([
    "$templateCache",
    function($templateCache) {
      "use strict";
      $templateCache.put(
        "src/app/framework/views/accessDeclined.html",
        '<div class="console-content-padding"><div class="special-content"><div class="special-content-left-image"><img src="//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/nonsupport-small.png"></div><div class="special-content-right-content"><p class="common-font-size-big4 common-color-title" ng-bind="i18n.console_term_accessDeclined_label"></p><p class="common-color-content"><span ng-bind="i18n.console_term_accessOpen_label"></span></p></div></div></div>'
      );
      $templateCache.put(
        "src/app/framework/views/appendCustomLeftMenu.html",
        '<ul><li ng-repeat="row in leftMenuAppend  track by $index"><div class="dropdown menu-dropdown pull-left promote-menu-dropdown" style="margin-left:40px"><a class="dropdown-toggle console-topbar-btn default-hover-cursor-pointer" data-toggle="dropdown"><span class="pull-left padding-left-5" ng-bind="row.label"></span> <span class="hwsicon-frame-image-caret menu-hwsicon-frame-main-caret console-topbar-fixed-width-div"></span> </a><a class="console-topbar-btn-click dropdown-toggle default-hover-cursor-pointer" data-toggle="dropdown"><span class="pull-left padding-left-5" ng-bind="row.label"></span> <span class="hwsicon-frame-image-caret-up menu-hwsicon-frame-main-caret console-topbar-fixed-width-div"></span></a><ul ng-if="row.list&&row.list.length>0" class="dropdown-menu dropdown-menu-right user-dropdown-menu drop-down-menu-promote custom-activity-dropdown-menu"><li class="dropdown-menu-li-height frame-order-list" ng-repeat="list in row.list"><a ng-href="{{list.href}}" target="_blank" meta-data-uba="www_v1_framework.click.{{list.label}}"><span class="user-center-dropdown-text" ng-bind="list.label"></span></a></li></ul></div></li></ul>'
      );
      $templateCache.put(
        "src/app/framework/views/beingMaintained.html",
        '<div class="console-content-padding"><div class="maintenance"><div class="maintained-image"><img src="//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/maintenance-small.png"></div><div class="maintenance-region"><div class="maintenance-region-plus"><p class="common-font-size-big7 common-color-title" ng-bind-html="console_term_beingMaintained_label"></p><p ng-bind="console_term_beingMaintained_describe_label" style="max-width:400px;word-break:break-all"></p><p ng-bind="console_term_beingMaintained_time_label"></p></div><div class="maintenance-region-support-list" style="margin-bottom:40px"><span class="common-color-prompt common-font-size-big8" ng-bind="i18n.console_term_supportRegion_label"></span><ul><li ng-repeat="region in regions" ng-if="!region.disable && !region.maintence && region.id !== selectRegionId && !region.isSelfDevelop && !region.isAlliance" class="default-hover-cursor-pointer"><div class="region-maintenance-circle"></div><a ng-click="changeRegion(region.id)"><span class="common-font-size-big9" ng-bind="region.name"></span></a><ul style="padding-left:30px" ng-if="supportMultiProject"><li ng-repeat="project in region.projects" ng-if="project.userProjectNameFlag && !project.disable"><a ng-click="changeRegion(project.name)"><span ng-bind="project.displayName" class="region-name"></span></a></li></ul></li></ul></div></div></div></div>'
      );
      $templateCache.put(
        "src/app/framework/views/consultMenu.html",
        '<div ng-if="localizationConfig.newHECMenu && !localizationConfig.isCMC" class="hide-consult-menu-russia-style"><div class="consult-box"><div class="consult-center consult-content"><div class="consult-icon-show"><div class="append_hec_icon"><i class="hwsicon-frame-image-consult feedback-icon"></i></div><div class="append_hec_online" ng-if="consultAndFeedback"><span class="hec_consult_value" ng-bind="i18n.console_term_customer_consult_value"></span> <em>.</em> <span class="hec_feedback_value" ng-bind="i18n.console_term_feedback_button"></span></div></div><div class="consult-content-item"><ul class="consult-content-show"><li class="consult-item-content" ng-if="links.intelligent_service_common && i18n.console_term_intelligent_service_label&&!localizationConfig.isHecHk&&intelligentAndService"><a class="consult-font-famliy" ng-href="{{links.intelligent_service_common}}" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_intelligent_service_label}}"><span class="hwsicon-frame-image-intelligent-service consult-image-show" style="padding-right:10px"></span> <span ng-bind="i18n.console_term_intelligent_service_label"></span></a></li><li class="consult-item-content" ng-if="links.customer_service_common && i18n.console_term_customer_service_label&&!localizationConfig.isHecHk&&customerAndService"><a class="consult-font-famliy" ng-href="{{links.customer_service_common}}" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_customer_service_label}}"><span class="hwsicon-frame-image-artificial-service consult-image-show" style="padding-right:10px"></span> <span ng-bind="i18n.console_term_customer_service_label"></span></a></li><li class="consult-item-content" ng-if="i18n.console_term_hot_wire_telephone && localizationConfig.isHecHk" style="position:relative"><span class="hwsicon-frame-image-pre-sales-advice consult-image-show" style="padding-right:4px"></span> <span class="consult-font-famliy" style="position:absolute;top:0;left:64px" ng-bind="i18n.console_term_hot_wire_telephone"></span> <span class="consult-font-famliy" style="position:absolute;top:20px;left:64px" ng-bind="i18n.console_term_hot_wire_telephone_number"></span></li><li class="consult-item-content" ng-if="links.help_center_common && i18n.console_term_helpcenter_label"><a hws-href ng-href="{{links.help_center_common}}" target="_blank" class="consult-font-famliy" meta-data-uba="www_v1_framework.click.{{i18n.console_term_helpcenter_label}}"><span class="hwsicon-frame-image-help-center consult-image-show" style="padding-right:10px"></span> <span ng-bind="i18n.console_term_helpcenter_label"></span></a></li><li class="consult-item-content" ng-if="i18n.console_term_suggestion_feedback" i18n="i18n" cf-feedback><a class="consult-font-famliy" style="cursor:pointer"><span class="hwsicon-frame-image-suggestion_feedback consult-image-show" style="padding-right:10px;padding-left:15px"></span> <span ng-bind="i18n.console_term_suggestion_feedback"></span></a></li></ul></div></div></div></div>'
      );
      $templateCache.put(
        "src/app/framework/views/feeTemplate.html",
        '<ul class="dropdown-menu user-dropdown-menu" ng-class="{\'dropdown-menu-rigth common-dropdown-menu-right small-screen-fee-ul-width\':cfScreenFlag,\' common-dropdown-menu common-font-size-common user-dropdown-minwidth  bottom-left-sqr-rang border-cf-triangle-rang top-drop-down-menu-headerBilling\':!cfScreenFlag}"><div class="sqr-bottom"></div><div class="menu-user-balance"><div ng-if="showBalance && accountBalanceSum.length > 1" class="menu-user-balance-label"><div class="menu-user-balance-account {{isBalanceAccountOpen ? \'menu-user-balance-account-open\' :\'menu-user-balance-account-close\'}}" ng-click="showBalanceAccount($event); isBalanceAccountOpen ? isBalanceAccountOpen = false : isBalanceAccountOpen = true" ng-mouseleave="isBalanceAccountOpen = false"><span class="menu-user-balance-account-curr" ng-attr-title="accountBalanceName" ng-bind="accountBalanceName" meta-data-uba="www_v1_framework.click.{{accountBalanceName}}"></span><ul class="{{isBalanceAccountOpen ? \'open\' : \'\'}}" ng-mouseleave="isBalanceAccountOpen = false"><li ng-repeat="abs in accountBalanceSum"><a hws-href href ng-click="isBalanceAccountOpen = false; showBalanceAccount($event); changeBalanceAccount(abs.domainId, abs.beId, abs.beName);" ng-bind="abs.beName" meta-data-uba="www_v1_framework.click.{{abs.beName}}"></a></li></ul></div></div><div ng-if="showBalance && accountBalanceSum.length <= 1" class="menu-user-balance-label"><div class="menu-user-balance-account"><span ng-bind="i18n.console_term_accountBalance_label"></span></div></div><div ng-if="showBalance" class="menu-user-balance-content user-blance-margin-show"><div class="menu-user-balance-value"><span class="menu-user-balance-integer" ng-class="{\'small-screen-fee-number-label\':cfScreenFlag }" ng-bind="localeService.formatCurrency(accountBalance)"></span><a ng-if="!cfScreenFlag" hws-href href="{{accountBalanceLink}}" class="append-balance-recharge-button" ng-bind="i18n.console_term_recharge_button" meta-data-uba="www_v1_framework.click.{{i18n.console_term_recharge_button}}"></a><a ng-if="cfScreenFlag&&(accountBalance<=9999.99)" hws-href href="{{accountBalanceLink}}" class="append-balance-recharge-button" ng-bind="i18n.console_term_recharge_button" meta-data-uba="www_v1_framework.click.{{i18n.console_term_recharge_button}}"></a></div></div></div><div style="padding-left:20px"><a ng-if="cfScreenFlag&&(accountBalance>9999.99)" hws-href href="{{accountBalanceLink}}" ng-bind="i18n.console_term_recharge_button" meta-data-uba="www_v1_framework.click.{{i18n.console_term_recharge_button}}"></a></div><li ng-if="showBalance" class="dropdown-menu-li-line hws-show"></li><li ng-if="links.renewal_userCenter"><a hws-href ng-href="{{links.renewal_userCenter}}" target="_self" ng-bind="i18n.console_term_renewal_label" meta-data-uba="www_v1_framework.click.{{i18n.console_term_renewal_label}}"></a></li><li class="dropdown-menu-li-height frame-order-list hws-show" ng-if="links.order_list_user_center"><a hws-href ng-href="{{links.order_list_user_center}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myOrder_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myOrder_label"></span></a></li><li style="display:none!important" class="dropdown-menu-li-height frame-bill-list hws-show" ng-if="links.billing_userCenter"><a hws-href ng-href="{{links.billing_userCenter}}" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_billDetails_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_billDetails_label"></span></a></li><li class="dropdown-menu-li-height frame-bill-list hws-show" ng-if="links.consume_statistics_userCenter"><a hws-href ng-href="{{links.consume_statistics_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_consume_statistics}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_consume_statistics"></span></a></li><li class="dropdown-menu-li-height frame-bill-list hws-show" ng-if="links.receipt_supervise_userCenter"><a hws-href ng-href="{{links.receipt_supervise_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_receipt_supervise}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_receipt_supervise"></span></a></li><li style="display:none!important" class="dropdown-menu-li-height frame-user-credential hws-show"><a hws-href ng-href="{{links.user_credential_iam}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_fees_transaction_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_fees_transaction_label"></span></a></li><li class="dropdown-menu-li-height" style="display:none!important"><a hws-href ng-href="{{links.fees_userCenter}}" target="_self" style="text-align:center" meta-data-uba="www_v1_framework.click.{{i18n.console_term_fees_more_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_fees_more_label"></span></a></li></ul>'
      );
      $templateCache.put(
        "src/app/framework/views/feedback.html",
        '<div id="feedbackHtml" class="clearfix" ng-if="!localizationConfig.isHecHk"><form class="form"><div class="ti-modal-header"><span ng-bind="i18n.console_term_suggestion_feedback"></span> <span class="ti-close ti-icon ti-icon-close" ng-click="btnCancel()"></span></div><div class="ti-modal-body"><div class="feedback-content-tip"><span class="feedback-font-family-label append-hide-feedback-tip" ng-bind="i18n.console_term_feedback_tip"></span> <span class="feedback-font-family-label hec-hide-feedback-tip" ng-bind="i18n.console_term_feedback_tip_hk"></span> <a hws-href style="cursor:pointer" ng-href="{{i18n.console_term_feedback_kf_link}}" target="_blank" ng-bind="i18n.console_term_feedback_kf" class="append-hide-feedback-tip" meta-data-uba="www_v1_framework.click.{{i18n.console_term_feedback_kf}}"></a></div><div class="field-content"><textarea style="resize:none;border-bottom-color:#fff" class="feedback-content-family" placeholder-text="{{i18n.console_term_feedback_placeholder}}" id="J_FeedbackContent" ng-model="parent.feedbackContent" ng-keyup="textKeyup($event)" ng-class="{\'feedback-content-border-over\': feedbackContent.length > maxContentLength}" maxlength="maxContentLength"></textarea><textarea style="border-top-color:#fff" class="feedback-bottom-dialog-border-show" ng-class="{\'feedback-content-border-over\': feedbackContent.length > maxContentLength}"></textarea><div class="feedback-content-limit feedback-bottom-count-position"><span class="feedback-content-count" id="J_Feedcount"><span ng-class="{\'feedback-input-font-color\':feedbackContent.length>0&&feedbackContent.length <= maxContentLength}"><span ng-class="{\'feedback-content-count-over\': feedbackContent.length > maxContentLength}" ng-bind="feedbackContent.length"></span></span>/<span ng-bind="maxContentLength"></span></span></div><div class="feedback-content-error-message" ng-show="feedbackContent.length > maxContentLength"><span class="ti-alert-type-icon ti-icon ti-icon-exclamation-circle" style="margin-right:0"></span> <span class="feedback-content-error-warn" ng-bind="i18n.console_term_feedback_warn"></span></div></div></div><div class="ti-modal-footer"><button type="button" ti-button ti-focused="true" ng-click="btnOK.click()" ng-disabled="btnOK.disable" ng-bind="i18n.console_term_feedback_button_submit" ng-class="{\'ti-btn-danger\':feedbackContent.length>0&&feedbackContent.length <= maxContentLength}" meta-data-uba="www_v1_framework.click.{{i18n.console_term_feedback_button_submit}}"></button> <button type="button" ti-button ng-click="btnCancel()" ng-bind="i18n.console_term_feedback_button_cancle" meta-data-uba="www_v1_framework.click.{{i18n.console_term_feedback_button_cancle}}"></button></div></form></div>'
      );
      $templateCache.put(
        "src/app/framework/views/footer.html",
        '<div id="console-top-footer" ng-if="!localizationConfig.isCMC" class="console-top-footer common-page-footer frame-small-font-size"><div id="footer" class="footer-copyright-content common-link-inherit-color console-content-padding common-content-screen"><div class="dropup pull-left"><a class="console-footer-btn dropdown-toggle console-footer-btn-dropdown" ng-class="{\'console-footer-btn-font-14\': localizationConfig.showNewLanguageIconSwitch}" data-toggle="dropdown" meta-data-uba="www_v1_framework.click.{{languageName}}"><span class="{{localizationConfig.showNewLanguageIconSwitch ? \'hwsicon-frame-image-footer-\' + language + \' console-footer-btn-icon\' : \'hwsicon-frame-image-footer-earth\'}}"></span> <span class="padding-left-20" ng-class="{\'console-footer-btn-margin-left-23\': localizationConfig.showNewLanguageIconSwitch}" ng-bind="languageName"></span></a><ul class="dropdown-menu dropdown-menu-language common-dropdown-menu common-font-size-common"><li ng-repeat="languageArr in supportLanguage" ng-if="languageArr[0] !== language"><a target="_self" ng-class="{\'console-footer-btn-dropdown-padding-left-23\': localizationConfig.showNewLanguageIconSwitch}" ng-click="changeLanguage(languageArr[0])" meta-data-uba="www_v1_framework.click.{{languageArr[1]}}"><span ng-bind="languageArr[1]"></span></a></li></ul></div><div ng-if="i18n.console_term_face_book_link" class="pull-left"><a ng-href="{{i18n.console_term_face_book_link}}" target="_blank" class="console-footer-btn padding-left-10"><span class="pull-left" ng-bind="i18n.console_term_follow_us_label"></span> <span class="hwsicon-frame-image-face-book"></span></a></div><div class="pull-right" ng-if="localizationConfig.footerContentSwitch"><span ng-if="i18n.console_term_copyright_label" class="margin-left-3 pull-left margin-right4" ng-bind-html="console_term_copyright_label"></span><div ng-if="i18n.console_term_copyright_label && links.paymentMethods_common" class="pull-left console-footer-vertical-line"></div><a ng-if="links.paymentMethods_common" locale-href ng-href="{{links.paymentMethods_common}}" class="console-footer-btn pull-left" ng-bind="i18n.console_term_paymentMethods_label" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_paymentMethods_label}}"></a><div ng-if="links.lawyerInCharge_common" class="pull-left console-footer-vertical-line"></div><a ng-if="links.lawyerInCharge_common" locale-href ng-href="{{links.lawyerInCharge_common}}" class="console-footer-btn pull-left" ng-bind="i18n.console_term_lawyerInCharge_label" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_lawyerInCharge_label}}"></a><div ng-if="links.privacyProtect_common" class="pull-left console-footer-vertical-line"></div><a ng-if="links.privacyProtect_common" locale-href ng-href="{{links.privacyProtect_common}}" class="console-footer-btn pull-left" ng-bind="i18n.console_term_privacyProtect_label" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_privacyProtect_label}}"></a><div ng-if="links.legalAgreement_common" class="pull-left console-footer-vertical-line"></div><a ng-if="links.legalAgreement_common" locale-href ng-href="{{links.legalAgreement_common}}" class="console-footer-btn pull-left" ng-bind="i18n.console_term_legalAgreement_label" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_legalAgreement_label}}"></a><div ng-if="links.networkAccess_common" class="pull-left console-footer-vertical-line"></div><a ng-if="links.networkAccess_common" locale-href ng-href="{{links.networkAccess_common}}" class="console-footer-btn pull-left" ng-bind="i18n.console_term_networkAccess_label" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_networkAccess_label}}"></a></div></div></div>'
      );
      $templateCache.put(
        "src/app/framework/views/menus.html",
        '<div class="menu-top-content"><div id="menu-top" class="menu common-content-screen"><div><a locale-href ng-href="{{links.portal_common}}" class="console-nav-logo pull-left" target="_blank"></a> <a locale-href ng-href="{{links.portal_common}}" class="console-nav-logo-right pull-right" target="_blank"></a></div></div></div><div id="console-top-menu" framework-show-menu-hide-other-menus class="console-top-menu common-page-header common-font-size-big1 custom-header" ng-controller="menusCtrl"><div id="menu" class="menu console-content-padding common-content-screen custom-header"><div class="frame-menu-left common-link-inherit-color"><div class="hwsicon-frame-service-ecm icomoon-loading-div"></div><span custom-head-logo></span> <a ng-if="!headLogo.url" locale-href ng-href="{{links.portal_common}}" class="default-logo-show console-menu-logo pull-left" ng-class="{\'custom-menu-logo\': isCustomLogo}" target="_blank" meta-data-uba="www_v1_framework.click.logo"></a> <a ng-if="!headLogo.url" locale-href ng-href="{{links.console_common}}" class="dt-logo-show console-menu-logo pull-left" style="cursor:pointer" target="_self"></a><div class="default-style pull-left common-link-inherit-color" ng-if="!localizationConfig.rightRegion" ng-include="regionTpl.url"></div><div class="custom-style pull-left common-link-inherit-color"><div class="dropdown menu-dropdown region-menu-dropdown" ng-class="{\'closed\':!regions || regions.length === 0}" ng-if="regionDisplayFlag && isServiceConsole && !globalRegionName"><a class="dropdown-toggle console-topbar-btn console-topbar-region default-hover-cursor-pointer" data-toggle="dropdown" meta-data-uba="www_v1_framework.click.{{displayRegionName}}"><span class="hwsicon-frame-image-position hwsicon-frame-position" ng-style="{ \'color\': regionHighlightColor[regionColorIndex % 12] }"></span> <span class="console-topbar-fixed-width-region dt-menu-region-text-align" ng-bind="displayRegionName" ng-attr-title="{{displayRegionName}}"></span> <span class="hwsicon-frame-image-caret menu-hwsicon-frame-region-caret console-topbar-fixed-width-div"></span> </a><a class="dropdown-toggle console-topbar-btn-click console-topbar-region drodown-radius-click-bg default-hover-cursor-pointer" data-toggle="dropdown" meta-data-uba="www_v1_framework.click.{{displayRegionName}}"><span class="hwsicon-frame-image-position hwsicon-frame-position" ng-style="{ \'color\': regionHighlightColor[regionColorIndex % 12] }"></span> <span class="console-topbar-fixed-width-region dt-menu-region-text-align" ng-bind="displayRegionName"></span> <span class="hwsicon-frame-image-caret-up menu-hwsicon-frame-region-caret console-topbar-fixed-width-div"></span></a><ul role="menu" class="dropdown-menu dropdown-menu-region dropdown-menu-region-new common-dropdown-menu"><li console-dropdown region="region" ng-repeat="region in regions" class="region-item dropdown dropdown-submenu dropdown-menu-right default-hover-cursor-pointer" ng-class="{ \'region-disabled\': region.disable, \'current\': region.id == projectName}"><a ng-if="!region.isAlliance" tabindex="-1" ng-click="changeRegion(region.id)" class="region-name-link" meta-data-uba="www_v1_framework.click.{{region.name}}"><div class="region-before-position hwsicon-frame-image-position" ng-if="region.id == projectName" ng-style="{ \'color\': regionHighlightColor[$index % 12] }"></div><div class="region-before-position region-name-before-circle" ng-if="region.id !== projectName" ng-style="{ \'background\': regionHighlightColor[$index % 12] }"></div><span ng-bind="region.name" class="region-name"></span> <i class="right-icon" ng-show="region.projects && region.projects.length > 0"></i> </a><a ng-if="region.isAlliance" ng-href="{{region.regionLink}}" target="_blank" tabindex="-1" class="region-name-link" meta-data-uba="www_v1_framework.click.{{region.name}}"><div class="region-before-position hwsicon-frame-image-position" ng-if="region.id == projectName" ng-style="{ \'color\': regionHighlightColor[$index % 12] }"></div><div class="region-before-position region-name-before-circle" ng-if="region.id !== projectName" ng-style="{ \'background\': regionHighlightColor[$index % 12] }"></div><span ng-bind="region.name" class="region-name"></span> <i class="right-icon" ng-show="region.projects && region.projects.length > 0"></i></a><ul class="dropdown-menu sub-dropdown-menu-region" ng-if="region.projects && region.projects.length > 0"><li ng-repeat="project in region.projects track by $index" ng-class="{ \'region-disabled\': project.disable || (project.userProjectNameFlag && !supportMultiProject), \'current\': project.name == projectName }" class="default-hover-cursor-pointer"><a project-name="{{project.name}}" class="sub-region-name-link J_Project" project-disable="{{project.disable || (project.userProjectNameFlag && !supportMultiProject)}}" meta-data-uba="www_v1_framework.click.{{project.displayName}}"><span ng-bind="project.displayName" class="region-name"></span></a></li></ul></li></ul></div></div><div class="pull-left console-menu-home"><a class="console-topbar-btn ctc-home-page-show"><span style="cursor:pointer" href ng-click="goHome()" class="console-menu-home-link-other"><span class="pull-left" ng-bind="i18n.console_term_console_label"></span> </span></a><a ng-if="!localizationConfig.newHECMenu" class="console-topbar-btn no-ctc-home-page-show"><span style="cursor:pointer" ng-click="goHome()" class="padding-left-15"><span class="pull-left padding-left-20" ng-bind="i18n.console_term_homePage_label"></span> </span></a><a ng-if="localizationConfig.newHECMenu" class="console-topbar-btn" ng-click="goHome()" meta-data-uba="www_v1_framework.click.{{i18n.console_term_consolePage_label}}"><span style="cursor:pointer" class="padding-left-15"><span class="pull-left padding-left-20" ng-bind="i18n.console_term_consolePage_label"></span></span></a></div><div class="dropdown pull-left menu-dropdown framework-service-list margin-left-20" ng-show="isServiceConsole && elementDisplayFlag"><a ng-if="!localizationConfig.newHECMenu || localizationConfig.isCMC" class="dropdown-toggle console-topbar-btn console-menu-service-link default-hover-cursor-pointer" ng-click="serviceListClick()" data-toggle="dropdown"><span class="pull-left padding-left-5" ng-bind="i18n.console_term_servicesList_label"></span> <span class="hwsicon-frame-image-caret menu-hwsicon-frame-main-caret console-topbar-fixed-width-div"></span> </a><a ng-if="localizationConfig.newHECMenu && !localizationConfig.isCMC" class="dropdown-toggle console-topbar-btn console-menu-service-link default-hover-cursor-pointer" ng-click="serviceListClick()" data-toggle="dropdown" meta-data-uba="www_v1_framework.click.{{i18n.console_term_servicesList_label}}"><span class="pull-left padding-left-5" ng-bind="i18n.console_term_servicesList_label"></span> <span class="hwsicon-frame-image-caret menu-hwsicon-frame-main-caret console-topbar-fixed-width-div"></span> </a><a ng-if="!localizationConfig.newHECMenu || localizationConfig.isCMC" class="dropdown-toggle console-topbar-btn-click console-menu-service-link default-hover-cursor-pointer" ng-click="serviceListClick()" data-toggle="dropdown"><span class="pull-left padding-left-5" ng-bind="i18n.console_term_servicesList_label"></span> <span class="hwsicon-frame-image-caret-up menu-hwsicon-frame-main-caret console-topbar-fixed-width-div"></span> </a><a ng-if="localizationConfig.newHECMenu && !localizationConfig.isCMC" class="dropdown-toggle console-topbar-btn-click console-menu-service-link default-hover-cursor-pointer" ng-click="serviceListClick()" data-toggle="dropdown"><span class="pull-left padding-left-5" ng-bind="i18n.console_term_servicesList_label"></span> <span class="hwsicon-frame-image-caret-up menu-hwsicon-frame-main-caret console-topbar-fixed-width-div"></span></a><div class="dropdown-menu console-menu-nav-list-wrapper dropdown-menu-overflow-hidden-hec framework-dropdown-menu-service-list"><div ng-if="!localizationConfig.newHECMenu || localizationConfig.isCMC"><div class="console-menu-nav-list common-dropdown-menu"><div class="row service-list"><div ng-if="catalogLength(catalog.endpoints)" class="dropdown-submenu" ng-class="\'service-detail-\' + language" ng-repeat="catalog in serviceEndpoints"><div class="console-menu-nav-item"><legend class="console-topbar-nav-item-title common-content-title-service-catalog common-font-size-big2"><span ng-bind="catalog.catalog"></span></legend><ul class="margin-top-1"><li ng-repeat="endpoint in catalog.endpoints|filter:{nonsupportCurrentRegion:false}" class="clearfix" ng-init="genFavTipOptions()" ng-if="!endpoint.nonsupportCurrentRegion"><div class="pull-left dropdown-list-item-width"><a hws-href ng-href="{{endpoint.endpoint}}" ng-click="currentSelectedService(endpoint.endpoint,endpoint.id)" target="_self" class="dropdown-menu-list-text" ng-class="{\'frame-service-new-icon-a\': localizationConfig.showNewSwitch && endpoint.showNew}"><span class="margin-left-1" ng-class="{\'frame-service-list-service-name-text\': localizationConfig.showNewSwitch && endpoint.showNew}" title="{{endpoint.name}}" ng-bind="endpoint.name"></span> <span ng-if="localizationConfig.showNewSwitch && endpoint.showNew" class="icon-cloud-new-1 word-new-css"></span></a></div><div class="pull-right padding-left-10" ti-tip="endpoint.isFavorite===true?favTipOptions.cancel:favTipOptions.collect"><a data-stoppropagation="true" ng-click="favorite(endpoint.id,!endpoint.isFavorite)" class="service-list-item-icon default-hover-cursor-pointer"><div><span ng-class="{\'hwsicon-frame-image-favorite-new menu-hwsicon-frame-service-favorite-false\':!endpoint.isFavorite,\r\n                                                        \'hwsicon-frame-image-favorite-true menu-hwsicon-frame-service-favorite common-font-size-big2\':endpoint.isFavorite,\'placeholder-div\':!endpoint.isFavorite}"></span></div></a></div></li></ul></div></div></div><div class="service-list-item-tr"><div class="div-tr"></div></div><div class="row favorite-menu-nav-tips"><div class="col-md-12 console-menu-nav-tips common-font-size-common padding-left-30" ng-if="!favoriteError"><span ng-bind-html="console_term_clickhere_tips"></span></div><div class="col-md-12 console-menu-nav-tips common-font-size-common padding-left-30 color-red console-old-services-favorites-full-tips" ng-if="favoriteError"><span ng-bind-html="i18n.console_term_collectTip_valid"></span></div></div></div></div><div ng-if="localizationConfig.newHECMenu && !localizationConfig.isCMC"><div class="framework-dropdown-service-list-top"><div class="common-content-screen framework-dropdown-service-list-top-content"><div class="framework-content-recent-service pull-left" framework-recent-service-bar><div class="framework-content-recent-service-list-detail"><div class="framework-content-recent-service-title pull-left" ng-if="rencentServiceList.length === 0"><span>{{i18n.console_term_emptyRecentlyVisitedServices_label}}</span></div><div class="framework-content-recent-service-title pull-left" ng-if="rencentServiceList.length !== 0"><span>{{i18n.console_term_recentlyVisitedServices_label}}</span></div><div class="framework-content-recent-service-list pull-left"><a ng-repeat="service in rencentServiceList track by $index" ng-if="service.name" ng-click="clickToService(service.links[\'dashboard\'].href || service.endpoint, service.id, service.name)" title="{{service.name}}" class="framework-content-recent-service-list-service">{{service.name}}</a></div><div class="clearfix"></div></div></div><div class="framework-submenu-search pull-right" framework-search-servicelist-bar><span class="framework-submenu-search-bar"><input id="frameworkSearchModuleListInput" type="text" placeholder="{{i18n.console_term_searchServiceKeyword_label}}" ng-model="searchInputModel" ng-change="searchMethod.timeFlash()" ng-blur="searchMethod.blurFn()" ng-focus="searchMethod.searchData()" ng-keydown="searchMethod.keyDownEvent($event)"> <span class="framework-submenu-searchbtn-nohover hwsicon-frame-image-detail"></span> <span class="framework-search-list" ng-show="searchList.length > 0" id="frameworkSearchModuleList" ng-mousedown="panelMousedown($event)"><a hws-href ng-repeat="data in searchList" ng-mouseover="searchMethod.mouseOverEvent($index)" ng-mousedown="searchMethod.selectItem($event, $index)" ng-click="searchMethod.selectItem($event, $index)" rel="{{data.endpoint}}" title="{{data.name}}" class="{{selectIndex == $index ? \'search-selected\' : \'\'}}" meta-data-uba="www_v1_framework.click.{{data.name}}_searchService"><p class="common-font-size-big1 common-color-title">{{data.name}}</p><p class="common-font-size-big1 common-color-prompt">{{data.description}}</p></a></span><span class="framework-search-list" ng-show="isSearchFocused && searchInputModel && searchList.length == 0 " id="frameworkSearchModuleEmpty"><span class="search-empty" ng-bind="i18n.console_term_searchServiceEmptyTips_label"></span></span></span></div><div class="clearfix"></div></div></div><framework-dropdown-service-list options="ServcieListForBanner"></framework-dropdown-service-list></div></div></div><div class="dropdown pull-left menu-dropdown frame-favorite-service-list favorite-margin-left"><a ng-if="!localizationConfig.newHECMenu" class="dropdown-toggle console-topbar-btn favorite-service-list-menu default-hover-cursor-pointer" data-toggle="dropdown" ng-click="showCustomFavoriteMenu()"><favorite-show-view on-changed="cfFavoriteMenusDropdown.onChanged(value)"></a><a ng-if="localizationConfig.newHECMenu&&!localizationConfig.isCMC" class="dropdown-toggle console-topbar-btn default-hover-cursor-pointer" data-toggle="dropdown" meta-data-uba="www_v1_framework.click.{{i18n.console_term_collect_tip}}" ng-click="showCustomFavoriteMenu()"><favorite-show-view on-changed="cfFavoriteMenusDropdown.onChanged(value)"></a><a ng-if="localizationConfig.newHECMenu&&localizationConfig.isCMC" class="dropdown-toggle console-topbar-btn favorite-service-list-menu default-hover-cursor-pointer" data-toggle="dropdown" ng-click="showCustomFavoriteMenu()"><favorite-show-view on-changed="cfFavoriteMenusDropdown.onChanged(value)"></a><a ng-if="!localizationConfig.newHECMenu" class="dropdown-toggle console-topbar-btn-click favorite-service-list-menu default-hover-cursor-pointer" data-toggle="dropdown" ng-click="hideCustomFavoriteMenu()"><favorite-hide-view></a><a ng-if="localizationConfig.newHECMenu&&!localizationConfig.isCMC" class="dropdown-toggle console-topbar-btn-click default-hover-cursor-pointer" data-toggle="dropdown" ng-click="hideCustomFavoriteMenu()"><favorite-hide-view></a><a ng-if="localizationConfig.newHECMenu&&localizationConfig.isCMC" class="dropdown-toggle console-topbar-btn-click favorite-service-list-menu default-hover-cursor-pointer" data-toggle="dropdown" ng-click="hideCustomFavoriteMenu()"><favorite-hide-view></a><div ng-if="!localizationConfig.newHECMenu" class="dropdown-menu common-dropdown-menu frame-favorite-service-list-options common-favorite-menu"><a hws-href ng-if="favoriteEndpoints.length == 0" ng-mouseleave="favoriteEndpointMouseLeave()" class="pull-left console-menu-favorite-item favorite-service-list common-font-size-common common-font-size-big1" target="_self"><span class="console-menu-favorite-item-text" ng-bind="i18n.console_term_emptyFavoriteList_label"></span> </a><a hws-href ng-if="elementDisplayFlag && (isServiceConsole || currentService === \'marketplace\')" ng-mouseleave="favoriteEndpointMouseLeave()" class="pull-left console-menu-favorite-item favorite-service-list common-font-size-common common-font-size-big1" ng-repeat="favoriteEndpoint in favoriteEndpoints" ng-href="{{favoriteEndpoint.endpoint}}" target="_self" ng-attr-title="{{favoriteEndpoint.name}}"><span class="console-menu-favorite-item-text" id="{{favoriteEndpoint.tipsElementId}}" ng-bind="favoriteEndpoint.name"></span></a></div><div ng-if="localizationConfig.newHECMenu&&!localizationConfig.isCMC" class="frame-favorite-service-list-options custom-favorite-menu" id="favoriteListShow"><div class="common-content-screen"><a hws-href ng-if="favoriteEndpoints.length == 0" ng-mouseleave="favoriteEndpointMouseLeave()" class="pull-left console-menu-favorite-item favorite-service-list common-font-size-common common-font-size-big1" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_emptyFavoriteList_label}}"><span class="console-menu-favorite-item-text" ng-bind="i18n.console_term_emptyFavoriteList_label"></span> </a><a ng-if="elementDisplayFlag && (isServiceConsole || currentService === \'marketplace\')" ng-mouseleave="favoriteEndpointMouseLeave()" class="pull-left console-menu-favorite-item favorite-service-list common-font-size-common common-font-size-big1" ng-repeat="favoriteEndpoint in favoriteEndpoints" hws-href href="{{favoriteEndpoint.endpoint}}" ng-click="currentSelectedService(favoriteEndpoint.endpoint,favoriteEndpoint.endpointId)" target="_self" ng-attr-title="{{favoriteEndpoint.name}}" meta-data-uba="www_v1_framework.click.{{favoriteEndpoint.name}}_favorite"><span class="console-menu-favorite-item-text" id="{{favoriteEndpoint.tipsElementId}}" ng-bind="favoriteEndpoint.name"></span> </a><a hws-href class="pull-left add-favorite" ng-click="showFavoriteModal()" meta-data-uba="www_v1_framework.click.showFavoriteModal"></a><div class="clearfix"></div></div><div ng-if="localizationConfig.newHECMenu&&!localizationConfig.isCMC" class="favorite-modal" frame-favorites-drag-panel-edit><div class="favorite-modal-main"><div class="favorite-modal-main-top"><div class="common-content-screen favorite-modal-main-services"><div class="favorite-modal-main-services-content pull-left"><span ng-if="cfFavoriteEndpointsLen == 0" ng-mouseleave="favoriteEndpointMouseLeave()" class="pull-left console-menu-favorite-item favorite-service-list empty-favorite-service-list"><span class="console-menu-favorite-item-text" ng-bind="i18n.console_term_emptyFavoriteList_label"></span></span><ul ng-if="cfhideFavoriteDropListFalg" id="framefavoritesDragPanel" class="frame-favorite-services-drag-panel"><li class="favorite-service-list favorite-services-item" ng-repeat="favoriteEndpoint in favoriteEndpoints" id="{{favoriteEndpoint.endpointId}}" ng-attr-title="{{favoriteEndpoint.name}}"><span class="favorite-services-item-text pull-left" ng-bind="favoriteEndpoint.name"></span> <span class="ti-close ui-draggable-handle ti-icon ti-icon-close favorite-services-item-delete pull-right" ng-click="cfFavoriteEndpointEdit(favoriteEndpoint,false)"></span> <span class="clearfix"></span></li></ul><div class="clearfix"></div></div><div class="pull-right"><button class="edit-favorite-close ti-btn-danger" ng-click="hideFavoriteModal()" meta-data-uba="www_v1_framework.click.closeCustomFavoriteSort" ng-bind="i18n.console_term_loginSessionExpiredHasOk_label"></button></div><div class="clearfix"></div></div></div><div class="favorite-modal-service-list"><div class="favorite-modal-service-list-content"><div class="favorite-modal-header"><div class="favorite-modal-title"><span class="favorite-tips"><span ng-bind="i18n.console_term_favorite_modalTips_label"></span>(<span class="{{cfFavoriteEndpointsLen >= favoriteServiceMax ? \'favorite-count favorite-overcount\' : \'favorite-count\'}}" ng-bind="cfFavoriteEndpointsLen"></span>/<span ng-bind="favoriteServiceMax"></span>)</span></div></div><div class="favorite-modal-content"><div class="favorite-modal-content-list" collect-waterfall cols="5"><div class="favorite-modal-catalog waterfall-row" ng-class="\'service-detail-\' + language" ng-repeat="catalog in serviceEndpoints" frameworkrepeat-finished><div class="console-menu-nav-item"><legend class="console-topbar-nav-item-title common-content-title-service-catalog common-font-size-big2" ng-bind="catalog.catalog"></legend><ul><li ng-repeat="endpoint in catalog.endpoints" class="clearfix" ng-click="cfFavoriteEndpointEdit(endpoint,!endpoint.isFavorite)" ng-init="initGetFavoriteTipOptions(endpoint)" ng-mouseenter="getFavoriteTipOptions($event,endpoint)" meta-data-uba="www_v1_framework.click.{{endpoint.name}}_{{endpoint.isFavorite}}" ng-mouseleave="removeFavoriteTipOptions()"><a data-stoppropagation="true" class="default-hover-cursor-pointer {{endpoint.isFavorite ? \'dropdown-menu-list-text-favorite\' : \'dropdown-menu-list-text\'}}" ti-tip="endpoint.favoriteTipContent" title="{{endpoint.name}}" ng-bind="endpoint.name"></a></li></ul></div></div></div></div></div></div></div></div></div><div ng-if="localizationConfig.newHECMenu&&localizationConfig.isCMC" class="dropdown-menu common-dropdown-menu frame-favorite-service-list-options common-favorite-menu"><a hws-href ng-if="favoriteEndpoints.length == 0" ng-mouseleave="favoriteEndpointMouseLeave()" class="pull-left console-menu-favorite-item favorite-service-list common-font-size-common common-font-size-big1" target="_self"><span class="console-menu-favorite-item-text" ng-bind="i18n.console_term_emptyFavoriteList_label"></span> </a><a hws-href ng-if="elementDisplayFlag && (isServiceConsole || currentService === \'marketplace\')" ng-mouseleave="favoriteEndpointMouseLeave()" class="pull-left console-menu-favorite-item favorite-service-list common-font-size-common common-font-size-big1" ng-repeat="favoriteEndpoint in favoriteEndpoints" ng-href="{{favoriteEndpoint.endpoint}}" target="_self" ng-attr-title="{{favoriteEndpoint.name}}"><span class="console-menu-favorite-item-text" id="{{favoriteEndpoint.tipsElementId}}" ng-bind="favoriteEndpoint.name"></span></a></div></div><div class="pull-left" custom-head-menu></div></div><div class="frame-menu-right" ng-class="{\'frame-menu-right-min-screen-adjust\':cfScreenFlag}"><div class="default-style common-link-inherit-color"><a locale-href ng-if="!localizationConfig.isCMC && links.help_center_common" class="pull-right console-topbar-btn console-topbar-btn-help default-style common-help margin-left-7 default-hover-cursor-pointer" ng-href="{{links.help_center_common}}" ti-tip="helpTips.tooltip" target="_blank"><span class="hwsicon-frame-image-help-new"></span></a><div class="dropdown pull-right menu-dropdown help-menu-dropdown custom-style"><a class="console-topbar-btn dropdown-toggle console-topbar-btn-help default-hover-cursor-pointer" data-toggle="dropdown"><span class="hwsicon-frame-image-help-new hwsicon-frame-help"></span> </a><a class="console-topbar-btn-click dropdown-toggle console-topbar-btn-help drodown-radius-click-bg default-hover-cursor-pointer" data-toggle="dropdown"><span class="hwsicon-frame-image-help-new hwsicon-frame-help"></span></a><ul class="dropdown-menu common-dropdown-menu common-font-size-common"><li class="dropdown-menu-li-height frame-user-center"><a hws-href ng-href="{{links.help_center_common}}" target="_blank"><span ng-bind="i18n.console_term_helpcenter_label"></span></a></li><li class="dropdown-menu-li-height frame-user-center"><a hws-href ng-href="{{links.hotline_Center_common}}" target="_blank"><span ng-bind="i18n.console_term_hotlineCenter_label"></span></a></li></ul></div><div class="dropdown pull-right menu-dropdown help-menu-dropdown default-style" ng-if="!localizationConfig.newHECMenu"><a hws-href href class="console-topbar-btn dropdown-toggle console-topbar-btn-help default-hover-cursor-pointer" data-toggle="dropdown"><span class="hwsicon-frame-image-help-new hwsicon-frame-help"></span> </a><a hws-href href class="console-topbar-btn-click dropdown-toggle console-topbar-btn-help drodown-radius-click-bg default-hover-cursor-pointer" data-toggle="dropdown"><span class="hwsicon-frame-image-help-new hwsicon-frame-help"></span></a><ul class="dropdown-menu common-dropdown-menu common-font-size-common"><li class="dropdown-menu-li-height frame-user-center"><a hws-href ng-href="{{links.help_center_common}}" target="_blank"><span ng-bind="i18n.console_term_helpcenter_label"></span></a></li><li class="dropdown-menu-li-height frame-user-center"><a hws-href ng-href="{{i18n.console_term_robot_link}}" target="_blank"><span ng-bind="i18n.console_term_robot_label"></span></a></li></ul></div><div class="dropdown pull-right menu-dropdown help-menu-dropdown ocb-custom-style"><a class="console-topbar-btn dropdown-toggle console-topbar-btn-help default-hover-cursor-pointer" ng-attr-title="{{i18n.console_term_helpcenter_label}}" data-toggle="dropdown"><span class="hwsicon-frame-image-help-new hwsicon-frame-help"></span> </a><a class="console-topbar-btn-click dropdown-toggle console-topbar-btn-help drodown-radius-click-bg default-hover-cursor-pointer" data-toggle="dropdown"><span class="hwsicon-frame-image-help-new hwsicon-frame-help"></span></a><ul class="dropdown-menu common-dropdown-menu common-font-size-common"><li class="dropdown-menu-li-height frame-user-center"><a hws-href ng-href="{{links.help_center_common}}" target="_blank"><span ng-bind="i18n.console_term_helpcenter_label"></span></a></li></ul></div><div class="dropdown menu-dropdown console-menu-message-box pull-right" ng-if="links.distributor_setting&&isShowDistributorLink&&cfDistributorSwitch"><a hws-href href ng-href="{{links.distributor_setting}}" target="_self" style="line-height:50px;font-size:16px;cursor:pointer" class="console-topbar-btn"><i class="hwsicon-frame-image-distributor-enter distributor-setting-enter-icon"></i></a></div><div class="pull-right" ng-if="localizationConfig.newHECMenu" ng-include="traceTpl.url"></div><div ng-if="localizationConfig.defaultHelpCenterSwitch&& links.help_center_common" class="console-topbar-btn pull-right nav-menu-dropdown margin-right-25"><a locale-href ng-href="{{links.help_center_common}}" target="_blank" ng-attr-title="{{i18n.console_term_helpcenter_label}}"><span class="hwsicon-frame-image-help-new"></span></a></div><div class="dropdown pull-right nav-menu-dropdown cmc-style"><a class="console-topbar-btn quota-icon-font-hec" ng-if="localizationConfig.newMenuAdjustAndNewHECMenuSwitch&&localizationConfig.newHECMenu && my_quota_link&&!localizationConfig.isCMC" refrence-href refrence="quota" ng-href="{{my_quota_link}}" target="_self" ng-attr-title="{{i18n.console_term_myQuota_label}}" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myQuota_label}}"><span><i class="hwsicon-frame-image-quota-hec"></i></span> </a><a class="console-topbar-btn margin-left-2" ng-if="!localizationConfig.newHECMenu&&my_quota_link" refrence-href refrence="quota" ng-href="{{my_quota_link}}" target="_self" ng-attr-title="{{i18n.console_term_myQuota_label}}"><span class="hwsicon-frame-image-quota"></span></a></div><div ng-show="links.message_list_message_center && !isMessageBoxEnabled" class="dropdown menu-dropdown console-menu-notice message-menu-dropdown pull-right cmc-style"><a class="console-topbar-btn dropdown-toggle console-topbar-btn-notice console-menu-message default-hover-cursor-pointer" data-toggle="dropdown" ng-click="showTipsMsg(1)" ng-attr-title="{{i18n.console_term_msg_label}}"><span class="hwsicon-frame-image-message hwsicon-frame-email"></span><div class="frame-message-round"></div></a><a href class="console-topbar-btn-click dropdown-toggle console-topbar-btn-notice drodown-radius-click-bg default-hover-cursor-pointer" data-toggle="dropdown"><span class="hwsicon-frame-image-message hwsicon-frame-email"></span><div class="frame-message-round"></div></a><div class="dropdown-menu common-dropdown-menu console-notice-list clearfix margin-right--1"><ul class="frame-menu-tips-message-content" ng-show="tipsMessages.length > 0"><li class="dropdown-menu-li-height frame-menu-tips-message-list frame-menu-tips-message-list-content" ng-repeat="message in tipsMessages"><span class="frame-message-content" ng-bind="message.content" ng-attr-title="{{message.content}}"></span> <span class="frame-message-time pull-right common-color-prompt" ng-bind="localeService.formatDateTime(message.time)"></span></li></ul><div class="message-box-empty" ng-show="tipsMessages.length == 0"><img src="//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/empty-envelope.svg" alt="" style="width:45px"><span ng-bind="::i18n.console_term_emptyMessageBox_label" style="color:#666;vertical-align:middle"></span></div><div class="frame-menu-tips-message-list"><div class="frame-message-sep-line"></div></div><div class="frame-message-page-turning-out frame-menu-tips-message-list"><a href class="frame-message-page-turning hwsicon-frame-image-pre-page" data-stoppropagation="true" ng-click="showTipsMsg(tipsMessagesCurrent-1)"></a><div class="frame-message-page-turning-index common-color-prompt"><span ng-bind="tipsMessagesCurrent"></span> <span>/</span> <span ng-bind="tipsMessagesTotal"></span></div><a href class="frame-message-page-turning hwsicon-frame-image-next-page" data-stoppropagation="true" ng-click="showTipsMsg(tipsMessagesCurrent+1)"></a> <a class="frame-message-msg-clear pull-right common-color-title default-hover-cursor-pointer" ng-click="clearTipsMsg()"><span class="hwsicon-frame-image-msg-delete"></span> <span class="frame-message-clear-text" ng-bind="i18n.console_term_clear_label"></span></a></div></div></div><div ng-if="isMessageBoxEnabled && !localizationConfig.isCMC" drop-down-triangle add-message-unread-background-color triangle-name="\'messageBox\'" class="dropdown menu-dropdown console-menu-message-box pull-right cmc-style" ng-class="{new: messageBox.unreadCount.total > 0}" ng-mouseenter="isShowMessage=messageBox.getMessages()" ng-mouseleave="isShowMessage=false" dropdown is-open="isShowMessage"><a hws-href href ng-href="{{links.message_center_endpoint}}" target="_self" class="console-topbar-btn dropdown-toggle console-topbar-btn-message-box no-animate" meta-data-uba="www_v1_framework.click.messageBox"><i class="hwsicon-frame-image-message"></i><div class="message-box-unread-count-background"></div><div class="message-box-unread-count" ng-bind="messageBox.unreadCount.total | maxDigits:2"></div></a><div class="dropdown-menu common-dropdown-menu console-message-box bottom-left-sqr-rang border-cf-triangle-rang top-drop-down-menu-messageBox"><ul class="message-box-list" ng-show="messageBox.messages.length > 0"><li ng-repeat="message in messageBox.messages track by message.id"><a class="clearfix" ng-href="{{links.message_center_endpoint}}#/mc/messages/{{message.id}}" meta-data-uba="www_v1_framework.click.{{::message.title}}"><i class="message-box-item-icon hwsicon-frame-image-message pull-left"></i> <span class="message-box-item-publish-time pull-right" ng-bind="getDateTimeMessage(message.publish_time)"></span> <span class="message-box-item-title" ng-bind="::message.title"></span></a></li></ul><div class="message-box-empty" ng-show="messageBox.messages.length === 0"><img src="//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/empty-envelope.svg" alt="" style="width:45px"><span ng-bind="::i18n.console_term_emptyMessageBox_label" style="color:#666;vertical-align:middle"></span></div><div class="message-box-links clearfix"><a ng-if="messageBox.role === \'owner\' || messageBox.role === \'admin\'" ng-href="{{links.message_center_endpoint}}#/mc/message-receive-management" ng-bind="::i18n.console_term_messageReceiveManagement_label" meta-data-uba="www_v1_framework.click.{{::i18n.console_term_messageReceiveManagement_label}}"></a><a ng-href="{{links.message_center_endpoint}}#/mc/messages/?status=0" class="pull-right" ng-bind="::i18n.console_term_more_label" meta-data-uba="www_v1_framework.click.{{::i18n.console_term_more_label}}"></a></div></div></div><div class="pull-right cmc-style user-info-tpl" user-info-tpl></div><a locale-href style="margin-right:10px" ng-if="links.old_console_home_link && i18n.console_term_oldConsole_label&&!localizationConfig.ctcRegionTiledDisplay" class="pull-right console-topbar-btn console-topbar-btn-oldConsole cmc-other-point-show" ti-tip="oldTips.tooltip" ng-href="{{links.old_console_home_link}}" target="_self"><span ng-bind="i18n.console_term_oldConsole_label" class="content-text"></span></a><div class="pull-right common-link-inherit-color cmc-style" style="margin-right:20px" ng-if="localizationConfig.rightRegion" ng-include="regionTpl.url"></div></div></div></div></div><div id="console-top-search-box" ng-show="topSerarchBoxBtn" ng-click="eventHideSearchBox($event)"><div class="top-search-box-content"><div class="top-search-panel"><div class="top-search-bar"><div class="top-search-input-box"><input type="text" class="top-search-input" ng-class="\'search-input-width-\'+language" placeholder="{{i18n.console_term_top_search_placeholder}}" ng-keydown="topSearchKeyDownEvent($event)" maxlength="80"> <span class="top-search-close-btn icon-cloud-action-cross" ng-class="\'search-close-btn-position-\'+language" ng-if="isShowTopSearchCloseBtn" ng-click="emptySearch()"></span></div><a class="top-search-a" data-href="{{newTopSearchLink}}" target="_blank" ng-bind="i18n.console_term_search_word"></a></div></div></div></div><div class="special-message" ng-if="showMessageBox"><div class="special-message-box"><span class="special-message-box-span" ng-bind="importantMessageContent"></span> <a class="special-message-box-a" ng-bind="i18n.console_term_click_check" ng-href="{{importantMessageHref}}"></a></div><span class="ti-alert-close-icon ti-icon ti-icon-close" ng-click="closeMessageBox()"></span></div><script>!function(e){function r(e,r,n,t,o,c){e=String(e);for(var u=0,a=0,f=e.length,d="",i=0;a<f;){var g=e.charCodeAt(a);for(g=g<256?n[g]:-1,u=(u<<o)+g,i+=o;i>=c;){i-=c;var h=u>>i;d+=t.charAt(h),u^=h<<i}++a}return!r&&i>0&&(d+=t.charAt(u<<c-i)),d}for(var n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t="",o=[256],c=[256],u=0,a={encode:function(e){return e.replace(/[\\u0080-\\u07ff]/g,function(e){var r=e.charCodeAt(0);return String.fromCharCode(192|r>>6,128|63&r)}).replace(/[\\u0800-\\uffff]/g,function(e){var r=e.charCodeAt(0);return String.fromCharCode(224|r>>12,128|r>>6&63,128|63&r)})},decode:function(e){return e.replace(/[\\u00e0-\\u00ef][\\u0080-\\u00bf][\\u0080-\\u00bf]/g,function(e){var r=(15&e.charCodeAt(0))<<12|(63&e.charCodeAt(1))<<6|63&e.charCodeAt(2);return String.fromCharCode(r)}).replace(/[\\u00c0-\\u00df][\\u0080-\\u00bf]/g,function(e){var r=(31&e.charCodeAt(0))<<6|63&e.charCodeAt(1);return String.fromCharCode(r)})}};u<256;){var f=String.fromCharCode(u);t+=f,c[u]=u,o[u]=n.indexOf(f),++u}var d=e.base64=function(e,r,n){return r?d[e](r,n):e?null:this};d.btoa=d.encode=function(e,t){return e=!1===d.raw||d.utf8encode||t?a.encode(e):e,(e=r(e,!1,c,n,8,6))+"====".slice(e.length%4||4)},d.atob=d.decode=function(e,n){e=String(e).split("=");var c=e.length;do{--c,e[c]=r(e[c],!0,o,t,6,8)}while(c>0);return e=e.join(""),!1===d.raw||d.utf8decode||n?a.decode(e):e},d.urlSafeEncode=function(e,r,n,t){return n||(n="%"),t||(t="%"),e=n+e+t,e=d.encode(e,r),e.replace(/\\+/g,"-").replace(/\\//g,"_").replace(/=/g,"")},d.urlSafeDecode=function(e,r,n,t){n||(n="%"),t||(t="%");var o=n.length,c=t.length;e=e.replace(/-/g,"+").replace(/_/g,"/"),"====".slice(e.length%4||4);var u=d.decode(e,r);return u.substring(o,u.length-c)}}(jQuery)</script><script>$(function(){"use strict";function n(){$("[data-toggle=dropdown]").each(function(){"block"===$(".frame-favorite-service-list-options")[0].style.display&&o($(this)).hasClass("frame-favorite-service-list")?($(".frame-favorite-service-list").addClass("open"),$(".frame-favorite-service-list .console-topbar-btn").hide(),$(".frame-favorite-service-list .console-topbar-btn-click").show()):o($(this)).hasClass("menu-dropdown")&&($(this).hasClass("console-topbar-btn-click")?$(this).css("display","none"):$(this).css("display","inline-block"))})}function o(n){var o=n.attr("data-target");o||(o=n.attr("href"),o=o&&/#[A-Za-z]/.test(o)&&o.replace(/.*(?=#[^\\s]*$)/,""));var e=o&&$(o);return e&&e.length?e:n.parent()}$(".console-menu-message").on("click",function(e){var s=$(this);e.stopPropagation(),o($(this)).hasClass("open")||$(".frame-menu-right").click(),$(".open").not(o(s)).removeClass("open"),o(s).toggleClass("open"),n()}),$(".menu-message-dropdown, .message-menu-dropdown").on("click",".dropdown-menu",function(n){n.stopPropagation()}),$(".framework-dropdown-menu-service-list").on("click",function(n){n.stopPropagation()}),$(".dropdown-menu").on("click","[data-stopPropagation]",function(n){$(".frame-dropdown-tinyTip").remove(),n.stopPropagation()}),$(".console-menu-service-link,.favorite-service-list-menu").on("click",function(){o($(this)).hasClass("open")||$(".frame-menu-left").click()}),$(".console-menu-userinfo").on("click",function(){o($(this)).hasClass("open")||$(".frame-menu-right").click()}),$(".frame-menu-left").on("click",".console-menu-region",function(){$(this).hasClass("open")||$(".frame-menu-left").click()}),$(document).on("click.bs.dropdown.data-api",\'[data-toggle="dropdown"]\',function(){var e=$(this);if(!e.is(".disabled, :disabled")){n();var s=o(e);if(s.hasClass("menu-dropdown")){s.hasClass("open")?($(s.children()[0]).css("display","none"),$(s.children()[1]).css("display","inline-block")):($(s.children()[0]).css("display","inline-block"),$(s.children()[1]).css("display","none"))}}}),$(document).on("click.bs.dropdown.data-api",n)})</script>'
      );
      $templateCache.put(
        "src/app/framework/views/nonsupportRegion.html",
        '<div class="console-content-padding"><div class="nonsupport"><div class="nonsupport-region-other"><div class="nonsupport-region"><div class="nonsupport-image pull-left"><img src="//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/nonsupport-small.png"></div><p class="common-font-size-big7 common-color-title" ng-bind="console_term_nonsupport_label"></p><p class="nonsupport-region-p common-color-content common-font-size-big8" ng-bind-html="console_term_nonsupportRegion_tips"></p></div><div class="nonsupport-region-support-list" style="margin-bottom:40px"><span class="common-color-prompt common-font-size-big8" ng-bind="i18n.console_term_supportRegion_label"></span><ul><li ng-repeat="region in regions" ng-if="!region.disable && !region.isSelfDevelop && !region.isAlliance" class="default-hover-cursor-pointer"><a ng-click="changeRegion(region.id)"><span class="common-font-size-big9" ng-bind="region.name"></span></a><ul style="padding-left:30px" ng-if="supportMultiProject"><li ng-repeat="project in region.projects" ng-if="project.userProjectNameFlag && !project.disable"><a ng-click="changeRegion(project.name)"><span ng-bind="project.displayName" class="region-name"></span></a></li></ul></li></ul></div></div></div></div>'
      );
      $templateCache.put(
        "src/app/framework/views/region.html",
        '<div class="dropdown menu-dropdown region-menu-dropdown console-menu-region"\n     ng-class="{\'closed\':!regions || regions.length === 0}"\n     ng-if="regionDisplayFlag && isServiceConsole && !globalRegionName && !localizationConfig.newHECMenu && !localizationConfig.ctcRegionTiledDisplay">\n    <a class="dropdown-toggle console-topbar-btn console-topbar-region default-hover-cursor-pointer"\n       data-toggle="dropdown" meta-data-uba="www_v1_framework.click.{{displayRegionName}}">\n        <span class="hwsicon-frame-image-position hwsicon-frame-position" ng-style="{ \'color\': regionHighlightColor[regionColorIndex % 12] }"></span>\n        <span class="console-topbar-fixed-width-region" ng-bind="displayRegionName" ng-attr-title="{{displayRegionName}}"></span>\n        <span class="hwsicon-frame-image-caret menu-hwsicon-frame-region-caret console-topbar-fixed-width-div"></span>\n    </a>\n    <a class="dropdown-toggle console-topbar-btn-click console-topbar-region drodown-radius-click-bg default-hover-cursor-pointer"\n       data-toggle="dropdown" meta-data-uba="www_v1_framework.click.{{displayRegionName}}">\n        <span class="hwsicon-frame-image-position hwsicon-frame-position" ng-style="{ \'color\': regionHighlightColor[regionColorIndex % 12] }"></span>\n        <span class="console-topbar-fixed-width-region" ng-bind="displayRegionName"></span>\n        <span class="hwsicon-frame-image-caret-up menu-hwsicon-frame-region-caret console-topbar-fixed-width-div"></span>\n    </a>\n    <ul class="dropdown-menu dropdown-menu-region common-dropdown-menu">\n        <li ng-repeat="region in regions" ng-class="{ \'region-disabled\': region.disable, \'current\': region.id == projectName }"\n            class="default-hover-cursor-pointer">\n            <a ng-if="!region.isAlliance" ng-click="changeRegion(region.id)" class="region-name-link" meta-data-uba="www_v1_framework.click.{{region.name}}">\n                <div class="region-before-position hwsicon-frame-image-position" ng-if="region.id == projectName" ng-style="{ \'color\': regionHighlightColor[$index % 12] }"></div>\n                <div class="region-before-position region-name-before-circle" ng-if="region.id !== projectName" ng-style="{ \'background\': regionHighlightColor[$index % 12] }"></div>\n                <span ng-bind="region.name" class="region-name"></span>\n            </a>\n            <a ng-if="region.isAlliance"   locale-link-href href="" ng-href="{{region.regionLink}}" target="_blank" class="region-name-link" meta-data-uba="www_v1_framework.click.{{region.name}}">\n                <div class="region-before-position hwsicon-frame-image-position" ng-if="region.id == projectName" ng-style="{ \'color\': regionHighlightColor[$index % 12] }"></div>\n                <div class="region-before-position region-name-before-circle" ng-if="region.id !== projectName" ng-style="{ \'background\': regionHighlightColor[$index % 12] }"></div>\n                <span ng-bind="region.name" class="region-name"></span>\n            </a>\n            <ul>\n                <li ng-repeat="project in region.projects" ng-hide="project.userProjectNameFlag && !supportMultiProject"\n                    ng-class="{ \'region-disabled\': project.disable, \'current\': project.name == projectName }" class="default-hover-cursor-pointer">\n                    <a ng-click="changeRegion(project.name,project.disable)" class="sub-region-name-link" meta-data-uba="www_v1_framework.click.{{project.displayName}}">\n                        <span ng-bind="project.displayName" class="region-name"></span>\n                    </a>\n                </li>\n            </ul>\n        </li>\n    </ul>\n</div>\n<div class="dropdown menu-dropdown region-menu-dropdown console-menu-region"\n     ng-class="{\'closed\':!regions || regions.length === 0}"\n     ng-if="regionDisplayFlag && isServiceConsole && !globalRegionName && localizationConfig.newHECMenu">\n    <a class="dropdown-toggle console-topbar-btn console-topbar-region default-hover-cursor-pointer"\n       data-toggle="dropdown" meta-data-uba="www_v1_framework.click.{{displayRegionName}}">\n        <span class="hwsicon-frame-image-position hwsicon-frame-position" ng-style="{ \'color\': regionHighlightColor[regionColorIndex % 12] }"></span>\n        <span class="console-topbar-fixed-width-region" ng-bind="displayRegionName" ng-attr-title="{{displayRegionName}}"></span>\n        <span class="hwsicon-frame-image-caret menu-hwsicon-frame-region-caret console-topbar-fixed-width-div"></span>\n    </a>\n    <a class="dropdown-toggle console-topbar-btn-click console-topbar-region drodown-radius-click-bg default-hover-cursor-pointer"\n       data-toggle="dropdown" meta-data-uba="www_v1_framework.click.{{displayRegionName}}">\n        <span class="hwsicon-frame-image-position hwsicon-frame-position" ng-style="{ \'color\': regionHighlightColor[regionColorIndex % 12] }"></span>\n        <span class="console-topbar-fixed-width-region" ng-bind="displayRegionName"></span>\n        <span class="hwsicon-frame-image-caret-up menu-hwsicon-frame-region-caret console-topbar-fixed-width-div"></span>\n    </a>\n    <ul role="menu" class="dropdown-menu dropdown-menu-region dropdown-menu-region-new common-dropdown-menu">\n        <li console-dropdown region="region" ng-repeat="region in regions" class="region-item dropdown dropdown-submenu dropdown-menu-right default-hover-cursor-pointer"\n            ng-class="{ \'region-disabled\': region.disable, \'current\': region.id == projectName||region.curProjectFlag}">\n            <a ng-if="!region.isAlliance" tabindex="-1" ng-click="changeRegion(region.id)" class="region-name-link" meta-data-uba="www_v1_framework.click.{{region.name}}">\n                <div class="region-before-position hwsicon-frame-image-position" ng-if="region.id == projectName || region.curProjectFlag" ng-style="{ \'color\': regionHighlightColor[$index % 12] }"></div>\n                <div class="region-before-position region-name-before-circle" ng-if="region.id !== projectName && !region.curProjectFlag" ng-style="{ \'background\': regionHighlightColor[$index % 12] }"></div>\n                <span ng-bind="region.name" class="region-name"></span>\n                <i class=" right-icon" ng-show="region.projects && region.projects.length > 0"></i>\n            </a>\n            <a ng-if="region.isAlliance"   locale-href  href="" ng-href="{{region.regionLink}}" tabindex="-1"  target="_blank" class="region-name-link" meta-data-uba="www_v1_framework.click.{{region.name}}">\n                <div class="region-before-position hwsicon-frame-image-position" ng-if="region.id == projectName" ng-style="{ \'color\': regionHighlightColor[$index % 12] }"></div>\n                <div class="region-before-position region-name-before-circle" ng-if="region.id !== projectName" ng-style="{ \'background\': regionHighlightColor[$index % 12] }"></div>\n                <span ng-bind="region.name" class="region-name"></span>\n                <i class=" right-icon" ng-show="region.projects && region.projects.length > 0"></i>\n            </a>\n            <ul class="dropdown-menu sub-dropdown-menu-region" ng-if="region.projects && region.projects.length > 0">\n                <li ng-repeat="project in region.projects" ng-class="{ \'region-disabled\': project.disable||(project.userProjectNameFlag && !supportMultiProject), \'current\': project.name == projectName }"\n                    class="default-hover-cursor-pointer">\n                    <a project-name="{{project.name}}" class="sub-region-name-link J_Project" project-disable="{{project.disable || (project.userProjectNameFlag && !supportMultiProject)}}" meta-data-uba="www_v1_framework.click.{{project.displayName}}">\n                        <span ng-bind="project.displayName" class="region-name"></span>\n                    </a>\n                </li>\n            </ul>\n        </li>\n    </ul>\n</div>\n\n<div id="J_RegionDropdown" class="dropdown pull-right menu-dropdown region-menu-dropdown console-menu-region"\n     ng-class="{\'closed\':!regions || regions.length === 0}"\n     ng-if="regionDisplayFlag && isServiceConsole && !globalRegionName && !localizationConfig.newHECMenu && localizationConfig.ctcRegionTiledDisplay">\n    <a class="dropdown-toggle console-topbar-btn console-topbar-region default-hover-cursor-pointer"\n       data-toggle="dropdown">\n        <span class="hwsicon-frame-image-position hwsicon-frame-position region-landmark-icon"></span>\n        <span class="console-topbar-fixed-width-region" ng-bind="displayRegionName" ng-attr-title="{{displayRegionName}}"></span>\n        <span class="hwsicon-frame-image-caret menu-hwsicon-frame-region-caret console-topbar-fixed-width-div"></span>\n    </a>\n    <a class="dropdown-toggle console-topbar-btn-click console-topbar-region drodown-radius-click-bg default-hover-cursor-pointer"\n       data-toggle="dropdown">\n        <span class="hwsicon-frame-image-position hwsicon-frame-position region-landmark-icon"></span>\n        <span class="console-topbar-fixed-width-region" ng-bind="displayRegionName"></span>\n        <span class="hwsicon-frame-image-caret-up menu-hwsicon-frame-region-caret console-topbar-fixed-width-div"></span>\n    </a>\n    <ul role="menu" class="dropdown-menu dropdown-menu-region dropdown-menu-region-new common-dropdown-menu region-tiled-menu clearfix">\n        <li class="phonetic-row clearfix" ng-repeat="phonetic in regionAscriptions" ng-show="phonetic.ascriptionList && phonetic.ascriptionList.length > 0">\n            <ul>\n                <li class="region-tiled-alphabet pull-left" ng-bind="phonetic.min + \'-\' + phonetic.max"></li>\n                <li region-tiled-dropdown\n                    select-ascription="ascription"\n                    class="pull-left region-tiled-ascription default-hover-cursor-pointer"\n                    ng-class="{\'current\': ifContainRegion(ascription.regions, projectName)}"\n                    ng-repeat="ascription in phonetic.ascriptionList">\n                    <a class="sub-region-name-link">\n                        <span ng-bind="ascription.displayName" class="region-name"></span>\n                    </a>\n                </li>\n            </ul>\n\n        </li>\n        <li class="region-tiled-submenu">\n            <div class="region-tiled-bread">\n                <span class="current-ascription" ng-bind="selectAscription.displayName"></span>\x3c!--\n                --\x3e<a class="submenu-back" href="#"><span class="icon-cloud-action-goback"></span><span class="submenu-back-text" ng-bind="i18n.console_term_goBack_button"></span></a>\n            </div>\n\n            <div class="clearfix">\n                <ul ng-repeat="region in selectAscription.regions track by $index">\n                    <li class="region-tiled-region pull-left default-hover-cursor-pointer" ng-class="{ \'region-disabled\': region.disable, \'current\': region.id == projectName}">\n                        <a ng-if="!region.isSelfDevelop && !region.isAlliance" ng-click="changeRegion(region.id)" class="sub-region-name-link J_Project">\n                            <div class="region-before-position hwsicon-frame-image-position region-landmark-icon" ng-class="{\'not-visibility\': region.id != projectName}"></div>\x3c!--\n                            --\x3e<span ng-bind="region.name" title={{region.name}} class="region-name"></span>\n                        </a>\n                        <a ng-if="!!region.isSelfDevelop" ng-href="{{region.regionLink}}" target="_blank" class="sub-region-name-link J_Project">\n                            <div class="region-before-position hwsicon-frame-image-position region-landmark-icon" ng-class="{\'not-visibility\': region.id != projectName}"></div>\x3c!--\n                            --\x3e<span ng-bind="region.name" title={{region.name}} class="region-name"></span>\n                        </a>\n                        <a ng-if="!!region.isAlliance && !region.isSelfDevelop" ng-href="{{region.regionLink}}" target="_blank" class="sub-region-name-link J_Project">\n                            <div class="region-before-position hwsicon-frame-image-position region-landmark-icon" ng-class="{\'not-visibility\': region.id != projectName}"></div>\x3c!--\n                            --\x3e<span ng-bind="region.name" title={{region.name}} class="region-name"></span>\n                        </a>\n                    </li>\n\n                    <li class="region-tiled-region pull-left default-hover-cursor-pointer" ng-repeat="project in region.projects"\n                        ng-class="{ \'region-disabled\': project.disable||(project.userProjectNameFlag && !supportMultiProject), \'current\': project.name == projectName }">\n                        <a ng-if="project.userProjectNameFlag && !supportMultiProject" class="sub-region-name-link J_Project">\n                            <div class="region-before-position hwsicon-frame-image-position region-landmark-icon" ng-class="{\'not-visibility\': project.name != projectName}"></div>\x3c!--\n                            --\x3e<span ng-bind="region.name+\'(\'+project.displayName+\')\'" title={{region.name+\'(\'+project.displayName+\')\'}} class="region-name"></span>\n                        </a>\n                        <a ng-if="!project.userProjectNameFlag || supportMultiProject" ng-click="changeRegion(project.name,project.disable)" class="sub-region-name-link J_Project">\n                            <div class="region-before-position hwsicon-frame-image-position region-landmark-icon" ng-class="{\'not-visibility\': project.name != projectName}"></div>\x3c!--\n' +
          "                            --\x3e<span ng-bind=\"region.name+'('+project.displayName+')'\" title={{region.name+'('+project.displayName+')'}} class=\"region-name\"></span>\n                        </a>\n                    </li>\n                </ul>\n            </div>\n\n        </li>\n\n    </ul>\n</div>"
      );
      $templateCache.put(
        "src/app/framework/views/serviceList.html",
        '<div ng-cloak><div class="servicelist-all-service"><div class="servicelist-all-service-content"></div></div><div style="clear:both"></div></div>'
      );
      $templateCache.put(
        "src/app/framework/views/traceTpl.html",
        '<div ng-if="trace.ctsEndpoint.endpoint" trace-log class="dropdown menu-dropdown trace-menu-show pull-right cmc-style" drop-down-triangle triangle-name="\'trace\'" ng-mouseenter="isShowLog=showLogLayout()" ng-mouseleave="isShowLog=hideLogLayout()" dropdown is-open="isShowLog"><a hws-href href ng-href="{{trace.ctsEndpoint.endpoint}}" target="_self" class="console-topbar-btn dropdown-toggle no-animate" meta-data-uba="www_v1_framework.click.{{i18n.console_term_trace_label}}"><span class="J_TraceBtn console-topbar-fixed-width-log trace-log-icon-font-hec" title="{{i18n.console_term_trace_label}}"><i class="hwsicon-frame-image-time"></i></span></a><div class="dropdown-menu common-dropdown-menu bottom-left-sqr-rang border-cf-triangle-rang top-drop-down-menu-trace"><div class="trace-container J_TraceContainer" ng-class="{\'trace-open\': trace.open}"><div class="trace-content-wrap"><div class="trace-title"><span ng-bind="i18n.console_term_trace_title"></span></div><div class="trace-content"><div ng-if="!trace.hasTraceInRegion" style="margin-top:100px"><div style="width:80px;height:80px;margin:auto;text-align:center"><img src="//console-static.huaweicloud.com/static/framework/4.4.0/theme/default/images/nonsupport-small.png"></div><p style="color:#333;margin:0 auto;text-align:center" ng-bind="i18n.console_term_nonsupportRegion_label"></p></div><div ng-if="trace.hasTraceInRegion && trace.tracker.length <= 0" style="margin-top:100px"><p style="margin:20px auto;text-align:center;color:#666" ng-bind="i18n.console_term_trace_enable_label"></p><button ng-click="trace.enableClick()" style="margin:0 auto;text-align:center;display:block" ng-bind="i18n.console_term_trace_enable_btn" ti-button></button> <a ng-if="i18n.console_term_trace_log_learn_more_href" style="margin:20px auto;text-align:center;display:block" ng-href="{{i18n.console_term_trace_log_learn_more_href}}" target="_blank" ng-bind="i18n.console_term_trace_product_href_label" meta-data-uba="www_v1_framework.click.{{i18n.console_term_trace_product_href_label}}"></a></div><div ng-if="trace.hasTraceInRegion && trace.tracker.length > 0&& trace.traceList.length === 0" style="margin-top:100px"><div><p class="no-track-list-data no-track-list-data-label"></p></div><div><p ng-bind="i18n.console_term_no_log_data_label" class="no-track-list-data-label"></p></div></div><div ng-if="trace.hasTraceInRegion && trace.tracker && trace.tracker.length > 0"><ul class="trace-ant-timeline"><li class="trace-ant-timeline-item" ng-repeat="traceItem in trace.traceList track by $index"><div class="trace-ant-timeline-item-tail" ng-hide="$index === trace.traceList.length - 1"></div><div class="trace-ant-timeline-item-head" ng-class="{\'trace-ant-timeline-item-head-blue\':$index===0}"></div><div class="trace-ant-timeline-item-content"><p class="trace-item-time"><span ng-bind="traceItem.showTime"></span></p><p class="trace-item-type"><span ng-bind="traceItem.trace_name" title="{{traceItem.trace_name}}"></span></p><p class="trace-item-resource-name"><span ng-bind="traceItem.resource_name" title="{{traceItem.resource_name}}"></span></p></div></li></ul><div><a class="trace-log-look-more-show" ng-if="trace.ctsEndpoint && trace.ctsEndpoint.endpoint && trace.traceList.length >= 10" ng-href="{{trace.ctsEndpoint.endpoint}}" target="_self" ng-bind="i18n.console_term_trace_href_label" meta-data-uba="www_v1_framework.click.{{i18n.console_term_trace_href_label}}"></a></div></div></div></div></div></div></div>'
      );
      $templateCache.put(
        "src/app/framework/views/userInfoTpl.html",
        '<div class="dropdown pull-right menu-dropdown margin-right-14 margin-right-0" ng-if="!localizationConfig.newHECMenu"><a ng-if="isLoginUserFlag" class="console-topbar-btn dropdown-toggle console-topbar-username-text no-animate default-hover-cursor-pointer" data-toggle="dropdown" ng-attr-title="{{username}}"><img class="menu-hwsicon-frame-user-head" ng-src="{{user_head_href.url}}"><div ng-if="isVendorUser" class="console-topbar-fixed-width-username"><div class="console-topbar-fixed-width-vendoruser common-font-size-big2" ng-bind="i18n.console_term_isVendorUser_label"></div><div class="console-topbar-fixed-width-vendoruser" ng-bind="username"></div></div><span ng-if="!isVendorUser" class="console-topbar-fixed-width-username" ng-bind="username"></span> <span class="hwsicon-frame-image-caret menu-hwsicon-frame-user-caret console-topbar-fixed-width-div"></span> </a><a ng-if="isLoginUserFlag" class="console-topbar-btn-click dropdown-toggle console-topbar-username-text no-animate default-hover-cursor-pointer" data-toggle="dropdown"><img class="menu-hwsicon-frame-user-head" ng-src="{{user_head_href.url}}"><div ng-if="isVendorUser" class="console-topbar-fixed-width-username"><div class="console-topbar-fixed-width-vendoruser common-font-size-big2" ng-bind="i18n.console_term_isVendorUser_label"></div><div class="console-topbar-fixed-width-vendoruser" ng-bind="username"></div></div><span ng-if="!isVendorUser" class="console-topbar-fixed-width-username" ng-bind="username"></span> <span class="hwsicon-frame-image-caret-up menu-hwsicon-frame-user-caret console-topbar-fixed-width-div"></span> </a><a ng-if="!isLoginUserFlag" hws-href href class="console-topbar-btn dropdown-toggle console-topbar-username-text no-animate default-hover-cursor-pointer" data-toggle="dropdown" ng-attr-title="{{username}}"><div class="console-topbar-fixed-width-div"><span class="hwsicon-frame-image-user console-topbar-multi-userhead"></span></div><ul class="console-topbar-multi-userinfo"><li class="username"><span ng-bind="shortName"></span></li><li><span ng-bind="company"></span></li></ul><span class="hwsicon-frame-image-caret menu-hwsicon-frame-user-caret console-topbar-fixed-width-div"></span> </a><a ng-if="!isLoginUserFlag" hws-href href class="console-topbar-btn-click dropdown-toggle console-topbar-username-text default-hover-cursor-pointer" data-toggle="dropdown"><div class="console-topbar-fixed-width-div"><span class="hwsicon-frame-image-user console-topbar-multi-userhead"></span></div><ul class="console-topbar-multi-userinfo"><li class="username"><span ng-bind="shortName"></span></li><li><span ng-bind="company"></span></li></ul><span class="hwsicon-frame-image-caret menu-hwsicon-frame-user-caret console-topbar-fixed-width-div"></span></a><ul class="dropdown-menu user-dropdown-menu common-dropdown-menu common-font-size-common"><div class="menu-user-balance hws-show"><div ng-if="showBalance" class="menu-user-balance-label" ng-bind="i18n.console_term_accountBalance_label"></div><div ng-if="showBalance" class="menu-user-balance-content"><div class="menu-user-balance-value"><span class="menu-user-balance-integer" ng-bind="localeService.formatCurrency(accountBalance)"></span></div><button class="menu-user-balance-recharge ti-btn-danger" ng-bind="i18n.console_term_recharge_button" click="recharge()" ti-button></button></div><div class="menu-user-balance-links-wrapper"><ul class="menu-user-balance-links common-link-inherit-color"><li ng-if="links.order_list_user_center"><a hws-href ng-href="{{links.order_list_user_center}}" target="_self" ng-bind="i18n.console_term_myOrder_label"></a></li><li ng-if="links.renewal_userCenter"><a ng-href="{{links.renewal_userCenter}}" target="_self" ng-bind="i18n.console_term_renewal_label"></a></li><li ng-if="links.package_userCenter"><a ng-href="{{links.package_userCenter}}" target="_self" ng-bind="i18n.console_term_package_label"></a></li></ul></div></div><li class="dropdown-menu-li-line hws-show"></li><li class="dropdown-menu-li-height" ng-if="links.homeResource_instance"><a refrence-href refrence="resource" ng-href="{{links.homeResource_instance}}" target="_self"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myResource_label"></span></a></li><li ng-if="isLoginUserFlag && links.user_center_common" class="dropdown-menu-li-height frame-user-center"><a class="user_center_common_open_new_page" hws-href ng-href="{{links.user_center_common}}" target="_blank"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_userCenter_label"></span> </a><a class="user_center_common_open_self_page" hws-href ng-href="{{links.user_center_common}}" target="_self"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_userCenter_label"></span></a></li><li class="dropdown-menu-li-height frame-order-list hws-hide" ng-if="links.order_list_user_center"><a hws-href ng-href="{{links.order_list_user_center}}" target="_blank"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myOrder_label"></span></a></li><li class="dropdown-menu-li-height frame-bill-list" ng-if="links.billing_userCenter"><a hws-href ng-href="{{links.billing_userCenter}}" target="_blank"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_billDetails_label"></span></a></li><li class="dropdown-menu-li-height frame-user-application" ng-if="links.user_application_marketplace"><a hws-href ng-href="{{links.user_application_marketplace}}" target="_self"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myApplication_label"></span></a></li><li class="dropdown-menu-li-height frame-user-credential" ng-if="links.user_credential_iam"><a hws-href ng-href="{{links.user_credential_iam}}" target="_self"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_certificateAuthority_label"></span></a></li><li class="dropdown-menu-li-height frame-seller-center" ng-if="links.sellerCenter_marketplace"><a hws-href ng-href="{{links.sellerCenter_marketplace}}" target="_self"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_sellercenter_label"></span></a></li><li class="dropdown-menu-li-height default-hover-cursor-pointer" ng-if="canAssumeRole && !hasAssumeRoleFlag && !isVendorSubUser"><a ng-click="assumeRoleToIAM()"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_changeRole_label"></span></a></li><li class="dropdown-submenu dropdown-menu-li-height role-list" ng-if="canAssumeRole && hasAssumeRoleFlag && !isVendorSubUser"><a class="role-change" tabindex="-1"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_jump_label"></span></a><ul class="dropdown-menu dropdown-menu-left common-dropdown-menu"><li ng-if="!isLoginUserFlag"><a ng-click="assumeRole(loginUserAccount.id)"><span class="circle-icon circle-icon-special"></span> <span ng-bind="loginUserAccount.name"></span></a></li><li ng-if="isLoginUserFlag" ng-repeat="roleInfo in assumeRoles"><a ng-click="assumeRole(roleInfo.id)"><span class="circle-icon"></span> <span ng-bind="roleInfo.domain_name"></span> <span>/</span> <span ng-bind="roleInfo.name"></span></a></li><li ng-if="isLoginUserFlag"><a ng-click="assumeRoleToIAM()"><span class="circle-icon"></span> <span ng-bind="i18n.console_term_others_label"></span></a></li></ul></li><li class="dropdown-menu-li-line"></li><li class="dropdown-menu-li-height frame-submit-workorder" ng-if="links.submitWorkOrder_userCenter"><a hws-href ng-href="{{links.submitWorkOrder_userCenter}}" target="_blank"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_submitWorkOrder_label"></span></a></li><li class="dropdown-menu-li-height frame-icp-licence" ng-if="!localizationConfig.newHECMenu"><a ng-href="{{links.icpLicence_link}}" target="_blank"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_icpLicence_label"></span></a></li><li class="dropdown-menu-li-height default-hover-cursor-pointer"><a ng-click="logout()"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_back_button"></span></a></li></ul></div><div class="dropdown pull-right menu-dropdown margin-right-14 margin-right-0"><div class="dropdown pull-right menu-dropdown margin-right-14" ng-if="localizationConfig.newHECMenu" ng-mouseenter="isUserOpen = true" drop-down-triangle triangle-name="\'userDropDown\'" ng-mouseleave="isUserOpen = false" dropdown is-open="isUserOpen"><a ng-if="isLoginUserFlag" hws-href ng-href="{{links.spread_user_center_common}}" target="_self" class="console-topbar-btn dropdown-toggle console-topbar-username-text no-animate default-hover-cursor-pointer" ng-class="{\'small-screen-username-min-width\':cfScreenFlag}" ng-attr-title="{{username}}" meta-data-uba="www_v1_framework.click.username"><img class="menu-hwsicon-frame-user-head" style="display:none" ng-src="{{user_head_href.url}}"><div ng-if="isVendorUser" class="console-topbar-fixed-width-username"><div class="console-topbar-fixed-width-vendoruser common-font-size-big2" ng-bind="i18n.console_term_isVendorUser_label"></div><div style="display:none" class="console-topbar-fixed-width-vendoruser" ng-bind="username"></div></div><span ng-if="!isVendorUser" class="console-topbar-fixed-width-username" ng-bind="username"></span> <span style="display:none" class="hwsicon-frame-image-caret menu-hwsicon-frame-user-caret console-topbar-fixed-width-div"></span> </a><a ng-if="!isLoginUserFlag" hws-href ng-href="{{links.user_center_common}}" target="_blank" class="console-topbar-btn dropdown-toggle console-topbar-username-text no-animate default-hover-cursor-pointer" ng-class="{\'small-screen-username-min-width\':cfScreenFlag}" ng-attr-title="{{username}}"><div style="display:none" class="console-topbar-fixed-width-div"><span class="hwsicon-frame-image-user console-topbar-multi-userhead"></span></div><ul class="console-topbar-multi-userinfo"><li class="username"><span ng-bind="shortName"></span></li><li><span ng-bind="company"></span></li></ul><span style="display:none" class="hwsicon-frame-image-caret menu-hwsicon-frame-user-caret console-topbar-fixed-width-div"></span></a><ul class="dropdown-menu user-dropdown-menu common-dropdown-menu common-font-size-common user-center-padding bottom-left-sqr-rang border-cf-triangle-rang top-drop-down-menu-userDropDown"><li id="userCenterItem" ng-if="isLoginUserFlag && links.user_center_common" class="dropdown-menu-li-height frame-user-center"><a hws-href ng-href="{{links.user_center_common}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_userCenter_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_userCenter_label"></span></a></li><li ng-if="localizationConfig.newMenuAdjustAndNewHECMenuSwitch&&links.account_userCenter" class="dropdown-menu-li-height frame-user-center hws-show"><a hws-href ng-href="{{links.account_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_account_userCenter_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_account_userCenter_label"></span></a></li><li id="userAccountManagerAndRrealNameAuthItem" ng-if="localizationConfig.newMenuAdjustSwitch&&links.account_userCenter" class="dropdown-menu-li-height frame-user-center" ng-class="\'user-center-flag-\'+language"><span class="infor-real"><a hws-href ng-href="{{links.account_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_account_userCenter_label}}" class="user-accout-manager-text" ng-init="userAccoutInfo()"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_account_userCenter_label"></span> </a><a ng-if="localizationConfig.realNameAuthSwitch && !realNameAuthOk" hws-href class="user-real-name-auth" ng-href="{{links.realNameAuth_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_no_realName_usercenter_label}}"><span class="icon-cloud-action-state-abnormal noreal-name-authok"></span><span class="user-center-dropdown-text" ng-bind="i18n.console_term_no_realName_usercenter_label"></span> </a><a ng-if="localizationConfig.realNameAuthSwitch && realNameAuthOk " hws-href class="user-real-name-auth-succeed" ng-href="{{links.realNameAuth_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_yes_realName_usercenter_label}}"><span style="color:#3dcca6;font-size:16px" class="icon-cloud-action-state-succeed real-name-authok"></span><span class="user-center-dropdown-text" ng-bind="i18n.console_term_yes_realName_usercenter_label"></span></a><div style="clear:both"></div></span></li><li class="dropdown-menu-li-height" ng-if="localizationConfig.newMenuAdjustAndNewHECMenuSwitch&&localizationConfig.realNameAuthSwitch && !realNameAuthOk"><span style="text-align:left;padding:0 20px!important;line-height:33px!important;font-size:14px;color:#666;white-space:nowrap"><span ng-bind="i18n.console_term_realName_usercenter_label"></span> <a hws-href style="margin-left:20px;text-decoration:none;cursor:pointer" ng-href="{{links.realNameAuth_userCenter}}" target="_self" ng-bind="i18n.console_term_goto_realName_usercenter_label" meta-data-uba="www_v1_framework.click.{{i18n.console_term_goto_realName_usercenter_label}}"></a></span></li><li id="userSafetyInformation" ng-if="localizationConfig.newMenuAdjustSwitch&&links.user_credential_iam" class="dropdown-menu-li-height frame-user-credential"><a hws-href ng-href="{{links.user_credential_iam}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_certificateAuthority_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_certificateAuthority_label"></span></a></li><li id="userIdentityAuth" ng-if="localizationConfig.newMenuAdjustSwitch&&links.identityAuth_userCenter" class="dropdown-menu-li-height frame-user-center"><a hws-href ng-href="{{links.identityAuth_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_identityAuth_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_identityAuth_label"></span></a></li><li id="userCenterItemLine" ng-if="localizationConfig.newMenuAdjustAndNewHECMenuSwitch&&links.account_userCenter" class="dropdown-menu-li-line"></li><li ng-if="localizationConfig.newMenuAdjustAndNewHECMenuSwitch&&links.homeResource_instance" class="dropdown-menu-li-height"><a refrence-href refrence="resource" ng-href="{{links.homeResource_instance}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myResource_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myResource_label"></span></a></li><li ng-if="localizationConfig.newMenuAdjustAndNewHECMenuSwitch&&links.package_userCenter" class="dropdown-menu-li-height frame-user-package hws-show"><a hws-href ng-href="{{links.package_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_package_userCenter_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_package_userCenter_label"></span></a></li><li ng-if="localizationConfig.newMenuAdjustAndNewHECMenuSwitch&&links.user_application_marketplace" class="dropdown-menu-li-height frame-user-application"><a hws-href ng-href="{{links.user_application_marketplace}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myApplication_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myApplication_label"></span></a></li><li ng-if="localizationConfig.newMenuAdjustAndNewHECMenuSwitch&&links.user_credential_iam" class="dropdown-menu-li-height frame-user-credential"><a hws-href ng-href="{{links.user_credential_iam}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_certificateAuthority_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_certificateAuthority_label"></span></a></li><li style="display:none!important" ng-if="links.sellerCenter_marketplace" class="dropdown-menu-li-height frame-seller-center"><a hws-href ng-href="{{links.sellerCenter_marketplace}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_sellercenter_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_sellercenter_label"></span></a></li><li class="dropdown-menu-li-height frame-seller-center" ng-if="links.privilege_userCenter"><a hws-href ng-href="{{links.privilege_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_privilege_usercenter_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_privilege_usercenter_label"></span></a></li><li id="userSellerCenter" ng-if="isvManagementIsOpen&&localizationConfig.newMenuAdjustSwitch&&links.seller_userCenter" class="dropdown-menu-li-height frame-user-credential"><a hws-href ng-href="{{links.seller_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_sellerCenter_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_sellerCenter_label"></span></a></li><li id="userPartnerCenter" ng-if="isvManagementIsOpen&&localizationConfig.newMenuAdjustSwitch&&links.partner_userCenter" class="dropdown-menu-li-height frame-user-credential"><a hws-href ng-href="{{links.partner_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_partnerCenter_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_partnerCenter_label"></span></a></li><li id="userChangeRoleItem" class="dropdown-menu-li-height default-hover-cursor-pointer" ng-if="canAssumeRole && !hasAssumeRoleFlag && !isVendorSubUser"><a ng-click="assumeRoleToIAM()" meta-data-uba="www_v1_framework.click.{{i18n.console_term_changeRole_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_changeRole_label"></span></a></li><li id="userChangeSubRoleItem" class="dropdown-submenu dropdown-menu-li-height role-list" ng-if="canAssumeRole && hasAssumeRoleFlag && !isVendorSubUser"><a class="role-change" tabindex="-1"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_changeRole_label"></span></a><ul class="dropdown-menu dropdown-menu-left common-dropdown-menu"><li ng-if="!isLoginUserFlag"><a ng-click="assumeRole(loginUserAccount.id)" meta-data-uba="www_v1_framework.click.{{loginUserAccount.name}}"><span class="circle-icon circle-icon-special"></span> <span ng-bind="loginUserAccount.name"></span></a></li><li ng-if="isLoginUserFlag" ng-repeat="roleInfo in assumeRoles"><a ng-click="assumeRole(roleInfo.id)" meta-data-uba="www_v1_framework.click.AssumeRoleBtn"><span class="circle-icon"></span> <span style="max-width:560px;text-overflow:ellipsis;display:inline-block;white-space:nowrap;overflow:hidden;line-height:32px;vertical-align:middle" title="{{roleInfo.domain_name + \'/\' + roleInfo.name}}" ng-bind="roleInfo.domain_name + \'/\' + roleInfo.name"></span></a></li><li ng-if="isLoginUserFlag"><a ng-click="assumeRoleToIAM()" meta-data-uba="www_v1_framework.click.{{i18n.console_term_others_label}}"><span class="circle-icon"></span> <span ng-bind="i18n.console_term_others_label"></span></a></li></ul></li><li class="dropdown-menu-li-height frame-submit-workorder" ng-if="links.submitWorkOrder_userCenter"><a hws-href ng-href="{{links.submitWorkOrder_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_submitWorkOrder_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_submitWorkOrder_label"></span></a></li><li style="display:none" class="dropdown-menu-li-height frame-icp-licence" ng-if="links.icpLicence_link"><a locale-href ng-href="{{links.icpLicence_link}}" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_icpLicence_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_icpLicence_label"></span></a></li><li class="dropdown-menu-li-height frame-icp-licence" ng-repeat="row in userMenuAppend  track by $index"><a ng-href="{{row.href}}" target="_blank" meta-data-uba="www_v1_framework.click.{{row.label}}"><span class="user-center-dropdown-text" ng-bind="row.label"></span></a></li><li class="dropdown-menu-li-line"></li><li id="userLogoutItem" class="dropdown-menu-li-height default-hover-cursor-pointer"><a ng-click="logout()" style="text-align:center" meta-data-uba="www_v1_framework.click.{{i18n.console_term_back_button}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_back_button"></span></a></li></ul></div></div><div id="headerLicence" class="dropdown pull-right menu-dropdown distance-button margin-right-0 menu-largeScreen"><div ng-if="localizationConfig.newHECMenu&& links.icpLicence_link" class="dropdown pull-right menu-dropdown margin-right-14"><a locale-href class="console-topbar-btn no-animate console-topbar-btn-isnoicon" ng-href="{{links.icpLicence_link}}" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_icpLicence_label}}"><span class="icp-licence-show-position" ng-bind="i18n.console_term_icpLicence_label"></span></a></div></div><div id="userBussinessManange" class="dropdown pull-right menu-dropdown distance-button margin-right-0 menu-largeScreen"><div ng-if="localizationConfig.newMenuAdjustSwitch&&BusinessManagementIsOpen&&links.enterpriseMgr_userCenter" class="menu-work-order pull-right margin-right-14" ng-mouseenter="isBussinessManangeOpen = true" ng-mouseleave="isBussinessManangeOpen = false" dropdown is-open="isBussinessManangeOpen"><a hws-href ng-href="{{links.enterpriseMgr_userCenter}}" target="_self" class="console-topbar-btn dropdown-toggle console-topbar-username-text no-animate console-topbar-btn-isnoicon" meta-data-uba="www_v1_framework.click.{{i18n.console_term_BusinessManage_label}}"><span ng-bind="i18n.console_term_BusinessManage_label"></span></a></div></div><div id="headerWorkOrder" class="dropdown pull-right menu-dropdown distance-button margin-right-0 menu-largeScreen"><div drop-down-triangle triangle-name="\'headerWorkOrder\'" ng-if="localizationConfig.newHECMenu&&links.workOrder_userCenter" class="dropdown pull-right menu-dropdown margin-right-14" ng-class="{\'work-order-count\': workOrderCount > 0}" ng-mouseenter="isShowWorkOderOpen = true" ng-mouseleave="isShowWorkOderOpen = false" dropdown is-open="isShowWorkOderOpen"><a hws-href class="console-topbar-btn dropdown-toggle console-topbar-username-text no-animate console-topbar-btn-isnoicon" ng-href="{{links.workOrder_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_workOrder_label}}"><i class="" ng-if="workOrderCount > 0"></i> <span class="console-topbar-fixed-width-workorder" ng-bind="i18n.console_term_workOrder_label"></span><div class="menu-workorder-circle" ng-if="workOrderCount > 0"></div></a><work-oder-management></work-oder-management></div></div><div id="myResource" class="dropdown pull-right menu-dropdown distance-button margin-right-0 menu-largeScreen"><div drop-down-triangle triangle-name="\'myResource\'" ng-if="localizationConfig.newMenuAdjustSwitch" class="dropdown pull-right menu-dropdown margin-right-14" ng-mouseenter="isShowMyReourceOpen = true" ng-mouseleave="isShowMyReourceOpen = false" dropdown is-open="isShowMyReourceOpen"><a refrence-href refrence="resource" href ng-href="{{links.homeResource_instance}}" target="_self" class="console-topbar-btn dropdown-toggle console-topbar-username-text no-animate console-topbar-btn-isnoicon" meta-data-uba="www_v1_framework.click.{{i18n.console_term_resource_label}}"><span class="console-topbar-fixed-width-username" ng-bind="i18n.console_term_resource_label"></span></a><ul class="dropdown-menu user-dropdown-menu common-dropdown-menu common-font-size-common user-dropdown-minwidth dropdown-menu-resourse bottom-left-sqr-rang border-cf-triangle-rang top-drop-down-menu-myResource"><li id="myResourceItem" ng-if="links.homeResource_instance" class="dropdown-menu-li-height"><a refrence-href refrence="resource" ng-href="{{links.homeResource_instance}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myResource_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myResource_label"></span></a></li><li id="myPackageItem" ng-if="links.package_userCenter" class="dropdown-menu-li-height frame-user-package"><a hws-href ng-href="{{links.package_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_package_userCenter_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_package_userCenter_label"></span></a></li><li id="myQuota" ng-if="localizationConfig.newHECMenu && my_quota_link&&!localizationConfig.isCMC" class="dropdown-menu-li-height frame-user-application"><a class="quota-icon-font-hec" refrence-href refrence="quota" ng-href="{{my_quota_link}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myQuota_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myQuota_label"></span></a></li><li id="myOpenBetaTests" ng-if="links.myOpenBetaTests_userCenter" class="dropdown-menu-li-height"><a hws-href ng-href="{{links.myOpenBetaTests_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myOpenBetaTests_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myOpenBetaTests_label"></span></a></li><li id="myApplicationItem" ng-if="links.user_application_marketplace" class="dropdown-menu-li-height frame-user-application"><a hws-href ng-href="{{links.user_application_marketplace}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myApplication_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myApplication_label"></span></a></li></ul></div></div><div id="smallScreenOpen" class="dropdown pull-right menu-dropdown distance-button margin-right-0 dropdown-small-screen menu-smallScreen"><div ng-if="localizationConfig.newHECMenu&&links.fees_userCenter" drop-down-triangle triangle-name="\'smallScreenOpen\'" class="dropdown pull-right menu-dropdown margin-right-14" ng-mouseenter="isSmallScreenOpen = true" ng-mouseleave="isSmallScreenOpen = false" dropdown is-open="isSmallScreenOpen"><span class="console-topbar-btn dropdown-toggle console-topbar-username-text no-animate console-topbar-btn-isnoicon smallScreen-dot-color"><span class="console-topbar-fixed-width-username hwsicon-frame-image-header-point"></span><div class="menu-workorder-smallscreen-circle" ng-if="workOrderCount > 0&& !workConfigFlag"></div></span><ul class="dropdown-menu user-dropdown-menu common-dropdown-menu common-font-size-common user-dropdown-minwidth bottom-left-sqr-rang border-cf-triangle-rang top-drop-down-menu-smallScreenOpen" style="padding-top:10px;right:-10px;min-width:150px;width:200px"><li id="headerBillingSmallScreen" class="dropdown-submenu dropdown-menu-li-height role-list" ng-if="localizationConfig.newHECMenu&&links.fees_userCenter" ng-mouseenter="isFeesOpen = isShowFeesLayout()" ng-mouseleave="isFeesOpen = false"><a hws-href class="role-change" ng-href="{{links.fees_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_fees_label}}"><span ng-bind="i18n.console_term_fees_label"></span> <i class="right-icon"></i></a><fee-layout></fee-layout></li><li id="myResourceSmallScreen" class="dropdown-submenu dropdown-menu-li-height role-list" ng-if="localizationConfig.newMenuAdjustSwitch"><a class="role-change" tabindex="-1" refrence-href refrence="resource" href ng-href="{{links.homeResource_instance}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_resource_label}}"><span ng-bind="i18n.console_term_resource_label"></span> <i class="right-icon"></i></a><ul class="dropdown-menu dropdown-menu-rigth common-dropdown-menu-right" style="min-width:150px;width:200px"><li id="myResourceItemSmallScreen" ng-if="links.homeResource_instance" class="dropdown-menu-li-height"><a refrence-href refrence="resource" ng-href="{{links.homeResource_instance}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myResource_label}}"><span ng-bind="i18n.console_term_myResource_label"></span></a></li><li id="myPackageItemSmallScreen" ng-if="links.package_userCenter" class="dropdown-menu-li-height frame-user-package"><a hws-href ng-href="{{links.package_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_package_userCenter_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_package_userCenter_label"></span></a></li><li id="myQuotaSmallScreen" ng-if="localizationConfig.newHECMenu && my_quota_link&&!localizationConfig.isCMC" class="dropdown-menu-li-height frame-user-application"><a class="quota-icon-font-hec" refrence-href refrence="quota" ng-href="{{my_quota_link}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myQuota_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myQuota_label"></span></a></li><li id="myOpenBetaTestsSmallScreen" ng-if="links.myOpenBetaTests_userCenter" class="dropdown-menu-li-height frame-user-application"><a hws-href ng-href="{{links.myOpenBetaTests_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myOpenBetaTests_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myOpenBetaTests_label"></span></a></li><li id="myApplicationItemSmallScreen" ng-if="links.user_application_marketplace" class="dropdown-menu-li-height frame-user-application"><a hws-href ng-href="{{links.user_application_marketplace}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myApplication_label}}"><span ng-bind="i18n.console_term_myApplication_label"></span></a></li></ul></li><li id="headerWorkOrderSmallScreen" ng-if="localizationConfig.newHECMenu&&links.workOrder_userCenter" class="dropdown-submenu dropdown-menu-li-height role-list" ng-class="{\'work-order-count\': workOrderCount > 0}"><a hws-href class="role-change" ng-href="{{links.workOrder_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_workOrder_label}}"><i class="" ng-if="workOrderCount > 0"></i> <span ng-bind="i18n.console_term_workOrder_label"></span><div ng-if="workOrderCount >0" ng-class="{\'menu-workorder-min-thirdpartner\':language===\'zh-cn\',\'menu-workorder-min-circle\':language===\'en-us\'}"></div><i class="right-icon"></i></a><work-oder-management></work-oder-management></li><li id="userBussinessManangeSmallScreen" ng-if="localizationConfig.newMenuAdjustSwitch&&BusinessManagementIsOpen&&links.enterpriseMgr_userCenter" class="menu-work-order dropdown-submenu dropdown-menu-li-height role-list"><a hws-href href ng-href="{{links.enterpriseMgr_userCenter}}" target="_self" class="role-change" meta-data-uba="www_v1_framework.click.{{i18n.console_term_BusinessManage_label}}"><span ng-bind="i18n.console_term_BusinessManage_label"></span></a></li><li id="headerLicenceSmallScreen" ng-if="localizationConfig.newHECMenu&& links.icpLicence_link" class="dropdown-submenu dropdown-menu-li-height role-list"><a locale-href class="role-change" ng-href="{{links.icpLicence_link}}" target="_blank" meta-data-uba="www_v1_framework.click.{{i18n.console_term_icpLicence_label}}"><span class="icp-licence-show-position" ng-bind="i18n.console_term_icpLicence_label"></span></a></li></ul></div></div><div id="headerBilling" class="dropdown pull-right menu-dropdown distance-button margin-right-0 menu-largeScreen"><div drop-down-triangle triangle-name="\'headerBilling\'" ng-if="localizationConfig.newHECMenu&&links.fees_userCenter" class="dropdown pull-right menu-dropdown margin-right-14" ng-mouseenter="isFeesOpen = isShowFeesLayout()" ng-mouseleave="isFeesOpen = false" dropdown is-open="isFeesOpen"><a hws-href ng-href="{{links.fees_userCenter}}" target="_self" class="console-topbar-btn dropdown-toggle console-topbar-username-text no-animate console-topbar-btn-isnoicon" meta-data-uba="www_v1_framework.click.{{i18n.console_term_fees_label}}"><span class="console-topbar-fixed-width-username" ng-bind="i18n.console_term_fees_label"></span></a><fee-layout></fee-layout></div></div><div class="dropdown pull-right menu-dropdown" ng-repeat="row in rightMenuAppend  track by $index"><a class="dropdown-toggle console-topbar-btn console-menu-service-link" ng-href="{{row.href}}" target="_blank" meta-data-uba="www_v1_framework.click.{{row.label}}" title="{{row.label}}"><span class="append-menu-show-position" ng-bind="row.label"></span></a></div><div id="top-search-btn" class="pull-right distance-button" ng-if="localizationConfig.topSerarchBoxSwitch&&!topSerarchBoxBtn&&newTopSearchLink"><span class="top-search-btn-span icon-cloud-action-search" ng-click="showSearchBox($event)"></span></div><div id="close-top-search-btn" class="pull-right distance-button" ng-if="localizationConfig.topSerarchBoxSwitch&&topSerarchBoxBtn&&newTopSearchLink"><span class="top-search-btn-span icon-cloud-action-cross close-top-search-btn-span" ng-click="hideSearchBox()" meta-data-uba="www_v1_framework.click.hideSearchBox"></span></div>'
      );
      $templateCache.put(
        "src/app/framework/views/workOrder.html",
        '<ul class="dropdown-menu" ng-class="{\'dropdown-menu-rigth common-dropdown-menu-right menu-workorder-size \':cfScreenFlag,\n                           \'user-dropdown-menu common-dropdown-menu common-font-size-common user-dropdown-minwidth dropdown-menu-resourse bottom-left-sqr-rang border-cf-triangle-rang top-drop-down-menu-headerWorkOrder\':!cfScreenFlag}"><li id="{{myWorkOrder.number}}" ng-if="links.workOrder_userCenter" class="dropdown-menu-li-height"><a hws-href ng-href="{{links.workOrder_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_myWorkOrder_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_myWorkOrder_label"></span><div ng-if="workOrderCount>0" ng-class="{\'menu-workorder-min-infomation\':cfScreenFlag&&language===\'en-us\',\'menu-workorder-min-infomation-chinese\':cfScreenFlag&&language===\'zh-cn\',\'menu-workorder-large-infomation\':!cfScreenFlag&&language===\'en-us\',\'menu-workorder-large-infomation-chinese\':!cfScreenFlag&&language===\'zh-cn\'}" ng-bind="workOrderCount| maxDigits:2"></div></a></li><li id="{{newWorkOrder.number}}" ng-if="links.createWorkOder_userCenter" class="dropdown-menu-li-height"><a hws-href ng-href="{{links.createWorkOder_userCenter}}" target="_self" meta-data-uba="www_v1_framework.click.{{i18n.console_term_createWorkOrder_label}}"><span class="user-center-dropdown-text" ng-bind="i18n.console_term_createWorkOrder_label"></span></a></li></ul>'
      );
    }
  ]);
  return module;
});
define("frameworkModules.build", function() {});
