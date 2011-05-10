(function($){
    if(!$.Indextank){
        $.Indextank = new Object();
    };
    
    $.Indextank.AjaxSearch = function(el, ize, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("Indextank.AjaxSearch", base);
        
        base.init = function(){
            base.ize = ize;
            
            base.options = $.extend({},$.Indextank.AjaxSearch.defaultOptions, options);
            
            // Put your initialization code here
            // TODO: make sure ize is an Indextank.Ize element somehow
            ize.$el.submit(function(e){
                // make sure the form is not submitted
                e.preventDefault();

                // run the query, with ajax
                $.ajax( {
                    url: ize.apiurl + "/v1/indexes/" + ize.indexName + "/search",
                    dataType: "jsonp",
                    data: { query: base.$el.value, field: fieldName },
                    success: function( data ) { $.trigger("Indextank.AjaxSearch.success", data); }
                } );
            });
        };
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };
        
        // Run initializer
        base.init();
    };
    
    $.Indextank.AjaxSearch.defaultOptions = {
    };
    
    $.fn.indextank_AjaxSearch = function(ize, options){
        return this.each(function(){
            (new $.Indextank.AjaxSearch(this, ize, options));
        });
    };
    
})(jQuery);
