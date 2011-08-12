module("Module FacetsRenderer", { 
    setup: function() {
    },
    teardown: function() {
        // no need to destroy anything.
        // indextank_FacetsRenderer is called only on transient objects.
    }
});

test( "reacts to queries", function() {
    expect(2);
    var r = $("<div/>").indextank_FacetsRenderer();

    $.each( ["term1", "term2"], function(i, term) {
    
        var q = new Query(term);
        var s = $(new Object()).bind("Indextank.AjaxSearch.runQuery", function(event, query){
            // on each iteration, check that a different query runs
            equals(query.queryString, term);
        });

        // let the facets renderer know a new query was triggered
        r.trigger("Indextank.AjaxSearch.success", {query: q, searcher: s, facets: {cat1:{val1:1}}});

        // simulate a click
        r.find("#indextank-available-facets a").first().click();

    });
});

test( "add category filter to the query", function(){
    expect(1);

    var r = $("<div/>").indextank_FacetsRenderer();
    var q = new Query("bleh");

    var s = $(new Object()).bind("Indextank.AjaxSearch.runQuery", function(event, query){
        // test it changed
        equals("val1", query.categoryFilters.cat1);
    });
        
    // let the facets renderer know a new query was triggered
    r.trigger("Indextank.AjaxSearch.success", {query: q, searcher: s, facets: {cat1:{val1:1}}});
        
    // simulate a click
    r.find("#indextank-available-facets a").first().click();
});


test( "remove category filter to the query", function() {
    expect(1);

    var r = $("<div/>").indextank_FacetsRenderer();
    var q = new Query("bleh");

    var newQuery = null;
    var sdummy = $(new Object()).bind("Indextank.AjaxSearch.runQuery", function(event, query){
        newQuery = query;
    });

    // let the facets renderer know a new query was triggered
    r.trigger("Indextank.AjaxSearch.success", {query: q, searcher: sdummy, facets: {cat1:{val1:1}}});
        
    // add category filter
    r.find("#indextank-available-facets a").first().click();
    
    var s = $(new Object()).bind("Indextank.AjaxSearch.runQuery", function(event, query){
        // test it changed
        equals(null, query.categoryFilters.cat1);
    });

    // let the facets renderer know a new query was triggered
    r.trigger("Indextank.AjaxSearch.success", {query: newQuery, searcher: s, facets: {cat1:{val1:1}}});
        
    // remove category filter
    r.find("#indextank-selected-facets a").first().click();
});

