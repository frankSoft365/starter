import { useEffect, useState } from "react"
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

    const [isModalShow, setIsModalShow] = useState(false);
    const [newImage, setNewImage] = useState(articlePreview?.coverImage[0]);
    const coverImages = articlePreview?.coverImage || [];

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
        <div className="card w-full card-md lg:w-5xl bg-base-100 lg:card-xl shadow-sm lg:mx-auto mt-12">
            <div className="card-body w-full">
                <h2 className="card-title">Story preview</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        form.handleSubmit()
                    }}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <form.Field
                                name="coverImage"
                                children={(field) => (
                                    <>
                                        <fieldset className="fieldset w-full">
                                            <legend className="fieldset-legend text-base font-normal">Cover image</legend>
                                            {
                                                field.state.value
                                                    ?
                                                    <>
                                                        {!isModalShow && <div className="relative w-full">
                                                            <img src={field.state.value} />
                                                            {!isModalShow && <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                                                <button onClick={() => setIsModalShow(true)} type="button" className="rounded-full btn btn-neutral bg-black/75 mb-2">Change preview image</button>
                                                                <button type="button" className="rounded-full btn btn-neutral bg-black/75">Adjust image</button>
                                                            </div>}
                                                        </div>}
                                                        {isModalShow &&
                                                            <div className="p-4 w-full bg-gray-100 min-h-84">
                                                                <button className="btn btn-ghost mb-2" onClick={() => {
                                                                    field.handleChange(newImage);
                                                                    setIsModalShow(false);
                                                                }} >Done</button>
                                                                <div className="grid grid-cols-3 gap-1 lg:gap-4">
                                                                    {coverImages.map((imageUrl, index) => {
                                                                        return (
                                                                            <div key={index} className={`w-24 h-24 lg:w-30 lg:h-30 ${imageUrl === newImage && 'border-4 border-green-500'}`}>
                                                                                <img onClick={() => setNewImage(imageUrl)} className="w-full h-full object-center object-cover" src={imageUrl} />
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        }
                                                    </>
                                                    : <div className="bg-gray-100 w-full h-48 text-left content-center text-sm p-8 text-gray-500">Include a high-quality image in your story to make it more inviting to readers.</div>
                                            }

                                        </fieldset>
                                        <FieldInfo field={field} />
                                    </>
                                )}
                            />
                            {!isModalShow &&
                                <>
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
                                </>
                            }
                            <div className="w-full text-left content-center text-sm text-gray-500 mt-4">
                                Note: Changes here will affect how your story appears in public places like Aedium’s homepage and in subscribers’ inboxes — not the contents of the story itself.
                            </div>
                        </div>
                        <div className="lg:relative">
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
                            <div className="lg:absolute left-0 bottom-0">
                                <button onClick={() => navigate({ to: editorRoute.to })} type="button" className="btn btn-neutral mr-3 mt-4">
                                    Cancel
                                </button>
                                <form.Subscribe
                                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                                    children={([canSubmit, isSubmitting]) => (
                                        <button disabled={!canSubmit || isPublishing} type="submit" className="btn btn-success mt-4">
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
