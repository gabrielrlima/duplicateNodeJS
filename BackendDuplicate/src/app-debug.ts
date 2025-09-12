import express from 'express';

const app = express();

// Middleware para debug
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.url}`);
  next();
});

// Parsing
app.use(express.json());

// Rotas simples
app.get('/', (req, res) => {
  res.json({ message: 'Servidor funcionando!' });
});

app.get('/ping', (req, res) => {
  res.json({ message: 'pong-get' });
});

app.post('/ping', (req, res) => {
  console.log('Body:', req.body);
  res.json({ message: 'pong-post', body: req.body });
});

// Rota de login simples
app.post('/login', (req, res) => {
  console.log('Login request:', req.body);
  const { email, password } = req.body;
  
  if (!email || !password) {
    res.status(400).json({ error: 'Email e senha são obrigatórios' });
    return;
  }
  
  res.json({ 
    success: true, 
    message: 'Login bem-sucedido (mock)',
    user: { email, id: 1 }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Servidor debug rodando na porta ${PORT}`);
});

export default app;