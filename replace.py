import os
import glob
import re

files = glob.glob('*.html') + glob.glob('*.css') + glob.glob('assets/*.css') + glob.glob('assets/*.js')

replacements = [
    (r'#f59e0b', '#7dd3fc'),
    (r'#F59E0B', '#7dd3fc'),
    (r'#f39c12', '#7dd3fc'),
    (r'#F39C12', '#7dd3fc'),
    (r'#ff9800', '#7dd3fc'),
    (r'#FF9800', '#7dd3fc'),
    (r'#ff8c00', '#7dd3fc'),
    (r'#FF9933', '#7dd3fc'),
    (r'#FBBF24', '#7dd3fc'),
    (r'#fbbf24', '#7dd3fc'),
    (r'#D9720F', '#7dd3fc'),
    (r'#F0954A', '#7dd3fc'),
    (r'#ff7a00', '#7dd3fc'),
    (r'rgba\(245,\s*158,\s*11,', 'rgba(125, 211, 252,'),
    (r'rgba\(249,\s*115,\s*22,', 'rgba(125, 211, 252,'),
    (r'rgba\(255,\s*120,\s*0,', 'rgba(125, 211, 252,'),
    (r'#FBE7D2', '#e0f2fe'),
    (r'#fef5e7', '#e0f2fe'),
    (r'#2E2013', '#0c4a6e'),
    (r'#e67e22', '#38bdf8'),
    (r'#f6d365', '#38bdf8'),
    (r'#fda085', '#3b82f6'),
]

for f in files:
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
            
        new_content = content
        for old, new in replacements:
            new_content = re.sub(old, new, new_content, flags=re.IGNORECASE)
            
        if content != new_content:
            with open(f, 'w', encoding='utf-8') as file:
                file.write(new_content)
    except Exception as e:
        print(f"Error processing {f}: {e}")
