const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const eventsDB = require('../db/events.json');

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - description
 *         - date
 *         - comments
 *       properties:
 *         id:
 *           type: string
 *           description: O ID é gerado automaticamente na criação do evento
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
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         description: "Reunião de equipe"
 *         date: "2024-05-20T14:30:00Z"
 *         comments: "Discutir metas trimestrais"
 */

/**
 * @swagger
 * tags:
 *   - name: Events
 *     description: Gerenciamento de eventos
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
router.get('/', (req, res) => {
    res.json(eventsDB);
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
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const event = eventsDB.find(event => event.id === id);
    if (!event) return res.status(404).json({ "erro": "Evento não encontrado" });
    res.json(event);
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
 *       400:
 *         description: Erro de validação
 */
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
 *         description: ID do evento a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Event'
 *     responses:
 *       200:
 *         description: Evento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Evento não encontrado
 */
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
 *         description: ID do evento a ser removido
 *     responses:
 *       200:
 *         description: Evento removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */
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
