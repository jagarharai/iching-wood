# 易經六十四卦 AI 智慧抽卡系統 (I Ching 64 Hexagrams AI Oracle Deck)

建立一套結合《周易》本經六十四卦原典、加密級均勻隨機抽卡儀式，以及後端 `@google/genai` 結構化哲學解卦的互動式決策輔助系統，並擴充圖鑑直通請益與報告匯出（高解析度圖片／Markdown）功能。

## User Review & Critical Decisions

> [!IMPORTANT]
> 以下為根據您的回覆所確認的架構與功能決策：

- **Confirmed Decision 1（程式碼結構）**：維持單一 `App.tsx` 前端檔案結構，完整保留您提供的六十四卦原典種子資料庫、六爻二進位驗證器、加密級隨機抽樣（Rejection Sampling）與三大主視圖介面。
- **Confirmed Decision 2（Gemini AI 串接架構）**：升級為全端架構，透過 Express 後端伺服器代理呼叫 `@google/genai` SDK（使用 `gemini-3.8-flash` 模型與 `Type.OBJECT` 結構化 JSON Schema），確保金鑰安全不外洩並提供穩定的結構化解卦輸出。
- **Confirmed Decision 3（擴充功能範疇）**：
  1. 完整保留現有三大核心模組（問卜抽卡、六十四卦圖鑑、本機問卜紀錄與底部資料完整性驗證）。
  2. 在「六十四卦圖鑑」單卦詳情彈窗中，新增**「以此卦直接向 AI 請益」**捷徑按鈕，支援帶入指定卦象直接進入提問與深度解卦流程。
  3. 在抽卡與解卦結果頁新增**「匯出 Markdown (.md)」**與**「匯出精美卦象長圖 (.png)」**功能，方便離線珍藏與分享。

---

## 1. Overview & Core Concept

- **What It Does**：提供「立意提問 → 64 張神諭卡牌陣直覺抽卡 → 觀象與原典經文閱讀 → AI 個人化五維度深度解卦」的完整體驗，並附帶可依上下經卦與關鍵字檢索的「文王六十四卦完整圖鑑」及「本機隱私問卜紀錄」。
- **Target Audience / Persona**：面臨職涯抉擇、專案規劃、合作關係或人生方向思考，希望透過《周易》哲學視角進行理性反思與盲點檢視的使用者。
- **Key Value**：將傳統《周易》經傳原典（嚴格核實 64 卦卦辭與大象傳）與現代 AI 結構化決策分析結合，強調「理性自省、拒絕宿命恐嚇」，並以無偏差的加密隨機演算法確保抽卡公正性。

---

## 2. User Experience & Visual Design

- **Key User Flows**：
  1. **STEP 1 立意提問**：使用者輸入想釐清的處境或點擊靈感範例，驗證非空白後進入 64 卦牌陣。
  2. **STEP 2 靜心抽卦**：呈現 64 張東方太極八卦幾何紋牌背，支援洗牌動效、點擊任一牌位或一鍵隨機抽卦（基於 `window.crypto.getRandomValues` 拒絕取樣，嚴格確保 1/64 機率）。
  3. **STEP 3 觀象與原典**：翻開精品神諭卦卡（由下而上繪製初爻至上爻陰陽實斷線），即時展示《周易》卦辭、《象傳・大象》與固定基礎卦義。
  4. **STEP 4 AI 個人化深度解卦 & 匯出**：使用者手動點擊「深入解卦」，由後端呼叫 Gemini 產出五維度解析（① 卦象核心意義、② 針對問題解析、③ 盲點與風險、④ 3 點具體行動建議、⑤ 一句話總結）。使用者可一鍵儲存至本機紀錄、複製文字、匯出 `.md` 檔案或下載精美卦卡報告 `.png` 圖片。
  5. **圖鑑檢索與直通請益**：於「六十四卦圖鑑」透過關鍵字或上卦／下卦篩選器檢視任一卦象詳情，點擊「以此卦直接向 AI 請益」即可鎖定該卦並輸入問題進行針對性解讀。
- **Visual Identity & Theme**：
  - *Aesthetic Direction*：東方典藏黑金美學（Archival Obsidian & Antique Gold），融合博物館典籍的莊重感與現代極簡介面。
  - *Color Palette & Mood*：
    - 60% 主畫布背景：深邃玄黑（`#0D0D0F`）與極夜墨黑（`#0A0A0C`）。
    - 30% 結構表面與文字：溫潤宣紙白（`#F4F0EA`）、亞麻灰褐副文（`#B8B2A6`）、玄石卡片基底（`#141418`）。
    - 10% 焦點古銅金點綴：泥金與古銅金（`#C8A96E`、`#D4B886`、`#E2C992`），用於六爻陽爻／陰爻線段、選中態與核心操作按鈕。
  - *Typography & Hierarchy*：標題與經文採用具人文底蘊的襯線字體（`Noto Serif TC` / `serif`）搭配寬字距（`tracking-[0.15em]` ~ `tracking-[0.25em]`）；內文與操作控制項採用清晰易讀的無襯線字體（`Plus Jakarta Sans` / `Noto Sans TC`）；卦序與爻位編號採用等寬數字（`font-mono tabular-nums`）。
  - *Component Styling & Layout*：桌面版 1440px 寬度下採用最大寬度 `max-w-6xl` 容器，解卦結果頁採左五右七（`lg:col-span-5` 神諭卦卡視覺 / `lg:col-span-7` 經文與 AI 解析）雙欄不對稱典藏佈局。
- **Interactive Feedback & Motion**：
  - 洗牌縮放模糊動效、抽中牌位發光上浮與翻牌過渡、10 秒冷卻防抖倒數計時、Session 快取秒讀標示，以及無原生彈窗的客製化 Toast 與確認 Modal。

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1：後端代理呼叫 `@google/genai` SDK vs. 前端直接呼叫**
  - *Chosen Approach*：建立 Express 伺服器端路由 `POST /api/reading`，在伺服器端初始化 `GoogleGenAI` 並設定 `responseSchema` 強制輸出結構化 JSON。
  - *Why*：保護 `GEMINI_API_KEY` 不暴露於瀏覽器端，且透過官方 `@google/genai` SDK 的 `Type.OBJECT` Schema 可保證五維度解卦欄位 100% 符合前端渲染格式。
  - *Alternatives Considered*：前端直接 `fetch` 呼叫 REST API 容易因金鑰未注入或暴露造成安全與連線失敗。
- **Decision 2：雙重快取與離線優雅降級機制**
  - *Chosen Approach*：保留前端 `sessionStorage` 快取（相同問題＋相同卦象不重複消耗配額）與 10 秒速率限制；當後端請求失敗時自動展示「經典原典自我對話指引」。
  - *Why*：兼顧流暢體驗、API 成本控制與離線可用性。
- **Decision 3：前端 Canvas 原生繪製匯出圖片 vs. 第三方截圖套件**
  - *Chosen Approach*：使用 HTML5 Canvas API 原生繪製高解析度（2x Retina）黑金典藏版解卦報告卡並輸出 PNG，同時提供純文字 Markdown (`.md`) 下載。
  - *Why*：不需額外肥大的 DOM 截圖相依套件，即可精準控制字體排版、六爻圖形、古銅金邊框與完整五維度解析，避免跨瀏覽器 CSS 截圖破版問題。

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**：

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       Frontend Single-File App                          │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌───────────────────┐ │
│ │  Oracle Draw View    │ │ 64 Hexagrams Catalog │ │ LocalStorage      │ │
│ │  - Step 1: Question  │ │ - Search & Trigram   │ │ Reading History   │ │
│ │  - Step 2: 64 Deck   │ │   Filters (Upper/Low)│ │ - Load / Review   │ │
│ │  - Step 3: Hexagram  │ │ - Detail Modal       │ │ - Delete / Clear  │ │
│ │  - Step 4: AI Report │ │ - Direct Ask AI CTA  │ │                   │ │
│ │  - Export MD / PNG   │ └──────────┬───────────┘ └─────────▲─────────┘ │
│ └──────────┬───────────┘            │                       │           │
│            ▼                        ▼                       │           │
│ ┌───────────────────────────────────────────────────────────┴─────────┐ │
│ │ Core Engines: 64 Hexagram DB + Validator | Crypto RNG | Canvas PNG  │ │
│ └───────────────────────────────────┬─────────────────────────────────┘ │
└─────────────────────────────────────┼───────────────────────────────────┘
                                      │ POST /api/reading
                                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Express Full-Stack Server (Port 3000)                │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ @google/genai SDK (GoogleGenAI)                                     │ │
│ │ - Model: gemini-3.8-flash                                           │ │
│ │ - Config: systemInstruction + responseMimeType: "application/json"  │ │
│ │ - Schema: coreEssence, questionAnalysis, blindSpots, actionableSteps│ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**：
  - `Hexagram`：包含 `id` (1~64)、`name`、`shortName`、`upperKey`、`lowerKey`、`lines` (`[0|1 x 6]` 由下而上)、`keywords`、`judgment`（卦辭）、`imageText`（大象傳）與 `coreMeaning`。
  - `AIReadingResult`：包含 `coreEssence`、`questionAnalysis`、`blindSpots`、`actionableSteps` (`string[]`) 與 `oneLineSummary`。
  - `ReadingHistoryItem`：儲存在 `localStorage` (`iching_oracle_history_v1`)，紀錄 `id`、`timestamp`、`question`、`hexagramId` 與選填的 `aiReading`。
- **Interactive Component & State Mapping**：
  - **指定卦象請益捷徑**：在圖鑑詳情 Modal 點擊「以此卦直接向 AI 請益」時，關閉 Modal、切換至 `oracle` 分頁，若使用者尚未輸入問題則引導輸入問題並鎖定該卦象（或直接進入第 3 步觀象解卦並在頂部提供問題編輯框），讓使用者能針對特定卦象直接請益。
  - **匯出報告處理器**：
    - `handleExportMarkdown`：將提問、卦象六爻、卦辭、大象傳與 AI 五維度解析組裝為結構化 `.md` 檔案並觸發瀏覽器下載。
    - `handleExportImage`：透過動態 2D Canvas 繪製黑金質感長圖（含太極裝飾、六爻圖形、問題、原典經文與 AI 解析自動換行排版），轉為 PNG Data URL 觸發下載。
- **Key Sequences & Integrations**：
  - 升級 `@google/genai` 至最新版本以支援 `gemini-3.8-flash` 模型。
  - 透過 `server.ts` 掛載 `POST /api/reading` API 端點與 Vite 中介軟體，於 Port 3000 提供全端服務。
