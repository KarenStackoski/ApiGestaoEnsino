const express = require('express');
const {v4: uuidv4} = require('uuid');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const teachersDB = require('../db/teachers.json');

router.get('/', (req, res)=>{
    console.log("getroute");
    res.json(teachersDB);
});

router.get('/:id', (req,res)=>{
    const id = req.params.id;
    var teacher = teachersDB.find(teacher=>teacher.id === id);
    if(!teacher) return res.status(404).json({
        "erro":"Personagem não encontrado"
    });
    res.json(teacher);
});

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

router.delete('/:id', (req, res)=>{
    const id = req.params.id;
    const teacher = teachersDB.find(teacher => teacher.id === id);
    if(!teacher) return res.status(404).json({
        "erro": "Professor(a) não encontrado"
    });
    var deletado = teachersDB.splice(id, 1)[0]
    res.json(deletado);
})

module.exports = router;