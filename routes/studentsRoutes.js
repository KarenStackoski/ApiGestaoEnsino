const express = require('express');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const router = express.Router();

mongoose.connect('mongodb://localhost:27017');

// Definindo o Schema do Estudante
const studentSchema = new mongoose.Schema({
  studentsName: { type: String, required: true },
  studentsAge: { type: String, required: true },
  studentsPhone_number: { type: String, required: true },
  studentsStatus: { type: String, required: true },
  studentsCreate_date: { type: Date, default: Date.now }
});

const Student = mongoose.model('Student', studentSchema);

/**
 * @swagger
 * components:
 *  schemas:
 *   Students:
 *     type: object
 *     required:
 *      - studentsName
 *      - studentsAge
 *      - studentsPhone_number
 *      - studentsStatus
 *     properties:
 *      studentsName:
 *        type: string
 *        description: Nome do Estudante
 *      studentsAge:
 *        type: string
 *        description: Idade do Estudante
 *      studentsPhone_number:
 *        type: string
 *        description: Contato do telefone do Estudante
 *      studentsStatus:
 *        type: string
 *        description: Se o Estudante está ativamente participando das aulas
 *      studentsCreate_date:
 *        type: string
 *        format: date-time
 *        description: Data de criação do cadastro do estudante
 *     example:
 *      studentsName: Victor Leotte
 *      studentsAge: 6
 *      studentsPhone_number: 48999055949
 *      studentsStatus: on
 */

/**
 * @swagger
 * tags: 
 *   - name: Students
 *     description: Controle da API para o cadastro, consulta, edição e exclusão de estudantes
 */

// Rotas

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Retorna uma lista de todos os estudantes
 *     tags: [Students]
 *     responses:
 *       200:
 *         description: A lista de estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Students'
 */
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /students/search:
 *   get:
 *     summary: Busca um estudante pelo nome
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: studentsName
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do estudante a ser buscado
 *     responses:
 *       200:
 *         description: Lista de estudantes que correspondem ao nome
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Students'
 *       404:
 *         description: Nenhum estudante encontrado
 */
router.get('/search', async (req, res) => {
    const { studentsName } = req.query;
  
    if (!studentsName) {
      return res.status(400).json({ error: 'Nome do estudante é obrigatório para busca' });
    }
  
    try {
      const students = await Student.find({ studentsName: { $regex: studentsName, $options: 'i' } });
      
      if (students.length === 0) {
        return res.status(404).json({ message: 'Nenhum estudante encontrado' });
      }
  
      res.status(200).json(students);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Retorna um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Estudante
 *     responses:
 *       200:
 *         description: Dados do estudante
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Students'
 *       404:
 *         description: Estudante não encontrado
 */
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
      if (!student) return res.status(404).json({ error: 'Estudante não encontrado' });
      res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Cria um novo estudante
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Students'
 *     responses:
 *       200:
 *         description: Estudante criado com sucesso
 */
router.post('/', async (req, res) => {
  const { studentsName, studentsAge, studentsPhone_number, studentsStatus } = req.body;

  if (!studentsName || !studentsAge || !studentsPhone_number || !studentsStatus) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza os dados de um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Students'
 *     responses:
 *       200:
 *         description: Estudante atualizado com sucesso
 */
router.put('/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedStudent) return res.status(404).json({ error: 'Estudante não encontrado' });
    res.json(updatedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Deleta um estudante pelo ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Estudante
 *     responses:
 *       200:
 *         description: Estudante deletado com sucesso
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(req.params.id);
    if (!deletedStudent) return res.status(404).json({ error: 'Estudante não encontrado' });
    res.json(deletedStudent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
