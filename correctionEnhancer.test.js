import { List, Map } from "immutable";
import correctionEnhancer from "./correctionEnhancer";

describe("Correction Enhancer for applying Entities", () => {
  test("Merge startOffset based on sentence tokens.", () => {
    const sentence = List([
      { id: 1, value: "he", after: " " },
      { id: 2, value: "hould", after: " " },
      { id: 3, value: "do", after: " " },
      { id: 4, value: "it", after: "" },
    ]);
    const c = Map({ 
      applied: -1,
      tokensAffected: [{ id: 2, value: "hould", after: " " }],
      transformations: [
        { tokensAdded: [{ id: 6, value: "would", after: " " }] },
        { tokensAdded: [{ id: 6, value: "could", after: " " }] },
      ],
    });
    const expected = correctionEnhancer(sentence, c);
    expect(expected.get("startOffset")).toBe(3);
  });

  test("merge correct entity `text` and `after` lists.", () => {
    const sentence = List([
      { id: 1, value: "he", after: " " },
      { id: 2, value: "hould", after: " " },
      { id: 3, value: "do", after: " " },
      { id: 4, value: "it", after: "" },
    ]);
    const c = Map({ 
      applied: -1,
      tokensAffected: [{ id: 2, value: "hould", after: " " }],
      transformations: [
        { tokensAdded: [{ id: 6, value: "would", after: " " }] },
        { tokensAdded: [{ id: 6, value: "could", after: " " }] },
      ],
    });
    const expected = correctionEnhancer(sentence, c);
    expect(expected.get("a").size).toBe(3);
    expect(expected.get("t").size).toBe(3);
    expect(expected.getIn(["t", 0])).toBe("would");
    expect(expected.getIn(["t", 2])).toBe("hould");
  });

});
