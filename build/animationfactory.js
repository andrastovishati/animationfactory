(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.AF = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var Animation = function Animation(options) {
    if ( options === void 0 ) options = {};

    _defineProperty(this, "_duration", 2000);

    _defineProperty(this, "_delay", 1000);

    _defineProperty(this, "_object", {});

    _defineProperty(this, "_to", {});

    _defineProperty(this, "_easing", Animation.Easings.Linear);

    _defineProperty(this, "_begin", function () {});

    _defineProperty(this, "_update", function () {});

    _defineProperty(this, "_complete", function () {});

    _defineProperty(this, "_from", {});

    _defineProperty(this, "_start", 0);

    _defineProperty(this, "_active", false);

    _defineProperty(this, "_began", false);

    this.set(options);
    this._render = this._render.bind(this);
  };

  Animation.prototype._render = function _render (timeStamp) {
    if (this._start === 0) {
      this._start = timeStamp + this._delay;
      this._active = true;
    }

    if (this._start < timeStamp) {
      this._began = true;
    }

    var progress, elapsed, value;
    progress = timeStamp - this._start;
    elapsed = progress / this._duration;
    elapsed = this._duration === 0 || elapsed > 1 ? 1 : elapsed;
    value = this._easing(elapsed);

    if (this._began) {
      for (var key in this._to) {
        this._object[key] = value * (this._to[key] - this._from[key]) + this._from[key];
      }
    }

    this._update(this._object);

    if (progress < this._duration) {
      requestAnimationFrame(this._render);
    } else {
      this._active = false;
      this._began = false;

      this._complete();
    }
  };

  Animation.prototype.play = function play () {
    if (this._active) {
      return;
    }

    this._start = 0;

    this._begin();

    requestAnimationFrame(this._render);
    return this;
  };

  Animation.prototype.set = function set (options) {
    for (var key in options) {
      this[("_" + key)] = options[key];
    }

    if (typeof this._easing === 'string') {
      this._easing = Animation.Easings[this._easing];
    }

    for (var key$1 in this._to) {
      this._from[key$1] = this._object[key$1];
    }

    return this;
  };

  Animation.prototype.onBegin = function onBegin (callback) {
    this._begin = callback;
    return this;
  };

  Animation.prototype.onUpdate = function onUpdate (callback) {
    this._update = callback;
    return this;
  };

  Animation.prototype.onComplete = function onComplete (callback) {
    this._complete = callback;
    return this;
  };

  _defineProperty(Animation, "Easings", {
    Linear: function (k) { return k; },
    QuadraticIn: function (k) { return k * k; },
    QuadraticOut: function (k) { return 1 - Math.pow(1 - k, 2); },
    QuadraticInOut: function (k) { return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * x + 2, 2) / 2; },
    CubicIn: function (k) { return k * k * k; },
    CubicOut: function (k) { return 1 - Math.pow(1 - k, 3); },
    CubicInOut: function (k) { return k < 0.5 ? 4 * Math.pow(k, 3) : 1 - Math.pow(-2 * k + 2, 3) / 2; },
    BounceIn: function (k) { return 1 - Animation.Easings.BounceOut(1 - k); },
    BounceOut: function (k) {
      var n1 = 7.5625;
      var d1 = 2.75;

      if (k < 1 / d1) {
        return n1 * k * k;
      } else if (k < 2 / d1) {
        return n1 * (k -= 1.5 / d1) * k + 0.75;
      } else if (k < 2.5 / d1) {
        return n1 * (k -= 2.25 / d1) * k + 0.9375;
      } else {
        return n1 * (k -= 2.625 / d1) * k + 0.984375;
      }
    },
    BounceInOut: function (k) { return k < 0.5 ? (1 - Animation.Easings.BounceOut(1 - 2 * k)) / 2 : (1 + Animation.Easings.BounceOut(2 * k - 1)) / 2; },
    BackIn: function (k) { return 2.70158 * Math.pow(k, 3) - 1.70158 * Math.pow(k, 2); },
    BackOut: function (k) { return 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2); }
  });

  var TimeLine = function TimeLine(options) {
    var this$1 = this;
    if ( options === void 0 ) options = {};

    _defineProperty(this, "_timeline", []);

    _defineProperty(this, "_current", 0);

    _defineProperty(this, "_defOptions", {});

    var timeline = options.timeline;

    if (timeline) {
      delete options.timeline;
      timeline.forEach(function (t) { return this$1.add(t); });
    }

    this._defOptions = options;
    this._animation = new Animation(options);
  };

  TimeLine.prototype.add = function add (object) {
      var this$1 = this;

    if (arguments.length < 2) {
      this._timeline.push(object);
    } else {
      [].forEach.call(arguments, function (obj) { return this$1._timeline.push(obj); });
    }

    return this;
  };

  TimeLine.prototype.play = function play () {
      var this$1 = this;

    if (this._timeline.length <= this._current) {
      return;
    }

    this._animation.set(this._timeline[this._current]).onComplete(function () { return this$1.play(); }).play();

    this._current++;
    return this;
  }; // timeline factory


  TimeLine.create = function create (name) {
      if ( name === void 0 ) name = '';
      var options = [], len = arguments.length - 1;
      while ( len-- > 0 ) options[ len ] = arguments[ len + 1 ];

    if (!TimeLine.timelines[name]) {
      TimeLine.timelines[name] = [];
    }

    options.forEach(function (opt) { return TimeLine.timelines[name].push(new TimeLine(opt)); });
  };

  TimeLine.play = function play (name) {
      if ( name === void 0 ) name = '';

    if (!TimeLine.timelines[name]) {
      return;
    }

    TimeLine.timelines[name].forEach(function (t) { return t.play(); });
  };

  _defineProperty(TimeLine, "timelines", {});

  return TimeLine;

})));
