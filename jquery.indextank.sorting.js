(function($){
    if(!$.Indextank){
        $.Indextank = new Object();
    };
    
    $.Indextank.Sorting = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("Indextank.Sorting", base);
        
        base.init = function(){
            base.options = $.extend({},$.Indextank.Sorting.defaultOptions, options);

            base.$el.bind("Indextank.AjaxSearch.success", function(event, data){
                // keep a copy of the query, so we can re-run it.
                base.query = data.query;
                // keep a pointer to the event trigger .. HACKY way
                base.searcher = data.searcher;
            });

    
            // render it
            base.$el.append("sort by:");
            $.each(base.options.labels, function(label, fn) {
                var btn = $("<span/>").text(label);
                btn.click(function(event){
                    base.$el.children().removeClass("active");
                    btn.addClass("active");

                    if (base.query) {
                        query = base.query.withScoringFunction(fn);
                        base.searcher.trigger("Indextank.AjaxSearch.runQuery", [query]);
                    };
                });

                base.$el.append(btn);
            });
        };
        
        // Sample Function, Uncomment to use
        // base.functionName = function(paramaters){
        // 
        // };
        
        // Run initializer
        base.init();
    };
    
    $.Indextank.Sorting.defaultOptions = {
        labels: { 'fresh' : 0 }
    };
    
    $.fn.indextank_Sorting = function(options){
        return this.each(function(){
            (new $.Indextank.Sorting(this, options));
        });
    };
    
})(jQuery);
