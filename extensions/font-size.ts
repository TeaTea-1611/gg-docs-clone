import "@tiptap/extension-text-style";
import { Extension } from "@tiptap/react";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

export const FontSizeExtension = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML(element) {
              return element.style.fontSize;
            },
            renderHTML(attributes) {
              if (!attributes.fontSize) {
                return {};
              }

              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize(size) {
        return ({ chain }) =>
          chain().setMark("textStyle", { fontSize: size }).run();
      },
      unsetFontSize() {
        return ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).run();
      },
    };
  },
});
