export default function Avatar({ imageUrl, hover = false }:
    {
        imageUrl: string | undefined,
        hover?: boolean
    }) {
    const hoverRingConfig = 'hover:ring-2 ring-offset-2 ring-primary ring-offset-base-100';
    return (
        <div>
            {(imageUrl ?? '') !== ''
                ?
                <div className="avatar">
                    <div className={`w-12 rounded-full ${hover ? hoverRingConfig : ''}`}>
                        <img src={imageUrl} />
                    </div>
                </div>
                :
                <div className="avatar avatar-placeholder">
                    <div className={`bg-neutral text-neutral-content w-12 rounded-full ${hover ? hoverRingConfig : ''}`}>
                        <span>NONE</span>
                    </div>
                </div>}
        </div>
    );
}