(function($){
   if(!$.Indextank){
        $.Indextank = new Object();
    };
    
    $.Indextank.FacetsRenderer = function(el, options){
        // To avoid scope issues, use 'base' instead of 'this'
        // to reference this class from internal events and functions.
        var base = this;
        
        // Access to jQuery and DOM versions of element
        base.$el = $(el);
        base.el = el;
        
        // Add a reverse reference to the DOM object
        base.$el.data("Indextank.FacetsRenderer", base);
        
        base.init = function(){
            base.options = $.extend({},$.Indextank.FacetsRenderer.defaultOptions, options);


            base.$el.bind( "Indextank.AjaxSearch.success", function (event, data) {
                base.$el.show();
                base.$el.html("");

                var stats = base.options.format(data);
                stats.appendTo(base.$el);
            });
        };
        
        
        // Run initializer
        base.init();
    };
    
    $.Indextank.FacetsRenderer.defaultOptions = {
        format: function (data) {
            
            var queriedFacets = data.query.categoryFilters || {};

            var r = $("<div/>");




            $.each( data.facets, function (catName, values){
                $cat = $("<div/>").addClass("facets-container").addClass("ui-widget-content").text(catName);
                $list = $("<ul/>");
                $cat.append($list);
                r.append($cat);
                    

                // find out if we should collapse facets, or not
                sorted = []
                $extraFacets = $();
                $.each(values, function( ignored, count) { sorted.push(count);});

                if (sorted.length > 4 ) {
                    $more = $("<div/>").addClass("more");
                    $btn = $("<span/>").text("more " + catName + " options").button().data("mymore",$more);

                    $extraFacets = $("<ul/>");
                    $more.append($extraFacets);

                    $btn.click(function(event) {
                        // need to call parents here, as 'button' messes up objects.
                        $(event.target).parents().data("mymore").dialog("open");
                    } );


                    $cat.append($btn);
                    $cat.append($more);
                    sorted = sorted.sort( function(a,b) { return b-a;});
                    
                    $more.dialog({autoOpen:false});
                }
               
                threshold = sorted.length > 4 ? sorted[4] : 0;

                // for this category, render all the controls 
                $.each(values, function (catValue, count) {
                    var li = $("<li/>").text(catValue + " (" + count + ")");
                    if (queriedFacets[catName] == catValue) {
                        li.addClass("ui-selected");
                    } 


                    li.data("Indextank.FacetsRenderer.catValue", catValue);
                    li.data("Indextank.FacetsRenderer.catName", catName);
                    li.data("Indextank.FacetsRenderer.searcher", data.searcher);

                    if (count >= threshold ) { 
                        $list.append(li);
                    } else { 
                        $extraFacets.append(li);
                    }
                });


                $("li", $list).add( $("li", $extraFacets)).selectable( {
                        stop: function(event, ui) {
        
                                // ensure query data has something on it
                                var query = data.query.clone();
                                filter = {};
                                filter[catName] = $(this).data("Indextank.FacetsRenderer.catValue");
                                query.withCategoryFilters(filter);
                                // start over!
                                query.withStart(0);
                                data.searcher.trigger("Indextank.AjaxSearch.runQuery", [query]);

                         }

                    } );
                });
            return r;
        }
    };
    
    $.fn.indextank_FacetsRenderer = function(options){
        return this.each(function(){
            (new $.Indextank.FacetsRenderer(this, options));
        });
    };
    
})(jQuery);
