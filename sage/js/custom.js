$(function () {
    // accounting-filter-button
    $("#btn-filter-1").on("click", function () {
        $("#pnl-card-3").hide();
        $("#pnl-card-1").show();
        $("#pnl-card-2").show();
    });
    $("#btn-filter-2").on("click", function () {
        $("#pnl-card-1").hide();
        $("#pnl-card-2").show();
        $("#pnl-card-3").show();
    });
    $("#btn-filter-3").on("click", function () {
        $("#pnl-card-2").hide();
        $("#pnl-card-1").show();
        $("#pnl-card-3").show();
    });
});