import type { Block, BlockNoteEditor } from "@blocknote/core";
import type { ArticlePublishPreview } from "../types/article";

type BlockContent = Block['content'];

const CONTENTLESS_BLOCK_TYPES = new Set([
    'file',
    'image',
    'video',
    'audio',
    'divider',
]);

export function isEditorEmpty(blocks: Block[]): boolean {
    if (!blocks) {
        return true;
    }
    return blocks.every((block) => {
        if (CONTENTLESS_BLOCK_TYPES.has(block.type)) {
            return false;
        }
        return isContentEmpty(block.content) && isEditorEmpty(block.children);
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

export function buildArticlePreview(editor: BlockNoteEditor): ArticlePublishPreview {
    const [headingBlock, ...contentBlocks] = editor.document;
    const headingMarkdown = editor.blocksToMarkdownLossy([headingBlock]);
    const title = headingMarkdown.replace('#', '').trim();
    const subtitle = getSubtitle(contentBlocks);
    const coverImage = getImages(contentBlocks);

    return ({
        title,
        subtitle,
        content: JSON.stringify(editor.document),
        coverImage
    });
}

export function getTitle(editor: BlockNoteEditor, blocks: Block[]) {
    const headingBlock = blocks[0];
    if (headingBlock.type === 'heading') {
        const headingMarkdown = editor.blocksToMarkdownLossy([headingBlock]);
        const title = headingMarkdown.replace('#', '').trim();
        return title;
    }
    return '';
}

export function buildArticleContent(editor: BlockNoteEditor) {
    return ({
        content: JSON.stringify(editor.document)
    });
}

function getImages(contentBlocks: Block[]) {
    const images = contentBlocks.map((block) => {
        if (block.type === 'image') {
            return block.props.url;
        }
        return '';
    }).filter(image => image);

    return images;
}

function getSubtitle(contentBlocks: Block[], maxLength = 100) {
    let subtitle = '';
    subtitle = contentBlocks.map((block) => {
        let ownText = '';
        let childrenText = '';
        // is InlineContent type
        if (Array.isArray(block.content)) {
            ownText = block.content.map((inlineContent) => {
                // is StyledText type
                if (inlineContent.type === 'text') {
                    return inlineContent.text;
                }
                // is Link type
                if (inlineContent.type === 'link') {
                    if (Array.isArray(inlineContent.content)) {
                        return inlineContent.content.map((styledText) => {
                            return styledText.text ?? '';
                        }).join(' ');
                    }
                }
                return '';
            }).join(' ');
        }
        if (Array.isArray(block.children)) {
            childrenText = getSubtitle(block.children, maxLength);
        }
        return `${ownText} ${childrenText}`.trim();
    }).join(' ').replace(/\s+/g, ' ').trim();

    return subtitle.length > maxLength ? subtitle.slice(0, maxLength).trim() + '...' : subtitle;
}