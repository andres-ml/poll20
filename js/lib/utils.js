export function slugify(string) {
    return string
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
}

export function randomString(length = 16) {
    const pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const pick = () => pool.charAt(Math.floor(Math.random() * pool.length));
    return Array(length).fill(0).map(_ => pick()).join('');
}