import currencyFormatter from 'currency-formatter'

class CurrencyUtils {
    format(amount: any) {
        amount = String(amount).replace(/\D/g, '');
        amount = (amount / 100).toFixed(2);
        const formatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format;
        return formatter(parseFloat(amount));
    }
    formatPrice(price: any) {
        const value = currencyFormatter.format(Math.abs(price), {
            locale: "pt_BR"
        });
        return value;
    }
    formatPercentage(amount: any) {
        amount = String(amount)
        amount = amount?.replace(/\D/g, "");
        amount = (amount / 100).toFixed(2);
        amount = amount?.replaceAll(".", ",");
        return `% ${amount}`
    }
    removeMask(amount: any) {
        const money = amount
            ?.replace("R$", "")
            ?.replace("%", "")
            ?.replaceAll(".", "")
            ?.replaceAll(",", ".")
            ?.replaceAll(" ", "")
        return Number(money);
    }
}

export default new CurrencyUtils();