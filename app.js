const express = require('express');
const session = require('express-session');
const app = express();
const pacientesRoutes = require('./routes/pacientes');
const medicosRoutes = require('./routes/medicos')
const consultasRoutes = require('./routes/consultas')
const receitasRoutes = require ('./routes/receitas')
const authRoutes = require('./routes/auth');
const verificarAutenticacao = require('./middleware/auth');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configurar sessões
app.use(session({
    secret: 'seu_segredo_aqui_mude_em_producao',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // mude para true se usar HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Rotas de autenticação
app.use('/auth', authRoutes);

// Rotas protegidas
app.use('/pacientes', verificarAutenticacao, pacientesRoutes);
app.use('/medicos', verificarAutenticacao, medicosRoutes);
app.use('/consultas', verificarAutenticacao, consultasRoutes);
app.use('/receitas', verificarAutenticacao, receitasRoutes);

app.get('/', (req, res) => {
    // Se já estiver logado, redirecionar para o painel
    if (req.session && req.session.userId) {
        return res.redirect('/painel');
    }
    res.render('index')
})

app.get('/painel', verificarAutenticacao, (req, res) => {
    res.render('painel', {
        userName: req.session.userName,
        userEmail: req.session.userEmail
    })
})

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
