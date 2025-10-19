import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';


function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true }); 
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}



const dist = 'dist';

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);


const rootFiles = ['manifest.json', 'popup.html', 'popup.js', 'styles.css'];

console.log('Copiando arquivos da raiz...');
for (const f of rootFiles) {
  
  if (fs.existsSync(f)) {
    fs.copyFileSync(f, path.join(dist, f));
    console.log(`- ${f} copiado.`);
  } else {
    
    if (f === 'styles.css') {
      console.warn(`Aviso: Arquivo ${f} não encontrado. Pulando.`);
    } else {
      console.warn(`Aviso: Arquivo essencial ${f} não encontrado na raiz.`);
    }
  }
}


console.log('Copiando pasta icons...');
const iconsSrc = 'icons';
const iconsDest = path.join(dist, 'icons');

if (fs.existsSync(iconsSrc)) {
  try {
    copyDirSync(iconsSrc, iconsDest); 
    console.log('- pasta icons/ copiada.');
  } catch (e) {
    console.error('ERRO AO COPIAR PASTA ICONS:', e);
    process.exit(1); 
  }
} else {
  console.warn('Aviso: Pasta icons/ não encontrada.');
}


console.log('Gerando extension.zip...');
const output = fs.createWriteStream(path.join(dist, 'extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

archive.on('error', (err) => { throw err; });
archive.pipe(output);

archive.directory(dist, false);
await archive.finalize();

console.log('Build gerado com sucesso em dist/ e dist/extension.zip');
