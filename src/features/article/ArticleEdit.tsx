import { Route as articleEditRoute } from "@/routes/_app/_protected/articles.edit.$articleId";
import EditorComponent from "@/ui/EditorComponent";
import Loading from "@/ui/Loading";
import { useCreateBlockNote } from "@blocknote/react";
import { useUpdateArticle, useCurrentArticle } from "./article";
import { useEffect, useRef, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { editorUpdateSignalAtom } from "@/atoms/editor";
import { buildArticleContent, getImagesFromEditor, isEditorEmpty } from "@/utils/editorHelper";
import type { ArticleUpdateRequest } from "@/types/article";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { Route as articleRoute } from "@/routes/_app/article.$articleId";
import { isDirtyAtom } from "@/atoms/article";
import { DotsThreeIcon } from "@phosphor-icons/react";
import Modal from "../../ui/ButtonModal";
import { uploadFile } from "../editor/editor";
import { ArticleSubmissionSchema, type ArticleSubmissionForm } from "@/schemas/article";
import { useForm, useStore } from "@tanstack/react-form";
import CoverImageInput from "./CoverImageInput";
import FieldInfo from "@/ui/FieldInfo";
import TopicInput from "@/ui/TopicInput";
import { toast } from "sonner";

export default function ArticleEdit() {
    const navigate = useNavigate();
    const setEditorUpdateSignal = useSetAtom(editorUpdateSignalAtom);
    const { articleId } = articleEditRoute.useParams();
    const editor = useCreateBlockNote({
        uploadFile: uploadFile
    }, []);

    const { processedArticle, isLoading, isError, error } = useCurrentArticle(articleId, editor, false);
    const article = processedArticle?.article;

    const editorUpdateSignal = useAtomValue(editorUpdateSignalAtom);

    const { handleUpdate } = useUpdateArticle();

    const defaultValues: ArticleSubmissionForm = {
        coverImage: article?.coverImage,
        coverFocusY: 0.5,
        title: article?.title ?? 'article is undefined',
        subtitle: article?.subtitle,
        topics: (article?.topics ?? []).map(item => item.name),
        topicCandidate: ''
    };
    const form = useForm({
        defaultValues: defaultValues,
        validators: {
            onChange: ArticleSubmissionSchema,
            onSubmit: ArticleSubmissionSchema
        },
    });

    // edit article base settings
    const canSubmit = useStore(form.store, (state) => state.canSubmit)
    async function onDone() {
        await form.handleSubmit();
        if (!form.state.isValid) {
            return;
        }
        setIsDirty(true);
    }
    // change cover image
    // cover image modal show and title/subtitle input show
    const [isImageArraryModalShow, setIsImageArraryModalShow] = useState(false);
    function getImagesNow() {
        const editorImages = getImagesFromEditor(editor);
        const mergedCoverImages = Array.from(
            new Set([...(article?.coverImage ? [article.coverImage] : []), ...editorImages])
        );
        return mergedCoverImages;
    }

    const [isDirty, setIsDirty] = useAtom(isDirtyAtom);
    const isSkipBlocker = useRef(false);

    // save initial article content 
    const initialContent = useRef<string | null>(null);
    useEffect(() => {
        setIsDirty(false);
        if (!isLoading && article) {
            initialContent.current = article.content;
        }
    }, [isLoading, article]);

    function handleEditorChange(changedEditor: typeof editor) {
        if (!initialContent.current) {
            return;
        }
        const currentContent = buildArticleContent(changedEditor).content;
        if (initialContent.current !== currentContent) {
            setIsDirty(true);
        }
    }

    // Jump Block
    useBlocker({
        shouldBlockFn: () => {
            if (!isDirty || isSkipBlocker.current) {
                return false;
            }
            const shouldBlock = !window.confirm('You have unsaved changes, are you sure you want to leave?');
            return shouldBlock;
        },
    });

    // update article
    useEffect(() => {
        if (editorUpdateSignal && !isEditorEmpty(editor.document)) {
            const { content } = buildArticleContent(editor);
            // validate values
            form.handleSubmit();
            const formValues = form.state.values;

            const updateFields = {
                title: formValues.title,
                subtitle: formValues.subtitle,
                coverImage: formValues.coverImage,
                coverFocusY: formValues.coverFocusY
            };

            const realUpdateFields: Partial<ArticleUpdateRequest> = {};
            Object.keys(updateFields).forEach((key) => {
                const meta = form.getFieldMeta(key as any);
                if (meta && !meta.isDefaultValue) {
                    (realUpdateFields as any)[key] = form.getFieldValue(key as any);
                }
            });
            const request: ArticleUpdateRequest = {
                articleId,
                content,
                ...realUpdateFields,
            };

            handleUpdate({ request }, {
                onSuccess: () => {
                    setEditorUpdateSignal(0);
                    isSkipBlocker.current = true;
                    navigate({ to: articleRoute.to, params: { articleId: articleId } });
                }
            });
        }
    }, [editorUpdateSignal]);

    return (
        <>
            {isLoading && <Loading />}
            {isError && !isLoading && <main className="flex items-center justify-center min-h-screen">
                <div className="text-3xl text-red-600">
                    {error?.message || 'Failed to load article content.'}
                </div>
            </main>}
            {!isLoading && article && <>
                {/* Settings bar */}
                <div className="m-2 shadow-xl rounded-xl border-2 border-gray-100 p-1">
                    <button className="btn btn-square btn-ghost mx-4" popoverTarget="popover-1" style={{ anchorName: "--anchor-1" }} >
                        <DotsThreeIcon size={24} color="#676565" weight="bold" />
                    </button>
                    <ul className="dropdown menu w-56 bg-base-100 shadow-lg"
                        popover="auto" id="popover-1" style={{ positionAnchor: "--anchor-1" }}>
                        {/* Manage unlisted settings */}
                        <li>
                            <Modal onCancel={() => console.log('Make this story unlisted? cancel')} onDone={() => console.log('Make this story unlisted?')} buttonName="Manage unlisted settings">
                                <h3 className="font-bold text-md">Make this story unlisted?</h3>
                                <p className="py-4">Not found</p>
                            </Modal>
                        </li>
                        {/* Change featured image */}
                        <li>
                            <Modal
                                onDone={onDone}
                                onCancel={() => {
                                    form.resetField('coverImage');
                                    form.resetField('coverFocusY');
                                }}
                                buttonName="Change featured image"
                                disabled={isImageArraryModalShow || !canSubmit}
                            >
                                <h3 className="font-bold text-md mb-2">Select one of your images to feature.</h3>
                                <form.Field
                                    name="coverImage"
                                    children={(coverImageField) => (
                                        <>
                                            <CoverImageInput
                                                field={coverImageField}
                                                form={form}
                                                coverImages={getImagesNow()}
                                                isImageArraryModalShow={isImageArraryModalShow}
                                                setIsImageArraryModalShow={setIsImageArraryModalShow}
                                            />
                                            <FieldInfo field={coverImageField} />
                                        </>
                                    )}
                                />
                            </Modal>
                        </li>
                        {/* Change display title / subtitle */}
                        <li>
                            <Modal
                                onDone={onDone}
                                onCancel={() => {
                                    form.resetField('title');
                                    form.resetField('subtitle');
                                }}
                                buttonName="Change display title / subtitle"
                                disabled={!canSubmit}
                            >
                                <form.Field
                                    name="title"
                                    children={(field) => (
                                        <>
                                            <fieldset className="fieldset w-full">
                                                <legend className="fieldset-legend text-sm font-normal">Title</legend>
                                                <input
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    type="text"
                                                    className="input w-full font-bold input-sm"
                                                    placeholder="Write a preview title..."
                                                />
                                            </fieldset>
                                            <FieldInfo field={field} />
                                        </>
                                    )}
                                />
                                <form.Field
                                    name="subtitle"
                                    children={(field) => (
                                        <>
                                            <fieldset className="fieldset w-full">
                                                <legend className="fieldset-legend text-sm font-normal">Subtitle</legend>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        type="text"
                                                        className="input w-full input-sm"
                                                        placeholder="Write a preview subtitle..."
                                                    />
                                                </div>
                                            </fieldset>
                                            <FieldInfo field={field} />
                                        </>
                                    )}
                                />
                                <p className="py-4 text-sm text-gray-500">The title and subtitle are used on your publication homepage, in previews of your story on Medium, and on social media.</p>
                            </Modal>
                        </li>
                        {/* Change topics */}
                        <li>
                            <Modal
                                onCancel={() => {
                                    form.resetField('topics');
                                    form.resetField('topicCandidate');
                                }}
                                onDone={() => {
                                    toast.success('感谢测试！你的topics现在是 ' + form.getFieldValue('topics') + ' 。不过修改topics功能暂未上线！')
                                }}
                                buttonName="Change topics"
                                disabled={canSubmit}
                            >
                                <p className="py-4 text-sm text-gray-500">Add or change topics (up to 5) so readers know what your story is about:</p>
                                <form.Field
                                    name="topicCandidate"
                                    children={(candidateField) => (
                                        <form.Field
                                            name="topics"
                                            mode="array"
                                            children={(topicsField) => (
                                                <>
                                                    <fieldset className="fieldset w-full">
                                                        <TopicInput topicsField={topicsField} candidateField={candidateField} />
                                                    </fieldset>

                                                    <FieldInfo field={topicsField} />
                                                </>
                                            )}
                                        />
                                    )}
                                />
                            </Modal>
                        </li>
                    </ul>
                </div>
                {/* Editor area */}
                <EditorComponent
                    editor={editor}
                    onChange={handleEditorChange}
                />
            </>}
        </>
    );
}