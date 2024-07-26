import fs from 'fs/promises';
import path from 'path';
const CDN_PATH = 'https://web.hycdn.cn/';

const cdnHeader = {
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'accept-encoding': 'gzip, deflate, br',
  connection: 'keep-alive',
  host: 'web.hycdn.cn',
  'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'cache-control': 'max-age=0',
  'sec-fetch-dest': 'document',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'none',
  'sec-fetch-user': '?1',
  te: 'Trailers',
  'upgrade-insecure-requests': '1',
  'user-agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.142.86 Safari/537.36',
};

function removeQueryParams(url: string) {
  return url.split('?')[0];
}

async function downloadFile(root: string, url: string, rootDir: string) {
  const res = await fetch(url, {
    headers: cdnHeader,
  });
  let filePath = path.join(rootDir, removeQueryParams(url.replace(root, '')));
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, Buffer.from(await res.arrayBuffer()));
  try {
    return await res.text();
  } catch (e) {}
  return '';
}

const reg = /https:\/\/web\.hycdn\.cn\/([^"']*)/g;
function getAllUrlFromSirenHtml(str: string) {
  const res = new Set<string>();
  const urlList = str.match(reg);
  if (!urlList) {
    console.log('None url found');
    return [];
  }
  Object.entries(urlList).map(([key, value]) => {
    res.add(value);
  });
  return Array.from(res);
}

function sleep(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function downloadFileToDist(sirenInjectHtml: string) {
  // todo!: add cache to instead each time download
  const urls = getAllUrlFromSirenHtml(sirenInjectHtml);
  console.log('Siren resources count: ' + urls.length);
  return await Promise.all(
    urls.map(async (url, index) => {
      await sleep(index * 500);
      console.log('Downloading from: ' + url);
      const possibleText = await downloadFile(
        CDN_PATH,
        url,
        'src-tauri/assets',
      );
      console.log('Downloaded: ' + url);
      return possibleText;
    }),
  );
}
