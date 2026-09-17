# PulseTrack - Spring Boot 3 Java Backend

This is the backend foundation for PulseTrack. Production deployment requires the `prod` profile, PostgreSQL, migrations, and authenticated authorization before real employee data is used.

## Requirements
- **Java 21+**
- No global Maven installation is required; use the checked-in wrapper.

## Project Structure
```
backend/
├── pom.xml
└── src/
    └── main/
        ├── java/com/pulsetrack/
        │   ├── PulseTrackApplication.java       (Spring Boot Entry Point)
        │   ├── config/
        │   │   ├── CorsConfig.java              (CORS configuration for React)
        │   │   └── DataInitializer.java         (Pre-seeds mock employees & tasks)
        │   ├── controller/
        │   │   ├── AuthController.java          (POST /api/auth/login)
        │   │   ├── EmployeeController.java      (GET /api/employees, PATCH status)
        │   │   └── TaskController.java          (GET, POST, PATCH /api/tasks)
        │   ├── dto/
        │   │   ├── LoginRequest.java
        │   │   └── AuthResponse.java
        │   ├── model/
        │   │   ├── Employee.java                (JPA Entity)
        │   │   └── Task.java                    (JPA Entity)
        │   └── repository/
        │       ├── EmployeeRepository.java      (Spring Data JPA)
        │       └── TaskRepository.java          (Spring Data JPA)
        └── resources/
            └── application.properties           (Server port 8080, H2 database)
```

## How to Run the Backend
From the `/backend` folder:

```powershell
cd backend
./mvnw.cmd org.springframework.boot:spring-boot-maven-plugin:3.2.3:run
```

The Spring Boot backend will start on **`http://localhost:8080`**.

Local development uses the `dev` profile with disposable H2 data and seeded accounts:

- Admin: `admin@pulsetrack.com` / `admin123`
- Employee seed password: `dev-only-change-me`

Never use this profile for real employee information.

For production, set these through Azure App Configuration or Key Vault:

```text
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://host:5432/pulsetrack
DATABASE_USERNAME=...
DATABASE_PASSWORD=...
PULSETRACK_ADMIN_PASSWORD_HASH=...
```

The production profile disables H2 and startup seeding. Database migrations and a real authenticated session/authorization layer are still required before exposing employee APIs to production users.

### Built-in Endpoints
- **POST** `/api/auth/login` (body: `{"email": "admin@acme.io", "password": "admin123", "role": "admin"}`)
- **GET** `/api/employees` (list all employees with telemetry)
- **GET** `/api/employees/{id}` (single employee detail)
- **PATCH** `/api/employees/{id}/status` (update status/clock-in)
- **GET** `/api/tasks` (list deliverables)
- **PATCH** `/api/tasks/{id}/toggle` (toggle task complete)
- **H2 Web Console**: Accessible in browser at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:pulsetrackdb`, User: `sa`, Password: empty).

## Connecting with the React Frontend
1. Start the Spring Boot backend on `http://localhost:8080`.
2. Start the React frontend on `http://localhost:3000` with `npm run dev`.
3. All authentication and data requests can flow directly between React and Spring Boot.
