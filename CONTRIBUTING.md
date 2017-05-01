# Contributing

1. Fork it!
2. Create your feature/fix branch from the master branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to github: `git push origin my-new-feature`
5. Create a pull request for the getme repository

## For pull requests that have new `getme` commands and functionalities

If your pull request have new `getme` commands and functionalities with new files in it, it is good to:

### Test it

* Create a file named [YOUR_FEATURE].test.js next to your new feature file
* Create your test cases for that new feature on that test file. Use the existing test files as an example
* Run `npm run coverage`. It will generate a `coverage` folder. Open the `index.html` in it, and see if the tests you made are covering all the code in your feature file
* Run `npm test` to check if your tests are ok

### Update existing documentation

* Do not forget to update the getme options table in *README.md* with your new commands

---

*Remember that we have a pre-push hook with steps that analyzes and prevents mistakes.*

**After your pull request is merged**, you can safely delete your branch.

---

### [<= Back](https://github.com/gabrielgodoy/getme)
