export async function fetchAllPages(fetchPage) {
    const firstPage = await fetchPage(0);
    const { content = [], totalPages = 1 } = firstPage;
    if (totalPages <= 1) return content;
    const pages = await Promise.all(
        Array.from({ length: totalPages - 1 }, (_, i) => fetchPage(i + 1))
    );
    return content.concat(...pages.map(p => p.content ?? []));
}
