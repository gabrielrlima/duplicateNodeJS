// Script para resetar configurações do menu
// Execute este código no console do navegador (F12 > Console)

console.log('🔄 Resetando configurações do menu...');

// Remove as configurações armazenadas no localStorage
localStorage.removeItem('app-settings');

// Remove outras possíveis chaves relacionadas
localStorage.removeItem('theme-mode');

console.log('✅ Configurações removidas do localStorage');
console.log('🔄 Recarregando a página...');

// Recarrega a página para aplicar as configurações padrão
window.location.reload();