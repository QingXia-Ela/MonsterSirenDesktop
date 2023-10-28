import { HTMLAttributes, useEffect } from "react"
import { RouteItem, RouterCombineProps } from "./types"

const TestComponent = (
  { active, path, ...props }:
    RouterCombineProps &
    { content: React.ReactNode } &
    HTMLAttributes<HTMLDivElement>
) => {
  useEffect(() => {
    console.log(active);
  })
  return <div key={path} {...props}>{path}</div>
}

/**
 * 路由只会往页面尾部追加
 */
const routes: RouteItem[] = [
  {
    path: "/playlist",
    component: TestComponent,
    addToNav: true,
    name: "测试"
  },
  {
    path: "/test",
    component: TestComponent,
    name: "测试test"
  }
]

export default routes