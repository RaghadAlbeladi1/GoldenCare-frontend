<p align="center">
  <a href="https://generalassemb.ly/">
    <img src="https://github.com/user-attachments/assets/0284af1b-bf15-408c-b724-98868f976667" alt="General Assembly" height="80"/>
  <a href="https://sda.edu.sa/">
  </a><img width="500" height="80" alt="Sda-logo-color" src="https://github.com/user-attachments/assets/5edb2838-4fe6-4b18-b80d-706b31f56a64" />
</p>

 ### Backend Repository    [GoldenCare Backend](https://github.com/RaghadAlbeladi1/GoldenCare-backend)

## RESTful Routing Table

<details open>


| Path | Component | Description |
|------|------------|-------------|
| `/` | `HomePage` |  shows welcome info, services preview, and call to action. |
| `/about` | `AboutPage` | About the app – explains mission, goals, and elderly care support. |
| `/services` | `ServicesPage` | Displays all available services with filtering/search options. |
| `/services/:id` | `ServiceDetailsPage` | Shows details for one specific service (linked to caregiver). |
| `/caregivers` | `CaregiversPage` | Lists all caregivers. |
| `/caregivers/:id` | `CaregiverDetailsPage` | Shows caregiver profile and linked services. |
| `/appointments` | `AppointmentsPage` | Lists, creates, edits, and manages appointments for logged-in user. |
| `/ehr` | `EHRPage` | Displays patient's health records, notes, and medications. |
| `/login` | `LoginPage` | User login page. |
| `/register` | `RegisterPage` | Registration for new users. |
| `/profile` | `ProfilePage` | Displays and allows editing of user profile. |
</details>

### ERD Diagram w/ three models, User Model, & Relationships

- user model, appointmet mode (CRUD),Reviews (CRUD), Caregivers, Electronic Health Record(EHR)

<div align="center">
  <img src="for-readme/ERDraghad.png" width="900" alt="ERD Diagram" />
</div>

## User Stories

<details open>


| # | Role | Task |
|---|------|------|
| 1 | As a **user** | I want to **sign up** for an account |
| 2 | As a **user** | I want to **login** to my account |
| 3 | As a **user** | I want to **logout** from my account |
| 4 | As a **user** | I want to **view** my profile information |
| 5 | As a **user** | I want to **update** my profile information |
| 6 | As a **user** | I want to **delete** my account |
| 7 | As a **user** | I want to **view all** available services |
| 8 | As a **user** | I want to **view** service details |
| 9 | As a **user** | I want to **search** for services by name |
| 10 | As a **user** | I want to **view all** available caregivers |
| 11 | As a **user** | I want to **view** caregiver details |
| 12 | As a **user** | I want to **book** an appointment |
| 13 | As a **user** | I want to **choose duration** (day/month/3 months) when booking |
| 14 | As a **user** | I want to **select date and time** for my appointment |
| 15 | As a **user** | I want to **view all** my appointments |
| 16 | As a **user** | I want to **view** my current active appointment |
| 17 | As a **user** | I want to **view** my appointment history |
| 18 | As a **user** | I want to **update** my appointment details |
| 19 | As a **user** | I want to **add notes** to my appointment |
| 20 | As a **user** | I want to **cancel** my appointment |
| 21 | As a **user** | I want to **mark** my appointment as completed |
| 22 | As a **user** | I want to **add** a medical note |
| 23 | As a **user** | I want to **add** medication information |
| 24 | As a **user** | I want to **view all** my health records |
| 25 | As a **user** | I want to **view** only my notes |
| 26 | As a **user** | I want to **view** only my medications |
| 27 | As a **user** | I want to **update** my health records |
| 28 | As a **user** | I want to **delete** a health record |
| 29 | As a **user** | I want to **view all** public reviews |
| 30 | As a **user** | I want to **write** a review after completing service |
| 31 | As a **user** | I want to **rate** my experience (1-5 stars) |
| 32 | As a **user** | I want to **write comment** about my experience |
| 33 | As a **user** | I want to **view** my own reviews |
| 34 | As a **user** | I want to **delete** my reviews |

#### Review 
- User can write review **ONLY after completing service**
- Reviews will apear for all **visitors in public page**
- Rating with **1-5 stars** and write **comments and feedback**

</details>

