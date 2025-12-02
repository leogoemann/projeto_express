const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.query('SELECT * FROM pacientes', (err, results) => {
    if (err) throw err;
    res.render('pacientes', { pacientes: results });
  });
});

router.get('/novo', (req, res) => {
  res.render('adicionar');
});

router.post('/novo', (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email } = req.body;
  db.query('INSERT INTO pacientes (nome, cpf, data_nascimento, telefone, email) VALUES (?, ?, ?, ?, ?)',
    [nome, cpf, data_nascimento, telefone, email],
    (err) => {
      if (err) throw err;
      res.redirect('/pacientes');
    });
});

router.get('/editar/:id', (req, res) => {
  db.query('SELECT * FROM pacientes WHERE id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.render('editar', { paciente: results[0] });
  });
});

router.post('/editar/:id', (req, res) => {
  const { nome, cpf, data_nascimento, telefone, email } = req.body;
  db.query('UPDATE pacientes SET nome=?, cpf=?, data_nascimento=?, telefone=?, email=? WHERE id=?',
    [nome, cpf, data_nascimento, telefone, email, req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect('/pacientes');
    });
});

router.get('/remover/:id', (req, res) => {
  db.query('DELETE FROM pacientes WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/pacientes');
  });
});

module.exports = router;
