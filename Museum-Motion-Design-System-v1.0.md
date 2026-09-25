# Museum Motion Design System

> Project: 00 后动画记忆馆  
> Domain: museum.seanwalter.top  
> Version: 1.0  
> Status: Draft / Motion Foundation  
> Core Concept: 一台可以进入的童年电视机

---

## 1. 设计目标

Museum 的动画系统不是为了制造“炫技感”，而是为了强化网站本身的核心叙事：

**童年、电视、放学后的 17:30、动画频道、旧时代媒介、记忆、档案与重新发现。**

所有动画都应围绕三个目标展开：

1. 让页面产生“记忆被重新唤醒”的感觉。
2. 让 Museum 更像一个可以探索的数字博物馆，而不是普通动画资料库。
3. 让动画承担信息层级、交互反馈和叙事功能，而不是单纯装饰。

最终体验应该接近：

**用户不是在浏览一个动画网站，而是在重新打开一台童年的电视。**

---

## 2. Motion Personality

Museum 的 Motion Personality 定义为：

**Nostalgic / Soft / Physical / Cinematic / Playful**

即：

- 怀旧，但不做廉价复古滤镜。
- 柔和，而不是高速科技动画。
- 有物理感，例如卡片、胶片、电视、印章、书页。
- 有电影式转场，但避免过度复杂。
- 保留少量童趣和彩蛋。

Museum 不使用以下典型科技网站语言作为主要动画风格：

- 大规模科技粒子星空。
- 频繁霓虹光污染。
- 高强度 WebGL 扭曲。
- 每个标题都使用打字机动画。
- 页面元素持续漂浮。
- 无意义 360° 旋转。
- 强烈 Glitch。
- 高频弹跳。
- 所有 Card 都同时运动。

动画应该是“偶尔发生”，而不是“所有东西一直在动”。

---

## 3. Motion Hierarchy

整个网站动画分为五个等级。

### Level 0 — Static

默认状态。

绝大多数正文、介绍文字、标签和信息区域保持静态。

目标：

保证可读性。

### Level 1 — Micro Motion

持续时间：

**120–220ms**

用于：

- Button Hover
- Link Hover
- Card Border
- Icon Feedback
- Bookmark
- Toggle
- Tab

特点：

快速、克制、几乎无等待感。

### Level 2 — Component Motion

持续时间：

**220–450ms**

用于：

- Card Hover
- Spotlight
- Poster Tilt
- Modal
- Dropdown
- Drawer
- Filter
- Gallery

这是整个网站使用频率最高的动画级别。

### Level 3 — Section Motion

持续时间：

**400–800ms**

用于：

- Section Reveal
- Film Strip
- Timeline
- Hero Animation
- Scroll Reveal
- Quote Reveal

一个屏幕内最多出现 1–2 个明显 Level 3 动画。

### Level 4 — Narrative Motion

持续时间：

**600–1500ms**

用于：

- CRT 开电视
- Shared Element Transition
- Page Transition
- VHS Rewind
- Page Flip
- Channel Change

这种动画只出现在特定交互，不允许高频使用。

---

## 4. Motion Tokens

所有动画必须尽量调用统一 Motion Token。

禁止每个组件随意定义动画参数。

### Duration

```css
--motion-instant: 120ms;
--motion-fast: 180ms;
--motion-normal: 280ms;
--motion-slow: 420ms;
--motion-section: 600ms;
--motion-story: 900ms;
--motion-cinematic: 1200ms;
```

推荐用途：

```text
120ms  按钮反馈
180ms  Hover
280ms  Card
420ms  Modal / Panel
600ms  Section
900ms  页面叙事
1200ms CRT / 特殊动画
```

---

## 5. Easing Tokens

禁止大量使用默认：

```css
ease
linear
```

Museum 使用四类 Easing。

### Standard

普通 UI 动画。

```css
cubic-bezier(0.2, 0, 0, 1)
```

Token：

```css
--ease-standard
```

### Enter

元素进入。

```css
cubic-bezier(0, 0, 0.2, 1)
```

Token：

```css
--ease-enter
```

### Exit

元素离开。

```css
cubic-bezier(0.4, 0, 1, 1)
```

Token：

```css
--ease-exit
```

### Nostalgia

Museum 特殊动画。

特点是：

前段稍快，后段慢慢停下。

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

Token：

```css
--ease-nostalgia
```

主要用于：

- Poster
- Shared Element
- Cover Flow
- Page Flip
- Timeline
- Hero

---

## 6. Movement Scale

Museum 的 UI 动画原则：

**位移小于用户想象。**

普通元素：

```text
4px
8px
12px
16px
```

Section：

最大：

```text
24px
```

普通 Card Hover：

```text
translateY(-4px)
```

极限：

```text
translateY(-8px)
```

禁止：

```text
translateY(-20px)
```

这类明显“飞起来”的卡片动画。

---

## 7. Rotation Scale

普通卡片：

```text
1°–3°
```

Poster 3D Tilt：

```text
最大 X：5°
最大 Y：5°
```

特殊 Cover Flow：

```text
25°–45°
```

只有 Cover Flow 可以使用明显旋转。

普通 UI 禁止大角度旋转。

---

## 8. Scale Scale

推荐：

```text
0.98
1
1.02
1.04
```

普通 Card：

```text
1 → 1.02
```

Hero Poster：

最多：

```text
1 → 1.04
```

禁止：

```text
1 → 1.1
```

大幅放大会导致廉价感。

---

## 9. CRT Opening

### 使用位置

首次访问首页。

不在每次页面跳转时播放。

同一 Session 最多播放一次。

### Sequence

```text
Black Screen

↓

17:29

↓

17:30

↓

CRT Horizontal Line

↓

Screen Flash

↓

Weak Noise

↓

Museum Hero
```

### Duration

总时间：

```text
900–1400ms
```

推荐：

```text
1100ms
```

### CRT Line

初始：

```text
width: 0
height: 1px
opacity: 1
```

展开：

```text
width: 100%
height: 1px
```

然后快速扩展为完整画面。

### Noise

持续：

```text
100–180ms
```

Noise 不可以超过：

```text
opacity: 0.08
```

避免真正影响视觉。

### 移动端

移动端简化：

```text
Black
↓
CRT Line
↓
Hero
```

取消复杂 RGB 分离。

### Reduced Motion

直接跳过。

---

## 10. Ambient Background

Museum 的背景不是动态粒子宇宙。

采用：

**Film Grain + Dust + Warm Glow**

### Film Grain

Opacity：

```text
0.015–0.035
```

Animation：

```text
8–12fps
```

禁止 60fps 高频 Noise。

### Dust Particle

数量：

Desktop：

```text
15–30
```

Mobile：

```text
6–12
```

移动：

```text
2–8px / 秒
```

透明度：

```text
0.1–0.25
```

Dust 应该近乎不可察觉。

---

## 11. Museum Spotlight

用于：

- Poster Card
- Collection Card
- Memory Card

鼠标进入 Card 时出现柔和 Spotlight。

### Spotlight Size

Desktop：

```text
220–360px
```

Mobile：

关闭 Pointer Follow。

### Color

不要科技蓝。

应该使用：

```text
Warm White
Amber
Soft Yellow
```

视觉隐喻：

**电视机照亮房间。**

### Opacity

最大：

```text
0.12
```

Spotlight 应该属于“第二眼才能发现”的动画。

---

## 12. Poster 3D Tilt

用于：

动画海报。

### Rotation

```text
rotateX: ±5deg
rotateY: ±5deg
```

Perspective：

```text
800–1200px
```

### Layer Parallax

Poster Background：

```text
0.2
```

Image：

```text
0.4
```

Title：

```text
0.6
```

Metadata：

```text
0.8
```

### Mouse Leave

恢复时间：

```text
420ms
```

Ease：

```text
--ease-nostalgia
```

不能瞬间归位。

### Mobile

关闭 Tilt。

改为：

```text
active → scale(0.98)
```

---

## 13. Cover Flow

推荐用于：

首页精选馆藏。

形式参考经典 Cover Flow，但避免完全复刻。

### Center Poster

```text
scale: 1
opacity: 1
rotateY: 0
```

### Adjacent Poster

```text
scale: 0.88
opacity: 0.75
rotateY: 28deg
```

### Further Poster

```text
scale: 0.78
opacity: 0.45
```

最多展示：

```text
5–7 posters
```

### Interaction

支持：

- Mouse Wheel
- Drag
- Touch Swipe
- Arrow
- Keyboard

### Autoplay

禁止自动高速轮播。

如果开启：

最短间隔：

```text
6000ms
```

鼠标进入立即暂停。

---

## 14. Channel Switching

当精选动画切换时，可以模拟：

**电视换台。**

Sequence：

```text
Poster
↓
70ms Noise
↓
Channel Label
↓
Next Poster
```

例：

```text
CH 05
```

Noise：

```text
50–100ms
```

禁止持续 Glitch。

RGB Split：

最大：

```text
1–2px
```

持续：

```text
< 100ms
```

---

## 15. Film Strip

用于：

Latest Additions。

采用横向胶片结构。

Movement：

```text
Slow Marquee
```

速度：

```text
15–30px / second
```

Hover：

```text
Pause
↓
Poster Scale 1.03
↓
Metadata Reveal
```

用户开始拖动后：

立即停止自动移动。

### Mobile

改为横向 Snap Scroll。

不自动滚动。

---

## 16. Shared Element Transition

这是 Museum 最重要的页面转场。

Poster：

```text
Collection Card
↓
Hero Poster
```

应保持视觉连续性。

### Duration

```text
450–650ms
```

推荐：

```text
520ms
```

### Sequence

Poster：

```text
position
size
border-radius
```

连续变化。

其他内容：

```text
opacity 0 → 1
translateY 12px → 0
```

延迟：

```text
100–160ms
```

### 禁止

不要同时：

- Rotate
- Blur
- Zoom
- Fade
- Glitch

Shared Element 本身已经足够。

---

## 17. Archive Timeline

用于：

按年代探索动画。

年份作为主要视觉元素。

例如：

```text
2004
2005
2006
2007
2008
```

### Active Year

Scale：

```text
1
```

Opacity：

```text
1
```

Inactive：

```text
opacity 0.25
```

### Transition

年份：

```text
Blur 4px
↓
Blur 0
```

Duration：

```text
300ms
```

### Scroll

使用 Scroll Driven Motion。

禁止 Scroll Hijacking。

页面仍然必须保持原生滚动感。

---

## 18. VHS Rewind

只用于：

跨年代跳转。

比如：

```text
2018 → 2005
```

显示：

```text
◀◀ REW
```

年份快速回退。

Duration：

```text
350–600ms
```

最多：

```text
1 次
```

一次操作只播放一次。

普通导航禁止使用 VHS 动画。

---

## 19. Quote Animation

Museum 拥有大量经典台词。

台词动画采用：

**Subtitles Reveal**

而不是打字机。

### Sequence

```text
Blur 4px
↓
Opacity 0 → 1
↓
Blur 0
```

Duration：

```text
420ms
```

下一条台词：

```text
Opacity 1 → 0
↓

New Quote
```

禁止：

逐字打字。

因为台词阅读速度容易被动画拖慢。

---

## 20. Memory Book

“我的回忆册”采用纸张与收藏册语言。

核心动画：

- Page Flip
- Photo Reveal
- Stamp
- Note Insert

### Page Flip

最大旋转：

```text
180deg
```

Duration：

```text
500–700ms
```

必须有：

```text
perspective
shadow
```

让翻页具有纸张重量。

### Mobile

不做完整 Page Curl。

改为：

```text
horizontal slide
+
slight rotate
```

保证性能。

---

## 21. Archive Stamp

当用户：

- 收藏
- 写入记忆
- 添加动画
- 完成记录

可以使用：

**Archive Stamp Animation**

Sequence：

```text
scale 1.25
opacity 0

↓

scale 0.92
opacity 1

↓

scale 1
```

Duration：

```text
260–340ms
```

轻微 Rotation：

```text
-2° ~ 2°
```

Stamp 文案可采用：

```text
ARCHIVED
已收藏
MEMORY SAVED
童年入馆
```

禁止每次普通点击都盖章。

---

## 22. Scroll Reveal

普通 Section 使用统一 Scroll Reveal。

初始：

```css
opacity: 0;
transform: translateY(16px);
```

结束：

```css
opacity: 1;
transform: translateY(0);
```

Duration：

```text
500ms
```

Threshold：

```text
15–25%
```

每个 Section：

只播放一次。

### Stagger

Card Grid：

```text
40–70ms
```

最大累计 Stagger：

```text
300ms
```

不能出现：

一排 20 个 Card 一个一个缓慢播放。

---

## 23. Hover Rules

整个网站 Hover 统一遵守：

Card：

```text
translateY(-4px)
scale(1.01–1.02)
```

Image：

```text
scale(1.02–1.04)
```

Border：

```text
opacity / brightness
```

Shadow：

缓慢增强。

禁止：

Hover 时同时进行：

```text
Scale
Rotate
Glow
Bounce
Particle
Text Move
Border Spin
```

每张 Card 最多同时存在两个主要 Motion。

---

## 24. Navigation Motion

顶部导航：

Hover：

```text
underline width 0 → 100%
```

Duration：

```text
180ms
```

Active：

使用静态高亮。

Mobile Menu：

```text
opacity
translateY
```

不使用大规模弹簧动画。

---

## 25. Button Motion

Primary Button：

Hover：

```text
translateY(-1px)
```

Active：

```text
translateY(1px)
scale(0.98)
```

Duration：

```text
120–180ms
```

不要使用：

持续呼吸。

CTA 只有真正重要的特殊入口可以偶尔使用 Glow。

---

## 26. Image Reveal

动画截图、海报和剧照可使用：

**Mask Reveal**

推荐：

```text
clip-path
```

或：

```text
overflow hidden + image transform
```

Sequence：

```text
Mask
↓
Image Reveal
↓
Image scale 1.04 → 1
```

Duration：

```text
600ms
```

---

## 27. Loading State

普通页面：

禁止展示整屏 Loader。

内容优先出现。

图片：

使用：

```text
Blur Placeholder
↓
Sharp Image
```

Duration：

```text
250–400ms
```

Skeleton：

只用于真实异步内容。

不要为了动画而制造 Skeleton。

---

## 28. Sound Design

v1 默认：

**无声音。**

后期如果加入 Sound：

必须默认关闭。

可选音效：

- CRT 开机
- 遥控器 Click
- VHS
- Stamp
- Page Flip

音量必须极低。

提供：

```text
Sound On / Off
```

记住用户选择。

禁止自动播放背景音乐。

---

## 29. Reduced Motion

必须支持：

```css
@media (prefers-reduced-motion: reduce)
```

Reduced Motion 下：

关闭：

- CRT
- Tilt
- Cover Flow Rotation
- Parallax
- Particle
- VHS
- Page Flip
- Scroll Scrub

保留：

```text
Opacity
简单 Fade
```

Duration：

```text
≤ 150ms
```

---

## 30. Mobile Motion Strategy

移动端不是 Desktop 动画的缩小版。

Mobile 重点：

保留：

- Fade
- Snap Scroll
- Stamp
- Shared Transition
- Quote Reveal
- Film Strip

关闭：

- Mouse Spotlight
- Cursor Interaction
- Tilt
- Large Particle
- Heavy Parallax
- WebGL

移动端动画应明显比 Desktop 少。

---

## 31. Performance Budget

Museum 动画必须遵守性能预算。

目标：

```text
60 FPS
```

最低：

```text
45 FPS
```

不接受明显掉帧。

动画优先使用：

```text
transform
opacity
filter（少量）
clip-path（适量）
```

尽量避免：

```text
top
left
width
height
margin
```

持续动画中修改 Layout 属性。

同时运行的 Continuous Animation：

Desktop：

```text
≤ 3
```

Mobile：

```text
≤ 1
```

---

## 32. Animation Libraries

优先级建议：

### CSS

用于：

- Hover
- Fade
- Button
- Basic Reveal
- Navigation

### Motion / Framer Motion

如果项目基于 React：

用于：

- Layout Animation
- Shared Element
- Component Motion

### GSAP

只用于：

- Scroll Storytelling
- Timeline
- Complex Sequence
- VHS
- CRT

不要所有动画都使用 GSAP。

### WebGL

v1 不建议使用。

如果未来需要 Fluid / Shader，再单独评估。

---

## 33. Animation Component Architecture

推荐建立：

```text
src/
  motion/
    tokens.ts
    easings.ts
    durations.ts
    reduced-motion.ts

  components/
    motion/
      ScrollReveal
      PosterTilt
      SpotlightCard
      FilmStrip
      CoverFlow
      CRTIntro
      SharedPoster
      ArchiveStamp
      QuoteReveal
      TimelineYear
      VHSRewind
```

业务组件禁止重复自己实现 Motion Logic。

---

## 34. Naming Convention

动画组件名称必须描述行为。

推荐：

```text
PosterTilt
QuoteReveal
ArchiveStamp
CRTIntro
FilmStrip
```

禁止：

```text
CoolAnimation
FancyCard
AwesomeEffect
MagicHover
```

---

## 35. Motion Density

一个普通屏幕：

推荐：

```text
1 个 Primary Motion
+
1–2 个 Secondary Motion
```

不要：

```text
Hero 在动
背景在动
Card 在动
Text 在动
Button 在动
Particle 在动
Navbar 在动
```

同时发生。

视觉需要有静止区域。

---

## 36. Museum Motion Map

首页：

```text
CRT Intro
↓
Hero Ambient Motion
↓
Cover Flow
↓
Latest Film Strip
↓
Collection Scroll Reveal
↓
Memory Book
↓
Quote Reveal
↓
Footer Ambient
```

详情页：

```text
Shared Element
↓
Hero Reveal
↓
Metadata
↓
Story Content
↓
Quote
↓
Related Posters
```

时间线：

```text
Year Scroll
↓
Blur Focus
↓
Poster Reveal
```

回忆册：

```text
Book Open
↓
Memory Card
↓
Archive Stamp
```

---

## 37. Phase 01

第一阶段只实现：

1. Motion Tokens
2. Reduced Motion
3. Scroll Reveal
4. Poster Tilt
5. Spotlight Card
6. Film Strip
7. Archive Stamp
8. Shared Element Transition

目标：

先建立整个 Motion Foundation。

---

## 38. Phase 02

加入：

1. CRT Intro
2. Cover Flow
3. Timeline
4. Quote Reveal
5. Memory Book Page Flip

---

## 39. Phase 03

Experiment：

1. Channel Switching
2. VHS Rewind
3. Remote Control
4. Hidden Easter Egg
5. Optional Sound Design

Phase 03 属于增强功能。

不能影响核心浏览体验。

---

## 40. Acceptance Criteria

每个 Motion PR 必须检查：

- 动画是否具有实际意义。
- 是否符合 Museum 的怀旧媒介语言。
- 是否与页面其他动画冲突。
- 是否支持 Reduced Motion。
- 是否在 Mobile 有降级方案。
- 是否存在 Layout Shift。
- 是否出现 FPS 明显下降。
- 是否阻碍点击。
- 是否阻碍阅读。
- 是否导致用户等待。
- 是否重复实现已有 Motion Component。
- 是否控制在 Motion Token 内。

---

## 41. 禁止事项

Museum Motion System 明确禁止：

```text
❌ 所有标题打字机
❌ 大面积科技粒子
❌ 无限高速 Marquee
❌ Hover 大幅放大
❌ 大量 Bounce
❌ 所有元素 Fade Up
❌ 高频 Glitch
❌ 彩虹 Neon
❌ 无意义 3D
❌ Scroll Hijacking
❌ 自动背景音乐
❌ Mobile 强行执行 Desktop Motion
❌ 动画导致内容延迟出现
```

---

## 42. Core Principle

任何动画加入之前，都问一句：

> 如果移除这个动画，信息表达是否受到影响？

如果答案是：

**没有任何区别。**

那么它大概率只是一种装饰。

Museum 可以存在装饰动画，但应该控制数量。

最好的动画不是：

**“你看，这里有动画。”**

而应该是：

**“这个网站真的像一段正在重新播放的记忆。”**

---

# Museum Motion Manifesto

Museum 不追求最大程度的动态化。

它追求的是一种属于 00 后动画记忆的数字体验：

电视机亮起。

频道被切换。

旧海报重新被照亮。

胶片继续向前滚动。

某一句已经忘记很多年的台词再次出现。

一本属于自己的回忆册被翻开。

然后某一部动画，被重新收藏进童年。

这就是 Museum Motion Design System 的最终目标：

**让记忆重新动起来。**
