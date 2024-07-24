/**
 * This channel use for notify to react component core.
 */

import Channel from '@/tools/channel';
import { AlertColor } from '@mui/material';

export interface NotifyMessageProps {
  severity?: AlertColor;
  title?: string;
  content: string;
}

/**
 * Note: One key only have one notify, if a method listen the same key, it will overwrite the previous one.
 */
const GlobalNotifyChannel = new Channel<NotifyMessageProps>();

window.inject_notify = GlobalNotifyChannel;

export default GlobalNotifyChannel;
