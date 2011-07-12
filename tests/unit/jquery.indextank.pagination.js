module("Module Pagination", { 
    setup: function() {
    },
    teardown: function() {
    }
});

test( "maxPages is honored, when there are more pages", function() {
  expect(7);
  var max_pages = 7;
  var fmt = function(page, selected) {
    ok(true);
    return $("<li/>");
  }

  var q = new Query("ignore").withStart(0).withLength(10);

  r = $("<div/>").indextank_Pagination({maxPages: max_pages, formatPage: fmt});
  r.trigger("Indextank.AjaxSearch.success", {matches: 12345, query: q } );
});

test( "selects correct page", function() {
  expect(1);

  // select page 3
  var q = new Query("ignore").withStart(20).withLength(10);
  var fmt = function(page, selected) {
    if (selected) {
        equal(page, 3);
    }
    return $("<li/>");
  }

  r = $("<div/>").indextank_Pagination({formatPage: fmt});
  r.trigger("Indextank.AjaxSearch.success", {matches: 12345, query: q } );
});

test( "honors last page", function() {
  expect(1);

  var max_page = 10;
  // select page 19
  var q = new Query("ignore").withStart(180).withLength(10);
  var fmt = function(page, selected) {
    if (page == 19) {
        ok(selected);
    }

    // make sure 19 is the last page
    if (page > 19) fail();
    
    return $("<li/>");
  }
  

  r = $("<div/>").indextank_Pagination({maxPages: max_page, formatPage: fmt});
  r.trigger("Indextank.AjaxSearch.success", {matches: 185, query: q } );

});


test( "goes backwards", function() {
  expect(2);
  var q = new Query("ignore").withStart(20).withLength(10);
  var fmt = function(page, selected) {
    if (page < 3 ) {
        ok(true);
    }
    return $("<li/>");
  } 

  r = $("<div/>").indextank_Pagination({formatPage: fmt});
  r.trigger("Indextank.AjaxSearch.success", {matches: 185, query: q } );
});

