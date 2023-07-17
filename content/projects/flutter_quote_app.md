---
title: "Learning the Basics of Flutter with a Quote Generator"
date: 2023-07-16T15:59:40-07:00
draft: true
---

# Flutter Quote App Tutorial

Hi everyone, today we will be learning the basics of the Flutter frontend framework
by building a quote generation app that interfaces with online APIs.

## Prerequisites

This tutorial will assume that you have Flutter and Android Studio installed.
1. Install [Flutter](https://docs.flutter.dev/get-started/install)
2. Install [Android Studio](https://developer.android.com/studio)

You must also have a new virtual device created.

## Setup

Create a new flutter project using:
```text
flutter create quoteapp
```

Start the virtual device by opening Android Studio > More Actions > Virtual Device Manager and
double-clicking on the emulator of your choice.

Move into the `quizapp` project directory and run the project using the following commands:
```text
cd quizapp
flutter run
```

This will run the project on the Android emulator.

Once the project has finished compiling, you should be able to see the following on your
emulator's screen:

<img src="./tutorial_img/Initial_App.png" alt="Initial App Screen" width="250"/>

## Implementation

<!--- Maybe create a separate section explaining how the directories in the project are laid out-->

Let's start.

Replace the content in your `lib/main.dart` file with the following:
```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quote Generator'),
        centerTitle: true,
        backgroundColor: Colors.green,
      ),
    );
  }
}
```

Let's take a few moments to go over the changes we made:
1. We removed the initial comments generated when the main.dart file was created
2. We deleted the `MyHomePage` StatefulWidget and replaced it with our own `HomePage`
widget

### What is a Widget?
Before we go further, let's get an understanding of what a widget is.
A **widget** is the basic building block of an application's view. They describe what
the screen should look like given their current configuration and data.

In our `main.dart` file, you'll see that we are using many widgets already. `Scaffold`, `AppBar`,
`Text`, and `HomePage` itself, are all widgets.

Widgets come in 2 main types: State**less** Widgets and State**ful** Widgets:
1. Stateless widgets *cannot* change and must have a fixed appearance. Example: `HomePage`
2. Stateful widgets *can* change in response to, for example, user input. Example: `Text`

The `build` method inside the definition of a widget lays out what the widget shows
when it is rendered on-screen.

You can find a list of all of Flutter's widgets [here](https://docs.flutter.dev/reference/widgets).
Familiarizing yourself with some common ones is useful if you wish to be productive with
Flutter in the future.

<!---TODO: CONST KEYWORD-->

### Designing our User Interface
Let's start building out the view for our application. Since our app is a simple
one, it does not require very many elements.

We begin by adding a `body` property to our `Scaffold`. Here's what the `build` method in our
`HomePage` widget should look like now:
```dart
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: const Text('Quote Generator'),
      centerTitle: true,
      backgroundColor: Colors.green,
    ),
    body: Center(
      child: Text('Placeholder Text'),
    ),
    floatingActionButton: FloatingActionButton.extended(
      backgroundColor: Colors.green,
      label: const Text('Generate Quote'),
      onPressed: () {},
    ),
    floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
  );
}
```

The `body` property controls what is shown under the `AppBar`. In our case, we
want to display text (which will later become our generated quote) in the middle
of the screen. So, we display a `Text` widget wrapped by a `Center`, which is a
widget that centers any `child` passed to it.

The `Scaffold` also allows us to pass in a floating action button, which is a button at the bottom of the screen
that "floats" above the rest of the content. For example, if there were a list of scrollable items on screen,
the floating action button would stay rooted in the same position as we scrolled to the bottom, above
the scrolling content. The `.extended` modifier in `FloatingActionButton.extended` allows us to
create a bigger button that can fit multiple words, instead of, for example, an icon <!---(like we can see here TODO).-->

The `onPressed` parameter that the floating action button takes allows us to pass in a function that will get
executed each time the button is pressed. In this function, we will write code to retrieve a quote from
the internet and display it on the screen.

At this point, we will need to add the http package, a collection of tools and functions that allow us
to fetch and manipulate data from HTTP sources, to our project.

We can do this using the commands:
```text
flutter pub add http
flutter pub get
```

This will add `http` to the `dependencies` section of our `pubspec.yaml` file:

<img src="./tutorial_img/pubspec_after_http.png" alt="" width="600"/>

**NOTE:** I strongly recommend that you stop and rerun the `flutter run` command in your
terminal so you don't face any unexpected issues with the app going forward. 
<!---(TODO: Fix wording of above instruction)-->

We can now use the `http` package in our `main.dart` file.
Import it at the top of the file like so:
```dart
import 'package:http/http.dart' as http;
```

<!---TODO: Add necessary subheadings-->

Next, create a folder called `models/` and within it, a create a file
called `quote.dart`. Add the following content to `quote.dart`:
```dart
import 'dart:convert' as convert;

class Quote {
  final String id;
  final String content;
  final String author;
  final List<String> tags;
  final String authorSlug;
  final int length;
  final DateTime dateAdded;
  final DateTime dateModified;

  Quote({
    required this.id,
    required this.content,
    required this.author,
    required this.tags,
    required this.authorSlug,
    required this.length,
    required this.dateAdded,
    required this.dateModified,
  });

  factory Quote.fromJson(String str) => Quote.fromMap(convert.jsonDecode(str));

  factory Quote.fromMap(Map<String, dynamic> json) => Quote(
        id: json["_id"],
        content: json["content"],
        author: json["author"],
        tags: List<String>.from(json["tags"].map((x) => x)),
        authorSlug: json["authorSlug"],
        length: json["length"],
        dateAdded: DateTime.parse(json["dateAdded"]),
        dateModified: DateTime.parse(json["dateModified"]),
      );
}
```
What we just did: We created a class called `Quote` which serves as a blueprint for all quotes we will fetch;
it serves as a predictable model telling us the shape of the data we've fetched. It not only makes all code
using quotes easier to write, but also prevents errors by not allowing us to access properties
on quote objects that do not exist, such as `quote['category']`.

Now that we've created our quote class, we can use it in `main.dart`, by importing
it at the top of the file like so:
```dart
import 'package:quoteapp_tutorial/models/quote.dart';
```

Now, create a variable of type `Quote` called `_quote` in the `_HomePageState` class:
```dart
Quote? _quote;
```
The `?` tells Flutter that this variable is allowed to be `null`, and prevents the compiler
from warning us.

Because we didn't give `_quote` a value, its value is `null` by default.

Next, create a function called `_fetchQuote` in the same class:
```dart
Future<void> _fetchQuote() async {
  final response = await http.get(
    Uri.parse(
      'https://api.quotable.io/random',
    ),
  );

  Quote fetchedQuoteObject = Quote.fromJson(response.body);

  setState(() {
    _quote = fetchedQuoteObject;
  });
}
```
What this code does:
1. Uses the `http` library's `get` function to fetch data from `https://api.quotable.io/random`
(if you visit the URL, you'll see that a random quote is generated and presented in JSON format)
2. Uses the method `setState`, which is available in all Stateful Widgets, to tell the Flutter
framework to rebuild the `HomePage` widget after performing an action that we pass in. In this
case, we've passed in the action:
```dart
_quote = fetchedQuoteObject;
```
**So, to summarize**: Flutter will re-render the `HomePage` widget after setting our `_quote` variable
to our newly fetched quote.


Now let's try using our `_quote` variable by plugging it into our centered `Text`
widget like so:
```dart
Scaffold(
  ...
  body: Center(
    child: Text(_quote?.content ?? 'No quotes yet...'), // Instead of 'Placeholder Text'
  ),
  ...
);
```

The `??` operator is called the `null` operator. It takes two values, on both sides of the operator,
and returns the left one if it is not null. If the value on the left is null, it
returns the value on the right. In our case, if the value of the `_quotes` variable is
`null`, which it will be initially, it will return the `String` `'No quotes yet...`.

We also want our `_fetchQuote` function to be executed every time our floating
action button is clicked. So, we pass it in to the `onPressed` parameter:
```dart
Scaffold(
  ...
  floatingActionButton: FloatingActionButton.extended(
    backgroundColor: Colors.green,
    label: const Text('Generate Quote'),
    onPressed: _fetchQuote, // Instead of the empty function () {}
  ),
);
```

<!---(TODO: Docusaurus with relevant **NOTE** colors)-->

**NOTE**: Make sure you pass in the `_fetchQuote` function **WITHOUT** the two brackets like so: `_fetchQuote()`.

Including the two parentheses will *execute* the function and pass in the function's return value to `onPressed`.
We want to pass in the function *itself* so that Flutter can execute it whenever the button is clicked.

## Demonstration
...And we're done!

Here's what the final `main.dart` file looks like:
```dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:quoteapp_tutorial/models/quote.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        useMaterial3: true,
      ),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  Quote? _quote;

  Future<void> _fetchQuote() async {
    final response = await http.get(
      Uri.parse(
        'https://api.quotable.io/random',
      ),
    );

    Quote fetchedQuoteObject = Quote.fromJson(response.body);

    setState(() {
      _quote = fetchedQuoteObject;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quote Generator'),
        centerTitle: true,
        backgroundColor: Colors.green,
      ),
      body: Center(
        child: Text(_quote?.content ?? 'No quotes yet...'),
      ),
      floatingActionButton: FloatingActionButton.extended(
        backgroundColor: Colors.green,
        label: const Text('Generate Quote'),
        onPressed: _fetchQuote,
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}
```

Here's what the app should look like:

<img src="./tutorial_img/Quote%20App%20Demo.gif" width="300" />

Thanks for reading!

## Acknowledgements
This app was made using the Flutter framework. You can learn
more about it and how to use it [here](https://flutter.dev)

[Here](https://docs.quotable.io/docs/api/ZG9jOjQ2NDA2-introduction) is a link to the source code for Quotable, the quotes
API we used in this tutorial. It was written by [Luke Peavey](https://github.com/lukePeavey). You can sponsor him
[here](https://github.com/sponsors/lukePeavey)


<!---Comments for Myself-->
<!---Maybe use Column widget so we can also display author's name-->
<!---Maybe include some instructions on how to create an Android
Virtual Device-->
