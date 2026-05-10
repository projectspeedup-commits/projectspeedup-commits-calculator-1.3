import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release();
    if (err) {
      return console.error('Error executing query', err.stack);
    }
    console.log('Connected to PostgreSQL successfully');
  });
});

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  // Config API
  app.get("/api/config", (req, res) => {
    res.json({
      usePostgres: !!process.env.DATABASE_URL,
      isProduction: process.env.NODE_ENV === "production"
    });
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Calculations API
  app.get("/api/calculations", async (req, res) => {
    const { userId } = req.query;
    try {
      const result = await pool.query(
        "SELECT * FROM calculations WHERE user_id = $1 ORDER BY created_at DESC",
        [userId || 'offline']
      );
      res.json(result.rows.map(row => {
        const jsonData = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
        // Merge JSON data with flat columns, prioritizing JSON, but ensuring all fields exist
        return {
          ...jsonData,
          id: row.id.toString(),
          userId: row.user_id,
          profileType: jsonData.profileType || row.profile_type || 'round',
          steelGrade: jsonData.steelGrade || row.steel_grade || '',
          selectedTarget: jsonData.selectedTarget || row.selected_target || '0',
          selectedRaw: jsonData.selectedRaw || row.selected_raw || '0',
          orderWeight: jsonData.orderWeight || row.order_weight || '0',
          orderedLength: jsonData.orderedLength || row.ordered_length || '0',
          lengthInputValue: jsonData.lengthInputValue || row.length_input_value || '0',
          usefulLength: jsonData.usefulLength || row.useful_length || '0',
          label: jsonData.label || row.label || '',
          createdAt: { toDate: () => new Date(row.created_at) },
          _createdAtMs: new Date(row.created_at).getTime()
        };
      }));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch calculations" });
    }
  });

  app.post("/api/calculations", async (req, res) => {
    const data = req.body;
    try {
      const columns = [
        'user_id', 'profile_type', 'steel_grade', 'selected_target', 
        'selected_raw', 'order_weight', 'ordered_length', 
        'length_input_value', 'length_input_source', 'front_coef', 
        'back_coef', 'useful_length', 'sell_price', 'raw_price_used', 
        'scrap_price_used', 'remnant_price_used', 'label', 'data'
      ];
      
      const values = [
        data.userId || 'offline',
        data.profileType,
        data.steelGrade,
        data.selectedTarget,
        data.selectedRaw,
        data.orderWeight,
        data.orderedLength,
        data.lengthInputValue,
        data.lengthInputSource,
        data.frontCoef,
        data.backCoef,
        data.usefulLength,
        data.sellPrice,
        data.rawPriceUsed,
        data.scrapPriceUsed,
        data.remnantPriceUsed,
        data.label,
        JSON.stringify(data)
      ];

      const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO calculations (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
      
      const result = await pool.query(query, values);
      const row = result.rows[0];
      const jsonData = typeof row.data === 'string' ? JSON.parse(row.data) : (row.data || {});
      
      res.json({
        ...jsonData,
        id: row.id.toString(),
        userId: row.user_id,
        profileType: jsonData.profileType || row.profile_type || 'round',
        steelGrade: jsonData.steelGrade || row.steel_grade || '',
        selectedTarget: jsonData.selectedTarget || row.selected_target || '0',
        created_at: row.created_at
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save calculation" });
    }
  });

  app.delete("/api/calculations/:id", async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM calculations WHERE id = $1", [id]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete calculation" });
    }
  });

  app.delete("/api/calculations", async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });
    try {
      await pool.query("DELETE FROM calculations WHERE user_id = $1", [userId]);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to clear calculations" });
    }
  });

  // Settings API (optional but good for future)
  app.get("/api/settings/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
      const result = await pool.query("SELECT * FROM user_settings WHERE user_id = $1", [userId]);
      if (result.rows.length > 0) {
        res.json(result.rows[0].data);
      } else {
        res.json(null);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.post("/api/settings/:userId", async (req, res) => {
    const { userId } = req.params;
    const data = req.body;
    try {
      await pool.query(
        "INSERT INTO user_settings (user_id, data, updated_at) VALUES ($1, $2, NOW()) ON CONFLICT (user_id) DO UPDATE SET data = $2, updated_at = NOW()",
        [userId, JSON.stringify(data)]
      );
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save settings" });
    }
  });

  app.get("/api/global-settings", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM user_settings WHERE user_id = 'global'");
      if (result.rows.length > 0) {
        res.json(result.rows[0].data);
      } else {
        res.json(null);
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch global settings" });
    }
  });

  app.post("/api/global-settings", async (req, res) => {
    const data = req.body;
    try {
      await pool.query(
        "INSERT INTO user_settings (user_id, data, updated_at) VALUES ('global', $1, NOW()) ON CONFLICT (user_id) DO UPDATE SET data = $1, updated_at = NOW()",
        [JSON.stringify(data)]
      );
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to save global settings" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
