const baseUrl = 'http://192.168.11.2:8080';
export default {
    getMovies: () => {
        return fetch(`${baseUrl}/movies`)
            .then(res => res.json())
            .then(data => {
                return data.sort((a, b) => a.title.localeCompare(b.title));
            });
    }
}
