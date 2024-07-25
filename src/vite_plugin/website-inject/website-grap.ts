import scrape from 'website-scraper';
import fs from 'fs/promises';

const options = {
  urls: ['https://monster-siren.hypergryph.com/'],
  directory: 'src-tauri/ignored-assets',
  filenameGenerator: 'bySiteStructure',
  requestConcurrency: 3
};

export default async function startSirenWebsiteScrape() {
  if ((await fs.stat(options.directory)).isDirectory()) await fs.rmdir(options.directory, { recursive: true });
  // with async/await
  return await scrape(options);

  // with promise
  // scrape(options).then((result) => { });
}