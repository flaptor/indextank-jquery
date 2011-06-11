module("Module Renderer", { 
    setup: function() {
    },
    teardown: function() {
    }
});



test( "check it calls format function for each result", function() {
  expect(4);

  var resultSet = {
        query: "a query",
        results: [1, 2, 3, 4]
  };

  var fmt = function(item) {
    ok(true);

    // return a dummy object
    return $("<span/>");
  };

  r = $("<div/>").indextank_Renderer({format: fmt});

  r.trigger("Indextank.AjaxSearch.success", resultSet);
  
});

test( "it changes target CSS when AjaxSearch is searching", function() {
  expect(1);

  t = new Object();
  t.style = {};

  r = $(t).indextank_Renderer();
  r.trigger("Indextank.AjaxSearch.searching");

  // the style should somehow change.
  // opacity at this time.
  // TODO change this test whenever Renderer allows to modify this behavior.
  notDeepEqual(t.style, {});
});

test( "it changes target CSS on AjaxSearch failure", function() {
  expect(1);

  t = new Object();
  t.style = {};

  r = $(t).indextank_Renderer();
  r.trigger("Indextank.AjaxSearch.failure");

  // the style should somehow change.
  // opacity at this time.
  // TODO change this test whenever Renderer allows to modify this behavior.
  notDeepEqual(t.style, {});

});
