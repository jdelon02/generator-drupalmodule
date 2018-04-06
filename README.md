# Generator-drupalmodule

Yeoman generator for drupal modules.  This was a fork of David Maneuver's generator, tailored to the needs of MA.  Two of us were working on it, the idea being that we could scaffold a module quickly, and also start to include the additional things that we wanted (doc generator files, templated .info file, etc...).  This was abandoned/deprecated once D8 came out, since we switched to learning that instead.  But, it was fun to work on!

## Getting started
- Make sure you have [yo](https://github.com/yeoman/yo) installed:
    `npm install -g yo`
- Install the generator: `npm install -g generator-drupalmodule`
- mkdir your module folder at sites/*/modules and cd into it
- Run: `yo drupalmodule`

## License
[MIT License](http://en.wikipedia.org/wiki/MIT_License)

## Differences Planned:
1.  Want to be able to run from modules folder, rather than having to already have module folder created.
2.  Expanding package.json to include dependencies for linting, codesniffer, drupal coder, phpdoc generation, and more.
3.  Better functionality documentation within module function calls (and might include a couple more).
4.  We shall see...
