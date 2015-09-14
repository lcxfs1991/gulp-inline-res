# gulp-inline-src
====================

> gulp plugin, inline js, css and html files


```
<script src="/lib/powder.js?___inline"></script>
<link rel="stylesheet" href="/css/all.css?___inline">
<tpl src="src/tpl/detail.html?___inline"></tpl>
```
If you want to use html template in js, you do it like the following:
```
var detailTpl = "<tpl src="src/tpl/detail.html?___inline"></tpl>"
```