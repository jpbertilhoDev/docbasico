#!/usr/bin/env python3
"""
Script para corrigir TODAS as ocorrências de supabase.from() nos arquivos API
Adiciona cast 'as any' para resolver erros de TypeScript
"""

import os
import re
from pathlib import Path

# Diretório raiz do projeto
PROJECT_ROOT = Path(r"c:\Users\jpber\Documents\docbasico")
APP_API_DIR = PROJECT_ROOT / "app" / "api"

def fix_supabase_import(content):
    """
    Substitui todas ocorrências de:
      supabase.from('table') -> (supabase.from('table') as any)
      supabase.from("table") -> (supabase.from("table") as any)
    
    Mas NÃO substitui se já tiver ' as any)' depois
    """
    
    # Padrão com aspas simples: supabase.from('...')
    pattern1 = r"supabase\.from\('([^']+)'\)(?!\s*as\s+any)"
    replacement1 = r"(supabase.from('\1') as any)"
    content = re.sub(pattern1, replacement1, content)
    
    # Padrão com aspas duplas: supabase.from("...")
    pattern2 = r'supabase\.from\("([^"]+)"\)(?!\s*as\s+any)'
    replacement2 = r'(supabase.from("\1") as any)'
    content = re.sub(pattern2, replacement2, content)
    
    return content

def main():
    print("Corrigindo arquivos Supabase TypeScript...")
    print(f"Diretorio: {APP_API_DIR}")
    print("")
    
    files_fixed = 0
    files_skipped = 0
    total_replacements = 0
    
    # Buscar todos .ts e .tsx em app/api recursivamente
    for file_path in APP_API_DIR.rglob("*.ts"):
        # Pular arquivos .d.ts
        if file_path.name.endswith('.d.ts'):
            continue
            
        try:
            # Ler conteúdo
            with open(file_path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            # Checar se tem supabase.from
            if 'supabase.from(' not in original_content:
                continue
            
            # Aplicar correções
            fixed_content = fix_supabase_import(original_content)
            
            # Checar se houve mudanças
            if fixed_content == original_content:
                print(f"Ja corrigido: {file_path.relative_to(PROJECT_ROOT)}")
                files_skipped += 1
                continue
            
            # Contar substituições
            replacements = original_content.count('supabase.from(') - fixed_content.count('supabase.from(')
            total_replacements += abs(replacements)
            
            # Salvar arquivo corrigido
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            
            print(f"Corrigido: {file_path.relative_to(PROJECT_ROOT)} ({abs(replacements)} ocorrências)")
            files_fixed += 1
            
        except Exception as e:
            print(f"ERRO em {file_path.relative_to(PROJECT_ROOT)}: {e}")
    
    print("")
    print("=" * 60)
    print("CONCLUIDO!")
    print(f"Arquivos corrigidos: {files_fixed}")
    print(f"Arquivos ja OK: {files_skipped}")
    print(f"Total de substituicoes: {total_replacements}")
    print("=" * 60)
    print("")
    print("Proximo passo: npm run build")

if __name__ == "__main__":
    main()
