const express = require('express'); 
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const eventsDB = require('../db/events.json');

// GET "/events" - Retorna todos os eventos
router.get('/', (req, res) => {
    res.json(eventsDB);
});

// GET "/events/:id" - Retorna o evento pelo id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const event = eventsDB.find(event => event.id === id);
    if (!event) return res.status(404).json({ "erro": "Evento não encontrado" });
    res.json(event);
});

// POST "/events" - Cria um novo evento
router.post('/', (req, res) => {
    const event = req.body;
    event.id = uuidv4();

    // Validações de campos obrigatórios
    if (!event.description) return res.status(400).json({ "erro": "O evento precisa ter uma descrição" });
    if (!event.date) return res.status(400).json({ "erro": "O evento precisa ter uma data" });
    if (!event.comments) return res.status(400).json({ "erro": "O evento precisa ter comentários" });

    eventsDB.push(event);

    // Salva no arquivo JSON
    fs.writeFileSync(
        path.join(__dirname, '../db/events.json'),
        JSON.stringify(eventsDB, null, 2),
        'utf8'
    );
    return res.json(event);
});

// PUT "/events/:id" - Atualiza evento pelo id
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedEvent = req.body;
    const eventIndex = eventsDB.findIndex(event => event.id === id);

    if (eventIndex === -1) {
        return res.status(404).json({ "erro": "Evento não encontrado" });
    }

    // Validações de campos obrigatórios
    if (!updatedEvent.description) return res.status(400).json({ "erro": "O evento precisa ter uma descrição" });
    if (!updatedEvent.date) return res.status(400).json({ "erro": "O evento precisa ter uma data" });
    if (!updatedEvent.comments) return res.status(400).json({ "erro": "O evento precisa ter comentários" });

    updatedEvent.id = eventsDB[eventIndex].id;
    eventsDB[eventIndex] = updatedEvent;

    // Salva as alterações no JSON
    fs.writeFileSync(
        path.join(__dirname, '../db/events.json'),
        JSON.stringify(eventsDB, null, 2),
        'utf8'
    );
    return res.json(updatedEvent);
});

// DELETE "/events/:id" - Remove um evento pelo ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const eventIndex = eventsDB.findIndex(event => event.id === id);

    if (eventIndex === -1) return res.status(404).json({ "erro": "Evento não encontrado" });
    const deletedEvent = eventsDB.splice(eventIndex, 1)[0];

    fs.writeFileSync(
        path.join(__dirname, '../db/events.json'),
        JSON.stringify(eventsDB, null, 2),
        'utf8'
    );

    res.json(deletedEvent);
});

module.exports = router;
