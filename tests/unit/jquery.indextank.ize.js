module("Module Ize", { 
    setup: function() {
        this.apiurl = "http://some.api.provider.tld";
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
  // need a reference to this from inside the closure .. 
  var self = this;
  
  raises( function() { 
      $("#myform").indextank_Ize("not_a_url", self.indexName);
  });

  ize = $("#myform").data("Indextank.Ize");
  equals (ize, undefined);
});

test( "does not allow private URL", function() {
  // need a reference to this from inside the closure .. 
  var self = this;

  raises( function() {
      $("#myform").indextank_Ize("http://secret@some.api.provider.io", self.indexName);
  });
  
  ize = $("#myform").data("Indextank.Ize");
  equals (ize, undefined);
});
