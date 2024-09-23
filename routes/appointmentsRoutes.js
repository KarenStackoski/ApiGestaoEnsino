const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const appointmentsDB = require('../db/appointments.json');

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointments:
 *       type: object
 *       required:
 *         - id
 *         - specialty
 *         - comments
 *         - date
 *         - student
 *         - professional
 *       properties:
 *         id:
 *           type: string
 *           description: O ID é gerado automaticamente na criação do agendamento
 *         specialty:
 *           type: string
 *           description: Especialidade do profissional da saúde
 *         comments:
 *           type: string
 *           description: Comentários sobre o agendamento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Data e hora do agendamento
 *         student:
 *           type: string
 *           description: Nome do aluno
 *         professional:
 *           type: string
 *           description: Nome do profissional
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         specialty: "Fisioterapeuta"
 *         comments: "Dores no joelho"
 *         date: "2024-05-20T14:30:00Z"
 *         student: "Érick Lúcio"
 *         professional: "Dr. Ricardo"
 */

/**
 * @swagger
 * tags:
 *   - name: Appointments
 *     description: Agendamento de atendimentos
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna uma lista de todos os atendimentos
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: A lista de Agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointments'
 */
router.get('/', (req, res) => {
    res.json(appointmentsDB);
});

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Retorna um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento
 *     responses:
 *       200:
 *         description: Detalhes do agendamento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointments'
 *       404:
 *         description: Appointments não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const appointment = appointmentsDB.find(appointment => appointment.id === id);
    if (!appointment) return res.status(404).json({ "erro": "Appointment não encontrado" });
    res.json(appointment);
});


module.exports = router;