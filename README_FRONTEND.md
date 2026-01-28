# SPMB Frontend (Next.js)

## Setup Locally

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Configure Environment**:
    - Copy `.env.local.example` to `.env.local`.
    - Ensure `NEXT_PUBLIC_API_BASE_URL` points to your backend (default: `http://localhost:8000/api`).
3.  **Run Application**:
    ```bash
    npm run dev
    ```

## Integration Details

- The application uses a Zustand store defined in `src/lib/store.ts`.
- Data fetching is handled by `src/lib/api.ts` using the native Fetch API.
- All core entities (Sekolah, etc.) are fetched from the real backend.
