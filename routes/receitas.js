const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar receitas
router.get('/', (req, res) => {
  db.query(`
    SELECT receitas.*, pacientes.nome AS paciente
    FROM receitas
    JOIN consultas ON receitas.consulta_id = consultas.id
    JOIN pacientes ON consultas.paciente_id = pacientes.id
  `, (err, results) => {
    if (err) throw err;
    res.render('receitas', { receitas: results });
  });
});

// Formulário de nova receita
router.get('/novo', (req, res) => {
  res.render('receitas/novo');
});

// Adicionar receita
router.post('/novo', (req, res) => {
  const { consulta_id, descricao, data_emissao } = req.body;
  db.query('INSERT INTO receitas (consulta_id, descricao, data_emissao) VALUES (?, ?, ?)',
    [consulta_id, descricao, data_emissao],
    (err) => {
      if (err) throw err;
      res.redirect('/receitas');
    });
});

// Editar receita
router.post('/editar/:id', (req, res) => {
  const { consulta_id, descricao, data_emissao } = req.body;
  db.query('UPDATE receitas SET consulta_id=?, descricao=?, data_emissao=? WHERE id=?',
    [consulta_id, descricao, data_emissao, req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect('/receitas');
    });
});

// Remover receita
router.get('/remover/:id', (req, res) => {
  db.query('DELETE FROM receitas WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/receitas');
  });
});

module.exports = router;
