module("Module StatsRenderer", { 
    setup: function() { 
        this.resultSet = {
            matches: 5,
            search_time: 0.001,
            query: "a query",
            results: [1, 2, 3, 4]
        };
        this.okFmt = function(item) {
            ok(true);
            return $("<span/>");
        };
    },
    teardown: function() {
    }
});

test( "format gets called for results", function() {
    expect(1);
    r = $("<div/>").indextank_StatsRenderer({format:this.okFmt});
    r.trigger("Indextank.AjaxSearch.success", this.resultSet);
});
