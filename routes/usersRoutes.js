const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Certifique-se de que o caminho do modelo esteja correto
const router = express.Router();

<<<<<<< Updated upstream
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
=======
// Endpoint para Login de Usuário
router.post('/login', async (req, res) => {
    const { userUser, password } = req.body;

    try {
        // Busca o usuário pelo nome de usuário (userUser)
        const user = await User.findOne({ userUser });

        if (!user) {
            return res.status(400).json({ message: 'Usuário não encontrado' });
        }

        // Verifica se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Senha incorreta' });
        }

        // Login bem-sucedido
        res.status(200).json({ message: 'Login bem-sucedido', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
>>>>>>> Stashed changes
});

// Endpoint para listar todos os usuários
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

<<<<<<< Updated upstream
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const findUser = usersDB.find(user => user.id === id);

    if (!findUser) {
        return res.status(404).json({
            "erro": "Usuário não encontrado"
        });
=======
// Endpoint para buscar um usuário pelo ID
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
>>>>>>> Stashed changes
    }

<<<<<<< Updated upstream
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
=======
// Endpoint para criar um novo usuário
router.post('/', async (req, res) => {
    const { userName, userEmail, userUser, userLevel, userStatus, password } = req.body;

    // Criptografando a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
        userName,
        userEmail,
        userUser,
        userLevel,
        userStatus,
        password: hashedPassword
    });

    try {
        const savedUser = await newUser.save();
        res.status(200).json(savedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
>>>>>>> Stashed changes
    }

    usersDB.push(user);

    fs.writeFileSync(
        path.join(__dirname, '../db/users.json'),
        JSON.stringify(usersDB, null, 2),
        'utf8'
    );

    return res.json(user);
});

<<<<<<< Updated upstream
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
=======
// Endpoint para atualizar os dados de um usuário
router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const { userName, userEmail, userUser, userLevel, userStatus, password } = req.body;

    // Criptografando a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            userName,
            userEmail,
            userUser,
            userLevel,
            userStatus,
            password: hashedPassword
        }, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
// Endpoint para excluir um usuário
router.delete('/:id', async (req, res) => {
>>>>>>> Stashed changes
    const id = req.params.id;
    const userIndex = usersDB.findIndex(user => user.id === id);

<<<<<<< Updated upstream
    if (userIndex === -1) {
        return res.status(400).json({
            "erro": "Usuário não encontrado!"
        });
=======
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        res.status(200).json(deletedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
>>>>>>> Stashed changes
    }

    const [deletedUser] = usersDB.splice(userIndex, 1);

    fs.writeFileSync(path.join(__dirname, '../db/users.json'), JSON.stringify(usersDB, null, 2), 'utf8');
    res.json(deletedUser);
});

module.exports = router;
