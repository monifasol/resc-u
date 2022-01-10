const hbs = require('hbs')

hbs.registerHelper('ifIn', function(elem, list, options) {

    if (list && elem) {
        if(list.includes(elem)) {
            return options.fn(this)       // true
        }
        return options.inverse(this)      // false
    }
});

hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});


hbs.registerHelper("formatDate", function(datetime) {
    let newDate = new Date(datetime)
    return newDate.toLocaleDateString("en-GB")
  });