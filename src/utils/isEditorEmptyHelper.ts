import type { Block } from "@blocknote/core";

type BlockContent = Block['content'];

const CONTENTLESS_BLOCK_TYPES = new Set([
    'file',
    'image',
    'video',
    'audio',
    'divider',
]);

export function isEditorEmptyHelper(blocks: Block[]): boolean {
    if (!blocks) {
        return true;
    }
    return blocks.every((block) => {
        if (CONTENTLESS_BLOCK_TYPES.has(block.type)) {
            return false;
        }
        return isContentEmpty(block.content) && isEditorEmptyHelper(block.children);
    })
}

function isContentEmpty(content: BlockContent | undefined): boolean {
    if (!content) {
        return true;
    }
    if (!Array.isArray(content)) {
        return false;
    }
    return content.every((item) => {
        // item : Link | StyledText | CustomInlineContent

        // StyledText
        if (!('content' in item) && item.type === 'text') {
            return item.text.trim().length === 0;
        }
        // Link | CustomInlineContent
        if ('content' in item && Array.isArray(item.content)) {
            return item.content.every((child) => {
                return child.text.trim().length === 0;
            })
        }
        return false;
    })
}