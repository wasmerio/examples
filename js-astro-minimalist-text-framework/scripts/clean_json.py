#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
JSON 清理程序
功能：
1. 读取 src/data/temp.json
2. 删除所有的 **
3. 将【】替换为**
4. 消除注释（包括// 和 /* */ 形式的注释）
5. 保存到 cleaned.json 中
"""

import json
import re
import os
from pathlib import Path

def clean_json_content(content):
    """
    清理JSON内容
    """
    # 1. 删除所有的 **
    content = content.replace('**', '')
    
    # 2. 将【和】替换为**
    content = content.replace('【', '**')
    content = content.replace('】', '**')
    
    # 3. 消除注释
    # 删除单行注释 //
    content = re.sub(r'//.*?$', '', content, flags=re.MULTILINE)
    
    return content

def clean_description_brackets(data):
    """
    递归清理JSON数据中description字段内的中文括号
    """
    if isinstance(data, dict):
        cleaned_data = {}
        for key, value in data.items():
            if key == "description" and isinstance(value, str):
                # 删除description字段中的中文括号及其内容
                cleaned_value = re.sub(r'（[^）]*）', '', value)
                cleaned_data[key] = cleaned_value
            else:
                # 递归处理其他字段
                cleaned_data[key] = clean_description_brackets(value)
        return cleaned_data
    elif isinstance(data, list):
        return [clean_description_brackets(item) for item in data]
    else:
        return data

def main():
    """
    主函数
    """
    # 设置文件路径
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    input_file = project_root / 'tmp' / 'temp.json'
    output_file = project_root / 'tmp' / 'cleaned.json'
    
    try:
        # 检查输入文件是否存在
        if not input_file.exists():
            print(f"错误：输入文件 {input_file} 不存在")
            return
        
        # 读取原始文件内容
        print(f"正在读取文件：{input_file}")
        with open(input_file, 'r', encoding='utf-8') as f:
            raw_content = f.read()
        
        print(f"原始文件大小：{len(raw_content)} 字符")
        
        # 第一步：清理内容（删除**、替换【】、删除注释）
        print("正在清理内容...")
        cleaned_content = clean_json_content(raw_content)
        
        print(f"清理后大小：{len(cleaned_content)} 字符")
        
        # 第二步：解析JSON并清理description字段中的括号
        try:
            # 解析JSON
            stripped_content = cleaned_content.strip()
            if stripped_content:
                json_data = json.loads(stripped_content)
                print("✓ JSON格式验证通过")
                
                # 清理description字段中的中文括号
                print("正在清理description字段中的中文括号...")
                cleaned_json_data = clean_description_brackets(json_data)
                
                # 转换回JSON字符串
                final_content = json.dumps(cleaned_json_data, ensure_ascii=False, indent=2)
            else:
                print("⚠ 警告：清理后内容为空")
                final_content = cleaned_content
        except json.JSONDecodeError as e:
            print(f"⚠ 警告：清理后的内容不是有效的JSON格式")
            print(f"JSON错误：{e}")
            print("将保存原始清理后的内容...")
            final_content = cleaned_content
        
        # 保存清理后的内容
        print(f"正在保存到：{output_file}")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_content)
        
        print("✓ 文件清理完成！")
        
        # 显示清理统计
        original_asterisks = raw_content.count('**')
        original_brackets = raw_content.count('【') + raw_content.count('】')
        
        print("\n清理统计：")
        print(f"- 删除的 ** 符号：{original_asterisks} 个")
        print(f"- 替换的【】符号：{original_brackets} 个")
        print(f"- 输出文件：{output_file}")
        
    except FileNotFoundError:
        print(f"错误：无法找到文件 {input_file}")
    except PermissionError:
        print(f"错误：没有权限访问文件")
    except Exception as e:
        print(f"错误：{str(e)}")

if __name__ == "__main__":
    main()
