import { Map, List, OrderedMap, Range } from "immutable";
import { cs } from "./contentState.test";
import applyCorrections from "./applyCorrections";

jest.mock('draft-js/lib/generateRandomKey', () => {
  let _i = 1;
  return () => {
    return `blk${_i++}`;
  };
});

const setup = text => {
  const before = cs(text);
  const blockKey = before.getFirstBlock().getKey();
  return { before, blockKey, };
};

describe("applyCorrections: Create an Entity for Correction/s", () => {

  test("applies an entity for applicable correction", () => {
    const TEXT = "Wst World";
    const { before, blockKey } = setup(TEXT);
    const c = Map({ signature: "sign", blockKey, applicable: true, applied: -1, startOffset: 0, t: List(["West", "Wst"]), a: List([" ", " "]) });
    const corrections = OrderedMap([
      [ c.get("signature"), c ]
    ]);
    const { contentState: after, enhanced } = applyCorrections(before, corrections);
    enhanced.forEach(c => {
      const ek = c.get("entityKey")
      const start = c.get("startOffset");
      const end = start + c.getIn(["t", c.get("applied")]).length;
      const range = Range(start, end);
      range.forEach(offset => {
        expect(after.getBlockForKey(blockKey).getEntityAt(offset)).toBe(ek);
      });
    });
  });

  test("doesn't apply entity for non-applicable correction", () => {
    const TEXT = "Wst World";
    const { before, blockKey } = setup(TEXT);
    const c = Map({ signature: "sign", blockKey, applicable: false, applied: -1, startOffset: 0, t: List(["West", "Wst"]), a: List([" ", " "]) });
    const corrections = OrderedMap([
      [ c.get("signature"), c ]
    ]);
    const { contentState: after, enhanced } = applyCorrections(before, corrections);
    enhanced.forEach(c => {
      const start = c.get("startOffset");
      const end = start + c.getIn(["t", c.get("applied")]).length;
      const range = Range(start, end);
      range.forEach(offset => {
        expect(after.getBlockForKey(blockKey).getEntityAt(offset)).toBe(null);
      });
    });
  });

  test("applies all entities from corrections", () => {
    const TEXT = "Wst World. This is an test."
    const { before, blockKey } = setup(TEXT);
    const c1 = Map({ signature: "sign1", blockKey, applicable: true, applied: -1, startOffset: 0, t: List(["West", "Wst"]), a: List([" ", " "]) });
    const c2 = Map({ signature: "sign2", blockKey, applicable: true, applied: -1, startOffset: 20, t: List(["a", "an"]), a: List([" ", " "]) });
    const corrections = OrderedMap([
      [c1.get("signature"), c1],
      [c2.get("signature"), c2],
    ]);
    const { contentState: after, enhanced } = applyCorrections(before, corrections);
    enhanced.forEach(c => {
      const start = c.get("startOffset");
      const end = start + c.getIn(["t", c.get("applied")]).length;
      const range = Range(start, end);
      range.forEach(offset => {
        expect(after.getBlockForKey(blockKey).getEntityAt(offset)).toBe(c.get("entityKey"));
      });
    });
  });

  test("overwrites entity on complete range overlap", () => {
    const TEXT = "He have be it."
    const { before, blockKey } = setup(TEXT);
    const c1 = Map({ blockKey, signature: "sign1", applicable: true, applied: 0, startOffset: 3, t: List(["hzve", "have"]), a: List([" ", " "]) });
    const c2 = Map({ blockKey, signature: "sign2", applicable: true, applied: -1, startOffset: 3, t: List(["have been", "have be"]), a: List([" ", " "]) });
    const corrections = OrderedMap([
      [c1.get("signature"), c1],
      [c2.get("signature"), c2],
    ]);
    const { contentState: after, enhanced } = applyCorrections(before, corrections);
    const first = enhanced.first();
    console.log(first.get("startOffset"));
    const last = enhanced.last();
    const start = last.get("startOffset");
    const end = start + last.getIn(["t", last.get("applied")]).length;
    const range = Range(start, end);
    range.forEach(offset => {
      expect(after.getBlockForKey(blockKey).getEntityAt(offset)).toBe(last.get("entityKey"));
    });
  });
});