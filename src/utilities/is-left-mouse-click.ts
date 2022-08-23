export const isLeftMouseClick = (e: React.MouseEvent|MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return false;
    if (e.buttons && e.buttons === 1) return true;
    return false;
}