import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded assets
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
const IMAGES_DIR = path.join(UPLOADS_DIR, 'images');
const SCRIPTS_FILE_PATH = path.join(__dirname, 'src', 'data', 'scripts.json');

// Ensure upload directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Serve public uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Ensure scripts.json exists
if (!fs.existsSync(SCRIPTS_FILE_PATH)) {
  fs.mkdirSync(path.dirname(SCRIPTS_FILE_PATH), { recursive: true });
  fs.writeFileSync(SCRIPTS_FILE_PATH, JSON.stringify([], null, 2), 'utf-8');
}

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, IMAGES_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'cover-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (.jpg, .jpeg, .png, .webp) are allowed!"));
  }
});

// Helper function to read scripts database
const readScripts = () => {
  try {
    const data = fs.readFileSync(SCRIPTS_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading scripts database:", err);
    return [];
  }
};

// Helper function to write scripts database
const writeScripts = (scripts) => {
  try {
    fs.writeFileSync(SCRIPTS_FILE_PATH, JSON.stringify(scripts, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error writing scripts database:", err);
  }
};

// Smart Script Parser
function parseScriptText(rawText) {
  const lines = rawText.split('\n').map(l => l.trim());
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
        text: ""
      };
      captureState = null;
      continue;
    }

    if (currentStep) {
      // Clean tags and switch state
      if (/^Visual direction$/i.test(line) || /^Scene \d+ —/i.test(line)) {
        captureState = 'visual';
        continue;
      } else if (/^Voiceover$/i.test(line) || /^VOICEOVER:$/i.test(line)) {
        captureState = 'audio';
        continue;
      } else if (/^On-screen overlay$/i.test(line) || /^OVERLAY:$/i.test(line)) {
        captureState = 'text';
        continue;
      }

      // Append content based on current capture state
      if (captureState === 'visual') {
        currentStep.visual += (currentStep.visual ? " " : "") + line;
      } else if (captureState === 'audio') {
        // Strip outer double quotes if present
        let cleanAudio = line;
        if (cleanAudio.startsWith('"') && cleanAudio.endsWith('"')) {
          cleanAudio = cleanAudio.slice(1, -1);
        }
        currentStep.audio += (currentStep.audio ? " " : "") + cleanAudio;
      } else if (captureState === 'text') {
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
      text: "See full script text."
    });
  }

  return scriptContent;
}

// REST Endpoints
app.get('/api/scripts', (req, res) => {
  res.json(readScripts());
});

app.post('/api/upload', upload.single('coverImage'), (req, res) => {
  try {
    const { 
      title, 
      category, 
      researchSource, 
      researchUrl = "", 
      scriptText 
    } = req.body;

    if (!title || !category || !scriptText) {
      return res.status(400).json({ error: "Missing required script metadata! (Title, Category, Script Content are required)" });
    }

    const coverImageUrl = req.file 
      ? `/uploads/images/${req.file.filename}` 
      : "/placeholder.png"; // Fallback if no cover image

    const parsedScriptContent = parseScriptText(scriptText);

    const newScript = {
      id: Date.now().toString(),
      title,
      category,
      researchSource,
      researchUrl,
      coverImage: coverImageUrl,
      scriptContent: parsedScriptContent,
      rawScriptText: scriptText // Keep backup of raw text
    };

    const currentScripts = readScripts();
    currentScripts.push(newScript);
    writeScripts(currentScripts);

    res.status(201).json({ message: "Script created successfully!", script: newScript });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload and save script details." });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
