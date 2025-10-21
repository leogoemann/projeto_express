const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar receitas
router.get('/', (req, res) => {
  const query = `
    SELECT 
      r.id,
      r.consulta_id,
      r.descricao,
      r.data_emissao,
      p.nome as paciente,
      m.nome as medico,
      DATE_FORMAT(c.data_consulta, '%d/%m/%Y %H:%i') as data_consulta
    FROM receitas r
    JOIN consultas c ON r.consulta_id = c.id
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN medicos m ON c.medico_id = m.id
    ORDER BY r.data_emissao DESC
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar receitas:', err);
      res.status(500).send('Erro ao buscar receitas');
      return;
    }
    res.render('receitas', { receitas: results });
  });
});

// Formulário de nova receita
router.get('/novo', (req, res) => {
  // Buscar consultas disponíveis com informações do paciente e médico
  const query = `
    SELECT 
      c.id,
      p.nome as paciente,
      m.nome as medico,
      DATE_FORMAT(c.data_consulta, '%d/%m/%Y %H:%i') as data_consulta
    FROM consultas c
    JOIN pacientes p ON c.paciente_id = p.id
    JOIN medicos m ON c.medico_id = m.id
    ORDER BY c.data_consulta DESC
  `;

  db.query(query, (err, consultas) => {
    if (err) {
      console.error('Erro ao buscar consultas:', err);
      res.status(500).send('Erro ao carregar formulário');
      return;
    }
    res.render('receitas/novo', { consultas });
  });
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
