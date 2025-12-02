const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'leoapp',
  password: 'leo@5155',
  database: 'clinica'
});

console.log('🚀 Inicializando banco de dados...\n');

connection.connect((err) => {
  if (err) {
    console.error('❌ Erro de conexão:', err);
    process.exit(1);
  }
  console.log('✓ Conectado ao MySQL!\n');

  const dropTables = [
    'DROP TABLE IF EXISTS receitas',
    'DROP TABLE IF EXISTS consultas',
    'DROP TABLE IF EXISTS usuarios',
    'DROP TABLE IF EXISTS medicos',
    'DROP TABLE IF EXISTS pacientes'
  ];

  console.log('🔄 Removendo tabelas antigas...');
  
  let dropCount = 0;
  dropTables.forEach((dropSql) => {
    connection.query(dropSql, (err) => {
      if (err) {
        console.error('❌ Erro ao dropar tabela:', err);
        connection.end();
        process.exit(1);
      }
      dropCount++;
      if (dropCount === dropTables.length) {
        console.log('✓ Tabelas antigas removidas\n');
        createTables();
      }
    });
  });
});

function createTables() {
  console.log('🔄 Criando tabelas...\n');

  const createPacientes = `
    CREATE TABLE pacientes (
      Id INT AUTO_INCREMENT PRIMARY KEY,
      Nome VARCHAR(100),
      CPF VARCHAR(14),
      Data_nascimento DATE,
      Telefone VARCHAR(20),
      Email VARCHAR(100),
      Endereco TEXT
    )
  `;

  connection.query(createPacientes, (err) => {
    if (err) {
      console.error('❌ Erro ao criar tabela pacientes:', err);
      connection.end();
      process.exit(1);
    }
    console.log('✓ Tabela pacientes criada');

    const createMedicos = `
      CREATE TABLE medicos (
        Id INT AUTO_INCREMENT PRIMARY KEY,
        Nome VARCHAR(100),
        CRM VARCHAR(20),
        Especialidade VARCHAR(50),
        Telefone VARCHAR(20),
        Email VARCHAR(100)
      )
    `;

    connection.query(createMedicos, (err) => {
      if (err) {
        console.error('❌ Erro ao criar tabela medicos:', err);
        connection.end();
        process.exit(1);
      }
      console.log('✓ Tabela medicos criada');

      const createConsultas = `
        CREATE TABLE consultas (
          Id INT AUTO_INCREMENT PRIMARY KEY,
          Paciente_id INT,
          Medico_id INT,
          Data_consulta DATETIME,
          Observacoes TEXT,
          Status VARCHAR(20),
          FOREIGN KEY (Medico_id) REFERENCES medicos(Id)
        )
      `;

      connection.query(createConsultas, (err) => {
        if (err) {
          console.error('❌ Erro ao criar tabela consultas:', err);
          connection.end();
          process.exit(1);
        }
        console.log('✓ Tabela consultas criada');

        const createReceitas = `
          CREATE TABLE receitas (
            Id INT AUTO_INCREMENT PRIMARY KEY,
            Consulta_id INT,
            Descricao TEXT,
            Data_emissao DATE,
            FOREIGN KEY (Consulta_id) REFERENCES consultas(Id)
          )
        `;

        connection.query(createReceitas, (err) => {
          if (err) {
            console.error('❌ Erro ao criar tabela receitas:', err);
            connection.end();
            process.exit(1);
          }
          console.log('✓ Tabela receitas criada');

          const createUsuarios = `
            CREATE TABLE usuarios (
              id INT AUTO_INCREMENT PRIMARY KEY,
              nome VARCHAR(255) NOT NULL,
              email VARCHAR(255) UNIQUE NOT NULL,
              senha VARCHAR(255) NOT NULL,
              criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
          `;

          connection.query(createUsuarios, (err) => {
            if (err) {
              console.error('❌ Erro ao criar tabela usuarios:', err);
              connection.end();
              process.exit(1);
            }
            console.log('✓ Tabela usuarios criada\n');

            criarUsuarioAdmin();
          });
        });
      });
    });
  });
}

function criarUsuarioAdmin() {
  console.log('🔄 Criando usuário administrador...');
  
  bcrypt.hash('admin123', 10, (err, hash) => {
    if (err) {
      console.error('❌ Erro ao gerar hash:', err);
      connection.end();
      process.exit(1);
    }

    connection.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
      ['Administrador', 'admin@clinica.com', hash],
      (err, result) => {
        if (err) {
          console.error('❌ Erro ao criar usuário admin:', err);
          connection.end();
          process.exit(1);
        }

        console.log('✓ Usuário admin criado\n');
        console.log('='.repeat(50));
        console.log('✅ BANCO DE DADOS INICIALIZADO COM SUCESSO!');
        console.log('='.repeat(50));
        console.log('\n📋 Credenciais de acesso:');
        console.log('   Email: admin@clinica.com');
        console.log('   Senha: admin123\n');

        connection.end();
        process.exit(0);
      }
    );
  });
}
