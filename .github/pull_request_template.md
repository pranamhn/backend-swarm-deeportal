## Description

<!-- What does this PR do? -->

## Type

- [ ] feat: New feature
- [ ] fix: Bug fix
- [ ] docs: Documentation
- [ ] refactor: Code improvement
- [ ] test: Tests

## Checklist

### Code Quality
- [ ] TypeScript: `npx tsc --noEmit` passes (zero errors)
- [ ] Build: `npx tsc` succeeds
- [ ] No `any` types added without justification
- [ ] Error handling: all async calls wrapped in try/catch or `.catch()`

### Validation
- [ ] Zod schemas updated if new API fields added
- [ ] Conditional validation tested (social requires platforms[], investment requires predictionType)
- [ ] Edge cases: empty arrays, missing optional fields, invalid modes

### Database
- [ ] Drizzle schema updated if new tables/columns added
- [ ] Migration generated (`pnpm db:generate`) if schema changed
- [ ] No breaking changes to existing tables

### API
- [ ] New endpoints documented in openapi.json
- [ ] Error responses use AppError class (not raw errors)
- [ ] Rate limiting considered for new endpoints
- [ ] SSE streams properly cleaned up on client disconnect

### Dual-Mode Compatibility
- [ ] Works for both `social_sentiment` and `investment_prediction` modes
- [ ] Political election sub-type (candidates[], electionType, region) handled
- [ ] Mode router correctly dispatches to correct engine

### Security
- [ ] User input sanitized before AI prompts
- [ ] Auth check present (x-user-id header or middleware)
- [ ] No secrets, API keys, or tokens in code or logs

### Testing
- [ ] Unit tests for new scoring/formula logic
- [ ] Integration test for new API endpoint
- [ ] Manual test: create project → start simulation → view report → chat

### Performance
- [ ] No N+1 queries in new database code
- [ ] LLM calls have timeout and retry
- [ ] Large payloads streamed (SSE) not buffered

## Screenshots (if UI change)

<!-- Drag & drop screenshots here -->

## Related

- Closes #<!-- issue number -->
- Related to #<!-- issue number -->
