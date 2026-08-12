# UAT Admin Overview

**Site (primary):** https://callitso.docker-uat01.ust.hk (Drupal 10.8, HKUST MTPC Platform)
**Explored:** 2026-08-06, read-only (nothing saved/published)
**Who:** Logged in as admin (LEE, Ming Fung) via CAS; authenticated via saved session.

**Second site:** https://builder-clean.docker-uat01.ust.hk (walkthrough in §0, 2026-08-12)

This doc is a plain-language walkthrough of the admin area ("MTPC Administration").
It is a basic overview of what each part is for — not an exhaustive field-by-field
reference. For health/failure details see `UAT-BLOCK-HEALTH.txt`.

---

## 0. builder-clean walkthrough (2026-08-12)

`builder-clean` is the **newer, refreshed build** of the same platform. Same top-bar
navigation and admin layout as callitso (§1–4), with two notable differences that
matter for the Playwright automation project:

- **New content type: Standard Page** (`/node/add/custom_page/mtpc`) — the page type
  every Playwright test creates. It hosts the new "MTPC" blocks via paragraph
  sections (1-col / 2-col), plus full-width/page-title options.
- **16 custom paragraph blocks** live under Structure → Paragraph types
  (`/admin/structure/paragraphs_type`): Accordion, Event Carousel, Icon & Text
  Highlight, Image, Image Grid, Navigation Menu, Next & Previous, Page Title,
  Profile Details, Profile Listing, Slideshow, Text Area, Three Column Carousel,
  Video, Views, YouTube. (callitso has the same blocks minus the newer ones.)

### Structure section sweep

Walked `/admin/structure` and every sub-page (Block layout, Block types, Comment
types, Config pages, Contact forms, Content types incl. `manage/custom_page`,
Display modes, Entityqueues, Feed types, File types, Media types, Menus incl.
`Top Links`, Paragraph types, Taxonomy vocabularies, Views, Webforms):

- **All 23 admin Structure pages returned HTTP 200** (verified during the UAT run).
- Content types list (`/admin/structure/types`) now includes **Standard Page**
  (`custom_page`) alongside the platform types; `manage/custom_page` exposes the
  `field_mod_sections` paragraph field that the tests drive.
- Menus include **Top Links** (`/admin/structure/menu/manage/top-links`) — required
  by `addNavigationMenuBlock`; the menu has pre-seeded items on this build.

This sweep confirms every admin surface the Playwright suite depends on exists and
loads on the refreshed build.

---

## 1. Landing page (`/admin`)

The dashboard is a simple hub with links to the main sections:

| Section | Purpose |
|---|---|
| Content | Find and manage content |
| Structure | Blocks, content types, menus, taxonomy |
| Appearance | Themes and their settings |
| Extend | Installed/enabled modules |
| Configuration | Site-wide settings |
| People | User accounts, roles, permissions |
| Reports | Logs, status, updates |
| Help | Module documentation |

## 2. Top bar tabs (custom admin menu)

The real navigation is the custom **top bar**, which is grouped into a few areas:

### Pages & Content
- **Pages/Content** (`/admin/content`) — content admin table. Filter by type
  (Album, Article, Basic page, Basic Tabs, Document Library, Event Registration,
  Events, External Media, FAQ, Landing Page, Multimedia *, News, ...). Has "Add
  content" and "Add content as MTPC" buttons, plus secondary tabs for
  Scheduled content.
- **Landing Pages** (`/admin/landing-page/overview`) — manage Landing Page nodes:
  publish/unpublish/export list.
- **Path Update** (`/admin/landing-page/path-update`) — one form: replace all
  absolute links to an old website / wrong public-files URL with a new URL.
- **Add Content Page** (`/node/add`) — the list of every content type you can create
  (a long list: Album, Article, Basic page, Basic Tabs, Document Library,
  Event Registration, Events, External Media, FAQ, Landing Page,
  Multimedia - Annual Report / eCard / Gallery / HKUST Genesis / Publication / Video,
  News, Photo & Video Album, Standard Page, Template, ...).
- **Webforms** (`/admin/structure/webform`) — forms management. Shows developer
  warning banners (module upgrade notes), a filterable webform list, and the
  "Contact" default form with Build / Settings / Results / etc.

### Appearance
- **Appearance** (`/admin/appearance`) — installed themes: **HKUST MTPC** (default),
  Bartik, HKUST, HKUST Style A, Seven (admin theme); uninstalled Claro.
- **Base Theme Settings** (`/admin/appearance/settings/hkust`) — global theme
  settings: logo, favicon, user pictures, etc. (one form per theme).
- **Blocks** (`/admin/structure/block`) — block layout per theme. Regions for
  HKUST MTPC include Header, Header (Left), Header (Right), Navigation,
  Breadcrumb, Highlighted, Content, Footer, etc.
- **Additional CSS / Additional JS** — live CSS/JS editors (line-numbered,
  with Save + backup tabs).

### Structure
- **Structure** (`/admin/structure`) — hub for: Block layout, Block types,
  Comment types, Config pages, Contact forms, Content types, Display modes,
  Entityqueues, Feed types, File types, Media types, Menus, Paragraph types,
  Taxonomy, Views, Webforms.
- **Taxonomy** (`/admin/structure/taxonomy`) — vocabularies (Background Images,
  Document Type, Event Categories, Event Organizers, Event Tags, News Category,
  People Type, Newsletter Issues, ...). List terms / add term per vocabulary.
- **Menus** (`/admin/structure/menu`) — menus incl. Administration, Footer,
  Footer Links, Footer Social Links, Footer Toolbar, Main navigation, Top Links.

### People & Accounts
- **User accounts** (`/admin/people`) — user list (currently 2 active users:
  LEE, Ming Fung and CHEUNG, Chin Dik, both Administrators / Undergraduate role).
  Add user / Add CAS user(s).
- **Roles mapping** (`/admin/role-mapping`) — CAS attribute → Drupal role mappings
  (Undergraduate, Postgraduate, Staff, Project, Emeritus, Affiliate via
  `voPersonAffiliation` match). Add role mapping.
- **Roles reset** (`/admin/role-mapping/config`) — checkboxes of roles that get
  **removed at every CAS login** (warning: overrides CAS role mapping).

### Events Synchronisation
- **Overview** (`/admin/hkust-events`) — sync status: enabled (Yes), last update
  **2023-07-31**, total events **0**, total synchronised **0**.
- **Synchronisation settings** — UCalendar website/API URLs, sync method (On CRON
  Maintenance Task), frequency, enable toggle, simplified mode, "FULL RUN" and
  "re-fetch organizers/categories/tags" actions.
- **Academic Calendar** — pull events for an academic year + category.
- **Import** — import events from another site (site name + site URL).

### Multimedia Configuration
- (`/admin/hkust-multimedia`) — page titles (EN / zh-Hant / zh-Hans) and photo
  gallery toggles ("Download all", per-photo Email/Download sharing).

### People Synchronisation (HKUST People Sorting Form Module)
- **Sorting People** (`/admin/hkust_people_edit_form/cat`) — categories to sort
  people (Faculty, Staff — each with an edit link).
- **Edit Publications** — list of people for editing publications (empty).
- **Edit Teaching Assignment** — list of people for editing TA (empty).

### Standard Drupal admin
The custom top bar is on top of the standard Drupal admin, reachable via the
regular tabs / direct URLs:
- **Extend** (`/admin/modules`) — all modules (Core + contrib + custom), with
  install status per module.
- **Configuration** (`/admin/config`) — everything: People (accounts, CAS,
  autoban, OTP, real name...), System (site info, cron, mail...), Content
  authoring (text formats/editors, linkit, scheduler...), Media (file system,
  image styles, IMCE, simple popup blocks...), Search, Region and language,
  Web services, Workflow, Development (performance, logging, backup & migrate,
  config sync, HKUST Theme Configs), MTPC Admin Config (global CSS/color
  scheme/media query, news content type toggle, multilingual toggle, event
  registration config).
- **People** (`/admin/people`) — same as "User accounts" above.
- **Reports** (`/admin/reports`) — Status report, Available updates, Recent log
  messages, top 403/404 errors, field list, plugins, webform plugins.
- **Help** (`/admin/help`) — getting-started + per-module help topics.

## 3. What the top bar does NOT expose

Some areas are only reachable by URL (they exist but aren't in the top bar menu):
- `Config pages` admin (`/admin/structure/config_pages/types`) — Header /
  Footer / News / Popup / Albums configuration pages.
- Content type forms (`/admin/structure/types`) — e.g. the `news` type's field
  config (`/admin/structure/types/manage/news`).
- Views admin (`/admin/structure/views`) — e.g. HKUST NEWS view.
- Media library admin (`/admin/content/media`) + media type config.

## 4. Health status

Test coverage and known failures are documented separately in
`UAT-BLOCK-HEALTH.txt` — this overview deliberately keeps no pass/fail detail.
