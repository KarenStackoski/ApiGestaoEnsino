const express = require('express');
const path = require('path');
const router = express.Router();
const usersDB = require('../db/users.json');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017');

const usersSchema = new mongoose.Schema({
    userName: String,
    userEmail: String,
    userUser: String,
    userLevel: String,
    userStatus: Boolean,
    userPassword: String  // Adicionando a senha
});

/**
 * @swagger
 * components:
 *  schemas:
 *      Users:
 *          type: object
 *          required:
 *           - userName
 *           - userEmail
 *           - userUser
 *           - userLevel
 *           - userStatus
 *           - userPassword  // Adicionando a senha como campo obrigatório
 *          properties:
 *              userName:
 *                  type: string
 *                  description: Nome do usuário
 *              userEmail: 
 *                  type: string
 *                  description: E-mail do usuário
 *              userUser: 
 *                  type: string
 *                  description: User de login do usuário
 *              userLevel: 
 *                  type: string
 *                  description: Nível do usuário
 *              userStatus: 
 *                  type: boolean
 *                  description: Status do usuário
 *              userPassword: 
 *                  type: string
 *                  description: Senha do usuário
 *          example:
 *              userName: Karen Bialescki Stackoski
 *              userEmail: stackoski@email.com
 *              userUser: stackoski
 *              userLevel: adm
 *              userStatus: true
 *              userPassword: mySecurePassword123
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

const User = mongoose.model('User', usersSchema);

router.get('/', async (req, res) => {
    try {
        const docs = await User.find();
        res.status(200).json(docs);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
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

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const docs = await User.findById(id);
        
        if(!docs){
            return res.status(404).json({message: "Usuário(a) não encontrado"})
        }
        
        res.json(docs);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
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

router.post('/', async (req, res) => {
    const user = req.body;

    try {
        const newUser = await User.create(user);
        res.json(newUser);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
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

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const newUser = req.body;
    
    try {
        const updateUser = await User.findByIdAndUpdate(id, {
            userName: newUser.userName,
            userEmail: newUser.userEmail,
            userUser: newUser.userUser,
            userLevel: newUser.userLevel,
            userStatus: newUser.userStatus,
            userPassword: newUser.userPassword  // Atualizando a senha
        }, {new: true});
        res.json(updateUser);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
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

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deleteUser = await User.findByIdAndDelete(id);
        res.json(deleteUser);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;
