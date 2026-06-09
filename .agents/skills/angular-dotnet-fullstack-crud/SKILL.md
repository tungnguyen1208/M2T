---
name: angular-dotnet-fullstack-crud
description: Implement an end-to-end CRUD feature across an existing Angular frontend and ASP.NET Core EF Core backend, keeping routes, DTOs, validation, authentication, pagination, CORS, tests, and configuration synchronized. Use only when both frontend and backend should change. Do not use for backend-only or frontend-only requests.
---

# Angular + ASP.NET Core Full-stack CRUD

Coordinate one complete CRUD feature across both applications without letting the frontend and backend contracts drift.

## Boundaries

- Use this skill only when both Angular and ASP.NET Core must be implemented or changed.
- Prefer `$dotnet-crud-api` for backend-only tasks and `$angular-crud-ui` for frontend-only tasks.
- Follow repository architecture; do not force new Repository, Service, state-management, or UI layers.
- Do not rewrite unrelated modules or globally redesign the application.

## 1. Discover the solution

1. Read all applicable `AGENTS.md` and `AGENTS.override.md` files.
2. Locate Angular and ASP.NET Core roots, solution/project files, package scripts, startup configuration, database context, migrations, routes, authentication, and tests.
3. Inspect one similar backend resource and one similar Angular feature.
4. Identify shared development URLs, proxy configuration, API base URL, CORS policy, auth token flow, response envelope, validation format, and pagination convention.
5. Preserve unrelated user changes.

## 2. Define one contract before coding

Create a concise implementation contract containing:

- entity fields, types, nullability, constraints, relationships, and server-owned fields;
- backend route and HTTP methods;
- create/update request DTOs;
- detail/list response DTOs;
- pagination/search/filter/sort parameters and metadata;
- error and validation shape;
- authentication, roles, ownership, and delete semantics;
- Angular routes and required screens.

Use existing code as the source of truth. Resolve naming and type differences before implementation, especially C# nullable types, decimals, dates, enums, GUIDs, and pagination fields.

## 3. Implement backend first

Read and apply `$dotnet-crud-api` when it is installed. Otherwise follow these minimum requirements:

- implement the ASP.NET Core vertical slice using existing Controller/Minimal API, service, repository, DTO, validation, mapping, and EF Core patterns;
- add a safe migration and required indexes/constraints;
- enforce authentication, authorization, ownership, tenant, and server-owned fields;
- add Swagger/OpenAPI metadata and backend tests;
- build the backend and verify the final API contract.

Do not start Angular integration from an assumed contract when backend code can confirm it.

## 4. Implement Angular against the verified contract

Read and apply `$angular-crud-ui` when it is installed. Otherwise:

- add matching TypeScript request/response types;
- implement the API service, list, create/edit forms, routing, delete confirmation, loading, empty, and error states;
- match standalone/NgModule, forms, UI library, auth interceptor, and state patterns already used;
- mirror backend validation for UX while preserving backend authority;
- add Angular tests and build the frontend.

## 5. Integrate both sides

Verify explicitly:

- Angular base URL reaches the ASP.NET Core route;
- development proxy or CORS permits only intended origins;
- credentials/token behavior is compatible;
- request JSON names and value formats match DTOs;
- `decimal`, date/time, enum, GUID, boolean, and nullable values round-trip correctly;
- pagination indexes, page size, total count, search, filter, and sort names agree;
- backend validation appears correctly in Angular forms;
- create, list, get/edit, update, and delete flows behave consistently;
- `401`, `403`, `404`, `409`, and validation failures have useful UI handling.

Never solve an integration problem by weakening authentication, disabling validation, or opening CORS broadly.

## 6. Verification order

Run the repository's actual commands in this order when practical:

1. targeted backend tests;
2. `dotnet build` and broader `dotnet test`;
3. Angular lint/tests;
4. Angular production build;
5. available end-to-end, smoke, or startup checks.

If services cannot be launched in the current environment, still verify route registration, compile-time contracts, service tests, controller tests, and configuration. Report exactly what was and was not executed.

## Optional multi-agent workflow

Use subagents only when the user explicitly requests them.

Recommended ownership:

1. **Explorer:** map both apps and produce the contract without editing.
2. **Backend worker:** own ASP.NET Core and database files.
3. **Frontend worker:** start after the contract is verified and own Angular files.
4. **Reviewer:** inspect contract drift, security, CORS, validation, and missing tests in read-only mode.
5. **Main agent:** apply justified fixes and run final checks.

Do not let multiple workers edit the same files concurrently.

## Definition of done

The feature is done when backend and frontend build, the contract matches in both directions, migration and validation are safe, authorization and CORS remain secure, CRUD states are handled in the UI, relevant tests pass or blockers are explicit, and unrelated code remains untouched.

## Final report

Return:

1. **End-to-end behavior implemented**
2. **Backend files and migration**
3. **Angular files and routes**
4. **Final API contract**
5. **Authentication, CORS, and validation**
6. **Commands run and results**
7. **Remaining manual checks or blockers**
