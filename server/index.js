import 'dotenv/config'
import express from 'express'
import db from './db.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Corriendo');
})

app.post('/save', (req, res) => {
    try {
        const { id, title, created, modified, data } = req.body;

        const query = db.prepare('INSERT INTO saves (id, title, created, modified, data) VALUES (?, ?, ?, ?, ?)');
        query.run(id, title, created, modified, JSON.stringify(data));

        res.json({ ok: true });
    } catch (e) {
        console.log(e);
        res.json({ ok: false, error: e });
    }
})

app.get('/saves', (req, res) => {
    const query = db.prepare('SELECT * FROM saves;');

    res.json(query.all());
});

app.get('/saves/:id', (req, res) => {
    const { id } = req.params;
    const query = db.prepare('SELECT * FROM saves WHERE id = ?');

    const result = query.get(id);
    res.json(result || {});
})

app.delete('/saves/:id', (req, res) => {
    const { id } = req.params;

    const result = db.prepare('DELETE FROM saves WHERE id = ?;').run(id);

    res.json({ ok: result.changes > 0 });
})

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});
