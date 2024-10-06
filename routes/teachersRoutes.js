const express = require('express');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const teachersDB = require('../db/teachers.json');


/**
 * @swagger
 * components:
 *  schemas:
 *   Teachers:
 *     type: object
 *     required:
 *      - id
 *      - name
 *      - school_disciplines
 *      - contact
 *      - phone_number
 *      - status
 *     properties:
 *      id:
 *        type: string
 *        description: O id é gerado automaticamente no cadastro do Professor(a)
 *      name:
 *        type: string
 *        description: Nome do Professor(a)
 *      school_disciplines:
 *        type: string
 *        description: Disciplina que o Professor(a) ministra
 *      contact:
 *        type: string
 *        description: E-mail do Professor(a)
 *      phone_number:
 *        type: string
 *        description: Contato do telefone do Professor(a)
 *      status:
 *        type: string
 *        description: Se o Professor(a) está ativamente dando aulas
 *     example:
 *      name: Mateus M. Mariot
 *      school_disciplines: Português
 *      contact: mateusmartignagomariot@unesc.net
 *      phone_number: 48999055949
 *      status: on
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

router.get('/', (req, res) => {
    console.log("getroute");
    res.json(teachersDB);
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

router.get('/:id', (req,res)=>{
    const id = req.params.id;
    var teacher = teachersDB.find(teacher=>teacher.id === id);
    if(!teacher) return res.status(404).json({
        "erro":"Professor(a) não encontrado"
    });
    res.json(teacher);
});

/**
 * @swagger
 * /teachers/name/name:
 *   get:
 *     summary: Retorna professores pelo Nome
 *     tags: [Teachers]
 *     parameters:
 *       - in: query
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

router.get('/name/name', (req, res) => {
    const name = req.query.name.toLowerCase(); // Usando parâmetros de consulta
    const teachers = teachersDB.filter(teacher => teacher.name.toLowerCase().includes(name)); // Filtrando professores

    if (teachers.length === 0) { // Verificando se nenhum professor foi encontrado
        return res.status(404).json({
            "erro": "Nenhum professor(a) encontrado"
        });
    }
    
    res.json(teachers); // Retornando todos os professores encontrados
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
router.post('/', (req, res)=>{
    const teacher = req.body;
    console.log(teacher);
    teacher.id= uuidv4();
    if(!teacher.name) return res.status(400).json({
        "erro": "O Professor(a) precisa ter um nome"
    });
    if(!teacher.school_disciplines) return res.status(400).json({
        "erro": "O professor(a) precisa ter uma disciplina"
    });
    if(!teacher.contact) return res.status(400).json({
        "erro": "O professor(a) precisas ter um e-mail"
    });
    if(!teacher.phone_number) return res.status(400).json({
        "erro": "O professor(a) precisa ter um telefone"
    });
    if(!teacher.status) return res.status(400).json({
        "erro": "O professor(a) precisa ter um status"
    });

    teachersDB.push(teacher);

    fs.writeFileSync(
        path.join(__dirname, '../db/teachers.json'),
        JSON.stringify(teachersDB, null, 2),
        'utf8'
    );
    return res.json(teacher);
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

router.put('/:id', (req, res)=>{
    const id = req.params.id;
    const newTeacher = req.body;
    const atualTeacherIndex = teachersDB.findIndex(atualTeacherIndex => atualTeacherIndex.id === id);
    
    if(atualTeacherIndex === -1){
        return res.status(400).json({
            "erro": "Professor(a) não encontrado"
        });
    }

    if(!newTeacher.name) return res.status(400).json({
        "erro": "O Professor(a) precisa ter um nome"
    });
    if(!newTeacher.school_disciplines) return res.status(400).json({
        "erro": "O professor(a) precisa ter uma disciplina"
    });
    if(!newTeacher.contact) return res.status(400).json({
        "erro": "O professor(a) precisas ter um e-mail"
    });
    if(!newTeacher.phone_number) return res.status(400).json({
        "erro": "O professor(a) precisa ter um telefone"
    });
    if(!newTeacher.status) return res.status(400).json({
        "erro": "O professor(a) precisa ter um status"
    });
    newTeacher.id = teachersDB[atualTeacherIndex].id
    teachersDB[atualTeacherIndex] = newTeacher;

    fs.writeFileSync(path.join(__dirname, '../db/teachers.json'), JSON.stringify(teachersDB, null, 2), 'utf8');
    return res.json(newTeacher);
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

router.delete('/:id', (req, res)=>{
    const id = req.params.id;
    const teacher = teachersDB.findIndex(teacher => teacher.id === id);
    if(teacher === -1) return res.status(404).json({
        "erro": "Professor(a) não encontrado"
    });
    var deletado = teachersDB.splice(teacher, 1)[0]

    fs.writeFileSync(
        path.join(__dirname, '../db/teachers.json'),
        JSON.stringify(teachersDB, null, 2),
        'utf8'
    );
    res.json(deletado);
});

module.exports = router;