import { expect, test } from "@playwright/test";

test("首页展示真实馆藏统计，并可使用全局搜索", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.getByText("已整理 35 部馆藏 · 112 条台词")).toBeVisible();
  await expect(page.getByText("8,921")).toHaveCount(0);

  const searchButton = page.getByRole("button", { name: "搜索" });
  await searchButton.click();

  const dialog = page.getByRole("dialog", { name: "搜索动画馆藏" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("textbox").fill("超兽武装");
  await expect(dialog.getByRole("link", { name: /超兽武装/ })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(searchButton).toBeFocused();
});

test("档案筛选可以找到馆藏并恢复全部结果", async ({ page }) => {
  await page.goto("/archive", { waitUntil: "networkidle" });

  const archiveSearch = page.getByPlaceholder("搜索动画名、类型或回忆关键词");
  await archiveSearch.fill("机甲");
  await expect(page.locator("span.cassette-label").filter({ hasText: /6 \/ 35/ })).toBeVisible();

  await page.getByRole("button", { name: "重置筛选" }).click();
  await expect(page.locator("span.cassette-label").filter({ hasText: /35 \/ 35/ })).toBeVisible();
});

test("本机回忆册可保存、导出入口与删除，且不混进公开档案", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByLabel("动画名称").fill("某部没入馆的动画");
  await page.getByLabel("你的回忆").fill("放学后和同学一起讨论当天的剧情。");
  await page.getByLabel("昵称").fill("测试观众");
  await page.getByRole("button", { name: "存进我的回忆册" }).click();
  await expect(page.getByText("已写进册子，往下翻就能看到")).toBeVisible();

  await expect(page.getByRole("heading", { name: "《某部没入馆的动画》" })).toBeVisible();
  await expect(page.getByText("放学后和同学一起讨论当天的剧情。")).toBeVisible();
  await expect(page.getByText(/^测试观众 · \d{4}\.\d{2}\.\d{2}$/)).toBeVisible();

  await page.goto("/archive", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "某部没入馆的动画" })).toHaveCount(0);
  await expect(page.getByText("馆藏 35")).toBeVisible();

  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "删除《某部没入馆的动画》的回忆" }).click();
  await expect(page.getByRole("heading", { name: "《某部没入馆的动画》" })).toHaveCount(0);

  await page.goto("/archive/chaoshou-wuzhuang", { waitUntil: "networkidle" });
  const watchedButton = page.getByRole("button", { name: "标记我也看过超兽武装" });
  await watchedButton.click();
  await expect(page.getByRole("button", { name: "取消标记看过超兽武装" })).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "取消标记看过超兽武装" })).toBeVisible();
});

test("童年浓度测试可以完成并查看结果", async ({ page }) => {
  await page.goto("/quiz", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "童年浓度测试" })).toBeVisible();
  await expect(page.getByText("第 1 / 6 题")).toBeVisible();

  await page.getByRole("button", { name: "几乎每天" }).click();
  await page.getByRole("button", { name: "下一题" }).click();

  await page.getByRole("button", { name: "5 部以上" }).click();
  await page.getByRole("button", { name: "下一题" }).click();

  await page.getByRole("button", { name: "超兽武装" }).click();
  await expect(page.getByText("答对啦！")).toBeVisible();
  await page.getByRole("button", { name: "下一题" }).click();

  await page.getByRole("button", { name: "洛洛历险记" }).click();
  await page.getByRole("button", { name: "下一题" }).click();

  await page.getByRole("button", { name: "虹猫蓝兔七侠传" }).click();
  await page.getByRole("button", { name: "下一题" }).click();

  await page.getByRole("button", { name: "神兵小将" }).click();
  await page.getByRole("button", { name: "查看结果" }).click();

  await expect(page.getByText("100%")).toBeVisible();
  await expect(page.getByRole("heading", { name: "镇馆之宝" })).toBeVisible();
  await expect(page.getByRole("button", { name: "晒出我的童年浓度" })).toBeVisible();

  await page.getByRole("button", { name: "再测一次" }).click();
  await expect(page.getByText("第 1 / 6 题")).toBeVisible();
});

test("档案详情展示真实元数据和正版观看入口", async ({ page }) => {
  await page.goto("/archive/chaoshou-wuzhuang", { waitUntil: "networkidle" });

  await expect(page.getByText("广州蓝弧文化传播有限公司")).toBeVisible();
  await expect(page.getByText("中央电视台少儿频道")).toBeVisible();
  await expect(page.getByText("入馆日期")).toBeVisible();
  await expect(page.getByText("角色：火麟飞、天羽、苗条俊、龙戬、泰雷、夜凌云")).toBeVisible();
  await expect(page.getByRole("link", { name: "腾讯视频 正版观看" })).toBeVisible();
});

test("角色关系图谱可以切换动画并展示关系", async ({ page }) => {
  await page.goto("/characters", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "角色关系图谱" })).toBeVisible();
  await expect(page.getByText("已标注的关系")).toBeVisible();

  await page.getByRole("button", { name: /熊出没/ }).click();
  await expect(page.getByRole("region", { name: "熊出没角色关系图" })).toBeVisible();
  await expect(page.getByText("兄弟", { exact: true }).first()).toBeVisible();
});

test("角色图谱点击角色弹出人物档案，支持拖拽移位与缩放", async ({ page }) => {
  await page.goto("/characters", { waitUntil: "networkidle" });

  await page.getByRole("button", { name: /超兽武装/ }).click();
  await page.getByRole("button", { name: /^角色 天羽/ }).click();

  const card = page.getByRole("region", { name: "天羽 的人物档案" });
  await expect(card).toBeVisible();
  await expect(card.getByText(/《超兽武装》 · 2011/)).toBeVisible();
  await expect(card.getByText("女主角 · 超兽战队成员")).toBeVisible();
  await expect(card.getByText(/战队中的女性主力战士/)).toBeVisible();
  await expect(card.getByRole("link", { name: "资料源" })).toBeVisible();

  await card.getByRole("button", { name: /火麟飞/ }).click();
  const jumped = page.getByRole("region", { name: "火麟飞 的人物档案" });
  await expect(jumped).toBeVisible();
  // 同名角色在「已标注的关系」列表里也有按钮，断言限定在档案卡片内
  await expect(card.getByText("女主角 · 超兽战队成员")).toBeHidden();

  await page.getByRole("button", { name: "关闭人物档案" }).click();
  await expect(jumped).toBeHidden();

  const node = page.getByRole("button", { name: /^角色 泰雷/ });
  await node.hover();
  // 等 framer-motion 入场缩放落位：节点 <g> 的 transform 不随缩放变，但屏幕中心会变。
  // 并发 / 冷编译下若动画未完就取坐标，按下点会偏离圆心、命中背景 —— CI flaky 的根因。
  await expect
    .poll(
      async () => {
        const a = await node.evaluate((el) => { const r = el.getBoundingClientRect(); return `${Math.round(r.x)} ${Math.round(r.y)}`; });
        await page.waitForTimeout(80);
        const b = await node.evaluate((el) => { const r = el.getBoundingClientRect(); return `${Math.round(r.x)} ${Math.round(r.y)}`; });
        return a === b ? "stable" : "moving";
      },
      { timeout: 5000 },
    )
    .toBe("stable");
  const transformBefore = await node.getAttribute("transform");
  // 起点用节点自身 getBoundingClientRect（与组件 toViewBox 同一坐标系）。
  // boundingBox() 走 hit-testing，会受 framer-motion 缩放动画影响而偏离圆心，
  // 按下点一旦落在圆外就命中背景、拖拽失效——正是 CI 上偶发的原因。
  const start = await node.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
  });
  const canvas = await page.getByRole("region", { name: "超兽武装角色关系图" }).boundingBox();
  expect(canvas).not.toBeNull();
  // 沿「节点 → 画布中心」方向拖到半路：任何视口缩放下都会越过 keepInside 的钳制边界，
  // 且不会把节点拖进环心盲区（包围盒相交 ≠ 看得见节点）
  const startX = start.x;
  const startY = start.y;
  const midX = (startX + canvas!.x + canvas!.width / 2) / 2;
  const midY = (startY + canvas!.y + canvas!.height / 2) / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  // 分步拖到半路；每步验证节点是否跟上。CDP 注入的 move 在重负载下会被合并丢弃，
  // 未生效时直接在 SVG 上派发一次 pointermove 兜底（React 合成事件照常处理）。
  const svg = page.locator("svg.constellation-canvas");
  let moved = false;
  for (let i = 1; i <= 12 && !moved; i += 1) {
    const x = startX + ((midX - startX) * i) / 12;
    const y = startY + ((midY - startY) * i) / 12;
    await page.mouse.move(x, y);
    await page.waitForTimeout(30);
    if ((await node.getAttribute("transform")) !== transformBefore) {
      moved = true;
      break;
    }
    await svg.dispatchEvent("pointermove", { bubbles: true, clientX: x, clientY: y });
    await page.waitForTimeout(30);
    if ((await node.getAttribute("transform")) !== transformBefore) moved = true;
  }
  await page.mouse.up();
  await expect(node).not.toHaveAttribute("transform", transformBefore!);

  const zoom = page.getByText(/^\d+%$/);
  await expect(zoom).toHaveText("100%");
  await page.getByRole("button", { name: "放大图谱" }).click();
  await expect(zoom).not.toHaveText("100%");
  await page.getByRole("button", { name: "适应画布" }).click();
  await expect(zoom).toHaveText("100%");

  const region = page.getByRole("region", { name: "超兽武装角色关系图" });
  await expect(page.getByText("关系图例")).toBeVisible();
  await expect(page.getByText("同伴与战友")).toBeVisible();
  await expect(region.locator("svg").getByText("先敌后友")).toHaveCount(0);
  await page.getByRole("button", { name: "关系标签" }).click();
  await expect(region.locator("svg").getByText("先敌后友")).toBeVisible();

  const gestureToggle = page.getByRole("button", { name: /画布手势/ });
  if (test.info().project.name === "mobile-chromium") {
    await expect(gestureToggle).toBeVisible();
    await expect(region.locator("svg")).toHaveCSS("touch-action", "pan-y");
    await gestureToggle.click();
    await expect(region.locator("svg")).toHaveCSS("touch-action", "none");
  } else {
    await expect(gestureToggle).toBeHidden();
  }
});

test("名台词档案馆可以按动画筛选台词", async ({ page }) => {
  await page.goto("/quotes", { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "名台词档案馆" })).toBeVisible();
  await expect(page.locator("p[role=status]").filter({ hasText: /112 \/ 112/ })).toBeVisible();

  await page.getByRole("button", { name: /熊出没/ }).click();
  await expect(page.locator("p[role=status]").filter({ hasText: /3 \/ 112/ })).toBeVisible();
  await expect(page.getByText("臭狗熊！别跑！")).toBeVisible();
  await expect(page.getByText("已有的事，后必再有；已行的事，后必再行。")).toBeHidden();

  await page.getByRole("button", { name: /秦时明月/ }).click();
  await expect(page.locator("p[role=status]").filter({ hasText: /6 \/ 112/ })).toBeVisible();
  await expect(page.getByText("有些梦虽然遥不可及，但并不是不可能实现。")).toBeVisible();
});

test("移动端菜单可以打开并到达各展区", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  const toggle = page.getByRole("button", { name: "打开菜单" });
  if (test.info().project.name === "desktop-chromium") {
    await expect(toggle).toBeHidden();
    return;
  }

  await toggle.click();
  const menu = page.getByRole("navigation", { name: "主导航" });
  await expect(menu.getByRole("link", { name: "角色图谱" })).toBeVisible();
  await expect(menu.getByRole("link", { name: "童年浓度测试" })).toBeVisible();
  await expect(menu.getByRole("button", { name: "关闭菜单" })).toBeVisible();
});

test("台词馆与角色图谱可以按作品互相深链跳转", async ({ page }) => {
  await page.goto("/quotes?animation=kuiba", { waitUntil: "networkidle" });
  await expect(page.locator("p[role=status]").filter({ hasText: /2 \/ 112/ })).toBeVisible();

  await page.getByRole("link", { name: "看角色关系" }).first().click();
  await expect(page.getByRole("region", { name: "魁拔角色关系图" })).toBeVisible();

  await page.getByRole("link", { name: "看这部作品的台词 →" }).click();
  await expect(page.locator("p[role=status]").filter({ hasText: /2 \/ 112/ })).toBeVisible();
});

test("损坏的本地存储不会阻止用户继续操作", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("animation-memory-user-contributions", "not-json");
    window.localStorage.setItem("animation-memory-watched", "not-json");
  });

  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByLabel("动画名称").fill("测试动画");
  await page.getByLabel("你的回忆").fill("这是一段用于验证恢复能力的回忆。");
  await page.getByLabel("昵称").fill("测试用户");
  await page.getByRole("button", { name: "存进我的回忆册" }).click();
  await expect(page.getByText("已写进册子，往下翻就能看到")).toBeVisible();

  await page.goto("/archive/zhuzhuxia", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "标记我也看过猪猪侠" }).click();
  await expect(page.getByRole("button", { name: "取消标记看过猪猪侠" })).toBeVisible();
});

test("CRT 开机仪式：首页首次访问播放一次，回访与内页不再播放", async ({ page }) => {
  await page.goto("/", { waitUntil: "commit" });

  const overlay = page.locator(".crt-boot-overlay");
  await expect(overlay).toBeAttached();
  await expect(overlay).not.toBeAttached({ timeout: 5_000 });
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("museum-crt-booted"))).toBe("1");

  // 同一会话回到首页：不再播放
  await page.reload({ waitUntil: "commit" });
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".crt-boot-overlay")).toHaveCount(0);
  await expect(page.locator("html[data-crt-boot]")).toHaveCount(0);

  // 规范 §9：内页不播开机仪式
  await page.goto("/about", { waitUntil: "commit" });
  await page.waitForLoadState("networkidle");
  await expect(page.locator(".crt-boot-overlay")).toHaveCount(0);
});

test("reduced-motion 用户直接跳过开机仪式", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.locator(".crt-boot-overlay")).toHaveCount(0);
  await expect(page.locator("html[data-crt-boot]")).toHaveCount(0);
  await expect(page.getByText("已整理 35 部馆藏 · 112 条台词")).toBeVisible();
});

