window.onload = function () {
    var toc = document.getElementById('toc');
    if (!toc) return;  // If the toc element is not found, exit the function

    var headers = document.querySelectorAll('.post-content h1, .post-content h2, .post-content h3, .post-content h4, .post-content h5, .post-content h6');

    headers.forEach(function (header, index) {
        // Assign an id to each header. The id is based on the index of the header.
        var headerId = 'header-' + index;
        header.id = headerId;

        // Create a new link and append it to the table of contents.
        var link = document.createElement('a');
        link.href = '#' + headerId;
        link.textContent = header.textContent;

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

        // Create a wrapper for the link to make styling easier
        var linkWrapper = document.createElement('div');
        linkWrapper.className = 'toc-link-wrapper';

        // Append the link to the wrapper and the wrapper to the toc
        toc.appendChild(linkWrapper);
        linkWrapper.appendChild(link);

        // Add click event to handle the active effect
        linkWrapper.addEventListener('click', function () {
            // Remove the active class from all other links
            document.querySelectorAll('.toc-link-wrapper.active').forEach(function (wrapper) {
                wrapper.classList.remove('active');
            });

            // Add the active class to the currently clicked link
            linkWrapper.classList.add('active');
        });
    });
}
