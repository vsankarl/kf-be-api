const commandProcessor = require('../modules/commandProcessor');
const commandError = require('../modules/commandError');

const handleCommand = async (req, res, expectedCmd) => {
    try {
        console.log("Request:", req.body);
        const { curdir, command } = req.body;
        const [cmd, ...args] = command.split(/\s+/);
        if (cmd !== expectedCmd) {
            throw new commandError(`Incorrect command type for the ${expectedCmd} endpoint`);
        }
        const result = await commandProcessor.executeCommand(curdir, cmd, args);
        console.log("Response:", result);
        res.json(result);
    } catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json(error.toJSON());
    }
};

exports.postCd = (req, res, next) => {
    handleCommand(req, res, 'cd');
};

exports.postLs = (req, res, next) => {
    handleCommand(req, res, 'ls');
};

exports.postMkdir = (req, res, next) => {
    handleCommand(req, res, 'mkdir');
};