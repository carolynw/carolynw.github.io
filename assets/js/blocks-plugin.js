(function (a) {
    a(document).on("add.cards change.cards", function (b) {
        if (a(b.target).hasClass("mbr-slider-ext"))
            a(this).on("slid.bs.carousel", function (b, d) {
                a(b.relatedTarget).closest("section").hasClass("mbr-slider-ext") && (a(b.relatedTarget).parent().find(".carousel-item").not(".prev.right").removeClass("kenberns"),
                a(b.relatedTarget).addClass("kenberns"))
            })
    });
    if (a("html").hasClass("is-builder"))
        a(document).on("add.cards change.cards", function (b) {
            if (a(b.target).hasClass("extTestimonials1") || a(b.target).hasClass("extTestimonials3")) {
                var c = a(b.target).find(".carousel-inner").attr("data-visible")
                  , d = this;
                a(window).on("resize", function () {
                    var c = []
                      , f = a(b.target).find(".carousel-item.active").index();
                    a(b.target).find(".carousel-item .card-block").css("min-height", "auto");
                    a(b.target).find(".carousel-item").addClass("active");
                    a(b.target).find(".carousel-item").each(function () {
                        c.push(a(this).find(".card-block")[0].offsetHeight)
                    });
                    a(b.target).find(".carousel-item").removeClass("active").eq(f).addClass("active");
                    var h = Math.max.apply(null, c);
                    a(d).find(".carousel-item").each(function () {
                        a(this).find(".card-block").css("min-height", h + "px")
                    })
                });
                setTimeout(function () {
                    a(window).trigger("resize")
                }, 100);
                a(this).on("slide.bs.carousel", "section.extTestimonials1", function (b) {
                    a(b.target).hasClass("extTestimonials3") && (a(this).find(".carousel-item.active"),
                    a(this).find(".carousel-item.active .clonedCol").each(function () {
                        var b = a(this).attr("data-cloned-index")
                          , c = a(this).find("div:first");
                        a(this).parents(".carousel-inner").find(".carousel-item").eq(b).find(".col-xs-12:first .card-block p").html(c.find(".card-block p").html())
                    }),
                    a(b.target).find(".clonedCol").remove(),
                    a(b.target).find(".carousel-item").each(function () {
                        for (var b = a(this), d = 1; d < c; d++) {
                            b = b.next();
                            b.length || (b = a(this).siblings(":first"));
                            var e = b.index();
                            b.find(".col-xs-12:first").clone(!0).addClass("cloneditem-" + d).addClass("clonedCol").attr("data-cloned-index", e).appendTo(a(this).children().eq(0))
                        }
                    }));
                    var d = [];
                    a(this).find(".carousel-item").each(function () {
                        a(this).hasClass("active") ? d.push(a(this).find(".card-block")[0].offsetHeight) : (a(this).addClass("active"),
                        d.push(a(this).find(".card-block")[0].offsetHeight),
                        a(this).removeClass("active"))
                    });
                    var h = Math.max.apply(null, d);
                    a(this).find(".carousel-item").each(function () {
                        a(this).hasClass("active") ? a(this).find(".card-block").css("min-height", h + "px") : (a(this).addClass("active"),
                        a(this).find(".card-block").css("min-height", h + "px"),
                        a(this).removeClass("active"))
                    })
                })
            }
        });
    if (!a("html").hasClass("is-builder")) {
        a(document).on("add.cards change.cards", function (b) {
            if (a(b.target).hasClass("extTestimonials1") || a(b.target).hasClass("extTestimonials3")) {
                (0 < window.navigator.userAgent.indexOf("MSIE ") || navigator.userAgent.match(/Trident.*rv\:11\./)) && a(b.target).find(".card-block").each(function () {
                    a(this).css("display", "block")
                });
                if (a(b.target).hasClass("extTestimonials3")) {
                    var c = a(b.target).find(".carousel-inner").attr("data-visible");
                    a(b.target).find(".carousel-inner").attr("class", "carousel-inner slides" + c);
                    a(b.target).find(".clonedCol").remove();
                    a(b.target).find(".carousel-item .col-xs-12").each(function () {
                        a(this).attr("class", "col-xs-12 col-sm-" + 12 / c)
                    });
                    a(b.target).find(".carousel-item").each(function () {
                        for (var b = a(this), e = 1; e < c; e++)
                            b = b.next(),
                            b.length || (b = a(this).siblings(":first")),
                            b.find(".col-xs-12:first").clone().addClass("cloneditem-" + e).appendTo(a(this).children().eq(0))
                    })
                }
                a(window).on("resize", function () {
                    var c = []
                      , e = a(b.target).find(".carousel-item.active").index();
                    a(b.target).find(".carousel-item .card-block").css("min-height", "auto");
                    a(b.target).find(".carousel-item").addClass("active");
                    a(b.target).find(".carousel-item").each(function () {
                        c.push(a(this).find(".card-block")[0].offsetHeight)
                    });
                    a(b.target).find(".carousel-item").removeClass("active").eq(e).addClass("active");
                    var f = Math.max.apply(null, c);
                    a(b.target).find(".carousel-item").each(function () {
                        a(this).find(".card-block").css("min-height", f + "px")
                    })
                });
                setTimeout(function () {
                    a(window).trigger("resize")
                }, 100)
            }
        });
        a(document).ready(function () {
            a(".counters").length && a(".counters").viewportChecker({
                offset: 200,
                callbackFunction: function (b, c) {
                    a("#" + b.attr("id") + " .count").each(function () {
                        a(this).prop("Counter", 0).animate({
                            Counter: a(this).text()
                        }, {
                            duration: 3E3,
                            easing: "swing",
                            step: function (b) {
                                a(this).text(Math.ceil(b))
                            }
                        })
                    })
                }
            })
        });
        a(document).ready(function () {
            if (a(".modalWindow-video iframe").length) {
                var b = a(".modalWindow-video iframe")[0].contentWindow
                  , c = function () {
                      a(".modalWindow").css("display", "table").click(function () {
                          a(".modalWindow").css("display", "none");
                          b.postMessage('{"event":"command","func":"pauseVideo","args":""}', "*")
                      })
                  };
                a(".intro-play-btn").click(function () {
                    c();
                    b.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
                });
                a(".intro-play-btn-figure").click(function (a) {
                    a.preventDefault();
                    c();
                    b.postMessage('{"event":"command","func":"playVideo","args":""}', "*")
                })
            }
        });
        a(".panel-group").find(".panel-heading").each(function (b) {
            a(this).click(function () {
                var b = a(this).children("span");
                a(b).hasClass("pseudoMinus") ? a(b).removeClass("pseudoMinus").addClass("pseudoPlus").parent().css("border", "") : (a(".panel-group").find(".signSpan").each(function () {
                    a(this).removeClass("pseudoMinus").addClass("pseudoPlus").parent().css("border", "")
                }),
                a(b).removeClass("pseudoPlus").addClass("pseudoMinus"),
                a(b).parent().css("border", "1px solid #c39f76"))
            })
        });
        a(document).find(".panel-group").each(function () {
            a(this).find(".signSpan:eq(0)").parent().css("border", "1px solid #c39f76")
        });
        a(".toggle-panel").find(".panel-heading").each(function (b) {
            a(this).click(function () {
                var b = a(this).children("span");
                a(b).hasClass("pseudoMinus") ? a(b).removeClass("pseudoMinus").addClass("pseudoPlus").parent().css("border", "") : a(b).removeClass("pseudoPlus").addClass("pseudoMinus").parent().css("border", "")
            })
        });
        var l = function () {
            var b = a(this)
              , c = []
              , d = function (a) {
                  return new google.maps.LatLng(a[0], a[1])
              }
              , e = a.extend({
                  zoom: 14,
                  type: "ROADMAP",
                  center: null,
                  markerIcon: null,
                  showInfo: !0
              }, eval("(" + (b.data("google-map-params") || "{}") + ")"));
            b.find(".mbr-google-map__marker").each(function () {
                var b = a(this).data("coordinates");
                b && c.push({
                    coord: b.split(/\s*,\s*/),
                    icon: a(this).data("icon") || e.markerIcon,
                    content: a(this).html(),
                    template: a(this).html("{{content}}").removeAttr("data-coordinates data-icon")[0].outerHTML
                })
            }).end().html("").addClass("mbr-google-map--loaded");
            if (c.length) {
                var f = this.Map = new google.maps.Map(this, {
                    scrollwheel: !1,
                    draggable: !a.isMobile(),
                    zoom: e.zoom,
                    mapTypeId: google.maps.MapTypeId[e.type],
                    center: d(e.center || c[0].coord)
                });
                a(window).smartresize(function () {
                    var a = f.getCenter();
                    google.maps.event.trigger(f, "resize");
                    f.setCenter(a)
                });
                f.Geocoder = new google.maps.Geocoder;
                f.Markers = [];
                a.each(c, function (a, b) {
                    var c = new google.maps.Marker({
                        map: f,
                        position: d(b.coord),
                        icon: b.icon,
                        animation: google.maps.Animation.DROP
                    })
                      , g = c.InfoWindow = new google.maps.InfoWindow;
                    g._setContent = g.setContent;
                    g.setContent = function (a) {
                        return this._setContent(a ? b.template.replace("{{content}}", a) : "")
                    }
                    ;
                    g.setContent(b.content);
                    google.maps.event.addListener(c, "click", function () {
                        g.anchor && g.anchor.visible ? g.close() : g.getContent() && g.open(f, c)
                    });
                    b.content && e.showInfo && google.maps.event.addListenerOnce(c, "animation_changed", function () {
                        setTimeout(function () {
                            g.open(f, c)
                        }, 350)
                    });
                    f.Markers.push(c)
                })
            }
        };
        a(document).on("add.cards", function (b) {
            window.google && google.maps && a(b.target).outerFind(".mbr-google-map").each(function () {
                l.call(this)
            })
        })
    }
    0 != a(".countdown").length && initCountdown();
    initCountdown = function () {
        a(".countdown:not(.countdown-inited)").each(function () {
            a(this).addClass("countdown-inited").countdown(a(this).attr("data-end"), function (b) {
                a(this).html(b.strftime('<div class="row"><div class="col-xs-12 col-sm-3"><span class="number-wrap"><span class="number">%D</span><span class="period">Days</span><div class="bottom1"></div><div class="bottom2"></div><span class="dot">:</span></span></div><div class="col-xs-12 col-sm-3"><span class="number-wrap"><span class="number">%H</span><span class="period">Hours</span><div class="bottom1"></div><div class="bottom2"></div><span class="dot">:</span></span></div><div class="col-xs-12 col-sm-3"><span class="number-wrap"><span class="number">%M</span><span class="period">Minutes</span><div class="bottom1"></div><div class="bottom2"></div><span class="dot">:</span></span></div><div class="col-xs-12 col-sm-3"><span class="number-wrap"><span class="number">%S</span><span class="period">Seconds</span><div class="bottom1"></div><div class="bottom2"></div></span></div></div>'))
            })
        });
        a(".countdown:not(.countdown-inited)").each(function () {
            a(this).countdown(a(this).attr("data-end"), function (b) {
                a(this).text(b.strftime("%D days %H:%M:%S"))
            })
        })
    }
    ;
    move = function (b) {
        var c = window.screen.width
          , d = c / 2;
        setInterval(function () {
            --d;
            parseInt(a(b).css("left")) <= -1 * parseInt(a(b).css("width")) && (d = c);
            a(b).css("left", d + "px")
        }, 10)
    }
    ;
    for (var k = 0; 2 > k; k++)
        a(".bgTextP").each(function () {
            a(this).clone().appendTo(a(this).parent())
        });
    a(".bgTextP").css("padding-left", window.screen.width / 2 + "px");
    a(".wrapper-absolute").each(function () {
        move(a(this))
    });
    initTyped = function (b, c, d, e) {
        a(e).typed({
            strings: [b, c, d],
            typeSpeed: parseInt(a(e).attr("typeSpeed")),
            backSpeed: parseInt(a(e).attr("typeSpeed")),
            loop: !0,
            backDelay: 1E3
        })
    }
    ;
    0 != a(".element").length && a(".element").each(function () {
        initTyped(a(this).attr("firstel"), a(this).attr("secondel"), a(this).attr("thirdel"), "." + a(this).attr("adress"))
    })
})(jQuery);
