/*jslint browser: true*/
/*jslint jquery: true*/

(function (window) {
  "use strict";

  var sageApp = window.sageApp = (window.sageApp ? window.sageApp : {});
  var $ = window.jQuery;

  sageApp.init = function(){
    sageApp.modules.activateAll();
  };

  sageApp.modules = (function () {
    var registeredModules = {};
    var activeModules = {};

    function register(name, bootStrapper) {
      name = $.trim(name);

      if (registeredModules[name] !== void 0)
        throw "Module with name '" + name + "' already registered";

      registeredModules[name] = bootStrapper;
    }

    function unRegister(name){
      delete registeredModules[name];
    }

    function activateAll() {
      $.each(registeredModules, function (name, module) {
        var bootstrapped = module($);

        if (typeof bootstrapped.init === "function")
          bootstrapped.init();

        activeModules[name] = bootstrapped;
      });
    }

    return {
      register: register,
      unRegister : unRegister,
      registered : registeredModules,
      activateAll: activateAll,
      active: activeModules
    }
  }());

  sageApp.logger = (function () {
    function logInfo(message) {
      console.log(message);
      // todo: remote logging
    }

    function logWarn(message) {
      console.warn(message);
      // todo: remote logging
    }

    function logError(message) {
      console.error(message);
      // todo: remote logging
    }

    return {
      logInfo: logInfo,
      logWarn: logWarn,
      logError: logError
    }
  }());

  $(function () {
    //todo: this is temporary hack to get around the 'angular include' issue in the frontend project
    setTimeout(function(){
      sageApp.init();
    }, 250);
  });
}(window));
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("accounting", function ($) {
  "use strict";

  function init() {
    if (!$("#phone_fan").length)
      return;

    var controller = new ScrollMagic.Controller();
    var scene = new ScrollMagic.Scene({
      triggerElement: '#phone_fan_trigger'//, // starting scene, when reaching this element
    }).setClassToggle("#phone_fan, .accounting-module", "open");

    // Add Scene to ScrollMagic Controller
    controller.addScene(scene);
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("articles", function ($) {
  "use strict";

  var resizeTimer;

  function init() {
    initEvents();
    initSlick();
  }

  function initEvents() {
    $(window).on("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        initSlick();
      }, 250);
    });
  }

  function initSlick() {
    $('.article-list').slick({
      dots: true,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      arrows: false,
      variableWdith: false,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            focusOnSelect: false,
            arrows: false,
            centerMode: false,
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 1,
            dots: true
          }
        },
        {
          breakpoint: 375,
          settings: {
            focusOnSelect: false,
            centerMode: false,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1,
            centerPadding: '40px',
            dots: true,
            arrows: false
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("base", function ($) {
  "use strict";

  var $docScope = $("body");

  function init() {
    initToggleClassEvents();
    initDataHrefEvents();
  }

  // initalise any item in the dom with the
  // ('data-toggleCssClass' required list of classes to update, space separated) attribute
  // ('data-toggleCssTarget' required list of target ids to update, jquery selector)
  function initToggleClassEvents() {
    var toggleCssTrigger = "data-toggleCssClass",
      toggleCssTarget = "data-toggleCssTarget";

    $docScope.on("click", "[" + toggleCssTrigger + "]", function (e) {
      e.preventDefault();
      var theSourceItem = $(this),
        rawClasses = theSourceItem.attr(toggleCssTrigger),
        rawIDs = theSourceItem.attr(toggleCssTarget);

      //return if either is empty
      if (rawClasses === "" || rawIDs === "") return;

      //use jquery to toggle classes.
      $(rawIDs).toggleClass(rawClasses);
    });
    $docScope.on("click", "[data-toggle='collapse'][data-sage-parent]", function (e) {
      var id = $(e.currentTarget).attr("data-sage-parent");
      $docScope.find(id).collapse('toggle');
    });
  }

  // initalise any item in the dom with the
  // ('data-href' optional 'data-href-target' (_blank, _self, _parent, _top)used to allow any element to be a link) attribute
  function initDataHrefEvents() {
    $docScope.on("click", "[data-href]", function (e) {
      e.preventDefault();
      var itemHasHref = $(e.target).attr("href") !== undefined,
        itemHref = "",
        itemTarget = "_self";

      //test if clicked item has an href attribute if not use data-href-target
      if (itemHasHref) {
        // set item href to href of target if not blank
        if ($(e.target).attr("href") !== "") {
          itemHref = $(e.target).attr("href");
        }
        // if there is a href target and its not blank set itemTarget
        if ($(e.target).attr("target") !== undefined && $(e.target).attr("target") !== "") {
          itemTarget = $(e.target).attr("target");
        }
      } else {
        // if there is a data-href and it is not blank set itemHref to that value
        if ($(this).attr("data-href") !== undefined && $(this).attr("data-href") !== "") {
          itemHref = $(this).attr("data-href");
        }
        // if there is a data-href-target and its not blank set itemTarget
        if ($(this).attr("data-href-target") !== undefined && $(this).attr("data-href-target") !== "") {
          itemTarget = $(this).attr("data-href-target");
        }
      }

      // Test the target and load the url into the correct container if the item has a non blank href
      if (itemHref !== "") {
        switch (itemTarget) {
          case "_self":
            window.location.href = itemHref;
            break;
          case "_blank":
            window.open(itemHref, "_blank", "location=yes,scrollbars=yes,status=yes");
            break;
          case "_parent":
            window.open(itemHref, "_parent", "location=yes,scrollbars=yes,status=yes");
            break;
          case "_top":
            window.open(itemHref, "_top", "location=yes,scrollbars=yes,status=yes");
            break;
          default:
            window.location.href = itemHref;
        }
      }
    });
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("customerStories", function ($) {
  "use strict";

  function init() {
    if (!$(".button-white.play").length)
      return;

    var $carousel = $("#customer_story_tab_carousel");

    $carousel.find(".item").each(function () {
      var id = "#" + $(this).attr("id");
      $(this).find(".button-white.play").each(function () {
        $(this).click(function () {
          $(this).closest(".carousel").carousel('pause');
          var videoId = $(id + " .video-container").data("videoid");
          var iframe = '<iframe class="" ' + 'width="100%" height="420" src="https://www.youtube.com/embed/' + videoId + '?rel=0&autoplay=1&enablejsapi=1" frameborder="0" allowfullscreen></iframe>';
          var iframeExist = $(id + " .video-container").find("iframe").length;

          if (!iframeExist) {
            $(id + " .video-container").append(iframe);
          } else {
            $(id + ' iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'playVideo' + '","args":""}', '*');
          }

          $(id + ' .hide-on-play').addClass('hidden');
          $(id + ' .show-on-play').removeClass('hidden');
          $('ol.carousel-indicators').addClass('hidden');
          $(id + ' .proper-focus').removeClass('proper-focus').addClass('blurred');

        });
      });
      $(this).find(".button-white-back.back-to").each(function () {
        $(this).click(function () {
          $(this).closest(".carousel").carousel('cycle');
          $(id + ' .hide-on-play').removeClass('hidden');
          $(id + ' .show-on-play').addClass('hidden');
          $('ol.carousel-indicators').removeClass('hidden');
          $(id + ' .blurred').removeClass('blurred').addClass('proper-focus');
          $(id + ' iframe')[0].contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
        });
      });
    });

    $carousel.carousel({interval: 10000});
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("form", function ($) {
  "use strict";

  function init() {
    if (!$(".request-form").length)
      return;

    var allNonRadioInputs = $(".request-form .form-group input:not([type=radio])");
    var dropdowns = $(".request-form .form-group select");
    allNonRadioInputs.each(function () {
      $(this).focusout(function () {
        var val = $(this).val();
        if (val) {
          $(this).addClass("filled");
        } else {
          $(this).removeClass("filled");
        }
      });
    });
    dropdowns.each(function () {
      $(this).focusout(function () {
        var val = $(this).val();
        if (val) {
          $(this).addClass("filled");
        } else {
          $(this).removeClass("filled");
        }
      });
    });
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("pricing", function ($) {
  "use strict";

  function init() {
    if (!$(".range-number").length)
      return;

    initClicks();
    initSlick();
  }

  function initClicks() {
    $(document).on("input change", ".range-number", function () {
      var output = $(this).prev('output'),
        theValue = $(this).val();
      $(this).attr("value", theValue);
      if (theValue <= 500) {
        output.html("Number of licences: " + theValue);
      } else {
        output.html("Number of licences: 500+");
      }
    });
  }

  function initSlick() {
    $("#sage_pricing_options").slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      focusOnSelect: false,
      arrows: false,
      initialSlide: 0,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            focusOnSelect: true,
            centerMode: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("productFeature", function ($) {
  "use strict";

  var productDevice = {},
    modScopeId = ".product-example";

  function init() {
    $(document).on("click", ".tab-control-id .device-nav > div", function (e) {
      e.preventDefault();
      deviceClick(e.currentTarget);
    });

    $(window).on("resize", resizeBehaviour);

    if (!$(modScopeId).length)
      return;

    $(".tab-control-id .tab-pane").each(function () {
      $(this).find(".device-nav div:first").addClass("active");

      $(this).find(".product-example").each(function () {
        var currentWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        showCorrectScreenshot(currentWidth, this);
      });
    });
  }

  function showCorrectScreenshot(currentWidth, target) {
    var phoneScreenshot = $(target).find(".phone-img").length >= 1;
    var tabletScreenshot = $(target).find(".tablet-img").length >= 1;
    var laptopScreenshot = $(target).find(".laptop-img").length >= 1;

    if (currentWidth <= 767) {
      $(target).find("img").removeClass("visible-important");
      if (phoneScreenshot) {
        $(target).find(".phone-img").addClass("visible-important");
      } else if (tabletScreenshot) {
        $(target).find(".tablet-img").addClass("visible-important");
      } else if (laptopScreenshot) {
        $(target).find(".laptop-img").addClass("visible-important");
      }
    } else if (currentWidth > 767 && currentWidth <= 992) {
      $(target).find("img").removeClass("visible-important");
      if (tabletScreenshot) {
        $(target).find(".tablet-img").addClass("visible-important");
      } else if (phoneScreenshot) {
        $(target).find(".phone-img").addClass("visible-important");
      } else if (laptopScreenshot) {
        $(target).find(".laptop-img").addClass("visible-important");
      }
    } else if (currentWidth >= 992) {
      $(target).find("img").removeClass("visible-important");
      if (laptopScreenshot) {
        $(target).find(".laptop-img").addClass("visible-important");
      } else if (tabletScreenshot) {
        $(target).find(".tablet-img").addClass("visible-important");
      } else if (phoneScreenshot) {
        $(target).find(".phone-img").addClass("visible-important");
      }
    }
  }

  function deviceClick(clickedItem) {
    var allButtons = $(".device-nav div.active");
    allButtons.each(function () {
      $(this).removeClass("active");
    });

    var clickedClass = $(clickedItem).attr("class");
    var allRelatedButtons = $("." + clickedClass);
    allRelatedButtons.each(function () {
      $(this).addClass("active");
    });

    $(".visible-important").addClass("hidden-important").removeClass("visible-important");

    //current device class to show on all tabs
    var imgClass = "." + $(clickedItem).attr("class").substring(0, $(clickedItem).attr("class").indexOf("-")) + "-img";

    $(imgClass).each(function () {
      $(this).removeClass("hidden-important");
      $(this).addClass("visible-important");
    });
  }

  function resizeBehaviour() {
    clearTimeout(productDevice.resizeTimer);
    productDevice.resizeTimer = setTimeout(function () {
      var productFeatureTabsId = "#" + $(".tab-control-id .device-nav").parents(".tab-pane").parents(".tab-control-id").attr("id");
      $(productFeatureTabsId + " .tab-pane").each(function () {
        $(this)
          .find(".product-example img.hidden-important")
          .each(function () {
            $(this).removeClass("hidden-important");
          });
        $(this)
          .find(".product-example img.visible-important")
          .each(function () {
            $(this).removeClass("visible-important");
          });
        $(this)
          .find(".product-example img:first-child")
          .each(function () {
            $(this).addClass("visible-important");
          });
        $(this)
          .find(".device-nav div.active")
          .each(function () {
            $(this).removeClass("active");
          });
        $(this)
          .find(".device-nav")
          .each(function () {
            $(this).find("div").first().addClass("active");
          });
        $(this)
          .find(".product-example")
          .each(function () {
            var currentWidth = window.innerWidth ||
              document.documentElement.clientWidth ||
              document.body.clientWidth;
            showCorrectScreenshot(currentWidth, this);
          });
      });
    }, 50);
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global jQuery */
/*global sageApp */

sageApp.modules.register("productFilter", function ($) {
  "use strict";

  var moduleClass = "filter-module-content:not(.partners)",
    filterButtonsClass = "product-filter-icon-wrapper",
    activeClass = "active",
    productResultsListClass = "filter-module-results-list",
    productPanelClass = "product-panel",
    filterTableClass = "filter-module-results-table",
    productPanelDisabledClass = "panel-disabled",
    sageCompareControl = {},
    isFiltered = false;

  function init() {
    //bind all events to document for delagation to traget product-filter-icon-wrapper
    $(document).on("click", "." + moduleClass + " ." + filterButtonsClass, function (e) {
      e.preventDefault();
      filterIconClicked(e.currentTarget);
    });
    $(document).on("click", "." + moduleClass + " ." + "product-select-icon", function (e) {
      e.preventDefault();
      selectIconClicked(e.currentTarget);
    });
    $(document).on("click", "." + moduleClass + " ." + "mob-trigger", function (e) {
      e.preventDefault();
      mobileProductClicked(e.currentTarget);
    });
    $(document).on("click", "." + moduleClass + " ." + "navigation", function (e) {
      e.preventDefault();
      navigationClicked(e.currentTarget);
    });

    if (!$("div." + productResultsListClass).length)
      return;

    initProdSlider();
  }

  function toggleNavigationDisabled() {
    var filteredProducts = $("." + moduleClass + " .mobile-table-header > .mob-trigger.isFiltered"),
      numFilteredProducts = filteredProducts.length,
      activeProductposition = 1,
      tmpCounter = 1;

    filteredProducts.each(function () {
      if ($(this).hasClass(activeClass)) {
        activeProductposition = tmpCounter;
      }
      tmpCounter++;
    });

    $("." + moduleClass + " ." + "navigation").removeClass("disabled");

    if (activeProductposition === numFilteredProducts) {
      $("." + moduleClass + " ." + "navigation.btnNext").addClass("disabled");
    }
    if (activeProductposition === 1) {
      $("." + moduleClass + " ." + "navigation.btnPrevious").addClass("disabled");
    }
  }

  function navigationClicked(clickedItem) {
    var currentProduct = $("." + moduleClass + " .mobile-table-header > .mob-trigger.isFiltered.active");

    if ($(clickedItem).hasClass("btnNext")) {

      currentProduct.nextAll(".isFiltered").first().trigger("click");
    } else {

      currentProduct.prevAll(".isFiltered").first().trigger("click");
    }

    toggleNavigationDisabled();
  }

  function mobileProductClicked(clickedItem) {
    var targetID = $(clickedItem).attr("data-prod-target");
    $("." + moduleClass + " ." + "mob-trigger").removeClass(activeClass);
    $(clickedItem).addClass(activeClass);
    $("." + moduleClass + " ." + "slider-mobile").removeClass(activeClass);
    $("#" + targetID).addClass(activeClass);
  }

  function mobileProductUnClicked(clickedItem) {
    var targetID = $(clickedItem).attr("data-prod-target");
    $(clickedItem).removeClass(activeClass);
    $("#" + targetID).removeClass(activeClass);
    var numActive = $("." + moduleClass + " ." + "mob-trigger.isFiltered.active").length;

    if (numActive === 0) {
      $("." + moduleClass + " ." + "mob-trigger.isFiltered").first().addClass(activeClass);
    }
  }

  function updateFilterTable() {
    var activeProducts = $("." + productResultsListClass + " ." + productPanelClass + " .icon-select-text" + "." + activeClass),
      numActiveProducts = activeProducts.length,
      allProducts = $("." + productResultsListClass + " ." + productPanelClass),
      allProductClasses = [],
      selectedProductClasses = [];

    activeProducts.each(function () {
      var productActive = $(this).closest("." + productPanelClass).attr("data-filter-product");
      selectedProductClasses.push(productActive);
    });

    allProducts.each(function () {
      var productActive = $(this).attr("data-filter-product");
      allProductClasses.push(productActive);
    });

    var testProd = -1;
    for (var i = allProductClasses.length; i--;) {
      testProd = selectedProductClasses.indexOf(allProductClasses[i]);
      if (testProd === -1) {
        $("." + filterTableClass).removeClass(allProductClasses[i]);
      } else {
        $("." + filterTableClass).addClass(allProductClasses[i]);
      }
    }

    var slickFilterString = "";
    for (var i2 = selectedProductClasses.length; i2--;) {
      if (i2 !== 0) {
        slickFilterString = slickFilterString + "div." + selectedProductClasses[i2].replace("-active", "-mob") + ", ";
      } else {
        slickFilterString = slickFilterString + "div." + selectedProductClasses[i2].replace("-active", "-mob");
      }
    }

    if (numActiveProducts > 0) {
      $("." + filterTableClass).removeClass("hidden");
      filterProductsMobile(slickFilterString);

    } else {
      $("." + filterTableClass).addClass("hidden");
      removeProductFilters();
    }
  }

  function selectIconClicked(clickedItem) {
    $(clickedItem).toggleClass(activeClass);
    $(clickedItem).closest(".panel").next(".icon-select-text").toggleClass(activeClass);

    if ($(clickedItem).closest(".panel").next(".icon-select-text").hasClass(activeClass)) {
      mobileProductClicked(".mobile-table-header" + " ." + $(clickedItem).closest(".product-panel").attr("data-prod-target"));
    } else {
      mobileProductUnClicked(".mobile-table-header" + " ." + $(clickedItem).closest(".product-panel").attr("data-prod-target"));
    }
    updateFilterTable();
    toggleNavigationDisabled();
  }

  function filterIconClicked(clickedItem) {
    $(clickedItem).toggleClass(activeClass);
    updateSelectedProducts();
  }


  function removeProductFilters() {
    if (isFiltered) {
      $("." + filterTableClass + " .isFiltered").removeClass("isFiltered");
      isFiltered = false;
    }
  }

  function filterProductsMobile(filterString) {
    if (isFiltered) {
      removeProductFilters();
    }
    $(filterString).addClass("isFiltered");
    isFiltered = true;
  }

  function initProdSlider() {
    sageCompareControl.moduleResultsList = $('.filter-module-results-list').slick({
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: false,
      responsive: [
        {
          breakpoint: 767,
          settings: {
            focusOnSelect: true,
            centerMode: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            initialSlide: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
  }

  function updateSelectedProducts() {
    var selectedAttributes = [];
    $("." + moduleClass + " ." + filterButtonsClass + "." + activeClass).each(function () {
      selectedAttributes.push($(this).attr("data-filter-attribute"));
    });

    $("." + moduleClass + " ." + productResultsListClass + " ." + productPanelClass).each(function () {
      var productAttributes,
        productAttributesArray,
        productScore = 0;

      productAttributes = $(this).attr("data-filter-attributes");
      productAttributesArray = productAttributes.split("|");

      //loop through selected attributes and add as score to data-score of product-panel
      for (var i = selectedAttributes.length; i--;) {
        var testProd = productAttributesArray.indexOf(selectedAttributes[i]);
        if (testProd >= 0) {
          productScore++;
        }
      }
      $(this).attr('data-score', productScore);
      if (productScore < selectedAttributes.length) {
        $(this).addClass(productPanelDisabledClass);
      } else {
        $(this).removeClass(productPanelDisabledClass);
      }

    });

    $("." + moduleClass).find(".filter-text-no-match,.filter-text-one-match,.filter-text-more-matches").addClass("hidden");

    var numSelected = $("." + moduleClass + " ." + productResultsListClass + " ." + productPanelClass + ":not(." + productPanelDisabledClass + ")").length;

    switch (numSelected) {
      case 0:
        $("." + moduleClass + " .filter-text-no-match").removeClass("hidden");
        break;
      case 1:
        $("." + moduleClass + " .filter-text-one-match").removeClass("hidden");
        break;
      default:
        $("." + moduleClass + " .filter-text-more-matches").removeClass("hidden");
        break;
    }
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("solutions", function ($) {
  "use strict";

  var triggerItem = ".widget-placeholder-inner.solution",
    activeClass = "active",
    inactiveClass = "inactive";

  function init() {
    /*bind solution click events*/
    $(document).on("click", triggerItem, function (e) {
      e.preventDefault();
      solutionClicked(e.currentTarget);
    });
    $(document).on("click", ".solution-trig.active", function (e) {
      e.preventDefault();
      removeActive();
    });
  }

  function removeActive() {
    $(".solution-trig").removeClass("active").removeClass("inactive");
  }

  function solutionClicked(clickedItem) {
    var isActive = $(clickedItem).closest("div.border-top-bottom").hasClass(activeClass);

    if (isActive) {
      $(triggerItem).each(function () {
        $(this).closest("div.border-top-bottom").removeClass(inactiveClass).removeClass(activeClass);
      });
    } else {
      $(triggerItem).each(function () {
        $(this).closest("div.border-top-bottom").addClass(inactiveClass).removeClass(activeClass);
      });
      $(clickedItem).closest("div.border-top-bottom").removeClass(inactiveClass).addClass(activeClass);
    }
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("switcher", function ($) {
  "use strict";

  var modScopeId = "#the_switcher",
    leftNav = ".the-switcher-nav-left",
    rightNav = ".the-switcher-nav-right",
    switcherContent = ".the-switcher-content",
    activeClass = "active";

  function init() {
    /*bind left Nav click events*/
    $(document).on("click", modScopeId + " " + leftNav + " ul > li > a", function (e) {
      e.preventDefault();
      leftNavClicked(e.currentTarget);
    });

    /*bind right Nav click events*/
    $(document).on("click", modScopeId + " " + rightNav + " ul > li > a", function (e) {
      e.preventDefault();
      rightNavClicked(e.currentTarget);
    });

    /*bind All Nav next click events*/
    $(document).on("click", modScopeId + " " + rightNav + " li.btnNext ," + modScopeId + " " + leftNav + " li.btnNext", function (e) {
      var activeItem = $(e.currentTarget).parent("ul").find("li." + activeClass);
      e.preventDefault();
      activeItem.next('li').find('a').trigger('click');
      toggleNavButton($(e.currentTarget).closest("ul").attr('id'));
    });

    /*bind All Nav previous click events*/
    $(document).on("click", modScopeId + " " + rightNav + " li.btnPrevious ," + modScopeId + " " + leftNav + " li.btnPrevious", function (e) {
      var activeItem = $(e.currentTarget).parent("ul").find("li." + activeClass);
      e.preventDefault();
      activeItem.prev('li').find('a').trigger('click');
      toggleNavButton($(e.currentTarget).closest("ul").attr('id'));
    });

    if (!$(modScopeId).length)
      return;

    $(modScopeId).find(leftNav + " > ul" + ", " + rightNav + " > ul").each(function () {
      toggleNavButton($(this).attr("id"));
    });
  }

  function removeAllActiveLi(itemSelector) {
    $(itemSelector).find("li." + activeClass).removeClass(activeClass);
  }

  function removeAllActiveUl(itemSelector) {
    $(itemSelector).find("ul." + activeClass).removeClass(activeClass);
  }

  function updateTabContent() {
    var activeContent = $(modScopeId + " " + rightNav + " > ul." + activeClass + " > li." + activeClass + " > a").attr("href");
    $(modScopeId + " " + switcherContent + " > div." + activeClass).removeClass(activeClass);
    $(modScopeId + " " + switcherContent + " > " + activeContent).addClass(activeClass);
  }

  function rightNavClicked(eventItem) {
    removeAllActiveLi(modScopeId + " " + rightNav + " ul." + activeClass);
    $(eventItem).closest("li").addClass(activeClass);
    updateTabContent();
  }

  function leftNavClicked(eventItem) {
    var selectedTarget;
    selectedTarget = $(eventItem).attr("href");
    removeAllActiveLi(modScopeId + " " + leftNav);
    $(eventItem).closest("li").addClass(activeClass);
    removeAllActiveUl(modScopeId + " " + rightNav);
    $(selectedTarget).addClass(activeClass);
    updateTabContent();
  }

  function toggleNavButton(currentNav) {
    var active = $("#" + currentNav + " > li." + activeClass);
    var prevItem = active.prev('li');
    var nextItem = active.next('li');

    if (prevItem.hasClass("navigation")) {
      prevItem.addClass("disabled");
    } else {
      $("#" + currentNav + " .navigation.btnPrevious").removeClass("disabled");
    }
    if (nextItem.hasClass("navigation")) {
      nextItem.addClass("disabled");
    } else {
      $("#" + currentNav + " .navigation.btnNext").removeClass("disabled");
    }
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("tabs", function ($) {
  "use strict";

  var tabModuleClass = ".tab-control-id";

  function init() {
    var $tabs = $(tabModuleClass);

    if (!$tabs.length)
      return;

    /*bind tab mobile next click events*/
    $(document).on("click", tabModuleClass + " > .nav-tabs > .btnNext", function (e) {
      e.preventDefault();
      nextClicked(e.currentTarget);
    });
    /*bind tab mobile prev click events*/
    $(document).on("click", tabModuleClass + " > .nav-tabs > .btnPrevious", function (e) {
      e.preventDefault();
      prevClicked(e.currentTarget);
    });

    $tabs.each(function () {
      toggleNavButton($(this));
    });
  }

  function nextClicked(clickedNav) {
    var theNav = $(clickedNav).closest(tabModuleClass),
      theActiveNav = theNav.find(".nav-tabs > .active").first();

    /*Trigger click on the next tab*/
    $(theActiveNav).next('li').find('a').trigger('click');

    /*Toggle Nav next preivous disabled stated based on active tab*/
    toggleNavButton(theNav);
  }

  function prevClicked(clickedNav) {
    var theNav = $(clickedNav).closest(tabModuleClass),
      theActiveNav = theNav.find(".nav-tabs > .active").first();

    /*Trigger click on the previous tab*/
    $(theActiveNav).prev('li').find('a').trigger('click');

    /*Toggle Nav next preivous disabled stated based on active tab*/
    toggleNavButton(theNav);
  }

  function toggleNavButton(theNav) {
    var theActiveNav = theNav.find(".nav-tabs > .active").first(),
      prevItem = $(theActiveNav).prev("li"),
      nextItem = $(theActiveNav).next("li");

    if (prevItem.hasClass("navigation")) {
      prevItem.addClass("disabled");
    } else {
      $(theNav).find(".navigation.btnPrevious").first().removeClass("disabled");
    }
    if (nextItem.hasClass("navigation")) {
      nextItem.addClass("disabled");
    } else {
      $(theNav).find(".navigation.btnNext").first().removeClass("disabled");
    }
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("videoCarousel", function ($) {
  "use strict";

  var eventTriggerSelectorClass = "video-control-play",
    eventTriggerSelectorStopClass = "video-control-stop",
    videoPlayingClass = "videoPlaying";

  function init() {
    //bind all events to document for delagation to traget enventTriggerSelector
    $(document).on("click", "." + eventTriggerSelectorClass, function (e) {
      e.preventDefault();
      playVideo($(this));
    });
    $(document).on("click", "." + eventTriggerSelectorStopClass, function (e) {
      e.preventDefault();
      stopVideo($(this));
    });
  }

  function playVideo(targetCarousel) {
    var activeSlide = targetCarousel.closest(".carousel").find(".item.active");
    targetCarousel.closest(".carousel").addClass(videoPlayingClass).carousel('pause');
    replaceVideoPlaceholder(activeSlide);
  }

  function stopVideo(targetCarousel) {
    var activeSlide = targetCarousel.closest(".carousel").find(".item.active");
    removeVideoPlaceholder(activeSlide);
    targetCarousel.closest(".carousel").removeClass(videoPlayingClass).carousel('cycle');
  }

  function removeVideoPlaceholder(activeSlide) {
    //clear iframe from slide
    activeSlide.find(".videoContainer").html("");
  }

  function replaceVideoPlaceholder(activeSlide) {
    var youtubeID = activeSlide.attr("data-video"),
      embedURL = "https://www.youtube.com/embed/" + youtubeID + "?autoplay=1&controls=0&showinfo=0",
      iframe = "<iframe frameborder='0' allowfullscreen='1' src='" + embedURL + "'></iframe>";
    //add iframe to slide
    activeSlide.find(".videoContainer").html(iframe);
  }

  return {
    init: init
  }
});
/*jslint browser: true*/
/*jslint jquery: true*/
/*global sageApp */

sageApp.modules.register("videoPlayer", function ($) {
  "use strict";

  var videoModuleContainerClass = ".content-widget.video",
    eventTriggerSelectorClass = "video-container",
    videoPlayingClass = "video-playing",
    pauseVideoTriggerClasses = ".nav.nav-tabs > li:not(.active), .the-switcher-nav li:not(.active)",
    chapterTrigger = ".video-chapters-list li:not(.playing)";

  function init() {
    //bind all events to document for delegation to target eventTriggerSelector
    $(document).on("click", "." + eventTriggerSelectorClass, function (e) {
      e.preventDefault();
      playVideo($(this));
    });
    $(document).on("click", pauseVideoTriggerClasses, function () {
      pauseAllVideos();
    });
    $(document).on("click", chapterTrigger, function (e) {
      e.preventDefault();
      playChapter(e.currentTarget);
    });
  }

  function playVideo(targetVideo, startTime) {
    startTime = startTime >= 1 ? startTime : 0;
    if (!targetVideo.hasClass(videoPlayingClass)) {
      targetVideo.addClass(videoPlayingClass);
      addVideoPlaceholder(targetVideo, startTime);
    }
  }

  function pauseAllVideos() {
    $(document).find("iframe.video-iframe").each(function () {
      //$(this)[0].contentWindow.postMessage("{'event':'command','func':'pauseVideo','args':''}", "*");
      var tmpData = {
        event: "command",
        func: "pauseVideo",
        args: []
      };
      $(this)[0].contentWindow.postMessage(JSON.stringify(tmpData), "*");
    });
  }

  function addVideoPlaceholder(targetVideo, startTime) {
    startTime = startTime >= 1 ? startTime : (targetVideo.attr("data-start") >= 1 ? targetVideo.attr("data-start") : 0);
    var youtubeId = targetVideo.attr("data-videoid"),
      youtubeAutoPlay = targetVideo.attr("data-autoplay") ? targetVideo.attr("data-autoplay") : "0",
      youtubeAllowFullScreen = targetVideo.attr("data-allowfullscreen") ? targetVideo.attr("data-allowfullscreen") : "0",
      youtubeRelated = targetVideo.attr("data-related") ? targetVideo.attr("data-related") : "0",
      youtubeShowinfo = targetVideo.attr("data-showinfo") ? targetVideo.attr("data-showinfo") : "0",
      youtubeShowcontrols = targetVideo.attr("data-showcontrols") ? targetVideo.attr("data-showcontrols") : "0",
      iframeId = youtubeId + "_sage_" + new Date().getTime(),
      embedUrl = "//www.youtube.com/embed/" + youtubeId + "?start=" + startTime + "&autoplay=" + youtubeAutoPlay + "&rel=" + youtubeRelated + "&controls=" + youtubeShowcontrols + "&showinfo= " + youtubeShowinfo + "&enablejsapi=1",
      iframe = "<iframe class='video-iframe' id='" + iframeId + "' frameborder='0' allowfullscreen='" + youtubeAllowFullScreen + "' src='" + embedUrl + "'></iframe>";
    //add iframe to slide
    targetVideo.append(iframe);
  }

  function playChapter(clickedItem) {
    var seekTime = $(clickedItem).attr("data-video-seek-time"),
      theVideo = $(clickedItem).closest(videoModuleContainerClass).find("." + eventTriggerSelectorClass);

    seekTime = (typeof seekTime === "undefined") ? 0 : seekTime;
    $(clickedItem).closest(".video-chapters-list").find("li").removeClass("playing");
    $(clickedItem).addClass("playing");
    if (!theVideo.hasClass(videoPlayingClass)) {
      playVideo(theVideo, seekTime);
    } else {
      theVideo.find("iframe.video-iframe").each(function () {
        var tmpData = {
          event: "command",
          func: "seekTo",
          args: [seekTime]
        };
        var tmpDataPlay = {
          event: "command",
          func: "playVideo",
          args: []
        };
        $(this)[0].contentWindow.postMessage(JSON.stringify(tmpData), "*");
        $(this)[0].contentWindow.postMessage(JSON.stringify(tmpDataPlay), "*");
      });
    }
  }

  return {
    init: init,
    pauseAllVideos : pauseAllVideos
  }
});