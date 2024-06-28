class commandError extends Error {
    constructor(message) {
        super(message);
        this.success = false;
        this.result = '';
        this.error = message || 'An error occurred';
    }

    toJSON() {
        return {
            success: this.success,
            result: this.result,
            error: this.error
        };
    }
}

module.exports = commandError;
