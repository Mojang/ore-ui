# Bumping versions

Currently the process of updating the version of the packages is mostly manual. Before you start, first you need to make sure you have the permissions to publish the packages.

- Make sure that you are logged in into your `npm` account. Use the command `yarn npm login` on the project folder to do this.
- While on the `main` branch.
- Perform a search an replace on all "package.json" files from the old version to the new. (ex `0.1.4` to `0.2.0`).
- Run `yarn` to update the lockfile.
- Commit the changes with a message containing the new version (ex: `0.2.0`).
- Create an annotated git tag by running `git tag -a v0.2.0` (replace with the version). The tag message can be the version again.
- Push commit and the tag `git push --follow-tags`.
- Publish the packages by running `yarn publish` (it will also build the packages).
- Then head to GitHub to draft a new release https://github.com/Mojang/ore-ui/releases/new
- Choose the tag and click the button "Auto-generate release notes"
- Click "publish release"
