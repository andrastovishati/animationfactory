class Animation {

	_duration = 2000;
	_delay = 1000;
	_object = {};
	_to = {};
	_easing = Animation.Easings.Linear;
	_begin = () => {};
	_update = (/* object */) => {};
	_complete = () => {};

	_from = {};
	_start = 0;
	_active = false;
	_began = false;

	constructor(options = {}){

		this.set(options);

		this._render = this._render.bind(this);

	}

	_render(timeStamp){

		if (this._start === 0){
			this._start = timeStamp + this._delay;
			this._active = true;
		}

		if (this._start < timeStamp){
			this._began = true;
		}

		let progress, elapsed, value;

		progress = timeStamp - this._start;
		elapsed = progress / this._duration;
		elapsed = (this._duration === 0 || elapsed > 1) ? 1 : elapsed;
		value = this._easing(elapsed);

		if (this._began){
			for (let key in this._to){
				this._object[key] = value * (this._to[key] - this._from[key]) + this._from[key];
			}
		}

		this._update(this._object);

		if (progress < this._duration){
			requestAnimationFrame(this._render);
		} else {
			this._active = false;
			this._began = false;
			this._complete();
		}

	}

	play(){

		if (this._active){
			return;
		}

		this._start = 0;
		this._begin();
		requestAnimationFrame(this._render);

		return this;

	}

	set(options){

		for (let key in options){
			this[`_${key}`] = options[key];
		}

		if (typeof this._easing === 'string'){
			this._easing = Animation.Easings[this._easing];
		}

		for (let key in this._to){
			this._from[key] = this._object[key];
		}

		return this;

	}

	onBegin(callback){

		this._begin = callback;

		return this;

	}

	onUpdate(callback){

		this._update = callback;

		return this;

	}

	onComplete(callback){

		this._complete = callback;

		return this;

	}

	// https://easings.net/
	static Easings = {
		Linear:k => k,
		QuadraticIn:k => k * k,
		QuadraticOut:k => 1 - Math.pow(1 - k, 2),
		QuadraticInOut:k => k < 0.5 ? 2 * k * k : 1 - Math.pow(- 2 * x + 2, 2) / 2,
		CubicIn:k => k * k * k,
		CubicOut:k => 1 - Math.pow(1 - k, 3),
		CubicInOut:k => k < 0.5 ? 4 * Math.pow(k, 3) : 1 - Math.pow(- 2 * k + 2, 3) / 2,
		BounceIn:k => 1 - Animation.Easings.BounceOut(1 - k),
		BounceOut:k => {
			const n1 = 7.5625;
			const d1 = 2.75;
			if (k < 1 / d1){
				return n1 * k * k;
			} else if (k < 2 / d1){
				return n1 * (k -= 1.5 / d1) * k + 0.75;
			} else if (k < 2.5 / d1){
				return n1 * (k -= 2.25 / d1) * k + 0.9375;
			} else {
				return n1 * (k -= 2.625 / d1) * k + 0.984375;
			}
		},
		BounceInOut:k => k < 0.5 ? (1 - Animation.Easings.BounceOut(1 - 2 * k)) / 2 : (1 + Animation.Easings.BounceOut(2 * k - 1)) / 2,
		BackIn:k => 2.70158 * Math.pow(k, 3) - 1.70158 * Math.pow(k, 2),
		BackOut:k => 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2)
	};

}

export default Animation;
