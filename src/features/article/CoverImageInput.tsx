import { objectPositionFromRatio } from "@/utils/coverFocus";
import { useStore, type AnyFieldApi, type FormState } from "@tanstack/react-form";
import { useChangeCoverImage } from "./article";
import AdjustImage from "@/ui/AdjustImage";
import { createPortal } from 'react-dom'

export default function CoverImageInput({
    form,
    field,
    coverImages,
    isImageArraryModalShow,
    setIsImageArraryModalShow
}: {
    form: any
    field: AnyFieldApi,
    coverImages: string[] | undefined,
    isImageArraryModalShow: boolean,
    setIsImageArraryModalShow: (value: boolean) => void
}) {
    const {
        newImage,
        setNewImage,
        isAdjustModalOpen,
        setIsAdjustModalOpen
    } = useChangeCoverImage(coverImages);

    const coverFocusY = useStore(form.store, (state: FormState<any, any, any, any, any, any, any, any, any, any, any>) => state.values.coverFocusY) ?? 0.5;

    return (
        <>
            {
                field.state.value
                    ?
                    <>
                        {!isImageArraryModalShow && <div className="relative w-full">
                            <img
                                src={field.state.value}
                                className="w-full aspect-2/1 object-cover"
                                style={{ objectPosition: objectPositionFromRatio(coverFocusY) }}
                            />

                            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                                <button onClick={() => setIsImageArraryModalShow(true)} type="button" className="rounded-full btn btn-neutral bg-black/75 mb-2">Change preview image</button>
                                <button onClick={() => setIsAdjustModalOpen(true)} type="button" className="rounded-full btn btn-neutral bg-black/75">Adjust image</button>
                            </div>
                        </div>}
                        {/* image arrary */}
                        {isImageArraryModalShow &&
                            <div className="p-4 w-full bg-gray-100 min-h-85">
                                <button
                                    className="btn btn-ghost mb-2"
                                    onClick={() => {
                                        // force change to default value
                                        form.setFieldValue('coverFocusY', 0.5);

                                        field.handleChange(newImage);
                                        setIsImageArraryModalShow(false);
                                    }} >Done</button>
                                <div className="grid grid-cols-3 gap-1 lg:gap-4">
                                    {coverImages && coverImages.map((imageUrl, index) => {
                                        return (
                                            <div key={index} className={`w-22 h-22 lg:w-30 lg:h-30 ${imageUrl === newImage && 'border-4 border-green-500'}`}>
                                                <img
                                                    onClick={() => setNewImage(imageUrl)}
                                                    className="w-full h-full object-center object-cover"
                                                    src={imageUrl}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        }
                        {/* adjust image */}
                        {isAdjustModalOpen && (typeof document !== 'undefined' ? createPortal(
                            <>
                                <div className="fixed inset-0 bg-black/30 z-9998" onClick={() => setIsAdjustModalOpen(false)} />
                                <dialog open className="modal z-9999">
                                    <div className="modal-box w-11/12 md:w-xl flex flex-col items-center justify-between">
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                                            onClick={() => setIsAdjustModalOpen(false)}
                                        >
                                            ✕
                                        </button>
                                        <h1 className="text-center font-bold text-xl md:text-2xl">Adjust image</h1>
                                        <p className="pt-2 pb-3 text-sm text-gray-500 text-center max-w-9/12">Drag the highlighted box to choose what stays in view when cropped.</p>
                                        <form.Field
                                            name="coverFocusY"
                                            children={(coverFocusYField: AnyFieldApi) => {
                                                return (
                                                    <AdjustImage
                                                        image={field.state.value || ''}
                                                        onSave={(focalRatio) => {
                                                            coverFocusYField.handleChange(focalRatio);
                                                            setIsAdjustModalOpen(false);
                                                        }}

                                                    />
                                                );
                                            }}
                                        />

                                    </div>
                                </dialog>
                            </>, document.body) : null)}
                    </>
                    :
                    <div
                        className="bg-gray-100 w-full h-48 text-left content-center text-sm p-8 text-gray-500"
                    >
                        Include a high-quality image in your story to make it more inviting to readers.
                    </div>
            }
        </>
    );
}