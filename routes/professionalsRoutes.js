const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const professionals = require('../db/professionals.json'); // Supondo que seja um array de objetos

/**
 * @swagger
 * components:
 *  schemas:
 *      Professionals:
 *          type: object
 *          required:
 *           - id
 *           - name
 *           - especialidade
 *           - email
 *           - numero
 *           - status
 *          properties:
 *              id:
 *                  type: string
 *                  description: O id é gerado automaticamente no cadastro do profissional
 *              name:
 *                  type: string
 *                  description: Nome do profissional
 *              especialidade: 
 *                  type: string
 *                  description: Especialidade do profissional
 *              email: 
 *                  type: string
 *                  description: Email do profissional
 *              numero: 
 *                  type: string
 *                  description: Telefone do profissional
 *              status: 
 *                  type: string
 *                  description: Status do profissional (on/off)
 *          example:
 *              name: Profissional Souza
 *              especialidade: Fisioterapeuta
 *              email: profissional@email.com
 *              numero: +5511999999999
 *              status: on
 */

/**
 * @swagger
 * tags: 
 *  - name: Professionals
 *    description: >
 *          Controle da API pelo cadastro, consulta, edição e exclusão dos profissionais nos JSONs.
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

// GET: listar todos os registros
router.get('/', (req, res) => {
    console.log("Listando todos os profissionais");
    res.json(professionals);
});

/**
 * @swagger
 * /professionals/{id}:
 *  get:
 *      summary: Retorna um profissional pelo ID
 *      tags: [Professionals]
 *      parameters:
 *         - in: path
 *           name: id
 *           schema:
 *              type: string
 *           required: true
 *           description: ID do profissional
 *      responses:
 *          200:
 *              description: Sucesso ao buscar o profissional
 *              content: 
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Professionals'
 *          404:
 *              description: Profissional não encontrado
 */

// GET por ID: busca por id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    const profissional = professionals.find(prof => prof.id === id); // Busca pelo campo 'id'
    
    if (!profissional) {
        return res.status(404).json({
            "erro": "Profissional não encontrado"
        });
    }
    res.json(profissional);
});

/**
 * @swagger
 * /professionals/name/{name}:
 *  get:
 *      summary: Retorna profissionais pelo nome
 *      tags: [Professionals]
 *      parameters:
 *         - in: path
 *           name: name
 *           schema:
 *              type: string
 *           required: true
 *           description: Nome do profissional
 *      responses:
 *          200:
 *              description: Sucesso ao buscar o profissional
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/professionals'
 *          404:
 *              description: Profissional não encontrado
 */

// GET por Nome: busca por nome
router.get('/name/:name', (req, res) => {
    const name = req.params.name.toLowerCase();
    const profissionais = professionals.filter(prof => prof.name.toLowerCase().includes(name));

    if (profissionais.length === 0) {
        return res.status(404).json({
            "erro": "Nenhum profissional encontrado com esse nome"
        });
    }

    res.json(profissionais);
});
/**
 * @swagger
 * /professionals/especialidade/{especialidade}:
 *  get:
 *      summary: Retorna profissionais pela especialidade
 *      tags: [Professionals]
 *      parameters:
 *         - in: path
 *           name: especialidade
 *           schema:
 *              type: string
 *           required: true
 *           description: Especialidade do profissional
 *      responses:
 *          200:
 *              description: Sucesso ao buscar o profissional
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/professionals'
 *          404:
 *              description: Profissional não encontrado
 */

// GET por Especialidade: busca por especialidade
router.get('/especialidade/:especialidade', (req, res) => {
    const especialidade = req.params.especialidade.toLowerCase();
    const profissionais = professionals.filter(prof => prof.especialidade.toLowerCase().includes(especialidade));

    if (profissionais.length === 0) {
        return res.status(404).json({
            "erro": "Nenhum profissional encontrado com essa especialidade"
        });
    }
    res.json(profissionais);
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

// POST: cadastrar um novo registro
router.post('/', (req, res) => {
    const profissional = req.body;
    console.log(profissional);

    // Validações de campos obrigatórios
    if (!profissional.name) return res.status(400).json({ "erro": "Profissional precisa ter um 'nome'" });
    if (!profissional.especialidade) return res.status(400).json({ "erro": "Profissional precisa ter uma 'especialidade'" });
    if (!profissional.email) return res.status(400).json({ "erro": "Profissional precisa ter um 'email'" });
    if (!profissional.numero) return res.status(400).json({ "erro": "Profissional precisa ter um 'numero'" });
    if (!profissional.status) return res.status(400).json({ "erro": "Profissional precisa ter um 'status'" });

    // Adicionando um novo id único ao profissional
    profissional.id = uuidv4();
    
    professionals.push(profissional);
    return res.status(201).json(profissional); // Retorna 201 para criação bem-sucedida
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

// PUT: atualizar um profissional pelo ID
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const novoProfissional = req.body;

    // Busca o profissional pelo ID
    const atualProfissionalIndex = professionals.findIndex(prof => prof.id === id);
    
    if (atualProfissionalIndex === -1) {
        return res.status(404).json({ "erro": "Profissional não encontrado" });
    }

    // Validações de campos obrigatórios
    if (!novoProfissional.name) return res.status(400).json({ "erro": "Profissional precisa ter um 'nome'" });
    if (!novoProfissional.especialidade) return res.status(400).json({ "erro": "Profissional precisa ter uma 'especialidade'" });
    if (!novoProfissional.email) return res.status(400).json({ "erro": "Profissional precisa ter um 'email'" });
    if (!novoProfissional.numero) return res.status(400).json({ "erro": "Profissional precisa ter um 'numero'" });
    if (!novoProfissional.status) return res.status(400).json({ "erro": "Profissional precisa ter um 'status'" });

    // Mantém o id existente
    novoProfissional.id = professionals[atualProfissionalIndex].id;
    professionals[atualProfissionalIndex] = novoProfissional;

    return res.json(novoProfissional);
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

// DELETE: apagar um profissional pelo ID
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const profissionalIndex = professionals.findIndex(prof => prof.id === id);

    if (profissionalIndex === -1) {
        return res.status(404).json({ "erro": "Profissional não encontrado" });
    }

    const deletado = professionals.splice(profissionalIndex, 1);
    return res.json(deletado[0]); // Retorna o profissional deletado
});

module.exports = router;