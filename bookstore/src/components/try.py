panel = '2311453915'
codes = ['0211', '639']

ans = []
for code in codes:
    for i in range(1, len(code)):
        index = int(code[:i])
        pattern = code[i:]

        if index + len(pattern) <= len(panel):
            if panel[index: index + len(pattern)] == pattern:
                ans.append(pattern)
                continue

        ans.append('not found')

print("Ans = ", ans)