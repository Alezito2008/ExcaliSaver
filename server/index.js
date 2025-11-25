import 'dotenv/config'
import express from 'express'
import db from './db.js';
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3000;

app.get('/status', (req, res) => {
    res.json({ online: true });
})

app.post('/saves', (req, res) => {
    try {
        const { id, title, created, modified, data } = req.body;

        const query = db.prepare(`
            INSERT INTO saves (id, title, created, modified, data)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                title = EXCLUDED.title,
                modified = EXCLUDED.modified,
                data = EXCLUDED.data
        `);
        query.run(id, title, created, modified, JSON.stringify(data));

        res.json({ ok: true });
    } catch (e) {
        res.json({ ok: false, error: e.message });
    }
})

app.get('/saves', (req, res) => {
    const query = db.prepare('SELECT id, title, created, modified FROM saves;');

    res.json(query.all());
});

app.get('/saves/:id', (req, res) => {
    const { id } = req.params;
    const query = db.prepare('SELECT * FROM saves WHERE id = ?');

    const save = query.get(id);

    if (!save) return res.status(404).json({ ok: false, error: "Save not found" });

    res.json(save);
})

app.delete('/saves/:id', (req, res) => {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM saves WHERE id = ?;').run(id);

    res.json({ ok: result.changes > 0 });
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
