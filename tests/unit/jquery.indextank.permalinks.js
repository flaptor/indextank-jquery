module("Module Permalinks", {
    setup: function() {
        this.apiurl = "http://some.api.indextank.com";
        this.indexName = "someIndexName";
    
        this.r = $( new Object());


        window.location.hash = "";
        $("#myform").indextank_Ize(this.apiurl, this.indexName);
        $("#query").indextank_AjaxSearch({listeners: this.r});

    },
    teardown: function() { 
        $("#myform").removeData("Indextank.Ize");
        $("#query").data("Indextank.AjaxSearch").destroy();
        $("#query").unbind("Indextank.AjaxSearch.success");
        $("#query").unbind("Indextank.AjaxSearch.searching");
        window.location.hash = "";
    }
});

test("listens to AjaxSearch.success and modifies window.location", function() {
    expect(1);
    $("#query").indextank_Permalinks();

    var query = new Query("something");
    $("#query").trigger("Indextank.AjaxSearch.success", [{query:query}]);

    ok( window.location.hash.indexOf("something") > 0 );
});

test("checks window.location.hash and runs a query if needed", function() {
    expect(1);

    $.mockjax({
        url: '*',
        responseText: {results: []}
    });

    this.r.bind("Indextank.AjaxSearch.success", function(event, data) {
        if (data.query.queryString == 'something') ok(true);
    });


    var prefix = "find-";
    window.location.hash = prefix + "something";


    $("#query").indextank_Permalinks({prefix: prefix});


});
