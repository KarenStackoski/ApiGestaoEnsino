const express = require('express');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const usersDB = require('../db/users.json');

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
 *                  description: Nome do usuário
 *              email: 
 *                  type: string
 *                  description: E-mail do usuário
 *              user: 
 *                  type: string
 *                  description: User de login do usuário
 *              level: 
 *                  type: string
 *                  description: Nível do usuário
 *              status: 
 *                  type: string
 *                  description: Status do usuário
 *          example:
 *              name: Karen Bialescki Stackoski
 *              email: stackoski@email.com
 *              user: stackoski
 *              level: adm
 *              status: on
 */

/**
 * @swagger
 * tags: 
 *  - name: Users
 *    description: >
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

router.get('/', (req, res) => {
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
 *           name: id
 *           schema:
 *              type: string
 *           required: true
 *           description: ID do Usuário
 *      responses:
 *          200:
 *              description: Sucesso ao buscar o usuário
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Users'
 *          404:
 *              description: Usuário não encontrado
 */

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const findUser = usersDB.find(user => user.id === id);

    if (!findUser) {
        return res.status(404).json({
            "erro": "Usuário não encontrado"
        });
    }

    res.json(findUser);
});

/**
 * @swagger
 * /users/name/{name}:
 *  get:
 *      summary: Retorna um usuário pelo Nome
 *      tags: [Users]
 *      parameters:
 *         - in: path
 *           name: name
 *           schema:
 *              type: string
 *           required: true
 *           description: Nome do Usuário
 *      responses:
 *          200:
 *              description: Sucesso ao buscar o usuário
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Users'
 *          404:
 *              description: Usuário não encontrado
 */

router.get('/name/:name', (req, res) => {
    const name = req.query.name;
    let findUser = usersDB;

    if(name){
        findUser = findUser.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (!findUser) {
        return res.status(404).json({
            "erro": "Usuário não encontrado"
        });
    }

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
 *                          $ref: '#/components/schemas/Users'
 */

router.post('/', (req, res) => {
    const user = req.body;
    user.id = uuidv4();

    if (!user.name || !user.email || !user.user || !user.level || !user.status) {
        return res.status(400).json({
            "erro": "Todos os campos (name, email, user, level, status) são obrigatórios!"
        });
    }

    usersDB.push(user);

    fs.writeFileSync(
        path.join(__dirname, '../db/users.json'),
        JSON.stringify(usersDB, null, 2),
        'utf8'
    );

    return res.json(user);
});

/**
 * @swagger
 * /users/{id}:
 *  put:
 *      summary: Altera os dados do usuário
 *      tags: [Users]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: ID do usuário
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
 *                          $ref: '#/components/schemas/Users'
 *          400:
 *              description: Usuário não encontrado ou parâmetros obrigatórios ausentes
 */

router.put('/:id', (req, res) => {
    const id = req.params.id;
    const newUser = req.body;
    const atualUserIndex = usersDB.findIndex(user => user.id === id);

    if (atualUserIndex === -1) {
        return res.status(400).json({
            "erro": "Usuário não encontrado"
        });
    }

    if (!newUser.name || !newUser.email || !newUser.user || !newUser.level || !newUser.status) {
        return res.status(400).json({
            "erro": "Todos os campos (name, email, user, level, status) são obrigatórios!"
        });
    }

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
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: ID do usuário
 *      responses:
 *          200:
 *              description: Sucesso ao excluir o usuário
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Users'
 *          400:
 *              description: Usuário não encontrado
 */

router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const userIndex = usersDB.findIndex(user => user.id === id);

    if (userIndex === -1) {
        return res.status(400).json({
            "erro": "Usuário não encontrado!"
        });
    }

    const [deletedUser] = usersDB.splice(userIndex, 1);

    fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(usersDB, null, 2), 'utf8');
    res.json(deletedUser);
});

module.exports = router;
