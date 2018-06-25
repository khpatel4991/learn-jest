import { List, Map } from "immutable";
import enhanceCorrection from "./enhanceCorrection";

describe("Correction Enhancer for applying Entities", () => {
  test("Merge startOffset based on sentences tokens.", () => {
    const sentence = List([
      { id: 1, value: "he", after: " " },
      { id: 2, value: "hould", after: " " },
      { id: 3, value: "do", after: " " },
      { id: 4, value: "it", after: "" },
    ]);
    const sentences = List([sentence]);
    const c = Map({
      applied: -1,
      sentenceIndex: 0,
      tokensAffected: [{ id: 2, value: "hould", after: " " }],
      transformations: [
        { tokensAdded: [{ id: 6, value: "would", after: " " }] },
        { tokensAdded: [{ id: 6, value: "could", after: " " }] },
      ],
    });
    const actual = enhanceCorrection(sentences, c);
    expect(actual.get("startOffset")).toBe(3);
  });

  test("merge sentenceStartOffset based on current sentences.", () => {
    const sentence = List([
      { id: 1, value: "he", after: " " },
      { id: 2, value: "hould", after: " " },
      { id: 3, value: "do", after: " " },
      { id: 4, value: "it", after: "" },
    ]);
    const sentences = List([sentence, sentence]);
    const c = Map({
      applied: -1,
      sentenceIndex: 0,
      tokensAffected: [{ id: 2, value: "hould", after: " " }],
      transformations: [
        { tokensAdded: [{ id: 6, value: "would", after: " " }] },
        { tokensAdded: [{ id: 6, value: "could", after: " " }] },
      ],
    });
    const c1 = c;
    const c2 = c.set("sentenceIndex", 1);
    const ec1 = enhanceCorrection(sentences, c1);
    const ec2 = enhanceCorrection(sentences, c2);
    expect(ec1.get("sentenceStartOffset")).toBe(0);
    expect(ec2.get("sentenceStartOffset")).toBe(14);
  });

  test("merge correct entity `text` and `after` lists.", () => {
    const sentence = List([
      { id: 1, value: "he", after: " " },
      { id: 2, value: "hould", after: " " },
      { id: 3, value: "do", after: " " },
      { id: 4, value: "it", after: "" },
    ]);
    const sentences = List([sentence]);
    const c = Map({
      applied: -1,
      sentenceIndex: 0,
      tokensAffected: [{ id: 2, value: "hould", after: " " }],
      transformations: [
        { tokensAdded: [{ id: 6, value: "would", after: " " }] },
        { tokensAdded: [{ id: 6, value: "could", after: " " }] },
      ],
    });
    const actual = enhanceCorrection(sentences, c);
    expect(actual.get("a").size).toBe(3);
    expect(actual.get("t").size).toBe(3);
    expect(actual.getIn(["t", 0])).toBe("would");
    expect(actual.getIn(["t", 2])).toBe("hould");
  });

  test("merge applicable:true for correction present in sentence tokens.", () => {
    const sentence = List([
      { id: 1, value: "He", after: " " },
      { id: 2, value: "hzve", after: " " },
      { id: 3, value: "be", after: " " },
      { id: 4, value: "there", after: "." },
    ]);
    const sentences = List([sentence]);
    const c = Map({
      applied: -1,
      sentenceIndex: 0,
      tokensAffected: [{ id: 2, value: "hzve", after: " " }],
      transformations: [
        { tokensAdded: [{ id: 5, value: "have", after: " " }] },
      ],
    });
    const actual = enhanceCorrection(sentences, c);
    expect(actual.get("applicable")).toBeTruthy();
  });

  test("merge applicable: false for corrections not present in sentence tokens", () => {
    const sentence = List([
      { id: 1, value: "He", after: " " },
      { id: 2, value: "hzve", after: " " },
      { id: 3, value: "be", after: " " },
      { id: 4, value: "there", after: "." },
    ]);
    const sentences = List([sentence]);
    const c = Map({
      applied: -1,
      sentenceIndex: 0,
      tokensAffected: [{ id: 4, value: "there", after: "." }, { id: 8, value: "something", after: " " }],
      transformations: [
        { tokensAdded: [{ id: 6, value: "has", after: " " }] },
      ],
    });
    const actual = enhanceCorrection(sentences, c);
    expect(actual.get("applicable")).toBeFalsy();
  });

});
