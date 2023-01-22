"use strict";

function hideFilter() {
  $("#filter").hide();
  $("#map").css("margin-left", "13%");
}

function showFilter() {
  $("#filter").show();
  $("#map").css("margin-left", "20px");
  $("#perizia").hide();
  $("#home").show();
}
