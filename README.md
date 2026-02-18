> [!IMPORTANT]
> **Repository Migration Notification**
>
> The development of the W Bridge interface has been merged into the W Swap interface repository.
> Please refer to the new repository for the latest updates and contributions:
> - **Repository**: [https://github.com/w-chain/w-swap-fe](https://github.com/w-chain/w-swap-fe)
> - **Documentation**: [https://github.com/w-chain/w-swap-fe/blob/master/README.md](https://github.com/w-chain/w-swap-fe/blob/master/README.md)

# W Bridge Interface

W Bridge Interface is a cross-chain decentralized application (dApp) built with **Nuxt 3** and **Nuxt UI**. It enables users to transfer ERC-20 tokens between supported networks (W-Chain, BSC, Ethereum) using a secure bridge protocol.

This documentation provides a deep dive into the codebase, architecture, and operational flows for internal developers and maintainers.

## 🏗 Architecture

The application follows a hybrid architecture where the frontend handles direct blockchain interactions for deposits, while a lightweight server-side API acts as a proxy to validate transaction status on destination chains.

```mermaid
graph TD
    User[User] --> UI[Nuxt UI / Vue Components]
    
    subgraph "Frontend Layer"
        UI --> Stores[Pinia Stores]
        Stores --> Logic[Bridge Logic / Composables]
        Logic --> Ethers[Ethers.js v6]
        Logic --> Wallet[Vue Dapp / WalletConnect]
    end
    
    subgraph "Blockchain Layer"
        Ethers --> SourceChain[Source Chain Contract]
        Ethers --> DestChain[Destination Chain Contract]
    end
    
    subgraph "Server Layer (Nitro)"
        UI -.->|Poll Status| API[Server API /api/validator]
        API -->|Read Proposal| DestChain
    end

    SourceChain -.->|Event Emission| Relayer[Relayer Network]
    Relayer -.->|Vote/Execute| DestChain
```

## 🛠 Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com) (Vue 3 + Nitro)
- **UI Library**: [@nuxt/ui](https://ui.nuxt.com) (Tailwind CSS)
- **State Management**: [Pinia](https://pinia.vuejs.org)
- **Blockchain Interaction**: [Ethers.js v6](https://docs.ethers.org/v6/)
- **Wallet Management**: [@vue-dapp/core](https://github.com/vue-dapp/vue-dapp)
- **Icons**: Iconify (Lucide, Simple Icons)

## 🧩 Key Features & Modules

### 1. Token Bridging
Allows users to deposit tokens on a source chain to be minted/released on a destination chain.
- **File**: `stores/BridgeContract.ts`
- **Logic**: Handles fee calculation, allowance checks (`approve`), and the main `deposit` function.

### 2. Transaction History
Persists bridge transactions locally to track their lifecycle across chains.
- **File**: `stores/Transaction.ts`
- **Storage**: `localStorage`
- **States**: `PENDING` → `AWAITING` (Deposit Confirmed) → `SUCCESS` (Executed on Dest).

### 3. Network Management
Automatically handles network switching when the user's wallet is on the wrong chain.
- **File**: `stores/Network.ts`

### 4. Server-Side Validation
A Nitro server route that proxies read-only calls to the destination chain to check if a bridge proposal has been executed.
- **File**: `server/api/validator/proposal.get.ts`

## 🌊 Deep Dive: Bridge Flow

The bridging process involves interaction between the User, the UI/Store, the Smart Contracts, and the Validator API.

```mermaid
sequenceDiagram
    participant User
    participant UI as Interface
    participant Store as BridgeContract Store
    participant Source as Source Chain
    participant Server as Nitro API
    participant Dest as Dest Chain

    User->>UI: Select Token, Amount, Dest Chain
    UI->>Store: Invoke deposit()
    
    rect rgb(240, 248, 255)
        note right of User: Pre-flight Checks
        Store->>Store: Check Terms Agreement
        Store->>Store: Check Allowance
        alt Allowance < Amount
            Store->>Source: Call approve()
            Source-->>Store: Tx Confirmed
        end
    end

    rect rgb(255, 250, 240)
        note right of User: Deposit Phase
        Store->>Source: Get Bridge Fee
        Store->>Source: Call deposit(domainId, resourceId, data)
        Source-->>Store: Tx Hash (PENDING)
        Store->>UI: Update History
        
        Store->>Source: Wait for 'Deposit' Event
        Source-->>Store: Event Emitted (depositNonce)
        Store->>UI: Update Status to AWAITING
    end

    rect rgb(240, 255, 240)
        note right of User: Validation Phase
        loop Polling every X seconds
            UI->>Server: GET /api/validator/proposal
            Server->>Dest: Contract.getProposal(...)
            Dest-->>Server: Status (1=Active, 3=Executed)
            Server-->>UI: Status
            
            alt Status == 3 (Executed)
                UI->>Store: Update Status to SUCCESS
                Note over UI: Bridge Complete
            end
        end
    end
```

### Data Construction
The bridge `deposit` function constructs a specific byte payload (`data`) required by the protocol. This is done in `stores/BridgeContract.ts`:

```typescript
const data = concat([
  // 1. Amount (32 bytes)
  zeroPadValue(toBeHex(parseUnits(amount, decimals)), 32),
  // 2. Recipient Length (32 bytes)
  zeroPadValue(toBeHex(20), 32),
  // 3. Recipient Address (20 bytes)
  zeroPadValue(recipient, 20),
]);
```

## 📂 Project Structure

```
w-bridge/
├── app/
│   ├── components/      # UI components (Bridge forms, History, Modals)
│   ├── composables/     # Shared logic (Wallet, Toasts, Formatters)
│   └── pages/           # Application routes (index.vue, history.vue)
├── server/
│   ├── api/             # Nitro event handlers
│   │   └── validator/   # Proposal status proxy
│   └── service/         # Server-side ethers logic
├── shared/              # Shared Types, ABIs, and Constants
│   ├── abi/             # Contract ABIs (Bridge, ERC20)
│   ├── contracts/       # Contract addresses registry
│   └── types/           # TypeScript interfaces
├── stores/              # Pinia State Management
│   ├── BridgeContract.ts # Core bridging logic
│   ├── BridgeStates.ts   # UI form state
│   └── Transaction.ts    # History persistence
├── nuxt.config.ts       # Nuxt configuration
└── package.json         # Dependencies & Scripts
```

## 🚀 Setup & Development

### Prerequisites
- Node.js (v18+)
- pnpm (v9+)

### Installation

```bash
# Install dependencies
pnpm install
```

### Running Locally

```bash
# Start development server
pnpm run dev
```
The application will be available at `http://localhost:3000`.

### Building for Production

```bash
# Build the application
pnpm run build

# Preview production build
pnpm run preview
```
