import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight';

export default defineConfig({
  // 你的配置在这里...
  integrations: [
    starlight({
      title: '塞壬唱片桌面版开发/使用手册',
      lastUpdated: true,
      sidebar: [
        {
          label: "起步",
          autogenerate: {
            directory: '起步'
          }
        },
        {
          label: "新增功能",
          autogenerate: {
            directory: '新增功能'
          }
        }
      ]
    }),
  ],
})