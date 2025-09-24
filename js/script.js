(() => {
  const projects = [
    {
      title: "Realtime Chat App",
      description: "WebSocket chat with rooms, presence, and optimistic UI.",
      tags: ["TypeScript", "WebSocket", "Node.js"],
      emoji: "💬",
      links: { demo: "#", source: "#" }
    },
    {
      title: "Image Classifier",
      description: "CNN-based classifier with transfer learning and Grad-CAM.",
      tags: ["Python", "PyTorch", "ML"],
      emoji: "🧠",
      links: { demo: "#", source: "#" }
    },
    {
      title: "Docs Generator",
      description: "Static site generator that converts Markdown to a docs site.",
      tags: ["JavaScript", "Markdown", "Static"],
      emoji: "📚",
      links: { demo: "#", source: "#" }
    },
    {
      title: "Task Manager API",
      description: "REST API with JWT auth, pagination, and OpenAPI docs.",
      tags: ["Go", "PostgreSQL", "API"],
      emoji: "🧩",
      links: { demo: "#", source: "#" }
    }
  ];

  const elements = {
    grid: document.getElementById("projectsGrid"),
    search: document.getElementById("projectSearch"),
    tagFilters: document.getElementById("tagFilters"),
    themeToggle: document.getElementById("themeToggle"),
    year: document.getElementById("year"),
    mobileNavToggle: document.getElementById("mobileNavToggle"),
    primaryNav: document.getElementById("primaryNav")
  };

  const state = {
    searchQuery: "",
    selectedTags: new Set()
  };

  function getAllTags(list) {
    const set = new Set();
    for (const p of list) for (const t of p.tags) set.add(t);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }

  function matchesFilters(project) {
    const query = state.searchQuery.trim().toLowerCase();
    const matchQuery =
      !query ||
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.tags.some(t => t.toLowerCase().includes(query));

    const tags = state.selectedTags;
    const matchTags = tags.size === 0 || project.tags.some(t => tags.has(t));
    return matchQuery && matchTags;
  }

  function createProjectCard(project) {
    const card = document.createElement("article");
    card.className = "card";

    const topRow = document.createElement("div");
    topRow.className = "row";
    const title = document.createElement("h3");
    title.textContent = project.title;
    const emoji = document.createElement("span");
    emoji.className = "emoji";
    emoji.textContent = project.emoji || "🧰";
    topRow.appendChild(title);
    topRow.appendChild(emoji);

    const desc = document.createElement("p");
    desc.textContent = project.description;

    const tagsRow = document.createElement("div");
    tagsRow.className = "tags";
    for (const t of project.tags) {
      const chip = document.createElement("span");
      chip.className = "chip";
      chip.textContent = t;
      tagsRow.appendChild(chip);
    }

    const linksRow = document.createElement("div");
    linksRow.className = "links";
    if (project.links?.demo && project.links.demo !== "#") {
      const a = document.createElement("a");
      a.href = project.links.demo;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "link";
      a.textContent = "Live";
      linksRow.appendChild(a);
    }
    if (project.links?.source && project.links.source !== "#") {
      const a = document.createElement("a");
      a.href = project.links.source;
      a.target = "_blank";
      a.rel = "noopener";
      a.className = "link";
      a.textContent = "Code";
      linksRow.appendChild(a);
    }

    card.appendChild(topRow);
    card.appendChild(desc);
    card.appendChild(tagsRow);
    if (linksRow.children.length) card.appendChild(linksRow);
    return card;
  }

  function render() {
    elements.grid.innerHTML = "";
    const filtered = projects.filter(matchesFilters);
    if (filtered.length === 0) {
      const empty = document.createElement("p");
      empty.className = "muted";
      empty.textContent = "No projects match your filters.";
      elements.grid.appendChild(empty);
      return;
    }
    for (const p of filtered) elements.grid.appendChild(createProjectCard(p));
  }

  function setupSearch() {
    elements.search.addEventListener("input", () => {
      state.searchQuery = elements.search.value;
      render();
    });
  }

  function setupTags() {
    const tags = getAllTags(projects);
    elements.tagFilters.innerHTML = "";
    for (const tag of tags) {
      const btn = document.createElement("button");
      btn.className = "tag";
      btn.type = "button";
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = tag;
      btn.addEventListener("click", () => {
        if (state.selectedTags.has(tag)) {
          state.selectedTags.delete(tag);
          btn.setAttribute("aria-pressed", "false");
        } else {
          state.selectedTags.add(tag);
          btn.setAttribute("aria-pressed", "true");
        }
        render();
      });
      elements.tagFilters.appendChild(btn);
    }
  }

  function setTheme(theme) {
    const root = document.documentElement;
    if (theme === "system") {
      root.setAttribute("data-theme", "system");
      localStorage.removeItem("theme");
    } else {
      root.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
    elements.themeToggle.textContent =
      root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
  }

  function setupTheme() {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      setTheme(stored);
    } else {
      const prefersDark =
        window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
    }

    elements.themeToggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  function setupMobileNav() {
    if (!elements.mobileNavToggle || !elements.primaryNav) return;
    elements.mobileNavToggle.addEventListener("click", () => {
      const expanded = elements.mobileNavToggle.getAttribute("aria-expanded") === "true";
      elements.mobileNavToggle.setAttribute("aria-expanded", String(!expanded));
      elements.primaryNav.classList.toggle("open", !expanded);
    });
    elements.primaryNav.addEventListener("click", e => {
      if (e.target instanceof HTMLAnchorElement) {
        elements.mobileNavToggle.setAttribute("aria-expanded", "false");
        elements.primaryNav.classList.remove("open");
      }
    });
  }

  function setYear() {
    if (elements.year) elements.year.textContent = String(new Date().getFullYear());
  }

  function init() {
    setupSearch();
    setupTags();
    setupTheme();
    setupMobileNav();
    setYear();
    render();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
