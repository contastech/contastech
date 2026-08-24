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
  var menuClose = document.getElementById("menuClose");
  var menuOverlay = document.getElementById("menuOverlay");

  function setMenu(open) {
    mobileNav.classList.toggle("is-open", open);
    menuOverlay.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    menuIcon.innerHTML = '<use href="#' + (open ? "i-x" : "i-menu") + '" />';
    document.body.classList.toggle("no-scroll", open);
  }

  toggle.addEventListener("click", function () {
    setMenu(!mobileNav.classList.contains("is-open"));
  });

  // Botão "X" dentro do menu
  menuClose.addEventListener("click", function () {
    setMenu(false);
  });

  // Clicar fora do menu (no overlay) também fecha
  menuOverlay.addEventListener("click", function () {
    setMenu(false);
  });

  // Tecla Esc fecha o menu (bónus de acessibilidade)
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileNav.classList.contains("is-open")) {
      setMenu(false);
    }
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

  /* ============================================================
     TABELA DE COMPARAÇÃO DE PLANOS — versão responsiva (expansão)
     ============================================================ */
  var table = document.getElementById("plansTable");
  table.innerHTML = ""; // limpa

  // --- Cabeçalho ---
  var thead = document.createElement("thead");
  var headerRow = document.createElement("tr");

  // Coluna para o ícone de expansão
  var thIcon = document.createElement("th");
  thIcon.className = "checkbox-cell";
  thIcon.textContent = "";
  headerRow.appendChild(thIcon);

  // Coluna do rótulo (sempre visível)
  var thLabel = document.createElement("th");
  thLabel.textContent = "Comparativo dos Planos";
  headerRow.appendChild(thLabel);

  // Colunas dos planos
  data.plans.forEach(function (plan, idx) {
    var th = document.createElement("th");
    th.innerHTML =
      escapeHtml(plan.name) +
      (plan.highlight ? ' <span style="color: var(--gold)">★</span>' : "");
    // Aplicar classes de responsividade
    if (idx >= 1) th.classList.add("hide-xs");
    if (idx >= 2) th.classList.add("hide-sm");
    if (idx >= 3) th.classList.add("hide-md");
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // --- Corpo da tabela ---
  var tbody = document.createElement("tbody");

  data.planRows.forEach(function (row, rowIndex) {
    var tr = document.createElement("tr");

    // Coluna do ícone de expansão
    var tdIcon = document.createElement("td");
    tdIcon.className = "checkbox-cell";
    var expandBtn = document.createElement("span");
    expandBtn.className = "expand-btn plus";
    expandBtn.setAttribute("data-expand", "");
    // Inicialmente escondido (só aparece se houver colunas ocultas)
    expandBtn.style.display = "none";
    expandBtn.innerHTML = '<svg class="icon"><use href="#i-plus" /></svg>';
    tdIcon.appendChild(expandBtn);
    tr.appendChild(tdIcon);

    // Coluna do rótulo (sempre visível)
    var tdLabel = document.createElement("th");
    tdLabel.scope = "row";
    tdLabel.textContent = row.label;
    tr.appendChild(tdLabel);

    // Colunas dos valores (planos)
    row.values.forEach(function (value, idx) {
      var td = document.createElement("td");
      td.textContent = value;
      if (idx >= 1) td.classList.add("hide-xs");
      if (idx >= 2) td.classList.add("hide-sm");
      if (idx >= 3) td.classList.add("hide-md");
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  // --- Lógica de expansão/contração ---
  function toggleDetails(rowElement, expandBtn) {
    var nextRow = rowElement.nextElementSibling;
    if (nextRow && nextRow.classList.contains("details-row")) {
      // Fechar
      nextRow.remove();
      expandBtn.className = "expand-btn plus";
      expandBtn.innerHTML = '<svg class="icon"><use href="#i-plus" /></svg>';
      return;
    }

    var cells = rowElement.querySelectorAll("td, th");
    var planNames = data.plans.map(function (p) { return p.name; });

    // Descobrir apenas as colunas de planos que estão ocultas neste momento
    var hiddenIndexes = [];
    for (var i = 2; i < cells.length; i++) {
      if (window.getComputedStyle(cells[i]).display === "none") {
        hiddenIndexes.push(i);
      }
    }

    // Se não houver nada oculto, não há o que mostrar em detalhe
    if (hiddenIndexes.length === 0) return;

    // Abrir: construir linha de detalhes apenas com as colunas ocultas
    var detailRow = document.createElement("tr");
    detailRow.className = "details-row";

    var detailHtml = '<div class="details-grid">';
    hiddenIndexes.forEach(function (i) {
      var planIdx = i - 2;
      var iconId = "i-" + ["building", "briefcase", "star", "shield"][planIdx % 4];
      detailHtml +=
        '<div class="details-item"><svg class="icon"><use href="#' +
        iconId +
        '" /></svg><strong>' +
        escapeHtml(planNames[planIdx] || "Plano " + (planIdx + 1)) +
        ":</strong> " +
        escapeHtml(cells[i].textContent) +
        "</div>";
    });
    detailHtml += "</div>";

    var tdDetail = document.createElement("td");
    tdDetail.colSpan = cells.length;
    tdDetail.className = "details-cell";
    tdDetail.innerHTML = detailHtml;
    detailRow.appendChild(tdDetail);

    rowElement.after(detailRow);

    expandBtn.className = "expand-btn minus";
    expandBtn.innerHTML = '<svg class="icon"><use href="#i-minus" /></svg>';
  }

  // Adicionar eventos de clique aos botões de expansão
  table.querySelectorAll("[data-expand]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var tr = this.closest("tr");
      toggleDetails(tr, this);
    });
  });

  // --- Função para controlar a visibilidade do ícone de expansão (responsive) ---
  function checkResponsive() {
    var rows = table.querySelectorAll("tbody tr:not(.details-row)");
    rows.forEach(function (row) {
      var cells = row.querySelectorAll("td, th");
      // A primeira célula é o ícone, a segunda é o rótulo, as restantes são os valores dos planos
      var expandBtn = row.querySelector("[data-expand]");
      if (!expandBtn) return;

      // Verificar se alguma das colunas de valor (índice 2 em diante) está oculta
      var hasHidden = false;
      for (var i = 2; i < cells.length; i++) {
        if (cells[i] && window.getComputedStyle(cells[i]).display === "none") {
          hasHidden = true;
          break;
        }
      }

      if (hasHidden) {
        expandBtn.style.display = "inline-flex";
      } else {
        expandBtn.style.display = "none";
        // Se houver uma linha de detalhe aberta, remove-a
        var nextRow = row.nextElementSibling;
        if (nextRow && nextRow.classList.contains("details-row")) {
          nextRow.remove();
          expandBtn.className = "expand-btn plus";
          expandBtn.innerHTML = '<svg class="icon"><use href="#i-plus" /></svg>';
        }
      }
    });
  }

  // Executar a verificação inicial
  checkResponsive();

  // Reavaliar quando a janela for redimensionada
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      // Remover todas as linhas de detalhe abertas (para evitar desalinhamento)
      document.querySelectorAll(".details-row").forEach(function (row) {
        var prevRow = row.previousElementSibling;
        if (prevRow) {
          var btn = prevRow.querySelector("[data-expand]");
          if (btn && btn.classList.contains("minus")) {
            row.remove();
            btn.className = "expand-btn plus";
            btn.innerHTML = '<svg class="icon"><use href="#i-plus" /></svg>';
          }
        }
      });
      checkResponsive();
    }, 250);
  });

  /* --- Fim da tabela responsiva --- */

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

  /* ============================================================
     ASSISTENTE IA
     ============================================================ */
  (function initAIAssistant() {
    // Verificar se o assistente está habilitado
    var aiConfig = data.aiAssistant;
    if (!aiConfig || !aiConfig.enabled) {
      return;
    }

    var chatToggle = document.getElementById('chat-toggle');
    var chatBox = document.getElementById('chat-box');
    var chatClose = document.getElementById('chat-close');
    var chatInput = document.getElementById('chat-input');
    var chatSend = document.getElementById('chat-send');
    var messagesContainer = document.getElementById('chat-messages');

    var welcomeMsg = aiConfig.welcomeMessage || "Olá! Como posso ajudar?";
    var systemPrompt = aiConfig.systemPrompt || "Você é um assistente útil.";
    var apiEndpoint = aiConfig.apiEndpoint || "/.netlify/functions/chat";

    // Estado do chat
    var isOpen = false;
    var isProcessing = false;

    // Função para alternar o chat
    function toggleChat() {
      isOpen = !isOpen;
      if (isOpen) {
        chatBox.style.display = 'flex';
        chatInput.focus();
        // Se não houver mensagens, mostrar boas-vindas
        if (messagesContainer.children.length === 0) {
          appendMessage('assistant', welcomeMsg);
        }
      } else {
        chatBox.style.display = 'none';
      }
    }

    // Abrir/fechar
    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', function() {
      isOpen = false;
      chatBox.style.display = 'none';
    });

    // Fechar com Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        chatBox.style.display = 'none';
        chatToggle.focus();
      }
    });

    // Função para adicionar mensagem
    function appendMessage(role, text) {
      var div = document.createElement('div');
      div.className = 'chat-message chat-message--' + role;

      var bubble = document.createElement('div');
      bubble.className = 'chat-bubble';

      // Processar URLs para links clicáveis
      var formattedText = text.replace(
        /(https?:\/\/[^\s]+)/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
      );
      bubble.innerHTML = formattedText;

      div.appendChild(bubble);
      messagesContainer.appendChild(div);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Função para mostrar indicador de digitação
    function showTypingIndicator() {
      var div = document.createElement('div');
      div.className = 'chat-typing';
      div.id = 'typing-indicator';

      var bubble = document.createElement('div');
      bubble.className = 'chat-bubble';

      var dots = document.createElement('div');
      dots.className = 'chat-typing-dots';
      dots.innerHTML = '<span></span><span></span><span></span>';

      var label = document.createElement('span');
      label.textContent = 'Digitando';

      bubble.appendChild(dots);
      bubble.appendChild(label);
      div.appendChild(bubble);
      messagesContainer.appendChild(div);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Função para remover indicador de digitação
    function removeTypingIndicator() {
      var indicator = document.getElementById('typing-indicator');
      if (indicator) indicator.remove();
    }

    // Função para enviar mensagem
    async function sendMessage() {
      var message = chatInput.value.trim();
      if (!message || isProcessing) return;

      // Desabilitar input durante o processamento
      isProcessing = true;
      chatInput.disabled = true;
      chatSend.disabled = true;

      // Adicionar mensagem do usuário
      appendMessage('user', message);
      chatInput.value = '';

      // Mostrar indicador de digitação
      showTypingIndicator();

      try {
        var response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message,
            systemPrompt: systemPrompt
          })
        });

        var data = await response.json();

        // Remover indicador de digitação
        removeTypingIndicator();

        if (data.error) {
          appendMessage('assistant', '⚠️ ' + data.error);
        } else if (data.reply) {
          appendMessage('assistant', data.reply);
        } else {
          appendMessage('assistant', '⚠️ Desculpe, não consegui processar sua pergunta. Tente novamente.');
        }
      } catch (error) {
        removeTypingIndicator();
        appendMessage('assistant', '⚠️ Não foi possível conectar ao assistente. Verifique sua conexão e tente novamente.');
        console.error('Erro no chat:', error);
      } finally {
        isProcessing = false;
        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.focus();
      }
    }

    // Event listeners
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Inicializar com mensagem de boas-vindas após um pequeno delay
    // (apenas se o chat estiver aberto)
    setTimeout(function() {
      if (messagesContainer.children.length === 0) {
        appendMessage('assistant', welcomeMsg);
      }
    }, 300);

    // Limpar mensagens ao fechar? Não, mantemos o histórico.
  })();
