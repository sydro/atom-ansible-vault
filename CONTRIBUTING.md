# Contribution Guidelines

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of guidelines for contributing to atom package ansible-vault. Feel free to propose changes to this document in a pull request.


## Bug Reports

Before reporting an issue, please search to see if someone has filed a similar issue before. If there is already an open issue, please add a :+1: and/or leave a comment with additional information. In addiction, please read README.md file first, you can find available configurations and
their description.


When creating a new issue make sure to include the following:
- Version of `ansible-vault` package in use. Are you running from source/master? Are you using a released build? Which release?
- Your environment. What is your operating system? 32 or 64 bits?
- Step to reproduce. Even if the step is only one line change, __include it!__ Include the actual result and what you expected.
- Any message or error you get in the console, if you do.


**NB**: ``ansible-vault binary not found`` probably is not a bug! You need install ansible or configure absolute path in settings.


## Pull Requests

Pull requests for new features, bug fixes, etc. are often appreciated.

**Working on your first Pull Request?** You can learn how from this *free* series
[How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

Guidelines for pull requests:
- __Make your commit messages as descriptive as possible.__ Include as much information as you can. Explain anything that the file diffs themselves won’t make apparent.
- __Document your pull request__. Explain your fix, link to the relevant issue.
- __Make sure the target of your pull request is the relevant branch__. Most of bugfix or new feature should go to the `master` branch.
- __Include only related work__. If your pull request has unrelated commit, it won't be accepted.
