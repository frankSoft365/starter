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
import CoverImageInput from "./CoverImageInput";
import { useTranslation } from "react-i18next";

export default function Submission() {
    const { t } = useTranslation();
    const articlePreview = useAtomValue(articlePreviewAtom);
    const navigate = useNavigate();
    const { handlePublish, isPublishing } = useArticlePublish(articlePreview);

    const defaultValues: ArticleSubmissionForm = {
        coverImage: articlePreview?.coverImage[0],
        coverFocusY: 0.5,
        title: articlePreview?.title ?? 'Title',
        subtitle: articlePreview?.subtitle,
        topics: [],
        topicCandidate: ''
    };

    // cover image modal show and title/subtitle input show
    const [isImageArraryModalShow, setIsImageArraryModalShow] = useState(false);

    const form = useForm({
        defaultValues: defaultValues,
        onSubmit: ({ value }) => {
            handlePublish({ value });
        },
        validators: {
            onChange: ArticleSubmissionSchema,
            onSubmit: ArticleSubmissionSchema
        },
    });


    useEffect(() => {
        if (!articlePreview) {
            navigate({ to: editorRoute.to });
        }
    }, [articlePreview, navigate]);

    return (
        <div className="card w-full card-md lg:w-4xl bg-base-100 lg:card-xl shadow-sm lg:mx-auto mt-12">
            <div className="card-body w-full">
                <h2 className="card-title">{t('submission.storyPreview')}</h2>
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
                                children={(coverImageField) => (
                                    <>
                                        <fieldset className="fieldset w-full">
                                            <legend className="fieldset-legend text-sm font-normal">{t('submission.coverImage.legend')}</legend>
                                            <CoverImageInput
                                                field={coverImageField}
                                                form={form}
                                                coverImages={articlePreview?.coverImage}
                                                isImageArraryModalShow={isImageArraryModalShow}
                                                setIsImageArraryModalShow={setIsImageArraryModalShow}
                                            />
                                        </fieldset>
                                        <FieldInfo field={coverImageField} />
                                    </>
                                )}
                            />
                            {!isImageArraryModalShow &&
                                <>
                                    <form.Field
                                        name="title"
                                        children={(field) => (
                                            <>
                                                <fieldset className="fieldset w-full">
                                                    <legend className="fieldset-legend text-sm font-normal">{t('submission.titleInput.legend')}</legend>
                                                    <input
                                                        value={field.state.value}
                                                        onBlur={field.handleBlur}
                                                        onChange={(e) => field.handleChange(e.target.value)}
                                                        type="text"
                                                        className="input w-full font-bold input-sm"
                                                        placeholder={t('submission.titleInput.placeholder')}
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
                                                    <legend className="fieldset-legend text-sm font-normal">{t('submission.subtitleInput.legend')}</legend>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            value={field.state.value}
                                                            onBlur={field.handleBlur}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            type="text"
                                                            className="input w-full input-sm"
                                                            placeholder={t('submission.subtitleInput.placeholder')}
                                                        />
                                                    </div>
                                                </fieldset>
                                                <FieldInfo field={field} />
                                            </>
                                        )}
                                    />
                                </>
                            }
                            <div className="w-full text-left content-center text-sm text-gray-500 mt-3">
                                {t('submission.note')}
                            </div>
                        </div>
                        <div className="lg:relative">
                            <form.Field
                                name="topics"
                                mode="array"
                                children={(topicsField) => (
                                    <form.Field
                                        name="topicCandidate"
                                        children={(candidateField) => (
                                            <>
                                                <fieldset className="fieldset w-full">
                                                    <legend className="fieldset-legend text-sm font-normal">{t('submission.topicsInput.legend')}</legend>
                                                    <p className="label mb-1">{t('submission.topicsInput.des')}</p>
                                                    <TopicInput topicsField={topicsField} candidateField={candidateField} />
                                                </fieldset>

                                                <FieldInfo field={candidateField} />
                                            </>
                                        )}
                                    />
                                )}
                            />

                            <div className="lg:absolute left-0 bottom-0">
                                <button onClick={() => navigate({ to: editorRoute.to })} type="button" className="btn btn-outline mr-3 mt-4">
                                    {t('btn.cancel')}
                                </button>
                                <form.Subscribe
                                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                                    children={([canSubmit, isSubmitting]) => (
                                        <button disabled={!canSubmit || isPublishing} type="submit" className="btn btn-success mt-4">
                                            {!isPublishing && !isSubmitting && t('btn.publish')}
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
