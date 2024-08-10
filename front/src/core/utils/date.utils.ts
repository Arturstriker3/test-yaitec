import moment from "moment";

class DateUtils {
    formatDateTime(date: any) {
        if (!this.isValid(date)) return ""
        return moment(date).format("DD/MM/YYYY [às] HH:mm:ss");
    }
    formatDate(date: any) {
        if (!this.isValid(date)) return ""
        return moment(date).format("DD/MM/YYYY");
    }
    formatDateApi(date: any) {
        if (!this.isValid(date)) return ""
        return moment(date).format("YYYY-MM-DD");
    }
    isValid(date: any) {
        return moment(date).isValid();
    }
    isValidInput(date: string) {
        date = date.split("/").reverse().join("-");
        return moment(date).isValid();
    }
    formatInput(date: string) {
        date = date.replace(/\D/g, '');
        date = date.substring(0, 8);

        if (date.length >= 5) {
            date = date.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3');
        } else if (date.length >= 3) {
            date = date.replace(/(\d{2})(\d{2})/, '$1/$2');
        } else if (date.length >= 1) {
            date = date.replace(/(\d{2})/, '$1');
        }
        return date;
    }
    getYesterday() {
        const yesterday = moment();
        return {
            day: yesterday.subtract('days', 1).date(),
            month: yesterday.subtract('days', 1).month() + 1,
            year: yesterday.subtract('days', 1).year(),
        }
    }
}
export default new DateUtils();