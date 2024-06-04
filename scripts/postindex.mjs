



function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        title: params.get('title'),
        date: params.get('date'),
        author: params.get('author'),
        body: params.get('body'),
        image: params.get('image')
    };
}

// Function to set blog post content
function setBlogContent() {
    const { title, date, author, body, image } = getURLParams();
    document.getElementById('blogTitle').textContent = title;
    document.getElementById('blogDate').textContent = date;
    document.getElementById('blogAuthor').textContent = author;
    document.getElementById('blogText').textContent = body;
    document.getElementById('blogImage').src = `../images/${image}`;
}

// Populate the blog content on page load
window.onload = setBlogContent;