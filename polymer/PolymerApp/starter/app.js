
var tabs = document.querySelector('paper-tabs');

/* 以下のコードを追加 */
var list = document.querySelector('post-list');

tabs.addEventListener('core-select', function() {
  list.show = tabs.selected;
});