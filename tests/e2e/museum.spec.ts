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
  await page.getByRole("button", { name: "保存结果卡片" }).click();
  await expect(page.getByRole("button", { name: "卡片已生成" })).toBeVisible();

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


test("回忆册可以备份成文件并从备份恢复", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.getByLabel("动画名称").fill("备份测试动画");
  await page.getByLabel("你的回忆").fill("换手机前先把回忆册备份下来。");
  await page.getByLabel("昵称").fill("备份测试");
  await page.getByRole("button", { name: "存进我的回忆册" }).click();
  const heading = page.getByRole("heading", { name: "《备份测试动画》" });
  await expect(heading).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "备份回忆册" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^回忆册备份-\d{8}\.json$/);
  const backupPath = test.info().outputPath("memory-backup.json");
  await download.saveAs(backupPath);

  await page.getByRole("button", { name: "删除《备份测试动画》的回忆" }).click();
  await expect(heading).toHaveCount(0);

  const restore = page.getByLabel("从备份恢复");
  await restore.setInputFiles(backupPath);
  await expect(page.getByText("已恢复 1 条回忆。")).toBeVisible();
  await expect(heading).toBeVisible();

  // 同一份备份再导一次不会出现重复的回忆
  await restore.setInputFiles(backupPath);
  await expect(page.getByText("备份里的回忆都已经在册子里了。")).toBeVisible();
  await expect(heading).toHaveCount(1);

  await restore.setInputFiles({ name: "not-a-backup.json", mimeType: "application/json", buffer: Buffer.from('{"hello":"world"}') });
  // Next 自带一个空的 role=alert 路由播报节点，按文案收窄
  await expect(page.getByRole("alert").filter({ hasText: "这个文件不是回忆册备份，没有导入任何内容。" })).toBeVisible();
});

test("站点地图与 robots 覆盖全部展厅和馆藏", async ({ request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toContain("Sitemap: https://museum.seanwalter.top/sitemap.xml");

  const sitemap = await (await request.get("/sitemap.xml")).text();
  // 首页 + 8 个展厅 + 35 部馆藏详情
  expect(sitemap.match(/<url>/g)).toHaveLength(44);
  expect(sitemap).toContain("<loc>https://museum.seanwalter.top/guess</loc>");
  expect(sitemap).toContain("<loc>https://museum.seanwalter.top/archive/chaoshou-wuzhuang</loc>");
});

test("AI 搜索可以读到站点导读、爬虫放行和结构化数据", async ({ page, request }) => {
  const robots = await (await request.get("/robots.txt")).text();
  for (const bot of ["GPTBot", "ClaudeBot", "PerplexityBot"]) expect(robots).toContain(`User-Agent: ${bot}`);

  const llms = await request.get("/llms.txt");
  expect(llms.headers()["content-type"]).toContain("text/plain");
  const guide = await llms.text();
  expect(guide).toContain("# 00后动画记忆馆");
  expect(guide).toContain("[超兽武装（2011）](https://museum.seanwalter.top/archive/chaoshou-wuzhuang)");

  await page.goto("/archive/chaoshou-wuzhuang", { waitUntil: "networkidle" });
  const jsonLd = JSON.parse((await page.locator('script[type="application/ld+json"]').textContent()) ?? "{}");
  const series = jsonLd["@graph"].find((node: { "@type": string }) => node["@type"] === "TVSeries");
  expect(series).toMatchObject({ name: "超兽武装", startDate: "2011", productionCompany: { name: "广州蓝弧文化传播有限公司" } });
});

test("各展厅分享时带自己的标题和预览图", async ({ page }) => {
  await page.goto("/quiz", { waitUntil: "networkidle" });
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "童年浓度测试 | 00后动画记忆馆");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/quiz\/opengraph-image/);

  await page.goto("/archive/chaoshou-wuzhuang", { waitUntil: "networkidle" });
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "超兽武装 | 00后动画记忆馆");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /chaoshou-wuzhuang\.webp$/);
});

test("台词猜出处：十句台词答完给出成绩，每题揭晓出处", async ({ page }) => {
  await page.goto("/guess", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "台词猜出处", level: 1 })).toBeVisible();
  await page.getByRole("button", { name: "开始猜台词" }).click();

  let score = 0;
  for (let round = 1; round <= 10; round += 1) {
    await expect(page.getByText(`第 ${round} / 10 句`)).toBeVisible();
    const options = page.locator("main button[aria-pressed]");
    await expect(options).toHaveCount(4);
    const names = await options.allTextContents();
    expect(new Set(names).size).toBe(4);

    await options.first().click();
    const reveal = page.getByText(/出自《.+?》/);
    await expect(reveal).toBeVisible();
    const answer = (await reveal.textContent())?.match(/出自《(.+?)》/)?.[1] ?? "";
    expect(names).toContain(answer);
    if (names[0] === answer) score += 1;
    await expect(page.getByRole("link", { name: `查看《${answer}》档案 →` })).toBeVisible();

    await page.getByRole("button", { name: round === 10 ? "查看成绩" : "下一句" }).click();
  }

  await expect(page.getByText(`${score} / 10`)).toBeVisible();
  await page.getByRole("button", { name: "保存成绩卡片" }).click();
  await expect(page.getByRole("button", { name: "卡片已生成" })).toBeVisible();
  await page.getByRole("button", { name: "再来一局" }).click();
  await expect(page.getByText("第 1 / 10 句")).toBeVisible();
});

test("时间线：选出入学年份就列出小学六年首播的动画，链接可分享", async ({ page }) => {
  await page.goto("/timeline", { waitUntil: "networkidle" });
  await page.getByLabel("入学年份").selectOption("2006");
  await expect(page.getByRole("status").filter({ hasText: "2006–2011 年，馆里有 18 部动画首播" })).toBeVisible();
  const lineup = page.locator("#lineup");
  await expect(lineup.getByRole("link", { name: "秦时明月" })).toHaveAttribute("href", "/archive/qin-shi-ming-yue");
  await expect(lineup.getByText("2007 · 2 年级").first()).toBeVisible();
  await expect(page).toHaveURL(/\?entry=2006$/);

  // 带 ?entry= 打开就是同届同学的片单
  await page.goto("/timeline?entry=1994", { waitUntil: "networkidle" });
  await expect(page.getByLabel("入学年份")).toHaveValue("1994");
  await expect(page.getByRole("status").filter({ hasText: "1994–1999 年，馆里有 2 部动画首播" })).toBeVisible();
  await page.getByRole("button", { name: "保存我的童年片单" }).click();
  await expect(page.getByRole("button", { name: "卡片已生成" })).toBeVisible();
});

test("首页电视真的能换台：数字键、面板旋钮和方向键", async ({ page, isMobile }) => {
  test.skip(isMobile, "电视只在桌面宽度渲染");
  await page.addInitScript(() => sessionStorage.setItem("museum-crt-booted", "1"));
  await page.goto("/", { waitUntil: "networkidle" });

  const tv = page.getByRole("group", { name: /馆藏电视/ });
  const onAir = tv.locator('[aria-live="polite"]');

  await page.keyboard.press("3");
  await expect(onAir).toHaveText("CH 03 · 巴啦啦小魔仙");
  await expect(tv.locator(".tv-channel-badge")).toHaveText("CH 03");

  await tv.getByRole("button", { name: "下一个频道" }).click();
  await expect(onAir).toHaveText("CH 04 · 斗龙战士");
  await tv.getByRole("button", { name: "上一个频道" }).click();
  await tv.getByRole("button", { name: "上一个频道" }).click();
  await expect(onAir).toHaveText("CH 02 · 铠甲勇士");

  // 焦点在电视里时，方向键也是换台
  await page.keyboard.press("ArrowDown");
  await expect(onAir).toHaveText("CH 01 · 秦时明月");
  await page.keyboard.press("ArrowUp");
  await expect(onAir).toHaveText("CH 02 · 铠甲勇士");

  await tv.getByRole("button", { name: "随机换台" }).click();
  await expect(onAir).not.toHaveText("CH 02 · 铠甲勇士");

  // 在搜索框里打数字不会换台
  const before = await onAir.textContent();
  await page.getByRole("button", { name: "搜索" }).click();
  await page.getByRole("dialog", { name: "搜索动画馆藏" }).getByRole("textbox").focus();
  await page.keyboard.type("5");
  await expect(onAir).toHaveText(before ?? "");
});
