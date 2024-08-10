class ErrorUtils {
    defaultError = "Houve um erro interno, tente novamente em instantes.";
    get(err: any) {
        if (err.response && err.response.data) {
            const { statusCode, error, message } = err.response.data;
            if (statusCode && error && message) {
                return `${error}: ${message}`;
            }
        }
        return this.defaultError;
    }
}

export default new ErrorUtils();