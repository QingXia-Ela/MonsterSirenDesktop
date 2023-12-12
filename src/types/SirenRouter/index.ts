import { SirenStoreState } from '@/types/SirenStore';

type Location = SirenStoreState['router']['location'];

interface Router {
  action: string;
  location: Location;
  /**
   * block the router, when msg is empty, it will block the page
   * @param msg alert when page change
   * @returns unblock function
   */
  block: (msg?: string) => () => void;
  /**
   * Still don't know what it is
   */
  createHref: (e: Location) => string;
  /**
   * **Warning**: This method will refresh page.
   */
  go: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
  push: (path: string, hash?: string) => void;
  replace: (path: string, hash?: string) => void;
  listen: (cb: (e: Location) => void) => () => void;
  length: number;
}

export type SirenRouter = Router;
