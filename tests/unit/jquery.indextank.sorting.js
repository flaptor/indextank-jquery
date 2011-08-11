module("Module Sorting", { 
    setup: function() { 
    },
    teardown: function() {
    }
});

test( "reacts to queries", function() {
    expect(2);
    var r = $("<div/>").indextank_Sorting({labels: {"relevance": 0, "age": 1 }});

    $.each( ["term1", "term2"], function(i, term) {
    
        var q = new Query(term);
        var s = $(new Object()).bind("Indextank.AjaxSearch.runQuery", function(event, query){
            // on each iteration, check that a different query runs
            equals(term, query.queryString);
        });

        // let the sorting know a new query was triggered
        r.trigger("Indextank.AjaxSearch.success", {query: q, searcher: s});

        // simulate a click
        r.find("span").first().click();

    });
});

test( "changes scoring function value", function(){
    expect(1);

    var r = $("<div/>").indextank_Sorting({labels: {"relevance": 0, "age": 1 }});
    // make 3 the default number .. so 0 looks like a change
    var q = new Query("bleh").withScoringFunction(3);

    var s = $(new Object()).bind("Indextank.AjaxSearch.runQuery", function(event, query){
        // test it changed
        equals(0, query.scoringFunction);
    });
        
    // let the sorting know a new query was triggered
    r.trigger("Indextank.AjaxSearch.success", {query: q, searcher: s});
        
        
    // simulate a click
    r.find("span").first().click();
});
