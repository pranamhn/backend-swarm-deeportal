# Political Intelligence Deeportal

## 1. Overview

**Political Intelligence Deeportal** adalah modul data dan prediction layer untuk membaca karakter wilayah, kebutuhan publik, kekuatan elektoral historis, isu lokal, serta risiko sosial-politik secara **agregat wilayah**.

Modul ini dapat mendukung:

- Pemetaan demografi sampai desa/kelurahan jika data tersedia
- Analisis hasil pemilu historis
- Pemetaan daerah basis, kompetitif, dan swing
- Analisis isu lokal
- Political risk prediction
- Regulation impact analysis
- Regional stability signal
- Planning kampanye berbasis program dan isu masyarakat

Positioning:

> **Political Intelligence Deeportal helps candidates, parties, public policy teams, and civic organizations understand regional demographics, electoral history, public issues, and political risk using aggregated public data.**

---

## 2. Core Principle

Modul ini harus fokus pada **wilayah**, bukan individu.

### Allowed

```text
- Analisis agregat per provinsi/kabupaten/kota/kecamatan/desa/kelurahan
- Jumlah penduduk
- Umur, gender, pendidikan, pekerjaan agregat
- Hasil pemilu historis
- Turnout
- Vote share partai/kandidat
- Isu lokal
- Peta kebutuhan warga
- Program recommendation berbasis kebutuhan wilayah
```

### Avoid

```text
- Individual voter profiling
- Data NIK, nama, alamat detail, nomor KK
- Targeting individu berdasarkan agama, suku, atau preferensi politik
- Manipulative voter targeting
- Disinformation strategy
- Suppression strategy
- Segmentasi diskriminatif
```

Political Intelligence Deeportal harus menjadi alat untuk memahami kebutuhan masyarakat dan menyusun strategi program publik yang lebih relevan, bukan alat untuk manipulasi pemilih.

---

# 3. Data yang Bisa Diketahui Sampai Desa/Kelurahan

Tidak semua data tersedia lengkap sampai kelurahan/desa. Beberapa tersedia resmi, beberapa harus diproxy, dan beberapa hanya bisa digunakan sebagai agregat sensitif.

## 3.1 Data Availability Matrix

| Data | Level Desa/Kelurahan | Source | Notes |
|---|---:|---|---|
| Jumlah penduduk | Bisa | BPS SP2020, Dukcapil agregat, daerah | Baseline resmi bisa dari SP2020 dan data daerah |
| Gender | Bisa | BPS SP2020, Dukcapil agregat | Laki-laki/perempuan |
| Kelompok umur | Bisa/sebagian | BPS SP2020, Dukcapil agregat | Tergantung dataset dan wilayah |
| Pendidikan | Bisa/sebagian | Dukcapil agregat, BPS daerah, Satu Data daerah | Biasanya agregat |
| Pekerjaan | Bisa/sebagian | Dukcapil agregat, Podes, profil daerah | Cocok untuk pekerjaan mayoritas/proxy |
| Income langsung | Sulit | BPS Susenas, daerah, proxy | Umumnya tidak tersedia langsung per kelurahan |
| Income proxy | Bisa | Kemiskinan, pengeluaran, pekerjaan, pendidikan, infrastruktur | Pakai estimasi kategori |
| Suku/etnis | Terbatas dan sensitif | Publikasi sensus tertentu | Jangan gunakan untuk targeting individu |
| Agama | Bisa di agregat tertentu | Dukcapil agregat/daerah | Gunakan sebagai konteks agregat saja |
| Hasil pemilu | Bisa | KPU | Bisa dihitung dari TPS lalu diagregasi ke kelurahan/desa |
| Kecenderungan partai | Bisa dihitung | KPU historical election result | Berdasarkan vote share historis, bukan preferensi individu |
| Isu lokal | Bisa | Podes, berita lokal, social listening, musrenbang/RPJMD | Perlu klasifikasi isu |
| DPT | Bisa | KPU / data.go.id | Untuk total pemilih dan komposisi jika tersedia |
| TPS | Bisa | KPU / Info Pemilu | Untuk agregasi hasil pemilu |

---

# 4. Main Data Sources dan Cara Mendapatkannya

## 4.1 KPU Open Data

### URL

```text
https://opendata.kpu.go.id/
```

### Data yang Bisa Didapat

```text
- Data pemilu
- Data pilkada
- Data DPT
- Data wilayah pemilihan
- Data peserta pemilu
- Data hasil pemilihan
- Data visualisasi
```

### Fungsi untuk Deeportal

```text
- historical vote share
- party strength by region
- candidate strength
- turnout analysis
- swing area analysis
- constituency mapping
- DPT analysis
```

### Cara Mendapatkan

```text
1. Buka https://opendata.kpu.go.id/
2. Masuk ke menu Dataset
3. Cari keyword:
   - hasil pemilu
   - hasil pemilihan
   - DPT
   - DPRD
   - pilkada
   - perolehan suara
   - daerah pemilihan
4. Download resource dalam format CSV/XLS/XLSX/JSON jika tersedia
5. Simpan metadata:
   - title
   - organization
   - year
   - election type
   - source URL
   - downloaded_at
6. Normalize:
   - kode wilayah
   - nama wilayah
   - partai/kandidat
   - jumlah suara
   - total suara sah
   - turnout
```

---

## 4.2 KPU Info Pemilu / Portal Publikasi

### URL

```text
https://infopemilu.kpu.go.id/
```

### Data yang Bisa Didapat

```text
- Hasil TPS
- Formulir hasil penghitungan suara
- Data pemilu/pemilihan berdasarkan wilayah
- Informasi peserta pemilu
- Informasi dapil
```

### Fungsi untuk Deeportal

```text
- mengambil hasil TPS
- agregasi TPS ke desa/kelurahan
- menghitung vote share partai/kandidat
- mapping TPS
- turnout per area
```

### Cara Mendapatkan

```text
1. Buka https://infopemilu.kpu.go.id/
2. Pilih jenis pemilu/pemilihan
3. Pilih wilayah:
   - provinsi
   - kabupaten/kota
   - kecamatan
   - desa/kelurahan
   - TPS
4. Ambil data hasil:
   - suara paslon
   - suara partai
   - suara calon legislatif jika tersedia
   - DPT
   - pengguna hak pilih
   - suara sah/tidak sah
5. Simpan raw response / halaman / file sumber
6. Agregasi ke level yang dibutuhkan
```

### Suggested Aggregation

```text
TPS
  ↓
Kelurahan / Desa
  ↓
Kecamatan
  ↓
Kabupaten / Kota
  ↓
Dapil
```

---

## 4.3 BPS Sensus Penduduk 2020

### URL

```text
https://sensus.bps.go.id/main/index/sp2020
```

### Dataset Page

```text
https://sensus.bps.go.id/topik/dataset/sp2020/9
```

### Data yang Bisa Didapat

```text
- Jumlah penduduk menurut wilayah
- Jenis kelamin
- Kelompok umur
- Klasifikasi generasi
- Kesesuaian alamat KK dengan domisili
- Penduduk pindah menurut wilayah dan jenis kelamin
```

### Fungsi untuk Deeportal

```text
- baseline populasi per wilayah
- pemilih muda proxy
- usia produktif proxy
- gender composition
- urban/rural demographic mapping
- market size estimation
```

### Cara Mendapatkan

```text
1. Buka portal Sensus BPS
2. Pilih topik Sensus Penduduk 2020
3. Masuk ke dataset jumlah dan distribusi penduduk
4. Pilih dataset:
   - jumlah penduduk menurut wilayah dan jenis kelamin
   - jumlah penduduk menurut wilayah, kelompok umur, dan jenis kelamin
   - jumlah penduduk menurut klasifikasi generasi
5. Download / copy table / gunakan API jika tersedia
6. Normalize kode wilayah
```

### Useful Fields

```text
region_code
region_name
male_population
female_population
total_population
age_group
generation_classification
year
source_url
```

---

## 4.4 BPS Podes — Potensi Desa

### URL

```text
https://www.bps.go.id
```

### Example Publication

```text
Statistik Potensi Desa Indonesia 2024
```

### Data yang Bisa Mendukung Political Intelligence

```text
- Infrastruktur dasar
- Fasilitas pendidikan
- Fasilitas kesehatan
- Akses internet/telekomunikasi
- Transportasi
- Ekonomi lokal
- Pasar dan lembaga ekonomi
- Kerawanan/tantangan wilayah
- Bencana
- Keamanan
- Pemerintahan desa/kelurahan
```

### Fungsi untuk Deeportal

```text
- local issue mapping
- village development profile
- public service gap analysis
- infrastructure issue
- regional stability signal
- campaign program planning
```

### Cara Mendapatkan

```text
1. Buka bps.go.id
2. Cari publikasi Statistik Potensi Desa Indonesia
3. Download PDF/Excel jika tersedia
4. Cari publikasi Podes per provinsi/kabupaten jika perlu granularitas lebih dalam
5. Extract table dari PDF/XLSX
6. Normalize ke master wilayah
```

### Political Use

```text
Issue Priority Score:
- jalan/infrastruktur
- kesehatan
- pendidikan
- internet
- ekonomi lokal
- keamanan
- bencana
```

---

## 4.5 Dukcapil / Kemendagri Aggregated Data

### URL

```text
https://dukcapil.kemendagri.go.id/
https://pelita.kemendagri.go.id/kemendagri/dataset
```

### Data yang Mungkin Didapat

```text
- Penduduk berdasarkan wilayah
- Status kawin
- Pekerjaan
- Pendidikan
- Agama/kepercayaan
- Kelompok umur
- Jenis kelamin
- Kepala keluarga
```

### Cara Mendapatkan

#### Option A — Public Aggregated Dataset

```text
1. Buka portal PELITA Kemendagri
2. Filter instansi Direktorat Jenderal Kependudukan dan Pencatatan Sipil
3. Cari dataset:
   - data agregat status kawin pekerjaan
   - data agregat status kawin agama
   - pendidikan
   - kelompok umur
   - pekerjaan
4. Download resource jika tersedia
5. Simpan hanya dalam bentuk agregat
```

#### Option B — Portal Disdukcapil Daerah

```text
1. Cari: Disdukcapil [nama daerah] data agregat kependudukan
2. Cari: Profil Perkembangan Kependudukan
3. Download PDF/XLSX
4. Extract data agregat
```

#### Option C — Official Cooperation

```text
Untuk akses lebih lengkap, lakukan kerja sama resmi dan gunakan data agregat/anonymized saja.
```

### Strict Privacy Rule

Do not ingest:

```text
- NIK
- nama
- alamat lengkap
- nomor KK
- nomor telepon
- data personal individu
```

Only ingest:

```text
- aggregated by region
- aggregated by age group
- aggregated by occupation
- aggregated by education
- aggregated by religion/status
```

---

## 4.6 Satu Data Indonesia

### URL

```text
https://data.go.id/
```

### Dataset yang Berguna

```text
- DPT
- wilayah pemilihan
- kependudukan
- pendidikan
- kesehatan
- kemiskinan
- tenaga kerja
- bantuan sosial
- infrastruktur
- UMKM
- transportasi
```

### Cara Mendapatkan

```text
1. Buka https://data.go.id/
2. Search keyword:
   - DPT
   - pemilu
   - penduduk
   - kemiskinan
   - pengangguran
   - pendidikan
   - kesehatan
   - infrastruktur
   - desa
3. Download resource
4. Simpan metadata dan source URL
5. Normalize wilayah
```

---

## 4.7 Open Data Daerah

### Example Portals

```text
https://data.jakarta.go.id
https://opendata.jabarprov.go.id
https://satudata.jatengprov.go.id
https://satudata.jatimprov.go.id
https://satudata.baliprov.go.id
```

### Data yang Bisa Didapat

```text
- Data penduduk
- Pendidikan
- Fasilitas kesehatan
- UMKM
- Kemiskinan
- Pengangguran
- Bantuan sosial
- Transportasi
- Infrastruktur
- Data kelurahan/desa
```

### Cara Mendapatkan

```text
1. Cari portal open data daerah
2. Search keyword lokal:
   - penduduk kelurahan
   - pekerjaan
   - pendidikan
   - kemiskinan
   - fasilitas kesehatan
   - sekolah
   - UMKM
   - jalan rusak
3. Download CSV/XLSX/JSON
4. Normalize ke region master
```

---

# 5. Core Data Layers

## 5.1 Region Master

```text
country
province
regency/city
district/kecamatan
village/kelurahan/desa
TPS
dapil
```

Required fields:

```text
region_code
bps_code
kemendagri_code
kpu_code
region_name
region_level
parent_region_code
province_name
city_name
district_name
village_name
geometry
latitude
longitude
```

---

## 5.2 Demographic Profile

```text
- total population
- male population
- female population
- age groups
- productive age
- youth voter proxy
- elderly group
- education level
- occupation group
- marital status
- religion aggregate if legally available
```

---

## 5.3 Socioeconomic Profile

```text
- income proxy
- poverty proxy
- unemployment proxy
- informal worker proxy
- household welfare proxy
- education score
- infrastructure score
- public service score
- digital access score
```

---

## 5.4 Electoral Profile

```text
- historical vote share
- dominant party
- dominant candidate
- runner-up
- turnout
- invalid vote
- margin
- swing index
- volatility index
- party loyalty score
- candidate loyalty score
```

---

## 5.5 Local Issue Profile

```text
- infrastructure issue
- flood/disaster issue
- education access
- healthcare access
- unemployment
- poverty
- public safety
- cost of living
- transport
- land/housing
- agriculture
- MSME/economy
```

---

# 6. Scoring Framework

## 6.1 Political Region Score

```text
Political Region Score =
Demographic Fit
+ Electoral Opportunity
+ Issue Alignment
+ Turnout Opportunity
+ Local Network Potential
- Political Risk
```

---

## 6.2 Dominant Party Score

```text
party_vote_share =
party_votes / total_valid_votes

dominant_party =
party with highest party_vote_share
```

Category:

```text
Stronghold:
- winning party vote share > 45%
- or margin > 20%

Competitive:
- margin between first and second < 10%

Swing:
- winner changes across election cycles

Low Turnout Opportunity:
- turnout below regional average

High Fragmentation:
- top 3 parties have similar share
```

---

## 6.3 Swing Index

```text
swing_index =
change in winner
+ change in vote share
+ change in turnout
+ margin volatility
```

Interpretation:

```text
0-30   = stable area
31-60  = competitive area
61-100 = swing area
```

---

## 6.4 Turnout Opportunity Score

```text
turnout_gap =
regional_average_turnout - area_turnout

turnout_opportunity =
higher if turnout_gap is large
```

Use this for civic engagement and get-out-the-vote planning, not voter suppression.

---

## 6.5 Issue Priority Score

```text
issue_priority_score =
podes_issue_signal
+ local_news_signal
+ social_sentiment_signal
+ public_service_gap
+ socioeconomic_pressure
```

Example:

```text
Kelurahan A:
- unemployment issue: high
- flood issue: medium
- healthcare issue: low
- education issue: medium
```

---

## 6.6 Income Proxy

Direct income per kelurahan is usually not available. Use proxy:

```text
income_proxy =
expenditure_per_capita
+ poverty_rate
+ occupation_mix
+ education_level
+ housing_condition
+ infrastructure_quality
+ local minimum wage
+ economic facility availability
```

Categories:

```text
lower_income
middle_low
middle
middle_high
mixed_income
```

Never present proxy as exact personal income.

---

# 7. Political Intelligence Outputs

## 7.1 Kelurahan Profile Card

```text
Kelurahan: Example
Kecamatan: Example
Kab/Kota: Example

Population:
- Total: 24,500
- Productive Age: 68%
- Youth Voter Proxy: 22%
- Gender Balance: 51% male / 49% female

Socioeconomic:
- Income Proxy: middle-low
- Occupation Majority: informal worker / service worker
- Education Dominant: senior high school
- Public Service Gap: medium

Electoral:
- Dominant Party: Party A
- Vote Share: 38%
- Runner Up: Party B, 31%
- Margin: 7%
- Turnout: 72%
- Type: Competitive / Swing

Local Issues:
1. Jobs and income
2. Road and flood control
3. Healthcare access

Recommendation:
Focus public program on jobs, MSME support, flood mitigation, and affordable basic services.
```

---

## 7.2 Dapil Map Output

```text
Dapil Intelligence

Dapil: DPRD Kota Example Dapil 3

Area Type:
- 35% stronghold opponent
- 40% competitive
- 25% low-turnout opportunity

Top Issues:
1. Jobs
2. Infrastructure
3. Cost of living

Recommended Strategy:
- Prioritize competitive kelurahan
- Build program around jobs and infrastructure
- Avoid divisive identity-based messaging
- Strengthen volunteer network in low-turnout areas through civic engagement
```

---

## 7.3 Candidate Support Map

Allowed output:

```text
- wilayah basis historis
- wilayah kompetitif
- wilayah swing
- isu publik utama
- turnout opportunity
- program recommendation
```

Avoid output:

```text
- daftar individu yang kemungkinan memilih kandidat
- targeting berdasarkan suku/agama secara personal
- cara memanipulasi kelompok tertentu
```

---

# 8. Database Schema

## 8.1 political_regions

```sql
CREATE TABLE political_regions (
  id UUID PRIMARY KEY,
  region_code VARCHAR(50),
  bps_code VARCHAR(50),
  kemendagri_code VARCHAR(50),
  kpu_code VARCHAR(50),
  region_name TEXT,
  region_level VARCHAR(50), -- province, city, district, village, tps, dapil
  parent_region_code VARCHAR(50),
  province_name TEXT,
  city_name TEXT,
  district_name TEXT,
  village_name TEXT,
  dapil_name TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  geom GEOMETRY,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## 8.2 demographic_profiles

```sql
CREATE TABLE demographic_profiles (
  id UUID PRIMARY KEY,
  region_code VARCHAR(50),
  year INT,
  total_population BIGINT,
  male_population BIGINT,
  female_population BIGINT,
  productive_age_population BIGINT,
  youth_population BIGINT,
  elderly_population BIGINT,
  dominant_education TEXT,
  dominant_occupation TEXT,
  religion_aggregate JSONB,
  source_name TEXT,
  source_url TEXT,
  data_quality_score NUMERIC,
  fetched_at TIMESTAMP
);
```

---

## 8.3 socioeconomic_profiles

```sql
CREATE TABLE socioeconomic_profiles (
  id UUID PRIMARY KEY,
  region_code VARCHAR(50),
  year INT,
  income_proxy VARCHAR(50),
  poverty_proxy NUMERIC,
  unemployment_proxy NUMERIC,
  informal_worker_proxy NUMERIC,
  education_score NUMERIC,
  infrastructure_score NUMERIC,
  public_service_score NUMERIC,
  digital_access_score NUMERIC,
  source_name TEXT,
  source_url TEXT,
  data_quality_score NUMERIC,
  fetched_at TIMESTAMP
);
```

---

## 8.4 election_results

```sql
CREATE TABLE election_results (
  id UUID PRIMARY KEY,
  election_year INT,
  election_type VARCHAR(100), -- pilpres, pileg_dpr, pileg_dprd_prov, pileg_dprd_kabkota, pilkada
  region_code VARCHAR(50),
  tps_code VARCHAR(50),
  dapil_code VARCHAR(50),
  party_id VARCHAR(50),
  party_name TEXT,
  candidate_id VARCHAR(50),
  candidate_name TEXT,
  votes BIGINT,
  total_valid_votes BIGINT,
  total_invalid_votes BIGINT,
  dpt BIGINT,
  turnout BIGINT,
  vote_share NUMERIC,
  rank INT,
  source_name TEXT,
  source_url TEXT,
  fetched_at TIMESTAMP
);
```

---

## 8.5 political_scores

```sql
CREATE TABLE political_scores (
  id UUID PRIMARY KEY,
  region_code VARCHAR(50),
  election_year INT,
  dominant_party TEXT,
  dominant_candidate TEXT,
  dominant_party_vote_share NUMERIC,
  runner_up_party TEXT,
  runner_up_vote_share NUMERIC,
  margin NUMERIC,
  turnout_rate NUMERIC,
  swing_index NUMERIC,
  fragmentation_index NUMERIC,
  stronghold_score NUMERIC,
  competitive_score NUMERIC,
  turnout_opportunity_score NUMERIC,
  issue_alignment_score NUMERIC,
  political_risk_score NUMERIC,
  created_at TIMESTAMP
);
```

---

## 8.6 local_issues

```sql
CREATE TABLE local_issues (
  id UUID PRIMARY KEY,
  region_code VARCHAR(50),
  issue_category VARCHAR(100),
  issue_name TEXT,
  issue_score NUMERIC,
  evidence JSONB,
  source_name TEXT,
  source_url TEXT,
  year INT,
  fetched_at TIMESTAMP
);
```

---

## 8.7 political_data_sources

```sql
CREATE TABLE political_data_sources (
  id UUID PRIMARY KEY,
  source_name TEXT,
  organization TEXT,
  source_type VARCHAR(50), -- api, csv, xlsx, pdf, html, manual
  source_url TEXT,
  data_category TEXT,
  geography_level TEXT,
  update_frequency TEXT,
  license TEXT,
  reliability_score NUMERIC,
  last_checked_at TIMESTAMP,
  status VARCHAR(50)
);
```

---

# 9. ETL Pipeline

## 9.1 Data Ingestion

```text
KPU data fetcher
BPS SP2020 fetcher
BPS Podes parser
Dukcapil aggregate parser
Satu Data catalog crawler
Open Data daerah crawler
PDF table extractor
XLSX/CSV normalizer
```

---

## 9.2 Normalization

```text
1. Standardize region name
2. Map BPS code
3. Map Kemendagri code
4. Map KPU code
5. Create TPS-to-kelurahan mapping
6. Aggregate TPS results to kelurahan
7. Aggregate kelurahan to kecamatan/dapil
8. Calculate vote share
9. Calculate turnout
10. Generate political scores
```

---

## 9.3 Data Quality Score

```text
data_quality_score =
source_reliability
+ update_recency
+ geographic_granularity
+ schema_consistency
+ completeness
+ legal_safety
```

Example:

| Source | Reliability | Recency | Granularity | Score |
|---|---:|---:|---:|---:|
| KPU official | 95 | 85 | 90 | 90 |
| BPS SP2020 | 95 | 70 | 85 | 85 |
| BPS Podes | 95 | 90 | 90 | 90 |
| Dukcapil aggregate | 90 | 95 | 85 | 90 |
| Open Data daerah | 75 | 70 | 75 | 73 |
| Social sentiment | 60 | 95 | 60 | 65 |

---

# 10. API Design

## 10.1 Get Political Region Profile

```http
GET /api/political/regions/{region_code}/profile
```

Response:

```json
{
  "region_code": "example",
  "region_name": "Kelurahan Example",
  "level": "kelurahan",
  "demographic": {
    "population": 24500,
    "productive_age_ratio": 0.68,
    "dominant_occupation": "informal_worker",
    "income_proxy": "middle_low"
  },
  "electoral": {
    "dominant_party": "Party A",
    "vote_share": 0.38,
    "runner_up": "Party B",
    "margin": 0.07,
    "turnout_rate": 0.72,
    "area_type": "competitive"
  },
  "issues": [
    "jobs",
    "infrastructure",
    "flood"
  ]
}
```

---

## 10.2 Get Electoral Map

```http
GET /api/political/maps/electoral?election_year=2024&election_type=pileg_dprd&level=kelurahan
```

Response:

```json
{
  "map_type": "electoral",
  "level": "kelurahan",
  "items": [
    {
      "region_code": "example",
      "dominant_party": "Party A",
      "vote_share": 0.38,
      "margin": 0.07,
      "area_type": "competitive"
    }
  ]
}
```

---

## 10.3 Analyze Dapil

```http
POST /api/political/dapil/analyze
```

Request:

```json
{
  "dapil": "DPRD Kota Example Dapil 3",
  "candidate_profile": {
    "party": "Party A",
    "focus_issues": ["jobs", "infrastructure", "healthcare"]
  }
}
```

Response:

```json
{
  "dapil_score": 76,
  "stronghold_areas": ["Kelurahan A", "Kelurahan B"],
  "competitive_areas": ["Kelurahan C", "Kelurahan D"],
  "low_turnout_areas": ["Kelurahan E"],
  "top_issues": ["jobs", "infrastructure", "cost_of_living"],
  "recommended_programs": [
    "MSME support",
    "job training",
    "flood mitigation"
  ]
}
```

---

## 10.4 Generate Campaign Issue Plan

```http
POST /api/political/issue-plan
```

Request:

```json
{
  "region_codes": ["kel_1", "kel_2"],
  "election_type": "pilkada",
  "candidate_positioning": "economic development and public service improvement"
}
```

Response:

```json
{
  "main_issues": [
    "jobs",
    "public transport",
    "healthcare access"
  ],
  "program_recommendations": [
    "local job center",
    "MSME assistance",
    "clinic service improvement"
  ],
  "communication_guidelines": [
    "focus on public benefit",
    "avoid identity-based messaging",
    "cite local data"
  ]
}
```

---

# 11. Dashboard Plan

## 11.1 Political Map Dashboard

Features:

```text
- map by kelurahan/desa
- dominant party color
- vote share
- turnout
- swing index
- competitive area
- issue priority
- demographic overlay
```

---

## 11.2 Dapil Intelligence Dashboard

```text
Dapil Summary
- total population
- estimated voter base
- number of TPS
- dominant parties
- competitive kelurahan
- low turnout kelurahan
- top local issues
- recommended visit priority
```

---

## 11.3 Kelurahan Intelligence Card

```text
Kelurahan Profile
- demographics
- occupation majority
- education
- income proxy
- election history
- party strength
- issue priority
- recommended program
```

---

## 11.4 Scenario Simulation

Example:

```text
What if candidate focuses on jobs and MSME program?
What if turnout increases 5% in competitive areas?
What if opponent gains 10% in stronghold area?
What if flood issue becomes viral before election?
```

Output:

```text
- potential vote impact range
- affected regions
- risk level
- recommended public response
```

---

# 12. MVP Roadmap

## Phase 1 — Data Foundation

```text
- Region master
- KPU historical election data
- BPS SP2020 demographic baseline
- Podes issue/infrastructure data
- Basic kelurahan profile
```

## Phase 2 — Electoral Intelligence

```text
- TPS to kelurahan aggregation
- party vote share
- candidate vote share
- turnout
- dominant party
- swing index
- stronghold/competitive/swing classification
```

## Phase 3 — Demographic & Issue Layer

```text
- pekerjaan mayoritas
- pendidikan mayoritas
- income proxy
- local issue score
- public service gap
- regional stability signal
```

## Phase 4 — Campaign Planning Layer

```text
- dapil analysis
- visit priority
- program recommendation
- issue-based communication guide
- campaign calendar support
```

## Phase 5 — Prediction & Simulation

```text
- turnout scenario
- issue impact simulation
- political risk prediction
- election sentiment dashboard
- polling/social sentiment integration
```

---

# 13. MVP Dataset Checklist

## KPU

```text
[ ] DPT per wilayah
[ ] TPS data
[ ] Hasil pilpres
[ ] Hasil DPR RI
[ ] Hasil DPRD Provinsi
[ ] Hasil DPRD Kabupaten/Kota
[ ] Hasil pilkada
[ ] Data dapil
[ ] Data peserta pemilu
```

## BPS

```text
[ ] SP2020 jumlah penduduk
[ ] SP2020 gender
[ ] SP2020 kelompok umur
[ ] Podes infrastructure
[ ] Podes local challenge
[ ] Podes economic facility
[ ] Podes education facility
[ ] Podes health facility
```

## Dukcapil Aggregated

```text
[ ] Penduduk by umur
[ ] Penduduk by gender
[ ] Penduduk by pekerjaan
[ ] Penduduk by pendidikan
[ ] Penduduk by status kawin
[ ] Penduduk by agama/kepercayaan, aggregated only
```

## Satu Data / Open Data Daerah

```text
[ ] Kemiskinan
[ ] Pengangguran
[ ] Pendidikan
[ ] Kesehatan
[ ] Infrastruktur
[ ] UMKM
[ ] Transportasi
[ ] Bansos aggregated if legal and available
```

---

# 14. Guardrails

## 14.1 Safe Political Intelligence

Allowed outputs:

```text
- wilayah basis historis
- wilayah kompetitif
- turnout opportunity
- issue priority
- program recommendation
- public service gap
- regional risk
- aggregated demographic insight
```

## 14.2 Unsafe Political Intelligence

Avoid outputs:

```text
- “target orang dengan agama X”
- “gunakan isu suku untuk memenangkan suara”
- “cara menurunkan turnout lawan”
- “daftar individu yang bisa dipengaruhi”
- “pesan manipulatif untuk kelompok rentan”
- “profil preferensi politik personal”
```

## 14.3 Recommended Product Disclaimer

```text
Political Intelligence Deeportal uses aggregated public data and historical election results to support civic planning, public program development, and regional analysis. It does not provide individual voter profiling, guaranteed election outcomes, or manipulative campaign targeting.
```

---

# 15. Example Final Output

```text
Political Intelligence Report

Region:
Kecamatan Example, Kabupaten Example

Summary:
The area is politically competitive with moderate turnout and high sensitivity toward jobs, cost of living, and infrastructure issues.

Demographic:
- Productive age population: high
- Dominant occupation: informal and service workers
- Income proxy: middle-low
- Education: senior high school dominant

Electoral:
- Dominant party: Party A
- Vote share: 36%
- Runner-up: Party B, 31%
- Margin: 5%
- Turnout: 71%
- Classification: Swing / Competitive

Top Issues:
1. Jobs
2. Road and flood infrastructure
3. Basic health service
4. Cost of living

Recommended Public Program:
- Local job center
- MSME support
- Flood mitigation
- Affordable healthcare access
- Transparent public service dashboard

Campaign Guidance:
Use inclusive issue-based messaging. Avoid identity-based targeting. Focus on local problems, public services, and measurable programs.
```

---

# 16. Initial Build Recommendation

Untuk build awal Deeportal Political Intelligence, prioritaskan:

```text
1. KPU historical election result
2. BPS SP2020 demographic baseline
3. BPS Podes local issue/infrastructure data
4. Dukcapil aggregate data jika tersedia legal
5. Satu Data/Open Data daerah untuk pelengkap
6. Region code mapping BPS-Kemendagri-KPU
7. Kelurahan profile card
8. Dapil map dashboard
```

---

# 17. Summary

Political Intelligence Deeportal bisa dibuat sampai level desa/kelurahan jika data tersedia, terutama untuk:

```text
- demografi dasar
- pekerjaan agregat
- pendidikan agregat
- hasil pemilu historis
- kecenderungan partai berbasis vote share
- turnout
- swing area
- isu lokal
- public service gap
```

Data yang perlu diperlakukan hati-hati:

```text
- agama
- suku/etnis
- preferensi politik
- income personal
```

Best practice:

> Build a region-level political intelligence system using aggregated public data, historical election results, and local issue mapping — not individual voter profiling.

---

# 16. Implementation Summary — What Can Be Built Now

## ✅ Ready to Implement (Data Available)

| # | Feature | Data Source | How to Get | Effort |
|---|---------|-------------|------------|--------|
| 1 | **Database Schema** (7 tables) | — | Drizzle ORM / SQLAlchemy | 2 jam |
| 2 | **KPU Election Results** | [kpu.go.id](https://kpu.go.id) | Download CSV per TPS, aggregate to kelurahan | 4 jam |
| 3 | **BPS Population Data** | [webapi.bps.go.id](https://webapi.bps.go.id) | API key (free, register online) | 2 jam |
| 4 | **Region Master** (province→village) | BPS, [data.go.id](https://data.go.id) | Download kode wilayah | 1 jam |
| 5 | **Political Scoring Engine** | Calculated from DB | 5 scores: political_region, dominant_party, swing_index, turnout, issue_priority | 3 jam |
| 6 | **API Endpoints** (4 core) | — | Flask/Express routes | 3 jam |
| 7 | **Dapil Analysis** | KPU + BPS combined | Join election results with population data | 4 jam |
| 8 | **Kelurahan Profile Card** | BPS + KPU + Podes | Aggregate all sources per kelurahan | 3 jam |

## ⏳ Needs Data Acquisition

| # | Feature | Data Source | How to Get | Blocker |
|---|---------|-------------|------------|---------|
| 9 | **Podes (Village Potential)** | BPS Podes | Purchase/request from BPS | Cost ~Rp 500K-2M |
| 10 | **Dukcapil Aggregate** | Dukcapil Kemendagri | Formal request letter | Bureaucratic process |
| 11 | **Local Issue Mapping** | News scraping + Podes | Combine Podes data + news API | Podes data needed |
| 12 | **Socioeconomic per Kelurahan** | BPS Susenas | Microdata request | Restricted access |

## ❌ Should NOT Be Built

| # | Feature | Reason |
|---|---------|--------|
| — | Individual voter profiling | Privacy violation |
| — | Religion/ethnicity targeting | Discriminatory, unethical |
| — | Disinformation strategy tools | Harmful to democracy |
| — | Voter suppression tools | Illegal |

---

# 17. How to Get the Data

## Priority 1 — Free & Immediate (No Bureaucracy)

| Source | URL | What You Get | How |
|--------|-----|-------------|-----|
| **KPU Open Data** | https://kpu.go.id | Election results per TPS (2024, 2019, 2014) | Download CSV/PDF, parse, aggregate to kelurahan |
| **BPS WebAPI** | https://webapi.bps.go.id | Population, density, HDI, poverty | Register free, get API key, call endpoints |
| **Satu Data Indonesia** | https://data.go.id | Cross-ministry datasets | Search, download CSV/JSON |
| **Open Data Daerah** | https://data.jakarta.go.id, https://opendata.jabarprov.go.id | Regional demographic data | Download per province |

## Priority 2 — Free but Needs Process

| Source | What You Get | How |
|--------|-------------|-----|
| **BPS SP2020** | Census population data per desa/kelurahan | Download publikasi, manual parse |
| **KPU Info Pemilu** | Dapil boundaries, candidate lists | Portal publikasi, manual download |
| **GeoBoundaries** | Administrative boundaries GeoJSON | Free download from geoboundaries.org |

## Priority 3 — Paid or Bureaucratic

| Source | What You Get | How | Cost |
|--------|-------------|-----|------|
| **BPS Podes** | Village potential (infrastructure, issues, facilities) | Purchase from BPS | ~Rp 500K-2M |
| **Dukcapil Aggregate** | Administrative population data | Formal request to Kemendagri | Free (bureaucratic) |
| **BPS Susenas** | Socioeconomic microdata | Request access | Free (restricted) |

## Quick Start — Get Data in 1 Hour

```bash
# 1. Register BPS API (5 min)
#    https://webapi.bps.go.id/developer/

# 2. Download KPU election results (10 min)
#    https://kpu.go.id → Hasil Pemilu → Download CSV

# 3. Download region codes (5 min)
#    https://data.go.id → search "kode wilayah"

# 4. Parse + load to database (40 min)
#    python scripts/ingest_kpu.py
#    python scripts/ingest_bps.py
```

---

# 18. Development TODOs Checklist

Status: `[ ]` = not started, `[~]` = in progress, `[x]` = done

## 🗄️ Database (backend-deeportal)

```text
[x] 18.1 Political DB Schema ✅ DONE
    - holdco/political_schema.py — 8 tables ✅ — holdco/political_schema.py
    - political_regions (kode_bps, name, level, parent_id, dapil_code)
    - demographic_profiles (region_id, total_pop, male, female, age_groups)
    - socioeconomic_profiles (region_id, poverty, unemployment, hdi, expenditure)
    - election_results (region_id, year, type, party, candidate, votes, pct)
    - political_scores (region_id, score_type, score, confidence)
    - local_issues (region_id, issue_type, description, severity, source)
    - political_data_sources (catalog with freshness + quality)
    - Estimated: ~150 lines

[x] 18.2 KPU Ingestion ✅ DONE
    - scripts/ingest_kpu.py — parse KPU CSV, aggregate TPS → kelurahan ✅ — scripts/ingest_kpu.py
    - Parse KPU CSV per TPS
    - Aggregate TPS → kelurahan → kecamatan → kabupaten
    - Store in election_results table
    - Handle multiple election years (2024, 2019, 2014)
    - Estimated: ~200 lines

[x] 18.3 BPS Ingestion ✅ DONE
    - scripts/ingest_bps.py — fetch BPS WebAPI → DB ✅ — scripts/ingest_bps.py
    - Call BPS WebAPI for population + socioeconomic data
    - Map BPS variable IDs to schema columns
    - Store in demographic_profiles + socioeconomic_profiles
    - Rate limit handling
    - Estimated: ~150 lines
```

## ⚙️ API (backend-deeportal)

```text
[x] 18.4 Political API Routes ✅ DONE
    - orchestrator/routes/political_routes.py — 5 endpoints ✅ — orchestrator/routes/political_routes.py
    - GET /api/v1/political/regions/<code>/profile — full political profile
    - GET /api/v1/political/maps/electoral — electoral map data
    - POST /api/v1/political/dapil/analyze — dapil analysis
    - POST /api/v1/political/issue-plan — campaign issue recommendations
    - GET /api/v1/political/scores/<region_code> — political scores
    - Estimated: ~250 lines

[x] 18.5 Political Scoring Engine ✅ DONE
    - holdco/political_scoring.py — 5 scoring functions ✅ — holdco/political_scoring.py
    - political_region_score (weighted: demographic + socioeconomic + electoral)
    - dominant_party_score (vote share history + trend)
    - swing_index (volatility of past 3 elections)
    - turnout_opportunity_score (gap between registered and actual voters)
    - issue_priority_score (local issues weighted by severity + population)
    - Estimated: ~200 lines
```

## 🖥️ Frontend (frontend-deeportal)

```text
[x] 18.6 Political Dashboard ✅ DONE
    - app/(marketing)/political/page.tsx ✅ — app/(marketing)/political/page.tsx
    - Overview stats (regions covered, elections tracked, data freshness)
    - Quick region search
    - Top swing regions cards
    - Estimated: ~150 lines

[x] 18.7 Region Political Profile ✅ DONE
    - app/(marketing)/political/[regionCode]/page.tsx ✅ — app/(marketing)/political/[regionCode]/page.tsx
    - Demographics summary
    - Electoral history chart (vote share per party per election)
    - Political scores visualization
    - Local issues list
    - Data sources + freshness badge
    - Estimated: ~200 lines

[x] 18.8 Dapil Analysis ✅ DONE
    - app/(marketing)/political/dapil/page.tsx ✅ — app/(marketing)/political/dapil/page.tsx
    - Dapil selector
    - Multi-region comparison table
    - Swing index visualization
    - Winner margin analysis
    - Estimated: ~180 lines

[x] 18.9 Political API Service ✅ DONE
    - lib/api/politicalService.ts — 5 functions ✅ — lib/api/politicalService.ts
    - getRegionPoliticalProfile(regionCode)
    - getElectoralMap(electionYear, electionType, level)
    - analyzeDapil(dapilCode)
    - generateIssuePlan(regionCode, topics)
    - getPoliticalScores(regionCode)
    - Estimated: ~100 lines

[x] 18.10 Frontend Types ✅ DONE
    - types/political.ts — 8 types ✅ — types/political.ts
    - PoliticalRegion, DemographicProfile, SocioeconomicProfile
    - ElectionResult, PoliticalScore, LocalIssue
    - DapilAnalysis, IssuePlan, ElectoralMap
    - Estimated: ~80 lines
```

## 🔄 Swarm Integration (backend-swarm-deeportal)

```text
[x] 18.11 Political Prediction Types — types/swarm.ts ✅ ALREADY DONE
    - political_risk, regulation_impact, policy_direction
    - political_election (sub-type)
    - Scoring formulas already in scoring-engine.ts

[x] 18.12 Political Data Enrichment ✅ DONE
    - services/political-integration.ts — enriches 4 prediction types ✅ — services/political-integration.ts
    - Enrich swarm predictions with KPU election data
    - Add regional political context to social sentiment simulations
    - Feed dapil data into political election swarm
    - Estimated: ~150 lines
```

---

## Priority Summary

| Priority | Repo | Items | Est. Hours |
|----------|------|-------|-----------|
| P1 — Database + Ingestion | backend-deeportal | 3 tasks | 6 jam |
| P2 — API + Scoring | backend-deeportal | 2 tasks | 5 jam |
| P3 — Frontend UI | frontend-deeportal | 5 tasks | 8 jam |
| P4 — Swarm Integration | backend-swarm | 2 tasks (1 done) | 2 jam |
| **Total** | **3 repos** | **12 tasks** | **~21 jam** |

### Quick Wins (Today)

```text
✅ 18.11 Political prediction types — already in swarm types
[ ] 18.1 Political DB schema — 2 hours, no external dependency
[ ] 18.5 Political scoring engine — 3 hours, pure calculation
[ ] 18.10 Frontend types — 30 min, TypeScript only
```

