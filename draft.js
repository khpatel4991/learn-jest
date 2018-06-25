import { List, Map, OrderedMap } from "immutable";
import { ContentState, ContentBlock, CharacterMetadata } from "draft-js";

export const cm = (entity = null, style = []) => {
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

export const cb = (first, ...rest) => {
  if(typeof first === "string") {
    return new ContentBlock({ ...TEST_BLOCK_NODE, text: first });
  }
  return new ContentBlock(TEST_BLOCK_NODE);
};

export const cs = (text = "") => {
  return ContentState.createFromText(text);
}