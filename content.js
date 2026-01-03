function applyBackground(settings) {
    let style = document.getElementById("custom-bg-style");

    if (!style) {
        style = document.createElement("style");
        style.id = "custom-bg-style";
        document.head.appendChild(style);
    }

    if (!settings.enabled) {
        style.textContent = "";
        return;
    }

    const { url, color, opacity } = settings;
    const rgba = hexToRgba(color, opacity);

    style.textContent = `
        body {
            background-image:
                linear-gradient(${rgba}, ${rgba}),
                url("${url}");
            background-size: cover;
            background-attachment: fixed;
            background-repeat: no-repeat;
        }
    `;
}

function hexToRgba(hex, opacity) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

chrome.storage.sync.get(
    ["enabled", "activePreset", "presets"],
    (result) => {
        if (!result.presets || !result.activePreset) return;

        const preset = result.presets[result.activePreset];
        if (!preset) return;

        applyBackground({
            enabled: result.enabled ?? true,
            ...preset
        });
    }
);
