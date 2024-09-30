const express = require('express');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const studentsDB = require('../db/students.json');

/**
 * @swagger
 * components:
 *  schemas:
 *   Students:
 *     type: object
 *     required:
 *      - id
 *      - name
 *      - age
 *      - parents
 *      - phone_number
 *      - status
 *     properties:
 *      id:
 *        type: string
 *        description: O id é gerado automaticamente no cadastro do Estudante
 *      name:
 *        type: string
 *        description: Nome do Estudante
 *      age:
 *        type: string
 *        description: Idade do Estudante
 *      phone_number:
 *        type: string
 *        description: Contato do telefone do Estudante
 *      status:
 *        type: string
 *        description: Se o Estudante está ativamente participando das aulas
 *     example:
 *      name: Victor Leotte
 *      age: 6,
 *      phone_number: 48999055949
 *      status: on
 * 
 */

/**
 * @swagger
 * tags: 
 *   - name: Students
 *     description: >
 *       Controle da API pelo cadastro, consulta, edição e delete dos Estudantes nos JSONs.  
 *       **Por Victor L. Gaz**
 */


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

    router.get('/', (req, res) => {
      console.log("getroute");
      res.json(studentsDB);
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
   *         description: Retorna os dados do estudante(a)
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Students'
   *       404:
   *         description: Estudante não encontrado
   */
  
  router.get('/:id', (req,res)=>{
      const id = req.params.id;
      var student = studentsDB.find(student=>student.id === id);
      if(!student) return res.status(404).json({
          "erro":"Aluno(a) não encontrado"
      });
      res.json(student);
  });
  
  /**
 * @swagger
 * /students/name/name:
 *   get:
 *     summary: Retorna estudantes pelo Nome
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Nome do Estudante
 *     responses:
 *       200:
 *         description: Retorna os dados dos Estudantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Students'
 *       404:
 *         description: Nenhum estudante encontrado
 */

router.get('/name/name', (req, res) => {
    const name = req.query.name.toLowerCase(); // Usando parâmetros de consulta
    const students = studentsDB.filter(student => student.name.toLowerCase().includes(name)); // Filtrando estudantes

    if (students.length === 0) { // Verificando se nenhum estudante foi encontrado
        return res.status(404).json({
            "erro": "Nenhum estudante encontrado"
        });
    }
    
    res.json(students); // Retornando todos os estudantes encontrados
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
   *         description: O Estudante foi criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Students'
   */
  
  //POST "/students" 
  //BODY {"id": "7a6cc1282c5f6ec0235acd2bfa780145aa2a67fd", "name": "Victor Leotte", "age": "6",
  //"phone_number": "48999055949", "status": "on"}

  router.post('/', (req, res)=>{
      const student = req.body;
      console.log(student);
      student.id= uuidv4();
      if(!student.name) return res.status(400).json({
          "erro": "Estudante precisa ter um nome"
      });
      if(!student.age) return res.status(400).json({
          "erro": "O estudante precisa ter uma idade"
      });
      if(!student.phone_number) return res.status(400).json({
          "erro": "O estudante precisa ter um telefone"
      });
      if(!student.status) return res.status(400).json({
          "erro": "O estudamte precisa ter um status"
      });
  
      studentsDB.push(student);
  
      fs.writeFileSync(
          path.join(__dirname, '../db/students.json'),
          JSON.stringify(studentsDB, null, 2),
          'utf8'
      );
      return res.json(student);
  });
  
  /**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Atualiza os dados de um estudante pela ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do estudante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Students'
 *     responses:
 *       200:
 *         description: O Estudante foi atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Students'
 *       400:
 *         description: Estudante não encontrado
 */
  router.put('/:id', (req, res)=>{
      const id = req.params.id;
      const newStudent = req.body;
      const atualStudentIndex = studentsDB.findIndex(atualStudentIndex => atualStudentIndex.id === id);
      
      if(atualStudentIndex === -1){
          return res.status(400).json({
              "erro": "Estudante não encontrado"
          });
      }
  
      if(!newStudent.name) return res.status(400).json({
        "erro": "Estudante precisa ter um nome"
      });
      if(!newStudent.age) return res.status(400).json({
        "erro": "O estudante precisa ter uma idade"
      });
      if(!newStudent.phone_number) return res.status(400).json({
        "erro": "O estudante precisa ter um telefone"
      });
      if(!newStudent.status) return res.status(400).json({
        "erro": "O estudante precisa ter um status"
      });
      newStudent.id = studentsDB[atualStudentIndex].id
      studentsDB[atualStudentIndex] = newStudent;
  
      fs.writeFileSync(path.join(__dirname, '../db/teachers.json'), JSON.stringify(teachersDB, null, 2), 'utf8');
      return res.json(newTeacher);
  });

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Deleta o Estudante através do ID
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
 *         description: O Estudante foi deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Students'
 *       400:
 *         description: Estudante não encontrado
 */
  
  router.delete('/:id', (req, res)=>{
      const id = req.params.id;
      const student = studentsDB.find(student => student.id === id);
      if(!student) return res.status(404).json({
          "erro": "Estudante não encontrado"
      });
      var deletado = studentsDB.splice(id, 1)[0]
      res.json(deletado);
  })

module.exports = router;