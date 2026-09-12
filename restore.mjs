import { exec } from 'child_process';
exec('git restore src/', (err, stdout, stderr) => {
  console.log(stdout, stderr);
});
