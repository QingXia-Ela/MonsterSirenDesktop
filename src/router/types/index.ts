import { FunctionComponent } from 'react';

export type RouteItemType = 'path' | 'vanilla';

export interface BasicRouteItem {
  type: RouteItemType;
}

/**
 * 原生路由，一般用于跳转塞壬唱片内部路径
 */
export interface VanillaRouteItem extends BasicRouteItem {
  name?: string;
  element: HTMLElement;
  addToNav: true;
}

export interface PathRouteItem extends BasicRouteItem {
  /** 导航栏中文名字 */
  name?: string;
  /**
   * 路由地址，必填，推荐全小写且单词控制在一个
   *
   * 目前暂不支持类似 `:id` 这种动态参数路由
   */
  path: string;
  component: FunctionComponent<any>;
  /**
   * 动画延迟，单位 `ms`，会在延迟结束后触发 `section/pageEntered` 事件
   *
   * @default 500
   */
  duration?: number;
  /** 是否添加到导航栏 */
  addToNav?: boolean;
}

export type RouteItem = PathRouteItem | VanillaRouteItem;

export interface RouterCombineProps {
  /**
   * 组件是否被激活
   */
  active: boolean;
  /**
   * 当前路由
   */
  path: string;
}
