export function validateVisionRequest(body) {
  if (!body || typeof body !== "object") {
    return {
      valid: false,
      error: "Request body is required."
    };
  }

  if (typeof body.image !== "string") {
    return {
      valid: false,
      error: "image must be a string."
    };
  }

  if (!body.image.startsWith("data:image/")) {
    return {
      valid: false,
      error: "Only image data URLs are accepted."
    };
  }

  // Keep the prototype deliberately small.
  // This limit prevents accidental huge uploads.
  const maxLength = 5 * 1024 * 1024;

  if (body.image.length > maxLength) {
    return {
      valid: false,
      error: "Image is too large."
    };
  }

  return {
    valid: true
  };
}
