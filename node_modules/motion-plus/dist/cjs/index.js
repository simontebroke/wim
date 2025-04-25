'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var motionPlusDom = require('motion-plus-dom');



Object.keys(motionPlusDom).forEach(function (k) {
	if (k !== 'default' && !Object.prototype.hasOwnProperty.call(exports, k)) Object.defineProperty(exports, k, {
		enumerable: true,
		get: function () { return motionPlusDom[k]; }
	});
});
