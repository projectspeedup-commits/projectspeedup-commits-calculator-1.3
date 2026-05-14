const { execSync } = require('child_process');
try {
  execSync('git checkout -- src/components/supply/*.tsx src/components/production/*.tsx', { stdio: 'inherit' });
  console.log('Success');
} catch (e) {
  console.error(e);
}
