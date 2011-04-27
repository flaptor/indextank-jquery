/**
 * Indextank autocomplete.
 * 
 * @param url: your Indextank PUBLIC API url. Required.
 * @param indexName: the name of the index to show autocomplete for. Required.
 * @param fieldName: the name of the field to show autocomplete for. Required.
 * @param options: a hash to override default settings. Optional.
 * 
 * @author Diego Buthay <dbuthay@gmail.com>
 * @version 0.2.2
 */

(function( $ ){

  $.fn.autocompleteWithIndextank = function( url, indexName, fieldName, options ) {  

    var settings = {
      selectCallback: function( event, ui ) {
                        event.target.value = ui.item.value;
                        // wrap form into a jQuery object, so submit honors onsubmit.
                        $(event.target.form).submit();
                      }, // select callback
      sourceCallback: function( request, responseCallback ) {
                        $.ajax( {
                          url: url + "/v1/indexes/" + indexName + "/autocomplete",
                          dataType: "jsonp",
                          data: { query: request.term, field: fieldName },
                          success: function( data ) { responseCallback( data.suggestions ); }
                        } );
                      }, // source callback
      delay: 100,
      minLength: 2
    }

    return this.each(function() {

      var $this = $(this);
      // If options exist, lets merge them
      // with our default settings
      if ( options ) { 
        $.extend( settings, options );
      }

      // when the submit event on the form fires, close the autocomplete
      // this is helpful only when the submit event will load something
      // via ajax .. it makes no sense if the HTML is completely rendered again
      $form = $(this.form);
      $form.submit(function() { $this.data("autocomplete").close();});
      
      $this.autocomplete( {
        source: settings.sourceCallback,
        delay: settings.delay,
        minLength: settings.minLength,
        select: settings.selectCallback
      });

    });

  };
})( jQuery );
