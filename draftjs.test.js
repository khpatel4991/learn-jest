import { List } from "immutable";


import { cm, cb, cs } from "./draft";

describe("Character Metadata Utils", () => {
  test("returns base instance", () => {
    expect(cm().getEntity()).toBe(null);
    expect(cm().getStyle().size).toBe(0);
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