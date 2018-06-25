import { SelectionState, Modifier } from "draft-js";
import { OrderedSet } from "immutable";

import applyCorrections from "./applyCorrections";
import enhanceCorrection from "./enhanceCorrection";

const joinTokens = tokens => tokens.reduce((acc, t) => acc + t.value + t.after, "");
const joinSentences = sentences => sentences.reduce((acc, s) => acc + joinTokens(s), "");

const replaceTokens = (sentenceTokens=[], toAdd=[], toRemove) => {
  const pre = sentenceTokens.takeUntil(t => t.id === toRemove[0].id);
  const suff = sentenceTokens.slice(pre.size + toRemove.length);
  return pre.concat(toAdd).concat(suff);
};

export const modifySentenceTokens = (sentencesTokens, correction, trmIndex) => {
  const sentenceIndex = correction.get("sentenceIndex");
  const sentenceTokens = sentencesTokens.get(sentenceIndex);
  const toRemove = correction.get("tokensAffected");
  const toAdd = correction.get("transformations")[trmIndex].tokensAdded;
  const pre = sentencesTokens.slice(0, sentenceIndex);
  const suff = sentencesTokens.slice(sentenceIndex + 1);
  return pre
    .concat([replaceTokens(sentenceTokens, toAdd, toRemove)])
    .concat(suff);
  // return replaceTokens(sentenceTokens, toAdd, toRemove);
}

export const modifyCorrectionList = (corrections, signature, trmIndex) => {
  return corrections.setIn([signature, "applied"], trmIndex);
}

export const modifyContentState = (contentState, blockKey, sentences, corrections) => {
  const text = joinSentences(sentences);
  const block = contentState.getBlockForKey(blockKey);
  const range = SelectionState.createEmpty(blockKey).merge({
    anchorOffset: 0,
    focusOffset: block.getLength(),
  });
  const contentStateWithBlockTextReplaced = Modifier.replaceText(
    contentState,
    range,
    joinSentences(sentences)
  );
  const enhancedCorrections = corrections.map(c => enhanceCorrection(sentences, c));
  const { contentState: contentStateWithEntitiesApplied, enhanced } = applyCorrections(contentStateWithBlockTextReplaced, enhancedCorrections);
  return { contentState: contentStateWithEntitiesApplied, enhanced }
}