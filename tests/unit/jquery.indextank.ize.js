module("Module Ize", { 
    setup: function() {
        this.apiurl = "http://some.api.indextank.com";
        this.indexName = "someIndexName";
    },
    teardown: function() {
        $("#myform").removeData("Indextank.Ize");
    }
});



test( "check data is stored", function() {

  $("#myform").indextank_Ize(this.apiurl, this.indexName);
  ize = $("#myform").data("Indextank.Ize");
  
  equals( ize.apiurl, this.apiurl );
  equals( ize.indexName, this.indexName );
});



test( "check apiurl is a url", function() {

  raises( function() { 
      $("#myform").indextank_Ize("not_a_url", this.indexName);
  });

  ize = $("#myform").data("Indextank.Ize");
  equals (ize, undefined);
});
