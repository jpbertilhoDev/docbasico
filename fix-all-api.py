import os
import re

api_dir = r'c:\Users\jpber\Documents\docbasico\app\api'
count = 0

for root, dirs, files in os.walk(api_dir):
    for file in files:
        if file.endswith('.ts'):
            path = os.path.join(root, file)
            
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if 'supabase' not in content or '.from(' not in content:
                continue
            
            original = content
            
            # Replace: await supabase\n.from('X') with await (supabase.from('X') as any)
            content = re.sub(
                r"(\bawait\s+)supabase\s*\.\s*from\s*\(\s*'([^']+)'\s*\)",
                r"\1(supabase.from('\2') as any)",
                content
            )
            
            content = re.sub(
                r'(\bawait\s+)supabase\s*\.\s*from\s*\(\s*"([^"]+)"\s*\)',
                r'\1(supabase.from("\2") as any)',
                content
            )
            
            if content != original:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Fixed: {os.path.relpath(path, api_dir)}')
                count += 1

print(f'\nTotal: {count} files fixed')
