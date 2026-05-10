# Miraj-IMS (Inventory Management System) 📦

**Miraj-IMS** is a professional-grade inventory tracking solution designed for small-to-mid-scale businesses. Architected with a "Tech-First" mindset, it focuses on **On-Premise Deployment**, providing businesses with 100% data ownership and zero monthly hosting overhead through containerization.

---

## 🏗️ Technical Architecture

The system is built using a modern, type-safe stack designed for reliability and scalability:

* **Backend:** Node.js & TypeScript (ESM)
* **ORM:** Prisma 7 (The latest in type-safe database access)
* **Database:** PostgreSQL 15
* **Infrastructure:** Docker & Docker Compose
* **API:** RESTful Architecture with Express

---

## 💻 Key Features

-   **Containerized Environment:** Fully isolated database infrastructure using Docker Compose.
-   **Relational Integrity:** Complex modeling for Products, Categories, and Stock Management.
-   **UUID Identification:** Collision-proof record tracking using UUID v4.
-   **Strict SKU Enforcement:** Unique constraint logic to ensure inventory accuracy and prevent duplicate stock entries.
-   **Automated Migrations:** Version-controlled database schema history to ensure consistency across environments.

---

## 🚀 Getting Started

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
* [Node.js (LTS)](https://nodejs.org/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mishrhm/Miraj-IMS.git
   cd miraj-ims
   ```

2. **Backend Setup:**

    ```bash
    cd backend
    npm install
    cp .env.example .env
    ```

3. **Infrastructure & Database:**

    ```bash
    # Start the Docker container from the backend folder
    npm run db:up

    # Run Prisma migrations to sync the schema
    npx prisma migrate dev --name init
    ```

4. **Run Development Server:**

    ```bash
    npm run dev
    ```

---

## 🛠️ Project Structure
```
miraj-ims/
├── backend/
│   ├── prisma/          # Schema definitions and SQL migrations
│   ├── src/             # TypeScript source (Controllers, Libs, Routes)
│   └── .env.example     # Environment template for secrets
├── frontend/            # React/Next.js Application (Upcoming)
└── docker-compose.yml   # Infrastructure as Code (PostgreSQL)
```

🛡️ Security & Privacy
This project is architected for local deployment. By hosting the database within a business's local area network (LAN), sensitive inventory and pricing data remain behind the company firewall, eliminating external points of failure.


## 👨‍💻 Author
### [Mish Rahman Jannah](https://github.com/mishrhm)
*Lead Software Engineer*
