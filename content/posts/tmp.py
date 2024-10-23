import os

# 指定要替换的目录和字符串
directory = 'D:\Myblog\Satori5ama.github.io\content\posts'
old_string = 'cdn.jsdmirror.com'
new_string = 'cdn.jsdelivr.net'

# 遍历目录中的所有文件
for filename in os.listdir(directory):
    if filename.endswith('.md'):  # 只处理 .txt 文件
        file_path = os.path.join(directory, filename)
        
        # 读取文件内容
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # 替换字符串
        content = content.replace(old_string, new_string)
        
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(content)

print("替换完成！")
