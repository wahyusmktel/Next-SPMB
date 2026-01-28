# SPMB Backend (FastAPI)

## Setup Locally

1.  **Requirement**: Python 3.9+ and MySQL server.
2.  **Create Virtual Environment**:
    ```bash
    python -m venv venv
    source venv/bin/activate  # venv\Scripts\activate on Windows
    ```
3.  **Install Dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
4.  **Configure Environment**:
    - Copy `.env.example` to `.env`.
    - Update `DATABASE_URL` with your MySQL credentials.
5.  **Run Migrations**:
    ```bash
    alembic upgrade head
    ```
6.  **Seed Data** (Optional):
    ```bash
    python app/db/seed.py
    ```
7.  **Run Application**:
    ```bash
    uvicorn app.main:app --reload
    ```

## API Endpoints

- Health Check: `GET /health`
- Sekolah: `GET /api/sekolah/`, `POST /api/sekolah/`, `GET /api/sekolah/{id}`
- Pendaftaran: `GET /api/pendaftaran/` (WIP)
