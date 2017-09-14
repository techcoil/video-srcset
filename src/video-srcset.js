(function (window, undefined) {


	function videoSourceSet(options, elements) {

		options = Object.assign({}, {
			resize: false,
			resizeDelay: 50
		}, options);

		// If no specific elements recieved -> take all the video tags in the page
		if (elements === undefined) {
			elements = document.getElementsByTagName('video');
		}

		// Pattern of a src set element
		var regex = /^\s*(.+)\s+(\d+)([wh])?\s*$/;

		/**
		 * @param string def The srcset attribute value
		 * @returns Array<{width:number, src:string}> List of source options - with their max width value
		 */
		function getSourceSets(def) {
			var sources = [];
			var parts = def.split(',');
			for (var i in parts) {
				var result;
				if (result = parts[i].match(regex)) {
					sources.push({
						width: parseInt(result[2]),
						src: result[1],
					});
				}
			}

			return sources;
		}

		/**
		 * @param srcsrt The definition of the srcset attribute
		 * @param screenWidth The width of the container to find matching src for
		 * @returns string The best matching video source
		 */
		function selectSource(srcsrt, screenWidth) {
			var sources = getSourceSets(srcsrt);

			var selectedDiff = null;
			var source = null;

			for (var i in sources) {
				var candidate = sources[i];
				var candidateDiff = candidate.width - screenWidth;

				if (source === null ||  // First One
						(selectedDiff < 0 && candidateDiff >= 0) || // Got smaller - and then larger
						(candidateDiff < 0 && candidateDiff > selectedDiff) ||
						(candidateDiff >= 0 && candidateDiff < selectedDiff ) // Got one that match better
				) {
					selectedDiff = candidateDiff;
					source = candidate.src;
				}
			}

			return source;
		}

		function init(elements) {
			// Select sources for valid elements from the requested ones
			for (var i = 0; i < elements.length; i++) {
				var element = elements[i];
				// If the element isn't a <video> tag with srcset="..." attribute - don't even check it
				if (element.tagName == 'VIDEO' && element.hasAttribute('srcset')) {
					var srcset = element.getAttribute('srcset');

					// check if srcset is not empty
					if(srcset) {
						var selectedSource = selectSource(srcset, window.innerWidth);
						// Don't reapply the same src (to prevent reloading of the same video if run in resize, etc...)
						if(selectedSource !== element.src) {
							element.src = selectedSource;
						}
					}
				}
			}
		}

		init(elements);

		if(options.resize) {
			var resizeDelayTimeout = null;
			window.addEventListener('resize', function() {
				if(resizeDelayTimeout!==null) {
					clearTimeout(resizeDelayTimeout);
				}
				resizeDelayTimeout = setTimeout(function() {
					init(elements);
				}, options.resizeDelay);
			});
		}

	}


	// Polyfill for Object.assign
	// Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill
	if (typeof Object.assign != 'function') {
		// Must be writable: true, enumerable: false, configurable: true
		Object.defineProperty(Object, "assign", {
			value: function assign(target, varArgs) { // .length of function is 2
				'use strict';
				if (target == null) { // TypeError if undefined or null
					throw new TypeError('Cannot convert undefined or null to object');
				}

				var to = Object(target);

				for (var index = 1; index < arguments.length; index++) {
					var nextSource = arguments[index];

					if (nextSource != null) { // Skip over if undefined or null
						for (var nextKey in nextSource) {
							// Avoid bugs when hasOwnProperty is shadowed
							if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
								to[nextKey] = nextSource[nextKey];
							}
						}
					}
				}
				return to;
			},
			writable: true,
			configurable: true
		});
	}


	if (typeof window.jQuery !== 'undefined') {
		(function ($) {
			$.fn.videoSrcset = function (options) {
				return new videoSourceSet(options || {}, $(this).filter('video[srcset]'));
			}
		})(window.jQuery);
	}

	if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = videoSourceSet;
	}

	window.videoSourceSet = videoSourceSet;

})(window);