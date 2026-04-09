const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const imagesDir = path.join(rootDir, 'images');
const dataDir = path.join(rootDir, 'data');
const manifestPath = path.join(dataDir, 'manifest.json');

const categories = [
  'waza1',
  'waza2',
  'waza3',
  'waza4',
  'waza5',
  'waza_sp',
  'goods',
  'goods_ace',
  'support',
  'tool',
  'tool_ace',
  'stadium',
  'stadium_ace'
];

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

function getImageFiles(category) {
  const categoryDir = path.join(imagesDir, category);

  if (!fs.existsSync(categoryDir)) {
    return [];
  }

  return fs
    .readdirSync(categoryDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => {
      const ext = path.extname(fileName).toLowerCase();
      return allowedExtensions.includes(ext);
    })
    .sort((a, b) => a.localeCompare(b, 'ja'))
    .map((fileName) => `images/${category}/${fileName}`);
}

function buildManifest() {
  const manifest = {};

  for (const category of categories) {
    manifest[category] = getImageFiles(category);
  }

  return manifest;
}

function saveManifest(manifest) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(
    manifestPath,
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );
}

try {
  const manifest = buildManifest();
  saveManifest(manifest);
  console.log('manifest.json を更新しました');
  console.log(JSON.stringify(manifest, null, 2));
} catch (error) {
  console.error('manifest.json の更新に失敗しました');
  console.error(error);
}