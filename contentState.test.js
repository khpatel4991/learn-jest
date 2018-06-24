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

export const cs = (text = "") => {
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