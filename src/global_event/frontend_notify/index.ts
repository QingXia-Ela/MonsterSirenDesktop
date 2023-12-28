import { listen } from '@tauri-apps/api/event';

listen<string>("notify:error", ({ payload }) => {

})

listen<string>("notify:success", ({ payload }) => {

})

listen<string>("notify:info", ({ payload }) => {

})

listen<string>("notify:warning", ({ payload }) => {

})