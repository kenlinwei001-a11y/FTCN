import Database from 'better-sqlite3';

// Initialize database
const db = new Database('vtm_foundry.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initDb() {
  // --- Existing Tables (Preserved) ---
  db.exec(`
    CREATE TABLE IF NOT EXISTS minerals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      formula TEXT,
      elements TEXT,
      particle_size TEXT,
      dissociation_degree REAL
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS process_units (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      design_capacity REAL,
      current_status TEXT DEFAULT 'idle'
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS equipment (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      model TEXT,
      process_unit_id INTEGER,
      status TEXT,
      FOREIGN KEY (process_unit_id) REFERENCES process_units(id)
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS experiments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_number TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'planned',
      target_metallization_rate REAL,
      carbon_ratio REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      operator TEXT
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS telemetry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      equipment_id INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      temperature REAL,
      pressure REAL,
      gas_h2 REAL,
      gas_co REAL,
      gas_co2 REAL,
      gas_n2 REAL,
      FOREIGN KEY (equipment_id) REFERENCES equipment(id)
    );
  `);

  // --- New Tables from Design Document V1.0 ---

  // 2. Production Data Layer
  db.exec(`
    CREATE TABLE IF NOT EXISTS process_run (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      furnace_id TEXT,
      batch_id TEXT,
      temperature REAL,
      pressure REAL,
      feed_rate REAL,
      slag_ratio REAL,
      vanadium_recovery REAL,
      iron_grade REAL,
      energy_consumption REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS quality_result (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id TEXT,
      fe_content REAL,
      v_content REAL,
      ti_content REAL,
      impurity_ratio REAL,
      analysis_time DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS energy_record (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      furnace_id TEXT,
      electricity REAL,
      coal_consumption REAL,
      gas_consumption REAL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Digital Twin & Models
  db.exec(`
    CREATE TABLE IF NOT EXISTS twin_model_parameter (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model_name TEXT,
      parameter_name TEXT,
      parameter_value REAL,
      unit TEXT,
      version INTEGER,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS agent_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_name TEXT,
      input_json TEXT,
      output_json TEXT,
      confidence_score REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed Initial Data for New Tables
  const modelCount = db.prepare('SELECT count(*) as count FROM twin_model_parameter').get() as { count: number };
  if (modelCount.count === 0) {
    console.log('Seeding Model Parameters...');
    const insertParam = db.prepare('INSERT INTO twin_model_parameter (model_name, parameter_name, parameter_value, unit, version) VALUES (?, ?, ?, ?, ?)');
    // Regression coefficients for Rv = b0 + b1*T + b2*P + b3*Feed
    insertParam.run('VanadiumRecovery_Regression', 'beta_0', -50.0, 'constant', 1);
    insertParam.run('VanadiumRecovery_Regression', 'beta_1', 0.08, 'coeff_temp', 1);
    insertParam.run('VanadiumRecovery_Regression', 'beta_2', 0.5, 'coeff_pressure', 1);
    insertParam.run('VanadiumRecovery_Regression', 'beta_3', -0.1, 'coeff_feed', 1);
  }

  // Seed Process Units and Equipment if empty
  const unitCount = db.prepare('SELECT count(*) as count FROM process_units').get() as { count: number };
  if (unitCount.count === 0) {
    console.log('Seeding Process Units and Equipment...');
    const insertUnit = db.prepare('INSERT INTO process_units (name, type, design_capacity, current_status) VALUES (?, ?, ?, ?)');
    const insertEquipment = db.prepare('INSERT INTO equipment (code, model, process_unit_id, status) VALUES (?, ?, ?, ?)');

    // Insert Process Unit
    const unitResult = insertUnit.run('Rotary Kiln Unit 1', 'Pyroprocessing', 1000.0, 'active');
    const unitId = unitResult.lastInsertRowid;

    // Insert Equipment (ID will likely be 1, matching the simulation hardcoded ID)
    insertEquipment.run('EQ-KILN-001', 'RK-2000', unitId, 'running');
  }
}

export default db;

