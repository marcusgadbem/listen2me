exports.marks = function(k) {
  return {
    'v': "✓",
    'vv': "✔",
    'x': "x",
    'xx': "✘",
    '[]': ["❍", "■", "☐", "❑", "≡", "→"]
  }[k];
}
