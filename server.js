import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   OPENAI
========================= */
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/* =========================
   MIDDLEWARE
========================= */
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(express.static("public"));

/* =========================
   UPLOADS
========================= */
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
app.use("/uploads", express.static(uploadDir));

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf|txt/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error("Only images, PDFs, and text files are allowed!"));
  },
});

/* =========================
   HELPER – STORY
========================= */

function pagesFromLength(length) {
  if (length === "test") return 2;
  if (length === "kurz") return 8;
  if (length === "mittel") return 12;
  if (length === "lang") return 16;
  return 8;
}

function outlineForLength(length) {
  if (length === "test") {
    return [
      "Einführung der Figur und Situation",
      "Kleines Erlebnis mit emotionalem Abschluss",
    ];
  }

  if (length === "kurz") {
    return [
      "Einführung",
      "Alltag & Gefühl",
      "Auslöser",
      "Zweifel",
      "Erster Versuch",
      "Wendepunkt",
      "Lösung",
      "Ruhiger Abschluss",
    ];
  }

  if (length === "mittel") {
    return [
      "Einführung",
      "Alltag & Welt",
      "Wunsch/Gefühl",
      "Auslöser",
      "Problem wächst",
      "Zweifel",
      "Begegnung/Nebenfigur",
      "Entscheidung",
      "Handlung",
      "Wendepunkt",
      "Lösung",
      "Ruhiger Abschluss",
    ];
  }

  return [
    "Einführung",
    "Atmosphäre",
    "Wunsch/Gefühl",
    "Auslöser",
    "Problem wächst",
    "Erster Rückschlag",
    "Zweifel",
    "Begleitung",
    "Kleiner Erfolg",
    "Verschärfung",
    "Entscheidung",
    "Zweiter Rückschlag",
    "Wendepunkt",
    "Großer Moment",
    "Lösung",
    "Ruhiger Abschluss",
  ];
}

function formatExtraCharacters(extraCharacters = []) {
  if (!extraCharacters.length) return "Keine zusätzlichen Personen.";
  return extraCharacters
    .map((p) => `- ${p.name || "Unbenannt"} (${p.relation || "Bezugsperson"})`)
    .join("\n");
}

function splitStoryIntoPages(storyText) {
  return storyText
    .split(/Seite\s+\d+:/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}


function buildVisualAnchor() {
  return `
VISUAL IDENTITY ANCHOR (verbindlich, unveränderlich):

UMGEBUNG:
- Die gesamte Geschichte spielt in derselben Welt
- Gleiche Umgebung, gleiche Farben, gleicher Stil
- Keine Ortswechsel außerhalb dieser Welt

HAUPTFIGUR:
- Eine klar definierte Hauptfigur
- Gleichbleibende Körperform und Proportionen
- Gleichbleibende Frisur (Form, Länge, Farbe)
- Gleichbleibendes Outfit über alle Seiten hinweg
- Gleichbleibende Gesichtszüge

REGEL:
- Seite 1 legt das visuelle Erscheinungsbild fest
- Alle weiteren Seiten MÜSSEN exakt gleich aussehen
- NUR Handlung, Pose und Emotion dürfen sich ändern
`;
}


/* =========================
   HELPER – IMAGE PROMPT
========================= */

function normStyle(style) {
  return (style || "").toString().toLowerCase().trim();
}

function stylePreset(style) {
  const s = normStyle(style);

  if (s === "lego") {
    // bewusst kurz, aber sehr eindeutig
    return `
A cinematic 3D render of toy brick minifigures in a toy brick environment.
Everything is made of plastic toy bricks.
Minifigure heads are cylindrical with simple faces, blocky bodies, toy hands.
Shiny plastic surfaces, hard edges, bright solid colors.
Dynamic lighting and slightly dramatic atmosphere.
Modern LEGO-style animation look.
No real humans. No skin. No real hair. No fabric.
`.trim();
  }

  if (s === "aquarell") {
    return `
Hand-painted watercolor picture book illustration.
Visible paper texture, soft brush strokes, gentle color washes.
`.trim();
  }

  // default: zeichentrick
  return `
2D cartoon animation frame, clean linework, simple shapes, clear colors.
`.trim();
}

function buildImagePrompt({ pageText, child, tone, animationStyle }) {
  const s = animationStyle?.toLowerCase().trim();
  const isLego = s === "lego";

  const outfitDescription = normalizeOutfit(child.outfit);

  return `
${stylePreset(animationStyle)}

CHARAKTER-FIXIERUNG (auf ALLEN Seiten identisch):
- Alter: ${child.age}
- Augenfarbe: ${child.eyeColor}
- Haarfarbe: ${child.hairColor}
- Outfit: ${outfitDescription}
- Kleidung, Farben und Frisur dürfen sich NICHT ändern

${isLego ? `
DARSTELLUNG:
- LEGO-Minifigur
- Glänzender Kunststoff
- Blockige Formen
- KEINE Haut
- KEINE echten Haare
` : `
DARSTELLUNG:
- Menschliches Kind
- Gleiches Gesicht
- Gleiche Kleidung
- Gleiche Frisur
`}

SZENE (NUR Handlung & Pose ändern):
${pageText}

STIMMUNG:
${tone}

VERBINDLICH:
- Gleiche Welt wie Seite 1
- Gleiches Aussehen der Figur
- Gleiches Outfit auf ALLEN Seiten
- KEIN Text im Bild
- KEINE Schrift
- KEINE Wasserzeichen
- Stil-Vorgaben haben absolute Priorität
`.trim();
}




/* =========================
   ROUTES
========================= */

app.get("/", (_req, res) => {
  res.send("✅ Story & Image Server läuft");
});

/* =========================
   STORY ENDPOINT
========================= */

app.post("/api/story", upload.any(), async (req, res) => {
  try {
    const mainImageFile = (req.files || []).find((f) => f.fieldname === "mainImage");
    const mainImagePath = mainImageFile ? mainImageFile.path : null;

    if (!req.body.storyData) {
      return res.status(400).json({ success: false, message: "storyData fehlt" });
    }

    const storyData = JSON.parse(req.body.storyData);

    const pagesCount = pagesFromLength(storyData.story.length);
    const outline = outlineForLength(storyData.story.length);

    
    function genderRules(gender) {
      if (gender === "weiblich") {
        return `
    GRAMMATIKREGEL (Zwingend):
    - Verwende ausschließlich weibliche Pronomen (sie, ihr)
    - NIEMALS männliche Formen
    `;
      }

      if (gender === "maennlich") {
        return `
    GRAMMATIKREGEL (Zwingend):
    - Verwende ausschließlich männliche Pronomen (er, sein)
    - NIEMALS weibliche Formen
    `;
      }

      return `
    GRAMMATIKREGEL (Zwingend):
    - Verwende geschlechtsneutrale Sprache
    - Nutze den Namen statt Pronomen
    `;
    }

    const systemMsg = `
Du bist ein professioneller Kinderbuchautor mit pädagogischem Hintergrund.
WICHTIG:
- Ausschließlich erzählender Fließtext
- Keine Meta-Kommentare
- Keine Anweisungen im Text
- Warm, kindgerecht, emotional
`.trim();

    const userPrompt = `
Schreibe eine zusammenhängende Kinderbuchgeschichte auf Deutsch.

STRUKTUR:
- Exakt ${pagesCount} Seiten
- Jede Seite beginnt exakt mit: "Seite X:"
- Eine Seite = eine Szene
- 4–7 Sätze pro Seite

SEITENROLLEN:
${outline.map((r, i) => `${i + 1}. ${r}`).join("\n")}

HAUPTFIGUR:
Name: ${storyData.child.name}
Alter: ${storyData.child.age}
Augenfarbe: ${storyData.child.eyeColor}
Haarfarbe: ${storyData.child.hairColor}
Eigenschaften: ${(storyData.child.traits || []).join(", ")}
Geschlecht: ${storyData.child.gender}

${genderRules(storyData.child.gender)}


ZUSÄTZLICHE PERSONEN:
${formatExtraCharacters(storyData.extraCharacters)}

TON:
${storyData.story.tone}

STIL:
${storyData.style.animationStyle}

LERNZIEL (nicht benennen):
${storyData.story.learningGoal}

MORAL (nicht benennen):
${storyData.story.moral}

BESONDERE SITUATION:
${storyData.story.storyHint || "Keine besondere Situation."}

BEGINNE JETZT.
`.trim();

    console.log("STORY style =", storyData?.style?.animationStyle);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMsg },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
    });

    const storyText = completion.choices?.[0]?.message?.content || "";
    const storyPages = splitStoryIntoPages(storyText);

    // 🔒 VISUAL IDENTITY ANCHOR – einmal pro Story erzeugen
    const visualAnchor = buildVisualAnchor();

    const imagePrompts = storyPages.map((pageText, idx) => {
      const p = buildImagePrompt({
        pageText,
        child: storyData.child,
        tone: storyData.story.tone,
        animationStyle: storyData.style.animationStyle,
        visualAnchor, // 🔴 WICHTIG: Anchor mitgeben
      });

      // Debug: nur Anfang loggen, damit Konsole nicht explodiert
      console.log(
        "IMAGE PROMPT page",
        idx + 1,
        "style =",
        storyData.style.animationStyle
      );
      console.log(p.slice(0, 220).replace(/\s+/g, " "), "...");

      return p;
    });

    res.json({
      success: true,
      totalPages: pagesCount,
      story: storyText,
      imagePrompts,
      mainImagePath,
    });

  } catch (err) {
    console.error("❌ Story-Fehler:", err);
    res.status(500).json({ success: false, message: "Fehler bei der Story-Generierung" });
  }
});

/* =========================
   IMAGE ENDPOINT (Queue + 20s)
========================= */

let imageQueue = Promise.resolve();
const IMAGE_DELAY_MS = 20000;

app.post("/api/image", async (req, res) => {
  imageQueue = imageQueue.then(async () => {
    try {
      const { prompt, style } = req.body || {};

      if (!prompt) {
        res.status(400).json({
          success: false,
          message: "Bild-Prompt fehlt",
        });
        return;
      }

      console.log(
        "IMAGE prompt head:",
        String(prompt).slice(0, 160).replace(/\s+/g, " "),
        "..."
      );
      console.log("IMAGE style:", style);

      let image;

      if (style === "lego") {
        image = await openai.images.generate({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
          quality: "high",
          image: fs.createReadStream(
            "./style-anchors/lego/ninjago_reference.jpg"
          ),
        });
      } else {
        image = await openai.images.generate({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
          quality: "high",
        });
      }

      res.json({
        success: true,
        imageBase64: image.data?.[0]?.b64_json,
      });

    } catch (err) {
      console.error("❌ Image-Fehler:", err);
      res.status(500).json({
        success: false,
        message: "Fehler bei der Bildgenerierung",
      });
    }

    // harte Pause: 1 Bild alle 20 Sekunden
    await new Promise((r) => setTimeout(r, IMAGE_DELAY_MS));
  });
});
/* =========================
   START SERVER
========================= */

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
