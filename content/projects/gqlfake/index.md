---
title: "Create Massive Amounts of Fake Data Using GraphQL Schemas"
date: 2023-08-24T01:02:59.279Z
draft: false
---

# Create Massive Amounts of Fake Data Using GraphQL Schemas

Have you ever found yourself in need of fake user profiles for testing your app? Perhaps you're racing 
against the clock in a hackathon, striving to develop a proof of concept without the necessary data for a demo.
Enter `gqlfake`.

`gqlfake` is your command-line companion, simplifying the creation of structured, synthetic data using
GraphQL schemas to define fields and data types.

## Installation

To install and use `gqlfake`, you must have [Node.js](https://nodejs.org/en) installed.

We can install `gqlfake` with `npm`:
```text
npm install gqlfake --location=global
```

This command will globally install `gqlfake` so you can access the CLI tool in the terminal
from any path.

Now that we have `gqlfake` installed, let's take a look at a quick example on how to use it.

## Generating Shaped Fake Data

Say we have a GraphQL schema file titled `schema.graphql` with the following content:
```graphql
type User {
  name: String
  avatar_url: String
}
```

The above schema defines a `User` type with specific attributes. Now, let's see what we'd have to
do if we wanted to generate 100 such fake `User` objects.

### Adding Directives to the Schema

To let `gqlfake` know what kind of data to generate for each field, we'll
have to use [directives](https://www.apollographql.com/docs/apollo-server/schema/directives/) and a little
[FakerJS](https://fakerjs.dev/) magic.

Edit `schema.graphql` to contain the following:

```graphql
type User {
  name: String @generate(code: "return faker.person.fullName()")
  avatar_url: String @generate(code: "return faker.internet.avatar()")
}
```

Here, we attach the `@generate` directive next to both fields and pass in the `code` argument.
The `code` argument is a string containing a call to any valid javascript. It
lets `gqlfake` know what kind of data to populate each field with (for example, you wouldn't want
the name field to be populated by an email, so we explicitly use the `code` argument to
specify what genre of data a specific field needs to have).

Now that we've setup our schema file correctly, we can use `gqlfake` to generate
fake but realistic data. The `gqlfake generate` command allows us to do this:

```text
gqlfake generate --schema-path ./schema.graphql --num-documents 100
```

This creates a JSON file containing 100 `User` objects. This file will be stored
in a newly created directory titled `datagen` (if you run this command twice,
the `datagen` directory won't be deleted, but the JSON file will be overwritten with
new fake data).

{{< admonition type="info" title="info" >}}

We can shorten `--schema-path` to `-s` and `--num-documents` to
`-n` when passing in command line arguments to `gqlfake`.

{{< /admonition >}}

Here is an example of what this file will look like:
```json
[
  {
    "name": "Beverly Block",
    "avatar_url": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/624.jpg"
  },
  {
    "name": "Wilson Zulauf",
    "avatar_url": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/684.jpg"
  },
  {
    "name": "Kirk Kris",
    "avatar_url": "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/866.jpg"
  },
  ...97 more
]
```

## Sharing Variables

You can also define and share code snippets across multiple fields and types. Let's take
a look at an example with our `User` type.

Modify your `schema.graphql` file to contain the following:
```graphql
type User {
  firstName: String 
    @generate(
      code: """
      firstNameOfUser = faker.person.firstName()
      return firstNameOfUser
      """
    )
  lastName: String 
    @generate(
      code: """
      lastNameOfUser = faker.person.lastName()
      return lastNameOfUser
      """
    )
  emailID: String
    @generate(
      code: """
      return faker.internet.email({
        firstName: firstNameOfUser,
        lastName: lastNameOfUser
      })
      """
    )
}
```

In the above example, we generate a fake `firstName` and a `lastName` for each
`User`. We also store this data in variables called `firstNameOfUser`
and `lastNameOfUser`. This allows us to use the generated first and last names
in the `emailID` where we generate a realistic email using the two pieces
of data.

{{< admonition type="caution" title="caution" >}}

If you want to use variables across multiple fields and types, **DO NOT**
use variable keywords `const`, `let`, or `var` when defining variables.
If you use these variable keywords, the variables you define will only
be usable within that specific code snippet.

{{< /admonition >}}


## Compiling Generated Data Into One File

There may be cases where you want to compile all the generated data into one file.
This is especially useful if you want to, for example, start up a fake API
with tools such as [`json-server`](https://www.npmjs.com/package/json-server).
We can compile data generated by the `gqlfake generate` command using
the `gqlfake compile` command.

Let's say our `schema.graphql` contains the following:
```graphql
type Book {
  id: ID!
  title: String!
  authorID: ID!
  publicationYear: Int!
}

type Movie {
  id: ID!
  title: String!
  directorID: ID!
  releaseYear: Int!
  genre: String!
}
```

We can now run the `gqlfake generate` command with the following options:

```text
gqlfake generate --schema-path ./schema.graphql --num-documents 2
```

We get two resulting JSON files, both in the `datagen` directory:

`Book.json`:
```json
[
  {
    "id": "0bbf3f82-794e-4f05-bf30-9f269683c5a1",
    "title": "odit sint veniam",
    "authorID": "085d8b32-b0f9-4883-aef7-f16233c6a235",
    "publicationYear": 1987
  },
  {
    "id": "b44d9e5e-17e4-43e6-ad66-8d4ad9b305aa",
    "title": "perspiciatis magnam ea",
    "authorID": "9b7a9732-6a42-45ef-9948-51632fafeb7a",
    "publicationYear": 1987
  }
]
```

`Movie.json`:
```json
[
  {
    "id": "640a0d20-3e37-477e-88f9-0ecbd22b8176",
    "title": "repudiandae id eius",
    "directorID": "3b67a142-29bb-4a5a-bdab-bbb6bae7d118",
    "releaseYear": 1987,
    "genre": "exercitationem repellat"
  },
  {
    "id": "c6711541-360f-470d-8b89-60f5a7ad8700",
    "title": "repudiandae placeat voluptates",
    "directorID": "f8643b5e-c464-4ebc-9848-29661418aa77",
    "releaseYear": 1987,
    "genre": "quibusdam accusamus"
  }
]
```

Let us now compile all the generated data into one file with
`gqlfake compile`. Run the following command:

```text
gqlfake compile --output-path ./data.json
```

Executing this command creates a `data.json` file that contains
the following:

```json {hl_lines=[2, 16]}
{
  "books": [
    {
      "id": "0bbf3f82-794e-4f05-bf30-9f269683c5a1",
      "title": "odit sint veniam",
      "authorID": "085d8b32-b0f9-4883-aef7-f16233c6a235",
      "publicationYear": 1987
    },
    {
      "id": "b44d9e5e-17e4-43e6-ad66-8d4ad9b305aa",
      "title": "perspiciatis magnam ea",
      "authorID": "9b7a9732-6a42-45ef-9948-51632fafeb7a",
      "publicationYear": 1987
    }
  ],
  "movies": [
    {
      "id": "640a0d20-3e37-477e-88f9-0ecbd22b8176",
      "title": "repudiandae id eius",
      "directorID": "3b67a142-29bb-4a5a-bdab-bbb6bae7d118",
      "releaseYear": 1987,
      "genre": "exercitationem repellat"
    },
    {
      "id": "c6711541-360f-470d-8b89-60f5a7ad8700",
      "title": "repudiandae placeat voluptates",
      "directorID": "f8643b5e-c464-4ebc-9848-29661418aa77",
      "releaseYear": 1987,
      "genre": "quibusdam accusamus"
    }
  ]
}
```

We can now use `json-server` to serve up a mock API using `data.json`.

Install `json-server` with:
```text
npm install json-server --location=global
```

We can start the server with:
```text
json-server ./data.json --watch
```

This mock API can now be used by, for example, your frontend code to
display the generated data.


## Executing Initial Code per Type

There may be cases where you want to execute some initial code in
each `type` before the data for each field is generated.

Here's an example where we want the `id` of each `User` object
to be incremented every time one is generated.

`schema.graphql`:
```graphql
type User 
  @init(
    code: """
    count = 0
    """
  ) {
  id: Int
    @generate(
      code: """
      count += 1
      return count
      """
    )
  fullName: String @generate(code: "return faker.person.fullName()")
}
```

The above example uses the `init` directive on the `User` type to initialize the variable
`count` to 0. (Notice how we don't use any variable initialization keywords
like `const`, `let`, or `var` because we want the `count` variable to be accessible
in the different fields).

After this, every time an `id` is generated, we run code to increment the
count by 1, and return its value.

When `gqlfake generate` is run with the appropriate options, the below
JSON file is generated:

```json
[
  {
    "id": 1,
    "fullName": "Elizabeth Ankunding"
  },
  {
    "id": 2,
    "fullName": "Ashley Stehr"
  },
  {
    "id": 3,
    "fullName": "Rosalie Kessler"
  }
  ...
]
```

As you can see, the `id` field is incremented on the
generation of each `User` object.


## Using External Dependencies and Libraries

You may also want to use external dependencies in the code you write
within `@generate` directives. In that case, you can point
`gqlfake` to a Javascript file which exports your dependencies.

To do this, we first need to create our Javascript file which
will import our necessary dependencies and export them at the bottom
of the file.

`myDependencies.js`:
```javascript
const axios = require('axios')

// Export the required dependencies
module.exports = {
  axios: axios
}
```

Now that we've exported our dependencies, we can use them in our
GraphQL schema's `@generate` directives:

```graphql
type User {
  fullName: String @generate(code: "return faker.person.fullName()")
  favoriteQuote: String
    @generate(
      code: """
      const response = await axios.get('https://api.quotable.io/random')
      return response.data.content
      """
    )
}
```

In the above schema, we use axios to get a random quote and set it as
the `favoriteQuote` for a `User`.

`gqlfake` supports allows you to use top-level `await`, so you don't
have to create an `async` function to use the `await` keyword.

To generate our data, we use the `gqlfake generate` command with
the `--dependency-script` option:
```text
gqlfake generate -s ./schema.graphql -n 3 --dependency-script ./myDependencies.js
```

`gqlfake` imports the dependencies exported by the file pointed to by
`--dependency-script` so they can be used in your GraphQL schema.

The above command generates a file called `User.json` with the following
content:
```json
[
  {
    "fullName": "Jimmie Gleason",
    "favoriteQuote": "The highest stage in moral culture at which we can arrive is when we recognize that we ought to control our thoughts."
  },
  {
    "fullName": "Jody Rogahn II",
    "favoriteQuote": "If you accept the expectations of others, especially negative ones, then you never will change the outcome."
  },
  {
    "fullName": "Dr. Jody Thompson",
    "favoriteQuote": "I love wisdom. And you can never be great at anything unless you love it. Not be in love with it, but love the thing, admire the thing. And it seems that if you love the thing, and you don't just want to possess it, it will find you."
  }
]
```

The `favoriteQuote` property for each `User` object was fetched using
`axios` from [api.quotable.io](https://api.quotable.io).

## Exporting Data to Cloud Databases

Exporting data generated by `gqlfake` to cloud databases can be useful if
you are trying to mock features that require web services (CRON jobs,
Cloud Functions, etc.).

### Supported Cloud Databases
- [Google Cloud Firestore](#google-cloud-firestore)


### Google Cloud Firestore

Exporting to Cloud Firestore is as easy as running a single command:

```text
gqlfake export-firestore --keypath ./serviceAccountKey.json
```

{{< admonition type="info" title="info" >}}

You must have already created a Google or Firebase project with
Cloud Firestore enabled prior to running this command.

{{< /admonition >}}

Note that `--keypath` is a required option that can be abbreviated to `-k`.
It points `gqlfake` to your service account key file. A service account key
is a form of credential that allows access to your web resources from
any environment. Google allows you to generate such keys for your
Google Cloud Projects. Learn more about service account keys and how to generate
them [here](https://firebase.google.com/docs/admin/setup#set-up-project-and-service-account).

## Conclusion

`gqlfake` is a powerful tool for generating massive amounts of fake data using GraphQL schemas.
Whether you're in a hackathon crunch or need synthetic data for testing and development,
`gqlfake` simplifies the process. By combining GraphQL schemas, directives, and the flexibility
of JavaScript code snippets, you can generate structured and realistic data.
