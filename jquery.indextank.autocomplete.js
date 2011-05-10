(function($){
    if(!$.Indextank){
        $.Indextank = new Object();
    };
    
    $.Indextank.autocomplete = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("Indextank.autocomplete", base);
        
        base.init = function(){
            base.options = $.extend({},$.Indextank.autocomplete.defaultOptions, options);
            
            // Put your initialization code here
            var ize = $(base.$el[0].form).data("Indextank.Ize");

            base.$el.autocomplete({
                select: function( event, ui ) {
                            event.target.value = ui.item.value;
                            // wrap form into a jQuery object, so submit honors onsubmit.
                            $(event.target.form).submit();
                        },
                source: function ( request, responseCallback ) {
                            $.ajax( {
                                url: ize.apikey + "/v1/indexes/" + ize.indexName + "/autocomplete",
                                dataType: "jsonp",
                                data: { query: request.term, field: base.options.fieldName },
                                success: function( data ) { responseCallback( data.suggestions ); }
                            } );
                        },
                minLength: base.options.minLength,
                delay: base.options.delay
            });

            // make sure autocomplete closes when IndextankIzed form submits
            ize.$el.submit(function(e){
                base.$el.data("autocomplete").close();
            });
        };
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };
        
        // Run initializer
        base.init();
    };
    
    $.Indextank.autocomplete.defaultOptions = {
        fieldName: "text",
        minLength: 2,
        delay: 100
    };
    
    $.fn.indextank_autocomplete = function(options){
        return this.each(function(){
            (new $.Indextank.autocomplete(this, options));
        });
    };
    
    // This function breaks the chain, but returns
    // the Indextank.autocomplete if it has been attached to the object.
    $.fn.getIndextank_autocomplete = function(){
        this.data("Indextank.autocomplete");
    };
    
})(jQuery);
