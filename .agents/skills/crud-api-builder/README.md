# CRUD API Builder skill for Codex

## Install for one repository

Copy this folder to:

```text
<repository>/.agents/skills/crud-api-builder/
```

Expected layout:

```text
.agents/
└── skills/
    └── crud-api-builder/
        ├── SKILL.md
        └── agents/
            └── openai.yaml
```

## Install for all repositories

Copy the folder to:

```text
$HOME/.agents/skills/crud-api-builder/
```

On Windows PowerShell, `$HOME` normally points to your user profile directory.

## Invoke in Codex

Explicit invocation:

```text
Use $crud-api-builder to create CRUD API for Product with fields:
Name, Description, Price, StockQuantity and CategoryId.
Use the database and conventions already present in this repository.
```

Multi-agent invocation:

```text
Use $crud-api-builder and a multi-agent workflow.
Have an explorer map the existing backend architecture, a worker implement Product CRUD,
and a reviewer check security, correctness and tests. Then run final verification.
```

## Useful prompt template

```text
Use $crud-api-builder to build CRUD API for <Resource>.

Fields:
- <field>: <type>, <constraints>

Requirements:
- Route: /api/<resources>
- Database: follow the existing project
- Auth: <public/authenticated/roles>
- Delete: <soft/hard>
- List: <pagination/filter/search/sort>
- Include migration, validation, tests and Swagger/OpenAPI docs
- Do not change unrelated files
```
