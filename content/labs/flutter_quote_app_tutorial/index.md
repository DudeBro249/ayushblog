---
title: "Learning the Basics of Flutter by Building a Quote Generator Application"
date: 2023-07-16T15:59:40-07:00
draft: false
description: This tutorial goes through the core Flutter skills necessary to start building out real-world applications that are able to interface with data from the Internet.
---

# Flutter Quote App Tutorial

In this tutorial, we will explore the fundamentals of the Flutter frontend framework
by building a quote generation app that interacts with online APIs. The purpose 
of this blog is to guide you through the step-by-step process of creating a simple 
yet practical Flutter application. By the end of this tutorial, you'll have a 
solid understanding of how to work with widgets, fetch data from APIs, and create a 
functional user interface for your app.

## Prerequisites

This tutorial will assume that you have Flutter and Android Studio installed.
1. Install [Flutter](https://docs.flutter.dev/get-started/install)
2. Install [Android Studio](https://developer.android.com/studio)

You will also need a code/text editor to follow along with the lesson.
For this tutorial, I will be using
[Visual Studio Code](https://code.visualstudio.com/Download) as
my code editor;
however, feel free to use your editor of choice.

## Creating the Android Virtual Device (Emulator)

To make sure we can see our app on an Android Device, we will need
to create an emulator (essentially a virtual phone that can run
on our computers).
You can create one by following the below instructions:

1. Open Android Studio, click on More Actions, and select Virtual Device Manager

{{<figure src="./img/androidstudiostep1.png" height="450" >}}

This will open the Device Manager window.

2. In the Device Manager window, click on the blue hyperlink titled
"Create virtual device".

{{<figure src="./img/androidstudiostep2.png" height="450" >}}

This will open another window titled "Virtual Device Configuration"

3. Select any device from the "Phone" category and click "Next".
This will be the emulator that is rendered on your screen.

{{<figure src="./img/androidstudiostep3.png" height="450" >}}

For the purposes of this tutorial, I will be selecting a Nexus 6
to use as my emulator.

4. You will then be prompted to select a system image.
An Android system image comes with the Android Operating System (OS),
device drivers, and another software necessary for Android
Studio to run your chosen emulator.
If you do not have any system images already installed, you
will need to install one by clicking on the download icon
next to the name of a system image.

{{<figure src="./img/androidstudiostep4.png" height="450" >}}

In this tutorial, I've chosen to use system image "S", but
any system image above "S" should also work without issue.
After selecting a system image, click "Next".

5. If you choose to, you can change the name of the virtual device
to make it more memorable in case you decide to create multiple.
After making any changes to the virtual device name, click "Finish".

{{<figure src="./img/androidstudiostep5.png" height="450" >}}

6. Congrats! You've created your first virtual device, and we can now
begin developing our Flutter project. You should be able to see
your newly created Android emulator in the "Device Manager"
window:

{{<figure src="./img/androidstudiostep6.png" height="450" >}}

Start the emulator by clicking on the Play icon.

## Starting our Flutter Project

Create a new flutter project using:
```text
flutter create quoteapp
```

Move into the `quoteapp` project directory and run the project using the following commands:
```text
cd quoteapp
flutter run
```

This will run the project on the Android emulator.

Once the project has finished compiling, you should be able to see the following on your
emulator's screen:

{{<figure src="./img/Initial_App.png" alt="Initial App Screen" width="250" >}}


## Implementation

### Directory Structure and Important Files

When you ran `flutter create quoteapp`, you created a `quoteapp` directory
with the following directories within it:

{{<figure src="./img/directorystructure.png" alt="Image of Directory Structure" width="175" >}}

The `lib` folder is where all the source code for our app lies. When a project is first
created with the `flutter create` command, Flutter generates a `main.dart` file
in the `lib` folder, which contains the initial code for the 
app that counted button presses which we saw above. This file
will be the root of our quote application.

Another important file we will use later is the `pubspec.yaml` file. This stores
the dependencies and external libraries we will use in our application.

Replace the content in your `lib/main.dart` file with the following:
```dart
import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp()); // Runs our application
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

      // Tells Flutter that `QuoteHomePage` is our home page
      home: const QuoteHomePage(), 
    );
  }
}

// `QuoteHomePage` is a `StatefulWidget`. We'll learn what this means soon.
class QuoteHomePage extends StatefulWidget {
  const QuoteHomePage({super.key});

  @override
  State<QuoteHomePage> createState() => _QuoteHomePageState();
}

class _QuoteHomePageState extends State<QuoteHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar( // Creates a navigation bar at the top of the phone screen
        title: const Text('Quote Generator'),
        centerTitle: true, // Puts the title in the center of the AppBar
        backgroundColor: Colors.green, // Makes the AppBar green
      ),
    );
  }
}
```

Let's take a few moments to go over the changes we made to the initial
code that was already present in `main.dart`:
1. We removed the initial comments generated when the main.dart file was created
2. We deleted the `MyHomePage` StatefulWidget and replaced it with our own `QuoteHomePage`
**widget**.

### What is a Widget?
Before we go further, let's get an understanding of what a widget is.
A **widget** is the basic building block of an application's view. They describe what
the screen should look like given their current configuration and data.

In our `main.dart` file, you'll see that we are using many widgets already. `Scaffold`, `AppBar`,
`Text`, and `QuoteHomePage` itself, are all widgets.

Widgets come in 2 main types: State**less** Widgets and State**ful** Widgets:
1. Stateless widgets do **not** contain any internal properties or data that changes
once the user interface is built. Example: `Text`
2. Stateful widgets **can** contain internal data that may change in response to, for example,
user input. Example: `QuoteHomePage`

This is **not** to say that Stateless widgets need to
have unchanging appearances after the user interface has been rendered. 
We can pass data into Stateless widgets and change the data in 
order to change the appearance of the widget. For example, we 
can pass a `String` variable into a `Text` widget and later change the 
value of the variable to change what the `Text` widget displays.
We will be doing this later to change the randomly generated quote 
that is displayed on-screen.

The `build` method inside the definition of a widget lays out what the widget shows
when it is rendered on-screen.

You can find a list of all of Flutter's widgets [here](https://docs.flutter.dev/reference/widgets).
Familiarizing yourself with some common ones is useful if you wish to be productive with
Flutter in the future.

### Designing our User Interface
Let's start building out the view for our application. Since our app is a simple
one, it does not require very many elements.

We begin by adding a `body` property to our `Scaffold`. Here's what the `build` method in our
`QuoteHomePage` widget should look like now:
```dart
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: const Text('Quote Generator'),
      centerTitle: true,
      backgroundColor: Colors.green,
    ),
    body: Center( // A widget that centers its child
      child: Text('Placeholder Text'), // This Text is centered
    ),
    // FloatingActionButton.extended creates a larger button than
    // merely using FloatingActionButton
    floatingActionButton: FloatingActionButton.extended(
      backgroundColor: Colors.green,
      label: const Text('Generate Quote'),
      onPressed: () {},
    ),
    // Places the floating action button at the botton of the screen,
    // centered along the row axis
    floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
  );
}
```
<!--TODO: Screenshot if necessary-->
The `body` property controls what is shown under the `AppBar`. In our case, we
want to display text (which will later become our generated quote) in the middle
of the screen. So, we display a `Text` widget wrapped by a `Center`, which is a
widget that centers any `child` passed to it.

The `Scaffold` also allows us to pass in a floating action button, which is a button at the bottom of the screen
that "floats" above the rest of the content. For example, if there were a list of scrollable items on screen,
the floating action button would stay rooted in the same position as we scrolled to the bottom, above
the scrolling content. The `.extended` modifier in `FloatingActionButton.extended` allows us to
create a bigger button that can fit multiple words.

The `onPressed` parameter that the floating action button takes allows us to pass in a function that will get
executed each time the button is pressed. In this function, we will write code to retrieve a quote from
the internet and display it on the screen.

Here is what the app should look like now:

{{<figure src="./img/appwithplaceholdertext.png" alt="Image of App with Placeholder text" width="300" >}}

### Connecting with Online APIs

At this point, we will need to add the `http` package, a collection of tools and functions that allow us
to fetch and manipulate data from HTTP sources, to our project.

We can do this using the commands:
```text
flutter pub add http
flutter pub get
```

This will add `http` to the `dependencies` section of our `pubspec.yaml` file:

{{<figure src="./img/pubspec_after_http.png" alt="" width="600" >}}


{{< admonition type="info" title="note" >}}

I strongly recommend that you pause here and 
rerun the `flutter run` command in your terminal so you don't face any
unexpected issues that result from adding packages while the
app is running.

{{< /admonition >}}


We can now use the `http` package in our `main.dart` file.
Import it at the top of the file like so:
```dart
import 'package:http/http.dart' as http;
```

Next, create a folder called `models/` and within it, a create a file
called `quote.dart`. Add the following content to `quote.dart`:
```dart
import 'dart:convert' as convert;

class Quote {

  // Listing the properties that one `Quote` object has
  // We won't be using all of them in this tutorial
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

  // Allows us to convert the quote data we receive from the
  // internet into a `Quote` object. We will use this function
  // in `main.dart`
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
**What we just did:** We created a class called `Quote` which serves as a blueprint for all quotes we will fetch;
it serves as a predictable model telling us the shape of the data we've fetched. It not only makes all code
using quotes easier to write, but also prevents errors by not allowing us to access properties
on quote objects that do not exist, such as `quote['category']`.

Now that we've created our quote class, we can use it in `main.dart`, by importing
it at the top of the file like so:
```dart
import 'package:quoteapp_tutorial/models/quote.dart';
```

Now, create a variable of type `Quote` called `_quote` in the `_QuoteHomePageState` class:
```dart
Quote? _quote;
```
The `?` tells Flutter that this variable is allowed to be `null`, and prevents the compiler
from warning us.

Because we didn't give `_quote` a value, its value is `null` by default.

Next, create a function called `_fetchQuote` in the same class:
```dart
Future<void> _fetchQuote() async {

  // Request data from the quotes API
  final response = await http.get(
    Uri.parse(
      'https://api.quotable.io/random',
    ),
  );

  // Convert quote data from the API into a `Quote` object
  Quote fetchedQuoteObject = Quote.fromJson(response.body);

  // Tells Flutter to rebuild the widget after setting our
  // `_quote` variable to the fetched quote object
  setState(() {
    _quote = fetchedQuoteObject;
  });_
}
```

What this code does:
1. Uses the `http` library's `get` function to fetch data from `https://api.quotable.io/random`
(if you visit the URL, you'll see that a random quote is generated and presented in JSON format)
1. Uses the method `setState`, which is available in all Stateful Widgets, to tell the Flutter
framework to rebuild the `QuoteHomePage` widget after performing an action that we pass in. In this
case, we've passed in the action:
```dart
_quote = fetchedQuoteObject;
```
**So, to summarize:** Flutter will re-render the `QuoteHomePage` widget after setting our `_quote` variable
to our newly fetched quote.


Now let's try using our `_quote` variable by plugging it into our centered `Text`
widget like so:
```dart
Scaffold(
  ...
  body: Center(
    // Instead of 'Placeholder Text'
    child: Text(_quote?.content ?? 'No quotes yet...'), 
  ),
  ...
);
```

The `??` operator is called the `null` operator. It takes two values, on both sides of the operator,
and returns the left one if it is not null. If the value on the left is null, it
returns the value on the right. In our case, if the value of the `_quotes` variable is
`null`, which it will be initially, it will return the text "No quotes yet...".

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

{{< admonition type="info" title="note" >}}

Make sure you pass in the `_fetchQuote` function like so, **WITHOUT** the two parentheses
at the end of the function name: `onPressed: _fetchQuote`

Including the two parentheses will execute the function and pass in the function's return value to `onPressed`.
We want to pass in the function itself so that Flutter can execute it whenever the button is clicked.

{{< /admonition >}}

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
      home: const QuoteHomePage(),
    );
  }
}

class QuoteHomePage extends StatefulWidget {
  const QuoteHomePage({super.key});

  @override
  State<QuoteHomePage> createState() => _QuoteHomePageState();
}

class _QuoteHomePageState extends State<QuoteHomePage> {
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

Note that you'll need the `models/quote.dart` file for this code to work,
since we import it at the top of `main.dart`.

Here's what the app should look like:

{{<figure src="./img/quote_app_demo.gif" alt="" width="300" >}}

As you can see, a new quote is generated and displayed
every time the "Generate Quote" button is pressed.
(the button temporarily splashes to a darker shade of green when pressed
as can be seen in the GIF).

## Conclusion

In this tutorial, we learned the basics of Flutter by building a simple yet practical quote generation app.
Throughout the process, we explored fundamental concepts such as working with widgets, fetching data
from online APIs, and creating a functional user interface. By using the http package, we connected
to the Quotable API to retrieve random quotes and displayed them on the app's screen. Additionally,
we introduced the concepts of stateless and stateful widgets, allowing us to update the user interface
dynamically in response to user interactions. With this foundational knowledge, you are now equipped
to explore and create more complex Flutter applications, leveraging the vast array of widgets and 
libraries available in the Flutter ecosystem. Thanks for reading, and happy coding!

## Acknowledgements
This app was made using the [Flutter](https://flutter.dev) framework. Check the
[documentation](https://docs.flutter.dev/) to learn
more about it and how to use it .

We used [Quotable](https://docs.quotable.io/docs/api/ZG9jOjQ2NDA2-introduction) as 
the quotes API for this tutorial. This API
was written by [Luke Peavey](https://github.com/lukePeavey); you can sponsor him
[here](https://github.com/sponsors/lukePeavey). 💖

