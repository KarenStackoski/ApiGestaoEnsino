const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017');

// Definindo o schema do Mongoose para profissionais
const professionalSchema = new mongoose.Schema({
    professionalName: String,
    professionalSpeciality: String,
    professionalEmail: String,
    professionalPhone: String,
    professionalStatus: Boolean,
    professional_create_date: { type: Date, default: Date.now }
});

const Professional = mongoose.model('Professional', professionalSchema);

/**
 * @swagger
 * components:
 *  schemas:
 *   Professionals:
 *     type: object
 *     required:
 *      - professionalName
 *      - professionalSpeciality
 *      - professionalEmail
 *      - professionalPhone
 *      - professionalStatus
 *     properties:
 *      professionalName:
 *        type: string
 *        description: Nome do Profissional(a)
 *      professionalSpeciality:
 *        type: string
 *        description: Especialidade do Profissional(a)
 *      professionalEmail:
 *        type: string
 *        description: E-mail do Profissional(a)
 *      professionalPhone:
 *        type: string
 *        description: Contato do telefone do Profissional(a)
 *      professionalStatus:
 *        type: string
 *        description: Status do Profissional(a) (on/off)
 *     example:
 *      professionalName: João Silva
 *      professionalSpeciality: Fisioterapeuta
 *      professionalEmail: joao.silva@example.com
 *      professionalPhone: 11999999999
 *      professionalStatus: on
 */

/**
 * @swagger
 * tags: 
 *  - name: Professionals
 *    description: >
 *          Controle da API pelo cadastro, consulta, edição e exclusão dos profissionais no mongodb.
 *          **Por Gregori Rodrigues Zaccaron**
 */

/**
 * @swagger
 * /professionals:
 *  get:
 *      summary: Retorna todos os profissionais
 *      tags: [Professionals]
 *      responses:
 *          200:
 *              description: Sucesso ao buscar os Professionals
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Professionals'
 */

// GET: listar todos os profissionais
router.get('/', async (req, res) => {
    try {
        const professionals = await Professional.find();
        res.status(200).json(professionals);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /professionals:
 *  post:
 *      summary: Cria um profissional
 *      tags: [Professionals]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Professionals'
 *      responses:
 *          200:
 *              description: Sucesso ao criar o profissional
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Professionals'
 */

// POST: criar um novo profissional
router.post('/', async (req, res) => {
    try {
        const professional = new Professional(req.body);
        const savedProfessional = await professional.save();
        res.status(200).json(savedProfessional);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /professionals/{id}:
 *  put:
 *      summary: Altera os dados do profissional
 *      tags: [Professionals]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: ID do profissional
 *      requestBody:
 *          required: true
 *          content:
 *              application/json: 
 *                  schema:
 *                      $ref: '#/components/schemas/Professionals'
 *      responses:
 *          200:
 *              description: Sucesso ao alterar o usuário
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Professionals'
 *          400:
 *              description: Usuário não encontrado ou parâmetros obrigatórios ausentes
 */

// PUT: atualizar um profissional por ID
router.put('/:id', async (req, res) => {
    try {
        const updatedProfessional = await Professional.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProfessional) {
            return res.status(404).json({ message: "Profissional não encontrado" });
        }
        res.json(updatedProfessional);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /professionals/{id}:
 *  delete:
 *      summary: Exclui o profissional
 *      tags: [Professionals]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: ID do Profissional
 *      responses:
 *          200:
 *              description: Sucesso ao excluir o profissional
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Professionals'
 *          404:
 *              description: Profissional não encontrado
 */


// DELETE: remover um profissional por ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedProfessional = await Professional.findByIdAndDelete(req.params.id);
        if (!deletedProfessional) {
            return res.status(404).json({ message: "Profissional não encontrado" });
        }
        res.json(deletedProfessional);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;