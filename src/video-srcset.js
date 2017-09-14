(function (window, undefined) {

	function videoSourceSet(elements) {

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

	}


	if (typeof window.jQuery !== 'undefined') {
		(function ($) {
			$.fn.videoSrcset = function () {
				videoSourceSet($(this).filter('video[srcset]').map(function () {
					return this;
				}));
			}
		})(window.jQuery);
	}

	if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = videoSourceSet;
	}

	window.videoSourceSet = videoSourceSet;

})(window);