import os
import re
from pathlib import Path

base_dir = Path(r'c:\Users\aitsa\Projects\mas-repo\apps\react-fundamentals\src\app\qcm')
routes_ts = Path(r'c:\Users\aitsa\Projects\mas-repo\apps\react-fundamentals\src\routes.ts')

# ── Import rewrite rules per file ─────────────────────────────────────────────
# Each entry: (old_path_in_qcm, new_path_in_qcm, {old_import: new_import, ...})

rewrites = {
    'QcmLayout.tsx': (
        'QcmLayout/QcmLayout.tsx',
        {},
    ),
    'QcmModulePage.tsx': (
        'QcmModulePage/QcmModulePage.tsx',
        {
            "'../../graphql/documents'": "'../../../graphql/documents'",
            '"../../graphql/documents"': '"../../../graphql/documents"',
            "'../../store'": "'../../../store'",
            '"../../store"': '"../../../store"',
        },
    ),
    'QcmModulePage.module.scss': ('QcmModulePage/QcmModulePage.module.scss', {}),
    'QcmModuleRoute.tsx': (
        'QcmModuleRoute/QcmModuleRoute.tsx',
        {
            "'../ToastContext'": "'../../ToastContext'",
            '"../ToastContext"': '"../../ToastContext"',
            "'../../graphql/documents'": "'../../../graphql/documents'",
            '"../../graphql/documents"': '"../../../graphql/documents"',
        },
    ),
    'QcmQuestionPage.tsx': (
        'QcmQuestionPage/QcmQuestionPage.tsx',
        {
            "'../../graphql/documents'": "'../../../graphql/documents'",
            '"../../graphql/documents"': '"../../../graphql/documents"',
            "'../DynamicBreadcrumbContext'": "'../../DynamicBreadcrumbContext'",
            '"../DynamicBreadcrumbContext"': '"../../DynamicBreadcrumbContext"',
        },
    ),
    'QcmQuestionPage.module.scss': ('QcmQuestionPage/QcmQuestionPage.module.scss', {}),
    'QcmResultsView.tsx': (
        'QcmResultsView/QcmResultsView.tsx',
        {
            "'../../graphql/documents'": "'../../../graphql/documents'",
            '"../../graphql/documents"': '"../../../graphql/documents"',
            "'../../store'": "'../../../store'",
            '"../../store"': '"../../../store"',
        },
    ),
    'QcmResultsView.module.scss': ('QcmResultsView/QcmResultsView.module.scss', {}),
    'QcmSessionRoute.tsx': (
        'QcmSessionRoute/QcmSessionRoute.tsx',
        {
            "'../ToastContext'": "'../../ToastContext'",
            '"../ToastContext"': '"../../ToastContext"',
            "'../../graphql/documents'": "'../../../graphql/documents'",
            '"../../graphql/documents"': '"../../../graphql/documents"',
        },
    ),
    'QcmSessionView.tsx': (
        'QcmSessionView/QcmSessionView.tsx',
        {
            "'../DynamicBreadcrumbContext'": "'../../DynamicBreadcrumbContext'",
            '"../DynamicBreadcrumbContext"': '"../../DynamicBreadcrumbContext"',
            "'../ToastContext'": "'../../ToastContext'",
            '"../ToastContext"': '"../../ToastContext"',
            "'./QcmResultsView'": "'../QcmResultsView/QcmResultsView'",
            '"./QcmResultsView"': '"../QcmResultsView/QcmResultsView"',
            "'./QcmQuestionPage.module.scss'": "'../QcmQuestionPage/QcmQuestionPage.module.scss'",
            '"./QcmQuestionPage.module.scss"': '"../QcmQuestionPage/QcmQuestionPage.module.scss"',
            "'../../graphql/documents'": "'../../../graphql/documents'",
            '"../../graphql/documents"': '"../../../graphql/documents"',
            "'../../store'": "'../../../store'",
            '"../../store"': '"../../../store"',
        },
    ),
    'qcm-module-select.tsx': (
        'QcmModuleSelect/qcm-module-select.tsx',
        {
            "'../../graphql/documents'": "'../../../graphql/documents'",
            '"../../graphql/documents"': '"../../../graphql/documents"',
            "'../ToastContext'": "'../../ToastContext'",
            '"../ToastContext"': '"../../ToastContext"',
        },
    ),
    'qcm-module-select.module.scss': ('QcmModuleSelect/qcm-module-select.module.scss', {}),
    'qcm-summary.tsx': (
        'QcmSummary/qcm-summary.tsx',
        {
            "'../../store'": "'../../../store'",
            '"../../store"': '"../../../store"',
        },
    ),
    'qcm-summary.module.scss': ('QcmSummary/qcm-summary.module.scss', {}),
    'qcm-view.tsx': (
        'QcmView/qcm-view.tsx',
        {
            "'../../store'": "'../../../store'",
            '"../../store"': '"../../../store"',
        },
    ),
    'qcm-view.module.scss': ('QcmView/qcm-view.module.scss', {}),
}

# ── routes.ts rewrites ────────────────────────────────────────────────────────

routes_rewrites = {
    "'./app/qcm/QcmLayout'":       "'./app/qcm/QcmLayout/QcmLayout'",
    '"./app/qcm/QcmLayout"':       '"./app/qcm/QcmLayout/QcmLayout"',
    "'./app/qcm/qcm-module-select'": "'./app/qcm/QcmModuleSelect/qcm-module-select'",
    '"./app/qcm/qcm-module-select"': '"./app/qcm/QcmModuleSelect/qcm-module-select"',
    "'./app/qcm/QcmSessionRoute'": "'./app/qcm/QcmSessionRoute/QcmSessionRoute'",
    '"./app/qcm/QcmSessionRoute"': '"./app/qcm/QcmSessionRoute/QcmSessionRoute"',
    "'./app/qcm/QcmSessionView'":  "'./app/qcm/QcmSessionView/QcmSessionView'",
    '"./app/qcm/QcmSessionView"':  '"./app/qcm/QcmSessionView/QcmSessionView"',
}

# ── Helper ────────────────────────────────────────────────────────────────────

def apply_rewrites(content: str, mapping: dict) -> str:
    for old, new in mapping.items():
        content = content.replace(old, new)
    return content

# ── Move files and update imports ─────────────────────────────────────────────

for src_name, (dst_rel, import_map) in rewrites.items():
    src_path = base_dir / src_name
    dst_path = base_dir / dst_rel
    dst_path.parent.mkdir(parents=True, exist_ok=True)

    if not src_path.exists():
        print(f'Warning: {src_name} not found, skipping')
        continue

    content = src_path.read_text(encoding='utf-8')
    if import_map:
        content = apply_rewrites(content, import_map)

    dst_path.write_text(content, encoding='utf-8')
    src_path.unlink()
    print(f'Moved: {src_name} -> {dst_rel}')

# ── Update routes.ts ──────────────────────────────────────────────────────────

if routes_ts.exists():
    content = routes_ts.read_text(encoding='utf-8')
    content = apply_rewrites(content, routes_rewrites)
    routes_ts.write_text(content, encoding='utf-8')
    print('Updated: routes.ts')

print('\nDone! All files reorganised and imports updated.')
