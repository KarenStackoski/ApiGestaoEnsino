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
 *     description: >
 *       Controle da API pelo cadastro, consulta, edição e delete dos Agendamentos(as) nos JSONs.  
 *       **Por Érick Lúcio**
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
 *         description: Agendamento não encontrado
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const appointment = appointmentsDB.find(appointment => appointment.id === id);
    if (!appointment) return res.status(404).json({ "erro": "Agendamento não encontrado" });
    res.json(appointment);
});

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Cria um novo agendamento
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointments'
 *     responses:
 *       200:
 *         description: Agendamento criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointments'
 *       400:
 *         description: Erro de validação
 */
router.post('/', (req, res) => {
    const appointment = req.body;
    appointment.id = uuidv4();

    // Validações de campos obrigatórios
    if (!appointment.specialty) return res.status(400).json({ "erro": "O agendamento precisa ter uma especialidade" });
    if (!appointment.comments) return res.status(400).json({ "erro": "O agendamento precisa ter comentários" });
    if (!appointment.date) return res.status(400).json({ "erro": "O agendamento precisa ter uma data" });
    if (!appointment.student) return res.status(400).json({ "erro": "O agendamento precisa ter um estudante" });
    if (!appointment.professional) return res.status(400).json({ "erro": "O agendamento precisa ter um profissional" });

    appointmentsDB.push(appointment);

    // Salva no arquivo JSON
    fs.writeFileSync(
        path.join(__dirname, '../db/appointments.json'),
        JSON.stringify(appointmentsDB, null, 2),
        'utf8'
    );
    return res.json(appointment);
});

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointments'
 *     responses:
 *       200:
 *         description: Agendamento atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointments'
 *       400:
 *         description: Erro de validação
 *       404:
 *         description: Agendamento não encontrado
 */
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const updatedAppointment = req.body;
    const appointmentIndex = appointmentsDB.findIndex(appointment => appointment.id === id);

    if (appointmentIndex === -1) {
        return res.status(404).json({ "erro": "Agendamento não encontrado" });
    }

    // Validações de campos obrigatórios
    if (!updatedAppointment.specialty) return res.status(400).json({ "erro": "O agendamento precisa ter uma especialidade" });
    if (!updatedAppointment.comments) return res.status(400).json({ "erro": "O agendamento precisa ter comentários" });
    if (!updatedAppointment.date) return res.status(400).json({ "erro": "O agendamento precisa ter uma data" });
    if (!updatedAppointment.student) return res.status(400).json({ "erro": "O agendamento precisa ter um estudante" });
    if (!updatedAppointment.professional) return res.status(400).json({ "erro": "O agendamento precisa ter um profissional" });

    updatedAppointment.id = appointmentsDB[appointmentIndex].id;
    appointmentsDB[appointmentIndex] = updatedAppointment;

    // Salva as alterações no JSON
    fs.writeFileSync(
        path.join(__dirname, '../db/appointments.json'),
        JSON.stringify(appointmentsDB, null, 2),
        'utf8'
    );
    return res.json(updatedAppointment);
});

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Remove um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento a ser removido
 *     responses:
 *       200:
 *         description: Agendamento removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointments'
 *       404:
 *         description: Agendamento não encontrado
 */
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const appointmentIndex = appointmentsDB.findIndex(appointment => appointment.id === id);

    if (appointmentIndex === -1) return res.status(404).json({ "erro": "Agendamento não encontrado" });
    const deletedAppointment = appointmentsDB.splice(appointmentIndex, 1)[0];

    fs.writeFileSync(
        path.join(__dirname, '../db/appointments.json'),
        JSON.stringify(appointmentsDB, null, 2),
        'utf8'
    );

    res.json(deletedAppointment);
});

module.exports = router;