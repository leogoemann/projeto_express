const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar médicos
router.get('/', (req, res) => {
  db.query('SELECT * FROM medicos', (err, results) => {
    if (err) throw err;
    res.render('medicos', { medicos: results });
  });
});

// Formulário de novo médico
router.get('/novo', (req, res) => {
  res.render('medicos/novo');
});

// Adicionar médico
router.post('/novo', (req, res) => {
  const { nome, crm, especialidade, telefone, email } = req.body;
  db.query('INSERT INTO medicos (nome, crm, especialidade, telefone, email) VALUES (?, ?, ?, ?, ?)',
    [nome, crm, especialidade, telefone, email],
    (err) => {
      if (err) throw err;
      res.redirect('/medicos');
    });
});

// Editar médico
router.post('/editar/:id', (req, res) => {
  const { nome, crm, especialidade, telefone, email } = req.body;
  db.query('UPDATE medicos SET nome=?, crm=?, especialidade=?, telefone=?, email=? WHERE id=?',
    [nome, crm, especialidade, telefone, email, req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect('/medicos');
    });
});

// Remover médico
router.get('/remover/:id', (req, res) => {
  db.query('DELETE FROM medicos WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/medicos');
  });
});

module.exports = router;
