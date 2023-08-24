---
title: "Optic"
date: 2023-07-20T11:13:09-07:00
draft: false
description: An app assistant for the blind built with Flutter, Firebase, Image-to-Text, and Speech-to-Text technologies.
---

# Optic: An App Assistant for the Blind

Optic is a personal assistant app made for blind people. It is easy to use and helps
the blind 'see' their surroundings using a phone's camera and computer vision technology. 
Using the current version of our app, blind people can read books and signs, and can also 
search the web for any information they would like.

The app was built as part of a hackathon where I led my team to 3rd place out of 25
teams across Bangalore, India.

## Demo

{{< youtube BnM_UFQumf4 >}}

## Usage
To have the app read your surroundings out to you, simply point the phone in the general direction of the text, click the large button to activate the assistant, and say 'take a picture'. Within a few seconds, Optic will be reading out whatever is in front of you.
To search for information on the web that would normally involve looking at a screen with tiny letters, you can instead click the large button, say 'search for \<topic\>', and Optic will read out information about \<topic\> to you.

## User Interface
The UI is extremely simple. With the help of a trusted member, a blind person can log into Optic using his google account. From there, Optic will remember him to be linked to that device until they decide to sign out. Once the account is set up, the blind person is completely independent. There is only a single large button that can easily be pressed to activate the assistant, after which commands can be spoken by the user. Pressing the button activates the listener, so privacy is maintained when not speaking to the app.

<img src = "./screenshots/homescreen.png">

## Tech Stack

Let's take a look at the technology and some of the code used to build
this application.

{{< admonition type="caution" title="caution" >}}

Some of the functions and APIs used in this blog have since been changed. Optic was
developed in 2021; as such, many libraries have gone through breaking changes since
then.

This blog is **BEST USED** as a guide for how such an application can be structured,
and how the code *could* be written.

{{< /admonition >}}

### Authentication

The app uses Firebase Authentication and Riverpod to switch between screens based
on user authentication state.

Here is the `Wrapper` widget which is displayed from the root of the application.

#### Application Root

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();

  runApp(
    ProviderScope(
      child: RootWidget(),
    ),
  );
}

class RootWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: Wrapper(),
      navigatorKey: appNavigatorKey,
    );
  }
}
```

#### Wrapper Widget

```dart
class Wrapper extends ConsumerWidget {
  @override
  Widget build(BuildContext context, ScopedReader watch) {
    return watch(authStateProvider).when(
      data: (user) {
        if (user == null) {
          // User is not logged in
          return LoginPage();
        } else {
          // User is logged in
          return HomePage();
        }
      },
      loading: () => Scaffold(
        body: Center(
          child: CircularProgressIndicator(), // Loading Circle
        ),
      ),
      error: (error, stackTrace) => Text(
        '$error',
      ),
    );
  }
}
```

### Database

Google's Cloud Firestore Database was used for this project.
Here is a snippet from my `databaseService.dart` which provided
utility functions for interacting with Firestore to the rest of the
codebase:

```dart
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:optic/models/userData.dart';

final usersRef = FirebaseFirestore.instance.collection('users');

Future<void> addUser(User user) async {
  final documentSnapshot = await usersRef.doc(user.uid).get();
  if (!documentSnapshot.exists) {
    await usersRef.doc(user.uid).set(
      {
        'uid': user.uid,
        'photoURL': user.photoURL,
        'email': user.email,
        'displayName': user.displayName,
      },
    );
  }
}

Future<UserData> getUserData(String uid) async {
  final documentSnapshot = await usersRef.doc(uid).get();
  return UserData.fromMap(documentSnapshot.data()!);
}

Stream<UserData> userDataStream(String uid) {
  final docSnapshotStream = usersRef.doc(uid).snapshots();
  return docSnapshotStream.map(
    (ds) {
      return UserData.fromMap(
        ds.data()!,
      );
    },
  );
}

List<UserData> _userDataListFromQuerySnapshot(QuerySnapshot qs) {
  return qs.docs.map((ds) {
    return UserData.fromMap(
      ds.data()!,
    );
  }).toList();
}

Future<List<UserData>> listUsers() async {
  final usersQuerySnapshot = await usersRef.get();
  final userDataList = _userDataListFromQuerySnapshot(usersQuerySnapshot);
  return userDataList;
}
```

### Speech to Text

The app used the Flutter [`speech_to_text`](https://pub.dev/packages/speech_to_text)
package. Here is a snippet demonstrating how it was used in the app to enable
voice commands.

```dart {hl_lines=[20, 33, 40, 77, 78]}
if (!speechToTextService.isAvailable) {
    await speechToTextService.initialize(
      onStatus: (status) {
        print('log: listening status is: $status');
      },
      onError: (val) => print('onError: $val'),
    );
  }

if (!speechToTextService.isListening) {
  await speechToTextService.listen(
    onDevice: true,
    onResult: (result) async {
      streamController.add(result);
      if (result.finalResult) {
        // No more words are being spoken

        if (result.recognizedWords != '') {
          if (result.recognizedWords.substring(0, 10) == 'search for') {
            // User wants to search something on Wikipedia
            var res = await Wikidart.searchQuery(
                result.recognizedWords.substring(11) // Everything after 'search for'
            );
            var pageid = res?.results?.first.pageId;

            if (pageid != null) {
              var info = await Wikidart.summary(pageid);
              if (info != null) {
                print(info.title);
                print(info.description);
                print(info.extract);
                if (info.extract != null) {
                  // text to speech - recite the Wikipedia page's extract
                  await tts.speak(info.extract!); 
                }
              }
            }
          } else if (result.recognizedWords.substring(0, 14) ==
              'take a picture') {
            // User wants to perform Optical Character Recognition (OCR)

            // Move to the TakePicturePage
            appNavigatorKey.currentState?.push(TakePicturePage.route()); 

            final image = await cameraController.takePicture();

            final recognisedText = await textDetector.processImage(
              InputImage.fromFilePath(
                image.path,
              ),
            );

            await tts.speak('Reading text in image');
            await Future.delayed(
              Duration(
                seconds: 2,
              ),
            );

            if (recognisedText.text.trim().isEmpty) {
              await tts.speak('No text found in picture');
            }
            await tts.speak(recognisedText.text.toLowerCase());
            appNavigatorKey.currentState?.pop();
          } else if (result.recognizedWords.trim().toLowerCase() == 'stop') {
            // stop text-to-speech
            tts.stop();
          }
        }
      }
    },
  );
} else {
  await speechToTextService.stop();
}

// This code snippet is within a provider - when the provider is disposed,
// we want to stop the speech-to-text service (we want to stop listening)
ref.onDispose(() async {
  if (speechToTextService.isListening) {
    await speechToTextService.stop();
  }
  streamController.close();
});
```

{{< admonition type="info" title="info" >}}

Google's [ML Kit](https://developers.google.com/ml-kit) was used for all image text recognition.
The [google_ml_kit](https://pub.dev/packages/google_ml_kit) Flutter
package was used to interface with ML Kit's APIs

{{< /admonition >}}

## Conclusion and Source Code

In this blog, we talked about Optic, a basic app assistant designed to assist individuals
who are blind.

We delved into Optic's tech stack, which includes Firebase for authentication, Google's Cloud Firestore 
for the database, and the Flutter [`speech_to_text`](https://pub.dev/packages/speech_to_text) package
for voice commands. We also highlighted the use of Google's ML Kit for image text recognition.

The complete source code for Optic can be found
[here](https://github.com/Tisbhacks-Oct-2021-Team-Digitalizers/Optic) ⭐.

