(function($) {
$("ul.filter-author>li>a").on("click",function(){
	var clicked = $(this).text();
	$("ul.filter-author>li").removeClass("active");
	$(this).parent().addClass("active");

    // now hide the images and relayout
    //$("div:contains('John')").
    //$("div.mbr-gallery-item").data("Tags")
    //alert($("div[data-tags*='" + clicked + "']").length);
	//alert($("div.mbr-gallery-item").length);
	$("div.mbr-gallery-item").hide();
	$("div[data-tags*='" + clicked + "']").show();
	//$("." + clicked).hide();
	//$("document").trigger("add.cards change.cards");


	if (typeof $.fn.masonry !== 'undefined') {

	    $('.mbr-gallery').each(function () {
	        alert("found gallery");
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
	    });
	}
});


 }(jQuery));