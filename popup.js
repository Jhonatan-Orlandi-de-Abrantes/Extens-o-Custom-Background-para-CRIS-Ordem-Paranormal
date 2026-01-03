const presetName = document.getElementById("presetName");
const bgUrl = document.getElementById("bgUrl");
const bgColor = document.getElementById("bgColor");
const bgOpacity = document.getElementById("bgOpacity");
const presetsDiv = document.getElementById("presets");
const enabledCheckbox = document.getElementById("enabled");

let presets = {};
let activePreset = null;
let enabled = true;

function saveState() {
    chrome.storage.sync.set({ presets, activePreset, enabled });
}

function loadPreset(id) {
    const p = presets[id];
    if (!p) return;

    activePreset = id;
    presetName.value = p.name;
    bgUrl.value = p.url;
    bgColor.value = p.color;
    bgOpacity.value = p.opacity;

    renderPresets();
    saveState();
}

function renderPresets() {
    presetsDiv.innerHTML = "";

    Object.keys(presets).forEach(id => {
        const div = document.createElement("div");
        div.textContent = presets[id].name || "Sem nome";
        div.className = "preset" + (id === activePreset ? " active" : "");
        div.onclick = () => loadPreset(id);
        presetsDiv.appendChild(div);
    });
}

function createPreset() {
    const id = Date.now().toString();
    presets[id] = {
        name: "Novo Preset",
        url: "",
        color: "#000000",
        opacity: 0.4
    };
    loadPreset(id);
}

function deletePreset() {
    if (!activePreset) return;

    const keys = Object.keys(presets);
    if (keys.length <= 1) return;

    delete presets[activePreset];
    activePreset = Object.keys(presets)[0];
    loadPreset(activePreset);
}

chrome.storage.sync.get(
    ["presets", "activePreset", "enabled"],
    (data) => {
        presets = data.presets || {};
        enabled = data.enabled ?? true;
        enabledCheckbox.checked = enabled;

        if (!Object.keys(presets).length) {
            createPreset();
        } else {
            activePreset = data.activePreset || Object.keys(presets)[0];
            loadPreset(activePreset);
        }
    }
);

document.getElementById("save").onclick = () => {
    presets[activePreset] = {
        name: presetName.value,
        url: bgUrl.value,
        color: bgColor.value,
        opacity: parseFloat(bgOpacity.value)
    };
    saveState();
};

document.getElementById("reset").onclick = () => {
    presetName.value = "";
    bgUrl.value = "";
    bgColor.value = "#000000";
    bgOpacity.value = 0.4;
};

document.getElementById("addPreset").onclick = createPreset;
document.getElementById("deletePreset").onclick = deletePreset;

enabledCheckbox.onchange = () => {
    enabled = enabledCheckbox.checked;
    saveState();
};
