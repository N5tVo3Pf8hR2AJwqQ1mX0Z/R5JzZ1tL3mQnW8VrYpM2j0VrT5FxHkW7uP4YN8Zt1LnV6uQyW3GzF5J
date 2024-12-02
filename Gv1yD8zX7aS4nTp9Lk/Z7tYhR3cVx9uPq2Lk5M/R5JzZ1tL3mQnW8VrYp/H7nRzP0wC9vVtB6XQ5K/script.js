(function () {
  const blogUrl = 'https://code88labs.blogspot.com';
  const postsContainer = document.getElementById('czem-a9k2m7x5p4-p_container');
  const loadMoreBtn = document.getElementById('czem-a9k2m7x5p4-l_button');
  const loadingSpinner = document.getElementById('czem-a9k2m7x5p4-p_loader');
  const noDataMessage = document.getElementById('czem-a9k2m7x5p4-n_button');
  let maxPostsPerLoad = 6;
  let startIndex = 1;

  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  async function fetchPosts() {
    loadMoreBtn.disabled = true;
    loadingSpinner.style.display = 'flex';
    noDataMessage.style.display = 'none';

    try {
      const response = await fetch(
        `${blogUrl}/feeds/posts/default?alt=json&start-index=${startIndex}&max-results=${maxPostsPerLoad}`
      );
      if (!response.ok) throw new Error('Failed to fetch posts.');
      const data = await response.json();
      const posts = data.feed.entry;

      if (posts && posts.length > 0) {
        const postElements = posts.map((post) => {
          const title = post.title.$t;
          const link = post.link.find((l) => l.rel === 'alternate').href;
          const publishedDate = formatDate(post.published.$t);
          const labels = post.category
            ? post.category.length > 1
              ? [post.category[Math.floor(Math.random() * post.category.length)]]
              : post.category
            : [];

          const labelElements = labels
            .map(
              (cat) => `<a href="${blogUrl}/search/label/${encodeURIComponent(
                cat.term
              )}" class="czem-a9k2m7x5p4-b_label">${cat.term}</a>`
            )
            .join('');

          const imgRegex = /<img.*?src="(.*?)"/;
          const imageMatch = imgRegex.exec(post.content.$t);
          const imageUrl = imageMatch
            ? imageMatch[1]
            : 'https://via.placeholder.com/320x180?text=No+Image';

          return `
            <div class="czem-a9k2m7x5p4-s_blog">
              <a href="${link}">
                <img src="${imageUrl}" alt="${title}" class="czem-a9k2m7x5p4-blog_t" loading="lazy">
              </a>
              <div class="czem-a9k2m7x5p4-content">
                <h2 class="czem-a9k2m7x5p4-p_title"><a href="${link}">${title}</a></h2>
                <p class="czem-a9k2m7x5p4-b_date">${publishedDate}</p>
                <div>${labelElements}</div>
              </div>
            </div>
          `;
        });

        postsContainer.innerHTML += postElements.join('');
        const postContents = postsContainer.querySelectorAll('.czem-a9k2m7x5p4-content');
        postContents.forEach((content) => content.classList.add('show'));
        startIndex += maxPostsPerLoad;
      } else {
        loadMoreBtn.style.display = 'none';
        noDataMessage.style.display = 'block';
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      loadingSpinner.style.display = 'none';
      loadMoreBtn.disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => fetchPosts());
  loadMoreBtn.addEventListener('click', () => fetchPosts());
})();
