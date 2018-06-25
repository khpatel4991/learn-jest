import { List, Map, OrderedMap } from "immutable";
import { modifySentenceTokens, modifyCorrectionList, modifyContentState } from "./acceptCorrection";
import { cs } from "./draft";

describe("Accept Correction", () => {

  const st = List([
    { id: 1, value: "Hey,", after: " " },
    { id: 2, value: "Delilha", after: "." },
  ]);
  const sentencesTokens = List([st]);
  const c = Map({
    signature: "sign",
    sentenceIndex: 0,
    applied: -1,
    tokensAffected: [{ id: 2, value: "Delilha", after: "." }],
    transformations: [
      { tokensAdded: [{ id: 3, value: "Delilah", after: "" }, { id: 4, value: "!", after: "" }] },
      { tokensAdded: [{ id: 5, value: "Delilah", after: "" }, { id: 6, value: ",", after: "" }] },
    ],
  });
  const corrections = OrderedMap([
    [c.get("signature"), c],
  ]);
  const nai = 0;

  describe("Reflect new Sentence Tokens", () => {
    test("replace tokensAffected with tokensAdded of new Applied Index in sentenceTokens", () => {
      const actual = modifySentenceTokens(sentencesTokens, c, nai);
      const expected = List([
        { id: 1, value: "Hey,", after: " " },
        { id: 3, value: "Delilah", after: "" },
        { id: 4, value: "!", after: "" },
      ]);
      expect(actual).toEqual(expected);
    });
  });

  describe("Reflect new Correction List", () => {
    test("return correction list with new applied index for selected correction", () => {
      const signature = "sign";
      const actual = modifyCorrectionList(corrections, signature, nai);
      expect(actual.getIn([signature, "applied"])).toBe(nai);
    });
  });

  describe("Reflect new content state", () => {
    test("modify blockText to match new sentences tokens.", () => {
      const TEXT = "Hey Delilha.";
      const before = cs(TEXT);
      const blockKey = before.getFirstBlock().getKey();
      const nst = List([
        { id: 1, value: "Hey,", after: " " },
        { id: 3, value: "Delilah", after: "" },
        { id: 4, value: "!", after: "" },
      ]);
      const newSentencesTokens = List([nst]);
      const signature = c.get("signature");
      const newCorrections = OrderedMap([
        [signature, c]
      ]);
      const { contentState: after } = modifyContentState(before, blockKey, newSentencesTokens, corrections);
      expect(after.getBlockForKey(blockKey).getText()).toBe("Hey, Delilah!");
    });

    test("apply entities for new correction list", () => {
      const TEXT = "Hey, Delilha.";
      const before = cs(TEXT);
      const blockKey = before.getFirstBlock().getKey();
      const nst = List([
        { id: 1, value: "Hey,", after: " " },
        { id: 3, value: "Delilah", after: "" },
        { id: 4, value: "!", after: "" },
      ]);
      const newSentencesTokens = List([nst]);
      const newCorrections = OrderedMap([
        [c.get("signature"), c.set("applied", 0).set("blockKey", blockKey)]
      ]);
      const { contentState: after, enhanced } = modifyContentState(before, blockKey, newSentencesTokens, newCorrections);
      expect(enhanced.getIn([c.get("signature"), "entityKey"])).toBeTruthy();
    });
  });

});
