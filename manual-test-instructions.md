# Teste Manual do Formulário de Terreno

## Instruções para Testar o Formulário

### 1. Acesse a página do formulário
- URL: http://localhost:8080/dashboard/terrenos/new

### 2. Preencha os campos obrigatórios:

#### Informações Básicas:
- **Título**: "Terreno de Teste Manual"
- **Preço (R$)**: "150000" (ou 150.000)
- **Área (m²)**: "500"

#### Dados do Proprietário:
- **Nome**: "João Silva Teste"
- **Email**: "joao.teste@email.com"
- **Telefone**: "(11) 99988-7766"
- **CPF/CNPJ**: "123.456.789-01"

### 3. Campos opcionais (recomendados para teste completo):
- **Descrição**: "Terreno criado através de teste manual"
- **Status**: Deixar como "Disponível" (padrão)
- **Tipo**: Deixar como "Residencial" (padrão)

### 4. Teste a submissão:
1. Clique no botão "Criar Terreno"
2. Observe o console do navegador (F12 > Console)
3. Verifique se aparecem os logs:
   - "🎯 handleSave chamado!"
   - "📋 Dados do formulário: {...}"
   - "🚀 Salvando terreno: {...}"
   - "Dados para API: {...}"

### 5. Resultados esperados:
- ✅ Toast de sucesso: "Terreno criado com sucesso!"
- ✅ Redirecionamento para: http://localhost:8080/dashboard/terrenos
- ✅ Formulário resetado
- ✅ Sem erros no console

### 6. Possíveis problemas e soluções:

#### Se aparecer erro de validação:
- Verifique se todos os campos obrigatórios estão preenchidos
- Verifique se o preço e área são maiores que zero
- Verifique se o email tem formato válido

#### Se aparecer erro de API:
- Verifique se o backend está rodando
- Verifique os logs do servidor backend
- Verifique se há uma imobiliária selecionada (o formulário usa um ID de teste se não houver)

#### Se não houver redirecionamento:
- Verifique se o toast de sucesso apareceu
- Verifique os logs do console para erros
- Verifique se a função `router.push` foi chamada

### 7. Teste adicional - Validação de campos:
1. Tente submeter o formulário vazio
2. Verifique se aparecem mensagens de erro nos campos obrigatórios
3. Tente inserir um email inválido
4. Tente inserir valores zero ou negativos para preço/área

### 8. Como executar o script de teste automatizado:
1. Abra o console do navegador (F12 > Console)
2. Cole e execute o conteúdo do arquivo `test-terreno-form.js`
3. Execute: `testTerrenoForm()`
4. Aguarde 3 segundos e execute: `testSubmission()`

### 9. Verificação final:
- Acesse a lista de terrenos: http://localhost:8080/dashboard/terrenos
- Verifique se o novo terreno aparece na lista
- Verifique se os dados estão corretos