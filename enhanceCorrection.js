import { List } from "immutable";
import isEqual from "lodash/isEqual";

const extractLastAfter = tokens => tokens[tokens.length - 1].after;
const joinTokens = tokens => tokens.reduce((acc, t) => acc + t.value + t.after, "");
const joinTokensSkipLast = tokens => tokens.reduce((acc, t, i) => {
  if (i === tokens.length - 1) {
    return acc + t.value;
  }
  return acc + t.value + t.after;
}, "");
const isConsecutiveSubset = (sentence, tokens) => {
  const first = tokens[0];
  const firstIndex = sentence.findIndex(t => t.id === first.id);
  const subTokens = sentence.slice(firstIndex, firstIndex + tokens.length);
  return isEqual(subTokens.toJS(), tokens);
}

const enhanceCorrection = (sentences, correction) => {
  const sentenceIndex = correction.get("sentenceIndex")
  const sentence = sentences.get(sentenceIndex);
  const applied = correction.get("applied");
  const trms = correction.get("transformations");
  const tokensAffected = correction.get("tokensAffected");
  const targetTokens = applied === -1 ? tokensAffected : trms[applied].tokensAdded;
  const firstId = targetTokens[0].id;
  const pre = sentence.takeUntil(s => s.id === firstId);
  const startOffset = joinTokens(pre).length;
  const sentenceStartOffset = sentences
    .slice(0, sentenceIndex)
    .reduce((acc, s) => acc + joinTokens(s), "")
    .length;
  const t = trms.map(tr => joinTokensSkipLast(tr.tokensAdded)).concat([joinTokensSkipLast(tokensAffected)]);
  const a = trms.map(tr => extractLastAfter(tr.tokensAdded)).concat([extractLastAfter(tokensAffected)]);
  const applicable = isConsecutiveSubset(sentence, targetTokens);
  return correction
    .set("startOffset", startOffset)
    .set("t", List(t))
    .set("a", List(a))
    .set("applicable", applicable)
    .set("sentenceStartOffset", sentenceStartOffset);
};

export default enhanceCorrection;