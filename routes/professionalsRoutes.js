const express = require('express');
const router = express.Router();
const {v4: uuidv4} = require('uuid');
const professionals = require('../db/professionals.json'); // Supondo que seja um array de objetos

// GET: listar todos os registros
router.get('/', (req, res) => {
    console.log("Listando todos os profissionais");
    res.json(professionals);
});

// GET por ID: busca por id
router.get('/id/:id', (req, res) => {
    const id = req.params.id;
    const profissional = professionals.find(prof => prof.id === id); // Busca pelo campo 'id'
    
    if (!profissional) {
        return res.status(404).json({
            "erro": "Profissional não encontrado"
        });
    }
    res.json(profissional);
});

// GET por nome: busca por nome
router.get('/nome/:nome', (req, res) => {
    const nome = req.params.nome;
    const profissionaisEncontrados = professionals.filter(prof => prof.nome.toLowerCase().includes(nome.toLowerCase()));

    if (profissionaisEncontrados.length === 0) {
        return res.status(404).json({
            "erro": "Profissional com esse nome não encontrado"
        });
    }
    res.json(profissionaisEncontrados);
});

// GET por data: busca por data de nascimento (ou outro campo de data)
router.get('/data/:data', (req, res) => {
    const data = req.params.data;
    const profissionaisEncontrados = professionals.filter(prof => prof.dataNascimento === data);

    if (profissionaisEncontrados.length === 0) {
        return res.status(404).json({
            "erro": "Nenhum profissional encontrado com essa data"
        });
    }
    res.json(profissionaisEncontrados);
});

// POST: cadastrar um novo registro
router.post('/', (req, res) => {
    const profissional = req.body;
    console.log(profissional);

    if (!profissional.nome) return res.status(400).json({ "erro": "Profissional precisa ter um 'nome'" });
    if (!profissional.cpf) return res.status(400).json({ "erro": "Profissional precisa ter um 'cpf'" });
    if (!profissional.sexo) return res.status(400).json({ "erro": "Profissional precisa ter um 'sexo'" });

    // Adicionando um novo id único ao profissional
    profissional.id = uuidv4();
    
    professionals.push(profissional);
    return res.json(profissional);
});

// PUT: atualizar um registro
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const novoProfissional = req.body;

    // Busca o profissional atual pelo id
    const atualProfissionalIndex = professionals.findIndex(prof => prof.id === id);
    
    if (atualProfissionalIndex === -1) {
        return res.status(404).json({ "erro": "Profissional não encontrado" });
    }

    if (!novoProfissional.nome) return res.status(400).json({ "erro": "Profissional precisa ter um 'nome'" });
    if (!novoProfissional.cpf) return res.status(400).json({ "erro": "Profissional precisa ter uma 'cpf'" });
    if (!novoProfissional.sexo) return res.status(400).json({ "erro": "Profissional precisa ter uma 'sexo'" });

    // Mantém o id existente
    novoProfissional.id = professionals[atualProfissionalIndex].id;
    professionals[atualProfissionalIndex] = novoProfissional;

    return res.json(novoProfissional);
});

// DELETE: apagar um registro
router.delete('/:id', (req, res) => {
    const id = req.params.id;
    const profissionalIndex = professionals.findIndex(prof => prof.id === id);

    if (profissionalIndex === -1) {
        return res.status(404).json({ "erro": "Profissional não encontrado" });
    }

    const deletado = professionals.splice(profissionalIndex, 1);
    res.json(deletado);
});

module.exports = router;