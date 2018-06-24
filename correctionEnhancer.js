import { List } from "immutable";

const extractLastAfter = tokens => tokens[tokens.length - 1].after;
const joinTokens = tokens => tokens.reduce((acc, t) => acc + t.value + t.after, "");
const joinTokensSkipLast = tokens => tokens.reduce((acc, t, i) => {
  if (i === tokens.length - 1) {
    return acc + t.value;
  }
  return acc + t.value + t.after;
}, "");

const correctionEnhancer = (sentence, correction) => {
  const applied = correction.get("applied");
  const trms = correction.get("transformations");
  const tokensAffected = correction.get("tokensAffected");
  const targetTokens = applied === -1 ? tokensAffected : trms[applied].tokensAdded;
  const firstId = targetTokens[0].id;
  const pre = sentence.takeUntil(s => s.id === firstId);
  const startOffset = joinTokens(pre).length;
  const t = trms.map(tr => joinTokensSkipLast(tr.tokensAdded)).concat([joinTokensSkipLast(tokensAffected)]);
  const a = trms.map(tr => extractLastAfter(tr.tokensAdded)).concat([extractLastAfter(tokensAffected)]);
  return correction
    .set("startOffset", startOffset)
    .set("t", List(t))
    .set("a", List(a));
};

export default correctionEnhancer;