import Animation from './animation.js';

class TimeLine {

	_timeline = [];
	_current = 0; // timeline index
	_defOptions = {};

	constructor(options = {}){

		const timeline = options.timeline;

		if (timeline){

			delete options.timeline;

			timeline.forEach(t => this.add(t));

		}

		this._defOptions = options;

		this._animation = new Animation(options);

	}

	add(object){

		if (arguments.length < 2){
			this._timeline.push(object);
		} else {
			[].forEach.call(arguments, obj => this._timeline.push(obj));
		}

		return this;

	}

	play(){

		if (this._timeline.length <= this._current){
			return;
		}

		this._animation.set(this._timeline[this._current]).onComplete(() => this.play()).play();

		this._current++;

		return this;

	}

	// timeline factory

	static timelines = {};

	static create(name = '', ...options){

		if (!TimeLine.timelines[name]){
			TimeLine.timelines[name] = [];
		}

		options.forEach(opt => TimeLine.timelines[name].push(new TimeLine(opt)));

	}

	static play(name = ''){

		if (!TimeLine.timelines[name]){
			return;
		}

		TimeLine.timelines[name].forEach(t => t.play());

	}

}

export default TimeLine;
