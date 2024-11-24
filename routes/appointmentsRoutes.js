const express = require('express');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const appointmentsDB = require('../db/appointments.json');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

const appointmentsSchema = new mongoose.Schema({
    id: String,
    speciality: String,
    comments: String,
    date: String,
    student: String,
    professional: String,
    appointment_create_date: { type: Date, default: Date.now }
});

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

const Appointment = mongoose.model('Appointment', appointmentsSchema);

router.get('/', async (req, res) => {
    try {
        const docs = await Appointment.find();
        res.status(200).json(docs);
    } catch (err) {
        res.status(500).json({error: err.message})
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
router.get('/:id', async (req,res)=>{
    const id = req.params.id;
    try {
        const docs = await Appointment.findById(id);
        console.log(docs);
        if (!docs) {
            return res.status(404).json({ message: "Agendamento(a) não encontrado" });
        }

        res.json(docs)
    } catch (err) {
        res.status(500).json({error:err.message});
    }
});
/**
 * @swagger
 * /appointments/date/{date}:
 *   get:
 *     summary: Pesquisa agendamentos por data
 *     tags: [Appointments]
 *     parameters:
 *       - in: path
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         required: true
 *         description: Data do agendamento para filtragem (formato YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Lista de agendamentos filtrados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointments'
 *       400:
 *         description: Parâmetro de data inválido ou formato incorreto
 */

router.get('/date/:date', async (req, res) => {
    const date = req.params.date;  // Acessa o parâmetro 'date' da rota

    // Verificação se a data está no formato correto
    const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

    if (!dateRegex.test(date)) {
        return res.status(400).json({ "erro": "Formato de data inválido. Use o padrão ISO 8601: YYYY-MM-DDTHH:mm:ss.sssZ." });
    }
    
    try{
        // Filtra os agendamentos pela data
        const appointment = await Appointment.findOne({ appointmentDate: date });
        if (!appointment) return res.status(404).json({ error: 'Agendamento não encontrado' });
        res.json(appointment);
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
    if (!appointment.speciality) return res.status(400).json({ "erro": "O agendamento precisa ter uma especialidade" });
    if (!appointment.comments) return res.status(400).json({ "erro": "O agendamento precisa ter comentários" });
    if (!appointment.date) return res.status(400).json({ "erro": "O agendamento precisa ter uma data" });
    if (!appointment.student) return res.status(400).json({ "erro": "O agendamento precisa ter um estudante" });
    if (!appointment.professional) return res.status(400).json({ "erro": "O agendamento precisa ter um profissional" });

    try {
        const newAppointment = new Appointment(appointment);
        await newAppointment.save();
        res.status(201).json(newAppointment);
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

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedAppointment = req.body;

        // Verifica se o agendamento existe
        const existingAppointment = await Appointment.findById(id);
        if (!existingAppointment) {
            return res.status(404).json({ "erro": "Agendamento não encontrado" });
        }

        // Validações de campos obrigatórios
        if (!updatedAppointment.speciality) {
            return res.status(400).json({ "erro": "O agendamento precisa ter uma especialidade" });
        }
        if (!updatedAppointment.comments) {
            return res.status(400).json({ "erro": "O agendamento precisa ter comentários" });
        }
        if (!updatedAppointment.date) {
            return res.status(400).json({ "erro": "O agendamento precisa ter uma data" });
        }
        if (!updatedAppointment.student) {
            return res.status(400).json({ "erro": "O agendamento precisa ter um estudante" });
        }
        if (!updatedAppointment.professional) {
            return res.status(400).json({ "erro": "O agendamento precisa ter um profissional" });
        }

        // Atualiza os campos no banco de dados
        const updated = await Appointment.findByIdAndUpdate(
            id,
            {
                speciality: updatedAppointment.speciality,
                comments: updatedAppointment.comments,
                date: updatedAppointment.date,
                student: updatedAppointment.student,
                professional: updatedAppointment.professional,
            },
            { new: true, runValidators: true } // `new: true` retorna o documento atualizado
        );

        if (!updated) {
            return res.status(404).json({ "erro": "Agendamento não encontrado" });
        }

        // Retorna o agendamento atualizado
        return res.json(updated);
    } catch (error) {
        console.error("Erro ao atualizar o agendamento:", error);
        return res.status(500).json({ "erro": "Erro interno do servidor" });
    }
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
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;

        // Verifica se o agendamento existe no banco
        const deletedAppointment = await Appointment.findByIdAndDelete(id);

        if (!deletedAppointment) {
            return res.status(404).json({ "erro": "Agendamento não encontrado" });
        }

        // Retorna o agendamento deletado
        return res.json(deletedAppointment);
    } catch (error) {
        console.error("Erro ao deletar o agendamento:", error);
        return res.status(500).json({ "erro": "Erro interno do servidor" });
    }
});


module.exports = router;