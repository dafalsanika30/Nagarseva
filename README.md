# 🏛️ NagarSeva - Municipal Complaint Management System

## Overview

NagarSeva is a full-stack Municipal Complaint Management System developed to streamline complaint registration, tracking, and resolution for citizens and municipal departments.

The system provides role-based access for:

* 👤 Citizens
* 🏢 Department Officers
* ⚙️ Administrators

Features include complaint management, department assignment, SLA tracking, escalation monitoring, JWT authentication, email notifications, and dashboard analytics.

---

## Technology Stack

### Backend

* Java 21
* Spring Boot 3
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* Maven

### Database

* MySQL

### Frontend

* HTML
* CSS
* Bootstrap 5
* JavaScript

---

# Project Structure

```text
Project3
│
├── Backend
│   ├── src
│   ├── pom.xml
│   └── ...
│
├── Frontend
│   ├── css
│   ├── js
│   ├── login.html
│   ├── register.html
│   └── ...
```

---

# Prerequisites

Install the following software:

* Java JDK 21
* Apache Maven 3.9+
* MySQL Server 8+
* Git
* VS Code / IntelliJ IDEA

Verify installation:

```bash
java -version
mvn -version
mysql --version
```

---

# Database Setup

Create database:

```sql
CREATE DATABASE nagarseva;
```

Update database configuration in:

```text
Backend/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/nagarseva
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

---

# JWT Configuration

Add JWT configuration inside:

```properties
app.jwt.secret=YOUR_SECRET_KEY
app.jwt.expiration-ms=86400000
```

---

# Email Configuration

Configure SMTP:

```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=YOUR_EMAIL
spring.mail.password=YOUR_APP_PASSWORD

spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

---

# Running Backend

Navigate to backend directory:

```bash
cd Backend
```

Build project:

```bash
mvn clean install
```

Run application:

```bash
mvn spring-boot:run
```

Backend will start on:

```text
http://localhost:8080
```

---

# Running Frontend

Open Frontend folder in VS Code.

Install Live Server extension.

Open:

```text
login.html
```

Right Click → Open with Live Server

Frontend will run on:

```text
http://127.0.0.1:5500
```

---

# Initial Data Setup

Insert Departments:

* WATER_SUPPLY
* ROADS_TRANSPORT
* SANITATION
* STREET_LIGHTING
* PARKS_GARDENS
* BUILDING_CONSTRUCTION
* HEALTH_SERVICES
* FIRE_SERVICES

Insert SLA Policies for all departments.

Create Admin and Officer accounts with BCrypt encrypted passwords.

---

# User Roles

### Citizen

* Register account
* Create complaints
* Track complaint status
* View complaint history

### Officer

* View assigned complaints
* Update complaint status
* Resolve complaints

### Admin

* Manage departments
* Manage officers
* Monitor complaints
* Configure SLA policies
* View analytics dashboard

---

# Features

* JWT Authentication
* Role-Based Authorization
* Complaint Tracking
* Department Routing
* SLA Monitoring
* Escalation Management
* Email Notifications
* Dashboard Analytics
* Responsive UI

---

# Author

Sanika Vijay Dafal

Master of Computer Applications (MCA)

IMCC College, Pune
