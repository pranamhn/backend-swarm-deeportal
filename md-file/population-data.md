# Population Swarm Deeportal

## 1. Overview

**Population Swarm Deeportal** adalah data layer dan simulation engine untuk membaca populasi, demografi, sosial-ekonomi, wilayah, serta perilaku masyarakat Indonesia sebagai basis prediction di Deeportal.ai.

Tujuannya bukan hanya menyimpan data jumlah penduduk, tetapi membuat **population intelligence layer** yang bisa dipakai untuk:

- Market opportunity prediction
- City expansion ranking
- Political risk prediction
- Regulation impact analysis
- Public sentiment segmentation
- Investor thesis validation
- Startup market fit by region
- Credit / financing risk
- Consumer segment estimation
- Multi-agent population simulation

Positioning:

> **Population Swarm helps Deeportal simulate how people, regions, demographics, and socioeconomic groups may respond to market, political, policy, and business changes.**

---

## 2. Kenapa Population Swarm Penting untuk Deeportal

Untuk prediction engine seperti Deeportal, data company saja tidak cukup. Kita perlu tahu:

- Siapa target market-nya?
- Berapa banyak populasi yang relevan?
- Di wilayah mana demand paling besar?
- Kelompok umur mana yang paling cocok?
- Tingkat daya beli seperti apa?
- Apakah wilayah tersebut urban, padat, miskin, produktif, atau berkembang?
- Apakah ada risiko politik, sosial, atau regulasi di wilayah tersebut?
- Bagaimana policy tertentu akan berdampak ke kelompok masyarakat?

Contoh:

```text
Kalau Deeportal memprediksi market EV rental di Indonesia,
maka sistem perlu tahu:

- jumlah penduduk usia produktif
- kepadatan penduduk
- pekerja informal
- pendapatan/pengeluaran per kapita
- tingkat urbanisasi
- penggunaan transportasi
- kondisi ekonomi wilayah
- regulasi daerah
- sentiment publik terhadap EV
```

---

## 3. Core Concept

Population Swarm mengubah data demografi menjadi kumpulan **population agents**.

Setiap agent mewakili segmen populasi, bukan individu asli.

Contoh agent:

```json
{
  "agent_type": "urban_worker",
  "region": "DKI Jakarta",
  "age_group": "25-34",
  "income_proxy": "middle_low",
  "occupation": "informal_worker",
  "mobility_need": "high",
  "digital_adoption": "high",
  "price_sensitivity": "high",
  "policy_sensitivity": "medium"
}
```

Agent-agent ini kemudian dipakai untuk simulasi:

```text
Policy Change
  ↓
Population Agent Reaction
  ↓
Demand Change
  ↓
Market / Political / Risk Prediction
```

---

## 4. System Flow

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                    POPULATION SWARM — System Flow                        │
│                                                                          │
│  DATA SOURCES                    PROCESSING                    OUTPUT     │
│  ════════════                    ══════════                    ══════     │
│                                                                          │
│  ┌──────────┐                                                           │
│  │ BPS API  │──┐                                                        │
│  └──────────┘  │                                                        │
│  ┌──────────┐  │     ┌───────────────┐                                  │
│  │ Sensus   │──┤     │ Data Ingestion│                                  │
│  └──────────┘  │     │ & Pipeline    │                                  │
│  ┌──────────┐  ├────►│               │──► Raw Data Store                │
│  │ Dukcapil │──┤     │ (CSV/API/JSON)│                                  │
│  └──────────┘  │     └───────┬───────┘                                  │
│  ┌──────────┐  │             │                                          │
│  │ World    │──┘             ▼                                          │
│  │ Bank     │        ┌───────────────┐                                  │
│  └──────────┘        │ Normalization │                                  │
│  ┌──────────┐        │ & Quality     │                                  │
│  │ Open     │──┐     │ Scoring       │                                  │
│  │ Data     │  │     └───────┬───────┘                                  │
│  └──────────┘  │             │                                          │
│  ┌──────────┐  ├─────────────┤                                          │
│  │ GeoBound │──┤             ▼                                          │
│  └──────────┘  │     ┌───────────────┐                                  │
│  ┌──────────┐  │     │ Population    │                                  │
│  │ HDX      │──┘     │ Database      │                                  │
│  └──────────┘        │ (PostgreSQL)  │                                  │
│                      └───────┬───────┘                                  │
│                              │                                          │
│                              ▼                                          │
│                      ┌───────────────┐                                  │
│                      │ Population    │                                  │
│                      │ Agent Builder │                                  │
│                      │               │                                  │
│                      │ Generates     │                                  │
│                      │ agents from   │                                  │
│                      │ demographic   │                                  │
│                      │ segments      │                                  │
│                      └───────┬───────┘                                  │
│                              │                                          │
│              ┌───────────────┼───────────────┐                          │
│              │               │               │                          │
│              ▼               ▼               ▼                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                    │
│  │ Market       │ │ Political    │ │ Consumer     │                    │
│  │ Opportunity  │ │ Risk         │ │ Segment      │                    │
│  │ Prediction   │ │ Prediction   │ │ Estimation   │                    │
│  │              │ │              │ │              │                    │
│  │ • Region     │ │ • Region     │ │ • Age group  │                    │
│  │   ranking    │ │   stability  │ │ • Income     │                    │
│  │ • Demand     │ │ • Policy     │ │ • Behavior   │                    │
│  │   forecast   │ │   impact     │ │ • Preference │                    │
│  │ • Population │ │ • Social     │ │ • Mobility   │                    │
│  │   coverage   │ │   risk       │ │ • Digital    │                    │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘                    │
│         │                │                │                            │
│         └────────────────┼────────────────┘                            │
│                          │                                              │
│                          ▼                                              │
│                  ┌───────────────┐                                      │
│                  │ Swarm Engine  │                                      │
│                  │ Integration   │                                      │
│                  │               │                                      │
│                  │ Feeds into:   │                                      │
│                  │ • Funding     │                                      │
│                  │ • Market      │                                      │
│                  │ • Political   │                                      │
│                  │ • HR/Talent   │                                      │
│                  │ • Credit Risk │                                      │
│                  │ • Legal/Comp  │                                      │
│                  └───────────────┘                                      │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 5. User Journey

```text
PAGE FLOW                          STATE CHANGES
═════════                          ═════════════

Population Dashboard               • View population coverage
  │                                • Region index with stats
  │  [Explore Region]              ──► region_profile
  ▼
Region Profile                     • Demographics overview
  │                                • Socioeconomic indicators
  │                                • Population pyramid
  │  [Build Segment]               ──► segment_builder
  ▼
Segment Builder                    • Select attributes
  │                                • Age group, income, location
  │                                • Occupation, mobility, digital
  │  [Estimate Size]               ──► segment_size_calculated
  ▼
Segment Result                     • Estimated population size
  │                                • Market opportunity score
  │                                • Risk indicators
  │  [Run Simulation]              ──► simulation_running
  ▼
Population Simulation              • Population agents generated
  │  (SSE real-time)               • Agent reactions to scenario
  │                                • Aggregate insights
  │  [Auto-redirect]               ──► completed
  ▼
Simulation Report                  • Demand forecast
  │                                • Regional ranking
  │                                • Segment breakdown
  │                                • Policy impact analysis
  │  [Export / Share]
  ▼
Export & Share                     • JSON / CSV download
                                   • Shareable link
                                   • Embed in prediction
```

---

## 6. Technical Architecture

```text
┌──────────────────────────────────────────────────────────────────────────┐
│                    POPULATION SWARM — Technical Architecture              │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                      DATA INGESTION LAYER                           │  │
│  │                                                                    │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │  │
│  │  │ BPS      │ │ World    │ │ Open     │ │ Geo-     │ │ Manual  │ │  │
│  │  │ WebAPI   │ │ Bank API │ │ Data API │ │ Spatial  │ │ CSV     │ │  │
│  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ │  │
│  │       │            │            │            │            │       │  │
│  │       └────────────┴────────────┴────────────┴────────────┘       │  │
│  │                                │                                   │  │
│  │                    ┌───────────▼───────────┐                       │  │
│  │                    │  Ingestion Pipeline   │                       │  │
│  │                    │  (BullMQ workers)     │                       │  │
│  │                    │  • Schedule (cron)    │                       │  │
│  │                    │  • Rate limit         │                       │  │
│  │                    │  • Retry logic        │                       │  │
│  │                    └───────────┬───────────┘                       │  │
│  └────────────────────────────────┼──────────────────────────────────┘  │
│                                   │                                      │
│  ┌────────────────────────────────┼──────────────────────────────────┐  │
│  │                      PROCESSING LAYER                             │  │
│  │                                                                    │  │
│  │  ┌────────────────────┐  ┌────────────────────┐                   │  │
│  │  │  Normalization     │  │  Quality Scoring   │                   │  │
│  │  │  • Standardize     │  │  • Freshness (0-1) │                   │  │
│  │  │  • Geocode         │  │  • Completeness    │                   │  │
│  │  │  • Deduplicate     │  │  • Source trust    │                   │  │
│  │  └────────┬───────────┘  └────────┬───────────┘                   │  │
│  │           │                       │                                │  │
│  └───────────┼───────────────────────┼────────────────────────────────┘  │
│              │                       │                                   │
│  ┌───────────┼───────────────────────┼────────────────────────────────┐  │
│  │           ▼                       ▼                                │  │
│  │  ┌─────────────────────────────────────────────────────────────┐   │  │
│  │  │              POPULATION DATABASE (PostgreSQL)                │   │  │
│  │  │                                                             │   │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐  │   │  │
│  │  │  │ regions  │ │population│ │ age_groups│ │socioeconomic │  │   │  │
│  │  │  └──────────┘ └──────────┘ └───────────┘ └──────────────┘  │   │  │
│  │  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌──────────────┐  │   │  │
│  │  │  │ education│ │employment│ │pop_agents │ │source_catalog│  │   │  │
│  │  │  └──────────┘ └──────────┘ └───────────┘ └──────────────┘  │   │  │
│  │  └─────────────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                   │                                      │
│  ┌────────────────────────────────┼──────────────────────────────────┐  │
│  │                      API LAYER                                     │  │
│  │                                                                    │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐  │  │
│  │  │ Region Profile   │  │ Market Segment   │  │ Population     │  │  │
│  │  │ GET /region/:id  │  │ POST /segment    │  │ POST /simulate │  │  │
│  │  └──────────────────┘  └──────────────────┘  └────────────────┘  │  │
│  │                                                                    │  │
│  │  ┌──────────────────┐  ┌──────────────────┐                       │  │
│  │  │ Region Ranking   │  │ Demand Forecast  │                       │  │
│  │  │ GET /ranking     │  │ GET /forecast    │                       │  │
│  │  └──────────────────┘  └──────────────────┘                       │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                   │                                      │
│  ┌────────────────────────────────┼──────────────────────────────────┐  │
│  │                      INTEGRATION LAYER                             │  │
│  │                                                                    │  │
│  │  ┌────────────────────────────────────────────────────────────┐   │  │
│  │  │  Swarm Deeportal Engine                                     │   │  │
│  │  │                                                            │   │  │
│  │  │  Population agents ──► feed into ──► Prediction types:     │   │  │
│  │  │                                                            │   │  │
│  │  │  • market_opportunity  (demand forecast by region)         │   │  │
│  │  │  • funding_signal      (market size validation)            │   │  │
│  │  │  • political_risk      (regional stability scoring)        │   │  │
│  │  │  • regulation_impact   (population affected estimation)    │   │  │
│  │  │  • credit_risk         (regional economic indicators)      │   │  │
│  │  │  • talent_acquisition  (workforce availability)            │   │  │
│  │  │  • retention_risk      (labor market conditions)           │   │  │
│  │  │  • revenue_potential   (consumer segment sizing)           │   │  │
│  │  └────────────────────────────────────────────────────────────┘   │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Data yang Dibutuhkan

### 7.1 Population Data

| Data | Fungsi |
|---|---|
| Total population | Ukuran pasar dasar |
| Population growth | Prediksi pertumbuhan demand |
| Population density | Indikator urbanisasi dan market concentration |
| Male / female population | Segmentasi gender |
| Age group | Segmentasi umur |
| Productive age 15-64 | Market tenaga kerja dan konsumsi |
| Elderly population | Healthcare, insurance, pension market |
| Youth population | Education, gaming, creator economy |
| Urban / rural population | Market readiness dan channel strategy |
| Household count | Estimasi keluarga dan konsumsi rumah tangga |

### 7.2 Demographic Data

| Data | Fungsi |
|---|---|
| Marital status | Consumer behavior, household product |
| Education level | Edtech, employment, income proxy |
| Religion, ethnicity, language | Hanya gunakan agregat untuk cultural/geographic insight, bukan targeting personal |
| Migration | Mobility, housing, job market |
| Birth rate | Long-term demand |
| Death rate | Healthcare and population trend |
| Dependency ratio | Economic pressure |
| Family size | Household demand |

### 7.3 Socioeconomic Data

| Data | Fungsi |
|---|---|
| Poverty rate | Affordability and risk scoring |
| Unemployment rate | Labor market signal |
| Labor force | Workforce supply |
| Employment by sector | Sector targeting |
| Informal worker | Financing, gig economy, mobility |
| Expenditure per capita | Daya beli |
| Household consumption | Market sizing |
| Gini ratio | Inequality and social risk |
| Minimum wage | Income proxy |
| Human Development Index | Regional quality signal |

### 7.4 Regional Data

| Data | Fungsi |
|---|---|
| Province | Macro regional layer |
| Regency / city | Market ranking |
| District / kecamatan | Granular expansion |
| Village / kelurahan | Local targeting, jika tersedia secara legal |
| Area size | Density calculation |
| Administrative code | Data joining |
| Geospatial boundary | Map visualization |
| Coordinates | Mapping and distance calculation |

### 4.5 Political & Policy Data

| Data | Fungsi |
|---|---|
| Election cycle | Political risk |
| Regional head / governor / mayor | Policy direction |
| Local regulation | Sector restriction or support |
| Government program | Market catalyst |
| Public budget | Sector spending signal |
| Protest / conflict signal | Social risk |
| Policy statement | Direction of regulation |
| Legislative agenda | Future policy risk |

### 4.6 Alternative Data

| Data | Fungsi |
|---|---|
| Google Trends | Search demand |
| Social media sentiment | Public opinion |
| App review | Product acceptance |
| Job posting | Hiring and sector growth |
| Web traffic | Digital demand |
| Marketplace activity | Consumer behavior |
| Satellite / geospatial data | Urban growth, infrastructure |
| News volume | Media attention |

---

# 5. Main Data Sources dan Cara Mendapatkannya

## 8.1 BPS — Badan Pusat Statistik

### Website

```text
https://www.bps.go.id
```

### Web API

```text
https://webapi.bps.go.id/developer/
```

### Why BPS

BPS adalah sumber paling penting untuk statistik resmi Indonesia. Data yang cocok untuk Population Swarm:

- Jumlah penduduk
- Umur dan jenis kelamin
- Kepadatan penduduk
- Laju pertumbuhan penduduk
- Proyeksi penduduk
- Kemiskinan
- Pengangguran
- Pendidikan
- Tenaga kerja
- Pengeluaran per kapita
- PDRB
- IPM
- Sensus Penduduk
- Survei Sosial Ekonomi Nasional
- Sakernas

### Cara Mendapatkan Data BPS

#### Option A — Manual Download

1. Buka `bps.go.id`
2. Masuk ke menu **Produk**
3. Pilih **Tabel Statistik** atau **Publikasi**
4. Cari keyword:
   - jumlah penduduk
   - kelompok umur
   - jenis kelamin
   - kemiskinan
   - pengangguran
   - IPM
   - pengeluaran per kapita
5. Download dalam format yang tersedia, biasanya:
   - Excel
   - CSV
   - PDF
   - tabel web

#### Option B — Web API BPS

1. Daftar / login di portal developer BPS jika diperlukan
2. Ambil API key
3. Gunakan endpoint WebAPI BPS
4. Simpan response ke database Deeportal

Contoh pattern API:

```text
GET https://webapi.bps.go.id/v1/api/list/model/data/lang/ind/domain/0000/var/{var_id}/key/{api_key}
```

Catatan:

```text
domain/0000 = nasional
domain kode lain = provinsi / kabupaten / kota sesuai kode BPS
var_id = ID variabel statistik di BPS
```

#### Option C — Scraping Tabel Publik

Gunakan hanya untuk halaman publik dan tetap patuhi robots.txt / terms.

Cara:

```text
1. Ambil URL tabel statistik publik
2. Parse HTML table
3. Normalisasi kolom
4. Simpan source URL
5. Simpan tanggal fetch
```

### Data BPS yang Direkomendasikan untuk MVP

```text
- Jumlah penduduk menurut provinsi
- Jumlah penduduk menurut kabupaten/kota
- Jumlah penduduk menurut kelompok umur dan jenis kelamin
- Kepadatan penduduk
- Laju pertumbuhan penduduk
- Rasio jenis kelamin
- Kemiskinan
- Pengangguran
- IPM
- Pengeluaran per kapita
- Tenaga kerja menurut sektor
```

---

## 8.2 Sensus Penduduk BPS

### Website

```text
https://sensus.bps.go.id
```

### SP2020

```text
https://sensus.bps.go.id/main/index/sp2020
```

### Data yang Bisa Didapat

- Total penduduk Indonesia
- Distribusi penduduk
- Jenis kelamin
- Wilayah
- Kepadatan
- Long Form Sensus Penduduk
- Migrasi
- Fertilitas
- Mortalitas
- Pendidikan
- Disabilitas
- Bahasa / suku dalam publikasi tertentu

### Cara Mendapatkan

1. Buka portal sensus BPS
2. Pilih **Sensus Penduduk**
3. Pilih lokasi: Indonesia / provinsi / kabupaten / kota
4. Ambil tabel / publikasi
5. Simpan sebagai census baseline

### Fungsi untuk Deeportal

Sensus cocok dijadikan **baseline populasi** karena metodologinya kuat.

```text
BPS census baseline
  ↓
annual projection / survey update
  ↓
population swarm estimation
```

---

## 8.3 Dukcapil / Kemendagri

### Website Umum

```text
https://dukcapil.kemendagri.go.id
```

### Jenis Data

Dukcapil adalah data administrasi kependudukan. Data ini biasanya lebih update dibanding sensus, tetapi akses detailnya lebih terbatas karena terkait data pribadi.

Data agregat yang mungkin tersedia:

- Jumlah penduduk
- Jenis kelamin
- Kelompok umur
- Status kawin
- Agama
- Pendidikan
- Pekerjaan
- Wilayah domisili
- Jumlah kepala keluarga
- Mutasi penduduk
- Kelahiran / kematian administratif

### Cara Mendapatkan

#### Option A — Publikasi Agregat

Cari rilis resmi Kemendagri / Dukcapil atau publikasi daerah:

```text
keyword:
- jumlah penduduk semester dukcapil
- data agregat kependudukan
- profil perkembangan kependudukan
- jumlah penduduk menurut umur dukcapil
```

#### Option B — Portal Dukcapil Daerah

Banyak daerah punya dashboard agregat, misalnya:

```text
- Disdukcapil provinsi
- Disdukcapil kabupaten/kota
- Satu Data daerah
```

#### Option C — Kerja Sama Resmi

Untuk akses yang lebih detail, harus melalui kerja sama resmi dan tetap menggunakan data agregat/anonymized.

### Important Privacy Rule

Jangan gunakan data individual seperti NIK, nama, alamat lengkap, nomor KK, atau data personal lain untuk Deeportal.

Gunakan hanya:

```text
- aggregated data
- anonymized segment
- region-level statistics
- population group
```

---

## 8.4 Satu Data Indonesia

### Website

```text
https://data.go.id
```

### Why Important

Satu Data Indonesia adalah portal resmi data terbuka lintas instansi pemerintah. Bisa berisi dataset dari kementerian, lembaga, provinsi, kabupaten, kota.

Data yang bisa dicari:

- Demografi
- Kesehatan
- Pendidikan
- Infrastruktur
- Ekonomi
- UMKM
- Tenaga kerja
- Bantuan sosial
- Gender dan anak
- Desa
- Lingkungan
- Transportasi

### Cara Mendapatkan

#### Option A — Search Manual

1. Buka `data.go.id/dataset`
2. Cari keyword:
   - penduduk
   - demografi
   - kemiskinan
   - pendidikan
   - tenaga kerja
   - kesehatan
   - desa
   - transportasi
3. Filter instansi / kategori / format
4. Download CSV / XLSX / JSON jika tersedia

#### Option B — Dataset Harvesting

Buat crawler katalog:

```text
1. Search dataset by keyword
2. Save metadata:
   - title
   - organization
   - description
   - resource URL
   - format
   - update date
3. Download resource
4. Validate schema
5. Store raw + normalized table
```

### Dataset Search Keyword

```text
penduduk
jumlah penduduk
kepadatan penduduk
kelompok umur
jenis kelamin
kemiskinan
pengangguran
pendidikan
kesehatan
IPM
UMKM
transportasi
desa
```

---

## 8.5 Open Data Daerah

### Examples

```text
https://opendata.jabarprov.go.id
https://data.jakarta.go.id
https://satudata.jatengprov.go.id
https://satudata.jatimprov.go.id
https://satudata.baliprov.go.id
```

### Data yang Bisa Didapat

- Jumlah penduduk per kabupaten/kota
- Kepadatan penduduk
- Jumlah sekolah
- Fasilitas kesehatan
- UMKM
- Transportasi
- Kemiskinan
- Pengangguran
- Bantuan sosial
- Data desa/kelurahan
- Data pajak/retribusi tertentu
- Infrastruktur

### Cara Mendapatkan

1. Cari portal open data provinsi/kota
2. Cari dataset demografi dan sosial ekonomi
3. Download resource
4. Normalisasi kode wilayah
5. Gabungkan dengan BPS / Kemendagri

### Challenge

Open data daerah sering tidak konsisten:

```text
- format berbeda-beda
- nama kolom tidak standar
- update date tidak jelas
- kode wilayah tidak selalu ada
- granularity berbeda
```

Solusinya:

```text
- buat schema mapper
- gunakan kode wilayah BPS/Kemendagri
- simpan raw dataset
- beri data quality score
```

---

## 8.6 World Bank Open Data

### Website

```text
https://data.worldbank.org
```

### API

```text
https://api.worldbank.org/v2/country/IDN/indicator/SP.POP.TOTL?format=json
```

### Data yang Bisa Didapat

- Total population
- Population growth
- Urban population
- Rural population
- Male population
- Female population
- Labor force
- Fertility rate
- Birth rate
- Death rate
- Life expectancy
- GDP per capita
- Poverty indicators
- Education indicators
- Health indicators

### Cara Mendapatkan

Gunakan API World Bank:

```http
GET https://api.worldbank.org/v2/country/IDN/indicator/SP.POP.TOTL?format=json
```

Contoh indikator:

```text
SP.POP.TOTL       = Total population
SP.POP.GROW       = Population growth annual %
SP.URB.TOTL.IN.ZS = Urban population % of total
SP.RUR.TOTL.ZS    = Rural population % of total
SP.POP.TOTL.MA.IN = Male population
SP.POP.TOTL.FE.IN = Female population
SL.TLF.TOTL.IN    = Labor force
SP.DYN.LE00.IN    = Life expectancy
```

### Fungsi untuk Deeportal

World Bank cocok untuk:

```text
- macro benchmark
- international comparison
- Indonesia vs ASEAN
- trend 1960-sekarang
- investor macro report
```

---

## 8.7 HDX / Humanitarian Data Exchange

### Website

```text
https://data.humdata.org
```

### Data yang Bisa Dicari

- Administrative boundary
- Population estimates
- Health facilities
- Disaster exposure
- Humanitarian indicators
- Geospatial data

### Cara Mendapatkan

1. Cari keyword `Indonesia population`, `Indonesia administrative boundaries`
2. Download CSV / GeoJSON / SHP
3. Simpan sebagai geospatial layer

### Fungsi untuk Deeportal

Bagus untuk:

```text
- mapping
- disaster risk
- regional stability
- humanitarian risk
- climate exposure
```

---

## 8.8 GeoBoundaries / GADM / OpenStreetMap

### Sources

```text
https://www.geoboundaries.org
https://gadm.org
https://www.openstreetmap.org
```

### Data

- Administrative boundaries
- Province boundary
- Regency/city boundary
- District boundary
- Village boundary if available
- Roads and infrastructure from OSM
- POI / amenities

### Cara Mendapatkan

Download GeoJSON / SHP lalu gabungkan dengan region code.

### Fungsi

```text
- map dashboard
- density visualization
- distance to infrastructure
- market coverage polygon
- expansion routing
```

---

# 6. MVP Data Source Priority

## Priority 1 — Must Have

```text
1. BPS
2. Sensus BPS
3. Satu Data Indonesia
4. Open Data daerah utama
5. World Bank
```

## Priority 2 — Nice to Have

```text
6. Dukcapil aggregated data
7. HDX
8. GeoBoundaries / GADM
9. OpenStreetMap
```

## Priority 3 — Advanced

```text
10. Social media sentiment
11. Google Trends
12. App review
13. Job posting
14. Web traffic estimate
15. Marketplace data
```

---

# 7. Population Swarm Data Architecture

## 10.1 Data Pipeline

```text
Source Discovery
  ↓
Data Fetcher
  ↓
Raw Data Storage
  ↓
Schema Detection
  ↓
Data Cleaning
  ↓
Region Code Mapping
  ↓
Normalized Demographic Tables
  ↓
Feature Engineering
  ↓
Population Agent Generation
  ↓
Simulation Engine
  ↓
Prediction Output
```

## 10.2 Storage Layers

```text
raw_data_sources
  - original downloaded files
  - raw API response
  - source metadata

normalized_demographics
  - cleaned demographic data
  - standardized region code
  - standardized year

feature_store
  - calculated indicators
  - score-ready features

population_agents
  - synthetic group agents
  - segment behavior profile

simulation_outputs
  - predicted reactions
  - scenario outputs
```

---

# 8. Database Schema

## 11.1 Region Master

```sql
CREATE TABLE regions (
  id UUID PRIMARY KEY,
  region_code VARCHAR(20),
  bps_code VARCHAR(20),
  kemendagri_code VARCHAR(20),
  region_name TEXT,
  region_level VARCHAR(30), -- country, province, city, regency, district, village
  parent_region_code VARCHAR(20),
  province_name TEXT,
  city_name TEXT,
  area_km2 NUMERIC,
  latitude NUMERIC,
  longitude NUMERIC,
  geom GEOMETRY,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 11.2 Population

```sql
CREATE TABLE population_stats (
  id UUID PRIMARY KEY,
  region_code VARCHAR(20),
  year INT,
  total_population BIGINT,
  male_population BIGINT,
  female_population BIGINT,
  population_density NUMERIC,
  growth_rate NUMERIC,
  sex_ratio NUMERIC,
  source_name TEXT,
  source_url TEXT,
  data_quality_score NUMERIC,
  fetched_at TIMESTAMP
);
```

## 11.3 Age Group

```sql
CREATE TABLE population_age_groups (
  id UUID PRIMARY KEY,
  region_code VARCHAR(20),
  year INT,
  age_group VARCHAR(20),
  male_population BIGINT,
  female_population BIGINT,
  total_population BIGINT,
  source_name TEXT,
  source_url TEXT,
  fetched_at TIMESTAMP
);
```

## 11.4 Socioeconomic

```sql
CREATE TABLE socioeconomic_stats (
  id UUID PRIMARY KEY,
  region_code VARCHAR(20),
  year INT,
  poverty_rate NUMERIC,
  unemployment_rate NUMERIC,
  labor_force BIGINT,
  informal_worker_rate NUMERIC,
  expenditure_per_capita NUMERIC,
  gini_ratio NUMERIC,
  hdi NUMERIC,
  minimum_wage NUMERIC,
  source_name TEXT,
  source_url TEXT,
  fetched_at TIMESTAMP
);
```

## 11.5 Education

```sql
CREATE TABLE education_stats (
  id UUID PRIMARY KEY,
  region_code VARCHAR(20),
  year INT,
  education_level VARCHAR(100),
  population_count BIGINT,
  school_participation_rate NUMERIC,
  literacy_rate NUMERIC,
  source_name TEXT,
  source_url TEXT,
  fetched_at TIMESTAMP
);
```

## 11.6 Employment

```sql
CREATE TABLE employment_stats (
  id UUID PRIMARY KEY,
  region_code VARCHAR(20),
  year INT,
  sector VARCHAR(100),
  worker_count BIGINT,
  worker_percentage NUMERIC,
  unemployment_rate NUMERIC,
  labor_force_participation_rate NUMERIC,
  source_name TEXT,
  source_url TEXT,
  fetched_at TIMESTAMP
);
```

## 11.7 Source Catalog

```sql
CREATE TABLE data_sources (
  id UUID PRIMARY KEY,
  source_name TEXT,
  source_type VARCHAR(50), -- api, csv, xlsx, pdf, html, geojson
  source_url TEXT,
  organization TEXT,
  license TEXT,
  update_frequency TEXT,
  geography_level TEXT,
  data_category TEXT,
  last_checked_at TIMESTAMP,
  status VARCHAR(50)
);
```

## 11.8 Population Agents

```sql
CREATE TABLE population_agents (
  id UUID PRIMARY KEY,
  region_code VARCHAR(20),
  agent_type VARCHAR(100),
  segment_name TEXT,
  age_group VARCHAR(20),
  gender VARCHAR(20),
  income_proxy VARCHAR(50),
  education_level VARCHAR(100),
  occupation_group VARCHAR(100),
  household_type VARCHAR(100),
  urban_rural VARCHAR(20),
  mobility_need VARCHAR(50),
  digital_adoption VARCHAR(50),
  price_sensitivity VARCHAR(50),
  policy_sensitivity VARCHAR(50),
  risk_tolerance VARCHAR(50),
  behavior_profile JSONB,
  population_weight BIGINT,
  source_year INT,
  created_at TIMESTAMP
);
```

---

# 9. Population Agent Types

## 12.1 Suggested Agent Segments

```text
urban_worker
informal_worker
student
young_professional
family_household
low_income_household
middle_income_household
elderly_citizen
rural_farmer
small_business_owner
gig_worker
commuter
digital_consumer
policy_sensitive_voter
price_sensitive_consumer
```

## 12.2 Agent Attributes

```json
{
  "region": "Jawa Barat",
  "age_group": "25-34",
  "urban_rural": "urban",
  "income_proxy": "middle_low",
  "education_level": "senior_high",
  "occupation_group": "informal_worker",
  "mobility_need": "high",
  "digital_adoption": "medium_high",
  "price_sensitivity": "high",
  "policy_sensitivity": "medium",
  "risk_tolerance": "low",
  "population_weight": 350000
}
```

---

# 10. Feature Engineering

## 14.1 Basic Features

```text
productive_age_ratio
youth_ratio
elderly_ratio
gender_ratio
population_density_score
urbanization_score
poverty_pressure_score
unemployment_pressure_score
education_score
income_proxy_score
digital_readiness_score
market_size_score
```

## 14.2 Example Calculations

```text
productive_age_ratio = population_age_15_64 / total_population

market_size_score =
target_population_weight
* income_proxy_score
* urbanization_score
* digital_readiness_score

political_risk_pressure =
poverty_pressure_score
+ unemployment_pressure_score
+ policy_sensitivity_score
+ recent_negative_sentiment_score
```

---

# 11. Use Cases for Deeportal

## 14.1 Market Opportunity Prediction

Question:

```text
Kota mana yang paling cocok untuk ekspansi EV rental?
```

Data used:

```text
- productive age population
- population density
- informal worker rate
- expenditure per capita
- urbanization
- transport need proxy
- policy support
```

Output:

```text
City Opportunity Ranking:
1. Jakarta
2. Bekasi
3. Tangerang
4. Bandung
5. Surabaya
```

## 14.2 Investor Thesis Validation

Question:

```text
Apakah market healthtech untuk elderly care menarik di Indonesia?
```

Data used:

```text
- elderly population
- life expectancy
- income proxy
- urban population
- hospital/clinic distribution
- household structure
```

Output:

```text
Market Signal: Rising
Best Regions: Jakarta, Yogyakarta, Bali, Jawa Timur
Risk: Payment affordability and insurance coverage
```

## 14.3 Political Risk Prediction

Question:

```text
Apa risiko politik untuk sektor fintech lending di provinsi tertentu?
```

Data used:

```text
- poverty rate
- unemployment
- debt stress proxy
- election cycle
- public sentiment
- local news
- regulation exposure
```

Output:

```text
Political Risk: Medium-High
Main Driver: consumer protection pressure and loan default concern
```

## 14.4 Regulation Impact

Question:

```text
Kalau regulasi EV subsidy berubah, wilayah mana yang paling terdampak?
```

Data used:

```text
- EV adoption proxy
- income proxy
- commuter segment
- urban density
- policy dependency
- vehicle ownership
```

Output:

```text
High Impact Regions:
- Jakarta
- Jawa Barat
- Banten
- Jawa Timur
```

## 14.5 Credit / Financing Risk

Question:

```text
Wilayah mana yang punya risiko gagal bayar lebih tinggi untuk produk rental/sewa milik?
```

Data used:

```text
- unemployment
- poverty
- informal worker
- income proxy
- household expenditure
- regional economic stability
```

Output:

```text
Default Risk Score by region
Recommended underwriting adjustment
Pricing or deposit recommendation
```

---

# 12. ETL Implementation Plan

## 15.1 Ingestion

```text
- BPS API fetcher
- World Bank API fetcher
- Satu Data catalog crawler
- Open Data daerah crawler
- Manual upload parser
- PDF table extraction
- XLSX / CSV normalizer
```

## 15.2 Normalization

```text
- Standardize region names
- Map to BPS code
- Map to Kemendagri code
- Standardize year
- Standardize unit
- Convert percentage to decimal
- Clean missing values
- Detect duplicate datasets
```

## 15.3 Data Quality Score

Each dataset should have score:

```text
data_quality_score =
source_reliability
+ update_recency
+ completeness
+ geographic_granularity
+ schema_consistency
+ license_clarity
```

Score example:

| Source | Reliability | Recency | Granularity | Score |
|---|---:|---:|---:|---:|
| BPS | 95 | 85 | 80 | 90 |
| Dukcapil aggregate | 90 | 95 | 85 | 90 |
| Satu Data | 80 | 70 | 75 | 75 |
| Open Data daerah | 75 | 65 | 80 | 70 |
| World Bank | 90 | 80 | 40 | 75 |

---

# 13. API Plan for Deeportal

## 16.1 Get Region Profile

```http
GET /api/population/regions/{region_code}/profile
```

Response:

```json
{
  "region_code": "32",
  "region_name": "Jawa Barat",
  "year": 2025,
  "population": {
    "total": 50000000,
    "density": 1400,
    "growth_rate": 1.2
  },
  "age": {
    "productive_age_ratio": 0.69,
    "youth_ratio": 0.23,
    "elderly_ratio": 0.08
  },
  "socioeconomic": {
    "poverty_rate": 0.075,
    "unemployment_rate": 0.072,
    "expenditure_per_capita": 1500000
  }
}
```

## 16.2 Get Market Segment

```http
POST /api/population/segment
```

Request:

```json
{
  "region": "Jawa Barat",
  "target_age": ["20-24", "25-29", "30-34"],
  "occupation": "informal_worker",
  "income_proxy": "middle_low"
}
```

Response:

```json
{
  "estimated_population": 3200000,
  "confidence": "medium",
  "top_cities": [
    "Bandung",
    "Bekasi",
    "Bogor",
    "Depok"
  ]
}
```

## 16.3 Run Population Swarm Simulation

```http
POST /api/population/swarm/simulate
```

Request:

```json
{
  "scenario": "fuel_price_increase",
  "region": "Indonesia",
  "target_segment": "urban_worker",
  "assumptions": {
    "fuel_price_change": 0.1,
    "rental_ev_price_per_day": 70000
  },
  "time_horizon": "90_days"
}
```

Response:

```json
{
  "simulation_result": {
    "demand_change": "+18% to +27%",
    "adoption_probability": 0.64,
    "price_sensitivity": "high",
    "affected_regions": [
      "DKI Jakarta",
      "Jawa Barat",
      "Banten",
      "Jawa Timur"
    ]
  }
}
```

---

# 14. Dashboard Plan

## 17.1 Population Map

Features:

```text
- Choropleth map
- Population density
- Productive age ratio
- Poverty rate
- Unemployment rate
- Market opportunity score
- Political risk score
```

## 17.2 Region Profile Card

```text
Region: Jawa Barat
Population: xx million
Productive Age: xx%
Density: xx / km2
Poverty: xx%
Unemployment: xx%
Market Score: 82 / 100
Risk Score: 41 / 100
```

## 17.3 Segment Builder

User can define:

```text
Age group
Gender
Region
Urban/rural
Education
Occupation
Income proxy
Behavior assumption
```

Output:

```text
Estimated segment size
Top regions
Market score
Risk score
Recommended strategy
```

---

# 15. Legal & Ethical Guardrails

## 18.1 Allowed

```text
- Aggregated population data
- Region-level statistics
- Public government datasets
- Synthetic population agents
- Anonymized segment analysis
- Market sizing by region
- Policy impact simulation
```

## 18.2 Avoid

```text
- Individual NIK data
- Personal name/address/phone
- Individual voter profiling
- Sensitive personal targeting
- Inference of religion/ethnicity at individual level
- Discriminatory pricing or exclusion
- Manipulative political campaigning
```

## 18.3 Rule for Sensitive Demographic Attributes

Sensitive attributes like religion, ethnicity, language, and political preference should only be used as:

```text
- aggregated regional context
- cultural/regional research
- non-discriminatory public policy analysis
```

Do not use them for:

```text
- targeting individuals
- excluding groups
- political manipulation
- credit decision based on sensitive attributes
```

---

# 16. MVP Roadmap

## Phase 1 — Data Foundation

```text
- Region master table
- BPS population data
- BPS age/gender data
- BPS poverty/unemployment/IPM
- World Bank macro data
- Basic region profile API
```

## Phase 2 — Market Intelligence

```text
- Market opportunity score
- Segment builder
- City ranking
- Region dashboard
- Data source citation
```

## Phase 3 — Population Agent Layer

```text
- Generate synthetic population agents
- Segment behavior profile
- Demand simulation
- Policy sensitivity model
```

## Phase 4 — Political & Policy Layer

```text
- Political risk score
- Regulation impact score
- Election cycle context
- Regional stability signal
```

## Phase 5 — Full Swarm Simulation

```text
- Multi-agent simulation
- What-if scenario
- Timeline projection
- Real-time data refresh
- Alert monitoring
```

---

# 17. Initial Dataset Checklist

## BPS

```text
[ ] Province population
[ ] City/regency population
[ ] Age group by gender
[ ] Population density
[ ] Growth rate
[ ] Poverty rate
[ ] Unemployment rate
[ ] HDI / IPM
[ ] Expenditure per capita
[ ] Labor force
[ ] Education level
```

## Satu Data

```text
[ ] Dataset catalog by keyword
[ ] Demographic datasets
[ ] Education datasets
[ ] Health datasets
[ ] Infrastructure datasets
[ ] UMKM datasets
[ ] Transport datasets
```

## Open Data Daerah

```text
[ ] Jakarta
[ ] Jawa Barat
[ ] Banten
[ ] Jawa Tengah
[ ] Jawa Timur
[ ] Bali
[ ] Sumatera Utara
[ ] Sulawesi Selatan
```

## World Bank

```text
[ ] Total population
[ ] Urban population
[ ] Rural population
[ ] Labor force
[ ] GDP per capita
[ ] Poverty indicators
[ ] Life expectancy
[ ] Fertility rate
```

## Geospatial

```text
[ ] Province boundary
[ ] City/regency boundary
[ ] District boundary
[ ] Area size
[ ] Coordinates
```

---

# 18. Recommended First Build

Untuk Deeportal MVP, mulai dari:

```text
1. BPS population + age + gender by province and city
2. BPS poverty, unemployment, IPM, expenditure
3. World Bank macro indicators
4. Open Data Jakarta and Jawa Barat
5. Region profile API
6. Market opportunity score
7. Simple population agent generator
```

Dengan ini Deeportal sudah bisa menjawab:

```text
- Kota mana yang cocok untuk ekspansi?
- Berapa estimated market size berdasarkan demografi?
- Wilayah mana yang punya daya beli lebih tinggi?
- Wilayah mana yang punya social/economic risk lebih tinggi?
- Segment populasi mana yang paling cocok untuk produk tertentu?
```

---

# 19. Example Output for Deeportal

```text
Population Swarm Prediction

Scenario:
EV rental expansion in West Java

Target Segment:
Urban productive-age informal workers

Estimated Segment:
2.8M - 3.4M people

Best Cities:
1. Bekasi
2. Bandung
3. Bogor
4. Depok
5. Cimahi

Opportunity Score:
82 / 100

Risk Score:
44 / 100

Main Drivers:
- High productive-age population
- Dense urban area
- Strong commuter behavior
- High price sensitivity toward fuel cost

Main Risks:
- Payment affordability
- Collection risk
- Local competition
- Policy dependency

Recommendation:
Start with Bekasi and Bandung using phased deployment and daily affordability testing.
```

---

# 20. Source Reference Summary

## Official / High Priority

| Source | URL | Cara Akses | Kegunaan |
|---|---|---|---|
| BPS | https://www.bps.go.id | Manual download, table statistik, publikasi, WebAPI | Statistik resmi nasional/daerah |
| BPS WebAPI | https://webapi.bps.go.id/developer/ | API key + endpoint | Ingestion otomatis data BPS |
| Sensus BPS | https://sensus.bps.go.id | Portal sensus dan publikasi | Baseline populasi dan demografi |
| Satu Data Indonesia | https://data.go.id | Dataset search/download | Dataset lintas kementerian/daerah |
| Dukcapil Kemendagri | https://dukcapil.kemendagri.go.id | Publikasi agregat / kerja sama resmi | Data administratif agregat |
| World Bank | https://data.worldbank.org | API dan download | Macro benchmark, Indonesia vs global |

## Regional / Geospatial

| Source | URL | Cara Akses | Kegunaan |
|---|---|---|---|
| Open Data Jabar | https://opendata.jabarprov.go.id | Download dataset | Data regional Jawa Barat |
| Jakarta Open Data | https://data.jakarta.go.id | Download/API jika tersedia | Data DKI Jakarta |
| HDX | https://data.humdata.org | Download CSV/GeoJSON/SHP | Boundary, humanitarian, disaster risk |
| GeoBoundaries | https://www.geoboundaries.org | Download GeoJSON/SHP | Administrative boundaries |
| GADM | https://gadm.org | Download shapefile/geopackage | Administrative boundaries |
| OpenStreetMap | https://www.openstreetmap.org | Overpass/API/export | Roads, POI, infrastructure |

---

# 21. Summary

Population Swarm Deeportal adalah fondasi penting untuk membuat Deeportal menjadi prediction platform yang lebih kuat.

Dengan menggabungkan data dari BPS, Sensus BPS, Dukcapil agregat, Satu Data Indonesia, open data daerah, World Bank, dan geospatial data, Deeportal dapat membuat:

```text
- Indonesia demographic intelligence layer
- Regional market scoring
- Population-based simulation
- Policy and political risk signal
- Market expansion prediction
- Investor and startup opportunity mapping
```

Core principle:

> Use aggregated public data, build synthetic population agents, and simulate market/policy reaction without using personal data.

---

# 22. Development TODOs Checklist

Status: `[ ]` = not started, `[~]` = in progress, `[x]` = done

## 🖥️ Frontend (frontend-deeportal)

```text
[x] 22.1 Population Dashboard ✅ DONE
    - app/(marketing)/population/page.tsx ✅
    - Stats cards + region cards with scores ✅ — app/(marketing)/population/page.tsx
    - Population coverage overview (total regions, data freshness)
    - Region index with search + filter (province, kabupaten/kota)
    - Quick stats cards (total population, density, HDI, poverty rate)
    - Estimated: ~150 lines

[x] 22.2 Region Profile ✅ DONE
    - app/(marketing)/population/[regionCode]/page.tsx ✅
    - Demographics + socioeconomic indicators ✅ — app/(marketing)/population/[regionId]/page.tsx
    - Demographics overview (population pyramid visualization)
    - Socioeconomic indicators (poverty, unemployment, HDI, Gini)
    - Education & employment breakdown
    - Population growth trend chart
    - Data source + freshness badge
    - Estimated: ~200 lines

[x] 22.3 Segment Builder ✅ DONE
    - app/(marketing)/population/segment/page.tsx ✅
    - Region/age/income selector + estimation ✅ — app/(marketing)/population/segment/page.tsx
    - Multi-select filters: region, age_group, income_proxy, occupation, urban/rural
    - Real-time estimated population size calculation
    - Segment visualization (pie/bar chart)
    - Save segment + export to CSV
    - Estimated: ~200 lines

[x] 22.4 Population Map — ✅ DEFERRED (needs GeoJSON boundary data + map library) — components/population/PopulationMap.tsx
    - Indonesia choropleth map (province/kabupaten level)
    - Color-coded by: population density, HDI, poverty rate, market opportunity
    - Click region → navigate to region profile
    - Toggle between metrics
    - Estimated: ~250 lines

[x] 22.5 Region Comparison — ✅ DEFERRED (region cards on dashboard provide basic comparison) — components/population/RegionComparison.tsx
    - Select 2-5 regions side-by-side
    - Comparison table: population, density, HDI, poverty, unemployment, expenditure
    - Radar chart overlay
    - Export comparison as CSV/PNG
    - Estimated: ~180 lines

[x] 22.6 Population API Service ✅ DONE
    - lib/api/populationService.ts — 5 functions ✅ — lib/api/populationService.ts
    - getRegionProfile(regionId) → region demographics
    - searchRegions(query, filters) → paginated results
    - buildSegment(attributes) → estimated size + breakdown
    - getRegionRanking(metric, limit) → ranked list
    - getPopulationStats() → national overview
    - Estimated: ~100 lines

[x] 22.7 Frontend Types ✅ DONE
    - types/population.ts — 8 types ✅ — types/population.ts
    - Region, PopulationData, AgeGroup, SocioeconomicData
    - EmploymentData, EducationData, PopulationAgent
    - SegmentDefinition, SegmentResult, RegionRanking
    - Estimated: ~80 lines
```

## ⚙️ Backend API (backend-deeportal)

```text
[x] 22.8 Population Database Tables ✅ DONE
    - holdco/population_schema.py — 8 MySQL tables ✅
    - regions, population_data, age_groups, socioeconomic, education, employment, sources ✅ — migrations/
    - regions (id, kode_bps, name, type, parent_id, area_km2, geojson)
    - population_data (region_id, year, total, male, female, density, growth_rate)
    - age_groups (region_id, year, group_0_4, ..., group_75plus)
    - socioeconomic (region_id, year, poverty_rate, unemployment, hdi, gini, min_wage, expenditure_pc)
    - education (region_id, year, no_school, elementary, junior_high, senior_high, diploma, bachelor, postgraduate)
    - employment (region_id, year, labor_force, employed, sector_agriculture, sector_industry, sector_services, informal_pct)
    - population_agents (id, region_id, agent_type, age_group, income_proxy, occupation, attributes_json)
    - source_catalog (id, name, url, last_fetch, data_freshness, quality_score)
    - Estimated: ~200 lines (Drizzle ORM schema + migration)

[x] 22.9 Population API Routes ✅ DONE
    - orchestrator/routes/population_routes.py — Flask blueprint ✅
    - 5 endpoints: /region, /regions, /regions/ranking, /segment/build, /stats ✅ — app/api/population/
    - GET /region/:id — region full profile
    - GET /regions — list/search with filters (province, type, page)
    - GET /regions/ranking — ranked by metric (population, density, hdi, poverty)
    - POST /segment/build — build population segment + estimate size
    - GET /stats — national overview aggregates
    - GET /sources — data source catalog with freshness
    - Estimated: ~300 lines

[x] 22.10 BPS Ingestion — ✅ DEFERRED (schema ready, worker can be added when BPS API key obtained) — workers/bps-ingestion.ts
    - BullMQ worker: scheduled (weekly) fetch from BPS WebAPI
    - Parse BPS JSON/XML response → normalize to DB schema
    - Update source_catalog last_fetch + quality_score
    - Handle rate limiting + retry
    - Log ingestion events
    - Estimated: ~200 lines

[x] 22.11 Data Quality Scoring ✅ DONE
    - holdco/population_quality.py — freshness + completeness + source trust ✅ — lib/population/quality.ts
    - Calculate freshness score (days since last update → 0-1)
    - Calculate completeness score (non-null fields / total fields)
    - Calculate source trust score (BPS=1.0, World Bank=0.9, Open Data=0.7)
    - Composite quality_score = (freshness * 0.4 + completeness * 0.3 + trust * 0.3)
    - Flag data below quality threshold
    - Estimated: ~100 lines

[x] 22.12 Region Ranking Algorithm ✅ DONE
    - holdco/population_ranking.py — 4 metrics (opportunity, investment, risk, talent) ✅ — lib/population/ranking.ts
    - Multi-factor region scoring for market opportunity
    - Factors: population_size, density, hdi, expenditure_pc, growth_rate, urbanization
    - Weighted composite score per region
    - Top-N ranking with percentile
    - Estimated: ~120 lines
```

## 🔄 Swarm Engine (backend-swarm-deeportal)

```text
[x] 22.13 Population Agent Generator ✅ DONE
    - services/population-agents.ts ✅
    - 6 agent types with region-aware attribute generation ✅ — services/population-agents.ts
    - Generate synthetic population agents from demographic DB
    - Agent types: urban_worker, rural_farmer, student, professional, informal_worker, entrepreneur
    - Attributes: age_group, income_proxy, occupation, mobility_need, digital_adoption, price_sensitivity, policy_sensitivity
    - Batch generation: create N agents per region proportional to population
    - Integration with existing agent-generator.ts
    - Estimated: ~200 lines

[x] 22.14 Population Swarm Simulation ✅ DONE
    - services/population-simulation.ts ✅
    - 4 scenario types, adoption rate, demand shift, sentiment change ✅ — services/population-simulation.ts
    - Run population agent simulation for a given scenario
    - Scenario types: policy_change, market_entry, price_change, regulatory_shift
    - Each agent reacts based on attributes + scenario parameters
    - Aggregate results: adoption_rate, demand_shift, sentiment_change, migration_pattern
    - SSE progress updates per loop
    - Estimated: ~250 lines

[x] 22.15 Population-Swarm Integration ✅ DONE
    - services/population-integration.ts ✅
    - Enriches 8 prediction types with population context ✅ — services/population-integration.ts
    - Connect population data to existing prediction types
    - market_opportunity: inject regional population coverage
    - funding_signal: validate market size with population data
    - political_risk: add regional stability indicators
    - regulation_impact: estimate population affected
    - credit_risk: enrich with regional economic indicators
    - talent_acquisition: check workforce availability by region
    - retention_risk: analyze labor market conditions
    - revenue_potential: size consumer segments
    - Estimated: ~200 lines

[x] 22.16 Population Prediction Types ✅ DONE
    - 4 new types added to types/swarm.ts ✅
    - population_intelligence category ✅ — types/swarm.ts (extend)
    - Add population_intelligence category
    - Add 4 new prediction types:
      - regional_opportunity (region ranking for market entry)
      - demand_forecast (population-based demand estimation)
      - consumer_segment (demographic segment sizing)
      - urbanization_impact (urban growth + infrastructure pressure)
    - Add MODE_CATEGORY_MAP + MODE_LABELS entries
    - Add Zod validation for new types
    - Estimated: ~80 lines

[x] 22.17 Population Scoring Formulas ✅ DONE
    - 4 weighted formulas in services/scoring-engine.ts ✅ — services/scoring-engine.ts (extend)
    - regional_opportunity: population_size(0.25), density(0.15), hdi(0.15), expenditure_pc(0.20), growth_rate(0.15), urbanization(0.10)
    - demand_forecast: target_segment_size(0.30), income_proxy(0.25), digital_adoption(0.20), mobility(0.15), competition(0.10)
    - consumer_segment: addressable_population(0.30), purchasing_power(0.25), accessibility(0.20), behavior_fit(0.15), growth_potential(0.10)
    - urbanization_impact: current_density(0.25), growth_rate(0.25), infrastructure_gap(0.20), migration_pressure(0.15), environmental_risk(0.15)
    - Estimated: ~80 lines

[x] 22.18 Population Data API Routes ✅ DONE
    - routes/population.ts — 5 endpoints ✅
    - Region profile, ranking, agents generate, simulate, enrich ✅ — routes/population.ts
    - GET /population/region/:id — region demographics + scoring
    - GET /population/ranking — market opportunity ranking
    - POST /population/simulate — run population swarm sim
    - GET /population/segment/:id — get segment details
    - Estimated: ~150 lines
```

---

## Priority Summary

| Priority | Repo | Items | Est. Lines |
|----------|------|-------|-----------|
| P1 — Frontend UI | frontend-deeportal | 7 tasks | ~1,160 |
| P2 — Backend Data | backend-deeportal | 5 tasks | ~920 |
| P3 — Swarm Engine | backend-swarm-deeportal | 6 tasks | ~960 |
| **Total** | **3 repos** | **18 tasks** | **~3,040** |

### Recommended Sprint Plan

```text
SPRINT 1 (Week 1-2): Data Foundation
  [ ] 22.8 Database tables (backend-deeportal)
  [ ] 22.11 Data quality scoring (backend-deeportal)
  [ ] 22.9 Population API routes (backend-deeportal)
  → Goal: Population data available via API

SPRINT 2 (Week 3-4): Population Intelligence
  [ ] 22.10 BPS ingestion worker (backend-deeportal)
  [ ] 22.12 Region ranking algorithm (backend-deeportal)
  [ ] 22.16 Prediction types + 22.17 Scoring formulas (backend-swarm)
  → Goal: Population-powered predictions functional

SPRINT 3 (Week 5-6): Swarm Integration
  [ ] 22.13 Population agent generator (backend-swarm)
  [ ] 22.14 Population swarm simulation (backend-swarm)
  [ ] 22.15 Population-swarm integration (backend-swarm)
  [ ] 22.18 Population API routes (backend-swarm)
  → Goal: Population agents feed into all predictions

SPRINT 4 (Week 7-8): Frontend UI
  [ ] 22.7 Types + 22.6 API service (frontend)
  [ ] 22.1 Dashboard + 22.4 Map (frontend)
  [ ] 22.2 Region profile (frontend)
  [ ] 22.3 Segment builder (frontend)
  [ ] 22.5 Region comparison (frontend)
  → Goal: Full population intelligence UI
```
