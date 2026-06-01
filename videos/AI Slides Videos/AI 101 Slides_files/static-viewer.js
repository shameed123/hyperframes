(function () {
  var slides = [
    ["cover.html", "Cover"],
    ["about-sohail-hameed.html", "About Sohail Hameed"],
    ["pure-ai-promo.html", "Pure AI Automation"],
    ["mic-muted.html", "Microphones Muted"],
    ["check-chat.html", "Check Chat"],
    ["intelligence.html", "Intelligence"],
    ["human-brain.html", "Human Brain"],
    ["why-now.html", "Why Now"],
    ["agenda.html", "Agenda"],
    ["what-is-ai.html", "What Is AI"],
    ["narrow-vs-generative.html", "Narrow vs Generative"],
    ["ai-agi-asi.html", "AI, AGI, and ASI"],
    ["brain-inspiration.html", "Brain Inspiration"],
    ["artificial-neuron.html", "Artificial Neuron"],
    ["neural-network.html", "Neural Network"],
    ["training.html", "Training"],
    ["inference.html", "Inference"],
    ["model-families.html", "Model Families"],
    ["what-is-llm.html", "What Is an LLM"],
    ["check-chat.html", "Check Chat"],
    ["tokens-context.html", "Tokens and Context"],
    ["prompts-temperature.html", "Prompts and Temperature"],
    ["chat-assistant.html", "Chat Assistant"],
    ["chat-assistant-landscape.html", "Chat Assistant Landscape"],
    ["llm-simple-flow.html", "LLM Simple Flow"],
    ["llm-rich-input.html", "LLM Rich Input"],
    ["ai-agent.html", "AI Agent"],
    ["llm-vs-assistant-vs-agent.html", "LLM vs Assistant vs Agent"],
    ["agent-uses-llm-tools.html", "Agent Uses LLM and Tools"],
    ["tools-skills.html", "Tools and Skills"],
    ["coding-agents.html", "Coding Agents"],
    ["coding-agent-landscape.html", "Coding Agent Landscape"],
    ["mcp-servers.html", "MCP Servers"],
    ["agent-mcp-server.html", "Agent and MCP Server"],
    ["api.html", "API"],
    ["api-provider-landscape.html", "API Provider Landscape"],
    ["glossary.html", "Glossary"],
    ["use-cases.html", "Use Cases"],
    ["coding-automation.html", "Coding Automation"],
    ["assistant-ecosystem.html", "Assistant Ecosystem"],
    ["responsible-use.html", "Responsible Use"],
    ["getting-started.html", "Getting Started"],
    ["recap.html", "Recap"]
  ];

  var current = 0;
  var resizeObserver = null;

  function slidePath(index) {
    return "./AI 101 Slides_files/" + slides[index][0];
  }

  function render() {
    document.title = "AI 101 Slides";
    document.body.innerHTML =
      '<div class="static-slide-viewer">' +
      '  <header class="static-slide-toolbar">' +
      '    <div class="static-slide-title">AI 101 Slides</div>' +
      '    <div class="static-slide-status" id="staticSlideStatus"></div>' +
      '    <div class="static-slide-actions">' +
      '      <button class="static-slide-button" id="staticPrev" type="button" aria-label="Previous slide">&#8592;</button>' +
      '      <select class="static-slide-select" id="staticSlideSelect" aria-label="Choose slide"></select>' +
      '      <button class="static-slide-button" id="staticNext" type="button" aria-label="Next slide">&#8594;</button>' +
      '    </div>' +
      '  </header>' +
      '  <main class="static-slide-stage">' +
      '    <div class="static-slide-frame-wrap">' +
      '      <div class="static-slide-frame-scale" id="staticSlideScale">' +
      '        <iframe class="static-slide-frame" id="staticSlideFrame" title="Current slide"></iframe>' +
      '      </div>' +
      '    </div>' +
      '  </main>' +
      '</div>';

    var select = document.getElementById("staticSlideSelect");
    slides.forEach(function (slide, index) {
      var option = document.createElement("option");
      option.value = String(index);
      option.textContent = index + 1 + ". " + slide[1];
      select.appendChild(option);
    });

    document.getElementById("staticPrev").addEventListener("click", function () {
      showSlide(current - 1);
    });
    document.getElementById("staticNext").addEventListener("click", function () {
      showSlide(current + 1);
    });
    select.addEventListener("change", function () {
      showSlide(Number(select.value));
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") showSlide(current - 1);
      if (event.key === "ArrowRight") showSlide(current + 1);
    });

    watchSlideSize();
    showSlide(0);
  }

  function watchSlideSize() {
    var wrap = document.querySelector(".static-slide-frame-wrap");
    var scaleTarget = document.getElementById("staticSlideScale");

    function updateScale() {
      var scale = wrap.clientWidth / 1920;
      scaleTarget.style.setProperty("--static-slide-scale", String(scale));
    }

    updateScale();
    window.addEventListener("resize", updateScale);

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(updateScale);
      resizeObserver.observe(wrap);
    }
  }

  function showSlide(index) {
    if (index < 0 || index >= slides.length) return;
    current = index;
    document.getElementById("staticSlideFrame").src = slidePath(index);
    document.getElementById("staticSlideStatus").textContent =
      "Slide " + (index + 1) + " of " + slides.length + ": " + slides[index][1];
    document.getElementById("staticSlideSelect").value = String(index);
    document.getElementById("staticPrev").disabled = index === 0;
    document.getElementById("staticNext").disabled = index === slides.length - 1;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
