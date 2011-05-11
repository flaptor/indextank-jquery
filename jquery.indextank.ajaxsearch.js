(function($){
    if(!$.Indextank){
        $.Indextank = new Object();
    };
    
    $.Indextank.AjaxSearch = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("Indextank.AjaxSearch", base);
        
        base.init = function(){
            
            base.options = $.extend({},$.Indextank.AjaxSearch.defaultOptions, options);
            
            
            // make enter submit the form
            /*
            base.$el.keypress(function (e) {
                if (e.which == 13) 
                    $(base.el.form).submit()
            });
            */

            // TODO: make sure ize is an Indextank.Ize element somehow
            var ize = $(base.el.form).data("Indextank.Ize");
            ize.$el.submit(function(e){
                // make sure the form is not submitted
                e.preventDefault();

                base.options.listeners.trigger("Indextank.AjaxSearch.searching");
                base.$el.trigger("Indextank.AjaxSearch.searching");

                // run the query, with ajax
                $.ajax( {
                    url: ize.apiurl + "/v1/indexes/" + ize.indexName + "/search",
                    dataType: "jsonp",
                    data: { q: base.el.value, fetch: base.options.fields, snippet: base.options.snippets },
                    success: function( data ) { base.options.listeners.trigger("Indextank.AjaxSearch.success", data); }
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
        // default fields to fetch .. 
        fields : "name,title,image,url,link",
        // fields to make snippets for
        snippets : "text",
        // no one listening .. sad
        listeners: []
    };
    
    $.fn.indextank_AjaxSearch = function(options){
        return this.each(function(){
            (new $.Indextank.AjaxSearch(this, options));
        });
    };
    
})(jQuery);
