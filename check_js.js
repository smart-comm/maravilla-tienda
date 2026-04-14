const fs = require('fs');

function checkFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  let inScript = false;
  let scriptContent = '';
  
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('<script>')) {
      inScript = true;
      continue;
    }
    if (line.includes('</script>')) {
      inScript = false;
      try {
         // quick and dirty syntax check via new Function
         new Function(scriptContent);
         console.log(file + ": JS syntax OK");
      } catch (e) {
         console.log(file + ": JS syntax ERROR at roughly line " + i);
         console.log(e.message);
         // Find actual line of error
         let errorReported = false;
         try {
             require('vm').Script(scriptContent);
         } catch(err) {
             console.log(err.stack);
         }
      }
      scriptContent = '';
      continue;
    }
    if (inScript) {
      scriptContent += line + '\n';
    }
  }
}

checkFile('maravilla_admin.html');
checkFile('maravilla_tienda.html');
