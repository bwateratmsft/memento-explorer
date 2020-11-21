# Memento Explorer for Visual Studio Code

If you're an extension author for Visual Studio Code, chances are you've used `Memento`s. This handy API allows for the storage of local state, but unfortunately they can be very difficult to manage.

## Features

Memento Explorer allows for viewing and modifying both global and workspace `Memento`s for extensions.

## Requirements

To be able to modify an extension's `Memento`s, the extension must export them, i.e. return them from its `activate()` method.

## Disclaimer

Use this extension at your own risk! Manipulating an extension's `Memento`s could have a wide range unintended side effects. Do not use this unless you know what you're doing.

## Privacy Policy

[https://xkcd.com/1998/](https://xkcd.com/1998/)
