export const GA_TRACKING_ID = "G-NVZD6W0S6Q"

const window = {}

export const pageview = (url) => {
    window.gtag && window.gtag("config", GA_TRACKING_ID, {
        page_path: url,
    });
};

export const event = ({ action, category, label, value }) => {
    window.gtag && window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
    });
};