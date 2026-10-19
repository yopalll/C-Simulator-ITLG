# Praktikum Dasar Pemrograman (Daspro) — ITLG

A scalable, IDE-grade interactive C/C++ programming laboratory simulator tailored for the Information Technology Laboratory Group (ITLG), enabling students to learn fundamental programming concepts starting with **Array Dasar** through live code execution, dynamic memory block inspection, interactive visual sandboxes, and hands-on lab challenges in Bahasa Indonesia.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and product choices have been confirmed from your preferences and the ITLG brand specifications:

- **Live C/C++ Code Parser & Memory Engine**: Students can edit C/C++ array declarations, assignments, loops, `sizeof` expressions, and 2D arrays directly inside `<UniversalCodeEditor />`. Running or editing the code dynamically parses variables, detects out-of-bounds memory violations, outputs to the terminal console, and updates `<UniversalRAMVisualizer />` with accurate hexadecimal addresses (`0x7ffe00` + byte offsets).
- **Interactive Lab Tasks & Concept Quizzes**: Each of the 6 Array modules includes both an interactive visual simulation sandbox and a practical mini-challenge/quiz with real-time verification to test student comprehension.
- **Scalable Curriculum & Locked Future Topics**: The sidebar navigation is driven dynamically from a central curriculum data structure. **Topik 1: Array Dasar** (Welcome Screen + 6 Modules) is active and playable, while future topics (**Topik 2: Pointer & Referensi**, **Topik 3: Struct & Union**, **Topik 4: Manipulasi String**) are rendered as locked curriculum previews ready for drop-in expansion.
- **Global RAM Visualizer Toggle (Default OFF)**: A top-level control labeled `Visualisasi RAM: Nonaktif / Aktif` defaults to **Nonaktif** (hidden) so students focus on logical concepts first and toggle low-level physical RAM inspection on demand.

---

## 1. Overview & Core Concept

- **What It Does**: Combines structured CS educational modules (from the ITLG *ARRAY DASPRO* curriculum) with a live C/C++ code workbench, interactive conceptual visualizers (e.g., 1D vs 2D memory mapping, loop step-by-step trace, `sizeof` byte calculator), and an optional low-level RAM address grid.
- **Target Audience / Persona**: First-year Computer Science / Information Technology students at Universitas Sumatera Utara (ITLG) and teaching assistants (*Aslab: Yosua Valentino - 251402055*) conducting Fundamental Programming (*Dasar Pemrograman*) lab sessions.
- **Key Value**: Bridges the gap between abstract C/C++ syntax and physical memory representation without requiring local compiler setup, while maintaining a decoupled component architecture where new topics can be added via data objects alone.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Onboarding & Welcome Screen**:
   - Students land on the **Pengantar Array** screen featuring the core quote: *"Kalau kamu punya banyak data tapi cuma mau satu nama variabel — itulah fungsi Array"*.
   - Three interactive anatomy cards (**01. NAMA**, **02. NILAI**, **03. INDEKS**) highlight how a single declaration (`int nilai[5]`) maps identifier, stored element values, and zero-based indexing (`0` to `n-1`).
2. **Guided Module Exploration (Modules 1 to 6)**:
   - Selecting any module from the left IDE sidebar loads its conceptual briefing, interactive visual sandbox, pre-populated `<UniversalCodeEditor />`, terminal console output, and a hands-on lab task.
   - Students can step through interactive controls (e.g., comparing 6 separate `int` variables vs `int angka[6]` in Modul 1; switching between Kosong, Otomatis, and Lengkap initialization modes in Modul 2; testing valid vs out-of-bounds `nilai[3]` access in Modul 3; stepping through `for(int i=0; i<n; i++)` iterations in Modul 4; inspecting byte math with `sizeof(arr) / sizeof(arr[0])` in Modul 5; and mapping 2D logical rows/columns to a 1D physical RAM strip in Modul 6).
3. **Live Code Execution & Physical RAM Inspection**:
   - Students modify C code in `<UniversalCodeEditor />` and click **Jalankan Kode**.
   - Toggling **Visualisasi RAM: Aktif** reveals `<UniversalRAMVisualizer />`, displaying each memory block with its hex address (`0x7ffe00`, `0x7ffe04`, ...), variable label (`angka[0]`), stored value or garbage value, active read/write highlight, or crimson out-of-bounds alert.
4. **Module Verification Challenge**:
   - At the bottom of each module, students complete a short coding task or conceptual check to mark the module completed in their session progress tracker.

### Visual Identity & Theme
- **Aesthetic Direction**: Utilitarian Developer IDE (inspired by VS Code / JetBrains Fleet) combined with official ITLG institutional branding. Strict sharp geometry (`rounded-none` to `rounded-sm`), hairline `1px` structural borders, and zero decorative AI clutter.
- **Color Palette & Mood**:
  - **Base Coding Canvas (`#0D1117`)**: Deep developer dark mode background for the primary workspace and code editor.
  - **ITLG Navy Dark (`#0F2D43`)**: Header bar, sidebar navigation backdrop, and structural panel headers.
  - **ITLG Primary Blue (`#1A5187`)**: Active module indicators, primary action buttons, focused memory cells, and interactive highlights.
  - **ITLG Crimson Red (`#770707`)**: Out-of-bounds memory access alerts (`Index Out of Bounds` / `Segmentation Fault`), syntax error banners, and invalid state indicators (always paired with explicit warning icons and text labels).
- **Typography & Hierarchy**:
  - **Primary UI & Editorial Prose**: `Montserrat` (400 Regular, 600 SemiBold, 700 Bold) for headers, conceptual explanations, navigation, and controls.
  - **Code, Console & Memory Telemetry**: `JetBrains Mono` / `Fira Code` with `tabular-nums` strictly applied to the code editor, C syntax snippets, terminal output, array indices, byte sizes, and hexadecimal RAM addresses.
- **Branding & Identity**:
  - Top Header Bar displays `<img src="/logo-itlg.png" />` (backed by an embedded high-precision SVG/canvas ITLG emblem so it never breaks) alongside **Laboratorium Dasar Pemrograman - ITLG** and the global **Visualisasi RAM: Nonaktif / Aktif** toggle switch.
  - Sidebar footer strictly displays **Aslab: Yosua Valentino (251402055)** with institutional metadata.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side C/C++ Array Interpreter & Memory Simulator**
  - *Chosen Approach*: Build a deterministic client-side C/C++ subset parser and execution engine supporting `int`, `float`, `char`, `double` 1D/2D arrays, initializers (`{}`), element reads/writes (`arr[i] = val`), `for` loops, `sizeof()`, and `printf` / `cout` output.
  - *Why*: Provides zero-latency execution, deterministic step-by-step memory state snapshots for `<UniversalRAMVisualizer />`, and exact detection of out-of-bounds array accesses (`nilai[3]` on a size-3 array) with educational Bahasa Indonesia diagnostics.
  - *Alternatives Considered*: External remote compiler APIs (high latency, rate limits, and unable to return structured step-by-step RAM cell objects for custom visualization).
- **Decision 2: Universal Decoupled Component Contracts**
  - *Chosen Approach*: `<UniversalCodeEditor />` and `<UniversalRAMVisualizer />` are strictly data-driven via props (`initialCode`, `readOnly`, `onChange`, `onRun`, and `memoryBlocks: Array<{ address, value, label, highlight, isError, dataType, subLabel }>`).
  - *Why*: Ensures future ITLG laboratory modules (Pointers, Structs, Strings) can render arbitrary memory layouts (e.g., pointer arrows, struct padding, null-terminated character arrays) without modifying the core layout or visualizer component.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        Application Shell (App)                             │
│  State: activeTopicId, activeModuleId, isRamVisible (default: false),      │
│         completedModules[], customCodeByModule{}, simulationState          │
└───────────────┬───────────────────────────────────────────┬────────────────┘
                │                                           │
                ▼                                           ▼
┌───────────────────────────────┐           ┌────────────────────────────────┐
│   Header & Sidebar Layout     │           │      Main IDE Workspace        │
│ ───────────────────────────── │           │ ────────────────────────────── │
│ • ITLG Logo & Lab Title       │           │ • WelcomeHeroView (Intro +     │
│ • Global RAM Toggle Switch    │           │   01.NAMA / 02.NILAI /         │
│   (Nonaktif / Aktif)          │           │   03.INDEKS interactive cards) │
│ • Dynamic Curriculum Tree     │           │ • ModuleInteractiveStage       │
│   (from curriculum data)      │           │   (Concept Sandbox + Controls) │
│   ├─ Topik 1: Array Dasar     │           │ • <UniversalCodeEditor />      │
│   └─ Topik 2..4 (Locked)      │           │   (Line numbers, C syntax,     │
│ • Footer: Aslab Yosua         │           │    Run/Reset controls)         │
│   Valentino (251402055)       │           │ • C/C++ Execution Console      │
└───────────────────────────────┘           │ • <UniversalRAMVisualizer />   │
                                            │   (Conditional on isRamVisible)│
                                            │ • ModuleLabChallenge & Quiz    │
                                            └───────────────┬────────────────┘
                                                            │
                                                            ▼
                                            ┌────────────────────────────────┐
                                            │  Client-Side C Array Engine    │
                                            │ ────────────────────────────── │
                                            │ • Parses 1D/2D declarations    │
                                            │ • Evaluates loops & sizeof()   │
                                            │ • Generates Hex RAM blocks     │
                                            │ • Detects Out-of-Bounds access │
                                            └────────────────────────────────┘
```

### Data Model & State
- **Curriculum Schema**:
  - `Topic`: `{ id, number, title, subtitle, locked, modules: ModuleItem[] }`
  - `ModuleItem`: `{ id, code, title, subtitle, type: 'welcome' | 'module', conceptSummary, keyPoints, initialCode, defaultMemoryBlocks, interactiveMode, challenge }`
- **Universal Memory Block Object**:
  - `{ address: string, value: string | number, label: string, highlight?: boolean, isError?: boolean, isGarbage?: boolean, groupLabel?: string, byteSize?: number }`

### Interactive Component & State Mapping
- **Global RAM Toggle (`isRamVisible`)**: Defaults to `false`. Toggling to `true` smoothly reveals the `<UniversalRAMVisualizer />` dock inside the IDE workspace and synchronizes it with the currently active module's live parsed memory array.
- **Module Sandboxes (Modules 1–6)**:
  - *Modul 1 (Konsep Dasar)*: Interactive toggle comparing scalar chaos (`angka1`..`angka6` scattered in memory) vs contiguous array allocation (`int angka[6]`).
  - *Modul 2 (Inisialisasi)*: 3-mode selector (`Kosong / Deklarasi Saja` showing uninitialized garbage values, `Otomatis / Partial` showing zero-filling behavior, and `Lengkap` showing explicit values) that updates both editor code and RAM cells.
  - *Modul 3 (Akses & Modifikasi)*: Interactive index selector (`nilai[0]` to `nilai[4]`) demonstrating valid read/write operations versus `nilai[3]` out-of-bounds memory corruption alert in `#770707` Crimson Red.
  - *Modul 4 (Iterasi Loop)*: Step-by-step loop controller (`Play`, `Step i++`, `Reset`) tracing `for(int i = 0; i < n; i++)` execution across array indices in real time.
  - *Modul 5 (Operator Sizeof)*: Interactive data type & array length configurator calculating total bytes (`sizeof(arr)`), single element bytes (`sizeof(arr[0])`), and element count (`sizeof(arr) / sizeof(arr[0])`).
  - *Modul 6 (Array 2D)*: Dual synchronized view showing the Logical 2D Matrix (`matriks[baris][kolom]`) mapped directly to the Physical 1D Row-Major RAM strip (`0x7ffe00` onwards). Clicking any 2D cell highlights its exact 1D physical RAM address and formula (`Base + (i * Cols + j) * sizeof(type)`).
