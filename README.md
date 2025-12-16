# Job Portal System

Proyek ini terdiri dari dua bagian utama:
1.  **Backend:** Menggunakan Python Pyramid.
2.  **Frontend:** Menggunakan React JS (Node).

## Struktur Proyek

| Folder/File | Keterangan | Teknologi |
| :--- | :--- | :--- |
| `backend/` | Kode sumber, logika bisnis, dan file konfigurasi (`development.ini`) untuk *API*. | Python Pyramid |
| `frontend/` | Kode sumber (`src/`), komponen, dan file konfigurasi untuk antarmuka pengguna. | React JS, Node |
| `requirements.txt` | Daftar semua *library* Python yang harus diinstal. | Python |
| `frontend/package.json` | Daftar semua paket Node/React yang harus diinstal. | Node |

---

##  How to run ? 

### A. Persiapan Awal

Pastikan sudah menginstal **Python 3.x** dan **Node.js/npm** (atau Yarn).

1.  **Clone:**
    ```bash
    git clone https://github.com/ebenlimbong/uas-paw-8-japri.git
    cd uas-paw-8-japri
    ```


### B. Menjalankan *Backend* (Python Pyramid)

Ini akan menyiapkan API Python di lingkungan virtual yang terisolasi.

#### 1. Membuat & Mengaktifkan Virtual Environment (`venv`)

Pastikan Anda berada di *root* proyek (`LIBRARY-SYSTEM`).

```bash
# Membuat venv
python3 -m venv venv

# Mengaktifkan venv:
# (Linux/macOS)
source venv/bin/activate

# (Windows Command Prompt)
venv\Scripts\activate
```

Pastikan sudah terlihat  ada venv di terminal 

2. **Menginstal Dependensi Python**
Gunakan file requirements.txt untuk menginstal semua library yang dibutuhkan:

```bash
(venv) pip install -r requirements.txt
```
3. **Menjalankan Server Backend**
Server Pyramid dijalankan dari folder backend/.

```bash

(venv) cd backend/

# Jalankan server. Default: http://localhost:6543/
(venv) pserve development.ini --reload
(Biarkan terminal ini tetap terbuka dan berjalan.)
```
### C. Menjalankan Frontend (React JS)
Buka terminal baru dan tidak berada di dalam venv.

1. **Installasi modul**
```bash

cd frontend
npm install

```
2. **Jalankan frontend**
```bash 
npm run dev
```
