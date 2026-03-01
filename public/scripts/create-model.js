// get monaco code editor
require.config({
    paths: {
        vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs"
    }
});

require(["vs/editor/editor.main"], () => {
    window.editor = monaco.editor.create(
        document.getElementById("editor"),
        {
            value: `class TitForTat extends Model {
    constructor() {
        super("Tit For Tat");
    }

    strategy(opponent) {
        return opponent.self_move.get(this.name);
    }
}
Model.register(TitForTat);`,
            language: "javascript",
            theme: "vs-dark",
            fontSize: 14,
            minimap: { enabled: true },
            automaticLayout: true,
            readOnly: false
        }
    );
});

// switch workspace
const selector = document.getElementById("model-init-selector");
const editorDiv = document.getElementById("editor");
const dragDiv = document.getElementById("drag-and-drop");

dragDiv.classList.add("hidden");

selector.addEventListener("change", () => {
    if (selector.value === "editor") {
        editorDiv.classList.remove("hidden");
        dragDiv.classList.add("hidden");

        if (window.editor) {
            window.editor.layout();
        }
    } else {
        editorDiv.classList.add("hidden");
        dragDiv.classList.remove("hidden");
    }
});