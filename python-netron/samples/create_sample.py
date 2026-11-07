"""Write an original, deterministic ONNX graph using only Python's stdlib.

The field numbers follow https://github.com/onnx/onnx/blob/main/onnx/onnx.proto3.
The graph is a viewer example, with illustrative weights rather than trained data.
"""

from pathlib import Path
import struct


def varint(value):
    result = bytearray()
    while value > 127:
        result.append((value & 127) | 128)
        value >>= 7
    result.append(value)
    return bytes(result)


def integer(field, value):
    return varint(field << 3) + varint(value)


def message(field, value):
    if isinstance(value, str):
        value = value.encode("utf-8")
    return varint((field << 3) | 2) + varint(len(value)) + value


def value_info(name, dimensions):
    shape = b"".join(message(1, integer(1, size)) for size in dimensions)
    tensor_type = integer(1, 1) + message(2, shape)  # FLOAT = 1
    return message(1, name) + message(2, message(1, tensor_type))


def tensor(name, dimensions, values):
    return (
        b"".join(integer(1, size) for size in dimensions)
        + integer(2, 1)
        + message(8, name)
        + message(9, struct.pack("<" + "f" * len(values), *values))
    )


def node(name, operation, inputs, output):
    return (
        b"".join(message(1, item) for item in inputs)
        + message(2, output)
        + message(3, name)
        + message(4, operation)
    )


def main():
    graph = (
        message(1, node("Feature projection", "MatMul", ["features", "weights"], "projected"))
        + message(1, node("Add bias", "Add", ["projected", "bias"], "biased"))
        + message(1, node("Activation", "Relu", ["biased"], "activated"))
        + message(1, node("Class probabilities", "Softmax", ["activated"], "probabilities"))
        + message(2, "Tiny classifier")
        + message(5, tensor("weights", [3, 2], [0.5, -0.5, 0.25, 0.75, 1.0, -1.0]))
        + message(5, tensor("bias", [2], [0.1, -0.1]))
        + message(11, value_info("features", [1, 3]))
        + message(12, value_info("probabilities", [1, 2]))
    )
    model = (
        integer(1, 9)  # ONNX IR version 9
        + message(2, "Wasmer examples")
        + message(6, "Original sample graph for inspecting model layers in Netron.")
        + message(7, graph)
        + message(8, integer(2, 13))  # Standard ONNX operator set 13
    )
    destination = Path(__file__).with_name("tiny-classifier.onnx")
    destination.write_bytes(model)
    print(f"Wrote {destination.name}: {len(model)} bytes")


if __name__ == "__main__":
    main()
