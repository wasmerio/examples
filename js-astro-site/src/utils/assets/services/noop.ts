import type { LocalImageService, ImageTransform } from "astro";
import { baseService } from "astro/assets";

const { validateOptions } = baseService as unknown as {
  validateOptions: (config: ImageTransform) => ImageTransform;
};

// Empty service used for platforms that neither support Squoosh or Sharp.
const noopService: LocalImageService = {
  ...baseService,
  validateOptions(options) {
    options = validateOptions(options);
    if (
      typeof options.src === "object" &&
      options.src.format !== options.format
    ) {
      options.format = options.src.format;
    }
    return options;
  },
  propertiesToHash: ["src"],
  async transform(inputBuffer, transformOptions) {
    return {
      data: inputBuffer,
      format: transformOptions.format,
    };
  },
};

export default noopService;
