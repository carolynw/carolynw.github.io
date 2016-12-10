(function($) {
$("ul.filter-author>li>a").on("click",function(){
	var clicked = $(this).text();
	$("ul.filter-author>li").removeClass("active");
	$(this).parent().addClass("active");

	// now hide the images and relayout
	

});


 }(jQuery));