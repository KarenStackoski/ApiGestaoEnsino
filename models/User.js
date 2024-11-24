const mongoose = require('mongoose');

// Definindo o modelo do usuário
const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    userUser: { type: String, required: true },
    userPassword: { type: String, required: true },
    userLevel: { type: String, required: true },
    userStatus: { type: Boolean, required: true }
});

// Criação do modelo baseado no schema
const User = mongoose.model('User', userSchema);

module.exports = User;
