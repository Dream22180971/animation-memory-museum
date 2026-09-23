import { expect, test } from "@playwright/test";

test("首页展示真实馆藏统计，并可使用全局搜索", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await expect(page.getByText("已整理 17 部馆藏 · 74 条台词")).toBeVisible();
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
  await expect(page.getByText("3 / 17 条档案")).toBeVisible();

  await page.getByRole("button", { name: "重置筛选" }).click();
  await expect(page.getByText("17 / 17 条档案")).toBeVisible();
});

test("本机回忆册可保存、导出入口与删除，且不混进公开档案", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });

  await page.getByLabel("动画名称").fill("神厨小福贵");
  await page.getByLabel("你的回忆").fill("放学后和同学一起讨论当天的剧情。");
  await page.getByLabel("昵称").fill("测试观众");
  await page.getByRole("button", { name: "存进我的回忆册" }).click();
  await expect(page.getByText("已写进册子，往下翻就能看到")).toBeVisible();

  await expect(page.getByRole("heading", { name: "《神厨小福贵》" })).toBeVisible();
  await expect(page.getByText("放学后和同学一起讨论当天的剧情。")).toBeVisible();
  await expect(page.getByText(/^测试观众 · \d{4}\.\d{2}\.\d{2}$/)).toBeVisible();

  await page.goto("/archive", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "神厨小福贵" })).toHaveCount(0);
  await expect(page.getByText("馆藏 17")).toBeVisible();

  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "删除《神厨小福贵》的回忆" }).click();
  await expect(page.getByRole("heading", { name: "《神厨小福贵》" })).toHaveCount(0);

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

  await page.getByRole("button", { name: /^角色 天羽/ }).click();

  const card = page.getByRole("dialog", { name: "天羽 的人物档案" });
  await expect(card).toBeVisible();
  await expect(card.getByText(/《超兽武装》 · 2011/)).toBeVisible();
  await expect(card.getByText("女主角 · 超兽战队成员")).toBeVisible();
  await expect(card.getByText(/战队中的女性主力战士/)).toBeVisible();
  await expect(card.getByRole("link", { name: "资料源" })).toBeVisible();

  await card.getByRole("button", { name: /火麟飞/ }).click();
  const jumped = page.getByRole("dialog", { name: "火麟飞 的人物档案" });
  await expect(jumped).toBeVisible();
  await expect(card).toBeHidden();

  await page.keyboard.press("Escape");
  await expect(jumped).toBeHidden();

  const node = page.getByRole("button", { name: /^角色 泰雷/ });
  await node.hover();
  const transformBefore = await node.getAttribute("transform");
  const box = await node.boundingBox();
  const canvas = await page.getByRole("region", { name: "超兽武装角色关系图" }).boundingBox();
  expect(box).not.toBeNull();
  expect(canvas).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(canvas!.x + canvas!.width / 2, canvas!.y + canvas!.height * 0.8, { steps: 12 });
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
  await expect(page.getByText("显示 74 / 74 条")).toBeVisible();

  await page.getByRole("button", { name: /熊出没/ }).click();
  await expect(page.getByText("显示 3 / 74 条")).toBeVisible();
  await expect(page.getByText("臭狗熊！别跑！")).toBeVisible();
  await expect(page.getByText("已有的事，后必再有；已行的事，后必再行。")).toBeHidden();
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
