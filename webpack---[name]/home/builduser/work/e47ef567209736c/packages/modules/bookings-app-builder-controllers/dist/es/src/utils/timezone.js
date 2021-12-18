export function getLocalTimezone(fallback) {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
        return fallback;
    }
}
//# sourceMappingURL=timezone.js.map