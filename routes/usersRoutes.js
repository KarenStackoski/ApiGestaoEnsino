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

router.get('/:id/:name', (req, res)=>{
    const id = req.params.id;
    const name = req.params.name;

    var findUser = usersDB.find(user=>user.id === id || user.name === name)

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

router.put('', (req, res)=>{
    
});

router.delete('', (req, res)=>{
    
});

module.exports = router;