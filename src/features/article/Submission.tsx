import { useEffect } from "react"
import { useForm } from "@tanstack/react-form";
import { useAtomValue } from "jotai";
import { articlePreviewAtom } from "@/atoms/editor";
import { useNavigate } from "@tanstack/react-router";
import { Route as editorRoute } from "@/routes/_app/_protected/editor";
import TopicInput from "@/ui/TopicInput";
import FieldInfo from "@/ui/FieldInfo";
import { useArticlePublish } from "./article";
import { ArticleSubmissionSchema, type ArticleSubmissionForm } from "@/schemas/article";

export default function Submission() {
    const articlePreview = useAtomValue(articlePreviewAtom);
    const navigate = useNavigate();
    const { handlePublish, isPublishing } = useArticlePublish(articlePreview);

    const defaultValues: ArticleSubmissionForm = {
        coverImage: articlePreview?.coverImage[0],
        title: articlePreview?.title ?? 'Title',
        subtitle: articlePreview?.subtitle,
        topics: [],
        topicCandidate: ''
    };

    const form = useForm({
        defaultValues: defaultValues,
        onSubmit: ({ value }) => {
            handlePublish({ value });
        },
        validators: {
            onChange: ArticleSubmissionSchema,
            onSubmit: ArticleSubmissionSchema
        },
    })

    useEffect(() => {
        if (!articlePreview) {
            navigate({ to: editorRoute.to });
        }
    }, [articlePreview, navigate]);

    return (
        <div className="card w-5xl bg-base-100 card-xl shadow-sm mx-auto mt-12">
            <div className="card-body w-full">
                <h2 className="card-title">Story preview</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <form.Field
                                name="coverImage"
                                children={(field) => (
                                    <>
                                        <fieldset className="fieldset w-full">
                                            <legend className="fieldset-legend text-base font-normal">Cover image</legend>
                                            {field.state.value
                                                ? <img src={field.state.value} />
                                                : <div className="bg-gray-100 w-full h-48 text-left content-center text-sm p-8 text-gray-500">Include a high-quality image in your story to make it more inviting to readers.</div>
                                            }

                                        </fieldset>
                                        <FieldInfo field={field} />
                                    </>
                                )}
                            />
                            <form.Field
                                name="title"
                                children={(field) => (
                                    <>
                                        <fieldset className="fieldset w-full">
                                            <legend className="fieldset-legend text-base font-normal">Title</legend>
                                            <input
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                type="text"
                                                className="input w-full font-bold"
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
                                            <legend className="fieldset-legend text-base font-normal">Subtitle</legend>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    value={field.state.value}
                                                    onBlur={field.handleBlur}
                                                    onChange={(e) => field.handleChange(e.target.value)}
                                                    type="text"
                                                    className="input w-full"
                                                    placeholder="Write a preview subtitle..."
                                                />
                                            </div>
                                        </fieldset>

                                        <FieldInfo field={field} />
                                    </>
                                )}
                            />
                            <div className="w-full text-left content-center text-sm text-gray-500 mt-4">
                                Note: Changes here will affect how your story appears in public places like Aedium’s homepage and in subscribers’ inboxes — not the contents of the story itself.
                            </div>
                        </div>
                        <div className="relative">
                            <form.Field
                                name="topicCandidate"
                                children={(candidateField) => (
                                    <form.Field
                                        name="topics"
                                        mode="array"
                                        children={(topicsField) => (
                                            <>
                                                <fieldset className="fieldset w-full">
                                                    <legend className="fieldset-legend text-base font-normal">Topics</legend>
                                                    <p className="label mb-1">Add up to five topics to help readers find your story.</p>
                                                    <TopicInput topicsField={topicsField} candidateField={candidateField} />
                                                </fieldset>

                                                <FieldInfo field={topicsField} />
                                            </>
                                        )}
                                    />
                                )}
                            />
                            <div className="absolute left-0 bottom-0">
                                <button onClick={() => navigate({ to: editorRoute.to })} type="button" className="btn btn-neutral mr-3">
                                    Cancel
                                </button>
                                <form.Subscribe
                                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                                    children={([canSubmit, isSubmitting]) => (
                                        <button disabled={!canSubmit || isPublishing} type="submit" className="btn btn-success">
                                            {!isPublishing && !isSubmitting && 'Publish'}
                                            {(isPublishing || isSubmitting) && <span className="loading loading-spinner"></span>}
                                        </button>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}