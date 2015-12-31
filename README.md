# gulp-inline-res
====================

> gulp plugin, inline js, css and html files

## Documentation

```
<script src="/lib/powder.js?___inline"></script>
<link rel="stylesheet" href="/css/all.css?___inline">
<tpl src="src/tpl/detail.html?___inline"></tpl>
```
If you want to use html template in js, you do it like the following:
```
var detailTpl = "<tpl src="src/tpl/detail.html?___inline"></tpl>"
```

```
var inline = require('gulp-inline-res');
/**
 * dest means the destination folder  
 */
var opt = {
	dest: 'pub'
};

gulp.task('minify-html', function() {

    return gulp.src(['./dist/*.html'])
		        .pipe(inline({dest: 'pub'}))
			    .pipe(gulp.dest('./pub/'));
});
```

## Change Log
* 0.1.1 Baseic Usage
* 0.1.2 Add Destination Folder Option