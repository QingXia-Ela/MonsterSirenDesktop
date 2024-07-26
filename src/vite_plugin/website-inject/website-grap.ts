import scrape from 'website-scraper';
import fs from 'fs/promises';

const options = {
  urls: ['https://monster-siren.hypergryph.com/'],
  directory: 'src-tauri/ignored-assets',
  filenameGenerator: 'bySiteStructure',
  requestConcurrency: 3,
};

export default async function startSirenWebsiteScrape() {
  try {
    await fs.rm(options.directory, { recursive: true });
  } catch (e) {}
  // with async/await
  return await scrape(options);

  // with promise
  // scrape(options).then((result) => { });
}
