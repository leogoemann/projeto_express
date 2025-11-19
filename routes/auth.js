const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');

// Rota de login (POST)
router.post('/login', (req, res) => {
    const { mail, password } = req.body;

    if (!mail || !password) {
        return res.status(400).send('Email e senha são obrigatórios');
    }

    // Buscar usuário no banco de dados
    db.query('SELECT * FROM usuarios WHERE email = ?', [mail], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro no servidor');
        }

        if (results.length === 0) {
            return res.status(401).send('Email ou senha incorretos');
        }

        const usuario = results[0];

        // Verificar se a senha existe no banco
        if (!usuario.senha) {
            console.error('Senha não encontrada no banco para o usuário:', usuario.email);
            return res.status(500).send('Erro na configuração do usuário. Execute: node init-db.js');
        }

        // Verificar senha
        const senhaCorreta = await bcrypt.compare(password, usuario.senha);

        if (!senhaCorreta) {
            return res.status(401).send('Email ou senha incorretos');
        }

        // Criar sessão
        req.session.userId = usuario.id;
        req.session.userName = usuario.nome;
        req.session.userEmail = usuario.email;

        res.redirect('/painel');
    });
});

// Rota de logout
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erro ao fazer logout');
        }
        res.redirect('/');
    });
});

module.exports = router;
