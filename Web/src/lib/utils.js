import { clsx } from 'clsx';

/**
 * Função utilitária para combinar classes CSS condicionalmente
 * Substitui a necessidade de twMerge por ser mais leve
 */
export function cn(...inputs) {
  return clsx(inputs);
}

/**
 * Formata data para exibição
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

/**
 * Gera ID único simples
 */
export function generateId() {
  return Math.random().toString(36).substr(2, 9);
}