/**
 * Extrai as iniciais do nome completo
 * @param displayName - Primeiro nome do usuário
 * @param lastName - Sobrenome do usuário
 * @returns Iniciais (primeira letra do nome + primeira letra do sobrenome)
 */
export function getInitials(displayName: string, lastName?: string): string {
  if (!displayName) return '';
  
  const firstInitial = displayName.charAt(0).toUpperCase();
  
  // Se temos lastName separado, usa ele
  if (lastName && lastName.trim()) {
    const lastInitial = lastName.charAt(0).toUpperCase();
    return firstInitial + lastInitial;
  }
  
  // Fallback: tenta extrair do displayName se contém espaços
  const names = displayName.trim().split(' ').filter(name => name.length > 0);
  
  if (names.length <= 1) return firstInitial;
  
  // Primeira letra do primeiro nome + primeira letra do último nome
  const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
  
  return firstInitial + lastInitial;
}