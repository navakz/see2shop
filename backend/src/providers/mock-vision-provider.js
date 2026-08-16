export class MockVisionProvider {
  async analyze() {
    return {
      provider: "mock",
      category: "unknown",
      objects: [],
      message:
        "AI vision provider will be connected in the next stage."
    };
  }
}
