const express = require('express');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const usersDB = require('../db/users.json')

/**
 * @swagger
 * components:
 *  schemas:
 *      Users:
 *          type: object
 *          required:
 *           - id
 *           - name
 *           - email
 *           - user
 *           - level
 *           - status
 *          properties:
 *              id:
 *                  type: string
 *                  description: O id é gerado automaticamente no cadastro do Usuário
 *              name:
 *                  type: string
 *                  description: nome do usuário
 *              email: 
 *                  type: string
 *                  description: e-mail do usuário
 *              user: 
 *                  type: string
 *                  description: user de login do usuário
 *              level: 
 *                  type: string
 *                  description: nível do usuário
 *              status: 
 *                  type: string
 *                  description: status do usuário
 *          example:
 *              name: Karen Bialescki Stackoski
 *              email: stackoski@email.com
 *              user: stackoski
 *              level: adm
 *              status on
 */

/**
 * @swagger
 * tags: 
 *  - name: Users
 *      description: >
 *          Controle da API pelo cadastro, consulta, edição e exclusão dos usuários nos JSONs.
 *          **Por Karen Bialescki Stackoski**
 */

/**
 * @swagger
 * /users:
 *  get:
 *      summary: Retorna todos os usuários
 *      tags: [Users]
 *      responses:
 *          200:
 *              description: Sucesso ao buscar os usuários
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Users'
 */

router.get('/', (req, res)=>{
    console.log("getroute");
    res.json(usersDB);
});

/**
 * @swagger
 * /users/{id}:
 *  get:
 *      summary: Retorna um usuário pelo ID
 *      tags: [Users]
 *      parameters:
 *         - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: ID do Usuário
 *      responses:
 *          200:
 *              description: Sucesso ao buscar o usuário
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Users'
 *          404:
 *              description: Usuário não encontrado
 */

router.get('/:id', (req, res)=>{
    const id = req.params.id;

    var findUser = usersDB.find(user=>user.id === id)

    if(!findUser) return res.status(404).json({
        "erro:": "Usuário não encontrado"
    })

    res.json(findUser);
});

/**
 * @swagger
 * /users:
 *  post:
 *      summary: Cria um usuário
 *      tags: [Users]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Users'
 *      responses:
 *          200:
 *              description: Sucesso ao criar o usuário
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Users'
 */

router.post('/', (req, res)=>{
    const user = req.body;
    user.id = uuidv4();

    if(!user.name) return res.status(404).json({
        "erro": "Campo nome do usuário não está preenchido. Por favor preencha para prosseguir o cadastro!"
    })
    if(!user.email) return res.status(404).json({
        "erro": "Campo email do usuário não está preenchido. Por favor preencha para prosseguir o cadastro!"
    })
    if(!user.user) return res.status(404).json({
        "erro": "Campo user do usuário não está preenchido. Por favor preencha para prosseguir o cadastro!"
    })
    if(!user.level) return res.status(404).json({
        "erro": "Campo nível do usuário não está preenchido. Por favor preencha para prosseguir o cadastro!"
    })
    if(!user.status) return res.status(404).json({
        "erro": "Campo status do usuário não está preenchido. Por favor preencha para prosseguir o cadastro!"
    })

    usersDB.push(user);

    fs.writeFileSync(
        path.join(__dirname, '../db/users.json'),
        JSON.stringify(usersDB, null, 2),
        'utf8'
    )

    return res.json(user)
});

/**
 * @swagger
 * /users/{id}:
 *  put:
 *      summary: Altera os dados do usuário
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: ID do usuário
 *      requestBody:
 *          required: true
 *          content:
 *              application/json: 
 *                  schema:
 *                      $ref: '#/components/schemas/Users'
 *      responses:
 *          200:
 *              description: Sucesso ao alterar o usuário
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Users'
 *          400:
 *              description: Usuário não encontrado
 */

router.put('/:id', (req, res)=>{
    const id = req.params.id;
    const newUser = req.body;
    const atualUserIndex = usersDB.findIndex(atualUserIndex => atualUserIndex.id === id);

    if(atualUserIndex === -1) {
        return res.status(400).json({
            "erro": "Usuário não encontrado"
        });
    }

    if(!newUser.name) return res.status(400).json({
        "erro": "Parâmetro nome do Usuário é obrigatório!"
    });
    if(!newUser.email) return res.status(400).json({
        "erro": "Parâmetro e-mail do Usuário é obrigatório!"
    });
    if(!newUser.user) return res.status(400).json({
        "erro": "Parâmetro user do Usuário é obrigatório!"
    });
    if(!newUser.level) return res.status(400).json({
        "erro": "Parâmetro nível do Usuário é obrigatório!"
    });
    if(!newUser.status) return res.status(400).json({
        "erro": "Parâmetro status do Usuário é obrigatório!"
    });

    newUser.id = usersDB[atualUserIndex].id;
    usersDB[atualUserIndex] = newUser;

    fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(usersDB, null, 2), 'utf8');
    return res.json(newUser);
});

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *      summary: Exclui o usuário
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *          name: id
 *          schema:
 *              type: string
 *          required: true
 *          description: ID do usuário
 *      responses:
 *          200:
 *              description: Sucesso ao excluir o usuário
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Users'
 *          400:
 *              description: Usuário não encontrado
 */

router.delete('/:id', (req, res)=>{
    const id = req.params.id;
    const user = usersDB.find(user => user.id === id);

    if(!user) return res.status(400).json({
        "user": "Usuário não encontrado!"
    });

    var deletado = usersDB.splice(id, 1)[0]
    res.json(deletado);
});

module.exports = router;