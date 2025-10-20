const express = require('express');
const app = express();
const pacientesRoutes = require('./routes/pacientes');
const medicosRoutes = require('./routes/medicos')
const consultasRoutes = require('./routes/consultas')
const receitasRoutes = require ('./routes/receitas')

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use('/pacientes', pacientesRoutes);
app.use('/medicos', medicosRoutes);
app.use('/consultas', consultasRoutes);
app.use('/receitas', receitasRoutes);

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/painel', (req, res) => {
    res.render('painel')
})

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
