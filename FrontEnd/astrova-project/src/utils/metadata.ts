
export const getMediaUrl = (items: { href: string }[], mediaType: string) => {
    const hrefs = items.map(i => i.href);

    if (mediaType === 'video') {
        // prefer large, fallback to orig, then medium
        return (
            hrefs.find(h => h.endsWith('~large.mp4')) ||
            hrefs.find(h => h.endsWith('~orig.mp4')) ||
            hrefs.find(h => h.endsWith('~medium.mp4')) ||
            hrefs.find(h => h.includes('.mp4'))
        );
    }

    if (mediaType === 'audio') {
        return hrefs.find(h => h.includes('.mp3') || h.includes('.wav'));
    }

    // image — prefer orig, fallback to large
    return (
        hrefs.find(h => h.endsWith('~orig.jpg')) ||
        hrefs.find(h => h.endsWith('~large.jpg')) ||
        hrefs.find(h => h.includes('.jpg'))
    );
};

export const getThumbnailUrl = (items: { href: string }[]) => {
    const hrefs = items.map(i => i.href);
    return hrefs.find(h => h.endsWith('~thumb.jpg'));
};