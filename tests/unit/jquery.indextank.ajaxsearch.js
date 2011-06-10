module("Module AjaxSearch", { 
    setup: function() {
        this.apiurl = "http://some.api.indextank.com";
        this.indexName = "someIndexName";

        $("#myform").indextank_Ize(this.apiurl, this.indexName);
    },
    teardown: function() {
        $.mockjaxClear();
        $("#myform").removeData("Indextank.Ize");
        $("#query").data("Indextank.AjaxSearch").destroy();
    }
});



test( "notifies about Indextank.AjaxSearch.searching", function() {
  expect(1);

  var r = $(new Object()).bind("Indextank.AjaxSearch.searching", function() {ok(true);});

  $("#query").indextank_AjaxSearch({listeners: r});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", "something");

});


// is about the same code as notifies about Indextank.AjaxSearch.searching,
// but runs the query twice.
test( "does not run same query twice", function(){
  expect(1);

  var r = $(new Object()).bind("Indextank.AjaxSearch.searching", function() {ok(true);});

  $("#query").indextank_AjaxSearch({listeners: r});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", "something");
  $("#query").trigger("Indextank.AjaxSearch.runQuery", "something");

});


test( "notifies for different queries", function(){
  expect(2);

  var r = $(new Object()).bind("Indextank.AjaxSearch.searching", function() {ok(true);});

  $("#query").indextank_AjaxSearch({listeners: r});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", "something");
  $("#query").trigger("Indextank.AjaxSearch.runQuery", "other thing");

});

test( "does not complain about empty listener", function(){
  expect(0);

  $("#query").indextank_AjaxSearch();
  $("#query").trigger("Indextank.AjaxSearch.runQuery", "something");
});


test( "calls query rewriter", function(){
  expect(1);

  var rw = function(q) { ok(true); return q;};

  $("#query").indextank_AjaxSearch({rewriteQuery: rw});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", "something");

});


test( "runs a query when form is submitted", function() {
  expect(1);

  // rely on 'searching' event for this.
  var l = $(new Object()).bind("Indextank.AjaxSearch.searching", function(){ ok(true);});

  $("#query").indextank_AjaxSearch({listeners: l});
  $("#myform").submit();
});


test( "calls listeners with results", function() {
  expect(2);

  // verifies that query and results are there
  var l = $(new Object()).bind("Indextank.AjaxSearch.success", 
                              function(event, resultSet){ 
                                if (resultSet.query) ok(true);
                                if (resultSet.results) ok(true);
                              });

  // mock the queries
  $.mockjax({
    url: this.apiurl + "/*",
    response: function(settings) {
        // this is the call to AjaxSearch success callback.
        // it should trigger events on its listeners with it.
        return settings.success({
                                    query: "a query!",
                                    results: []
                                });
        }
  });

  $("#query").indextank_AjaxSearch({listeners: l});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", "something");
    
});
