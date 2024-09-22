const express = require('express');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const usersDB = require('../db/users.json')

router.get('/', (req, res)=>{
    console.log("getroute");
    res.json(usersDB);
});

router.get('/:id', (req, res)=>{
    const id = req.params.id;

    var findUser = usersDB.find(user=>user.id === id)

    if(!findUser) return res.status(404).json({
        "erro:": "Usuário não encontrado"
    })

    res.json(findUser);
});

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