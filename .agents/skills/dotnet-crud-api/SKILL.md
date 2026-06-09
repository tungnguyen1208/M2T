---
name: dotnet-crud-api
description: Build or extend a CRUD REST API in an existing ASP.NET Core project using its current EF Core, DTO, validation, authentication, testing, and Swagger conventions. Use for backend-only .NET API work. Do not use for Angular UI implementation or non-.NET backends.
---

# ASP.NET Core CRUD API

Implement one complete, production-ready CRUD vertical slice in the existing ASP.NET Core backend.

## Boundaries

- Work only in the ASP.NET Core backend unless a tiny solution-level change is required.
- Do not create Angular components or services.
- Do not replace the project's architecture, ORM, authentication system, test framework, or naming conventions.
- Do not introduce Repository or Service layers when the project does not already use them.
- Do not reset, drop, or seed a real database unless explicitly requested.

## 1. Inspect before editing

1. Read applicable `AGENTS.md` and `AGENTS.override.md` files.
2. Locate the `.sln`, relevant `.csproj`, `Program.cs`, configuration files, `DbContext`, migrations, controllers or endpoints, DTOs, services, mapping code, and tests.
3. Inspect one or two existing CRUD resources and copy the repository's preferred pattern.
4. Identify:
   - Controllers versus Minimal APIs;
   - EF Core provider and migration project;
   - DataAnnotations versus FluentValidation;
   - AutoMapper, Mapster, or manual mapping;
   - authentication, authorization, ownership, and role policies;
   - response/error envelope and pagination format;
   - Swagger/OpenAPI and test setup.
5. Check the working tree and preserve unrelated user changes.

## 2. Establish the API contract

Before implementation, determine:

- entity/resource name and route;
- field types, nullability, defaults, lengths, ranges, uniqueness, and relationships;
- server-owned fields such as IDs, timestamps, owners, roles, and computed values;
- create, update, detail, list, and pagination DTO shapes;
- search, filter, sort, and pagination query parameters;
- authorization and delete behavior;
- success and error status codes.

Follow existing routes. Otherwise prefer:

| Operation | Route | Expected result |
|---|---|---|
| List | `GET /api/<resources>` | `200 OK` |
| Get | `GET /api/<resources>/{id}` | `200 OK` or `404` |
| Create | `POST /api/<resources>` | `201 Created` |
| Update | `PUT /api/<resources>/{id}` | existing project convention |
| Delete | `DELETE /api/<resources>/{id}` | `204 No Content` |

Use the project's standard `400`, `401`, `403`, `404`, and `409` behavior.

## 3. Implement the vertical slice

Add only the layers required by the current architecture:

- entity and EF Core configuration;
- `DbSet` registration when needed;
- safe migration;
- separate create/update request DTOs;
- response/list DTOs;
- mapping;
- controller or Minimal API handlers;
- service/repository code only when already conventional;
- dependency injection and route registration;
- Swagger/OpenAPI metadata;
- automated tests.

Never bind writable persistence entities directly to untrusted request bodies when that exposes server-owned fields or enables over-posting.

## 4. EF Core and query rules

- Preserve existing data and avoid destructive migrations.
- Add database constraints and indexes when justified.
- Validate foreign keys and translate meaningful conflicts consistently.
- Use async EF Core APIs and pass cancellation tokens where the codebase does.
- Use `AsNoTracking()` for read-only queries when appropriate.
- Avoid N+1 queries and unnecessary `Include` calls.
- Use allowlists for sortable/filterable fields.
- Apply deterministic ordering and bounded page sizes.
- Respect soft-delete, tenant, ownership, and concurrency patterns already present.

## 5. Validation and security

- Match DataAnnotations or FluentValidation already installed.
- Validate required values, lengths, ranges, formats, enums, relationships, uniqueness, and cross-field rules.
- Keep backend validation authoritative even when Angular also validates.
- Reuse existing authentication and authorization policies.
- Enforce ownership and tenant boundaries in data queries when possible.
- Do not expose password hashes, tokens, secrets, stack traces, raw database errors, or internal audit fields.
- Do not weaken CORS. When Angular requires access, add only the configured origin and never combine wildcard origins with credentials.

## 6. Tests and verification

Cover the repository's applicable cases:

- create success and validation failure;
- list, search, filter, sort, and pagination;
- get success and `404`;
- update success, validation failure, and missing resource;
- delete success and conflict behavior;
- authentication, authorization, ownership, uniqueness, and foreign-key rules.

Discover commands from the repository. Run relevant commands such as:

```text
dotnet format --verify-no-changes
dotnet build
dotnet test
dotnet ef migrations list
```

Use the correct solution, project, startup project, configuration, and migration command for this repository. Never claim a command passed unless it ran successfully.

## 7. Return an Angular-ready contract

End with a concise contract that a frontend can consume:

- base route and methods;
- query parameters;
- create/update request examples;
- detail/list response shapes;
- pagination metadata;
- validation/error shape;
- authentication requirements.

## Definition of done

The resource is complete when routes are registered, schema and migration agree, unsafe writes are blocked, authorization is enforced, tests cover key behavior, Swagger is updated, relevant checks pass or blockers are reported, and no unrelated files were changed.

## Final report

Return:

1. **Implemented**
2. **Files changed**
3. **Database migration**
4. **API contract**
5. **Validation and security**
6. **Commands run and results**
7. **Assumptions or blockers**
