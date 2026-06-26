1. `pnpm create vite` and choose `TypeScript + React Compiler`.

2. Remove unnecessary dependencies.

3. `pnpm i`.

4. Configure [Tanstack Router](https://tanstack.com/router/latest/docs/installation/manual).

5. Configure [Tailwindcss](https://tailwindcss.com/docs/installation/using-vite).

6. Configure [daisyUI](https://daisyui.com/docs/install/).

7. Configure [jotai](https://jotai.org/).

8. Configure [sonner](https://sonner.emilkowal.ski/).

## TopicInput.tsx

### TopicInput 功能测试表

| 序号 | 场景 | 操作 | 预期结果 | 说明 |
|---|---|---|---|---|
| 1 | 正常输入英文 | 输入 `react` | 不报错；候选值进入 `candidateField` | `TopicCandidateSchema` 合法 |
| 2 | 正常输入中文 | 输入 `前端` | 不报错；候选值进入 `candidateField` | 支持 Unicode 字母 |
| 3 | 输入非法字符 | 输入 `react!` 或 `java@` | 显示错误 `Tags only support letters, numbers, spaces and dashes.` | 不请求建议 |
| 4 | 输入超过 25 字符 | 输入长度 26+ | 显示错误 `A tag name must be 25 characters max.` | 不请求建议 |
| 5 | 合法输入后请求建议 | 输入 `jaav` | 触发 `getTopicSuggestion` 请求 | 300ms debounce 后请求 |
| 6 | 下拉未出现且按 Enter | 连续输入 `jaav` 但后端未立即返回，按 `Enter` | 阻止父表单提交；不自动选择建议 | 当前实现已 preventDefault |
| 7 | 下拉出现后按 Enter | 输入产生建议并显示下拉后按 `Enter` | 选择第一个建议加入 `topics`；输入框清空；下拉关闭 | 例如 `javascript` |
| 8 | 点击建议加入 | 点击某条建议 | 该建议进入 `topics`；候选输入清空；下拉关闭 | 重复建议不加入 |
| 9 | 重复建议保护 | 已有 `javascript`，再次选择 `javascript` | 不能重复加入 | `topicsField.state.value.includes` 保护 |
| 10 | 取消输入后隐藏下拉 | 输入后 blur | 取消 pending debounce；候选输入清空；下拉关闭 | `handleInputChange.cancel()` |
| 11 | 空输入不显示下拉 | 清空输入框 | 下拉隐藏 | `isDropdownShow=false` |
| 12 | 添加 tag 后继续输入 | 已添加一个 tag，继续输入新词 | 仍可请求建议 | `topicsField.state.value.length < max` |
| 13 | 超过最大 tag 数 | 已添加 5 个 tags | 输入框应该不可见或不能再添加 | UI 上最多 5 个 |
| 14 | 选择建议后 candidate 清空 | 通过点击建议或 Enter 选中建议 | `candidateField.handleChange('')` 生效 | 输入框显示空 |
| 15 | 失焦后保留已有 tags | 已添加 tags，输入框失焦 | 已有 tags 不变 | 仅清空临时候选输入 |


