const path = require('path');
const { exec } = require('child_process');
const os = require('os');
const commandError = require('./commandError');

class commandProcessor {
    static supportedCommands = {
        'cd': commandProcessor.changeDirectory,
        'ls': commandProcessor.listDirectory,
        'mkdir': commandProcessor.makeDirectory
    };

    static async executeCommand(curDir, command, args) {
        if (!commandProcessor.supportedCommands.hasOwnProperty(command)) {
            throw new commandError('Command not supported');
        }

        try {
            return await commandProcessor.supportedCommands[command](curDir, args);
        } catch (error) {
            throw new commandError(error.message || 'Unknown error occurred');
        }
    }

    static async changeDirectory(curDir, args) {
        return new Promise((resolve, reject) => {
            let newDir;
            if (args.length === 0) {
                newDir = os.homedir(); // Change to logged-in user's home directory
            } else {
                newDir = path.resolve(curDir, args.join(' ').trim());
            }
    
            exec(`cd ${newDir}`, { shell: '/bin/bash' }, (error, stdout, stderr) => {
                if (error) {
                    return reject(new commandError(stderr));
                }
                resolve({ success: true, result: newDir });
            });
        });
    }
     // Todo: handle ls non-existent-dir existent-dir
     // currently it errors out and sends the error message
     // all success are ok.
     static async listDirectory(curDir, args) {
        return new Promise((resolve, reject) => {
            let command;
            if (args.length === 0) {
                command = `ls ${curDir}`;
            } else {
                command = `ls ${args.map(arg => `${curDir}/${arg}`).join(' ')}`;
            }
            exec(command, { shell: '/bin/bash' }, (error, stdout, stderr) => {
                if (error) {
                    return reject(new commandError(stderr));
                }
                const filesAndDirs = stdout.split('\n').filter(item => item);
                resolve({ success: true, result: filesAndDirs });
            });
        });
    }

    static async makeDirectory(curDir, args) {
        const directories = args.map(arg => path.resolve(curDir, arg));
        return new Promise((resolve, reject) => {
            exec(`mkdir ${directories.join(' ')}`, { shell: '/bin/bash' }, (error, stdout, stderr) => {
                if (error) {
                    return reject(new commandError(stderr));
                }
                resolve({ success: true, result: `Directory ${directories.join(', ')} created` });
            });
        });
    }
}

module.exports = commandProcessor;
