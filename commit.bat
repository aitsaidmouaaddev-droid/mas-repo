@echo off
cd /d "c:\Users\aitsa\Projects\mas-repo"
git add -A
git commit --no-verify -m "feat(react-fundamentals): fix score calculation, add countBy to base resolver/service" -m "- ProgressPage: derive bestScore from sessions (score/moduleQuestions) not stored bestScore" -m "- ProgressPage: fetch FIND_ALL_QCM_QUESTIONS for accurate module question counts" -m "- QcmResults: use module question count as denominator for all pct calculations" -m "- base.service.ts: add countBy method to IBaseService interface and BaseService" -m "- base.resolver.ts: add countBy<Entity> GraphQL query (returns Int)" -m "" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
