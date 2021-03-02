const fs = require('fs-extra');
const { resolve } = require('path');
const childProgress = require('child_process');

fs.removeSync(resolve(__dirname, './lib'));

const progress = childProgress.exec('tsc');
progress.stdout.pipe(process.stdout);
progress.stderr.pipe(process.stderr);
