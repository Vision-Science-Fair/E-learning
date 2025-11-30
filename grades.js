function searchGrades() {
        let input = document.getElementById("searchInput").value.toLowerCase();
        let resultsContainer = document.getElementById("searchResults");

        // Example search results — you can replace them later with real subjects
        let subjects = [
            "Mathematics Grade 9",
            "Biology Grade 10",
            "Physics Grade 9",
            "Chemistry Grade 10",
            "Civics Grade 9",
            "Geography Grade 10",
            "History Grade 9",
            "English Grade 10"
        ];

        let filtered = subjects.filter(subject => subject.toLowerCase().includes(input));

        // Clear previous results
        resultsContainer.innerHTML = "";

        if (filtered.length === 0) {
            resultsContainer.innerHTML = "<p>No results found.</p>";
            return;
        }

        filtered.forEach(result => {
            let item = document.createElement("p");
            item.textContent = result;
            resultsContainer.appendChild(item);
        });
    }