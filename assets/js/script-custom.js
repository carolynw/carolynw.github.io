
var allItems = [];
(function ($) {

    $(".btn-show").on("click", function () {
        $(this).hide();
        $(this).parent().find(".carousel-caption").show();
    });

    $(".btn-hide").on("click", function () {
        $(this).parent().parent().find(".btn-show").show();
        $(this).parent().parent().find(".carousel-caption").hide();
    });


$("ul.filter-author>li").on("click",function(){
    var clicked = $(this).text();
	$("ul.filter-author>li").removeClass("active");
	$(this).addClass("active");


	if (typeof $.fn.masonry !== 'undefined') {
	    if (allItems.length == 0) {
	        $.each($("div.mbr-gallery-item"), function (index, value) {
	            var newItem = $(this).clone();
	            newItem.css("left", "").css("top", "").css("position", "");
	            allItems.push(newItem);
	        });
	    }
	    //remove all items

	    $.each($("div.mbr-gallery-item"), function (index, value) {
	            window.masonry.masonry('remove', $(this))
	    });
	    window.masonry.masonry("reloadItems");

	    var newItems = [];
        // check if any match so we can show them
	    $.each(allItems, function (index, value) {
	        if ($(this).data && $(this).data("tags") && $(this).data("tags").indexOf(clicked) > 0) {
	            newItems.push($(this));
	        }
	    });

	    if (newItems.length > 0) {
	        window.masonry.append(newItems).masonry('appended', newItems);
	        window.masonry.masonry("reloadItems");
	        // layout Masonry after each image loads
	        window.masonry.imagesLoaded().progress(function () {
	            window.masonry.masonry('layout');
	        });

	    }


	    
   

	   // $('.mbr-gallery').each(function () {
	        // reload masonry (need for adding new or resort items)
	        //window.masonry.masonry('reloadItems');
	        // layout Masonry after each image loads
	       // window.masonry.imagesLoaded().progress(function () {
	            window.masonry.masonry('layout');
	        //});

	        //window.masonry.masonry('layout');
            /*
	        var $msnr = $(this).find('.mbr-gallery-row').masonry({
	            itemSelector: '.mbr-gallery-item',
	            percentPosition: true
	        });
	        // reload masonry (need for adding new or resort items)
	        //$msnr.masonry('reloadItems');
	        // layout Masonry after each image loads
	        //$msnr.imagesLoaded().progress(function () {
	            $msnr.masonry('layout');
	        //});
            */
	   // });
	}
});


 }(jQuery));