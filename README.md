# resc-u

Adopt an animal. Rescue yourself.

[Resc-u online](https://resc-u.herokuapp.com)

## Description

resc-u is an app for connecting animals in need of adoption with an adopter.

## User Stories

There are 3 types of user: the adopter, the shelter, and the admin.

### Adopter

- An adopter's user flow will be as follows: They register, or log in if they have already an account. They see their profile page, where they can edit their adopter profile, their preferences, and also see their favorite animals, as well as the animals that are "a match" regarding her preferences. They can see a list of the animals awaiting adoption, sort them, filter them by their preferences, visit an animal's profile page, read the adoption information, and the shelter's contact information.

### Shelter

- A shelter can log in in Resc-u with the credentials created previously by us, the admin. They can add (create new) animals in the application, and see their full list of animals later on. They can also visit any adopter's profile pages.

### Admin

- The admin is us, the developers of the app, who can view, edit, and delete everything in the application.

<!--

 ## Backlog

List of other features outside of the MVPs scope

User profile:

- see my profile
- upload my profile picture
- see other users profile
- list of events created by the user
- list events the user is attending

 -->

## Pages:

| Route                                         | Description                                         | Persmissions   |
| --------------------------------------------- | --------------------------------------------------- | -------------- |
| GET "/"                                       | renders the homepage/login                          | All            |
| **/auth**                                     |                                                     |                |
| GET "/auth/signup"                            | renders the signup form for adopters, & admin       | Adopter, Admin |
| **/users**                                    |                                                     |                |
| GET "/users"                                  | shows shows a list of users                         | All            |
| GET "/users/:usertype/:username"              | shows profile page, different for each type of user | All            |
| GET "/users/:usertype/:username/profile-edit" | shows form to edit a profile                        | All            |
| GET "/:usertype/:username/delete-user"        | shows a form asking for confirmation                | Adopter, Admin |
| **/shelters**                                 |                                                     |                |
| GET "/shelters/animals"                       | shows list of animals of this shelter               | All            |
| **/animals**                                  |                                                     |                |
| GET "/animals"                                | shows a list of animals up for adoption             | All            |
| GET "/animals/:id"                            | shows an animals individual page                    | All            |
| GET "/animals/new"                            | shows form to add a new animal                      | Shelter, Admin |
| GET "/animals/edit/:id"                       | shows an animals individual page                    | All            |

## CRUD Routes:

| Route                                          | Description                                                                    | Persmissions   |
| ---------------------------------------------- | ------------------------------------------------------------------------------ | -------------- |
| **/auth**                                      |                                                                                |                |
| POST "/auth/login"                             | signs you in, and redirects to your profile page                               | All            |
| POST "/auth/signup"                            | creates a new user passes email, username, password. Redirects to edit profile | All            |
| **/users**                                     |                                                                                |                |
| POST "/:usertype/:username/delete-user"        | deletes a user                                                                 | Adopter, Admin |
| POST "/users/:usertype/:username/profile-edit" | edits an adopters' or shelters' profile info                                   | Adopter, Admin |
| **/animals**                                   |                                                                                |                |
| POST "/animals/new"                            | creates a new animal                                                           | Shelter, Admin |
| POST "/animals/edit/:id"                       | updates an existing animal                                                     | Shelter, Admin |
| GET "/animals/delete/:id"                      | deletes an animal                                                              | Shelter, Admin |

## Models

Adopter model  
Animal model  
Shelter model  
User model  

## Links

### Git

[Repository Link](https://github.com/monifasol/resc-u)

[Deploy Link](https://resc-u.herokuapp.com/)

### Slides

[Slides Link](https://docs.google.com/presentation/d/1fugJ6BppSvdLj82JuZZsS4kVEaKlIXDRt2z-r4MiwRQ/edit?usp=sharing)


## Developers

[Nico Mellon](https://github.com/nicomellon)
[Carlos Fung](https://github.com/BcnCarlos)
[Monica Saiz](https://github.com/monifasol)


