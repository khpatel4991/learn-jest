import { Modifier, SelectionState } from "draft-js";

const rangeFromCorrection = correction => {
  const blockKey = correction.get("blockKey");
  const applied = correction.get("applied");
  const startOffset = correction.get("startOffset") + correction.get("sentenceStartOffset");
  const text = correction.getIn(["t", applied]);
  return SelectionState.createEmpty(blockKey).merge({
    anchorOffset: startOffset,
    focusOffset: startOffset + text.length,
  });
}

const applyEntity = (acc, correction) => {
  const { contentState, enhanced } = acc;
  const applicable = correction.get("applicable");
  const signature = correction.get("signature");
  if(!applicable) return { contentState, enhanced: enhanced.setIn([signature, "entityKey"], null) }
  const range = rangeFromCorrection(correction);
  const withEntity = contentState.createEntity(
    "CORRECTION",
    "MUTABLE",
    { signature },
  );
  const entityKey = withEntity.getLastCreatedEntityKey();
  const applied = Modifier.applyEntity(
    withEntity,
    range,
    entityKey
  );
  return {
    contentState: applied,
    enhanced: enhanced.setIn([signature, "entityKey"], entityKey),
  };
}

export default (contentState, corrections) => corrections.reduce(applyEntity, { contentState, enhanced: corrections });
