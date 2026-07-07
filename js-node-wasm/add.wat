;; Source of add.wasm — a minimal WebAssembly module exporting add(a, b).
;; Rebuild with: wat2wasm add.wat -o add.wasm
(module
  (func (export "add") (param i32 i32) (result i32)
    local.get 0
    local.get 1
    i32.add))
