import express from "express";
import { createServer as createViteServer } from "vite";
import { createServer } from "http";
import { Server } from "socket.io";

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  const PORT = 3000;

  const logs: string[] = [];
  const log = (msg: string) => {
    console.log(msg);
    logs.push(msg);
    if (logs.length > 50) logs.shift();
  };

  let db: any;
  let initDb: any;

  // Initialize DB
  try {
    const dbModule = await import("./server/db");
    db = dbModule.default;
    initDb = dbModule.initDb;
    initDb();
    log("Database initialized successfully.");
  } catch (err: any) {
    log(`Database initialization failed: ${err.message}`);
    console.error(err);
  }

  app.use(express.json());

  // --- API Routes ---

  app.get("/api/logs", (req, res) => {
    res.json(logs);
  });

  // Get all experiments
  app.get("/api/experiments", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    try {
      const experiments = db.prepare('SELECT * FROM experiments ORDER BY created_at DESC').all();
      res.json(experiments);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Get specific experiment
  app.get("/api/experiments/:id", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    try {
      const experiment = db.prepare('SELECT * FROM experiments WHERE id = ?').get(req.params.id);
      res.json(experiment);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Get telemetry for an experiment (mocked association by time or just latest for demo)
  app.get("/api/telemetry/latest", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    try {
      const data = db.prepare('SELECT * FROM telemetry ORDER BY timestamp DESC LIMIT 100').all();
      res.json(data);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Create new experiment
  app.post("/api/experiments", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const { batch_number, target_metallization_rate, carbon_ratio, operator } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO experiments (batch_number, target_metallization_rate, carbon_ratio, operator) VALUES (?, ?, ?, ?)');
      const info = stmt.run(batch_number, target_metallization_rate, carbon_ratio, operator);
      res.json({ id: info.lastInsertRowid });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  // --- Simulation API ---
  // Simulate Vanadium Recovery based on inputs
  // Model: Rv = beta0 + beta1*T + beta2*P + beta3*Feed + epsilon
  app.post("/api/simulation/run", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const { temperature, pressure, feed_rate } = req.body;
    
    try {
      // Fetch model parameters
      const params = db.prepare("SELECT * FROM twin_model_parameter WHERE model_name = 'VanadiumRecovery_Regression'").all() as any[];
      
      const beta0 = params.find(p => p.parameter_name === 'beta_0')?.parameter_value || -50;
      const beta1 = params.find(p => p.parameter_name === 'beta_1')?.parameter_value || 0.08;
      const beta2 = params.find(p => p.parameter_name === 'beta_2')?.parameter_value || 0.5;
      const beta3 = params.find(p => p.parameter_name === 'beta_3')?.parameter_value || -0.1;

      // Calculate Recovery Rate
      let recoveryRate = beta0 + (beta1 * temperature) + (beta2 * pressure) + (beta3 * feed_rate);
      
      // Add some random noise (epsilon)
      recoveryRate += (Math.random() - 0.5) * 2;
      
      // Clamp result
      recoveryRate = Math.min(Math.max(recoveryRate, 0), 100);

      // Calculate Energy Cost (Simplified: E = k1*T + k2*Feed)
      const energyCost = (0.5 * temperature) + (2 * feed_rate);

      res.json({
        vanadium_recovery: recoveryRate,
        energy_cost: energyCost,
        timestamp: new Date().toISOString()
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- Model Management API ---
  app.get("/api/models", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    try {
      const models = db.prepare("SELECT DISTINCT model_name, version, updated_at FROM twin_model_parameter").all();
      res.json(models);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/models/:name/parameters", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    try {
      const params = db.prepare("SELECT * FROM twin_model_parameter WHERE model_name = ?").all(req.params.name);
      res.json(params);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/models/:name/parameters", (req, res) => {
    if (!db) return res.status(500).json({ error: "Database not initialized" });
    const { parameters } = req.body; // Array of { parameter_name, parameter_value }
    const modelName = req.params.name;
    
    try {
      const updateStmt = db.prepare("UPDATE twin_model_parameter SET parameter_value = ?, updated_at = CURRENT_TIMESTAMP WHERE model_name = ? AND parameter_name = ?");
      
      const transaction = db.transaction((params: any[]) => {
        for (const p of params) {
          updateStmt.run(p.parameter_value, modelName, p.parameter_name);
        }
      });
      
      transaction(parameters);
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- Real-time Simulation (The "PLC") ---
  // Simulate data for the "running" experiment/equipment
  setInterval(() => {
    if (!db) return;
    try {
      // Generate synthetic data
      const now = new Date().toISOString();
      // Simulate a rotary kiln process
      // Temp oscillates around 1200K, Pressure around 101kPa
      const temp = 1200 + Math.sin(Date.now() / 10000) * 50 + (Math.random() - 0.5) * 10; 
      const pressure = 101.3 + (Math.random() - 0.5) * 2;
      
      // Gas composition (sum ~ 100%)
      const h2 = 55 + Math.random() * 5;
      const co = 25 + Math.random() * 5;
      const co2 = 10 + Math.random() * 2;
      const n2 = 100 - (h2 + co + co2);

      const equipmentId = 1; // Assuming EQ-KILN-001

      // Insert into DB
      const stmt = db.prepare(`
        INSERT INTO telemetry (equipment_id, timestamp, temperature, pressure, gas_h2, gas_co, gas_co2, gas_n2)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(equipmentId, now, temp, pressure, h2, co, co2, n2);

      // Broadcast via Socket.IO
      const dataPoint = { equipmentId, timestamp: now, temp, pressure, gas: { h2, co, co2, n2 } };
      io.emit("telemetry", dataPoint);

      // Cleanup old data to keep DB small for demo
      db.prepare('DELETE FROM telemetry WHERE id NOT IN (SELECT id FROM telemetry ORDER BY id DESC LIMIT 1000)').run();
    } catch (e: any) {
      console.error("Simulation error:", e.message);
    }

  }, 2000); // Every 2 seconds

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files (if we were building for prod)
    // For this environment, we mostly rely on the dev server mode, but standard practice:
    // app.use(express.static('dist'));
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
