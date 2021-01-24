const fs = require('fs-extra');
const { resolve } = require('path');
const child_progress = require('child_process');

fs.removeSync(resolve(__dirname, './lib'));

const progress = child_progress.exec('tsc');
progress.stdout.pipe(process.stdout);
progress.stderr.pipe(process.stderr);
