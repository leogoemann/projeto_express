const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar consultas
router.get('/', (req, res) => {
  db.query(`
    SELECT consultas.*, pacientes.nome AS paciente, medicos.nome AS medico
    FROM consultas
    JOIN pacientes ON consultas.paciente_id = pacientes.id
    JOIN medicos ON consultas.medico_id = medicos.id
  `, (err, results) => {
    if (err) throw err;
    res.render('consultas', { consultas: results });
  });
});

// Formulário de nova consulta
router.get('/novo', (req, res) => {
  res.render('consultas/novo');
});

// Adicionar consulta
router.post('/novo', (req, res) => {
  const { paciente_id, medico_id, data_consulta, observacoes, status } = req.body;
  db.query('INSERT INTO consultas (paciente_id, medico_id, data_consulta, observacoes, status) VALUES (?, ?, ?, ?, ?)',
    [paciente_id, medico_id, data_consulta, observacoes, status],
    (err) => {
      if (err) throw err;
      res.redirect('/consultas');
    });
});

// Editar consulta
router.post('/editar/:id', (req, res) => {
  const { paciente_id, medico_id, data_consulta, observacoes, status } = req.body;
  db.query('UPDATE consultas SET paciente_id=?, medico_id=?, data_consulta=?, observacoes=?, status=? WHERE id=?',
    [paciente_id, medico_id, data_consulta, observacoes, status, req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect('/consultas');
    });
});

// Remover consulta
router.get('/remover/:id', (req, res) => {
  db.query('DELETE FROM consultas WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/consultas');
  });
});

module.exports = router;
