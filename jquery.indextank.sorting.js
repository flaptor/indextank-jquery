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

            // react to result sets ..  
            base.$el.bind( "Indextank.AjaxSearch.success", base.trackQuery);

            // create the control
            var control = $("<div/>").append("Sort by ");
            $.each( base.options.labels, function (name, fn){
                var btn = $("<span/>").text(name);
                btn.click( function(event){
                    control.children().removeClass("selected");
                    $(this).addClass("selected");
                    if (base.query) {
                        query = base.query.clone().withScoringFunction(fn);
                        // remember to start from scratch
                        query.withStart(0);
                        base.searcher.trigger("Indextank.AjaxSearch.runQuery", [query]);
                    }
                });

                control.append(btn);
            });

            // add separator
            control.children(":not(:first)").prepend(" ", base.options.separator, " ");
            
            // and make it appear
            base.$el.append(control);
        };
       
        // tracks the latest query, so sorting buttons can run it again, changing the scoring function
        base.trackQuery = function(event, data) {
            // keep a copy of the query, so we can re-run it.
            base.query = data.query;
            // keep a pointer to the event trigger .. HACKY way
            base.searcher = data.searcher;
        };
         

        // clean up
        base.destroy = function(){
            base.$el.unbind( "Indextank.AjaxSearch.success", base.trackQuery);
            base.$el.removeData("Indextank.Sorting");
        };
        
        // Run initializer
        base.init();
    };
    
    $.Indextank.Sorting.defaultOptions = {
        // you should REALLY provide it, as the default is useless
        labels: { 'newest' : 0 }, 

        // the separator for possible sorting names. just for formatting
        separator : "|"
    };
    
    $.fn.indextank_Sorting = function(options){
        return this.each(function(){
            (new $.Indextank.Sorting(this, options));
        });
    };
    
})(jQuery);
