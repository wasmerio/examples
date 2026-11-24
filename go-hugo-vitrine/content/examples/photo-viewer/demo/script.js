// dialog-lightbox from npm: the import map in hugo.toml (params.importmap) sends "dialog-lightbox" to jsDelivr
import { lightbox } from "dialog-lightbox";

const dialog = document.querySelector("dialog.box");
const caption = dialog.querySelector(".box-caption");
const box = lightbox({ gallery: document.getElementById("photos"), dialog });

// "change" also fires right after "open", so the first caption is set too
box.on("change", (slide) => {
  caption.textContent = slide.link.closest("figure").querySelector("figcaption").textContent;
});
box.on("close", () => {
  caption.textContent = "";
});
