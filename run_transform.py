#!/usr/bin/env python3
import subprocess
import sys

result = subprocess.run([
    sys.executable, '-c',
    'import subprocess; subprocess.run(["node", r"C:\\Users\\aitsa\\Projects\\mas-repo\\transform_migrations.js"])'
], capture_output=False, text=True)

sys.exit(result.returncode)
