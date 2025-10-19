import fs from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';

// --- INÍCIO DA FUNÇÃO AUXILIAR ---
// Helper function to copy a directory recursively (compatible with older Node.js)
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true }); // Ensure destination exists
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
// --- FIM DA FUNÇÃO AUXILIAR ---


const dist = 'dist';
// Limpa o diretório dist/ se ele já existir
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

// Lista de arquivos da raiz do seu projeto que devem ir para o build
// (Adicione ou remova arquivos aqui se necessário)
const rootFiles = ['manifest.json', 'popup.html', 'popup.js', 'styles.css'];

console.log('Copiando arquivos da raiz...');
for (const f of rootFiles) {
  // Verifica se o arquivo existe antes de copiar
  if (fs.existsSync(f)) {
    fs.copyFileSync(f, path.join(dist, f));
    console.log(`- ${f} copiado.`);
  } else {
    // Não tem problema se o styles.css não existir, só avisamos
    if (f === 'styles.css') {
      console.warn(`Aviso: Arquivo ${f} não encontrado. Pulando.`);
    } else {
      console.warn(`Aviso: Arquivo essencial ${f} não encontrado na raiz.`);
    }
  }
}

// Copia a pasta de ícones
console.log('Copiando pasta icons...');
const iconsSrc = 'icons';
const iconsDest = path.join(dist, 'icons');

if (fs.existsSync(iconsSrc)) {
  try {
    copyDirSync(iconsSrc, iconsDest); // Usando nossa função auxiliar
    console.log('- pasta icons/ copiada.');
  } catch (e) {
    console.error('ERRO AO COPIAR PASTA ICONS:', e);
    process.exit(1); // Sai com erro se falhar
  }
} else {
  console.warn('Aviso: Pasta icons/ não encontrada.');
}

// Gera o ZIP
console.log('Gerando extension.zip...');
const output = fs.createWriteStream(path.join(dist, 'extension.zip'));
const archive = archiver('zip', { zlib: { level: 9 } });

archive.on('error', (err) => { throw err; });
archive.pipe(output);
// Adiciona o *conteúdo* da pasta dist (sem a própria pasta dist) ao zip
archive.directory(dist, false);
await archive.finalize();

console.log('Build gerado com sucesso em dist/ e dist/extension.zip');