angular.module('angtsTemplates', ['views/nested/many/levels/deep/partial.html', 'views/tasks.html']);

angular.module("views/nested/many/levels/deep/partial.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/nested/many/levels/deep/partial.html",
    "<h3>\n" +
    "	<img src=\"/images/nested/many/levels/deep/606827fe.bullet.png\"/>\n" +
    "	Some deeply nested partial\n" +
    "</h3>\n" +
    "");
}]);

angular.module("views/tasks.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("views/tasks.html",
    "<h1>Daily Tasks</h1>\n" +
    "\n" +
    "<ul>\n" +
    "	<li class=\"task\" ng-repeat=\"task in tasks\">\n" +
    "		{{task.title}}\n" +
    "	</li>\n" +
    "</ul>\n" +
    "\n" +
    "<div ng-include=\"'views/nested/many/levels/deep/partial.html'\"></div>\n" +
    "\n" +
    "<div class=\"img-tests\">\n" +
    "	<img src=\"/images/2831aa82.bullet.png\"/>\n" +
    "	<img src=\"/images/nested/many/levels/deep/606827fe.bullet.png\"/>\n" +
    "	<img src=\"/images/2831aa82.bullet.png\"/>\n" +
    "	<img src=\"/images/nested/many/levels/deep/606827fe.bullet.png\"/>\n" +
    "	<img src=\"/images/2831aa82.bullet.png\"/>\n" +
    "	<img src=\"/images/nested/many/levels/deep/606827fe.bullet.png\"/>\n" +
    "	<img src=\"/images/2831aa82.bullet.png\"/>\n" +
    "</div>\n" +
    "");
}]);
