"""Write static/qr-photo.jpg: a QR code printed on a card, photographed at an angle.

The scene is synthetic and original to this template: a segno QR code on a white
card, warped in perspective onto a textured desk, with lighting, noise and blur.
"""

from pathlib import Path

import cv2
import numpy as np
import segno

TEXT = "https://wasmer.io"
WIDTH, HEIGHT = 1200, 900


def main():
    rng = np.random.default_rng(7)
    qr = np.array(segno.make_qr(TEXT, error="M").matrix, dtype=np.uint8)
    card = cv2.resize((1 - qr) * 255, None, fx=16, fy=16, interpolation=cv2.INTER_NEAREST)
    card = cv2.copyMakeBorder(card, 96, 96, 96, 96, cv2.BORDER_CONSTANT, value=255)
    card = cv2.cvtColor(card, cv2.COLOR_GRAY2BGR)

    desk = np.zeros((HEIGHT, WIDTH, 3), np.float32)
    desk[:] = (70, 110, 150)
    desk += rng.normal(0, 18, (HEIGHT, WIDTH, 1)).astype(np.float32)
    desk = cv2.GaussianBlur(desk, (0, 0), 6)

    size = card.shape[0]
    source = np.float32([[0, 0], [size, 0], [size, size], [0, size]])
    target = np.float32([[380, 150], [880, 210], [840, 760], [330, 690]])
    matrix = cv2.getPerspectiveTransform(source, target)
    warped = cv2.warpPerspective(card, matrix, (WIDTH, HEIGHT)).astype(np.float32)
    mask = cv2.warpPerspective(np.ones((size, size), np.float32), matrix, (WIDTH, HEIGHT))
    scene = desk * (1 - mask[..., None]) + warped * mask[..., None]

    light = np.linspace(1.08, 0.78, WIDTH, dtype=np.float32)[None, :, None]
    scene = scene * light + rng.normal(0, 6, scene.shape)
    scene = cv2.GaussianBlur(np.clip(scene, 0, 255).astype(np.uint8), (0, 0), 1.2)
    cv2.imwrite(str(Path(__file__).parent / "static" / "qr-photo.jpg"), scene, [cv2.IMWRITE_JPEG_QUALITY, 85])


if __name__ == "__main__":
    main()
