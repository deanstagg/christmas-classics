/* Christmas Classics Calendar — embed helper.
   Put this where the calendar should appear:
     <div data-christmas-classics data-src="https://YOUR-HOST/christmas-classics/calendar-simple.html"></div>
     <script src="https://YOUR-HOST/christmas-classics/embed.js" defer></script>
   The frame grows and shrinks to fit the calendar, so nothing gets cut off, and the page
   scrolls the video window into view when a door is opened. */
(function () {
  function mount(holder) {
    if (holder.dataset.ccMounted) return;
    holder.dataset.ccMounted = "1";
    var f = document.createElement("iframe");
    f.src = holder.getAttribute("data-src");
    f.title = holder.getAttribute("data-title") || "Christmas Classics Calendar";
    f.setAttribute("allow", "fullscreen; autoplay; encrypted-media; picture-in-picture");
    f.setAttribute("allowfullscreen", "");
    f.setAttribute("scrolling", "no");
    f.style.cssText = "width:100%;border:0;display:block;overflow:hidden;height:900px;transition:height .2s";
    holder.appendChild(f);
    window.addEventListener("message", function (e) {
      if (e.source !== f.contentWindow || !e.data) return;
      if (e.data.type === "advent:height") f.style.height = e.data.height + "px";
      if (e.data.type === "advent:dialog") {
        var r = f.getBoundingClientRect(), top = r.top + e.data.top, bottom = top + e.data.height, vh = window.innerHeight;
        if (top < 0 || bottom > vh) {
          var target = window.scrollY + top - Math.max(10, (vh - e.data.height) / 2);
          window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });
        }
      }
      if (e.data.type && e.data.type.indexOf("advent:") === 0 && window.dataLayer && e.data.type !== "advent:height" && e.data.type !== "advent:dialog") {
        var d = { event: e.data.type.replace(":", "_") };
        for (var k in e.data) if (k !== "type") d[k] = e.data[k];
        window.dataLayer.push(d);
      }
    });
  }
  function init() { document.querySelectorAll("[data-christmas-classics]").forEach(mount); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
