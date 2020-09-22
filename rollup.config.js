import buble from 'rollup-plugin-buble';
import babel from 'rollup-plugin-babel';

export default {
	input:'./index.js',
	output:{
		file:'./build/animationfactory.js',
		format:'umd',
		name:'AF'
	},
	plugins:[
		babel({
			plugins:[
				'@babel/plugin-proposal-class-properties'
			]
		}),
		buble({
			transforms:{
				arrow:true,
				classes:true,
				conciseMethodProperty:true,
				defaultParameter:true
			}
		})
	]
};
