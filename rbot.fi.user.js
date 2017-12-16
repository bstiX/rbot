// ==UserScript==
// @name        rbot.fi
// @namespace   rbot.fi
// @description Filter news and news sources on rbot.fi
// @include     https://rbot.fi/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @version     0.1.1
// ==/UserScript==

//console.log = function() {}

startTime = performance.now();

// Filter by source and category (List)
// Add your own sources with categories to filter
// Source (category)
// e.g. 
//   "Media (kategoria)",
//   "Media (toinen kategoria)",
//   "Toinen media (katogoria)",
filterCategorylist = [

];

// Filter by source (List)
// Add your own sources to filter
// Source
// e.g.
//   "Media",
//   "Toinen media",
filterSourceList = [

];

// Hide by title (List) (regexp)
// Add your own words to filter
// e.g.
//   "tämä",
//   "tässä",
//   "hän",
//   "hänen",
hide = [

];

hideRegexp = "(?:^|\\s)(" + hide.join("|") + ")(?:[\\s|\\?])";

this.$ = this.jQuery = jQuery.noConflict(true);

(function() {
  sCount = 0;
  cCount = 0;
  tCount = 0;

  hidenews = function() {
    hideRe = new RegExp(hideRegexp, "i");
 
    $("li.newsgroup-item").find("div.cell+.source").each(function() {
      try {
        s = $.trim($(this).text());
        sc = s.match(/^(.+) \((.+)\)$/);
        if(!sc) {
          sc = ["","",""];
        } else {
          if(!sc[0]) { sc[0] = ""; }
          if(!sc[1]) { sc[1] = ""; }
          if(!sc[2]) { sc[2] = ""; }
        }
        if($.inArray(sc[1], filterSourceList) != -1) {
          console.log("  * " + s);
          l = $(this).parents("li");
          l.css("display", "none");
          sCount++;
        } else if($.inArray(s, filterCategorylist) != -1) {
          console.log("  ** " + s);
          l = $(this).parents("li");
          l.css("display", "none");
          cCount++;
        } else {
          //console.log(s);
        }
	    } catch(e) {console.log(e);}
    });
    $("li.newsgroup-item").find("div.cell.headline").find("a[href]:not(.sources)").each(function() {
      title = $.trim($(this).text());
      if(hideRe.exec(title)) {
        l = $(this).parents("li");
        l.css("display", "none");
	      console.log("  *** " + title);
        tCount++;
      } else {
	      //console.log(title);
      }
    });
  };

  $.when(hidenews()).done(function() {
    try {
    	$("ul.newsgroup").each(function() {
        h = $(this).find("li.newsgroup-item").filter(":not([style])");
        if(h.length === 0) {
          $(this).css("display", "none");
        }
      });
    } catch(e) {console.log(e);}
  });

  count = sCount + cCount + tCount;
  if(count > 0) {
    t = count + " (" + sCount + "+" + cCount + "+" + tCount + ")";
    color = "#aaa";
    filtered = $(".filtered:first");
    if(filtered.length > 0) {
      filtered.append(" [ <span style=\"color:" + color + "; weight: bold;\">+ " + t + "</span> ]");
    } else {
      $(".title:first").append("<span style=\"color:" + color + "; weight: bold;\">[ Suodatettu " + t + " ]</span>");
    }
    console.log(t);
  }

  endTime = performance.now();
  console.log("Time: " + (endTime-startTime));
})();

