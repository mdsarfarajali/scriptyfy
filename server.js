import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded assets
const UPLOADS_DIR = process.env.DATA_DIR
  ? path.join(process.env.DATA_DIR, "uploads")
  : path.join(__dirname, "public", "uploads");
const IMAGES_DIR = path.join(UPLOADS_DIR, "images");
const SCRIPTS_DIR = path.join(UPLOADS_DIR, "scripts");
const SCRIPTS_FILE_PATH = process.env.DATA_DIR
  ? path.join(process.env.DATA_DIR, "scripts.json")
  : path.join(__dirname, "src", "data", "scripts.json");

// Ensure upload directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(SCRIPTS_DIR)) {
  fs.mkdirSync(SCRIPTS_DIR, { recursive: true });
}

// Serve public uploads statically
app.use("/uploads", express.static(UPLOADS_DIR));

// Ensure scripts.json exists
if (!fs.existsSync(SCRIPTS_FILE_PATH)) {
  fs.mkdirSync(path.dirname(SCRIPTS_FILE_PATH), { recursive: true });
  fs.writeFileSync(SCRIPTS_FILE_PATH, JSON.stringify([], null, 2), "utf-8");
}

// Configure Multer storage to handle both coverImages and scriptFiles
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "coverImage") {
      cb(null, IMAGES_DIR);
    } else {
      cb(null, SCRIPTS_DIR);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    if (file.fieldname === "coverImage") {
      cb(null, "cover-" + uniqueSuffix + ext);
    } else {
      cb(null, "script-" + uniqueSuffix + ext);
    }
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === "coverImage") {
      const filetypes = /jpeg|jpg|png|webp/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase(),
      );
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(
        new Error(
          "Only images (.jpg, .jpeg, .png, .webp) are allowed for cover art!",
        ),
      );
    } else {
      // For scriptFile, allow plain text
      const isTxt =
        file.originalname.endsWith(".txt") || file.mimetype === "text/plain";
      if (isTxt) {
        return cb(null, true);
      }
      cb(new Error("Only standard text (.txt) files are allowed for scripts!"));
    }
  },
});

// Helper function to read scripts database
const readScripts = () => {
  try {
    const data = fs.readFileSync(SCRIPTS_FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading scripts database:", err);
    return [];
  }
};

// Helper function to write scripts database
const writeScripts = (scripts) => {
  try {
    fs.writeFileSync(
      SCRIPTS_FILE_PATH,
      JSON.stringify(scripts, null, 2),
      "utf-8",
    );
  } catch (err) {
    console.error("Error writing scripts database:", err);
  }
};

// Smart Script Parser
function parseScriptText(rawText) {
  const lines = rawText.split("\n").map((l) => l.trim());
  const scriptContent = [];

  let currentStep = null;
  let captureState = null; // 'visual', 'audio', 'text'

  // Standard scene block header match: e.g. "0:00 – 0:07" or "0:00 - 0:07"
  const timeRegex = /^(\d+:\d+)\s*[–-]\s*(\d+:\d+)$/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    // Check if it is a new timestamp header
    const timeMatch = line.match(timeRegex);
    if (timeMatch) {
      if (currentStep) {
        scriptContent.push(currentStep);
      }
      currentStep = {
        time: `${timeMatch[1]} - ${timeMatch[2]}`,
        visual: "",
        audio: "",
        text: "",
      };
      captureState = null;
      continue;
    }

    if (currentStep) {
      // Clean tags and switch state
      if (/^Visual direction$/i.test(line) || /^Scene \d+ —/i.test(line)) {
        captureState = "visual";
        continue;
      } else if (/^Voiceover$/i.test(line) || /^VOICEOVER:$/i.test(line)) {
        captureState = "audio";
        continue;
      } else if (
        /^On-screen overlay$/i.test(line) ||
        /^OVERLAY:$/i.test(line)
      ) {
        captureState = "text";
        continue;
      }

      // Append content based on current capture state
      if (captureState === "visual") {
        currentStep.visual += (currentStep.visual ? " " : "") + line;
      } else if (captureState === "audio") {
        // Strip outer double quotes if present
        let cleanAudio = line;
        if (cleanAudio.startsWith('"') && cleanAudio.endsWith('"')) {
          cleanAudio = cleanAudio.slice(1, -1);
        }
        currentStep.audio += (currentStep.audio ? " " : "") + cleanAudio;
      } else if (captureState === "text") {
        currentStep.text += (currentStep.text ? "\n" : "") + line;
      }
    }
  }

  // Push the final step
  if (currentStep) {
    scriptContent.push(currentStep);
  }

  // Fallback parsing if formatting differs
  if (scriptContent.length === 0) {
    // If we couldn't parse structured scenes, put the whole raw text in a single step
    scriptContent.push({
      time: "Full",
      visual: "Visual presentation according to the written script flow.",
      audio: "Speech narrative: " + rawText.slice(0, 300) + "...",
      text: "See full script text.",
    });
  }

  return scriptContent;
}

// REST Endpoints
app.get("/api/scripts", (req, res) => {
  res.json(readScripts());
});

app.post(
  "/api/upload",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "scriptFile", maxCount: 1 },
  ]),
  (req, res) => {
    try {
      const { title, category, researchSource } = req.body;

      const files = req.files || {};
      const coverFileObj = files.coverImage ? files.coverImage[0] : null;
      const scriptFileObj = files.scriptFile ? files.scriptFile[0] : null;

      if (!title || !category || !scriptFileObj) {
        return res
          .status(400)
          .json({
            error:
              "Missing required script metadata! (Title, Category, and Script File (.txt) are required)",
          });
      }

      // Read the script file contents exactly as-is
      const scriptText = fs.readFileSync(scriptFileObj.path, "utf-8");

      const coverImageUrl = coverFileObj
        ? `/uploads/images/${coverFileObj.filename}`
        : "/placeholder.png";

      const scriptFileUrl = `/uploads/scripts/${scriptFileObj.filename}`;

      // Simple robust single-step representation for backward compatibility
      const parsedScriptContent = [
        {
          time: "Full",
          visual: "Production guidelines according to the uploaded script.",
          audio: scriptText.slice(0, 300) + "...",
          text: "See full script text below.",
        },
      ];

      const newScript = {
        id: Date.now().toString(),
        title,
        category,
        researchSource,
        coverImage: coverImageUrl,
        scriptFilePath: scriptFileUrl,
        scriptContent: parsedScriptContent,
        rawScriptText: scriptText,
      };

      const currentScripts = readScripts();
      currentScripts.push(newScript);
      writeScripts(currentScripts);

      res
        .status(201)
        .json({
          message: "Script uploaded and saved successfully!",
          script: newScript,
        });
    } catch (err) {
      console.error("Upload error:", err);
      res
        .status(500)
        .json({ error: "Failed to upload and save script details." });
    }
  },
);

app.delete("/api/scripts/:id", (req, res) => {
  try {
    const { id } = req.params;
    let scripts = readScripts();
    const scriptIndex = scripts.findIndex((s) => s.id === id);

    if (scriptIndex === -1) {
      return res.status(404).json({ error: "Script not found." });
    }

    const scriptToDelete = scripts[scriptIndex];

    // Clean up associated files if they are local uploads
    if (
      scriptToDelete.coverImage &&
      scriptToDelete.coverImage.startsWith("/uploads/")
    ) {
      const coverPath = process.env.DATA_DIR
        ? path.join(
            process.env.DATA_DIR,
            scriptToDelete.coverImage.replace("/uploads/", "uploads/"),
          )
        : path.join(__dirname, "public", scriptToDelete.coverImage);
      if (fs.existsSync(coverPath)) {
        try {
          fs.unlinkSync(coverPath);
        } catch (e) {
          console.error("Error deleting cover image:", e);
        }
      }
    }
    if (
      scriptToDelete.scriptFilePath &&
      scriptToDelete.scriptFilePath.startsWith("/uploads/")
    ) {
      const filePath = process.env.DATA_DIR
        ? path.join(
            process.env.DATA_DIR,
            scriptToDelete.scriptFilePath.replace("/uploads/", "uploads/"),
          )
        : path.join(__dirname, "public", scriptToDelete.scriptFilePath);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Error deleting script file:", e);
        }
      }
    }

    // Remove from array and save
    scripts.splice(scriptIndex, 1);
    writeScripts(scripts);

    res.json({ message: "Script deleted successfully!" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Failed to delete the script." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
