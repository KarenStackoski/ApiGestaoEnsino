const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const mongoose = require('mongoose');

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017');

// Definição do Schema do Agendamento
const appointmentsSchema = new mongoose.Schema({
    appointmentId: String,
    appointmentSpeciality: String,
    appointmentComments: String,
    appointmentDate: { type: Date },  // Alterado para tipo Date
    appointmentStudent: String,
    appointmentProfessional: String,
    appointment_create_date: { type: Date, default: Date.now }
});

// Modelo de Agendamento
const Appointment = mongoose.model('Appointment', appointmentsSchema);

// ** DOCUMENTAÇÃO SWAGGER **

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointments:
 *       type: object
 *       required:
 *         - specialty
 *         - comments
 *         - date
 *         - student
 *         - professional
 *       properties:
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
 *         specialty: "Fisioterapeuta"
 *         comments: "Dores no joelho"
 *         date: "2024-05-20T14:30:00Z"
 *         student: "Érick Lúcio"
 *         professional: "Dr. Ricardo"
 */

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Retorna todos os agendamentos
 *     tags: [Appointments]
 *     responses:
 *       200:
 *         description: Lista de todos os agendamentos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Appointments"
 */
router.get('/', async (req, res) => {
    try {
        const docs = await Appointment.find();
        
        // Formata a data para o formato correto sem alterar a hora
        const formattedDocs = docs.map(appointment => {
            const formattedDate = new Date(appointment.appointmentDate).toISOString().slice(0, 16); 
            return {
                ...appointment.toObject(),
                appointmentDate: formattedDate
            };
        });

        res.status(200).json(formattedDocs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const docs = await Appointment.findById(id);
        if (!docs) {
            return res.status(404).json({ message: "Agendamento não encontrado" });
        }

        const formattedDate = new Date(docs.appointmentDate).toISOString().slice(0, 16);
        const formattedAppointment = { ...docs.toObject(), appointmentDate: formattedDate };

        res.json(formattedAppointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Atualiza um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: ID do agendamento a ser atualizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - specialty
 *               - comments
 *               - date
 *               - student
 *               - professional
 *             properties:
 *               specialty:
 *                 type: string
 *                 description: Especialidade do profissional
 *               comments:
 *                 type: string
 *                 description: Comentários sobre o agendamento
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Data e hora do agendamento no formato ISO
 *               student:
 *                 type: string
 *                 description: Nome do aluno
 *               professional:
 *                 type: string
 *                 description: Nome do profissional
 *           example:
 *             specialty: "Fisioterapeuta"
 *             comments: "Dores no joelho"
 *             date: "2024-05-20T14:30:00Z"
 *             student: "Érick Lúcio"
 *             professional: "Dr. Adalman"
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
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const appointment = req.body;

        // Garantindo que a data seja convertida corretamente
        const updatedAppointment = await Appointment.findByIdAndUpdate(id, {
            appointmentSpeciality: appointment.specialty,
            appointmentComments: appointment.comments,
            appointmentDate: new Date(appointment.date),  // Garantindo que a data seja convertida corretamente
            appointmentStudent: appointment.student,
            appointmentProfessional: appointment.professional
        }, { new: true });

        if (!updatedAppointment) return res.status(404).json({ error: 'Agendamento não encontrado' });

        res.json(updatedAppointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
router.post('/', async (req, res) => {
    const appointment = req.body;

    // Validações de campos obrigatórios
    if (!appointment.specialty) return res.status(400).json({ "erro": "O agendamento precisa ter uma especialidade" });
    if (!appointment.comments) return res.status(400).json({ "erro": "O agendamento precisa ter comentários" });
    if (!appointment.date) return res.status(400).json({ "erro": "O agendamento precisa ter uma data" });
    if (!appointment.student) return res.status(400).json({ "erro": "O agendamento precisa ter um estudante" });
    if (!appointment.professional) return res.status(400).json({ "erro": "O agendamento precisa ter um profissional" });

    try {
        const newAppointment = new Appointment({
            appointmentSpeciality: appointment.specialty,
            appointmentComments: appointment.comments,
            appointmentDate: new Date(appointment.date),  // Garantindo que a data seja convertida corretamente
            appointmentStudent: appointment.student,
            appointmentProfessional: appointment.professional,
        });
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Deleta um agendamento pelo ID
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do agendamento a ser deletado
 *     responses:
 *       200:
 *         description: Agendamento deletado com sucesso
 *       404:
 *         description: Agendamento não encontrado
 */
router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        if (!deletedAppointment) return res.status(404).json({ error: 'Agendamento não encontrado' });

        res.status(200).json({ message: 'Agendamento deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
