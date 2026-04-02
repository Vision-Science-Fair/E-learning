const subjectsCatalog = [
    { title: 'English Grade 7', href: 'english grade 7.html?grade=7&subject=english', category: 'Subject' },
    { title: 'Amharic Grade 7', href: 'amharic grade 7.html?grade=7&subject=amharic', category: 'Subject' },
    { title: 'General Science Grade 7', href: 'general science grade 7.html?grade=7&subject=general-science', category: 'Subject' },
    { title: 'Mathematics Grade 7', href: 'mathematics grade 7.html?grade=7&subject=mathematics', category: 'Subject' },
    { title: 'Citizenship Grade 7', href: 'citizenship grade 7.html?grade=7&subject=citizenship', category: 'Subject' },
    { title: 'Social Studies Grade 7', href: 'social studies grade 7.html?grade=7&subject=social-studies', category: 'Subject' },

    { title: 'English Grade 8', href: 'english grade 8.html?grade=8&subject=english', category: 'Subject' },
    { title: 'Amharic Grade 8', href: 'amharic grade 8.html?grade=8&subject=amharic', category: 'Subject' },
    { title: 'General Science Grade 8', href: 'general science grade 8.html?grade=8&subject=general-science', category: 'Subject' },
    { title: 'Mathematics Grade 8', href: 'mathematics grade 8.html?grade=8&subject=mathematics', category: 'Subject' },
    { title: 'Citizenship Grade 8', href: 'citizenship grade 8.html?grade=8&subject=citizenship', category: 'Subject' },
    { title: 'Social Studies Grade 8', href: 'social studies grade 8.html?grade=8&subject=social-studies', category: 'Subject' },

    { title: 'English Grade 9', href: 'english grade 9.html?grade=9&subject=english', category: 'Subject' },
    { title: 'Amharic Grade 9', href: 'amharic grade 9.html?grade=9&subject=amharic', category: 'Subject' },
    { title: 'Biology Grade 9', href: 'biology grade 9.html?grade=9&subject=biology', category: 'Subject' },
    { title: 'Chemistry Grade 9', href: 'chemistry grade 9.html?grade=9&subject=chemistry', category: 'Subject' },
    { title: 'Mathematics Grade 9', href: 'mathematics grade 9.html?grade=9&subject=mathematics', category: 'Subject' },
    { title: 'Physics Grade 9', href: 'physics grade 9.html?grade=9&subject=physics', category: 'Subject' },
    { title: 'History Grade 9', href: 'history grade 9.html?grade=9&subject=history', category: 'Subject' },
    { title: 'Geography Grade 9', href: 'geography grade 9.html?grade=9&subject=geography', category: 'Subject' },
    { title: 'Economics Grade 9', href: 'economics grade 9.html?grade=9&subject=economics', category: 'Subject' },
    { title: 'Citizenship Grade 9', href: 'citizenship grade 9.html?grade=9&subject=citizenship', category: 'Subject' },

    { title: 'English Grade 10', href: 'english grade 10.html?grade=10&subject=english', category: 'Subject' },
    { title: 'Amharic Grade 10', href: 'amharic grade 10.html?grade=10&subject=amharic', category: 'Subject' },
    { title: 'Biology Grade 10', href: 'biology grade 10.html?grade=10&subject=biology', category: 'Subject' },
    { title: 'Chemistry Grade 10', href: 'chemistry grade 10.html?grade=10&subject=chemistry', category: 'Subject' },
    { title: 'Mathematics Grade 10', href: 'mathematics grade 10.html?grade=10&subject=mathematics', category: 'Subject' },
    { title: 'Physics Grade 10', href: 'physics grade 10.html?grade=10&subject=physics', category: 'Subject' },
    { title: 'History Grade 10', href: 'history grade 10.html?grade=10&subject=history', category: 'Subject' },
    { title: 'Geography Grade 10', href: 'geography grade 10.html?grade=10&subject=geography', category: 'Subject' },
    { title: 'Economics Grade 10', href: 'economics grade 10.html?grade=10&subject=economics', category: 'Subject' },
    { title: 'Citizenship Grade 10', href: 'citizenship grade 10.html?grade=10&subject=citizenship', category: 'Subject' },

    { title: 'English Grade 11', href: 'english grade 11.html?grade=11&subject=english', category: 'Subject' },
    { title: 'Biology Grade 11', href: 'biology grade 11.html?grade=11&subject=biology', category: 'Subject' },
    { title: 'Chemistry Grade 11', href: 'chemistry grade 11.html?grade=11&subject=chemistry', category: 'Subject' },
    { title: 'Physics Grade 11', href: 'physics grade 11.html?grade=11&subject=physics', category: 'Subject' },
    { title: 'History Grade 11', href: 'history grade 11.html?grade=11&subject=history', category: 'Subject' },
    { title: 'Geography Grade 11', href: 'geography grade 11.html?grade=11&subject=geography', category: 'Subject' },
    { title: 'Economics Grade 11', href: 'economics grade 11.html?grade=11&subject=economics', category: 'Subject' },
    { title: 'Mathematics Grade 11', href: 'mathematics grade 11.html?grade=11&subject=mathematics', category: 'Subject' },

    { title: 'English Grade 12', href: 'english grade 12.html?grade=12&subject=english', category: 'Subject' },
    { title: 'Biology Grade 12', href: 'biology grade 12.html?grade=12&subject=biology', category: 'Subject' },
    { title: 'Chemistry Grade 12', href: 'chemistry grade 12.html?grade=12&subject=chemistry', category: 'Subject' },
    { title: 'Physics Grade 12', href: 'physics grade 12.html?grade=12&subject=physics', category: 'Subject' },
    { title: 'History Grade 12', href: 'history grade 12.html?grade=12&subject=history', category: 'Subject' },
    { title: 'Geography Grade 12', href: 'geography grade 12.html?grade=12&subject=geography', category: 'Subject' },
    { title: 'Economics Grade 12', href: 'economics grade 12.html?grade=12&subject=economics', category: 'Subject' },
    { title: 'Mathematics Grade 12', href: 'mathematics grade 12.html?grade=12&subject=mathematics', category: 'Subject' }
];

const bookCatalog = [
    { title: 'Biology Grade 11 PDF', href: 'books/bilogy grade 11.pdf', category: 'Book' }
];

let videoCatalog = [];
let videoCatalogLoaded = false;

function loadVideoCatalog() {
    fetch('videos.json')
        .then(response => {
            if (!response.ok) throw new Error('videos.json not reachable');
            return response.json();
        })
        .then(data => {
            videoCatalogLoaded = true;
            videoCatalog = [];
            Object.entries(data).forEach(([subjectKey, gradeObj]) => {
                const subjectName = subjectKey.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                if (Array.isArray(gradeObj)) {
                    gradeObj.forEach(video => {
                        videoCatalog.push({
                            title: video.title || 'Untitled Video',
                            href: video.url || '#',
                            category: 'Video',
                            grade: 'all',
                            subject: subjectName
                        });
                    });
                } else if (typeof gradeObj === 'object' && gradeObj !== null) {
                    Object.entries(gradeObj).forEach(([grade, videos]) => {
                        if (!Array.isArray(videos)) return;
                        videos.forEach(video => {
                            videoCatalog.push({
                                title: video.title || 'Untitled Video',
                                href: video.url || '#',
                                category: 'Video',
                                grade: grade,
                                subject: subjectName
                            });
                        });
                    });
                }
            });
        })
        .catch(err => {
            console.error('Failed to load videos catalog:', err);
            videoCatalogLoaded = true; // still mark loaded to avoid indefinite loading state
            videoCatalog = [];
        });
}

loadVideoCatalog();

function searchGrades() {
    const input = document.getElementById('searchInput').value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');

    resultsContainer.innerHTML = '';

    if (!input) {
        resultsContainer.innerHTML = '<p>Please type a search term for books, videos or subjects.</p>';
        return;
    }

    const subjectMatches = subjectsCatalog.filter(item => item.title.toLowerCase().includes(input));
    const bookMatches = bookCatalog.filter(item => item.title.toLowerCase().includes(input));

    if (!videoCatalogLoaded) {
        const loading = document.createElement('p');
        loading.textContent = 'Loading videos data, please try again in a moment...';
        resultsContainer.appendChild(loading);
        return;
    }

    const videoMatches = videoCatalog.filter(item => {
        return item.title.toLowerCase().includes(input) ||
            (item.subject && item.subject.toLowerCase().includes(input)) ||
            (item.grade && item.grade.toString().toLowerCase().includes(input));
    });

    if (subjectMatches.length === 0 && bookMatches.length === 0 && videoMatches.length === 0) {
        resultsContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    function appendSection(title, items) {
        if (!items.length) return;
        const heading = document.createElement('h3');
        heading.textContent = title;
        resultsContainer.appendChild(heading);

        const list = document.createElement('ul');
        list.className = 'search-results-list';

        items.forEach(item => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.href;
            a.target = '_blank';
            a.rel = 'noopener';
            const label = item.category === 'Video'
                ? `${item.title} (${item.subject} Grade ${item.grade})`
                : item.title;
            a.textContent = label;
            li.appendChild(a);
            list.appendChild(li);
        });

        resultsContainer.appendChild(list);
    }

    appendSection('Subjects', subjectMatches);
    appendSection('Books', bookMatches);
    appendSection('Videos', videoMatches);
}

// Enable hit-enter search
const searchInputElement = document.getElementById('searchInput');
if (searchInputElement) {
    searchInputElement.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            searchGrades();
        }
    });
}
