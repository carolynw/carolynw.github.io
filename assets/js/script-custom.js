
var allItems = [];
(function ($) {

    $(".btn-show").on("click", function () {
        $(this).hide();
        $(this).parent().find(".carousel-caption").show();
    });

    $(".btn-hide").on("click", function () {
        $(this).parent().parent().find(".btn-show").show();
        $(this).parent().parent().parent().find(".carousel-caption").hide();
    });
    $(".btn-alt-hide").on("click", function () {
        $(this).parent().parent().parent().find(".btn-hide").trigger("click");
    });

$("ul.filter-author>li").on("click",function(){
    var clicked = $(this).text();
	$("ul.filter-author>li").removeClass("active");
	$(this).addClass("active");


	if (typeof $.fn.masonry !== 'undefined') {
	    if (allItems.length == 0) {
	        $.each($("div.mbr-gallery-item"), function (index, value) {
	            var newItem = $(this).clone();
	            newItem.attr("style","");
	            allItems.push(newItem);
	        });
	    }
	    //remove all items
	    window.masonry.masonry('destroy');
        /*
	    $.each($("div.mbr-gallery-item"), function (index, value) {
	            window.masonry.masonry('remove', $(this))
	    });
        */


	    var newItems = [];
        // check if any match so we can show them
	    $.each(allItems, function (index, value) {
	        if ($(this).data && $(this).data("tags") && $(this).data("tags").indexOf(clicked) > 0) {
	            $(this).css("left", "").css("top", "").css("position", "");
   	            newItems.push($(this));
	        }
	    });

	    $grid = $('.mbr-gallery-row');
	    $grid.empty();
	    $grid.append(newItems);

	    if (newItems.length > 0) {
	        window.masonry = $grid.masonry({
	            itemSelector: '.mbr-gallery-item',
	            percentPosition: true
	        });
	        // reload masonry (need for adding new or resort items)
	        window.masonry.masonry('reloadItems');
	        // layout Masonry after each image loads
	        window.masonry.imagesLoaded().progress(function () {
	            window.masonry.masonry('layout');
	        });
	    }

	  
	}
});


 }(jQuery));