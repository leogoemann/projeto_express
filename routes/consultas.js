const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const query = `
    SELECT 
      c.id,
      c.paciente_id,
      c.medico_id,
      c.data_consulta,
      c.observacoes,
      c.status,
      COALESCE(p.nome, 'Não informado') as paciente,
      COALESCE(m.nome, 'Não informado') as medico
    FROM consultas c
    LEFT JOIN pacientes p ON c.paciente_id = p.id
    LEFT JOIN medicos m ON c.medico_id = m.id
    ORDER BY c.data_consulta DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar consultas:', err);
      res.status(500).send('Erro ao buscar consultas');
      return;
    }
    res.render('consultas', { consultas: results });
  });
});

router.get('/novo', (req, res) => {
  const queries = [
    'SELECT id, nome FROM pacientes ORDER BY nome',
    'SELECT id, nome FROM medicos ORDER BY nome'
  ];

  db.query(queries[0], (err, pacientes) => {
    if (err) {
      console.error('Erro ao buscar pacientes:', err);
      res.status(500).send('Erro ao carregar formulário');
      return;
    }

    db.query(queries[1], (err, medicos) => {
      if (err) {
        console.error('Erro ao buscar médicos:', err);
        res.status(500).send('Erro ao carregar formulário');
        return;
      }

      res.render('consultas/novo', { pacientes, medicos });
    });
  });
});

router.post('/novo', (req, res) => {
  const { paciente_id, medico_id, data_consulta, observacoes, status } = req.body;
  
  if (!paciente_id || !medico_id || !data_consulta) {
    console.error('Campos obrigatórios faltando');
    res.status(400).send('Por favor, preencha todos os campos obrigatórios');
    return;
  }
  
  const query = 'INSERT INTO consultas (paciente_id, medico_id, data_consulta, observacoes, status) VALUES (?, ?, ?, ?, ?)';
  const values = [
    paciente_id || null,
    medico_id || null,
    data_consulta,
    observacoes,
    status
  ];

  db.query(query, values, (err) => {
    if (err) {
      console.error('Erro ao adicionar consulta:', err);
      res.status(500).send('Erro ao adicionar consulta');
      return;
    }
    res.redirect('/consultas');
  });
});

router.get('/editar/:id', (req, res) => {
  db.query('SELECT * FROM consultas WHERE id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.render('consultas/editar', { consulta: results[0] });
  });
});

router.post('/editar/:id', (req, res) => {
  const { paciente_id, medico_id, data_consulta, observacoes, status } = req.body;
  db.query('UPDATE consultas SET paciente_id=?, medico_id=?, data_consulta=?, observacoes=?, status=? WHERE id=?',
    [paciente_id, medico_id, data_consulta, observacoes, status, req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect('/consultas');
    });
});

router.get('/remover/:id', (req, res) => {
  db.query('DELETE FROM consultas WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/consultas');
  });
});

module.exports = router;
