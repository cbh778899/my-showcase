export function getSearchParams(search) {
    const searchParams = {}
    for(const [key, value] of new URLSearchParams(search)) {
        searchParams[key] = value
    }
    return searchParams
}