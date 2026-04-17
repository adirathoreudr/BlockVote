# BlockVote - Decentralized E-Voting System

BlockVote is a secure, transparent, and decentralized voting platform built on the Ethereum blockchain. It combines the immutability of blockchain technology with a user-friendly off-chain authentication layer to ensure "one-person, one-vote" integrity while maintaining voter privacy and system scalability.

## 🚀 Key Features

- **Blockchain-Backed Verifiability:** Every vote is recorded on the Ethereum blockchain as a smart contract transaction, making it impossible to alter or delete votes after they are cast.
- **Secure Authentication:** Multi-layer security using JWT-based sessions and OTP (One-Time Password) verification via email.
- **Smart Contract Governance:** Automated election rules ensuring only registered candidates are eligible and only authorized admins can open/close elections.
- **Modern User Interface:** A sleek, glassmorphism-themed React dashboard with integrated MetaMask wallet hooks.
- **Hybrid Architecture:** Uses MongoDB for fast off-chain profile management and Ethereum for core voting logic integrity.

## 🛠️ Technology Stack

### Blockchain Layer
- **Solidity:** Smart contract development.
- **Truffle Framework:** Development, testing, and deployment environment.
- **Ganache:** Local blockchain simulation.
- **Ethers.js:** Web3 library for frontend-blockchain communication.

### Backend Layer (Off-Chain)
- **Node.js & Express:** Scalable API services.
- **MongoDB:** Voter credential and profile storage.
- **JWT (JSON Web Tokens):** Secure session management.
- **Nodemailer:** Automated OTP delivery for identity verification.

### Frontend Layer
- **React.js:** Component-based UI development.
- **Vite:** Next-generation frontend tooling for fast builds.
- **Vanilla CSS:** Custom-styled glassmorphism design system.

## 📦 Project Structure

```text
├── backend/            # Express.js API & MongoDB Models
├── frontend/           # React.js UI (Vite)
├── truffle-contracts/  # Solidity Smart Contracts & Truffle Tests
├── Block_Vote_PRD.docx # detailed project requirements
└── README.md           # Project documentation
```

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MetaMask](https://metamask.io/) browser extension
- [Truffle](https://www.trufflesuite.com/truffle) (`npm install -g truffle`)

### 1. Blockchain Setup
```bash
cd truffle-contracts
npm install
# Start a local blockchain (Ganache) on port 8545
npx ganache --port 8545
# Compile and deploy contracts
truffle migrate --network development
```

### 2. Backend Setup
```bash
cd backend
npm install
# Configure your .env (MongoDB URI, JWT Secret, Email Credentials)
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🛡️ Security Considerations
- **Immutable Ledger:** Once a vote is cast on-chain, it cannot be tampered with by any entity, including administrators.
- **Double-Voting Protection:** The `BlockVote` smart contract uses a mapping to track hashed voter identities, strictly enforcing a single vote per person.
- **Administrative Control:** Crucial election phases (Opening/Closing) are restricted to the contract owner via the `onlyAdmin` modifier.

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
