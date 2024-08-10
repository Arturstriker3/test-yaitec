class EmailUtils {
    isValid(email: string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
}
export default new EmailUtils();