import { z } from 'zod';

// Configuração global de mensagens de erro do Zod em português
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.expected === 'string') {
        return { message: 'Campo obrigatório' };
      }
      return { message: 'Tipo inválido' };
    
    case z.ZodIssueCode.too_small:
      if (issue.type === 'string') {
        if (issue.minimum === 1) {
          return { message: 'Campo obrigatório' };
        }
        return { message: `Deve ter pelo menos ${issue.minimum} caracteres` };
      }
      if (issue.type === 'number') {
        return { message: `Deve ser maior que ${issue.minimum}` };
      }
      return { message: 'Valor muito pequeno' };
    
    case z.ZodIssueCode.too_big:
      if (issue.type === 'string') {
        return { message: `Deve ter no máximo ${issue.maximum} caracteres` };
      }
      if (issue.type === 'number') {
        return { message: `Deve ser menor que ${issue.maximum}` };
      }
      return { message: 'Valor muito grande' };
    
    case z.ZodIssueCode.invalid_string:
      if (issue.validation === 'email') {
        return { message: 'Email inválido' };
      }
      if (issue.validation === 'url') {
        return { message: 'URL inválida' };
      }
      return { message: 'Formato inválido' };
    
    case z.ZodIssueCode.invalid_date:
      return { message: 'Data inválida' };
    
    case z.ZodIssueCode.custom:
      return { message: ctx.defaultError };
    
    default:
      return { message: ctx.defaultError };
  }
};

// Aplicar a configuração global
z.setErrorMap(customErrorMap);

export { z };