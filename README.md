# Personal Expense Management Frontend

A responsive frontend application for the **Personal Expense Management (PEM)** system built with **React**. The application provides an intuitive interface for managing multiple financial accounts, recording transactions, and monitoring account balances in real time.

Designed with simplicity and usability in mind, the application enables users to efficiently organize their personal finances while maintaining a clear and accurate transaction history.

---

# Features

## User Authentication

* User registration
* Secure login
* JWT-based session handling
* Protected application routes

---

## Dashboard

The dashboard provides an overview of the user's financial information, including:

* Account summaries
* Current balances
* Recent transactions
* Quick navigation to financial operations

---

## Multi-Account Management

Users can create and manage multiple financial accounts, such as:

* Savings Accounts
* Current Accounts
* Cash Wallet
* Family Accounts
* Personal Accounts

Each account displays its current balance and transaction history independently.

---

## Transaction Management

Users can easily record:

* Income transactions
* Expense transactions

Each transaction includes:

* Amount
* Description
* Transaction type
* Selected account
* Date and time

---

## Transaction History

Users can:

* View complete transaction history
* Browse transactions for individual accounts
* Review balance changes over time

Since transactions are immutable, the interface focuses on displaying a reliable financial history rather than editing previous records.

---

## Responsive Design

The application is designed to provide a consistent experience across:

* Desktop
* Tablet
* Mobile devices

---

# Tech Stack

* React
* JavaScript
* React Router
* Axios
* HTML5
* CSS3

---

# Project Structure

```text
src
├── assets
├── components
├── context
├── pages
├── services
├── utils
└── App.jsx
```

---

# Application Workflow

1. Register a new account or log in.
2. Create one or more financial accounts with an initial balance.
3. Record income and expense transactions.
4. View updated account balances.
5. Review complete transaction history for each account.

---

# Backend Integration

The frontend communicates with the Spring Boot backend through REST APIs for:

* Authentication
* Account management
* Transaction management
* Financial data retrieval

JWT tokens are securely included in authenticated API requests.

---

# Getting Started

## Prerequisites

* Node.js
* npm

## Clone Repository

```bash
git clone https://github.com/TEJAYERR/PEM_FRONTEND.git
```

## Install Dependencies

```bash
npm install
```

## Configure Environment

Create a `.env` file and configure the backend API URL.

Example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

---

## Start Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

# Future Enhancements

* Financial analytics dashboard
* Interactive charts
* Budget planning interface
* Savings goals
* Transaction search and filters
* Dark mode
* Export transaction history
* Progressive Web App (PWA) support

---

# License

This project is intended for educational and portfolio purposes.

---

# Author

**Teja Yerriboyina**

GitHub: https://github.com/TEJAYERR
