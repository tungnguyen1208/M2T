---
name: crud-api-builder
description: Build or extend a production-ready REST CRUD API for an entity or resource in an existing backend project. Use for create, read, update, delete endpoints, DTOs, validation, database changes, tests, and OpenAPI documentation. Do not use for frontend-only work, GraphQL-only APIs, or database-only schema tasks.
---

# CRUD API Builder

Build a complete, consistent, and testable REST CRUD vertical slice for the requested resource.

## Primary goal

Implement the requested CRUD API so that it:

- follows the repository's existing architecture and naming conventions;
- preserves backward compatibility unless the user explicitly requests a breaking change;
- validates all untrusted input;
- returns predictable HTTP status codes and response bodies;
- includes database changes, automated tests, and API documentation when the project supports them;
- passes the project's relevant build, lint, type-check, and test commands.

## Required inputs

Use the user's prompt and repository as the source of truth. Determine, when available:

- resource or entity name;
- fields, types, required fields, defaults, and constraints;
- relationships and ownership rules;
- database or persistence mechanism;
- authentication and authorization requirements;
- desired endpoint prefix and API version;
- pagination, filtering, sorting, and search requirements;
- soft-delete versus hard-delete behavior.

When information is missing, inspect the repository and choose the option most consistent with existing code. Do not stop for clarification unless two plausible choices would create materially different public behavior or destructive data changes.

## Workflow

### 1. Load repository instructions

Before editing:

1. Read all applicable `AGENTS.md` and `AGENTS.override.md` files.
2. Inspect the project manifest and framework configuration.
3. Locate one or two existing resources that best represent the preferred CRUD pattern.
4. Identify the database layer, migration system, validation library, authentication system, test framework, and API documentation setup.
5. Check the working tree and avoid overwriting unrelated user changes.

### 2. Establish the API contract

Define the intended contract before implementation:

- route names and API version;
- request DTOs or schemas;
- response DTOs or serializers;
- validation and uniqueness rules;
- authorization policy;
- expected success and error status codes;
- pagination/filter/sort query parameters when listing can grow beyond a small fixed set.

Prefer plural, noun-based routes such as `/api/products`. Follow existing repository conventions when they differ.

Default endpoint behavior unless the repository or user specifies otherwise:

| Operation | Method and route | Success |
|---|---|---|
| List | `GET /api/<resources>` | `200 OK` |
| Get one | `GET /api/<resources>/{id}` | `200 OK` |
| Create | `POST /api/<resources>` | `201 Created` with resource and location when supported |
| Replace | `PUT /api/<resources>/{id}` | `200 OK` or `204 No Content`, matching the project |
| Partial update | `PATCH /api/<resources>/{id}` | `200 OK` or `204 No Content`, only when requested or already conventional |
| Delete | `DELETE /api/<resources>/{id}` | `204 No Content` |

Use `400` for malformed or invalid input, `401` for unauthenticated access, `403` for forbidden access, `404` for missing resources, and `409` for relevant uniqueness or state conflicts.

### 3. Implement the smallest complete vertical slice

Modify only the layers needed by the repository's architecture. Typical files may include:

- entity/model/schema;
- migration;
- create/update request DTOs or validation schemas;
- response DTO/serializer;
- repository/data-access code if the project already uses that abstraction;
- service/use-case code if business logic belongs there;
- controller/router/handler;
- route or dependency-registration changes;
- tests;
- OpenAPI/Swagger metadata or examples.

Do not introduce a new architectural layer merely because it is common elsewhere. Reuse existing abstractions and utilities.

### 4. Data and migration rules

- Preserve existing data and defaults.
- Add database-level constraints for invariants that must remain true outside the API.
- Add indexes for identifiers, foreign keys, unique fields, and frequent query predicates when justified.
- Avoid destructive migration operations unless explicitly requested.
- Never delete or reset a real database.
- Generate migrations using the project's normal tool when possible.
- Review generated migrations before running them.
- Do not commit secrets or hard-coded connection strings.

### 5. DTO and validation rules

- Do not bind persistence entities directly to untrusted request bodies when that permits over-posting.
- Separate create and update inputs when required fields differ.
- Validate required fields, lengths, ranges, formats, enum values, foreign-key references, and cross-field rules.
- Normalize input only when existing behavior supports it.
- Return the project's standard validation error format.
- Never allow clients to set server-owned fields such as IDs, audit fields, ownership, roles, or computed values unless explicitly intended.

### 6. Query behavior

For list endpoints:

- avoid unbounded reads for tables expected to grow;
- apply pagination using the project's established style;
- validate page size and cap it to a reasonable maximum consistent with the codebase;
- use deterministic ordering;
- apply filtering and sorting through allowlists, not raw client-provided column or SQL fragments;
- avoid N+1 queries and unnecessary eager loading;
- return pagination metadata when the project already does so.

### 7. Update and delete behavior

- Check existence before reporting success.
- Respect optimistic concurrency, version fields, or ETags when already used.
- For `PUT`, follow the repository's current replacement semantics.
- For `PATCH`, use a safe supported patch format and validate the resulting object.
- Apply soft delete when the project uses soft delete; otherwise use hard delete.
- Handle foreign-key conflicts with a clear `409` or the repository's standard domain error.
- Make repeated delete behavior consistent with neighboring endpoints.

### 8. Security requirements

- Reuse the existing authentication and authorization middleware.
- Enforce resource ownership and tenant boundaries in the query itself when possible.
- Prevent mass assignment and privilege escalation.
- Do not expose secrets, password hashes, internal tokens, or sensitive audit data.
- Use parameterized queries or the framework ORM safely.
- Do not leak stack traces or raw database errors through API responses.
- Preserve existing rate limits, CSRF rules, CORS policy, and security headers.

### 9. Testing requirements

Add tests that fit the repository's current testing strategy. Cover at least:

1. successful create;
2. create validation failure;
3. successful list;
4. successful get by ID;
5. missing resource returns `404`;
6. successful update;
7. update validation failure;
8. successful delete;
9. authentication/authorization behavior when protected;
10. uniqueness, ownership, tenant, or foreign-key conflicts when relevant.

Prefer integration or request-level tests for the HTTP contract. Add focused unit tests for non-trivial business rules. Keep tests deterministic and isolated.

### 10. Verification

Discover commands from project files instead of guessing. Run the narrowest relevant commands first, then the broader checks when practical:

- formatter or format check;
- lint;
- type-check or compile;
- targeted tests for the new resource;
- full relevant test suite;
- migration validation;
- application startup or route-generation check.

If a command fails because of the implementation, fix it and rerun. If it fails for an unrelated pre-existing reason, report the exact command and concise evidence. Never claim a check passed unless it actually ran successfully.

### 11. Documentation

Update the project's API documentation when present:

- OpenAPI/Swagger operations and schemas;
- authentication requirements;
- request and response examples;
- pagination/filter/sort parameters;
- migration or local setup notes;
- README endpoint summary when that is the repository convention.

## Framework adaptation

Follow existing project patterns first. Use these only as fallback guidance:

- **ASP.NET Core:** match Controllers versus Minimal APIs; use EF Core patterns already present; use request/response DTOs; use DataAnnotations or FluentValidation already installed; use xUnit/NUnit/MSTest as configured.
- **Node.js/TypeScript:** match Express, NestJS, Fastify, or other existing framework; reuse Prisma, TypeORM, Sequelize, Mongoose, or query-builder patterns already present; use Jest, Vitest, or the configured runner.
- **Spring Boot:** use existing controller/service/repository conventions, Bean Validation, JPA mappings, exception handling, and JUnit setup.
- **FastAPI:** use Pydantic request/response models, dependency-based authorization, SQLAlchemy/SQLModel patterns already present, and pytest.
- **Django REST Framework:** use serializers, viewsets or APIViews consistently, permissions, migrations, filters, and the configured test style.

Do not replace the project's framework, ORM, validation system, test runner, package manager, or architecture without explicit instruction.

## Optional subagent workflow

Use subagents only when the user explicitly requests a multi-agent workflow.

Recommended split:

1. an explorer maps the existing CRUD architecture and reports relevant files without editing;
2. a worker implements the vertical slice;
3. a reviewer checks correctness, security, consistency, and missing tests in read-only mode;
4. the main agent applies justified fixes and performs final verification.

Avoid multiple agents editing the same files concurrently.

## Definition of done

The task is complete only when all applicable items are true:

- routes are registered and reachable;
- schema/model and migration are consistent;
- input validation prevents invalid and unsafe writes;
- authentication, authorization, ownership, and tenant rules are enforced;
- expected status codes and error shapes match project conventions;
- automated tests cover happy paths and important failures;
- relevant build, lint, type-check, and tests pass, or unrelated blockers are clearly reported;
- API documentation is updated;
- no secrets, debug code, generated junk, or unrelated refactors were introduced.

## Final response format

Return a concise implementation report with:

1. **Implemented** — endpoints and behavior added;
2. **Files changed** — grouped by purpose;
3. **Database** — migration and schema impact;
4. **Validation and security** — key rules enforced;
5. **Verification** — exact commands run and results;
6. **Notes** — assumptions, compatibility concerns, or blockers.

Do not paste every changed file unless the user asks. Cite paths and important symbols so the work is easy to review.
