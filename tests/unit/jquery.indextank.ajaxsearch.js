module("Module AjaxSearch", { 
    setup: function() {
        this.apiurl = "http://some.api.indextank.com";
        this.indexName = "someIndexName";

        $("#myform").indextank_Ize(this.apiurl, this.indexName);

        this.simpleQuery = new Query("something").withQueryReWriter(function(q){return q;});
    },
    teardown: function() {
        $.mockjaxClear();
        $("#myform").removeData("Indextank.Ize");
        $("#query").data("Indextank.AjaxSearch").destroy();
    }
});



test( "notifies listener about Indextank.AjaxSearch.searching", function() {
  expect(1);

  var r = $(new Object()).bind("Indextank.AjaxSearch.searching", function() {ok(true);});

  $("#query").indextank_AjaxSearch({listeners: r});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery );

});

test( "notifies several listeners about Indextank.AjaxSearch.searching", function() {
  expect(2);

  var r = $(new Object()).bind("Indextank.AjaxSearch.searching", function() {ok(true);});
  var s = $(new Object()).bind("Indextank.AjaxSearch.searching", function() {ok(true);});

  $("#query").indextank_AjaxSearch({listeners: [r,s]});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery );

});


// is about the same code as notifies about Indextank.AjaxSearch.searching,
// but runs the query twice.
test( "does not run same query twice", function(){
  expect(1);

  var r = $(new Object()).bind("Indextank.AjaxSearch.searching", function() {ok(true);});

  $("#query").indextank_AjaxSearch({listeners: r});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery);
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery);

});


test( "notifies for different queries", function(){
  expect(2);

  var r = $(new Object()).bind("Indextank.AjaxSearch.searching", function() {ok(true);});

  $("#query").indextank_AjaxSearch({listeners: r});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery);
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery.clone().withQueryString("other string"));

});


test( "notifies several listeners for different queries", function(){
  expect(4);

  var r = $(new Object()).bind("Indextank.AjaxSearch.searching", function() {ok(true);});
  var s = $(new Object()).bind("Indextank.AjaxSearch.searching", function() {ok(true);});

  $("#query").indextank_AjaxSearch({listeners:[r,s]});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery);
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery.clone().withQueryString("other string"));

});




test( "does not complain about empty listener", function(){
  expect(0);

  $("#query").indextank_AjaxSearch();
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery);
});


test( "calls query rewriter", function(){
  expect(1);

  var rw = function(q) { ok(true); return q;};

  $("#query").indextank_AjaxSearch();
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery.withQueryReWriter(rw));

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

  var queryOnScope = this.simpleQuery;

  // verifies that query and results are there
  var l = $(new Object()).bind("Indextank.AjaxSearch.success", 
                              function(event, resultSet){ 
                                deepEqual(resultSet.query.asParameterMap(), queryOnScope.asParameterMap());
                                if (resultSet.results) ok(true);
                              });

  // mock the queries
  $.mockjax({
    url: this.apiurl + "/*",
    // this is what Indextank's API would return
    responseText: {results: [], search_time: 1.2, facets: {}},
    
  });

  $("#query").indextank_AjaxSearch({listeners: l});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery);
    
});



test( "calls several listeners with results", function() {
  expect(4);

  var queryOnScope = this.simpleQuery;

  // verifies that query and results are there
  var l = $(new Object()).bind("Indextank.AjaxSearch.success", 
                              function(event, resultSet){ 
                                deepEqual(resultSet.query.asParameterMap(), queryOnScope.asParameterMap());
                                if (resultSet.results) ok(true);
                              });

  var m = $(new Object()).bind("Indextank.AjaxSearch.success", 
                                function(event, resultSet){ 
                                  deepEqual(resultSet.query.asParameterMap(), queryOnScope.asParameterMap());
                                  if (resultSet.results) ok(true);
                                });

  // mock the queries
  $.mockjax({
    url: this.apiurl + "/*",
    // this is what Indextank's API would return
    responseText: {results: [], search_time: 1.2, facets: {}},
    
  });

  $("#query").indextank_AjaxSearch({listeners: [l,m]});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery);
    
});


test( "honors initial parameters on default query", function(){
    expect(5);

    $("#query").indextank_AjaxSearch({
                                        start: 1, 
                                        rsLength: 2, 
                                        scoringFunction: 3,
                                        fields: "4,5,6",
                                        snippets: "7,8,9"

                                     });
    
    var defaultQuery = $("#query").data("Indextank.AjaxSearch").getDefaultQuery();

    equals(defaultQuery.start, 1);
    equals(defaultQuery.rsLength, 2);
    equals(defaultQuery.scoringFunction, 3);
    equals(defaultQuery.fetchFields, "4,5,6");
    equals(defaultQuery.snippetFields, "7,8,9");

});



test( "passes self as data.searcher for listeners to call back", function() {
  expect(2);

  var queryOnScope = this.simpleQuery;

  // verifies that query and results are there
  var l = $(new Object()).bind("Indextank.AjaxSearch.success", 
                              function(event, resultSet){ 
                                notEqual(null, resultSet.searcher);
                                ok( resultSet.searcher.data("Indextank.AjaxSearch"));
                              });

  // mock the queries
  $.mockjax({
    url: this.apiurl + "/*",
    // this is what Indextank's API would return
    responseText: {results: [], search_time: 1.2, facets: {}},
    
  });

  $("#query").indextank_AjaxSearch({listeners: l});
  $("#query").trigger("Indextank.AjaxSearch.runQuery", this.simpleQuery);
    
});


test( "notifies listener about Indextank.AjaxSearch.noResults", function() {
  expect(1);

  var r = $(new Object()).bind("Indextank.AjaxSearch.noResults", function(el) {ok(true);});
  
  $("#query").indextank_AjaxSearch({listeners: [r]});
  $("#query").trigger("Indextank.AjaxSearch.displayNoResults");

});


test( "notifies several listeners about Indextank.AjaxSearch.noResults", function() {
  expect(2);

  var r = $(new Object()).bind("Indextank.AjaxSearch.noResults", function(el) {ok(true);});
  var s = $(new Object()).bind("Indextank.AjaxSearch.noResults", function(el) {ok(true);});
  
  
  $("#query").indextank_AjaxSearch({listeners: [r,s]});
  $("#query").trigger("Indextank.AjaxSearch.displayNoResults");

});