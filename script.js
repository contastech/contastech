/* ==========================================================================
   Contas Tech Solutions — comportamento do site (JavaScript puro)
   ========================================================================== */

(function () {
  "use strict";

  var data = window.SITE_DATA;

  /* Utilitários ---------------------------------------------------------- */
  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function icon(id, extra) {
    return '<svg class="icon' + (extra ? " " + extra : "") + '"><use href="#' + id + '" /></svg>';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* Cabeçalho: estado ao rolar ------------------------------------------- */
  var header = document.getElementById("header");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Menu móvel ------------------------------------------------------------ */
  var toggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var menuIcon = document.getElementById("menuIcon");

  function setMenu(open) {
    mobileNav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menuIcon.innerHTML = '<use href="#' + (open ? "i-x" : "i-menu") + '" />';
  }

  toggle.addEventListener("click", function () {
    setMenu(!mobileNav.classList.contains("is-open"));
  });

  mobileNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  /* Renderização das secções --------------------------------------------- */
  var servicesGrid = document.getElementById("servicesGrid");
  data.services.forEach(function (service, index) {
    var card = el("article", "card service-card reveal");
    card.dataset.delay = String(index * 80);
    card.innerHTML =
      '<span class="icon-badge">' +
      icon(service.icon, "icon--lg") +
      "</span>" +
      "<h3>" +
      escapeHtml(service.title) +
      "</h3>" +
      "<p>" +
      escapeHtml(service.description) +
      "</p>" +
      '<ul class="check-list">' +
      service.items
        .map(function (item) {
          return "<li>" + icon("i-check", "icon--sm") + escapeHtml(item) + "</li>";
        })
        .join("") +
      "</ul>";
    servicesGrid.appendChild(card);
  });

  var featuresGrid = document.getElementById("featuresGrid");
  data.differentials.forEach(function (item, index) {
    var card = el("article", "card feature-card reveal");
    card.dataset.delay = String(index * 80);
    card.innerHTML =
      '<span class="icon-badge icon-badge--gold">' +
      icon(item.icon) +
      "</span><div><h3>" +
      escapeHtml(item.title) +
      "</h3><p>" +
      escapeHtml(item.description) +
      "</p></div>";
    featuresGrid.appendChild(card);
  });

  var pillarsGrid = document.getElementById("pillarsGrid");
  data.pillars.forEach(function (pillar, index) {
    var card = el("article", "card pillar reveal");
    card.dataset.delay = String(index * 90);
    card.innerHTML =
      '<span class="icon-badge">' +
      icon(pillar.icon) +
      "</span><h3>" +
      escapeHtml(pillar.title) +
      "</h3><p>" +
      escapeHtml(pillar.text) +
      "</p>";
    pillarsGrid.appendChild(card);
  });

  var plansGrid = document.getElementById("plansGrid");
  data.plans.forEach(function (plan, index) {
    var card = el("article", "card plan reveal" + (plan.highlight ? " plan--highlight" : ""));
    card.dataset.delay = String(index * 80);
    card.innerHTML =
      (plan.highlight
        ? '<span class="plan__tag">' + icon("i-star", "icon--sm") + " Mais procurado</span>"
        : "") +
      "<h3>Plano " +
      escapeHtml(plan.name) +
      '</h3><p class="plan__profile">' +
      escapeHtml(plan.profile) +
      '</p><p class="plan__price">' +
      escapeHtml(plan.price) +
      '</p><p class="plan__hint">Investimento mensal indicativo</p>' +
      '<a class="btn btn--' +
      (plan.highlight ? "gold" : "primary") +
      ' btn--lg btn--block" href="#contactos">Solicitar Orçamento</a>';
    plansGrid.appendChild(card);
  });

  var table = document.getElementById("plansTable");
  var thead = el("thead");
  thead.innerHTML =
    "<tr><th>Comparativo dos Planos</th>" +
    data.plans
      .map(function (plan) {
        return (
          "<th>" +
          escapeHtml(plan.name) +
          (plan.highlight ? ' <span style="color: var(--gold)">★</span>' : "") +
          "</th>"
        );
      })
      .join("") +
    "</tr>";
  var tbody = el("tbody");
  tbody.innerHTML = data.planRows
    .map(function (row) {
      return (
        '<tr><th scope="row">' +
        escapeHtml(row.label) +
        "</th>" +
        row.values
          .map(function (value) {
            return "<td>" + escapeHtml(value) + "</td>";
          })
          .join("") +
        "</tr>"
      );
    })
    .join("");
  table.appendChild(thead);
  table.appendChild(tbody);

  var testimonialsGrid = document.getElementById("testimonialsGrid");
  data.testimonials.forEach(function (item, index) {
    var card = el("article", "card testimonial reveal");
    card.dataset.delay = String(index * 90);
    card.innerHTML =
      '<span style="color: var(--gold)">' +
      icon("i-quote", "icon--lg") +
      "</span><p>" +
      escapeHtml(item.text) +
      '</p><div class="testimonial__author"><strong>' +
      escapeHtml(item.name) +
      "</strong><span>" +
      escapeHtml(item.role) +
      "</span></div>";
    testimonialsGrid.appendChild(card);
  });

  var sectorsGrid = document.getElementById("sectorsGrid");
  data.sectors.forEach(function (sector) {
    var node = el("div", "sector");
    node.innerHTML = icon("i-building") + "<span>" + escapeHtml(sector) + "</span>";
    sectorsGrid.appendChild(node);
  });

  /* Notificações ---------------------------------------------------------- */
  var toasts = document.getElementById("toasts");

  function notify(message, variant) {
    var toast = el("div", "toast toast--" + (variant || "success"), escapeHtml(message));
    toasts.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 5000);
  }

  /* Formulário → WhatsApp -------------------------------------------------- */
  var form = document.getElementById("contactForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var fields = ["name", "email", "phone", "message", "service"];
    var values = {};
    var missing = false;

    fields.forEach(function (id) {
      var input = document.getElementById(id);
      var value = input.value.trim();
      values[id] = value;
      input.classList.toggle("is-invalid", !value);
      if (!value) missing = true;
    });

    if (missing) {
      notify(
        values.service
          ? "Preencha todos os campos obrigatórios."
          : "Preencha todos os campos e selecione o tipo de serviço.",
        "error",
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      document.getElementById("email").classList.add("is-invalid");
      notify("Introduza um e-mail válido.", "error");
      return;
    }

    var text = [
      "*Novo pedido de orçamento — Site Contas Tech*",
      "*Nome:* " + values.name,
      "*E-mail:* " + values.email,
      "*Telefone:* " + values.phone,
      "*Serviço:* " + values.service,
      "*Mensagem:* " + values.message,
    ].join("\n");

    window.open(
      "https://wa.me/" + data.contacts.whatsappNumber + "?text=" + encodeURIComponent(text),
      "_blank",
      "noopener,noreferrer",
    );

    notify("Pedido preparado! Conclua o envio no WhatsApp para falarmos consigo.", "success");
    form.reset();
  });

  /* Animações de scroll ---------------------------------------------------- */
  var reveals = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var delay = entry.target.dataset.delay;
          if (delay) entry.target.style.transitionDelay = delay + "ms";
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    reveals.forEach(function (node) {
      observer.observe(node);
    });
  } else {
    reveals.forEach(function (node) {
      node.classList.add("is-visible");
    });
  }

  /* Ano no rodapé ---------------------------------------------------------- */
  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
