module("Module Sorting", { 
    setup: function() {
    },
    teardown: function() {
        // no need to destroy anything.
        // indextank_Sorting is called only on transient objects.
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

test( "adds 'selected' class to clicked button", function() {
    expect(1);

    var r = $("<div/>").indextank_Sorting({labels: {"relevance": 0, "age": 1 }});
    var q = new Query("bleh").withScoringFunction(3);
    var s = $(new Object());
        

    // make sure button is not selected
    var btn = r.find("span").first();
    btn.removeClass("selected"); 
    
    // simulate a click
    btn.click();

    // check it is selected now
    ok(btn.hasClass("selected"));

});

test( "only one button is 'selected'", function() {
    expect(1);
    
    var r = $("<div/>").indextank_Sorting({labels: {"relevance": 0, "age": 1 }});
    var q = new Query("bleh").withScoringFunction(3);
    var s = $(new Object());
        
    // make sure buttons are not selected
    r.find("span").removeClass("selected");

    // click stuff, several times
    var l = 10 + Math.round( Math.random() * 10); 
    for (var i = 0; i < l; i++) {
        r.find("span").first().click();
        r.find("span").last().click();
    }
    
    equals(1, r.find("span.selected").length);
});
