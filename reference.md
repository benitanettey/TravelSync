# 🚍 TravelSync – Frontend UI/UX System Guide

---

## 📌 Project Scope (CRITICAL)

TravelSync is a **Frontend-Only Single Page Application (SPA)**.

⚠️ This project focuses strictly on:

- UI (User Interface)
- UX (User Experience)
- Client-side interactions

---

## ❗ What This Project DOES NOT Include

- ❌ Backend development
- ❌ Database integration
- ❌ Authentication systems
- ❌ Payment processing
- ❌ Data persistence

All data used in the app is:
- Static (hardcoded)
- Mocked
- Stored temporarily in React state

---

## 🎯 Core Objective

Build a **clean, responsive, and interactive booking interface** that simulates a real-world system — without backend complexity.

---

## 🧱 Tech Stack

| Layer        | Technology |
|-------------|-----------|
| Framework   | Next.js (App Router) |
| Library     | React |
| UI System   | Ant Design (antd) |
| Styling     | CSS, styled-jsx, inline styles |
| Routing     | next/navigation |
| State       | React Hooks (useState) |

---

## 🔁 SPA Architecture (VERY IMPORTANT)

TravelSync is a **Single Page Application (SPA)**.

This means:

- Navigation is client-side
- Pages update without full reload
- UI feels fast and seamless

---

### ✅ Correct Navigation

```js
import { useRouter } from "next/navigation";
router.push("/seats");