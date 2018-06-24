import { List } from "immutable";

const extractLastAfter = tokens => tokens[tokens.length - 1].after;
const joinTokens = tokens => tokens.reduce((acc, t) => acc + t.value + t.after, "");
const joinTokensSkipLast = tokens => tokens.reduce((acc, t, i) => {
  if (i === tokens.length - 1) {
    return acc + t.value;
  }
  return acc + t.value + t.after;
}, "");

const mergeCorrectionOffset = (sentence, correction) => {
  const applied = correction.get("applied");
  const trms = correction.get("transformations");
  const targetTokens = applied === -1 ? trms[0].tokensAffected : trms[applied].tokensAdded;
  const firstId = targetTokens[0].id;
  const pre = sentence.takeUntil(s => s.id === firstId);
  const startOffset = joinTokens(pre).length;
  const t = List(trms.map(tr => joinTokensSkipLast(tr.tokensAdded)).concat([joinTokensSkipLast(trms[0].tokensAffected)]));
  const a = List(trms.map(tr => extractLastAfter(tr.tokensAdded)).concat([extractLastAfter(trms[0].tokensAffected)]));
  return correction
    .set("startOffset", startOffset)
    .set("t", t)
    .set("a", a);
};

export default mergeCorrectionOffset;