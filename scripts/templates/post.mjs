export function postTemplateA(postData) {
    return `<div class="post" id=${postData.id}>${postData.title}</div>`
}

export function postTemplateB(postData) {
    const post = document.createElement('div');
    post.classList.add('post');
    post.innerText = postData.title;
    
    if (postData.media) { 
        const img = document.createElement('img');
        img.src = postData.media;
        img.alt = postData.title;
        post.append(img);
    }

    return post;
}

export function renderPostTemplate(postData, parent) {

    parent.append(postTemplateB(postData));
}

export function renderPostTemplates(postsDataList, parent) {
    parent.append(...postsDataList.map(postTemplateB));
    
}