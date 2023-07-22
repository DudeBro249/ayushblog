---
title: "Using Docrunner to Build Better Documentation"
date: 2023-07-17T19:56:18-07:00
draft: false
description: 'Docrunner - A powerful command-line tool for testing code within markdown files, ensuring accurate and reliable documentation for developers.'
---

# Using Docrunner to Build Better Documentation

Docrunner is a powerful command line tool that provides a seamless solution for testing code
within markdown files, guaranteeing that your readers always have access to accurate
and working examples. It empowers developers to validate their documentation quickly,
boosting confidence in the reliability of their code.

In this blog post, we will explore the capabilities of Docrunner and delve into its
installation process, usage, and supported languages. Whether you're a technical writer,
open-source contributor, or software developer looking to improve your documentation,
Docrunner promises to be a valuable addition to your toolkit.

## Installation

Docrunner's installation process is extremely simple, a simple
command on most systems:

Shell (Mac, Linux):

```bash
$ curl -fsSL https://raw.githubusercontent.com/DudeBro249/docrunner/stable/installers/install.sh | sh
```

PowerShell (Windows):

```powershell
$ iwr -useb https://raw.githubusercontent.com/DudeBro249/docrunner/stable/installers/install.ps1 | iex
```

If none of these methods work, you can also install the latest `docrunner` binary from
[the releases](https://github.com/DudeBro249/docrunner/releases).
Make sure to add it to PATH so you can access it from anywhere


## Core Concepts

Now that we've installed Docrunner, let's see how to validate some documentation:

Create a file called `sample.md` and add the following:
~~~markdown
### Printing in Python:
```python
print('Hello world')
```
~~~

Now, we can test the python code in `sample.md` using docrunner.
Run the following command:
```text
$ docrunner run --language python --markdown-path ./sample.md
```

This will locate and run all python code in `sample.md`. Here's
the expected output:

{{< figure src="img/first_expected_output.png" >}}

You'll notice that running the command not only runs the Python code
within `sample.md`, but also creates a folder titled `docrunner-build-py`
within the root directory:

{{< figure src="img/new_directory_created.png" >}}

Docrunner needs to create runnable files before executing the code in
your markdown files. The build directory `docrunner-build-py` is where
these files are stored.

{{< admonition type="info" title="info" >}}

You can use the `--multi-file` flag with the `docrunner run` command to
make each snippet run in a different file.
Run `docrunner run --help` for all available options.

{{< /admonition >}}

## Configuring Options using TOML

Although docrunner allows you to pass in execution options directly
through the command line, you'll find that it is much easier to use
a configuration file, simplifying your final command.

Docrunner uses [TOML](https://toml.io/en/) for configuration.

Use the following command to initialize docrunner configuration for
your project:
```text
$ docrunner init
```

This creates a file called `docrunner.toml`, where you'll store all your custom
options. You'll also notice that docrunner populates the file with some
default settings:
```toml
[docrunner]
markdown_paths = ['README.md']
multi_file = false
recursive = false
```

### Available Settings

Let's take a look at some of the settings docrunner allows you to change:

#### language
- The language you want to run. string, **Optional**

Example:
```toml
[docrunner]
language = 'python'
```

#### markdown_paths
- An array to the to the markdown '.md' files you want to run code from.
You can also list directories. array, **Optional**

Example:
```toml
[docrunner]
markdown_paths = [
    'README.md',
    './documentation'
]
```
- We are pointing `docrunner` to both `README.md` and a folder called `documentation`
where our markdown files are stored. Check [recursive](#recursive) for more details
on listing directories in `markdown_paths`

#### directory_path
- The path to the directory where your code should be stored and run. You can
install and store dependencies in this directory. string, **Optional**

Example:
```toml
[docrunner]
directory_path = './custom_folder_with_dependencies'
```

#### multi_file
- Whether or not you want each code snippet, delimited by backticks(\```)
to be stored and run in multiple files. By default, 
this flag is false. boolean, **Optional**

Example:
```toml
[docrunner]
multi_file = true
```

#### startup_command
- The command you would like to run in order to run  your code. Put the command in
between quotes like "node main.js". string, **Optional**

Example:
```toml
[docrunner]
startup_command = 'npm run start'
```

#### recursive
- Whether you want docrunner to search through specified directories recursively
(look through sub-directories) when locating markdown files to parse.
boolean, **Optional**

Example:
```toml
[docrunner]
recursive = true
```

#### dotenv
- The path to your dotenv file (if one exists), which stores your environment 
variables and secrets. string, **Optional**. See more information about 
how to use environment variables
[here](https://docrunner-cli.web.app/docs/environment).

Example:
```toml
[docrunner]
dotenv = './.env'
```

### Configuration Example

Here's an example which uses all of the above options:
```toml
[docrunner]
language = 'python'
markdown_paths = [
    'README.md',
    './documentation'
]
directory_path = './custom_folder_with_dependencies'
multi_file = true
startup_command = 'npm run start'
recursive = true
dotenv = './.env'
```

You can now simply use the command `docrunner run` without
any extra options or flags, since all settings are stored in your
`docrunner.toml` file.


## Leveraging Comments in your Markdown

### Ignoring Snippets

Let's say you have a code snippet that you would like Docrunner to ignore
in your markdown, because, for example, the example code you wrote
connects to a SQL database that doesn't exist.

In cases like this, you can use the `<!--docrunner.ignore-->` comment
above the snippet to let Docrunner know that it should skip,
like so:

~~~markdown
<!--docrunner.ignore-->
```py
print('This code will not be written to a file or executed')
```
~~~

### List of Available Comments

- `<!--docrunner.ignore-->` - Causes docrunner to ignore the code snippet this is attached to
- `<!--docrunner.no_run-->` - Causes docrunner to write the code snippet to a file but not run it.
This can be useful if, for example, if the code snippet needs to be run manually afterward.
- `<!--docrunner.file_name = "file.py"-->` - If the [`multi_file`](#multi_file) flag is set to `True` when running docrunner,
docrunner will put this code snippet in a file named `file.py`

{{< admonition type="info" title="info" >}}

You can stack multiple docrunner comments on the same code snippet

{{< /admonition >}}

## CI/CD Integration

Running tests manually and on local machines is extremely important
and can be very useful when developing documentation. However,
performing a final documentation check before your markdown is pushed
to your live website or before your package is updated is vital.

To solve this, docrunner comes with its very own github action,
[setup-docrunner](https://github.com/DudeBro249/setup-docrunner).

Here is an example of a [workflow](https://docs.github.com/en/actions/using-workflows/about-workflows)
that you could create to use Docrunner in your CI/CD pipeline before your
documentation changes are published:

```yaml
name: Test Documentation with Docrunner

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test-docrunner-action:
    runs-on: ubuntu-20.04

    name: Test Documentation
    steps:
      - uses: actions/checkout@v2

      - name: Set Docrunner up on Workflow
        uses: DudeBro249/setup-docrunner

      - name: Use Docrunner
        run: docrunner run
```

## Acknowledgements

Thanks for reading!
If you liked Docrunner, consider starring (⭐) 
[the repository](https://github.com/DudeBro249/docrunner).

You can also check out the [documentation](https://docrunner-cli.web.app/) 
for Docrunner. It provides more details on Docrunner's commands
as well as other features such as using
[environment variables](https://docrunner-cli.web.app/docs/environment) 
in your code snippets.
