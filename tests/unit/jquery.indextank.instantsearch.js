module("Module InstantSearch", {
    setup: function() {
        this.apiurl = "http://some.api.indextank.com";
        this.indexName = "someIndexName";
        this.r = $( new Object()).bind("Indextank.Autocomplete.success", function(){alert(ok(true))} );
        $("#myform").indextank_Ize(this.apiurl, this.indexName);
        $("#query").indextank_Autocomplete().indextank_AjaxSearch({listeners: this.r});

    },
    teardown: function() { 
        $("#myform").removeData("Indextank.Ize");
        $("#query").data("Indextank.AjaxSearch").destroy();
    }
});

test("listens to Autocomplete.success and triggers AjaxSearch.runQuery", function() {
    expect(1);
    $.mockjax({
        url: '*',
        responseText: {query:'ja', suggestions: ["java", "javascript"]}
    });
    $("#query").indextank_InstantSearch();
    $("#query").bind("Indextank.AjaxSearch.searching", function(){ok(true)});
    $("#query").val( "ja" );
    $("#query").autocomplete("search");
});
