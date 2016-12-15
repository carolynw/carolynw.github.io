(function ($) {

    $(".btn-show").on("click", function () {
        $(this).hide();
        $(this).parent().find(".carousel-caption").show();
    });

    $(".btn-hide").on("click", function () {
        $(this).parent().parent().find(".btn-show").show();
        $(this).parent().parent().find(".carousel-caption").hide();
    });
$("ul.filter-author>li>a").on("click",function(){
	var clicked = $(this).text();
	$("ul.filter-author>li").removeClass("active");
	$(this).parent().addClass("active");
/*
   
	$("div.mbr-gallery-item").hide();
	$("div[data-tags*='" + clicked + "']").show();
*/


	if (typeof $.fn.masonry !== 'undefined') {
	    $.each($("div.mbr-gallery-item"), function (index, value) {
	        if ($(this).data("tags").indexOf(clicked) < 0) {
	            window.masonry.masonry('remove', $(this))
	        }
	    });
	    
   

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