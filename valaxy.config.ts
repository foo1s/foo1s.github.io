import { defineValaxyConfig } from 'valaxy'
import type { UserThemeConfig } from 'valaxy-theme-yun'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '在最远的地方',
      cloud: {
        enable: true,
      },
    },

    pages: [
      {
        name: '一号',
        url: '/links/',
        icon: 'i-ri-genderless-line',
        color: 'dodgerblue',
      },
      {
        name: '二号',
        url: '/girls/',
        icon: 'i-ri-women-line',
        color: 'hotpink',
      },
    ],

    footer: {
      since: 2024,
      beian: {
        enable: true,
        icp: '萌ICP备20240499号',
      },
    },
  },

  unocss: { safelist },
})
// <a href="https://icp.gov.moe/?keyword=20240499" target="_blank">萌ICP备20240499号</a>