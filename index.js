const express = require('express');
const swaggerUI = require ('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();
const routes = require('./routes');
const cors = require('cors');
app.use(cors());

const options = {
    definition: {
        openapi: "3.0.0",
        info:{
            title: "API Gestão de Ensino",
            version: "1.0.0",
            description: "API de gestão de ensino para trabalho em sala de aula. Equipe: Érick Lúcio, Gregori Zaccaron, Victor Leotte, Karen Stackoski, Luis Gabriel e Mateus Mariot",
            license:{
                name: 'Licenciado para DAII',
            },
            contact: {
                name: 'Mateus M. ...'
            },
        },
        servers: [
            {
                url: "http://localhost:8080/",
                description: 'Server de teste',
            },
        ],
    },
    apis: ["./routes/*.js"],
};

const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

app.use(function(req, res, next){ //
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
   }); //

app.use(express.json());
app.use('/', routes)

app.listen(8080, function () { 
    console.log('Aplicação executando na porta 8080!');
    console.log('Aplicação: http://localhost:8080/');
    console.log('docs: http://localhost:8080/api-docs/');
}); 