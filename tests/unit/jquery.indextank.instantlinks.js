module("Module InstantLinks", { 
    setup: function() {
        this.apiurl = "http://some.api.indextank.com";
        this.indexName = "someIndexName";
        this.r = $( new Object() );
        $("#myform").indextank_Ize(this.apiurl, this.indexName);
        $('#query').indextank_InstantLinks({listeners: this.r});
    },
    teardown: function() {
        $.mockjaxClear();
        $("#myform").removeData("Indextank.Ize");
        $('#query').autocomplete('destroy');
    }
});

test( "receives results", function() {
    results = [{url: 'http://', docid: 'http://', thumbnail: 'http://.jpg', name: 'Mock', description: 'testing'},
        {url: 'http://2', docid: 'http://2', name:'Mock2'}];
    expect(results.len);
    $.mockjax({
        url: this.apiurl + '/v1/indexes/' + this.indexName + '/instantlinks',
        responseText: { matches:results.len, facets: {}, search_time: "", results: results }
    });
    $('#query').data("autocomplete")._renderItem = function(ul, item) { ok(true); return ul;};
    $("#query").val('nx');
    $('#query').autocomplete('search');
});

test( "renders results", function() {
    results = [{url: 'http://', docid: 'http://', thumbnail: 'http://.jpg', name: 'Mock', description: 'testing'},
        {url: 'http://2', docid: 'http://2', name:'Mock2'}];
    expect(results.len);
    $.mockjax({
        url: this.apiurl + '/v1/indexes/' + this.indexName + '/instantlinks',
        responseText: { matches:results.len, facets: {}, search_time: "", results: results }
    });
    
    (function () { var proxied = $('#query').data("Indextank.InstantLinks").options.format;
        $('#query').data("Indextank.InstantLinks").options.format = function () {ok(true); 
            return proxied.apply(this, arguments)};
    })() 
    $("#query").val('ni');
    $('#query').autocomplete('search');
});
