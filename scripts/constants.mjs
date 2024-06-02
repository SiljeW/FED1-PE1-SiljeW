export const API_BASE_URL = 'https://v2.api.noroff.dev';
export const API_BLOGPOSTS_URL = `${API_BASE_URL}/blog/posts`;

export function getBlogPostUrl(name, id) {
    var urlBase = `${API_BLOGPOSTS_URL}/${name}`;
    if (id !=null) {
        return `${urlBase}/${id}`;
    }
    return urlBase;
}









