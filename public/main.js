  document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");
    if (!app) return;

    /* =========================
       HTML
    ========================= */

    app.innerHTML = `
      <h1 class="headline">
        Wo Fantasie lebendig wird
        <span class="subtitle">eine Geschichte nur für dein Kind</span>
      </h1>

      <p class="subline">
        Gestalte Schritt für Schritt ein liebevolles, individuelles Kinderbuch –
        voller Abenteuer, Gefühl und Fantasie.
      </p>

      <form id="storyForm" enctype="multipart/form-data">

        <h2>Hauptfigur</h2>

        <label>Name des Kindes
          <input type="text" name="childName" required>
        </label>

        <label>Alter
          <input type="number" name="age" min="0" max="18" required>
        </label>

        
<label>Geschlecht
  <select name="gender" required>
    <option value="">Bitte auswählen</option>
    <option value="maennlich">Junge</option>
    <option value="weiblich">Mädchen</option>
    <option value="divers">Divers</option>
  </select>
</label>

        <label>Augenfarbe
          <select name="eyeColor" required>
            <option value="">Bitte auswählen</option>
            <option>Blau</option>
            <option>Grün</option>
            <option>Braun</option>
            <option>Grau</option>
          </select>
        </label>

        <label>Haarfarbe
          <select name="hairColor" required>
            <option>Blond</option>
            <option>Braun</option>
            <option>Schwarz</option>
            <option>Rot</option>
            <option>Andere</option>
          </select>
        </label>
        

        <h3>Outfit der Hauptfigur</h3>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;max-width:420px;">

  <label>Oberteil
    <select name="topType" required>
      <option value="">Bitte wählen</option>
      <option value="tshirt">T-Shirt</option>
      <option value="hoodie">Hoodie</option>
    </select>
  </label>

  <label>Farbe Oberteil
    <select name="topColor" required>
      <option value="">Bitte wählen</option>
      <option value="rot">Rot</option>
      <option value="blau">Blau</option>
      <option value="grün">Grün</option>
      <option value="gelb">Gelb</option>
      <option value="weiß">Weiß</option>
    </select>
  </label>

  <label>Hose
    <select name="pantsColor" required>
      <option value="">Bitte wählen</option>
      <option value="schwarz">Schwarz</option>
      <option value="grau">Grau</option>
      <option value="blau">Blau</option>
    </select>
  </label>

</div>



        <fieldset>
  <legend>Charaktereigenschaften (max. 3)</legend>

  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">

    <div>
      <strong>🌟 Stärkende Eigenschaften</strong><br>
      <label><input type="checkbox" name="traits" value="mutig"> Mutig</label><br>
      <label><input type="checkbox" name="traits" value="freundlich"> Freundlich</label><br>
      <label><input type="checkbox" name="traits" value="hilfsbereit"> Hilfsbereit</label><br>
      <label><input type="checkbox" name="traits" value="kreativ"> Kreativ</label><br>
      <label><input type="checkbox" name="traits" value="abenteuerlustig"> Abenteuerlustig</label><br>
      <label><input type="checkbox" name="traits" value="geduldig"> Geduldig</label><br>
      <label><input type="checkbox" name="traits" value="aufmerksam"> Aufmerksam</label><br>
      <label><input type="checkbox" name="traits" value="selbstbewusst"> Selbstbewusst</label>
    </div>

    <div>
      <strong>🌱 Herausfordernde Eigenschaften</strong><br>
      <label><input type="checkbox" name="traits" value="aengstlich"> Ängstlich</label><br>
      <label><input type="checkbox" name="traits" value="schuechtern"> Schüchtern</label><br>
      <label><input type="checkbox" name="traits" value="unsicher"> Unsicher</label><br>
      <label><input type="checkbox" name="traits" value="impulsiv"> Impulsiv</label><br>
      <label><input type="checkbox" name="traits" value="ungeduldig"> Ungeduldig</label><br>
      <label><input type="checkbox" name="traits" value="leicht_ablenkbar"> Leicht ablenkbar</label><br>
      <label><input type="checkbox" name="traits" value="starrkoepfig"> Starrköpfig</label><br>
      <label><input type="checkbox" name="traits" value="traurig"> Traurig</label>
    </div>

  </div>
</fieldset>



        <h2>Weitere Personen (optional)</h2>
        <div id="extraCharacters"></div>
        <button type="button" id="addCharacterBtn">➕ Weitere Person hinzufügen</button>
        

        <h2>Die Geschichte</h2>

        <label>Moral
  <select name="moral" required>
    <option value="">Bitte auswählen</option>

    <optgroup label="🤝 Miteinander">
      <option value="freundschaft">Freundschaft</option>
      <option value="zusammenhalt">Zusammenhalt</option>
      <option value="hilfsbereitschaft">Hilfsbereitschaft</option>
    </optgroup>

    <optgroup label="🧠 Inneres Wachstum">
      <option value="mut">Mut zeigen</option>
      <option value="selbstannahme">Sich selbst annehmen</option>
      <option value="durchhalten">Nicht aufgeben</option>
    </optgroup>

    <optgroup label="💬 Werte">
      <option value="ehrlichkeit">Ehrlichkeit</option>
      <option value="respekt">Respekt vor anderen</option>
      <option value="verantwortung">Verantwortung übernehmen</option>
      <option value="einfach_schoen">Einfach eine schöne Geschichte</option>

    </optgroup>
  </select>
</label>


        <label>Lernziel
  <select name="learningGoal" required>
    <option value="">Bitte auswählen</option>

    <optgroup label="🧠 Emotionale Entwicklung">
      <option value="selbstvertrauen_staerken">Selbstvertrauen stärken</option>
      <option value="aengste_bewaeltigen">Ängste bewältigen</option>
      <option value="emotionen_verstehen">Gefühle verstehen</option>
    </optgroup>

    <optgroup label="🤝 Soziales Lernen">
      <option value="freundschaft_empatie">Freundschaft & Empathie</option>
      <option value="konflikte_loesen">Konflikte lösen</option>
      <option value="zusammenhalt">Zusammenhalt & Teamgeist</option>
    </optgroup>

    <optgroup label="🌱 Persönliche Entwicklung">
      <option value="verantwortung">Verantwortung übernehmen</option>
      <option value="durchhalten">Durchhaltevermögen</option>
      <option value="entscheidungen">Eigene Entscheidungen treffen</option>
    </optgroup>

    <optgroup label="✨ Kreativität & Leichtigkeit">
      <option value="fantasie">Fantasie anregen</option>
      <option value="neugier">Neugier & Entdecken</option>
      <option value="einfach_lustig">Einfach eine schöne Geschichte</option>
    </optgroup>
  </select>
</label>


       <label>Ton
  <select name="tone" required>
    <option value="">Bitte auswählen</option>
    <option value="ruhig">Ruhig</option>
    <option value="lustig">Lustig</option>
    <option value="spannend">Spannend</option>
    <option value="abenteuerlich">Abenteuerlich</option>

    <option value="warm_geborgen">Warm & geborgen</option>
    <option value="sanft_vertraeumt">Sanft & verträumt</option>
    <option value="mutmachend">Mutmachend</option>
  </select>
</label>


        <label>Animationsstil
  <select name="animationStyle" required>
    <option value="">Bitte auswählen</option>
    <option value="zeichentrick">Zeichentrick (klassisch)</option>
    <option value="lego">LEGO-Welt</option>
    <option value="aquarell">Bilderbuch-Aquarell</option>
  </select>
</label>



        <label>Länge der Geschichte
          <select name="storyLength" required>
            <option value="">Bitte auswählen</option>
            <option value="test">🎨 Stil-Test (2 Seiten / 2 Bilder)</option>
            <option value="kurz">Kurz (8 Seiten)</option>
            <option value="mittel">Mittel (12 Seiten)</option>
            <option value="lang">Lang (16 Seiten)</option>
          </select>
        </label>

        <label>Was passiert in deiner Geschichte? (optional)
          <textarea name="storyHint" rows="4"></textarea>
        </label>

        <label>Foto der Hauptfigur
          <input type="file" name="mainImage" accept="image/*" required>
        </label>

        <button type="submit" id="submitBtn">📖 Buch erstellen</button>

        <div id="loading" style="display:none;margin-top:20px;font-weight:bold;">
          ✨ Geschichte wird geschrieben…
          <div id="imageProgress" style="margin-top:6px;font-weight:normal;"></div>
        </div>
      </form>

      <div id="storyBook" style="display:none;margin-top:40px;">
        <h2 style="text-align:center;">📖 Deine Geschichte</h2>
        <div id="pageCounter" style="text-align:center;margin-bottom:10px;"></div>
        <div id="storyPage" style="background:#fff;padding:30px;border-radius:12px;"></div>
        <div id="imageContainer" style="margin-top:16px;text-align:center;"></div>
        <div style="display:flex;justify-content:space-between;margin-top:20px;">
          <button id="prevPageBtn">⬅ Zurück</button>
          <button id="nextPageBtn">Weiter ➡</button>
        </div>
      </div>
    `;

    /* =========================
       STATE
    ========================= */

    const form = document.getElementById("storyForm");
    const submitBtn = document.getElementById("submitBtn");
    const loading = document.getElementById("loading");
    const imageProgress = document.getElementById("imageProgress");

    const storyBook = document.getElementById("storyBook");
    const storyPage = document.getElementById("storyPage");
    const imageContainer = document.getElementById("imageContainer");
    const pageCounter = document.getElementById("pageCounter");
    const prevPageBtn = document.getElementById("prevPageBtn");
    const nextPageBtn = document.getElementById("nextPageBtn");

    const extraCharactersDiv = document.getElementById("extraCharacters");
    const addCharacterBtn = document.getElementById("addCharacterBtn");

    let pages = [];
    let imagePrompts = [];
    let images = [];
    let currentPage = 0;
    let queueRunId = 0;
    let mainImagePath = null;

    const IMAGE_DELAY_MS = 20000;

    /* =========================
       TRAITS LIMIT (MAX 3)
    ========================= */

    const traitCheckboxes = document.querySelectorAll('input[name="traits"]');

    traitCheckboxes.forEach(cb => {
      cb.addEventListener("change", () => {
        const checked = document.querySelectorAll('input[name="traits"]:checked');
        if (checked.length > 3) {
          cb.checked = false;
          alert("Bitte maximal 3 Charaktereigenschaften auswählen.");
        }
      });
    });


    /* =========================
       IMAGE QUEUE (SAUBER)
    ========================= */
  
    async function startImageQueue(runId) {
      for (let i = 0; i < imagePrompts.length; i++) {
        if (runId !== queueRunId) return;
        if (images[i]) continue;
        
console.log("Frontend mainImagePath:", mainImagePath);

        try {
          const res = await fetch("/api/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
  prompt: imagePrompts[i],
  mainImagePath: mainImagePath,
}),
          });

          const data = await res.json();
        

          if (data?.imageUrl) {
            images[i] = data.imageUrl;
          } else if (data?.imageBase64) {
            images[i] = `data:image/png;base64,${data.imageBase64}`;
          }

          if (images[i]) {
            imageProgress.textContent =
              `🖼️ Bilder: ${images.filter(Boolean).length}/${imagePrompts.length}`;
            if (i === currentPage) renderPage();
          }
        } catch (err) {
          console.error("❌ Image Queue Fehler:", err);
        }

        if (i < imagePrompts.length - 1) {
          await new Promise(r => setTimeout(r, IMAGE_DELAY_MS));
        }
      }
    }

  /* =========================
   RENDER
========================= */

function renderPage() {
  if (!pages || !pages.length || pages[currentPage] == null) return;

  storyPage.innerHTML = pages[currentPage]
    .split("\n")
    .map(p => `<p>${p}</p>`)
    .join("");

  pageCounter.textContent = `Seite ${currentPage + 1} von ${pages.length}`;

  imageContainer.innerHTML = images[currentPage]
    ? `<img src="${images[currentPage]}" style="max-width:100%;border-radius:12px;">`
    : `<em>🕒 Bild wird generiert…</em>`;
}

    prevPageBtn.onclick = () => {
      if (currentPage > 0) {
        currentPage--;
        renderPage();
      }
    };

    nextPageBtn.onclick = () => {
      if (currentPage < pages.length - 1) {
        currentPage++;
        renderPage();
      }
    };

    /* =========================
       SUBMIT
    ========================= */

    form.onsubmit = async (e) => {
      e.preventDefault();
      queueRunId++;

      submitBtn.disabled = true;
      loading.style.display = "block";
      storyBook.style.display = "none";
      imageProgress.textContent = "";

      const formData = new FormData(form);

      formData.append("storyData", JSON.stringify({
        child: {
          name: formData.get("childName"),
          age: formData.get("age"),
          eyeColor: formData.get("eyeColor"),
          hairColor: formData.get("hairColor"),
          traits: formData.getAll("traits"),

          outfit: {
            topType: formData.get("topType"),     // tshirt | hoodie
            topColor: formData.get("topColor"),   // rot | blau | grün | gelb | weiß
            pantsColor: formData.get("pantsColor") // schwarz | grau | blau
          }
        },


        story: {
          moral: formData.get("moral"),
          learningGoal: formData.get("learningGoal"),
          tone: formData.get("tone"),
          length: formData.get("storyLength"),
          storyHint: formData.get("storyHint"),
        },
        style: { animationStyle: formData.get("animationStyle") }
      }));


      const res = await fetch("/api/story", { method: "POST", body: formData });
      const data = await res.json();
      console.log("STORY RESPONSE:", data);
console.log("STORY LENGTH:", data.story?.length);
console.log("IMAGE PROMPTS LENGTH:", data.imagePrompts?.length);
console.log("MAIN IMAGE PATH:", data.mainImagePath);
      currentPage = 0;


      mainImagePath = data.mainImagePath;
      pages = data.story
  .split(/Seite\s+\d+:\s*/)
  .map(p => p.trim())
  .filter(p => p.length > 0);
      imagePrompts = data.imagePrompts;
      images = new Array(imagePrompts.length).fill(null);

      loading.style.display = "none";
      storyBook.style.display = "block";
      submitBtn.disabled = false;

      renderPage();
      startImageQueue(queueRunId);
    };
  });
