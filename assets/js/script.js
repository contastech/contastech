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

  menuClose.addEventListener("click", function () {
    setMenu(false);
  });

  menuOverlay.addEventListener("click", function () {
    setMenu(false);
  });

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
  table.innerHTML = "";

  var thead = document.createElement("thead");
  var headerRow = document.createElement("tr");

  var thIcon = document.createElement("th");
  thIcon.className = "checkbox-cell";
  thIcon.textContent = "";
  headerRow.appendChild(thIcon);

  var thLabel = document.createElement("th");
  thLabel.textContent = "Comparativo dos Planos";
  headerRow.appendChild(thLabel);

  data.plans.forEach(function (plan, idx) {
    var th = document.createElement("th");
    th.innerHTML =
      escapeHtml(plan.name) +
      (plan.highlight ? ' <span style="color: var(--gold)">★</span>' : "");
    if (idx >= 1) th.classList.add("hide-xs");
    if (idx >= 2) th.classList.add("hide-sm");
    if (idx >= 3) th.classList.add("hide-md");
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  var tbody = document.createElement("tbody");

  data.planRows.forEach(function (row, rowIndex) {
    var tr = document.createElement("tr");

    var tdIcon = document.createElement("td");
    tdIcon.className = "checkbox-cell";
    var expandBtn = document.createElement("span");
    expandBtn.className = "expand-btn plus";
    expandBtn.setAttribute("data-expand", "");
    expandBtn.style.display = "none";
    expandBtn.innerHTML = '<svg class="icon"><use href="#i-plus" /></svg>';
    tdIcon.appendChild(expandBtn);
    tr.appendChild(tdIcon);

    var tdLabel = document.createElement("th");
    tdLabel.scope = "row";
    tdLabel.textContent = row.label;
    tr.appendChild(tdLabel);

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

  function toggleDetails(rowElement, expandBtn) {
    var nextRow = rowElement.nextElementSibling;
    if (nextRow && nextRow.classList.contains("details-row")) {
      nextRow.remove();
      expandBtn.className = "expand-btn plus";
      expandBtn.innerHTML = '<svg class="icon"><use href="#i-plus" /></svg>';
      return;
    }

    var cells = rowElement.querySelectorAll("td, th");
    var planNames = data.plans.map(function (p) { return p.name; });

    var hiddenIndexes = [];
    for (var i = 2; i < cells.length; i++) {
      if (window.getComputedStyle(cells[i]).display === "none") {
        hiddenIndexes.push(i);
      }
    }

    if (hiddenIndexes.length === 0) return;

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

  table.querySelectorAll("[data-expand]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var tr = this.closest("tr");
      toggleDetails(tr, this);
    });
  });

  function checkResponsive() {
    var rows = table.querySelectorAll("tbody tr:not(.details-row)");
    rows.forEach(function (row) {
      var cells = row.querySelectorAll("td, th");
      var expandBtn = row.querySelector("[data-expand]");
      if (!expandBtn) return;

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
        var nextRow = row.nextElementSibling;
        if (nextRow && nextRow.classList.contains("details-row")) {
          nextRow.remove();
          expandBtn.className = "expand-btn plus";
          expandBtn.innerHTML = '<svg class="icon"><use href="#i-plus" /></svg>';
        }
      }
    });
  }

  checkResponsive();

  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
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

  /* ============================================================
     ASSISTENTE IA — FUNCIONAL SEM API (apenas dados locais)
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
    var isOpen = false;
    var isProcessing = false;

    // ---- CONSTRUIR BASE DE CONHECIMENTO A PARTIR DO data.js ----
    var knowledgeBase = {
      // Serviços
      servicos: data.services.map(function(s) {
        return {
          titulo: s.title.toLowerCase(),
          descricao: s.description.toLowerCase(),
          items: s.items.map(function(i) { return i.toLowerCase(); })
        };
      }),
      // Diferenciais
      diferenciais: data.differentials.map(function(d) {
        return {
          titulo: d.title.toLowerCase(),
          descricao: d.description.toLowerCase()
        };
      }),
      // Pilares (Missão, Visão, Propósito)
      pilares: data.pillars.map(function(p) {
        return {
          titulo: p.title.toLowerCase(),
          texto: p.text.toLowerCase()
        };
      }),
      // Planos
      planos: data.plans.map(function(p) {
        return {
          nome: p.name.toLowerCase(),
          perfil: p.profile.toLowerCase(),
          preco: p.price
        };
      }),
      // Informações de contacto
      contactos: {
        telefones: ["959 521 651", "931 059 636", "976 510 057"],
        email: "vladimirolaurindo0@gmail.com",
        localizacao: "Luanda, Viana — Vila Nova, Angola"
      },
      // Setores
      setores: data.sectors.map(function(s) { return s.toLowerCase(); })
    };

    // ---- FUNÇÃO DE BUSCA INTELIGENTE ----
    function encontrarResposta(pergunta) {
      var perguntaLower = pergunta.toLowerCase();
      var respostas = [];

      // 1. Verificar se pergunta sobre serviços
      var servicosEncontrados = knowledgeBase.servicos.filter(function(s) {
        return perguntaLower.includes(s.titulo) ||
               s.items.some(function(item) { return perguntaLower.includes(item); }) ||
               perguntaLower.includes(s.titulo.replace(/\s/g, ''));
      });

      if (servicosEncontrados.length > 0) {
        var servico = servicosEncontrados[0];
        var servicoOriginal = data.services.find(function(s) {
          return s.title.toLowerCase() === servico.titulo;
        });
        if (servicoOriginal) {
          respostas.push({
            relevancia: 10,
            texto: "🔹 **" + servicoOriginal.title + "**: " + servicoOriginal.description +
                   "\n\n" + servicoOriginal.items.map(function(item) {
                     return "• " + item;
                   }).join("\n")
          });
        }
      }

      // 2. Verificar se pergunta sobre planos
      var planosEncontrados = knowledgeBase.planos.filter(function(p) {
        return perguntaLower.includes(p.nome) ||
               perguntaLower.includes("plano") ||
               perguntaLower.includes("preço") ||
               perguntaLower.includes("valor") ||
               perguntaLower.includes("custo") ||
               perguntaLower.includes("investimento");
      });

      if (planosEncontrados.length > 0 || perguntaLower.includes("plano") || perguntaLower.includes("preço")) {
        var textoPlanos = "📋 **Planos de Serviço Contas Tech:**\n\n";
        data.plans.forEach(function(p) {
          textoPlanos += "**Plano " + p.name + "** — " + p.profile + "\n";
          textoPlanos += "💰 " + p.price + "/mês\n\n";
        });
        textoPlanos += "🔹 Os valores são indicativos e podem variar conforme a complexidade do projeto.";
        respostas.push({
          relevancia: 9,
          texto: textoPlanos
        });
      }

      // 3. Verificar se pergunta sobre diferenciais
      var diffEncontrados = knowledgeBase.diferenciais.filter(function(d) {
        return perguntaLower.includes(d.titulo) ||
               perguntaLower.includes("diferencial") ||
               perguntaLower.includes("vantagem");
      });

      if (diffEncontrados.length > 0) {
        var diffOriginal = data.differentials.find(function(d) {
          return d.title.toLowerCase() === diffEncontrados[0].titulo;
        });
        if (diffOriginal) {
          respostas.push({
            relevancia: 8,
            texto: "✨ **" + diffOriginal.title + "**: " + diffOriginal.description
          });
        }
      }

      // 4. Verificar se pergunta sobre a empresa (missão, visão)
      if (perguntaLower.includes("missão") || perguntaLower.includes("missao")) {
        var missao = data.pillars.find(function(p) { return p.title === "Missão"; });
        if (missao) {
          respostas.push({
            relevancia: 7,
            texto: "🎯 **Missão da Contas Tech**: " + missao.text
          });
        }
      }

      if (perguntaLower.includes("visão") || perguntaLower.includes("visao")) {
        var visao = data.pillars.find(function(p) { return p.title === "Visão"; });
        if (visao) {
          respostas.push({
            relevancia: 7,
            texto: "👁️ **Visão da Contas Tech**: " + visao.text
          });
        }
      }

      if (perguntaLower.includes("propósito") || perguntaLower.includes("proposito")) {
        var proposito = data.pillars.find(function(p) { return p.title === "Propósito"; });
        if (proposito) {
          respostas.push({
            relevancia: 7,
            texto: "❤️ **Propósito da Contas Tech**: " + proposito.text
          });
        }
      }

      // 5. Verificar contactos
      if (perguntaLower.includes("contact") ||
          perguntaLower.includes("telefone") ||
          perguntaLower.includes("email") ||
          perguntaLower.includes("localização") ||
          perguntaLower.includes("localizacao") ||
          perguntaLower.includes("onde")) {
        respostas.push({
          relevancia: 7,
          texto: "📞 **Contactos da Contas Tech:**\n\n" +
                 "• Telefones: " + knowledgeBase.contactos.telefones.join(", ") + "\n" +
                 "• E-mail: " + knowledgeBase.contactos.email + "\n" +
                 "• Localização: " + knowledgeBase.contactos.localizacao + "\n\n" +
                 "⏰ Horário: Segunda a sexta, 08h00 – 17h00"
        });
      }

      // 6. Verificar setores
      var setorEncontrado = knowledgeBase.setores.filter(function(s) {
        return perguntaLower.includes(s) || perguntaLower.includes("setor");
      });

      if (setorEncontrado.length > 0 && perguntaLower.includes("setor")) {
        respostas.push({
          relevancia: 6,
          texto: "🏢 **Setores que a Contas Tech acompanha:**\n\n" +
                 data.sectors.map(function(s) { return "• " + s; }).join("\n")
        });
      }

      // 7. Resposta geral sobre a empresa
      if (perguntaLower.includes("contas tech") ||
          perguntaLower.includes("empresa") ||
          perguntaLower.includes("sobre") ||
          perguntaLower.includes("quem")) {
        respostas.push({
          relevancia: 5,
          texto: "🏢 **Sobre a Contas Tech:**\n\n" +
                 "A CONTAS TECH Prestação de Serviços, LDA é uma empresa angolana com sede em Luanda que junta " +
                 "contabilidade e tecnologia. Nascemos para simplificar a vida dos empresários, tratando das " +
                 "obrigações fiscais e construindo ferramentas digitais que fazem a empresa crescer.\n\n" +
                 "• Contabilidade + Tecnologia no mesmo lugar\n" +
                 "• Equipe qualificada com experiência prática\n" +
                 "• Atendimento personalizado e linguagem simples"
        });
      }

      // Ordenar por relevância e pegar a melhor
      if (respostas.length > 0) {
        respostas.sort(function(a, b) { return b.relevancia - a.relevancia; });
        return {
          encontrou: true,
          texto: respostas[0].texto
        };
      }

      // Se não encontrou nada relacionado
      return {
        encontrou: false,
        texto: null
      };
    }

    // ---- FUNÇÃO PARA GERAR MENSAGEM DE FALTA DE RESPOSTA ----
    function gerarMensagemSemResposta(pergunta) {
      return "🙏 **Agradecemos a sua pergunta!**\n\n" +
             "Esta é uma questão mais específica que requer a atenção de um dos nossos especialistas.\n\n" +
             "📞 **Entre em contacto connosco:**\n" +
             "• WhatsApp: (244) 959 521 651\n" +
             "• Telefone: (244) 931 059 636\n" +
             "• E-mail: vladimirolaurindo0@gmail.com\n\n" +
             "Teremos todo o gosto em ajudar com mais detalhes!";
    }

    // ---- FUNÇÕES DO CHAT ----
    function toggleChat() {
      isOpen = !isOpen;
      if (isOpen) {
        chatBox.style.display = 'flex';
        chatInput.focus();
        if (messagesContainer.children.length === 0) {
          appendMessage('assistant', welcomeMsg);
        }
      } else {
        chatBox.style.display = 'none';
      }
    }

    chatToggle.addEventListener('click', toggleChat);
    chatClose.addEventListener('click', function() {
      isOpen = false;
      chatBox.style.display = 'none';
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        chatBox.style.display = 'none';
        chatToggle.focus();
      }
    });

    function appendMessage(role, text) {
      var div = document.createElement('div');
      div.className = 'chat-message chat-message--' + role;

      var bubble = document.createElement('div');
      bubble.className = 'chat-bubble';
      bubble.innerHTML = text.replace(/\n/g, '<br>');

      div.appendChild(bubble);
      messagesContainer.appendChild(div);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

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
      label.textContent = 'A pesquisar...';

      bubble.appendChild(dots);
      bubble.appendChild(label);
      div.appendChild(bubble);
      messagesContainer.appendChild(div);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTypingIndicator() {
      var indicator = document.getElementById('typing-indicator');
      if (indicator) indicator.remove();
    }

    function sendMessage() {
      var message = chatInput.value.trim();
      if (!message || isProcessing) return;

      isProcessing = true;
      chatInput.disabled = true;
      chatSend.disabled = true;

      appendMessage('user', message);
      chatInput.value = '';

      showTypingIndicator();

      // Pequeno delay para simular processamento
      setTimeout(function() {
        removeTypingIndicator();

        var resultado = encontrarResposta(message);

        if (resultado.encontrou) {
          appendMessage('assistant', resultado.texto);
        } else {
          appendMessage('assistant', gerarMensagemSemResposta(message));
        }

        isProcessing = false;
        chatInput.disabled = false;
        chatSend.disabled = false;
        chatInput.focus();
      }, 600);
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Mensagem de boas-vindas inicial
    setTimeout(function() {
      if (messagesContainer.children.length === 0) {
        appendMessage('assistant', welcomeMsg);
      }
    }, 300);
  })();

})();
