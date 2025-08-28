# StockVision 📊

A full-stack stock portfolio tracker that reads your Excel portfolio, fetches live stock data from Yahoo Finance & Google Finance, and visualizes insights with interactive charts.

---

## 🚀 Features
- parse Excel portfolio (XLSX).
- Live stock data from **Yahoo Finance** & **Google Finance** APIs.
- Portfolio allocation & sector summaries.
- Gain/Loss calculations with percentages.
- Interactive **DataTable** (sorting + pagination).
- **Pie chart** for sector allocation.
- **Bar chart** for sector-wise gain/loss.
- Built with **Next.js (frontend)** + **Express.js (backend)**.

---

## 🛠️ Tech Stack
**Frontend:**
- Next.js 14
- TypeScript
- Tailwind CSS
- TanStack Table
- Recharts

**Backend:**
- Node.js
- Express.js
- Yahoo Finance API
- Cheerio (for Google Finance scraping)
- XLSX (Excel parsing)

---

## 📂 Project Structure
<img width="1920" height="2188" alt="localhost-3000" src="https://github.com/user-attachments/assets/0468ed16-3c73-4bc4-af96-d7a551bdd68a" />

⚡ Getting Started

Follow these steps to run the project locally:

## 1. Clone the repository
```bash
git clone https://github.com/your-username/stockvision.git
cd stockvision

## 2.Install dependecies
###Backend
cd backend
npm install


###Frontend
cd ../frontend
npm install

## 3.Start the servers

###Backend
npm run dev
Backend will run on: http://localhost:3001

###Frontend
npm run dev
Frontend will run on: http://localhost:3000
