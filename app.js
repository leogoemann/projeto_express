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

app.use(session({
    secret: 'seu_segredo_aqui_mude_em_producao',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}));

app.use('/auth', authRoutes);

app.use('/pacientes', verificarAutenticacao, pacientesRoutes);
app.use('/medicos', verificarAutenticacao, medicosRoutes);
app.use('/consultas', verificarAutenticacao, consultasRoutes);
app.use('/receitas', verificarAutenticacao, receitasRoutes);

app.get('/', (req, res) => {
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
