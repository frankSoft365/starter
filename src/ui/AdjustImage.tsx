import { useState } from 'react'
import Cropper, { type Area, type Point } from 'react-easy-crop'
import { focalPercentFromArea, objectPositionFromRatio } from '@/utils/coverFocus'

interface AdjustImageProps {
    image: string
    onSave?: (area: Area | null) => void,
}

export default function AdjustImage({ image, onSave }: AdjustImageProps) {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)

    const [croppedArea, setCroppedArea] = useState<Area | null>(null);

    function onCropComplete(area: Area) {
        setCroppedArea(area)
    }

    const focalYPercent = focalPercentFromArea(croppedArea)

    function saveCrop() {
        if (onSave) {
            onSave(croppedArea)
        }

    }

    function resetCrop() {
        setCrop({ x: 0, y: 0 })
        setZoom(1)
        setCroppedArea(null)
    }

    return (
        <div className="w-full">
            {/* 裁剪器主容器 */}
            <div className="relative w-full h-84">
                <Cropper
                    image={image}
                    crop={crop}
                    zoom={zoom}
                    maxZoom={1}
                    zoomWithScroll={false}
                    aspect={2 / 1}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                    showGrid={false}
                    objectFit="contain"
                />
            </div>

            {/* 实时预览区域 */}
            <div className="w-full mt-6 pt-4">
                <p className="text-sm font-medium text-gray-400 mb-2 text-left">Link preview</p>
                <div className="w-4/5 border border-gray-200 overflow-hidden bg-gray-50 shadow-inner">
                    <img
                        src={image}
                        alt="preview"
                        className="w-full aspect-2/1 object-cover transition-all duration-75"
                        style={{ objectPosition: objectPositionFromRatio(focalYPercent / 100) }}
                    />
                </div>
            </div>

            {/* 操作控制栏 */}
            <div className="flex flex-row items-center justify-end gap-2 mt-6">
                <button
                    onClick={resetCrop}
                    type="button"
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors"
                >
                    Reset to center
                </button>
                <button
                    onClick={saveCrop}
                    type="button"
                    className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 text-sm font-medium rounded-lg transition-colors shadow-sm"
                >
                    Save
                </button>
            </div>
        </div>
    )
}

