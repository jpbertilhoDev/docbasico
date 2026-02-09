import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'supabase.from(' not in content:
        return False
    
    original = content
    
    # Fix single quotes
    content = re.sub(r"supabase\.from\('([^']+)'\)(?!\s*as\s+any)", r"(supabase.from('\1') as any)", content)
    
    # Fix double quotes  
    content = re.sub(r'supabase\.from\("([^"]+)"\)(?!\s*as\s+any)', r'(supabase.from("\1") as any)', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

fixed = 0
for root, dirs, files in os.walk(r'c:\Users\jpber\Documents\docbasico\app\api'):
    for file in files:
        if file.endswith('.ts'):
            filepath = os.path.join(root, file)
            if fix_file(filepath):
                print(f'Fixed: {filepath}')
                fixed += 1

print(f'\nTotal fixed: {fixed}')
