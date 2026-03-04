(function () {
  var FORM_BASE_URL = "https://forms.clickup.com/9017585237/f/8cquvjn-1937/6Y7VJRORF82NXFX6EP";
  var PREFILL_FIELD_NAME = "Course / Module";

  var COURSE_ALIASES = [
    {
      aliases: ["0-1-intro", "course-0-1", "course-0-1-enhanced"],
      value: "0.1: Introduction to Investing & Beat Lynch",
    },
    {
      aliases: ["1-1-masters-101", "masters-101", "masters-101-enhanced-1", "masters-101-enhanced"],
      value: "1.1: Masters 101",
    },
    {
      aliases: ["1-2-investors-mindset", "course-1-2"],
      value: "1.2: The Investor's Mindset",
    },
    {
      aliases: ["1-3-how-markets-work", "course-1-3", "course-1-3-enhanced"],
      value: "1.3: How Markets Work",
    },
    {
      aliases: ["1-4-financial-literacy", "course-1-4", "course-1-4-enhanced"],
      value: "1.4: Financial Literacy for Investors",
    },
    {
      aliases: ["2-1-company-analysis", "course-2-1", "course-2-1-enhanced"],
      value: "2.1: Applied Company Analysis",
    },
    {
      aliases: ["2-2-sector-dynamics", "course-2-2", "course-2-2-enhanced"],
      value: "2.2: Sector Dynamics & Macro Context",
    },
    {
      aliases: ["2-3-portfolio-construction", "course-2-3", "course-2-3-enhanced"],
      value: "2.3: Portfolio Construction Fundamentals",
    },
    {
      aliases: ["2-4-nil-competition-primer", "nil-competition-primer"],
      value: "2.4: NIL Competition Primer",
    },
    {
      aliases: ["pillar-1-market-finance", "pillar-1-market-finance-foundations", "pillar-1", "pillar-1-final"],
      value: "P1: Market & Finance Foundations",
    },
    {
      aliases: ["pillar-2-accounting-valuation", "pillar-2"],
      value: "P2: Accounting & Valuation",
    },
    {
      aliases: ["pillar-3-market-structure", "pillar-3"],
      value: "P3: Market Structure & Return Mechanics",
    },
    {
      aliases: ["pillar-4-risk-architecture", "pillar-4"],
      value: "P4: Risk & Portfolio Architecture",
    },
    {
      aliases: ["pillar-5-professional-craft", "pillar-v", "pillar-5-professional-craft-system-integration"],
      value: "P5: Professional Craft & System Integration",
    },
    {
      aliases: ["masters-deep-dive"],
      value: "Standalone: Masters Deep Dive",
    },
    {
      aliases: ["index", "infinite-alpha-preview", "infinite-alpha-feedback", ""],
      value: "Overall Feedback/No section",
    },
  ];

  function normalizePathStem(pathname) {
    var stem = pathname.split("/").pop() || "";
    stem = stem.replace(/\.[^.]+$/, "");
    stem = stem.toLowerCase();
    stem = stem.replace(/%20/g, "-");
    stem = stem.replace(/&/g, "and");
    stem = stem.replace(/\([^)]*\)/g, "");
    stem = stem.replace(/__+/g, "-");
    stem = stem.replace(/[^a-z0-9]+/g, "-");
    stem = stem.replace(/-enhanced(?:-[0-9]+)?$/, "");
    stem = stem.replace(/-final$/, "");
    stem = stem.replace(/^-+|-+$/g, "");
    return stem;
  }

  function normalizeText(text) {
    return (text || "")
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function stripCoursePrefix(value) {
    return value
      .replace(/^[0-9]+\.[0-9]+:\s+/, "")
      .replace(/^p[0-9]:\s+/i, "")
      .replace(/^standalone:\s+/i, "")
      .trim();
  }

  function findCourseForPage(pathname) {
    var normalizedStem = normalizePathStem(pathname);

    for (var i = 0; i < COURSE_ALIASES.length; i += 1) {
      var entry = COURSE_ALIASES[i];
      for (var j = 0; j < entry.aliases.length; j += 1) {
        if (normalizedStem === entry.aliases[j]) {
          return entry.value;
        }
      }
    }

    return null;
  }

  function findCourseFromDocument() {
    var heading = document.querySelector("h1");
    var titleText = heading ? heading.textContent : document.title;
    var normalizedTitle = normalizeText(titleText);

    if (!normalizedTitle) {
      return null;
    }

    for (var i = 0; i < COURSE_ALIASES.length; i += 1) {
      var entry = COURSE_ALIASES[i];
      var normalizedValue = normalizeText(entry.value);
      var normalizedShortValue = normalizeText(stripCoursePrefix(entry.value));

      if (
        normalizedTitle === normalizedValue ||
        normalizedTitle === normalizedShortValue
      ) {
        return entry.value;
      }
    }

    return null;
  }

  function buildFormUrl(courseTitle) {
    var url = new URL(FORM_BASE_URL);

    if (courseTitle) {
      url.searchParams.set(PREFILL_FIELD_NAME, courseTitle);
    }

    return url.toString();
  }

  function createDrawerMarkup(courseTitle) {
    var button = document.createElement("button");
    button.type = "button";
    button.className = "feedback-trigger";
    button.setAttribute("aria-controls", "feedback-drawer");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML =
      '<span class="feedback-trigger-icon" aria-hidden="true">+</span><span>Press to Give Feedback</span>';

    var backdrop = document.createElement("div");
    backdrop.className = "feedback-backdrop";
    backdrop.hidden = true;

    var drawer = document.createElement("aside");
    drawer.id = "feedback-drawer";
    drawer.className = "feedback-drawer";
    drawer.setAttribute("aria-hidden", "true");

    var contextText = courseTitle
      ? "Submitting feedback for " + courseTitle + "."
      : "Choose the course in the form if it is not pre-selected.";

    drawer.innerHTML =
      '<div class="feedback-drawer-header">' +
      '<div class="feedback-drawer-title">' +
      '<p class="feedback-drawer-eyebrow">Infinite Alpha</p>' +
      '<h2 class="feedback-drawer-heading">Share Feedback</h2>' +
      '<p class="feedback-drawer-context">' + contextText + "</p>" +
      "</div>" +
      '<button type="button" class="feedback-drawer-close" aria-label="Close feedback panel">&times;</button>' +
      "</div>" +
      '<div class="feedback-drawer-body">' +
      '<iframe class="feedback-drawer-frame" src="' + buildFormUrl(courseTitle) + '" title="Infinite Alpha feedback form" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>' +
      "</div>";

    document.body.appendChild(button);
    document.body.appendChild(backdrop);
    document.body.appendChild(drawer);

    return {
      button: button,
      backdrop: backdrop,
      drawer: drawer,
      closeButton: drawer.querySelector(".feedback-drawer-close"),
    };
  }

  function attachDrawerBehavior(elements) {
    function openDrawer() {
      document.body.classList.add("feedback-drawer-open");
      elements.backdrop.hidden = false;
      elements.button.setAttribute("aria-expanded", "true");
      elements.drawer.setAttribute("aria-hidden", "false");
      requestAnimationFrame(function () {
        elements.backdrop.classList.add("is-open");
        elements.drawer.classList.add("is-open");
      });
    }

    function closeDrawer() {
      document.body.classList.remove("feedback-drawer-open");
      elements.backdrop.classList.remove("is-open");
      elements.drawer.classList.remove("is-open");
      elements.button.setAttribute("aria-expanded", "false");
      elements.drawer.setAttribute("aria-hidden", "true");
      window.setTimeout(function () {
        if (!elements.drawer.classList.contains("is-open")) {
          elements.backdrop.hidden = true;
        }
      }, 300);
    }

    elements.button.addEventListener("click", openDrawer);
    elements.closeButton.addEventListener("click", closeDrawer);
    elements.backdrop.addEventListener("click", closeDrawer);

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && elements.drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!document.body || document.querySelector(".feedback-trigger")) {
      return;
    }

    var courseTitle =
      findCourseForPage(window.location.pathname) || findCourseFromDocument();
    var elements = createDrawerMarkup(courseTitle);
    attachDrawerBehavior(elements);
  });
})();
