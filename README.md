## Video Source Set

This library adds support for `srcset` attribute in HTML5's `<video>` element

In order to use the library - load it in your website
`<script src="/video-srcset.js"><script>`

Set the source set on your video tag as:
```html
<video srcset="videos/mobile-video.mp4 768w, videos/tablet-video.mp4 1200w, videos/desktop-video.mp4 1920w"></video>
```

And, init the library with
 
```js
videoSrcset(options); // Run on all <VIDEO> elements in the page

// OR 

videoSrcset(options, document.getElementsByClassName('responsive-video')); // Run only on <VIDEO> tags with class responsive-video
```
 

#### Use with jQuery

The library has no dependencies, but, it defines a jQuery plugin, so, in case you use jQuery in your project you can initialize the library with:

```
$('video.responsive-video').videoSrcset(options);
```

## Options

| Option Name | Type | Default | Description |
| --- | --- | --- | --- |
| `resize` | boolean | `false` | If set to `true` - the library will replace the src of the videos on `resize` event |
| `resizeDelay` | number | `50` (ms) | Number of milliseconds to wait after a resize event before checking for new sources. Ingored if `resize: false` | 

---

A few notes:
* Currently, the library supports only width based responsiveness
* The library doesn't support multiple sources
