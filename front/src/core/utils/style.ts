// Função para estilizar elementos

export function cn(...classes: any) {
    return classes.filter(Boolean).join(' ');
}