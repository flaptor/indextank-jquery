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

                var queriedFacets = data.query.categoryFilters || {};
                
                var $selectedFacetsContainer = $("<ul/>").attr("id", "indextank-selected-facets");
                var $availableFacetsContainer = $("<div/>").attr("id", "indextank-available-facets");
                
                $.each( data.facets, function (catName, values){
                    if (catName in queriedFacets) {
                        var $selectedFacet = base.renderSelectedFacet(queriedFacets, catName, data);
                        $selectedFacetsContainer.append($selectedFacet);
                    } else {
                        var $availableFacet = base.renderAvailableFacet(queriedFacets, catName, values, data);
                        $availableFacetsContainer.append($availableFacet);
                    }
                });
                
                var $facetsContent = $("<div/>").append($selectedFacetsContainer, $availableFacetsContainer);
                var $facetsTitle = $("<h3/>").text("Filters");

                base.$el.append($facetsTitle, $facetsContent);

            });
        };
        
        base.renderSelectedFacet = function(queriedFacets, categoryName, data) {
            // Render selected facet as a <li/> and return it
            $item = $("<li/>");
            
            $selectedCategory = $("<span/>").append(
                $("<a/>").attr("href","#")
                    .append($("<span/>").text(categoryName + " - " + queriedFacets[categoryName]))
                    .click(function(){
                        // ensure query data has something on it
                        var query = data.query.clone();
                        // remove the selected category from the query
                        query.withoutCategories([categoryName]);
                        // start over!
                        query.withStart(0);
                        data.searcher.trigger("Indextank.AjaxSearch.runQuery", [query]);
                    })
            );

            $item.append($selectedCategory);

            return $item;
        }

        base.renderAvailableFacet = function(queriedFacets, categoryName, categoryValues, data) {
            // Render available facet as a <dl> (definition list) and return it
            
            $facetContainer = $("<div/>");
            $availableFacet = $("<dl/>");
            $facetContainer.append($availableFacet);
            $availableFacet.append($("<dt/>").text(categoryName));

            // find out if we should collapse facets, or not
            var sorted = [];
            var categoriesCount = 0;
            $.each(categoryValues, function( categoryValue, count) { categoriesCount += 1; sorted.push([categoryValue, count])});
            sorted.sort(function(a,b){return b[1]-a[1];});
            $extraValues = $();

            if (categoriesCount > base.options.showableFacets) {
                $more = $("<div/>").addClass("indextank-more-facets").hide();
                $btn = $("<a/>").attr("href", "#").text("more " + categoryName + " options");

                $extraValues = $("<dl/>");
                $more.append($extraValues);

                $btn.click(function(event) {
                    // need to call parents here, as 'button' messes up objects.
                    $(event.target).parents().children(".indextank-more-facets").toggle();
                } );

                $facetContainer.append($btn);
                $facetContainer.append($more);
            }

            // for this category, render all the controls
            $.each(sorted, function (idx, categoryCount) {
                var categoryValue = categoryCount[0];
                var count = categoryCount[1];
                var dd = $("<dd/>").append(
                    $("<a/>")
                    .attr("href", "#")
                    .text(categoryValue + " (" + count + ")")
                    .click(function(){
                        // ensure query data has something on it
                        var query = data.query.clone();
                        filter = {};
                        filter[categoryName] = categoryValue;
                        query.withCategoryFilters(filter);
                        // start over!
                        query.withStart(0);
                        data.searcher.trigger("Indextank.AjaxSearch.runQuery", [query]);
                    })
                );

                if (idx < base.options.showableFacets) { 
                    $availableFacet.append(dd);
                } else { 
                    $extraValues.append(dd);
                }
            });
            return $facetContainer;
        }

        // Run initializer
        base.init();
    };

    $.Indextank.FacetsRenderer.defaultOptions = {
        showableFacets: 4,
    };
    
    $.fn.indextank_FacetsRenderer = function(options){
        return this.each(function(){
            (new $.Indextank.FacetsRenderer(this, options));
        });
    };
    
})(jQuery);
