import { List, Map, OrderedMap } from "immutable";
import { ContentState, ContentBlock, CharacterMetadata, Modifier, SelectionState } from "draft-js";

const cm = (entity = null, style = []) => {
  if (typeof entity === "string") { 
    return CharacterMetadata.create({
      entity,
    });
  }
  if (Array.isArray(entity)) {
    return CharacterMetadata.create({
      entity: null,
      style: List(entity),
    });
  }
  return CharacterMetadata.create({
    entity,
    style,
  });
};

describe("Character Metadata Utils", () => {
  test("returns base instance", () => {
    expect(cm()).toBeInstanceOf(CharacterMetadata);
  });

  test("returns instance with entity", () => {
    const SIGNATURE = "blockKey:index:charIndex"
    const instance = cm(SIGNATURE);
    expect(instance.getEntity()).toBe(SIGNATURE);
  });

  test("returns instance with styles", () => {
    const STYLE = ["BOLD"];
    const instance = cm(STYLE);
    expect(instance.getStyle()).toEqual(List(STYLE));
  });

});

const TEST_BLOCK_NODE = {
  key: "blockKey",
  type: "unstyed",
  text: "",
  characterList: List(),
  depth: 0,
  data: Map({
    lastModifiedTimestamp: null,
    corrections: OrderedMap(),
  }),
};

const cb = (first, ...rest) => {
  if(typeof first === "string") {
    return new ContentBlock({ ...TEST_BLOCK_NODE, text: first });
  }
  return new ContentBlock(TEST_BLOCK_NODE);
};

const cs = (text = "") => {
  return ContentState.createFromText(text);
}

describe("Content Block Utils", () => {
  
  test("return instance with valid key", () => {
    expect(cb().getKey().length).toBeGreaterThan(0);
  });
  
  test("return instance from text", () => {
    const text = "He hould do it.";
    expect(cb(text).getText()).toBe(text);
    expect(cb(text).getLength()).toBe(text.length);
    expect(cb(text).getKey().length).toBeGreaterThan(0);
  });
});

describe("Content State Builder", () => {
  test("returns valid content state", () => {
    const _cs = cs();
    expect(_cs.getBlockMap().size).toBe(1);
  });

  test("returns content state with valid text", () => {
    const TEXT = "Kafkaesque";
    const _cs = cs(TEXT);
    expect(_cs.getPlainText()).toBe(TEXT);
  });

  test("splits blocks when there is a new line", () => {
    const NEW_LINE_TEXT = `Hermanos\nBreaking Bad`
    const _cs = cs(NEW_LINE_TEXT);
    expect(_cs.getBlockMap().size).toBe(2);
  });
});

const applyCorrection = (contentState, correction, blockKey = "") => {
  const applicable = correction.get("applicable");
  if(!applicable) {
    return contentState;
  }
  const withEntity = contentState.createEntity(
    "CORRECTION",
    "MUTABLE",
    {},
  );
  const entityKey = withEntity.getLastCreatedEntityKey();
  const selectionRange = SelectionState.createEmpty(blockKey).merge({
    anchorOffset: 0,
    focusOffset: 4,
  });
  return Modifier.applyEntity(
    withEntity,
    selectionRange,
    entityKey
  );
}

describe("Apply Entity to Content State", () => {
  const TEXT = "Wst World";
  const _cs = cs(TEXT);
  const NONAPPLICABLE_CORRECTION = Map({
    startOffset: 0,
    applied: -1,
    applicable: false,
    blockKey: "blockKey",
    transformations: [
      { s: "Wst", sa: " ", t: "West", ta: " " },
    ],
  });

  const APPLICABLE_CORRECTION = Map({
    startOffset: 0,
    applied: -1,
    applicable: true,
    blockKey: "blockKey",
    transformations: [
      { s: "Wst", sa: " ", t: "West", ta: " " },
    ],
  });

  test("returns same content state for non-applicable correction", () => {
    const cse = applyCorrection(_cs, NONAPPLICABLE_CORRECTION);
    expect(cse).toBe(_cs);
  });

  test("sets an entity for applicable correction on a block", () => {
    const _csLastKey = _cs.getLastCreatedEntityKey();
    const blockKey = _cs.getFirstBlock().getKey();
    const cse = applyCorrection(_cs, APPLICABLE_CORRECTION, blockKey);
    expect(_csLastKey === cse.getLastCreatedEntityKey()).toBeFalsy();
  });

});