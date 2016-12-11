(function($) {
    var isBuilder = $('html').hasClass('is-builder');
    if (!isBuilder) {

        /*google iframe*/ 
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        var players = [];
        
        /* get youtube id */
        function getVideoId(url) {
            if ('false' == url) return false;
            var result = /(?:\?v=|\/embed\/|\.be\/)([-a-z0-9_]+)/i.exec(url) || /^([-a-z0-9_]+)$/i.exec(url);
            return result ? result[1] : false;
        }
        /* google iframe api init function */
        window.onYouTubeIframeAPIReady = function() {
            var ytp = ytp || {};
            ytp.YTAPIReady || (ytp.YTAPIReady = !0,
                jQuery(document).trigger("YTAPIReady"));
            $('.video-slide').each(function(i) {
                var index = $(this).index();
                var section = $(this).closest('section');
                $('.video-container').eq(i).append('<div id ="mbr-video-' + i + '" class="mbr-background-video" data-video-num="' + i + '"></div>')
                    .append('<div class="item-overlay"></div>');
                $(this).attr('data-video-num', i);
                var player = new YT.Player('mbr-video-' + i, {
                    height: '100%',
                    width: '100%',
                    videoId: getVideoId($(this).attr('data-video-url')),
                    events: {
                        'onReady': onPlayerReady,
                    }
                })
                players.push(player);
            });
        }

        function onPlayerReady(event) {
            if ($(event.target).closest('.mbr-slider').hasClass('in')) {
                event.target.playVideo();
            }
        }
        /* youtube default preview */ 
        function getPreviewUrl(videoId, quality) {
            return 'http://img.youtube.com/vi/' + videoId + '/' +
                (quality || '') + 'default.jpg';
        }
    }
    var getPreviewUrlWithBestQuality = (function() {
        var cache = {};
        return function(id) {
            var def = $.Deferred();
            if (id in cache) {
                if (cache[id]) {
                    def.resolve(cache[id]);
                } else {
                    def.reject('Preview image not found.');
                }
            } else {
                $('<img>').on('load', function() {
                    if (120 == (this.naturalWidth || this.width)) {
                        // selection of preview in the best quality
                        var file = this.src.split('/').pop();
                        switch (file) {
                            case 'maxresdefault.jpg':
                                this.src = this.src.replace(file, 'sddefault.jpg');
                                break;
                            case 'sddefault.jpg':
                                this.src = this.src.replace(file, 'hqdefault.jpg');
                                break;
                            case 'hqdefault.jpg':
                                this.src = this.src.replace(file, 'default.jpg');
                                break;
                            default:
                                cache[id] = null;
                                def.reject('Preview image not found.');
                                break;
                        }
                    } else {
                        def.resolve(cache[id] = this.src);
                    }
                }).attr('src', getPreviewUrl(id, 'maxres'));
            }
            return def;
        };

    })();
    /* Masonry Grid */
    $(document).on('add.cards change.cards', function (event) {
       // alert("triggered now");
        function setImgSrc(item) {
            var $img = item.find('img');
            var $modalImg = item.closest('section').find('.modal-dialog .carousel-inner .carousel-item').eq($img.closest('.mbr-gallery-item').index()).find('img');
            if (item.hasClass('video-slide')) {
                var videoId = getVideoId(item.attr('data-video-url'));
                getPreviewUrlWithBestQuality(videoId).done(function(url) {
                    $img.attr('src', url).css('visibility', 'visible');
                    $modalImg.attr('src', url);
                });
            }
            return videoId;
        }

        if (!$(event.target).hasClass('mbr-slider-carousel')) return;
        if (!isBuilder){
        
        $(event.target).find('.video-slide').each(function(el) {
            var index = $(this).closest('.mbr-gallery-item').index();
           
            setImgSrc($(this));
        });
        }
        if (typeof $.fn.masonry !== 'undefined') {
            $(event.target).outerFind('.mbr-gallery').each(function() {
                window.masonry = $(this).find('.mbr-gallery-row').masonry({
                    itemSelector: '.mbr-gallery-item',
                    percentPosition: true
                });
                // reload masonry (need for adding new or resort items)
                window.masonry.masonry('reloadItems');
                // layout Masonry after each image loads
                window.masonry.imagesLoaded().progress(function() {
                    window.masonry.masonry('layout');
                });
            });
        }
    });

    var timeout;
    var timeout2;

    function fitLBtimeout() {
        clearTimeout(timeout);
        timeout = setTimeout(fitLightbox, 50);
    }

    /* Lightbox Fit */
    function fitLightbox() {
        var $lightbox = $('.mbr-gallery .modal');
        if (!$lightbox.length) {
            return;
        }

        var windowPadding = 0;
        var bottomPadding = 10;
        var wndW = $(window).width() - windowPadding * 2;
        var wndH = $(window).height() - windowPadding * 2;
        $lightbox.each(function() {
            var setWidth, setTop;
            var isShown = $(this).hasClass('in');
            var $modalDialog = $(this).find('.modal-dialog');
            var $currentImg = $modalDialog.find('.carousel-item.active > img');

            if ($modalDialog.find('.carousel-item.prev > img, .carousel-item.next > img').length) {
                $currentImg = $modalDialog.find('.carousel-item.prev > img, .carousel-item.next > img').eq(0);
            }

            var lbW = $currentImg[0].naturalWidth;
            var lbH = $currentImg[0].naturalHeight;

            // height change
            if (wndW / wndH > lbW / lbH) {
                var needH = wndH - bottomPadding * 2;
                setWidth = needH * lbW / lbH;
            }

            // width change
            else {
                setWidth = wndW - bottomPadding * 2;
            }
            // check for maw width
            setWidth = setWidth >= lbW ? lbW : setWidth;

            // set top to vertical center
            setTop = (wndH - setWidth * lbH / lbW) / 2;

            $modalDialog.css({
                width: parseInt(setWidth),
                top: setTop + windowPadding
            });
        });
    }
  

   /* pause/start video on different events and fit lightbox */
    var $window = $(document).find('.mbr-gallery');
    $window.on('show.bs.modal', function(e) {
      
        clearTimeout(timeout2);
        var timeout2 = setTimeout(function() {
            var index = $(e.relatedTarget).parent().index();
            var slide = $(e.target).find('.carousel-item').eq(index).find('.mbr-background-video');
            $(e.target).find('.carousel-item .mbr-background-video') 
            if (slide.length > 0) {
                players[+slide.attr('data-video-num')].playVideo();
            }
        }, 500);
          fitLBtimeout();
    })
    $window.on('slide.bs.carousel', function(e) {
        var ytv = $(e.target).find('.carousel-item.active .mbr-background-video');
        if (ytv.length > 0) {
            players[+ytv.attr('data-video-num')].pauseVideo();
        }
    });
    $(window).on('resize load', fitLBtimeout);
    $window.on('slid.bs.carousel', function(e) {
        var ytv = $(e.target).find('.carousel-item.active .mbr-background-video');
        if (ytv.length > 0) {
            players[+ytv.attr('data-video-num')].playVideo();
        }
         fitLBtimeout();
    });
    $window.on('hide.bs.modal', function(e) {
        players.map(function(player, i) {
            player.pauseVideo();
        });
    });
}(jQuery));