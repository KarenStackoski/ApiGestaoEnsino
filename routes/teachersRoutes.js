const express = require('express');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const teachersDB = require('../db/teachers.json');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

const teachersSchema = new mongoose.Schema({
    teacherName: String,
    teacherSchoolDisciplines: String,
    teacherContact: String,
    teacherPhone: String,
    teacherStatus: Boolean,
    teacher_create_date: { type: Date, default: Date.now }
});


/**
 * @swagger
 * components:
 *  schemas:
 *   Teachers:
 *     type: object
 *     required:
 *      - teacherName
 *      - teacherSchoolDisciplines
 *      - teacherContact
 *      - teacherPhone
 *      - teacherStatus
 *     properties:
 *      teacherName:
 *        type: string
 *        description: Nome do Professor(a)
 *      teacherSchoolDisciplines:
 *        type: string
 *        description: Disciplina que o Professor(a) ministra
 *      teacherContact:
 *        type: string
 *        description: E-mail do Professor(a)
 *      teacherPhone:
 *        type: string
 *        description: Contato do telefone do Professor(a)
 *      teacherStatus:
 *        type: boolean
 *        description: Se o Professor(a) está ativamente dando aulas
 *     example:
 *      teacherName: Mateus M. Mariot
 *      teacherSchoolDisciplines: Português
 *      teacherContact: mateusmartignagomariot@unesc.net
 *      teacherPhone: 48999055949
 *      teacherStatus: true
 * 
 */

/**
 * @swagger
 * tags: 
 *   - name: Teachers
 *     description: >
 *       Controle da API pelo cadastro, consulta, edição e delete dos Professores(as) nos JSONs.  
 *       **Por Mateus M. Mariot**
 */


    /**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Retorna uma lista de todos os professores
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: A lista de professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teachers'
 */

const Teacher = mongoose.model('Teacher', teachersSchema);

router.get('/', async (req, res) => {
    try {
        const docs = await Teacher.find();
        res.status(200).json(docs);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
});

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Retorna um professor pelo ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Professor(a)
 *     responses:
 *       200:
 *         description: Retorna os dados do professor(a)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teachers'
 *       404:
 *         description: Professor(a) não encontrado
 */

router.get('/:id', async (req,res)=>{
    const id = req.params.id;
    try {
        const docs = await Teacher.findById(id);
        console.log(docs);
        if (!docs) {
            return res.status(404).json({ message: "Professor(a) não encontrado" });
        }

        res.json(docs)
    } catch (err) {
        res.status(500).json({error:err.message});
    }
});

/**
 * @swagger
 * /teachers/name/{name}:
 *   get:
 *     summary: Retorna professores pelo Nome
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do Professor(a)
 *     responses:
 *       200:
 *         description: Retorna os dados dos professores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Teachers'
 *       404:
 *         description: Nenhum professor(a) encontrado
 */

router.get('/name/:name', async (req, res) => {
    const name = req.params.name; // Usando parâmetros de consulta
    try {
        const docs = await Teacher.find({teacherName:name});
        if(!docs || docs.length === 0){
            return res.status(404).json({message:"Professor(a) não encontrado"})
        }
        res.json(docs);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
});

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Cria um novo professor
 *     tags: [Teachers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teachers'
 *     responses:
 *       200:
 *         description: O Professor(a) foi criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teachers'
 */

//POST "/teachers" 
//BODY {"name": "Mateus", "school_disciplines": "Português", "contact": "mateus@ema.net", 
//"phone_number": "4870707070", "status": "off"}
router.post('/', async (req, res)=>{
    const teacher = req.body
    try {
        const newTeacher = await Teacher.create(teacher);
        console.log('Objeto salvo com sucesso!');
        res.json(newTeacher);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

/**
 * @swagger
 * /teachers/{id}:
 *   put:
 *     summary: Atualiza os dados de um Professor(a) pela ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Professor(a)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Teachers'
 *     responses:
 *       200:
 *         description: O Professor(a) foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teachers'
 *       400:
 *         description: Professor(a) não encontrado
 */

router.put('/:id', async (req, res)=>{
    const id = req.params.id;
    const n_teacher = req.body;
    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(id, {teacherName: n_teacher.teacherName, teacherSchoolDisciplines: n_teacher.teacherSchoolDisciplines, teacherContact: n_teacher.teacherContact, teacherPhone: n_teacher.teacherPhone, teacherStatus: n_teacher.teacherStatus}, {new: true});
        console.log('Objeto atualizado:', updatedTeacher);
        res.json(updatedTeacher);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

/**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Deleta o Professor(a) através do ID
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do Professor(a)
 *     responses:
 *       200:
 *         description: O Professor(a) foi deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Teachers'
 *       400:
 *         description: Professor(a) não encontrado
 */

router.delete('/:id', async (req, res)=>{
    const id = req.params.id;
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(id);
        console.log('Objeto deletado: ', deletedTeacher);
        res.json(deletedTeacher);
    } catch (err) {
        res.status(500).json({error:err.message});
    }
});

module.exports = router;