import Accounting from './scripts/accounting.min.js';
import Showdown from './scripts/showdown.min.js';

UI.registerHelper('money', function (amount) {
  return Accounting.formatMoney(amount);
});

UI.registerHelper('markdown', function (text) {
  var converter = new Showdown.Converter();
  return converter.makeHtml(text);
});