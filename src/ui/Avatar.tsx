export default function Avatar({ imageUrl, hover = false, username, size = 'md' }:
    {
        imageUrl: string | undefined,
        hover?: boolean,
        username: string,
        size?: 'sm' | 'md'
    }) {
    const hoverRingConfig = 'hover:ring-2 ring-offset-2 ring-primary ring-offset-base-100';
    const sizeStyle = size === 'md' ? 'w-12' : size === 'sm' ? 'w-8' : 'w-12';
    return (
        <div>
            {(imageUrl ?? '') !== ''
                ?
                <div className="avatar">
                    <div className={`${sizeStyle} rounded-full ${hover ? hoverRingConfig : ''}`}>
                        <img src={imageUrl} />
                    </div>
                </div>
                :
                <div className="avatar avatar-placeholder">
                    <div className={`${sizeStyle} bg-neutral text-neutral-content rounded-full ${hover ? hoverRingConfig : ''}`}>
                        <span className="uppercase">{username.slice(0, 2)}</span>
                    </div>
                </div>}
        </div>
    );
}