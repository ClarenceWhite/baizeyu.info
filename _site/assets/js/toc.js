window.onload = function () {
    var toc = document.getElementById('toc');
    var headers = document.querySelectorAll('.blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4, .blog-content h5, .blog-content h6');

    headers.forEach(function (header, index) {
        // Assign an id to each header. The id is based on the index of the header.
        var headerId = 'header-' + index;
        header.id = headerId;

        // Create a new link and append it to the table of contents.
        var link = document.createElement('a');
        link.href = '#' + headerId;
        link.textContent = "> " + header.textContent;

        // Assign classes based on header level to the link.
        if (header.tagName === 'H1') {
            link.className = 'toc-h1';
        } else if (header.tagName === 'H2') {
            link.className = 'toc-h2';
        } else if (header.tagName === 'H3') {
            link.className = 'toc-h3';
        } else if (header.tagName === 'H4') {
            link.className = 'toc-h4';
        } else if (header.tagName === 'H5') {
            link.className = 'toc-h5';
        } else if (header.tagName === 'H6') {
            link.className = 'toc-h6';
        }

        toc.appendChild(link);

        // Add a line break after each link for readability.
        var lineBreak = document.createElement('br');
        toc.appendChild(lineBreak);
    });
}
