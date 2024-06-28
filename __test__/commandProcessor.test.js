const commandProcessor = require('../modules/commandProcessor');
const path = require('path');
const { exec } = require('child_process');
const commandError = require('../modules/commandError'); // Adjust the path as necessary

jest.mock('child_process', () => ({
    exec: jest.fn(),
}));

describe('commandProcessor', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('executeCommand', () => {
        it('should return error for unsupported commands', async () => {
            await expect(commandProcessor.executeCommand('/', 'unsupported', [])).rejects.toEqual(new commandError('Command not supported'));
        });

        it('should change directory', async () => {
            const newDir = '/newDir';
            exec.mockImplementation((cmd, options, callback) => {
                if (cmd.startsWith('cd')) {
                    callback(null, '', '');
                }
            });

            const result = await commandProcessor.executeCommand('/', 'cd', [newDir]);
            expect(result).toEqual({ success: true, result: path.resolve('/', newDir) });
        });

        it('should list directory contents', async () => {
            const files = ['file1', 'file2', 'file3'];
            exec.mockImplementation((cmd, options, callback) => {
                if (cmd.startsWith('ls')) {
                    callback(null, files.join('\n'), '');
                }
            });

            const result = await commandProcessor.executeCommand('/', 'ls', []);
            expect(result).toEqual({ success: true, result: files });
        });

        it('should make a directory', async () => {
            const newDir = 'newDir';
            exec.mockImplementation((cmd, options, callback) => {
                if (cmd.startsWith('mkdir')) {
                    callback(null, '', '');
                }
            });

            const result = await commandProcessor.executeCommand('/', 'mkdir', [newDir]);
            expect(result).toEqual({ success: true, result: `Directory ${path.resolve('/', newDir)} created` });
        });

        it('should handle command execution errors', async () => {
            const errorMessage = 'Some error occurred';
            exec.mockImplementation((cmd, options, callback) => {
                callback(new Error(errorMessage), '', errorMessage);
            });

            await expect(commandProcessor.executeCommand('/', 'ls', [])).rejects.toEqual(new commandError(errorMessage));
        });

        it('should handle change directory error', async () => {
            const errorMessage = 'cd: no such file or directory';
            exec.mockImplementation((cmd, options, callback) => {
                if (cmd.startsWith('cd')) {
                    callback(new Error(errorMessage), '', errorMessage);
                }
            });

            await expect(commandProcessor.executeCommand('/', 'cd', ['/invalidDir'])).rejects.toEqual(new commandError(errorMessage));
        });

        it('should handle list directory error', async () => {
            const errorMessage = 'ls: cannot access /invalidDir: No such file or directory';
            exec.mockImplementation((cmd, options, callback) => {
                if (cmd.startsWith('ls')) {
                    callback(new Error(errorMessage), '', errorMessage);
                }
            });

            await expect(commandProcessor.executeCommand('/', 'ls', ['/invalidDir'])).rejects.toEqual(new commandError(errorMessage));
        });

        it('should handle make directory error', async () => {
            const errorMessage = 'mkdir: cannot create directory ‘/existingDir’: File exists';
            exec.mockImplementation((cmd, options, callback) => {
                if (cmd.startsWith('mkdir')) {
                    callback(new Error(errorMessage), '', errorMessage);
                }
            });

            await expect(commandProcessor.executeCommand('/', 'mkdir', ['/existingDir'])).rejects.toEqual(new commandError(errorMessage));
        });
    });
});
