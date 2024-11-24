const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb://localhost:27017');

const eventSchema = new mongoose.Schema({
    description: { type: String, required: true },
    date: { type: String, required: true },
    comments: { type: String, required: true }
});

const Event = mongoose.model('Event', eventSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - description
 *         - date
 *         - comments
 *       properties:
 *         description:
 *           type: string
 *           description: Descrição do evento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do evento
 *         comments:
 *           type: string
 *           description: Comentários sobre o evento
 *       example:
 *         description: "Reunião de equipe"
 *         date: "2024-05-20T14:30:00Z"
 *         comments: "Discutir metas trimestrais"
 */

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: >
 *       Controle da API pelo cadastro, consulta, edição e delete dos Eventos.
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Retorna uma lista de todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /events/search:
 *   get:
 *     summary: Pesquisa eventos por descrição e/ou data
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         required: false
 *         description: Descrição parcial ou total do evento
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Data do evento no formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Lista de eventos filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       400:
 *         description: Parâmetros de consulta inválidos
 */
router.get('/search', async (req, res) => {
    const { description, date } = req.query;
    const filters = {};

    if (description) {
        filters.description = new RegExp(description, 'i'); // Filtro para buscar pela descrição (case-insensitive)
    }

    if (date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ error: "Formato de data inválido. Use YYYY-MM-DD." });
        }
        filters.date = { $regex: `^${date}` }; // Filtro para buscar pela data
    }

    try {
        const events = await Event.find(filters);
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.post('/', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.json(newEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Retorna um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Detalhes do evento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ error: "Evento não encontrado" });
        res.json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *       404:
 *         description: Evento não encontrado
 */
router.put('/:id', async (req, res) => {
    try {
        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedEvent) return res.status(404).json({ error: "Evento não encontrado" });
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Remove um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do evento
 *     responses:
 *       200:
 *         description: Evento removido com sucesso
 *       404:
 *         description: Evento não encontrado
 */
router.delete('/:id', async (req, res) => {
    try {
        const deletedEvent = await Event.findByIdAndDelete(req.params.id);
        if (!deletedEvent) return res.status(404).json({ error: "Evento não encontrado" });
        res.json(deletedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
