import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight';

export default defineConfig({
  // 你的配置在这里...
  base: `/MonsterSirenDesktop/`,
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
        },
        {
          label: "插件",
          autogenerate: {
            directory: '插件'
          }
        },
        {
          label: "插件开发手册",
          collapsed: true,
          autogenerate: {
            directory: '插件开发手册'
          }
        },
        {
          label: "参考",
          autogenerate: {
            directory: 'QA'
          }
        }
      ]
    }),
  ],
})