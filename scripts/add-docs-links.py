import re

module_id_to_url = {
    'b2000000-0000-4000-8000-000000000001': 'https://en.wikipedia.org/wiki/Data_structure',
    'b2000000-0000-4000-8000-000000000002': 'https://en.wikipedia.org/wiki/Sorting_algorithm',
    'b2000000-0000-4000-8000-000000000003': 'https://en.wikipedia.org/wiki/Backtracking',
    'b2000000-0000-4000-8000-000000000004': 'https://en.wikipedia.org/wiki/Dynamic_programming',
    'b2000000-0000-4000-8000-000000000005': 'https://en.wikipedia.org/wiki/Graph_traversal',
    'd4000000-0000-4000-8000-000000000001': 'https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick',
    'd4000000-0000-4000-8000-000000000002': 'https://nodejs.org/api/modules.html',
    'd4000000-0000-4000-8000-000000000003': 'https://nodejs.org/api/fs.html',
    'd4000000-0000-4000-8000-000000000004': 'https://nodejs.org/en/learn/asynchronous-work/javascript-asynchronous-programming-and-callbacks',
    'd4000000-0000-4000-8000-000000000005': 'https://expressjs.com/en/starter/hello-world.html',
    'd4000000-0000-4000-8000-000000000006': 'https://nodejs.org/en/learn/getting-started/security-best-practices',
    'd4000000-0000-4000-8000-000000000007': 'https://node-postgres.com/',
    'd4000000-0000-4000-8000-000000000008': 'https://jestjs.io/docs/getting-started',
    'd4000000-0000-4000-8000-000000000009': 'https://nodejs.org/api/cluster.html',
    'd4000000-0000-4000-8000-00000000000a': 'https://nodejs.org/api/http.html',
    'd4000000-0000-4000-8000-00000000000b': 'https://docs.docker.com/guides/nodejs/containerize/',
    'd4000000-0000-4000-8000-00000000000c': 'https://nodejs.org/en/blog/release/v22.0.0',
    'e5000000-0000-4000-8000-000000000001': 'https://docs.nestjs.com/first-steps',
    'e5000000-0000-4000-8000-000000000002': 'https://docs.nestjs.com/providers',
    'e5000000-0000-4000-8000-000000000003': 'https://docs.nestjs.com/pipes',
    'e5000000-0000-4000-8000-000000000004': 'https://docs.nestjs.com/middleware',
    'e5000000-0000-4000-8000-000000000005': 'https://docs.nestjs.com/controllers',
    'e5000000-0000-4000-8000-000000000006': 'https://docs.nestjs.com/graphql/quick-start',
    'e5000000-0000-4000-8000-000000000007': 'https://docs.nestjs.com/security/authentication',
    'e5000000-0000-4000-8000-000000000008': 'https://docs.nestjs.com/techniques/database',
    'e5000000-0000-4000-8000-000000000009': 'https://docs.nestjs.com/microservices/basics',
    'e5000000-0000-4000-8000-00000000000a': 'https://docs.nestjs.com/fundamentals/testing',
    'e5000000-0000-4000-8000-00000000000b': 'https://docs.nestjs.com/techniques/configuration',
    'f6000000-0000-4000-8000-000000000001': 'https://www.postgresql.org/docs/current/tutorial-sql.html',
    'f6000000-0000-4000-8000-000000000002': 'https://www.postgresql.org/docs/current/queries-select-lists.html',
    'f6000000-0000-4000-8000-000000000003': 'https://www.postgresql.org/docs/current/queries-table-expressions.html',
    'f6000000-0000-4000-8000-000000000004': 'https://www.postgresql.org/docs/current/queries-with.html',
    'f6000000-0000-4000-8000-000000000005': 'https://www.postgresql.org/docs/current/tutorial-window.html',
    'f6000000-0000-4000-8000-000000000006': 'https://www.postgresql.org/docs/current/indexes.html',
    'f6000000-0000-4000-8000-000000000007': 'https://www.postgresql.org/docs/current/tutorial-transactions.html',
    'f6000000-0000-4000-8000-000000000008': 'https://www.postgresql.org/docs/current/ddl.html',
    'f6000000-0000-4000-8000-000000000009': 'https://www.postgresql.org/docs/current/functions-json.html',
    'f6000000-0000-4000-8000-00000000000a': 'https://www.postgresql.org/docs/current/ddl-alter.html',
}

files = [
    r'C:\Users\aitsa\Projects\mas-repo\apps\react-fundamentals\migrations\1773962100000-AddAlgorithmesQuestions.ts',
    r'C:\Users\aitsa\Projects\mas-repo\apps\react-fundamentals\migrations\1773962300000-AddNodeJsQuestions.ts',
    r'C:\Users\aitsa\Projects\mas-repo\apps\react-fundamentals\migrations\1773962301000-AddNodeJsQuestions2.ts',
    r'C:\Users\aitsa\Projects\mas-repo\apps\react-fundamentals\migrations\1773962400000-AddNestJsQuestions.ts',
    r'C:\Users\aitsa\Projects\mas-repo\apps\react-fundamentals\migrations\1773962401000-AddNestJsQuestions2.ts',
    r'C:\Users\aitsa\Projects\mas-repo\apps\react-fundamentals\migrations\1773962500000-AddSqlQuestions.ts',
    r'C:\Users\aitsa\Projects\mas-repo\apps\react-fundamentals\migrations\1773962501000-AddSqlQuestions2.ts',
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    current_module_id = None
    modified = 0
    result = []
    
    for line in lines:
        # Track moduleId
        m = re.search(r"moduleId:\s*'([^']+)'", line)
        if m:
            current_module_id = m.group(1)
        
        # Process explanation lines without docs
        if 'explanation:' in line and 'docs:' not in line and current_module_id:
            url = module_id_to_url.get(current_module_id)
            if url:
                # Replace the closing ' } } (with optional comma) at end of line
                new_line = re.sub(r"(' \} \}(,?)\s*)$", lambda x: f"', docs: '{url}' }} }}{x.group(2)}", line)
                if new_line != line:
                    modified += 1
                    line = new_line
        
        result.append(line)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(result))
    
    import os
    print(f"{os.path.basename(file_path)}: modified {modified} lines")
