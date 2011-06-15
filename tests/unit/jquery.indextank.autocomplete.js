module("Module Autocomplete", { 
    setup: function() {
        this.apiurl = "http://some.api.indextank.com";
        this.indexName = "someIndexName";
        this.r = $( new Object() );

        $("#myform").indextank_Ize(this.apiurl, this.indexName);
        $('#query').indextank_Autocomplete().indextank_AjaxSearch({listeners: this.r})
    },
    teardown: function() {
        $.mockjaxClear();
        $("#myform").removeData("Indextank.Ize");
        $("#query").data("Indextank.AjaxSearch").destroy();
        $("#query").autocomplete("destroy");
    }
});

test("receives queries", function() {
    expect(2);

    suggestions = ['newt', 'new', 'never', 'net'],
    $.mockjax({
        url: this.apiurl + '/v1/indexes/' + this.indexName + '/autocomplete',
        responseText: { query:'ne', suggestions: suggestions }
        });
    $('#query').val('')
    $('#query').autocomplete('search');
    menu = $('#query').autocomplete('widget');
    notEqual(menu.find( ".ui-menu-item" ).length, suggestions.length, "no search for below minLength");
        

    $('#query').val('ne');
    $('#query').autocomplete('search');
    menu = $('#query').autocomplete('widget');
    equal(menu.find( ".ui-menu-item" ).length, suggestions.length, "yes search for >= minLength");
});

test("calls data('autocomplete').close() on submit", function() {
    expect(2);
    ac_widget = $('#query').data("autocomplete") ;
    ac_widget.menu.element.show("fast");
    ok(ac_widget.menu.element.is(":visible"), "gets set to visible");
    $('#query').submit();
    ok(ac_widget.menu.element.is(":hidden"), "gets set to hidden");
});

test("notifies about getting suggestions", function() {

    expect(2);

    var suggestions = ["new", "newton"] ;

    var l = function(event, s) {
        equal(suggestions[0], s[0]);
        equal(suggestions[1], s[1]);
    };
    
    $.mockjax({
        url: this.apiurl + '/v1/indexes/' + this.indexName + '/autocomplete',
        responseText: { query:'ne', suggestions: suggestions }
        });

    $("#query").bind("Indextank.Autocomplete.success", l);

    $('#query').val('ne');
    $('#query').autocomplete('search');


    // cleanup
    $("#query").unbind("Indextank.Autocomplete.success", l);
   
});
