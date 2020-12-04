# Memento Explorer for Visual Studio Code [![Version](https://vsmarketplacebadge.apphb.com/version/bwater.memento-explorer.svg)](https://marketplace.visualstudio.com/items?itemName=bwater.memento-explorer)

If you're an extension author for Visual Studio Code, chances are you've used `Memento`. These allow for the storage of local state, but unfortunately they can be very difficult to manage.

Enter Memento Explorer! Memento Explorer allows for viewing and modifying both global and workspace `Memento` for extensions.

## Requirements

To be able to modify an extension's `Memento`, the extension must export them, i.e. return them from its `activate()` method. In particular, the extension must export an object conforming to the [`IMementoExplorerExtension`](https://github.com/bwateratmsft/memento-explorer/blob/main/src/IMementoExplorerExtension.ts) interface. Please note, it is _not_ necessary to reference this extension as a Node.js package--you can simply copy the interface, or even export a simple object directly, as long as it conforms to the expected shape.

Please note that it is _highly_ recommended to export the `Memento` only for testing scenarios. For example, the interface could be exported only if some magic environment variable is set. Unconditionally exporting the `Memento` is a security risk.

## Usage

Upon satisfying the requirements above, simply open the command palette (<kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>) and run either "Memento Explorer: Open Global Memento..." or "Memento Explorer: Open Workspace Memento...", and follow the prompts. Once a `Memento` is opened, it will appear as a JSON file. You can edit this file, adding, modifying, or removing properties. When you save the file, all the `Memento` updates will be committed. Your extension should immediately see those updates. In the "Output" pane, under the "Memento Explorer" tab, the extension will show what changes have been made.

## Disclaimer

Use this extension at your own risk! Manipulating an extension's `Memento` could have a wide range of unintended side effects. Do not use this unless you know what you're doing.

## Privacy Policy

[https://xkcd.com/1998/](https://xkcd.com/1998/)
