# Angular + ASP.NET Core CRUD skills for Codex

This bundle contains three focused Codex skills:

| Skill | Use it when |
|---|---|
| `$dotnet-crud-api` | Only the ASP.NET Core API/database should change |
| `$angular-crud-ui` | Only the Angular frontend should change |
| `$angular-dotnet-fullstack-crud` | Both backend and frontend should change together |

## Install in one repository

Copy the included `.agents` folder into the repository root:

```text
<repository>/
├── .agents/
│   └── skills/
│       ├── dotnet-crud-api/
│       ├── angular-crud-ui/
│       └── angular-dotnet-fullstack-crud/
├── Backend/                 # example
└── Frontend/                # example
```

Codex discovers repository skills under `.agents/skills` from the current working directory up to the repository root.

## Install for all repositories

Copy the three skill folders to:

```text
$HOME/.agents/skills/
```

On Windows this is normally:

```text
C:\Users\<your-user>\.agents\skills\
```

Restart Codex if newly added skills do not appear. In the CLI or IDE, use `/skills` or type `$` to select a skill.

## Recommended repository layout

The skills do not require these exact folder names. They inspect the repository first.

```text
MySolution/
├── .agents/skills/...
├── MySolution.sln
├── Backend/
│   ├── Api/
│   └── Tests/
└── Frontend/
    ├── angular.json
    └── src/
```

## Prompt: backend only

```text
Use $dotnet-crud-api to implement Product CRUD.

Fields:
- Id: int, database generated
- Name: string, required, max 150
- Price: decimal, greater than 0
- StockQuantity: int, minimum 0
- CategoryId: int, required foreign key

Requirements:
- Follow existing ASP.NET Core and EF Core conventions.
- Add pagination, search by name, filter by category, and sort by price.
- Add migration, validation, authorization, tests, and Swagger.
- Return the exact Angular-ready API contract.
- Do not modify Angular files or unrelated code.
```

## Prompt: Angular only

```text
Use $angular-crud-ui to implement the Product CRUD interface.

Requirements:
- Read the existing Swagger/OpenAPI or ASP.NET Core DTOs before coding.
- Add list, create, edit, and delete flows.
- Add search, category filter, price sorting, and pagination.
- Follow the existing standalone/NgModule, Reactive Forms, UI, routing, and auth patterns.
- Handle loading, empty, validation, 401, 403, 404, 409, and network errors.
- Run the existing Angular lint, test, and build scripts.
- Do not modify backend files.
```

## Prompt: full-stack

```text
Use $angular-dotnet-fullstack-crud to implement Product CRUD end to end.

Fields:
- Id: int, database generated
- Name: string, required, max 150
- Description: string, optional
- Price: decimal, greater than 0
- StockQuantity: int, minimum 0
- CategoryId: int, required foreign key

Requirements:
- Follow the existing Angular and ASP.NET Core architecture.
- Backend: EF Core migration, DTOs, validation, authorization, Swagger, and tests.
- Frontend: typed API service, list, create/edit form, delete confirmation, routes, validation, loading/error states, and tests.
- Add pagination, search by name, category filter, and price sorting.
- Verify API URL, CORS or proxy, auth token flow, DTO field names, errors, and pagination on both sides.
- Run relevant backend and frontend checks.
- Do not modify unrelated files.
```

## Prompt: explicit multi-agent mode

```text
Use $angular-dotnet-fullstack-crud with a multi-agent workflow.
Spawn an explorer to map both applications and define the contract.
Then use separate backend and frontend workers with non-overlapping file ownership.
After implementation, spawn a read-only reviewer for contract drift, security,
CORS, validation, and tests. Wait for all agents, apply justified fixes, and run final verification.
```

## Design notes

- Each skill has one narrow job so Codex can match it reliably.
- The backend skill always emits an Angular-ready API contract.
- The Angular skill treats the real backend contract as the source of truth.
- The full-stack skill implements backend first, then Angular, and verifies integration.
- Subagents are optional and should be requested explicitly.
