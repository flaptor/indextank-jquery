(function($){
    if(!$.Indextank){
        $.Indextank = new Object();
    };
    
    $.Indextank.Permalinks = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("Indextank.Permalinks", base);
        
        base.init = function(){
            base.options = $.extend({},$.Indextank.Permalinks.defaultOptions, options);
           
            // make window.location.hash change when queries succeed
            base.$el.bind( "Indextank.AjaxSearch.success", function (event, data ) {
                window.location.hash = base.options.prefix + data.query.queryString;
            });
           


            // trigger an initial query, if the url looks like having a 
            // query encoded
            if (window.location.hash.indexOf(base.options.prefix) == 1) {
                var queryString = window.location.hash.substr(base.options.prefix.length + 1, 100);
                // create the query
                var query = base.$el.data("Indextank.AjaxSearch").getDefaultQuery().clone();
                query.withQueryString(queryString);
                // run it
                base.$el.trigger( "Indextank.AjaxSearch.runQuery", query );
            }

        };
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };
        
        // Run initializer
        base.init();
    };
    
    $.Indextank.Permalinks.defaultOptions = {
        prefix : 'search-'
    };
    
    $.fn.indextank_Permalinks = function(options){
        return this.each(function(){
            (new $.Indextank.Permalinks(this, options));
        });
    };
    
})(jQuery);
